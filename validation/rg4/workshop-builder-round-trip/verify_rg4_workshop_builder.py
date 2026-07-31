#!/usr/bin/env python3
"""RG-4 Workshop-owned regression evidence verifier."""
from __future__ import annotations
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
BASELINE = "8804efcfd7b190117aea76ef48929b2c171dbc70"
EXPECTED = {
    "modules/workshop/releases/v79/cmmc_l2_gap_workshop_tool_v79.html": "a1f63944d0573587e2a5b7826f72befa16f6d89b849f3129f7f6dbb080da54ca",
    "modules/builder-merger/releases/v3.10/L2G-BM_v3.10.html": "96ecb1caee5f7ba278c3b46c666d703423e2db40cac22f8431e70485e5d76a17",
    "modules/ssp/releases/v1.9.17/CMMC_L2_SSP_Modern_Editable_v1.9.17.html": "bfd9d10a780809ba259406f0770641da6a40ac2d8a6d1e372b070d6f5273351b",
}
HISTORICAL = "suite/snapshots/suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0.json"
REGISTRY = "contracts/registry.json"
EVIDENCE = ROOT / "validation/rg4/workshop-builder-round-trip"

def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def contract(registry: dict, kind: str) -> dict:
    return next(item for item in registry["contracts"] if item["package_kind"] == kind)

def main() -> int:
    failures: list[str] = []
    for rel, expected in EXPECTED.items():
        path = ROOT / rel
        if not path.exists():
            failures.append(f"missing materialized runtime: {rel}")
        elif digest(path) != expected:
            failures.append(f"runtime SHA mismatch: {rel}")
    registry = json.loads((ROOT / REGISTRY).read_text(encoding="utf-8"))
    required = {
        "l2g_workbook_handoff_v1": ("1.7", "stable-frozen"),
        "l2g_workbook_merge_v1": ("1.1", "stable-frozen"),
        "l2g_ssp_handoff_v1": ("1.0", "validated"),
        "l2g_ssp_return_package_v1": ("1.0", "validated"),
        "l2g_ssp_word_qa_sidecar_v1": ("1.0", "proposal"),
    }
    for kind, (version, stability) in required.items():
        item = contract(registry, kind)
        if str(item["version"]) != version or item["stability"] != stability:
            failures.append(f"registry drift for {kind}: {item}")
    diff = subprocess.run(
        ["git", "diff", "--name-only", BASELINE, "--", HISTORICAL, REGISTRY,
         "modules/workshop/releases/v79", "modules/builder-merger/releases/v3.10",
         "modules/ssp/releases/v1.9.17"],
        cwd=ROOT, text=True, capture_output=True, check=True,
    ).stdout.splitlines()
    forbidden = [item for item in diff if item == HISTORICAL or item == REGISTRY or item.endswith((".html", "materialize.py", "build_release.py"))]
    if forbidden:
        failures.append("forbidden runtime/registry/historical snapshot changes: " + ", ".join(forbidden))
    summary = json.loads((EVIDENCE / "RG4_VALIDATION_SUMMARY.json").read_text(encoding="utf-8"))
    if summary["promotion_eligible"] is not False:
        failures.append("validation summary must remain promotion-blocked")
    blocker_ids = {item["id"] for item in summary["promotion_blockers"]}
    expected_blockers = {"WKS-RG4-001", "WKS-RG4-002", "WKS-RG4-003", "WKS-RG4-004", "WKS-RG4-005", "RG4-ROUNDTRIP-006"}
    if blocker_ids != expected_blockers:
        failures.append(f"unexpected blocker inventory: {sorted(blocker_ids)}")
    comparison = json.loads((EVIDENCE / "RG4_BEFORE_AFTER_COMPARISON.json").read_text(encoding="utf-8"))
    if comparison["handoff"]["contract_identity_conforms"]:
        failures.append("Handoff mismatch evidence unexpectedly disappeared")
    if comparison["merge"]["package_version"] != "1.1":
        failures.append("Builder/Merger did not emit frozen Workbook Merge 1.1")
    if not comparison["merge"]["canonical_objective_id_sets_equal"]:
        failures.append("Canonical objective IDs did not preserve all 320 objectives")
    if failures:
        print(json.dumps({"status": "failed", "failures": failures}, indent=2))
        return 1
    print(json.dumps({
        "status": "evidence_gate_passed_promotion_blocked",
        "protected_main": BASELINE,
        "runtime_sha256": EXPECTED,
        "registry_unchanged": True,
        "historical_snapshot_unchanged": True,
        "sidecar_stability": "proposal",
        "promotion_eligible": False,
        "reason": "Documented Workshop Handoff identity, merge-parser, and joint preservation blockers require separately bounded corrective work."
    }, indent=2))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
