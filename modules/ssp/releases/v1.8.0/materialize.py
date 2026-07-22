from __future__ import annotations

import base64
import gzip
import hashlib
import subprocess
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
BASE = HERE.parent / "v1.7.1" / "CMMC_L2_SSP_Modern_Editable_v1.7.1.html"
PATCH_B64 = HERE / "source" / "runtime-v1.7.1-to-v1.8.0.patch.gz.b64"
OUTPUT = HERE / "CMMC_L2_SSP_Modern_Editable_v1.8.0.html"
BASE_SHA256 = "8d1e7bd57808b4af216918bf8f692611f27b41ddf222a99cb47a848aec23a1b3"
PATCH_SOURCE_SHA256 = "60b32c03847defedcbfdbfd563426bbe8eb12e798c3c1a1cb426d39227414490"
OUTPUT_SHA256 = "b51cfe17065fd900c6360c3b85c9e4f29600ac8440ff35a5e6b4ba79f719bdff"

def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main() -> None:
    if digest(BASE) != BASE_SHA256:
        raise SystemExit("Authoritative v1.7.1 runtime hash mismatch.")
    encoded = PATCH_B64.read_text(encoding="utf-8").strip()
    patch_bytes = gzip.decompress(base64.b64decode(encoded))
    if hashlib.sha256(patch_bytes).hexdigest() != PATCH_SOURCE_SHA256:
        raise SystemExit("Governed v1.8.0 patch source hash mismatch.")
    OUTPUT.write_bytes(BASE.read_bytes())
    with tempfile.NamedTemporaryFile(suffix=".patch") as patch:
        patch.write(patch_bytes)
        patch.flush()
        subprocess.run(["patch", "--batch", "--forward", str(OUTPUT), patch.name], check=True)
    actual = digest(OUTPUT)
    if actual != OUTPUT_SHA256:
        raise SystemExit(f"Materialized runtime hash mismatch: expected {OUTPUT_SHA256}, got {actual}")
    print(f"Materialized {OUTPUT.name}")
    print(f"SHA-256: {actual}")

if __name__ == "__main__":
    main()
