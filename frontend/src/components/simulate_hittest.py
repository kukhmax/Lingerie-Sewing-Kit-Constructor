import os
import re
import base64
from PIL import Image
import io
import numpy as np
from collections import deque

svg_dir = r"C:\Users\m-win\Projects\konstructor\frontend\public\bra"

parts = [
    {"id": "bow", "file": "kokardka.svg"},
    {"id": "ring", "file": "kolka.svg"},
    {"id": "slider", "file": "regulatory.svg"},
    {"id": "closure", "file": "haftki.svg"},
    {"id": "elastic_strap", "file": "guma_ramiackowa.svg"},
    {"id": "tulle_stable", "file": "material_glowny_2.svg"},
    {"id": "tulle_elastic", "file": "material_glowny_1.svg"},
    {"id": "fabric", "file": "material_glowny_3.svg"},
    {"id": "lace", "file": "material_glowny_4.svg"},
    {"id": "underwire", "file": "fiszbiny.svg"},
    {"id": "tunnel", "file": "tunel_gorseciarski.svg"},
    {"id": "elastic_trim", "file": "gumy.svg"}
]

width = 512
height = 362

def fill_holes(grid):
    # grid: 2D numpy array of 0 and 1
    h, w = grid.shape
    visited = np.zeros_like(grid)
    
    queue = deque()
    # Add all border pixels that are 0
    for x in range(w):
        if grid[0, x] == 0:
            queue.append((0, x))
            visited[0, x] = 1
        if grid[h-1, x] == 0:
            queue.append((h-1, x))
            visited[h-1, x] = 1
    for y in range(h):
        if grid[y, 0] == 0:
            queue.append((y, 0))
            visited[y, 0] = 1
        if grid[y, w-1] == 0:
            queue.append((y, w-1))
            visited[y, w-1] = 1
            
    # BFS
    while queue:
        cy, cx = queue.popleft()
        for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < h and 0 <= nx < w:
                if grid[ny, nx] == 0 and visited[ny, nx] == 0:
                    visited[ny, nx] = 1
                    queue.append((ny, nx))
                    
    # Any pixel not visited and not a line is a hole (inside)
    filled_grid = np.copy(grid)
    filled_grid[visited == 0] = 1
    return filled_grid

grids = {}

for part in parts:
    filepath = os.path.join(svg_dir, part["file"])
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    match = re.search(r'xlink:href="data:image/jpeg;base64,([^"]+)"', content) or re.search(r'href="data:image/jpeg;base64,([^"]+)"', content)
    if match:
        base64_data = match.group(1)
        img_bytes = base64.b64decode(base64_data)
        img = Image.open(io.BytesIO(img_bytes)).resize((width, height), Image.Resampling.LANCZOS)
        gray = img.convert("L")
        pixels = np.array(gray)
        grid = (pixels < 250).astype(np.uint8)
        
        # Apply hole filling
        filled = fill_holes(grid)
        
        # Dilation with radius 2 on the filled grid
        dilated = np.zeros_like(filled)
        radius = 2
        for y in range(height):
            for x in range(width):
                if filled[y, x] == 1:
                    y_min = max(0, y - radius)
                    y_max = min(height, y + radius + 1)
                    x_min = max(0, x - radius)
                    x_max = min(width, x + radius + 1)
                    dilated[y_min:y_max, x_min:x_max] = 1
        grids[part["id"]] = dilated
        print(f"Loaded {part['id']}, filled+dilated count: {np.sum(dilated)}")

# Simulate hit-test priority
hit_counts = {part["id"]: 0 for part in parts}
for y in range(height):
    for x in range(width):
        for part in parts:
            grid = grids.get(part["id"])
            if grid is not None and grid[y, x] == 1:
                hit_counts[part["id"]] += 1
                break

print("\n--- Simulated Filled Hit-Test Results ---")
for part in parts:
    print(f"Part {part['id']}: {hit_counts[part['id']]} hit pixels")
