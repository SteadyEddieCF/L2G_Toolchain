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
- Transport: one exact local SSP DOCX paired with one JSON sidecar; no network dependency
- Proposed schema SHA-256: `3af01051c670ae088f4d6bbcbe1513808415bb5198002d62131a2095515f3c34`
- Frozen QA-profile SHA-256: `9aec3fd144e9f8ccfefdd3dd1ba5605ec0364127459f8cbded71904cf02b789c`

## Contract freeze

The issue #91 implementation contract is frozen for Builder/Merger #92. Exact derivations, timestamp rules, semantic invariants, retry behavior, and the ordered profile are in `deterministic_derivations.md`. The strict schema is unchanged. The route remains proposal-only until exact Builder/Merger and SSP candidate heads pass joint promotion gates.

The verified SSP fixture bundle is registered by `fixtures/contracts/l2g_ssp_word_qa_sidecar_v1/real_artifacts/verified_binary_registration.json` with mandatory attachment SHA-256 `9456f0b04c53d53cb229db566d15dab9ce0105359dba2eaf5a55529b92f16a47`. It contains real deterministic SSP v1.9.16 current and changed-source DOCX exports, embedded/companion manifests, governed-source snapshots, source identities, metadata, checksums, and reproducibility tooling.

## Authority

SSP owns governed SSP source identity, exact-scope current/stale evaluation, explicit acceptance, append-only evidence history, and supersession state. Builder/Merger owns exact DOCX artifact identity, bounded mechanical Word inspection, ordered QA-profile identity, local human-check capture, lineage, and sidecar production. Workshop remains authoritative for practice conclusions, evidence review, provider/responsibility discussion, provider follow-up, gaps, actions, and blockers and is not a producer or consumer of this route. Control Center does not consume the full sidecar by implication.

The sidecar is evidence only. It cannot establish CMMC readiness, compliance, assessment, certification, scoring, evidence sufficiency, authenticated identity, digital signature, legal attestation, technical accuracy, or client-release approval.

## Acceptance and rejection

The SSP consumer rejects duplicate keys; enforces exact kind/version and strict schema; recomputes the profile hash, lineage key, sidecar ID, and package fingerprint; hashes the exact paired DOCX; reconciles its embedded/export manifest and source identity; and recomputes the current governed SSP source fingerprint for the exact scope. Preview and acceptance remain separate. Imported strings are inert text. Preview, rejection, and acceptance must not mutate authored SSP content, RG-2 state, review dispositions, profile selection, sign-off, Workshop-owned records, or another package route.

## Currency, retry, idempotency, and history

Producer QA aggregate (`qa_complete`, `qa_blocked`, `qa_incomplete`) is separate from SSP-local currency (`current`, `stale`, `superseded`) and structural validity. A valid historical package may be recorded as stale only after explicit acknowledgement. Identical package fingerprints are idempotent duplicates. Attempts retain the frozen lineage key. Only explicit acceptance of a higher-attempt, `qa_complete`, current package may supersede an earlier accepted-current record. Accepted history remains append-only.

## Migration and compatibility

This is a new optional route. Existing SSP working data, RG-1/RG-2/UX-3/RG-3, Word Review, Workshop SSP handoff/return, Builder/Merger Workbook Handoff 1.7, Workbook Merge 1.1, Builder Decision Plan 1.0, and every adjacent-module runtime remain unchanged. Historical RG-3 records are not converted into RG-4 evidence. The Workshop-v79 historical suite snapshot is not rewritten.

## Promotion

The registry entry remains `proposal` until exact Builder/Merger and SSP candidate heads jointly pass strict schema/duplicate-key checks; canonical identities; paired DOCX and manifest/source reconciliation; clean/current, stale, malformed, downgrade, mismatch, retry, supersession, duplicate, path-traversal, and injected-text cases; no governed-data mutation; authority checks; no-network operation; accessibility/keyboard/focus/themes/print; native Windows Chromium `file://`; zero page/console errors; repository validation; exact materialization; and regression of all existing routes.
