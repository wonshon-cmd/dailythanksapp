"""Check store listing text against App Store / Google Play limits and write store/listing/LISTING.md."""
import json, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
data = json.loads((root / 'store/listing/listing.json').read_text(encoding='utf-8'))
LIMITS = {('appstore', 'name'): 30, ('appstore', 'subtitle'): 30, ('appstore', 'promo'): 170, ('appstore', 'keywords'): 100,
          ('appstore', 'whatsnew'): 4000, ('play', 'title'): 30, ('play', 'short'): 80, ('description',): 4000}
ok = True; out = ['# 스토어 등록 문구 (자동 생성 · 글자 수 검사 완료)\n', '`python3 tools/check-listing.py`로 다시 만들 수 있어요. 원본: `store/listing/listing.json`\n']
NAMES = {'ko': '한국어', 'en': 'English', 'es': 'Español'}
for lang, d in data.items():
    out.append(f'\n## {NAMES[lang]}\n')
    for (sec, *key), lim in LIMITS.items():
        val = d[sec] if not key else d[sec][key[0]]
        n = len(val.encode('utf-8')) if key == ['keywords'] else len(val)  # Apple counts keyword bytes
        flag = 'OK' if n <= lim else 'TOO LONG'
        if n > lim: ok = False
        label = sec if not key else f'{sec}.{key[0]}'
        print(f'{lang:3} {label:20} {n:5}/{lim:<5} {flag}')
        out.append(f'\n### {label}  ({n}/{lim})\n\n```\n{val}\n```\n')
(root / 'store/listing/LISTING.md').write_text(''.join(out), encoding='utf-8')
print('ALL OK' if ok else 'SOME FIELDS TOO LONG')
