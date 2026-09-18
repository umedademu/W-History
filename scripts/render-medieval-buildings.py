import os
from PIL import Image
import numpy as np

OUT_DIR = r"c:\Users\USER\Desktop\W-History\public\images\ancient"
os.makedirs(OUT_DIR, exist_ok=True)

def create_building(name, render_func):
    grid = np.zeros((48, 48, 4), dtype=np.uint8)
    render_func(grid)
    img48 = Image.fromarray(grid)
    img192 = img48.resize((192, 192), Image.Resampling.NEAREST)
    out_path = os.path.join(OUT_DIR, f"{name}.png")
    img192.save(out_path, "PNG")
    print(f"Created authentic building pixel art: {name}.png")

# Palette constants
c_line = [35, 40, 50, 255]
c_gold = [240, 210, 50, 255]
c_shadow = [55, 60, 70, 255]

# 1. Notre Dame de Paris (Paris)
def render_notre_dame(g):
    c_mid = [135, 140, 150, 255]
    c_hi = [190, 195, 205, 255]
    c_lo = [90, 95, 105, 255]
    c_spire = [65, 80, 100, 255]
    c_glass = [190, 40, 70, 255]
    # Base
    g[42:46, 6:42] = c_lo
    g[42, 6:42] = c_hi
    g[45, 6:42] = c_line
    # Towers
    g[10:42, 8:18] = c_mid; g[10:42, 8] = c_line; g[10:42, 17] = c_line; g[9, 8:18] = c_line; g[10, 9:17] = c_hi
    g[13:20, 10:13] = c_shadow; g[13:20, 14:17] = c_shadow
    g[10:42, 30:40] = c_mid; g[10:42, 30] = c_line; g[10:42, 39] = c_line; g[9, 30:40] = c_line; g[10, 31:39] = c_hi
    g[13:20, 31:34] = c_shadow; g[13:20, 35:38] = c_shadow
    # Nave
    g[20:42, 18:30] = c_mid; g[20, 18:30] = c_hi
    g[30, 8:40] = c_hi; g[31, 8:40] = c_shadow
    for x in range(9, 39, 2): g[31, x] = c_hi
    # Rose Window
    g[23:29, 21:27] = c_glass; g[25:27, 23:25] = c_gold
    g[22, 23:25] = c_line; g[29, 23:25] = c_line; g[24:28, 20] = c_line; g[24:28, 27] = c_line
    # Portals
    g[35:42, 11:15] = c_shadow; g[34:42, 22:26] = c_shadow; g[35:42, 33:37] = c_shadow
    # Spire & Cross
    g[3:20, 23:25] = c_spire; g[1, 23:25] = c_gold; g[3, 21:27] = c_gold

# 2. Chartres Cathedral (Asymmetrical Spires & Chartres Blue)
def render_chartres(g):
    c_mid = [140, 145, 155, 255]
    c_hi = [195, 200, 210, 255]
    c_blue = [30, 90, 200, 255]
    c_roof = [50, 110, 140, 255]
    # Base
    g[42:46, 6:42] = c_mid; g[45, 6:42] = c_line
    # Left Spire (Gothic Flamboyant - Taller, intricate)
    for y in range(4, 18):
        rw = (y - 3) // 2
        g[y, 13 - rw : 14 + rw] = c_roof
    g[18:42, 8:18] = c_mid; g[18:42, 8] = c_line; g[18:42, 17] = c_line
    g[2, 13] = c_gold; g[3, 12:15] = c_gold # Cross
    # Right Spire (Romanesque Pyramid - Simpler)
    for y in range(8, 20):
        rw = (y - 7) // 2
        g[y, 35 - rw : 36 + rw] = c_mid
    g[20:42, 30:40] = c_mid; g[20:42, 30] = c_line; g[20:42, 39] = c_line
    # Nave & Chartres Blue Rose
    g[22:42, 18:30] = c_mid; g[22, 18:30] = c_hi
    g[25:31, 21:27] = c_blue; g[27:29, 23:25] = c_gold
    # Portals (Royal Portal)
    g[35:42, 11:15] = c_line; g[34:42, 22:26] = c_line; g[35:42, 33:37] = c_line

# 3. Cologne Cathedral (Gigantic Dark Twin Spires)
def render_cologne(g):
    c_dark = [40, 45, 55, 255]
    c_stone = [65, 70, 80, 255]
    c_hi = [100, 105, 120, 255]
    # Base
    g[42:46, 4:44] = c_stone; g[45, 4:44] = c_dark
    # Left Twin Spire
    for y in range(2, 22):
        rw = (y - 1) // 3
        g[y, 13 - rw : 14 + rw] = c_stone
        g[y, 13 - rw] = c_hi; g[y, 13 + rw] = c_dark
    g[22:42, 7:19] = c_stone; g[22:42, 7] = c_dark; g[22:42, 18] = c_dark
    g[1, 13] = c_gold
    # Right Twin Spire
    for y in range(2, 22):
        rw = (y - 1) // 3
        g[y, 35 - rw : 36 + rw] = c_stone
        g[y, 35 - rw] = c_hi; g[y, 35 + rw] = c_dark
    g[22:42, 29:41] = c_stone; g[22:42, 29] = c_dark; g[22:42, 40] = c_dark
    g[1, 35] = c_gold
    # High Nave & Portal
    g[16:42, 19:29] = c_stone; g[16, 19:29] = c_hi
    g[20:30, 22:26] = c_dark # High Window
    g[33:42, 21:27] = c_dark # Deep Portal

# 4. Pisa Cathedral & Leaning Tower (White Marble & Arcades)
def render_pisa(g):
    c_white = [235, 235, 240, 255]
    c_shade = [185, 190, 200, 255]
    c_line = [60, 65, 75, 255]
    # Cathedral (Left)
    g[20:43, 6:30] = c_white; g[43, 6:30] = c_line
    # Arcades on cathedral facade
    for tier in [24, 29, 34]:
        g[tier, 6:30] = c_line
        for ax in range(7, 29, 3): g[tier+1:tier+4, ax] = c_shade
    # Dome of cathedral
    for y in range(14, 20):
        rw = 19 - y
        g[y, 22 - rw : 23 + rw] = c_shade
    # Leaning Tower of Pisa (Right, leaning rightwards!)
    for tier, y_top, y_bot, offset in [(1, 36, 43, 0), (2, 30, 36, 1), (3, 24, 30, 2), (4, 18, 24, 3), (5, 12, 18, 4), (6, 7, 12, 5)]:
        bx = 33 + offset
        g[y_top:y_bot, bx : bx + 7] = c_white
        g[y_top:y_bot, bx] = c_line; g[y_top:y_bot, bx+6] = c_line
        g[y_top, bx:bx+7] = c_shade

# 5. Worms Cathedral (Red Sandstone Romanesque)
def render_worms(g):
    c_red_mid = [170, 75, 60, 255]
    c_red_hi = [210, 110, 95, 255]
    c_red_lo = [120, 45, 35, 255]
    c_cone = [130, 140, 155, 255]
    # Main Body
    g[20:44, 10:38] = c_red_mid; g[44, 10:38] = c_line
    # Round Romanesque Towers (Left & Right)
    for y in range(6, 16):
        rw = (y - 5) // 2
        g[y, 11 - rw : 12 + rw] = c_cone
        g[y, 36 - rw : 37 + rw] = c_cone
    g[16:44, 8:15] = c_red_mid; g[16:44, 33:40] = c_red_mid
    # Octagonal Center Crossing Tower
    for y in range(8, 16):
        rw = (y - 7) // 2
        g[y, 24 - rw : 25 + rw] = c_cone
    g[16:24, 20:29] = c_red_hi
    # Round Arch windows
    for y, x in [(26, 15), (26, 24), (26, 33), (32, 15), (32, 24), (32, 33)]:
        g[y:y+4, x:x+2] = c_red_lo

# 6. Hagia Sophia (Byzantine Golden Dome & 4 Minarets)
def render_hagia_sophia(g):
    c_brick = [185, 95, 75, 255]
    c_dome = [230, 190, 50, 255]
    c_dome_lo = [170, 130, 30, 255]
    c_minaret = [215, 215, 220, 255]
    # Base
    g[28:44, 8:40] = c_brick; g[44, 8:40] = c_line
    # Huge Central Dome
    for y in range(16, 26):
        rw = int(np.sqrt(max(0, 25 - (y - 21)**2)) * 1.8)
        g[y, 24 - rw : 25 + rw] = c_dome
        g[y, 24 - rw] = c_dome_lo; g[y, 24 + rw] = c_dome_lo
    # Semi-domes
    g[25:29, 13:19] = c_dome_lo; g[25:29, 30:36] = c_dome_lo
    # 4 Slender Minarets
    for mx in [5, 10, 37, 42]:
        g[6:44, mx:mx+2] = c_minaret
        g[4:6, mx] = c_gold # Needle tip

# 7. St. Peter's Basilica (Vatican Great Cupola)
def render_st_peters(g):
    c_stone = [225, 225, 230, 255]
    c_dome = [140, 155, 175, 255]
    # Facade
    g[26:44, 8:40] = c_stone; g[44, 8:40] = c_line
    # High Cupola (Dome)
    for y in range(10, 22):
        rw = int(np.sqrt(max(0, 36 - (y - 16)**2)) * 1.4)
        g[y, 24 - rw : 25 + rw] = c_dome
    # Lantern & Cross
    g[6:10, 23:26] = c_stone
    g[4, 24] = c_gold; g[5, 23:26] = c_gold
    # Facade Columns & Statues
    for cx in range(10, 39, 4):
        g[30:43, cx] = c_shadow
        g[24, cx] = c_stone # Statues on roof

# 8. Monte Cassino (Hilltop Mountain Fortress Abbey)
def render_monte_cassino(g):
    c_rock = [110, 120, 95, 255]
    c_green = [60, 110, 50, 255]
    c_wall = [220, 215, 205, 255]
    c_roof = [190, 85, 60, 255]
    # Mountain Base
    for y in range(32, 46):
        rw = (y - 31) * 2
        g[y, 24 - rw : 25 + rw] = c_rock
        g[y, 24 - rw : 24 - rw + 3] = c_green
        g[y, 24 + rw - 3 : 24 + rw] = c_green
    # Fortress Monastery Walls
    g[20:34, 12:36] = c_wall
    g[17:20, 12:36] = c_roof
    # Abbey Cloister & Bell Tower
    g[11:20, 30:35] = c_wall; g[9:11, 30:35] = c_roof

# 9. Cluny Abbey (Massive Romanesque Reform Abbey)
def render_cluny(g):
    c_stone = [190, 185, 170, 255]
    c_roof = [170, 80, 55, 255]
    # Giant Nave
    g[26:44, 6:42] = c_stone; g[22:26, 6:42] = c_roof
    # Multiple Crossing Octagonal Towers
    for tx in [14, 24, 34]:
        g[12:22, tx-3:tx+4] = c_stone
        g[6:12, tx-2:tx+3] = c_roof
        g[5, tx] = c_gold

# 10. Citeaux Abbey (Cistercian Simplicity)
def render_citeaux(g):
    c_stone = [175, 175, 175, 255]
    c_roof = [110, 120, 130, 255]
    # Simple Church & Cloister
    g[26:44, 10:38] = c_stone
    g[20:26, 10:38] = c_roof
    # Wooden Flèche (Small bell turret)
    g[12:20, 23:25] = c_roof; g[11, 24] = c_line

# 11. Saint Denis (Royal Abbey)
def render_saint_denis(g):
    c_stone = [185, 190, 195, 255]
    c_spire = [75, 90, 110, 255]
    # Early Gothic Facade
    g[22:44, 10:38] = c_stone; g[44, 10:38] = c_line
    # Spire
    for y in range(4, 22):
        rw = (y - 3) // 3
        g[y, 16 - rw : 17 + rw] = c_spire
    g[2, 16] = c_gold; g[3, 15:18] = c_gold
    g[12:22, 31:37] = c_stone

# 12. Canterbury Cathedral (Bell Harry Tower)
def render_canterbury(g):
    c_stone = [200, 205, 210, 255]
    c_roof = [80, 100, 125, 255]
    # Huge Central Tower
    g[8:44, 19:29] = c_stone
    for px in [19, 28]: g[5:8, px] = c_stone # Pinnacles
    # Nave & Transepts
    g[24:44, 6:42] = c_stone
    g[20:24, 6:42] = c_roof

# 13. Sorbonne University (Paris)
def render_sorbonne(g):
    c_brick = [165, 80, 65, 255]
    c_stone = [215, 210, 200, 255]
    c_slate = [70, 75, 90, 255]
    g[24:44, 8:40] = c_brick; g[44, 8:40] = c_line
    g[18:24, 8:40] = c_slate # High Mansard roof
    # Clock tower in center
    g[8:18, 21:27] = c_stone
    g[4:8, 22:26] = c_slate
    g[12:14, 23:25] = c_gold # Clock face

# 14. Bologna University (Red Brick & Porticoes)
def render_bologna(g):
    c_brick = [180, 70, 50, 255]
    c_roof = [190, 85, 55, 255]
    # College Hall
    g[20:44, 6:42] = c_brick; g[16:20, 6:42] = c_roof
    # Famous Bologna Arched Portico (Pillars with walkway)
    g[36:44, 6:42] = c_line
    for ax in range(8, 41, 4):
        g[34:44, ax] = c_brick

# 15. Salerno Medical University (Mediterranean White)
def render_salerno(g):
    c_white = [240, 240, 245, 255]
    c_terracotta = [210, 100, 60, 255]
    c_sea = [40, 110, 180, 255]
    # Sea in foreground
    g[42:46, 0:48] = c_sea
    # White stucco academy buildings
    g[20:42, 10:38] = c_white
    g[16:20, 10:38] = c_terracotta

# 16. Oxford University (Christ Church Tom Tower)
def render_oxford(g):
    c_honey = [215, 195, 150, 255] # Cotswold honey stone
    c_roof = [80, 95, 110, 255]
    # Quadrangle
    g[24:44, 6:42] = c_honey; g[44, 6:42] = c_line
    # Tom Tower Gatehouse
    g[10:24, 19:29] = c_honey
    for y in range(4, 10):
        rw = (y - 3) // 2
        g[y, 24 - rw : 25 + rw] = c_roof
    g[2, 24] = c_gold

# 17. Cambridge University (King's College Chapel)
def render_cambridge(g):
    c_stone = [200, 205, 210, 255]
    c_glass = [100, 140, 170, 255]
    # Perpendicular Gothic Chapel
    g[18:44, 8:40] = c_stone; g[44, 8:40] = c_line
    # 4 Corner Turrets
    for tx in [8, 38]: g[10:18, tx:tx+2] = c_stone; g[8:10, tx] = c_gold
    # Giant Perpendicular Windows
    for wx in range(12, 36, 4): g[22:38, wx:wx+2] = c_glass

# 18. Prague University (Karolinum Gothic Bay)
def render_prague(g):
    c_wall = [220, 210, 195, 255]
    c_roof = [185, 60, 45, 255]
    c_stone = [140, 140, 150, 255]
    # Karolinum Building
    g[22:44, 8:40] = c_wall; g[16:22, 8:40] = c_roof
    # Famous Gothic Oriel Window (Bay)
    g[24:34, 20:28] = c_stone
    g[20:24, 20:28] = c_roof

# 19. Krakow University (Collegium Maius Arcade)
def render_krakow(g):
    c_brick = [170, 60, 45, 255]
    c_roof = [180, 70, 50, 255]
    c_stone = [195, 190, 180, 255]
    # Brick Courtyard Hall
    g[20:44, 8:40] = c_brick; g[15:20, 8:40] = c_roof
    # Arcaded Courtyard Pillars
    for ax in range(11, 38, 5): g[32:44, ax:ax+2] = c_stone

# 20. Pyramid of Giza
def render_pyramid(g):
    c_sand_hi = [230, 200, 120, 255]
    c_sand_mid = [195, 160, 85, 255]
    c_sand_lo = [150, 115, 60, 255]
    for y in range(14, 44):
        rw = y - 13
        g[y, 24 - rw : 24] = c_sand_hi
        g[y, 24 : 24 + rw] = c_sand_lo
    g[44, 4:44] = c_sand_mid

# Build all 20 buildings
create_building("notre-dame-paris", render_notre_dame)
create_building("chartres-cathedral", render_chartres)
create_building("cologne-cathedral", render_cologne)
create_building("pisa-cathedral", render_pisa)
create_building("worms-cathedral", render_worms)
create_building("hagia-sophia", render_hagia_sophia)
create_building("st-peters-basilica", render_st_peters)
create_building("monte-cassino", render_monte_cassino)
create_building("cluny-abbey", render_cluny)
create_building("citeaux-abbey", render_citeaux)
create_building("saint-denis", render_saint_denis)
create_building("canterbury-cathedral", render_canterbury)
create_building("sorbonne-paris", render_sorbonne)
create_building("bologna-university", render_bologna)
create_building("salerno-university", render_salerno)
create_building("oxford-university", render_oxford)
create_building("cambridge-university", render_cambridge)
create_building("prague-university", render_prague)
create_building("krakow-university", render_krakow)
create_building("pyramid-giza", render_pyramid)

print("All 20 medieval buildings created successfully!")
