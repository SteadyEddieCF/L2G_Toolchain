# Workbook Merge 1.1 Governance Preservation Extension

This reconciliation resolves issue #114 without changing any module runtime, production registry entry, current pointer, or historical suite snapshot.

## Decision

The stable-frozen `l2g_workbook_merge_v1` version `1.1` top-level shape remains unchanged.

The optional Workshop governance-preservation extension is encoded only at:

`workbook_source.workshop_governance_preservation_v1`

A top-level `workshop_governance_preservation_v1` property is invalid and must be rejected.

The extension is a reconciliation assertion, not an authority transfer or automatic restore mechanism. Workshop confirms that its existing action, evidence-ownership, request, and provider-follow-up records still match the records that traversed the workbook. Missing, duplicate, or mismatched governed records block trusted apply and require explicit resolution; the extension never silently creates, overwrites, or deletes Workshop operational records.

## Current corrective candidates

- Workshop v79.1: PR #112
- Builder/Merger v3.10.1: PR #113

Both candidates require correction and a complete exact candidate-to-candidate rerun before merge.

## Boundaries

- Workbook Merge remains version 1.1.
- Unknown top-level fields remain rejected.
- Historical suite snapshots remain immutable.
- The RG-4 Word-QA route remains `proposal`.
- No readiness, compliance, assessment, certification, scoring, evidence-sufficiency, approval, or client-release conclusion is made.
