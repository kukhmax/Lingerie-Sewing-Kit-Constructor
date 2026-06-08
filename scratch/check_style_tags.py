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
        styles = root.findall('.//svg:style', ns)
        print(f"{f}: found {len(styles)} <style> blocks:")
        for s in styles:
            print("---")
            print(s.text.strip()[:300])
            print("---")
    except Exception as e:
        print(f"Error reading {f}: {e}")
