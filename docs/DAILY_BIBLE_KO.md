# daily bible — 두 번째 앱

daily thanks와 **같은 코드, 같은 데이터**로 만든 성경 앱이에요. `window.DT_APP = "bible"`이면 성경 모드로 열려요.

## 화면
- **읽기**: 마지막으로 읽은 곳(이어 읽기) · 통독 계기판 · 오늘의 본문(생명의 삶 / Our Daily Bread) · 성경 읽기 동행
- **설교 노트**: 녹음 / 녹음 파일 / 받아 적은 글 → AI가 한 장으로 정리(핵심 메시지 · 말씀 요점 · 삶의 적용 · 기도 제목 · 나눔 질문 · 본문) + 전체 받아쓰기
- **나**: 통독 계기판 · 연속 읽은 날 · 묵상 노트(성경 순서) · 저장한 구절 · 구독 · daily thanks 열기

## 데이터 연동
- 웹: `dailyjourney.org/app/`(daily thanks)와 `dailyjourney.org/daily-bible/`은 같은 사이트라 기기 안 기록을 그대로 같이 써요. 읽은 장·절, 묵상 노트, 저장한 구절이 서로 보여요.
- 휴대폰 앱 두 개: 로그인한 계정의 서버 기록(기기에서 잠근 상태로 저장)을 둘 다 읽어요. 실제 로그인을 붙이면 연결돼요.

## 설교 노트 요금 (제안)
| | 무료 | 월간 | 연간 |
|---|---|---|---|
| 가격 | 0 | ₩4,900 / $3.99 | ₩39,000 / $29.99 (2개월 무료) |
| 정리 | 노트 10개까지(보관) | 매달 60개까지 | 매달 60개까지 |
| 보관 | 10개 — 지우면 다시 쓸 수 있어요 | 무제한 | 무제한 |

**원가 감(설교 40분 기준)**: 받아쓰기 약 $0.25 + 요약(Claude Opus 5.5) 약 $0.10 ≈ 노트당 $0.35.
한 사람이 매주 1~2개 → 월 $0.7~1.4라서 월 $3.99면 남고, "60개/월"은 남용을 막는 선이에요.

## 서버 (fullstack/)
- `GET /api/sermons/quota` → `{ plan, used, limit, monthUsed, monthLimit }`
- `POST /api/sermons/text|audio` → 무료 10개가 차면 `402 quota_full`, 구독 중 월 60개를 넘으면 `429 fair_use`
- `DELETE /api/sermons/:id` → 지우면 다시 무료 칸이 생겨요
- `POST /api/billing/activate` → **지금은 테스트용**(`BILLING_DEV=1`)이에요. 출시 전에 영수증 확인으로 바꿔야 해요:
  - iOS: StoreKit 2 구매 → App Store Server API로 서버에서 확인
  - Android: Google Play Billing → Play Developer API로 확인
  - 간단히 하려면 RevenueCat 같은 서비스로 두 스토어를 한 번에
- 요약: `server/sermons/summarize.js` (Claude Opus 5.5, 정해진 형식으로 출력, 거절되면 자동 대체 모델)
- 받아쓰기: `server/sermons/stt.js` (OpenAI Whisper / 네이버 CLOVA / 리턴제로 중 선택)
- `/daily-bible/` 주소로 성경 모드 페이지를 바로 내보내요.

## 다음 할 일
1. 실제 로그인(애플·구글) → 두 앱이 같은 계정을 봐요
2. 휴대폰 앱 두 번째 프로젝트: appId `org.dailyjourney.dailybible`, 웹 빌드는 `dist/daily-bible.html`과 같은 성경 모드
3. 스토어 구독 상품 만들기(월간·연간) + 서버 영수증 확인
4. 녹음은 길어서(40분+) 휴대폰에서 끊겨 올려도 되도록 나눠 올리기
