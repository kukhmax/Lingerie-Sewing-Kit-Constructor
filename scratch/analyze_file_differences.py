import os
import xml.etree.ElementTree as ET

new_svg_dir = r"C:\Users\m-win\Projects\konstructor\anatomia_biustonosz'"

svg_files = sorted([f for f in os.listdir(new_svg_dir) if f.endswith(".svg")])

path_sets = {}

for f in svg_files:
    filepath = os.path.join(new_svg_dir, f)
    tree = ET.parse(filepath)
    root = tree.getroot()
    ns = {"svg": "http://www.w3.org/2000/svg"}
    paths = root.findall('.//svg:path', ns)
    
    d_attrs = [p.attrib.get('d', '').strip() for p in paths]
    path_sets[f] = d_attrs
    print(f"{f}: path count={len(d_attrs)}, unique paths={len(set(d_attrs))}")

# Check overlaps
for i in range(len(svg_files)):
    for j in range(i+1, len(svg_files)):
        f1 = svg_files[i]
        f2 = svg_files[j]
        set1 = set(path_sets[f1])
        set2 = set(path_sets[f2])
        intersection = set1.intersection(set2)
        print(f"Intersection between {f1} and {f2}: {len(intersection)} paths overlap")
