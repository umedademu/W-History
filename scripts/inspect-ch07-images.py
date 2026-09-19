import re, os
from collections import Counter
from PIL import Image

with open('public/chapter-07-edition.js', 'r', encoding='utf-8') as f:
    text = f.read()

images = re.findall(r'"image":\s*"([^"]+)"', text)
dirs = Counter([os.path.dirname(img) for img in images])
print("Image references by directory:")
for d, count in dirs.items():
    print(f"  {d}: {count} references")

unique_images = sorted(list(set(images)))
print(f"\nTotal unique images: {len(unique_images)}")

file_sizes = []
dimensions = Counter()
for rel in unique_images:
    p = os.path.join('public/images', rel)
    if os.path.exists(p):
        sz = os.path.getsize(p)
        im = Image.open(p)
        dimensions[im.size] += 1
        file_sizes.append((rel, sz, im.size))

print("\nDimensions distribution:")
for dim, count in dimensions.items():
    print(f"  {dim}: {count} files")

file_sizes.sort(key=lambda x: x[1])
print("\nSmallest 10 files:")
for rel, sz, dim in file_sizes[:10]:
    print(f"  {rel}: {sz} bytes, {dim}")
