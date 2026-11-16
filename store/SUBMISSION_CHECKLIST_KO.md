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
2. **문의 이메일:** ✅ hi@dailyjourney.org (앱·방침·약관·스토어 문구에 반영됨)
3. **개발자 계정 — 비영리 법인 Daily Journey, Inc.로 등록**
   - Apple: 조직(Organization)으로 가입. **D-U-N-S 번호**가 필요해요(무료, 발급에 1–2주). 비영리 단체는 연회비 **$99 면제 신청**이 가능해요(Apple Developer Program Fee Waiver).
   - Google Play: **조직 계정**으로 가입(1회 $25, D-U-N-S 필요). 조직 계정은 개인 계정의 '테스터 12명 · 14일 비공개 테스트' 의무가 **없어요**.
   - 스토어의 판매자/개발자 이름이 **Daily Journey, Inc.**로 표시돼요.
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

## ✅ v1 범위: (B) 나눔 기능 포함

- 연령 등급의 "사용자 생성 콘텐츠"는 **예**로 답해요 (Apple 13+, Google 12세 이상 권장).
- 로그인 화면의 **약관 동의 문구**는 앱에 들어가 있어요. 이용약관에 '부적절한 글·사용자 무관용' 조항이 있는지 확인하세요.
- **출시 전 꼭:** 신고를 24시간 안에 확인할 담당자, 운영자 화면, 신고 알림(이메일 등).
- 심사 테스트 계정에서 다른 사람 글이 보이고 신고·차단이 실제로 동작하는지 확인하세요.
