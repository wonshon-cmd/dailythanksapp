# dailyjourney.org에 웹사이트 올리기 — GitHub Pages + Squarespace 도메인

`main` 브랜치에 사이트·약관·`content/content.json`이 바뀌면 GitHub가 자동으로 사이트를 다시 만들어 올려요 (`.github/workflows/website.yml`).

## 1. GitHub에서 (한 번만)

1. 저장소 **Settings › Pages**
   - **Source:** `GitHub Actions`
   - **Custom domain:** `dailyjourney.org` → Save
2. 이 작업 브랜치를 `main`에 합치면(merge) 첫 배포가 시작돼요. **Actions** 탭에서 "Website"가 초록색이 되면 완료예요.
3. DNS가 연결된 뒤 Settings › Pages에서 **Enforce HTTPS**를 켜요.

## 2. Squarespace에서 (Domains › dailyjourney.org › DNS › DNS Settings)

**Custom records**에 추가:

| Host | Type | Data |
|---|---|---|
| @ | A | 185.199.108.153 |
| @ | A | 185.199.109.153 |
| @ | A | 185.199.110.153 |
| @ | A | 185.199.111.153 |
| www | CNAME | wonshon-cmd.github.io |

- **Squarespace Defaults** 묶음(Squarespace 사이트용 A/CNAME 레코드)이 있으면 휴지통 아이콘으로 지워요. 그래야 GitHub로 연결돼요.
- ⚠️ **MX · TXT 레코드(메일, Google Workspace 등)는 그대로 두세요.** hi@dailyjourney.org 메일이 끊기지 않아요.
- 반영까지 보통 몇 분, 길면 24시간.

## 확인할 주소

- https://dailyjourney.org
- https://dailyjourney.org/privacy/ · /terms/ · /support/ · /delete-account/
- https://dailyjourney.org/content.json ← 앱이 글을 내려받는 파일 (네이티브 앱의 `DT_CONTENT_URL`)

## 나중에 내용을 바꾸면

`store/legal/*.md`나 `content/content.json`, `site/template.html`을 고쳐서 main에 올리면 1~2분 뒤 사이트에 반영돼요.
