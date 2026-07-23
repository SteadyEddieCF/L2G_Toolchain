# L2G Toolchain

Private monorepo for the independently versioned, local/offline CMMC L2G modules, package contracts, cross-tool fixtures, suite snapshots, validation, and portable-suite packaging.

## Current supplied module releases

| Module | Current supplied release | Next bounded action |
|---|---:|---|
| L2G Control Center | v0.3.3 | Hold feature synchronization pending the current exact-version toolchain audit |
| DocConverter-L2G | v7.9.5.1 | Complete the exact-version large-bundle and downstream handshake audit before promoting later candidates |
| L2G Scoper | v3.12 | v3.13 downstream-adoption and decision-workflow validation gate, only for a demonstrated need |
| CMMC L2 Gap Workshop Tool | v76 | v77 Evidence Ownership and Provider Follow-up |
| L2G Builder/Merger | v3.8 | v3.9 Advisor and Client Delivery Profiles; future SSP review/delivery consumption remains proposed |
| CMMC L2 SSP Modern Editable | v1.9.5.1 | Independent review of bounded issue #31 correction; v1.9.6 remains reserved |

These versions reflect the active governed runtime catalog on protected `main` as of 2026-07-23. This table is not a claim that the exact six-module combination has completed one full end-to-end suite regression together. Cross-tool routes remain package-based, and each module retains its own authority and release lifecycle.

## Repository layout

- `modules/` — independently versioned applications and release governance
- `contracts/` — package-route registry and contract documentation
- `fixtures/` — synthetic cross-tool regression fixtures only
- `suite/snapshots/` — named combinations of module versions
- `suite/portable/` — no-install portable-suite packaging
- `scripts/` — validation and packaging helpers
- `.github/workflows/` — pull-request validation

The canonical runtime remains local HTML. ZIPs, screenshots, workbooks, DOCX/PPTX files, and other generated binaries normally belong in GitHub Releases or Actions artifacts rather than repeated in git history.
