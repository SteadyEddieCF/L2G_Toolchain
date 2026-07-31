#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, shutil, zipfile, subprocess, sys

HERE = Path(__file__).resolve().parent
DIST = HERE / "dist"
RUNTIME = HERE / "cmmc_l2_gap_workshop_tool_v79.1.html"
ZIP = DIST / "CMMC_L2_Gap_Workshop_v79.1_Complete_Deliverables.zip"
ROOT = "CMMC_L2_Gap_Workshop_v79.1_Complete_Deliverables"
FIXED = (2026, 7, 31, 22, 0, 0)

subprocess.run([sys.executable, str(HERE / "build_release.py")], check=True)
if DIST.exists():
    shutil.rmtree(DIST)
DIST.mkdir()
files = []
for path in sorted(HERE.rglob("*")):
    if not path.is_file() or "dist" in path.parts or path.name == ZIP.name:
        continue
    files.append(path)
checks = []
for path in files:
    checks.append({
        "path": path.relative_to(HERE).as_posix(),
        "size_bytes": path.stat().st_size,
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
    })
inventory = DIST / "FILE_INVENTORY.json"
inventory.write_text(json.dumps({"release": "v79.1", "files": checks}, indent=2) + "\n", encoding="utf-8")
sums = DIST / "SHA256SUMS.txt"
sums.write_text("\n".join(f'{item["sha256"]}  {item["path"]}' for item in checks) + "\n", encoding="utf-8")
with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for path in files + [inventory, sums]:
        relative = path.relative_to(HERE).as_posix() if path.is_relative_to(HERE) else path.name
        info = zipfile.ZipInfo(f"{ROOT}/{relative}", date_time=FIXED)
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o100644 << 16
        archive.writestr(info, path.read_bytes())
print(json.dumps({
    "standalone": {"path": str(RUNTIME), "size_bytes": RUNTIME.stat().st_size, "sha256": hashlib.sha256(RUNTIME.read_bytes()).hexdigest()},
    "zip": {"path": str(ZIP), "size_bytes": ZIP.stat().st_size, "sha256": hashlib.sha256(ZIP.read_bytes()).hexdigest()},
    "file_count": len(files) + 2,
}, indent=2))
