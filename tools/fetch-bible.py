#!/usr/bin/env python3
"""Downloads the free (public-domain) Bibles the app offers and saves one file per book:
   bible/<id>/<book 1-66>.json  =  {"chapters": [[[verse, "text"], ...], ...]}
   bible/index.json             =  [{"id", "name", "full", "lang", "chapters"}, ...]  (what the app lists in Settings)
Source: getBible API v2 (api.getbible.net), which only carries public-domain / freely licensed texts.
Always: 개역한글 (korean), King James Version (kjv), Reina-Valera 1909 (valera) — these ship inside the phone app.
Also: every other full Bible (66 books) there in Korean, English or Spanish — read online or downloaded in Settings.
Runs in GitHub Actions (.github/workflows/bible-data.yml); the files are committed so the app, website and phone app
can read them without depending on an outside service.
Usage: python3 tools/fetch-bible.py [out_dir]   (default: bible)"""
import json, pathlib, re, sys, urllib.request

OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'bible')
CORE = ['korean', 'kjv', 'valera']
LANGS = {'korean': 'ko', 'english': 'en', 'spanish': 'es', 'español': 'es', 'espanol': 'es', 'ko': 'ko', 'en': 'en', 'es': 'es'}
# short names people know; anything else uses the name getBible gives
NAMES = {'korean': '개역한글', 'kjv': 'KJV', 'valera': 'RV 1909', 'akjv': 'AKJV', 'asv': 'ASV 1901', 'web': 'WEB', 'ylt': 'YLT',
         'darby': 'Darby', 'basicenglish': 'BBE', 'wb': 'Webster', 'douayrheims': 'Douay-Rheims', 'rv1858': 'RV 1858',
         'sparv1865': 'RV 1865', 'rva': 'RVA', 'sse': 'SSE'}
CHAPTERS = [50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4,
            28,16,24,21,28,16,16,13,6,6,4,4,5,3,6,4,3,1,13,5,5,3,5,1,1,1,22]

def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'daily-journey-build (+https://dailyjourney.org)'})
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.load(r)

def verses_of(ch):
    vs = ch.get('verses') or []
    return [[int(v['verse']), ' '.join(str(v['text']).split())] for v in vs if str(v.get('text', '')).strip()]

def save(tr):
    """Writes bible/<tr>/<n>.json; returns the number of chapters (0 if it isn't a full 66-book Bible)."""
    data = get(f'https://api.getbible.net/v2/{tr}.json')
    books = data.get('books') if isinstance(data, dict) else None
    if not books: print(f'{tr}: unexpected format'); return 0
    by_nr = {}
    for book in books:
        nr = int(book.get('nr') or book.get('book_nr') or 0)
        if 1 <= nr <= 66: by_nr[nr] = sorted(book.get('chapters') or [], key=lambda c: int(c.get('chapter')))
    if len(by_nr) < 66: print(f'{tr}: only {len(by_nr)} of 66 books — skipped'); return 0
    total = 0
    for nr, chapters in by_nr.items():
        out = [verses_of(c) for c in chapters]
        if len(out) != CHAPTERS[nr - 1]: print(f'  note: {tr} book {nr} has {len(out)} chapters (expected {CHAPTERS[nr - 1]})')
        d = OUT / tr; d.mkdir(parents=True, exist_ok=True)
        (d / f'{nr}.json').write_text(json.dumps({'chapters': out}, ensure_ascii=False, separators=(',', ':')))
        total += len(out)
    sample = json.loads((OUT / tr / '19.json').read_text())['chapters'][22][0]
    print(f'{tr}: {total} chapters · Psalm 23:1 = {sample[1]}')
    return total

# what getBible has (logged in full, so the list can be checked in the Actions log)
listing = get('https://api.getbible.net/v2/translations.json')
items = listing.values() if isinstance(listing, dict) else listing
found = {}
for v in items:
    if not isinstance(v, dict): continue
    ab = str(v.get('abbreviation') or '').strip().lower()
    lg = str(v.get('language') or v.get('lang') or '').strip().lower()
    name = str(v.get('translation') or v.get('name') or ab)
    lic = str(v.get('distribution_license') or v.get('license') or '')
    print(f'  available: {ab:14} {lg:12} {name}  [{lic[:60]}]')
    code = LANGS.get(lg) or LANGS.get(lg.split()[0] if lg else '')
    if ab and code and re.fullmatch(r'[a-z0-9]+', ab): found[ab] = {'lang': code, 'full': name}

index = []
for tr in CORE + sorted(k for k in found if k not in CORE):
    meta = found.get(tr) or {'lang': {'korean': 'ko', 'kjv': 'en', 'valera': 'es'}[tr], 'full': NAMES[tr]}
    try: total = save(tr)
    except Exception as e: print(f'{tr}: failed ({e})'); total = 0
    if tr in CORE and total < 1180: raise SystemExit(f'{tr}: only {total} chapters')
    if total >= 1180: index.append({'id': tr, 'name': NAMES.get(tr, meta['full']), 'full': meta['full'], 'lang': meta['lang'], 'chapters': total})

(OUT / 'index.json').write_text(json.dumps(index, ensure_ascii=False, indent=1) + '\n')
print('index:', ', '.join(f"{x['id']} ({x['lang']})" for x in index))
