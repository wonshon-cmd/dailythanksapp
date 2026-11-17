// Renders the daily bible brand files from brand/daily-bible/icon.svg:
// app icons (mobile/bible-assets), site favicon / apple-touch icon / og image (brand/daily-bible/web → copied to the site by build-site.py).
// Run: node tools/bible-brand.cjs   (needs Playwright + Chromium)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), SVG = fs.readFileSync(path.join(ROOT, 'brand/daily-bible/icon.svg'), 'utf8');
const mark = fs.readFileSync(path.join(ROOT, 'brand/daily-bible/icon-mark.svg'), 'utf8');
const FONT = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=Noto+Sans+KR:wght@300&display=swap">';
const word = size => `<span style="font-family:Newsreader,Georgia,serif;font-size:${size}px;letter-spacing:-.025em;color:#383D42;white-space:nowrap">daily <em>bible</em></span>`;
(async () => {
  const b = await chromium.launch();
  const shot = async (w, h, html, out, transparent) => {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await p.setContent(`<!doctype html><html><head>${FONT}<style>html,body{margin:0;width:${w}px;height:${h}px;background:${transparent ? 'transparent' : '#fff'}}svg{display:block}</style></head><body>${html}</body></html>`);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await p.screenshot({ path: out, omitBackground: !!transparent }); await p.close();
  };
  const icon = s => SVG.replace('<svg ', `<svg width="${s}" height="${s}" `);
  const A = path.join(ROOT, 'mobile/bible-assets'), W = path.join(ROOT, 'brand/daily-bible/web');
  await shot(1024, 1024, icon(1024), path.join(A, 'icon-only.png'));
  await shot(1024, 1024, `<div style="width:1024px;height:1024px;display:grid;place-items:center;color:#50555A">${mark.replace('<svg ', '<svg width="560" height="556" ')}</div>`, path.join(A, 'icon-foreground.png'), true);
  await shot(1024, 1024, '', path.join(A, 'icon-background.png'));
  await shot(2732, 2732, `<div style="width:2732px;height:2732px;display:grid;place-items:center;position:relative">${word(150)}<span style="position:absolute;left:0;right:0;bottom:190px;text-align:center;font:300 40px 'Noto Sans KR',-apple-system,sans-serif;letter-spacing:.02em;color:#A4A9AC">© 2026 Daily Journey, Inc.</span></div>`, path.join(A, 'splash.png'));
  await shot(180, 180, icon(180), path.join(W, 'apple-touch-icon.png'));
  await shot(64, 64, icon(64), path.join(W, 'favicon.png'));
  await shot(1200, 630, `<div style="width:1200px;height:630px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;color:#50555A">${mark.replace('<svg ', '<svg width="120" height="119" ')}${word(104)}</div>`, path.join(W, 'og.png'));
  fs.copyFileSync(path.join(ROOT, 'brand/daily-bible/icon.svg'), path.join(W, 'icon.svg'));
  await b.close(); console.log('brand files written');
})();
