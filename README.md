# L2G Toolchain

Private monorepo for the independently versioned, local/offline CMMC L2G modules, package contracts, cross-tool fixtures, suite snapshots, validation, and portable-suite packaging.

## Current supplied module releases

| Module | Current supplied release | Next bounded action |
|---|---:|---|
| L2G Control Center | v0.3.4 | v0.4 read-only action/blocker and regression-overview synchronization is eligible for a separately bounded issue; no downstream authority transfer |
| DocConverter-L2G | v7.9.5.1 | No immediate release required; preserve the exact runtime and registered McFirecoal v1.2.0 handshake baseline until a concrete extraction or package defect is demonstrated |
| L2G Scoper | v3.12 | No immediate release required; preserve the exact scope-context and scope-return behavior until downstream adoption demonstrates a concrete need |
| CMMC L2 Gap Workshop Tool | v79 promoted; v79.1 draft corrective candidate in PR #112 | Complete issue #105 strict Workbook Merge 1.1 validation and exact corrected Builder/Merger v3.10.1 round trip; preserve proposed v80 Regression Delta workstream |
| L2G Builder/Merger | v3.10 promoted; v3.10.1 draft corrective candidate in PR #113 | Complete issue #106 nested governance-preservation correction and exact joint round trip with Workshop v79.1; v3.9 remains reserved for Advisor and Client Delivery Profiles |
| CMMC L2 SSP Modern Editable | v1.9.17 | Complete issue #101 merged-main joint validation and registry promotion decision while preserving working-data schema v1.9.11 and exactly 110 requirements |

Workbook Handoff contract release 1.7 remains encoded as wire package version 1.0. Workbook Merge remains frozen at version 1.1. The optional governance-preservation assertion is valid only at `workbook_source.workshop_governance_preservation_v1`; the top-level property remains invalid.

Builder/Merger v3.10 and SSP v1.9.17 are promoted current module releases. Their additive `l2g_ssp_word_qa_sidecar_v1` version 1.0 route remains `proposal` until issue #101 completes merged-main exact-artifact testing, Workshop/Builder round-trip regression, six-tool compatibility, a new named suite snapshot, and an explicit registry promotion decision.

The prior exact-version technical regression snapshot `suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0` remains immutable and must not be rewritten. The RG-4 route makes no readiness, compliance, assessment, certification, scoring, technical-accuracy, evidence-sufficiency, authenticated-identity, digital-signature, client-approval, or client-release conclusion.

## Repository layout

- `modules/` — independently versioned applications and release governance
- `contracts/` — package-route registry and contract documentation
- `fixtures/` — synthetic cross-tool regression fixtures only
- `suite/snapshots/` — named combinations of module versions
- `suite/portable/` — no-install portable-suite packaging
- `scripts/` — validation and packaging helpers
- `.github/workflows/` — pull-request validation

The canonical runtime remains local HTML. ZIPs, screenshots, workbooks, DOCX/PPTX files, and other generated binaries normally belong in GitHub Releases or Actions artifacts rather than repeated in git history. Exact Builder/Merger sidecars are committed as small JSON fixtures; exact SSP Word artifacts are deterministically regenerated from promoted SSP sources during browser tests and verified against frozen byte lengths and SHA-256 identities.
