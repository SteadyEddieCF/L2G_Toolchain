# RG-4 Merged-Main Validation Report v1

## Status

Phase 1 technical validation passed. Phase 2 governance and metadata reconciliation is a final-head promotion candidate in draft PR #118.

## Governing scope

GitHub issue #101 requires a complete current merged-main validation across:

- Control Center v0.3.4;
- DocConverter-L2G v7.9.5.1;
- Scoper v3.12;
- Workshop v79.1;
- Builder/Merger v3.10.1;
- SSP v1.9.17;
- `l2g_ssp_word_qa_sidecar_v1` version 1.0.

The validation branch began from protected `main` commit `e14ed000e490040182b529d7e2b3bc7155c03287` after Workshop v79.1 and Builder/Merger v3.10.1 were independently reviewed and promoted.

## Phase 1 exact evidence

Exact Phase 1 head:

`3b74f16526f70de7d5972ee461189ff4fb9bb302`

### Runtime identities

| Module | Version | Runtime SHA-256 |
|---|---:|---|
| Control Center | v0.3.4 | `9eec722499fd5f0a76249ccb6f27547d6fe6fc64059a418b136af48b8edf7a73` |
| DocConverter-L2G | v7.9.5.1 | `df64d0912b43d69d5eda256188458c3d32f9aa679c49ed43f6ddf4cb64b9c17d` |
| Scoper | v3.12 | `2adf329557fb2df4699e13bb572bcde762667292700200f8edeae0dd6ade7ef3` |
| Workshop | v79.1 | `b6bd63c104faeb031f9561f24aaf6a8fb7b928df2f11c821391ca57131d6e52b` |
| Builder/Merger | v3.10.1 | `2879ee0a933b74c9f27b3c94c0034eafd06f13bc0a8e2d52ba064467b19bfd93` |
| SSP | v1.9.17 | `bfd9d10a780809ba259406f0770641da6a40ac2d8a6d1e372b070d6f5273351b` |

### Passing workflows

| Workflow | Run | Result |
|---|---:|---|
| RG-4 Merged-Main Six-Tool Validation | `30840723722` | Passed all three jobs |
| Playwright QA | `30840723846` | Runtime/axe, visual, and Windows file-origin passed |
| SSP RG-4 History Harness | `30840723823` | Passed |
| Validate L2G Toolchain | `30840723832` | Passed |

### Workbook route

- Workshop Handoff wire package version 1.0 / contract release and enhancement 1.7 preserved.
- Builder/Merger accepted 110 practices and 320 objectives.
- Generated workbook preserved 222/222 formulas and established workbook structure.
- Workbook Merge remained `l2g_workbook_merge_v1` version 1.1.
- Governance preservation remained only at `workbook_source.workshop_governance_preservation_v1`.
- Preview remained non-mutating.
- Exact re-import remained duplicate-blocked.
- Missing `candidate_id` remained missing and was not inferred from `ownership_record_id`.

### RG-4 route

Builder/Merger v3.10.1 → SSP v1.9.17 passed:

- current pairing;
- stale pairing;
- blocked and incomplete states;
- duplicate acceptance prevention;
- idempotent retry;
- supersession;
- append-only browser-local evidence history;
- history persistence through supported save/restore paths;
- Workshop authority isolation.

### Security and portability

- governed route tests observed no unexpected external network requests;
- no unexpected page errors or console errors were reported;
- accessibility checks passed;
- reviewed visual regression passed;
- native Windows Chromium `file://` passed;
- deterministic materialization and portable release checks passed.

## Historical snapshot preservation

The existing record remains unchanged:

- snapshot: `suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0`;
- SHA-256: `c47fcdd8e8ac82d5d13d1e588ea48955415b7cc91485eb2925a994394c8356d6`;
- disposition: immutable historical technical snapshot.

## Phase 2 promotion candidate

After Phase 1 passed, PR #118 added:

- `suite-2026.08.03-rg4-validated-mcfirecoal-v1.2.0` as a separate additive snapshot;
- metadata-only current-pointer reconciliation for Workshop v79.1, Builder/Merger v3.10.1, and SSP v1.9.17;
- repository release-status reconciliation;
- registry candidate change for `l2g_ssp_word_qa_sidecar_v1` 1.0 from `proposal` to `validated`;
- a dual-phase verifier that rejects disagreement among pointers, registry, snapshots, runtime identities, and Phase 1 evidence.

These records are not authoritative on `main` until the final unchanged PR head passes all workflows, receives final independent review, and merges.

## Evidence artifacts

### Focused workflow `30840723722`

| Artifact | ID | SHA-256 |
|---|---:|---|
| Static and portable identities | `8866645293` | `ae0eabecad3398efce4ed35b2031a6dc13882d3c2c865bc4003fd416f0c0887b` |
| Joint runtime | `8866704982` | `1791a323816e70eec3039e9de188791e03723d0c68278748c4f34efe3fcf7d41` |
| Windows file-origin | `8866680747` | `75aebdb33a6b1d3f6326c580c97f9c0af13390eb702a35f024a7ee21001ac085` |

### Shared Playwright workflow `30840723846`

| Artifact | ID | SHA-256 |
|---|---:|---|
| Runtime and axe report | `8866767934` | `80475f25975d90bba169d2ef9532e8e79089f092ceb38ca1dbedcb0f47576fa6` |
| Visual regression report | `8866702508` | `d253d9b36fc5c0f1722e5a8b9c1e6b0e39b9b0b3ea188b472ecf4e6daeedae1c` |
| Windows file-smoke report | `8866698861` | `9e5aada1b608bf065ee4fe6274eb947d2932b24aa715319ac444e0fc14e3d0c9` |

## Qualification boundary

This report establishes only synthetic technical route compatibility and preservation behavior. It does not determine evidence sufficiency, technical accuracy of client content, practice implementation, assessment results, Met/Not Met, readiness, risk, compliance, certification, scoring, authenticated identity, digital signature, client approval, or client-release authority.
