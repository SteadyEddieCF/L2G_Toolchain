# Test Inventory and Results — SSP v1.9.17

## Exact identity/static

- Exact v1.9.16 baseline hash and v1.9.17 output hash.
- Unchanged working-data schema, built-in profile registry, and registry schema hashes.
- Frozen contract schema/profile hashes and registry route `proposal`.
- Exactly 110 authoritative controls.
- Deterministic materialization and exact external fixture reconstruction.

## Runtime/handshake

- Current attempt 1: valid/current, preview non-mutating, explicit append exactly once.
- Duplicate package fingerprint: idempotent, no second record.
- Controlled governed-source change: earlier accepted evidence displays stale while its exact historical record remains intact.
- Changed-source attempt 2: valid/current, verified lineage and predecessor, explicit acceptance derives attempt 1 superseded.
- `qa_incomplete` and `qa_blocked`: structurally valid but recorded as non-complete and non-superseding.
- Stale import: retained only after explicit stale acknowledgement.
- Backup/restore and local reload preserve history; repeated exports preserve identical history.

## Negative/security

- Exact DOCX mismatch; manifest mismatch; source-snapshot mismatch; profile order; aggregate; lineage; timestamp; scope; duplicate key; unknown version; extra property.
- Malformed Open XML; path traversal; active/external-content checks; injected markup rendered inert.
- Preview/rejection non-mutation; zero network activity; zero page/console errors.

## UI/compatibility

- Keyboard and focus trap/restoration; light/dark; constrained viewport; print suppression; accessibility scan.
- RG-1/RG-2/UX-3/RG-3, Word Review, Needs Attention, Workshop handoff/return, backup/restore, persistence, and repeated export regression.
- Native Windows Chromium `file://` smoke is included in CI.

Local candidate testing passed. Repository, Playwright/axe, visual, and Windows file-origin CI must pass on the exact final draft-PR head before any merge recommendation.
