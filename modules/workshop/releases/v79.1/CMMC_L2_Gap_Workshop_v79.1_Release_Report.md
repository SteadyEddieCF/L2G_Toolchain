# Workshop v79.1 Release Report

## Candidate identity

- Release: v79.1
- Issue: #105
- Baseline commit: `3be4153c45cb6534954592a6e4ff1cfda87c8bb4`
- Baseline runtime: Workshop v79 / `a1f63944d0573587e2a5b7826f72befa16f6d89b849f3129f7f6dbb080da54ca`
- Candidate runtime: `361a29613d85a42eb404aabbaec061fb815dbd347d90dc41c089e8024cc95dc1` / 1852954 bytes
- Status: draft candidate, unpromoted

## Corrected defects

- WKS-RG4-002: unsupported, missing, downgraded, or conflicting Merge versions block trusted preview.
- WKS-RG4-003: unknown top-level Merge properties block trusted preview.
- WKS-RG4-004: duplicate object keys at any nesting level are rejected before ordinary parsing.
- WKS-RG4-005: duplicate/conflicting practice IDs, duplicate objective IDs, and mismatched parent identity block trusted preview.
- WKS-RG4-001 implementation: Handoff wire version remains 1.0; contract/enhancement release remains 1.7; all embedded identities and final canonical fingerprint self-reconcile before export.

## Preserved behavior

A valid Workbook Merge 1.1 package remains trusted, preview remains non-mutating, apply remains explicit/local, exact duplicate re-import remains blocked, and undo restores pre-apply governed state. Workshop↔SSP Handoff/Return 1.0 remains unchanged.

## Boundaries

No Builder/Merger, SSP, DocConverter, Scoper, Control Center, production registry, historical suite snapshot, or RG-4 sidecar status change is included. No readiness, compliance, assessment, certification, scoring, evidence-sufficiency, or client-release claim is made.

## Unresolved dependency

Issue #106 has not yet returned an exact Builder/Merger v3.10.1 candidate. Final action/ownership lossless round-trip evidence is therefore pending and issue #105 must remain open.
