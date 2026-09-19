import json, re, os, sys
sys.stdout.reconfigure(encoding='utf-8')
from collections import defaultdict

with open('public/chapter-07-edition.js', 'r', encoding='utf-8') as f:
    text = f.read()

# actors and props name -> image mapping
img_to_names = defaultdict(set)
name_to_imgs = defaultdict(set)

# Parse JSON pages from js file
# In chapter-07-edition.js, look for scenes or pages
# Let's extract all { "name": "...", "image": "..." }
matches = re.findall(r'\{\s*"name":\s*"([^"]+)",[^}]*?"image":\s*"([^"]+)"', text)
for name, img in matches:
    img_to_names[img].add(name)
    name_to_imgs[name].add(img)

# Also regex where image comes before name
matches2 = re.findall(r'\{\s*"image":\s*"([^"]+)",[^}]*?"name":\s*"([^"]+)"', text)
for img, name in matches2:
    img_to_names[img].add(name)
    name_to_imgs[name].add(img)

print(f"Total mappings found: {len(matches) + len(matches2)}")

reused_images = {img: names for img, names in img_to_names.items() if len(names) > 1}
print(f"Images mapped to multiple distinct names: {len(reused_images)}")
for img, names in sorted(reused_images.items()):
    print(f"  {img}: {sorted(list(names))}")
