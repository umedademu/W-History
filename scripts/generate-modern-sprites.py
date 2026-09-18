import os
import json
import hashlib
from PIL import Image

def canvas(size=(48, 48)):
    return Image.new('RGBA', size, (0, 0, 0, 0))

def put_pixels(img, pixel_dict):
    p = img.load()
    for (x, y), col in pixel_dict.items():
        if 0 <= x < img.width and 0 <= y < img.height:
            p[x, y] = col

def base_human(
    skin=(245, 205, 170, 255),
    hair_col=(90, 60, 40, 255),
    hair_type='short', # short, long, curly_wig, balding, ponytail, female_bun, female_high
    hat_type=None,     # crown, bicorne, tricorn, beret, scholar_cap, pope_mitre, cardinal_cap, helmet, tiara, bonnet
    hat_col=(40, 40, 50, 255),
    hat_accent=(220, 180, 50, 255),
    shirt_col=(230, 225, 215, 255),
    coat_col=(40, 60, 100, 255),
    coat_accent=(220, 180, 50, 255),
    pants_col=(60, 50, 45, 255),
    boots_col=(30, 25, 25, 255),
    has_ruff=False, # 白い大きな襞襟
    has_cravat=False, # 白いクラヴァット
    beard_type=None, # full, pointed, mustache, stubble, long_white
    beard_col=None,
    item_type=None, # book, sword, quill, telescope, palette, cross, scroll, flute, scepter, gear, gun
    item_col=None,
    is_female=False
):
    img = canvas()
    d = {}
    
    if beard_col is None:
        beard_col = hair_col

    # 1. 顔・頭部
    for y in range(12, 21):
        for x in range(19, 29):
            d[(x, y)] = skin
    d[(19, 12)] = (0, 0, 0, 0)
    d[(28, 12)] = (0, 0, 0, 0)
    d[(19, 20)] = (0, 0, 0, 0)
    d[(28, 20)] = (0, 0, 0, 0)
    
    # 目
    d[(21, 15)] = (30, 25, 20, 255)
    d[(26, 15)] = (30, 25, 20, 255)
    
    # 眉
    for x in range(20, 23):
        d[(x, 14)] = hair_col
    for x in range(25, 28):
        d[(x, 14)] = hair_col
        
    # 鼻
    d[(24, 16)] = (max(0, skin[0]-25), max(0, skin[1]-25), max(0, skin[2]-25), 255)
    d[(24, 17)] = (max(0, skin[0]-35), max(0, skin[1]-35), max(0, skin[2]-35), 255)
    
    # 口
    lip_col = (200, 90, 100, 255) if is_female else (180, 100, 90, 255)
    d[(23, 19)] = lip_col
    d[(24, 19)] = lip_col

    # 髭 (女性には付けない)
    if not is_female:
        if beard_type == 'mustache':
            for x in range(21, 27):
                d[(x, 18)] = beard_col
        elif beard_type == 'pointed':
            for x in range(21, 27):
                d[(x, 18)] = beard_col
            for y in range(19, 23):
                d[(23, y)] = beard_col
                d[(24, y)] = beard_col
        elif beard_type == 'full':
            for y in range(18, 24):
                for x in range(20, 28):
                    d[(x, y)] = beard_col
        elif beard_type == 'long_white':
            for y in range(18, 27):
                w = 4 - (y - 18) // 3
                for x in range(24 - w, 24 + w):
                    d[(x, y)] = (235, 235, 240, 255)

    # 髪型
    if hair_type == 'short':
        for y in range(9, 13):
            for x in range(19, 29):
                d[(x, y)] = hair_col
        for y in range(13, 18):
            d[(18, y)] = hair_col
            d[(29, y)] = hair_col
    elif hair_type == 'long':
        for y in range(9, 13):
            for x in range(18, 30):
                d[(x, y)] = hair_col
        for y in range(13, 24):
            d[(18, y)] = hair_col
            d[(17, y)] = hair_col
            d[(29, y)] = hair_col
            d[(30, y)] = hair_col
    elif hair_type == 'curly_wig':
        for y in range(8, 14):
            for x in range(17, 31):
                d[(x, y)] = hair_col
        for y in range(13, 26):
            for x in [16, 17, 18, 29, 30, 31]:
                d[(x, y)] = hair_col if (x + y) % 2 == 0 else (min(255, hair_col[0]+30), min(255, hair_col[1]+30), min(255, hair_col[2]+30), 255)
    elif hair_type == 'ponytail':
        for y in range(9, 13):
            for x in range(18, 30):
                d[(x, y)] = hair_col
        for y in range(13, 19):
            d[(18, y)] = hair_col
            d[(29, y)] = hair_col
        for y in range(17, 25):
            d[(23, y)] = hair_col
            d[(24, y)] = hair_col
        d[(22, 18)] = (40, 40, 40, 255)
        d[(25, 18)] = (40, 40, 40, 255)
    elif hair_type == 'female_high':
        for y in range(4, 14):
            w = 5 + (13 - y)//2
            for x in range(24 - w, 24 + w):
                d[(x, y)] = hair_col
        d[(23, 2)] = (245, 230, 150, 255)
        d[(24, 2)] = (245, 230, 150, 255)
        d[(23, 3)] = (255, 255, 255, 255)
        d[(24, 3)] = (255, 255, 255, 255)
    elif hair_type == 'female_bun':
        for y in range(8, 14):
            for x in range(18, 30):
                d[(x, y)] = hair_col
        for y in range(14, 23):
            d[(18, y)] = hair_col
            d[(29, y)] = hair_col
        for y in range(6, 9):
            for x in range(22, 26):
                d[(x, y)] = hair_col
    elif hair_type == 'balding':
        d[(19, 12)] = skin
        d[(28, 12)] = skin
        for y in range(13, 19):
            d[(18, y)] = hair_col
            d[(29, y)] = hair_col

    # 帽子
    if hat_type == 'crown':
        for x in range(19, 29):
            d[(x, 10)] = hat_accent
        for sx in [19, 21, 23, 25, 27]:
            d[(sx, 8)] = hat_accent
            d[(sx, 9)] = hat_accent
            d[(sx, 7)] = (255, 255, 255, 255)
    elif hat_type == 'tiara':
        for x in range(20, 28):
            d[(x, 11)] = (240, 220, 100, 255)
        d[(23, 9)] = (255, 255, 255, 255)
        d[(24, 9)] = (255, 255, 255, 255)
        d[(23, 10)] = (220, 40, 40, 255)
        d[(24, 10)] = (220, 40, 40, 255)
    elif hat_type == 'bicorne':
        for y in range(7, 12):
            w = 8 + (11 - y) * 2
            for x in range(24 - w, 24 + w):
                d[(x, y)] = hat_col
        d[(23, 10)] = (30, 60, 180, 255)
        d[(24, 10)] = (245, 245, 245, 255)
        d[(25, 10)] = (210, 40, 40, 255)
        for x in range(16, 32):
            d[(x, 11)] = hat_accent
    elif hat_type == 'tricorn':
        for y in range(7, 12):
            w = 5 + (11 - y) * 2
            for x in range(24 - w, 24 + w):
                d[(x, y)] = hat_col
        for x in range(16, 32):
            d[(x, 11)] = hat_col
        for y in range(8, 11):
            d[(16, y)] = hat_accent
            d[(31, y)] = hat_accent
    elif hat_type == 'beret':
        for y in range(7, 12):
            w = 6 + (y - 7)
            for x in range(24 - w, 24 + w):
                d[(x, y)] = hat_col
        d[(24, 6)] = hat_accent
    elif hat_type == 'scholar_cap':
        for x in range(16, 32):
            d[(x, 9)] = hat_col
        for y in range(6, 9):
            for x in range(18, 30):
                d[(x, y)] = hat_col
    elif hat_type == 'pope_mitre':
        for y in range(4, 12):
            w = (y - 3)
            for x in range(24 - w, 24 + w):
                d[(x, y)] = hat_col
        for y in range(4, 12):
            d[(23, y)] = hat_accent
            d[(24, y)] = hat_accent
    elif hat_type == 'cardinal_cap':
        for x in range(17, 31):
            d[(x, 9)] = (200, 30, 30, 255)
        for y in range(6, 9):
            for x in range(20, 28):
                d[(x, y)] = (200, 30, 30, 255)
    elif hat_type == 'bonnet':
        for y in range(7, 13):
            for x in range(18, 30):
                d[(x, y)] = (240, 240, 245, 255)
        d[(24, 13)] = (30, 60, 180, 255)
    elif hat_type == 'helmet':
        for y in range(7, 13):
            for x in range(19, 29):
                d[(x, y)] = (160, 165, 170, 255)
        d[(24, 5)] = (200, 40, 40, 255)
        d[(24, 6)] = (200, 40, 40, 255)

    # 2. 首元
    for y in range(21, 24):
        d[(23, y)] = skin
        d[(24, y)] = skin
        
    if has_ruff:
        for y in range(20, 24):
            for x in range(17, 31):
                d[(x, y)] = (255, 255, 255, 255) if (x + y) % 2 == 0 else (225, 230, 235, 255)
    elif has_cravat:
        for y in range(21, 26):
            d[(23, y)] = (250, 250, 250, 255)
            d[(24, y)] = (240, 240, 245, 255)
        d[(22, 23)] = (235, 235, 240, 255)
        d[(25, 23)] = (235, 235, 240, 255)

    # 3. 上着 / ドレス
    if is_female:
        for y in range(24, 43):
            w = 5 + (y - 24) * 8 // 18
            for x in range(24 - w, 24 + w):
                d[(x, y)] = coat_col if (x + y) % 2 == 0 else (max(0, coat_col[0]-15), max(0, coat_col[1]-15), max(0, coat_col[2]-15), 255)
        for y in range(24, 27):
            d[(23, y)] = skin
            d[(24, y)] = skin
        d[(23, 27)] = coat_accent
        d[(24, 27)] = coat_accent
        for y in range(25, 34):
            d[(15, y)] = coat_col
            d[(32, y)] = coat_col
        for y in range(34, 37):
            d[(15, y)] = skin
            d[(32, y)] = skin
        d[(22, 43)] = boots_col
        d[(25, 43)] = boots_col
    else:
        for y in range(24, 37):
            w = 6 + (y - 24) // 3
            for x in range(24 - w, 24 + w):
                d[(x, y)] = coat_col
        for y in range(24, 36):
            d[(23, y)] = shirt_col
            d[(24, y)] = coat_accent
        for y in range(24, 27):
            d[(16, y)] = coat_accent
            d[(17, y)] = coat_accent
            d[(30, y)] = coat_accent
            d[(31, y)] = coat_accent
        for y in range(26, 36):
            d[(14, y)] = coat_col
            d[(15, y)] = coat_col
            d[(32, y)] = coat_col
            d[(33, y)] = coat_col
        for y in range(36, 39):
            d[(14, y)] = skin
            d[(15, y)] = skin
            d[(32, y)] = skin
            d[(33, y)] = skin
        for y in range(37, 42):
            for x in range(18, 23):
                d[(x, y)] = pants_col
            for x in range(25, 30):
                d[(x, y)] = pants_col
        for y in range(42, 46):
            for x in range(17, 23):
                d[(x, y)] = boots_col
            for x in range(25, 31):
                d[(x, y)] = boots_col
        d[(19, 43)] = coat_accent
        d[(27, 43)] = coat_accent

    # 4. アイテム
    if item_type == 'book':
        b_col = item_col or (160, 50, 40, 255)
        for y in range(32, 38):
            for x in range(9, 15):
                d[(x, y)] = b_col
        for y in range(33, 37):
            d[(14, y)] = (245, 240, 230, 255)
    elif item_type == 'sword':
        for y in range(28, 44):
            d[(34, y)] = (200, 205, 210, 255)
        d[(33, 34)] = (220, 180, 50, 255)
        d[(34, 34)] = (220, 180, 50, 255)
        d[(35, 34)] = (220, 180, 50, 255)
        d[(34, 33)] = (120, 60, 30, 255)
    elif item_type == 'quill':
        for i in range(5):
            d[(33 + i, 34 - i)] = (245, 245, 245, 255)
        for y in range(34, 39):
            for x in range(8, 14):
                d[(x, y)] = (250, 245, 230, 255)
    elif item_type == 'telescope':
        for i in range(7):
            d[(31 + i, 33 - i)] = (210, 175, 45, 255)
            d[(32 + i, 33 - i)] = (180, 145, 35, 255)
    elif item_type == 'palette':
        for y in range(33, 38):
            for x in range(9, 15):
                d[(x, y)] = (195, 155, 105, 255)
        d[(10, 34)] = (220, 40, 40, 255)
        d[(12, 34)] = (40, 120, 220, 255)
        d[(11, 36)] = (230, 210, 40, 255)
    elif item_type == 'cross':
        for y in range(30, 40):
            d[(33, y)] = (210, 180, 50, 255)
        for x in range(31, 36):
            d[(x, 33)] = (210, 180, 50, 255)
    elif item_type == 'scroll':
        for y in range(32, 39):
            for x in range(32, 36):
                d[(x, y)] = (245, 240, 225, 255)
        d[(33, 35)] = (180, 40, 40, 255)
    elif item_type == 'flute':
        for i in range(8):
            d[(30 + i, 32 + i//2)] = (190, 160, 90, 255)
    elif item_type == 'scepter':
        for y in range(25, 41):
            d[(34, y)] = (235, 195, 45, 255)
        d[(34, 24)] = (255, 225, 70, 255)
        d[(33, 24)] = (220, 40, 40, 255)
        d[(35, 24)] = (220, 40, 40, 255)
    elif item_type == 'gear':
        for y in range(33, 38):
            for x in range(31, 36):
                d[(x, y)] = (140, 145, 150, 255)
        d[(33, 35)] = (60, 60, 60, 255)
    elif item_type == 'gun':
        for y in range(25, 43):
            d[(34, y)] = (120, 80, 50, 255)
        d[(34, 24)] = (180, 180, 190, 255)
        d[(34, 23)] = (180, 180, 190, 255)

    put_pixels(img, d)
    return img


# 合戦・軍船アクター生成関数
def make_armada_galleon():
    img = canvas()
    d = {}
    for y in range(26, 39):
        w = 14 + (38 - y) // 2
        for x in range(24 - w, 24 + w):
            c = (115, 65, 35, 255) if (x + y) % 2 == 0 else (95, 50, 25, 255)
            d[(x, y)] = c
    for y in range(20, 27):
        for x in range(6, 13):
            d[(x, y)] = (115, 65, 35, 255)
        for x in range(33, 41):
            d[(x, y)] = (100, 55, 30, 255)
    for bx in [15, 20, 25, 30, 35]:
        d[(bx, 32)] = (20, 20, 20, 255)
        d[(bx, 35)] = (20, 20, 20, 255)
    for mx in [18, 28]:
        for y in range(6, 26):
            d[(mx, y)] = (80, 45, 25, 255)
        for y in range(9, 21):
            for x in range(mx - 6, mx + 7):
                d[(x, y)] = (245, 240, 230, 255)
        for x in range(mx - 4, mx + 5):
            d[(x, 15)] = (210, 30, 30, 255)
        for y in range(11, 19):
            d[(mx, y)] = (210, 30, 30, 255)
    for x in range(4, 44):
        if (x, 39) not in d:
            d[(x, 39)] = (45, 90, 140, 255)
        d[(x, 40)] = (35, 75, 120, 255)
    put_pixels(img, d)
    return img

def make_english_warship():
    img = canvas()
    d = {}
    for y in range(28, 39):
        w = 15 + (38 - y) // 3
        for x in range(24 - w, 24 + w):
            d[(x, y)] = (130, 75, 40, 255) if (x + y) % 2 == 0 else (110, 60, 30, 255)
    for x in range(10, 38):
        d[(x, 32)] = (220, 190, 60, 255)
    for bx in [13, 17, 21, 25, 29, 33, 37]:
        d[(bx, 32)] = (20, 20, 20, 255)
    for mx in [17, 28]:
        for y in range(6, 28):
            d[(mx, y)] = (90, 50, 25, 255)
        for y in range(8, 23):
            for x in range(mx - 5, mx + 6):
                d[(x, y)] = (250, 250, 245, 255)
        for x in range(mx - 4, mx + 5):
            d[(x, 15)] = (220, 30, 30, 255)
        for y in range(10, 20):
            d[(mx, y)] = (220, 30, 30, 255)
    for x in range(4, 44):
        d[(x, 39)] = (50, 100, 150, 255)
        d[(x, 40)] = (40, 85, 130, 255)
    put_pixels(img, d)
    return img

def make_guillotine():
    img = canvas()
    d = {}
    for y in range(38, 44):
        for x in range(8, 40):
            d[(x, y)] = (120, 75, 45, 255) if (x + y) % 2 == 0 else (105, 65, 35, 255)
    for y in range(6, 38):
        d[(18, y)] = (130, 80, 45, 255)
        d[(19, y)] = (110, 65, 35, 255)
        d[(28, y)] = (130, 80, 45, 255)
        d[(29, y)] = (110, 65, 35, 255)
    for x in range(16, 32):
        d[(x, 6)] = (120, 70, 40, 255)
        d[(x, 7)] = (100, 55, 30, 255)
    for y in range(14, 20):
        for x in range(20, 28):
            if (x - 20) <= (y - 14) * 2:
                d[(x, y)] = (225, 230, 235, 255) if (x - 20) == (y - 14) * 2 else (170, 175, 180, 255)
    for x in range(20, 28):
        d[(x, 34)] = (115, 65, 35, 255)
        d[(x, 35)] = (115, 65, 35, 255)
    d[(23, 34)] = (30, 20, 20, 255)
    d[(24, 34)] = (30, 20, 20, 255)
    for y in range(34, 39):
        for x in range(13, 18):
            d[(x, y)] = (180, 40, 30, 255)
    put_pixels(img, d)
    return img

def make_ironside_cavalry():
    return base_human(
        skin=(235, 195, 160, 255),
        hair_col=(50, 40, 30, 255),
        hat_type='helmet',
        coat_col=(140, 145, 150, 255),
        coat_accent=(100, 65, 35, 255),
        shirt_col=(180, 150, 110, 255),
        pants_col=(90, 75, 55, 255),
        boots_col=(40, 30, 20, 255),
        beard_type='mustache',
        item_type='sword'
    )

def make_french_grand_armee():
    return base_human(
        skin=(240, 200, 165, 255),
        hair_col=(60, 45, 35, 255),
        hat_type='tricorn',
        hat_col=(30, 30, 40, 255),
        hat_accent=(210, 40, 40, 255),
        coat_col=(30, 50, 110, 255),
        coat_accent=(235, 235, 235, 255),
        shirt_col=(240, 240, 240, 255),
        pants_col=(245, 245, 245, 255),
        boots_col=(30, 30, 30, 255),
        has_cravat=True,
        beard_type='mustache',
        item_type='gun'
    )

def make_russian_winter_soldier():
    return base_human(
        skin=(245, 205, 170, 255),
        hair_col=(70, 50, 35, 255),
        hat_type='beret',
        hat_col=(75, 60, 45, 255),
        coat_col=(45, 85, 55, 255),
        coat_accent=(190, 40, 40, 255),
        shirt_col=(230, 225, 210, 255),
        pants_col=(60, 65, 60, 255),
        boots_col=(35, 30, 30, 255),
        beard_type='full',
        item_type='gun'
    )

def make_prussian_guardsman():
    return base_human(
        skin=(245, 205, 170, 255),
        hair_col=(180, 175, 170, 255),
        hat_type='pope_mitre',
        hat_col=(35, 65, 135, 255),
        hat_accent=(235, 200, 50, 255),
        coat_col=(30, 55, 120, 255),
        coat_accent=(220, 50, 40, 255),
        shirt_col=(245, 245, 245, 255),
        pants_col=(245, 245, 245, 255),
        boots_col=(25, 25, 25, 255),
        beard_type='mustache',
        item_type='gun'
    )

def make_cleopatra():
    return base_human(
        skin=(245, 205, 170, 255),
        hair_col=(25, 25, 30, 255),
        hair_type='female_bun',
        hat_type='tiara',
        coat_col=(40, 110, 180, 255), # エジプトブルー
        coat_accent=(235, 200, 50, 255), # ゴールド
        is_female=True,
        item_type='scepter'
    )

def make_suleyman():
    return base_human(
        skin=(240, 200, 160, 255),
        hair_col=(40, 35, 30, 255),
        hair_type='short',
        hat_type='pope_mitre', # 巨大ターバン風
        hat_col=(250, 250, 255, 255),
        hat_accent=(230, 195, 45, 255),
        coat_col=(180, 35, 35, 255), # 深紅のローブ
        coat_accent=(235, 200, 50, 255),
        beard_type='full',
        item_type='scepter'
    )

# 257名の定義とレンダリング
def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    target_dir = os.path.join(base_dir, 'public/images/ancient')
    os.makedirs(target_dir, exist_ok=True)
    
    with open(os.path.join(base_dir, 'docs/chapter-07-needed-names.json'), 'r', encoding='utf-8') as f:
        needed_names = json.load(f)
        
    with open(os.path.join(base_dir, 'docs/chapter-07-person-metadata.json'), 'r', encoding='utf-8') as f:
        explicit_meta = json.load(f)

    # 合戦アクター・追加歴史人物
    battle_actors = {
        'spanish-armada-galleon.png': make_armada_galleon(),
        'english-warship.png': make_english_warship(),
        'guillotine-device.png': make_guillotine(),
        'ironside-cavalry.png': make_ironside_cavalry(),
        'french-grand-armee.png': make_french_grand_armee(),
        'russian-winter-soldier.png': make_russian_winter_soldier(),
        'prussian-guardsman.png': make_prussian_guardsman(),
        'cleopatra-queen.png': make_cleopatra(),
        'suleyman1-magnificent.png': make_suleyman()
    }
    for fn, img in battle_actors.items():
        img.save(os.path.join(target_dir, fn), 'PNG')
        print(f"Saved battle actor {fn}")

    # 日本語名 -> 英名マッピング（一意）
    # Romaji-like or historical english mapping
    name_to_file = {}
    file_to_name = {}

    female_names = {
        'エリザベス1世', 'マリー＝アントワネット', 'マリ＝アントワネット', 'マリア＝テレジア', 'エカチェリーナ2世',
        'エリザヴェータ', 'アン女王', 'メアリ1世', 'メアリ2世', 'メアリ＝ステュアート', 'アン＝ブーリン', 'カサリン',
        'カトリーヌ＝ド＝メディシス', 'マリー＝ド＝メディシス', 'マリ＝ド＝メディシス', 'ポンパドゥール夫人',
        'シャルロット＝コルデ', 'オランプ＝ド＝グージュ', 'ジョゼフィーヌ', 'マリ＝ルイーズ', 'マルグリート'
    }

    kings_emperors = {
        'ナポレオン', 'カール5世', 'フェリペ2世', 'ルイ16世', 'ルイ13世', 'ルイ15世', 'チャールズ1世', 'チャールズ2世',
        'ジェームズ1世', 'ジェームズ2世', 'ジョージ1世', 'ジョージ3世', 'フリードリヒ1世', 'フリードリヒ2世',
        'フリードリヒ＝ヴィルヘルム1世', 'フリードリヒ＝ヴィルヘルム2世', 'フリードリヒ＝ヴィルヘルム大選帝侯',
        'ピョートル3世', 'イヴァン1世', 'ミハイル＝ロマノフ', 'グスタフ＝アドルフ', 'カール12世', 'クリスチャン4世',
        'マクシミリアン1世', 'フランツ1世', 'フランツ2世', 'ヨーゼフ2世', 'レオポルト2世', 'カール6世', 'フェルディナント2世',
        'カルロス2世', 'フェリペ5世', 'フェルナンド5世', 'シャルル9世', 'アンリ3世', 'アンリ4世', 'ジョアン2世',
        'マヌエル1世', 'アレクサンドル1世', 'アタワルパ', 'オラニエ公ウィレム', 'オラニエ公ウィレム3世'
    }

    clerics_popes = {
        'ルター', 'カルヴァン', 'ツヴィングリ', 'ミュンツァー', 'メランヒトン', 'ロイヒリン', 'ヨハン＝エック',
        'イグナティウス＝ロヨラ', 'リシュリュー', 'マザラン', 'ボシュエ', 'シェイエス', 'ユリウス2世', 'レオ10世',
        'アレクサンデル6世', 'パウルス3世', 'ピウス7世', 'サヴォナローラ', 'カートライト'
    }

    explorers_conquerors = {
        'ヴァスコ＝ダ＝ガマ', 'マゼラン', 'バルトロメウ＝ディアス', 'カブラル', 'アルメイダ', 'アメリゴ＝ヴェスプッチ',
        'バルボア', 'カボット', 'カルティエ', 'シャンプラン', 'コルテス', 'ピサロ', 'ラス＝カサス', 'イェルマーク',
        'ベーリング', 'トスカネリ', 'ヴァルトゼーミュラー'
    }

    scientists_inventors = {
        'コペルニクス', 'ガリレオ＝ガリレイ', 'ケプラー', 'ニュートン', 'グーテンベルク', 'ハーヴェー', 'ジェンナー',
        'ボイル', 'リンネ', 'ヴォルタ', 'ラヴォワジェ', 'ラプラース', 'ビュフォン', 'ジョン＝ケイ', 'ハーグリーヴズ',
        'アークライト', 'クロンプトン', 'ホイットニー', 'ニューコメン', 'ワット', 'ダービー父子', 'トレヴィシック',
        'スティーヴンソン', 'フルトン'
    }

    artists_writers = {
        'レオナルド＝ダ＝ヴィンチ', 'ミケランジェロ', 'ラファエロ', 'ボッティチェリ', 'ブルネレスキ', 'ドナテルロ',
        'ジョット', 'ブラマンテ', 'ファン＝アイク兄弟', 'ブリューゲル', 'デューラー', 'ホルバイン', 'ダヴィド',
        'ベラスケス', 'ムリリョ', 'エル＝グレコ', 'ルーベンス', 'レンブラント', 'フェルメール', 'ワトー', 'ゴヤ',
        'ダンテ', 'ペトラルカ', 'ボッカチオ', 'チョーサー', 'シェークスピア', 'セルバンテス', 'モンテーニュ', 'ラブレー',
        'モリエール', 'コルネイユ', 'ラシーヌ', 'ゲーテ', 'スウィフト', 'デフォー', 'ミルトン', 'バンヤン', 'トルストイ'
    }

    revolution_statesmen = {
        'ロベスピエール', 'ダントン', 'マラー', 'サン＝ジュスト', 'ミラボー', 'エベール', 'バブーフ', 'ネッケル', 'テュルゴ',
        'カロンヌ', 'フェルセン', 'タレーラン', 'ワシントン', 'ジェファソン', 'フランクリン', 'ハミルトン', 'ペイン',
        'パトリック＝ヘンリ', 'サミュエル＝アダムズ', 'コシューシコ', 'ラ＝ファイエット', 'シュトイベン', 'クロムウェル',
        'ウォルポール', 'ピット', 'ドレーク', 'ホーキンズ', 'ウェリントン', 'ヴァレンシュタイン', 'シュタイン', 'ハルデンベルク',
        'カウニッツ', 'シュリ', 'ルーヴォワ', 'クトゥーゾフ', 'ステンカ＝ラージン', 'プガチョフ', 'ラクスマン', 'レザノフ',
        '大黒屋光太夫', 'デュプレクス', 'クライヴ', 'ネルソン', 'プライド', 'リチャード', 'ジョゼフ'
    }

    philosophers_socialists = {
        'デカルト', 'パスカル', 'スピノザ', 'ライプニッツ', 'ロック', 'ホッブズ', 'カント', 'ルソー', 'ディドロ',
        'ダランベール', 'マキァヴェリ', 'グロティウス', 'フィヒテ', 'シェリング', 'ヘーゲル', 'ヒューム', 'マックス＝ヴェーバー',
        'フランシス＝ベーコン', 'フィルマー', 'グレシャム', 'サン＝シモン', 'フーリエ', 'ブランキ', 'プルードン', 'ルイ＝ブラン',
        'マルクス', 'エンゲルス', 'ロバート＝オーウェン', 'フンボルト'
    }

    # 各人物のレンダリング
    for name in needed_names:
        meta = explicit_meta.get(name)
        if meta:
            fn = meta['filename']
        else:
            # Generate deterministic kebab filename
            # e.g. "ジョット" -> "giotto-artist.png"
            h = hashlib.md5(name.encode('utf-8')).hexdigest()[:6]
            clean_name = name.replace('＝', '-').replace('・', '-').replace(' ', '-')
            # Mapping common characters
            fn = f"ch7-{clean_name}.png"
            # Ensure safe ASCII filename
            fn_ascii = f"ch7-p-{h}.png"
            fn = fn_ascii

        name_to_file[name] = fn
        file_to_name[fn] = name

        # Determine visual properties based on name and category
        h_val = int(hashlib.md5(name.encode('utf-8')).hexdigest(), 16)
        
        is_fem = name in female_names
        
        # 色のパレット生成
        skin_tones = [
            (245, 205, 170, 255),
            (240, 195, 160, 255),
            (250, 215, 180, 255),
            (235, 190, 155, 255)
        ]
        skin = skin_tones[h_val % len(skin_tones)]
        
        hair_colors = [
            (50, 40, 30, 255),   # 暗褐色
            (90, 60, 40, 255),   # 茶
            (160, 120, 60, 255), # 金髪
            (190, 185, 180, 255),# 銀髪・白髪・粉白粉カツラ
            (35, 30, 30, 255),   # 黒
            (140, 60, 30, 255)   # 赤毛
        ]
        hair_col = hair_colors[(h_val >> 4) % len(hair_colors)]
        
        coat_colors = [
            (35, 55, 110, 255),  # 濃紺
            (160, 40, 40, 255),  # 深紅
            (40, 85, 60, 255),   # 緑
            (40, 40, 45, 255),   # 黒
            (110, 70, 40, 255),  # 茶
            (90, 45, 110, 255),  # 紫
            (200, 160, 60, 255), # 金茶
            (70, 110, 140, 255)  # 水色
        ]
        coat_col = coat_colors[(h_val >> 8) % len(coat_colors)]
        coat_accent = (225, 190, 50, 255) if (h_val % 2 == 0) else (240, 240, 245, 255)

        # デフォルト属性
        hair_type = 'short'
        hat_type = None
        hat_col = (40, 40, 50, 255)
        hat_accent = coat_accent
        has_ruff = False
        has_cravat = False
        beard_type = None
        item_type = None

        if is_fem:
            hair_type = 'female_high' if 'アントワネット' in name or 'テレジア' in name or 'エカチェリーナ' in name else 'female_bun'
            hat_type = 'tiara' if name in kings_emperors or '女王' in name or '王妃' in name or '女帝' in name else None
            item_type = 'scepter' if hat_type == 'tiara' else 'book'
            has_ruff = 'エリザベス' in name
        elif name in kings_emperors:
            hat_type = 'crown'
            hair_type = 'curly_wig' if (h_val % 2 == 0) else 'short'
            item_type = 'scepter'
            beard_type = 'pointed' if (h_val % 3 == 0) else 'mustache'
            has_ruff = 'フェリペ' in name or 'カール5世' in name
            has_cravat = 'ルイ' in name or 'ジョージ' in name
        elif name in clerics_popes:
            if '教皇' in name or name in ['ユリウス2世', 'レオ10世', 'アレクサンデル6世', 'パウルス3世', 'ピウス7世']:
                hat_type = 'pope_mitre'
                coat_col = (245, 245, 250, 255)
            elif name in ['リシュリュー', 'マザラン']:
                hat_type = 'cardinal_cap'
                coat_col = (200, 30, 30, 255)
                beard_type = 'pointed'
            elif name in ['ルター', 'カルヴァン', 'ツヴィングリ']:
                hat_type = 'scholar_cap'
                coat_col = (30, 30, 35, 255)
                beard_type = 'full' if name != 'ルター' else None
            item_type = 'book' if (h_val % 2 == 0) else 'cross'
        elif name in explorers_conquerors:
            hat_type = 'helmet' if 'コルテス' in name or 'ピサロ' in name else 'beret'
            item_type = 'sword' if (h_val % 2 == 0) else 'telescope'
            beard_type = 'full'
        elif name in scientists_inventors:
            hat_type = None
            hair_type = 'curly_wig' if 'ニュートン' in name or 'ライプニッツ' in name else 'short'
            item_type = 'telescope' if 'ガリレオ' in name or 'ケプラー' in name or 'コペルニクス' in name else 'gear'
            has_cravat = True
        elif name in artists_writers:
            hat_type = 'beret'
            item_type = 'palette' if name in ['ミケランジェロ', 'ラファエロ', 'ボッティチェリ', 'デューラー', 'ホルバイン', 'ルーベンス', 'レンブラント', 'ダヴィド', 'ゴヤ'] else 'quill'
            beard_type = 'full' if 'ダ＝ヴィンチ' in name else ('pointed' if 'シェークスピア' in name else None)
            hair_type = 'balding' if 'シェークスピア' in name else 'long'
        elif name in revolution_statesmen:
            hat_type = 'bicorne' if 'ナポレオン' in name else ('tricorn' if 'ワシントン' in name or 'ラ＝ファイエット' in name else None)
            has_cravat = True
            hair_type = 'ponytail'
            item_type = 'scroll' if (h_val % 2 == 0) else 'sword'
        elif name in philosophers_socialists:
            hair_type = 'curly_wig' if (h_val % 2 == 0) else 'ponytail'
            has_cravat = True
            item_type = 'book' if (h_val % 2 == 0) else 'quill'
            if 'マルクス' in name:
                beard_type = 'full'
                hair_type = 'long'
                hair_col = (190, 185, 180, 255)

        # 個別調整
        if name == 'ナポレオン':
            hat_type = 'bicorne'
            hat_col = (30, 30, 40, 255)
            coat_col = (25, 45, 95, 255)
            coat_accent = (240, 240, 245, 255)
            pants_col = (245, 245, 245, 255)
            hair_type = 'short'
            hair_col = (50, 40, 35, 255)
            item_type = 'sword'
        elif name == 'フリードリヒ2世':
            hat_type = 'tricorn'
            hat_col = (30, 30, 40, 255)
            coat_col = (30, 55, 120, 255) # プロシアンブルー
            item_type = 'flute'
        elif name == 'クロムウェル':
            hat_type = 'helmet'
            coat_col = (120, 125, 130, 255)
            item_type = 'sword'
        elif name == 'ワシントン':
            hat_type = 'tricorn'
            hair_col = (230, 230, 230, 255) # 白髪
            hair_type = 'ponytail'
            coat_col = (30, 60, 120, 255)
            coat_accent = (220, 190, 60, 255)
            item_type = 'sword'

        img = base_human(
            skin=skin,
            hair_col=hair_col,
            hair_type=hair_type,
            hat_type=hat_type,
            hat_col=hat_col,
            hat_accent=hat_accent,
            coat_col=coat_col,
            coat_accent=coat_accent,
            has_ruff=has_ruff,
            has_cravat=has_cravat,
            beard_type=beard_type,
            item_type=item_type,
            is_female=is_fem
        )

        out_path = os.path.join(target_dir, fn)
        img.save(out_path, 'PNG')
        
        # 透過検証
        non_zero = [a for _, _, _, a in img.getdata() if a != 0]
        invalid = [a for a in non_zero if a != 255]
        assert len(invalid) == 0, f"{fn} non-binary alpha"

    # Save mapping json
    with open(os.path.join(base_dir, 'docs/chapter-07-generated-mapping.json'), 'w', encoding='utf-8') as f:
        json.dump(name_to_file, f, ensure_ascii=False, indent=2)

    print(f"Successfully generated {len(needed_names)} individual characters + 7 battle actors!")
    print("All alpha channels strictly verified as 0 or 255.")

if __name__ == '__main__':
    main()
