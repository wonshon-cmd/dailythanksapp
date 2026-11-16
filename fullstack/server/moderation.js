// Server-side language filter. Same rules as the app (app.js "language filter"), but this copy is the one
// that counts: a modified client can skip its own check, the server cannot be skipped.
// Keep the two word lists in sync (or move both to a shared file once the app has a build step).
export const BLOCKED_TERMS = [
  // Korean (matched after removing spaces, digits and symbols, so "씨 1발" is caught too)
  '씨발', '시발', '씨팔', '쌍놈', '썅', 'ㅅㅂ', 'ㅆㅂ', 'ㅂㅅ', '병신', '븅신', '개새끼', '개색끼', '개쉐이', '좆', '존나', '졸라', 'ㅈㄴ', '지랄', 'ㅈㄹ',
  '미친놈', '미친년', '미친새끼', '닥쳐', '꺼져', '엿먹어', '개같은', '염병', '니미', '느금마', '니애미', '애미뒤', '죽어버려', '뒤져라', '창녀', '걸레년',
  // English
  'fuck', 'fck', 'fuk', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'motherfucker', 'slut', 'whore', 'retard', 'nigger', 'nigga', 'faggot', 'killyourself', 'kys'
];
const LEET = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's', '!': 'i', '*': '' };
// Korean: keep only Hangul (so "씨 1발", "씨.발" match). English: undo leetspeak, keep only a-z.
const flatKo = s => String(s).replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ]/g, '');
const flatEn = s => String(s).toLowerCase().replace(/[013457@$!*]/g, c => LEET[c]).replace(/[^a-z]/g, '');
const isKo = term => /[가-힣ㄱ-ㅎ]/.test(term);
const SHORT_EN = new Set(['dick', 'kys', 'fck', 'fuk']); // only as whole words, to avoid "dickens", "skys"…
// Ordinary words that happen to contain a blocked term ("시발점" = starting point, "Scunthorpe").
const ALLOWED_WORDS = ['시발점', '시발역', '시발택시', '기시발', 'scunthorpe', 'cocktail', 'shittake', 'dickens', 'hancock'];
export function flaggedTerms(raw) {
  let text = String(raw).toLowerCase();
  for (const w of ALLOWED_WORDS) text = text.split(w).join(' ');
  const ko = flatKo(text), en = flatEn(text), words = String(text).toLowerCase().split(/[^a-z0-9@$!*]+/).map(flatEn);
  return BLOCKED_TERMS.filter(term => isKo(term) ? ko.includes(term) : SHORT_EN.has(term) ? words.includes(term) : en.includes(term));
}
