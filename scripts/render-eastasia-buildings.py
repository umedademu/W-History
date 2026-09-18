import os
from PIL import Image
import numpy as np

BASE_DIR = r"c:\Users\USER\Desktop\W-History"
OUT_DIR = os.path.join(BASE_DIR, "public", "images", "ancient")
os.makedirs(OUT_DIR, exist_ok=True)

def create_building(name, render_func):
    grid = np.zeros((48, 48, 4), dtype=np.uint8)
    render_func(grid)
    img48 = Image.fromarray(grid)
    img192 = img48.resize((192, 192), Image.Resampling.NEAREST)
    out_path = os.path.join(OUT_DIR, f"{name}.png")
    img192.save(out_path, "PNG")
    print(f"Created authentic building pixel art: {name}.png")

c_line = [30, 30, 35, 255]
c_shadow = [45, 45, 55, 255]

# 1. 紫禁城 (Forbidden City - Hall of Supreme Harmony)
def render_forbidden_city(g):
    c_gold = [245, 195, 35, 255]
    c_gold_dark = [190, 140, 20, 255]
    c_red = [180, 35, 30, 255]
    c_red_dark = [120, 20, 20, 255]
    c_white = [240, 240, 245, 255]
    c_marble_shad = [180, 185, 195, 255]
    c_door = [90, 15, 15, 255]
    
    # 3-Tier Marble Terrace (Base)
    g[43:46, 4:44] = c_white; g[45, 4:44] = c_marble_shad
    g[40:43, 6:42] = c_white; g[42, 6:42] = c_marble_shad
    g[37:40, 8:40] = c_white; g[39, 8:40] = c_marble_shad
    # Central dragon ramp (Danbi)
    g[37:46, 22:26] = [160, 180, 200, 255]
    
    # Main Pavilion Hall (Vermilion columns & walls)
    g[22:37, 10:38] = c_red
    g[22:37, 10] = c_red_dark; g[22:37, 37] = c_red_dark
    # Columns
    for col_x in [13, 17, 21, 27, 31, 35]:
        g[23:37, col_x] = c_red_dark
    # Central Throne Doors
    g[28:37, 22:26] = c_door
    
    # Lower Eave (Double-eaved hip-and-gable roof)
    for i in range(4):
        # Eave sweep
        y = 21 - i
        x1 = 7 + i * 2
        x2 = 41 - i * 2
        g[y, x1:x2] = c_gold
        g[y, x1] = c_gold_dark; g[y, x2-1] = c_gold_dark
    # Eave curved wings
    g[20, 6] = c_gold; g[19, 5] = c_gold; g[20, 41] = c_gold; g[19, 42] = c_gold
    
    # Upper Story Wall
    g[14:18, 14:34] = c_red
    for col_x in [16, 20, 24, 28, 32]:
        g[14:18, col_x] = c_red_dark
        
    # Upper Main Roof (Golden hip roof)
    for i in range(7):
        y = 13 - i
        x1 = 10 + i * 2
        x2 = 38 - i * 2
        g[y, x1:x2] = c_gold
        g[y, x1] = c_gold_dark; g[y, x2-1] = c_gold_dark
    # Main ridge and imperial ridge beasts (Chiwen)
    g[7, 18:30] = c_gold
    g[6, 17] = c_gold_dark; g[6, 30] = c_gold_dark
    # Eave upturns
    g[13, 9] = c_gold; g[12, 8] = c_gold; g[13, 38] = c_gold; g[12, 39] = c_gold

# 2. 円明園 (Old Summer Palace - Western Baroque Pavilion Dashuifa)
def render_yuanmingyuan(g):
    c_stone_light = [230, 230, 235, 255]
    c_stone_mid = [175, 180, 190, 255]
    c_stone_dark = [115, 120, 130, 255]
    c_water = [80, 190, 235, 255]
    c_water_spray = [200, 245, 255, 255]
    
    # Base and Fountain Pools
    g[41:46, 5:43] = c_stone_mid
    g[42:45, 12:36] = c_water
    # Fountain jets
    for fx in [16, 24, 32]:
        g[37:42, fx] = c_water_spray
        g[36, fx-1:fx+2] = c_water_spray
    
    # Baroque Main Stone Façade
    g[18:41, 10:38] = c_stone_light
    g[18:41, 10] = c_stone_dark; g[18:41, 37] = c_stone_dark
    
    # Classical Pilasters / Columns
    for px in [12, 16, 20, 27, 31, 35]:
        g[19:41, px:px+2] = c_stone_mid
        g[18, px-1:px+3] = c_stone_dark # Capital
        
    # Central Grand Roman Arch
    g[26:41, 22:26] = c_stone_dark
    g[25, 23:25] = c_stone_dark
    # Side arched niches
    g[28:36, 14] = c_stone_dark
    g[28:36, 33] = c_stone_dark
    
    # Entablature & Cornice
    g[16:18, 9:39] = c_stone_mid
    g[16, 9:39] = c_stone_light
    
    # Baroque Curved Pediment (Segmental / Broken Arch)
    for i in range(5):
        y = 15 - i
        g[y, 16 + i : 32 - i] = c_stone_light
        g[y, 16 + i] = c_stone_dark; g[y, 31 - i] = c_stone_dark
    # Central baroque cartouche / shell sculpture
    g[11:15, 22:26] = [210, 195, 140, 255]
    # Stone Urns on balustrade
    g[13:16, 11] = c_stone_dark; g[13:16, 36] = c_stone_dark

# 3. 東林書院 (Donglin Academy - Jiangnan Scholarly Academy)
def render_donglin(g):
    c_wall = [235, 235, 240, 255]
    c_tile = [60, 65, 75, 255]
    c_tile_light = [100, 105, 120, 255]
    c_wood = [120, 65, 40, 255]
    c_wood_dark = [70, 35, 20, 255]
    c_courtyard = [160, 165, 150, 255]
    
    # Courtyard Base
    g[42:46, 6:42] = c_courtyard
    g[45, 6:42] = c_tile
    
    # White Plaster Enclosure Walls
    g[26:42, 6:15] = c_wall; g[26:42, 33:42] = c_wall
    g[25, 5:16] = c_tile; g[25, 32:43] = c_tile
    
    # Central Lecture Hall (Lize Hall / Yiyong Hall)
    g[22:42, 15:33] = c_wood
    # Lattice paper windows & doors
    g[28:38, 18:22] = [220, 215, 190, 255]
    g[28:38, 26:30] = [220, 215, 190, 255]
    g[28:38, 20] = c_wood_dark; g[28:38, 28] = c_wood_dark
    # Entrance plaque (Donglin Shuyuan)
    g[24:26, 21:27] = [40, 40, 50, 255]
    g[25, 22:26] = [230, 200, 50, 255] # Gold characters
    
    # Traditional Upturned Flying Eaves (Roof)
    for i in range(7):
        y = 21 - i
        x1 = 12 + i * 2
        x2 = 36 - i * 2
        g[y, x1:x2] = c_tile
        g[y, x1] = c_tile_light; g[y, x2-1] = c_tile_light
    # Distinctive Jiangnan Upturned Wingtips
    g[21, 10:12] = c_tile_light; g[20, 9] = c_tile_light; g[19, 8] = c_tile_light
    g[21, 36:38] = c_tile_light; g[20, 38] = c_tile_light; g[19, 39] = c_tile_light
    # Roof Ridge
    g[15, 18:30] = c_tile_light

# 4. アンコール＝ワット (Angkor Wat - 5 Lotus Towers)
def render_angkor_wat(g):
    c_stone = [120, 115, 105, 255]
    c_stone_hi = [170, 165, 150, 255]
    c_stone_shad = [70, 65, 55, 255]
    c_water = [60, 110, 140, 255]
    
    # Moat (Outer water)
    g[44:46, 2:46] = c_water
    # Stepped Terrace Base
    g[40:44, 4:44] = c_stone; g[40, 4:44] = c_stone_hi
    g[36:40, 7:41] = c_stone; g[36, 7:41] = c_stone_hi
    g[32:36, 10:38] = c_stone; g[32, 10:38] = c_stone_hi
    
    # Galleried Porticoes with Pillar colonnades
    for x in range(8, 40, 3):
        g[33:40, x] = c_stone_shad
        
    # Function to draw a Khmer Lotus-Bud Tower
    def draw_lotus_tower(cx, base_y, height, width):
        for h in range(height):
            y = base_y - h
            # Stepped narrowing with lotus curves
            factor = (h / height)
            w = int(width * (1.0 - factor * 0.75))
            if h % 3 == 0:
                w += 1 # Tier ledge
            g[y, cx - w : cx + w + 1] = c_stone
            g[y, cx - w] = c_stone_hi
            g[y, cx + w] = c_stone_shad
        # Lotus Spire Tip
        g[base_y - height - 1, cx] = c_stone_hi
        g[base_y - height - 2, cx] = [230, 210, 80, 255] # Gold finial
        
    # 4 Corner Towers
    draw_lotus_tower(13, 32, 16, 4)
    draw_lotus_tower(34, 32, 16, 4)
    draw_lotus_tower(18, 28, 19, 4)
    draw_lotus_tower(29, 28, 19, 4)
    
    # Central Sanctuary Tower (Bakan - Highest, colossal)
    draw_lotus_tower(24, 28, 24, 6)

# 5. アンコール＝トム (Angkor Thom - Bayon with Serene Giant Stone Faces)
def render_angkor_thom(g):
    c_stone = [115, 120, 110, 255]
    c_stone_hi = [165, 170, 155, 255]
    c_stone_shad = [65, 70, 60, 255]
    
    # Terraced Mountain Sanctuary Base
    g[41:46, 5:43] = c_stone; g[41, 5:43] = c_stone_hi
    g[36:41, 8:40] = c_stone; g[36, 8:40] = c_stone_hi
    g[31:36, 12:36] = c_stone; g[31, 12:36] = c_stone_hi
    
    # Face Tower Drawer
    def draw_face_tower(cx, base_y, height, width):
        # Tower body
        for h in range(height):
            y = base_y - h
            w = int(width * (1.0 - (h / height) * 0.4))
            g[y, cx - w : cx + w + 1] = c_stone
            g[y, cx - w] = c_stone_hi
            g[y, cx + w] = c_stone_shad
        # Giant Serene Smiling Face (Lokeshvara)
        face_y = base_y - height // 2
        # Brow line
        g[face_y - 2, cx - 2 : cx + 3] = c_stone_hi
        # Closed peaceful eyes
        g[face_y - 1, cx - 2] = c_stone_shad; g[face_y - 1, cx + 2] = c_stone_shad
        # Broad nose
        g[face_y, cx] = c_stone_hi
        # Serene Angkor smile
        g[face_y + 1, cx - 2 : cx + 3] = c_stone_shad
        g[face_y + 1, cx - 1 : cx + 2] = c_stone_hi
        # Crown top
        g[base_y - height, cx - 1 : cx + 2] = c_stone_hi
        g[base_y - height - 1, cx] = c_stone_hi
        
    # Side Face Towers
    draw_face_tower(15, 31, 16, 5)
    draw_face_tower(32, 31, 16, 5)
    
    # Central Massive Tower of Bayon
    draw_face_tower(24, 28, 22, 7)

# 6. ボロブドゥール (Borobudur - Stepped Pyramid & Perforated Bell Stupas)
def render_borobudur(g):
    c_andesite = [85, 90, 95, 255] # Volcanic stone
    c_andesite_hi = [135, 140, 145, 255]
    c_andesite_shad = [50, 55, 60, 255]
    
    # 6 Square Stepped Terraces
    g[43:46, 3:45] = c_andesite; g[43, 3:45] = c_andesite_hi
    g[39:43, 6:42] = c_andesite; g[39, 6:42] = c_andesite_hi
    g[35:39, 9:39] = c_andesite; g[35, 9:39] = c_andesite_hi
    g[31:35, 12:36] = c_andesite; g[31, 12:36] = c_andesite_hi
    g[27:31, 15:33] = c_andesite; g[27, 15:33] = c_andesite_hi
    
    # 3 Circular Upper Terraces
    g[23:27, 17:31] = c_andesite; g[23, 17:31] = c_andesite_hi
    g[19:23, 19:29] = c_andesite; g[19, 19:29] = c_andesite_hi
    
    # Small Perforated Bell Stupas along the terraces
    for stupa_x in [13, 17, 21, 27, 31, 35]:
        g[29:31, stupa_x-1:stupa_x+2] = c_andesite_hi
        g[28, stupa_x] = c_andesite_shad # Stupa spire
        
    for stupa_x in [19, 23, 25, 29]:
        g[21:23, stupa_x-1:stupa_x+2] = c_andesite_hi
        g[20, stupa_x] = c_andesite_shad
        
    # Grand Central Stupa (Culminating Monument)
    # Bell body
    for y in range(12, 19):
        w = 19 - y
        g[y, 24 - w : 25 + w] = c_andesite
        g[y, 24 - w] = c_andesite_hi
        g[y, 24 + w] = c_andesite_shad
    # Central Stupa Pinnacle Spire
    g[7:12, 24] = c_andesite_hi
    g[6, 24] = [225, 210, 100, 255] # Pinnacle tip

# 7. プランバナン (Prambanan - Towering Hindu Shiva Temple)
def render_prambanan(g):
    c_stone = [100, 95, 90, 255]
    c_stone_hi = [155, 150, 140, 255]
    c_stone_shad = [55, 50, 45, 255]
    c_gold = [230, 200, 70, 255]
    
    # Temple Platform Base
    g[42:46, 6:42] = c_stone; g[42, 6:42] = c_stone_hi; g[45, 6:42] = c_line
    
    # Helper to draw a soaring pointed Hindu Prasat spire
    def draw_prasat(cx, base_y, height, width):
        for h in range(height):
            y = base_y - h
            factor = (h / height)
            w = int(width * (1.0 - factor * 0.8))
            # Stepped tiers with ornate corners
            if h % 3 == 0:
                w += 1
            g[y, cx - w : cx + w + 1] = c_stone
            g[y, cx - w] = c_stone_hi
            g[y, cx + w] = c_stone_shad
        # Pointed Amalaka / Ratna Crown
        g[base_y - height - 1, cx - 1 : cx + 2] = c_gold
        g[base_y - height - 2, cx] = c_gold
        
    # Side Shrines (Brahma and Vishnu temples)
    draw_prasat(14, 42, 26, 6)
    draw_prasat(33, 42, 26, 6)
    
    # Central Shiva Temple (Shiva Mahadeva - 47 meters towering spire)
    draw_prasat(24, 42, 38, 8)
    # Entrance Stairway & Arch (Kala-Makara)
    g[36:42, 22:26] = c_stone_shad
    g[35, 23:25] = c_gold

if __name__ == "__main__":
    create_building("forbidden-city", render_forbidden_city)
    create_building("yuanmingyuan-palace", render_yuanmingyuan)
    create_building("donglin-academy", render_donglin)
    create_building("angkor-wat", render_angkor_wat)
    create_building("angkor-thom", render_angkor_thom)
    create_building("borobudur-temple", render_borobudur)
    create_building("prambanan-temple", render_prambanan)
    print("All 7 Chapter 5 authentic pixel-art buildings rendered successfully!")
