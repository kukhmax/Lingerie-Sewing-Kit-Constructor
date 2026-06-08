import os
import xml.etree.ElementTree as ET

filepath = r"C:\Users\m-win\Projects\konstructor\anatomia_biustonosz'\2.svg"
tree = ET.parse(filepath)
root = tree.getroot()
ns = {"svg": "http://www.w3.org/2000/svg"}

images = root.findall('.//svg:image', ns)
g_with_image = []
for g in root.findall('.//svg:g', ns):
    img = g.findall('./svg:image', ns)
    if img:
        g_with_image.append((g, img))

print(f"Total <image> tags: {len(images)}")
print(f"Groups directly containing <image>: {len(g_with_image)}")
if g_with_image:
    g, img = g_with_image[0]
    print(f"First group attributes: {g.attrib}")
    print(f"First image attributes: {img[0].attrib.keys()}")
