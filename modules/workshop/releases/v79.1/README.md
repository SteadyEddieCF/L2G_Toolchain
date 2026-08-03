# CMMC L2 Gap Workshop Tool v79.1

Corrective draft release for issue #105, updated in existing PR #112 after reconciliation with protected `main` `69785ecd38f4d00345f27ca13e934dd0f688a1bf`.

## Bounded behavior

- only `l2g_workbook_merge_v1` wire version `1.1` may be trusted;
- duplicate keys at every nesting level and undeclared top-level fields fail closed;
- top-level `workshop_governance_preservation_v1` remains invalid;
- the optional assertion is accepted only at `workbook_source.workshop_governance_preservation_v1`;
- extension identity, shape, counts, stable IDs, record fingerprints, preservation fingerprint, source-Handoff linkage, and guardrails are validated exactly;
- source, workbook-preserved, and current Workshop governed projections must all agree;
- discrepancies are deterministic and block apply;
- the assertion never creates, restores, overwrites, closes, reopens, or deletes operational records;
- exact pre-preview operational bytes are preserved through inherited queued rendering after apply;
- valid preview remains non-mutating; apply is explicit; exact duplicate handling and undo remain governed;
- Workbook Handoff remains **contract release 1.7 — wire package version 1.0**;
- Workshop↔SSP Handoff/Return 1.0 remains unchanged.

## Runtime

- File: `cmmc_l2_gap_workshop_tool_v79.1.html`
- Size: `1885465` bytes
- SHA-256: `1fa1e186269b45110240b7ca39eaf6f40bb2ec55b8c496aaf01dfe6a65032ee2`
- Embedded exact v79 baseline: 1,836,145 bytes / `a1f63944d0573587e2a5b7826f72befa16f6d89b849f3129f7f6dbb080da54ca`

## Portable materialization

`python build_release.py` reproduces the runtime from files contained entirely in this directory after extraction. The package includes the exact verified v79 HTML input in the complete deliverables ZIP and requires no sibling repository tree. `python package_release.py` additionally extracts the generated ZIP into a clean temporary directory and proves exact reproduction there.

## Dependency

Final joint compatibility remains pending the exact corrected Builder/Merger v3.10.1 PR #113 candidate. Local contract fixtures prove Workshop-owned consumer behavior only and are not represented as the final Orchestrator candidate-to-candidate result. PR #112 remains draft and unmerged; issue #105 remains open; v80 remains separately preserved.
