import os, sys
from PIL import Image, ImageDraw

def create_suleyman():
    # Source is ottoman/suleiman-calm.png
    src = 'public/images/ottoman/suleiman-calm.png'
    im = Image.open(src).convert('RGBA')
    # Make sure alpha is binary
    datas = im.getdata()
    new_data = []
    for item in datas:
        if item[3] > 128:
            new_data.append((item[0], item[1], item[2], 255))
        else:
            new_data.append((0, 0, 0, 0))
    im.putdata(new_data)
    dst = 'public/images/ancient/suleyman1-magnificent.png'
    im.save(dst, 'PNG', optimize=True)
    print(f"Updated {dst}: size={im.size}, file size={os.path.getsize(dst)}")

def create_cleopatra():
    # High-quality pixel art Cleopatra 128x192
    W, H = 128, 192
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Color palette
    BG_TRANS = (0, 0, 0, 0)
    SKIN_LIGHT = (250, 218, 185, 255)
    SKIN_MID = (235, 185, 150, 255)
    SKIN_DARK = (195, 140, 110, 255)
    HAIR_BLACK = (20, 20, 28, 255)
    HAIR_BLUE = (35, 40, 60, 255)
    GOLD_BRIGHT = (255, 215, 0, 255)
    GOLD_MID = (218, 165, 32, 255)
    GOLD_DARK = (160, 120, 20, 255)
    LAPIS_BLUE = (30, 80, 160, 255)
    LAPIS_DARK = (18, 45, 100, 255)
    TURQUOISE = (64, 224, 208, 255)
    TURQUOISE_DARK = (32, 140, 130, 255)
    WHITE_DRESS = (245, 245, 250, 255)
    WHITE_SHADOW = (200, 205, 220, 255)
    RED_LIP = (190, 40, 60, 255)
    KOHL_EYE = (15, 15, 20, 255)

    # Scale: 2x pixel size (blocks of 2x2)
    def px(x, y, color):
        draw.rectangle([x*2, y*2, x*2+1, y*2+1], fill=color)

    def rect(x1, y1, x2, y2, color):
        draw.rectangle([x1*2, y1*2, x2*2+1, y2*2+1], fill=color)

    # Grid is 64 x 96 (each pixel 2x2 = 128x192)
    # Head centered around x=32, y=28..45
    # Egyptian Nemes / Crown: y=16..32
    # Crown gold band
    rect(24, 18, 40, 22, GOLD_MID)
    rect(26, 17, 38, 19, GOLD_BRIGHT)
    rect(28, 15, 36, 17, GOLD_DARK)
    # Uraeus cobra at front
    rect(31, 13, 33, 16, GOLD_BRIGHT)
    rect(32, 11, 32, 13, TURQUOISE)
    rect(31, 11, 33, 11, RED_LIP)

    # Hair / Nemes cloth side wings (lapis and gold striped)
    for row in range(20, 52):
        color = LAPIS_BLUE if (row // 2) % 2 == 0 else GOLD_MID
        dark_col = LAPIS_DARK if (row // 2) % 2 == 0 else GOLD_DARK
        # Left wing
        rect(18, row, 23, row, color)
        px(17, row, dark_col)
        # Right wing
        rect(41, row, 46, row, color)
        px(47, row, dark_col)

    # Hair bangs & Bob cut
    rect(24, 23, 40, 27, HAIR_BLACK)
    for x in range(24, 41):
        if x % 2 == 0:
            px(x, 24, HAIR_BLUE)

    # Face contour
    rect(25, 28, 39, 41, SKIN_MID)
    rect(26, 28, 38, 40, SKIN_LIGHT)
    rect(28, 41, 36, 43, SKIN_MID)
    rect(29, 43, 35, 44, SKIN_DARK) # chin shadow

    # Eyes with bold Egyptian Kohl eyeliner extending outward
    # Left eye
    px(28, 33, KOHL_EYE)
    px(29, 33, KOHL_EYE)
    px(30, 33, KOHL_EYE)
    px(27, 33, KOHL_EYE) # eyeliner tail
    px(26, 32, KOHL_EYE)
    px(29, 34, LAPIS_BLUE) # iris
    px(30, 34, (255, 255, 255, 255))
    # Right eye
    px(34, 33, KOHL_EYE)
    px(35, 33, KOHL_EYE)
    px(36, 33, KOHL_EYE)
    px(37, 33, KOHL_EYE) # eyeliner tail
    px(38, 32, KOHL_EYE)
    px(35, 34, LAPIS_BLUE)
    px(34, 34, (255, 255, 255, 255))

    # Eyebrows
    rect(28, 31, 31, 31, HAIR_BLACK)
    rect(33, 31, 36, 31, HAIR_BLACK)

    # Nose
    px(32, 36, SKIN_DARK)
    px(32, 37, SKIN_MID)
    px(31, 38, SKIN_DARK)
    px(32, 38, SKIN_MID)

    # Lips
    rect(30, 40, 34, 40, RED_LIP)
    px(31, 41, RED_LIP)
    px(32, 41, RED_LIP)
    px(33, 41, RED_LIP)

    # Neck
    rect(30, 45, 34, 48, SKIN_MID)
    rect(31, 45, 33, 47, SKIN_LIGHT)

    # Broad Egyptian Collar (Usekh) y=48..56
    for r in range(48, 56):
        w = (r - 47) * 2
        col = GOLD_BRIGHT if r in (48, 52, 55) else (TURQUOISE if r in (49, 53) else LAPIS_BLUE)
        rect(32 - 7 - w//2, r, 32 + 7 + w//2, r, col)
        px(32 - 7 - w//2, r, GOLD_DARK)
        px(32 + 7 + w//2, r, GOLD_DARK)

    # Egyptian Pleated Linen Dress y=56..88
    for y in range(56, 88):
        spread = int((y - 56) * 0.3)
        rect(22 - spread, y, 42 + spread, y, WHITE_DRESS)
        # Pleat folds
        for fx in range(22 - spread, 43 + spread):
            if fx % 3 == 0:
                px(fx, y, WHITE_SHADOW)
        # Silhouette outlines
        px(21 - spread, y, GOLD_DARK if y < 65 else WHITE_SHADOW)
        px(43 + spread, y, GOLD_DARK if y < 65 else WHITE_SHADOW)

    # Gold waistband / belt & beaded front sash
    rect(21, 62, 43, 65, GOLD_MID)
    rect(22, 63, 42, 64, GOLD_BRIGHT)
    rect(29, 65, 35, 82, GOLD_MID) # hanging sash
    for sy in range(66, 82):
        scol = TURQUOISE if sy % 3 == 0 else (RED_LIP if sy % 3 == 1 else LAPIS_BLUE)
        px(31, sy, scol)
        px(33, sy, scol)

    # Arms and bracelets
    # Left arm
    rect(16, 52, 20, 72, SKIN_MID)
    rect(17, 53, 19, 70, SKIN_LIGHT)
    rect(16, 56, 20, 58, GOLD_BRIGHT) # upper arm bracelet
    rect(16, 68, 20, 70, GOLD_BRIGHT) # wrist bracelet
    # Right arm holding golden ankh/scepter
    rect(44, 52, 48, 70, SKIN_MID)
    rect(45, 53, 47, 69, SKIN_LIGHT)
    rect(44, 56, 48, 58, GOLD_BRIGHT)
    rect(44, 66, 48, 68, GOLD_BRIGHT)
    # Golden Scepter in right hand
    rect(47, 50, 49, 82, GOLD_MID)
    rect(46, 48, 50, 50, GOLD_BRIGHT)
    px(48, 47, TURQUOISE)

    # Bare feet with gold sandals
    rect(24, 88, 30, 91, SKIN_LIGHT)
    rect(34, 88, 40, 91, SKIN_LIGHT)
    rect(23, 91, 31, 92, GOLD_MID)
    rect(33, 91, 41, 92, GOLD_MID)

    dst = 'public/images/ancient/cleopatra-queen.png'
    img.save(dst, 'PNG', optimize=True)
    print(f"Updated {dst}: size={img.size}, file size={os.path.getsize(dst)}")

def create_pyramid():
    # High-quality pixel art Giza Pyramids 192x192
    W, H = 192, 192
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Colors
    SAND_SUN_LIGHT = (245, 215, 145, 255)
    SAND_SUN_MID   = (230, 190, 115, 255)
    STONE_LIT_HIGH = (255, 235, 175, 255)
    STONE_LIT_MID  = (238, 205, 135, 255)
    STONE_LIT_SHAD = (210, 175, 110, 255)
    STONE_DARK_MID = (165, 125, 75, 255)
    STONE_DARK_DEEP= (125, 90, 55, 255)
    STONE_DARK_EDGE= (90, 60, 35, 255)
    GROUND_SHADOW  = (180, 140, 85, 255)
    SKY_HAZE       = (255, 245, 210, 255)
    CAPSTONE_GOLD  = (255, 220, 60, 255)

    # 1. Distant small pyramid (Khafre or Menkaure in background left)
    # Peak at (45, 95), base from 15 to 75, y=145
    p1_peak_x, p1_peak_y = 48, 95
    p1_base_y = 145
    for y in range(p1_peak_y, p1_base_y):
        dy = y - p1_peak_y
        h = p1_base_y - p1_peak_y
        w_lit = int(dy * 0.7)
        w_shd = int(dy * 0.5)
        # Lit side (facing left)
        draw.line([(p1_peak_x - w_lit, y), (p1_peak_x, y)], fill=STONE_LIT_SHAD)
        # Shadow side (facing right)
        draw.line([(p1_peak_x, y), (p1_peak_x + w_shd, y)], fill=STONE_DARK_DEEP)

    # 2. Main Great Pyramid of Giza (Khufu)
    # Peak at (115, 45), base y=168
    peak_x, peak_y = 118, 42
    base_y = 168

    # Golden capstone / peak
    draw.polygon([(peak_x, peak_y), (peak_x - 6, peak_y + 8), (peak_x, peak_y + 8)], fill=CAPSTONE_GOLD)
    draw.polygon([(peak_x, peak_y), (peak_x + 7, peak_y + 8), (peak_x, peak_y + 8)], fill=STONE_DARK_MID)

    for y in range(peak_y + 8, base_y):
        dy = y - peak_y
        # Left side lit by morning sun
        w_left = int(dy * 0.78)
        # Right side in deep desert shadow
        w_right = int(dy * 0.62)

        x_left = peak_x - w_left
        x_right = peak_x + w_right

        # Draw lit face (textured horizontal block courses)
        course_band = (y // 3) % 3
        if course_band == 0:
            row_col = STONE_LIT_HIGH
        elif course_band == 1:
            row_col = STONE_LIT_MID
        else:
            row_col = STONE_LIT_SHAD
        
        draw.line([(x_left, y), (peak_x, y)], fill=row_col)
        # Add block joint noise
        for bx in range(x_left + 2, peak_x, 7):
            if (bx + y * 3) % 11 == 0:
                draw.point((bx, y), fill=STONE_LIT_SHAD)

        # Draw shadow face
        shd_band = (y // 3) % 2
        shd_col = STONE_DARK_MID if shd_band == 0 else STONE_DARK_DEEP
        draw.line([(peak_x, y), (x_right, y)], fill=shd_col)
        # Block texture on shadow face
        for bx in range(peak_x, x_right, 6):
            if (bx + y * 2) % 9 == 0:
                draw.point((bx, y), fill=STONE_DARK_EDGE)

        # Ridge line down the center
        draw.point((peak_x, y), fill=STONE_LIT_HIGH)

    # 3. Base sand dunes and mounds
    dune_points = [
        (10, 155), (35, 148), (60, 152), (85, 145), (110, 158),
        (135, 162), (160, 160), (185, 165), (192, 170),
        (192, 185), (0, 185), (0, 155)
    ]
    # Smooth ground base
    for gy in range(155, 188):
        for gx in range(8, 185):
            # Sun lit dunes with ripple lines
            ripple = (gx + gy * 2) % 6
            if gy > 175:
                col = SAND_SUN_MID if ripple < 4 else GROUND_SHADOW
            else:
                col = SAND_SUN_LIGHT if ripple < 4 else SAND_SUN_MID
            if img.getpixel((gx, gy))[3] == 0 or gy >= base_y - 8:
                draw.point((gx, gy), fill=col)

    # Bottom border outline cleanup (ensure strict binary alpha)
    datas = img.getdata()
    new_data = []
    for item in datas:
        if item[3] > 64:
            new_data.append((item[0], item[1], item[2], 255))
        else:
            new_data.append((0, 0, 0, 0))
    img.putdata(new_data)

    dst = 'public/images/ancient/pyramid-giza.png'
    img.save(dst, 'PNG', optimize=True)
    print(f"Updated {dst}: size={img.size}, file size={os.path.getsize(dst)}")

if __name__ == '__main__':
    create_suleyman()
    create_cleopatra()
    create_pyramid()
