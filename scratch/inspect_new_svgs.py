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
        
        # Check namespace
        ns = {"svg": "http://www.w3.org/2000/svg"}
        
        paths = root.findall('.//svg:path', ns)
        images = root.findall('.//svg:image', ns)
        g_tags = root.findall('.//svg:g', ns)
        texts = root.findall('.//svg:text', ns)
        
        print(f"\n--- File: {f} ---")
        print(f"  Root tag: {root.tag}")
        print(f"  Width: {root.attrib.get('width')}, Height: {root.attrib.get('height')}")
        print(f"  viewBox: {root.attrib.get('viewBox')}")
        print(f"  Number of <path> tags: {len(paths)}")
        print(f"  Number of <image> tags: {len(images)}")
        print(f"  Number of <g> tags: {len(g_tags)}")
        print(f"  Number of <text> tags: {len(texts)}")
        
        if len(images) > 0:
            print(f"    First image href start: {images[0].attrib.get('{http://www.w3.org/1999/xlink}href', '')[:100]}")
            
    except Exception as e:
        print(f"Error reading {f}: {e}")
