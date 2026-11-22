# 상표 출원 안내 (Daily Journey · 매일 동행)

> 요약: **미국(USPTO)에 먼저** 글자 상표 "DAILY JOURNEY"를 내고, 6개월 안에 같은 출원을 바탕으로 **한국**(마드리드 국제출원 또는 특허청 직접)에 내요. 수수료는 바뀔 수 있으니 출원 직전에 각 사이트에서 확인하세요. 상표는 정말 중요하니 가능하면 변리사·상표 변호사의 한 번 검토를 권해요.

## 0. 지금 할 수 있는 것 (돈 안 듦)
- **™ 표시**: 등록 전에도 써도 돼요. 지금 앱·웹사이트에 `Daily Journey™`로 넣어 두었어요.
- **® 표시는 등록된 뒤에만** 써요. 등록 전에 쓰면 불법이에요.
- **© 저작권**: 로고·디자인·글·코드는 만든 순간 저작권이 생겨요. 앱 설정, 웹사이트 아래, 약관, 저장소(COPYRIGHT.md)에 표시해 두었어요.

## 1. 먼저 겹치는 상표가 있는지 찾기
1. 미국: https://tmsearch.uspto.gov 에서 `daily journey`, `dailyjourney`, `daily journal` 등을 찾아요. 앱·소프트웨어(9류, 42류), 소셜(45류)에서 비슷한 이름이 **살아 있는(LIVE)** 상태인지 봐요.
2. 한국: https://www.kipris.or.kr 에서 `데일리 저니`, `daily journey`, `매일 동행`을 찾아요.
3. 아주 비슷한 게 같은 분야에 있으면 출원 전에 이름이나 로고 방향을 다시 생각해요.

## 2. 미국 출원 (USPTO)
1. https://account.uspto.gov 에서 USPTO 계정을 만들고 **신원 확인(ID.me)** 을 해요.
2. https://www.uspto.gov/trademarks/apply 에서 **Trademark Center**로 새 출원을 시작해요.
3. 입력 내용
   - 출원인: **Daily Journey, Inc.** (뉴저지 법인), 주소 105 Challenger Rd, Suite 401, Ridgefield Park, NJ 07660
   - 상표 종류: **Standard characters (글자 상표)** → `DAILY JOURNEY`. 글자 상표가 글꼴·디자인과 상관없이 가장 넓게 보호돼요. 로고 그림 상표는 로고를 확정한 뒤 따로 내요.
   - 지정 상품·서비스(류): 목록(ID Manual)에서 골라야 추가 요금이 안 붙어요.
     - **9류**: Downloadable mobile application software for reading scripture, journaling and sharing with a community
     - **42류**: Providing temporary use of non-downloadable software for reading scripture, journaling and community sharing
     - (선택) **45류**: Online social networking services in the field of faith and religion
   - 출원 근거
     - 앱이 아직 스토어에 없으면 **1(b) Intent to use(사용 예정)** 로 내고, 출시 후 **Statement of Use**를 내요.
     - 웹사이트에서 이미 서비스 중이면 **1(a) Use in commerce**로 내고, 웹사이트 화면 캡처(이름이 보이는 화면)를 증거로 올려요.
4. 수수료: 류당 기본 $350 정도(2025년 기준). 목록에 없는 문구를 직접 쓰면 추가 요금이 붙어요.
5. 이후: 심사관 검토까지 몇 달 걸리고, 문제가 있으면 Office Action(보정 요구)이 와요. 3개월 안에 답해야 해요. 통상 1년 안팎에 등록돼요.

> 미국에 사는 출원인(미국 법인)은 변호사 없이 직접 낼 수 있어요.

## 3. 한국 출원 (특허청)
Daily Journey, Inc.는 외국 법인이라 한국에 직접 내려면 **한국 변리사(특허관리인)** 를 통해야 해요. 두 가지 방법이 있어요.

- **A. 마드리드 국제출원 (추천)**: 미국 출원을 바탕으로 USPTO Trademark Center에서 국제출원을 하고 지정국에 **대한민국(KR)** 을 넣어요. 미국 출원일로부터 **6개월 안**에 내면 미국 출원일을 한국에서도 인정받아요(우선권).
- **B. 특허청 직접 출원**: 변리사를 통해 특허로(https://www.patent.go.kr)로 내요. 류당 수수료는 몇만 원대예요(변리사 비용 별도).

한국에서는 **"매일 동행"(한글 글자 상표)** 도 같이 내는 걸 권해요. 류는 미국과 같아요(9류·42류, 선택 45류). 단, 로고를 확정한 뒤에 내요.

## 4. 디자인(화면·아이콘) 보호는?
- 저작권: 이미 자동으로 있어요. 미국에서 침해 소송을 하려면 등록이 필요해요. https://www.copyright.gov/registration/ 에서 앱(소프트웨어)과 로고를 각각 등록할 수 있고 비용이 저렴해요($45~$65 정도).
- 디자인 특허(아이콘·화면 모양): 비용이 크고 변리사가 거의 필수예요. 앱이 자리 잡은 뒤 생각해도 늦지 않아요.
- 앱의 "특허 출원 중" 표시는 실제로 출원 번호가 나오기 전까지 꺼 두어요(`content/content.json` `ipNotice.show: false`).

## 5. 출원 후 앱·웹사이트에 반영
- 출원 중: 계속 `™` 사용.
- 등록 후: `®`로 바꾸고, 등록 번호를 알려 주면 Claude가 앱·웹사이트·스토어 문구를 한 번에 바꿔요.

## 6. 앱에서 이미 해 둔 보호 (2026-11)
- 앱 설정 맨 아래, 웹사이트 아래, 약관(지식재산권 조항)에 `© 2026 Daily Journey, Inc. All rights reserved.`와 `Daily Journey™` 표시.
- 로고·워드마크·아이콘: 길게 누르기/오른쪽 클릭 저장, 끌어서 가져가기 막음.
- 코드 파일 맨 위에 저작권 표시, 저장소에 `COPYRIGHT.md`.
- 웹 크롤러에 `noai, noimageai` 표시(존중하는 곳만 따라요).
- 스토어: App Store Connect의 **Copyright** 칸에 `2026 Daily Journey, Inc.`를 넣어요.

> 화면 캡처 자체를 완전히 막을 방법은 없어요(다른 휴대폰으로 찍을 수도 있어요). 그래서 실제 보호는 **상표 등록 + 저작권 표시 + 약관**으로 해요. 남의 비공개 글 캡처 막기는 이미 따로 되어 있어요.
