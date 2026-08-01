# Canonical Extension Decision — Workbook Merge 1.1

## Status

Frozen governance decision for issue #114.

## Canonical location

A current package keeps the frozen top-level identity and shape:

```json
{
  "package_kind": "l2g_workbook_merge_v1",
  "package_version": "1.1",
  "workbook_source": {
    "workshop_governance_preservation_v1": {}
  }
}
```

The extension must not appear at the package top level.

## Extension identity

Required values when the optional extension is present:

- path: `workbook_source.workshop_governance_preservation_v1`
- `schema_version`: `1.0`
- `source_package_identity.package_kind`: `l2g_workbook_handoff_v1`
- `source_package_identity.package_version`: `1.0`
- `source_package_identity.contract_release`: `1.7`
- `source_package_identity.enhancement_version`: `1.7`
- non-empty source Handoff canonical fingerprint
- arrays: `actions`, `evidence_ownership_records`, `requests`, `provider_followups`
- exact `record_counts` reconciliation
- deterministic `preservation_fingerprint`

Unknown extension properties are rejected. Duplicate JSON keys are rejected before parsing.

## Canonicalization and fingerprint

Canonical JSON uses UTF-8; recursively sorted object keys; array order preserved; separators `,` and `:`; `ensure_ascii=false`; and no trailing newline.

`preservation_fingerprint` is lowercase SHA-256 of the canonical extension object with only `preservation_fingerprint` removed.

The fingerprint covers source identity, lineage, record arrays, mappings, guardrails, and counts.

## Record envelope

Each record entry contains only:

- `record_id`
- `source_record`
- `workbook_record`
- `source_record_fingerprint`
- `workbook_record_fingerprint`

Record fingerprints are lowercase SHA-256 of canonical JSON for their corresponding record objects.

Record IDs must be non-empty and unique within their record type. The source record's stable ID and workbook record's stable ID must both equal `record_id`.

## Governed equivalence

Workshop and Builder/Merger compare the following governed fields. Additional empty display/helper fields do not establish a mismatch.

### Actions

`action_id`, `title`, `description`, `action_type`, `priority`, `status`, `owner`, `supporting_owner`, `provider`, `due_date`, `blocker_id`, `related_practices`, `related_objectives`, `dependencies`, `related_references`, `evidence_request_id`, `source_type`, `source_id`, `source_key`, `source_label`.

### Evidence ownership

`ownership_record_id`, `candidate_id`, `practice_id`, `objective_id`, `evidence_category`, `evidence_category_label`, `audience`, `production_owner`, `retention_owner`, `access_owner`, `access_path`, `submission_owner`, `review_followup_owner`, `contract_validation_required`, `access_limitation`, `responsibility_record_id`, `request_id`, `request_status`, `provider_followup_id`, `provider_followup_state`, `action_id`, `due_date`, `report_state`, `service_ids`, `service_names`, `source_package_kind`, `source_package_version`, `source_fingerprint`.

### Requests

`request_id`, `ownership_record_id`, `practice_id`, `objective_id`, `audience`, `evidence_category`, `request_title`, `request_text`, `owner`, `status`, `due_date`, `contract_validation_required`, `access_limitation`, `access_path`, `source_candidate_id`, `source_responsibility_record_id`, `source_fingerprint`, `action_id`.

### Provider follow-up

`followup_id`, `ownership_record_id`, `request_id`, `practice_id`, `objective_id`, `provider`, `topic`, `state`, `owner`, `due_date`, `contract_validation_required`, `access_limitation`, `source_fingerprint`, `action_id`.

Missing fields normalize to empty strings, false, or empty arrays according to type. Array fields preserve semantic order when order is meaningful; set-like ID arrays are compared after stable lexical sorting.

## Workshop behavior

Workshop performs these checks during non-mutating preview:

1. strict package and extension parsing;
2. extension shape and fingerprint;
3. source-Handoff identity and fingerprint linkage;
4. record counts and unique stable IDs;
5. source-versus-workbook governed equivalence;
6. extension source records versus current Workshop records.

A trusted current result requires every governed record to already exist in Workshop and match its governed projection.

Workshop must block trusted apply when a record is missing, duplicated, or mismatched. It must display deterministic discrepancy details. It must not create, overwrite, or delete operational records from this extension.

An exact match is recorded only as round-trip reconciliation evidence. Existing Workbook Merge overlay behavior remains separately explicit and local.

## Builder/Merger behavior

Builder/Merger must:

- remove the invalid top-level candidate field;
- emit the extension at the canonical nested path;
- use schema version 1.0 and SHA-256 canonical fingerprints;
- preserve exact source and workbook records;
- prove governed equivalence for each record;
- keep helper sheets visible and deterministic;
- emit no extension when no governed records are present unless an explicit empty extension is required by a test fixture.

## Required correction sequence

1. Merge this governance decision.
2. Correct PR #113 to emit the nested extension and updated identities.
3. Correct PR #112 to validate and reconcile the nested extension.
4. Run exact v79.1 → v3.10.1 → v79.1 current, duplicate, mismatch, missing-record, malformed, and adversarial tests.
5. Merge the two releases only after their final heads pass together.
6. Rerun issue #101 before any RG-4 registry promotion or suite snapshot.
