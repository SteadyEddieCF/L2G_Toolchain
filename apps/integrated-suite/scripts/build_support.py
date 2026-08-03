from __future__ import annotations

import hashlib
import json
import os
import shutil
import subprocess
import zipfile
from pathlib import Path
from typing import Any

APP_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = APP_ROOT.parents[1]
BUILD_DIR = APP_ROOT / "build"
DIST_DIR = APP_ROOT / "dist"
FIXTURE_DIR = BUILD_DIR / "fixtures"
RELEASE = json.loads((APP_ROOT / "release" / "release.json").read_text(encoding="utf-8"))
RELEASE_DIR = APP_ROOT / "releases" / f"v{RELEASE['version']}"
REGISTRY = json.loads((REPO_ROOT / "contracts" / "registry.json").read_text(encoding="utf-8"))


def normalize(text: str) -> str:
    return text.replace("\r\n", "\n").replace("\r", "\n").rstrip() + "\n"


def stable_json(value: Any, indent: int = 2) -> str:
    return json.dumps(value, indent=indent, sort_keys=True, ensure_ascii=False, separators=(",", ": ")) + "\n"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def compile_typescript() -> None:
    local = APP_ROOT / "node_modules" / ".bin" / ("tsc.cmd" if os.name == "nt" else "tsc")
    compiler = str(local) if local.exists() else shutil.which("tsc")
    if not compiler:
        raise SystemExit("TypeScript compiler is unavailable. Run npm ci in apps/integrated-suite.")
    subprocess.run([compiler, "-p", str(APP_ROOT / "tsconfig.build.json")], cwd=APP_ROOT, check=True)


def write_zip(path: Path, entries: dict[str, bytes], compression: int = zipfile.ZIP_STORED) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(path, "w", compression=compression, allowZip64=False) as archive:
        for name in sorted(entries):
            info = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = compression
            info.create_system = 0
            info.external_attr = 0
            archive.writestr(info, entries[name])


def build_project_entries(*, duplicate_manifest_key: bool = False, tamper_after_integrity: bool = False) -> dict[str, bytes]:
    timestamp = "2026-08-03T00:00:00.000Z"
    engagement = {
        "schema_version": "engagement_v1",
        "engagement_id": "engagement_00000000-0000-4000-8000-000000000001",
        "engagement_name": "McFirecoal Synthetic Foundation Engagement",
        "client_name": "McFirecoal Synthetic Client",
        "system_name": "Integrated Suite Foundation System",
        "phase": "Foundation",
        "objectives": "Validate the local, offline, additive Integrated Suite foundation using synthetic data only.",
        "participants": [
            {
                "id": "participant_00000000-0000-4000-8000-000000000001",
                "name": "Avery Advisor",
                "role": "Synthetic Advisor",
                "organization": "McFirecoal Advisory",
                "visibility": "advisor-only",
            },
            {
                "id": "participant_00000000-0000-4000-8000-000000000002",
                "name": "Casey Client",
                "role": "Synthetic System Owner",
                "organization": "McFirecoal",
                "visibility": "client-safe",
            },
        ],
    }
    reviews = {
        "schema_version": "reviews_actions_v1",
        "examples": [
            {
                "id": "review_00000000-0000-4000-8000-000000000001",
                "title": "Confirm synthetic engagement identity",
                "source_domain": "Pre-Engagement",
                "target_domain": "Reviews & Actions",
                "lifecycle": "Proposed",
                "review_state": "Assigned",
                "operational_state": "Open",
                "visibility": "Advisor-only",
                "rationale": "Foundation-only example used to validate explicit review-state presentation.",
            }
        ],
    }
    manifest = {
        "kind": "l2g_project_v1",
        "schema_version": "1.0",
        "project_id": "project_00000000-0000-4000-8000-000000000001",
        "created_at": timestamp,
        "updated_at": timestamp,
        "application": {
            "name": "L2G Integrated Suite Foundation",
            "version": RELEASE["version"],
            "product_runtime_compatibility_baseline": RELEASE["product_runtime_compatibility_baseline"],
        },
        "evidence_policy": "reference-only",
        "encryption_mode": "none-synthetic-foundation-only",
        "domain_index": [
            {"path": "domains/engagement.json", "schema": "engagement_v1", "authority": "Engagement"},
            {"path": "domains/reviews-actions.json", "schema": "reviews_actions_v1", "authority": "Reviews & Actions"},
        ],
    }
    event = {
        "event_id": "event_00000000-0000-4000-8000-000000000001",
        "timestamp": timestamp,
        "profile": "advisor",
        "action": "project.created",
        "object_type": "project",
        "object_id": manifest["project_id"],
        "summary": "Created a synthetic-only L2G foundation project.",
        "transaction_id": "txn_00000000-0000-4000-8000-000000000001",
    }
    manifest_text = stable_json(manifest)
    if duplicate_manifest_key:
        manifest_text = manifest_text.replace('  "kind": "l2g_project_v1",\n', '  "kind": "l2g_project_v1",\n  "kind": "l2g_project_v1",\n', 1)
    entries: dict[str, bytes] = {
        "manifest.json": manifest_text.encode(),
        "domains/engagement.json": stable_json(engagement).encode(),
        "domains/reviews-actions.json": stable_json(reviews).encode(),
        "history/events.ndjson": (json.dumps(event, sort_keys=True, separators=(",", ":")) + "\n").encode(),
        "history/checkpoints.json": b"[]\n",
        "compatibility/current-registry.json": stable_json(REGISTRY).encode(),
    }
    integrity = {
        "algorithm": "SHA-256",
        "entries": [
            {"path": name, "sha256": sha256(data), "size": len(data)}
            for name, data in sorted(entries.items())
        ],
    }
    entries["integrity/sha256-manifest.json"] = stable_json(integrity).encode()
    if tamper_after_integrity:
        entries["domains/engagement.json"] = entries["domains/engagement.json"].replace(b"Foundation System", b"Tampered System")
    return entries


def build_fixtures() -> None:
    FIXTURE_DIR.mkdir(parents=True, exist_ok=True)
    write_zip(FIXTURE_DIR / "synthetic-foundation-project.l2g", build_project_entries())
    write_zip(FIXTURE_DIR / "invalid-duplicate-json-key.l2g", build_project_entries(duplicate_manifest_key=True))
    write_zip(FIXTURE_DIR / "invalid-tampered-integrity.l2g", build_project_entries(tamper_after_integrity=True))
    write_zip(FIXTURE_DIR / "invalid-compressed-entry.l2g", build_project_entries(), zipfile.ZIP_DEFLATED)

    duplicate_path = FIXTURE_DIR / "invalid-duplicate-path.l2g"
    entries = build_project_entries()
    with zipfile.ZipFile(duplicate_path, "w", compression=zipfile.ZIP_STORED, allowZip64=False) as archive:
        for name in sorted(entries):
            info = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
            archive.writestr(info, entries[name])
        info = zipfile.ZipInfo("manifest.json", date_time=(1980, 1, 1, 0, 0, 0))
        archive.writestr(info, entries["manifest.json"])

    traversal_path = FIXTURE_DIR / "invalid-path-traversal.l2g"
    with zipfile.ZipFile(traversal_path, "w", compression=zipfile.ZIP_STORED, allowZip64=False) as archive:
        info = zipfile.ZipInfo("../outside.txt", date_time=(1980, 1, 1, 0, 0, 0))
        archive.writestr(info, b"blocked")
