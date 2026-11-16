// 66 books of the Protestant canon: id (OSIS-style), Korean name, Korean short form, English name, extra aliases.
// Used to parse references typed by users or spoken in sermons. No copyrighted Bible text lives here.
export const BOOKS = [
  ['Gen', '창세기', '창', 'Genesis', ['gn', 'ge']],
  ['Exod', '출애굽기', '출', 'Exodus', ['ex', 'exo']],
  ['Lev', '레위기', '레', 'Leviticus', ['lv']],
  ['Num', '민수기', '민', 'Numbers', ['nm', 'nu']],
  ['Deut', '신명기', '신', 'Deuteronomy', ['dt', 'deu']],
  ['Josh', '여호수아', '수', 'Joshua', ['jos']],
  ['Judg', '사사기', '삿', 'Judges', ['jdg', 'jg']],
  ['Ruth', '룻기', '룻', 'Ruth', ['ru']],
  ['1Sam', '사무엘상', '삼상', '1 Samuel', ['1sa', '1 sam']],
  ['2Sam', '사무엘하', '삼하', '2 Samuel', ['2sa', '2 sam']],
  ['1Kgs', '열왕기상', '왕상', '1 Kings', ['1ki', '1 kgs']],
  ['2Kgs', '열왕기하', '왕하', '2 Kings', ['2ki', '2 kgs']],
  ['1Chr', '역대상', '대상', '1 Chronicles', ['1ch', '1 chr']],
  ['2Chr', '역대하', '대하', '2 Chronicles', ['2ch', '2 chr']],
  ['Ezra', '에스라', '스', 'Ezra', ['ezr']],
  ['Neh', '느헤미야', '느', 'Nehemiah', ['ne']],
  ['Esth', '에스더', '에', 'Esther', ['est']],
  ['Job', '욥기', '욥', 'Job', ['jb']],
  ['Ps', '시편', '시', 'Psalms', ['psalm', 'psa', 'pss']],
  ['Prov', '잠언', '잠', 'Proverbs', ['pr', 'prv']],
  ['Eccl', '전도서', '전', 'Ecclesiastes', ['ecc', 'qoh']],
  ['Song', '아가', '아', 'Song of Songs', ['song of solomon', 'sos', 'sng']],
  ['Isa', '이사야', '사', 'Isaiah', ['is']],
  ['Jer', '예레미야', '렘', 'Jeremiah', ['je', 'jr']],
  ['Lam', '예레미야애가', '애', 'Lamentations', ['la']],
  ['Ezek', '에스겔', '겔', 'Ezekiel', ['eze', 'ezk']],
  ['Dan', '다니엘', '단', 'Daniel', ['dn', 'da']],
  ['Hos', '호세아', '호', 'Hosea', ['ho']],
  ['Joel', '요엘', '욜', 'Joel', ['jl']],
  ['Amos', '아모스', '암', 'Amos', ['am']],
  ['Obad', '오바댜', '옵', 'Obadiah', ['ob']],
  ['Jonah', '요나', '욘', 'Jonah', ['jon']],
  ['Mic', '미가', '미', 'Micah', ['mi']],
  ['Nah', '나훔', '나', 'Nahum', ['na']],
  ['Hab', '하박국', '합', 'Habakkuk', ['hb']],
  ['Zeph', '스바냐', '습', 'Zephaniah', ['zep', 'zp']],
  ['Hag', '학개', '학', 'Haggai', ['hg']],
  ['Zech', '스가랴', '슥', 'Zechariah', ['zec', 'zc']],
  ['Mal', '말라기', '말', 'Malachi', ['ml']],
  ['Matt', '마태복음', '마', 'Matthew', ['mt', 'mat']],
  ['Mark', '마가복음', '막', 'Mark', ['mk', 'mrk']],
  ['Luke', '누가복음', '눅', 'Luke', ['lk', 'luk']],
  ['John', '요한복음', '요', 'John', ['jn', 'jhn']],
  ['Acts', '사도행전', '행', 'Acts', ['ac']],
  ['Rom', '로마서', '롬', 'Romans', ['ro', 'rm']],
  ['1Cor', '고린도전서', '고전', '1 Corinthians', ['1co', '1 cor']],
  ['2Cor', '고린도후서', '고후', '2 Corinthians', ['2co', '2 cor']],
  ['Gal', '갈라디아서', '갈', 'Galatians', ['ga']],
  ['Eph', '에베소서', '엡', 'Ephesians', ['ep']],
  ['Phil', '빌립보서', '빌', 'Philippians', ['php', 'pp']],
  ['Col', '골로새서', '골', 'Colossians', ['co']],
  ['1Thess', '데살로니가전서', '살전', '1 Thessalonians', ['1th', '1 thess']],
  ['2Thess', '데살로니가후서', '살후', '2 Thessalonians', ['2th', '2 thess']],
  ['1Tim', '디모데전서', '딤전', '1 Timothy', ['1ti', '1 tim']],
  ['2Tim', '디모데후서', '딤후', '2 Timothy', ['2ti', '2 tim']],
  ['Titus', '디도서', '딛', 'Titus', ['tit']],
  ['Phlm', '빌레몬서', '몬', 'Philemon', ['phm']],
  ['Heb', '히브리서', '히', 'Hebrews', ['he']],
  ['Jas', '야고보서', '약', 'James', ['jm']],
  ['1Pet', '베드로전서', '벧전', '1 Peter', ['1pe', '1 pet']],
  ['2Pet', '베드로후서', '벧후', '2 Peter', ['2pe', '2 pet']],
  ['1John', '요한일서', '요일', '1 John', ['1jn', '1 jn']],
  ['2John', '요한이서', '요이', '2 John', ['2jn', '2 jn']],
  ['3John', '요한삼서', '요삼', '3 John', ['3jn', '3 jn']],
  ['Jude', '유다서', '유', 'Jude', ['jud']],
  ['Rev', '요한계시록', '계', 'Revelation', ['re', 'rv', 'revelations']]
].map(([id, ko, koShort, en, aliases], index) => ({ id, ko, koShort, en, aliases, order: index + 1 }));

const norm = s => s.toLowerCase().replace(/\s+/g, ' ').replace(/\.$/, '').trim();

// name/alias -> book, longest names first so "요한일서" wins over "요".
const LOOKUP = new Map();
for (const b of BOOKS) {
  for (const name of [b.ko, b.koShort, b.en, b.id, ...b.aliases]) LOOKUP.set(norm(name), b);
  LOOKUP.set(norm(b.en.replace(/^(\d) /, '$1')), b); // "1samuel"
}
export const BOOK_NAMES_BY_LENGTH = [...LOOKUP.keys()].sort((a, b) => b.length - a.length);

export function findBook(name) {
  return LOOKUP.get(norm(String(name || ''))) || null;
}

export function bookById(id) {
  return BOOKS.find(b => b.id === id) || null;
}
