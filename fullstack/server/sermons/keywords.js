import { BOOKS } from '../bible/books.js';

// Words general speech-to-text engines often get wrong in Korean sermons.
// Passed to STT providers that support keyword boosting (CLOVA "boostings", RTZR "keywords", OpenAI "prompt").
const PEOPLE_PLACES = [
  '므비보셋', '아히도벨', '에브라임', '므낫세', '아비멜렉', '느부갓네살', '여호사밧', '르호보암', '여로보암', '멜기세덱',
  '세스바살', '스룹바벨', '바나바', '디모데', '빌레몬', '오네시모', '아굴라', '브리스길라', '니고데모', '삭개오',
  '갈릴리', '가버나움', '베데스다', '겟세마네', '골고다', '벧엘', '브엘세바', '헤브론', '여리고', '사마리아'
];
const THEOLOGY = [
  '칭의', '성화', '영화', '구속', '대속', '속죄', '중보', '언약', '은혜', '긍휼', '성령', '보혜사', '임마누엘',
  '할렐루야', '아멘', '호산나', '마라나타', '종말론', '삼위일체', '회개', '거듭남', '부활', '재림'
];

export const SERMON_KEYWORDS = [...BOOKS.map(b => b.ko), ...PEOPLE_PLACES, ...THEOLOGY];
