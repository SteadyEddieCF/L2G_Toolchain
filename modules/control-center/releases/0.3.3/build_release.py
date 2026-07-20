#!/usr/bin/env python3
from __future__ import annotations
import gzip
import hashlib
from pathlib import Path

HERE = Path(__file__).resolve().parent
SOURCE = HERE / "source"
OUTPUT = HERE.parent / "v0.3.3" / "L2G_CC_v0.3.3.html"
EXPECTED_SHA256 = "29242ec69e3c44e52e33c2941b647eb9566ac721957d3965e67306fbeae2ccfc"

parts = sorted(SOURCE.glob("L2G_CC_v0.3.3.html.gz.part*.bin"))
if len(parts) != 6:
    raise SystemExit(f"Expected 6 source parts, found {len(parts)}")

compressed = b"".join(path.read_bytes() for path in parts)
html = gzip.decompress(compressed)
actual = hashlib.sha256(html).hexdigest()
if actual != EXPECTED_SHA256:
    raise SystemExit(f"SHA-256 mismatch: expected {EXPECTED_SHA256}, got {actual}")

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.write_bytes(html)
print(f"Built {OUTPUT} ({len(html)} bytes, sha256={actual})")
