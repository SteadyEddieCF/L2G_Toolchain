# Workbook Handoff 1.7 Contract Identity Reconciliation

This governance package resolves issue #104 without modifying any module runtime, production registry entry, current pointer, or historical suite snapshot.

## Decision

The canonical identity model is **wire package version 1.0 with contract/schema release 1.7**.

- `package_kind`: `l2g_workbook_handoff_v1`
- `package_version`: `1.0`
- `handoff_schema_enhancements_version`: `1.7`
- human-facing contract name: **Workbook Handoff 1.7**

The registry's existing `version: "1.7"` denotes the contract release, not the literal top-level wire `package_version`. A later metadata reconciliation must make those semantics explicit without rewriting historical artifacts.

## Why

The exact Workshop v79 output and its embedded contract manifest agree on this two-level model:

- top-level `package_version` is `1.0`;
- top-level enhancement release is `1.7`;
- `contract_manifest.contract_release` is `1.7`;
- `contract_manifest.required_package_identity.package_version` is `1.0`;
- `package_integrity.contract_release` is `1.7`.

Changing the wire version to `1.7` would create a new byte identity, invalidate deterministic fingerprints, and turn an established stable-frozen route into an undocumented breaking migration.

## Contents

- `canonical_identity_decision.md` — normative decision, strict validation, migration, and release order.
- `affected_inventory.json` — current, runtime, evidence, and historical references inspected.
- `compatibility_matrix.json` — producer/consumer disposition matrix.
- `fixtures/` — identity-envelope positive and negative fixtures.
- `validate_identity_fixtures.py` — duplicate-key-safe semantic fixture validator.
- `SHA256SUMS` — exact package file hashes.

These fixtures validate the identity envelope only; they are not substitutes for full 110-practice Workshop Handoff packages.
