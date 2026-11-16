// Render app icons from the brand sun glyph. Run: node tools/make-icons.js  (needs Playwright)
const { chromium } = require('playwright');
const path = require('path');
const out = path.resolve(__dirname, '../store/icons');
const SUN = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>';
const page = (size, opts = {}) => `<!doctype html><html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@1,6..72,400&display=swap"></head>
<body style="margin:0;width:${size}px;height:${size}px;background:${opts.transparent ? 'transparent' : '#FFFFFF'};display:grid;place-items:center;overflow:hidden">
  ${opts.letter
    ? `<div style="position:relative;font-family:Newsreader,Georgia,serif;font-style:italic;font-size:${size * .62}px;line-height:1;color:#4E5459;transform:translateY(-${size * .03}px)">t</div>`
    : `<svg viewBox="0 0 24 24" style="position:relative;width:${size * (opts.scale || .56)}px;height:${size * (opts.scale || .56)}px" fill="none" stroke="#4E5459" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">${SUN}</svg>`}
</body></html>`;
(async () => {
  const b = await chromium.launch();
  const shot = async (file, size, opts) => {
    const p = await b.newPage({ viewport: { width: size, height: size } });
    await p.setContent(page(size, opts)); await p.waitForTimeout(800);
    await p.screenshot({ path: path.join(out, file), omitBackground: !!opts?.transparent });
    await p.close();
  };
  await shot('appstore-1024.png', 1024, {});                       // App Store (opaque, square; iOS rounds corners)
  await shot('play-512.png', 512, {});                             // Google Play listing icon
  await shot('android-foreground-432.png', 432, { transparent: true, scale: .40 }); // adaptive icon foreground (safe zone)
  await shot('alt-letter-1024.png', 1024, { letter: true });       // alternative: italic "t"
  await b.close();
})();
