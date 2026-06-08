import os
import xml.etree.ElementTree as ET
import re
import numpy as np
import base64
import json

new_svg_dir = r"C:\Users\m-win\Projects\konstructor\anatomia_biustonosz'"
js_path = r"C:\Users\m-win\Projects\konstructor\frontend\src\components\BraPathData.js"
bg_path = r"C:\Users\m-win\Projects\konstructor\frontend\src\components\bra_background.png"

def extract_background_image():
    filepath = os.path.join(new_svg_dir, "2.svg")
    tree = ET.parse(filepath)
    root = tree.getroot()
    ns = {"svg": "http://www.w3.org/2000/svg"}
    images = root.findall('.//svg:image', ns)
    if images:
        img = images[0]
        href = img.attrib.get('{http://www.w3.org/1999/xlink}href') or img.attrib.get('href')
        if href and href.startswith("data:image/png;base64,"):
            base64_data = href.replace("data:image/png;base64,", "")
            image_data = base64.b64decode(base64_data)
            with open(bg_path, "wb") as f:
                f.write(image_data)
            print(f"Successfully extracted background image to {bg_path}!")

def parse_transform(t_str):
    m = np.identity(3)
    if not t_str:
        return m
    for t_type, args_str in re.findall(r'(\w+)\(([^)]+)\)', t_str):
        args = [float(x.strip()) for x in args_str.split(',') if x.strip()]
        if not args:
            args = [float(x.strip()) for x in args_str.split() if x.strip()]
        local_m = np.identity(3)
        if t_type == 'matrix':
            if len(args) == 6:
                a, b, c, d, e, f = args
                local_m = np.array([[a, c, e], [b, d, f], [0, 0, 1]])
        elif t_type == 'translate':
            dx = args[0]
            dy = args[1] if len(args) > 1 else 0.0
            local_m = np.array([[1, 0, dx], [0, 1, dy], [0, 0, 1]])
        elif t_type == 'scale':
            sx = args[0]
            sy = args[1] if len(args) > 1 else sx
            local_m = np.array([[sx, 0, 0], [0, sy, 0], [0, 0, 1]])
        elif t_type == 'rotate':
            angle = np.radians(args[0])
            cos_a = np.cos(angle)
            sin_a = np.sin(angle)
            if len(args) > 2:
                cx, cy = args[1], args[2]
                local_m = np.array([
                    [cos_a, -sin_a, cx * (1 - cos_a) + cy * sin_a],
                    [sin_a, cos_a, cy * (1 - cos_a) - cx * sin_a],
                    [0, 0, 1]
                ])
            else:
                local_m = np.array([
                    [cos_a, -sin_a, 0],
                    [sin_a, cos_a, 0],
                    [0, 0, 1]
                ])
        m = m @ local_m
    return m

def get_absolute_commands(d):
    tokens = re.findall(r'[MmLlCcSsHhVvQqTtAaZz]|[-+]?\d*\.\d+(?:[eE][-+]?\d+)?|[-+]?\d+(?:[eE][-+]?\d+)?|[-+]?\.\d+', d)
    flat = []
    for t in tokens:
        if re.match(r'[MmLlCcSsHhVvQqTtAaZz]', t):
            flat.append(t)
        else:
            try:
                flat.append(float(t))
            except ValueError:
                pass
                
    commands = []
    i = 0
    cx, cy = 0.0, 0.0
    start_x, start_y = 0.0, 0.0
    cmd = ''
    
    while i < len(flat):
        tok = flat[i]
        if isinstance(tok, str):
            cmd = tok
            i += 1
        else:
            if not cmd:
                break
                
        if cmd == 'M':
            x, y = flat[i], flat[i+1]
            i += 2
            cx, cy = x, y
            start_x, start_y = x, y
            commands.append(('M', [x, y]))
            cmd = 'L'
        elif cmd == 'm':
            dx, dy = flat[i], flat[i+1]
            i += 2
            cx += dx
            cy += dy
            start_x, start_y = cx, cy
            commands.append(('M', [cx, cy]))
            cmd = 'l'
        elif cmd == 'L':
            x, y = flat[i], flat[i+1]
            i += 2
            cx, cy = x, y
            commands.append(('L', [x, y]))
        elif cmd == 'l':
            dx, dy = flat[i], flat[i+1]
            i += 2
            cx += dx
            cy += dy
            commands.append(('L', [cx, cy]))
        elif cmd == 'H':
            x = flat[i]
            i += 1
            cx = x
            commands.append(('L', [cx, cy]))
        elif cmd == 'h':
            dx = flat[i]
            i += 1
            cx += dx
            commands.append(('L', [cx, cy]))
        elif cmd == 'V':
            y = flat[i]
            i += 1
            cy = y
            commands.append(('L', [cx, cy]))
        elif cmd == 'v':
            dy = flat[i]
            i += 1
            cy += dy
            commands.append(('L', [cx, cy]))
        elif cmd == 'C':
            x1, y1, x2, y2, x, y = flat[i:i+6]
            i += 6
            cx, cy = x, y
            commands.append(('C', [x1, y1, x2, y2, x, y]))
        elif cmd == 'c':
            dx1, dy1, dx2, dy2, dx, dy = flat[i:i+6]
            i += 6
            commands.append(('C', [cx+dx1, cy+dy1, cx+dx2, cy+dy2, cx+dx, cy+dy]))
            cx += dx
            cy += dy
        elif cmd == 'S':
            x2, y2, x, y = flat[i:i+4]
            i += 4
            cx, cy = x, y
            commands.append(('S', [x2, y2, x, y]))
        elif cmd == 's':
            dx2, dy2, dx, dy = flat[i:i+4]
            i += 4
            commands.append(('S', [cx+dx2, cy+dy2, cx+dx, cy+dy]))
            cx += dx
            cy += dy
        elif cmd == 'Q':
            x1, y1, x, y = flat[i:i+4]
            i += 4
            cx, cy = x, y
            commands.append(('Q', [x1, y1, x, y]))
        elif cmd == 'q':
            dx1, dy1, dx, dy = flat[i:i+4]
            i += 4
            commands.append(('Q', [cx+dx1, cy+dy1, cx+dx, cy+dy]))
            cx += dx
            cy += dy
        elif cmd == 'T':
            x, y = flat[i], flat[i+1]
            i += 2
            cx, cy = x, y
            commands.append(('T', [x, y]))
        elif cmd == 't':
            dx, dy = flat[i], flat[i+1]
            i += 2
            cx += dx
            cy += dy
            commands.append(('T', [cx, cy]))
        elif cmd == 'A':
            rx, ry, rot, large, sweep, x, y = flat[i:i+7]
            i += 7
            cx, cy = x, y
            commands.append(('A', [rx, ry, rot, large, sweep, x, y]))
        elif cmd == 'a':
            rx, ry, rot, large, sweep, dx, dy = flat[i:i+7]
            i += 7
            cx += dx
            cy += dy
            commands.append(('A', [rx, ry, rot, large, sweep, cx, cy]))
        elif cmd in ['Z', 'z']:
            cx, cy = start_x, start_y
            commands.append(('Z', []))
        else:
            i += 1
    return commands

def transform_command(m, cmd, args):
    if cmd == 'Z':
        return 'Z', []
    a, c, e = m[0]
    b, d, f = m[1]
    def trans(x, y):
        return a*x + c*y + e, b*x + d*y + f
    if cmd in ['M', 'L', 'T']:
        nx, ny = trans(args[0], args[1])
        return cmd, [nx, ny]
    elif cmd == 'C':
        nx1, ny1 = trans(args[0], args[1])
        nx2, ny2 = trans(args[2], args[3])
        nx, ny = trans(args[4], args[5])
        return 'C', [nx1, ny1, nx2, ny2, nx, ny]
    elif cmd == 'S':
        nx2, ny2 = trans(args[0], args[1])
        nx, ny = trans(args[2], args[3])
        return 'S', [nx2, ny2, nx, ny]
    elif cmd == 'Q':
        nx1, ny1 = trans(args[0], args[1])
        nx, ny = trans(args[2], args[3])
        return 'Q', [nx1, ny1, nx, ny]
    elif cmd == 'A':
        rx, ry, rot, large, sweep, x, y = args
        sx = (a**2 + b**2)**0.5
        sy = (c**2 + d**2)**0.5
        theta = np.degrees(np.arctan2(b, a))
        nx, ny = trans(x, y)
        nrx = rx * sx
        nry = ry * sy
        nrot = rot + theta
        return 'A', [nrx, nry, nrot, large, sweep, nx, ny]
    return cmd, args

def commands_to_string(commands):
    parts = []
    for cmd, args in commands:
        if cmd == 'Z':
            parts.append('Z')
        else:
            args_str = " ".join(f"{val:.3f}".rstrip('0').rstrip('.') for val in args)
            parts.append(f"{cmd} {args_str}")
    return " ".join(parts)

def get_category(f, xmin, ymin, xmax, ymax, cx, cy, w, h):
    # Hook & eye closure (haftka)
    if ymin > 550 and ymax < 870 and (xmin < 95 or xmax > 1440):
        return 'haftka'
        
    # Side bones (fiszbiny_krotkie): vertical elements near x=330 or x=1200
    if ymin > 540 and ymax < 840 and w < 60 and h > 100 and (abs(cx - 330) < 60 or abs(cx - 1200) < 60):
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
        
    # Bottom elastic (guma_obszywkowa)
    if ymin > 750 and h < 85 and w > 100:
        return 'guma_obszywkowa'
        
    # Shoulder straps (guma_ramiaczkowa)
    if f == "3.svg" or (ymax < 660 and (ymin < 550 or w < 50 or (w > 100 and h < 100))):
        return 'guma_ramiackowa'
        
    # Wings (material_glowny_1)
    if ymin > 540 and ymax < 860 and (cx < 280 or cx > 1250):
        return 'material_glowny_1'
        
    # Upper Gore (kolardka)
    if ymin > 450 and ymax < 660 and abs(cx - 768) < 60:
        return 'kolardka'
        
    # Lower Gore (material_glowny_2)
    if ymin > 630 and ymax < 815 and abs(cx - 768) < 60:
        return 'material_glowny_2'
        
    # Cups (material_glowny_3)
    if ymin > 150 and ymax < 900 and (200 < cx < 1330):
        return 'material_glowny_3'
        
    return 'unknown'

def main():
    extract_background_image()
    
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
        
        def process_node(node, current_transform):
            transform = current_transform
            if 'transform' in node.attrib:
                transform = parse_transform(node.attrib['transform']) if current_transform is None else current_transform @ parse_transform(node.attrib['transform'])
            
            tag = node.tag.replace('{http://www.w3.org/2000/svg}', '')
            if tag == 'path':
                d = node.attrib.get('d', '')
                local_m = parse_transform(node.attrib.get('transform', ''))
                combined_m = transform if transform is not None else local_m
                if current_transform is not None and 'transform' in node.attrib:
                    combined_m = current_transform @ local_m
                elif transform is None:
                    combined_m = local_m
                
                cmds = get_absolute_commands(d)
                tx_cmds = [transform_command(combined_m, cmd, args) for cmd, args in cmds]
                
                coords = []
                for cmd, args in tx_cmds:
                    if cmd == 'Z': continue
                    if cmd in ['M', 'L', 'T']: coords.append((args[0], args[1]))
                    elif cmd == 'C': coords.append((args[4], args[5]))
                    elif cmd == 'S': coords.append((args[2], args[3]))
                    elif cmd == 'Q': coords.append((args[2], args[3]))
                    elif cmd == 'A': coords.append((args[5], args[6]))
                
                if coords:
                    xs = [pt[0] for pt in coords]
                    ys = [pt[1] for pt in coords]
                    xmin, xmax = min(xs), max(xs)
                    ymin, ymax = min(ys), max(ys)
                    w, h = xmax - xmin, ymax - ymin
                    
                    if w > 1530 and h > 1080:
                        pass
                    elif xmin < 10 and ymin < 10 and w < 1000:
                        pass
                    else:
                        cx = xmin + w/2
                        cy = ymin + h/2
                        cat = get_category(f, xmin, ymin, xmax, ymax, cx, cy, w, h)
                        
                        # Split cups into subcategories
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
                        
                        if cat != 'unknown':
                            d_str = commands_to_string(tx_cmds)
                            is_closed_z = 'z' in d.lower() or 'z' in d_str.lower()
                            is_closed_dist = False
                            if len(coords) >= 3:
                                start = coords[0]
                                end = coords[-1]
                                dist = ((start[0] - end[0])**2 + (start[1] - end[1])**2)**0.5
                                if dist < 0.5:
                                    is_closed_dist = True
                            is_closed = is_closed_z or is_closed_dist
                            outlines[cat].append(d_str)
                            if is_closed:
                                fills[cat].append(d_str)
            
            for child in node:
                process_node(child, transform)
                
        process_node(root, None)
        
    print(f"Writing to {js_path}...")
    
    # Process arrows.svg
    arrows_filepath = os.path.join(new_svg_dir, "arrows.svg")
    arrows_tree = ET.parse(arrows_filepath)
    arrows_root = arrows_tree.getroot()
    arrows_elements = []
    
    def process_arrows(node, current_transform, current_style):
        transform = current_transform
        if 'transform' in node.attrib:
            transform = parse_transform(node.attrib['transform']) if current_transform is None else current_transform @ parse_transform(node.attrib['transform'])
        
        style = current_style.copy()
        for attr in ['stroke', 'stroke-width', 'fill', 'opacity', 'fill-opacity', 'stroke-opacity']:
            if attr in node.attrib:
                style[attr] = node.attrib[attr]
        
        # Merge style attributes
        if 'style' in node.attrib:
            style_str = node.attrib['style']
            for s in style_str.split(';'):
                if ':' in s:
                    k, v = s.split(':', 1)
                    style[k.strip()] = v.strip()
                    
        tag = node.tag.replace('{http://www.w3.org/2000/svg}', '')
        if tag == 'path':
            d = node.attrib.get('d', '')
            local_m = parse_transform(node.attrib.get('transform', ''))
            combined_m = transform if transform is not None else local_m
            if current_transform is not None and 'transform' in node.attrib:
                combined_m = current_transform @ local_m
            elif transform is None:
                combined_m = local_m
                
            cmds = get_absolute_commands(d)
            tx_cmds = [transform_command(combined_m, cmd, args) for cmd, args in cmds]
            
            coords = []
            for cmd, args in tx_cmds:
                if cmd == 'Z': continue
                if cmd in ['M', 'L', 'T']: coords.append((args[0], args[1]))
                elif cmd == 'C': coords.append((args[4], args[5]))
                elif cmd == 'S': coords.append((args[2], args[3]))
                elif cmd == 'Q': coords.append((args[2], args[3]))
                elif cmd == 'A': coords.append((args[5], args[6]))
                
            if coords:
                xs = [pt[0] for pt in coords]
                ys = [pt[1] for pt in coords]
                xmin, xmax = min(xs), max(xs)
                ymin, ymax = min(ys), max(ys)
                w, h = xmax - xmin, ymax - ymin
                
                # Skip background bounds
                if w > 1530 and h > 1080:
                    pass
                else:
                    d_str = commands_to_string(tx_cmds)
                    arrows_elements.append({
                        'd': d_str,
                        'fill': style.get('fill', 'none'),
                        'stroke': style.get('stroke', 'none'),
                        'strokeWidth': style.get('stroke-width', style.get('strokeWidth')),
                        'fillOpacity': style.get('fill-opacity', style.get('fillOpacity')),
                        'strokeOpacity': style.get('stroke-opacity', style.get('strokeOpacity'))
                    })
        
        for child in node:
            process_arrows(child, transform, style)
            
    process_arrows(arrows_root, None, {})
    print(f"Extracted {len(arrows_elements)} paths from arrows.svg")
    
    with open(js_path, "w", encoding="utf-8") as js_file:
        js_file.write("// Generated BraPathData.js with absolute coordinates\n\n")
        
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
        
    print("Generation complete!")

if __name__ == "__main__":
    main()
