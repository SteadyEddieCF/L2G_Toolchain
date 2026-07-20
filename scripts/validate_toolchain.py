#!/usr/bin/env python3
from __future__ import annotations
import hashlib, json, re, sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
failures: list[str] = []
warnings: list[str] = []


class StaticIdCollector(HTMLParser):
    """Collect IDs from parsed HTML markup, excluding JavaScript/template string text."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []

    def _collect(self, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if name.lower() == "id" and value:
                self.ids.append(value)

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self._collect(attrs)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self._collect(attrs)


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

    parser = StaticIdCollector()
    try:
        parser.feed(text)
        parser.close()
    except Exception as exc:
        failures.append(f"Unable to parse HTML for static IDs in {rel}: {exc}")
        continue
    counts = Counter(parser.ids)
    dupes = sorted(value for value, count in counts.items() if count > 1)
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

baseline_manifest_path = ROOT / "tests" / "playwright" / "visual-baseline-manifest.json"
if not baseline_manifest_path.exists():
    warnings.append("No reviewed Playwright visual baseline manifest")
else:
    baseline_manifest = json.loads(baseline_manifest_path.read_text(encoding="utf-8"))
    for row in baseline_manifest.get("files", []):
        rel_path = row.get("path")
        expected_size = row.get("size_bytes")
        expected_sha = row.get("sha256")
        if not rel_path or not expected_sha:
            failures.append("Visual baseline manifest row missing path or sha256")
            continue
        path = ROOT / rel_path
        if not path.exists():
            failures.append(f"Missing reviewed visual baseline: {rel_path}")
            continue
        data = path.read_bytes()
        actual_size = len(data)
        actual_sha = hashlib.sha256(data).hexdigest()
        if expected_size is not None and actual_size != expected_size:
            failures.append(
                f"Visual baseline size mismatch: {rel_path}: expected {expected_size}, got {actual_size}"
            )
        if actual_sha != expected_sha:
            failures.append(
                f"Visual baseline hash mismatch: {rel_path}: expected {expected_sha}, got {actual_sha}"
            )

print(f"Warnings: {len(warnings)}")
for item in warnings:
    print("WARNING:", item)
print(f"Failures: {len(failures)}")
for item in failures:
    print("FAIL:", item)
sys.exit(1 if failures else 0)
