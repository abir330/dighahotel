import os
from PIL import Image, ImageEnhance, ImageFilter

SRC_DIR = r"D:\Digha Hotel\Original hotel photo"
OUT_DIR = r"D:\Digha Hotel\assets\images"
os.makedirs(OUT_DIR, exist_ok=True)

def enhance_image(img, brightness=1.03, contrast=1.06, color=1.08, sharpness=1.12):
    """Gives photographs a clean, crisp, appetizing boutique hotel look."""
    if brightness != 1.0:
        img = ImageEnhance.Brightness(img).enhance(brightness)
    if contrast != 1.0:
        img = ImageEnhance.Contrast(img).enhance(contrast)
    if color != 1.0:
        img = ImageEnhance.Color(img).enhance(color)
    if sharpness != 1.0:
        img = ImageEnhance.Sharpness(img).enhance(sharpness)
    return img

def save_optimized(img, filename_base):
    jpg_path = os.path.join(OUT_DIR, f"{filename_base}.jpg")
    webp_path = os.path.join(OUT_DIR, f"{filename_base}.webp")
    
    # Save progressive high quality JPEG
    img.save(jpg_path, "JPEG", quality=90, progressive=True, optimize=True)
    # Save modern WebP version for Core Web Vitals / SEO
    img.save(webp_path, "WEBP", quality=88, method=6)
    print(f"Processed: {filename_base}.jpg and .webp ({img.size[0]}x{img.size[1]})")

# 1. Daylight Exterior (hotel ful pic.jpeg) - crop bottom people heads (approx 35px)
p1 = os.path.join(SRC_DIR, "hotel ful pic.jpeg")
with Image.open(p1) as im:
    w, h = im.size
    # Crop top-left-right-bottom, trimming 45px from bottom where partial heads are visible
    cropped = im.crop((0, 0, w, h - 45))
    enhanced = enhance_image(cropped, brightness=1.02, contrast=1.05, color=1.06, sharpness=1.15)
    save_optimized(enhanced, "hotel-exterior-day")
    
    # Also create a wide hero banner (16:9 ratio)
    hero_w = enhanced.width
    hero_h = int(hero_w * 9 / 16)
    if hero_h <= enhanced.height:
        hero_crop = enhanced.crop((0, (enhanced.height - hero_h)//2, hero_w, (enhanced.height - hero_h)//2 + hero_h))
        hero_resized = hero_crop.resize((1920, 1080), Image.Resampling.LANCZOS)
        save_optimized(hero_resized, "hero-banner-exterior")

# 2. Night Exterior with LED Illumination (room 7.jpeg)
p2 = os.path.join(SRC_DIR, "room 7.jpeg")
with Image.open(p2) as im:
    w, h = im.size
    # Crop bottom 65px to completely strip out the "Shot on vivo" watermark and 2023 timestamp
    cropped = im.crop((0, 0, w, h - 65))
    enhanced = enhance_image(cropped, brightness=1.04, contrast=1.10, color=1.12, sharpness=1.15)
    save_optimized(enhanced, "hotel-exterior-night")

# 3. Main Entrance Gate (main gate.jpeg)
p3 = os.path.join(SRC_DIR, "main gate.jpeg")
with Image.open(p3) as im:
    w, h = im.size
    # Crop bottom 180px of excessive foreground lawn rubble to focus on the gate & "DOLLHOUSE" sign
    cropped = im.crop((0, 0, w, h - 180))
    enhanced = enhance_image(cropped, brightness=1.03, contrast=1.08, color=1.08, sharpness=1.12)
    save_optimized(enhanced, "hotel-main-gate")

# 4. Bathroom (bathroom.jpeg)
p4 = os.path.join(SRC_DIR, "bathroom.jpeg")
with Image.open(p4) as im:
    w, h = im.size
    cropped = im.crop((0, 30, w, h - 20))
    enhanced = enhance_image(cropped, brightness=1.08, contrast=1.06, color=1.04, sharpness=1.10)
    save_optimized(enhanced, "bathroom-suite")

# 5. Deluxe Room 1 (room 3.jpeg)
p5 = os.path.join(SRC_DIR, "room 3.jpeg")
with Image.open(p5) as im:
    enhanced = enhance_image(im, brightness=1.06, contrast=1.06, color=1.08, sharpness=1.10)
    save_optimized(enhanced, "room-deluxe-ac-1")

# 6. Deluxe Room 2 with Green/Pink Dome (room 15.jpeg)
p6 = os.path.join(SRC_DIR, "room 15.jpeg")
with Image.open(p6) as im:
    enhanced = enhance_image(im, brightness=1.05, contrast=1.06, color=1.08, sharpness=1.10)
    save_optimized(enhanced, "room-deluxe-ac-2")

# 7. Executive Master Suite (room 4.jpeg) - Wide angle
p7 = os.path.join(SRC_DIR, "room 4.jpeg")
with Image.open(p7) as im:
    w, h = im.size
    # Crop bottom 35px to remove the 2022 timestamp
    cropped = im.crop((0, 0, w, h - 35))
    enhanced = enhance_image(cropped, brightness=1.04, contrast=1.06, color=1.08, sharpness=1.12)
    save_optimized(enhanced, "room-executive-suite")

# 8. Chandelier Luxury False Ceiling (room 19.jpeg)
p8 = os.path.join(SRC_DIR, "room 19.jpeg")
with Image.open(p8) as im:
    enhanced = enhance_image(im, brightness=1.03, contrast=1.08, color=1.10, sharpness=1.15)
    save_optimized(enhanced, "room-ceiling-chandelier")

# 9. Geometric False Ceiling (room 9.jpeg)
p9 = os.path.join(SRC_DIR, "room 9.jpeg")
with Image.open(p9) as im:
    enhanced = enhance_image(im, brightness=1.03, contrast=1.06, color=1.08, sharpness=1.12)
    save_optimized(enhanced, "room-ceiling-geometric")

# 10. Carved Bed & Floral Bedding Detail (room 16.jpeg)
p10 = os.path.join(SRC_DIR, "room 16.jpeg")
with Image.open(p10) as im:
    enhanced = enhance_image(im, brightness=1.05, contrast=1.06, color=1.08, sharpness=1.10)
    save_optimized(enhanced, "room-carved-bed-detail")

# 11. Room with AC & Dual Curtains (room 21.jpeg)
p11 = os.path.join(SRC_DIR, "room 21.jpeg")
with Image.open(p11) as im:
    w, h = im.size
    # Crop bottom 40px to remove the 2023 timestamp
    cropped = im.crop((0, 0, w, h - 40))
    enhanced = enhance_image(cropped, brightness=1.04, contrast=1.05, color=1.06, sharpness=1.10)
    save_optimized(enhanced, "room-ac-suite")

# 12. Room with Teak Bed (room 14.jpeg)
p12 = os.path.join(SRC_DIR, "room 14.jpeg")
with Image.open(p12) as im:
    enhanced = enhance_image(im, brightness=1.05, contrast=1.06, color=1.08, sharpness=1.10)
    save_optimized(enhanced, "room-classic-ac")

# 13. Room with Purple/Blue Ambience (room 1.jpeg)
p13 = os.path.join(SRC_DIR, "room 1.jpeg")
with Image.open(p13) as im:
    enhanced = enhance_image(im, brightness=1.05, contrast=1.06, color=1.08, sharpness=1.10)
    save_optimized(enhanced, "room-ambient-glow")

# 14. Old Digha Bathing Beach (bathing beach.jpeg)
p14 = os.path.join(SRC_DIR, "bathing beach.jpeg")
with Image.open(p14) as im:
    w, h = im.size
    # Crop top 85px (phone status bar 10:27 AM) and bottom 140px (Like, comment, share bar)
    cropped = im.crop((0, 85, w, h - 140))
    enhanced = enhance_image(cropped, brightness=1.04, contrast=1.08, color=1.06, sharpness=1.15)
    save_optimized(enhanced, "digha-bathing-beach-ghat")

# 15. Digha Sea Promenade & Colorful Benches (WhatsApp Image 2026-11-14 at 10.07.031 PM.jpeg)
p15 = os.path.join(SRC_DIR, "WhatsApp Image 2026-11-14 at 10.07.031 PM.jpeg")
with Image.open(p15) as im:
    enhanced = enhance_image(im, brightness=1.03, contrast=1.06, color=1.08, sharpness=1.12)
    save_optimized(enhanced, "digha-sea-promenade-view")

# 16. Digha Beach Waves & Vacation Crowd (WhatsApp Image 2026-11-14 at 10.07.032 PM.jpeg)
p16 = os.path.join(SRC_DIR, "WhatsApp Image 2026-11-14 at 10.07.032 PM.jpeg")
with Image.open(p16) as im:
    enhanced = enhance_image(im, brightness=1.03, contrast=1.06, color=1.08, sharpness=1.12)
    save_optimized(enhanced, "digha-beach-waves-crowd")

# 17. Night facade lighting close portrait (WhatsApp Image 2026-11-14 at 10.07.03 PM.jpeg)
p17 = os.path.join(SRC_DIR, "WhatsApp Image 2026-11-14 at 10.07.03 PM.jpeg")
with Image.open(p17) as im:
    w, h = im.size
    # Crop bottom 60px to remove Vivo AI watermark and date
    cropped = im.crop((0, 0, w, h - 60))
    enhanced = enhance_image(cropped, brightness=1.04, contrast=1.08, color=1.10, sharpness=1.15)
    save_optimized(enhanced, "hotel-night-facade-portrait")

print("\n--- ALL IMAGES PROCESSED, ENHANCED, CLEANED & EXPORTED SUCCESSFULLY! ---")
