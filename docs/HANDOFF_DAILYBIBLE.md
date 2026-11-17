# daily bible — 이어서 작업하기 (새 세션용)

## 코드 위치
- 저장소: `wonshon-cmd/dailythanksapp`, 브랜치 `claude/nifty-hopper-7tgmna` (모든 작업 여기 있음)
- 앱 하나로 두 앱: `app.js` + `styles.css` (vanilla JS). `BIBLE_MODE`일 때 daily bible.
- 문구: `app.js` 안의 STR (ko / en / es), 스페인어는 `i18n/es.json`에도 같이 넣기.
- 서버(설교 녹음 요약 등): `fullstack/` (테스트 `npm test`, 31개 통과)
- 모바일(Capacitor, 화면 꺼져도 녹음): `mobile/`
- 데이터베이스 규칙: `supabase/schema.sql` — ✅ Supabase에서 실행 완료 (다시 실행해도 안전)
- Supabase Project URL: `https://puhaycwpfpqsmxubvzkt.supabase.co`
- Supabase publishable 키 (앱에 넣는 공개 키): `sb_publishable_NYYC9G102Ct3YYuY_unhVA_pGGXFGBa`
- Supabase 설정 완료: Email(매직 링크·OTP) 켜짐, Confirm email 켜짐, 익명 로그인 꺼짐, Site URL / Redirect URL = 공개 사이트
- 실제 공개 전: Authentication › Emails › SMTP 에 전용 메일 서비스 연결 (기본 메일은 시간당 몇 통뿐)

## 빌드 · 공개
```
python3 tools/build-single.py          # dist/daily-bible.html, dist/daily-thanks.html
python3 tools/build-site.py            # site/web
(cd mobile && node scripts/build-web.mjs)
python3 tools/build-live.py <dailybible 저장소 경로>   # 공개 사이트 파일
```
- 공개 사이트: `wonshon-cmd/dailybible` 저장소 `main`에 push → GitHub Actions가 자동 배포
  - https://wonshon-cmd.github.io/dailybible/ (소개) · `/daily-bible/` (앱) · `/app/` (daily thanks) · `/schema.txt`

## 지켜야 할 것 (사용자 요청)
- 완전 하얀 · 미니멀 · 회색 알약 버튼. 노란색 X. "AI"라는 말 어디에도 쓰지 않기.
- 개인 데이터는 운영자도 못 보게(기기에서 잠근 뒤 저장). 공개로 표시하지 않은 남의 글은 공유/캡처 막기.
- Supabase는 **Project URL + anon(publishable) 키만** 받기. service_role / secret 키는 절대 받지 않기.
- "특허 출원 중" 표시는 실제 출원 전까지 끄기 (`content/content.json` `ipNotice.show: false`).
- 용어: 소그룹 → **공동체**.

## 연결된 것 (Supabase)
- 로그인: 이름 + 메일 → 메일 링크(또는 메일 템플릿에 `{{ .Token }}`을 넣으면 숫자 코드). 이름 = 감사 카드 보내는 사람. `app.js`의 `Cloud` / `emailLogin` / `sync`.
- 공동체 만들기(로그인 필요) · 초대 링크(`/daily-bible/#join?c=…&k=…`, 열쇠는 # 뒤에만) · 승인/거절/내보내기 · 초대 설정 · 새 링크.
- 링크가 Site URL(앞 페이지)로 와도 `build-live.py`가 넣은 스크립트가 앱으로 넘겨줌.
- "가장 꾸준한 사람": 관리자만. 관리 화면 스위치로 순장에게도 보이게(기본 꺼짐). `groups.top_to_leaders` — schema.sql 다시 실행 필요.

- 첫 방문: 이름 묻기 → Google · Microsoft · 카카오 · 메일 · 휴대폰 문자 (`welcomeSheet`). Supabase에서 안 켠 방법은 "곧 열려요" 안내.
  켜는 곳: Authentication › Sign In / Providers — Google, Azure(Microsoft), Kakao (각 개발자 콘솔의 Client ID/Secret 필요,
  콜백 `https://puhaycwpfpqsmxubvzkt.supabase.co/auth/v1/callback`), Phone (Twilio 등 문자 서비스 필요).
  Redirect URLs에 `https://wonshon-cmd.github.io/dailybible/**` 추가.

## 다음 할 일
1. Supabase 나머지: 기도제목/감사/묵상 나눔과 좋아요·기도했어요, 읽기 계획 함께하기,
   순장 도구·목사님 보기를 실제 권한으로 연결, 오늘의 본문(content.json) 매일 갱신
2. 계정 삭제를 Supabase에서도 (Edge Function 필요 — 비밀 키는 앱에 넣지 않기)
