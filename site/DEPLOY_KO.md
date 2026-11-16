# dailyjourney.org에 웹사이트 올리기

올릴 파일: `site/dailyjourney-website.zip` (압축을 풀면 `index.html`, `privacy/`, `terms/`, `support/`, `delete-account/` …)
다시 만들기:

```bash
python3 tools/build-site.py
```

## 추천: Netlify (무료, HTTPS 자동)

1. https://app.netlify.com/drop 에 들어가 무료 가입을 해요.
2. zip을 푼 **폴더**를 화면에 끌어다 놓아요. 몇 초 뒤 `xxxx.netlify.app` 주소로 사이트가 열려요.
3. **Site configuration › Domain management › Add a domain**에서 `dailyjourney.org`를 넣어요.
4. 도메인을 산 곳(Squarespace Domains, GoDaddy 등)의 **DNS 설정**에서:
   - `A` 레코드 · 호스트 `@` · 값 `75.2.60.5`
   - `CNAME` 레코드 · 호스트 `www` · 값 `xxxx.netlify.app`
   - 기존에 `@`나 `www`를 가리키던 A/CNAME 레코드는 지워요.
   - ⚠️ **MX · TXT 레코드는 절대 건드리지 마세요.** hi@dailyjourney.org 메일이 끊겨요.
5. 몇 분~몇 시간 뒤 https://dailyjourney.org 가 열리고, Netlify가 HTTPS를 자동으로 켜요.

나중에 내용을 바꾸면: zip을 다시 만들어 Netlify의 **Deploys** 화면에 폴더를 다시 끌어다 놓으면 끝이에요.

## 확인할 주소

- https://dailyjourney.org
- https://dailyjourney.org/privacy/
- https://dailyjourney.org/terms/
- https://dailyjourney.org/support/
- https://dailyjourney.org/delete-account/
- https://dailyjourney.org/content.json  ← 앱이 글을 내려받는 파일 (앱의 `DT_CONTENT_URL`에 이 주소를 넣으면 돼요)
