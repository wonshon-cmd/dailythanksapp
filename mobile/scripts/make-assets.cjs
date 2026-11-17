// Daily Bible app icons and launch screen.
// Source: brand/daily-bible/icon.svg + icon-mark.svg (open book, grey line, on white) and the splash from tools/bible-brand.cjs.
// Writes:
//   store/icons/bible-appstore-1024.png         App Store icon (opaque, no alpha)
//   store/icons/bible-play-512.png              Google Play icon
//   store/icons/bible-android-foreground-432.png Android adaptive-icon foreground (transparent)
//   mobile/assets/*                              sources for `npm run assets` (@capacitor/assets → ios/ and android/)
// Usage: node ../tools/bible-brand.cjs (only if the brand changed) && node scripts/make-assets.cjs && npm run assets
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const root = path.resolve(__dirname, '../..'), out = path.resolve(__dirname, '../assets'), icons = path.join(root, 'store/icons');
const SVG = fs.readFileSync(path.join(root, 'brand/daily-bible/icon.svg'), 'utf8');
const MARK = fs.readFileSync(path.join(root, 'brand/daily-bible/icon-mark.svg'), 'utf8');
const GREY = '#50555A';
(async () => {
  fs.mkdirSync(out, { recursive: true }); fs.mkdirSync(icons, { recursive: true });
  const b = await chromium.launch(), p = await b.newPage({ deviceScaleFactor: 1 });
  const shot = async (html, file, w, h, transparent) => {
    await p.setViewportSize({ width: w, height: h });
    await p.setContent(`<!doctype html><html><head><style>*{margin:0}svg{display:block}html,body{width:${w}px;height:${h}px;background:${transparent ? 'transparent' : '#FFFFFF'}}</style></head><body>${html}</body></html>`);
    await p.screenshot({ path: file, omitBackground: !!transparent });
  };
  const icon = s => SVG.replace('<svg ', `<svg width="${s}" height="${s}" `);
  // Adaptive foreground: the book alone on transparent, sized so it stays inside the circular mask (66% safe zone).
  const fg = s => `<div style="width:${s}px;height:${s}px;display:grid;place-items:center;color:${GREY}">${MARK.replace('<svg ', `<svg width="${Math.round(s * .68)}" height="${Math.round(s * .68 * 620 / 624)}" `)}</div>`;

  await shot(icon(1024), path.join(icons, 'bible-appstore-1024.png'), 1024, 1024);
  await shot(icon(512), path.join(icons, 'bible-play-512.png'), 512, 512);
  await shot(fg(432), path.join(icons, 'bible-android-foreground-432.png'), 432, 432, true);

  fs.copyFileSync(path.join(icons, 'bible-appstore-1024.png'), path.join(out, 'icon-only.png'));
  await shot(fg(1024), path.join(out, 'icon-foreground.png'), 1024, 1024, true);
  await shot('', path.join(out, 'icon-background.png'), 1024, 1024);
  // Launch screen: white + "daily bible" wordmark + copyright, the same as the in-app splash (made by tools/bible-brand.cjs).
  // The app is white in dark mode too, so splash-dark is the same image.
  for (const f of ['splash.png', 'splash-dark.png']) fs.copyFileSync(path.join(root, 'mobile/bible-assets/splash.png'), path.join(out, f));
  await b.close();
  console.log('wrote', fs.readdirSync(out).join(' '), '| store/icons/bible-*');
})();
