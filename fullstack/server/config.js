// Runtime configuration. Feature flags default to OFF so the shipped app looks exactly like the
// front-end-only version until a feature is deliberately turned on.
const on = v => ['1', 'true', 'on', 'yes'].includes(String(v || '').toLowerCase());

export function loadConfig(env = process.env) {
  return {
    port: Number(env.PORT || 8787),
    dataFile: env.DATA_FILE || new URL('../data/db.json', import.meta.url).pathname,
    uploadDir: env.UPLOAD_DIR || new URL('../data/uploads/', import.meta.url).pathname,
    features: {
      passage: on(env.FEATURE_PASSAGE),   // 오늘의 본문 (user / leader-entered references)
      sermon: on(env.FEATURE_SERMON)      // 설교 녹음 → 전사 → 요약
    },
    stt: {
      provider: env.STT_PROVIDER || 'mock', // mock | openai | clova | rtzr
      openaiKey: env.OPENAI_API_KEY || '',
      clovaInvokeUrl: env.CLOVA_SPEECH_INVOKE_URL || '',
      clovaSecret: env.CLOVA_SPEECH_SECRET || '',
      rtzrClientId: env.RTZR_CLIENT_ID || '',
      rtzrClientSecret: env.RTZR_CLIENT_SECRET || ''
    },
    maxUploadBytes: Number(env.MAX_UPLOAD_MB || 200) * 1024 * 1024
  };
}
