import os
import requests
from PIL import Image
import pillow_avif  # registers AVIF support with Pillow

# ====== CONFIG ======
API_KEY = "baz9rYzo6y9ChhFcFUVkF37c"  # <-- put your API key here

INPUT_DIR = r"E:\car\frontend\public\images\models"   # folder with your original images
TEMP_DIR  = os.path.join(INPUT_DIR, "_tmp_jpg")  # temp converted jpgs
OUT_DIR   = os.path.join(INPUT_DIR, "out")       # output with removed bg
# ====================

os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(OUT_DIR, exist_ok=True)

# Process all files in the input dir
for filename in os.listdir(INPUT_DIR):
    in_path = os.path.join(INPUT_DIR, filename)
    if not os.path.isfile(in_path):
        continue  # skip subfolders etc.

    base, ext = os.path.splitext(filename)
    ext = ext.lower()

    # Optionally limit to some extensions
    if ext not in [".jpg", ".jpeg", ".png", ".webp", ".avif"]:
        print(f"Skipping (unsupported ext): {filename}")
        continue

    print(f"\nProcessing: {filename}")

    # 1) Convert anything → REAL JPG first
    tmp_jpg_path = os.path.join(TEMP_DIR, base + ".jpg")
    try:
        with Image.open(in_path) as im:
            # convert to RGB (remove alpha if present)
            if im.mode in ("RGBA", "LA"):
                bg = Image.new("RGB", im.size, (255, 255, 255))
                bg.paste(im, mask=im.split()[-1])
                im = bg
            else:
                im = im.convert("RGB")

            im.save(tmp_jpg_path, "JPEG", quality=95)
        print(f"   [OK] Converted to JPG → {tmp_jpg_path}")
    except Exception as e:
        print(f"   [ERROR] Failed to convert {filename} to JPG: {e}")
        continue

    # 2) Send the converted JPG to remove.bg
    out_path = os.path.join(OUT_DIR, base + ".png")  # remove.bg returns PNG

    try:
        with open(tmp_jpg_path, "rb") as f:
            response = requests.post(
                "https://api.remove.bg/v1.0/removebg",
                files={"image_file": f},
                data={"size": "auto"},
                headers={"X-Api-Key": API_KEY},
                timeout=60,  # avoid hanging forever
            )
    except Exception as e:
        print(f"   [ERROR] Request failed for {filename}: {e}")
        continue

    if response.status_code == 200:
        with open(out_path, "wb") as out_file:
            out_file.write(response.content)
        print(f"   [OK] Saved → {out_path}")
    else:
        print(f"   [ERROR] {response.status_code}: {response.text}")
