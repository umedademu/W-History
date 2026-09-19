import os, sys
from PIL import Image
import numpy as np

BASE_DIR = r"c:\Users\USER\Desktop\W-History"

def make_hd_cleopatra():
    base_path = os.path.join(BASE_DIR, "public", "images", "ancient", "elizabeth1-tudor.png")
    src = Image.open(base_path).convert("RGBA")
    w, h = src.size # 128, 192

    arr = np.array(src).astype(float)
    alpha = arr[:, :, 3]

    # Transform into Cleopatra:
    # Golden nemes headdress, lapis lazuli bands, white linen dress with gold embroidery
    for y in range(h):
        for x in range(w):
            if alpha[y, x] < 30:
                arr[y, x, 3] = 0
                continue
            arr[y, x, 3] = 255 # strict binary alpha
            r, g, b = arr[y, x, :3]
            bright = (r + g + b) / 3.0
            
            # Skin detection (face, hands)
            is_skin = (r > 120 and g > 75 and b > 45 and r >= g and g >= b and (r - b) > 15 and bright > 70)
            if is_skin:
                # Give warm sun-kissed Mediterranean/Egyptian skin tone
                arr[y, x, 0] = np.clip(bright * 1.05 + 15, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.88 + 10, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.70 + 5, 0, 255)
                continue

            # Hair & headdress (top area y < 65)
            if y < 60:
                # Check center vs sides
                if (x + y // 3) % 4 in [0, 1]:
                    # Gold bands
                    arr[y, x, 0] = np.clip(bright * 1.15 + 40, 0, 255)
                    arr[y, x, 1] = np.clip(bright * 0.95 + 20, 0, 255)
                    arr[y, x, 2] = np.clip(bright * 0.15, 0, 255)
                else:
                    # Lapis lazuli deep blue
                    arr[y, x, 0] = np.clip(bright * 0.15, 0, 255)
                    arr[y, x, 1] = np.clip(bright * 0.40 + 10, 0, 255)
                    arr[y, x, 2] = np.clip(bright * 0.95 + 40, 0, 255)
            elif y < 75:
                # Collar / Usekh necklace: turquoise, lapis, gold
                band = (y + x // 4) % 3
                if band == 0:
                    # Gold
                    arr[y, x, 0] = np.clip(bright * 1.10 + 35, 0, 255)
                    arr[y, x, 1] = np.clip(bright * 0.90 + 20, 0, 255)
                    arr[y, x, 2] = np.clip(bright * 0.20, 0, 255)
                elif band == 1:
                    # Turquoise
                    arr[y, x, 0] = np.clip(bright * 0.25 + 10, 0, 255)
                    arr[y, x, 1] = np.clip(bright * 0.85 + 30, 0, 255)
                    arr[y, x, 2] = np.clip(bright * 0.80 + 30, 0, 255)
                else:
                    # Lapis
                    arr[y, x, 0] = np.clip(bright * 0.15, 0, 255)
                    arr[y, x, 1] = np.clip(bright * 0.35 + 10, 0, 255)
                    arr[y, x, 2] = np.clip(bright * 0.90 + 35, 0, 255)
            else:
                # Dress: White linen with gold trims and pleated folds
                if x in [35, 36, 92, 93] or y in [100, 101, 102]:
                    # Gold trim sash
                    arr[y, x, 0] = np.clip(bright * 1.10 + 35, 0, 255)
                    arr[y, x, 1] = np.clip(bright * 0.90 + 20, 0, 255)
                    arr[y, x, 2] = np.clip(bright * 0.20, 0, 255)
                else:
                    # Pleated linen
                    arr[y, x, 0] = np.clip(bright * 0.95 + 35, 0, 255)
                    arr[y, x, 1] = np.clip(bright * 0.93 + 30, 0, 255)
                    arr[y, x, 2] = np.clip(bright * 0.85 + 20, 0, 255)

    res = Image.fromarray(arr.astype(np.uint8))
    dst = os.path.join(BASE_DIR, "public", "images", "ancient", "cleopatra-queen.png")
    res.save(dst, "PNG", optimize=True)
    print(f"Generated {dst}: size={res.size}, bytes={os.path.getsize(dst)}")

def make_hd_pyramid():
    # Base on high quality building (e.g. colosseum or zeelandia or prague-castle)
    base_candidates = [
        os.path.join(BASE_DIR, "public", "images", "ancient", "colosseum.png"),
        os.path.join(BASE_DIR, "public", "images", "ancient", "zeelandia-fort.png"),
        os.path.join(BASE_DIR, "public", "images", "ottoman", "ottoman-inn.png"),
        os.path.join(BASE_DIR, "public", "images", "ancient", "pantheon.png"),
    ]
    base_path = None
    for p in base_candidates:
        if os.path.exists(p) and os.path.getsize(p) > 15000:
            base_path = p
            break
            
    src = Image.open(base_path).convert("RGBA").resize((192, 192), Image.Resampling.NEAREST)
    w, h = src.size # 192, 192
    base_arr = np.array(src).astype(float)

    # Now create pyramid geometry with rich textural mapping from the base
    out_arr = np.zeros((h, w, 4), dtype=float)

    # Great Pyramid Khufu peak: (114, 38), base: y=168
    peak_x, peak_y = 114, 38
    base_y = 168

    # Secondary pyramid Khafre peak: (48, 88), base: y=152
    p2_x, p2_y = 48, 88
    p2_base_y = 152

    # Draw distant pyramid first
    for y in range(p2_y, p2_base_y):
        dy = y - p2_y
        w_l = int(dy * 0.72)
        w_r = int(dy * 0.52)
        for x in range(p2_x - w_l, p2_x + w_r + 1):
            if 0 <= x < w and 0 <= y < h:
                tex_val = (base_arr[y, x, 0] + base_arr[y, x, 1] + base_arr[y, x, 2]) / 3.0
                out_arr[y, x, 3] = 255
                if x <= p2_x:
                    # Lit
                    out_arr[y, x, 0] = np.clip(tex_val * 0.90 + 55, 0, 255)
                    out_arr[y, x, 1] = np.clip(tex_val * 0.75 + 40, 0, 255)
                    out_arr[y, x, 2] = np.clip(tex_val * 0.45 + 15, 0, 255)
                else:
                    # Shade
                    out_arr[y, x, 0] = np.clip(tex_val * 0.55 + 20, 0, 255)
                    out_arr[y, x, 1] = np.clip(tex_val * 0.42 + 15, 0, 255)
                    out_arr[y, x, 2] = np.clip(tex_val * 0.28 + 10, 0, 255)

    # Draw Great Pyramid
    for y in range(peak_y, base_y):
        dy = y - peak_y
        w_l = int(dy * 0.80)
        w_r = int(dy * 0.60)
        for x in range(peak_x - w_l, peak_x + w_r + 1):
            if 0 <= x < w and 0 <= y < h:
                tex_val = (base_arr[y, x, 0] + base_arr[y, x, 1] + base_arr[y, x, 2]) / 3.0
                # Course step pattern
                step_noise = (y % 3) * 6
                out_arr[y, x, 3] = 255
                if y < peak_y + 10:
                    # Gold Capstone!
                    out_arr[y, x, 0] = np.clip(tex_val * 1.15 + 60, 0, 255)
                    out_arr[y, x, 1] = np.clip(tex_val * 0.95 + 35, 0, 255)
                    out_arr[y, x, 2] = np.clip(tex_val * 0.15 + 5, 0, 255)
                elif x <= peak_x:
                    # Bright desert sunlight on limestone blocks
                    out_arr[y, x, 0] = np.clip(tex_val * 1.05 + 50 + step_noise, 0, 255)
                    out_arr[y, x, 1] = np.clip(tex_val * 0.88 + 35 + step_noise, 0, 255)
                    out_arr[y, x, 2] = np.clip(tex_val * 0.55 + 15 + step_noise, 0, 255)
                else:
                    # Shadow side of pyramid
                    out_arr[y, x, 0] = np.clip(tex_val * 0.65 + 25 + step_noise, 0, 255)
                    out_arr[y, x, 1] = np.clip(tex_val * 0.50 + 18 + step_noise, 0, 255)
                    out_arr[y, x, 2] = np.clip(tex_val * 0.32 + 10 + step_noise, 0, 255)

    # Desert base & dunes
    for y in range(150, 185):
        for x in range(6, 186):
            if out_arr[y, x, 3] == 0 or y >= 165:
                # undulating dune height
                dune_h = int(np.sin(x * 0.08) * 6 + np.sin(x * 0.03) * 8 + 168)
                if y >= dune_h:
                    tex_val = (base_arr[y, x, 0] + base_arr[y, x, 1] + base_arr[y, x, 2]) / 3.0
                    ripple = (x + y * 2) % 6
                    dune_bright = 15 if ripple < 4 else -10
                    out_arr[y, x, 3] = 255
                    out_arr[y, x, 0] = np.clip(tex_val * 0.95 + 45 + dune_bright, 0, 255)
                    out_arr[y, x, 1] = np.clip(tex_val * 0.78 + 30 + dune_bright, 0, 255)
                    out_arr[y, x, 2] = np.clip(tex_val * 0.48 + 15 + dune_bright, 0, 255)

    res = Image.fromarray(out_arr.astype(np.uint8))
    dst = os.path.join(BASE_DIR, "public", "images", "ancient", "pyramid-giza.png")
    res.save(dst, "PNG", optimize=True)
    print(f"Generated {dst}: size={res.size}, bytes={os.path.getsize(dst)}")

if __name__ == '__main__':
    make_hd_cleopatra()
    make_hd_pyramid()
