import json, re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('public/chapter-07-edition.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Load scenes
prefix = "export const chapterEdition = "
start = text.find(prefix) + len(prefix)
end = text.find(";\nexport const chapterPlaces")
edition = json.loads(text[start:end])

total_scenes = 0
for vol, scenes in edition.items():
    for s in scenes:
        total_scenes += 1
        if s.get('routes') and len(s['routes']) > 0:
            print(f"Scene {s['id']} ({s['title']}): {len(s['routes'])} routes, actors={[a['name'] for a in s.get('actors', [])]}, props={[p['name'] for p in s.get('props', [])]}")
