# 개인정보 항목 · 심사 메모 · 등급 답변 — Daily Journey (성경 앱)

> App Store Connect와 Google Play Console에 옮겨 적는 답변이에요.
> 앱: Daily Journey (`org.dailyjourney.app`) — 같은 코드의 성경 모드(`DT_APP = "bible"`, `DT_BRAND = "journey"`).
> 서버: Supabase. 제출 전에 앱이 실제로 하는 일과 답이 맞는지 한 번 더 확인하세요.

## 0. 지금 앱이 서버로 보내는 것 / 안 보내는 것

| 보내요 (Supabase) | 안 보내요 |
|---|---|
| 메일 주소 (메일 코드 로그인, 또는 Google·Microsoft·Apple 로그인이 알려 주는 주소) | 음성·녹음 — 첫 출시에는 녹음 기능이 없어요 |
| 잠긴 백업 (나만 보는 기록을 휴대폰에서 암호화한 덩어리 — 열쇠는 휴대폰에만) | |
| 표시 이름 | 형광펜·노트의 내용 — 잠긴 백업 안에만 있어 우리는 못 열어요 |
| 사용자 ID | 나만 보는 글의 내용 — 휴대폰에서 잠근 사본만 백업으로 보관하고, 열쇠가 없어 우리는 못 열어요 |
| 공동체 가입·승인 상태 | 위치, 연락처 목록, 광고 ID, 결제 정보 |
| 공동체나 모두에게 나눈 글 (기도제목, 감사, 묵상, 설교 노트) — 종단 간 암호화 아님. 권한 규칙으로 멤버만 읽고, 운영자는 신고 처리를 위해 볼 수 있어요 | 분석·광고 SDK 없음 |
| 반응 (좋아요·저장·함께 기도) | |
| 읽음 표시 (오늘의 본문·함께 읽기 계획을 다 읽었는지 — 글 내용 없음) | |
| 감사 링크로 받은 하트 (링크 안의 열쇠로 잠겨 있어 우리가 못 열어요), 1:1 연결용 코드 | |
| 신고 (사유, 대상 글) | |

첫 출시의 노트는 **내가 직접 쓰는 노트**만 있어요. 설교 녹음·받아쓰기·자동 요약은 꺼 두었어요.
알림은 휴대폰 안에서 예약하는 방식이라 푸시 토큰을 보내지 않아요.
나중에 설교 녹음을 다시 켜거나 서버에서 정리하게 바꾸면(`window.DT_API` 설정) 아래 "오디오" 답이 바뀌어야 해요.

## 1. Apple — App Privacy

**"이 앱에서 데이터를 수집합니까?" → 예.** 모두 **사용자와 연결: 예 · 추적: 아니요 · 목적: 앱 기능**.

| 데이터 유형 | 무엇 |
|---|---|
| 연락처 정보 › 이메일 주소 | 메일·Google·Microsoft·Apple로 로그인할 때 |
| 연락처 정보 › 이름 | 표시 이름 |
| 사용자 콘텐츠 › 기타 사용자 콘텐츠 | 공동체·모두에게 나눈 글, 신고 내용 |
| 식별자 › 사용자 ID | 계정 ID |
| 사용 데이터 › 제품 상호작용 | 좋아요·저장·함께 기도, 공동체 가입, 읽음 표시 |

- 오디오 데이터: **수집 안 함** (첫 출시에는 녹음 기능이 없어요).
- 나만 보는 글: 휴대폰에서 암호화되어 우리가 읽을 수 없으므로 수집으로 보지 않아요.
- 추적: **아니요**. 앱 추적 투명성(ATT) 팝업 필요 없음.

## 2. Google Play — Data safety

- 데이터 수집: **예** · 제3자 공유: **아니요** (Supabase는 처리 위탁) · 전송 중 암호화: **예**
- 삭제 요청 방법: **예** — 앱 안 + https://dailyjourney.org/delete-account
- 계정 없이도 쓸 수 있나요: **예** (읽기·노트는 로그인 없이, 공동체는 로그인 필요)

| 데이터 | 필수/선택 | 목적 |
|---|---|---|
| 개인 정보 › 이메일 주소 | 선택 (로그인할 때) | 계정 관리 |
| 개인 정보 › 이름 | 선택 | 앱 기능 |
| 개인 정보 › 사용자 ID | 선택 (로그인할 때) | 계정 관리, 앱 기능 |
| 메시지 › 기타 인앱 메시지 (나눈 글) | 선택 | 앱 기능 |
| 앱 활동 › 앱 상호작용 (반응, 공동체 가입, 읽음 표시) | 선택 | 앱 기능 |

권한: 알림 (읽기 알림). 마이크는 쓰지 않아요.

## 3. 사용자 생성 콘텐츠 (Apple 1.2 · Google UGC 정책)

- 앱 안에 있는 것: 부적절한 말 거르기, 신고(사유 선택), 글 숨기기, 사람 차단, 공동체 가입 승인, 공동체 나가기, 문의 메일.
- 로그인할 때 약관 동의 문구가 보이고, 약관에 "부적절한 글·사용자 무관용" 조항이 있어야 해요.
- 신고는 **24시간 안에** 확인해요. 담당자와 알림을 출시 전에 정하세요.

## 4. App Review 메모 (App Store Connect › 앱 심사 정보 · Google Play › 앱 액세스)

심사용 계정 준비 (제출할 때마다):
1. Supabase › Authentication › Users › **Add user › Create new user**: `review@dailyjourney.org`, 비밀번호 직접 정하기, **Auto Confirm User** 체크 (처음 한 번만).
2. Supabase › SQL Editor에 `supabase/review_demo.sql` 붙여넣고 **Run** → 데모 공동체와 글이 오늘 날짜로 새로 만들어져요. (앱은 최근 30일 글만 보여 줘서, 제출 전에 다시 실행해요.)
3. 아래 메모의 `[the password set in Supabase]` 자리에 그 비밀번호를 넣어요. 앱에서 이 주소만 코드 대신 비밀번호를 물어요.

```
Thank you for reviewing Daily Journey, a daily Bible reading app.

What it does: read the Bible (built-in public-domain text: KJV, Korean 1961, Reina-Valera 1909),
reading plans shared with friends, reflections, notes you write yourself (on a sermon or a passage),
verse highlights, and small private communities
where members share prayer requests, thanks and reflections.

Sign-in is optional: reading and notes work without an account. Communities need an account
(Sign in with Apple, Google, Microsoft, or email with a one-time code).
Demo account (no code needed): Me › Sign in › Continue with email
  Name: any   Email: review@dailyjourney.org   →  a password field appears
  Password: [the password set in Supabase]
  This account owns the community "Daily Journey Demo" with posts from two other members
  (a prayer request, a reflection, thanks), so you can pray, react, report, hide and block.

Account deletion: Me › ⋯ (settings) › About › Delete account (in the app).

User-generated content (Guideline 1.2):
- Abusive-language filter before posting; posts only you can see are encrypted on the device.
- Every shared post has ⋯ › Report, Hide this post, Block this person.
- Community owners can require approval before someone joins; members can mute or leave.
- Reports are reviewed within 24 hours. Contact: hi@dailyjourney.org, https://dailyjourney.org/support

Microphone: not used in this version (no recording, transcription or automatic summary).
Notifications: optional daily reading reminder, scheduled on the device.
No ads, no tracking, no in-app purchases.
```

## 5. 연령 등급

| 항목 | 답변 |
|---|---|
| 폭력, 성적 콘텐츠, 비속어, 약물, 도박, 공포 | 없음 |
| 사용자 생성 콘텐츠 / 사용자 간 소통 | **예** (공동체, 모두에게 나누기 — 신고·차단 있음) |
| 제한 없는 웹 접근 | 아니요 |
| 의료·치료 정보 | 아니요 |
| 예상 등급 | Apple 13+ 권장, Google 12세 이상 권장 |

## 6. 수출 규정 (암호화)

- 표준 암호화(HTTPS, 기기 안 잠금)만 사용 → 면제. `Info.plist`에 `ITSAppUsesNonExemptEncryption = NO`가 이미 들어 있어요.

## 7. 앱 정보 입력값

| 항목 | 값 |
|---|---|
| 카테고리 | Apple: 참고 (보조: 라이프스타일) / Google: 도서 및 참고자료 |
| 지원 URL | https://dailyjourney.org/support |
| 마케팅 URL | https://dailyjourney.org |
| 개인정보처리방침 URL | https://dailyjourney.org/privacy |
| 계정 삭제 URL (Google) | https://dailyjourney.org/delete-account |
| 저작권 | © 2026 Daily Journey, Inc. |
| 가격 | 무료 |
| 지원 언어 | 한국어, 영어, 스페인어 |

journey 브랜드에서는 앱 안 링크도 모두 dailyjourney.org로 가요. 위 페이지들이 열려 있어야 해요.
