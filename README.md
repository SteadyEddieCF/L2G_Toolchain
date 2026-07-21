# L2G Toolchain

Private monorepo for the independently versioned, local/offline CMMC L2G modules, package contracts, cross-tool fixtures, suite snapshots, validation, and portable-suite packaging.

## Current supplied module releases

| Module | Current supplied release | Next bounded action |
|---|---:|---|
| L2G Control Center | v0.3.2 | v0.4 read-only action and blocker overview |
| DocConverter-L2G | v7.9.5 | v7.9.6 OCR Review Workbench and Batch Navigation |
| L2G Scoper | v3.11 | Complete the post-release audit gate before authorizing code changes |
| CMMC L2 Gap Workshop Tool | v76 | v77 Evidence Ownership and Provider Follow-up |
| L2G Builder/Merger | v3.8 | v3.9 Advisor and Client Delivery Profiles |
| CMMC L2 SSP Modern Editable | v1.7.1 release candidate | Complete draft-PR CI and independent review, then begin SME/QMS pilot |

The SSP v1.7.1 release candidate completed a bounded exact-version bidirectional smoke with Workshop v76: 32/32 checks passed, 110 controls remained coherent, and the stable handoff/return contracts remain version 1.0. This is not a claim of company-wide production-baseline approval.

These module versions remain independently governed. The table is not a claim that all releases have completed one full end-to-end suite regression together.

## Repository layout

- `modules/` — independently versioned applications and release governance
- `contracts/` — package-route registry and contract documentation
- `fixtures/` — synthetic cross-tool regression fixtures only
- `suite/snapshots/` — named combinations of module versions
- `suite/portable/` — no-install portable-suite packaging
- `scripts/` — validation and packaging helpers
- `.github/workflows/` — pull-request validation

The canonical runtime remains local HTML. ZIPs, screenshots, workbooks, DOCX/PPTX files, and other generated binaries normally belong in GitHub Releases or Actions artifacts rather than repeated in git history.
