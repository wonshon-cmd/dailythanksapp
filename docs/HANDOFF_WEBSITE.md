# dailyjourney.org 웹사이트 — 이어서 작업하기 (새 세션용)

이제 앱(daily bible / Daily Journey)과 **웹사이트 dailyjourney.org** 모두 한 세션에서 해요(앱은 `docs/HANDOFF_DAILYBIBLE.md`, 스토어 제출은 `store/SUBMISSION_CHECKLIST_KO.md`).
같은 브랜치 `claude/nifty-hopper-7tgmna`를 같이 써요 → push 전에 항상 `git fetch origin claude/nifty-hopper-7tgmna && git merge --no-edit FETCH_HEAD`.

## 어떻게 공개되나
- 저장소 `wonshon-cmd/dailythanksapp`의 **main**에 들어가면 `.github/workflows/website.yml`이 `python3 tools/build-site.py`로 `site/web`을 만들어 GitHub Pages(dailyjourney.org)에 올려요.
- 순서: 브랜치에서 작업 → push → main으로 PR 만들고 merge (사용자가 "올려줘" 하면 merge까지 해도 됨) → Actions › Website 성공 확인.
- GitHub Pages 설정: Source = GitHub Actions, Custom domain = `dailyjourney.org`, Enforce HTTPS 체크됨. (2026-11-17 기준 DNS check 진행 중 → 끝나면 주소창 ⚠️가 🔒로 바뀜. 오래 걸리면 Squarespace DNS 확인: A @ 185.199.108~111.153 4개, CNAME www → wonshon-cmd.github.io, 다른 기본 기록 없음)
- 이 환경에선 dailyjourney.org에 직접 접속이 안 돼요. 확인은 `site/web`을 Playwright `page.route`로 `https://dailyjourney.org/**`에 물려서 열어 보기.

## 사이트 구성 (site/web)
| 주소 | 내용 | 원본 |
|---|---|---|
| `/` | **daily journey** 첫 화면 (앱 하나, 기능 6개, 웹에서 열기 → /daily-bible/) | `site/dailyjourney.html` |
| `/daily-bible/` | 앱 (Bible 모드, 이름 "daily journey": `window.DT_BRAND = "journey"`) | `index.html` + `app.js` (build-site.py) |
| `/dailybible/` | daily bible 소개 페이지 (첫 화면에서는 링크 안 함) | `site/dailybible.html` |
| `/app/`, `/thanks/` | daily thanks 앱 · 소개 (첫 화면에선 뺐지만 예전 링크 때문에 유지) | `site/template.html` |
| `/privacy/ /terms/ /support/ /delete-account/` | 법적 문서 (ko/en/es) | `store/legal/*.md` → build-site.py |
| `/join/ /t/` | 초대 · 공유 링크 | `site/template.html` |

- 휴대폰 앱과 dailyjourney.org는 항상 `LEGAL_BASE = https://dailyjourney.org` (app.js 952~955). github.io 사본만 자기 주소.
- `tools/build-live.py`는 별도 사이트 wonshon-cmd.github.io/dailybible 용 (앱 세션 담당). 거기선 이름이 "daily bible"로 돌아감.

## 회사 정보 (모든 페이지 아래, 글자 그대로 유지 — DUNS 심사용)
- Daily Journey, Inc.
- A New Jersey nonprofit corporation · 501(c)(3) application pending with the IRS
  (ko: 미국 뉴저지주에 설립된 비영리 법인 · 미국 국세청(IRS) 501(c)(3) 승인 신청 중)
- 105 Challenger Rd, Ridgefield Park, NJ 07660, United States
- hi@dailyjourney.org
- 첫 화면에 schema.org `Organization` 데이터(이름·주소·이메일)와 canonical URL 있음.

## 꼭 지킬 것
- **사실이 아닌 표시 금지**: 501(c)(3)는 승인 전까지 "application pending"만. "tax-exempt", "기부금 공제" 쓰지 않기. "registered charity"는 NJ 자선단체 등록(Charities Registration) 마친 뒤에만. 특허 "pending"도 실제 출원 전엔 표시 안 함 (`content/content.json` `ipNotice.show: false`).
- 법적 문서에 `[대괄호]` 빈칸이 화면에 보이면 안 됨 (지금 0개).
- "AI"라는 말 쓰지 않기. 하얗고 미니멀한 디자인, 회색 알약 버튼.
- 개인정보·키: Supabase는 publishable 키만. secret / service_role 키는 받지도 쓰지도 않기.

## 남은 일 (사용자 확인 필요)
1. ✅ 개인정보처리방침·약관·문의·계정 삭제 페이지와 제목을 Daily Journey 기준으로 고침 (첫 화면 기능 소개도 첫 버전 앱에 맞춤: 설교 노트 자동 요약 없음).
2. Supabase › Authentication › URL Configuration › Redirect URLs에 `https://dailyjourney.org/**` 추가 (사용자가 직접). 휴대폰 앱은 메일 숫자 코드로 로그인해서 따로 넣을 주소가 없음.
3. 회사 전화번호를 사이트에 넣을지 (DUNS가 물어볼 수 있음).
4. 501(c)(3) 승인 / NJ 자선단체 등록이 되면 문구 바꾸기 (+ EIN).
5. HTTPS(🔒) 확인.
