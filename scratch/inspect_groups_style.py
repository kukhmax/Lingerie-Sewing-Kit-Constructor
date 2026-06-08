import os
import xml.etree.ElementTree as ET

new_svg_dir = r"C:\Users\m-win\Projects\konstructor\anatomia_biustonosz'"
for f in sorted(os.listdir(new_svg_dir)):
    if not f.endswith(".svg"):
        continue
    filepath = os.path.join(new_svg_dir, f)
    try:
        tree = ET.parse(filepath)
        root = tree.getroot()
        ns = {"svg": "http://www.w3.org/2000/svg"}
        groups = root.findall('.//svg:g', ns)
        
        group_attrs = set()
        for g in groups:
            attrs = {k: v for k, v in g.attrib.items() if k in ['fill', 'stroke', 'stroke-width', 'style']}
            if attrs:
                group_attrs.add(str(attrs))
                
        print(f"{f}: found {len(groups)} groups. Unique styling attributes on groups:")
        for a in sorted(list(group_attrs))[:10]:
            print(f"  {a}")
    except Exception as e:
        print(f"Error reading {f}: {e}")
