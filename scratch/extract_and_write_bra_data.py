import os
import xml.etree.ElementTree as ET
import re
import json

def parse_points(d):
    tokens = re.findall(r'[MmLlCcSsHhVvQqTtAaZz]|[-+]?\d*\.\d+|[-+]?\d+', d)
    points = []
    current_x, current_y = 0.0, 0.0
    cmd = ''
    i = 0
    flat = []
    for t in tokens:
        if re.match(r'[MmLlCcSsHhVvQqTtAaZz]', t):
            flat.append(t)
        else:
            try:
                flat.append(float(t))
            except ValueError:
                pass
    while i < len(flat):
        tok = flat[i]
        if isinstance(tok, str):
            cmd = tok
            i += 1
        if cmd in ['M', 'm']:
            if i + 1 < len(flat):
                x, y = flat[i], flat[i+1]
                i += 2
                if cmd == 'm':
                    current_x += x
                    current_y += y
                else:
                    current_x = x
                    current_y = y
                points.append((current_x, current_y))
            else:
                break
            cmd = 'L' if cmd == 'M' else 'l'
        elif cmd in ['L', 'l']:
            if i + 1 < len(flat):
                x, y = flat[i], flat[i+1]
                i += 2
                if cmd == 'l':
                    current_x += x
                    current_y += y
                else:
                    current_x = x
                    current_y = y
                points.append((current_x, current_y))
            else:
                break
        elif cmd in ['H', 'h']:
            if i < len(flat):
                x = flat[i]
                i += 1
                if cmd == 'h':
                    current_x += x
                else:
                    current_x = x
                points.append((current_x, current_y))
            else:
                break
        elif cmd in ['V', 'v']:
            if i < len(flat):
                y = flat[i]
                i += 1
                if cmd == 'v':
                    current_y += y
                else:
                    current_y = y
                points.append((current_x, current_y))
            else:
                break
        elif cmd in ['C', 'c', 'S', 's', 'Q', 'q', 'T', 't', 'A', 'a']:
            num_params = {'C': 6, 'c': 6, 'S': 4, 's': 4, 'Q': 4, 'q': 4, 'T': 2, 't': 2, 'A': 7, 'a': 7}[cmd]
            if i + num_params - 1 < len(flat):
                x = flat[i + num_params - 2]
                y = flat[i + num_params - 1]
                i += num_params
                if cmd.islower():
                    current_x += x
                    current_y += y
                else:
                    current_x = x
                    current_y = y
                points.append((current_x, current_y))
            else:
                break
        elif cmd in ['Z', 'z']:
            pass
        else:
            i += 1
    return points

new_svg_dir = r"C:\Users\m-win\Projects\konstructor\anatomia_biustonosz'"

def get_category(f, xmin, ymin, xmax, ymax, cx, cy, w, h, d):
    # Hook & eye closure (haftka)
    if ymin > 550 and ymax < 870 and (xmin < 70 or xmax > 1465):
        return 'haftka'
        
    # Side bones (fiszbiny_krotkie): vertical elements near x=330 or x=1200
    if ymin > 530 and ymax < 850 and w < 50 and h > 100 and (abs(cx - 330) < 70 or abs(cx - 1200) < 70):
        return 'fiszbiny_krotkie'
        
    # Underwire casings (tunel_gorseciarski) in 7.svg or wrapping under cups
    if f == "7.svg":
        return 'tunel_gorseciarski'
        
    # Rings (kolka)
    if ymin > 300 and ymax < 440 and (xmin < 220 or xmax > 1310) and w < 70 and h < 70:
        return 'kolka'
        
    # Sliders (regulatory)
    if ymin > 410 and ymax < 560 and (xmin < 220 or xmax > 1310) and w < 70 and h < 70:
        return 'regulatory'
        
    # Shoulder straps (guma_ramiaczkowa)
    if f == "3.svg" or (ymax < 660 and (ymin < 400 or (w > 200 and h > 200))):
        return 'guma_ramiackowa'
        
    # Bottom elastic (guma_obszywkowa)
    # The bottom band runs across the bottom from wings to gore
    if ymin > 700 and ymax < 875 and w > 400:
        return 'guma_obszywkowa'
        
    # Wings (material_glowny_1)
    if ymin > 530 and ymax < 875 and (cx < 280 or cx > 1250):
        return 'material_glowny_1'
        
    # Upper Gore (kolardka)
    if ymin > 450 and ymax < 660 and abs(cx - 768) < 60:
        return 'kolardka'
        
    # Lower Gore (material_glowny_2)
    if ymin > 630 and ymax < 815 and abs(cx - 768) < 60:
        return 'material_glowny_2'
        
    # Cups (material_glowny_3)
    if ymin > 350 and ymax < 900:
        return 'material_glowny_3'
        
    return 'material_glowny_3' # Safe fallback

# We want to collect fills and outlines for each category
# And let's split cups into left/right and 3 panels for detail coloring!
# 1. guma_ramiackowa
# 2. kolka
# 3. regulatory
# 4. haftka
# 5. fiszbiny_krotkie
# 6. tunel_gorseciarski
# 7. guma_obszywkowa
# 8. material_glowny_1 (wings)
# 9. material_glowny_2 (lower gore)
# 10. kolardka (upper gore)
# 11. material_glowny_3_left_outer
# 12. material_glowny_3_left_center
# 13. material_glowny_3_left_inner
# 14. material_glowny_3_right_inner
# 15. material_glowny_3_right_center
# 16. material_glowny_3_right_outer

categories = [
    'guma_ramiackowa', 'kolka', 'regulatory', 'haftka', 'fiszbiny_krotkie',
    'tunel_gorseciarski', 'guma_obszywkowa', 'material_glowny_1',
    'material_glowny_2', 'kolardka',
    'material_glowny_3_left_outer', 'material_glowny_3_left_center', 'material_glowny_3_left_inner',
    'material_glowny_3_right_inner', 'material_glowny_3_right_center', 'material_glowny_3_right_outer'
]

fills = {cat: [] for cat in categories}
outlines = {cat: [] for cat in categories}

for f in sorted(os.listdir(new_svg_dir)):
    if not f.endswith(".svg") or f == "arrows.svg":
        continue
    filepath = os.path.join(new_svg_dir, f)
    tree = ET.parse(filepath)
    root = tree.getroot()
    ns = {"svg": "http://www.w3.org/2000/svg"}
    paths = root.findall('.//svg:path', ns)
    
    for idx, p in enumerate(paths):
        d = p.attrib.get('d', '').strip()
        pts = parse_points(d)
        if not pts:
            continue
        xs = [pt[0] for pt in pts]
        ys = [pt[1] for pt in pts]
        xmin, xmax = min(xs), max(xs)
        ymin, ymax = min(ys), max(ys)
        w = xmax - xmin
        h = ymax - ymin
        
        # Skip viewport boundary
        if w > 1530 and h > 1080:
            continue
        # Skip origin duplicates
        if xmin < 10 and ymin < 10 and w < 1000:
            continue
            
        cx = xmin + w/2
        cy = ymin + h/2
        
        cat = get_category(f, xmin, ymin, xmax, ymax, cx, cy, w, h, d)
        
        # Special splits for cups (material_glowny_3)
        if cat == 'material_glowny_3':
            if cx < 768: # Left Cup
                if cx < 440:
                    cat = 'material_glowny_3_left_outer'
                elif cx < 620:
                    cat = 'material_glowny_3_left_center'
                else:
                    cat = 'material_glowny_3_left_inner'
            else: # Right Cup
                if cx > 1096:
                    cat = 'material_glowny_3_right_outer'
                elif cx > 916:
                    cat = 'material_glowny_3_right_center'
                else:
                    cat = 'material_glowny_3_right_inner'
                    
        # Check if path is closed (ends with Z or z)
        is_closed = d.lower().endswith('z')
        
        # We put all paths in outlines, and closed paths in fills
        outlines[cat].append(d)
        if is_closed:
            fills[cat].append(d)

# For arrows.svg, let's parse the elements
arrows_filepath = os.path.join(new_svg_dir, "arrows.svg")
arrows_tree = ET.parse(arrows_filepath)
arrows_root = arrows_tree.getroot()
# Let's extract the paths and groups from arrows.svg to render them directly
# We can represent arrows as a list of path objects, or just a list of SVG elements
# To make it clean, we can just extract all path and g elements with their styles and transforms
arrows_elements = []

def parse_arrows(node, current_style):
    style = current_style.copy()
    for attr in ['stroke', 'stroke-width', 'fill', 'opacity', 'fill-opacity', 'stroke-opacity', 'transform', 'clip-path']:
        if attr in node.attrib:
            style[attr] = node.attrib[attr]
            
    tag = node.tag.replace('{http://www.w3.org/2000/svg}', '')
    if tag == 'path':
        d = node.attrib.get('d', '')
        # Filter out background or boundary rects
        pts = parse_points(d)
        if pts:
            xs = [pt[0] for pt in pts]
            ys = [pt[1] for pt in pts]
            if max(xs) - min(xs) > 1530 and max(ys) - min(ys) > 1080:
                pass # skip background
            else:
                arrows_elements.append({
                    'tag': 'path',
                    'd': d,
                    'fill': style.get('fill', 'none'),
                    'stroke': style.get('stroke', 'none'),
                    'strokeWidth': style.get('stroke-width'),
                    'transform': style.get('transform'),
                    'clipPath': style.get('clip-path'),
                    'fillOpacity': style.get('fill-opacity'),
                    'strokeOpacity': style.get('stroke-opacity')
                })
    else:
        # Traverse children for any other tags (like svg, g, defs etc.)
        for child in node:
            parse_arrows(child, style)

parse_arrows(arrows_root, {})
print(f"Extracted {len(arrows_elements)} paths from arrows.svg")

# Write BraPathData.js
js_path = r"C:\Users\m-win\Projects\konstructor\frontend\src\components\BraPathData.js"
with open(js_path, "w", encoding="utf-8") as js_file:
    js_file.write("// Generated BraPathData.js\n\n")
    
    js_file.write("export const BRA_PARTS_DATA = {\n")
    for cat in categories:
        js_file.write(f"  {cat}: {{\n")
        js_file.write(f"    fills: [\n")
        for f_d in fills[cat]:
            js_file.write(f"      {repr(f_d)},\n")
        js_file.write(f"    ],\n")
        js_file.write(f"    outlines: [\n")
        for o_d in outlines[cat]:
            js_file.write(f"      {repr(o_d)},\n")
        js_file.write(f"    ]\n")
        js_file.write(f"  }},\n")
    js_file.write("};\n\n")
    
    js_file.write("export const ARROWS_DATA = [\n")
    for el in arrows_elements:
        js_file.write(f"  {json.dumps(el)},\n")
    js_file.write("];\n")

print(f"Successfully generated {js_path}!")
