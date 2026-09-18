import os
from PIL import Image

def create_transparent_canvas(size=(48, 48)):
    return Image.new('RGBA', size, (0, 0, 0, 0))

def draw_pixels(img, pixel_dict):
    pixels = img.load()
    for (x, y), color in pixel_dict.items():
        if 0 <= x < img.width and 0 <= y < img.height:
            pixels[x, y] = color

# 1. ヴェルサイユ宮殿 (versailles-palace.png)
# 壮麗なバロック宮殿: 青いマンサード屋根、金色と大理石のファサード、左右対称の翼棟
def make_versailles():
    img = create_transparent_canvas()
    d = {}
    
    # 屋根（青スレート・金色装飾）
    # 中央棟屋根
    for y in range(10, 16):
        w = 12 - (15 - y)
        for x in range(24 - w, 24 + w):
            d[(x, y)] = (35, 60, 90, 255)
    # 屋根の金装飾
    for x in range(21, 27):
        d[(x, 10)] = (235, 195, 50, 255)
    for x in range(23, 25):
        d[(x, 8)] = (245, 215, 70, 255)
        d[(x, 9)] = (235, 195, 50, 255)
    
    # 左右の翼棟屋根
    for y in range(14, 18):
        for x in range(6, 16):
            d[(x, y)] = (45, 70, 105, 255)
        for x in range(32, 42):
            d[(x, y)] = (45, 70, 105, 255)
    for x in range(8, 14):
        d[(x, 13)] = (210, 175, 45, 255)
    for x in range(34, 40):
        d[(x, 13)] = (210, 175, 45, 255)

    # 階層（2階・3階の壁面: クリーム色・黄金トリム）
    for y in range(16, 38):
        # 中央棟
        for x in range(16, 32):
            c = (245, 235, 205, 255) if (x + y) % 2 == 0 else (235, 225, 195, 255)
            d[(x, y)] = c
    
    for y in range(18, 38):
        # 左右翼棟
        for x in range(6, 16):
            d[(x, y)] = (240, 230, 200, 255)
        for x in range(32, 42):
            d[(x, y)] = (230, 220, 190, 255)

    # 柱・アーチ窓
    for y in range(20, 27):
        for wx in [9, 12, 18, 22, 26, 30, 35, 38]:
            d[(wx, y)] = (50, 80, 120, 255)
            d[(wx + 1, y)] = (70, 110, 160, 255)
    for y in range(29, 36):
        for wx in [9, 12, 18, 22, 26, 30, 35, 38]:
            d[(wx, y)] = (40, 65, 95, 255)
            d[(wx + 1, y)] = (60, 95, 135, 255)

    # 黄金のバルコニー・手すり (y=27, 28)
    for x in range(16, 32):
        d[(x, 27)] = (225, 185, 40, 255)
        d[(x, 28)] = (185, 145, 30, 255)
    for x in range(6, 16):
        d[(x, 27)] = (205, 165, 35, 255)
    for x in range(32, 42):
        d[(x, 27)] = (205, 165, 35, 255)

    # 1階基壇・舗装
    for y in range(38, 43):
        for x in range(4, 44):
            d[(x, y)] = (195, 185, 165, 255) if (x + y) % 2 == 0 else (175, 165, 145, 255)
    # 正面階段
    for y in range(40, 44):
        for x in range(20, 28):
            d[(x, y)] = (220, 210, 190, 255)
            
    # 輪郭線・陰影
    for x in range(6, 42):
        d[(x, 38)] = (130, 120, 100, 255)
    for y in range(18, 38):
        d[(5, y)] = (110, 100, 80, 255)
        d[(42, y)] = (100, 90, 75, 255)
        d[(15, y)] = (140, 130, 110, 255)
        d[(32, y)] = (140, 130, 110, 255)

    draw_pixels(img, d)
    return img

# 2. バスティーユ牢獄 (bastille-fortress.png)
# 4つの巨大な円筒砲塔と分厚い石造城壁、深い堀、跳ね橋
def make_bastille():
    img = create_transparent_canvas()
    d = {}

    # 城壁ベース (y=14..39)
    for y in range(16, 40):
        for x in range(12, 36):
            c = (115, 110, 105, 255) if (x + y*2) % 3 != 0 else (95, 90, 85, 255)
            d[(x, y)] = c

    # 4つの塔（左右2本ずつ手前と奥に見える）
    # 左主塔 (x=6..14)
    for y in range(10, 41):
        for x in range(6, 15):
            dist = abs(x - 10)
            c = 135 - dist * 12
            d[(x, y)] = (c, c - 5, c - 10, 255)
    # 右主塔 (x=33..41)
    for y in range(10, 41):
        for x in range(33, 42):
            dist = abs(x - 37)
            c = 115 - dist * 10
            d[(x, y)] = (c, c - 5, c - 10, 255)
            
    # 塔の銃眼・胸壁 (y=7..10)
    for tx in [6, 33]:
        for x in range(tx, tx + 9):
            if (x - tx) % 2 == 0:
                for y in range(7, 10):
                    d[(x, y)] = (85, 80, 75, 255)
            d[(x, 10)] = (70, 65, 60, 255)
            
    # 中央城壁の胸壁 (y=13..16)
    for x in range(15, 33):
        if x % 2 == 0:
            d[(x, 13)] = (90, 85, 80, 255)
            d[(x, 14)] = (90, 85, 80, 255)
        d[(x, 15)] = (75, 70, 65, 255)

    # 狭間窓（縦長の黒い窓）
    for y in [18, 25, 32]:
        for wx in [10, 20, 27, 37]:
            d[(wx, y)] = (25, 25, 30, 255)
            d[(wx, y + 1)] = (25, 25, 30, 255)

    # 跳ね橋と城門 (中央 x=21..26, y=32..39)
    for y in range(32, 40):
        for x in range(21, 27):
            d[(x, y)] = (40, 35, 35, 255)
    # 木の跳ね橋
    for y in range(37, 43):
        for x in range(20, 28):
            d[(x, y)] = (110, 75, 45, 255) if x % 2 == 0 else (90, 60, 35, 255)
    # 鎖
    for i in range(5):
        d[(20 + i, 33 + i)] = (180, 180, 190, 255)
        d[(27 - i, 33 + i)] = (180, 180, 190, 255)

    # 堀の水 (y=41..45)
    for y in range(41, 46):
        for x in range(3, 45):
            if (x, y) not in d:
                d[(x, y)] = (45, 75, 95, 255) if (x + y) % 2 == 0 else (35, 60, 80, 255)

    draw_pixels(img, d)
    return img

# 3. ルーブル美術館 (louvre-palace.png)
# 古典主義・ルネサンス宮殿: 四角い中央楼閣、ドーム屋根、整然としたピラスター列
def make_louvre():
    img = create_transparent_canvas()
    d = {}
    
    # 中央楼閣の四角屋根 (y=8..15)
    for y in range(8, 16):
        w = 8 - (15 - y)
        for x in range(24 - w, 24 + w):
            d[(x, y)] = (50, 75, 95, 255)
    # 屋根頂点の飾り
    d[(23, 7)] = (220, 180, 50, 255)
    d[(24, 7)] = (220, 180, 50, 255)

    # 左右ウィングの屋根 (y=14..18)
    for y in range(14, 18):
        for x in range(6, 42):
            d[(x, y)] = (65, 85, 105, 255)

    # ファサード壁面（優美な淡いサンドストーン色）
    for y in range(18, 40):
        for x in range(6, 42):
            d[(x, y)] = (235, 220, 190, 255) if (x + y) % 2 == 0 else (225, 210, 180, 255)

    # 中央ペディメント（三角破風 x=20..27, y=17..20）
    for y in range(17, 21):
        w = y - 16
        for x in range(24 - w, 24 + w):
            d[(x, y)] = (245, 235, 210, 255)

    # 古典主義列柱（コロネード）と窓
    for y in range(22, 38):
        for cx in [8, 12, 16, 20, 27, 31, 35, 39]:
            d[(cx, y)] = (255, 245, 225, 255)
    # 窓
    for y in range(24, 29):
        for wx in [10, 14, 22, 25, 33, 37]:
            d[(wx, y)] = (45, 70, 95, 255)
    for y in range(32, 37):
        for wx in [10, 14, 22, 25, 33, 37]:
            d[(wx, y)] = (45, 70, 95, 255)

    # 基壇
    for y in range(40, 44):
        for x in range(4, 44):
            d[(x, y)] = (180, 170, 150, 255)

    draw_pixels(img, d)
    return img

# 4. テュイルリー宮殿 (tuileries-palace.png)
# パリ王宮、中央の丸屋根・時計塔、長い優美な回廊
def make_tuileries():
    img = create_transparent_canvas()
    d = {}

    # 中央ドーム屋根 (y=7..15, x=20..27)
    for y in range(9, 16):
        w = 5 if y > 11 else 3
        for x in range(24 - w, 24 + w):
            d[(x, y)] = (45, 65, 85, 255)
    d[(23, 7)] = (220, 190, 50, 255)
    d[(24, 7)] = (220, 190, 50, 255)
    d[(23, 8)] = (220, 190, 50, 255)
    d[(24, 8)] = (220, 190, 50, 255)

    # 左右ウィング屋根
    for y in range(14, 18):
        for x in range(5, 43):
            d[(x, y)] = (60, 80, 100, 255)

    # ファサード (y=18..39)
    for y in range(18, 40):
        for x in range(5, 43):
            d[(x, y)] = (240, 225, 195, 255)

    # 時計 (中央 x=23..24, y=20..21)
    d[(23, 20)] = (255, 255, 255, 255)
    d[(24, 20)] = (255, 255, 255, 255)
    d[(23, 21)] = (20, 20, 20, 255)
    d[(24, 21)] = (255, 255, 255, 255)

    # アーチ窓
    for y in range(23, 29):
        for wx in [7, 11, 15, 18, 29, 32, 36, 40]:
            d[(wx, y)] = (50, 75, 105, 255)
    for y in range(32, 38):
        for wx in [7, 11, 15, 18, 29, 32, 36, 40]:
            d[(wx, y)] = (40, 60, 85, 255)

    # 基壇
    for y in range(40, 44):
        for x in range(4, 44):
            d[(x, y)] = (170, 160, 145, 255)

    draw_pixels(img, d)
    return img

# 5. 廃兵院 (les-invalides.png)
# アンヴァリッド: 燦然と輝く黄金のドームと古典円柱ファサード
def make_invalides():
    img = create_transparent_canvas()
    d = {}

    # 黄金の尖塔とドーム頂点 (y=5..11)
    for y in range(5, 10):
        d[(23, y)] = (250, 220, 70, 255)
        d[(24, y)] = (250, 220, 70, 255)
    # ドーム球体 (x=16..31, y=10..19)
    for y in range(10, 20):
        w = int(8 * (1.0 - ((y - 15) / 6.0)**2)**0.5) if abs(y - 15) <= 5 else 6
        for x in range(24 - w, 24 + w):
            c = (245, 210, 60, 255) if (x - 20) < w else (215, 175, 40, 255)
            d[(x, y)] = c

    # ドーム基部円形ドラム（列柱つき y=20..26, x=17..30）
    for y in range(20, 27):
        for x in range(17, 31):
            d[(x, y)] = (235, 230, 215, 255)
    for y in range(21, 26):
        for cx in [18, 21, 24, 27, 29]:
            d[(cx, y)] = (255, 250, 240, 255)

    # 聖堂本体（古典主義ファサード y=27..41, x=10..37）
    for y in range(27, 42):
        for x in range(10, 38):
            d[(x, y)] = (230, 225, 210, 255)

    # 三角破風ペディメント (y=27..30, x=18..29)
    for y in range(27, 31):
        w = y - 26
        for x in range(24 - w*2, 24 + w*2):
            d[(x, y)] = (245, 240, 230, 255)

    # 正面大列柱
    for y in range(31, 41):
        for cx in [13, 16, 20, 23, 24, 27, 31, 34]:
            d[(cx, y)] = (255, 250, 240, 255)
    # 入口アーチ
    for y in range(34, 41):
        for x in range(22, 26):
            d[(x, y)] = (60, 50, 45, 255)

    # 基壇階段
    for y in range(41, 45):
        for x in range(8, 40):
            d[(x, y)] = (185, 180, 170, 255)

    draw_pixels(img, d)
    return img

# 6. エスコリアル宮殿 (el-escorial.png)
# フェリペ2世の厳格な花崗岩宮殿修道院: 灰色の壁、四隅の方形尖塔、中央大聖堂ドーム
def make_escorial():
    img = create_transparent_canvas()
    d = {}

    # 中央聖堂ドーム (x=21..27, y=10..18)
    for y in range(10, 16):
        w = 3 if y < 13 else 4
        for x in range(24 - w, 24 + w):
            d[(x, y)] = (75, 80, 85, 255)
    d[(23, 8)] = (180, 180, 190, 255)
    d[(24, 8)] = (180, 180, 190, 255)

    # 四隅の鋭い尖塔（左右端に見える）
    for tx in [7, 39]:
        for y in range(9, 17):
            w = (y - 8) // 3
            for x in range(tx - w, tx + w + 1):
                d[(x, y)] = (55, 60, 65, 255)

    # 宮殿本体（厳格なグリッド、灰色の花崗岩壁 y=17..39, x=6..42）
    for y in range(17, 40):
        for x in range(6, 42):
            d[(x, y)] = (165, 165, 170, 255) if (x + y) % 2 == 0 else (150, 150, 155, 255)

    # 無数の小さな方形窓（フェリペ2世の几帳面な修道院グリッド）
    for y in range(20, 38, 4):
        for x in range(8, 41, 3):
            d[(x, y)] = (40, 40, 45, 255)
            d[(x, y + 1)] = (40, 40, 45, 255)

    # 中央正面門 (x=22..25, y=33..39)
    for y in range(33, 40):
        for x in range(22, 26):
            d[(x, y)] = (50, 45, 45, 255)

    # 地面
    for y in range(40, 44):
        for x in range(4, 44):
            d[(x, y)] = (130, 125, 120, 255)

    draw_pixels(img, d)
    return img

# 7. サンスーシ宮殿 (sanssouci-palace.png)
# フリードリヒ大王のロココ離宮: 浅い緑のドーム、黄色の壁面、段々畑のテラス
def make_sanssouci():
    img = create_transparent_canvas()
    d = {}

    # 中央の浅い緑色ドーム (x=20..27, y=12..18)
    for y in range(12, 19):
        w = 4 if y > 14 else 3
        for x in range(24 - w, 24 + w):
            d[(x, y)] = (70, 130, 110, 255)
    d[(23, 10)] = (230, 200, 60, 255)
    d[(24, 10)] = (230, 200, 60, 255)

    # 平屋のロココ宮殿壁（鮮やかなサンイエロー・金色飾り y=19..30, x=8..40）
    for y in range(19, 31):
        for x in range(8, 40):
            d[(x, y)] = (245, 215, 90, 255) if (x + y) % 2 == 0 else (235, 200, 75, 255)

    # カリアティード（女像柱）とフランス窓
    for y in range(21, 29):
        for cx in [10, 15, 20, 27, 32, 37]:
            d[(cx, y)] = (255, 245, 220, 255)
    for y in range(22, 29):
        for wx in [12, 17, 22, 25, 29, 34]:
            d[(wx, y)] = (60, 95, 125, 255)

    # 手すり・欄干 (y=18)
    for x in range(8, 40):
        d[(x, 18)] = (220, 180, 50, 255)

    # 葡萄畑の段々テラス（緑と石垣の6段テラス y=31..44）
    for t, ty in enumerate([31, 33, 35, 37, 39, 41]):
        w_t = 18 + t * 2
        for x in range(24 - w_t, 24 + w_t):
            d[(x, ty)] = (160, 150, 130, 255) # 石垣
            d[(x, ty + 1)] = (65, 135, 60, 255) # 葡萄の緑

    draw_pixels(img, d)
    return img

# 8. シェーンブルン宮殿 (schonbrunn-palace.png)
# ハプスブルク家の「マリア・テレジア・イエロー」、広大なバロック宮殿
def make_schonbrunn():
    img = create_transparent_canvas()
    d = {}

    # マンサード屋根（灰緑色 y=13..18）
    for y in range(13, 18):
        for x in range(6, 42):
            d[(x, y)] = (85, 110, 95, 255)
    # 中央ペディメント
    for y in range(14, 18):
        w = y - 13
        for x in range(24 - w*2, 24 + w*2):
            d[(x, y)] = (245, 220, 90, 255)

    # 壮大な黄色いファサード (マリア・テレジア・イエロー y=18..39)
    for y in range(18, 40):
        for x in range(6, 42):
            d[(x, y)] = (235, 205, 75, 255) if (x + y) % 2 == 0 else (225, 195, 65, 255)

    # 白い窓枠と緑の鎧戸（シャッター）
    for y in range(21, 27):
        for wx in range(8, 41, 4):
            d[(wx, y)] = (45, 90, 60, 255) # 緑の鎧戸
            d[(wx + 1, y)] = (250, 250, 250, 255) # 白窓
            d[(wx + 2, y)] = (45, 90, 60, 255)
    for y in range(30, 36):
        for wx in range(8, 41, 4):
            d[(wx, y)] = (45, 90, 60, 255)
            d[(wx + 1, y)] = (250, 250, 250, 255)
            d[(wx + 2, y)] = (45, 90, 60, 255)

    # 正面二重階段 (x=20..27, y=36..42)
    for y in range(37, 43):
        for x in range(18, 30):
            d[(x, y)] = (210, 200, 180, 255)

    # 敷石
    for y in range(41, 45):
        for x in range(4, 44):
            d[(x, y)] = (180, 175, 160, 255)

    draw_pixels(img, d)
    return img

# 9. エルミタージュ美術館 / 冬宮殿 (hermitage-museum.png)
# エメラルドグリーンと白の列柱、金装飾のロシア・エリザヴェータ・バロック
def make_hermitage():
    img = create_transparent_canvas()
    d = {}

    # 屋根（薄い緑・金装飾彫像 y=12..16）
    for y in range(14, 17):
        for x in range(5, 43):
            d[(x, y)] = (50, 110, 90, 255)
    # 屋根の上の金彫像
    for sx in [8, 14, 20, 24, 28, 34, 40]:
        d[(sx, 12)] = (245, 215, 60, 255)
        d[(sx, 13)] = (235, 195, 40, 255)

    # エメラルドグリーンの外壁 (y=17..39)
    for y in range(17, 40):
        for x in range(5, 43):
            d[(x, y)] = (45, 140, 120, 255) if (x + y) % 2 == 0 else (40, 130, 110, 255)

    # 白いエンタブラチュア・純白の二重列柱
    for y in range(17, 39):
        for cx in [6, 11, 16, 21, 26, 31, 36, 41]:
            d[(cx, y)] = (255, 255, 255, 255)
            d[(cx + 1, y)] = (240, 245, 245, 255)

    # 金色装飾のある窓 (y=21..26, 30..35)
    for y in range(21, 27):
        for wx in [8, 13, 18, 23, 28, 33, 38]:
            d[(wx, y)] = (30, 50, 65, 255)
            d[(wx + 1, y)] = (30, 50, 65, 255)
    for y in range(30, 36):
        for wx in [8, 13, 18, 23, 28, 33, 38]:
            d[(wx, y)] = (30, 50, 65, 255)
            d[(wx + 1, y)] = (30, 50, 65, 255)

    # 基壇（大理石 y=40..44）
    for y in range(40, 45):
        for x in range(4, 44):
            d[(x, y)] = (190, 195, 195, 255)

    draw_pixels(img, d)
    return img

# 10. プラハ城 (prague-castle.png)
# フラチャニの丘、聖ヴィート大聖堂のゴシック尖塔群と巨大な城砦
def make_prague_castle():
    img = create_transparent_canvas()
    d = {}

    # 聖ヴィート大聖堂の大尖塔 (x=16..22, y=5..24)
    for y in range(5, 15):
        w = (y - 4) // 3
        for x in range(19 - w, 19 + w + 1):
            d[(x, y)] = (45, 55, 60, 255)
    d[(19, 4)] = (210, 180, 50, 255) # 金の十字架

    # 副尖塔 (x=12..15, y=10..22)
    for y in range(10, 17):
        w = (y - 9) // 3
        for x in range(13 - w, 13 + w + 1):
            d[(x, y)] = (50, 60, 65, 255)

    # 大聖堂ゴシック身廊 (x=12..25, y=18..28)
    for y in range(18, 29):
        for x in range(12, 26):
            d[(x, y)] = (75, 80, 85, 255)
    # フライング・バットレス
    for i in range(5):
        d[(11 - i, 22 + i)] = (65, 70, 75, 255)
        d[(26 + i, 22 + i)] = (65, 70, 75, 255)

    # 王宮・城壁棟 (赤い屋根と黄色い壁 y=26..40, x=6..42)
    for y in range(26, 30):
        for x in range(6, 42):
            d[(x, y)] = (175, 65, 50, 255) # 赤い瓦屋根
    for y in range(30, 40):
        for x in range(6, 42):
            d[(x, y)] = (225, 210, 175, 255) if (x + y) % 2 == 0 else (210, 195, 160, 255)

    # 小窓
    for y in range(32, 38, 3):
        for x in range(8, 41, 4):
            d[(x, y)] = (35, 35, 40, 255)

    # 丘の岩山・城壁基部 (y=40..45)
    for y in range(40, 46):
        for x in range(4, 44):
            d[(x, y)] = (110, 105, 95, 255) if (x + y) % 2 == 0 else (90, 85, 75, 255)

    draw_pixels(img, d)
    return img

# 11. ヴァルトブルク城 (wartburg-castle.png)
# アイゼナハの山城、ロマネスク様式の主塔と木組みの館（ルターの部屋）
def make_wartburg():
    img = create_transparent_canvas()
    d = {}

    # 高い方形主塔 (ベルクフリート x=10..18, y=8..36)
    for y in range(8, 12):
        for x in range(11, 18):
            d[(x, y)] = (160, 50, 40, 255) # 赤いピラミッド屋根
    for y in range(12, 37):
        for x in range(10, 19):
            c = (145, 135, 125, 255) if (x + y) % 2 == 0 else (125, 115, 105, 255)
            d[(x, y)] = c
    # 狭間
    d[(14, 16)] = (25, 25, 30, 255)
    d[(14, 23)] = (25, 25, 30, 255)

    # 木組みの館（パーラス・ルターの部屋 x=19..38, y=18..37）
    # 急勾配の赤屋根
    for y in range(18, 24):
        w = (y - 17) * 2
        for x in range(20, 20 + w):
            if x <= 38:
                d[(x, y)] = (180, 60, 45, 255)
    for y in range(24, 30):
        for x in range(19, 39):
            d[(x, y)] = (185, 65, 50, 255)

    # 木組み壁（白壁＋茶色の木骨）
    for y in range(30, 38):
        for x in range(19, 39):
            # 木組みパターン
            is_timber = (y == 30 or y == 37 or (x in [19, 25, 31, 38]) or (x + y) % 6 == 0)
            d[(x, y)] = (85, 50, 30, 255) if is_timber else (235, 230, 215, 255)

    # 小窓
    for wx in [22, 28, 34]:
        d[(wx, 33)] = (40, 55, 75, 255)
        d[(wx, 34)] = (40, 55, 75, 255)

    # 城壁と山の岩盤 (y=37..44)
    for y in range(37, 45):
        for x in range(6, 42):
            if (x, y) not in d:
                d[(x, y)] = (110, 105, 95, 255)

    draw_pixels(img, d)
    return img

# 12. ゼーランディア城 (zeelandia-fort.png)
# 台湾・台南のオランダ星形要塞: 赤レンガの稜堡、中央のオランダ風段状破風監視塔
def make_zeelandia():
    img = create_transparent_canvas()
    d = {}

    # オランダ風段状破風監視塔 (x=20..27, y=10..26)
    # 段々破風 (y=10..15)
    for step, y in enumerate([10, 11, 12, 13, 14, 15]):
        w = step + 1
        for x in range(24 - w, 24 + w):
            d[(x, y)] = (175, 55, 45, 255)
    # 塔本体 (y=16..26)
    for y in range(16, 27):
        for x in range(20, 28):
            d[(x, y)] = (165, 50, 40, 255) if (x + y) % 2 == 0 else (150, 45, 35, 255)
    # オランダ国旗（赤白青）
    d[(23, 7)] = (200, 30, 30, 255)
    d[(24, 7)] = (200, 30, 30, 255)
    d[(23, 8)] = (240, 240, 240, 255)
    d[(24, 8)] = (240, 240, 240, 255)
    d[(23, 9)] = (30, 60, 160, 255)
    d[(24, 9)] = (30, 60, 160, 255)

    # レンガ造の城壁と稜堡（星形要塞の角 y=26..40, x=8..40）
    for y in range(26, 40):
        for x in range(8, 40):
            d[(x, y)] = (185, 65, 50, 255) if (x + y*2) % 3 != 0 else (155, 45, 35, 255)

    # 稜堡の突角ライン
    for y in range(28, 40):
        d[(8 + (y - 28)//2, y)] = (210, 85, 65, 255)
        d[(39 - (y - 28)//2, y)] = (120, 35, 30, 255)

    # 砲門
    for bx in [13, 18, 29, 34]:
        d[(bx, 33)] = (30, 30, 30, 255)
        d[(bx + 1, 33)] = (30, 30, 30, 255)
        # 大砲の筒
        d[(bx, 34)] = (70, 75, 80, 255)

    # 海・砂浜 (y=40..45)
    for y in range(40, 45):
        for x in range(4, 44):
            d[(x, y)] = (220, 205, 160, 255) if y < 42 else (55, 110, 145, 255)

    draw_pixels(img, d)
    return img

# 13. 聖マリア＝デッレ＝グラツィエ教会 (santa-maria-grazie.png)
# ミラノ（最後の晩餐）: ブラマンテ設計の赤レンガと白い大理石の円形クーポラ（半球ドーム）
def make_santa_maria():
    img = create_transparent_canvas()
    d = {}

    # ドーム頂点の小ランタン (y=8..12, x=22..25)
    for y in range(8, 13):
        for x in range(22, 26):
            d[(x, y)] = (235, 230, 215, 255)
    d[(23, 7)] = (210, 175, 40, 255)
    d[(24, 7)] = (210, 175, 40, 255)

    # 円形クーポラ（半球ドーム y=13..21, x=15..32）
    for y in range(13, 22):
        w = int(9 * (1.0 - ((y - 17) / 5.0)**2)**0.5) if abs(y - 17) <= 4 else 8
        for x in range(24 - w, 24 + w):
            d[(x, y)] = (175, 65, 50, 255) if (x + y) % 2 == 0 else (160, 55, 40, 255)

    # ブラマンテの円形ドラム（赤レンガと白い丸窓・アーチ列柱 y=22..30, x=14..33）
    for y in range(22, 31):
        for x in range(14, 34):
            d[(x, y)] = (170, 60, 45, 255)
    # 白いテラコッタ円形装飾（オキュルス）
    for cx in [16, 20, 24, 28, 31]:
        d[(cx, 25)] = (245, 240, 230, 255)
        d[(cx, 26)] = (35, 30, 30, 255)

    # 身廊・側廊 (y=31..41, x=8..39)
    for y in range(31, 42):
        for x in range(8, 40):
            d[(x, y)] = (165, 55, 40, 255)
    # ゴシック・ルネサンスアーチ窓
    for y in range(34, 40):
        for wx in [11, 17, 23, 24, 30, 36]:
            d[(wx, y)] = (45, 60, 75, 255)

    # 基壇
    for y in range(41, 45):
        for x in range(6, 42):
            d[(x, y)] = (175, 170, 155, 255)

    draw_pixels(img, d)
    return img

# 14. システィナ礼拝堂 (sistine-chapel.png)
# ヴァチカンの直方体レンガ礼拝堂、高い側窓（ミケランジェロの天井画・最後の審判）
def make_sistine():
    img = create_transparent_canvas()
    d = {}

    # 切妻屋根（淡い赤褐色 y=12..17）
    for y in range(12, 17):
        w = (y - 11) * 2
        for x in range(14, 14 + w):
            if x <= 34:
                d[(x, y)] = (165, 75, 60, 255)
    for y in range(14, 18):
        for x in range(14, 35):
            d[(x, y)] = (155, 70, 55, 255)

    # 重厚なレンガ造直方体壁面 (y=18..40, x=12..36)
    for y in range(18, 41):
        for x in range(12, 36):
            d[(x, y)] = (185, 145, 105, 255) if (x + y) % 2 == 0 else (170, 130, 95, 255)

    # 礼拝堂の有名なアーチ高窓（光が差し込む窓 y=22..28）
    for y in range(22, 29):
        for wx in [15, 20, 27, 32]:
            d[(wx, y)] = (65, 90, 115, 255)
            d[(wx + 1, y)] = (85, 110, 135, 255)

    # 控え壁（ピラスター）
    for y in range(18, 41):
        for px in [12, 18, 24, 30, 35]:
            d[(px, y)] = (195, 155, 115, 255)

    # 基部
    for y in range(41, 45):
        for x in range(10, 38):
            d[(x, y)] = (140, 130, 120, 255)

    draw_pixels(img, d)
    return img

# 15. ヴァチカン宮殿 (vatican-palace.png)
# 教皇庁宮殿: イタリア・ルネサンスの大規模宮殿、中庭回廊、教皇執務室
def make_vatican_palace():
    img = create_transparent_canvas()
    d = {}

    # 屋根（茶褐色スレート・コーニス y=14..18）
    for y in range(14, 19):
        for x in range(8, 40):
            d[(x, y)] = (145, 80, 65, 255)

    # 宮殿外壁（温かみのあるトラバーチン・ローマンストーン色 y=19..40）
    for y in range(19, 41):
        for x in range(8, 40):
            d[(x, y)] = (240, 225, 195, 255) if (x + y) % 2 == 0 else (225, 210, 180, 255)

    # 3層のルネサンス窓（ペディメント付き）
    # 最上階 (教皇の部屋: 窓から祝福)
    for y in range(21, 26):
        for wx in [12, 18, 24, 30, 35]:
            d[(wx, y)] = (45, 65, 90, 255)
            d[(wx, y - 1)] = (210, 175, 45, 255) # 三角破風
    # 中層
    for y in range(28, 33):
        for wx in [12, 18, 24, 30, 35]:
            d[(wx, y)] = (45, 65, 90, 255)
    # 1階アーケード
    for y in range(35, 41):
        for wx in [12, 18, 24, 30, 35]:
            d[(wx, y)] = (60, 50, 45, 255)

    # 敷石
    for y in range(41, 45):
        for x in range(6, 42):
            d[(x, y)] = (185, 175, 160, 255)

    draw_pixels(img, d)
    return img

# 16. パレ＝ロワイヤル (palais-royal.png)
# オルレアン公邸・革命の発火点: 美しい中庭回廊、赤い屋根、カフェと演説の広場
def make_palais_royal():
    img = create_transparent_canvas()
    d = {}

    # マンサード屋根 (y=13..18)
    for y in range(13, 18):
        for x in range(6, 42):
            d[(x, y)] = (55, 75, 95, 255)
    # ドーマー窓
    for dx in [10, 17, 24, 31, 37]:
        d[(dx, 14)] = (240, 230, 210, 255)
        d[(dx, 15)] = (40, 60, 80, 255)

    # ファサード (y=18..33)
    for y in range(18, 34):
        for x in range(6, 42):
            d[(x, y)] = (245, 235, 210, 255) if (x + y) % 2 == 0 else (235, 225, 200, 255)

    # 2階の優美な長窓
    for y in range(21, 28):
        for wx in [9, 14, 20, 27, 33, 38]:
            d[(wx, y)] = (50, 80, 115, 255)

    # 1階の連続アーケード（回廊 y=29..40）
    for y in range(29, 41):
        for x in range(6, 42):
            # 列柱
            if x in [7, 12, 17, 22, 25, 30, 35, 40]:
                d[(x, y)] = (255, 250, 235, 255)
            elif y >= 32:
                d[(x, y)] = (40, 35, 30, 255) # 回廊の影

    # カミーユ・デムーランが演説した中庭
    for y in range(41, 45):
        for x in range(4, 44):
            d[(x, y)] = (200, 190, 170, 255)

    draw_pixels(img, d)
    return img

# 17. タンプル塔 (temple-tower.png)
# 中世テンプル騎士団の方形石塔、ルイ16世幽閉の頑丈な四角塔と4つの円形隅塔
def make_temple_tower():
    img = create_transparent_canvas()
    d = {}

    # 中央方形塔の屋根 (y=8..13, x=17..30)
    for y in range(8, 14):
        w = y - 7
        for x in range(24 - w, 24 + w):
            d[(x, y)] = (55, 60, 65, 255)

    # 4つの隅の円筒小塔（左右に見える）
    for tx in [13, 34]:
        for y in range(7, 14):
            w = (y - 6) // 2
            for x in range(tx - w, tx + w + 1):
                d[(x, y)] = (45, 50, 55, 255)
        for y in range(14, 38):
            for x in range(tx - 2, tx + 3):
                d[(x, y)] = (120, 115, 110, 255) if (x + y) % 2 == 0 else (105, 100, 95, 255)

    # 中央の頑丈な石造大塔本体 (y=14..40, x=15..32)
    for y in range(14, 41):
        for x in range(15, 33):
            d[(x, y)] = (135, 130, 120, 255) if (x + y) % 2 == 0 else (120, 115, 105, 255)

    # 狭間窓（王家幽閉の鉄格子窓）
    for y in [18, 25, 32]:
        for wx in [19, 28]:
            d[(wx, y)] = (25, 25, 30, 255)
            d[(wx, y + 1)] = (25, 25, 30, 255)
            # 鉄格子
            d[(wx, y)] = (160, 160, 170, 255)

    # 重厚な入口扉 (y=34..40, x=22..25)
    for y in range(34, 41):
        for x in range(22, 26):
            d[(x, y)] = (50, 35, 25, 255)

    # 地面
    for y in range(41, 45):
        for x in range(8, 39):
            d[(x, y)] = (95, 90, 85, 255)

    draw_pixels(img, d)
    return img


def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    target_dir = os.path.join(base_dir, 'public/images/ancient')
    os.makedirs(target_dir, exist_ok=True)
    
    buildings = {
        'versailles-palace.png': make_versailles(),
        'bastille-fortress.png': make_bastille(),
        'louvre-palace.png': make_louvre(),
        'tuileries-palace.png': make_tuileries(),
        'les-invalides.png': make_invalides(),
        'el-escorial.png': make_escorial(),
        'sanssouci-palace.png': make_sanssouci(),
        'schonbrunn-palace.png': make_schonbrunn(),
        'hermitage-museum.png': make_hermitage(),
        'prague-castle.png': make_prague_castle(),
        'wartburg-castle.png': make_wartburg(),
        'zeelandia-fort.png': make_zeelandia(),
        'santa-maria-grazie.png': make_santa_maria(),
        'sistine-chapel.png': make_sistine(),
        'vatican-palace.png': make_vatican_palace(),
        'palais-royal.png': make_palais_royal(),
        'temple-tower.png': make_temple_tower()
    }

    for filename, img in buildings.items():
        path = os.path.join(target_dir, filename)
        img.save(path, 'PNG')
        # Alpha verification
        non_zero_alphas = [a for _, _, _, a in img.getdata() if a != 0]
        invalid_alphas = [a for a in non_zero_alphas if a != 255]
        assert len(invalid_alphas) == 0, f"{filename} has non-binary alpha: {invalid_alphas[:5]}"
        print(f"Rendered {filename}: 48x48, transparent verified.")

if __name__ == '__main__':
    main()
