# SSP RG-4 Evidence-History Harness File Inventory

Governing issue: #107  
Baseline: `3be4153c45cb6534954592a6e4ff1cfda87c8bb4`  
Branch: `validation/ssp-rg4-history-harness`  
Draft PR: #111

## CI and registration

1. `.github/workflows/ssp-rg4-history-harness.yml`
2. `package.json`

## Playwright fixtures and regression

3. `tests/playwright/ssp-rg4-history-file-smoke.spec.mjs`
4. `tests/playwright/ssp-rg4-history-harness-fixture.mjs`
5. `tests/playwright/ssp-rg4-history-harness.spec.mjs`

## Reports, governance, and validation helpers

6. `validation/rg4/ssp-history-harness/CANONICAL_BLOCKER_MAP.json`
7. `validation/rg4/ssp-history-harness/FILE_INVENTORY.md`
8. `validation/rg4/ssp-history-harness/FIXTURE_HASHES.json`
9. `validation/rg4/ssp-history-harness/HARNESS_RECONCILIATION_RESULTS.json`
10. `validation/rg4/ssp-history-harness/README.md`
11. `validation/rg4/ssp-history-harness/REGRESSION_MATRIX.json`
12. `validation/rg4/ssp-history-harness/ROOT_CAUSE_REPORT.md`
13. `validation/rg4/ssp-history-harness/VALIDATION_RESULTS.md`
14. `validation/rg4/ssp-history-harness/verify_ssp_rg4_history_harness.py`

## Exact fixtures

15. `validation/rg4/ssp-history-harness/fixtures/RG4_Workshop_v79_SSP_Handoff_1.0.json.gz.b64.part00`
16. `validation/rg4/ssp-history-harness/fixtures/RG4_Workshop_v79_SSP_Handoff_1.0.json.gz.b64.part01`
17. `validation/rg4/ssp-history-harness/fixtures/RG4_Workshop_v79_SSP_Handoff_1.0.json.gz.b64.part02`
18. `validation/rg4/ssp-history-harness/fixtures/RG4_Workshop_v79_SSP_Handoff_1.0.json.gz.b64.part03`
19. `validation/rg4/ssp-history-harness/fixtures/RG4_Workshop_v79_SSP_Handoff_1.0.json.gz.b64.part04`
20. `validation/rg4/ssp-history-harness/fixtures/unsupported_synthetic_history_seed.json`

## Boundary verification

No SSP or adjacent-tool runtime, working-data schema, current pointer, contract-registry entry, or historical suite snapshot is included in this changed-file inventory.

The complete delivery ZIP provides a generated SHA-256 inventory covering the delivered source, fixtures, reports, and CI evidence.
