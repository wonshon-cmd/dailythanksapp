# Daily Thanks — 풀스택 샘플 / Full-stack sample

루트의 앱(`index.html`·`styles.css`·`app.js`)은 서버 없이 도는 **일반(프론트엔드) 버전**입니다.
이 폴더는 같은 화면을 Node 서버로 서비스하는 **풀스택 버전**이고, 아직 앱에 보이지 않는 기능 두 가지가 들어 있습니다.

| | 일반 (루트) | 풀스택 (`fullstack/`) |
|---|---|---|
| 화면 | 동일 | 동일 (기능 플래그를 켜기 전까지 똑같이 보임) |
| 데이터 | 브라우저 localStorage | 서버 `/api/state` (사용자별), JSON 파일 저장소 |
| 오늘의 본문 | 없음 | 숨김 기능 `FEATURE_PASSAGE` |
| 설교 요약 | 없음 | 숨김 기능 `FEATURE_SERMON` |

## 실행

```bash
cd fullstack
npm install
npm start            # http://localhost:8787 — 숨김 기능 꺼짐 (일반 버전과 똑같이 보임)
```

숨김 기능을 켜서 보려면 아래처럼 실행합니다. 켜진 기능은 "내 감사" 화면 아래쪽에 나타납니다.

```bash
FEATURE_PASSAGE=1 FEATURE_SERMON=1 STT_PROVIDER=mock npm start
```

- 설교 요약은 Claude API를 호출합니다. `ANTHROPIC_API_KEY`가 필요하고, 요청할 때마다 비용이 듭니다.
- `STT_PROVIDER=mock`이면 녹음 파일 대신 예시 설교 원고를 씁니다. 실제 전사는 `STT_PROVIDER=openai` + `OPENAI_API_KEY`로 할 수 있습니다.
- 테스트: `npm test` (Claude를 호출하지 않는 스텁을 사용하므로 비용 없음)

## 구조

```
server/
  index.js              서버 시작
  app.js                라우팅 · 정적 파일 · 기능 플래그 게이트
  config.js             환경변수 (기능 플래그 기본값 OFF)
  store.js              JSON 파일 저장소 → 출시 전 Postgres/Supabase 등으로 교체
  bible/books.js        성경 66권 이름·약어 (한/영)
  bible/reference.js    "요 3:1~15", "John 3:16" 같은 본문 범위 해석·표기
  bible/spoken.js       "요한복음 삼 장 십육 절" 같은 말로 한 구절 → "요한복음 3:16"
  bible/translations.js 번역본 등록부 + 라이선스 확인 (허가 없는 번역본은 본문을 내보내지 않음)
  sermons/stt.js        음성→글 어댑터 (mock / OpenAI Whisper 구현, CLOVA·리턴제로는 연결 방법만)
  sermons/keywords.js   성경 고유명사·신학 용어 (STT 키워드 부스팅용)
  sermons/summarize.js  Claude로 설교 노트 요약 (본문·핵심 메시지·요점·적용·기도 제목·나눔 질문)
public/client.js        브라우저 쪽 추가 기능: 서버 동기화 + 숨김 기능 화면
data/bibles/            번역본 본문 JSON (지금은 요 3:16 샘플만)
test/                   단위·API 테스트
```

## API

| 메서드 | 경로 | 기능 플래그 | 설명 |
|---|---|---|---|
| GET | `/api/config` | | 켜진 기능 목록 |
| GET / PUT | `/api/state` | | 사용자별 앱 데이터 |
| GET | `/api/bible/translations` | passage | 번역본 목록과 사용 가능 여부 |
| GET | `/api/bible/parse?q=` | passage | 본문 범위 해석 |
| GET | `/api/bible/passage?ref=&translation=` | passage | 본문 (허가된 번역본만) |
| GET / POST | `/api/passages` | passage | 오늘의 본문 (사용자 입력 또는 리더 지정) |
| DELETE | `/api/passages/:id` | passage | 삭제 |
| POST | `/api/sermons/audio?title=` | sermon | 녹음 업로드 (본문은 오디오 바이너리) → 전사 → 요약 |
| POST | `/api/sermons/text` | sermon | 받아쓴 원고로 요약 |
| GET | `/api/sermons`, `/api/sermons/:id` | sermon | 요약 목록·상세 (기본은 나만 보기) |
| PATCH | `/api/sermons/:id/visibility` | sermon | 공유하려면 `churchConsent: true` 필요 |
| POST | `/api/reports` | | 글 신고 (사유 8종). 자해·자살 신고는 `urgent`로 맨 앞에 쌓임 |
| GET | `/api/moderation/reports?status=open` | moderation | 운영자 검토 목록 |
| PATCH | `/api/moderation/reports/:id` | moderation | `actioned` / `dismissed` 처리 |

기능 플래그가 꺼져 있으면 해당 API는 404를 반환하고, 앱 화면에도 나타나지 않습니다.

## 로그인 (Apple · Google · 휴대폰 번호)

앱 화면의 흐름은 이미 만들어져 있습니다. 지금은 로그인 상태만 기기에 저장하는 시안이고, 실제 계정 연결은 아래 순서로 붙이면 됩니다.

**화면 흐름 (`app.js`)**
1. 처음 열면 "daily thanks" 첫 화면이 뜨고, 이어서 다른 사람들의 감사가 전체 화면으로 3개 나옵니다 (`GATE_AFTER = 3`).
2. 다음 카드에서 오늘 나의 감사를 한 줄 씁니다. 기본은 나만 보기이고, "나중에"로 건너뛸 수 있습니다.
3. 그다음 카드는 로그인입니다 (Apple / Google / 휴대폰 번호). 로그인하기 전에는 피드가 이 카드에서 멈춥니다.
4. 로그인 정보는 로그아웃(설정 → 로그아웃)할 때까지 유지됩니다. 다음부터는 로그인 카드가 나오지 않습니다.

**실제 연결 권장안: Firebase Authentication**
- 한 서비스에서 Apple, Google, 휴대폰 문자 인증(한국 번호 포함)을 모두 지원합니다.
- 기본 설정이 "기기에 로그인 유지"(refresh token)라서 "한 번 로그인하면 항상 로그인" 요구사항에 그대로 맞습니다.
- 대안: Supabase Auth (Apple·Google 기본 지원, 문자는 Twilio 등 외부 업체 연결 필요)

**연결 순서**
1. Firebase 프로젝트를 만들고 Apple, Google, 전화번호 로그인을 켭니다.
   - Apple은 Apple Developer에서 Services ID와 Key를 만들어야 합니다.
2. `app.js`의 `completeLogin()` / `phoneLogin()`을 Firebase SDK 호출로 바꿉니다.
   - `signInWithPopup(AppleProvider / GoogleProvider)`
   - `signInWithPhoneNumber` + `RecaptchaVerifier`
3. 서버 `server/app.js`의 `userIdOf()`를 바꿉니다.
   - 지금은 `x-user-id` 헤더로 사용자를 구분합니다.
   - 대신 `Authorization: Bearer <Firebase ID token>`을 `firebase-admin`의 `verifyIdToken()`으로 검증하고, 그 결과의 `uid`를 씁니다.
4. 로그인 직후 그때까지 기기에 저장된 기록을 계정으로 옮깁니다. `public/client.js`의 `dt:session` 처리 부분에 이미 넣어 두었습니다.

**미리 알아둘 점**
- iOS 앱에서 Google 로그인을 제공하면 Apple 로그인도 함께 제공하는 것이 App Store 심사 기준입니다. 지금 화면은 둘 다 있습니다.
- 휴대폰 인증은 문자 발송 비용이 들고, 웹에서는 reCAPTCHA가 필요합니다. 네이티브 앱에서는 기기 확인으로 대체됩니다.
- 로그인 버튼의 모양은 각 회사 가이드라인을 따라야 합니다. 출시 때는 공식 SDK의 버튼을 쓰는 것이 안전합니다.

## 출시 전에 해야 할 일

1. **인증:** 위 "로그인" 절차대로 실제 계정을 연결하세요. 지금은 `x-user-id` 헤더(기본 `demo`)로 사용자를 구분합니다.
2. **데이터베이스:** JSON 파일 저장소를 실제 DB로 교체하세요. 서버 측 권한 검사를 넣고, 소그룹 리더만 그룹 본문을 지정할 수 있게 하세요.
3. **번역본 라이선스와 본문 데이터 준비:** 자세한 내용은 [`../docs/LICENSING_AND_PARTNERS_KO.md`](../docs/LICENSING_AND_PARTNERS_KO.md)에 있습니다.
4. **긴 설교 처리:**
   - 녹음을 분할 업로드하세요(Whisper는 요청당 약 25MB 제한).
   - 휴대폰 백그라운드 녹음은 네이티브 앱에서 구현해야 합니다.
   - 처리 작업은 큐(작업 대기열)로 옮기세요.
5. **신고 처리 운영:**
   - 운영자 화면과 권한(모더레이터 계정)을 만드세요.
   - 처리 기준(커뮤니티 규칙)을 정하세요.
   - 자해·자살 신고에 빠르게 대응할 절차를 마련하세요.
6. **설교 요약 공유:** 교회 동의 구조를 확정하세요(B2B 교회 계정).
