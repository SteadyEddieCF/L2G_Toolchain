from __future__ import annotations

import base64
import gzip
import hashlib
import subprocess
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
BASE = HERE.parent / "v1.7" / "CMMC_L2_SSP_Modern_Editable_v1.7.html"
PATCH_B64 = HERE / "source" / "runtime-v1.7-to-v1.7.1.patch.gz.b64"
OUTPUT = HERE / "CMMC_L2_SSP_Modern_Editable_v1.7.1.html"

BASE_SHA256 = "cc52f7f492798ded15ad093c9e2b9a45446eacab29039ed33729853cf7a52562"
OUTPUT_SHA256 = "8d1e7bd57808b4af216918bf8f692611f27b41ddf222a99cb47a848aec23a1b3"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    if not BASE.exists():
        raise SystemExit(f"Missing authoritative v1.7 runtime: {BASE}")
    if sha256(BASE) != BASE_SHA256:
        raise SystemExit("Authoritative v1.7 runtime hash does not match the governed baseline.")

    try:
        patch_bytes = gzip.decompress(base64.b64decode(PATCH_B64.read_text(encoding="utf-8").strip()))
    except Exception as exc:
        raise SystemExit(f"Unable to decode the governed v1.7.1 patch: {exc}") from exc

    OUTPUT.write_bytes(BASE.read_bytes())
    with tempfile.NamedTemporaryFile(suffix=".patch") as patch_file:
        patch_file.write(patch_bytes)
        patch_file.flush()
        subprocess.run(
            ["patch", "--batch", "--forward", str(OUTPUT), patch_file.name],
            check=True,
        )

    actual = sha256(OUTPUT)
    if actual != OUTPUT_SHA256:
        raise SystemExit(
            f"Materialized runtime hash mismatch: expected {OUTPUT_SHA256}, got {actual}"
        )

    print(f"Materialized {OUTPUT.name}")
    print(f"SHA-256: {actual}")


if __name__ == "__main__":
    main()
