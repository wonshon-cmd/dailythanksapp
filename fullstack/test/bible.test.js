import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseReference, formatReference } from '../server/bible/reference.js';
import { findSpokenReferences, koreanNumber } from '../server/bible/spoken.js';
import { getPassageText, listTranslations } from '../server/bible/translations.js';

test('parses Korean and English references', () => {
  const cases = {
    '요한복음 3:1~15': { book: 'John', chapter: 3, verse: 1, chapterEnd: 3, verseEnd: 15 },
    '요 3:16': { book: 'John', chapter: 3, verse: 16, chapterEnd: 3, verseEnd: 16 },
    '요3:16': { book: 'John', chapter: 3, verse: 16, chapterEnd: 3, verseEnd: 16 },
    '요한복음 3장 1-15절': { book: 'John', chapter: 3, verse: 1, chapterEnd: 3, verseEnd: 15 },
    '요엘 2:28': { book: 'Joel', chapter: 2, verse: 28, chapterEnd: 2, verseEnd: 28 },
    '요한일서 4:8': { book: '1John', chapter: 4, verse: 8, chapterEnd: 4, verseEnd: 8 },
    'John 3:36-4:6': { book: 'John', chapter: 3, verse: 36, chapterEnd: 4, verseEnd: 6 },
    '1 Cor 13': { book: '1Cor', chapter: 13, verse: null, chapterEnd: 13, verseEnd: null },
    'Ps 23:1–6': { book: 'Ps', chapter: 23, verse: 1, chapterEnd: 23, verseEnd: 6 },
    '시편 23편': { book: 'Ps', chapter: 23, verse: null, chapterEnd: 23, verseEnd: null }
  };
  for (const [input, expected] of Object.entries(cases)) assert.deepEqual(parseReference(input), expected, input);
  assert.equal(parseReference('hello 3:16'), null);
  assert.equal(parseReference('요 3:16-2'), null);
});

test('formats references per language', () => {
  const ref = parseReference('요 3:1-15');
  assert.equal(formatReference(ref, 'ko'), '요한복음 3:1~15');
  assert.equal(formatReference(ref, 'en'), 'John 3:1–15');
});

test('reads spoken Korean numbers and references', () => {
  assert.equal(koreanNumber('삼'), 3);
  assert.equal(koreanNumber('십육'), 16);
  assert.equal(koreanNumber('이십일'), 21);
  assert.equal(koreanNumber('백오십'), 150);
  const found = findSpokenReferences('오늘 말씀은 요한복음 삼 장 일 절부터 십오 절까지입니다. 민수기 이십일 장에서 모세가');
  assert.deepEqual(found.map(f => f.label), ['요한복음 3:1~15', '민수기 21']);
});

test('serves only open or licensed translations', () => {
  const ref = parseReference('요 3:16');
  assert.match(getPassageText(ref, 'krv', {}).verses[0].text, /독생자/);
  assert.equal(getPassageText(ref, 'niv', {}).error, 'license_required');
  assert.equal(getPassageText(ref, 'woorimal', {}).error, 'license_required');
  assert.equal(getPassageText(ref, 'niv', { LICENSE_NIV: 'granted' }).error, 'text_not_installed');
  const niv = listTranslations({}).find(t => t.id === 'niv');
  assert.equal(niv.available, false);
});
