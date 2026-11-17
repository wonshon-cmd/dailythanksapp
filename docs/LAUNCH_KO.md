# 실제로 공개하기 — GitHub 공개 주소 + Supabase 로그인

## 1. 공개 주소 (GitHub Pages) — ✅ 공개됨
- https://wonshon-cmd.github.io/dailybible/ — daily bible 소개
- https://wonshon-cmd.github.io/dailybible/daily-bible/ — daily bible 앱
- https://wonshon-cmd.github.io/dailybible/app/ — daily thanks 앱
- 다시 올릴 때: `python3 tools/build-site.py` → `python3 tools/build-live.py <dailybible 저장소>` → 그 저장소에 push (자동 배포)

## 2. 로그인 · 초대 · 소그룹 공유 (Supabase)
1. https://supabase.com 에서 무료 계정 → **New project** (지역: Northeast Asia (Seoul) 추천)
2. 왼쪽 **SQL Editor** → `supabase/schema.sql` 내용을 붙여 넣고 **Run**
3. **Authentication › Providers**
   - **Email** 켜기 (비밀번호 없이 메일 링크로 로그인)
   - **Google** 켜기 → Google Cloud에서 OAuth 클라이언트 ID/비밀키를 만들어 넣기
   - **Apple**은 앱스토어 출시 때 (Apple 개발자 계정 필요)
4. **Authentication › URL Configuration › Site URL**: `https://wonshon-cmd.github.io/dailybible/`
5. **Project Settings › API**에서 두 가지를 알려주세요.
   - **Project URL** (`https://xxxx.supabase.co`)
   - **anon public** 키 — 앱에 들어가도 되는 공개 키예요
   - ⚠️ **service_role** 키는 절대 보내지 마세요. 서버 비밀값이에요.

## 누가 무엇을 볼 수 있나 (데이터베이스 규칙 — schema.sql)
- 비공개 글: 쓴 사람만. 휴대폰에서 잠근 뒤 올라가서 운영자도 못 열어요.
- 소그룹 글: 그 소그룹 멤버만.
- 모두에게 공개한 글: 로그인한 사람.
- 순모임 기록 · 순원 메모: 그 소그룹 순장/리더, 교회 목사님·관리자만.
- 초대 링크로만 남의 소그룹에 들어갈 수 있어요(승인 켜면 리더가 승인해야 들어와요).

## 키를 받으면 제가 할 일
- 로그인 화면(메일 링크 · Google) → 계정 만들기
- 내 기록을 기기에서 잠근 채 서버와 동기화
- 소그룹 만들기 · 초대 링크 · 승인 · 멤버 이름 바꾸기를 서버로
- 기도제목 · 감사 · 묵상 나눔, 좋아요 · 기도했어요를 실시간으로
- 읽기 계획 초대 링크를 서버 계획으로 (같은 계획을 함께 진행)
- 순모임 · 출석 · 순원 메모 · 목사님 대시보드를 로그인 권한으로 (지금의 '링크에 담는' 방식 대신)
