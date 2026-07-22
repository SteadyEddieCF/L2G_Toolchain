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
| CMMC L2 SSP Modern Editable | v1.8.3 | v1.8.4 consolidated and module-specific CRM |

These are the latest releases supplied to the repository bootstrap on 2026-07-17, with the SSP pointer advanced by its governed v1.8.3 parent-change impact and conflict-workflow candidate. This table is not a claim that the six releases have completed one full end-to-end suite regression together.

## Repository layout

- `modules/` — independently versioned applications and release governance
- `contracts/` — package-route registry and contract documentation
- `fixtures/` — synthetic cross-tool regression fixtures only
- `suite/snapshots/` — named combinations of module versions
- `suite/portable/` — no-install portable-suite packaging
- `scripts/` — validation and packaging helpers
- `.github/workflows/` — pull-request validation

The canonical runtime remains local HTML. ZIPs, screenshots, workbooks, DOCX/PPTX files, and other generated binaries normally belong in GitHub Releases or Actions artifacts rather than repeated in git history.
