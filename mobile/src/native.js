/* Daily Journey (the Bible app; daily thanks code base) — native bridge for the iOS / Android app (Capacitor).
   Loaded before app.js only inside the app (mobile/scripts/build-web.mjs adds it). In a browser it does nothing.
   It fills in the web APIs the app already uses, so app.js needs no phone-specific code:
   - navigator.share / canShare  → system share sheet (text and card images)
   - Notification permission     → local notifications
   - daily reminder              → scheduled at the time chosen in the app, skipped on days you already wrote
   - reminder tap, widget link   → opens the writing sheet (daily-journey://write)
   - Android back button, status bar, launch screen */
/* ---------- updates without the store ----------
   The app ships with its own copy of app.js and styles.css. Every website deploy also publishes
   https://dailyjourney.org/app-update.json (version + where the newest files are). The app checks it on start and
   whenever it comes back to the screen, downloads a newer version in the background, and uses it the next time it
   opens or comes back (never in the middle of reading or writing). If a downloaded version ever fails to start,
   the app goes back to its own copy. Changes to this file (native.js) or to native plugins still need a store update:
   bump NATIVE_VERSION then, and set minNative in tools/build-site.py so older apps keep their own copy. */
const DT_NATIVE_VERSION = 1;
(() => {
  'use strict';
  const KEY = 'dt-ota', BOOT = 'dt-ota-boot', BUNDLED = window.DT_BUNDLED_V || '';
  let ota = null;
  try { ota = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { ota = null; }
  try { if (ota && localStorage.getItem(BOOT) === ota.v) { localStorage.removeItem(KEY); ota = null; } } catch {}   // it didn't start last time: back to the app's own copy
  const ready = () => document.dispatchEvent(new CustomEvent('dt:app-ready'));
  const s = document.createElement('script');
  if (ota && ota.js && ota.css && ota.v !== BUNDLED) {
    try { localStorage.setItem(BOOT, ota.v); } catch {}
    const st = document.createElement('style'); st.textContent = ota.css;
    const link = document.querySelector('link[href^="styles.css"]'); if (link) link.replaceWith(st); else document.head.append(st);
    s.src = URL.createObjectURL(new Blob([ota.js], { type: 'text/javascript' }));
    window.DT_RUNNING_V = ota.v;
  } else { s.src = 'app.js'; window.DT_RUNNING_V = BUNDLED; }
  s.onload = () => { ready(); setTimeout(() => { if (window.DailyThanks) try { localStorage.removeItem(BOOT); } catch {} }, 4000); };
  s.onerror = () => { try { localStorage.removeItem(KEY); localStorage.removeItem(BOOT); } catch {} if (!/app\.js$/.test(s.src)) location.reload(); };
  const go = () => document.body.append(s);
  if (document.body) go(); else document.addEventListener('DOMContentLoaded', go);
})();

(() => {
  'use strict';
  const Cap = window.Capacitor;
  if (!Cap || !Cap.isNativePlatform || !Cap.isNativePlatform()) return;
  const P = Cap.Plugins;
  const platform = Cap.getPlatform();
  document.documentElement.classList.add('native', 'native-' + platform);

  // Text that changes without an app update comes from the website (content/content.json).
  window.DT_CONTENT_URL = 'https://dailyjourney.org/content.json';

  const ready = fn => { if (window.DailyThanks) fn(window.DailyThanks); else document.addEventListener('dt:app-ready', () => window.DailyThanks && fn(window.DailyThanks), { once: true }); };

  /* ---------- check for a newer version (see the top of this file) ---------- */
  const SITE = 'https://dailyjourney.org';
  let checking = false, pending = false;
  async function checkUpdate() {
    if (checking) return; checking = true;
    try {
      const u = await (await fetch(SITE + '/app-update.json?t=' + Date.now(), { cache: 'no-store' })).json();
      if (!u || !u.v || u.v === window.DT_RUNNING_V || (u.minNative || 1) > DT_NATIVE_VERSION) return;
      let have = null; try { have = JSON.parse(localStorage.getItem('dt-ota') || 'null'); } catch {}
      if (have && have.v === u.v) { pending = true; return; }
      const [js, css] = await Promise.all([u.js, u.css].map(async p => { const r = await fetch(SITE + p, { cache: 'no-store' }); if (!r.ok) throw new Error(p); return r.text(); }));
      if (js.length < 100000 || !js.includes('window.DailyThanks') || css.length < 10000) return;   // only a complete app
      localStorage.setItem('dt-ota', JSON.stringify({ v: u.v, js, css, at: Date.now() }));
      pending = true;
    } catch { /* offline or not published yet: try again next time */ }
    finally { checking = false; }
  }
  // use the new version when the app comes back to the screen and nothing is open
  const quiet = () => { const sh = document.getElementById('sheet'); return (!sh || sh.hidden) && !document.body.classList.contains('reading') && !document.querySelector('textarea:focus, input:focus'); };
  P.App?.addListener('appStateChange', ({ isActive }) => { if (!isActive) return; if (pending && quiet()) location.reload(); else checkUpdate(); });
  setTimeout(checkUpdate, 4000);

  /* ---------- share sheet ---------- */
  const toBase64 = blob => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(blob); });
  navigator.canShare = data => !!data && (!data.files || data.files.every(f => f instanceof Blob));
  navigator.share = async (data = {}) => {
    const opts = { title: data.title, text: data.text, url: data.url, dialogTitle: data.title };
    if (data.files && data.files.length) {
      opts.files = [];
      for (const f of data.files) {
        const name = (f.name || 'daily-journey.png').replace(/[^\w.-]/g, '_');
        const { uri } = await P.Filesystem.writeFile({ path: name, data: await toBase64(f), directory: 'CACHE' });
        opts.files.push(uri);
      }
    }
    try { await P.Share.share(opts); }
    catch (e) { throw Object.assign(new Error('AbortError'), { name: 'AbortError', cause: e }); } // cancelled = same as the web API
  };

  /* ---------- notifications ---------- */
  class NativeNotification { constructor() { /* the app shows a test notification after permission; we schedule a real one instead */ } }
  NativeNotification.permission = 'default';
  NativeNotification.requestPermission = async () => {
    try {
      const { display } = await P.LocalNotifications.requestPermissions();
      NativeNotification.permission = display === 'granted' ? 'granted' : 'denied';
    } catch { NativeNotification.permission = 'denied'; }
    if (NativeNotification.permission === 'granted') setTimeout(scheduleReminders, 300);
    return NativeNotification.permission;
  };
  window.Notification = NativeNotification;

  const BODY = {
    ko: ['오늘 감사한 것은?', '한 줄이면 충분해요.'],
    en: ['What are you thankful for today?', 'One line is enough.'],
    es: ['¿Por qué estás agradecido hoy?', 'Una línea es suficiente.']
  };
  const BASE_ID = 7000, DAYS = 14;
  let scheduleTimer;
  async function scheduleReminders() {
    const DT = window.DailyThanks; if (!DT) return;
    const data = DT.getData(), s = data.settings || {};
    try {
      const pending = await P.LocalNotifications.getPending();
      const ours = (pending.notifications || []).filter(n => n.id >= BASE_ID && n.id < BASE_ID + DAYS);
      if (ours.length) await P.LocalNotifications.cancel({ notifications: ours.map(n => ({ id: n.id })) });
      if (!s.notificationEnabled) return;
      const perm = await P.LocalNotifications.checkPermissions();
      if (perm.display !== 'granted') return;
      const [hh, mm] = String(s.notificationTime || '21:00').split(':').map(Number);
      const todayStr = new Date().toLocaleDateString('en-CA');
      const wroteToday = (data.posts || []).some(p => p.mine && p.date === todayStr);
      const [title, body] = BODY[DT.lang()] || BODY.en;
      const list = [];
      for (let d = 0; d < DAYS; d++) {
        const at = new Date(); at.setDate(at.getDate() + d); at.setHours(hh, mm, 0, 0);
        if (at <= new Date() || (d === 0 && wroteToday)) continue; // never remind on a day you already wrote
        list.push({ id: BASE_ID + d, title, body, schedule: { at, allowWhileIdle: true }, channelId: 'reminders', extra: { route: 'write' } });
      }
      if (list.length) await P.LocalNotifications.schedule({ notifications: list });
    } catch (e) { console.warn('reminders', e); }
  }
  // Re-plan whenever the app saves (new post, changed time, reminders on/off). Opening the app tops the list back up.
  document.addEventListener('dt:save', () => { clearTimeout(scheduleTimer); scheduleTimer = setTimeout(scheduleReminders, 800); });

  if (platform === 'android') {
    P.LocalNotifications.createChannel({ id: 'reminders', name: 'Daily reminder', description: 'One gentle reminder a day', importance: 3, visibility: 1 }).catch(() => {});
  }
  P.LocalNotifications.addListener('localNotificationActionPerformed', e => {
    if (e?.notification?.extra?.route === 'write') ready(DT => DT.openWrite());
  });

  /* ---------- deep links: widget, reminders, group invites ---------- */
  // daily-journey://write (daily-bible:// and daily-thanks:// too) → writing sheet; daily-journey://join?c=CODE&n=NAME (group invite) → join sheet
  const route = url => {
    if (!url) return;
    if (/join/.test(url)) { const q = new URL(url.replace(/^daily-(?:journey|bible|thanks):\/\//, 'https://x/')).searchParams; ready(DT => setTimeout(() => DT.joinGroup(q.get('c'), q.get('n'), q.get('k')), 300)); }
    else if (/reply/.test(url)) { const q = new URL(url.replace(/^daily-(?:journey|bible|thanks):\/\//, 'https://x/')).searchParams; ready(DT => setTimeout(() => DT.replyThanks(q.get('to'), q.get('from')), 300)); }
    else if (/meditat/.test(url)) ready(DT => setTimeout(() => DT.openMeditation(), 300));
    else if (/write/.test(url)) ready(DT => setTimeout(() => DT.openWrite(), 300));
  };
  P.App.addListener('appUrlOpen', e => route(e.url));
  P.App.getLaunchUrl().then(r => route(r && r.url)).catch(() => {});
  P.App.addListener('resume', () => scheduleReminders());

  /* ---------- Android back button: close a sheet first, otherwise leave the app ---------- */
  P.App.addListener('backButton', () => {
    const sheet = document.getElementById('sheet');
    if (sheet && !sheet.hidden) { window.DailyThanks?.close(); return; }
    if (window.DailyThanks?.back()) return; // Bible reader, a group or prayer requests open → back one step
    P.App.minimizeApp();
  });

  /* ---------- no screenshots of other people's group posts ----------
     Android: the screen is marked secure (screenshots and recordings come out black) while such posts are shown.
     iOS can't block a screenshot; the app blurs the screen while it's being recorded or mirrored, and says so after a screenshot. */
  let prot = null;
  const syncProtect = () => { const on = !!window.DailyThanks?.isProtectedView?.(); if (on === prot) return; prot = on; P.Privacy?.protect({ on }).catch(() => {}); };
  document.addEventListener('dt:render', () => setTimeout(syncProtect, 50));
  document.addEventListener('scroll', () => setTimeout(syncProtect, 50), { capture: true, passive: true });
  P.Privacy?.addListener?.('captured', e => document.body.classList.toggle('capturing', !!e.on && !!window.DailyThanks?.isProtectedView?.()));
  P.Privacy?.addListener?.('screenshot', () => { if (window.DailyThanks?.isProtectedView?.()) window.DailyThanks.toast(window.DailyThanks.t('prot.shot')); });

  /* ---------- home-screen widgets: hand today's verse / thanks / passage to the widgets ---------- */
  let wgTimer = null;
  const pushWidgets = () => { clearTimeout(wgTimer); wgTimer = setTimeout(async () => {
    const DT = window.DailyThanks; if (!DT?.widgetData || !P.WidgetBridge) return;
    try { await P.WidgetBridge.update({ json: JSON.stringify(await DT.widgetData()) }); } catch {}
  }, 800); };
  document.addEventListener('dt:render', pushWidgets);
  P.App.addListener('pause', pushWidgets);

  /* ---------- look ---------- */
  // The app is already full screen: hide the browser-only full-screen button.
  const st = document.createElement('style'); st.textContent = '.fs-btn{display:none!important}'; document.head.appendChild(st);
  P.StatusBar?.setStyle({ style: 'LIGHT' }).catch(() => {});
  ready(() => { P.SplashScreen?.hide({ fadeOutDuration: 200 }).catch(() => {}); scheduleReminders(); });
})();
