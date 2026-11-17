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
      sermon: on(env.FEATURE_SERMON),     // 설교 녹음 → 전사 → 요약
      moderation: on(env.FEATURE_MODERATION) // 신고 검토 API (운영자용)
    },
    stt: {
      provider: env.STT_PROVIDER || 'mock', // mock | openai | clova | rtzr
      openaiKey: env.OPENAI_API_KEY || '',
      clovaInvokeUrl: env.CLOVA_SPEECH_INVOKE_URL || '',
      clovaSecret: env.CLOVA_SPEECH_SECRET || '',
      rtzrClientId: env.RTZR_CLIENT_ID || '',
      rtzrClientSecret: env.RTZR_CLIENT_SECRET || ''
    },
    maxUploadBytes: Number(env.MAX_UPLOAD_MB || 200) * 1024 * 1024,
    // Sermon notes: the first notes are free (kept); after that, delete some or subscribe.
    sermonPlans: {
      freeNotes: Number(env.FREE_SERMON_NOTES || 10),
      fairUsePerMonth: Number(env.SERMON_FAIR_USE || 60),   // monthly / yearly plans: "almost unlimited"
      devBilling: on(env.BILLING_DEV)                        // dev only: activate a plan without a store receipt
    },
    ytdlpPath: env.YTDLP_PATH || '',   // optional: yt-dlp binary for "sermon from a YouTube link"
        corsOrigins: String(env.CORS_ORIGINS || 'https://dailyjourney.org,capacitor://localhost,http://localhost,https://localhost').split(',').map(x => x.trim()).filter(Boolean)
  };
}
