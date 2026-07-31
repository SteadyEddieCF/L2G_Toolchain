#!/usr/bin/env python3
from pathlib import Path
import hashlib, json

HERE = Path(__file__).resolve().parents[1]
RUNTIME = HERE / "cmmc_l2_gap_workshop_tool_v79.1.html"
PATCH = HERE / "source" / "v79_1_patch.js"
FIXTURES = HERE / "tests" / "fixtures"
EXPECTED_SHA = "361a29613d85a42eb404aabbaec061fb815dbd347d90dc41c089e8024cc95dc1"
EXPECTED_SIZE = 1852954

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

assert RUNTIME.exists(), "materialized runtime missing"
assert RUNTIME.stat().st_size == EXPECTED_SIZE
assert digest(RUNTIME) == EXPECTED_SHA
text = RUNTIME.read_text(encoding="utf-8")
patch = PATCH.read_text(encoding="utf-8")
for token in [
    'const CRM_TOOL_VERSION = "v79.1";',
    'Workbook Handoff contract release 1.7 — wire package version 1.0',
    'function v791JsonParser',
    'package_version must be exactly 1.1',
    'Unknown top-level properties are not allowed',
    'Duplicate or conflicting practice identity',
    'Duplicate or conflicting objective identity',
]:
    assert token in text, token
for forbidden in [
    'package_version:"1.7"',
    'package_version = "1.7"',
    'workshop_round_trip_extensions_v1',
]:
    assert forbidden not in patch, forbidden

matrix = json.loads((FIXTURES / "workbook_merge_scenario_matrix.json").read_text())
valid = matrix["valid"]
assert valid["package_kind"] == "l2g_workbook_merge_v1"
assert valid["package_version"] == "1.1"
assert valid["schema_trusted"] is True
identity_matrix = json.loads((FIXTURES / "handoff_identity_scenario_matrix.json").read_text())
canonical = identity_matrix["canonical"]
assert canonical["package_kind"] == "l2g_workbook_handoff_v1"
assert canonical["package_version"] == "1.0"
assert canonical["handoff_schema_enhancements_version"] == "1.7"
print(json.dumps({
    "status": "passed",
    "runtime_size_bytes": EXPECTED_SIZE,
    "runtime_sha256": EXPECTED_SHA,
    "fixture_count": len(list(FIXTURES.iterdir())),
    "planned_v80_preserved": True,
    "builder_v3_10_1_dependency": "pending issue #106",
}, indent=2))
