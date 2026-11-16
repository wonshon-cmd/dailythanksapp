#!/usr/bin/env python3
"""Build the dailyjourney.org website (home, privacy, terms, support, delete-account)
in the app's design, from the Markdown in store/legal/. Output: site/index.html

Usage: python3 tools/build-site.py
"""
import html, json, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
LEGAL = ROOT / 'store' / 'legal'
OUT = ROOT / 'site' / 'index.html'
LANG_HEAD = {'한국어': 'ko', 'English': 'en', 'Español': 'es'}


def inline(s):
    s = html.escape(s, quote=False)
    s = re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'(?<![*\w])\*(?!\s)(.+?)\*(?!\w)', r'<em>\1</em>', s)
    s = re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)', r'<a href="\2" target="_blank" rel="noopener">\1</a>', s)
    # bracketed placeholders still to be filled in: show them softly marked
    s = re.sub(r'\[([^\]<>]{1,60})\]', r'<mark>\1</mark>', s)
    s = re.sub(r'(?<![\w@/.])(dailyjourney\.org(?:/[\w-]+)?)', r'<a href="https://\1" target="_blank" rel="noopener">\1</a>', s)
    s = re.sub(r'(?<![\w.])([\w.]+@[\w.-]+\.\w+)', r'<span class="mail">\1</span>', s)
    return s


def md(text):
    """Small Markdown subset: headings, paragraphs, nested lists, tables. Skips blockquotes and rules."""
    out, para, lists, table = [], [], [], []

    def flush_para():
        if para:
            out.append('<p>' + inline(' '.join(para)) + '</p>'); para.clear()

    def close_lists(level=0):
        while len(lists) > level:
            out.append('</li></%s>' % lists.pop())

    def flush_table():
        if not table: return
        rows = [[c.strip() for c in r.strip().strip('|').split('|')] for r in table if not re.match(r'^\|[\s|:-]+\|$', r.strip())]
        h, body = rows[0], rows[1:]
        out.append('<div class="table"><table><thead><tr>' + ''.join('<th>%s</th>' % inline(c) for c in h) + '</tr></thead><tbody>'
                   + ''.join('<tr>' + ''.join('<td>%s</td>' % inline(c) for c in r) + '</tr>' for r in body) + '</tbody></table></div>')
        table.clear()

    for raw in text.splitlines():
        line = raw.rstrip()
        if line.startswith('|'):
            flush_para(); close_lists(); table.append(line); continue
        flush_table()
        m = re.match(r'^(\s*)([-*]|\d+\.)\s+(.*)$', line)
        if m:
            flush_para()
            level = len(m.group(1)) // 2 + 1 if m.group(1) else 1
            level = min(level, len(lists) + 1)
            tag = 'ol' if m.group(2)[0].isdigit() else 'ul'
            if len(lists) >= level:
                close_lists(level)
                out.append('</li><li>')
            else:
                while len(lists) < level:
                    lists.append(tag); out.append('<%s><li>' % tag)
            out[-1] += inline(m.group(3))
            continue
        if not line.strip() or line.startswith('>') or line.strip() == '---':
            flush_para()
            if not line.strip() and lists: pass
            else: close_lists()
            continue
        h = re.match(r'^(#{1,4})\s+(.*)$', line)
        if h:
            flush_para(); close_lists()
            n = min(len(h.group(1)) + 1, 4)
            out.append('<h%d>%s</h%d>' % (n, inline(h.group(2)), n)); continue
        if lists and raw.startswith('  '):
            out[-1] += ' ' + inline(line.strip()); continue
        close_lists(); para.append(line.strip())
    flush_para(); close_lists(); flush_table()
    return '\n'.join(out)


def split_by(text, level):
    """Split Markdown on headings of the given level; returns {title: body}."""
    parts, cur, buf = {}, None, []
    for line in text.splitlines():
        m = re.match(r'^%s\s+(.*)$' % ('#' * level), line)
        if m:
            if cur is not None: parts[cur] = '\n'.join(buf)
            cur, buf = m.group(1).strip(), []
        elif cur is not None:
            buf.append(line)
    if cur is not None: parts[cur] = '\n'.join(buf)
    return parts


def strip_title(text):
    return '\n'.join(l for l in text.splitlines() if not l.startswith('# '))


pages = {'privacy': {}, 'terms': {}, 'support': {}, 'delete-account': {}}
for lg in ('ko', 'en', 'es'):
    pages['privacy'][lg] = md(strip_title((LEGAL / f'privacy-{lg}.md').read_text()))
for title, body in split_by((LEGAL / 'terms.md').read_text(), 2).items():
    pages['terms'][LANG_HEAD[title]] = md(body)
sd = split_by((LEGAL / 'support-and-delete.md').read_text(), 2)
for key, page in (('/support', 'support'), ('/delete-account', 'delete-account')):
    for title, body in split_by(sd[key], 3).items():
        pages[page][LANG_HEAD[title]] = md(body)

template = (ROOT / 'site' / 'template.html').read_text()
OUT.write_text(template.replace('/*__PAGES__*/null', json.dumps(pages, ensure_ascii=False)))
print('wrote', OUT.relative_to(ROOT), f'{OUT.stat().st_size // 1024} KB')

# Deployable website for dailyjourney.org: same page at /, /privacy/, /terms/, /support/, /delete-account/
import shutil
WEB = ROOT / 'site' / 'web'
shutil.rmtree(WEB, ignore_errors=True); WEB.mkdir(parents=True)
page_html = OUT.read_text()
head, body = page_html.split('</style>', 1)
doc = ('<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n'
       '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
       '<link rel="icon" type="image/png" href="/favicon.png">\n<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n'
       '<meta property="og:title" content="daily thanks">\n<meta property="og:description" content="Give thanks daily. Live fully. Share the joy.">\n'
       '<meta property="og:image" content="https://dailyjourney.org/og.png">\n<meta name="theme-color" content="#FFFFFF">\n'
       '<script>window.SITE_MODE = "web";</script>\n'
       + head + '</style>\n</head>\n<body>' + body + '\n</body>\n</html>\n')
for sub in ('', 'privacy', 'terms', 'support', 'delete-account', 'join'):
    d = WEB / sub; d.mkdir(exist_ok=True); (d / 'index.html').write_text(doc)
(WEB / '404.html').write_text(doc)
(WEB / 'CNAME').write_text('dailyjourney.org\n')
shutil.copy(ROOT / 'store' / 'icons' / 'play-512.png', WEB / 'favicon.png')
shutil.copy(ROOT / 'store' / 'icons' / 'appstore-1024.png', WEB / 'apple-touch-icon.png')
shutil.copy(ROOT / 'store' / 'instagram' / 'feed-en-1.png', WEB / 'og.png')
content = ROOT / 'content' / 'content.json'
if content.exists(): shutil.copy(content, WEB / 'content.json')   # the app can read its text from here too
print('wrote', WEB.relative_to(ROOT), sorted(p.name for p in WEB.iterdir()))
