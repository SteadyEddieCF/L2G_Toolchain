# SSP v1.9.17 RG-4 Evidence-History Harness Validation Results

## Scope and identity

- Governing issue: #107
- Protected-main baseline: `3be4153c45cb6534954592a6e4ff1cfda87c8bb4`
- Branch: `validation/ssp-rg4-history-harness`
- Draft PR: #111
- Validated implementation snapshot: `d8485314011a0bce754ca48c859717a374513609`
- SSP release: v1.9.17
- Runtime SHA-256: `bfd9d10a780809ba259406f0770641da6a40ac2d8a6d1e372b070d6f5273351b`
- Working-data schema: v1.9.11, unchanged
- Authoritative requirements: exactly 110

This reconciliation changed only tests, fixtures, validation helpers, reports, package-script registration, and a focused CI workflow. It did not change the SSP runtime, schema, current pointers, contract registry, historical suite snapshots, Workshop, Builder/Merger, DocConverter, Scoper, or Control Center.

## Root cause and product-defect determination

The previous harness directly injected an unsupported six-field synthetic record. It lacked both canonical package-identity locations accepted by the runtime: `packageFingerprint` and nested `sidecar.package_fingerprint`. `rg4NormalizeRecord()` therefore produced an empty fingerprint, and `rg4NormalizeHistory()` removed the record before persistence.

Direct state and local-storage injection are not supported evidence-record creation paths. The reconciled harness creates a valid record through the supported exact sidecar-plus-DOCX preview and explicit local acceptance flow.

**No supported-workflow SSP product defect was found.**

## Evidence outcomes

### Supported populated history

A legitimate current record was accepted and persisted with:

- DOCX SHA-256: `3a124539c41057f88591c06076b21590d30ccf5eea55b078bf4531cedf005642`
- Sidecar ID: `sha256:d20ed8de7c04f13e31dbf6e752b8119d761edbccf11f1df9f875d9bb6e320648`
- Package fingerprint: `3106ff057745dbefb48c9fc68527008efab884f9d66195b4ab6aaff38ca02971`
- Accepted record SHA-256: `e3b543ece2a8f4bd503c2c8d28cb21013234b0de55d2662bf9428290d9ccce28`

Workshop Handoff 1.0 preview preserved the exact one-record history, 110 controls, 1,330 candidate rows, authored/governed SSP content, RG-2, RG-3, review profiles, reviewer status, and sign-off-like state. No Workshop-owned data was absorbed into RG-4 history.

### Empty history

A legitimately empty history remained exactly empty through Workshop Handoff preview and SSP Return export.

### SSP Return no leakage

The populated and empty SSP Return 1.0 exports contained 110 controls and no RG-4 history key, sidecar kind, sidecar ID, package fingerprint, or evidence-record ID.

### Unsupported synthetic record

The unsupported seed normalized as expected:

- direct normalizer: 0 records;
- direct history setter: 0 records;
- backup/apply restore: 0 records;
- local-storage injection: 1 unsupported input, 0 restored records.

### Current/stale/blocked/incomplete/retry/supersession

The shared suite passed current acceptance, duplicate/idempotent re-import, stale derivation and explicit acknowledgement, blocked and incomplete producer states, attempt-2 retry and supersession, backup/restore, reload persistence, contract/security rejection, inert rendering, keyboard/focus, theme, viewport, print, and accessibility regression.

## Passing validation snapshot

The following runs passed on implementation snapshot `d8485314011a0bce754ca48c859717a374513609`:

- Focused SSP RG-4 History Harness: run `30671550413`, 8 tests passed; static fixture verifier passed.
- Shared Playwright QA: run `30671550439`, 40 tests passed.
- Visual regression: run `30671550439`, passed.
- Native Windows Chromium `file://`: run `30671550439`, 9 tests passed.
- Validate L2G Toolchain: run `30671550412`, passed.

The final report/packaging head is required to re-run the same gates. Final exact-head identities and run IDs are recorded in the draft PR body and orchestrator handoff after those gates complete.

## Canonical blockers

This reconciliation uses exactly:

- `WKS-RG4-001` — Workbook Handoff contract identity mismatch;
- `WKS-RG4-002` — unknown Workbook Merge version accepted;
- `WKS-RG4-003` — unknown top-level Workbook Merge property accepted;
- `WKS-RG4-004` — duplicate JSON keys accepted;
- `WKS-RG4-005` — duplicated or mismatched practice identity accepted;
- `RG4-ROUNDTRIP-006` — action and ownership preservation failure.

The inconsistent numbering from the prior negative-results file is not repeated.

## Promotion boundary

PR #111 remains draft and unmerged. The RG-4 sidecar route remains `proposal`. No suite snapshot or promotion is created by this reconciliation.
