# DocConverter-L2G v7.9.5.1

Current supplied DocConverter runtime following bounded runtime promotion.

## Release focus

Validation-question candidate precision hotfix. The implementation was reviewed in merged PR #7 and was not broadened during runtime promotion.

## Governed runtime

- Runtime: `DocConverter-L2G_v7.9.5.1.html`
- Size: 7,952,581 bytes
- SHA-256: `df64d0912b43d69d5eda256188458c3d32f9aa679c49ed43f6ddf4cb64b9c17d`
- Deterministic source: `build_v7951.py` plus `DocConverter-L2G_v7.9.5.1_Candidate_Precision_Patch.js`
- Status: materialized and promotion-tested

## Promotion validation

- Full supplied McFirecoal archive: 104 files covered using the normal 90-entry inner-ZIP safeguard plus a 14-file overflow batch.
- Validation-question candidates: 14 original, 12 accepted, 2 rejected, 0 raw JSON field/value fragments exported.
- Accepted questions with source document ID, source filename, and source basis: 12 of 12.
- Embedded OCR: real-browser execution passed with local Tesseract and zero network requests.
- Diagram intelligence, security-evidence analysis, strict meeting-context selection, nested bundle handling, package contracts, offline behavior, and static security checks passed.
- Native Windows Chromium `file://`, shared Playwright QA, and visual comparison remain pull-request CI gates.

## Stable contracts

The following remain unchanged at version 1.0:

- `l2g_intake_package_v1`
- `l2g_scope_context_v1`
- `l2g_meeting_context_v1`

## Known inherited behavior

`Evidence_Index.sqlite` is not retained by the normal picker in either v7.9.5 or v7.9.5.1. This is documented as inherited baseline behavior and was not changed in this bounded promotion.

## Scope boundary

No Scoper, Workshop, Builder/Merger, SSP, or Control Center application code is changed by this release or its promotion follow-up.
