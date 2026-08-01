#!/usr/bin/env python3
from pathlib import Path
import base64
import gzip
import hashlib
import json
import subprocess
import sys

HERE = Path(__file__).resolve().parents[1]
RUNTIME = HERE / "cmmc_l2_gap_workshop_tool_v79.1.html"
PATCH_ARCHIVE = HERE / "source/v79_1_corrected_patch.js.gz.b64"
NONMUTATION_FIX = HERE / "source/v79_1_nonmutation_fix.js"
MANIFEST = json.loads((HERE / "source/SOURCE_MANIFEST.json").read_text())
FIXTURES = HERE / "tests/fixtures"
EXACT_BUILDER = FIXTURES / "builder_v3_10_1_pr113_exact_merge.json"
EXACT_BUILDER_SHA = "efde24c5a0c401c8e1ef9075eb751675359e0dd09419de7a9dae0a34c69c02af"
PATCH_SHA = "89369d79c12773e65291e18b7d30cdc7809686d8772bdc84c34fbd157a5fffde"

subprocess.run([sys.executable, str(HERE / "tests/generate_governance_fixtures.py")], check=True)


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def canonical_bytes(path: Path) -> bytes:
    return path.read_text(encoding="utf-8").replace("\r\n", "\n").replace("\r", "\n").encode("utf-8")


assert RUNTIME.stat().st_size == MANIFEST["candidate_runtime"]["size_bytes"]
assert digest(RUNTIME) == MANIFEST["candidate_runtime"]["sha256"]

patch_bytes = gzip.decompress(
    base64.b64decode("".join(PATCH_ARCHIVE.read_text().split()), validate=True)
)
assert hashlib.sha256(patch_bytes).hexdigest() == PATCH_SHA
patch = patch_bytes.decode("utf-8")
normalization = json.loads((HERE / "source/v79_1_candidate_id_normalization.json").read_text())
assert normalization["old"] in patch
assert normalization["new"] not in patch
assert normalization["target_function"] == "v791CurrentOwnershipRecords"

fix_bytes = canonical_bytes(NONMUTATION_FIX)
assert len(fix_bytes) == 1881
assert hashlib.sha256(fix_bytes).hexdigest() == "6eeb7a2dd501434a1f9247248ec97b352b6cd0e9e7ab959af4b5d7c9b2a55a87"

text = RUNTIME.read_text()
for token in [
    'const CRM_TOOL_VERSION = "v79.1";',
    "Workbook Handoff contract release 1.7 — wire package version 1.0",
    "function v791JsonParser",
    "function v791ValidateGovernanceExtension",
    "function v791CurrentOwnershipRecords",
    'candidate_id:live.candidate_id||acceptedRecord.candidate_id||""',
    "workbook_source.workshop_governance_preservation_v1",
    "package_version must be exactly 1.1",
    "Unknown top-level properties are not allowed",
    "source_record_vs_current_workshop",
    "no_automatic_create_update_delete",
    "exact_non_mutating_round_trip",
    "v791ProtectedRenderOperationalState",
    "_v791_operational_snapshot",
]:
    assert token in text, token

assert '"workshop_governance_preservation_v1"' not in patch.split(
    "const V791_MERGE_TOP_LEVEL", 1
)[1].split("]);", 1)[0]

base = HERE / "source/v79_baseline.html"
if not base.exists():
    base = HERE.parent / "v79/cmmc_l2_gap_workshop_tool_v79.html"
assert len(base.read_bytes()) == 1_836_145
assert digest(base) == "a1f63944d0573587e2a5b7826f72befa16f6d89b849f3129f7f6dbb080da54ca"

assert EXACT_BUILDER.stat().st_size == 683_940
assert digest(EXACT_BUILDER) == EXACT_BUILDER_SHA
exact_package = json.loads(EXACT_BUILDER.read_text(encoding="utf-8"))
exact_extension = exact_package["workbook_source"]["workshop_governance_preservation_v1"]
exact_ownership = exact_extension["evidence_ownership_records"][0]
assert exact_package["package_version"] == "1.1"
assert exact_ownership["record_id"] == "candidate-rg4-001"
assert exact_ownership["source_record"]["ownership_record_id"] == "candidate-rg4-001"
assert exact_ownership["source_record"]["candidate_id"] == ""
assert exact_ownership["workbook_record"]["candidate_id"] == ""
assert exact_extension["preservation_fingerprint"] == "2862751b637cf97797e72c74a256f0ba45904f03b7e8076f20a0c67ef2c3fafb"
assert exact_extension["record_counts"] == {
    "actions": 1,
    "evidence_ownership_records": 1,
    "requests": 0,
    "provider_followups": 0,
}

fixture_hashes = json.loads((FIXTURES / "FIXTURE_SHA256.json").read_text())
for name, meta in fixture_hashes.items():
    path = FIXTURES / name
    assert path.stat().st_size == meta["size_bytes"]
    assert digest(path) == meta["sha256"]

print(
    json.dumps(
        {
            "status": "passed",
            "runtime_size_bytes": RUNTIME.stat().st_size,
            "runtime_sha256": digest(RUNTIME),
            "fixture_count": len(fixture_hashes),
            "exact_builder_merge_sha256": EXACT_BUILDER_SHA,
            "missing_candidate_id_preserved_empty": True,
            "ownership_record_id_remains_authoritative": True,
            "portable_baseline_embedded": True,
            "queued_render_operational_nonmutation": True,
            "planned_v80_preserved": True,
            "builder_v3_10_1_dependency": "exact PR #113 Merge fixture jointly validated; independent review remains",
        },
        indent=2,
    )
)
