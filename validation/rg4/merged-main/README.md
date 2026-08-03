# RG-4 Merged-Main Six-Tool Validation

## Governing issue

GitHub issue #101.

## Exact starting baseline

- repository: `SteadyEddieCF/L2G_Toolchain`
- protected `main` at branch creation: `e14ed000e490040182b529d7e2b3bc7155c03287`
- validation branch: `validation/rg4-merged-main-six-tool`
- Workshop v79.1 merge: `e14ed000e490040182b529d7e2b3bc7155c03287`
- Builder/Merger v3.10.1 merge: `d3cd223befb3aa1b53b2feea291b9f38b8d2645e`
- SSP v1.9.17 remains current at runtime SHA-256 `bfd9d10a780809ba259406f0770641da6a40ac2d8a6d1e372b070d6f5273351b`

## Current technical suite

- Control Center v0.3.4
- DocConverter-L2G v7.9.5.1
- Scoper v3.12
- Workshop v79.1
- Builder/Merger v3.10.1
- SSP v1.9.17

## Validation phases

### Phase 1 — technical validation

The initial branch changes only the validation harness and evidence records. The RG-4 route remains `proposal`, no new suite snapshot is promoted, and the stale post-merge pointer wording is reported rather than silently rewritten.

Required evidence:

1. exact current runtime identities and portable materialization;
2. repository static validation;
3. six-tool runtime and axe-core regression;
4. Workshop v79.1 → Builder/Merger v3.10.1 → Workshop v79.1 exact round trip;
5. Builder/Merger v3.10.1 → SSP v1.9.17 RG-4 current, stale, blocked, incomplete, duplicate, retry, and supersession behavior;
6. supported SSP RG-4 history persistence and Workshop isolation;
7. visual regression and native Windows Chromium `file://` operation;
8. zero unexpected network requests, page errors, and console errors in governed route tests;
9. preservation of the immutable `suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0` record.

### Phase 2 — candidate promotion records

Only after Phase 1 passes on an exact reviewed head may this branch add:

- the new additive exact-suite snapshot;
- metadata-only Workshop and Builder/Merger current-pointer reconciliation;
- SSP producer-release metadata reconciliation;
- `l2g_ssp_word_qa_sidecar_v1` version 1.0 registry stability change from `proposal` to `validated`;
- the exact CI run IDs and reviewed-head evidence report.

All final-head workflows must then pass again before merge.

## Boundaries

This validation does not introduce a new module feature, rewrite a historical snapshot, retire a standalone release, or make any assessment, evidence-sufficiency, readiness, risk, compliance, certification, scoring, technical-accuracy, authenticated-identity, digital-signature, client-approval, or client-release conclusion.
