import { BOOKS } from './books.js';
import { parseReference, formatReference } from './reference.js';

const DIGITS = { 영: 0, 공: 0, 일: 1, 이: 2, 삼: 3, 사: 4, 오: 5, 육: 6, 륙: 6, 칠: 7, 팔: 8, 구: 9 };
const UNITS = { 십: 10, 백: 100 };

/** Sino-Korean number words or digits -> integer. "삼" 3, "십육" 16, "백오십" 150, "16" 16. */
export function koreanNumber(word) {
  const w = String(word).replace(/\s+/g, '');
  if (/^\d+$/.test(w)) return +w;
  let total = 0, current = 0;
  for (const ch of w) {
    if (ch in DIGITS) current = DIGITS[ch];
    else if (ch in UNITS) { total += (current || 1) * UNITS[ch]; current = 0; }
    else return null;
  }
  return total + current;
}

const NUM = '[0-9영공일이삼사오육륙칠팔구십백\\s]+?';
const bookPattern = BOOKS.flatMap(b => [b.ko]).sort((a, b) => b.length - a.length).join('|');
// e.g. "요한복음 삼 장 십육 절", "요한복음 3장 1절부터 15절까지", "시편 이십삼 편"
const SPOKEN = new RegExp(
  `(${bookPattern})\\s*(${NUM})\\s*(?:장|편)\\s*(?:(${NUM})\\s*절)?(?:\\s*(?:부터|에서)\\s*(${NUM})\\s*절\\s*(?:까지)?)?`,
  'g'
);

/**
 * Find spoken references in a Korean transcript and return them normalised:
 * [{ spoken: "요한복음 삼 장 십육 절", ref: {...}, label: "요한복음 3:16" }]
 */
export function findSpokenReferences(transcript) {
  const out = [];
  for (const m of String(transcript || '').matchAll(SPOKEN)) {
    const chapter = koreanNumber(m[2]);
    const verse = m[3] ? koreanNumber(m[3]) : null;
    const verseEnd = m[4] ? koreanNumber(m[4]) : null;
    if (!chapter) continue;
    const text = `${m[1]} ${chapter}${verse ? ':' + verse : ''}${verse && verseEnd ? '-' + verseEnd : ''}`;
    const ref = parseReference(text);
    if (ref) out.push({ spoken: m[0].trim(), ref, label: formatReference(ref, 'ko') });
  }
  return out;
}
