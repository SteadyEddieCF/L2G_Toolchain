# L2G Toolchain

Monorepo for independently versioned, local/offline CMMC L2G modules, package contracts, cross-tool fixtures, suite snapshots, validation, portable-suite packaging, and the additive next-generation L2G Integrated Suite.

## Current supplied releases

| Product or module | Current supplied release | Next bounded action |
|---|---:|---|
| **L2G Integrated Suite** | **v0.6.0** | Complete the v0.7.0 Practice Review design gate under issue #143; no implementation branch begins before its ADR, contract, UX, threat model, Workshop compatibility posture, and exact acceptance matrix merge |
| L2G Control Center | v0.3.4 | v0.4 read-only action/blocker and regression-overview synchronization remains eligible for a separately bounded issue; no downstream authority transfer |
| DocConverter-L2G | v7.9.5.1 | Preserve the exact runtime and registered McFirecoal v1.2.0 handshake baseline until a concrete extraction or package defect is demonstrated |
| L2G Scoper | v3.12 | Preserve the exact scope-context and scope-return behavior; no v3.13 or retirement work is authorized by the Integrated Suite roadmap |
| CMMC L2 Gap Workshop Tool | v79.1 | Preserve current standalone and registered-route behavior while the v0.7 Practice Review design gate defines compatibility; no retirement or contract-breaking change is authorized |
| L2G Builder/Merger | v3.10.1 | Preserve the promoted governance-preservation and Word-QA behavior; v3.9 remains reserved for Advisor and Client Delivery Profiles |
| CMMC L2 SSP Modern Editable | v1.9.17 | Preserve the promoted RG-4 Word-QA consumer behavior, working-data schema v1.9.11, and exactly 110 requirements |

## Integrated Suite baseline

L2G Integrated Suite v0.6.0 Scope Vertical Slice was promoted by PR #142 and merged at `3cfa31e8e5100927ca1a96221e5af715108eddd6`.

- fully validated final metadata head: `6e33079575e3ecc0b5d3043ba9b0d440e858b2e8`
- frozen validated candidate head: `24b326620d3cb7d8f49d266299b9aa0116c4e4fe`
- portable artifact: `L2G_Integrated_Suite_Scope_v0.6.0.html`
- portable HTML SHA-256: `1a06f10d874d0873b8add9cb398f980651ad605367d5fcf3dd354ce948220a46`
- release ZIP SHA-256: `164d8fa1431bad3836819beca084476f15f2805f01880eb0e61a0715de48c56a`
- project kind: `l2g_project_v1`
- encrypted envelope: `l2g_encrypted_project_v1` version `1.0`
- Engagement schema: `l2g_engagement_v1` version `1.0`
- Evidence schema/projection: `l2g_evidence_index_v1` / `l2g_evidence_projection_v1` version `1.0`
- Pre-Engagement schema/projection: `l2g_pre_engagement_v1` / `l2g_pre_engagement_projection_v1` version `1.0`
- Interview schema/projection: `l2g_interview_sessions_v1` / `l2g_interview_projection_v1` version `1.0`
- Scope schema/projection: `l2g_scope_v1` / `l2g_scope_projection_v1` version `1.0`
- normal runtime dependencies: zero
- runtime model: local, offline, no install, no telemetry, no runtime network
- current data boundary: synthetic-only; not authorized for production, client, FCI, or CUI data
- current pointer: `apps/integrated-suite/current_release.json`
- validation report: `apps/integrated-suite-v0.6/release/VALIDATION_REPORT_v0.6.0.md`
- rolling roadmap: `docs/integrated-suite/L2G_Integrated_Suite_Rolling_10_Release_Roadmap_v1.md`
- next design gate: issue #143, v0.7.0 Practice Review Vertical Slice

The current Integrated Suite provides the shared shell and eight workflow workspaces; Advisor, Client, and Reviewer presentation profiles; encrypted portable projects and encrypted browser recovery; command history, Undo/Redo, named checkpoints, and lock/unlock; canonical Engagement identity and planning records; canonical reference-only Evidence source identity, fingerprints, relink, revisions, duplicate disposition, source locations, bounded derived records, target-owned candidates, profile-filtered transient search, and stable-package adapters; canonical Pre-Engagement requests, versioned instruments, immutable assignment snapshots, submissions, typed responses, response-origin attribution, exceptions, factual completeness, imports, and proposals; canonical Interview question versions, frozen plans, one-active-session lifecycle, live Interview Mode, participant statements, Advisor-only notes, exact-version locally asserted confirmations, summaries, follow-ups, imports, and proposals; and canonical Scope boundaries, systems, assets, providers, services, locations, enclaves, data flows, assumptions, unknowns, dependencies, diagrams, exact-version decisions, imports, projections, and factual next work.

Scope objects describe the environment. Scope-owned accepted decisions establish accepted category, disposition, boundary relationship, implementation location, responsibility, flow treatment, and approved diagram-representation state. Engagement, Evidence, Pre-Engagement, Interview Sessions, and compatibility packages may publish candidates but cannot directly mutate accepted Scope state. Same-name records never establish identity automatically. Changed exact record versions can make decisions or diagrams stale without deleting the historical representation.

v0.6 preserves L2G Scoper v3.12 and the frozen `l2g_scope_context_v1` and `l2g_scope_return_package_v1` version `1.0` routes. Scoper content previews before mutation, ambiguity requires explicit treatment, reviewed apply is atomic, and imported records remain low-authority candidate material. Earlier encrypted projects migrate into an intentionally empty Scope domain with a named checkpoint and no inferred boundary objects, decisions, diagrams, categories, dispositions, responsibilities, flow treatments, or conclusions.

Client projections are constructed before counting, search, rendering, inspector creation, focus restoration, live-region announcements, diagram alternatives, and accessibility-tree construction. Raw Advisor notes and analysis remain Advisor-only. Presentation profiles are not security roles or safe client-distribution artifacts.

## v0.7 Practice Review design gate

Issue #143 defines the next bounded authority boundary. It authorizes design and planning only for canonical Practice Review records, facilitated sessions, claims, evidence-review context, observations, unresolved questions, gaps, recommendations, actions, blockers, provider/responsibility discussion, provider follow-up, Workshop v79.1 compatibility, target-owned candidate publication, profile-safe projections, migration, recovery, and exact acceptance testing.

Before implementation, v0.7 requires:

- a Practice Review ADR and field-level domain/projection contract;
- a focused advisor-centered UX/usability record for preparation, one-at-a-time facilitation, evidence review, pause/resume, and post-session review;
- explicit authority distinctions among requirement text, participant/client claims, imported Workshop context, referenced Evidence, Advisor observations, factual evidence-review state, gaps, recommendations, actions, blockers, provider context, and any human-recorded review position;
- profile/non-disclosure rules constructed before counts, search, render, inspector, history, focus, live regions, export, or accessibility work;
- a frozen Workshop v79.1 compatibility posture with strict preview/apply/return and no-partial-mutation requirements;
- a threat model and exact synthetic acceptance matrix;
- explicit exclusions for automatic or hidden Met/Not Met, readiness, compliance, risk, scoring, certification, evidence-sufficiency, implementation-effectiveness, or assessment conclusions.

No v0.7 implementation branch may begin until those design records are reviewed and merged. The v0.6 Scope UX helper review may inform shared-shell, inspector, responsive, disclosure, and accessibility refinements, but it does not replace the focused Practice Review workflow review.

Original evidence remains outside the `.l2g` project. SHA-256 establishes byte equality only, browser file associations remain session-only, changed bytes create new source revisions, and imported, intake, interview, Scope, or generated information cannot silently mutate another domain. Existing standalone module releases remain authoritative and independently distributable throughout migration.

No current release or planned design authorizes production, client, FCI, or CUI data or establishes readiness, compliance, formal assessment, certification, scoring, risk, evidence sufficiency, implementation, automatic boundary determination, automatic applicability, or Met/Not Met conclusions.

## Current contract and suite baseline

Workbook Handoff contract release 1.7 remains encoded as wire package version 1.0. Workbook Merge remains frozen at version 1.1. The optional governance-preservation assertion is valid only at `workbook_source.workshop_governance_preservation_v1`; the top-level property remains invalid. Missing governed values remain missing: Workshop v79.1 does not infer `candidate_id` from `ownership_record_id`.

Workshop v79.1, Builder/Merger v3.10.1, and SSP v1.9.17 passed the completed issue #101 RG-4 validation sequence. The validated `l2g_ssp_word_qa_sidecar_v1` version 1.0 route is registered, and the authoritative additive exact-suite snapshot remains `suite-2026.08.03-rg4-validated-mcfirecoal-v1.2.0`.

The prior exact-version technical regression snapshot `suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0` remains immutable at SHA-256 `c47fcdd8e8ac82d5d13d1e588ea48955415b7cc91485eb2925a994394c8356d6`. RG-4 and Integrated Suite validation make no readiness, compliance, assessment, certification, scoring, technical-accuracy, evidence-sufficiency, authenticated-identity, digital-signature, client-approval, or client-release conclusion.

## Repository layout

- `apps/integrated-suite/` — Integrated Suite current pointer and shared release governance
- `apps/integrated-suite-v0.1/` through `apps/integrated-suite-v0.6/` — additive versioned Integrated Suite source, schemas, build tooling, release packages, and validation evidence
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
