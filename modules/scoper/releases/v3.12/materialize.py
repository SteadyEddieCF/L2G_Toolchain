#!/usr/bin/env python3
from pathlib import Path
import base64
import gzip
import hashlib
import json

ROOT = Path(__file__).resolve().parents[4]
BASELINE = ROOT / "modules/scoper/releases/v3.11/L2Scoper-v3.11.html"
OUTPUT = ROOT / "modules/scoper/releases/v3.12/L2Scoper-v3.12.html"
RESULT = ROOT / "modules/scoper/releases/v3.12/materialization-result.json"
PARTS = sorted((ROOT / "modules/scoper/releases/v3.12/source").glob("patch-v3.12.js.gz.b64.part*"))
EXPECTED_HTML_SHA256 = "2adf329557fb2df4699e13bb572bcde762667292700200f8edeae0dd6ade7ef3"
EXPECTED_PATCH_B64_SHA256 = "c8befb2206d7ed00f567938f276d7b02841cbc861ea3f669f16a32a5b4398789"
EXPECTED_PATCH_SHA256 = "8604e2f3fb48846c463646becb15d21d8f1bf76946688f260653e015499da107"

result = {
    "status": "failure",
    "baseline": str(BASELINE.relative_to(ROOT)),
    "output": str(OUTPUT.relative_to(ROOT)),
    "parts": [str(part.relative_to(ROOT)) for part in PARTS],
}

try:
    if not BASELINE.exists() or not PARTS:
        raise RuntimeError("Missing v3.11 baseline or v3.12 patch source parts")

    b64_text = "".join(part.read_text(encoding="utf-8").strip() for part in PARTS)
    result["patch_base64_length"] = len(b64_text)
    result["patch_base64_sha256"] = hashlib.sha256(b64_text.encode("ascii")).hexdigest()
    if result["patch_base64_sha256"] != EXPECTED_PATCH_B64_SHA256:
        raise RuntimeError("Patch base64 SHA-256 mismatch")

    padded_b64 = b64_text + ("=" * (-len(b64_text) % 4))
    result["patch_base64_padding_added"] = len(padded_b64) - len(b64_text)
    gzip_bytes = base64.b64decode(padded_b64, validate=True)
    result["patch_gzip_length"] = len(gzip_bytes)
    result["patch_gzip_sha256"] = hashlib.sha256(gzip_bytes).hexdigest()

    patch_bytes = gzip.decompress(gzip_bytes)
    result["patch_length"] = len(patch_bytes)
    result["patch_sha256"] = hashlib.sha256(patch_bytes).hexdigest()
    if result["patch_sha256"] != EXPECTED_PATCH_SHA256:
        raise RuntimeError("Patch source SHA-256 mismatch")
    patch = patch_bytes.decode("utf-8")

    text = BASELINE.read_text(encoding="utf-8")
    result["baseline_sha256"] = hashlib.sha256(BASELINE.read_bytes()).hexdigest()
    replacements = {
        "<title>L2G Scoper v3.11</title>": "<title>L2G Scoper v3.12</title>",
        "CUI Boundary / Scoping • v3.11": "CUI Boundary / Scoping • v3.12",
        "const VERSION='3.10';": "const VERSION='3.12';",
        "l2g_scoper_schema_v3.7.json": "l2g_scoper_schema_v3.12.json",
    }
    for old, new in replacements.items():
        if old not in text:
            raise RuntimeError(f"Expected baseline token not found: {old}")
        text = text.replace(old, new, 1)

    marker = "\ninit();\n</script></body></html>"
    if marker not in text:
        raise RuntimeError("Final init marker not found")
    text = text.replace(marker, "\n" + patch + "\n\ninit();\n</script></body></html>", 1)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(text, encoding="utf-8")
    actual = hashlib.sha256(OUTPUT.read_bytes()).hexdigest()
    result["generated_html_sha256"] = actual
    result["generated_html_size_bytes"] = OUTPUT.stat().st_size
    if actual != EXPECTED_HTML_SHA256:
        raise RuntimeError(f"Generated HTML SHA-256 mismatch: {actual} != {EXPECTED_HTML_SHA256}")
    result["status"] = "pass"
except Exception as exc:
    result["error"] = str(exc)
finally:
    RESULT.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")

print(json.dumps(result, indent=2))
if result["status"] != "pass":
    raise SystemExit(1)
