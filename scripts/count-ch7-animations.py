import json, re, sys
sys.stdout.reconfigure(encoding='utf-8')
from collections import Counter

with open('public/chapter-07-edition.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Count occurrences of animation keys in chapter 7
total_scenes = len(re.findall(r'\{\s*"id":', text))
total_routes = len(re.findall(r'"routes":\s*\[[^\]]+\]', text))
total_battles = len(re.findall(r'"battle":\s*\{', text))
total_bubbles = len(re.findall(r'"bubble":\s*"[^"]+"', text))
total_to_moves = len(re.findall(r'"to":\s*\[', text))
total_zones = len(re.findall(r'"zones":\s*\[[^\]]+\]', text))

print(f"Chapter 7 animation features:")
print(f"  Total scenes: {total_scenes}")
print(f"  Scenes with routes: {total_routes}")
print(f"  Scenes with battles: {total_battles}")
print(f"  Total actor bubbles: {total_bubbles}")
print(f"  Total actor moves (to): {total_to_moves}")
durations = Counter(re.findall(r'"duration":\s*(\d+)', text))
print(f"Durations: {durations}")

