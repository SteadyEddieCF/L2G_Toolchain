# CMMC L2 Gap Workshop Tool v79.1

Corrective release for issue #105: **Strict Workbook Merge Validation**.

## Scope

- fail-closed duplicate-key-safe parsing for Workbook Merge JSON;
- exact `l2g_workbook_merge_v1` wire version `1.1`;
- frozen top-level property allowlist;
- unique and reconciled practice/objective identities;
- non-mutating rejected previews;
- Handoff producer self-reconciliation using the frozen two-level identity;
- no adjacent-module runtime, registry, schema, or historical-snapshot change.

Operator wording:

> Workbook Handoff contract release 1.7 — wire package version 1.0

## Runtime

- File: `cmmc_l2_gap_workshop_tool_v79.1.html`
- Size: `1852954` bytes
- SHA-256: `361a29613d85a42eb404aabbaec061fb815dbd347d90dc41c089e8024cc95dc1`
- Baseline: Workshop v79, SHA-256 `a1f63944d0573587e2a5b7826f72befa16f6d89b849f3129f7f6dbb080da54ca`

## Dependency

The final exact Workshop v79.1 ↔ Builder/Merger v3.10.1 action/ownership round trip remains pending issue #106. This draft candidate does not close issue #105 and does not authorize registry promotion.

The planned Workshop v80 Regression Delta and Release Comparison workstream remains unchanged.
