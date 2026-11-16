#!/usr/bin/env python3
"""Copies the three public-domain Bibles the app reads into the website, one small file per chapter:
   site/web/bible/<korean|kjv|valera>/<book>/<chapter>.json  →  served at dailyjourney.org/bible/…
Source: getBible API v2 (api.getbible.net). Runs in the website workflow; the app falls back to the API if a file is missing.
Usage: python3 tools/fetch-bible.py [out_dir]   (default site/web/bible)"""
import json, pathlib, sys, urllib.request

OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'site/web/bible')
TRANSLATIONS = ['korean', 'kjv', 'valera']   # 개역한글, King James Version, Reina-Valera 1909

def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'daily-thanks-site-build'}), timeout=120) as r:
        return json.load(r)

for tr in TRANSLATIONS:
    data = get(f'https://api.getbible.net/v2/{tr}.json')
    books = data.get('books') or []
    n = 0
    for book in books:
        nr = int(book.get('nr') or book.get('book_nr'))
        for ch in book.get('chapters') or []:
            c = int(ch.get('chapter'))
            verses = [{'verse': int(v['verse']), 'text': ' '.join(str(v['text']).split())} for v in ch.get('verses') or []]
            if not verses: continue
            d = OUT / tr / str(nr); d.mkdir(parents=True, exist_ok=True)
            (d / f'{c}.json').write_text(json.dumps({'verses': verses}, ensure_ascii=False, separators=(',', ':')))
            n += 1
    print(tr, n, 'chapters')
    if n < 1180: raise SystemExit(f'{tr}: only {n} chapters — check the source format')
