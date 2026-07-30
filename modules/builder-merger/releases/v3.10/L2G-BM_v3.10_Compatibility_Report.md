# L2G Builder/Merger v3.10 Compatibility Report

## Baseline reconciliation

- Exact implementation baseline: Builder/Merger v3.8.
- Contract branch/head: `contracts/rg4-ssp-word-qa-sidecar-v1` / `cb5c41abf015d7eee095b10fabe2fc0059473e89`.
- No pre-existing Builder/Merger v3.10 RG-4 implementation was found before work began.
- v3.9 remains reserved and was not reused.
- SSP fixture producer: v1.9.16; working data schema: v1.9.11; requirement count: 110.

## Stable Builder/Merger routes

| Route | Required version | v3.10 result |
|---|---:|---|
| Workshop Handoff input | 1.7 | Existing Build workflow retained and regression download produced. |
| Workbook Merge return | 1.1 | Existing extraction retained; package metadata corrected from the pre-existing runtime value 1.0 to registry value 1.1. |
| Builder Decision Plan | 1.0 | Existing optional governance workflow retained. |
| External CSV | Existing literal import behavior | Existing CSV-to-XLSX download produced. |

## Existing-route regression outputs

- Build workbook: pass; `CMMC_L2_Gap_Analysis_Workbook_L2G_Populated.xlsx`, 1,021,220 bytes.
- Workbook Merge: pass; `l2g_workbook_merge_v1.json`, package kind correct, package version `1.1`, 1,425,838 bytes.
- External CSV: pass; `CMMC_L2_Gap_Analysis_Workbook_External_CSV.xlsx`, 114,677 bytes.
- Unexpected page errors: 0.

## RG-4 route isolation

The Word-QA producer is additive. It does not modify:

- Workshop, SSP, Scoper, DocConverter, or Control Center code;
- SSP governed-source or acceptance rules;
- existing workbook formulas, validations, matching logic, delivery profiles, or source lineage;
- historical suite snapshots;
- contract proposal files.

## Compatibility classifications

- **Compatible:** SSP v1.9.16 DOCX fixture with embedded manifest and frozen single-system scope.
- **Compatible with operator completion:** structurally clean DOCX before the required local layout review is asserted; output remains `qa_incomplete`.
- **Blocked:** malformed Open XML, identity mismatch, unresolved governed tokens, comments/revisions, path traversal, active content, broken relationships, or other failed blocking checks.

## Version and promotion conditions

- The RG-4 contract remains proposal-only on draft PR #94.
- v3.10 is a candidate stacked on the contract branch and is not validated.
- The implementation must not be merged before contract promotion and Orchestrator-controlled rebase/retarget.
- SSP v1.9.17 consumer work is outside this release and was not started.
