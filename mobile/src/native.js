/* Daily Thanks — native bridge for the iOS / Android app (Capacitor).
   Loaded before app.js only inside the app (mobile/scripts/build-web.mjs adds it). In a browser it does nothing.
   It fills in the web APIs the app already uses, so app.js needs no phone-specific code:
   - navigator.share / canShare  → system share sheet (text and card images)
   - Notification permission     → local notifications
   - daily reminder              → scheduled at the time chosen in the app, skipped on days you already wrote
   - reminder tap, widget link   → opens the writing sheet (daily-thanks://write)
   - Android back button, status bar, launch screen */
(() => {
  'use strict';
  const Cap = window.Capacitor;
  if (!Cap || !Cap.isNativePlatform || !Cap.isNativePlatform()) return;
  const P = Cap.Plugins;
  const platform = Cap.getPlatform();
  document.documentElement.classList.add('native', 'native-' + platform);

  // Text that changes without an app update comes from the website (content/content.json).
  window.DT_CONTENT_URL = 'https://dailyjourney.org/content.json';

  const ready = fn => { if (window.DailyThanks) fn(window.DailyThanks); else document.addEventListener('DOMContentLoaded', () => window.DailyThanks && fn(window.DailyThanks)); };

  /* ---------- share sheet ---------- */
  const toBase64 = blob => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(blob); });
  navigator.canShare = data => !!data && (!data.files || data.files.every(f => f instanceof Blob));
  navigator.share = async (data = {}) => {
    const opts = { title: data.title, text: data.text, url: data.url, dialogTitle: data.title };
    if (data.files && data.files.length) {
      opts.files = [];
      for (const f of data.files) {
        const name = (f.name || 'daily-thanks.png').replace(/[^\w.-]/g, '_');
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
  // daily-thanks://write → writing sheet; daily-thanks://join?c=CODE&n=NAME (group invite) → join sheet
  const route = url => {
    if (!url) return;
    if (/join/.test(url)) { const q = new URL(url.replace(/^daily-thanks:\/\//, 'https://x/')).searchParams; ready(DT => setTimeout(() => DT.joinGroup(q.get('c'), q.get('n')), 300)); }
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

  /* ---------- look ---------- */
  // The app is already full screen: hide the browser-only full-screen button.
  const st = document.createElement('style'); st.textContent = '.fs-btn{display:none!important}'; document.head.appendChild(st);
  P.StatusBar?.setStyle({ style: 'LIGHT' }).catch(() => {});
  ready(() => { P.SplashScreen?.hide({ fadeOutDuration: 200 }).catch(() => {}); scheduleReminders(); });
})();
