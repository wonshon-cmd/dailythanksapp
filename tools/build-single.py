"""Bundle index.html + styles.css + app.js into one self-contained page: dist/daily-thanks.html.
Used for the hosted (claude.ai Artifact) preview; also opens offline as a single file."""
import pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent
html = (root / 'index.html').read_text(encoding='utf-8')
css = (root / 'styles.css').read_text(encoding='utf-8')
js = (root / 'app.js').read_text(encoding='utf-8')
title = re.search(r'<title>.*?</title>', html, re.S).group(0)
links = '\n'.join(re.findall(r'<link rel="(?:preconnect|stylesheet)" href="https://fonts[^>]*>', html))
metas = '\n'.join(re.findall(r'<meta name="(?:viewport|theme-color|description|apple-mobile-web-app-[\w-]+|mobile-web-app-capable)"[^>]*>', html))
body = re.search(r'<body>(.*)</body>', html, re.S).group(1)
body = body.replace('<script src="app.js" defer></script>', '')
# The claude.ai viewer already pads the page by the phone's safe areas (and its own top buttons),
# so the hosted bundle must not add them again — otherwise the top and bottom gaps double.
HOSTED_CSS = ":root{--safe-top:0px;--safe-bottom:0px}"
out = f"{title}\n{metas}\n{links}\n<style>\n{css}\n{HOSTED_CSS}\n</style>\n{body.strip()}\n<script>\n{js}\n</script>\n"
(root / 'dist').mkdir(exist_ok=True)
(root / 'dist' / 'daily-thanks.html').write_text(out, encoding='utf-8')
print('wrote dist/daily-thanks.html', len(out), 'bytes')

# daily bible: the same app in Bible mode (reading, sermon notes, me), sharing the same data
bible = out.replace(title, '<title>Daily Bible · 말씀을 매일</title>').replace('<script>\n', '<script>window.DT_APP = "bible";</script>\n<script>\n', 1)
(root / 'dist' / 'daily-bible.html').write_text(bible, encoding='utf-8')
print('wrote dist/daily-bible.html', len(bible), 'bytes')
