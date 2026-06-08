import os
import xml.etree.ElementTree as ET
import re

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

def categorize_path(xmin, ymin, xmax, ymax, cx, cy, w, h):
    # 1. Hook & eye closure (haftka): far left/right tips, y in [580, 750]
    if (xmin < 55 and cx < 100 and ymin > 550 and ymax < 800) or (xmax > 1480 and cx > 1430 and ymin > 550 and ymax < 800):
        return 'haftka'
        
    # 2. Rings (kółka): y in [350, 420], x near 100 or 1400
    if ymin > 330 and ymax < 440 and (xmin < 200 or xmax > 1300) and w < 60 and h < 60:
        return 'kolka'
        
    # 3. Sliders (regulatory): y in [420, 520], x near 100 or 1400
    if ymin > 410 and ymax < 540 and (xmin < 200 or xmax > 1300) and w < 60 and h < 60:
        return 'regulatory'
        
    # 4. Shoulder straps (guma ramiączkowa): y < 650, top curves
    if ymax < 660 and (ymin < 400 or (w > 200 and h > 200)):
        # Wait, straps are mostly at the top
        return 'guma_ramiaczkowa'
        
    # 5. Side bones (fiszbiny krótkie): narrow vertical panels near x=300 or x=1200
    if ymin > 540 and ymax < 840 and w < 50 and h > 100 and (abs(cx - 330) < 60 or abs(cx - 1200) < 60):
        return 'fiszbiny_krotkie'
        
    # 6. Wings (materiał główny #1): wing fabric panels
    if ymin > 540 and ymax < 860 and ((xmin < 330 and cx < 250) or (xmax > 1200 and cx > 1280)):
        return 'material_glowny_1'
        
    # 7. Gore/Bridge upper (kolardka): center gore, y in [500, 650]
    if ymin > 500 and ymax < 670 and abs(cx - 768) < 60:
        return 'kolardka'
        
    # 8. Gore/Bridge lower (materiał główny #2): y in [640, 780]
    if ymin > 630 and ymax < 800 and abs(cx - 768) < 60:
        return 'material_glowny_2'
        
    # 9. Underwire casing (tunel gorseciarski): curves under cups
    # Typically in y in [550, 820], and wraps under cups
    # Let's check if it's in 7.svg (which is casing)
    # Casing paths have a characteristic curved shape
    if ymin > 540 and ymax < 850 and (w > 150 or h > 100) and (abs(cx - 530) < 150 or abs(cx - 1000) < 150 or abs(cx - 768) < 100):
        # We'll refine this or let it default
        pass
        
    # 10. Bottom elastic (guma obszywkowa): bottom trim elastic
    if ymin > 700 and ymax < 860 and w > 400:
        return 'guma_obszywkowa'
        
    # 11. Cups (materiał główny #3): cup panels
    if ymin > 400 and ymax < 820 and (abs(cx - 480) < 200 or abs(cx - 1050) < 200):
        return 'material_glowny_3'
        
    return 'unknown'

results = {}
for f in sorted(os.listdir(new_svg_dir)):
    if not f.endswith(".svg") or f == "arrows.svg":
        continue
    filepath = os.path.join(new_svg_dir, f)
    tree = ET.parse(filepath)
    root = tree.getroot()
    ns = {"svg": "http://www.w3.org/2000/svg"}
    paths = root.findall('.//svg:path', ns)
    
    file_cats = {}
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
        
        cat = categorize_path(xmin, ymin, xmax, ymax, cx, cy, w, h)
        
        # If it's in 7.svg, let's see: 7.svg has casings and side bones
        if f == "7.svg":
            if cat == "unknown" or cat == "material_glowny_3":
                # In 7.svg, the cups area is underwire channel!
                cat = "tunel_gorseciarski"
                
        file_cats[cat] = file_cats.get(cat, 0) + 1
        
    results[f] = file_cats

print("\nCategorization Results (Path counts):")
for f, cats in results.items():
    print(f"\nFile: {f}")
    for cat, count in sorted(cats.items(), key=lambda x: x[1], reverse=True):
        print(f"  {cat:20s}: {count}")
