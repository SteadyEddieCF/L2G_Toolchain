#!/usr/bin/env python3
"""Static validation for L2G monorepo text/source artifacts."""
from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FAILURES: list[str] = []
WARNINGS: list[str] = []


def fail(message: str) -> None:
    FAILURES.append(message)


def warn(message: str) -> None:
    WARNINGS.append(message)


def validate_json() -> None:
    for path in ROOT.rglob("*.json"):
        if any(part.startswith(".") for part in path.relative_to(ROOT).parts):
            continue
        try:
            json.loads(path.read_text(encoding="utf-8"))
        except Exception as exc:
            fail(f"Invalid JSON: {path.relative_to(ROOT)}: {exc}")


def validate_html() -> None:
    for path in ROOT.rglob("*.html"):
        text = path.read_text(encoding="utf-8", errors="replace")
        rel = path.relative_to(ROOT)
        if re.search(r'<script[^>]+src=["\']https?://', text, re.I):
            fail(f"Remote runtime script found: {rel}")
        if not re.search(r"connect-src\s+'none'", text, re.I):
            warn(f"No connect-src 'none' found: {rel}")
        ids = re.findall(r'\bid=["\']([^"\']+)["\']', text, re.I)
        dupes = sorted({value for value in ids if ids.count(value) > 1})
        if dupes:
            fail(f"Duplicate static HTML IDs in {rel}: {dupes[:10]}")
        version_match = re.search(r'v\d+(?:\.\d+){0,2}', path.stem, re.I)
        if version_match and version_match.group(0).lower() not in text.lower():
            warn(f"Filename version not found in HTML text: {rel}")


def validate_release_manifests() -> None:
    for path in ROOT.rglob("*Release_Manifest*.json"):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            continue
        for item in data.get("files", []):
            if not item.get("name") or not item.get("sha256"):
                fail(f"Incomplete release-manifest entry: {path.relative_to(ROOT)}")
            sha = str(item.get("sha256", ""))
            if sha and not re.fullmatch(r"[0-9a-f]{64}", sha, re.I):
                fail(f"Invalid SHA-256 in {path.relative_to(ROOT)}: {sha}")


def validate_contract_registry() -> None:
    path = ROOT / "contracts" / "registry.json"
    if not path.exists():
        fail("Missing contracts/registry.json")
        return
    data = json.loads(path.read_text(encoding="utf-8"))
    seen: set[tuple[str, str]] = set()
    for row in data.get("contracts", []):
        key = (str(row.get("package_kind", "")), str(row.get("version", "")))
        if not all(key):
            fail("Contract registry contains a row without package_kind/version")
        if key in seen:
            fail(f"Duplicate contract registry entry: {key}")
        seen.add(key)


def main() -> int:
    validate_json()
    validate_html()
    validate_release_manifests()
    validate_contract_registry()
    print(f"Validated repository: {ROOT}")
    print(f"Warnings: {len(WARNINGS)}")
    for message in WARNINGS:
        print(f"WARNING: {message}")
    print(f"Failures: {len(FAILURES)}")
    for message in FAILURES:
        print(f"FAIL: {message}")
    return 1 if FAILURES else 0


if __name__ == "__main__":
    raise SystemExit(main())
