# 하나의 앱, 세 가지 언어 (한국어 · English · Español)

**앱은 하나만 올려요.** 언어마다 따로 올리면 Apple은 거의 같은 앱을 여러 번 올린 스팸으로 보고 거절할 수 있어요. 다운로드와 리뷰가 나뉘어 순위도 떨어져요.
앱 하나에 **언어(현지화)를 추가**하면, 사람마다 휴대폰 언어·지역에 맞는 이름·설명·스크린샷이 보여요.
앱 안의 글도 이미 세 언어로 들어 있어요. 휴대폰 언어를 따라가고, 사용자가 직접 고르면 그 언어를 기억해요.

넣을 문구는 모두 `store/listing/LISTING_DAILY_JOURNEY.md`에 언어별로 있어요(글자 수 검사 완료, 원본 `listing-journey.json`).
스크린샷은 `store/screenshots/journey/`에 있어요.

| | 한국어 | English | Español |
|---|---|---|---|
| Apple 스크린샷 (6.9") | `apple-6.9-ko-1~6.png` | `apple-6.9-en-1~6.png` | `apple-6.9-es-1~6.png` |
| Google 스크린샷 | `play-ko-1~6.png` | `play-en-1~6.png` | `play-es-1~6.png` |

## Apple — App Store Connect

1. 내 앱 › Daily Journey › **앱 정보** › 오른쪽 위 언어 메뉴에서 **기본 언어**를 정해요. 추천: 한국어. 기본 언어는 해당 언어가 없는 나라에서 보여요. 미국 등 영어권에도 낼 거면 English(U.S.)도 괜찮아요.
2. 같은 언어 메뉴 › **언어 추가**로 나머지 두 언어를 넣어요. 한국어는 Korean, 영어는 English (U.S.), 스페인어는 **Spanish (Mexico)**와 **Spanish (Spain)** 둘 다 넣으면 중남미와 스페인 모두에 보여요.
3. 언어를 하나씩 고르고 채워요.
   - **앱 정보**: 이름(`appstore.name`), 부제(`appstore.subtitle`)
   - **버전 페이지**: 프로모션 텍스트(`promo`), 설명(`description`), 키워드(`keywords`), 이번 버전의 새로운 기능(`whatsnew`), 그리고 그 언어의 스크린샷 6장
4. 개인정보처리방침 URL·지원 URL은 언어마다 같은 주소를 넣어도 돼요. 사이트가 언어를 따라 바뀌어요.

## Google — Play Console

1. 앱 › **기본 스토어 등록정보** › **번역 관리** › **직접 번역 추가**에서 영어(미국) `en-US`, 스페인어(중남미) `es-419`, 스페인어(스페인) `es-ES`를 추가해요. 기본 언어는 한국어 `ko-KR`.
2. 언어마다 앱 이름(`play.title`), 간단한 설명(`play.short`), 자세한 설명(`description`), 휴대폰 스크린샷(`play-<언어>-1~6.png`)을 넣어요.
3. 광고를 하게 되면 Google Ads의 **앱 캠페인**으로 한 등록정보에 여러 언어 광고를 붙일 수 있어요(Apple은 Apple Search Ads).

## 나중에 문구를 바꿀 때

`listing-journey.json`을 고친 뒤 `python3 tools/check-listing.py journey`를 실행하면 글자 수를 검사하고 MD를 다시 만들어요(Claude가 해 줘요).
스크린샷은 `python3 tools/build-single.py && node tools/make-journey-screenshots.js`로 세 언어를 한 번에 다시 만들어요.
