# L2G Toolchain

Monorepo for independently versioned, local/offline CMMC L2G modules, package contracts, cross-tool fixtures, suite snapshots, validation, portable-suite packaging, and the additive next-generation L2G Integrated Suite.

## Current supplied releases

| Product or module | Current supplied release | Next bounded action |
|---|---:|---|
| **L2G Integrated Suite** | **v0.4.0** | v0.5.0 Pre-Engagement and Interview Sessions design is governed by issue #133; implementation requires accepted domain contracts, Interview Mode UX, threat model, and exact acceptance matrix |
| L2G Control Center | v0.3.4 | v0.4 read-only action/blocker and regression-overview synchronization remains eligible for a separately bounded issue; no downstream authority transfer |
| DocConverter-L2G | v7.9.5.1 | Preserve the exact runtime and registered McFirecoal v1.2.0 handshake baseline until a concrete extraction or package defect is demonstrated |
| L2G Scoper | v3.12 | Preserve the exact scope-context and scope-return behavior until downstream adoption demonstrates a concrete need |
| CMMC L2 Gap Workshop Tool | v79.1 | Preserve the promoted strict workbook-merge and SSP-route behavior; v80 Regression Delta remains a separately bounded workstream |
| L2G Builder/Merger | v3.10.1 | Preserve the promoted governance-preservation and Word-QA behavior; v3.9 remains reserved for Advisor and Client Delivery Profiles |
| CMMC L2 SSP Modern Editable | v1.9.17 | Preserve the promoted RG-4 Word-QA consumer behavior, working-data schema v1.9.11, and exactly 110 requirements |

## Integrated Suite baseline

L2G Integrated Suite v0.4.0 Evidence Catalog Core was promoted by PR #132 and merged at `fff6c801c101bad63455b83703f20e095308f6e7`.

- portable artifact: `L2G_Integrated_Suite_Evidence_Catalog_v0.4.0.html`
- portable HTML SHA-256: `60c1fe78ecf1ce19fcca696f93f043aa26be3515a7bb1f3d07c3708fae8e4f09`
- project kind: `l2g_project_v1`
- encrypted envelope: `l2g_encrypted_project_v1` version `1.0`
- Engagement schema: `l2g_engagement_v1` version `1.0`
- Evidence schema: `l2g_evidence_index_v1` version `1.0`
- Evidence projection: `l2g_evidence_projection_v1` version `1.0`
- normal runtime dependencies: zero
- runtime model: local, offline, no install, no telemetry, no runtime network
- current data boundary: synthetic-only; not authorized for production, client, FCI, or CUI data
- current pointer: `apps/integrated-suite/current_release.json`
- rolling roadmap: `docs/integrated-suite/L2G_Integrated_Suite_Rolling_10_Release_Roadmap_v1.md`
- next design gate: issue #133, v0.5.0 Pre-Engagement and Interview Sessions

The current Integrated Suite provides the shared shell and eight workflow workspaces; Advisor, Client, and Reviewer presentation profiles; encrypted portable projects and encrypted browser recovery; command history, Undo/Redo, checkpoints, and lock/unlock; canonical Engagement identity and planning records; canonical reference-only Evidence source identity, fingerprints, relink, revisions, duplicate disposition, source locations, bounded derived records, target-owned candidates, profile-filtered transient search, and reviewed stable-package adapters; restrictive CSP; deterministic build; SBOM; and adversarial project validation.

Original evidence remains outside the `.l2g` project. SHA-256 establishes byte equality only, browser file associations remain session-only, changed bytes create new source revisions, and imported or interview-derived information cannot silently mutate another domain. Existing standalone module releases remain authoritative and independently distributable.

No current Integrated Suite release authorizes production, client, FCI, or CUI data or establishes readiness, compliance, assessment, certification, scoring, risk, evidence sufficiency, implementation, or Met/Not Met conclusions. Presentation profiles remain non-security modes and are not safe client-distribution artifacts.

## Current contract and suite baseline

Workbook Handoff contract release 1.7 remains encoded as wire package version 1.0. Workbook Merge remains frozen at version 1.1. The optional governance-preservation assertion is valid only at `workbook_source.workshop_governance_preservation_v1`; the top-level property remains invalid. Missing governed values remain missing: Workshop v79.1 does not infer `candidate_id` from `ownership_record_id`.

Workshop v79.1, Builder/Merger v3.10.1, and SSP v1.9.17 passed the completed issue #101 RG-4 validation sequence. The validated `l2g_ssp_word_qa_sidecar_v1` version 1.0 route is registered, and the authoritative additive exact-suite snapshot is `suite-2026.08.03-rg4-validated-mcfirecoal-v1.2.0`.

The prior exact-version technical regression snapshot `suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0` remains immutable at SHA-256 `c47fcdd8e8ac82d5d13d1e588ea48955415b7cc91485eb2925a994394c8356d6`. RG-4 validation and Integrated Suite validation make no readiness, compliance, assessment, certification, scoring, technical-accuracy, evidence-sufficiency, authenticated-identity, digital-signature, client-approval, or client-release conclusion.

## Repository layout

- `apps/integrated-suite/` — Integrated Suite current pointer and shared release governance
- `apps/integrated-suite-v0.1/` through `apps/integrated-suite-v0.4/` — additive versioned Integrated Suite source, schemas, build tooling, release packages, and validation evidence
- `docs/integrated-suite/` — architecture, ADRs, acceptance records, migration planning, UX information architecture, threat models, field-level contracts, decision/risk register, and rolling roadmap
- `modules/` — independently versioned standalone applications and release governance
- `contracts/` — package-route registry and contract documentation
- `fixtures/` — synthetic cross-tool regression fixtures only
- `suite/snapshots/` — named combinations of module versions
- `suite/portable/` — no-install portable-suite packaging
- `validation/` — bounded cross-module validation evidence and verifiers
- `scripts/` — validation and packaging helpers
- `.github/workflows/` — pull-request validation

The canonical runtime remains local HTML. ZIPs, screenshots, workbooks, DOCX/PPTX files, and other generated binaries normally belong in GitHub Releases or Actions artifacts rather than repeated in git history. Exact Builder/Merger sidecars are committed as small JSON fixtures; exact SSP Word artifacts are deterministically regenerated from promoted SSP sources during browser tests and verified against frozen byte lengths and SHA-256 identities. Integrated Suite release HTML, `.l2g` fixtures, release manifests, SBOMs, and validation evidence are generated deterministically and retained through governed release packaging and Actions artifacts.

All repository fixtures and committed validation records must remain synthetic. Client data, CUI, FCI, secrets, decrypted project content, private local paths, and production engagement artifacts are prohibited from repository history, Issues, pull requests, Actions logs, screenshots, CI artifacts, and Releases.
