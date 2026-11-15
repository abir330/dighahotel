import os
from PIL import Image

IMG_DIR = r"D:\Digha Hotel\assets\images"

def make_card_thumb(src_name, target_name, target_size=(800, 560), anchor="center"):
    src_path = os.path.join(IMG_DIR, f"{src_name}.jpg")
    if not os.path.exists(src_path):
        return
    with Image.open(src_path) as im:
        target_w, target_h = target_size
        target_aspect = target_w / target_h
        im_aspect = im.width / im.height
        
        if im_aspect > target_aspect:
            # Source is wider, crop sides
            new_w = int(im.height * target_aspect)
            if anchor == "center":
                left = (im.width - new_w) // 2
            elif anchor == "left":
                left = 0
            else:
                left = im.width - new_w
            box = (left, 0, left + new_w, im.height)
        else:
            # Source is taller, crop top/bottom
            new_h = int(im.width / target_aspect)
            if anchor == "center":
                top = (im.height - new_h) // 2
            elif anchor == "top":
                top = 0
            elif anchor == "bottom":
                top = im.height - new_h
            else:
                top = (im.height - new_h) // 2
            box = (0, top, im.width, top + new_h)
            
        cropped = im.crop(box)
        resized = cropped.resize(target_size, Image.Resampling.LANCZOS)
        
        jpg_out = os.path.join(IMG_DIR, f"{target_name}.jpg")
        webp_out = os.path.join(IMG_DIR, f"{target_name}.webp")
        resized.save(jpg_out, "JPEG", quality=90, progressive=True, optimize=True)
        resized.save(webp_out, "WEBP", quality=88, method=6)
        print(f"Generated card: {target_name} ({target_w}x{target_h})")

# Standardized room cards
make_card_thumb("room-deluxe-ac-1", "card-room-deluxe-1", (800, 560), anchor="center")
make_card_thumb("room-deluxe-ac-2", "card-room-deluxe-2", (800, 560), anchor="center")
make_card_thumb("room-executive-suite", "card-room-suite", (800, 560), anchor="center")
make_card_thumb("room-ac-suite", "card-room-ac", (800, 560), anchor="center")
make_card_thumb("room-ceiling-chandelier", "card-room-ceiling", (800, 560), anchor="center")
make_card_thumb("bathroom-suite", "card-bathroom", (800, 560), anchor="center")
make_card_thumb("hotel-exterior-day", "card-exterior-day", (800, 560), anchor="center")
make_card_thumb("hotel-exterior-night", "card-exterior-night", (800, 560), anchor="center")
make_card_thumb("hotel-main-gate", "card-main-gate", (800, 560), anchor="center")
make_card_thumb("digha-bathing-beach-ghat", "card-beach-ghat", (800, 560), anchor="center")
make_card_thumb("digha-sea-promenade-view", "card-beach-promenade", (800, 560), anchor="center")
make_card_thumb("digha-beach-waves-crowd", "card-beach-waves", (800, 560), anchor="center")

print("Standardized card thumbnails created!")
