"""Check store listing text against App Store / Google Play limits and write the Markdown copies.

  python3 tools/check-listing.py           # both apps
  python3 tools/check-listing.py bible     # daily bible only: store/listing/listing-bible.json → LISTING_DAILY_BIBLE.md
  python3 tools/check-listing.py thanks    # daily thanks only: store/listing/listing.json → LISTING.md
"""
import json, pathlib, re, sys
root = pathlib.Path(__file__).resolve().parent.parent
APPS = {
    'thanks': ('listing.json', 'LISTING.md', '스토어 등록 문구'),
    'bible': ('listing-bible.json', 'LISTING_DAILY_BIBLE.md', 'Daily Bible 스토어 등록 문구'),
}
LIMITS = {('appstore', 'name'): 30, ('appstore', 'subtitle'): 30, ('appstore', 'promo'): 170, ('appstore', 'keywords'): 100,
          ('appstore', 'whatsnew'): 4000, ('play', 'title'): 30, ('play', 'short'): 80, ('description',): 4000}
NAMES = {'ko': '한국어', 'en': 'English', 'es': 'Español'}
# Words the daily bible listing must never use (owner's rules): no "AI", 공동체 not 소그룹, no patent claims.
# Case-sensitive for AI/IA (so "aire", "iglesia" pass); the rest ignore case.
BANNED = {'bible': [re.compile(r'\bAI\b|\bIA\b|인공지능|소그룹|특허'), re.compile(r'small ?group|patent', re.I)]}

ok = True
for app in (sys.argv[1:] or APPS):
    src, dst, heading = APPS[app]
    data = json.loads((root / 'store/listing' / src).read_text(encoding='utf-8'))
    out = [f'# {heading} (자동 생성 · 글자 수 검사 완료)\n', f'`python3 tools/check-listing.py {app}`로 다시 만들 수 있어요. 원본: `store/listing/{src}`\n']
    print(f'== {app} ({src})')
    for lang, d in data.items():
        out.append(f'\n## {NAMES[lang]}\n')
        for (sec, *key), lim in LIMITS.items():
            val = d[sec] if not key else d[sec][key[0]]
            n = len(val.encode('utf-8')) if key == ['keywords'] else len(val)  # Apple counts keyword bytes
            flag = 'OK' if n <= lim else 'TOO LONG'
            if n > lim: ok = False
            if key == ['keywords'] and re.search(r',\s', val): flag += ' (no spaces after commas)'; ok = False
            label = sec if not key else f'{sec}.{key[0]}'
            print(f'{lang:3} {label:20} {n:5}/{lim:<5} {flag}')
            out.append(f'\n### {label}  ({n}/{lim})\n\n```\n{val}\n```\n')
        for pat in BANNED.get(app, []):
            for m in pat.finditer(json.dumps(d, ensure_ascii=False)):
                print(f'{lang:3} BANNED WORD: {m.group(0)!r}'); ok = False
    (root / 'store/listing' / dst).write_text(''.join(out), encoding='utf-8')
print('ALL OK' if ok else 'SOME FIELDS NEED FIXING')
sys.exit(0 if ok else 1)
