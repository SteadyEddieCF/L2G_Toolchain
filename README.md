# L2G Toolchain

Private monorepo for the independently versioned, local/offline CMMC L2G modules, package contracts, cross-tool fixtures, suite snapshots, validation, and portable-suite packaging.

## Current supplied module releases

| Module | Current supplied release | Next bounded action |
|---|---:|---|
| L2G Control Center | v0.3.4 | v0.4 read-only action/blocker and regression-overview synchronization is eligible for a separately bounded issue; no downstream authority transfer |
| DocConverter-L2G | v7.9.5.1 | No immediate release required; preserve the exact runtime and registered McFirecoal v1.2.0 handshake baseline until a concrete extraction or package defect is demonstrated |
| L2G Scoper | v3.12 | No immediate release required; preserve the exact scope-context and scope-return behavior until downstream adoption demonstrates a concrete need |
| CMMC L2 Gap Workshop Tool | v79 | Proposed v80 Regression Delta and Release Comparison as a separately bounded Workshop release |
| L2G Builder/Merger | v3.8 | RG-4 final Word-QA sidecar must begin as a separately authorized SSP/Builder-Merger handshake release; no sidecar contract exists yet |
| CMMC L2 SSP Modern Editable | v1.9.14 candidate | Independent review of issue #76 command-surface and modal-chrome consolidation; RG-4 remains the next mandatory SSP/Builder-Merger handshake release after promotion |

The promoted exact-version technical regression snapshot remains `suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0`. SSP v1.9.14 is an SSP-only UX candidate over promoted v1.9.13. It consolidates Undo/Redo, Import, Export, Actions, Print, and Deliver into a balanced command surface; compacts Review, Needs Attention, State details, and Deliver chrome; hides decorative modal scrollbars; and standardizes × close controls and button theming. It retains the v1.9.11 working-data schema, review profiles, Word Review behavior, package routes, and all cross-tool contracts. It introduces no Builder/Merger sidecar and makes no readiness, compliance, assessment, certification, final Word-QA, or client-release conclusion.

## Repository layout

- `modules/` — independently versioned applications and release governance
- `contracts/` — package-route registry and contract documentation
- `fixtures/` — synthetic cross-tool regression fixtures only
- `suite/snapshots/` — named combinations of module versions
- `suite/portable/` — no-install portable-suite packaging
- `scripts/` — validation and packaging helpers
- `.github/workflows/` — pull-request validation

The canonical runtime remains local HTML. ZIPs, screenshots, workbooks, DOCX/PPTX files, and other generated binaries normally belong in GitHub Releases or Actions artifacts rather than repeated in git history.
