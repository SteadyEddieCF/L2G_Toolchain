#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
FAILURES: list[str] = []
WARNINGS: list[str] = []

EXPECTED_MODULES = {
    "control-center": ("v0.3.4", "9eec722499fd5f0a76249ccb6f27547d6fe6fc64059a418b136af48b8edf7a73"),
    "docconverter": ("v7.9.5.1", "df64d0912b43d69d5eda256188458c3d32f9aa679c49ed43f6ddf4cb64b9c17d"),
    "scoper": ("v3.12", "2adf329557fb2df4699e13bb572bcde762667292700200f8edeae0dd6ade7ef3"),
    "workshop": ("v79.1", "b6bd63c104faeb031f9561f24aaf6a8fb7b928df2f11c821391ca57131d6e52b"),
    "builder-merger": ("v3.10.1", "2879ee0a933b74c9f27b3c94c0034eafd06f13bc0a8e2d52ba064467b19bfd93"),
    "ssp": ("v1.9.17", "bfd9d10a780809ba259406f0770641da6a40ac2d8a6d1e372b070d6f5273351b"),
}

POINTERS = {
    "control-center": ROOT / "modules/control-center/current/release.json",
    "docconverter": ROOT / "modules/docconverter/current/release.json",
    "scoper": ROOT / "modules/scoper/current/release.json",
    "workshop": ROOT / "modules/workshop/current/release.json",
    "builder-merger": ROOT / "modules/builder-merger/current/release.json",
    "ssp": ROOT / "modules/ssp/current/release.json",
}


def load(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        FAILURES.append(f"Unable to load {path.relative_to(ROOT)}: {exc}")
        return {}


def value(data: dict, *names: str) -> str:
    for name in names:
        current = data.get(name)
        if current is not None:
            return str(current)
    return ""


observed: dict[str, dict[str, str]] = {}
for module_id, path in POINTERS.items():
    data = load(path)
    version = value(data, "current_supplied_version")
    runtime_hash = value(data, "primary_html_sha256", "runtime_sha256")
    expected_version, expected_hash = EXPECTED_MODULES[module_id]
    if version != expected_version:
        FAILURES.append(f"{module_id} version: expected {expected_version}, observed {version}")
    if runtime_hash != expected_hash:
        FAILURES.append(f"{module_id} runtime SHA-256: expected {expected_hash}, observed {runtime_hash}")
    status = value(data, "status")
    if module_id in {"workshop", "builder-merger"} and "draft" in status.lower():
        WARNINGS.append(f"{module_id} current pointer still contains pre-promotion draft status")
    observed[module_id] = {"version": version, "runtime_sha256": runtime_hash, "status": status}

registry = load(ROOT / "contracts/registry.json")
rg4 = [
    row
    for row in registry.get("contracts", [])
    if row.get("package_kind") == "l2g_ssp_word_qa_sidecar_v1" and row.get("version") == "1.0"
]
if len(rg4) != 1:
    FAILURES.append(f"Expected one RG-4 registry row, observed {len(rg4)}")
elif rg4[0].get("stability") != "proposal":
    FAILURES.append(
        "Technical-validation phase must leave l2g_ssp_word_qa_sidecar_v1 1.0 at proposal"
    )

historical_path = ROOT / "suite/snapshots/suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0.json"
historical = load(historical_path)
if historical.get("snapshot_id") != "suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0":
    FAILURES.append("Historical Workshop v79 snapshot identity changed")
if historical.get("promotion_commit") != "9d23e18cdc227b8d637325ad7ae426a309a0242d":
    FAILURES.append("Historical Workshop v79 snapshot promotion commit changed")
if historical.get("route_summary", {}).get("passed") != 10:
    FAILURES.append("Historical Workshop v79 snapshot route result changed")

catalog = (ROOT / "tests/playwright/module-catalog.mjs").read_text(encoding="utf-8")
for required in ("workshop-v79.1", "builder-merger-v3.10.1", "ssp-v1.9.17"):
    if required not in catalog:
        FAILURES.append(f"Current module catalog does not contain {required}")

package_text = (ROOT / "package.json").read_text(encoding="utf-8")
for required in (
    "workshop-v791-strict-merge.spec.mjs",
    "builder-merger-v3101-workshop-preservation.spec.mjs",
    "ssp-v1917-rg4-word-qa-consumer.spec.mjs",
    "ssp-rg4-history-harness.spec.mjs",
):
    if required not in package_text:
        FAILURES.append(f"Current QA scripts do not include {required}")

result = {
    "document_kind": "rg4_merged_main_technical_baseline_result",
    "phase": "technical-validation-before-promotion",
    "repository": "SteadyEddieCF/L2G_Toolchain",
    "modules": observed,
    "rg4_registry_stability": rg4[0].get("stability") if len(rg4) == 1 else None,
    "historical_snapshot_sha256": hashlib.sha256(historical_path.read_bytes()).hexdigest()
    if historical_path.exists()
    else None,
    "warnings": WARNINGS,
    "failures": FAILURES,
    "passed": not FAILURES,
}
print(json.dumps(result, indent=2))
sys.exit(1 if FAILURES else 0)
