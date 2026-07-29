# RG-4 SSP ↔ Builder/Merger Final Word-QA Sidecar Contract Proposal

**Issue:** #91  
**Implementation issues:** Builder/Merger #92; SSP #93  
**Registry state:** `proposal`  
**Protected-main baseline:** `dbe33032ad3ba843e7bb4536c82ee1fd0893dbea`

## Route

- Package kind: `l2g_ssp_word_qa_sidecar_v1`
- Package version: `1.0`
- Schema URI: `urn:l2g:contracts:l2g_ssp_word_qa_sidecar_v1:1.0`
- Producer: Builder/Merger
- Consumer: SSP
- Transport: one exact local DOCX paired with one JSON sidecar; no network dependency
- Proposed schema SHA-256: `3af01051c670ae088f4d6bbcbe1513808415bb5198002d62131a2095515f3c34`

## Authority

SSP owns governed SSP source identity, exact-scope current/stale evaluation, explicit acceptance, append-only evidence history, and supersession state. Builder/Merger owns exact DOCX artifact identity, bounded mechanical Word inspection, ordered QA-profile identity, local human-check capture, lineage, and sidecar production. Workshop remains authoritative for practice conclusions, evidence review, provider/responsibility discussion, provider follow-up, gaps, actions, and blockers and is not a producer or consumer of this route. Control Center does not consume the full sidecar by implication.

The sidecar is evidence only. It cannot establish CMMC readiness, compliance, assessment, certification, scoring, evidence sufficiency, authenticated identity, digital signature, legal attestation, technical accuracy, or client-release approval.

## Acceptance and rejection

The SSP consumer must parse with duplicate-key rejection; enforce exact kind/version and strict schema; recompute the canonical package fingerprint; require and hash the exact paired DOCX; reconcile its embedded/export manifest, review-package ID, source fingerprint, source snapshot, document identity, and QA-profile identity; and recompute the current governed SSP source fingerprint for the exact scope. Preview and acceptance remain separate. Imported strings are inert text. Preview, rejection, and acceptance must not mutate authored SSP content, RG-2 state, review dispositions, profile selection, sign-off, Workshop-owned records, or another package route.

Reject malformed or duplicate-key JSON, unsupported versions, missing or extra governed properties, invalid hashes, package-fingerprint mismatch, missing/mismatched DOCX bytes, conflicting manifest/source/profile identity, path traversal, duplicate check IDs, unreconciled aggregate counts, invalid assertion linkage, inconsistent retry/supersession lineage, or forbidden authority claims.

## Currency, retry, idempotency, and history

Producer QA aggregate (`qa_complete`, `qa_blocked`, `qa_incomplete`) is separate from SSP-local currency (`current`, `stale`, `superseded`) and structural validity. An internally valid historical package may be recorded as stale only after explicit acknowledgement. Identical package fingerprints are idempotent duplicates. Retries retain a stable lineage key and increment attempt number. A blocked or incomplete retry does not erase prior history. Only explicit acceptance of a higher current attempt may supersede an earlier current record. Accepted history remains append-only.

## Migration and compatibility

This is a new optional route. Existing SSP working data, RG-1/RG-2/UX-3/RG-3, Word Review, Workshop SSP handoff/return, Builder/Merger Workbook Handoff 1.7, Workbook Merge 1.1, Builder Decision Plan 1.0, and every adjacent-module runtime remain unchanged. Historical RG-3 records are not converted into RG-4 evidence. The Workshop-v79 historical suite snapshot is not rewritten.

## Required pre-implementation resolution

The proposal is not frozen for #92 or #93 until #91 records exact definitions for: (1) deterministic `sidecar_id`; (2) deterministic `lineage.lineage_key`; (3) the canonical ordered `l2g-builder-merger-final-word-qa-v1` profile represented by `qa_profile.sha256`; (4) timestamp normalization and deterministic-output expectations; and (5) semantic checks that JSON Schema cannot express.

The supplied JSON vectors use synthetic DOCX identities. SSP v1.9.16 must first produce a deterministic, de-identified real DOCX/manifest fixture bundle with exact bytes, hashes, source identities, a controlled source revision, SHA256SUMS, and reproducibility notes. No SSP runtime or schema change is authorized by that fixture task.

## Promotion

The registry entry remains `proposal` until exact Builder/Merger and SSP candidate heads jointly pass strict schema/duplicate-key checks; canonical fingerprints; paired DOCX and manifest/source reconciliation; clean/current, stale, malformed, downgrade, mismatch, retry, supersession, duplicate, path-traversal, and injected-text cases; no governed-data mutation; authority checks; no-network operation; accessibility/keyboard/focus/themes/print; native Windows Chromium `file://`; zero page/console errors; repository validation; exact materialization; and regression of all existing routes.
