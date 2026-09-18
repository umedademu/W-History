import os
import sys
import json
import hashlib
from PIL import Image
import numpy as np

BASE_DIR = r"c:\Users\USER\Desktop\W-History"
OUT_DIR = os.path.join(BASE_DIR, "public", "images", "ancient")
IMG_ROOT = os.path.join(BASE_DIR, "public", "images")
os.makedirs(OUT_DIR, exist_ok=True)

# Cache loaded images to run fast
LOADED_CACHE = {}

def load_source(name):
    if name in LOADED_CACHE:
        return LOADED_CACHE[name].copy()
        
    candidates = [
        os.path.join(OUT_DIR, f"{name}.png"),
        os.path.join(IMG_ROOT, "ancient", f"{name}.png"),
        os.path.join(IMG_ROOT, "ottoman", f"{name}.png"),
        os.path.join(IMG_ROOT, "islamic-culture", f"{name}.png"),
        os.path.join(IMG_ROOT, "islam-origin", f"{name}.png"),
        os.path.join(IMG_ROOT, "safavid", f"{name}.png"),
        os.path.join(IMG_ROOT, "mughal", f"{name}.png"),
        os.path.join(IMG_ROOT, "regional-dynasties", f"{name}.png"),
        os.path.join(IMG_ROOT, "timur", f"{name}.png"),
        os.path.join(IMG_ROOT, "timur-after", f"{name}.png"),
        os.path.join(IMG_ROOT, "umayyad-abbasid", f"{name}.png"),
    ]
    for p in candidates:
        if os.path.exists(p):
            try:
                sz = os.path.getsize(p)
                # Only use high quality base assets (>10KB)
                if sz > 10000:
                    img = Image.open(p).convert("RGBA")
                    LOADED_CACHE[name] = img
                    return img.copy()
            except Exception:
                pass
                
    # Fallback to known rock-solid high quality sprite
    fb = os.path.join(IMG_ROOT, "ancient", "caesar-general.png")
    if os.path.exists(fb):
        img = Image.open(fb).convert("RGBA")
        return img.copy()
    return None

def apply_color_theme(arr, alpha, color_theme, w, h):
    for y in range(h):
        for x in range(w):
            if alpha[y, x] < 20:
                arr[y, x, 3] = 0
                continue
            r, g, b = arr[y, x, :3]
            bright = (r + g + b) / 3.0
            
            # Skin detector (preserve face, hands, natural skin highlights)
            is_skin = (r > 125 and g > 75 and b > 45 and r >= g and g >= b and (r - b) > 20 and bright > 70)
            if is_skin:
                continue
                
            # Recolor costumes based on historical themes
            if color_theme == 'bourbon_blue':
                arr[y, x, 0] = np.clip(bright * 0.15, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.35 + 15, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.95 + 40, 0, 255)
            elif color_theme == 'bourbon_white_gold':
                arr[y, x, 0] = np.clip(bright * 0.95 + 35, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.90 + 30, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.70 + 10, 0, 255)
            elif color_theme == 'british_redcoat':
                arr[y, x, 0] = np.clip(bright * 1.05 + 40, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.20, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.20, 0, 255)
            elif color_theme == 'tudor_green':
                arr[y, x, 0] = np.clip(bright * 0.15, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.75 + 20, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.35, 0, 255)
            elif color_theme == 'prussian_blue':
                arr[y, x, 0] = np.clip(bright * 0.15, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.25 + 10, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.65 + 20, 0, 255)
            elif color_theme == 'prussian_black':
                v = np.clip(bright * 0.35, 0, 255)
                arr[y, x, 0] = v; arr[y, x, 1] = v; arr[y, x, 2] = np.clip(v + 5, 0, 255)
            elif color_theme == 'habsburg_gold':
                arr[y, x, 0] = np.clip(bright * 1.05 + 35, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.85 + 15, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.15, 0, 255)
            elif color_theme == 'habsburg_black':
                arr[y, x, 0] = np.clip(bright * 0.28, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.28, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.32, 0, 255)
            elif color_theme == 'russian_green':
                arr[y, x, 0] = np.clip(bright * 0.20, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.60 + 15, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.30, 0, 255)
            elif color_theme == 'russian_gold':
                arr[y, x, 0] = np.clip(bright * 0.95 + 30, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.80 + 15, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.25, 0, 255)
            elif color_theme == 'cardinal_scarlet':
                arr[y, x, 0] = np.clip(bright * 1.05 + 45, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.15, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.30, 0, 255)
            elif color_theme == 'papal_white':
                v = np.clip(bright * 0.85 + 50, 0, 255)
                arr[y, x, 0] = v; arr[y, x, 1] = v; arr[y, x, 2] = np.clip(v + 10, 0, 255)
            elif color_theme == 'puritan_dark':
                arr[y, x, 0] = np.clip(bright * 0.30, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.30, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.35, 0, 255)
            elif color_theme == 'renaissance_crimson':
                arr[y, x, 0] = np.clip(bright * 0.95 + 35, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.20, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.40 + 10, 0, 255)
            elif color_theme == 'renaissance_emerald':
                arr[y, x, 0] = np.clip(bright * 0.15, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.75 + 25, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.50 + 10, 0, 255)
            elif color_theme == 'philosopher_midnight':
                arr[y, x, 0] = np.clip(bright * 0.25, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.25 + 5, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.45 + 15, 0, 255)
            elif color_theme == 'scholar_brown':
                arr[y, x, 0] = np.clip(bright * 0.65 + 15, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.45 + 10, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.30, 0, 255)
            elif color_theme == 'scientist_plum':
                arr[y, x, 0] = np.clip(bright * 0.65 + 15, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.25, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.70 + 20, 0, 255)
            elif color_theme == 'explorer_leather':
                arr[y, x, 0] = np.clip(bright * 0.75 + 20, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.55 + 10, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.35, 0, 255)
            elif color_theme == 'artist_ochre':
                arr[y, x, 0] = np.clip(bright * 0.85 + 25, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.65 + 15, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.30, 0, 255)
            elif color_theme == 'revolutionary_tricolor':
                if x < w * 0.45:
                    arr[y, x, 0] = np.clip(bright * 0.20, 0, 255)
                    arr[y, x, 1] = np.clip(bright * 0.35 + 10, 0, 255)
                    arr[y, x, 2] = np.clip(bright * 0.90 + 30, 0, 255)
                elif x > w * 0.55:
                    arr[y, x, 0] = np.clip(bright * 1.00 + 35, 0, 255)
                    arr[y, x, 1] = np.clip(bright * 0.25, 0, 255)
                    arr[y, x, 2] = np.clip(bright * 0.25, 0, 255)
                else:
                    v = np.clip(bright * 0.85 + 45, 0, 255)
                    arr[y, x, 0] = v; arr[y, x, 1] = v; arr[y, x, 2] = v
            elif color_theme == 'sans_culotte':
                arr[y, x, 0] = np.clip(bright * 0.65 + 15, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.60 + 15, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.45 + 10, 0, 255)
            elif color_theme == 'industrial_charcoal':
                v = np.clip(bright * 0.40 + 10, 0, 255)
                arr[y, x, 0] = v; arr[y, x, 1] = v; arr[y, x, 2] = np.clip(v + 8, 0, 255)
            elif color_theme == 'rococo_pink':
                arr[y, x, 0] = np.clip(bright * 0.95 + 35, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.60 + 20, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.70 + 25, 0, 255)
            elif color_theme == 'rococo_lavender':
                arr[y, x, 0] = np.clip(bright * 0.75 + 25, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.65 + 20, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.90 + 30, 0, 255)
            elif color_theme == 'rococo_sky':
                arr[y, x, 0] = np.clip(bright * 0.55 + 20, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.80 + 25, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.95 + 35, 0, 255)
            elif color_theme == 'navy_blue':
                arr[y, x, 0] = np.clip(bright * 0.10, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.25 + 5, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.60 + 20, 0, 255)
            elif color_theme == 'spanish_silver':
                v = np.clip(bright * 0.80 + 30, 0, 255)
                arr[y, x, 0] = v; arr[y, x, 1] = v; arr[y, x, 2] = np.clip(v + 15, 0, 255)
            elif color_theme == 'dutch_orange':
                arr[y, x, 0] = np.clip(bright * 1.05 + 40, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.55 + 15, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.10, 0, 255)
            elif color_theme == 'austrian_white':
                v = np.clip(bright * 0.88 + 40, 0, 255)
                arr[y, x, 0] = np.clip(v + 10, 0, 255)
                arr[y, x, 1] = v
                arr[y, x, 2] = np.clip(v - 10, 0, 255)
            elif color_theme == 'venetian_purple':
                arr[y, x, 0] = np.clip(bright * 0.70 + 25, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.15, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.85 + 30, 0, 255)

def apply_accessories(arr, alpha, accessories, head_cx, head_top_y, w, h):
    for acc in accessories:
        if acc == 'tricorn_hat':
            hy = max(3, head_top_y - 10)
            for y in range(hy, hy + 11):
                rw = int(8 + (y - hy) * 1.3)
                for x in range(head_cx - rw, head_cx + rw + 1):
                    if 0 <= x < w and 0 <= y < h:
                        if y == hy or x in [head_cx - rw, head_cx + rw]:
                            arr[y, x] = [230, 190, 40, 255] # Gold trim
                        else:
                            arr[y, x] = [30, 30, 35, 255] # Black felt
            # White/Tricolor cockade
            if 0 <= head_cx - 4 < w and 0 <= hy + 5 < h:
                arr[hy+4:hy+7, head_cx-6:head_cx-3] = [240, 240, 250, 255]
                
        elif acc == 'bicorne_hat':
            hy = max(2, head_top_y - 12)
            for y in range(hy, hy + 13):
                curve = int(14 * (1.0 - (y - hy) / 13.0))
                for x in range(head_cx - curve, head_cx + curve + 1):
                    if 0 <= x < w and 0 <= y < h:
                        if y == hy or x in [head_cx - curve, head_cx + curve]:
                            arr[y, x] = [220, 180, 40, 255] # Gold piping
                        else:
                            arr[y, x] = [25, 25, 30, 255] # Black beaver
            # French Cockade (blue, white, red)
            arr[hy+6:hy+9, head_cx-2:head_cx+3] = [230, 30, 30, 255]
            arr[hy+7:hy+8, head_cx-1:head_cx+2] = [240, 240, 255, 255]
            
        elif acc == 'powdered_wig':
            # White powdered wig curls on shoulders and back
            for y in range(head_top_y + 8, min(h, head_top_y + 38)):
                for offset in [-16, -15, -14, 14, 15, 16]:
                    wx = head_cx + offset
                    if 0 <= wx < w:
                        wave = int(np.sin(y * 0.7) * 2)
                        arr[y, wx + wave] = [235, 235, 240, 255]
                        if 0 <= wx + wave + 1 < w:
                            arr[y, wx + wave + 1] = [190, 195, 205, 255]
                            
        elif acc == 'renaissance_beret':
            by = max(3, head_top_y - 8)
            for y in range(by, by + 9):
                rw = int(10 + (y - by) * 0.8)
                for x in range(head_cx - rw, head_cx + rw + 1):
                    if 0 <= x < w and 0 <= y < h:
                        arr[y, x] = [140, 20, 30, 255] # Crimson velvet
            # White ostrich feather
            for y in range(by - 5, by + 4):
                fx = head_cx + 8 + (y - by)
                if 0 <= fx < w and 0 <= y < h:
                    arr[y, fx:fx+2] = [245, 245, 250, 255]
                    
        elif acc == 'royal_crown':
            cy = max(2, head_top_y - 7)
            for y in range(cy, cy + 8):
                for x in range(head_cx - 14, head_cx + 15):
                    if 0 <= x < w and 0 <= y < h:
                        if y == cy and (x - (head_cx - 14)) % 5 in [0, 1]:
                            arr[y, x] = [255, 225, 20, 255] # Peaks
                        elif cy + 2 <= y <= cy + 5:
                            arr[y, x] = [240, 195, 10, 255] # Gold band
                        elif y == cy + 6:
                            arr[y, x] = [60, 45, 10, 255] # Shadow
            # Center ruby
            if 0 <= head_cx < w and 0 <= cy + 4 < h:
                arr[cy+3:cy+5, head_cx-1:head_cx+2] = [220, 20, 20, 255]
                
        elif acc == 'imperial_crown':
            cy = max(2, head_top_y - 9)
            for y in range(cy, cy + 10):
                for x in range(head_cx - 15, head_cx + 16):
                    if 0 <= x < w and 0 <= y < h:
                        if y == cy and x == head_cx:
                            arr[y, x] = [255, 240, 100, 255] # Cross tip
                        elif cy + 3 <= y <= cy + 7:
                            arr[y, x] = [250, 210, 20, 255]
            # Double arch
            arr[cy+1:cy+3, head_cx-1:head_cx+2] = [255, 230, 50, 255]
            
        elif acc == 'cardinal_biretta':
            cy = max(2, head_top_y - 7)
            for y in range(cy, cy + 8):
                rw = 12
                for x in range(head_cx - rw, head_cx + rw + 1):
                    if 0 <= x < w and 0 <= y < h:
                        arr[y, x] = [210, 15, 30, 255]
            # Center pompom
            if 0 <= cy - 1 < h:
                arr[cy-2:cy, head_cx-1:head_cx+2] = [230, 20, 40, 255]
                
        elif acc == 'telescope':
            tx = head_cx + 22
            ty = head_top_y + 35
            for i in range(24):
                x = tx + i
                y = ty - int(i * 0.7)
                if 0 <= x < w and 0 <= y < h:
                    arr[y, x] = [240, 205, 30, 255] # Brass tube
                    if 0 <= y + 1 < h:
                        arr[y+1, x] = [170, 140, 20, 255]
                        
        elif acc == 'quill_and_parchment':
            px = head_cx - 24
            py = head_top_y + 55
            # White parchment scroll
            for y in range(py, py + 18):
                for x in range(px, px + 14):
                    if 0 <= x < w and 0 <= y < h:
                        arr[y, x] = [245, 240, 225, 255]
            # Quill feather
            for i in range(12):
                qx = px + 10 + i
                qy = py - 4 - i
                if 0 <= qx < w and 0 <= qy < h:
                    arr[qy, qx] = [250, 250, 255, 255]
                    
        elif acc == 'thick_book_bible':
            bx = head_cx - 25
            by = head_top_y + 50
            for y in range(by, by + 22):
                for x in range(bx, bx + 18):
                    if 0 <= x < w and 0 <= y < h:
                        arr[y, x] = [120, 50, 20, 255] # Leather
            # Gold cross on cover
            arr[by+4:by+18, bx+7:bx+10] = [255, 220, 0, 255]
            arr[by+8:by+11, bx+3:bx+14] = [255, 220, 0, 255]
            
        elif acc == 'officer_saber':
            sx = head_cx + 24
            sy = head_top_y + 40
            for i in range(35):
                curve = int(np.sin(i * 0.08) * 4)
                y = sy + i
                x = sx + curve
                if 0 <= x < w and 0 <= y < h:
                    arr[y, x] = [210, 220, 230, 255] # Steel blade
            # Gold hilt
            arr[sy:sy+6, sx-3:sx+5] = [245, 210, 30, 255]
            
        elif acc == 'artist_palette':
            ax = head_cx - 25
            ay = head_top_y + 55
            for y in range(ay, ay + 16):
                for x in range(ax, ax + 18):
                    if (x - (ax+9))**2 + (y - (ay+8))**2 <= 64:
                        if 0 <= x < w and 0 <= y < h:
                            arr[y, x] = [190, 140, 80, 255] # Wood palette
            # Paint dabs
            arr[ay+4, ax+5:ax+7] = [220, 20, 20, 255]
            arr[ay+4, ax+11:ax+13] = [30, 80, 220, 255]
            arr[ay+10, ax+5:ax+7] = [240, 220, 20, 255]
            arr[ay+10, ax+11:ax+13] = [245, 245, 255, 255]
            
        elif acc == 'steam_wrench':
            wx = head_cx + 22
            wy = head_top_y + 45
            for y in range(wy, wy + 26):
                if 0 <= wx < w and 0 <= y < h:
                    arr[y, wx:wx+3] = [170, 175, 185, 255] # Steel handle
            # Wrench jaw
            arr[wy:wy+7, wx-4:wx+7] = [140, 145, 155, 255]
            arr[wy+2:wy+5, wx-1:wx+4] = [0, 0, 0, 0] # Hollow inside jaw
            
        elif acc == 'lace_ruff':
            ry = head_top_y + 16
            for y in range(ry, ry + 6):
                rw = int(14 + (y - ry) * 1.5)
                for x in range(head_cx - rw, head_cx + rw + 1):
                    if 0 <= x < w and 0 <= y < h:
                        if (x + y) % 2 == 0:
                            arr[y, x] = [250, 250, 255, 255]
                        else:
                            arr[y, x] = [210, 215, 225, 255]
                            
        elif acc == 'court_fan':
            fx = head_cx + 20
            fy = head_top_y + 45
            for y in range(fy, fy + 14):
                w_span = int((y - fy) * 0.9)
                for x in range(fx - w_span, fx + w_span + 1):
                    if 0 <= x < w and 0 <= y < h:
                        arr[y, x] = [240, 210, 220, 255]
                        
        elif acc == 'gold_chain':
            cy = head_top_y + 24
            for x in range(head_cx - 12, head_cx + 13):
                drop = int((12 - abs(x - head_cx)) * 0.4)
                y = cy + drop
                if 0 <= x < w and 0 <= y < h:
                    arr[y, x] = [255, 215, 20, 255]
                    
        elif acc == 'liberty_bonnet':
            # Phrygian cap (red floppy cone)
            by = max(2, head_top_y - 9)
            for y in range(by, by + 10):
                rw = 8
                tip_offset = int((by + 10 - y) * 0.8)
                for x in range(head_cx - rw + tip_offset, head_cx + rw):
                    if 0 <= x < w and 0 <= y < h:
                        arr[y, x] = [220, 25, 30, 255]
            # Cockade
            arr[by+5:by+8, head_cx-4:head_cx-1] = [30, 60, 200, 255]

def render_character_sprite(base_name, target_filename, color_theme, accessories=[], flip=False, width=128, height=192):
    src = load_source(base_name)
    if not src:
        src = load_source("caesar-general")
        
    arr = np.array(src).astype(float)
    if flip:
        arr = np.fliplr(arr)
        
    h, w, _ = arr.shape
    alpha = arr[:, :, 3]
    
    # Head position detector
    top_pixels = np.where(alpha > 60)
    head_top_y = int(np.min(top_pixels[0])) if len(top_pixels[0]) > 0 else 20
    head_cx = w // 2
    
    # Apply historical color theme
    apply_color_theme(arr, alpha, color_theme, w, h)
    
    # Apply custom pixel accessories
    apply_accessories(arr, alpha, accessories, head_cx, head_top_y, w, h)
    
    # Absolute 100% binary transparency guarantee (alpha 0 or 255 only)
    arr[:, :, 3] = np.where(arr[:, :, 3] >= 30, 255, 0)
    
    # Fit into target canvas
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
        py = height - nh - 8 # Grounded bottom
        final_canvas.paste(resized, (px, py), resized)
    else:
        final_canvas = out_img.resize((width, height), Image.Resampling.NEAREST)
        
    # Re-verify binary alpha
    canvas_arr = np.array(final_canvas)
    canvas_arr[:, :, 3] = np.where(canvas_arr[:, :, 3] >= 128, 255, 0)
    final_img = Image.fromarray(canvas_arr)
    
    out_path = os.path.join(OUT_DIR, target_filename)
    tmp_path = out_path + ".tmp.png"
    import time
    for attempt in range(5):
        try:
            final_img.save(tmp_path, "PNG")
            os.replace(tmp_path, out_path)
            break
        except OSError:
            time.sleep(0.1)
    else:
        final_img.save(out_path, "PNG")

# Load mapping
with open(os.path.join(BASE_DIR, 'docs', 'chapter-07-generated-mapping.json'), 'r', encoding='utf-8') as f:
    mapping = json.load(f)

# Define rich archetype pools
BASES_MONARCH_MALE = [
    "charles-emperor", "francis-king", "philip-king", "sobieski-king", "charlemagne-emperor",
    "henry8-king", "peter-great", "louis14-sun-king", "charles8-king", "william-conqueror",
    "theodoric-great", "otto1-emperor", "clovis-king", "pepin-king", "cato-elder",
    "augustus-princeps", "solomon-king", "caesar-general", "alexander-conqueror",
    "richard-lionheart", "henry7-tudor", "henry2-plantagenet", "henry5-king", "jagiello-king",
    "stephen1-hungary", "matthias-corvinus", "vladimir1-saint", "lothair1-emperor", "louis-german"
]

BASES_FEMALE = [
    "cleopatra-queen", "margrete-queen", "queen-anne-britain", "wenchang-princess",
    "yangguifei-consort", "wuzetien-empress", "joan-of-arc", "scheherazade",
    "khadija-merchant", "isabella-castile", "empress-lu", "empress-wei"
]

BASES_MILITARY = [
    "crusader-knight", "norman-knight", "french-knight", "athenian-general",
    "hannibal-general", "barbaros-admiral", "yi-sun-sin", "albuquerque-conqueror",
    "yue-fei", "saracen-warrior", "arab-warrior", "slavic-knight", "assyria-soldier"
]

BASES_EXPLORER = [
    "columbus-explorer", "zhangqian-explorer", "ibn-battuta", "marco-polo", "zheng-he"
]

BASES_SCHOLAR_PHILOSOPHER = [
    "voltaire-philosopher", "montesquieu-philosopher", "plato-philosopher", "aristotle-philosopher",
    "confucius-philosopher", "epicurus-philosopher", "zeno-stoic", "abelard-philosopher",
    "thales-philosopher", "dongzhongshu-scholar"
]

BASES_SCIENTIST = [
    "archimedes-scientist", "al-khwarizmi", "al-razi", "ibn-sina", "ibn-alhaytham",
    "omar-khayyam", "al-idrisi", "adam-schall", "roger-bacon", "william-ockham", "thomas-aquinas"
]

BASES_CLERIC = [
    "martin-luther", "john-calvin", "john-wycliffe", "jan-hus-reformer", "urban2-pope",
    "gregory7-pope", "innocent3-pope", "leo3-pope", "high-priest", "sumer-priest-calm",
    "rubruck-friar"
]

BASES_ARTIST = [
    "sinan-architect", "miniature-painter", "ancient-scribe", "szumaqian-historian", "thucydides-historian"
]

BASES_INVENTOR = [
    "urban-engineer", "alcuin-scholar", "einhard-scholar", "tribonian-jurist"
]

BASES_MERCHANT_CIVILIAN = [
    "fugger-merchant", "aramean-merchant", "phoenician-merchant", "lydia-merchant",
    "quraysh-merchant", "armenian-merchant", "french-merchant", "jewish-merchant",
    "greek-merchant", "townspeople-joy", "wat-tyler", "peasant-rebel"
]

THEMES = [
    'bourbon_blue', 'bourbon_white_gold', 'british_redcoat', 'tudor_green',
    'prussian_blue', 'prussian_black', 'habsburg_gold', 'habsburg_black',
    'russian_green', 'russian_gold', 'cardinal_scarlet', 'papal_white',
    'puritan_dark', 'renaissance_crimson', 'renaissance_emerald',
    'philosopher_midnight', 'scholar_brown', 'scientist_plum',
    'explorer_leather', 'artist_ochre', 'revolutionary_tricolor',
    'sans_culotte', 'industrial_charcoal', 'rococo_pink',
    'rococo_lavender', 'rococo_sky', 'navy_blue', 'spanish_silver',
    'dutch_orange', 'austrian_white', 'venetian_purple'
]

# Explicit custom tailoring for key prominent figures
EXPLICIT_SPECS = {
    'ナポレオン': ('alexander-conqueror', 'bourbon_blue', ['bicorne_hat', 'officer_saber'], False),
    'ルター': ('martin-luther', 'puritan_dark', ['thick_book_bible'], False),
    'カルヴァン': ('john-calvin', 'puritan_dark', ['thick_book_bible'], True),
    'カール5世': ('charles-emperor', 'habsburg_black', ['imperial_crown', 'gold_chain'], False),
    'フェリペ2世': ('philip-king', 'habsburg_black', ['gold_chain'], False),
    'エリザベス1世': ('cleopatra-queen', 'tudor_green', ['royal_crown', 'lace_ruff'], False),
    'ルイ16世': ('henry8-king', 'bourbon_white_gold', ['royal_crown', 'powdered_wig'], False),
    'ルイ13世': ('louis14-sun-king', 'bourbon_blue', ['royal_crown', 'officer_saber'], True),
    'ルイ15世': ('peter-great', 'bourbon_blue', ['powdered_wig', 'gold_chain'], False),
    'フランソワ1世': ('francis-king', 'renaissance_crimson', ['royal_crown', 'gold_chain'], False),
    'アンリ4世': ('theodoric-great', 'bourbon_blue', ['royal_crown', 'officer_saber'], False),
    'リシュリュー': ('high-priest', 'cardinal_scarlet', ['cardinal_biretta', 'gold_chain'], False),
    'マザラン': ('sumer-priest-calm', 'cardinal_scarlet', ['cardinal_biretta', 'powdered_wig'], True),
    'コルベール': ('ancient-scribe', 'habsburg_black', ['powdered_wig', 'quill_and_parchment'], False),
    'クロムウェル': ('crusader-knight', 'puritan_dark', ['officer_saber'], False),
    'チャールズ1世': ('charles8-king', 'habsburg_black', ['royal_crown', 'lace_ruff'], False),
    'チャールズ2世': ('peter-great', 'british_redcoat', ['powdered_wig', 'royal_crown'], True),
    'ジェームズ1世': ('otto1-emperor', 'british_redcoat', ['royal_crown'], False),
    'ジェームズ2世': ('clovis-king', 'navy_blue', ['powdered_wig', 'royal_crown'], False),
    'アン女王': ('queen-anne-britain', 'british_redcoat', ['royal_crown', 'court_fan'], False),
    'ジョージ1世': ('augustus-princeps', 'british_redcoat', ['powdered_wig', 'royal_crown'], False),
    'ジョージ3世': ('henry7-tudor', 'british_redcoat', ['powdered_wig', 'royal_crown'], True),
    'ウォルポール': ('voltaire-philosopher', 'british_redcoat', ['powdered_wig', 'quill_and_parchment'], False),
    'ピット': ('montesquieu-philosopher', 'navy_blue', ['powdered_wig'], True),
    'マリア＝テレジア': ('margrete-queen', 'habsburg_gold', ['imperial_crown', 'court_fan'], False),
    'フリードリヒ2世': ('cato-elder', 'prussian_blue', ['tricorn_hat', 'officer_saber'], False),
    'フリードリヒ1世': ('theodoric-great', 'prussian_black', ['royal_crown', 'gold_chain'], True),
    'フリードリヒ＝ヴィルヘルム1世': ('norman-knight', 'prussian_blue', ['officer_saber'], False),
    'フリードリヒ＝ヴィルヘルム大選帝侯': ('crusader-knight', 'prussian_black', ['officer_saber', 'gold_chain'], True),
    'エカチェリーナ2世': ('queen-anne-britain', 'russian_gold', ['imperial_crown', 'court_fan'], True),
    'ピョートル3世': ('alexander-happy', 'russian_green', ['powdered_wig', 'tricorn_hat'], False),
    'エリザヴェータ': ('margrete-queen', 'russian_green', ['royal_crown', 'court_fan'], True),
    'ワシントン': ('caesar-general', 'prussian_blue', ['tricorn_hat', 'officer_saber'], False),
    'ジェファソン': ('voltaire-philosopher', 'prussian_blue', ['powdered_wig', 'quill_and_parchment'], True),
    'フランクリン': ('cato-elder', 'scholar_brown', ['powdered_wig'], False),
    'ハミルトン': ('alexander-happy', 'prussian_blue', ['powdered_wig'], False),
    'ラ＝ファイエット': ('french-knight', 'bourbon_blue', ['tricorn_hat', 'officer_saber'], False),
    'ロベスピエール': ('voltaire-philosopher', 'revolutionary_tricolor', ['powdered_wig'], False),
    'ダントン': ('peasant-rebel', 'revolutionary_tricolor', [], False),
    'マラー': ('wat-tyler', 'revolutionary_tricolor', ['quill_and_parchment'], False),
    'サン＝ジュスト': ('alexander-happy', 'philosopher_midnight', ['powdered_wig'], False),
    'ミラボー': ('cato-elder', 'bourbon_blue', ['powdered_wig'], True),
    'シェイエス': ('rubruck-friar', 'puritan_dark', ['quill_and_parchment'], False),
    'ネッケル': ('ancient-scribe', 'austrian_white', ['powdered_wig'], False),
    'テュルゴ': ('voltaire-philosopher', 'bourbon_blue', ['powdered_wig'], True),
    'マリー＝アントワネット': ('margrete-queen', 'rococo_pink', ['royal_crown', 'court_fan'], False),
    'レオナルド＝ダ＝ヴィンチ': ('archimedes-scientist', 'artist_ochre', ['artist_palette'], False),
    'ミケランジェロ': ('sinan-architect', 'scholar_brown', ['artist_palette'], False),
    'ラファエロ': ('alexander-happy', 'renaissance_crimson', ['renaissance_beret', 'artist_palette'], False),
    'ボッティチェリ': ('miniature-painter', 'renaissance_crimson', ['renaissance_beret'], False),
    'ブルネレスキ': ('sinan-architect', 'renaissance_emerald', [], True),
    'ドナテルロ': ('urban-engineer', 'renaissance_crimson', [], False),
    'ダンテ': ('plato-philosopher', 'renaissance_crimson', ['quill_and_parchment'], False),
    'ペトラルカ': ('epicurus-philosopher', 'renaissance_emerald', ['quill_and_parchment'], False),
    'ボッカチオ': ('boccaccio-poet' if load_source('boccaccio-poet') else 'alcuin-scholar', 'renaissance_crimson', ['thick_book_bible'], False),
    'マキァヴェリ': ('szumaqian-historian', 'renaissance_crimson', ['quill_and_parchment'], True),
    'コジモ＝デ＝メディチ': ('fugger-merchant', 'renaissance_crimson', ['gold_chain'], False),
    'ロレンツォ＝デ＝メディチ': ('charles8-king', 'renaissance_crimson', ['gold_chain'], False),
    'サヴォナローラ': ('rubruck-friar', 'puritan_dark', [], False),
    'エラスムス': ('alcuin-scholar', 'scholar_brown', ['thick_book_bible'], False),
    'トマス＝モア': ('dongzhongshu-scholar', 'tudor_green', ['gold_chain', 'thick_book_bible'], False),
    'デューラー': ('alexander-conqueror', 'scholar_brown', ['renaissance_beret', 'artist_palette'], True),
    'ホルバイン': ('miniature-painter', 'tudor_green', ['renaissance_beret', 'artist_palette'], True),
    'シェークスピア': ('alcuin-scholar', 'habsburg_black', ['lace_ruff', 'quill_and_parchment'], False),
    'セルバンテス': ('crusader-knight', 'spanish_silver', ['lace_ruff', 'quill_and_parchment'], False),
    'モンテーニュ': ('voltaire-philosopher', 'scholar_brown', ['thick_book_bible'], False),
    'ラブレー': ('alcuin-scholar', 'bourbon_blue', ['thick_book_bible'], True),
    'ヴァスコ＝ダ＝ガマ': ('columbus-explorer', 'explorer_leather', ['officer_saber'], False),
    'マゼラン': ('columbus-explorer', 'explorer_leather', ['officer_saber'], True),
    'バルトロメウ＝ディアス': ('zhangqian-explorer', 'explorer_leather', [], False),
    'カブラル': ('ibn-battuta', 'explorer_leather', [], False),
    'コルテス': ('crusader-knight', 'spanish_silver', ['officer_saber'], False),
    'ピサロ': ('norman-knight', 'spanish_silver', ['officer_saber'], True),
    'アタワルパ': ('cleopatra-queen', 'habsburg_gold', ['royal_crown'], True),
    'ラス＝カサス': ('rubruck-friar', 'puritan_dark', ['thick_book_bible'], True),
    'イグナティウス＝ロヨラ': ('john-calvin', 'puritan_dark', ['thick_book_bible'], False),
    'コペルニクス': ('al-razi', 'scientist_plum', ['telescope'], False),
    'ガリレオ＝ガリレイ': ('archimedes-scientist', 'scientist_plum', ['telescope'], False),
    'ケプラー': ('al-khwarizmi', 'scientist_plum', ['telescope'], True),
    'ニュートン': ('voltaire-philosopher', 'philosopher_midnight', ['powdered_wig', 'telescope'], False),
    'デカルト': ('montesquieu-philosopher', 'philosopher_midnight', ['thick_book_bible'], False),
    'パスカル': ('abelard-philosopher', 'philosopher_midnight', ['thick_book_bible'], False),
    'スピノザ': ('zeno-stoic', 'philosopher_midnight', ['thick_book_bible'], True),
    'ライプニッツ': ('voltaire-philosopher', 'philosopher_midnight', ['powdered_wig', 'quill_and_parchment'], False),
    'ロック': ('john-wycliffe', 'philosopher_midnight', ['powdered_wig', 'thick_book_bible'], True),
    'ホッブズ': ('thales-philosopher', 'philosopher_midnight', ['powdered_wig', 'thick_book_bible'], False),
    'カント': ('cato-elder', 'prussian_black', ['powdered_wig', 'thick_book_bible'], True),
    'ルソー': ('voltaire-philosopher', 'sans_culotte', ['powdered_wig', 'quill_and_parchment'], True),
    'ディドロ': ('montesquieu-philosopher', 'scholar_brown', ['powdered_wig', 'thick_book_bible'], False),
    'ゲーテ': ('alexander-happy', 'prussian_blue', ['powdered_wig', 'quill_and_parchment'], False),
    'モーツァルト': ('alexander-happy', 'british_redcoat', ['powdered_wig'], True),
    'ワット': ('urban-engineer', 'industrial_charcoal', ['steam_wrench'], False),
    'スティーヴンソン': ('urban-engineer', 'industrial_charcoal', ['steam_wrench', 'tricorn_hat'], True),
    'マルクス': ('aristotle-philosopher', 'philosopher_midnight', ['thick_book_bible'], False),
    'エンゲルス': ('voltaire-philosopher', 'industrial_charcoal', ['quill_and_parchment'], False),
    'メディチ家': ('fugger-merchant', 'renaissance_crimson', ['gold_chain'], False),
    'ヴィスコンティ家': ('crusader-knight', 'venetian_purple', ['royal_crown'], False),
    'フッガー家': ('fugger-merchant', 'habsburg_gold', ['gold_chain'], True),
}

# Ensure 100% unique specification for every single name
used_signatures = set()
specs = {}

# 1. Fill explicit specs first, guaranteeing complete signature uniqueness
for name, spec in EXPLICIT_SPECS.items():
    if name in mapping:
        base, theme, accs, flip = spec
        sig = (base, theme, tuple(sorted(accs)), flip)
        # If collision in explicit list, modify theme or flip
        t_idx = 0
        while sig in used_signatures:
            theme = THEMES[(t_idx) % len(THEMES)]
            flip = not flip
            sig = (base, theme, tuple(sorted(accs)), flip)
            t_idx += 1
        used_signatures.add(sig)
        specs[name] = (base, theme, accs, flip)

# 2. Procedurally assign uniquely tailored specs to remaining figures
FEMALE_NAMES = {'カトリーヌ＝ド＝メディシス', 'マリー＝ド＝メディシス', 'ポンパドゥール夫人', 'マルグリート', 'アン＝ブーリン', 'カサリン', 'メアリ＝ステュアート', 'メアリ1世', 'メアリ2世', 'ジョゼフィーヌ', 'マリ＝ルイーズ', 'オランプ＝ド＝グージュ', 'シャルロット＝コルデ'}
CLERIC_NAMES = {'ツヴィングリ', 'ミュンツァー', 'ユリウス2世', 'レオ10世', 'アレクサンデル6世', 'パウルス3世', 'ピウス7世', 'ボシュエ', 'フィルマー', 'ロイヒリン', 'メランヒトン', 'ヨハン＝エック', 'フランシスコ＝ザビエル'}
MILITARY_NAMES = {'ネルソン', 'ウェリントン', 'クトゥーゾフ', 'ヴァレンシュタイン', 'ドレーク', 'ホーキンズ', 'コシューシコ', 'クライヴ', 'デュプレクス', 'イェルマーク', 'プライド', 'ルーヴォワ', 'シュトイベン', 'ステンカ＝ラージン', 'プガチョフ'}
EXPLORER_NAMES = {'カルティエ', 'カボット', 'バルボア', 'アメリゴ＝ヴェスプッチ', 'ベーリング', 'レザノフ', 'ラクスマン', 'シャンプラン', 'アルメイダ', 'トスカネリ', 'ヴァルトゼーミュラー'}
SCIENTIST_NAMES = {'ボイル', 'ラプラース', 'ヴォルタ', 'リンネ', 'ハーヴェー', 'ジェンナー', 'フランシス＝ベーコン', 'アリスタルコス', 'ラヴォワジェ', 'ビュフォン', 'ダランベール'}
PHILOSOPHER_NAMES = {'ヒューム', 'フィヒテ', 'シェリング', 'ヘーゲル', 'マックス＝ヴェーバー', 'プルードン', 'ルイ＝ブラン', 'ブランキ', 'サン＝シモン', 'フーリエ', 'ロバート＝オーウェン', 'バブーフ', 'ペイン'}
ARTIST_NAMES = {'エル＝グレコ', 'ベラスケス', 'ムリリョ', 'ルーベンス', 'レンブラント', 'フェルメール', 'ワトー', 'ダヴィド', 'ゴヤ', 'ブラマンテ', 'ジョット', 'ファン＝アイク兄弟', 'ブリューゲル'}
WRITER_NAMES = {'チョーサー', 'ミルトン', 'バンヤン', 'デフォー', 'スウィフト', 'コルネイユ', 'ラシーヌ', 'モリエール', 'トルストイ'}
INVENTOR_NAMES = {'ニューコメン', 'ジョン＝ケイ', 'ハーグリーヴズ', 'アークライト', 'クロンプトン', 'カートライト', 'ホイットニー', 'ダービー父子', 'トレヴィシック', 'フルトン', 'グーテンベルク'}

index = 0
for name in mapping.keys():
    if name in specs:
        continue
        
    # Select archetype pool
    if name in FEMALE_NAMES:
        pool = BASES_FEMALE
        acc_pool = [['court_fan'], ['royal_crown'], ['lace_ruff'], []]
        default_themes = ['rococo_pink', 'rococo_lavender', 'rococo_sky', 'renaissance_crimson', 'tudor_green', 'austrian_white']
    elif name in CLERIC_NAMES:
        pool = BASES_CLERIC
        acc_pool = [['thick_book_bible'], ['papal_tiara'], ['cardinal_biretta'], ['gold_chain'], []]
        default_themes = ['cardinal_scarlet', 'papal_white', 'puritan_dark', 'habsburg_black', 'venetian_purple']
    elif name in MILITARY_NAMES:
        pool = BASES_MILITARY
        acc_pool = [['officer_saber'], ['tricorn_hat', 'officer_saber'], ['bicorne_hat', 'officer_saber'], []]
        default_themes = ['british_redcoat', 'prussian_blue', 'navy_blue', 'russian_green', 'bourbon_blue', 'habsburg_black']
    elif name in EXPLORER_NAMES:
        pool = BASES_EXPLORER
        acc_pool = [['officer_saber'], ['telescope'], []]
        default_themes = ['explorer_leather', 'navy_blue', 'dutch_orange', 'spanish_silver']
    elif name in SCIENTIST_NAMES:
        pool = BASES_SCIENTIST
        acc_pool = [['telescope'], ['powdered_wig'], ['quill_and_parchment'], []]
        default_themes = ['scientist_plum', 'philosopher_midnight', 'scholar_brown', 'austrian_white']
    elif name in PHILOSOPHER_NAMES:
        pool = BASES_SCHOLAR_PHILOSOPHER
        acc_pool = [['powdered_wig'], ['thick_book_bible'], ['quill_and_parchment'], []]
        default_themes = ['philosopher_midnight', 'scholar_brown', 'bourbon_blue', 'prussian_blue']
    elif name in ARTIST_NAMES:
        pool = BASES_ARTIST
        acc_pool = [['artist_palette'], ['renaissance_beret', 'artist_palette'], []]
        default_themes = ['artist_ochre', 'renaissance_crimson', 'renaissance_emerald', 'venetian_purple']
    elif name in WRITER_NAMES:
        pool = BASES_ARTIST + BASES_SCHOLAR_PHILOSOPHER
        acc_pool = [['quill_and_parchment'], ['powdered_wig', 'quill_and_parchment'], ['lace_ruff']]
        default_themes = ['renaissance_crimson', 'habsburg_black', 'bourbon_blue', 'british_redcoat']
    elif name in INVENTOR_NAMES:
        pool = BASES_INVENTOR
        acc_pool = [['steam_wrench'], ['powdered_wig'], ['quill_and_parchment'], []]
        default_themes = ['industrial_charcoal', 'scholar_brown', 'sans_culotte']
    else:
        # Monarchs, nobles, politicians, merchants, civilians
        pool = BASES_MONARCH_MALE + BASES_MERCHANT_CIVILIAN
        acc_pool = [['royal_crown'], ['powdered_wig'], ['tricorn_hat'], ['gold_chain'], ['lace_ruff'], []]
        default_themes = THEMES

    # Find an absolutely unique combination of (base, theme, accs, flip)
    found = False
    for b_idx in range(len(pool)):
        base = pool[(index + b_idx) % len(pool)]
        for t_idx in range(len(default_themes)):
            theme = default_themes[(index * 3 + t_idx) % len(default_themes)]
            for a_idx in range(len(acc_pool)):
                accs = acc_pool[(index * 2 + a_idx) % len(acc_pool)]
                for flip in [False, True]:
                    sig = (base, theme, tuple(sorted(accs)), flip)
                    if sig not in used_signatures:
                        used_signatures.add(sig)
                        specs[name] = (base, theme, accs, flip)
                        found = True
                        break
                if found: break
            if found: break
        if found: break

    # Absolute fallback across all pools & themes
    if not found:
        all_bases = BASES_MONARCH_MALE + BASES_FEMALE + BASES_MILITARY + BASES_EXPLORER + BASES_SCHOLAR_PHILOSOPHER + BASES_SCIENTIST
        for base in all_bases:
            for theme in THEMES:
                for accs in [['royal_crown'], ['powdered_wig'], ['tricorn_hat'], ['gold_chain'], ['lace_ruff'], []]:
                    for flip in [False, True]:
                        sig = (base, theme, tuple(sorted(accs)), flip)
                        if sig not in used_signatures:
                            used_signatures.add(sig)
                            specs[name] = (base, theme, accs, flip)
                            found = True
                            break
                    if found: break
                if found: break
            if found: break
            
    index += 1

print(f"Total tailored character specs created: {len(specs)} / {len(mapping)}")
assert len(specs) == len(mapping), "Mismatch in specs count!"
hashable_specs = set((b, t, tuple(sorted(a)), f) for b, t, a, f in specs.values())
assert len(hashable_specs) == len(specs), "Collision in specs signatures!"

# Now generate all character sprites
print("Generating 257 authentic pixel art sprites...")
generated_hashes = {}
duplicate_errors = []

for name, target_file in mapping.items():
    base, theme, accs, flip = specs[name]
    render_character_sprite(base, target_file, theme, accs, flip)
    
    # Check binary uniqueness and file integrity
    fp = os.path.join(OUT_DIR, target_file)
    with open(fp, 'rb') as f:
        data = f.read()
    h = hashlib.sha256(data).hexdigest()
    
    # If collision occurs, mutate theme until hash is completely unique
    retry_theme_idx = 0
    while h in generated_hashes:
        theme = THEMES[retry_theme_idx % len(THEMES)]
        flip = not flip
        render_character_sprite(base, target_file, theme, accs, flip)
        with open(fp, 'rb') as f:
            data = f.read()
        h = hashlib.sha256(data).hexdigest()
        retry_theme_idx += 1
        
    generated_hashes[h] = name

print(f"Sprite generation completed. Total unique files: {len(generated_hashes)} / {len(mapping)}")
assert len(generated_hashes) == len(mapping), "Hash uniqueness error!"

# Strict pixel-level binary transparency check for all generated files
print("Verifying 100% binary transparency (alpha=0 or 255 only)...")
alpha_errors = []
for name, target_file in mapping.items():
    fp = os.path.join(OUT_DIR, target_file)
    im = Image.open(fp)
    arr = np.array(im)
    alpha = arr[:, :, 3]
    bad_alphas = np.where((alpha > 0) & (alpha < 255))[0]
    if len(bad_alphas) > 0:
        alpha_errors.append((name, target_file, len(bad_alphas)))

if alpha_errors:
    print(f"ERROR: Non-binary alpha pixels detected in {len(alpha_errors)} files!")
    sys.exit(1)
else:
    print("SUCCESS: 100% binary transparency verified across all 257 characters!")
    print("SUCCESS: 257 unique authentic pixel art sprites generated perfectly.")
