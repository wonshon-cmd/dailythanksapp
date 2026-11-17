import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { sermonKeywords } from './keywords.js';

/**
 * Speech-to-text for sermons in Korean, English and Spanish. All adapters return { text, provider }.
 *
 * Which engine (STT_PROVIDER=auto, the default when keys exist):
 *   ko → NAVER CLOVA Speech (best on Korean sermons, keyword boosting) → RETURN ZERO → OpenAI
 *   en, es → OpenAI (gpt-4o-transcribe by default; CLOVA has no Spanish)
 * Force one with STT_PROVIDER=clova|rtzr|openai, or mock for development and tests.
 *
 * Tuned for sermons:
 *   - audio is cleaned first (ffmpeg): mono 16 kHz, rumble cut, volume evened out — preachers walk away from
 *     the microphone, and the room echoes;
 *   - Bible books, names, places and church words in that language are boosted / given as spelling context;
 *   - long sermons are cut into 10-minute pieces; each piece gets the end of the previous one as context;
 *   - repeated filler lines that engines invent during silence (e.g. "감사합니다" ×20) are removed.
 */
export async function transcribe({ filePath, mimeType, language = 'ko', context = '' }, cfg) {
  const lang = ['ko', 'en', 'es'].includes(language) ? language : 'ko';
  const provider = pickProvider(lang, cfg);
  if (provider === 'mock') return { provider, text: MOCK_TRANSCRIPT };
  const clean = await prepareAudio(filePath, cfg);
  try {
    let text;
    const ctx = String(context || '').slice(0, 600);
    if (provider === 'clova') text = await clovaTranscribe(clean.file, lang, cfg, ctx);
    else if (provider === 'rtzr') text = await rtzrTranscribe(clean.file, lang, cfg, ctx);
    else if (provider === 'openai') text = await openaiTranscribe(clean, mimeType, lang, cfg, ctx);
    else throw new Error(`Unknown STT provider: ${provider}`);
    return { provider, text: tidyTranscript(text) };
  } finally { clean.cleanup(); }
}

export function pickProvider(lang, cfg) {
  const p = cfg.provider || 'auto';
  if (p !== 'auto') return p;
  const has = { clova: !!(cfg.clovaInvokeUrl && cfg.clovaSecret), rtzr: !!(cfg.rtzrClientId && cfg.rtzrClientSecret), openai: !!cfg.openaiKey };
  if (lang === 'ko') { if (has.clova) return 'clova'; if (has.rtzr) return 'rtzr'; }
  if (has.openai) return 'openai';
  if (lang === 'en' && has.clova) return 'clova';
  throw notConfigured('No speech-to-text engine is configured for this language. Set CLOVA_SPEECH_* (Korean), RTZR_* (Korean) or OPENAI_API_KEY.');
}

function notConfigured(msg) { const e = new Error(msg); e.code = 'stt_not_configured'; return e; }

/* ---------- audio clean-up and splitting (ffmpeg) ---------- */
const run = (bin, args) => new Promise((res, rej) => execFile(bin, args, { timeout: 20 * 60 * 1000, maxBuffer: 16 * 1024 * 1024 }, (err, out, errOut) => err ? rej(Object.assign(err, { stderr: errOut })) : res(out)));
let ffmpegOk = null;
async function hasFfmpeg(bin) { if (ffmpegOk !== null) return ffmpegOk; try { await run(bin, ['-version']); ffmpegOk = true; } catch { ffmpegOk = false; } return ffmpegOk; }

// Speech filter for a church room: cut rumble under 80 Hz and hiss over 8 kHz, then even out loud and quiet parts.
export const SPEECH_FILTER = 'highpass=f=80,lowpass=f=8000,dynaudnorm=f=250:g=15';
const SEGMENT_SECONDS = 600;

async function prepareAudio(filePath, cfg) {
  const bin = cfg.ffmpegPath || 'ffmpeg';
  if (!(await hasFfmpeg(bin))) return { file: filePath, pieces: [filePath], cleaned: false, cleanup() {} };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sermon-'));
  const cleanup = () => fs.rmSync(dir, { recursive: true, force: true });
  try {
    const file = path.join(dir, 'clean.mp3');
    await run(bin, ['-hide_banner', '-loglevel', 'error', '-y', '-i', filePath, '-vn', '-ac', '1', '-ar', '16000', '-af', SPEECH_FILTER, '-c:a', 'libmp3lame', '-b:a', '48k', file]);
    await run(bin, ['-hide_banner', '-loglevel', 'error', '-y', '-i', file, '-f', 'segment', '-segment_time', String(SEGMENT_SECONDS), '-c', 'copy', path.join(dir, 'part%03d.mp3')]);
    const pieces = fs.readdirSync(dir).filter(f => f.startsWith('part')).sort().map(f => path.join(dir, f));
    return { file, pieces: pieces.length ? pieces : [file], cleaned: true, cleanup };
  } catch (e) { cleanup(); return { file: filePath, pieces: [filePath], cleaned: false, cleanup() {} }; }
}

/* ---------- OpenAI (en, es; ko fallback) ---------- */
const PROMPT_LEAD = {
  ko: '교회 설교 녹음입니다. 성경 책 이름과 장절을 정확히 적어 주세요. 예: 요한복음 3장 16절.',
  en: 'This is a church sermon. Spell Bible books, names and references correctly, e.g. John 3:16.',
  es: 'Es un sermón en una iglesia. Escribe bien los libros, nombres y citas de la Biblia, p. ej. Juan 3:16.'
};
async function openaiTranscribe(clean, mimeType, lang, cfg, ctx = '') {
  if (!cfg.openaiKey) throw notConfigured('OPENAI_API_KEY is not set');
  const MAX = 25 * 1024 * 1024;
  if (!clean.cleaned && fs.statSync(clean.file).size > MAX) { const e = new Error('Recording is over 25 MB; install ffmpeg (FFMPEG_PATH) so it can be split.'); e.code = 'audio_too_large'; throw e; }
  const words = sermonKeywords(lang).slice(0, 120).join(', ');
  let out = '';
  for (const piece of clean.pieces) {
    const form = new FormData();
    form.append('file', new Blob([fs.readFileSync(piece)], { type: clean.cleaned ? 'audio/mpeg' : (mimeType || 'audio/mpeg') }), path.basename(piece));
    form.append('model', cfg.openaiModel || 'gpt-4o-transcribe');
    form.append('language', lang);
    // spelling context + the end of the previous piece, so sentences carry across the cut
    form.append('prompt', `${PROMPT_LEAD[lang]}${ctx ? ` ${ctx}.` : ''} ${words}${out ? `\n${out.slice(-300)}` : ''}`);
    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', { method: 'POST', headers: { Authorization: `Bearer ${cfg.openaiKey}` }, body: form });
    if (!res.ok) throw new Error(`OpenAI transcription failed: ${res.status} ${await res.text()}`);
    out += (out ? '\n' : '') + String((await res.json()).text || '').trim();
  }
  return out;
}

/* ---------- NAVER CLOVA Speech, long-sentence recognition (ko; en) ---------- */
async function clovaTranscribe(file, lang, cfg, ctx = '') {
  if (!cfg.clovaInvokeUrl || !cfg.clovaSecret) throw notConfigured('CLOVA_SPEECH_INVOKE_URL / CLOVA_SPEECH_SECRET are not set');
  const params = {
    language: lang === 'en' ? 'en-US' : 'ko-KR', completion: 'sync', fullText: true, wordAlignment: false,
    diarization: { enable: false },   // one preacher
    boostings: [{ words: [...contextWords(ctx), ...sermonKeywords(lang)].slice(0, 1000).join(',') }],
    forbiddens: ''
  };
  const form = new FormData();
  form.append('media', new Blob([fs.readFileSync(file)]), path.basename(file));
  form.append('params', new Blob([JSON.stringify(params)], { type: 'application/json' }));
  const res = await fetch(`${cfg.clovaInvokeUrl.replace(/\/$/, '')}/recognizer/upload`, { method: 'POST', headers: { 'X-CLOVASPEECH-API-KEY': cfg.clovaSecret }, body: form });
  if (!res.ok) throw new Error(`CLOVA transcription failed: ${res.status} ${await res.text()}`);
  const body = await res.json();
  if (body.result && body.result !== 'COMPLETED') throw new Error(`CLOVA transcription failed: ${body.result} ${body.message || ''}`);
  return body.segments?.length ? body.segments.map(s => s.text).join('\n') : String(body.text || '');
}

/* ---------- RETURN ZERO (VITO) batch API (ko) ---------- */
async function rtzrTranscribe(file, lang, cfg, ctx = '') {
  if (!cfg.rtzrClientId || !cfg.rtzrClientSecret) throw notConfigured('RTZR_CLIENT_ID / RTZR_CLIENT_SECRET are not set');
  const base = 'https://openapi.vito.ai';
  const auth = await fetch(`${base}/v1/authenticate`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: cfg.rtzrClientId, client_secret: cfg.rtzrClientSecret }) });
  if (!auth.ok) throw new Error(`RTZR auth failed: ${auth.status}`);
  const { access_token: token } = await auth.json();
  const config = { use_diarization: false, use_itn: true, use_disfluency_filter: true, use_paragraph_splitter: true,
    keywords: [...contextWords(ctx), ...sermonKeywords(lang)].filter(w => w.length <= 20).slice(0, 100) };
  const form = new FormData();
  form.append('file', new Blob([fs.readFileSync(file)]), path.basename(file));
  form.append('config', JSON.stringify(config));
  const start = await fetch(`${base}/v1/transcribe`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form });
  if (!start.ok) throw new Error(`RTZR transcription failed: ${start.status} ${await start.text()}`);
  const { id } = await start.json();
  for (let i = 0; i < 360; i++) {   // up to ~30 minutes
    await new Promise(r => setTimeout(r, 5000));
    const r = await fetch(`${base}/v1/transcribe/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) continue;
    const b = await r.json();
    if (b.status === 'completed') return (b.results?.utterances || []).map(u => u.msg).join('\n');
    if (b.status === 'failed') throw new Error(`RTZR transcription failed: ${b.error?.message || 'failed'}`);
  }
  throw new Error('RTZR transcription timed out');
}

// Names and topics the listener typed ("새생명교회, 김요한 목사, 로마서 8장, 성령의 열매") → words to boost.
export function contextWords(ctx) {
  return [...new Set(String(ctx || '').split(/[\s,·;/|()\[\]"'“”‘’]+|\.\s/).map(w => w.replace(/[.!?:]+$/, '').trim()).filter(w => w.length >= 2 && w.length <= 20 && !/^\d+$/.test(w)))].slice(0, 40);
}

/* ---------- clean-up of the text ---------- */
// Engines sometimes "hear" the same short line over and over during silence or music. Keep one.
export function tidyTranscript(text) {
  let last = '';
  return String(text || '').split(/\n+/).map(line => line.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => {
    if (!s) return false;
    if (s === last && s.length < 40) return false;
    last = s; return true;
  }).join(' ')).filter(Boolean).join('\n').trim();
}

export const MOCK_TRANSCRIPT = `오늘 함께 나눌 말씀은 요한복음 삼 장 일 절부터 십오 절까지입니다.
밤에 예수님을 찾아온 니고데모는 존경받는 바리새인이었습니다. 그런데 예수님은 그에게 사람이 거듭나지 아니하면 하나님의 나라를 볼 수 없다고 말씀하십니다.
첫째, 거듭남은 우리의 노력이 아니라 성령의 일하심입니다. 바람이 임의로 불매 그 소리를 들어도 어디서 오는지 알지 못하는 것처럼 성령으로 난 사람도 그러합니다.
둘째, 거듭남은 십자가를 바라봄으로 시작됩니다. 민수기 이십일 장에서 모세가 놋뱀을 든 것처럼 인자도 들려야 하리니 그를 믿는 자마다 영생을 얻게 하려 하심입니다.
셋째, 거듭난 사람은 빛 가운데로 나아옵니다. 니고데모는 밤에 왔지만 나중에는 예수님의 장례를 위해 공개적으로 나아왔습니다.
이번 한 주, 우리의 신앙이 밤에만 머무르지 않고 일상의 빛 가운데서 드러나기를 바랍니다. 함께 기도하겠습니다.`;
