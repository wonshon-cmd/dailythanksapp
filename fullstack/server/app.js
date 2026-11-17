import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parseReference, formatReference, verseCount } from './bible/reference.js';
import { listTranslations, getPassageText } from './bible/translations.js';
import { transcribe as defaultTranscribe } from './sermons/stt.js';
import { summarizeSermon as defaultSummarize } from './sermons/summarize.js';
import { flaggedTerms } from './moderation.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR = path.resolve(here, '../..');           // the front-end app at the repo root
const PUBLIC_DIR = path.resolve(here, '../public');           // full-stack add-ons
const CONTENT_FILE = path.resolve(here, '../../content/content.json'); // editable app text (no store update needed)
const STATIC = {                                              // whitelist: nothing else on disk is served
  '/styles.css': [FRONTEND_DIR, 'styles.css', 'text/css; charset=utf-8'],
  '/app.js': [FRONTEND_DIR, 'app.js', 'text/javascript; charset=utf-8'],
  '/fullstack/client.js': [PUBLIC_DIR, 'client.js', 'text/javascript; charset=utf-8'],
  '/daily-bible/styles.css': [FRONTEND_DIR, 'styles.css', 'text/css; charset=utf-8'],
  '/daily-bible/app.js': [FRONTEND_DIR, 'app.js', 'text/javascript; charset=utf-8']
};
const AUDIO_TYPES = { 'audio/mpeg': '.mp3', 'audio/mp4': '.m4a', 'audio/x-m4a': '.m4a', 'audio/wav': '.wav', 'audio/x-wav': '.wav', 'audio/webm': '.webm', 'audio/ogg': '.ogg', 'audio/aac': '.aac' };

class HttpError extends Error { constructor(status, code, message, extra) { super(message || code); this.status = status; this.code = code; this.extra = extra; } }

const send = (res, status, body, type = 'application/json; charset=utf-8') => {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(type.startsWith('application/json') ? JSON.stringify(body) : body);
};

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = []; let size = 0;
    req.on('data', c => { size += c.length; if (size > limit) { reject(new HttpError(413, 'payload_too_large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
async function readJson(req, limit = 2 * 1024 * 1024) {
  const buf = await readBody(req, limit);
  try { return JSON.parse(buf.toString('utf8') || '{}'); } catch { throw new HttpError(400, 'invalid_json'); }
}

// Demo identity. Replace with real auth (Apple / Google sign-in -> verified session) before any launch:
// every route below already scopes data by this id.
function userIdOf(req) {
  const id = String(req.headers['x-user-id'] || 'demo');
  if (!/^[\w-]{1,64}$/.test(id)) throw new HttpError(400, 'invalid_user');
  return id;
}

export function createApp({ config, store, transcribe = defaultTranscribe, summarize = defaultSummarize }) {
  const routes = [];
  const route = (method, pattern, handler, feature) => {
    const keys = [];
    const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '$');
    routes.push({ method, re, keys, handler, feature });
  };

  /* ---------- core ---------- */
  route('GET', '/api/health', () => ({ ok: true }));
  route('GET', '/api/config', () => ({ features: config.features }));
  // Remote content: read on every request, so editing content/content.json takes effect at the next app launch.
  route('GET', '/api/content', () => {
    let c; try { c = JSON.parse(fs.readFileSync(config.contentFile || CONTENT_FILE, 'utf8')); } catch { throw new HttpError(503, 'content_unavailable'); }
    for (const k of Object.keys(c)) if (k.startsWith('_')) delete c[k];
    return c;
  });
  route('GET', '/api/state', ({ user }) => ({ state: store.getState(user) }));
  route('PUT', '/api/state', async ({ req, user }) => {
    const body = await readJson(req);
    if (!body.state || !Array.isArray(body.state.posts)) throw new HttpError(400, 'invalid_state');
    store.putState(user, body.state);
    return { ok: true };
  });

  // Account deletion (required by the App Store and Google Play): removes the user's data everywhere.
  // Groups & invites. Invite link: https://dailyjourney.org/join/?c=CODE&n=NAME → app → POST /api/groups/join.
  const CODE_RE = /^[a-z0-9]{4,24}$/;
  const newCode = () => Array.from(crypto.randomBytes(6), b => 'abcdefghjkmnpqrstuvwxyz23456789'[b % 31]).join('');
  const publicGroup = g => ({ id: g.id, name: g.name, inviteCode: g.inviteCode, members: g.members.length });
  route('POST', '/api/groups', async ({ req, user }) => {
    const { name, code } = await readJson(req);
    const clean = String(name || '').trim().slice(0, 30);
    if (!clean) throw new HttpError(400, 'name_required');
    let inviteCode = CODE_RE.test(code || '') && !store.groupByCode(code) ? code : newCode();
    while (store.groupByCode(inviteCode)) inviteCode = newCode();
    const g = store.addGroup({ id: crypto.randomUUID(), name: clean, inviteCode, ownerId: user, members: [user], createdAt: new Date().toISOString() });
    return { status: 201, body: { group: publicGroup(g) } };
  });
  route('GET', '/api/groups', ({ user }) => ({ groups: store.listGroups(user).map(publicGroup) }));
  route('GET', '/api/invites/:code', ({ params }) => {
    const g = store.groupByCode(params.code); if (!g) throw new HttpError(404, 'invite_not_found');
    return { name: g.name, members: g.members.length };
  });
  route('POST', '/api/groups/join', async ({ req, user }) => {
    const { code } = await readJson(req);
    if (!CODE_RE.test(code || '')) throw new HttpError(400, 'bad_code');
    const g = store.joinGroup(code, user); if (!g) throw new HttpError(404, 'invite_not_found');
    return { group: publicGroup(g) };
  });
  // Gentle group nudge: one message to every member, at most once a day per group, never naming anyone.
  // (Delivery = push to members' devices; here it is recorded so the push service can send it.)
  route('POST', '/api/groups/nudge', async ({ req, user }) => {
    const { code } = await readJson(req);
    const g = CODE_RE.test(code || '') && store.groupByCode(code);
    if (!g || !g.members.includes(user)) throw new HttpError(404, 'group_not_found');
    const day = new Date().toISOString().slice(0, 10);
    if (g.lastNudge === day) throw new HttpError(429, 'already_nudged_today');
    g.lastNudge = day; store.addNudge({ groupId: g.id, day, by: user });
    return { ok: true, recipients: g.members.length };
  });
  route('DELETE', '/api/account', ({ user }) => { store.deleteUser(user); return { ok: true }; });

  /* ---------- 표현 필터 + 검토 요청 ----------
     Posts shared with others are checked before they go out. If the writer thinks the filter is wrong,
     they ask for a review; a moderator approves (post goes out) or rejects (stays private to the writer). */
  route('POST', '/api/moderation/check', async ({ req }) => {
    const body = await readJson(req, 16 * 1024);
    if (body.scope === 'private') return { ok: true, terms: [] };
    const terms = flaggedTerms(String(body.text || ''));
    return { ok: terms.length === 0, terms };
  });
  route('POST', '/api/reviews', async ({ req, user }) => {
    const body = await readJson(req, 16 * 1024);
    const text = String(body.text || '').trim();
    if (!text || !body.postId) throw new HttpError(422, 'missing_fields');
    return store.addReview({
      id: crypto.randomUUID(), postId: String(body.postId).slice(0, 80), userId: user, text: text.slice(0, 1500),
      scope: body.scope === 'group' ? 'group' : 'public', terms: flaggedTerms(text), status: 'pending', createdAt: new Date().toISOString()
    });
  });
  route('GET', '/api/reviews', ({ user }) => ({ reviews: store.listReviews({ userId: user }) }));
  // TODO(auth): moderators only.
  route('GET', '/api/moderation/reviews', ({ url }) => ({ reviews: store.listReviews({ status: url.searchParams.get('status') || 'pending' }) }), 'moderation');
  route('PATCH', '/api/moderation/reviews/:id', async ({ req, params }) => {
    const body = await readJson(req, 4096);
    if (!['approved', 'rejected'].includes(body.status)) throw new HttpError(422, 'invalid_status');
    const r = store.updateReview(params.id, { status: body.status, decidedAt: new Date().toISOString(), note: String(body.note || '').slice(0, 300) });
    if (!r) throw new HttpError(404, 'not_found');
    return { review: r };
  }, 'moderation');

  /* ---------- 신고 (moderation queue) ----------
     Users report a post with a reason; reports wait in a queue for a moderator. The reporter is never shown
     to the reported person. Hiding and blocking are per-viewer and live in the user's own state. */
  const REPORT_REASONS = ['spam', 'hate', 'violence', 'sexual', 'false', 'privacy', 'selfharm', 'other'];
  route('POST', '/api/reports', async ({ req, user }) => {
    const body = await readJson(req, 8 * 1024);
    if (!REPORT_REASONS.includes(body.reason)) throw new HttpError(422, 'invalid_reason');
    if (!body.postId) throw new HttpError(422, 'missing_post');
    return store.addReport({
      id: crypto.randomUUID(), postId: String(body.postId).slice(0, 80), author: String(body.author || '').slice(0, 80),
      reason: body.reason, note: String(body.note || '').slice(0, 500), reporter: user,
      // self-harm reports go to the front of the queue
      priority: body.reason === 'selfharm' ? 'urgent' : 'normal', status: 'open', createdAt: new Date().toISOString()
    });
  });
  // TODO(auth): restrict to moderators once real accounts exist.
  route('GET', '/api/moderation/reports', ({ url }) => ({ reports: store.listReports({ status: url.searchParams.get('status') || 'open' })
    .sort((a, b) => (a.priority === 'urgent' ? -1 : 0) - (b.priority === 'urgent' ? -1 : 0)) }), 'moderation');
  route('PATCH', '/api/moderation/reports/:id', async ({ req, params }) => {
    const body = await readJson(req, 4096);
    if (!['open', 'actioned', 'dismissed'].includes(body.status)) throw new HttpError(422, 'invalid_status');
    const r = store.updateReport(params.id, { status: body.status, resolvedAt: new Date().toISOString() });
    if (!r) throw new HttpError(404, 'not_found');
    return { report: r };
  }, 'moderation');

  /* ---------- 오늘의 본문 (feature: passage) ----------
     The app never ships a publisher's reading plan. A user types today's reference, or a small-group
     leader assigns one to the group; the app only parses it and shows licensed/public-domain text. */
  route('GET', '/api/bible/translations', () => ({ translations: listTranslations() }), 'passage');
  route('GET', '/api/bible/parse', ({ url }) => {
    const ref = parseReference(url.searchParams.get('q'));
    if (!ref) throw new HttpError(422, 'unrecognised_reference');
    return { ref, label: { ko: formatReference(ref, 'ko'), en: formatReference(ref, 'en') }, verses: verseCount(ref) };
  }, 'passage');
  route('GET', '/api/bible/passage', ({ url }) => {
    const ref = parseReference(url.searchParams.get('ref'));
    if (!ref) throw new HttpError(422, 'unrecognised_reference');
    const result = getPassageText(ref, url.searchParams.get('translation') || 'krv');
    if (result.error) throw new HttpError(result.error === 'license_required' ? 403 : 404, result.error);
    return { ref, label: formatReference(ref, url.searchParams.get('lang') === 'en' ? 'en' : 'ko'), ...result };
  }, 'passage');
  route('GET', '/api/passages', ({ url, user }) => ({
    passages: store.listPassages({ date: url.searchParams.get('date'), groupId: url.searchParams.get('group'), userId: user })
  }), 'passage');
  route('POST', '/api/passages', async ({ req, user }) => {
    const body = await readJson(req, 16 * 1024);
    const ref = parseReference(body.reference);
    if (!ref) throw new HttpError(422, 'unrecognised_reference');
    const date = /^\d{4}-\d{2}-\d{2}$/.test(body.date || '') ? body.date : new Date().toISOString().slice(0, 10);
    // TODO(auth): when groups exist server-side, check the user is a leader of body.groupId.
    return store.addPassage({
      id: crypto.randomUUID(), date, ref, label: { ko: formatReference(ref, 'ko'), en: formatReference(ref, 'en') },
      groupId: body.groupId ? String(body.groupId).slice(0, 64) : null,
      note: body.note ? String(body.note).slice(0, 300) : '',
      source: body.groupId ? 'leader' : 'user', createdBy: user, createdAt: new Date().toISOString()
    });
  }, 'passage');
  route('DELETE', '/api/passages/:id', ({ params, user }) => {
    if (!store.deletePassage(params.id, user)) throw new HttpError(404, 'not_found');
    return { ok: true };
  }, 'passage');

  /* ---------- 설교 요약 (feature: sermon) ----------
     Recording -> speech-to-text -> Claude summary. Summaries are private to the listener by default;
     sharing needs the church's consent (B2B: a church account publishes official summaries). */
  const runJob = async (id, job) => {
    try {
      let transcript = job.transcript;
      if (!transcript) {
        store.updateSermon(id, { status: 'transcribing' });
        transcript = (await transcribe({ filePath: job.filePath, mimeType: job.mimeType, language: 'ko' }, config.stt)).text;
      }
      store.updateSermon(id, { status: 'summarizing', transcript });
      const { summary, references, model } = await summarize({ transcript, title: job.title, preacher: job.preacher });
      store.updateSermon(id, { status: 'done', summary, references, model, finishedAt: new Date().toISOString() });
    } catch (err) {
      store.updateSermon(id, { status: 'error', error: { code: err.code || 'failed', message: err.message } });
    }
  };
  const newSermon = (user, fields) => store.addSermon({
    id: crypto.randomUUID(), ownerId: user, status: 'queued', visibility: 'private',
    title: String(fields.title || '').slice(0, 120), preacher: String(fields.preacher || '').slice(0, 60),
    createdAt: new Date().toISOString()
  });

  /* Sermon notes plan: the first N notes are free and kept; then delete some, or subscribe (monthly / yearly,
     "almost unlimited" with a fair-use cap per 30 days). */
  const quota = user => {
    const plan = store.getPlan(user), P = config.sermonPlans;
    const month = new Date(Date.now() - 30 * 864e5).toISOString();
    return { plan: plan?.plan || 'free', until: plan?.until || null, used: store.countSermons(user), limit: plan ? null : P.freeNotes,
      monthUsed: store.countSermons(user, month), monthLimit: plan ? P.fairUsePerMonth : null };
  };
  const checkQuota = user => {
    const q = quota(user);
    if (q.plan === 'free' && q.used >= q.limit) throw new HttpError(402, 'quota_full', null, { used: q.used, limit: q.limit });
    if (q.plan !== 'free' && q.monthUsed >= q.monthLimit) throw new HttpError(429, 'fair_use', null, { monthUsed: q.monthUsed, monthLimit: q.monthLimit });
  };
  route('GET', '/api/sermons/quota', ({ user }) => quota(user), 'sermon');
  route('DELETE', '/api/sermons/:id', ({ params, user }) => {
    if (!store.deleteSermon(params.id, user)) throw new HttpError(404, 'not_found');
    return { ok: true, ...quota(user) };
  }, 'sermon');
  // Subscriptions: in production verify the store receipt (App Store Server API / Google Play Developer API)
  // or a Stripe webhook before setting the plan. BILLING_DEV=1 allows activating without one, for testing only.
  route('POST', '/api/billing/activate', async ({ req, user }) => {
    const body = await readJson(req, 64 * 1024);
    const plan = body.plan === 'yearly' ? 'yearly' : body.plan === 'monthly' ? 'monthly' : null;
    if (!plan) throw new HttpError(422, 'invalid_plan');
    if (!config.sermonPlans.devBilling) throw new HttpError(501, 'billing_not_configured');
    const until = new Date(Date.now() + (plan === 'yearly' ? 365 : 31) * 864e5).toISOString();
    store.setPlan(user, { plan, until, source: 'dev' });
    return quota(user);
  }, 'sermon');

  route('POST', '/api/sermons/audio', async ({ req, url, user }) => {
    checkQuota(user);
    const mimeType = String(req.headers['content-type'] || '').split(';')[0];
    if (!AUDIO_TYPES[mimeType]) throw new HttpError(415, 'unsupported_audio_type');
    const audio = await readBody(req, config.maxUploadBytes);
    if (!audio.length) throw new HttpError(400, 'empty_audio');
    const s = newSermon(user, { title: url.searchParams.get('title'), preacher: url.searchParams.get('preacher') });
    fs.mkdirSync(config.uploadDir, { recursive: true });
    const filePath = path.join(config.uploadDir, s.id + AUDIO_TYPES[mimeType]);
    fs.writeFileSync(filePath, audio);
    runJob(s.id, { filePath, mimeType, title: s.title, preacher: s.preacher });
    return { status: 202, body: { id: s.id, status: 'queued' } };
  }, 'sermon');
  route('POST', '/api/sermons/text', async ({ req, user }) => {
    checkQuota(user);
    const body = await readJson(req, 1024 * 1024);
    const transcript = String(body.transcript || '').trim();
    if (transcript.length < 50) throw new HttpError(422, 'transcript_too_short');
    const s = newSermon(user, body);
    runJob(s.id, { transcript, title: s.title, preacher: s.preacher });
    return { status: 202, body: { id: s.id, status: 'queued' } };
  }, 'sermon');
  route('GET', '/api/sermons', ({ user }) => ({ sermons: store.listSermons(user) }), 'sermon');
  route('GET', '/api/sermons/:id', ({ params, user }) => {
    const s = store.getSermon(params.id);
    if (!s || (s.ownerId !== user && s.visibility === 'private')) throw new HttpError(404, 'not_found');
    return { sermon: s };
  }, 'sermon');
  route('PATCH', '/api/sermons/:id/visibility', async ({ req, params, user }) => {
    const s = store.getSermon(params.id);
    if (!s || s.ownerId !== user) throw new HttpError(404, 'not_found');
    const body = await readJson(req, 4096);
    if (body.visibility !== 'private' && body.churchConsent !== true) throw new HttpError(409, 'church_consent_required');
    return { sermon: store.updateSermon(s.id, { visibility: body.visibility === 'group' ? 'group' : 'private' }) };
  }, 'sermon');

  /* ---------- static front end ---------- */
  function serveStatic(pathname, res) {
    if (pathname === '/' || pathname === '/index.html') {
      const html = fs.readFileSync(path.join(FRONTEND_DIR, 'index.html'), 'utf8')
        .replace('<script src="app.js" defer></script>', '<script src="app.js" defer></script>\n<script src="fullstack/client.js" defer></script>');
      return send(res, 200, html, 'text/html; charset=utf-8'), true;
    }
    if (pathname === '/daily-bible' || pathname === '/daily-bible/') {   // the Bible app: same code in Bible mode, same API
      const html = fs.readFileSync(path.join(FRONTEND_DIR, 'index.html'), 'utf8')
        .replace('<script src="app.js" defer></script>', '<script>window.DT_APP = "bible";</script>\n<script src="app.js" defer></script>')
        .replace(/<title>[^<]*<\/title>/, '<title>Daily Bible</title>');
      return send(res, 200, html, 'text/html; charset=utf-8'), true;
    }
    const entry = STATIC[pathname];
    if (!entry) return false;
    send(res, 200, fs.readFileSync(path.join(entry[0], entry[1])), entry[2]);
    return true;
  }

  return async function handle(req, res) {
    const url = new URL(req.url, 'http://localhost');
    const origin = req.headers.origin;
    if (origin && config.corsOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-id'); res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    }
    if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
    try {
      if (req.method === 'GET' && serveStatic(url.pathname, res)) return;
      for (const r of routes) {
        const m = url.pathname.match(r.re);
        if (!m || r.method !== req.method) continue;
        if (r.feature && !config.features[r.feature]) throw new HttpError(404, 'not_found'); // hidden until switched on
        const params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
        const out = await r.handler({ req, url, params, user: userIdOf(req) });
        return out && typeof out.status === 'number' && 'body' in out ? send(res, out.status, out.body) : send(res, 200, out);
      }
      throw new HttpError(404, 'not_found');
    } catch (err) {
      if (!(err instanceof HttpError)) console.error(err);
      const status = err instanceof HttpError ? err.status : 500;
      send(res, status, { error: err instanceof HttpError ? err.code : 'internal_error', ...(err instanceof HttpError && err.extra ? err.extra : {}) });
    }
  };
}
