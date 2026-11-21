# 스토어 출시 후 업데이트하는 법 — Daily Journey

## 1. 대부분은 아무것도 안 해도 돼요 (자동 업데이트)

여기서 바꾸고 합치면(merge) 몇 분 뒤 **이미 깔린 앱이 알아서 새 버전을 받아요.** 스토어 심사 없음.

- 해당: 디자인, 글자·문구, 화면 구성, 기능 대부분 (`app.js`, `styles.css`)
- 앱은 켤 때·다시 돌아올 때 `dailyjourney.org/app-update.json`을 확인하고, 다음에 열 때 새 버전을 써요.
- 새 버전이 혹시 안 열리면 앱이 스스로 원래 버전으로 돌아가요.

## 2. 스토어에 새로 올려야 하는 경우 (가끔)

앱 아이콘·이름, 권한(알림 등), 새 휴대폰 기능(플러그인), `mobile/src/native.js`를 바꿀 때만이에요.
그때는 `native.js`의 `DT_NATIVE_VERSION`과 `tools/build-site.py`의 `minNative`를 같이 올려 주세요(Claude가 해 줘요).

**버튼 한 번:** GitHub › **Actions** › **Store release** › **Run workflow**
- `stores`: both(둘 다) / google / apple
- `play_track`: internal(테스터만) → 확인 후 production(모두). file-only는 파일만 만들어요(첫 업로드용).
- 버전 이름은 `mobile/package.json`의 `version`(예: 1.0.1), 빌드 번호는 자동으로 올라가요.
- Apple: 올라간 빌드가 App Store Connect › TestFlight에 나타나요 → 앱 페이지에서 그 빌드를 골라 **심사 제출**만 누르면 돼요.
- Google: production을 고르면 심사 후 바로 배포돼요.

## 3. 처음 한 번만: 열쇠 넣기

열쇠는 **GitHub › Settings › Secrets and variables › Actions › New repository secret** 에만 넣어요. 채팅에 붙여 넣지 마세요.

### Google Play (5개)

1. **업로드 키 만들기**: Actions › **Make Android upload key** › Run workflow → 끝난 실행을 열고 맨 아래 **android-upload-key** 다운로드(1일 보관).
   안의 `.txt` 4개가 그대로 시크릿이에요: 파일 이름 = 시크릿 이름, 내용 = 값.
   `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`
   다 넣었으면 받은 파일은 지우세요. (잃어버려도 Play App Signing이라 Google에서 다시 정할 수 있어요.)
2. **서비스 계정** (`PLAY_SERVICE_ACCOUNT_JSON`):
   Google Cloud Console › 새 프로젝트 › **IAM 및 관리자 › 서비스 계정 › 만들기** → 키 › JSON 키 만들기(파일 다운로드).
   Play Console › **사용자 및 권한 › 새 사용자 초대**에 그 서비스 계정 메일을 넣고, 앱 권한: **출시 관리**.
   Cloud Console에서 **Google Play Android Developer API** 사용 설정.
   JSON 파일 내용 전체를 시크릿 값으로 넣어요.
3. **첫 업로드는 손으로 한 번**: Google은 앱의 첫 파일을 Play Console에서 직접 올려야 해요.
   Actions › Store release › `stores: google`, `play_track: file-only`로 실행 → 끝난 실행에서 **daily-journey-aab** 다운로드.
   (이 단계는 1번 열쇠 4개만 있으면 돼요.)
   Play Console › 테스트 › 내부 테스트 › 새 버전 만들기 › 그 `.aab` 올리기. 그다음부터는 버튼으로 바로 올라가요.

### Apple (4개)

1. `APPLE_TEAM_ID`: developer.apple.com › Account › **Membership details**의 Team ID (10자리).
2. App Store Connect › **사용자 및 액세스 › 통합 › App Store Connect API** › 키 만들기 (액세스: **App Manager**).
   - `ASC_KEY_ID`: 키 ID
   - `ASC_ISSUER_ID`: 위쪽의 Issuer ID
   - `ASC_KEY_P8`: 다운로드한 `AuthKey_….p8` 파일을 텍스트로 열어 **전체 내용**(BEGIN/END 줄 포함) — 한 번만 받을 수 있어요.
3. App Store Connect에 앱(번들 ID `org.dailyjourney.app`)이 먼저 만들어져 있어야 해요.

## 4. 문제가 생기면

- Actions 실행이 빨간색이면 Claude에게 "Store release 실패했어"라고만 말해 주세요. 로그를 보고 고쳐요.
- 열쇠가 아직 없으면 "keys are not set yet"이라는 안내와 함께 멈춰요(아무것도 올라가지 않아요).
