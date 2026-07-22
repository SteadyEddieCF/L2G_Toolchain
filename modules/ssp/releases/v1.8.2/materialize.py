from __future__ import annotations

import base64
import gzip
import hashlib
import subprocess
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
BASE = HERE.parent / "v1.8.1" / "CMMC_L2_SSP_Modern_Editable_v1.8.1.html"
PATCH_B64 = HERE / "source" / "runtime-v1.8.1-to-v1.8.2.patch.gz.b64"
OUTPUT = HERE / "CMMC_L2_SSP_Modern_Editable_v1.8.2.html"
BASE_SHA256 = "f1142a23378780afc544348b84ad62cd965fe1fe353f0c3d6f6adfb3318fb640"
PATCH_SOURCE_SHA256 = "ca4d51ecd9d9fb21ff43ce5fc3db832c335f7a5a3fb17211a672637f6e75e58d"
OUTPUT_SHA256 = "d43294c9121aa968bed5ec983c174b2cc5edfbea7b695f9d323707ae95419d19"

def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main() -> None:
    if digest(BASE) != BASE_SHA256:
        raise SystemExit("Authoritative v1.8.1 runtime hash mismatch.")
    patch_bytes = gzip.decompress(base64.b64decode(PATCH_B64.read_text(encoding="utf-8").strip()))
    if hashlib.sha256(patch_bytes).hexdigest() != PATCH_SOURCE_SHA256:
        raise SystemExit("Governed v1.8.2 patch source hash mismatch.")
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
