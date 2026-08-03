# RG-4 Merged-Main Six-Tool Validation

## Governing issue

GitHub issue #101 and draft PR #118.

## Exact starting baseline

- repository: `SteadyEddieCF/L2G_Toolchain`
- protected `main` at branch creation: `e14ed000e490040182b529d7e2b3bc7155c03287`
- validation branch: `validation/rg4-merged-main-six-tool`
- Workshop v79.1 merge: `e14ed000e490040182b529d7e2b3bc7155c03287`
- Builder/Merger v3.10.1 merge: `d3cd223befb3aa1b53b2feea291b9f38b8d2645e`
- SSP v1.9.17 runtime SHA-256: `bfd9d10a780809ba259406f0770641da6a40ac2d8a6d1e372b070d6f5273351b`

## Current technical suite

- Control Center v0.3.4
- DocConverter-L2G v7.9.5.1
- Scoper v3.12
- Workshop v79.1
- Builder/Merger v3.10.1
- SSP v1.9.17

## Phase 1 — completed technical validation

Exact Phase 1 evidence head:

`3b74f16526f70de7d5972ee461189ff4fb9bb302`

Passing workflows:

- focused RG-4 merged-main workflow run `30840723722`;
- shared Playwright QA run `30840723846`;
- SSP RG-4 History Harness run `30840723823`;
- repository validation run `30840723832`;
- inherited SSP materialization workflows.

Passing evidence includes:

1. exact current runtime identities and portable materialization;
2. repository static validation;
3. six-tool runtime and axe-core regression;
4. Workshop v79.1 → Builder/Merger v3.10.1 → Workshop v79.1 exact round trip;
5. Builder/Merger v3.10.1 → SSP v1.9.17 RG-4 current, stale, blocked, incomplete, duplicate, retry, and supersession behavior;
6. SSP RG-4 history persistence and Workshop authority isolation;
7. visual regression and native Windows Chromium `file://` operation;
8. zero unexpected network requests, page errors, and console errors in governed route tests;
9. preservation of `suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0` at SHA-256 `c47fcdd8e8ac82d5d13d1e588ea48955415b7cc91485eb2925a994394c8356d6`.

## Phase 2 — promotion candidate

Phase 2 adds only governance and release-state reconciliation:

- additive snapshot `suite-2026.08.03-rg4-validated-mcfirecoal-v1.2.0`;
- Workshop v79.1 and Builder/Merger v3.10.1 current-pointer reconciliation;
- SSP v1.9.17 producer-release and validation metadata reconciliation;
- `l2g_ssp_word_qa_sidecar_v1` version 1.0 registry stability candidate change from `proposal` to `validated`;
- repository README reconciliation;
- exact Phase 1 workflow and artifact identities.

The promotion candidate is not current merely because it appears on the branch. Every final-head workflow must pass again, the PR must receive final independent review, and PR #118 must merge before issue #101 closes or the new snapshot and registry qualification become authoritative on `main`.

## Evidence artifacts

Focused workflow run `30840723722`:

- static/portable identities — artifact `8866645293`, SHA-256 `ae0eabecad3398efce4ed35b2031a6dc13882d3c2c865bc4003fd416f0c0887b`;
- joint runtime — artifact `8866704982`, SHA-256 `1791a323816e70eec3039e9de188791e03723d0c68278748c4f34efe3fcf7d41`;
- Windows file-origin — artifact `8866680747`, SHA-256 `75aebdb33a6b1d3f6326c580c97f9c0af13390eb702a35f024a7ee21001ac085`.

Shared Playwright run `30840723846`:

- runtime/axe report — artifact `8866767934`, SHA-256 `80475f25975d90bba169d2ef9532e8e79089f092ceb38ca1dbedcb0f47576fa6`;
- visual regression — artifact `8866702508`, SHA-256 `d253d9b36fc5c0f1722e5a8b9c1e6b0e39b9b0b3ea188b472ecf4e6daeedae1c`;
- Windows file smoke — artifact `8866698861`, SHA-256 `9e5aada1b608bf065ee4fe6274eb947d2932b24aa715319ac444e0fc14e3d0c9`.

## Boundaries

This validation does not introduce a new module feature, rewrite a historical snapshot, retire a standalone release, or make any assessment, evidence-sufficiency, readiness, risk, compliance, certification, scoring, technical-accuracy, authenticated-identity, digital-signature, client-approval, or client-release conclusion.
