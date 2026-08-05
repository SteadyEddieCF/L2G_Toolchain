from __future__ import annotations

import hashlib
import json
import subprocess
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
subprocess.run([sys.executable, str(ROOT / "scripts" / "build_v06.py")], cwd=ROOT, check=True)
subprocess.run([sys.executable, str(ROOT / "scripts" / "validate.py")], cwd=ROOT, check=True)
release_dir = ROOT / "releases" / "v0.6.1"
zip_path = ROOT / "dist" / "L2G_Integrated_Suite_Scope_v0.6.1.zip"
with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_STORED) as archive:
    for file in sorted(release_dir.iterdir()):
        info = zipfile.ZipInfo(file.name, date_time=(2026, 8, 5, 0, 0, 0))
        info.compress_type = zipfile.ZIP_STORED
        info.external_attr = 0o100644 << 16
        archive.writestr(info, file.read_bytes())
print(json.dumps({"zip": zip_path.name, "sha256": hashlib.sha256(zip_path.read_bytes()).hexdigest(), "entries": len(zipfile.ZipFile(zip_path).namelist())}, sort_keys=True))
