# Workshop v79.1 Corrected Release Report

## Candidate identity

- Issue #105 / existing draft PR #112
- Reconciled protected main: `69785ecd38f4d00345f27ca13e934dd0f688a1bf`
- Previous reviewed head: `44fa69aab6efd33082f56f0b2be10c3b6e49051a`
- Runtime: 1885465 bytes / `1fa1e186269b45110240b7ca39eaf6f40bb2ec55b8c496aaf01dfe6a65032ee2`
- Status: corrected draft candidate, unpromoted, exact-head CI pending

## Correction

The fixed Workbook Merge 1.1 top-level shape remains strict. `workshop_governance_preservation_v1` is invalid at the package top level and optional only under `workbook_source`. The nested assertion requires exact contract identity, canonical SHA-256 fingerprints, counts, unique stable IDs, source-versus-workbook equivalence, and source-versus-current-Workshop equivalence. Any discrepancy blocks apply with deterministic details. Exact agreement is evidence only and cannot mutate operational records.

The non-mutation guard now captures the exact pre-preview operational state and preserves it through the inherited queued render cycle after apply. The release package is independently materializable because it contains the exact verified v79 baseline input required by its patch appliance.

## Preserved behavior and boundaries

Merge 1.1 version/shape/duplicate-key/identity strictness, inert text, non-mutating preview, explicit apply, duplicate handling, undo, Handoff 1.7 wire 1.0, and SSP Handoff/Return 1.0 remain preserved. No Builder/Merger, SSP, DocConverter, Scoper, Control Center, production registry, historical snapshot, or RG-4 route status is modified.

## Remaining dependency

Final Orchestrator compatibility requires the exact corrected Builder/Merger v3.10.1 PR #113 candidate. Local fixtures do not substitute for that joint result. Issue #105 and PR #112 remain open/draft and unmerged.
