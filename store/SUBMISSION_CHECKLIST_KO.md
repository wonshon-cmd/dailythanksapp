# 스토어 제출 준비물 — 한눈에 보기

## ✅ 준비 완료 (이 저장소에 있음)

| 항목 | 파일 | 쓰는 곳 |
|---|---|---|
| 개인정보처리방침 (한/영/스페인어) | `store/legal/privacy-ko.md`, `privacy-en.md`, `privacy-es.md` | dailyapp.org/privacy |
| 이용약관 (3개 언어) | `store/legal/terms.md` | dailyapp.org/terms |
| 고객 문의 페이지 | `store/legal/support-and-delete.md` 위쪽 | dailyapp.org/support |
| 계정 삭제 요청 페이지 | `store/legal/support-and-delete.md` 아래쪽 | dailyapp.org/delete-account |
| 앱 이름·부제·설명·키워드 (3개 언어, 글자 수 검사 완료) | `store/listing/LISTING.md` | App Store Connect / Play Console |
| 개인정보 항목 답변 | `store/PRIVACY_LABELS_AND_REVIEW.md` 1–2번 | Apple App Privacy / Google Data safety |
| 심사 메모, 연령 등급, 암호화 답변 | 같은 문서 4–7번 | App Store Connect / Play Console |
| 앱 아이콘 | `store/icons/appstore-1024.png`, `play-512.png`, `android-foreground-432.png` | Xcode / Play Console |
| 스크린샷 (3개 언어 × 5장) | `store/screenshots/apple-6.9-*.png` (1320×2868), `play-*.png` (1080×2340) | 각 스토어 |
| 앱 안 필수 기능 | 계정 삭제, 개인정보처리방침·약관·문의 링크, 신고·차단·필터 | 앱 |

다시 만들기:

```bash
python3 tools/check-listing.py
```

```bash
node tools/make-icons.js
```

```bash
node tools/make-screenshots.js dist/daily-thanks.html store/screenshots
```

## ☐ 직접 해야 하는 것

1. **Squarespace 페이지 4개 만들기**
   - `/privacy`, `/terms`, `/support`, `/delete-account`
   - 위 문서를 붙여 넣고, `[대괄호]` 부분(운영자 이름, 이메일, 주소, 시행일)을 채우세요.
2. **문의 이메일 만들기**
   - 예: support@dailyapp.org
   - 다른 주소를 쓴다면 `app.js`의 `SUPPORT_EMAIL`도 바꿔 주세요.
3. **개발자 계정**
   - Apple Developer Program (연 $99)
   - Google Play Console (1회 $25)
   - Google 개인 계정은 출시 전 **테스터 12명 이상 · 14일 비공개 테스트**가 필요해요.
4. **실제 앱 빌드**
   - Capacitor로 iOS·Android 앱 만들기 (Mac + Xcode 필요)
   - Firebase 로그인·저장소 연결
   - 푸시 알림 연결
   - 네이티브 홈 위젯 만들기
   - 자세한 순서는 `fullstack/README.md`, `docs/LAUNCH_PLAN_KO.md`
5. **심사용 테스트 계정**
   - Firebase Auth에 테스트 전화번호를 등록해요 (예: +1 555-0100 / 123456).
   - 그 번호를 심사 메모에 적어요.
6. **최종 확인**
   - 출시 전 개인정보·법률 전문가에게 방침과 약관을 한 번 검토받기를 권장해요.

## ⚠️ v1 범위에 따라 바꿀 것

- **v1을 "감사 일기 + 운영자가 고른 피드"로 낼 경우:**
  - 연령 등급의 "사용자 생성 콘텐츠"를 **아니요**로 답해요.
  - 스크린샷 1번(다른 사람 글)은 운영자가 고른 글로 보이게 그대로 써도 돼요.
- **나눔 기능을 함께 낼 경우:**
  - 위 항목을 **예**로 답해요.
  - 신고를 24시간 안에 처리할 운영자 화면과 담당자가 있어야 해요.
