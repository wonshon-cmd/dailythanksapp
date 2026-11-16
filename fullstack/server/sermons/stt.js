import fs from 'node:fs';
import path from 'node:path';
import { SERMON_KEYWORDS } from './keywords.js';

/**
 * Speech-to-text adapters. All return { text, provider }.
 * Compare providers on the same real sermon recordings before choosing one for Korean.
 *
 *  - mock:   returns a fixed transcript (local development, tests, demos without API keys)
 *  - openai: OpenAI audio transcription (Whisper). Max ~25 MB per request -> chunk long sermons first.
 *  - clova:  NAVER CLOVA Speech long-sentence API (strong for Korean, supports keyword boosting).
 *  - rtzr:   RETURN ZERO (VITO) batch API (strong for Korean, supports keywords).
 *
 * openai is implemented end-to-end; clova and rtzr are left as documented stubs to finish once an account exists.
 */
export async function transcribe({ filePath, mimeType, language = 'ko' }, cfg) {
  const provider = cfg.provider;
  if (provider === 'mock') return { provider, text: MOCK_TRANSCRIPT };
  if (provider === 'openai') return { provider, text: await openaiTranscribe(filePath, mimeType, language, cfg) };
  if (provider === 'clova') throw notReady('clova', 'POST {invokeUrl}/recognizer/upload (multipart: media + params{language:"ko-KR", completion:"sync", boostings:[{words}]}) with header X-CLOVASPEECH-API-KEY');
  if (provider === 'rtzr') throw notReady('rtzr', 'POST https://openapi.vito.ai/v1/authenticate -> token; POST /v1/transcribe (multipart: file + config{keywords}); poll GET /v1/transcribe/{id}');
  throw new Error(`Unknown STT provider: ${provider}`);
}

function notReady(name, how) {
  const err = new Error(`STT provider "${name}" is not wired up yet. Implement: ${how}`);
  err.code = 'stt_not_configured';
  return err;
}

async function openaiTranscribe(filePath, mimeType, language, cfg) {
  if (!cfg.openaiKey) { const e = new Error('OPENAI_API_KEY is not set'); e.code = 'stt_not_configured'; throw e; }
  const form = new FormData();
  form.append('file', new Blob([fs.readFileSync(filePath)], { type: mimeType || 'audio/mpeg' }), path.basename(filePath));
  form.append('model', 'whisper-1');
  form.append('language', language);
  // Whisper uses the prompt as spelling context: list the proper nouns it tends to miss.
  form.append('prompt', SERMON_KEYWORDS.slice(0, 120).join(', '));
  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST', headers: { Authorization: `Bearer ${cfg.openaiKey}` }, body: form
  });
  if (!res.ok) throw new Error(`OpenAI transcription failed: ${res.status} ${await res.text()}`);
  return (await res.json()).text;
}

export const MOCK_TRANSCRIPT = `오늘 함께 나눌 말씀은 요한복음 삼 장 일 절부터 십오 절까지입니다.
밤에 예수님을 찾아온 니고데모는 존경받는 바리새인이었습니다. 그런데 예수님은 그에게 사람이 거듭나지 아니하면 하나님의 나라를 볼 수 없다고 말씀하십니다.
첫째, 거듭남은 우리의 노력이 아니라 성령의 일하심입니다. 바람이 임의로 불매 그 소리를 들어도 어디서 오는지 알지 못하는 것처럼 성령으로 난 사람도 그러합니다.
둘째, 거듭남은 십자가를 바라봄으로 시작됩니다. 민수기 이십일 장에서 모세가 놋뱀을 든 것처럼 인자도 들려야 하리니 그를 믿는 자마다 영생을 얻게 하려 하심입니다.
셋째, 거듭난 사람은 빛 가운데로 나아옵니다. 니고데모는 밤에 왔지만 나중에는 예수님의 장례를 위해 공개적으로 나아왔습니다.
이번 한 주, 우리의 신앙이 밤에만 머무르지 않고 일상의 빛 가운데서 드러나기를 바랍니다. 함께 기도하겠습니다.`;
