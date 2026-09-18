import os
import sys
from PIL import Image
import numpy as np

BASE_DIR = r"c:\Users\USER\Desktop\W-History"
OUT_DIR = os.path.join(BASE_DIR, "public", "images", "ancient")
IMG_ROOT = os.path.join(BASE_DIR, "public", "images")
os.makedirs(OUT_DIR, exist_ok=True)

def load_source(name):
    paths = [
        os.path.join(OUT_DIR, f"{name}.png"),
        os.path.join(IMG_ROOT, "ancient", f"{name}.png"),
        os.path.join(IMG_ROOT, "islamic-culture", f"{name}.png"),
        os.path.join(IMG_ROOT, "islam-origin", f"{name}.png"),
        os.path.join(IMG_ROOT, "ottoman", f"{name}.png"),
        os.path.join(IMG_ROOT, "safavid", f"{name}.png"),
        os.path.join(IMG_ROOT, "mughal", f"{name}.png"),
    ]
    for p in paths:
        if os.path.exists(p):
            return Image.open(p).convert("RGBA")
    return None

def process_character_refined(base_name, target_name, color_theme, add_crown=False, add_tiara=False, add_banner=False, add_bible=False, add_cross=False, flip=False, width=128, height=192):
    src = load_source(base_name)
    if not src:
        src = load_source("caesar-general")
        
    arr = np.array(src).astype(float)
    if flip:
        arr = np.fliplr(arr)
        
    h, w, _ = arr.shape
    alpha = arr[:, :, 3]
    
    # Find head top y-coordinate
    top_pixels = np.where(alpha > 50)
    head_top_y = np.min(top_pixels[0]) if len(top_pixels[0]) > 0 else 20
    head_cx = w // 2
    
    # Recolor clothing/props while keeping skin
    for y in range(h):
        for x in range(w):
            if alpha[y, x] < 15:
                continue
            r, g, b = arr[y, x, :3]
            bright = (r + g + b) / 3.0
            is_skin = (r > 130 and g > 80 and b > 50 and r >= g and g >= b and (r - b) > 25 and bright > 80)
            if is_skin:
                continue
                
            if color_theme == 'french_blue':
                arr[y, x, 0] = np.clip(bright * 0.15, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.35 + 10, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.90 + 35, 0, 255)
            elif color_theme == 'imperial_gold':
                arr[y, x, 0] = np.clip(bright * 1.05 + 25, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.85 + 10, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.20, 0, 255)
            elif color_theme == 'english_red':
                arr[y, x, 0] = np.clip(bright * 1.00 + 35, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.25, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.25, 0, 255)
            elif color_theme == 'byzantine_purple':
                arr[y, x, 0] = np.clip(bright * 0.70 + 25, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.15, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.85 + 30, 0, 255)
            elif color_theme == 'papal_white':
                v = np.clip(bright * 0.85 + 50, 0, 255)
                arr[y, x, 0] = v; arr[y, x, 1] = v; arr[y, x, 2] = np.clip(v + 10, 0, 255)
            elif color_theme == 'knight_silver':
                v = np.clip(bright * 0.85 + 30, 0, 255)
                arr[y, x, 0] = v; arr[y, x, 1] = v; arr[y, x, 2] = np.clip(v + 12, 0, 255)
            elif color_theme == 'viking_fur':
                arr[y, x, 0] = np.clip(bright * 0.75 + 10, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.55 + 5, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.35, 0, 255)
            elif color_theme == 'monk_brown':
                arr[y, x, 0] = np.clip(bright * 0.60 + 10, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.45 + 5, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.30, 0, 255)
            elif color_theme == 'dominican_black':
                arr[y, x, 0] = np.clip(bright * 0.30, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.30, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.35, 0, 255)
            elif color_theme == 'slavic_green':
                arr[y, x, 0] = np.clip(bright * 0.25, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.75 + 20, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.35, 0, 255)
            elif color_theme == 'crimson_cardinal':
                arr[y, x, 0] = np.clip(bright * 0.95 + 40, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.15, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.35, 0, 255)
            elif color_theme == 'peasant_cloth':
                arr[y, x, 0] = np.clip(bright * 0.70 + 15, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.65 + 15, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.50 + 10, 0, 255)

    # Seamless crown fitting on top of head
    if add_crown:
        cy = max(2, head_top_y - 6)
        for y in range(cy, cy + 7):
            for x in range(head_cx - 13, head_cx + 14):
                if y == cy and (x - (head_cx - 13)) % 5 in [0, 1]:
                    arr[y, x] = [255, 220, 20, 255] # Peaks
                elif cy + 2 <= y <= cy + 5:
                    arr[y, x] = [240, 195, 10, 255] # Band
                elif y == cy + 6:
                    arr[y, x] = [60, 45, 10, 255] # Shadow
                    
    # Papal Tiara
    if add_tiara:
        cy = max(1, head_top_y - 12)
        for y in range(cy, cy + 14):
            rw = 4 + int((y - cy) * 0.55)
            for x in range(head_cx - rw, head_cx + rw + 1):
                if y in [cy + 3, cy + 8, cy + 13]:
                    arr[y, x] = [255, 215, 0, 255]
                elif x in [head_cx - rw, head_cx + rw]:
                    arr[y, x] = [50, 40, 30, 255]
                else:
                    arr[y, x] = [250, 250, 255, 255]

    # Fleur Banner (for Joan of Arc)
    if add_banner:
        bx = 20
        for y in range(25, 135):
            arr[y, bx:bx+3] = [170, 130, 70, 255] # Pole
        for y in range(28, 65):
            for x in range(bx + 3, bx + 36):
                arr[y, x] = [25, 65, 190, 255] # Blue flag
        # Cross & Fleur
        arr[38:52, bx+15:bx+23] = [255, 220, 30, 255]

    # Bible in hand
    if add_bible:
        bx, by = head_cx - 24, 110
        for y in range(by, by + 20):
            for x in range(bx, bx + 16):
                arr[y, x] = [120, 60, 20, 255]
        arr[by+3:by+17, bx+6:bx+9] = [255, 220, 0, 255]
        arr[by+7:by+10, bx+2:bx+13] = [255, 220, 0, 255]

    # Red Cross on chest
    if add_cross:
        cx, cy = head_cx, 95
        arr[cy-12:cy+14, cx-3:cx+4] = [220, 20, 20, 255]
        arr[cy-3:cy+4, cx-12:cx+13] = [220, 20, 20, 255]

    out_img = Image.fromarray(arr.astype(np.uint8))
    bbox = out_img.getbbox()
    if bbox:
        cropped = out_img.crop(bbox)
        cw, ch = cropped.size
        scale = min((width * 0.88) / cw, (height * 0.88) / ch)
        nw = max(1, int(round(cw * scale)))
        nh = max(1, int(round(ch * scale)))
        resized = cropped.resize((nw, nh), Image.Resampling.NEAREST)
        final_canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        px = (width - nw) // 2
        py = height - nh - 8
        final_canvas.paste(resized, (px, py), resized)
    else:
        final_canvas = out_img.resize((width, height), Image.Resampling.NEAREST)

    out_path = os.path.join(OUT_DIR, f"{target_name}.png")
    final_canvas.save(out_path, "PNG")
    print(f"Refined character: {target_name}.png")

# Refine key characters
process_character_refined("caesar-general", "charlemagne-emperor", "imperial_gold", add_crown=True)
process_character_refined("wenchang-princess", "joan-of-arc", "knight_silver", add_banner=True)
process_character_refined("caesar-general", "henry4-emperor", "peasant_cloth")
process_character_refined("high-priest", "gregory7-pope", "crimson_cardinal", add_tiara=True)
process_character_refined("alexander-conqueror", "richard-lionheart", "english_red", add_cross=True)
process_character_refined("cato-elder", "king-john-lackland", "english_red", add_crown=True)
process_character_refined("dongzhongshu-scholar", "thomas-aquinas", "dominican_black", add_bible=True)
process_character_refined("ibn-sina", "saladin-sultan", "imperial_gold")

# Refine Hagia Sophia
def render_hagia_sophia_refined(g):
    c_brick = [185, 95, 75, 255]
    c_brick_hi = [215, 125, 105, 255]
    c_dome = [235, 195, 55, 255]
    c_dome_shade = [180, 140, 35, 255]
    c_minaret = [225, 225, 230, 255]
    c_arch = [60, 50, 50, 255]
    
    # Base with Buttresses and arched windows
    g[28:44, 10:38] = c_brick
    for y in [31, 37]:
        for ax in range(12, 37, 4):
            g[y:y+3, ax:ax+2] = c_arch
            g[y-1, ax:ax+2] = c_brick_hi
            
    # Huge Central Dome
    for y in range(14, 25):
        rw = int(np.sqrt(max(0, 30 - (y - 20)**2)) * 1.7)
        g[y, 24 - rw : 25 + rw] = c_dome
        g[y, 24 - rw] = c_dome_shade; g[y, 24 + rw] = c_dome_shade
    # Dome Windows at base
    for x in range(16, 33, 3):
        g[24, x] = c_arch
        
    # Semi-domes (cascade on sides)
    for y in range(23, 28):
        rw = 27 - y
        g[y, 14 - rw : 15 + rw] = c_dome_shade
        g[y, 34 - rw : 35 + rw] = c_dome_shade
        
    # 4 Minarets (Corner Spires)
    for mx in [5, 9, 38, 42]:
        g[6:44, mx:mx+2] = c_minaret
        g[4:6, mx] = [240, 210, 50, 255] # Gold Spire tip
    g[44, 4:44] = [35, 40, 50, 255]

from render_medieval_buildings import create_building
create_building("hagia-sophia", render_hagia_sophia_refined)

print("Refinement completed!")
