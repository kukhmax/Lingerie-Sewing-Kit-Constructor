import os
import xml.etree.ElementTree as ET
import re
import numpy as np

def parse_points(d):
    tokens = re.findall(r'[MmLlCcSsHhVvQqTtAaZz]|[-+]?\d*\.\d+|[-+]?\d+', d)
    points = []
    current_x = 0.0
    current_y = 0.0
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

for f in sorted(os.listdir(new_svg_dir)):
    if not f.endswith(".svg"):
        continue
    filepath = os.path.join(new_svg_dir, f)
    tree = ET.parse(filepath)
    root = tree.getroot()
    ns = {"svg": "http://www.w3.org/2000/svg"}
    paths = root.findall('.//svg:path', ns)
    
    print(f"\n=================== FILE: {f} ===================")
    for idx, p in enumerate(paths):
        fill = p.attrib.get('fill', '').lower()
        if fill and fill != 'none':
            pts = parse_points(p.attrib.get('d', ''))
            if not pts:
                continue
            xs = [pt[0] for pt in pts]
            ys = [pt[1] for pt in pts]
            xmin, xmax = min(xs), max(xs)
            ymin, ymax = min(ys), max(ys)
            
            # Skip viewport boundary rectangles (usually filled with #ffffff)
            if (xmax - xmin) > 1530 and (ymax - ymin) > 1080:
                continue
                
            print(f"Path #{idx}: fill='{fill}', bbox=[{xmin:.1f}, {ymin:.1f}] to [{xmax:.1f}, {ymax:.1f}], pts={len(pts)}")
