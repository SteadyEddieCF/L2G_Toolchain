# L2G Toolchain

Private monorepo for the independently versioned, local/offline CMMC L2G modules, package contracts, cross-tool fixtures, suite snapshots, validation, and portable-suite packaging.

## Current supplied module releases

| Module | Current supplied release | Next bounded action |
|---|---:|---|
| L2G Control Center | v0.3.4 | v0.4 read-only action/blocker overview is eligible for a separately bounded issue; no downstream consumption is claimed yet |
| DocConverter-L2G | v7.9.5.1 | Hold later candidates until they pass the registered McFirecoal v1.2.0 three-part regression and downstream handshakes |
| L2G Scoper | v3.12 | Hold v3.13 unless downstream adoption demonstrates a concrete decision-workflow or package need |
| CMMC L2 Gap Workshop Tool | v79 candidate | Proposed v80 Regression Delta and Release Comparison after v79 promotion |
| L2G Builder/Merger | v3.8 | v3.9 Advisor and Client Delivery Profiles only after an orchestrator-approved review/delivery-profile contract |
| CMMC L2 SSP Modern Editable | v1.9.5.1 | Complete the separately bounded v1.9.6 UX release sequence without treating Workshop v78/v79 helpers as an approved delivery-profile contract |

The active exact-version suite completed the prior full toolchain audit, SSP v1.9.5.1 post-fix closeout, Control Center v0.3.4 synchronization, Workshop v77 promotion, and Workshop v78 promotion. Workshop v79 is now the bounded release candidate for the full McFirecoal v1.2.0 six-tool regression. Its candidate evidence records 10/10 required route groups passing, all three fixture ZIP identities and CRCs matching, and 320/320 workbook objectives mapping after a Workshop-only canonical objective-ID correction. The candidate snapshot remains technical route evidence only and does not authorize adjacent-module consumption, a review/delivery-profile contract, or any assessment, sufficiency, readiness, risk, compliance, certification, or scoring conclusion.

## Repository layout

- `modules/` — independently versioned applications and release governance
- `contracts/` — package-route registry and contract documentation
- `fixtures/` — synthetic cross-tool regression fixtures only
- `suite/snapshots/` — named combinations of module versions
- `suite/portable/` — no-install portable-suite packaging
- `scripts/` — validation and packaging helpers
- `.github/workflows/` — pull-request validation

The canonical runtime remains local HTML. ZIPs, screenshots, workbooks, DOCX/PPTX files, and other generated binaries normally belong in GitHub Releases or Actions artifacts rather than repeated in git history.
