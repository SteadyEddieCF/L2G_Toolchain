# L2G Toolchain

Private monorepo for the independently versioned, local/offline CMMC L2G modules, package contracts, cross-tool fixtures, suite snapshots, validation, and portable-suite packaging.

## Current supplied module releases

| Module | Current supplied release | Next bounded action |
|---|---:|---|
| L2G Control Center | v0.3.4 | Defer v0.4 read-only action/blocker overview until Workshop v77 establishes the canonical action, evidence-owner, and provider-follow-up records it may observe |
| DocConverter-L2G | v7.9.5.1 | Hold later candidates until they pass the registered McFirecoal v1.2.0 three-part regression and downstream handshakes |
| L2G Scoper | v3.12 | Hold v3.13 unless Workshop v77 or downstream adoption demonstrates a concrete decision-workflow or package need |
| CMMC L2 Gap Workshop Tool | v77 | v78 Contract-safe Reporting and SSP/Workbook Alignment; separately bounded and no future review/delivery profile without approval |
| L2G Builder/Merger | v3.8 | v3.9 Advisor and Client Delivery Profiles after an orchestrator-approved review/delivery profile contract |
| CMMC L2 SSP Modern Editable | v1.9.5.1 | Hold v1.9.6 until Workshop ownership records and the SSP-to-Builder/Merger review/delivery profile contract are approved |

The active exact-version suite completed the full toolchain audit, SSP v1.9.5.1 passed its bounded post-fix backup/schema and Workshop v76 round-trip closeout, and Control Center v0.3.4 synchronized the exact suite and optional Stage 5 capability metadata. Workshop v77 is a bounded Workshop-only release candidate; it does not change adjacent-module contracts or claim a completed new exact-version full-chain snapshot. Cross-tool routes remain package-based, and each module retains its own authority and release lifecycle.

## Repository layout

- `modules/` — independently versioned applications and release governance
- `contracts/` — package-route registry and contract documentation
- `fixtures/` — synthetic cross-tool regression fixtures only
- `suite/snapshots/` — named combinations of module versions
- `suite/portable/` — no-install portable-suite packaging
- `scripts/` — validation and packaging helpers
- `.github/workflows/` — pull-request validation

The canonical runtime remains local HTML. ZIPs, screenshots, workbooks, DOCX/PPTX files, and other generated binaries normally belong in GitHub Releases or Actions artifacts rather than repeated in git history.
