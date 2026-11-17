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
  ko: ['말씀을 매일,<br>한 장씩', '친구와 같은 날,<br>같은 말씀을', '공동체의 기도제목을<br>함께 기도해요', '설교는 녹음하면<br>노트로 정리돼요', '가까운 사람들과<br>공동체로 함께'],
  en: ['The Word daily,<br>one page at a time', 'Same passage, same day,<br>with friends', 'Pray for your<br>community together', 'Record the sermon,<br>it becomes notes', 'Communities of<br>the people close to you'],
  es: ['La Palabra cada día,<br>una página a la vez', 'El mismo pasaje,<br>el mismo día, juntos', 'Ora junto a<br>tu comunidad', 'Graba el sermón,<br>y se vuelve notas', 'Comunidades con<br>la gente cercana']
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
  await ctx.addInitScript(([name, brand]) => {
    if (brand === 'journey') window.DT_BRAND = 'journey';
    try { localStorage.setItem('daily-thanks-v4', JSON.stringify({ settings: { toured: true, myName: name } })); sessionStorage.setItem('wl-later', '1'); } catch {}
  }, [NAME[lang], BRAND]);
  const p = await ctx.newPage();
  p.on('pageerror', e => console.warn('page error:', e.message));
  await p.goto('http://app.local/'); await p.waitForTimeout(4500); // let the splash finish
  const files = [];
  const snap = async n => { await p.waitForTimeout(500); const f = path.join(out, `raw-${lang}-${n}.png`); await p.screenshot({ path: f }); files.push(f); };
  const closeSheet = async () => { for (let i = 0; i < 3; i++) if (await p.evaluate(() => !document.getElementById('sheet')?.hidden)) { await p.keyboard.press('Escape'); await p.waitForTimeout(300); } };
  // 3 (shot first, it is the opening screen): the feed opens on the community's prayer request
  const prayer = path.join(out, `raw-${lang}-3.png`); await p.screenshot({ path: prayer });
  // 1 reading: Genesis 1:1 in the reader
  await p.click('[data-action=fullscreen] >> visible=true'); await p.waitForTimeout(600);
  await p.click('[data-action=bb-continue]'); await p.waitForTimeout(1500); await snap(1);
  await p.click('[data-action=reader-close]'); await p.waitForTimeout(500);
  // 2 reading plan with friends
  await p.click('[data-action=plan-new]'); await p.waitForTimeout(800);
  await p.evaluate(() => document.activeElement?.blur()); await snap(2);
  await closeSheet();
  files.push(prayer);
  // 4 sermon note (the example). Its verse-check banner is hidden: it flags the sample note, not something users see on their own notes.
  await p.click('[data-tab=notes]'); await p.waitForTimeout(500);
  await p.click('[data-action=note-open][data-id=example]'); await p.waitForTimeout(1000);
  await p.addStyleTag({ content: '.vc-banner{display:none!important}' }); await snap(4);
  await p.click('[data-tab=read]'); await p.waitForTimeout(300);
  // 5 communities
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
