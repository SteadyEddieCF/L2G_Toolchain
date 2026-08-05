from __future__ import annotations

import hashlib
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARTIFACT = ROOT / "dist" / "L2G_Integrated_Suite_Scope_v0.6.0.html"

def build() -> str:
    subprocess.run([sys.executable, str(ROOT / "scripts" / "build.py")], cwd=ROOT, check=True, stdout=subprocess.DEVNULL)
    return hashlib.sha256(ARTIFACT.read_bytes()).hexdigest()

first = build()
second = build()
if first != second:
    raise SystemExit(f"v0.6 deterministic build failed: {first} != {second}")
print(f"v0.6 deterministic build passed: {first}")
