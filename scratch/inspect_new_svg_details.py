import os
import xml.etree.ElementTree as ET
import re

new_svg_dir = r"C:\Users\m-win\Projects\konstructor\anatomia_biustonosz'"

for f in sorted(os.listdir(new_svg_dir)):
    if not f.endswith(".svg"):
        continue
    filepath = os.path.join(new_svg_dir, f)
    tree = ET.parse(filepath)
    root = tree.getroot()
    ns = {"svg": "http://www.w3.org/2000/svg"}
    paths = root.findall('.//svg:path', ns)
    
    # Check some paths
    fill_none = 0
    stroke_none = 0
    other_fill = {}
    other_stroke = {}
    
    for p in paths:
        fill = p.attrib.get('fill', '')
        stroke = p.attrib.get('stroke', '')
        if fill == 'none' or not fill:
            fill_none += 1
        else:
            other_fill[fill] = other_fill.get(fill, 0) + 1
            
        if stroke == 'none' or not stroke:
            stroke_none += 1
        else:
            other_stroke[stroke] = other_stroke.get(stroke, 0) + 1
            
    print(f"\n--- {f} ---")
    print(f"  Paths count: {len(paths)}")
    print(f"  Fills count: none={fill_none}, others={other_fill}")
    print(f"  Strokes count: none={stroke_none}, others={other_stroke}")
