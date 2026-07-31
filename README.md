# L2G Toolchain

Private monorepo for the independently versioned, local/offline CMMC L2G modules, package contracts, cross-tool fixtures, suite snapshots, validation, and portable-suite packaging.

## Current supplied module releases

| Module | Current supplied release | Next bounded action |
|---|---:|---|
| L2G Control Center | v0.3.4 | Preserve current read-only behavior during RG-4 corrective work |
| DocConverter-L2G | v7.9.5.1 | No Workshop-driven change |
| L2G Scoper | v3.12 | No Workshop-driven change |
| CMMC L2 Gap Workshop Tool | v79 promoted; v79.1 draft corrective candidate | Complete issue #105 strict Workbook Merge validation and exact Builder/Merger v3.10.1 round trip; preserve planned v80 Regression Delta workstream |
| L2G Builder/Merger | v3.10 | Issue #106 owns v3.10.1 lossless Workshop action/ownership preservation |
| CMMC L2 SSP Modern Editable | v1.9.17 | Issue #107 owns RG-4 history-fixture harness reconciliation; runtime remains unchanged unless a supported-workflow defect is proven |

Workbook Handoff uses contract release 1.7 encoded as wire package version 1.0. Workshop v79.1 must not relabel the wire version. Workbook Merge remains frozen at version 1.1.

The `l2g_ssp_word_qa_sidecar_v1` version 1.0 route remains `proposal`. No corrective branch may promote it or rewrite historical suite snapshot `suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0`.

## Repository layout

- `modules/` — independently versioned applications and release governance
- `contracts/` — package-route registry and contract documentation
- `fixtures/` — synthetic cross-tool regression fixtures only
- `suite/snapshots/` — named combinations of module versions
- `suite/portable/` — no-install portable-suite packaging
- `scripts/` — validation and packaging helpers
- `.github/workflows/` — pull-request validation

The canonical runtime remains local HTML. Generated binaries belong in Actions artifacts or release packages rather than repeated in git history.
