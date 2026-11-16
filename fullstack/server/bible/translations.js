import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const BIBLE_DIR = path.resolve(here, '../../data/bibles');

/**
 * Translation registry. A translation is served only when `status` is 'open' (public domain / open licence)
 * or when it is 'licensed' AND its env flag says the licence agreement is in place.
 * Everything else stays listed (so the UI/admin can see it) but returns no text.
 * See docs/LICENSING_AND_PARTNERS_KO.md before changing any status.
 */
export const TRANSLATIONS = [
  // Korean
  { id: 'krv', lang: 'ko', name: '개역한글', status: 'open', note: '보호기간 만료로 알려져 있음 — 출시 전 현재 상태 재확인 필요' },
  { id: 'rnksv', lang: 'ko', name: '개역개정', status: 'licensed', owner: '대한성서공회', licenseEnv: 'LICENSE_RNKSV' },
  { id: 'rnkv', lang: 'ko', name: '새번역', status: 'licensed', owner: '대한성서공회', licenseEnv: 'LICENSE_RNKV' },
  { id: 'woorimal', lang: 'ko', name: '우리말성경', status: 'licensed', owner: '두란노서원', licenseEnv: 'LICENSE_WOORIMAL' },
  // English
  { id: 'web', lang: 'en', name: 'World English Bible', status: 'open', note: 'Public domain' },
  { id: 'kjv', lang: 'en', name: 'King James Version', status: 'open', note: 'Public domain (outside the UK)' },
  { id: 'bsb', lang: 'en', name: 'Berean Standard Bible', status: 'open', note: 'Public domain' },
  { id: 'niv', lang: 'en', name: 'New International Version', status: 'licensed', owner: 'Biblica / Zondervan / Hodder', licenseEnv: 'LICENSE_NIV' },
  { id: 'esv', lang: 'en', name: 'English Standard Version', status: 'licensed', owner: 'Crossway', licenseEnv: 'LICENSE_ESV' }
];

export function isServable(t, env = process.env) {
  if (!t) return false;
  if (t.status === 'open') return true;
  return t.status === 'licensed' && env[t.licenseEnv] === 'granted';
}

export function listTranslations(env = process.env) {
  return TRANSLATIONS.map(t => ({ id: t.id, lang: t.lang, name: t.name, status: t.status, owner: t.owner || null, available: isServable(t, env) && hasData(t.id), note: t.note || null }));
}

const cache = new Map();
function hasData(id) { return fs.existsSync(path.join(BIBLE_DIR, `${id}.json`)); }

/**
 * Data file format (data/bibles/<id>.json):  { "John": { "3": { "16": "verse text", ... } }, ... }
 * Only sample verses ship with this repo; drop in full public-domain files to enable more.
 */
function load(id) {
  if (!cache.has(id)) {
    const file = path.join(BIBLE_DIR, `${id}.json`);
    cache.set(id, fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null);
  }
  return cache.get(id);
}

/** Return [{ chapter, verse, text }] for a parsed reference, or an error object explaining why not. */
export function getPassageText(ref, translationId, env = process.env) {
  const t = TRANSLATIONS.find(x => x.id === translationId);
  if (!t) return { error: 'unknown_translation' };
  if (!isServable(t, env)) return { error: 'license_required', owner: t.owner };
  const bible = load(t.id);
  if (!bible || !bible[ref.book]) return { error: 'text_not_installed' };
  const verses = [];
  for (let c = ref.chapter; c <= ref.chapterEnd; c++) {
    const ch = bible[ref.book][String(c)] || {};
    const nums = Object.keys(ch).map(Number).sort((a, b) => a - b);
    for (const v of nums) {
      if (c === ref.chapter && ref.verse != null && v < ref.verse) continue;
      if (c === ref.chapterEnd && ref.verseEnd != null && v > ref.verseEnd) continue;
      verses.push({ chapter: c, verse: v, text: ch[v] });
    }
  }
  return verses.length ? { translation: { id: t.id, name: t.name }, verses } : { error: 'text_not_installed' };
}
