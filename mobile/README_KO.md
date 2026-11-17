# Daily Thanks 폰 앱 (iOS · Android)

웹 앱(저장소 맨 위의 `index.html`, `styles.css`, `app.js`)을 **Capacitor**로 감싼 앱이에요.
화면이나 글을 고치면 맨 위 파일만 고치고 `npm run sync`를 하면 두 앱에 똑같이 들어가요.

| 항목 | 값 |
|---|---|
| 앱 ID (번들 ID · 패키지 이름) | `org.dailyjourney.dailythanks` |
| 앱 이름 | Daily Thanks |
| 바로가기 링크 | `daily-thanks://write` → 글쓰기 화면 |
| 글 내려받는 곳 | https://dailyjourney.org/content.json |

## 들어 있는 것

- **공유:** 감사 카드 이미지·글을 휴대폰 공유 창으로 보내요. 카카오톡, 인스타그램, 문자, WhatsApp 등으로 보낼 수 있어요.
- **매일 알림:** 앱에서 고른 시간에 "오늘 감사한 것은?"을 보내요.
  - 그날 이미 썼으면 보내지 않아요.
  - 알림을 누르면 글쓰기 화면이 바로 열려요.
- **홈 화면 위젯 네 가지:** 「오늘의 말씀」(감사 말씀, 매일 바뀜), 「오늘의 감사」(오늘 쓴 감사 또는 질문 + 연속 기록), 「오늘의 묵상」(오늘 본문 + 묵상 쓰기), 「감사 쓰기」. 다크 모드 자동. 앱이 오늘 내용을 위젯에 넘겨줘요(WidgetBridge).
  - Android는 완성돼 있어요.
  - iOS는 Xcode에서 한 번 추가해야 해요(아래 4번).
- **Android 뒤로가기 버튼:** 열린 창이 있으면 먼저 닫고, 없으면 앱을 내려요.
- **아이콘과 시작 화면:** 흰 바탕의 해 아이콘, 흰 바탕에 *daily thanks*가 보이는 시작 화면이에요.
- **폰 기능 연결 코드:** `src/native.js`예요. 브라우저에서는 아무 일도 하지 않아요.

## 1. 처음 한 번 (컴퓨터 준비)

1. **Node.js 22 이상**을 설치해요.
2. **Android:** Android Studio를 설치해요.
3. **iOS:** Mac에 Xcode 16 이상을 설치해요.
4. 이 저장소를 받은 뒤 아래 명령을 실행해요.

```bash
cd mobile
```

```bash
npm install
```

## 2. 고친 내용을 앱에 넣기

```bash
npm run sync
```

## 3. Android

```bash
npm run android
```

- Android Studio가 열리면 ▶ 버튼으로 휴대폰(USB 연결)이나 에뮬레이터에서 실행해요.
- **설치 파일(APK) 만들기:** `npm run apk`를 실행하면 `android/app/build/outputs/apk/debug/app-debug.apk`가 생겨요.
- **Google Play에 올릴 파일:** Android Studio › Build › Generate Signed App Bundle(.aab)에서 만들어요.
  - 이때 만드는 **서명 키(.jks)와 비밀번호는 절대 잃어버리면 안 돼요.**

## 4. iOS (Mac)

```bash
npm run ios
```

1. Xcode가 열리면 **App** 타깃 › **Signing & Capabilities** › **Team**에서 Apple 개발자 계정을 골라요.
   - 개발자 프로그램 가입 전에는 개인 Apple ID로 내 아이폰에서만 시험할 수 있어요.
2. 아이폰을 연결하고 ▶ 버튼을 눌러요.
3. **위젯 추가 (한 번만):**
   1. File › New › Target › **Widget Extension**을 골라요.
   2. 이름은 `DailyThanksWidget`으로 하고, "Include Configuration App Intent"는 체크하지 않아요.
   3. 만들어진 Swift 파일 내용을 `mobile/ios-widget/DailyThanksWidget.swift`로 바꿔요.
   4. **App Groups 켜기:** App 타깃과 위젯 타깃 둘 다 Signing & Capabilities › + Capability › App Groups → `group.org.dailyjourney.dailythanks` 체크. (오늘의 감사·묵상 위젯이 앱 내용을 읽는 통로예요.)
   5. 다시 ▶ 실행 → 홈 화면을 길게 눌러 위젯을 추가해요.
4. **App Store 제출:** Product › Archive → Distribute App → App Store Connect를 차례로 눌러요.

## 아이콘·시작 화면 다시 만들기

```bash
node scripts/make-assets.cjs
```

```bash
npm run assets
```

## 아직 남은 것

- **진짜 로그인:** Apple, Google, 휴대폰 번호 로그인과 서버 저장을 Firebase로 연결해야 해요. 지금은 로그인 상태를 기기 안에만 저장해요.
- **푸시 알림(서버에서 보내는 알림):** 지금 알림은 기기 안에서 예약하는 방식이라 서버가 필요 없어요. 소그룹 소식 같은 알림을 보내려면 그때 추가해요.
- **위젯에 오늘의 질문 연결:** 지금은 고정 질문이에요. 앱의 오늘의 질문과 맞추려면 App Group 저장소로 연결해요.


## 보안 저장 (꼭 확인)

- **기록 보호 열쇠:** 아이폰은 Keychain, 안드로이드는 Keystore에 저장돼요(SecureStore). 웹 저장소에는 남지 않아요.
  처음 실행 때 예전 웹 저장소에 있던 열쇠를 자동으로 옮기고 지워요.
- **기기 저장 데이터:** 앱 안에만 저장되고, 휴대폰 잠금과 함께 OS가 암호화해요.
  - 안드로이드: 백업(구글 드라이브·adb)으로 데이터가 빠져나가지 않게 `allowBackup=false`.
  - 아이폰: Xcode › App 타깃 › Signing & Capabilities › **+ Data Protection** 추가 → **Complete Protection** 선택
    (휴대폰이 잠겨 있으면 앱 파일도 잠겨요).
- **출시 빌드:** 웹 디버깅이 꺼져 있어요(`webContentsDebuggingEnabled: false`).
- **서버:** 개인 기록은 기기에서 잠근 뒤 보내요. 운영자도 열 수 없어요(설정 › 기록 보호의 복구 키로만 다른 기기에서 열려요).
