# L2G Toolchain

Private monorepo for the independently versioned, local/offline CMMC L2G modules, package contracts, cross-tool fixtures, suite snapshots, validation, and portable-suite packaging.

## Current supplied module releases

| Module | Current supplied release | Next bounded action |
|---|---:|---|
| L2G Control Center | v0.3.3 | One bounded exact-suite synchronization for SSP v1.9.5.1, registered fixture v1.2.0, and completed audit posture |
| DocConverter-L2G | v7.9.5.1 | Hold later candidates until separately reviewed; exact-version large-bundle and downstream handshake audit passed |
| L2G Scoper | v3.12 | v3.13 downstream-adoption and decision-workflow validation gate, only for a demonstrated need |
| CMMC L2 Gap Workshop Tool | v76 | v77 Evidence Ownership and Provider Follow-up |
| L2G Builder/Merger | v3.8 | v3.9 Advisor and Client Delivery Profiles; future SSP review/delivery consumption remains proposed |
| CMMC L2 SSP Modern Editable | v1.9.5.1 | Post-fix closeout passed; v1.9.6 remains reserved and uncommitted pending architecture authorization |

The active exact-version suite completed the full toolchain audit, and SSP v1.9.5.1 subsequently passed its bounded post-fix backup/schema and Workshop v76 round-trip closeout. Cross-tool routes remain package-based, and each module retains its own authority and release lifecycle.

## Repository layout

- `modules/` — independently versioned applications and release governance
- `contracts/` — package-route registry and contract documentation
- `fixtures/` — synthetic cross-tool regression fixtures only
- `suite/snapshots/` — named combinations of module versions
- `suite/portable/` — no-install portable-suite packaging
- `scripts/` — validation and packaging helpers
- `.github/workflows/` — pull-request validation

The canonical runtime remains local HTML. ZIPs, screenshots, workbooks, DOCX/PPTX files, and other generated binaries normally belong in GitHub Releases or Actions artifacts rather than repeated in git history.
