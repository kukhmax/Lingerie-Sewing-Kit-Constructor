import os
import xml.etree.ElementTree as ET

new_svg_dir = r"C:\Users\m-win\Projects\konstructor\anatomia_biustonosz'"

for f in sorted(os.listdir(new_svg_dir)):
    if not f.endswith(".svg") or f == "arrows.svg":
        continue
    filepath = os.path.join(new_svg_dir, f)
    tree = ET.parse(filepath)
    root = tree.getroot()
    ns = {"svg": "http://www.w3.org/2000/svg"}
    
    # Let's inspect the first 10 paths and print their transform attributes, 
    # plus the transform attributes of their parent groups
    paths = root.findall('.//svg:path', ns)
    print(f"\n=================== FILE: {f} ===================")
    for idx, p in enumerate(paths[:15]):
        # Find parent
        parent_map = {c: p for p in root.iter() for c in p}
        parent = parent_map.get(p)
        parent_transform = parent.attrib.get('transform') if parent is not None else None
        grandparent = parent_map.get(parent) if parent is not None else None
        grandparent_transform = grandparent.attrib.get('transform') if grandparent is not None else None
        
        d = p.attrib.get('d', '')
        # Check first few coordinates of d
        d_short = d[:50]
        
        print(f"Path #{idx}: transform={p.attrib.get('transform')}, parent_transform={parent_transform}, grandparent_transform={grandparent_transform}, d_start='{d_short}'")
