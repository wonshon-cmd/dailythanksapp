// Source images for `npm run assets` (@capacitor/assets): icon from store/icons, launch screen = white + wordmark.
// Usage: node scripts/make-assets.cjs && npm run assets
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const root = path.resolve(__dirname, '../..'), out = path.resolve(__dirname, '../assets');
(async () => {
  fs.mkdirSync(out, { recursive: true });
  fs.copyFileSync(path.join(root, 'store/icons/appstore-1024.png'), path.join(out, 'icon-only.png'));
  const b = await chromium.launch(), p = await b.newPage();
  const shot = async (html, file, w, h, transparent) => {
    await p.setViewportSize({ width: w, height: h });
    await p.setContent(`<!doctype html><html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&display=swap">
      <style>*{margin:0}html,body{width:${w}px;height:${h}px;background:${transparent ? 'transparent' : '#FFFFFF'}}</style></head><body>${html}</body></html>`);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(out, file), omitBackground: !!transparent });
  };
  // Launch screen: the same wordmark as the first in-app splash, so the hand-off is seamless.
  const mark = `<div style="width:100%;height:100%;display:grid;place-items:center"><span style="font-family:Newsreader,serif;font-size:190px;letter-spacing:-.025em;color:#16191C">daily <em>thanks</em></span></div>`;
  await shot(mark, 'splash.png', 2732, 2732);
  await shot(mark, 'splash-dark.png', 2732, 2732);
  // Android adaptive icon: white background + the store icon shrunk into the safe zone.
  const icon = 'data:image/png;base64,' + fs.readFileSync(path.join(root, 'store/icons/appstore-1024.png')).toString('base64');
  await shot(`<img src="${icon}" style="display:block;width:1024px;height:1024px;transform:scale(.72);transform-origin:center">`, 'icon-foreground.png', 1024, 1024, true);
  await shot('', 'icon-background.png', 1024, 1024);
  await b.close();
  console.log(fs.readdirSync(out).join(' '));
})();
