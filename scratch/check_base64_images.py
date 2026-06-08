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
        images = root.findall('.//svg:image', ns)
        if images:
            href = images[0].attrib.get('{http://www.w3.org/1999/xlink}href', '')
            print(f"{f}: image length={len(href)}, prefix={href[:50]}, suffix={href[-50:]}")
        else:
            print(f"{f}: NO image")
    except Exception as e:
        print(f"Error {f}: {e}")
