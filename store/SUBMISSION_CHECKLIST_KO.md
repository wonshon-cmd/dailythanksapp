# 스토어 제출 준비물 — Daily Journey (성경 앱)

스토어에는 **성경 앱 하나만** 올려요. 스토어 이름은 **Daily Journey**예요.
같은 코드를 `window.DT_APP = "bible"` + `window.DT_BRAND = "journey"`로 열어요(`mobile/scripts/build-web.mjs`가 넣어 줘요).
daily thanks는 이번에 올리지 않아요.

## 앱 기본값

| 항목 | 값 |
|---|---|
| 앱 이름 | Daily Journey |
| iOS 번들 ID · Android 앱 ID | `org.dailyjourney.app` |
| iOS 위젯 번들 ID | `org.dailyjourney.app.widget` |
| App Group (iOS) | `group.org.dailyjourney.app` |
| 바로가기 주소 | `daily-journey://` (`daily-bible://`, `daily-thanks://`도 받아요) |
| 판매자 | Daily Journey, Inc. |
| 가격 | 무료 (앱 안 구매 없음) |
| 언어 | 한국어, 영어, 스페인어 |

## ✅ 준비 완료 (이 저장소에 있음)

| 항목 | 파일 |
|---|---|
| 앱 이름·부제·홍보 문구·설명·키워드·Play 짧은 설명 (3개 언어, 글자 수 검사 완료) | `store/listing/LISTING_DAILY_JOURNEY.md` (원본 `listing-journey.json`) |
| 앱 아이콘 | `store/icons/journey-appstore-1024.png` (App Store), `journey-play-512.png` (Play), `journey-android-foreground-432.png` |
| 스크린샷 (3개 언어 × 5장) | `store/screenshots/journey/apple-6.9-*.png` (1320×2868), `play-*.png` (1080×2340) |
| 개인정보 답변 · 심사 메모 · 연령 등급 | `store/PRIVACY_LABELS_AND_REVIEW.md` |
| 개인정보처리방침·약관·문의·계정 삭제 원고 | `store/legal/` |
| 폰 앱 (iOS·Android) 설정 | `mobile/` — 순서는 `mobile/README_KO.md` |

다시 만들기:

```bash
python3 tools/check-listing.py journey
```

```bash
cd mobile && node scripts/make-assets.cjs --native
```

```bash
python3 tools/build-single.py && node tools/make-journey-screenshots.js
```

## ☐ 직접 해야 하는 것

1. **개발자 계정 (D-U-N-S 번호 받은 뒤)**
   - Apple: 조직으로 가입. 비영리라면 연회비 면제 신청 가능.
   - Google Play: 조직 계정으로 가입 (1회 $25).
2. **웹 페이지 4개를 먼저 열기 — 꼭 제출 전에**
   - journey 브랜드에서는 앱 안 링크가 모두 **https://dailyjourney.org/…** 로 가요:
     `/privacy`, `/terms`, `/support`, `/delete-account`
   - 이 4개가 실제로 열리는지 확인한 뒤 제출하세요. 심사에서 꼭 눌러 봐요.
3. **App Store Connect**
   - 새 앱: 이름 Daily Journey, 번들 ID `org.dailyjourney.app`, 기본 언어 한국어.
   - Certificates, Identifiers & Profiles에서 App ID 두 개(`org.dailyjourney.app`, `org.dailyjourney.app.widget`)와 App Group `group.org.dailyjourney.app`을 만들어요.
   - Xcode › App 타깃 › Signing & Capabilities › Team 선택. 위젯 타깃 추가는 `mobile/README_KO.md` 4번.
   - 이름 "Daily Journey"가 이미 쓰이고 있으면 `listing-journey.json`의 이름을 바꾸고 `check-listing.py`를 다시 돌려요.
4. **Google Play Console**
   - 새 앱: 패키지 이름 `org.dailyjourney.app`.
   - **Play 앱 서명**을 켜고, 업로드 키(.jks)를 만들어 안전한 곳에 보관해요(잃어버리면 안 돼요).
   - Android Studio › Build › Generate Signed App Bundle(.aab)로 올려요.
5. **심사용 로그인 계정**
   - 로그인은 메일 또는 휴대폰 번호 + 숫자 코드(Supabase)예요.
   - Supabase에 심사용 테스트 계정을 만들어 고정 코드로 들어갈 수 있게 해 두고, 심사 메모의 `[…]` 자리에 적어요.
   - 그 계정이 공동체 하나에 들어가 있고, 다른 사람 글이 보이게 해 두세요(신고·차단을 눌러 볼 수 있게).
   - Google·Apple 로그인을 Supabase에서 켜면 **Sign in with Apple도 같이** 있어야 해요(Apple 4.8).
6. **신고 처리 담당**: 신고를 24시간 안에 확인할 사람과 알림(메일 등)을 정해요.
7. **출시 전 마지막 확인**: 아래 "알려진 문제"를 고쳤는지, 스크린샷을 다시 만들었는지.

## 스토어 이름을 다시 바꾼다면

이름(브랜드)을 바꾸면 아래가 **모두 같이** 바뀌어야 해요.

- 앱 ID·이름: `mobile/capacitor.config.json`, `mobile/android/app/build.gradle`, `strings.xml`, `mobile/ios/App/App.xcodeproj/project.pbxproj`, `Info.plist`, App Group(`SceneDelegate.swift`, `ios-widget/`)
- 웹 빌드 브랜드: `APP_BRAND=bible npm run sync` (기본은 journey)
- 아이콘·시작 화면: `mobile/scripts/make-assets.cjs`의 `WORD`와 파일 이름 → `node scripts/make-assets.cjs --native`
- 스토어 문구: `store/listing/listing-*.json` → `check-listing.py`
- 스크린샷: `BRAND=bible node tools/make-journey-screenshots.js`
- 앱 안 링크: daily bible 브랜드는 방침·약관 링크가 다른 주소로 가요(`app.js`의 `LEGAL_BASE`).
- 한 번 스토어에 올린 앱 ID는 바꿀 수 없어요. 처음 올리기 전에 정하세요.

## 알려진 문제 (앱 코드 쪽, 제출 전에 고치기)

- 「나」 화면의 영향력 줄에 **노란 빛 아이콘**이 보여요(흰·회색 원칙과 다름). 그래서 스크린샷에서 「나」 화면은 뺐어요.
- 「나」 화면 공동체 코드 입력칸 안내에 **"소그룹"** 이라는 말이 있어요 → "공동체"로.
- 「읽기」·피드의 오늘의 본문에 **"생명의 삶"** 이라는 다른 회사 큐티 책 이름이 보여요. 이름을 써도 되는지 확인하세요.
- 설교 노트 **예시**가 "구절 번호가 맞는지 봐 주세요"(노란 띠)를 띄워요. 스크린샷에서는 띠를 가렸어요.
- 스페인어로 볼 때 설교 노트 예시 내용이 영어로 나와요. 성경 읽기 화면의 글자 크기 버튼이 영어·스페인어에서도 "가±"로 보여요.
