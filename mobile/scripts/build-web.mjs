// Copies the web app from the repo root into mobile/www as Daily Journey (the Bible app) and adds the native bridge.
// The web app stays the single source of truth: edit index.html / styles.css / app.js at the root, then `npm run sync`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const www = path.resolve(here, '../www');
fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(path.join(www, 'i18n'), { recursive: true });

for (const f of ['styles.css', 'app.js', 'qrcode.js']) fs.copyFileSync(path.join(root, f), path.join(www, f));
for (const f of fs.readdirSync(path.join(root, 'i18n'))) fs.copyFileSync(path.join(root, 'i18n', f), path.join(www, 'i18n', f));
fs.copyFileSync(path.resolve(here, '../src/native.js'), path.join(www, 'native.js'));
// Bible text travels with the app, so read-through works offline.
if (fs.existsSync(path.join(root, 'bible'))) fs.cpSync(path.join(root, 'bible'), path.join(www, 'bible'), { recursive: true });

// This shell ships the Bible app: the same web app in Bible mode (window.DT_APP = "bible", as build-site.py does for /daily-bible/).
// native.js must run before app.js (it sets the content URL and fills in share/notification APIs).
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (!html.includes('<script src="app.js"')) throw new Error('index.html: app.js script tag not found');
// Brand: Daily Journey by default (window.DT_BRAND = "journey", read by app.js; its links then go to dailyjourney.org).
// APP_BRAND=bible npm run sync → shows it as "daily bible" instead. Switching the store name also means appId/appName (capacitor.config.json, android/, ios/), icons and listing.
const brand = (process.env.APP_BRAND || 'journey').toLowerCase();
if (!['bible', 'journey'].includes(brand)) throw new Error(`APP_BRAND must be "bible" or "journey", not "${brand}"`);
const NAME = brand === 'journey' ? 'Daily Journey' : 'Daily Bible';
const flags = '<script>window.DT_APP = "bible";' + (brand === 'journey' ? ' window.DT_BRAND = "journey";' : '') + '</script>';
// The version of the app.js + styles.css inside the app (same formula as tools/build-site.py's app-update.json),
// so native.js knows whether dailyjourney.org has something newer. native.js loads app.js itself (its own copy, or a newer one).
const bundledV = crypto.createHash('sha1').update(Buffer.concat(['app.js', 'styles.css'].map(f => fs.readFileSync(path.join(root, f))))).digest('hex').slice(0, 10);
html = html.replace('<script src="app.js" defer></script>', `${flags.replace('</script>', ` window.DT_BUNDLED_V = "${bundledV}";</script>`)}\n<script src="native.js"></script>`);
if (html.includes('<script src="app.js"')) throw new Error('index.html: app.js tag still there');
html = html.replace(/<title>[^<]*<\/title>/, `<title>${NAME}</title>`)
  .replace(/(name="apple-mobile-web-app-title" content=")[^"]*"/, `$1${NAME}"`)
  .replace(/(name="description" content=")[^"]*"/, `$1${NAME} — 말씀을 매일"`);
fs.writeFileSync(path.join(www, 'index.html'), html);
console.log(`web app copied to ${path.relative(process.cwd(), www)} as ${NAME}`);
