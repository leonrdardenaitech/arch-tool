"""
Generates high-resolution QR codes for the Anergi Mini S.P.A. page.
Target URL: https://anergi.io/mini_spa.html
"""
import os
import qrcode
from PIL import Image, ImageDraw, ImageFont

TARGET_URL = "https://anergi.io/mini_spa.html"

OUTPUT_DIRS = [
    r"C:\Users\Leonr\Downloads",
    r"C:\Users\Leonr\projects\arch-tool\public"
]

for d in OUTPUT_DIRS:
    os.makedirs(d, exist_ok=True)

# 1. Clean High-Res QR Code (Black on White, 1024x1024)
qr = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,  # 30% error correction allows stickers/overlays
    box_size=24,
    border=4,
)
qr.add_data(TARGET_URL)
qr.make(fit=True)

clean_img = qr.make_image(fill_color="black", back_color="white").convert("RGBA")
# Resize smoothly to 1024x1024
clean_img = clean_img.resize((1024, 1024), Image.Resampling.LANCZOS)

for d in OUTPUT_DIRS:
    clean_path = os.path.join(d, "minispa_qr_clean.png")
    clean_img.save(clean_path, "PNG")
    print(f"Saved clean QR to {clean_path}")

# 2. Transparent Background QR Code (Crisp Black modules on transparent)
qr_trans = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=24,
    border=4,
)
qr_trans.add_data(TARGET_URL)
qr_trans.make(fit=True)

trans_img = qr_trans.make_image(fill_color="black", back_color="transparent").convert("RGBA")
trans_img = trans_img.resize((1024, 1024), Image.Resampling.LANCZOS)

for d in OUTPUT_DIRS:
    trans_path = os.path.join(d, "minispa_qr_transparent.png")
    trans_img.save(trans_path, "PNG")
    print(f"Saved transparent QR to {trans_path}")

# 3. Video Overlay Card (Broadcast-Ready Cyber Graphic, 1080x1080)
# Dark Anergi Charcoal background, Orange border, Call-to-action text
card_size = (1080, 1080)
card = Image.new("RGBA", card_size, (20, 25, 35, 255))
draw = ImageDraw.Draw(card)

# Cyber Accent Border (Amber/Orange)
draw.rectangle([(20, 20), (1060, 1060)], outline=(253, 153, 30, 255), width=6)
# Inner Subtle Frame
draw.rectangle([(32, 32), (1048, 1048)], outline=(75, 85, 99, 180), width=2)

# Corner Accent Brackets
corner_len = 50
draw.line([(20, 20), (20 + corner_len, 20)], fill=(0, 229, 255, 255), width=10)
draw.line([(20, 20), (20, 20 + corner_len)], fill=(0, 229, 255, 255), width=10)
draw.line([(1060, 20), (1060 - corner_len, 20)], fill=(0, 229, 255, 255), width=10)
draw.line([(1060, 20), (1060, 20 + corner_len)], fill=(0, 229, 255, 255), width=10)
draw.line([(20, 1060), (20 + corner_len, 1060)], fill=(0, 229, 255, 255), width=10)
draw.line([(20, 1060), (20, 1060 - corner_len)], fill=(0, 229, 255, 255), width=10)
draw.line([(1060, 1060), (1060 - corner_len, 1060)], fill=(0, 229, 255, 255), width=10)
draw.line([(1060, 1060), (1060, 1060 - corner_len)], fill=(0, 229, 255, 255), width=10)

# Header Text
draw.text((540, 95), "ANERGI.IO // MINI S.P.A.", fill=(253, 153, 30, 255), anchor="mm")
draw.text((540, 155), "FREE 60-SECOND PERIMETER SCAN", fill=(255, 255, 255, 255), anchor="mm")

# White Badge Backing for QR Code to guarantee 100% phone camera scanning
qr_badge_size = 620
qr_x = (1080 - qr_badge_size) // 2
qr_y = 220
draw.rounded_rectangle([(qr_x, qr_y), (qr_x + qr_badge_size, qr_y + qr_badge_size)], radius=24, fill=(255, 255, 255, 255))

# Paste Clean QR Code inside badge
qr_for_card = clean_img.resize((560, 560), Image.Resampling.LANCZOS)
card.paste(qr_for_card, (qr_x + 30, qr_y + 30), qr_for_card)

# Footer Call to Action
draw.text((540, 910), "SCAN WITH YOUR PHONE CAMERA", fill=(0, 229, 255, 255), anchor="mm")
draw.text((540, 970), "https://anergi.io/mini_spa.html", fill=(241, 245, 249, 255), anchor="mm")

for d in OUTPUT_DIRS:
    card_path = os.path.join(d, "minispa_qr_video_overlay.png")
    card.save(card_path, "PNG")
    print(f"Saved broadcast video card to {card_path}")

print("All QR assets generated successfully!")
