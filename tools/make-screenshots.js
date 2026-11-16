// Store screenshots with captions, in Korean / English / Spanish.
// Usage: node tools/make-screenshots.js <path to dist/daily-thanks.html> <output dir>
// Produces Apple 6.9" (1320x2868) and Google Play phone (1080x2340) PNGs.
const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const app = 'file://' + path.resolve(process.argv[2]);
const out = path.resolve(process.argv[3]);
const CAPTIONS = {
  ko: ['읽다 보면,<br>쓰고 싶어지는 감사', '하루 한 줄이면<br>충분해요', '쌓여 가는 감사,<br>다시 보는 감사', '감사를 나누면<br>기쁨이 커져요', '내가 고른 시간에,<br>하루 한 번만'],
  en: ['Gratitude that makes<br>you want to write', 'One line a day<br>is enough', 'Watch your thanks<br>grow, day by day', 'Share the joy<br>with a beautiful card', 'One gentle reminder,<br>when you choose'],
  es: ['Gratitud que te<br>inspira a escribir', 'Una línea al día<br>es suficiente', 'Mira crecer<br>tu gratitud', 'Comparte la alegría<br>con una tarjeta', 'Un recordatorio suave,<br>cuando elijas']
};
const LOCALE = { ko: 'ko-KR', en: 'en-US', es: 'es-ES' };

async function rawShots(b, lang) {
  const ctx = await b.newContext({ ...devices['iPhone 13'], viewport: { width: 393, height: 852 }, deviceScaleFactor: 3, locale: LOCALE[lang], reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(app); await p.waitForTimeout(5200); // let the splash finish
  const files = [];
  const snap = async n => { const f = path.join(out, `raw-${lang}-${n}.png`); await p.screenshot({ path: f }); files.push(f); };
  const scrollTo = i => p.evaluate(i => { const sc = document.getElementById('feed-scroll'); sc.scrollTop = sc.clientHeight * i; }, i);
  // 1 feed (pick a warm, mid-length post)
  await p.evaluate(() => { const n = document.getElementById('imm-nudge'); if (n) n.remove(); });
  await scrollTo(2); await p.waitForTimeout(400); await snap(1);
  // 2 write card
  const idx = await p.$$eval('#feed-scroll > article', a => a.findIndex(x => x.id === 'compose-card'));
  await scrollTo(idx); await p.waitForTimeout(300);
  await p.fill('#gate-text', { ko: '퇴근길에 엄마가 보내 준 사진 한 장에 하루가 따뜻해졌어요.', en: 'A photo from Mom on my way home warmed my whole day.', es: 'Una foto de mamá camino a casa me alegró el día.' }[lang]);
  await p.evaluate(() => document.activeElement.blur()); await p.waitForTimeout(200); await snap(2);
  await p.click('#gate-compose button[type=submit]'); await p.waitForTimeout(500);
  for (let i = 0; i < 3; i++) { if (await p.evaluate(() => !document.getElementById('sheet').hidden)) { await p.keyboard.press('Escape'); await p.waitForTimeout(300); } }
  // sign in quietly so later screens are the signed-in app
  const login = await p.$('#login-card [data-action=login][data-id=google]'); if (login) { await login.click(); await p.waitForTimeout(1600); }
  for (let i = 0; i < 3; i++) { if (await p.evaluate(() => !document.getElementById('sheet').hidden)) { await p.keyboard.press('Escape'); await p.waitForTimeout(400); } }
  // 3 my thanks
  await p.click('.post.imm [data-action=fullscreen] >> nth=0'); await p.waitForTimeout(300);
  await p.click('[data-tab=journal]'); await p.waitForTimeout(500); await snap(3);
  // 4 share card
  await p.click('[data-tab=feed]'); await p.waitForTimeout(300);
  await p.click('.post >> nth=1 >> [data-action=share]'); await p.waitForTimeout(1200); await snap(4);
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  // 5 reminder screen
  await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('daily-thanks-v4')); s.settings.notificationEnabled = false; localStorage.setItem('daily-thanks-v4', JSON.stringify(s)); });
  await p.click('[data-tab=journal]'); await p.click('[data-action=settings]'); await p.waitForTimeout(200);
  const prime = await p.$('.sheet [data-action=notify-prime]');
  if (prime) { await prime.click(); await p.waitForTimeout(700); } else { await p.click('.sheet [data-action=notification]'); await p.waitForTimeout(400); }
  await snap(5);
  await ctx.close();
  return files;
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
          <div style="margin-top:${Math.round(h * .07)}px;font-family:Newsreader,serif;font-size:${Math.round(w * .033)}px;color:#9BA0A3">daily <em>thanks</em></div>
          <div style="margin-top:${Math.round(h * .018)}px;text-align:center;font-size:${Math.round(w * .066)}px;line-height:1.38;font-weight:300;color:#303438;letter-spacing:-.01em">${CAPTIONS[lang][i]}</div>
          <div style="margin-top:${Math.round(h * .05)}px;width:${shotW}px;border-radius:${Math.round(w * .06)}px ${Math.round(w * .06)}px 0 0;overflow:hidden;box-shadow:0 30px 80px #2a30362b;border:${Math.round(w * .012)}px solid #FFFFFF;border-bottom:0">
            <img src="${img}" style="display:block;width:100%"></div>
        </body></html>`);
      await p.waitForTimeout(900);
      await p.screenshot({ path: path.join(out, `${tag}-${lang}-${i + 1}.png`) });
    }
    await p.close();
  }
}

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  for (const lang of ['ko', 'en', 'es']) { const files = await rawShots(b, lang); await framed(b, lang, files); files.forEach(f => fs.unlinkSync(f)); console.log('done', lang); }
  await b.close();
})();
