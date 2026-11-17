# Daily Thanks

매일 한 줄의 감사를 기록하고 공동체와 나누는 모바일 웹 프로토타입 (한국어 / English).

## 두 가지 버전

| | 일반 (이 폴더 루트) | 풀스택 ([`fullstack/`](fullstack/README.md)) |
|---|---|---|
| 실행 | `index.html` 열기 | `cd fullstack && npm install && npm start` |
| 데이터 | 브라우저에만 저장 | 서버에 사용자별 저장 |
| 준비 중인 숨김 기능 | — | 오늘의 본문, 설교 녹음 요약 (기능 플래그로 꺼 둠) |

두 버전의 화면은 같습니다. 풀스택 버전도 기능 플래그를 켜기 전까지는 일반 버전과 똑같이 보입니다.
본문·번역본·설교 요약의 권리 문제와 두란노 연락처는 [`docs/LICENSING_AND_PARTNERS_KO.md`](docs/LICENSING_AND_PARTNERS_KO.md)에 정리했습니다.

## 실행 / Run

`index.html`을 브라우저에서 열면 됩니다. 빌드·서버 필요 없음. GitHub Pages 같은 정적 호스팅에 그대로 올릴 수 있습니다.

- 언어: 첫 방문 시 브라우저 언어로 자동 선택 → 상단 `EN` / `한` 버튼 또는 `⋯ › 설정`에서 전환
- 데이터: 이 브라우저의 `localStorage`에만 저장 (계정·서버·푸시·카카오/인스타 연동 없음)

## 디자인 / Design

원본 디자인(`reference/original-design-photo.jpg`)을 기준으로 맞췄습니다.

| 요소 | 값 |
|---|---|
| 워드마크 | **Newsreader** serif — `daily` 정체 + `thanks` 이탤릭 |
| 본문 (한/영 공통) | **Noto Sans KR** Light 300 (오프라인 시 Apple SD Gothic Neo / 맑은 고딕 / 시스템 폰트) |
| 색상 | 배경 `#FCFCFA`, 카드 `#F6F6F4`, 본문 `#303438`, 보조 `#686E73`, 선 `#E5E6E3` |
| 아이콘 | 얇은 라인 아이콘 (인라인 SVG) |

영어 버전은 같은 폰트·줄 간격·아이콘 위치를 쓰고, 라틴 글자가 같은 px에서 더 크게 보이는 점을 감안해 본문 크기만 약 0.9배로 맞췄습니다.

## 파일

- `index.html`, `styles.css`, `app.js` — 앱
- `docs/` — 제품 명세(`PRODUCT_BRIEF_KO.md`), 다음 개발용 프롬프트(`HANDOFF_PROMPT_KO.md`)
- `reference/` — 원본 디자인 사진, 이전 오프라인 프로토타입, 알림·위젯 레퍼런스 이미지

## 온라인 미리보기 / Hosted preview

- `python3 tools/build-single.py` → `dist/daily-thanks.html` (CSS·JS를 한 파일로 묶은 버전, 오프라인에서도 열림)
- 이 파일을 claude.ai Artifact로 올려 휴대폰에서 클릭해 볼 수 있습니다.
- 첫 화면: 흰 바탕에 `daily thanks` 워드마크만 보이는 스플래시 → 1.8초 후(또는 탭하면) 앱으로 전환
