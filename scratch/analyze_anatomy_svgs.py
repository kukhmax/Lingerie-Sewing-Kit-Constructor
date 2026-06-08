import os
import xml.etree.ElementTree as ET
import re

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
    if not f.endswith(".svg") or f == "arrows.svg":
        continue
    filepath = os.path.join(new_svg_dir, f)
    tree = ET.parse(filepath)
    root = tree.getroot()
    ns = {"svg": "http://www.w3.org/2000/svg"}
    paths = root.findall('.//svg:path', ns)
    
    kept_paths = []
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
        
        # Skip boundary
        if w > 1530 and h > 1080:
            continue
        # Skip origin duplicate
        if xmin < 10 and ymin < 10 and w < 1000:
            continue
            
        cx = xmin + w/2
        cy = ymin + h/2
        kept_paths.append({
            'idx': idx,
            'xmin': xmin,
            'xmax': xmax,
            'ymin': ymin,
            'ymax': ymax,
            'w': w,
            'h': h,
            'cx': cx,
            'cy': cy,
            'd': d
        })
        
    print(f"\n=================== FILE: {f} (Kept Paths: {len(kept_paths)}) ===================")
    # Sort kept paths by size
    kept_paths.sort(key=lambda x: x['w']*x['h'], reverse=True)
    for kp in kept_paths[:10]:
        print(f"  Path #{kp['idx']}: bbox=[{kp['xmin']:.1f}, {kp['ymin']:.1f}] to [{kp['xmax']:.1f}, {kp['ymax']:.1f}] | size={kp['w']:.1f}x{kp['h']:.1f} | center=({kp['cx']:.1f}, {kp['cy']:.1f}) | d_len={len(kp['d'])}")
