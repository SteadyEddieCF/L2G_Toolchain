# L2G Toolchain

Private monorepo for the independently versioned, local/offline CMMC L2G modules, package contracts, cross-tool fixtures, suite snapshots, validation, and portable-suite packaging.

## Current supplied module releases

| Module | Current supplied release | Next bounded action |
|---|---:|---|
| L2G Control Center | v0.3.4 | v0.4 read-only action/blocker and regression-overview synchronization is eligible for a separately bounded issue; no downstream authority transfer |
| DocConverter-L2G | v7.9.5.1 | No immediate release required; preserve the exact runtime and registered McFirecoal v1.2.0 handshake baseline until a concrete extraction or package defect is demonstrated |
| L2G Scoper | v3.12 | No immediate release required; preserve the exact scope-context and scope-return behavior until downstream adoption demonstrates a concrete need |
| CMMC L2 Gap Workshop Tool | v79 | Proposed v80 Regression Delta and Release Comparison as a separately bounded Workshop release |
| L2G Builder/Merger | v3.8 | v3.9 Advisor and Client Delivery Profiles only after a separately approved review/delivery-profile contract; Workshop v78/v79 helpers alone do not authorize implementation |
| CMMC L2 SSP Modern Editable | v1.9.8 candidate | Independent review of RG-1 Generic Source-Preflight Review Profile; RG-2 remains planned but unauthorized |

The promoted exact-version technical regression snapshot remains `suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0`, which tested Control Center v0.3.4, DocConverter-L2G v7.9.5.1, Scoper v3.12, Workshop v79, Builder/Merger v3.8, and SSP v1.9.5.1 across all 10 required route groups. SSP v1.9.8 is a separately bounded candidate over promoted SSP v1.9.7. It adds the generic RG-1 source-preflight profile and deterministic migration to working-data identity 1.9.8 while preserving stable cross-tool contracts and package meanings. It does not rewrite the Workshop-v79 snapshot or authorize RG-2, Word inspection, Builder/Merger sidecars, adjacent-module consumption, or any assessment, sufficiency, readiness, risk, compliance, certification, or scoring conclusion.

## Repository layout

- `modules/` — independently versioned applications and release governance
- `contracts/` — package-route registry and contract documentation
- `fixtures/` — synthetic cross-tool regression fixtures only
- `suite/snapshots/` — named combinations of module versions
- `suite/portable/` — no-install portable-suite packaging
- `scripts/` — validation and packaging helpers
- `.github/workflows/` — pull-request validation

The canonical runtime remains local HTML. ZIPs, screenshots, workbooks, DOCX/PPTX files, and other generated binaries normally belong in GitHub Releases or Actions artifacts rather than repeated in git history.
