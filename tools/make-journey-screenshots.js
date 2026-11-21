// Daily Journey (the Bible app) store screenshots with captions, in Korean / English / Spanish.
// Usage: python3 tools/build-single.py && node tools/make-journey-screenshots.js [dist/daily-bible.html] [store/screenshots/journey]
//   BRAND=bible … shows the app as "daily bible" instead (default: journey → window.DT_BRAND = 'journey').
//   LANGS=ko … limits the languages.
//   (mobile/www/index.html from `cd mobile && node scripts/build-web.mjs` works too.)
// Produces Apple 6.9" (1320x2868) and Google Play phone (1080x2340) PNGs: apple-6.9-<lang>-<n>.png, play-<lang>-<n>.png.
// The page is served from a fake origin; Bible text and i18n come from the repo, and the network (Supabase etc.) is blocked,
// so the shots show the app's built-in sample content. The tour and the name/sign-up sheet are skipped via storage.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const page = path.resolve(process.argv[2] || path.join(ROOT, 'dist/daily-bible.html'));
const BRAND = process.env.BRAND || 'journey';
const out = path.resolve(process.argv[3] || path.join(ROOT, 'store/screenshots', BRAND));
const CAPTIONS = {
  ko: ['말씀을 매일,<br>한 장씩', '친구와 같은 날,<br>같은 말씀을', '공동체의 기도제목을<br>함께 기도해요', '말씀과 설교를,<br>내 노트로', '가까운 사람들과<br>공동체로 함께', '내가 나눈 말씀이<br>닿은 곳'],
  en: ['The Word daily,<br>one page at a time', 'Same passage, same day,<br>with friends', 'Pray for your<br>community together', 'The Word and the sermon,<br>in your own notes', 'Communities of<br>the people close to you', 'See how far your<br>sharing has reached'],
  es: ['La Palabra cada día,<br>una página a la vez', 'El mismo pasaje,<br>el mismo día, juntos', 'Ora junto a<br>tu comunidad', 'La Palabra y el sermón,<br>en tus notas', 'Comunidades con<br>la gente cercana', 'Mira hasta dónde<br>llegó lo que compartiste']
};
// A sermon note the user wrote themselves (first release: recording + your own notes; no automatic summaries).
const NOTE = {
  ko: { title: '열매 맺는 가지', preacher: '김은혜 목사', church: '은혜교회', passage: '요한복음 15:1-11', main: '열매는 애써서 만드는 것이 아니라, 예수님 안에 머물 때 맺혀요.',
    body: '· 포도나무는 예수님, 우리는 가지. 가지는 스스로 열매를 맺지 못한다.\n· "거하라" — 머문다는 건 매일 말씀과 기도로 붙어 있는 것.\n· 가지치기는 버리시는 게 아니라 더 열매 맺게 하시는 손길.\n\n이번 주 적용\n· 아침에 휴대폰보다 말씀을 먼저 펴기\n· 공동체 기도제목 하나씩 붙들고 기도하기' },
  en: { title: 'Branches that bear fruit', preacher: 'Pastor James Lee', church: 'Grace Church', passage: 'John 15:1-11', main: 'Fruit isn’t something we work up; it grows when we remain in Jesus.',
    body: '· Jesus is the vine, we are the branches. A branch can’t bear fruit by itself.\n· “Abide” — staying close every day, in the Word and in prayer.\n· Pruning isn’t rejection; it’s the gardener’s care so we bear more fruit.\n\nThis week\n· Open the Bible before my phone in the morning\n· Pray for one prayer request from my community each day' },
  es: { title: 'Ramas que dan fruto', preacher: 'Pastor Daniel Ruiz', church: 'Iglesia Gracia', passage: 'Juan 15:1-11', main: 'El fruto no se fabrica con esfuerzo: crece cuando permanecemos en Jesús.',
    body: '· Jesús es la vid, nosotros las ramas. La rama no da fruto por sí sola.\n· “Permaneced”: estar cerca cada día, en la Palabra y en oración.\n· La poda no es rechazo; es el cuidado del labrador para que demos más fruto.\n\nEsta semana\n· Abrir la Biblia antes que el teléfono por la mañana\n· Orar cada día por una petición de mi comunidad' }
};
const LOCALE = { ko: 'ko-KR', en: 'en-US', es: 'es-ES' };
const NAME = { ko: '은혜', en: 'Grace', es: 'Gracia' };

async function rawShots(b, lang) {
  const ctx = await b.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, locale: LOCALE[lang], reducedMotion: 'reduce' });
  await ctx.route('**/*', r => {
    const u = new URL(r.request().url());
    if (u.host === 'app.local') {
      if (u.pathname === '/' || u.pathname === '/index.html') return r.fulfill({ path: page, contentType: 'text/html; charset=utf-8' });
      const f = path.join(path.dirname(page), decodeURIComponent(u.pathname)), g = path.join(ROOT, decodeURIComponent(u.pathname));
      return fs.existsSync(f) ? r.fulfill({ path: f }) : fs.existsSync(g) ? r.fulfill({ path: g }) : r.fulfill({ status: 404 });
    }
    if (/fonts\.(googleapis|gstatic)\.com$/.test(u.host)) return r.continue();
    return r.abort(); // no Supabase, no remote Bible: sample content only
  });
  await ctx.addInitScript(([name, brand, n]) => {
    if (brand === 'journey') window.DT_BRAND = 'journey';
    const d = new Date(), date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const note = { id: 'shot-note', manual: true, date, title: n.title, preacher: n.preacher, church: n.church, status: 'done', body: n.body,
      ref: { b: 43, c: 15, v: 1, v2: 11 }, summary: { title: n.title, passages: [n.passage], main_message: n.main, points: [], application: [], prayer_topics: [], discussion_questions: [] } };
    // The app only keeps stored data that has its posts list, so add to what it saved on the first open (the page reloads once).
    try {
      sessionStorage.setItem('wl-later', '1');
      const s = JSON.parse(localStorage.getItem('daily-thanks-v4') || 'null');
      if (s && Array.isArray(s.posts) && !sessionStorage.getItem('shot-seeded')) {
        s.settings = { ...(s.settings || {}), toured: true, onboarded: true, fsUsed: true, myName: name }; s.sermonNotes = [note];
        localStorage.setItem('daily-thanks-v4', JSON.stringify(s)); sessionStorage.setItem('shot-seeded', '1');
      } else if (!s) localStorage.setItem('daily-thanks-v4', JSON.stringify({ settings: { toured: true, onboarded: true, fsUsed: true, myName: name } }));
    } catch {}
  }, [NAME[lang], BRAND, NOTE[lang]]);
  const p = await ctx.newPage();
  p.on('pageerror', e => console.warn('page error:', e.message));
  await p.goto('https://app.local/'); await p.waitForTimeout(2500);
  await p.evaluate(() => window.DailyThanks?.save?.());
  await p.reload(); await p.waitForTimeout(4500); // let the splash finish
  if (!(await p.evaluate(() => !!sessionStorage.getItem('shot-seeded')))) throw new Error('could not seed the sermon note');
  const files = [];
  const snap = async n => { await p.waitForTimeout(500); const f = path.join(out, `raw-${lang}-${n}.png`); await p.screenshot({ path: f }); files.push(f); };
  const closeSheet = async () => { for (let i = 0; i < 3; i++) if (await p.evaluate(() => !document.getElementById('sheet')?.hidden)) { await p.keyboard.press('Escape'); await p.waitForTimeout(300); } };
  // 1 (the opening screen): the app opens right on today's passage, one verse per page
  await snap(1);
  // 3 the community's prayer request: the first card of the feed
  await p.evaluate(() => { const sc = document.querySelector('#feed-scroll'); if (sc) sc.scrollTop = 0; }); await p.waitForTimeout(900); await snap(3);
  // 2 reading plan with friends (매일 tab)
  await p.click('[data-action=fullscreen] >> visible=true'); await p.waitForTimeout(600);
  await p.click('[data-tab=read]'); await p.waitForTimeout(600);
  await p.click('[data-action=plan-new]'); await p.waitForTimeout(800);
  await p.evaluate(() => document.activeElement?.blur()); await snap(2);
  await closeSheet();
  // 6 매일: streak, today's passage and how far my sharing reached
  await p.evaluate(() => document.querySelector('#bpick:not([hidden]) [data-action=bp-close]')?.click()); await p.waitForTimeout(300);
  await snap(6);
  // 4 a note the user wrote
  await p.click('[data-tab=notes]'); await p.waitForTimeout(500);
  await p.click('[data-id=shot-note]'); await p.waitForTimeout(1200); await snap(4);
  // 5 communities, one card per screen
  await p.click('[data-tab=group]'); await p.waitForTimeout(800); await snap(5);
  await ctx.close();
  return files.sort();
}

async function framed(b, lang, files) {
  for (const [w, h, tag] of [[1320, 2868, 'apple-6.9'], [1080, 2340, 'play']]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    for (let i = 0; i < files.length; i++) {
      const img = 'data:image/png;base64,' + fs.readFileSync(files[i]).toString('base64');
      const shotW = Math.round(w * .78);
      await p.setContent(`<!doctype html><html><head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=Noto+Sans+KR:wght@300;400&display=swap"></head>
        <body style="margin:0;width:${w}px;height:${h}px;overflow:hidden;background:#F2F2F2;font-family:'Noto Sans KR',sans-serif;display:flex;flex-direction:column;align-items:center">
          <div style="margin-top:${Math.round(h * .07)}px;font-family:Newsreader,serif;font-size:${Math.round(w * .033)}px;color:#9BA0A3">daily <em>${BRAND}</em></div>
          <div style="margin-top:${Math.round(h * .018)}px;text-align:center;font-size:${Math.round(w * .062)}px;line-height:1.38;font-weight:300;color:#303438;letter-spacing:-.01em">${CAPTIONS[lang][i]}</div>
          <div style="margin-top:${Math.round(h * .05)}px;width:${shotW}px;border-radius:${Math.round(w * .06)}px ${Math.round(w * .06)}px 0 0;overflow:hidden;box-shadow:0 30px 80px #2a30362b;border:${Math.round(w * .012)}px solid #FFFFFF;border-bottom:0">
            <img src="${img}" style="display:block;width:100%"></div>
        </body></html>`);
      await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
      await p.screenshot({ path: path.join(out, `${tag}-${lang}-${i + 1}.png`) });
    }
    await p.close();
  }
}

(async () => {
  if (!fs.existsSync(page)) throw new Error(`${page} not found — run python3 tools/build-single.py first`);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  for (const lang of (process.env.LANGS || 'ko,en,es').split(',')) { const files = await rawShots(b, lang); await framed(b, lang, files); files.forEach(f => fs.unlinkSync(f)); console.log('done', lang); }
  await b.close();
})();
