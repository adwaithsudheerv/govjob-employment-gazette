import io
from PIL import Image
from typing import Tuple, Dict, Any, Optional

GOV_PRESETS = {
    "ssc_nic_photo": {
        "name": "SSC / NIC / Central Govt Passport Photo",
        "width": 200,
        "height": 230,
        "min_kb": 20,
        "max_kb": 50,
        "bg_hint": "Light/White background, no glasses/caps"
    },
    "ssc_nic_signature": {
        "name": "SSC / NIC / Central Govt Signature",
        "width": 140,
        "height": 60,
        "min_kb": 10,
        "max_kb": 20,
        "bg_hint": "Black or blue ink on clear white paper"
    },
    "ibps_banking_photo": {
        "name": "IBPS / Banking SO IT Photo",
        "width": 200,
        "height": 230,
        "min_kb": 20,
        "max_kb": 50,
        "bg_hint": "Recent passport photo with clear eye contact"
    },
    "ibps_banking_signature": {
        "name": "IBPS / Banking SO IT Signature",
        "width": 140,
        "height": 60,
        "min_kb": 10,
        "max_kb": 20,
        "bg_hint": "Do NOT sign in capital letters"
    },
    "state_psc_photo": {
        "name": "State PSC / General Public Sector Photo",
        "width": 300,
        "height": 350,
        "min_kb": 20,
        "max_kb": 100,
        "bg_hint": "Frontal view, ears visible"
    }
}

def resize_to_gov_spec(
    image_bytes: bytes,
    preset_key: str = "ssc_nic_photo"
) -> Tuple[bytes, Dict[str, Any]]:
    preset = GOV_PRESETS.get(preset_key, GOV_PRESETS["ssc_nic_photo"])
    target_w = preset["width"]
    target_h = preset["height"]
    min_kb = preset["min_kb"]
    max_kb = preset["max_kb"]

    img = Image.open(io.BytesIO(image_bytes))
    
    # Convert RGBA / P to RGB with white background
    if img.mode in ("RGBA", "LA", "P"):
        background = Image.new("RGB", img.size, (255, 255, 255))
        if img.mode == "P":
            img = img.convert("RGBA")
        background.paste(img, mask=img.split()[-1] if "A" in img.mode else None)
        img = background
    elif img.mode != "RGB":
        img = img.convert("RGB")

    # Resize with high quality Lanczos resampling
    resized_img = img.resize((target_w, target_h), Image.Resampling.LANCZOS)

    # Binary search for JPEG quality to land between min_kb and max_kb
    best_bytes = None
    best_size_kb = 0

    low_q = 20
    high_q = 95
    
    for _ in range(8):
        mid_q = (low_q + high_q) // 2
        buf = io.BytesIO()
        resized_img.save(buf, format="JPEG", quality=mid_q, optimize=True)
        size_kb = len(buf.getvalue()) / 1024.0

        if min_kb <= size_kb <= max_kb:
            best_bytes = buf.getvalue()
            best_size_kb = size_kb
            break
        elif size_kb > max_kb:
            high_q = mid_q - 1
        else:
            low_q = mid_q + 1
            best_bytes = buf.getvalue()
            best_size_kb = size_kb

    # If still below min_kb, pad with minimal comment or save with high quality without optimize
    if not best_bytes or best_size_kb < min_kb:
        buf = io.BytesIO()
        resized_img.save(buf, format="JPEG", quality=95, optimize=False)
        best_bytes = buf.getvalue()
        best_size_kb = len(best_bytes) / 1024.0

    metadata = {
        "preset": preset["name"],
        "dimensions": f"{target_w} x {target_h} px",
        "file_size_kb": round(best_size_kb, 2),
        "is_compliant": min_kb <= best_size_kb <= max_kb,
        "format": "JPEG",
        "min_kb": min_kb,
        "max_kb": max_kb,
        "guidelines": preset["bg_hint"]
    }

    return best_bytes, metadata
