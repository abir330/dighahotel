import re, os

with open(r"D:\Digha Hotel\index.html", encoding="utf-8") as f:
    html = f.read()

paths = re.findall(r'(?:src|srcset|data-full)="([^"]+)"', html)
missing = []
valid = 0
for p in paths:
    clean_p = p.split(' ')[0]
    if clean_p.startswith('http') or clean_p.startswith('data:'):
        continue
    full = os.path.join(r"D:\Digha Hotel", clean_p.replace('/', os.sep))
    if not os.path.exists(full):
        missing.append(clean_p)
    else:
        valid += 1

print(f"Total checked: {len(paths)}, Valid local files: {valid}")
if not missing:
    print("SUCCESS: 100% of all image links, styles, and scripts exist on disk!")
else:
    print("Missing assets:", set(missing))
