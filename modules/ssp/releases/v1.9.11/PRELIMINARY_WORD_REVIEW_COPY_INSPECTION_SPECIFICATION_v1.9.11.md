# Preliminary Word-Review-Copy Inspection Specification — v1.9.11

## Workflow

1. The user exports an SSP Word Review copy or selects an existing SSP-generated DOCX.
2. The runtime computes the exact artifact SHA-256 and opens a preview without changing governed SSP data.
3. The runtime performs only bounded package/XML checks and labels unsupported or unreliable checks `needs-human-review` or `not-applicable`.
4. A local identifier, display name, acknowledgement, and explicit confirmation are required to record the preview.
5. Confirmed records are append-only. A changed artifact carrying the same Word Review package identity supersedes the prior record while preserving bidirectional history.
6. Source-fingerprint mismatch makes a record dynamically stale. Stale/superseded evidence cannot be treated as current.
7. Failed, stale, and needs-human-review findings appear in the derived v1.9.10 Needs Attention workspace.

## Deterministic identity

`inspectionId` is derived from scope, exact artifact SHA-256, source fingerprint, and Word Review package ID. The record also captures runtime/schema/document identity, scope, selected built-in profile identity, file name, size, exported timestamp, manifest snapshot hash, per-check evidence, local confirmer qualification, limitations, and history.

## Check statuses

- `pass`: the bounded technical check completed and met its exact condition.
- `fail`: the bounded technical check completed and detected a defined defect or mismatch.
- `needs-human-review`: the runtime cannot make a reliable binary determination.
- `not-applicable`: a prerequisite package/part is unavailable, so the check did not run.

No status is a readiness, compliance, assessment, certification, evidence-sufficiency, technical-accuracy, final Word-QA, or client-release conclusion.
