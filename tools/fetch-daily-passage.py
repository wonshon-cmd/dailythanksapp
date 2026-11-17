#!/usr/bin/env python3
"""Today's devotional passage → content/content.json (qtPlan), read once a day by a GitHub Action.

  Korean  : 생명의 삶 (Duranno)        → qtPlan.ko[YYYY-MM-DD]   (Korea time)
  English : Our Daily Bread             → qtPlan.en[YYYY-MM-DD]   (US Eastern time)
  Spanish : Nuestro Pan Diario          → qtPlan.es[YYYY-MM-DD]   (US Eastern time)

Only the Bible reference is taken (e.g. "누가복음 10:1-16"); the app shows the verses from its own
public-domain Bibles (개역한글 / KJV / Reina-Valera 1909). The devotional text is never copied.
Pages that robots.txt disallows are skipped. Sources can be changed with KO_URL / EN_URL / ES_URL.
If a source can't be read, that language keeps the app's built-in plan for the day.

Usage: python3 tools/fetch-daily-passage.py            (add --dry to print without writing)
"""
import datetime, html, json, os, pathlib, re, sys, urllib.request, urllib.robotparser, urllib.parse
from zoneinfo import ZoneInfo

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONTENT = ROOT / 'content' / 'content.json'
UA = 'Mozilla/5.0 (compatible; DailyThanksPassage/1.0; +https://dailyjourney.org)'

SOURCES = {
    'ko': {'url': os.environ.get('KO_URL', 'https://www.duranno.com/qt/default.asp'), 'tz': 'Asia/Seoul',
           'name': '생명의 삶', 'prefer': ['본문', '오늘의 말씀', 'QT'], 'avoid': ['통독', '일년일독']},
    'en': {'url': os.environ.get('EN_URL', 'https://www.odbm.org/en/devotionals'), 'tz': 'America/New_York',
           'name': 'Our Daily Bread', 'item': r'href="((?:https://www\.odbm\.org)?/en/devotionals/[a-z0-9][a-z0-9-]+/?)"', 'prefer': ['Today’s Scripture', "Today's Scripture", 'Scripture & Insight', 'Read:'], 'avoid': ['Bible in a Year', 'Bible in One Year']},
    'es': {'url': os.environ.get('ES_URL', 'https://www.odbm.org/es/devotionals'), 'tz': 'America/New_York',
           'name': 'Nuestro Pan Diario', 'item': r'href="((?:https://(?:www\.)?(?:nuestropandiario\.org|odbm\.org))?/(?:es/devocionales|devocionales|es/devotionals)/[a-z0-9][a-z0-9-]+/?)"', 'prefer': ['Lectura:', 'Escritura de hoy', 'Lectura de hoy'], 'avoid': ['La Biblia en un año', 'Biblia en un año']},
}

# Book names in the three languages, from the app itself (BOOKS in app.js) so they always match parseRef.
src = (ROOT / 'app.js').read_text()
BOOKS = json.loads('[' + re.search(r'const BOOKS = \[(.*?)\n\];', src, re.S).group(1).strip().rstrip(',') + ']')
EN_ALT = {'Psalm': 19, 'Psalms': 19, 'Song of Songs': 22, 'Song of Solomon': 22}
ES_ALT = {'Salmo': 19, 'Salmos': 19, 'Cantares': 22, 'Cantar de los Cantares': 22}


def names(lang):
    out = {}
    for i, b in enumerate(BOOKS, 1):
        if lang == 'ko': out[b[0]] = i; out[b[1]] = i
        elif lang == 'en': out[b[2]] = i
        else: out[b[3]] = i
    for k, v in (EN_ALT if lang == 'en' else ES_ALT if lang == 'es' else {}).items(): out[k] = v
    return out


def ref_regex(lang):
    alts = sorted(names(lang), key=len, reverse=True)
    book = '|'.join(re.escape(n).replace(r'\ ', r'\s+') for n in alts)
    if lang == 'ko':   # 누가복음 10:1-16 · 누가복음 10장 1-16절
        return re.compile(rf'({book})\s*(\d+)\s*(?::|장)\s*(\d+)\s*(?:절)?\s*(?:[-~–]\s*(\d+)\s*(?:절)?)?')
    return re.compile(rf'\b({book})\s+(\d+)\s*:\s*(\d+)\s*(?:[-–]\s*(\d+))?', re.I)


def fetch(url):
    rp = urllib.robotparser.RobotFileParser()
    base = '{0.scheme}://{0.netloc}'.format(urllib.parse.urlparse(url))
    try:
        rp.set_url(base + '/robots.txt'); rp.read()
        if not rp.can_fetch(UA, url): print('  robots.txt disallows', url); return None
    except Exception: pass
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Language': 'ko,en;q=0.8,es;q=0.6'})
    with urllib.request.urlopen(req, timeout=30) as r:
        raw = r.read(); cs = r.headers.get_content_charset() or ('euc-kr' if b'euc-kr' in raw[:3000].lower() else 'utf-8')
    return raw.decode(cs, errors='replace')


def text_of(page):
    page = re.sub(r'(?is)<(script|style|noscript)[^>]*>.*?</\1>', ' ', page)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', page)))


def find_ref(lang, page):
    cfg, rx, nm = SOURCES[lang], ref_regex(lang), names(lang)
    text = text_of(page)
    hits = []
    for m in rx.finditer(text):
        before = text[max(0, m.start() - 60):m.start()]
        if any(a.lower() in text[max(0, m.start() - 28):m.start()].lower() for a in cfg['avoid']): continue  # e.g. "Bible in a Year: …"
        if any(a.lower() in before.lower() for a in cfg['avoid']) and not any(k.lower() in before.lower() for k in cfg['prefer']): continue
        score = 0 if any(k.lower() in before.lower() for k in cfg['prefer']) else 1
        hits.append((score, m.start(), m))
    if not hits: return None
    m = sorted(hits, key=lambda h: (h[0], h[1]))[0][2]
    key = next((k for k in nm if re.fullmatch(re.escape(k).replace(r'\ ', r'\s+'), m.group(1), re.I)), None)
    b = nm[key]; c, v = int(m.group(2)), int(m.group(3)); v2 = int(m.group(4)) if m.group(4) else v
    if not (1 <= c <= BOOKS[b - 1][4]) or v2 < v: return None
    name = BOOKS[b - 1][0] if lang == 'ko' else BOOKS[b - 1][2] if lang == 'en' else BOOKS[b - 1][3]
    return f'{name} {c}:{v}' + (f'-{v2}' if v2 > v else '')


def main():
    dry = '--dry' in sys.argv
    data = json.loads(CONTENT.read_text())
    plan = data.get('qtPlan') if isinstance(data.get('qtPlan'), dict) else {}
    names_ = data.get('qtPlanName') if isinstance(data.get('qtPlanName'), dict) else {}
    changed = False
    for lang, cfg in SOURCES.items():
        day = datetime.datetime.now(ZoneInfo(cfg['tz'])).date().isoformat()
        try:
            page = fetch(cfg['url'])
            ref = None
            # A list page (e.g. odbm.org/en/devotionals): open the newest devotional and read its
            # "Today's Scripture" line; the list itself only shows the key verse.
            link = page and re.search(cfg.get('item', r'$^'), page)
            if link:
                try:
                    item = fetch(urllib.parse.urljoin(cfg['url'], html.unescape(link.group(1))))
                    ref = find_ref(lang, item) if item else None
                except Exception as e: print(f'  {lang}: could not open today\'s devotional: {e}')
            ref = ref or (find_ref(lang, page) if page else None)
        except Exception as e:
            print(f'{lang}: could not read {cfg["url"]}: {e}'); continue
        print(f'{lang} {day}: {ref or "no reference found"}')
        if not ref: continue
        p = plan.setdefault(lang, {})
        if p.get(day) != ref: p[day] = ref; changed = True
        for old in sorted(p)[:-45]: del p[old]          # keep about six weeks
        if names_.get(lang) != cfg['name']: names_[lang] = cfg['name']; changed = True
    data['qtPlan'], data['qtPlanName'] = plan, names_
    if changed and not dry:
        CONTENT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n'); print('updated', CONTENT.relative_to(ROOT))
    elif not changed: print('no change')


if __name__ == '__main__':
    main()
