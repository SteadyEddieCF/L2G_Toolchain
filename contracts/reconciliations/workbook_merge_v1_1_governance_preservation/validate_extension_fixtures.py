#!/usr/bin/env python3
from __future__ import annotations

import copy
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
EXT_KEY = "workshop_governance_preservation_v1"
TOP_ALLOWED = {
    "advisor_review_results", "content_trust_level", "evidence_results",
    "gap_results", "generated_at", "generated_by", "objective_results",
    "package_kind", "package_version", "practice_results", "schema_trusted",
    "tool_family", "warnings", "workbook_source",
}
EXT_ALLOWED = {
    "schema_version", "source_package_identity", "record_counts", "actions",
    "evidence_ownership_records", "requests", "provider_followups",
    "guardrails", "preservation_fingerprint",
}
COLLECTIONS = ("actions", "evidence_ownership_records", "requests", "provider_followups")
ID_FIELDS = {
    "actions": "action_id",
    "evidence_ownership_records": "ownership_record_id",
    "requests": "request_id",
    "provider_followups": "followup_id",
}


def reject_duplicates(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"duplicate key: {key}")
        result[key] = value
    return result


def canonical(value):
    return json.dumps(
        value, sort_keys=True, separators=(",", ":"), ensure_ascii=False
    ).encode("utf-8")


def digest(value):
    return hashlib.sha256(canonical(value)).hexdigest()


def require(condition, message):
    if not condition:
        raise ValueError(message)


def validate(package):
    require(package.get("package_kind") == "l2g_workbook_merge_v1", "package kind")
    require(package.get("package_version") == "1.1", "package version")
    require(not (set(package) - TOP_ALLOWED), "unknown top-level property")
    require(EXT_KEY not in package, "extension must not be top-level")
    source = package.get("workbook_source")
    require(isinstance(source, dict), "workbook_source")
    extension = source.get(EXT_KEY)
    require(isinstance(extension, dict), "nested extension")
    require(set(extension) == EXT_ALLOWED, "extension shape")
    require(extension.get("schema_version") == "1.0", "schema version")

    identity = extension.get("source_package_identity")
    require(isinstance(identity, dict), "source identity")
    require(set(identity) == {
        "package_kind", "package_version", "contract_release",
        "enhancement_version", "canonical_fingerprint",
    }, "source identity shape")
    require(identity.get("package_kind") == "l2g_workbook_handoff_v1", "source kind")
    require(identity.get("package_version") == "1.0", "source wire version")
    require(identity.get("contract_release") == "1.7", "source contract release")
    require(identity.get("enhancement_version") == "1.7", "source enhancement")
    source_fp = identity.get("canonical_fingerprint", "")
    require(source_fp.startswith("sha256:") and len(source_fp) == 71, "source fingerprint")

    guardrails = extension.get("guardrails")
    require(guardrails == {
        "reconciliation_assertion_only": True,
        "no_automatic_create_update_delete": True,
        "missing_or_mismatch_blocks_trusted_apply": True,
    }, "guardrails")

    counts = extension.get("record_counts")
    require(isinstance(counts, dict) and set(counts) == set(COLLECTIONS), "record counts")
    observed = {}
    for collection in COLLECTIONS:
        rows = extension.get(collection)
        require(isinstance(rows, list), f"{collection} array")
        observed[collection] = len(rows)
        seen = set()
        id_field = ID_FIELDS[collection]
        for row in rows:
            require(set(row) == {
                "record_id", "source_record", "workbook_record",
                "source_record_fingerprint", "workbook_record_fingerprint",
            }, f"{collection} entry shape")
            record_id = row.get("record_id")
            require(isinstance(record_id, str) and record_id, f"{collection} record ID")
            require(record_id not in seen, f"{collection} duplicate ID")
            seen.add(record_id)
            require(row["source_record"].get(id_field) == record_id, f"{collection} source ID")
            require(row["workbook_record"].get(id_field) == record_id, f"{collection} workbook ID")
            require(row["source_record_fingerprint"] == digest(row["source_record"]), f"{collection} source fingerprint")
            require(row["workbook_record_fingerprint"] == digest(row["workbook_record"]), f"{collection} workbook fingerprint")
            require(row["source_record"] == row["workbook_record"], f"{collection} governed mismatch")
    require(counts == observed, "record count mismatch")

    supplied = extension.get("preservation_fingerprint")
    fingerprint_input = {key: value for key, value in extension.items() if key != "preservation_fingerprint"}
    require(supplied == digest(fingerprint_input), "preservation fingerprint")
    return "trusted-current"


def load_canonical():
    return json.loads(
        (HERE / "canonical_fixture.json").read_text(encoding="utf-8"),
        object_pairs_hook=reject_duplicates,
    )


def classify(package):
    try:
        return validate(package)
    except ValueError as exc:
        return "block" if "governed mismatch" in str(exc) else "reject"


canonical_package = load_canonical()
cases = [("canonical-valid", canonical_package, "trusted-current")]

top_level = copy.deepcopy(canonical_package)
top_level[EXT_KEY] = top_level["workbook_source"].pop(EXT_KEY)
cases.append(("invalid-top-level-extension", top_level, "reject"))

bad_fingerprint = copy.deepcopy(canonical_package)
bad_fingerprint["workbook_source"][EXT_KEY]["preservation_fingerprint"] = "0" * 64
cases.append(("invalid-fingerprint", bad_fingerprint, "reject"))

governed_mismatch = copy.deepcopy(canonical_package)
entry = governed_mismatch["workbook_source"][EXT_KEY]["actions"][0]
entry["workbook_record"]["owner"] = "Different Owner"
entry["workbook_record_fingerprint"] = digest(entry["workbook_record"])
extension = governed_mismatch["workbook_source"][EXT_KEY]
extension["preservation_fingerprint"] = digest({key: value for key, value in extension.items() if key != "preservation_fingerprint"})
cases.append(("invalid-governed-mismatch", governed_mismatch, "block"))

count_mismatch = copy.deepcopy(canonical_package)
extension = count_mismatch["workbook_source"][EXT_KEY]
extension["record_counts"]["actions"] = 2
extension["preservation_fingerprint"] = digest({key: value for key, value in extension.items() if key != "preservation_fingerprint"})
cases.append(("invalid-record-count", count_mismatch, "reject"))

for case_id, package, expected in cases:
    observed = classify(package)
    if observed != expected:
        raise SystemExit(f"{case_id}: expected {expected}, observed {observed}")
    print(f"{case_id}: {observed}")

duplicate_raw = '{"package_kind":"l2g_workbook_merge_v1","package_version":"1.1","package_version":"1.1","workbook_source":{}}'
try:
    json.loads(duplicate_raw, object_pairs_hook=reject_duplicates)
except ValueError:
    print("invalid-duplicate-key: reject")
else:
    raise SystemExit("invalid-duplicate-key: expected reject")

print("Workbook Merge 1.1 governance-preservation fixtures passed")
