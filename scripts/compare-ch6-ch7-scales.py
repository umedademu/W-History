import json, re, sys
sys.stdout.reconfigure(encoding='utf-8')
from collections import Counter

def analyze_chapter(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        text = f.read()
    
    actor_sizes = Counter(re.findall(r'"actors":\s*\[(.*?)\]', text, re.DOTALL))
    # Extract all actors/props size
    sizes = Counter(re.findall(r'"size":\s*(\d+)', text))
    kinds = Counter(re.findall(r'"kind":\s*"([^"]+)"', text))
    return sizes, kinds

s6, k6 = analyze_chapter('public/chapter-06-edition.js')
s7, k7 = analyze_chapter('public/chapter-07-edition.js')

print("Chapter 6 sizes:", s6)
print("Chapter 7 sizes:", s7)
print("Chapter 6 kinds:", k6)
print("Chapter 7 kinds:", k7)
