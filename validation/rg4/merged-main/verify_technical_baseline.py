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

HISTORICAL_PATH = (
    ROOT
    / "suite/snapshots/suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0.json"
)
PROMOTION_PATH = (
    ROOT
    / "suite/snapshots/suite-2026.08.03-rg4-validated-mcfirecoal-v1.2.0.json"
)
EXPECTED_HISTORICAL_SHA256 = (
    "c47fcdd8e8ac82d5d13d1e588ea48955415b7cc91485eb2925a994394c8356d6"
)


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


def module_rows(snapshot: dict) -> dict[str, dict]:
    rows: dict[str, dict] = {}
    for row in snapshot.get("modules", []):
        module_id = row.get("id")
        if isinstance(module_id, str):
            rows[module_id] = row
    return rows


promotion_phase = PROMOTION_PATH.exists()
phase = "promotion-candidate" if promotion_phase else "technical-validation-before-promotion"

pointer_data: dict[str, dict] = {}
observed: dict[str, dict[str, str]] = {}
for module_id, path in POINTERS.items():
    data = load(path)
    pointer_data[module_id] = data
    version = value(data, "current_supplied_version")
    runtime_hash = value(data, "primary_html_sha256", "runtime_sha256")
    expected_version, expected_hash = EXPECTED_MODULES[module_id]
    if version != expected_version:
        FAILURES.append(f"{module_id} version: expected {expected_version}, observed {version}")
    if runtime_hash != expected_hash:
        FAILURES.append(
            f"{module_id} runtime SHA-256: expected {expected_hash}, observed {runtime_hash}"
        )
    status = value(data, "status")
    if module_id in {"workshop", "builder-merger"} and "draft" in status.lower():
        message = f"{module_id} current pointer still contains pre-promotion draft status"
        if promotion_phase:
            FAILURES.append(message)
        else:
            WARNINGS.append(message)
    observed[module_id] = {
        "version": version,
        "runtime_sha256": runtime_hash,
        "status": status,
    }

registry = load(ROOT / "contracts/registry.json")
rg4 = [
    row
    for row in registry.get("contracts", [])
    if row.get("package_kind") == "l2g_ssp_word_qa_sidecar_v1"
    and row.get("version") == "1.0"
]
if len(rg4) != 1:
    FAILURES.append(f"Expected one RG-4 registry row, observed {len(rg4)}")
else:
    expected_stability = "validated" if promotion_phase else "proposal"
    if rg4[0].get("stability") != expected_stability:
        FAILURES.append(
            "RG-4 registry stability: "
            f"expected {expected_stability}, observed {rg4[0].get('stability')}"
        )
    if promotion_phase:
        if rg4[0].get("validation_issue") != 101:
            FAILURES.append("RG-4 registry row must identify validation issue #101")
        if rg4[0].get("validation_pr") != 118:
            FAILURES.append("RG-4 registry row must identify validation PR #118")
        if rg4[0].get("validation_evidence_head") != (
            "3b74f16526f70de7d5972ee461189ff4fb9bb302"
        ):
            FAILURES.append("RG-4 registry evidence head does not match Phase 1")

historical = load(HISTORICAL_PATH)
if historical.get("snapshot_id") != (
    "suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0"
):
    FAILURES.append("Historical Workshop v79 snapshot identity changed")
if historical.get("promotion_commit") != (
    "9d23e18cdc227b8d637325ad7ae426a309a0242d"
):
    FAILURES.append("Historical Workshop v79 snapshot promotion commit changed")
if historical.get("route_summary", {}).get("passed") != 10:
    FAILURES.append("Historical Workshop v79 snapshot route result changed")
historical_sha256 = (
    hashlib.sha256(HISTORICAL_PATH.read_bytes()).hexdigest()
    if HISTORICAL_PATH.exists()
    else None
)
if historical_sha256 != EXPECTED_HISTORICAL_SHA256:
    FAILURES.append(
        "Historical Workshop v79 snapshot SHA-256 changed: "
        f"expected {EXPECTED_HISTORICAL_SHA256}, observed {historical_sha256}"
    )

promotion_snapshot: dict = {}
if promotion_phase:
    promotion_snapshot = load(PROMOTION_PATH)
    if promotion_snapshot.get("snapshot_id") != (
        "suite-2026.08.03-rg4-validated-mcfirecoal-v1.2.0"
    ):
        FAILURES.append("Promotion snapshot identity mismatch")
    if promotion_snapshot.get("status") != "exact_six_tool_rg4_validation_passed":
        FAILURES.append("Promotion snapshot status mismatch")
    if promotion_snapshot.get("validation_issue") != 101:
        FAILURES.append("Promotion snapshot must identify issue #101")
    if promotion_snapshot.get("validation_pr") != 118:
        FAILURES.append("Promotion snapshot must identify PR #118")
    if promotion_snapshot.get("validation_evidence_head") != (
        "3b74f16526f70de7d5972ee461189ff4fb9bb302"
    ):
        FAILURES.append("Promotion snapshot evidence head mismatch")
    snapshot_modules = module_rows(promotion_snapshot)
    for module_id, (expected_version, expected_hash) in EXPECTED_MODULES.items():
        row = snapshot_modules.get(module_id)
        if not row:
            FAILURES.append(f"Promotion snapshot missing module {module_id}")
            continue
        observed_version = str(row.get("version", ""))
        if not observed_version.startswith("v"):
            observed_version = f"v{observed_version}"
        if observed_version != expected_version:
            FAILURES.append(
                f"Promotion snapshot {module_id} version: expected {expected_version}, "
                f"observed {row.get('version')}"
            )
        if row.get("runtime_sha256") != expected_hash:
            FAILURES.append(f"Promotion snapshot {module_id} SHA-256 mismatch")
    groups = promotion_snapshot.get("validation_groups", {})
    if groups.get("required") != 7 or groups.get("passed") != 7:
        FAILURES.append("Promotion snapshot validation-group counts must be 7/7")
    if groups.get("failed") != 0 or groups.get("all_required_passed") is not True:
        FAILURES.append("Promotion snapshot must report zero failed validation groups")
    preserved = promotion_snapshot.get("historical_snapshot_preservation", {})
    if preserved.get("sha256") != EXPECTED_HISTORICAL_SHA256:
        FAILURES.append("Promotion snapshot historical SHA-256 record mismatch")
    if preserved.get("immutable") is not True:
        FAILURES.append("Promotion snapshot must mark the historical snapshot immutable")
    rg4_validation = promotion_snapshot.get("rg4_validation", {})
    for key in (
        "current",
        "stale",
        "blocked",
        "incomplete",
        "duplicate",
        "retry",
        "supersession",
        "history_persistence",
        "workshop_authority_isolation",
    ):
        if rg4_validation.get(key) != "passed":
            FAILURES.append(f"Promotion snapshot RG-4 result {key} is not passed")

    workshop = pointer_data.get("workshop", {})
    if workshop.get("promotion", {}).get("merge_commit") != (
        "e14ed000e490040182b529d7e2b3bc7155c03287"
    ):
        FAILURES.append("Workshop current pointer promotion metadata mismatch")
    if workshop.get("promotion", {}).get("verdict") != "passed":
        FAILURES.append("Workshop current pointer must record a passed promotion verdict")

    builder = pointer_data.get("builder-merger", {})
    if builder.get("promotion", {}).get("merge_commit") != (
        "d3cd223befb3aa1b53b2feea291b9f38b8d2645e"
    ):
        FAILURES.append("Builder/Merger current pointer promotion metadata mismatch")
    if builder.get("promotion", {}).get("verdict") != "passed":
        FAILURES.append("Builder/Merger current pointer must record a passed verdict")

    ssp_rg4 = pointer_data.get("ssp", {}).get("optional_contracts", {}).get(
        "rg4_word_qa_sidecar", {}
    )
    if ssp_rg4.get("stability") != "validated":
        FAILURES.append("SSP current pointer must record RG-4 as validated")
    if ssp_rg4.get("producer_release") != "v3.10.1":
        FAILURES.append("SSP current pointer must identify Builder/Merger v3.10.1")
    if ssp_rg4.get("validated") is not True:
        FAILURES.append("SSP current pointer must mark RG-4 validated")

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
    "phase": phase,
    "repository": "SteadyEddieCF/L2G_Toolchain",
    "modules": observed,
    "rg4_registry_stability": rg4[0].get("stability") if len(rg4) == 1 else None,
    "historical_snapshot_sha256": historical_sha256,
    "promotion_snapshot": promotion_snapshot.get("snapshot_id") if promotion_phase else None,
    "warnings": WARNINGS,
    "failures": FAILURES,
    "passed": not FAILURES,
}
print(json.dumps(result, indent=2))
sys.exit(1 if FAILURES else 0)
