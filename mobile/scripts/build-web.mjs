// Copies the web app from the repo root into mobile/www and adds the native bridge.
// The web app stays the single source of truth: edit index.html / styles.css / app.js at the root, then `npm run sync`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const www = path.resolve(here, '../www');
fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(path.join(www, 'i18n'), { recursive: true });

for (const f of ['styles.css', 'app.js']) fs.copyFileSync(path.join(root, f), path.join(www, f));
for (const f of fs.readdirSync(path.join(root, 'i18n'))) fs.copyFileSync(path.join(root, 'i18n', f), path.join(www, 'i18n', f));
fs.copyFileSync(path.resolve(here, '../src/native.js'), path.join(www, 'native.js'));

// native.js must run before app.js (it sets the content URL and fills in share/notification APIs).
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (!html.includes('<script src="app.js"')) throw new Error('index.html: app.js script tag not found');
html = html.replace('<script src="app.js"', '<script src="native.js"></script>\n<script src="app.js"');
fs.writeFileSync(path.join(www, 'index.html'), html);
console.log('web app copied to', path.relative(process.cwd(), www));
