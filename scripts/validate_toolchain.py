#!/usr/bin/env python3
from __future__ import annotations
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
failures: list[str] = []
warnings: list[str] = []

for path in ROOT.rglob("*.json"):
    if any(part.startswith(".") for part in path.relative_to(ROOT).parts):
        continue
    try:
        json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        failures.append(f"Invalid JSON: {path.relative_to(ROOT)}: {exc}")

for path in ROOT.rglob("*.html"):
    text = path.read_text(encoding="utf-8", errors="replace")
    rel = path.relative_to(ROOT)
    if re.search(r'<script[^>]+src=["\']https?://', text, re.I):
        failures.append(f"Remote runtime script: {rel}")
    if not re.search(r"connect-src\s+'none'", text, re.I):
        warnings.append(f"No connect-src 'none': {rel}")
    ids = re.findall(r'\bid=["\']([^"\']+)["\']', text, re.I)
    dupes = sorted({v for v in ids if ids.count(v) > 1})
    if dupes:
        failures.append(f"Duplicate static IDs in {rel}: {dupes[:10]}")

registry_path = ROOT / "contracts" / "registry.json"
if not registry_path.exists():
    failures.append("Missing contracts/registry.json")
else:
    registry = json.loads(registry_path.read_text(encoding="utf-8"))
    seen = set()
    for row in registry.get("contracts", []):
        key = (row.get("package_kind"), row.get("version"))
        if not all(key):
            failures.append("Contract row missing package_kind/version")
        if key in seen:
            failures.append(f"Duplicate contract row: {key}")
        seen.add(key)

snapshot_path = ROOT / "suite" / "snapshots" / "suite-2026.07.17-current-inputs.json"
if not snapshot_path.exists():
    failures.append("Missing current suite input snapshot")

print(f"Warnings: {len(warnings)}")
for item in warnings:
    print("WARNING:", item)
print(f"Failures: {len(failures)}")
for item in failures:
    print("FAIL:", item)
sys.exit(1 if failures else 0)
