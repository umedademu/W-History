import os
import sys
from PIL import Image, ImageEnhance, ImageOps
import numpy as np

BASE_DIR = r"c:\Users\USER\Desktop\W-History"
OUT_DIR = os.path.join(BASE_DIR, "public", "images", "ancient")
IMG_ROOT = os.path.join(BASE_DIR, "public", "images")
os.makedirs(OUT_DIR, exist_ok=True)

def load_source(name):
    # Try finding in ancient first, then other dirs
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
    print(f"Warning: source image not found: {name}")
    return None

def process_character(base_name, target_name, color_theme, accessories=[], flip=False, scale_factor=1.0, width=128, height=192):
    src = load_source(base_name)
    if not src:
        # Fallback to a reliable image
        src = load_source("caesar-general")
        
    w, h = src.size
    arr = np.array(src).astype(float)
    
    # Optional horizontal flip for variation
    if flip:
        arr = np.fliplr(arr)
        
    alpha = arr[:, :, 3]
    
    # Recolor clothing/gear while preserving skin tones
    for y in range(h):
        for x in range(w):
            if alpha[y, x] < 15:
                continue
            r, g, b = arr[y, x, :3]
            bright = (r + g + b) / 3.0
            
            # Skin tone detector
            is_skin = (r > 130 and g > 80 and b > 50 and r >= g and g >= b and (r - b) > 25 and bright > 80)
            if is_skin:
                continue
                
            # Apply color themes
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
                arr[y, x, 0] = v
                arr[y, x, 1] = v
                arr[y, x, 2] = np.clip(v + 10, 0, 255)
            elif color_theme == 'knight_silver':
                v = np.clip(bright * 0.85 + 30, 0, 255)
                arr[y, x, 0] = v
                arr[y, x, 1] = v
                arr[y, x, 2] = np.clip(v + 12, 0, 255)
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
                
    # Add pixel-art accessories
    for acc in accessories:
        if acc == 'crown_gold':
            top_y = 10
            cx = w // 2
            for y in range(top_y, top_y + 8):
                for x in range(cx - 15, cx + 16):
                    if y == top_y and (x - (cx - 15)) % 6 in [0, 1, 5]:
                        arr[y, x] = [255, 225, 20, 255]
                    elif top_y + 2 <= y <= top_y + 6:
                        arr[y, x] = [240, 195, 10, 255]
                    elif y == top_y + 7:
                        arr[y, x] = [60, 45, 10, 255]
        elif acc == 'papal_tiara':
            top_y = 2
            cx = w // 2
            for y in range(top_y, top_y + 18):
                rw = 5 + int((y - top_y) * 0.6)
                for x in range(cx - rw, cx + rw + 1):
                    if y in [top_y + 4, top_y + 10, top_y + 16]:
                        arr[y, x] = [255, 215, 0, 255]
                    elif x in [cx - rw, cx + rw]:
                        arr[y, x] = [50, 40, 30, 255]
                    else:
                        arr[y, x] = [250, 250, 255, 255]
        elif acc == 'cross_red_chest':
            cx, cy = w // 2, 95
            arr[cy-14:cy+16, cx-3:cx+4] = [220, 20, 20, 255]
            arr[cy-3:cy+4, cx-14:cx+15] = [220, 20, 20, 255]
        elif acc == 'fleur_banner':
            for y in range(25, 135):
                arr[y, 18:21] = [170, 130, 70, 255] # Pole
            for y in range(28, 68):
                for x in range(21, 55):
                    arr[y, x] = [25, 65, 190, 255] # Blue flag
            arr[40:54, 32:42] = [255, 220, 30, 255] # Gold lily
        elif acc == 'black_armor':
            # Darken all metal armor
            arr[:, :, 0] *= 0.4
            arr[:, :, 1] *= 0.4
            arr[:, :, 2] *= 0.45
        elif acc == 'reformer_bible':
            # Thick leather bible with gold cross
            bx, by = w // 2 - 25, 110
            for y in range(by, by + 22):
                for x in range(bx, bx + 18):
                    arr[y, x] = [120, 60, 20, 255] # Brown leather
            arr[by+4:by+18, bx+7:bx+10] = [255, 220, 0, 255]
            arr[by+8:by+11, bx+3:bx+14] = [255, 220, 0, 255]
        elif acc == 'sovereign_orb':
            ox, oy = w // 2 + 25, 115
            for y in range(oy - 6, oy + 7):
                for x in range(ox - 6, ox + 7):
                    if (x-ox)**2 + (y-oy)**2 <= 36:
                        arr[y, x] = [255, 215, 20, 255]
            arr[oy-11:oy-6, ox-1:ox+2] = [255, 255, 0, 255]
            arr[oy-9:oy-7, ox-3:ox+4] = [255, 255, 0, 255]
        elif acc == 'viking_axe':
            ax, ay = w // 2 - 28, 70
            for y in range(ay, ay + 65):
                arr[y, ax:ax+3] = [160, 110, 60, 255] # Handle
            for y in range(ay, ay + 20):
                for x in range(ax - 12, ax + 2):
                    arr[y, x] = [200, 210, 220, 255] # Steel blade
        elif acc == 'longbow':
            lx, ly = w // 2 - 26, 40
            for y in range(ly, ly + 95):
                curve = int(abs(y - (ly + 47)) * 0.12)
                arr[y, lx + curve : lx + curve + 3] = [140, 90, 40, 255]
                arr[y, lx + 12] = [240, 240, 240, 255] # Bowstring
        elif acc == 'farmer_scythe':
            fx, fy = w // 2 + 24, 50
            for y in range(fy, fy + 80):
                arr[y, fx:fx+3] = [150, 100, 50, 255] # Pole
            for x in range(fx - 20, fx + 5):
                arr[fy:fy+4, x] = [210, 220, 230, 255] # Curved blade

    # Resize to target canvas size
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
        py = height - nh - 8 # Align bottom
        final_canvas.paste(resized, (px, py), resized)
    else:
        final_canvas = out_img.resize((width, height), Image.Resampling.NEAREST)
        
    out_path = os.path.join(OUT_DIR, f"{target_name}.png")
    final_canvas.save(out_path, "PNG")
    print(f"Generated character: {target_name}.png")

def process_building(base_name, target_name, theme, width=192, height=192):
    src = load_source(base_name)
    if not src:
        src = load_source("colosseum")
        
    w, h = src.size
    arr = np.array(src).astype(float)
    alpha = arr[:, :, 3]
    
    for y in range(h):
        for x in range(w):
            if alpha[y, x] < 15:
                continue
            r, g, b = arr[y, x, :3]
            bright = (r + g + b) / 3.0
            
            if theme == 'gothic_cathedral':
                # Deep grey stone with stained glass hints
                arr[y, x, 0] = np.clip(bright * 0.65 + 15, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.70 + 20, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.80 + 35, 0, 255)
            elif theme == 'romanesque_sandstone':
                # Warm reddish/ochre sandstone
                arr[y, x, 0] = np.clip(bright * 0.85 + 30, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.65 + 15, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.50 + 10, 0, 255)
            elif theme == 'byzantine_dome':
                # Terracotta brick and gold mosaic dome
                arr[y, x, 0] = np.clip(bright * 0.85 + 25, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.70 + 15, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.55 + 5, 0, 255)
            elif theme == 'white_marble':
                # Pisa-style white and dark green banded marble
                v = np.clip(bright * 0.90 + 40, 0, 255)
                arr[y, x, 0] = v
                arr[y, x, 1] = v
                arr[y, x, 2] = np.clip(v + 10, 0, 255)
            elif theme == 'university_brick':
                # Red brick and grey roof college
                arr[y, x, 0] = np.clip(bright * 0.80 + 25, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.50 + 10, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.40 + 10, 0, 255)
            elif theme == 'mountain_abbey':
                # High mountain fortress abbey
                arr[y, x, 0] = np.clip(bright * 0.65 + 20, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.65 + 20, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.65 + 25, 0, 255)
                
    out_img = Image.fromarray(arr.astype(np.uint8))
    bbox = out_img.getbbox()
    if bbox:
        cropped = out_img.crop(bbox)
        cw, ch = cropped.size
        scale = min((width * 0.92) / cw, (height * 0.92) / ch)
        nw = max(1, int(round(cw * scale)))
        nh = max(1, int(round(ch * scale)))
        resized = cropped.resize((nw, nh), Image.Resampling.NEAREST)
        final_canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        px = (width - nw) // 2
        py = (height - nh) // 2
        final_canvas.paste(resized, (px, py), resized)
    else:
        final_canvas = out_img.resize((width, height), Image.Resampling.NEAREST)
        
    out_path = os.path.join(OUT_DIR, f"{target_name}.png")
    final_canvas.save(out_path, "PNG")
    print(f"Generated building: {target_name}.png")

# Generate all Medieval characters
characters = [
    # Franks & Germans
    ("caesar-general", "clovis-king", "french_blue", ["crown_gold"]),
    ("alexander-conqueror", "theodoric-great", "imperial_gold", ["crown_gold"]),
    ("aryan-warrior", "alaric-visigoth", "viking_fur", ["viking_axe"]),
    ("nomadic-rider", "attila-hun", "viking_fur", ["viking_axe"], True),
    ("assyria-soldier", "odoacer-general", "knight_silver", []),
    ("alexander-happy", "romulus-augustulus", "byzantine_purple", ["crown_gold"]),
    ("hittite-warrior", "charles-martel", "french_blue", ["viking_axe"]),
    ("augustus-princeps", "pepin-king", "french_blue", ["crown_gold"]),
    ("solomon-king", "charlemagne-emperor", "imperial_gold", ["crown_gold", "sovereign_orb"]),
    ("christian-apostle", "leo3-pope", "papal_white", ["papal_tiara"]),
    ("archimedes-scientist", "alcuin-scholar", "monk_brown", ["reformer_bible"]),
    ("ancient-scribe", "einhard-scholar", "monk_brown", []),
    ("cato-elder", "louis-pious", "imperial_gold", ["crown_gold"]),
    ("king-tang-shang", "lothair1-emperor", "imperial_gold", ["crown_gold"]),
    ("king-wu-zhou", "louis-german", "slavic_green", ["crown_gold"]),
    ("king-zhou-shang", "charles-bald", "french_blue", ["crown_gold"]),
    ("duke-huan-qi", "hugh-capet", "french_blue", ["crown_gold"]),
    ("shihuangdi-emperor", "otto1-emperor", "imperial_gold", ["crown_gold", "sovereign_orb"]),
    ("christian-apostle", "john12-pope", "crimson_cardinal", ["papal_tiara"]),
    ("duke-wen-jin", "henry1-king", "slavic_green", ["crown_gold"]),
    ("king-zhuang-chu", "conrad1-king", "slavic_green", ["crown_gold"]),
    ("duke-xiao-qin", "charles-simple", "french_blue", ["crown_gold"]),
    
    # Normans, English & Vikings
    ("aryan-warrior", "rollo-norman", "viking_fur", ["viking_axe"]),
    ("assyria-cavalry", "rurik-viking", "viking_fur", ["viking_axe"], True),
    ("persian-immortal", "oleg-prince", "slavic_green", ["crown_gold"]),
    ("solomon-king", "vladimir1-saint", "byzantine_purple", ["crown_gold", "reformer_bible"]),
    ("confucius-philosopher", "alfred-great", "english_red", ["crown_gold", "reformer_bible"]),
    ("king-helu-wu", "cnu-viking", "viking_fur", ["crown_gold"]),
    ("cato-elder", "edward-confessor", "english_red", ["crown_gold"]),
    ("greek-hoplite", "harold-godwinson", "english_red", ["crown_gold"]),
    ("alexander-conqueror", "william-conqueror", "knight_silver", ["crown_gold"]),
    ("assyria-soldier", "robert-guiscard", "knight_silver", []),
    ("persian-immortal", "roger1-norman", "knight_silver", []),
    ("darius-king", "roger2-sicily", "imperial_gold", ["crown_gold"]),
    ("empress-lu", "margrete-queen", "slavic_green", ["crown_gold"]),
    
    # Byzantines & Eastern Europe
    ("solomon-king", "justinian-emperor", "byzantine_purple", ["crown_gold", "sovereign_orb"]),
    ("szumaqian-historian", "tribonian-jurist", "byzantine_purple", ["reformer_bible"]),
    ("caesar-general", "heraclius-emperor", "byzantine_purple", ["crown_gold"]),
    ("augustus-princeps", "leo3-isaurian", "byzantine_purple", ["crown_gold"]),
    ("king-wu-zhou", "basil1-emperor", "byzantine_purple", ["crown_gold"]),
    ("alexander-march", "basil2-bulgaroktonos", "imperial_gold", ["crown_gold"]),
    ("darius-king", "alexios1-komnenos", "byzantine_purple", ["crown_gold"]),
    ("christian-apostle", "cyril-apostle", "monk_brown", ["reformer_bible"]),
    ("buddhist-monk", "methodius-apostle", "monk_brown", ["reformer_bible"], True),
    ("king-tang-shang", "casimir3-great", "english_red", ["crown_gold"]),
    ("duke-huan-qi", "jagiello-king", "english_red", ["crown_gold"]),
    ("shihuangdi-emperor", "charles4-emperor", "imperial_gold", ["crown_gold"]),
    ("solomon-king", "sigismund-emperor", "imperial_gold", ["crown_gold"]),
    ("daoan-monk", "jan-hus-reformer", "peasant_cloth", ["reformer_bible"]),
    ("augustus-princeps", "stephen1-hungary", "english_red", ["crown_gold"]),
    ("nomadic-rider", "batu-khan", "viking_fur", ["viking_axe"]),
    ("alexander-conqueror", "matthias-corvinus", "dominican_black", ["crown_gold"]),
    ("alexander-happy", "louis2-hungary", "english_red", ["crown_gold"]),
    ("king-wu-zhou", "stefan-nemanja", "slavic_green", ["crown_gold"]),
    ("king-tang-shang", "stefan-dusan", "slavic_green", ["crown_gold"]),
    ("solomon-king", "boris1-bulgaria", "byzantine_purple", ["crown_gold"]),
    ("duke-wen-jin", "simeon1-bulgaria", "byzantine_purple", ["crown_gold"]),
    ("duke-huan-qi", "asen1-bulgaria", "byzantine_purple", ["crown_gold"]),
    
    # Church, Monasticism & Investiture
    ("high-priest", "benedict-saint", "dominican_black", ["reformer_bible"]),
    ("christian-apostle", "gregory1-pope", "papal_white", ["papal_tiara", "reformer_bible"]),
    ("high-priest", "gregory7-pope", "crimson_cardinal", ["papal_tiara"]),
    ("cato-elder", "henry4-emperor", "peasant_cloth", []),
    ("christian-apostle", "callixtus2-pope", "papal_white", ["papal_tiara"]),
    ("caesar-general", "henry5-emperor", "imperial_gold", ["crown_gold"]),
    ("solomon-king", "innocent3-pope", "imperial_gold", ["papal_tiara", "sovereign_orb"]),
    ("buddhist-monk", "francis-assisi", "monk_brown", []),
    ("daoan-monk", "dominic-saint", "dominican_black", ["reformer_bible"]),
    ("high-priest", "boniface8-pope", "crimson_cardinal", ["papal_tiara"]),
    ("christian-apostle", "clement5-pope", "french_blue", ["papal_tiara"]),
    
    # Crusades
    ("high-priest", "urban2-pope", "papal_white", ["papal_tiara"]),
    ("ibn-sina", "saladin-sultan", "imperial_gold", ["crown_gold"]),
    ("alexander-conqueror", "richard-lionheart", "english_red", ["crown_gold", "cross_red_chest"]),
    ("augustus-princeps", "philip2-augustus", "french_blue", ["crown_gold"]),
    ("solomon-king", "frederick1-barbarossa", "english_red", ["crown_gold"]),
    ("cato-elder", "enrico-dandolo", "crimson_cardinal", ["crown_gold"]),
    ("caesar-general", "frederick2-wonder", "imperial_gold", ["crown_gold"]),
    ("solomon-king", "louis9-saint", "french_blue", ["crown_gold", "reformer_bible"]),
    ("buddhist-monk", "rubruck-friar", "monk_brown", ["reformer_bible"]),
    
    # Cities, Thinkers & Rebels
    ("aramean-merchant", "fugger-merchant", "imperial_gold", ["crown_gold"]),
    ("lydia-merchant", "etienne-marcel", "french_blue", []),
    ("chensheng-rebel", "guillaume-cale", "peasant_cloth", ["farmer_scythe"]),
    ("wuguang-rebel", "wat-tyler", "peasant_cloth", ["viking_axe"]),
    ("high-priest", "john-ball", "peasant_cloth", ["reformer_bible"]),
    ("caesar-general", "philip4-fair", "french_blue", ["crown_gold"]),
    ("archimedes-scientist", "john-wycliffe", "monk_brown", ["reformer_bible"]),
    ("confucius-philosopher", "anselm-father", "monk_brown", ["reformer_bible"]),
    ("aristotle-philosopher", "abelard-philosopher", "monk_brown", []),
    ("dongzhongshu-scholar", "thomas-aquinas", "dominican_black", ["reformer_bible"]),
    ("ancient-scribe", "duns-scotus", "monk_brown", ["reformer_bible"]),
    ("cato-elder", "william-ockham", "monk_brown", ["reformer_bible"]),
    ("archimedes-scientist", "roger-bacon", "monk_brown", []),
    ("lydia-merchant", "jacques-coeur", "french_blue", []),
    
    # Hundred Years' War, Tudor & Reconquista
    ("cato-elder", "king-john-lackland", "english_red", ["crown_gold"]),
    ("caesar-general", "henry2-plantagenet", "english_red", ["crown_gold"]),
    ("augustus-princeps", "henry3-king", "english_red", ["crown_gold"]),
    ("alexander-conqueror", "simon-monfort", "knight_silver", ["cross_red_chest"]),
    ("solomon-king", "edward1-longshanks", "english_red", ["crown_gold"]),
    ("caesar-general", "philip6-valois", "french_blue", ["crown_gold"]),
    ("alexander-conqueror", "edward3-king", "english_red", ["crown_gold"]),
    ("persian-immortal", "black-prince", "dominican_black", ["black_armor"]),
    ("augustus-princeps", "john2-good", "french_blue", ["crown_gold"]),
    ("alexander-conqueror", "henry5-king", "english_red", ["crown_gold"]),
    ("alexander-march", "joan-of-arc", "knight_silver", ["fleur_banner"]),
    ("augustus-princeps", "charles7-victorious", "french_blue", ["crown_gold"]),
    ("cato-elder", "louis11-spider", "dominican_black", ["crown_gold"]),
    ("alexander-happy", "charles8-king", "french_blue", ["crown_gold"]),
    ("cato-elder", "henry6-king", "english_red", ["crown_gold"]),
    ("alexander-conqueror", "edward4-york", "papal_white", ["crown_gold"]),
    ("caesar-general", "henry7-tudor", "english_red", ["crown_gold"]),
    ("solomon-king", "henry8-king", "english_red", ["crown_gold"]),
    ("augustus-princeps", "rudolf1-habsburg", "imperial_gold", ["crown_gold"]),
    ("caesar-general", "charles-anjou", "french_blue", ["crown_gold"]),
    ("caesar-general", "joao1-avis", "slavic_green", ["crown_gold"]),
    ("archimedes-scientist", "henry-navigator", "slavic_green", []),
    ("caesar-general", "ferdinand2-aragon", "imperial_gold", ["crown_gold"]),
    ("empress-lu", "isabella-castile", "imperial_gold", ["crown_gold"]),
    ("aramean-merchant", "columbus-explorer", "french_blue", []),
    
    # Soldiers & Combatants for Animations
    ("aryan-warrior", "german-warrior", "viking_fur", ["viking_axe"]),
    ("nomadic-rider", "hun-rider", "viking_fur", ["viking_axe"]),
    ("assyria-soldier", "frank-infantry", "french_blue", ["viking_axe"]),
    ("hittite-warrior", "norman-knight", "knight_silver", []),
    ("greek-hoplite", "crusader-knight", "english_red", ["cross_red_chest"]),
    ("persian-immortal", "saracen-warrior", "imperial_gold", []),
    ("assyria-cavalry", "english-longbowman", "slavic_green", ["longbow"]),
    ("alexander-conqueror", "french-knight", "french_blue", ["fleur_banner"]),
    ("chensheng-rebel", "peasant-rebel", "peasant_cloth", ["farmer_scythe"]),
]

# Generate all Medieval Buildings
buildings = [
    ("colosseum", "notre-dame-paris", "gothic_cathedral"),
    ("colosseum", "chartres-cathedral", "gothic_cathedral"),
    ("colosseum", "cologne-cathedral", "gothic_cathedral"),
    ("appian-way", "pisa-cathedral", "white_marble"),
    ("colosseum", "worms-cathedral", "romanesque_sandstone"),
    ("colosseum", "st-peters-basilica", "white_marble"),
    ("colosseum", "hagia-sophia", "byzantine_dome"),
    ("yungang-grottoes", "monte-cassino", "mountain_abbey"),
    ("colosseum", "cluny-abbey", "romanesque_sandstone"),
    ("colosseum", "citeaux-abbey", "mountain_abbey"),
    ("colosseum", "saint-denis", "gothic_cathedral"),
    ("colosseum", "canterbury-cathedral", "gothic_cathedral"),
    ("appian-way", "sorbonne-paris", "university_brick"),
    ("appian-way", "bologna-university", "university_brick"),
    ("appian-way", "salerno-university", "white_marble"),
    ("appian-way", "oxford-university", "gothic_cathedral"),
    ("appian-way", "cambridge-university", "gothic_cathedral"),
    ("appian-way", "prague-university", "university_brick"),
    ("appian-way", "krakow-university", "university_brick"),
    ("pyramid-giza", "pyramid-giza", "romanesque_sandstone"),
]

for ch in characters:
    flip = ch[4] if len(ch) > 4 else False
    process_character(ch[0], ch[1], ch[2], ch[3], flip=flip)

for bld in buildings:
    process_building(bld[0], bld[1], bld[2])

print(f"Total characters generated: {len(characters)}")
print(f"Total buildings generated: {len(buildings)}")
