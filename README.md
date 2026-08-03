# L2G Toolchain

Monorepo for independently versioned, local/offline CMMC L2G modules, package contracts, cross-tool fixtures, suite snapshots, validation, and portable-suite packaging.

## Current supplied module releases

| Module | Current supplied release | Next bounded action |
|---|---:|---|
| L2G Control Center | v0.3.4 | v0.4 read-only action/blocker and regression-overview synchronization is eligible for a separately bounded issue; no downstream authority transfer |
| DocConverter-L2G | v7.9.5.1 | Preserve the exact runtime and registered McFirecoal v1.2.0 handshake baseline until a concrete extraction or package defect is demonstrated |
| L2G Scoper | v3.12 | Preserve the exact scope-context and scope-return behavior until downstream adoption demonstrates a concrete need |
| CMMC L2 Gap Workshop Tool | v79.1 | Complete issue #101 final promotion-head validation and preserve proposed v80 Regression Delta as a separately bounded workstream |
| L2G Builder/Merger | v3.10.1 | Complete issue #101 final promotion-head validation; v3.9 remains reserved for Advisor and Client Delivery Profiles |
| CMMC L2 SSP Modern Editable | v1.9.17 | Complete issue #101 final promotion-head validation while preserving working-data schema v1.9.11 and exactly 110 requirements |

Workbook Handoff contract release 1.7 remains encoded as wire package version 1.0. Workbook Merge remains frozen at version 1.1. The optional governance-preservation assertion is valid only at `workbook_source.workshop_governance_preservation_v1`; the top-level property remains invalid. Missing governed values remain missing: Workshop v79.1 does not infer `candidate_id` from `ownership_record_id`.

Workshop v79.1 and Builder/Merger v3.10.1 are promoted current releases. Their exact merged-main round trip and the Builder/Merger v3.10.1 → SSP v1.9.17 `l2g_ssp_word_qa_sidecar_v1` version 1.0 route passed issue #101 Phase 1 validation on head `3b74f16526f70de7d5972ee461189ff4fb9bb302`. Draft PR #118 carries the validated registry candidate and the additive exact-suite snapshot `suite-2026.08.03-rg4-validated-mcfirecoal-v1.2.0`; those records become current only after the final PR head passes every required workflow and merges.

The prior exact-version technical regression snapshot `suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0` remains immutable at SHA-256 `c47fcdd8e8ac82d5d13d1e588ea48955415b7cc91485eb2925a994394c8356d6`. RG-4 validation makes no readiness, compliance, assessment, certification, scoring, technical-accuracy, evidence-sufficiency, authenticated-identity, digital-signature, client-approval, or client-release conclusion.

## Repository layout

- `modules/` — independently versioned applications and release governance
- `contracts/` — package-route registry and contract documentation
- `fixtures/` — synthetic cross-tool regression fixtures only
- `suite/snapshots/` — named combinations of module versions
- `suite/portable/` — no-install portable-suite packaging
- `validation/` — bounded cross-module validation evidence and verifiers
- `scripts/` — validation and packaging helpers
- `.github/workflows/` — pull-request validation

The canonical runtime remains local HTML. ZIPs, screenshots, workbooks, DOCX/PPTX files, and other generated binaries normally belong in GitHub Releases or Actions artifacts rather than repeated in git history. Exact Builder/Merger sidecars are committed as small JSON fixtures; exact SSP Word artifacts are deterministically regenerated from promoted SSP sources during browser tests and verified against frozen byte lengths and SHA-256 identities.

All repository fixtures and committed validation records must remain synthetic. Client data, CUI, secrets, decrypted project content, and production engagement artifacts are prohibited from repository history, Actions logs, screenshots, and CI artifacts.
