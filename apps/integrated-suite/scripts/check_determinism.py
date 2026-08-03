from __future__ import annotations

import hashlib
import json
import subprocess
import sys
from pathlib import Path

APP_ROOT = Path(__file__).resolve().parents[1]
RELEASE = json.loads((APP_ROOT / "release" / "release.json").read_text())
ARTIFACT = APP_ROOT / "dist" / RELEASE["artifact_name"]
MANIFEST = APP_ROOT / "dist" / "release-manifest.json"
SBOM = APP_ROOT / "dist" / "sbom.spdx.json"


def hashes() -> dict[str, str]:
    return {path.name: hashlib.sha256(path.read_bytes()).hexdigest() for path in (ARTIFACT, MANIFEST, SBOM)}


before = hashes()
subprocess.run([sys.executable, str(APP_ROOT / "scripts" / "build.py")], cwd=APP_ROOT, check=True, stdout=subprocess.DEVNULL)
after = hashes()
if before != after:
    raise SystemExit(f"Deterministic build mismatch: {before} != {after}")
print(json.dumps({"deterministic": True, "hashes": after}, sort_keys=True))
