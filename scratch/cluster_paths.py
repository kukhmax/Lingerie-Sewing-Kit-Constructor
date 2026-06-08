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
        if w > 1530 and h > 1080:
            continue
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
            'cx': cx,
            'cy': cy,
            'w': w,
            'h': h,
            'd': d
        })
        
    # Spatial clustering: group paths that are close to each other
    clusters = []
    visited = set()
    
    # We define distance between two paths as the distance between their centroids
    # If they are within 100 units, we group them
    for i, p1 in enumerate(kept_paths):
        if i in visited:
            continue
        current_cluster = [p1]
        visited.add(i)
        
        # Grow cluster
        added = True
        while added:
            added = False
            for j, p2 in enumerate(kept_paths):
                if j in visited:
                    continue
                # Calculate distance to any path in the cluster
                min_dist = float('inf')
                for p_clust in current_cluster:
                    dist = np.hypot(p_clust['cx'] - p2['cx'], p_clust['cy'] - p2['cy'])
                    if dist < min_dist:
                        min_dist = dist
                if min_dist < 80: # cluster threshold
                    current_cluster.append(p2)
                    visited.add(j)
                    added = True
                    
        clusters.append(current_cluster)
        
    print(f"\n=================== FILE: {f} (Clusters: {len(clusters)}) ===================")
    for c_idx, clust in enumerate(clusters):
        c_xmin = min([p['xmin'] for p in clust])
        c_ymin = min([p['ymin'] for p in clust])
        c_xmax = max([p['xmax'] for p in clust])
        c_ymax = max([p['ymax'] for p in clust])
        c_w = c_xmax - c_xmin
        c_h = c_ymax - c_ymin
        c_cx = c_xmin + c_w/2
        c_cy = c_ymin + c_h/2
        print(f"  Cluster #{c_idx}: paths={len(clust):3d} | bbox=[{c_xmin:.1f}, {c_ymin:.1f}] to [{c_xmax:.1f}, {c_ymax:.1f}] | size={c_w:.1f}x{c_h:.1f} | center=({c_cx:.1f}, {c_cy:.1f})")
