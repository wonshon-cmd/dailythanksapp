# 개인정보 항목 · 심사 메모 · 등급 답변

> App Store Connect와 Google Play Console에 그대로 옮겨 적으면 되는 답변입니다.
> **v1 범위: (B) 나눔 기능 포함으로 확정** — 감사 일기 + 모두에게 나누기 + 카카오톡·인스타 공유.
> 제출 전에 앱이 실제로 하는 일과 답변이 일치하는지 한 번 더 확인하세요.

---

## 1. Apple — App Privacy (앱 개인정보 보호)

**"이 앱에서 데이터를 수집합니까?" → 예**

| 데이터 유형 | 수집 | 사용자와 연결 | 추적에 사용 | 목적 |
|---|---|---|---|---|
| 연락처 정보 › 이메일 주소 | 예 (Apple/Google 로그인 시 제공되면) | 예 | 아니요 | 앱 기능 |
| 연락처 정보 › 이름 | 예 (제공되면) | 예 | 아니요 | 앱 기능 |
| 연락처 정보 › 전화번호 | 예 (휴대폰 로그인 시) | 예 | 아니요 | 앱 기능 |
| 사용자 콘텐츠 › 기타 사용자 콘텐츠 (감사 글·카드) | 예 | 예 | 아니요 | 앱 기능 |
| 사용자 콘텐츠 › 오디오 데이터 | 예 (AI 설교 요약을 켠 경우만) | 예 | 아니요 | 앱 기능 |
| 식별자 › 사용자 ID | 예 | 예 | 아니요 | 앱 기능 |
| 식별자 › 기기 ID (푸시 토큰) | 예 | 예 | 아니요 | 앱 기능 |
| 사용 데이터 › 제품 상호작용 (좋아요·저장·본 글) | 예 | 예 | 아니요 | 앱 기능 |
| 진단 › 충돌 데이터 | (충돌 보고 도구를 넣으면) 예 | 아니요 | 아니요 | 앱 기능 |

- **추적(Tracking):** 아니요. 광고 SDK 없음, 앱 추적 투명성(ATT) 팝업 불필요.
- **위치, 연락처 목록, 건강, 금융, 검색 기록:** 수집 안 함.

## 2. Google Play — Data safety (데이터 보안)

- 데이터 수집: **예** · 데이터 공유(제3자에게 전달): **아니요** (처리 위탁은 '공유'가 아님)
- 전송 중 암호화: **예** · 데이터 삭제 요청 방법 제공: **예** (앱 안 + dailyjourney.org/delete-account)

| 데이터 | 수집 | 필수/선택 | 목적 |
|---|---|---|---|
| 개인 정보 › 이메일 주소, 이름, 전화번호 | 예 | 필수(로그인 방식 중 하나) | 계정 관리 |
| 개인 정보 › 사용자 ID | 예 | 필수 | 계정 관리, 앱 기능 |
| 메시지 › 기타 인앱 메시지 (감사 글) | 예 | 필수 | 앱 기능 |
| 오디오 › 음성 또는 녹음 | 예 | **선택** (설교 요약) | 앱 기능 |
| 앱 활동 › 앱 상호작용 | 예 | 필수 | 앱 기능 |
| 기기 또는 기타 ID | 예 | 선택 (알림 허용 시) | 앱 기능 |
| 앱 정보 및 성능 › 비정상 종료 로그 | (도구를 넣으면) 예 | 선택 | 분석 |

## 3. 나눔 기능(사용자 생성 콘텐츠) 때문에 필요한 것 — v1에 포함

- Apple 등급 설문: **"사용자 생성 콘텐츠: 예"**, Google 콘텐츠 등급 설문: **"사용자 간 상호작용 / 사용자 생성 콘텐츠 공유: 예"**.
- **약관 동의(Guideline 1.2):** 로그인 화면에 "계속하면 이용약관과 개인정보처리방침에 동의하는 것으로 봐요. 다른 사람을 해치거나 불쾌하게 하는 글은 허용되지 않아요."가 있고, 동의 시각(`termsAcceptedAt`)을 계정에 저장합니다. 이용약관에 '부적절한 콘텐츠 무관용' 조항이 있어야 합니다.
- 필터 · 신고(8가지 사유) · 숨기기 · 차단 · 공개 연락처 → 모두 앱에 있음.
- 신고 접수 후 **24시간 안에 확인**할 담당자와 운영자 화면·알림이 출시 전에 있어야 합니다.
- 심사 테스트 계정으로 로그인하면 다른 사람 글이 보이고, 신고·차단을 직접 눌러 볼 수 있어야 합니다.

## 4. App Review 메모 (App Store Connect › 앱 심사 정보 › 메모)

```
Thank you for reviewing Daily Thanks, a simple gratitude journal.

Sign-in: Sign in with Apple, Google, or phone number. Signing in requires agreeing to the
Terms of Use, which state there is no tolerance for objectionable content or abusive users.
 Sign in with Apple is offered
alongside Google (Guideline 4.8).
Demo account for review: [phone +1 555-0100, code 123456]  ← create a test number in Firebase Auth

Account deletion: Settings (⋯ on My Thanks) › About › Delete account (in-app, Guideline 5.1.1(v)).

User content safety (Guideline 1.2):
- Abusive-language filter before posting to others; private notes are not shared.
- Report (8 reasons), hide post, and block user from the ⋯ menu on every post.
- Reports go to a moderation queue reviewed within 24 hours; self-harm reports are prioritised
  and the reporter is shown crisis lines.
- Published contact: hi@dailyjourney.org, dailyjourney.org/support.

Notifications are optional, requested after a short in-app explanation, at a time the user picks.
No tracking, no ads.
```

## 5. 연령 등급 답변 요약

| 항목 | 답변 |
|---|---|
| 폭력, 성적 콘텐츠, 비속어, 약물, 도박, 공포 | 없음 |
| 사용자 생성 콘텐츠 | **예** (모두에게 나누기) |
| 웹 브라우징 제한 없음 | 아니요 |
| 의료·치료 정보 | 아니요 |
| 예상 등급 | Apple 13+ 권장, Google 12세 이상 권장 |

## 6. 수출 규정 (암호화)

- "암호화를 사용합니까?" → **예, 표준 암호화(HTTPS)만 사용 → 면제**
- Info.plist에 `ITSAppUsesNonExemptEncryption = NO`를 넣으면 매번 묻지 않습니다.

## 7. 앱 정보 입력값

| 항목 | 값 |
|---|---|
| 카테고리 | Apple: 라이프스타일 (보조: 건강 및 피트니스) / Google: 라이프스타일 |
| 지원 URL | https://dailyjourney.org/support |
| 마케팅 URL | https://dailyjourney.org |
| 개인정보처리방침 URL | https://dailyjourney.org/privacy |
| 계정 삭제 URL (Google) | https://dailyjourney.org/delete-account |
| 저작권 | © 2026 Daily Journey, Inc. |
| 가격 | 무료 |
| 지원 언어 | 한국어, 영어, 스페인어 |
