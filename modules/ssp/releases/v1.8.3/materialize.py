from __future__ import annotations

import base64
import gzip
import hashlib
import subprocess
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
BASE = HERE.parent / "v1.8.2" / "CMMC_L2_SSP_Modern_Editable_v1.8.2.html"
PATCH_B64 = HERE / "source" / "runtime-v1.8.2-to-v1.8.3.patch.gz.b64"
OUTPUT = HERE / "CMMC_L2_SSP_Modern_Editable_v1.8.3.html"
BASE_SHA256 = "d43294c9121aa968bed5ec983c174b2cc5edfbea7b695f9d323707ae95419d19"
PATCH_SOURCE_SHA256 = "03fa0a2c489060f4ef0636990ccded265f472cdd1904833a29ce0add176d3c33"
OUTPUT_SHA256 = "81602cf206a05efb39297dce21bc06d1d3d43ec495465bb8acf97ceed632b2f5"

def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main() -> None:
    if digest(BASE) != BASE_SHA256:
        raise SystemExit("Authoritative v1.8.2 runtime hash mismatch.")
    patch_bytes = gzip.decompress(base64.b64decode(PATCH_B64.read_text(encoding="utf-8").strip()))
    if hashlib.sha256(patch_bytes).hexdigest() != PATCH_SOURCE_SHA256:
        raise SystemExit("Governed v1.8.3 patch source hash mismatch.")
    OUTPUT.write_bytes(BASE.read_bytes())
    with tempfile.NamedTemporaryFile(suffix=".patch") as patch:
        patch.write(patch_bytes); patch.flush()
        subprocess.run(["patch", "--batch", "--forward", str(OUTPUT), patch.name], check=True)
    actual = digest(OUTPUT)
    if actual != OUTPUT_SHA256:
        raise SystemExit(f"Materialized runtime hash mismatch: expected {OUTPUT_SHA256}, got {actual}")
    print(f"Materialized {OUTPUT.name}")
    print(f"SHA-256: {actual}")

if __name__ == "__main__":
    main()
