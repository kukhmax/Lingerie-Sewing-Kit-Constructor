import xml.etree.ElementTree as ET

filepath = r"C:\Users\m-win\Projects\konstructor\anatomia_biustonosz'\2.svg"
tree = ET.parse(filepath)
root = tree.getroot()
ns = {"svg": "http://www.w3.org/2000/svg"}

clipped_groups = []
for g in root.findall('.//svg:g', ns):
    if 'clip-path' in g.attrib:
        clipped_groups.append(g)

print(f"Total clipped groups: {len(clipped_groups)}")
for idx, cg in enumerate(clipped_groups[:10]):
    children = [child.tag.replace('{http://www.w3.org/2000/svg}', '') for child in cg]
    print(f"Group #{idx} id={cg.attrib.get('id', 'no-id')} clip-path={cg.attrib['clip-path']}: children={children}")
    # If there are subpaths, let's see their styles
    for child in cg:
        if child.tag == '{http://www.w3.org/2000/svg}path':
            print(f"  Path child attribs: {child.attrib}")
