// Daily Journey app icons and launch screen (the Bible app; white, grey line, no colour fills).
// Icon: the open-book mark from brand/daily-bible/icon.svg + icon-mark.svg. Launch screen: white + "daily journey" wordmark + copyright.
// Writes:
//   store/icons/journey-appstore-1024.png          App Store icon (opaque, no alpha)
//   store/icons/journey-play-512.png               Google Play icon
//   store/icons/journey-android-foreground-432.png Android adaptive-icon foreground (transparent)
//   mobile/assets/*                                 sources for `npm run assets` (@capacitor/assets)
//   with --native: also redraws the icons and splash images already in ios/ and android/ (same sizes), so no npm install is needed.
// Usage: node scripts/make-assets.cjs --native      (or without --native, then `npm run assets`)
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const root = path.resolve(__dirname, '../..'), mobile = path.resolve(__dirname, '..'), out = path.join(mobile, 'assets'), icons = path.join(root, 'store/icons');
const SVG = fs.readFileSync(path.join(root, 'brand/daily-bible/icon.svg'), 'utf8');
const MARK = fs.readFileSync(path.join(root, 'brand/daily-bible/icon-mark.svg'), 'utf8');
const GREY = '#50555A', WORD = 'journey';
const FONT = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=Noto+Sans+KR:wght@300&display=swap">';
const pngSize = f => { const b = fs.readFileSync(f); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
(async () => {
  fs.mkdirSync(out, { recursive: true }); fs.mkdirSync(icons, { recursive: true });
  const b = await chromium.launch(), p = await b.newPage({ deviceScaleFactor: 1 });
  const shot = async (html, file, w, h, transparent) => {
    await p.setViewportSize({ width: w, height: h });
    await p.setContent(`<!doctype html><html><head>${FONT}<style>*{margin:0}svg,img{display:block}html,body{width:${w}px;height:${h}px;overflow:hidden;background:${transparent ? 'transparent' : '#FFFFFF'}}</style></head><body>${html}</body></html>`);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
    await p.screenshot({ path: file, omitBackground: !!transparent });
  };
  const icon = s => SVG.replace('<svg ', `<svg width="${s}" height="${s}" `);
  // Adaptive foreground: the book alone on transparent, sized to stay inside the circular mask (66% safe zone).
  const fg = s => `<div style="width:${s}px;height:${s}px;display:grid;place-items:center;color:${GREY}">${MARK.replace('<svg ', `<svg width="${Math.round(s * .68)}" height="${Math.round(s * .68 * 620 / 624)}" `)}</div>`;
  // Launch screen, scaled by the short side (same layout as the in-app splash).
  const splash = (w, h) => { const k = Math.min(w, h) / 2732; return `<div style="width:${w}px;height:${h}px;display:grid;place-items:center;position:relative">
    <span style="font-family:Newsreader,Georgia,serif;font-size:${150 * k}px;letter-spacing:-.025em;color:#383D42;white-space:nowrap">daily <em>${WORD}</em></span>
    ${Math.min(w, h) >= 600 ? `<span style="position:absolute;left:0;right:0;bottom:${190 * k}px;text-align:center;font:300 ${40 * k}px 'Noto Sans KR',-apple-system,sans-serif;letter-spacing:.02em;color:#A4A9AC">© 2026 Daily Journey, Inc.</span>` : ''}</div>`; };

  await shot(icon(1024), path.join(icons, 'journey-appstore-1024.png'), 1024, 1024);
  await shot(icon(512), path.join(icons, 'journey-play-512.png'), 512, 512);
  await shot(fg(432), path.join(icons, 'journey-android-foreground-432.png'), 432, 432, true);
  fs.copyFileSync(path.join(icons, 'journey-appstore-1024.png'), path.join(out, 'icon-only.png'));
  await shot(fg(1024), path.join(out, 'icon-foreground.png'), 1024, 1024, true);
  await shot('', path.join(out, 'icon-background.png'), 1024, 1024);
  await shot(splash(2732, 2732), path.join(out, 'splash.png'), 2732, 2732);
  fs.copyFileSync(path.join(out, 'splash.png'), path.join(out, 'splash-dark.png')); // the app stays white in dark mode

  if (process.argv.includes('--native')) {
    const res = path.join(mobile, 'android/app/src/main/res'), ios = path.join(mobile, 'ios/App/App/Assets.xcassets');
    const data = f => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
    const only = data(path.join(out, 'icon-only.png')), fore = data(path.join(out, 'icon-foreground.png'));
    for (const f of walk(res).filter(f => f.endsWith('.png'))) {
      const [w, h] = pngSize(f), name = path.basename(f), pad = Math.round(w * 8 / 192);
      if (name === 'splash.png') await shot(splash(w, h), f, w, h);
      else if (name === 'ic_launcher.png') await shot(`<img src="${only}" style="margin:${pad}px;width:${w - 2 * pad}px;height:${w - 2 * pad}px;border-radius:12%">`, f, w, h, true);
      else if (name === 'ic_launcher_round.png') await shot(`<img src="${only}" style="width:${w}px;height:${w}px;border-radius:50%">`, f, w, h, true);
      else if (name === 'ic_launcher_foreground.png') await shot(`<img src="${fore}" style="width:${w}px;height:${w}px">`, f, w, h, true);
      else if (name === 'ic_launcher_background.png') await shot('', f, w, h);
    }
    for (const f of walk(ios).filter(f => f.endsWith('.png'))) {
      const [w, h] = pngSize(f);
      if (f.includes('AppIcon')) await shot(`<img src="${only}" style="width:${w}px;height:${h}px">`, f, w, h);
      else if (f.includes('Splash')) await shot(splash(w, h), f, w, h);
    }
    console.log('native icons and splash redrawn');
  }
  await b.close();
  console.log('wrote', fs.readdirSync(out).join(' '), '| store/icons/journey-*');
})();
