# Workbook Merge Semantic Validation Report — Workshop v79.1

## Frozen Merge route

Only `l2g_workbook_merge_v1` package version `1.1` enters trusted preview. Unknown, missing, downgraded, or conflicting versions; undeclared top-level fields; duplicate JSON keys; malformed JSON; duplicate/conflicting practice or objective identities; and mismatched parent relationships fail closed.

## Governance-preservation assertion

The fixed top-level allowlist is unchanged. The optional extension is recognized only at `workbook_source.workshop_governance_preservation_v1`. Exact schema, identity, source-Handoff fingerprint, guardrails, collection shape, record counts, stable IDs, source/workbook record fingerprints, preservation fingerprint, and governed projections are required.

For actions, evidence ownership, requests, and provider follow-up, Workshop compares source versus workbook and source versus the existing current operational record. Missing, duplicate, or mismatched records produce deterministic discrepancies and block apply. Exact matches become non-mutating reconciliation evidence only.

## Mutation boundary

Preview and all rejection paths restore exact Workshop state and local storage. Explicit apply suppresses inherited render-time operational normalization while the Merge overlay is applied, restores exact operational records before persistence, and records `operational_records_mutated: false`. The extension never creates, restores, overwrites, deletes, closes, or reopens an operational record.
