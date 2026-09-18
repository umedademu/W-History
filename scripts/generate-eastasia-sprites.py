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
    print(f"Warning: source image not found: {name}")
    return None

def process_sprite(base_name, target_name, color_theme, accessories=[], flip=False):
    src = load_source(base_name)
    if not src:
        src = load_source("chinese-official")
    if not src:
        src = load_source("caesar-general")
        
    w, h = src.size
    arr = np.array(src).astype(float)
    
    if flip:
        arr = np.fliplr(arr)
        
    alpha = arr[:, :, 3]
    
    # Recolor clothing/gear while preserving skin tones
    for y in range(h):
        for x in range(w):
            if alpha[y, x] < 20:
                arr[y, x, 3] = 0 # Ensure 100% clean alpha
                continue
            r, g, b = arr[y, x, :3]
            bright = (r + g + b) / 3.0
            
            # Skin tone detector
            is_skin = (r > 130 and g > 80 and b > 50 and r >= g and g >= b and (r - b) > 20 and bright > 75)
            if is_skin:
                continue
                
            # Themes
            if color_theme == 'imperial_yellow':
                arr[y, x, 0] = np.clip(bright * 1.05 + 30, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.85 + 15, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.15, 0, 255)
            elif color_theme == 'song_red':
                arr[y, x, 0] = np.clip(bright * 1.05 + 35, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.20, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.20, 0, 255)
            elif color_theme == 'scholar_green':
                arr[y, x, 0] = np.clip(bright * 0.20, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.80 + 25, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.40, 0, 255)
            elif color_theme == 'royal_purple':
                arr[y, x, 0] = np.clip(bright * 0.70 + 25, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.15, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.85 + 30, 0, 255)
            elif color_theme == 'scholar_white':
                v = np.clip(bright * 0.85 + 50, 0, 255)
                arr[y, x, 0] = v; arr[y, x, 1] = v; arr[y, x, 2] = np.clip(v + 10, 0, 255)
            elif color_theme == 'nomad_fur':
                arr[y, x, 0] = np.clip(bright * 0.80 + 20, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.55 + 10, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.30, 0, 255)
            elif color_theme == 'jurchen_iron':
                v = np.clip(bright * 0.55 + 20, 0, 255)
                arr[y, x, 0] = v; arr[y, x, 1] = v; arr[y, x, 2] = np.clip(v + 15, 0, 255)
            elif color_theme == 'general_gold':
                arr[y, x, 0] = np.clip(bright * 1.05 + 40, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.75 + 15, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.20, 0, 255)
            elif color_theme == 'qing_blue':
                arr[y, x, 0] = np.clip(bright * 0.15, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.40 + 10, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.85 + 35, 0, 255)
            elif color_theme == 'tibetan_saffron':
                arr[y, x, 0] = np.clip(bright * 1.00 + 40, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.60 + 10, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.10, 0, 255)
            elif color_theme == 'ming_navy':
                arr[y, x, 0] = np.clip(bright * 0.20, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.30 + 15, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.75 + 30, 0, 255)
            elif color_theme == 'southeast_gold':
                arr[y, x, 0] = np.clip(bright * 1.05 + 35, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.80 + 15, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.15, 0, 255)
            elif color_theme == 'viet_vermilion':
                arr[y, x, 0] = np.clip(bright * 1.00 + 30, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.25, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.15, 0, 255)
            elif color_theme == 'rebel_red':
                arr[y, x, 0] = np.clip(bright * 1.05 + 45, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.15, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.15, 0, 255)
            elif color_theme == 'jesuit_black':
                arr[y, x, 0] = np.clip(bright * 0.25 + 5, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.25 + 5, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.30 + 10, 0, 255)
            elif color_theme == 'samurai_lacquer':
                arr[y, x, 0] = np.clip(bright * 0.35 + 20, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.20, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.20, 0, 255)
            elif color_theme == 'korean_royal':
                arr[y, x, 0] = np.clip(bright * 0.95 + 30, 0, 255)
                arr[y, x, 1] = np.clip(bright * 0.20, 0, 255)
                arr[y, x, 2] = np.clip(bright * 0.30, 0, 255)
                
    # Add accessories
    for acc in accessories:
        if acc == 'song_wings':
            # Song official / emperor black horizontal wings on hat
            head_y = int(h * 0.15)
            head_x = int(w * 0.5)
            wing_len = int(w * 0.38)
            thick = max(2, int(h * 0.025))
            c_wing = [30, 30, 35, 255]
            # Left wing
            arr[head_y:head_y+thick, max(0, head_x - wing_len):head_x - int(w*0.12)] = c_wing
            # Right wing
            arr[head_y:head_y+thick, head_x + int(w*0.12):min(w, head_x + wing_len)] = c_wing
        elif acc == 'dongpo_hat':
            # Tall scholar hat (Dongpo jin)
            top_y = int(h * 0.04)
            bot_y = int(h * 0.16)
            mid_x = int(w * 0.5)
            c_hat = [40, 45, 50, 255]
            arr[top_y:bot_y, mid_x - int(w*0.15):mid_x + int(w*0.15)] = c_hat
        elif acc == 'qing_summer_hat':
            # Conical straw hat with red tassel
            apex_y = int(h * 0.04)
            base_y = int(h * 0.14)
            mid_x = int(w * 0.5)
            c_straw = [220, 205, 150, 255]
            c_tassel = [230, 30, 30, 255]
            for cy in range(apex_y, base_y):
                rw = int((cy - apex_y) * 1.5)
                arr[cy, max(0, mid_x - rw):min(w, mid_x + rw + 1)] = c_straw
            # Red tassel top & flowing down
            arr[apex_y-2:apex_y+4, mid_x-2:mid_x+3] = c_tassel
            arr[apex_y:base_y-2, mid_x-1:mid_x+2] = c_tassel
        elif acc == 'turtle_head':
            # Dragon head for turtle ship
            front_x = int(w * 0.82)
            mid_y = int(h * 0.45)
            c_head = [190, 40, 30, 255]
            arr[mid_y-6:mid_y+6, front_x:min(w, front_x+12)] = c_head
        elif acc == 'spear':
            # Long spear
            sx = int(w * 0.85)
            arr[int(h*0.1):int(h*0.9), sx:sx+3] = [130, 90, 50, 255]
            arr[int(h*0.04):int(h*0.1), sx-1:sx+4] = [230, 230, 240, 255]
        elif acc == 'compass':
            # Maritime compass in hand
            cx = int(w * 0.3)
            cy = int(h * 0.55)
            arr[cy-4:cy+5, cx-4:cx+5] = [240, 210, 50, 255]
            arr[cy-2:cy+3, cx-2:cx+3] = [30, 80, 160, 255]
        elif acc == 'red_turban':
            # Red cloth headband
            ty = int(h * 0.14)
            tx = int(w * 0.5)
            arr[ty:ty+4, tx-int(w*0.18):tx+int(w*0.18)] = [235, 35, 30, 255]
        elif acc == 'tibetan_hat':
            # Pointed yellow hat (Gelug / Yellow Hat)
            mid_x = int(w * 0.5)
            for hy in range(int(h*0.03), int(h*0.15)):
                hw = int((hy - int(h*0.03)) * 0.9)
                arr[hy, mid_x - hw : mid_x + hw + 1] = [245, 215, 30, 255]
        elif acc == 'eyepatch':
            # Dashing king Li Zicheng eyepatch
            ey = int(h * 0.22)
            ex = int(w * 0.56)
            arr[ey-2:ey+3, ex-2:ex+3] = [25, 25, 30, 255]
            arr[ey-3:ey+4, ex-4:ex+5] = [35, 35, 40, 255]

    # Save output with 100% clean transparency
    out_img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    out_path = os.path.join(OUT_DIR, f"{target_name}.png")
    out_img.save(out_path, "PNG")
    print(f"Generated sprite: {target_name}.png")

# Comprehensive sprite list for Chapter 5
SPRITES = [
    # 1. 宋代 (Song & Five Dynasties)
    ("zhu-quanzhong", "zhuhuanchong-warlord", "jurchen_iron", []),
    ("shi-jingtang", "wangmang-usurper", "scholar_green", []),
    ("feng-dao", "chinese-official", "scholar_white", []),
    ("song-taizu", "liubang-emperor", "imperial_yellow", ["song_wings"]),
    ("gongdi-zhou", "xiaojingdi-emperor", "imperial_yellow", []),
    ("song-taizong", "taizong-liximin", "royal_purple", ["song_wings"]),
    ("song-zhenzong", "guangwudi-emperor", "song_red", ["song_wings"]),
    ("song-shenzong", "wudi-emperor", "imperial_yellow", ["song_wings"]),
    ("song-huizong", "xuanzong-emperor", "scholar_white", ["song_wings"]),
    ("song-qinzong", "liubei-warlord", "song_red", ["song_wings"]),
    ("song-gaozong", "sunquan-warlord", "imperial_yellow", ["song_wings"]),
    ("wang-anshi", "zhugeliang-strategist", "scholar_green", []),
    ("sima-guang", "confucius-philosopher", "song_red", []),
    ("su-shi", "laozi-philosopher", "scholar_white", ["dongpo_hat"]),
    ("su-zhe", "mencius-philosopher", "scholar_green", ["dongpo_hat"]),
    ("zeng-gong", "xunzi-philosopher", "scholar_white", []),
    ("yue-fei", "guanyu-general", "general_gold", ["spear"]),
    ("qin-hui", "simayi-strategist", "jesuit_black", []),
    ("zhou-dunyi", "laozi-philosopher", "scholar_white", []),
    ("zhu-xi", "confucius-philosopher", "scholar_white", []),
    ("cheng-hao", "mencius-philosopher", "scholar_green", []),
    ("cheng-yi", "hanfeizi-philosopher", "scholar_white", []),
    ("lu-jiuyuan", "zhuangzi-philosopher", "scholar_white", []),

    # 2. 遼・西夏・金 (Liao, Western Xia, Jin)
    ("yelu-abaoji", "modu-chanyu", "nomad_fur", []),
    ("yelu-deguang", "attila-hun", "jurchen_iron", []),
    ("yelu-dashi", "nomadic-rider", "nomad_fur", []),
    ("liao-shengzong", "modu-chanyu", "royal_purple", []),
    ("li-yuanhao", "shihuangdi-emperor", "jurchen_iron", []),
    ("wanyan-aguda", "theodoric-great", "jurchen_iron", []),
    ("jin-taizong", "theodoric-great", "general_gold", []),
    ("prince-hailing", "caesar-general", "jurchen_iron", []),

    # 3. モンゴル・元 (Mongol Empire & Yuan)
    ("genghis-khan", "attila-hun", "general_gold", []),
    ("ogedei-khan", "modu-chanyu", "nomad_fur", []),
    ("guyuk-khan", "batu-khan", "nomad_fur", []),
    ("mongke-khan", "batu-khan", "jurchen_iron", []),
    ("tolui-noyan", "nomadic-rider", "nomad_fur", []),
    ("kublai-khan", "batu-khan", "imperial_yellow", []),
    ("ariq-boke", "modu-chanyu", "nomad_fur", []),
    ("hulagu-khan", "saladin-sultan", "jurchen_iron", []),
    ("ghazan-khan", "saladin-sultan", "general_gold", []),
    ("qaidu-khan", "modu-chanyu", "nomad_fur", []),
    ("uzbeg-khan", "saladin-sultan", "royal_purple", []),
    ("phagpa-lama", "songtsen-gampo", "tibetan_saffron", ["tibetan_hat"]),
    ("guo-shoujing", "archimedes-scientist", "scholar_green", []),
    ("han-shantong", "chensheng-rebel", "rebel_red", ["red_turban"]),
    ("han-liner", "wuguang-rebel", "rebel_red", ["red_turban"]),

    # 4. 明代 (Ming Dynasty)
    ("hongwu-emperor", "liubang-emperor", "imperial_yellow", []),
    ("zhu-biao", "liubei-warlord", "imperial_yellow", []),
    ("jianwen-emperor", "guangwudi-emperor", "imperial_yellow", []),
    ("yongle-emperor", "shihuangdi-emperor", "general_gold", []),
    ("zhengtong-emperor", "valerian-captive", "song_red", []),
    ("wanli-emperor", "xuanzong-emperor", "imperial_yellow", []),
    ("chongzhen-emperor", "romulus-augustulus", "scholar_white", []),
    ("zhang-juzheng", "shangyang-reformer", "song_red", []),
    ("xu-guangqi", "szumaqian-historian", "scholar_green", []),
    ("wang-yangming", "zhugeliang-strategist", "scholar_white", []),
    ("gu-xiancheng", "confucius-philosopher", "scholar_white", []),
    ("wei-zhongxian", "chinese-official", "royal_purple", []),
    ("zheng-he", "columbus-explorer", "ming_navy", ["compass"]),
    ("wang-zhi", "caesar-general", "jesuit_black", []),
    ("li-zicheng", "xiangyu-overlord", "rebel_red", ["eyepatch"]),
    ("wu-sangui", "caocao-warlord", "jurchen_iron", []),
    ("zheng-chenggong", "sunquan-warlord", "ming_navy", []),
    ("deng-maoqi", "chensheng-rebel", "nomad_fur", ["spear"]),
    ("yang-yinglong", "xiangyu-overlord", "jurchen_iron", []),

    # 5. 清代 (Qing Dynasty)
    ("nurhaci-emperor", "theodoric-great", "general_gold", []),
    ("hong-taiji", "otto1-emperor", "imperial_yellow", ["qing_summer_hat"]),
    ("shunzhi-emperor", "guangwudi-emperor", "imperial_yellow", ["qing_summer_hat"]),
    ("kangxi-emperor", "charlemagne-emperor", "qing_blue", ["qing_summer_hat"]),
    ("yongzheng-emperor", "taizong-liximin", "imperial_yellow", ["qing_summer_hat"]),
    ("qianlong-emperor", "augustus-princeps", "general_gold", ["qing_summer_hat"]),
    ("jiaqing-emperor", "xuanzong-emperor", "qing_blue", ["qing_summer_hat"]),
    ("galdan-khan", "attila-hun", "nomad_fur", []),
    ("dalai-lama", "buddha-calm", "tibetan_saffron", ["tibetan_hat"]),

    # 6. 東南アジア・朝鮮・日本 (Southeast Asia, Korea, Japan)
    ("wang-geon", "dazuorong-bohai", "korean_royal", []),
    ("yi-sun-sin", "miltiades-general", "ming_navy", []),
    ("ly-thai-to", "king-goujian-yue", "viet_vermilion", []),
    ("le-loi", "king-helu-wu", "viet_vermilion", []),
    ("nguyen-phuc-anh", "sunquan-warlord", "imperial_yellow", []),
    ("pigneaux-bishop", "benedict-saint", "scholar_white", []),
    ("suryavarman2", "tamil-king", "southeast_gold", []),
    ("ram-khamhaeng", "chandragupta-king", "southeast_gold", []),
    ("rama1-king", "harsha-king", "southeast_gold", []),
    ("alaungpaya-king", "tamil-king", "viet_vermilion", []),
    ("raden-wijaya", "chandragupta-king", "southeast_gold", []),
    ("yamada-nagamasa", "spartan-warrior", "samurai_lacquer", []),
    ("sho-hashi", "shotoku-taishi", "royal_purple", []),
    ("hojo-tokimune", "shotoku-taishi", "samurai_lacquer", []),
    ("ashikaga-yoshimitsu", "shotoku-taishi", "general_gold", []),
    ("toyotomi-hideyoshi", "caocao-warlord", "general_gold", []),
    ("tokugawa-ieyasu", "otto1-emperor", "samurai_lacquer", []),
    ("albuquerque-conqueror", "columbus-explorer", "jurchen_iron", []),
    ("yijing-monk", "xuanzang-monk", "tibetan_saffron", []),

    # 7. 西洋からの使節・学者・哲学者 (Western Envoys, Missionaries, Philosophers)
    ("plano-carpini", "rubruck-friar", "nomad_fur", []),
    ("marco-polo", "columbus-explorer", "song_red", []),
    ("ibn-battuta", "saladin-sultan", "scholar_white", []),
    ("montecorvino-bishop", "anselm-father", "scholar_white", []),
    ("rashid-al-din", "szumaqian-historian", "scholar_green", []),
    ("matteo-ricci", "confucius-philosopher", "jesuit_black", []),
    ("adam-schall", "alcuin-scholar", "qing_blue", []),
    ("ferdinand-verbiest", "roger-bacon", "qing_blue", []),
    ("joachim-bouvet", "einhard-scholar", "royal_purple", []),
    ("jean-regis", "eratosthenes-geographer", "scholar_green", []),
    ("giuseppe-castiglione", "phidias-sculptor", "scholar_white", []),
    ("innocent4-pope", "innocent3-pope", "scholar_white", []),
    ("clement11-pope", "boniface8-pope", "scholar_white", []),
    ("peter-great", "frederick1-barbarossa", "ming_navy", []),
    ("louis14-sun-king", "charles-bald", "royal_purple", []),
    ("voltaire-philosopher", "plato-philosopher", "scholar_white", []),
    ("montesquieu-philosopher", "aristotle-philosopher", "song_red", []),

    # 8. 兵士・アクター (Soldiers, Ships & Actors for Battles)
    ("song-infantry", "chinese-soldier", "song_red", []),
    ("jin-iron-cavalry", "german-warrior", "jurchen_iron", []),
    ("mongol-horse-archer", "nomadic-rider", "nomad_fur", []),
    ("ming-musketeer", "chinese-soldier", "rebel_red", []),
    ("qing-banner-soldier", "chinese-soldier", "imperial_yellow", []),
    ("korean-turtle-ship", "greek-trireme", "jurchen_iron", ["turtle_head"]),
    ("zheng-he-treasure-ship", "phoenician-galley", "ming_navy", []),
]

if __name__ == "__main__":
    print(f"Generating {len(SPRITES)} authentic pixel-art sprites for Chapter 5...")
    for target, base, theme, acc in SPRITES:
        process_sprite(base, target, theme, acc)
    print("All Chapter 5 sprites generated successfully!")
