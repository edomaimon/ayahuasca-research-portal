from PIL import Image, ImageDraw, ImageFont
import json
import os

def generate_og_image(total=150, year_range="1972-2026", output_path="og-image.png"):
    """Generate a 1200x630 OG image for social media previews."""
    W, H = 1200, 630
    
    img = Image.new("RGB", (W, H), "#0a1f0e")
    draw = ImageDraw.Draw(img)
    
    # Gradient background with subtle circles
    for y in range(H):
        r = int(10 + (y / H) * 12)
        g = int(31 + (y / H) * 10)
        b = int(14 + (y / H) * 8)
        draw.line([(0, y), (W, y)], fill=(r, g, b))
    
    # Decorative circles
    for cx, cy, radius, alpha in [(150, 100, 200, 20), (1050, 500, 250, 15), (900, 80, 120, 12)]:
        for r in range(radius, 0, -1):
            a = int(alpha * (1 - r / radius))
            color = (34 + a, 85 + a, 34 + a)
            draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color)
    
    # Try to load fonts, fall back to default
    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", 58)
        font_number = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 72)
        font_label = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
        font_subtitle = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 13)
    except:
        font_large = ImageFont.load_default()
        font_number = font_large
        font_label = font_large
        font_small = font_large
        font_subtitle = font_large
    
    # Top subtitle
    subtitle = "PEER-REVIEWED SCIENTIFIC LITERATURE DATABASE"
    bbox = draw.textbbox((0, 0), subtitle, font=font_subtitle)
    sw = bbox[2] - bbox[0]
    draw.text(((W - sw) / 2, 135), subtitle, fill=(255, 255, 255, 128), font=font_subtitle)
    
    # Title line 1
    title1 = "Ayahuasca"
    bbox = draw.textbbox((0, 0), title1, font=font_large)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) / 2, 185), title1, fill=(255, 255, 255), font=font_large)
    
    # Title line 2
    title2 = "Research Portal"
    bbox = draw.textbbox((0, 0), title2, font=font_large)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) / 2, 250), title2, fill=(255, 255, 255), font=font_large)
    
    # Divider line
    line_y = 330
    line_w = 80
    draw.line([(W/2 - line_w, line_y), (W/2 + line_w, line_y)], fill=(255, 255, 255, 64), width=1)
    
    # Article count number
    count_str = str(total)
    bbox = draw.textbbox((0, 0), count_str, font=font_number)
    cw = bbox[2] - bbox[0]
    draw.text(((W - cw) / 2, 355), count_str, fill=(74, 186, 112), font=font_number)
    
    # "Verified Peer-Reviewed Articles" label
    label = "VERIFIED PEER-REVIEWED ARTICLES"
    bbox = draw.textbbox((0, 0), label, font=font_label)
    lw = bbox[2] - bbox[0]
    draw.text(((W - lw) / 2, 440), label, fill=(255, 255, 255, 160), font=font_label)
    
    # Bottom info line
    info = f"{year_range}  •  Updated biweekly  •  ayahuasca-research.com"
    bbox = draw.textbbox((0, 0), info, font=font_small)
    iw = bbox[2] - bbox[0]
    draw.text(((W - iw) / 2, 530), info, fill=(255, 255, 255, 90), font=font_small)
    
    img.save(output_path, "PNG", quality=95)
    print(f"Generated OG image: {output_path} ({total} articles)")

if __name__ == "__main__":
    # Try reading from stats.json
    stats_path = os.path.join(os.path.dirname(__file__), "..", "public", "stats.json")
    total = 150
    year_range = "1972-2026"
    
    if os.path.exists(stats_path):
        with open(stats_path) as f:
            stats = json.load(f)
            total = stats.get("total", total)
            year_range = stats.get("yearRange", year_range)
    
    output = os.path.join(os.path.dirname(__file__), "..", "public", "og-image.png")
    generate_og_image(total, year_range, output)
