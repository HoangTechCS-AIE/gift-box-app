import qrcode
from PIL import Image, ImageDraw

def create_heart_qr(url, output_path, fill_color="pink", back_color="white"):
    # 1. Generate QR Code with High Error Correction
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=2, 
    )
    qr.add_data(url)
    qr.make(fit=True)

    # Create standard QR image
    qr_img = qr.make_image(fill_color=fill_color, back_color=back_color).convert('RGBA')
    
    # 2. Rotate 45 degrees
    # expand=True ensures we don't crop the corners during rotation
    rotated_qr = qr_img.rotate(45, expand=True, fillcolor=back_color)
    width, height = rotated_qr.size
    
    # 3. Create Heart Mask
    mask = Image.new('L', (width, height), 0)
    
    # Mathematical Heart Formula: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
    # Center the coordinates
    cx, cy = width / 2, height / 2
    # Scale factor to fill the image mostly
    scale = min(width, height) / 2.5
    
    # Optimization: Iterate only where efficient or use drawing primitives?
    # Iterating pixels in Python is slow but flexible for this formula.
    # Given resolution (approx 400-600px), it's acceptable.
    
    # We want the heart to be upright.
    # The heart formula (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0 draws an upright heart.
    
    pixels = mask.load()
    for x in range(width):
        for y in range(height):
            # Normalize coordinates to approx -1.5 to 1.5 range
            nx = (x - cx) / scale
            ny = (y - cy) / scale
            # Flip Y because image Y grows downwards
            ny = -ny + 0.2 # Shift up slightly to fit better
            
            # Formula check
            if (nx**2 + ny**2 - 1)**3 - (nx**2 * ny**3) <= 0:
                pixels[x, y] = 255

    # 4. Composite
    # Create final image with white background (or transparent)
    # User likely prints it on white or transparent.
    # Let's support transparency for the outside of the heart.
    
    final_img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    # Paste rotated QR using the heart mask
    final_img.paste(rotated_qr, (0, 0), mask)
    
    # Crop to content for tighter fit
    bbox = final_img.getbbox()
    if bbox:
        final_img = final_img.crop(bbox)

    # 5. Save
    final_img.save(output_path)
    print(f"Heart QR (Rotate & Crop) saved to {output_path}")

if __name__ == "__main__":
    url = "https://gift-box-app-indol.vercel.app/"
    output_file = "gift-box/public/heart-qr.png"
    # Pink color
    create_heart_qr(url, output_file, fill_color="#ffb6c1", back_color="white")
