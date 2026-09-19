import os
import re
import json
import hashlib
from PIL import Image
import numpy as np

base_dir = r"c:\Users\USER\Desktop\W-History"
edition_path = os.path.join(base_dir, "public", "chapter-07-edition.js")
ancient_dir = os.path.join(base_dir, "public", "images", "ancient")

with open(edition_path, "r", encoding="utf-8") as f:
    code = f.read()

# Find all image references in chapter-07-edition.js
images_found = re.findall(r'["\']([a-zA-Z0-9_\-\.\/]+\.(?:png|svg))["\']', code)
print(f"Total image references in chapter-07-edition.js: {len(images_found)}")
unique_images = sorted(list(set(images_found)))
print(f"Unique image files referenced: {len(unique_images)}")

svg_images = [img for img in unique_images if img.endswith(".svg")]
print(f"SVG images in chapter-07-edition.js: {svg_images}")

# Check files on disk
missing_files = []
low_quality_files = [] # files < 10KB
non_binary_alpha_files = []
image_hashes = {}
duplicate_hashes = []

for img_name in unique_images:
    # Resolve file path
    base_name = os.path.basename(img_name)
    file_path = os.path.join(ancient_dir, base_name)
    if not os.path.exists(file_path):
        # Try finding in other image directories
        for sub in ["ottoman", "islamic-culture", "islam-origin", "safavid", "mughal"]:
            alt = os.path.join(base_dir, "public", "images", sub, base_name)
            if os.path.exists(alt):
                file_path = alt
                break
                
    if not os.path.exists(file_path):
        missing_files.append(img_name)
        continue
        
    sz = os.path.getsize(file_path)
    if sz < 8000:
        low_quality_files.append((img_name, sz))
        
    # Check binary alpha
    try:
        im = Image.open(file_path).convert("RGBA")
        arr = np.array(im)
        alpha = arr[:, :, 3]
        semi_trans = np.where((alpha > 0) & (alpha < 255))[0]
        if len(semi_trans) > 0:
            non_binary_alpha_files.append((img_name, len(semi_trans)))
            
        with open(file_path, "rb") as f:
            h = hashlib.sha256(f.read()).hexdigest()
        if h in image_hashes:
            duplicate_hashes.append((img_name, image_hashes[h]))
        else:
            image_hashes[h] = img_name
    except Exception as e:
        print(f"Error inspecting {img_name}: {e}")

print(f"\nMissing files: {len(missing_files)}")
if missing_files:
    print("  ", missing_files[:10])

print(f"Low quality files (<8KB): {len(low_quality_files)}")
if low_quality_files:
    print("  ", low_quality_files[:10])

print(f"Non-binary alpha files: {len(non_binary_alpha_files)}")
if non_binary_alpha_files:
    print("  ", non_binary_alpha_files[:10])

print(f"Duplicate image binary hashes: {len(duplicate_hashes)}")
if duplicate_hashes:
    print("  ", duplicate_hashes[:10])
