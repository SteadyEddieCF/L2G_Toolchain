# Issue #64 bounded scope — SSP v1.9.10

This release implements only UX-3: an SSP-owned, runtime-derived Unified Needs Attention workspace over the exact promoted SSP v1.9.9 runtime.

## Included

- one derived queue for SSP source-preflight, local staged-review, corrective-action, stale-fingerprint, Word Review, portfolio-maintenance, conflict/exception, and qualified external read-only records;
- deterministic IDs, category/urgency/owner/scope/status/search filters, counts, direct navigation, and return focus;
- Single-System and Advanced portfolio/module scopes;
- browser-local UI preferences excluded from governed backups.

## Excluded

- new working-data schema fields or a persisted queue;
- new package kinds or cross-tool contract versions;
- Workshop, Builder/Merger, Control Center, Scoper, or DocConverter mutation;
- RG-3 preliminary Word-review-copy inspection;
- RG-4 Builder/Merger final Word-QA sidecar;
- evidence-sufficiency, technical-accuracy, readiness, risk, compliance, assessment, certification, scoring, or client-release conclusions.

A separately authorized handshake release is required before any cross-tool contract or package change.
