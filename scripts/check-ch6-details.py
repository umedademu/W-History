import re, sys
sys.stdout.reconfigure(encoding='utf-8')
from collections import Counter

for fn in ['public/ottoman-scenes.js', 'public/safavid-scenes.js', 'public/mughal-scenes.js', 'public/islam-origin-scenes.js', 'public/islamic-culture-scenes.js']:
    try:
        with open(fn, 'r', encoding='utf-8') as f:
            t = f.read()
        scene_count = len(re.findall(r'id:\s*"', t))
        dur = Counter(re.findall(r'duration:\s*(\d+)', t))
        routes = len(re.findall(r'routes:\s*\[', t))
        actors = len(re.findall(r'actors:\s*\[', t))
        print(f"{fn}:")
        print(f"  scenes: {scene_count}, dur: {dur}, routes_present: {routes}, actors: {actors}")
    except Exception as e:
        print(f"{fn}: {e}")
