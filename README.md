# L2G Toolchain

Private monorepo for the independently versioned, local/offline CMMC L2G modules, package contracts, cross-tool fixtures, suite snapshots, validation, and portable-suite packaging.

## Current supplied module releases

| Module | Current supplied release | Next bounded action |
|---|---:|---|
| L2G Control Center | v0.3.4 | v0.4 read-only action/blocker overview is eligible for a separately bounded issue; no downstream consumption is claimed yet |
| DocConverter-L2G | v7.9.5.1 | Hold later candidates until they pass the registered McFirecoal v1.2.0 three-part regression and downstream handshakes |
| L2G Scoper | v3.12 | Hold v3.13 unless downstream adoption demonstrates a concrete decision-workflow or package need |
| CMMC L2 Gap Workshop Tool | v78 candidate | v79 Full McFirecoal Toolchain Regression after v78 promotion |
| L2G Builder/Merger | v3.8 | v3.9 Advisor and Client Delivery Profiles only after an orchestrator-approved review/delivery-profile contract |
| CMMC L2 SSP Modern Editable | v1.9.5.1 | Complete the separately bounded v1.9.6 UX release sequence without treating Workshop v78 helpers as an approved delivery-profile contract |

The active exact-version suite completed the prior full toolchain audit, SSP v1.9.5.1 post-fix closeout, Control Center v0.3.4 synchronization, and Workshop v77 promotion. Workshop v78 is now the bounded release candidate for accepted-only advisor/client reporting and optional additive Workbook Handoff 1.7 / SSP Handoff 1.0 helper snapshots. It preserves stable package identities, downstream reviewer control, and v77 record identifiers; it does not claim Builder/Merger or SSP consumption, authorize a review/delivery-profile contract, or establish a new exact-version full-chain snapshot. Cross-tool routes remain package-based, and each module retains its own authority and release lifecycle.

## Repository layout

- `modules/` — independently versioned applications and release governance
- `contracts/` — package-route registry and contract documentation
- `fixtures/` — synthetic cross-tool regression fixtures only
- `suite/snapshots/` — named combinations of module versions
- `suite/portable/` — no-install portable-suite packaging
- `scripts/` — validation and packaging helpers
- `.github/workflows/` — pull-request validation

The canonical runtime remains local HTML. ZIPs, screenshots, workbooks, DOCX/PPTX files, and other generated binaries normally belong in GitHub Releases or Actions artifacts rather than repeated in git history.
