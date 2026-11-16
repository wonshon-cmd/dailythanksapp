import { BOOK_NAMES_BY_LENGTH, findBook, bookById } from './books.js';

/**
 * Parse a human-typed Bible reference.
 *   "요한복음 3:1~15", "요 3:1-15", "요3:16", "요한복음 3장 1-15절", "John 3:16", "1 Cor 13", "Ps 23:1-6", "John 3:36-4:6"
 * Returns { book, chapter, verse, chapterEnd, verseEnd } (verse fields null for whole chapters) or null.
 */
export function parseReference(input) {
  const text = String(input || '').trim().replace(/[～〜–—]/g, '~').replace(/\s+/g, ' ');
  if (!text) return null;
  const lower = text.toLowerCase();

  let book = null, rest = '';
  for (const name of BOOK_NAMES_BY_LENGTH) {
    if (lower.startsWith(name)) {
      const after = text.slice(name.length);
      // the book name must end at a space, a digit or the end ("요3:16" ok, "요엘" must not match "요")
      if (after === '' || /^[\s.\d]/.test(after)) { book = findBook(name); rest = after.replace(/^\.?\s*/, ''); break; }
    }
  }
  if (!book) return null;

  // Korean style "3장 1-15절" -> "3:1-15"
  rest = rest.replace(/(\d+)\s*[장편]\s*(\d+)/, '$1:$2').replace(/(\d+)\s*[장편]/, '$1').replace(/절/g, '').replace(/\s+/g, '');

  const m = rest.match(/^(\d+)(?::(\d+))?(?:[-~](\d+)(?::(\d+))?)?$/);
  if (!m) return null;
  const chapter = +m[1];
  let verse = m[2] ? +m[2] : null, chapterEnd = chapter, verseEnd = verse;
  if (m[3]) {
    if (m[4]) { chapterEnd = +m[3]; verseEnd = +m[4]; }          // 3:36-4:6
    else if (verse != null) verseEnd = +m[3];                      // 3:1-15
    else { chapterEnd = +m[3]; verse = null; verseEnd = null; }    // 3-4 (whole chapters)
  }
  if (chapter < 1 || chapterEnd < chapter || (verse != null && chapterEnd === chapter && verseEnd < verse)) return null;
  return { book: book.id, chapter, verse, chapterEnd, verseEnd };
}

/** Format a parsed reference for display: ko "요한복음 3:1~15", en "John 3:1–15". */
export function formatReference(ref, lang = 'ko') {
  const b = bookById(ref.book);
  if (!b) return '';
  const name = lang === 'en' ? b.en : b.ko;
  const dash = lang === 'en' ? '–' : '~';
  let s = `${name} ${ref.chapter}`;
  if (ref.verse != null) s += `:${ref.verse}`;
  if (ref.chapterEnd !== ref.chapter) s += `${dash}${ref.chapterEnd}${ref.verseEnd != null ? ':' + ref.verseEnd : ''}`;
  else if (ref.verseEnd != null && ref.verseEnd !== ref.verse) s += `${dash}${ref.verseEnd}`;
  return s;
}

/** Number of verses a reference covers within one chapter (null when it spans chapters / whole chapters). */
export function verseCount(ref) {
  if (ref.verse == null || ref.chapterEnd !== ref.chapter) return null;
  return ref.verseEnd - ref.verse + 1;
}
