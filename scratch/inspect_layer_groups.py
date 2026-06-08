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
        
        # Get children of root
        top_gs = root.findall('./svg:g', ns)
        print(f"\n--- File: {f} ---")
        print(f"  Top-level <g> tags: {len(top_gs)}")
        for idx, g in enumerate(top_gs):
            g_id = g.attrib.get('id', 'no-id')
            g_label = g.attrib.get('{http://www.w3.org/1999/xlink}label', 'no-label')
            inkscape_label = g.attrib.get('{http://www.inkscape.org/namespaces/inkscape}label', 'no-inkscape-label')
            
            # Count paths inside this group
            paths_in_g = g.findall('.//svg:path', ns)
            images_in_g = g.findall('.//svg:image', ns)
            
            print(f"    g #{idx}: id='{g_id}', label='{g_label}', inkscape_label='{inkscape_label}', paths={len(paths_in_g)}, images={len(images_in_g)}")
            
            # Print child elements if any
            for child in list(g)[:3]:
                print(f"      child tag: {child.tag.replace('{http://www.w3.org/2000/svg}', '')}, attribs: {child.attrib.keys()}")
    except Exception as e:
        print(f"Error {f}: {e}")
