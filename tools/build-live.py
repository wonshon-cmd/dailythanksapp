#!/usr/bin/env python3
"""Build the public GitHub Pages site (github.com/wonshon-cmd/dailybible) from site/web.

  python3 tools/build-site.py            # first: refresh site/web
  python3 tools/build-live.py OUT_DIR    # then: copy into the dailybible repo checkout

Layout at https://wonshon-cmd.github.io/dailybible/
  /               daily bible introduction page
  /daily-bible/   daily bible app
  /app/           daily thanks app
  /thanks/        daily thanks introduction page
  /join/ /t/ /privacy/ /terms/ /support/ /delete-account/   links and legal pages
Every https://dailyjourney.org link (and root-absolute "/..." link) is pointed at the new address.
"""
import shutil, sys, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / 'site' / 'web'
BASE = 'https://wonshon-cmd.github.io/dailybible'
PREFIX = '/dailybible'

out = Path(sys.argv[1]).resolve()
out.mkdir(parents=True, exist_ok=True)
for p in out.iterdir():                      # keep the repo's own files (.git, .github, README)
    if p.name in ('.git', '.github', 'README.md'): continue
    shutil.rmtree(p) if p.is_dir() else p.unlink()

skip = {'CNAME', 'dailybible', 'index.html'}
for p in WEB.iterdir():
    if p.name in skip: continue
    (shutil.copytree(p, out / p.name) if p.is_dir() else shutil.copy2(p, out / p.name))
# (the daily thanks intro is already at site/web/thanks/)
# this site is "daily bible": undo the dailyjourney.org name on the app page
bbi = out / 'daily-bible' / 'index.html'
bbi.write_text(bbi.read_text().replace(' window.DT_BRAND = "journey";', '').replace('Daily Journey · 말씀을 매일', 'Daily Bible · 말씀을 매일').replace('content="Daily Journey"', 'content="Daily Bible"'))
for p in (WEB / 'dailybible').iterdir():     # the daily bible page is the front page (and its icons win)
    (shutil.copytree(p, out / p.name, dirs_exist_ok=True) if p.is_dir() else shutil.copy2(p, out / p.name))
shutil.copy2(ROOT / 'content' / 'content.json', out / 'content.json')
# e-mail sign-in links that land on the front page (Supabase Site URL) go on to the app with their tokens
front = out / 'index.html'
front.write_text(front.read_text().replace('<head>', '<head>\n<script>if (/(^#|&)(access_token|error_description)=/.test(location.hash)) location.replace(\'daily-bible/\' + location.hash);</script>', 1))
(out / '.nojekyll').write_text('')
shutil.copy2(ROOT / 'supabase' / 'schema.sql', out / 'schema.txt')   # easy to open and copy on a phone (Supabase › SQL Editor)

# cache-busting: GitHub Pages caches files ~10 min, so the pages ask for app.js / styles.css by content version
import hashlib
for page in out.rglob('index.html'):
    d = page.parent; t = page.read_text()
    for name in ('app.js', 'styles.css'):
        if (d / name).exists() and f'"{name}"' in t:
            v = hashlib.sha1((d / name).read_bytes()).hexdigest()[:10]
            t = t.replace(f'"{name}"', f'"{name}?v={v}"')
    page.write_text(t)

n = 0
for f in out.rglob('*'):
    if f.suffix not in ('.html', '.js', '.json') or '.git' in f.parts or f.parent.name in ('korean', 'kjv', 'valera'): continue
    s = f.read_text()
    t = s.replace('https://dailyjourney.org/dailybible/', BASE + '/').replace('https://dailyjourney.org', BASE)
    t = re.sub(r'(?<![@\w./])dailyjourney\.org(?=/)', BASE.split('//')[1], t)   # address shown as text (not the e-mail)
    if f.suffix == '.html':
        t = re.sub(r'(href|src|action)="/(?!/)', rf'\1="{PREFIX}/', t)
    if t != s: f.write_text(t); n += 1
print(f'built {out} · {n} files pointed at {BASE}')
