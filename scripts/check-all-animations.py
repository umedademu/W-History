import json, re, sys
sys.stdout.reconfigure(encoding='utf-8')

for ch in ['02', '03', '04', '05', '07']:
    fn = f'public/chapter-{ch}-edition.js'
    try:
        with open(fn, 'r', encoding='utf-8') as f:
            text = f.read()
        routes = len(re.findall(r'"routes":\s*\[[^\]]+\]', text))
        battles = len(re.findall(r'"battle":\s*\{', text))
        to_moves = len(re.findall(r'"to":\s*\[', text))
        print(f"Chapter {ch}: routes={routes}, battles={battles}, to_moves={to_moves}")
    except Exception as e:
        print(f"Chapter {ch}: {e}")

# Also check ottoman-scenes.js
try:
    with open('public/ottoman-scenes.js', 'r', encoding='utf-8') as f:
        text = f.read()
    routes = len(re.findall(r'routes?:', text))
    battles = len(re.findall(r'battle', text))
    actors = len(re.findall(r'person\(', text))
    print(f"Ottoman scenes: routes={routes}, battles={battles}, actors={actors}")
except Exception as e:
    print(f"Ottoman: {e}")
