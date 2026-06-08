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
    if ymin > 550 and ymax < 860 and (xmin < 60 or xmax > 1470):
        return 'haftka'
        
    # Side bones (fiszbiny_krotkie): vertical elements near x=330 or x=1200
    if ymin > 540 and ymax < 840 and w < 50 and h > 100 and (abs(cx - 330) < 60 or abs(cx - 1200) < 60):
        return 'fiszbiny_krotkie'
        
    # Underwire casings (tunel_gorseciarski) in 7.svg or wrapping under cups
    if f == "7.svg":
        return 'tunel_gorseciarski'
        
    # Rings (kolka)
    if ymin > 300 and ymax < 440 and (xmin < 200 or xmax > 1300) and w < 60 and h < 60:
        return 'kolka'
        
    # Sliders (regulatory)
    if ymin > 410 and ymax < 550 and (xmin < 200 or xmax > 1300) and w < 60 and h < 60:
        return 'regulatory'
        
    # Shoulder straps (guma_ramiaczkowa)
    if f == "3.svg" or (ymax < 660 and (ymin < 400 or (w > 200 and h > 200))):
        return 'guma_ramiaczkowa'
        
    # Wings (material_glowny_1)
    if ymin > 540 and ymax < 860 and (cx < 280 or cx > 1250):
        return 'material_glowny_1'
        
    # Upper Gore (kolardka)
    if ymin > 450 and ymax < 660 and abs(cx - 768) < 60:
        return 'kolardka'
        
    # Lower Gore (material_glowny_2)
    if ymin > 630 and ymax < 810 and abs(cx - 768) < 60:
        return 'material_glowny_2'
        
    # Bottom elastic (guma_obszywkowa)
    # The bottom band runs across the bottom from wings to gore
    if ymin > 700 and ymax < 860 and w > 400:
        return 'guma_obszywkowa'
        
    # Cups (material_glowny_3)
    if ymin > 380 and ymax < 850 and (200 < cx < 740 or 790 < cx < 1300):
        return 'material_glowny_3'
        
    # Fallback to cups if it's in that middle vertical region but not classified
    if ymin > 380 and ymax < 900 and (200 < cx < 1330):
        return 'material_glowny_3'
        
    return 'unknown'

categorized = {}
unknowns = []

for f in sorted(os.listdir(new_svg_dir)):
    if not f.endswith(".svg") or f == "arrows.svg":
        continue
    filepath = os.path.join(new_svg_dir, f)
    tree = ET.parse(filepath)
    root = tree.getroot()
    ns = {"svg": "http://www.w3.org/2000/svg"}
    paths = root.findall('.//svg:path', ns)
    
    for idx, p in enumerate(paths):
        d = p.attrib.get('d', '')
        pts = parse_points(d)
        if not pts:
            continue
        xs = [pt[0] for pt in pts]
        ys = [pt[1] for pt in pts]
        xmin, xmax = min(xs), max(xs)
        ymin, ymax = min(ys), max(ys)
        w = xmax - xmin
        h = ymax - ymin
        if w > 1530 and h > 1080:
            continue
        if xmin < 10 and ymin < 10 and w < 1000:
            continue
        cx = xmin + w/2
        cy = ymin + h/2
        
        cat = get_category(f, xmin, ymin, xmax, ymax, cx, cy, w, h, d)
        
        path_data = {
            'file': f,
            'idx': idx,
            'xmin': xmin,
            'ymin': ymin,
            'xmax': xmax,
            'ymax': ymax,
            'w': w,
            'h': h,
            'cx': cx,
            'cy': cy,
            'd': d
        }
        
        if cat == 'unknown':
            unknowns.append(path_data)
        else:
            if cat not in categorized:
                categorized[cat] = []
            categorized[cat].append(path_data)

print(f"Total categorized: {sum(len(v) for v in categorized.values())}")
print(f"Total unknowns: {len(unknowns)}")
for idx, u in enumerate(unknowns):
    print(f"  Unknown #{idx}: file={u['file']} idx={u['idx']} bbox=[{u['xmin']:.1f}, {u['ymin']:.1f}] to [{u['xmax']:.1f}, {u['ymax']:.1f}] | size={u['w']:.1f}x{u['h']:.1f} | center=({u['cx']:.1f}, {u['cy']:.1f})")
