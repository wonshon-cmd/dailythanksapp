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
out = f"{title}\n{metas}\n{links}\n<style>\n{css}\n</style>\n{body.strip()}\n<script>\n{js}\n</script>\n"
(root / 'dist').mkdir(exist_ok=True)
(root / 'dist' / 'daily-thanks.html').write_text(out, encoding='utf-8')
print('wrote dist/daily-thanks.html', len(out), 'bytes')
