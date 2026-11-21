# 로그인·서버 설정 — 직접 하실 일 (순서대로)

Daily Journey · Supabase 프로젝트 `puhaycwpfpqsmxubvzkt`
비밀번호·비밀 키(Client secret, .p8, API 키)는 **해당 사이트에만** 넣고, 채팅에는 붙여 넣지 마세요.

로그인 방법: **Google · Microsoft · 메일(6자리 코드)**. 한 번 로그인하면 **로그아웃할 때까지 계속 로그인돼 있어요.**
순서: **① SQL → ② 주소 설정 → ③ 메일 로그인 → ④ Google → ④-2 Microsoft → ⑥ 확인**
⑤ Apple은 **아이폰 앱을 출시할 때만** 필요해요(App Store 규칙: Google 로그인이 있으면 Apple도 있어야 해요). 아이폰 앱 안에서만 Apple 버튼이 보여요.

---

## ① 데이터베이스 준비 (5분)

1. 열기: https://supabase.com/dashboard/project/puhaycwpfpqsmxubvzkt/sql/new
2. GitHub에서 파일을 열고 **Raw** 버튼 → 전체 복사 → SQL Editor에 붙여 넣기 → 오른쪽 아래 **Run**.
   아래 3개를 하나씩 실행해요(여러 번 실행해도 안전해요).
   - `supabase/friends.sql` — 감사 링크 하트, 1:1 연결
   - `supabase/backups.sql` — 잠근 백업(새 휴대폰에서 기록 이어 보기)
   - `supabase/link_opens.sql` — 공유 링크를 연 사람 수(영향력)
   - `supabase/security.sql` — 보안 강화(코드 여러 번 틀리면 15분 대기, 글자 수 제한 등) **맨 마지막에 실행**
   - 파일 위치: https://github.com/wonshon-cmd/dailythanksapp/tree/main/supabase
3. 각각 "Success. No rows returned"가 나오면 끝.

## ② 로그인 후 돌아올 주소 (3분)

1. 열기: https://supabase.com/dashboard/project/puhaycwpfpqsmxubvzkt/auth/url-configuration
2. **Site URL**: `https://dailyjourney.org/daily-bible/` → Save
3. **Redirect URLs** › Add URL 로 아래 4개를 하나씩 추가 → Save
   - `https://dailyjourney.org/**`
   - `daily-journey://auth`  (휴대폰 앱으로 돌아오는 주소)
   - `https://wonshon-cmd.github.io/dailybible/**`
   - `http://localhost:*/**`  (테스트용, 없어도 돼요)

## ③ 메일로 로그인 (코드 6자리) — 가장 중요 (20~30분)

Supabase 기본 메일은 **프로젝트 팀원 주소로만** 가고 시간당 몇 통뿐이라, 실제 사용자에게는 자체 메일 발송(SMTP)이 꼭 필요해요. 여기서는 Resend(무료 월 3,000통)를 써요.

### 3-1. Resend로 보내는 주소 만들기
1. 가입: https://resend.com/signup
2. **Domains › Add Domain** → `dailyjourney.org` → 지역은 가까운 곳(예: us-east-1).
3. 화면에 나오는 DNS 레코드(MX 1개, TXT 2개 정도)를 **dailyjourney.org를 산 곳**(가비아·Namecheap·Cloudflare 등)의 DNS 설정에 그대로 추가.
   - 이미 있는 GitHub Pages 레코드(A / CNAME)는 지우지 마세요. 추가만 해요.
4. Resend에서 **Verify** → 몇 분~몇 시간 뒤 초록색 "Verified".
5. **API Keys › Create API Key** (권한: Sending access) → 키를 복사해 두기(한 번만 보여요).

### 3-2. Supabase에 연결
1. 열기: https://supabase.com/dashboard/project/puhaycwpfpqsmxubvzkt/auth/smtp
2. **Enable Custom SMTP** 켜고:
   - Sender email: `hi@dailyjourney.org` (또는 `no-reply@dailyjourney.org`)
   - Sender name: `Daily Journey`
   - Host: `smtp.resend.com` · Port: `465`
   - Username: `resend` · Password: 위에서 만든 **Resend API 키**
3. Save.
4. 발송 한도 올리기: https://supabase.com/dashboard/project/puhaycwpfpqsmxubvzkt/auth/rate-limits
   → "Rate limit for sending emails"를 `100`(시간당) 정도로 → Save.
   → 같은 화면 **"Rate limit for token verifications"**(코드 확인)는 `30`(5분당, IP 하나 기준) 이하로 두세요. 6자리 코드를 마구 넣어 보는 공격을 막아요.
   → **"Rate limit for sign ups and sign ins"**도 기본값(30) 그대로 두면 돼요.

### 3-3. 메일 내용에 코드 넣기
앱은 메일 속 **6자리 코드**를 입력받아요. 메일 양식에 코드가 꼭 있어야 해요.
1. 열기: https://supabase.com/dashboard/project/puhaycwpfpqsmxubvzkt/auth/templates
2. **Magic Link** 탭 → Subject: `Daily Journey 로그인 코드`
   Body를 아래로 바꾸기 → Save
   ```html
   <p>Daily Journey 로그인 코드예요. 앱에 이 6자리를 입력해 주세요.</p>
   <h2 style="letter-spacing:4px">{{ .Token }}</h2>
   <p>Your Daily Journey sign-in code: <b>{{ .Token }}</b></p>
   <p style="color:#999">요청하지 않았다면 이 메일은 무시하셔도 돼요.</p>
   ```
3. **Confirm signup** 탭에도 똑같이 넣기(처음 가입하는 사람은 이 메일을 받아요) → Save.
4. 코드 길이: https://supabase.com/dashboard/project/puhaycwpfpqsmxubvzkt/auth/providers › **Email** 열기
   - Enable Email provider: 켜짐
   - **Email OTP Length: 6** · Email OTP Expiration: `3600`(1시간) → Save

## ④ Google로 로그인 (20분)

### 4-1. Google Cloud
1. 프로젝트 만들기: https://console.cloud.google.com/projectcreate → 이름 `Daily Journey` → 만들기.
2. 동의 화면: https://console.cloud.google.com/auth/branding
   - 앱 이름 `Daily Journey`, 지원 이메일(본인 메일), 앱 로고(선택)
   - 앱 도메인: 홈 `https://dailyjourney.org` · 개인정보처리방침 `https://dailyjourney.org/privacy/` · 약관 `https://dailyjourney.org/terms/`
   - 승인된 도메인: `dailyjourney.org`, `supabase.co`
   - 대상(Audience): **외부(External)** → 나중에 **앱 게시(Publish app)** 를 눌러 "프로덕션"으로. (이메일·이름만 쓰므로 별도 심사 없이 바로 돼요.)
3. 클라이언트 만들기: https://console.cloud.google.com/auth/clients → **클라이언트 만들기**
   - 유형: **웹 애플리케이션** · 이름: `Daily Journey (Supabase)`
   - 승인된 JavaScript 원본: `https://dailyjourney.org`
   - 승인된 리디렉션 URI: `https://puhaycwpfpqsmxubvzkt.supabase.co/auth/v1/callback`
   - 만들기 → **클라이언트 ID**와 **클라이언트 보안 비밀번호** 복사.

### 4-2. Supabase
1. 열기: https://supabase.com/dashboard/project/puhaycwpfpqsmxubvzkt/auth/providers → **Google**
2. Enable 켜기 → Client ID, Client Secret 붙여 넣기 → Save.

## ④-2 Microsoft로 로그인 (15분)

1. 열기: https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade
   (Microsoft 계정으로 로그인. 처음이면 무료 Azure 계정 만들기 안내가 나올 수 있어요 — 앱 등록은 무료예요.)
2. **New registration**
   - Name: `Daily Journey`
   - Supported account types: **Accounts in any organizational directory and personal Microsoft accounts** (개인 Outlook·Hotmail 계정도 되게)
   - Redirect URI: 플랫폼 **Web** · `https://puhaycwpfpqsmxubvzkt.supabase.co/auth/v1/callback`
   - **Register**
3. Overview 화면의 **Application (client) ID** 복사.
4. 왼쪽 **Certificates & secrets › New client secret** → 설명 `supabase`, 만료 **24 months** → Add
   → **Value** 열의 값을 복사(Secret ID 말고 Value). 화면을 떠나면 다시 못 봐요.
5. 왼쪽 **API permissions** → Microsoft Graph에 `email`, `openid`, `profile`, `User.Read` 가 있는지 확인(없으면 Add a permission › Microsoft Graph › Delegated에서 추가).
6. Supabase: https://supabase.com/dashboard/project/puhaycwpfpqsmxubvzkt/auth/providers → **Azure** (Microsoft)
   - Enable 켜기 · Application (client) ID 붙여 넣기 · Secret Value 붙여 넣기
   - Azure Tenant URL: `https://login.microsoftonline.com/common`
   - Save
7. ⚠️ Secret은 24개월 뒤 만료돼요. 달력에 알림을 걸어 두고, 4번처럼 새로 만들어 Supabase에 바꿔 넣으세요.

## ⑤ Apple로 로그인 (아이폰 앱 출시 전에, 30분)

App Store에 Google 로그인이 있으면 Apple 로그인도 있어야 해요(심사 규칙). 웹과 안드로이드에는 안 보여요.

### 5-1. Apple Developer
1. 앱 ID: https://developer.apple.com/account/resources/identifiers/list
   - `org.dailyjourney.app` 이 없으면 **+ › App IDs › App** 로 만들고, Capabilities에서 **Sign In with Apple** 체크.
2. Services ID (웹 로그인용): 같은 화면 **+ › Services IDs**
   - Description `Daily Journey Sign in` · Identifier `org.dailyjourney.signin` → Register
   - 만든 항목을 열어 **Sign In with Apple** 체크 → **Configure**
     - Primary App ID: `org.dailyjourney.app`
     - Domains: `puhaycwpfpqsmxubvzkt.supabase.co`
     - Return URLs: `https://puhaycwpfpqsmxubvzkt.supabase.co/auth/v1/callback`
   - Save → Continue → Save.
3. 키: https://developer.apple.com/account/resources/authkeys/list → **+**
   - 이름 `Daily Journey Sign in` · **Sign in with Apple** 체크 → Configure에서 `org.dailyjourney.app` → 등록
   - **.p8 파일 다운로드**(한 번만 돼요) · **Key ID** 적어 두기 · 오른쪽 위 **Team ID**(10자리) 적어 두기.

### 5-2. Supabase
1. 열기: https://supabase.com/dashboard/project/puhaycwpfpqsmxubvzkt/auth/providers → **Apple**
2. Enable 켜기
   - **Client IDs**: `org.dailyjourney.signin,org.dailyjourney.app`
   - **Secret Key (for OAuth)**: 같은 화면 안내에 있는 생성 도구(또는 Supabase 문서의 "generate secret" 도구)에 Team ID · Key ID · Services ID · .p8 내용을 넣어 만든 긴 문자열을 붙여 넣기.
     문서: https://supabase.com/docs/guides/auth/social-login/auth-apple
3. Save.
4. ⚠️ 이 Secret Key는 **6개월마다 만료**돼요. 달력에 6개월 뒤 알림을 걸어 두고, 같은 방법으로 새로 만들어 붙여 넣으세요(.p8 파일은 안전한 곳에 보관).

## ⑥ 확인 (10분)

1. 휴대폰 브라우저에서 https://dailyjourney.org/daily-bible/ → 나 › 로그인
   - **메일**: 코드 메일이 1분 안에 오고, 6자리 입력 → 로그인되면 성공. (스팸함도 확인)
   - **Google**, **Microsoft**: 각각 눌러서 로그인되면 성공.
   - 앱을 닫았다 다시 열어도 로그인돼 있으면 성공(로그아웃 전까지 유지).
2. 다른 기기(컴퓨터 등)에서 같은 메일로 로그인 → "내 기록 열기" 창이 뜨면, 첫 휴대폰의 나 › 설정 › 기록 보호에서 복구 키를 복사해 넣기 → 노트·저장한 구절이 그대로 보이면 백업 성공.
3. 막히면 화면 캡처와 함께 "몇 번 단계에서 막혔어"라고만 알려 주세요.

## 참고: 심사용 계정 (제출 직전)
`store/PRIVACY_LABELS_AND_REVIEW.md` 4번(심사 계정 만들기, `review_demo.sql` 실행)을 따라 하세요.
