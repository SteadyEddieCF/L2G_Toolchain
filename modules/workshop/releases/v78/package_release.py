#!/usr/bin/env python3
"""Build deterministic standalone and complete Workshop v78 release artifacts."""
from __future__ import annotations

from pathlib import Path
import hashlib
import json
import shutil
import subprocess
import sys
import zipfile

HERE = Path(__file__).resolve().parent
DIST = HERE / "dist"
STAGE = DIST / "package"
RUNTIME = HERE / "cmmc_l2_gap_workshop_tool_v78.html"
RUNTIME_SHA = "e34723924a81208d986e734e46833c7cfef064a568007dec1ac281fc1e0a0191"
RUNTIME_SIZE = 1814727
ZIP_NAME = "CMMC_L2_Gap_Workshop_v78_Complete_Deliverables.zip"
MANIFEST_NAME = "CMMC_L2_Gap_Workshop_v78_Release_Manifest.json"
FIXED_TIME = (2026, 7, 25, 0, 0, 0)

STATIC_FILES = [
    "README.md",
    "CMMC_L2_Gap_Workshop_Roadmap_v78.md",
    "CMMC_L2_Gap_Workshop_v78_Compatibility_Manifest.json",
    "CMMC_L2_Gap_Workshop_v78_Regression.json",
    "CMMC_L2_Gap_Workshop_v78_Release_Report.md",
    "CMMC_L2_Gap_Workshop_v78_Static_QA.json",
]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def add_zip_file(archive: zipfile.ZipFile, path: Path, arcname: str) -> None:
    info = zipfile.ZipInfo(arcname, FIXED_TIME)
    info.create_system = 3
    info.external_attr = 0o644 << 16
    info.compress_type = zipfile.ZIP_DEFLATED
    archive.writestr(info, path.read_bytes(), compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)


subprocess.run([sys.executable, str(HERE / "build_release.py")], check=True)
if RUNTIME.stat().st_size != RUNTIME_SIZE or sha256(RUNTIME) != RUNTIME_SHA:
    raise SystemExit("Workshop v78 runtime identity mismatch before packaging")

if DIST.exists():
    shutil.rmtree(DIST)
STAGE.mkdir(parents=True)

items: list[tuple[Path, str]] = [(RUNTIME, RUNTIME.name)]
for name in STATIC_FILES:
    source = HERE / name
    if not source.exists():
        raise SystemExit(f"required release file missing: {source}")
    items.append((source, name))
items.append((HERE / "source" / "SOURCE_MANIFEST.json", "SOURCE_MANIFEST.json"))

for source, arcname in items:
    target = STAGE / arcname
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, target)

manifest = {
    "release": "v78",
    "module": "CMMC L2 Gap Workshop Tool",
    "focus": "Contract-safe Reporting and SSP/Workbook Alignment",
    "bounded_issue": 46,
    "runtime": {
        "name": RUNTIME.name,
        "size_bytes": RUNTIME_SIZE,
        "sha256": RUNTIME_SHA,
    },
    "stable_contracts": {
        "workshop_state": "1.0 additive",
        "workbook_handoff": "1.7",
        "workbook_merge": "1.1",
        "ssp_handoff": "1.0",
        "ssp_return": "1.0",
    },
    "files": [
        {
            "name": arcname,
            "size_bytes": (STAGE / arcname).stat().st_size,
            "sha256": sha256(STAGE / arcname),
        }
        for _, arcname in sorted(items, key=lambda item: item[1].lower())
    ],
    "manifest_note": "The manifest inventories every other packaged file. The outer ZIP SHA-256 is written beside the archive.",
}
manifest_path = STAGE / MANIFEST_NAME
manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8", newline="\n")

zip_path = DIST / ZIP_NAME
with zipfile.ZipFile(zip_path, "w") as archive:
    for path in sorted(STAGE.iterdir(), key=lambda entry: entry.name.lower()):
        add_zip_file(archive, path, path.name)

standalone = DIST / RUNTIME.name
shutil.copyfile(RUNTIME, standalone)
shutil.copyfile(manifest_path, DIST / MANIFEST_NAME)
zip_sha = sha256(zip_path)
(DIST / f"{ZIP_NAME}.sha256").write_text(f"{zip_sha}  {ZIP_NAME}\n", encoding="utf-8", newline="\n")
summary = {
    "standalone": {
        "name": standalone.name,
        "size_bytes": standalone.stat().st_size,
        "sha256": sha256(standalone),
    },
    "complete_zip": {
        "name": zip_path.name,
        "size_bytes": zip_path.stat().st_size,
        "sha256": zip_sha,
    },
}
(DIST / "workshop_v78_build_summary.json").write_text(
    json.dumps(summary, indent=2) + "\n", encoding="utf-8", newline="\n"
)
print(json.dumps(summary, indent=2))