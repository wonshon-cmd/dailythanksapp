import { BOOKS } from '../bible/books.js';

// Words general speech-to-text engines often get wrong in sermons, per language.
// Passed to engines that support boosting: CLOVA "boostings", RTZR "keywords", OpenAI "prompt".
const KO_PEOPLE_PLACES = [
  '므비보셋', '아히도벨', '에브라임', '므낫세', '아비멜렉', '느부갓네살', '여호사밧', '르호보암', '여로보암', '멜기세덱',
  '세스바살', '스룹바벨', '바나바', '디모데', '빌레몬', '오네시모', '아굴라', '브리스길라', '니고데모', '삭개오',
  '갈릴리', '가버나움', '베데스다', '겟세마네', '골고다', '벧엘', '브엘세바', '헤브론', '여리고', '사마리아'
];
const KO_THEOLOGY = [
  '칭의', '성화', '영화', '구속', '대속', '속죄', '중보', '언약', '은혜', '긍휼', '성령', '보혜사', '임마누엘',
  '할렐루야', '아멘', '호산나', '마라나타', '종말론', '삼위일체', '회개', '거듭남', '부활', '재림'
];
const EN_PEOPLE_PLACES = [
  'Mephibosheth', 'Ahithophel', 'Ephraim', 'Manasseh', 'Abimelech', 'Nebuchadnezzar', 'Jehoshaphat', 'Rehoboam', 'Jeroboam', 'Melchizedek',
  'Zerubbabel', 'Barnabas', 'Timothy', 'Philemon', 'Onesimus', 'Aquila', 'Priscilla', 'Nicodemus', 'Zacchaeus', 'Bathsheba',
  'Galilee', 'Capernaum', 'Bethesda', 'Gethsemane', 'Golgotha', 'Bethel', 'Beersheba', 'Hebron', 'Jericho', 'Samaria'
];
const EN_THEOLOGY = [
  'justification', 'sanctification', 'glorification', 'redemption', 'atonement', 'propitiation', 'intercession', 'covenant', 'grace',
  'Holy Spirit', 'Advocate', 'Immanuel', 'Hallelujah', 'Amen', 'Hosanna', 'Maranatha', 'eschatology', 'Trinity', 'repentance', 'born again', 'resurrection'
];
const ES_BOOKS = [
  'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio', 'Josué', 'Jueces', 'Rut', '1 Samuel', '2 Samuel', '1 Reyes', '2 Reyes',
  '1 Crónicas', '2 Crónicas', 'Esdras', 'Nehemías', 'Ester', 'Job', 'Salmos', 'Proverbios', 'Eclesiastés', 'Cantares', 'Isaías', 'Jeremías',
  'Lamentaciones', 'Ezequiel', 'Daniel', 'Oseas', 'Joel', 'Amós', 'Abdías', 'Jonás', 'Miqueas', 'Nahúm', 'Habacuc', 'Sofonías', 'Hageo',
  'Zacarías', 'Malaquías', 'Mateo', 'Marcos', 'Lucas', 'Juan', 'Hechos', 'Romanos', '1 Corintios', '2 Corintios', 'Gálatas', 'Efesios',
  'Filipenses', 'Colosenses', '1 Tesalonicenses', '2 Tesalonicenses', '1 Timoteo', '2 Timoteo', 'Tito', 'Filemón', 'Hebreos', 'Santiago',
  '1 Pedro', '2 Pedro', '1 Juan', '2 Juan', '3 Juan', 'Judas', 'Apocalipsis'
];
const ES_PEOPLE_PLACES = [
  'Mefiboset', 'Ahitofel', 'Efraín', 'Manasés', 'Abimelec', 'Nabucodonosor', 'Josafat', 'Roboam', 'Jeroboam', 'Melquisedec',
  'Zorobabel', 'Bernabé', 'Timoteo', 'Filemón', 'Onésimo', 'Aquila', 'Priscila', 'Nicodemo', 'Zaqueo', 'Betsabé',
  'Galilea', 'Capernaúm', 'Betesda', 'Getsemaní', 'Gólgota', 'Betel', 'Beerseba', 'Hebrón', 'Jericó', 'Samaria'
];
const ES_THEOLOGY = [
  'justificación', 'santificación', 'glorificación', 'redención', 'expiación', 'propiciación', 'intercesión', 'pacto', 'gracia',
  'Espíritu Santo', 'Consolador', 'Emanuel', 'Aleluya', 'Amén', 'Hosanna', 'Maranata', 'escatología', 'Trinidad', 'arrepentimiento', 'nacer de nuevo', 'resurrección'
];

export const KEYWORDS = {
  ko: [...BOOKS.map(b => b.ko), ...KO_PEOPLE_PLACES, ...KO_THEOLOGY],
  en: [...BOOKS.map(b => b.en), ...EN_PEOPLE_PLACES, ...EN_THEOLOGY],
  es: [...ES_BOOKS, ...ES_PEOPLE_PLACES, ...ES_THEOLOGY]
};
export const sermonKeywords = lang => KEYWORDS[lang] || KEYWORDS.ko;
// kept for older imports: the Korean list
export const SERMON_KEYWORDS = KEYWORDS.ko;
