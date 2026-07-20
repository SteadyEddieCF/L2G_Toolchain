#!/usr/bin/env python3
from pathlib import Path
import base64
import gzip
import hashlib

ROOT = Path(__file__).resolve().parents[4]
BASELINE = ROOT / "modules/scoper/releases/v3.11/L2Scoper-v3.11.html"
OUTPUT = ROOT / "modules/scoper/releases/v3.12/L2Scoper-v3.12.html"
PARTS = sorted((ROOT / "modules/scoper/releases/v3.12/source").glob("patch-v3.12.js.gz.b64.part*"))
EXPECTED_SHA256 = "2adf329557fb2df4699e13bb572bcde762667292700200f8edeae0dd6ade7ef3"

if not BASELINE.exists() or not PARTS:
    raise SystemExit("Missing v3.11 baseline or v3.12 patch source parts")

patch = gzip.decompress(
    base64.b64decode("".join(part.read_text(encoding="utf-8").strip() for part in PARTS))
).decode("utf-8")

text = BASELINE.read_text(encoding="utf-8")
replacements = {
    "<title>L2G Scoper v3.11</title>": "<title>L2G Scoper v3.12</title>",
    "CUI Boundary / Scoping • v3.11": "CUI Boundary / Scoping • v3.12",
    "const VERSION='3.10';": "const VERSION='3.12';",
    "l2g_scoper_schema_v3.7.json": "l2g_scoper_schema_v3.12.json",
}
for old, new in replacements.items():
    if old not in text:
        raise SystemExit(f"Expected baseline token not found: {old}")
    text = text.replace(old, new, 1)

marker = "\ninit();\n</script></body></html>"
if marker not in text:
    raise SystemExit("Final init marker not found")
text = text.replace(marker, "\n" + patch + "\n\ninit();\n</script></body></html>", 1)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.write_text(text, encoding="utf-8")
actual = hashlib.sha256(OUTPUT.read_bytes()).hexdigest()
if actual != EXPECTED_SHA256:
    raise SystemExit(f"Generated HTML SHA-256 mismatch: {actual} != {EXPECTED_SHA256}")
print(f"Materialized {OUTPUT} ({OUTPUT.stat().st_size} bytes, sha256 {actual})")
