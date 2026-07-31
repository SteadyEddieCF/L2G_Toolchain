# L2G Toolchain

Private monorepo for the independently versioned, local/offline CMMC L2G modules, package contracts, cross-tool fixtures, suite snapshots, validation, and portable-suite packaging.

## Current supplied module releases

| Module | Current supplied release | Next bounded action |
|---|---:|---|
| L2G Control Center | v0.3.4 | v0.4 read-only action/blocker and regression-overview synchronization is eligible for a separately bounded issue; no downstream authority transfer |
| DocConverter-L2G | v7.9.5.1 | No immediate release required; preserve the exact runtime and registered McFirecoal v1.2.0 handshake baseline until a concrete extraction or package defect is demonstrated |
| L2G Scoper | v3.12 | No immediate release required; preserve the exact scope-context and scope-return behavior until downstream adoption demonstrates a concrete need |
| CMMC L2 Gap Workshop Tool | v79 | Proposed v80 Regression Delta and Release Comparison as a separately bounded Workshop release |
| L2G Builder/Merger | v3.8 | Review stacked v3.10 RG-4 SSP Final Word-QA Sidecar Producer candidate; v3.9 remains reserved for Advisor and Client Delivery Profiles |
| CMMC L2 SSP Modern Editable | v1.9.16 | Review stacked v1.9.17 RG-4 Final Word-QA Sidecar Consumer and Evidence History candidate against proposal contract head `cb5c41abf015d7eee095b10fabe2fc0059473e89` |

The promoted exact-version technical regression snapshot remains `suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0`; it is not rewritten by the RG-4 candidates. SSP v1.9.17 is an unmerged SSP-only consumer candidate over promoted v1.9.16. It validates one exact Builder/Merger sidecar and paired SSP DOCX, independently derives current/stale state, requires explicit local acceptance or stale acknowledgement, and preserves append-only local evidence and supersession history. It retains the v1.9.11 working-data schema, exactly 110 requirements, existing review behavior, and all adjacent module runtimes. The new route remains `proposal` pending exact-head joint promotion and makes no readiness, compliance, assessment, certification, scoring, technical-accuracy, evidence-sufficiency, authenticated-identity, digital-signature, or client-release conclusion.

## Repository layout

- `modules/` — independently versioned applications and release governance
- `contracts/` — package-route registry and contract documentation
- `fixtures/` — synthetic cross-tool regression fixtures only
- `suite/snapshots/` — named combinations of module versions
- `suite/portable/` — no-install portable-suite packaging
- `scripts/` — validation and packaging helpers
- `.github/workflows/` — pull-request validation

The canonical runtime remains local HTML. ZIPs, screenshots, workbooks, DOCX/PPTX files, and other generated binaries normally belong in GitHub Releases or Actions artifacts rather than repeated in git history. Exact Builder/Merger sidecars are committed as small JSON fixtures; exact SSP Word artifacts are deterministically regenerated from promoted v1.9.16 during browser tests and verified against their frozen byte lengths and SHA-256 identities.
