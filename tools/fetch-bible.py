#!/usr/bin/env python3
"""Downloads the three public-domain Bibles the app reads and saves one file per book:
   bible/<korean|kjv|valera>/<book 1-66>.json  =  {"chapters": [[[verse, "text"], ...], ...]}
Source: getBible API v2 (api.getbible.net) — 개역한글 (korean), King James Version (kjv), Reina-Valera 1909 (valera).
Runs in GitHub Actions (.github/workflows/bible-data.yml); the files are committed so the app, website and phone app
can read them without depending on an outside service.
Usage: python3 tools/fetch-bible.py [out_dir]   (default: bible)"""
import json, pathlib, sys, urllib.request

OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'bible')
TRANSLATIONS = ['korean', 'kjv', 'valera']
CHAPTERS = [50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4,
            28,16,24,21,28,16,16,13,6,6,4,4,5,3,6,4,3,1,13,5,5,3,5,1,1,1,22]

def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'daily-thanks-build (+https://dailyjourney.org)'})
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.load(r)

def verses_of(ch):
    vs = ch.get('verses') or []
    return [[int(v['verse']), ' '.join(str(v['text']).split())] for v in vs if str(v.get('text', '')).strip()]

for tr in TRANSLATIONS:
    data = get(f'https://api.getbible.net/v2/{tr}.json')
    books = data.get('books') if isinstance(data, dict) else None
    if not books:
        raise SystemExit(f'{tr}: unexpected format, top-level keys: {list(data)[:10] if isinstance(data, dict) else type(data)}')
    total = 0
    for book in books:
        nr = int(book.get('nr') or book.get('book_nr'))
        chapters = sorted(book.get('chapters') or [], key=lambda c: int(c.get('chapter')))
        out = [verses_of(c) for c in chapters]
        if len(out) != CHAPTERS[nr - 1]:
            print(f'  note: {tr} book {nr} has {len(out)} chapters (expected {CHAPTERS[nr - 1]})')
        d = OUT / tr; d.mkdir(parents=True, exist_ok=True)
        (d / f'{nr}.json').write_text(json.dumps({'chapters': out}, ensure_ascii=False, separators=(',', ':')))
        total += len(out)
    sample = json.loads((OUT / tr / '19.json').read_text())['chapters'][22][0]
    print(f'{tr}: {len(books)} books, {total} chapters · Psalm 23:1 = {sample[1]}')
    if total < 1180: raise SystemExit(f'{tr}: only {total} chapters')
