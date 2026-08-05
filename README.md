# L2G Toolchain

Monorepo for independently versioned, local/offline CMMC L2G modules, package contracts, cross-tool fixtures, suite snapshots, validation, portable-suite packaging, and the additive next-generation L2G Integrated Suite.

## Current supplied releases

| Product or module | Current supplied release | Next bounded action |
|---|---:|---|
| **L2G Integrated Suite** | **v0.5.0** | Review and merge the v0.6.0 Scope Vertical Slice design package under issue #139 and PR #141; no implementation begins before that design gate merges |
| L2G Control Center | v0.3.4 | v0.4 read-only action/blocker and regression-overview synchronization remains eligible for a separately bounded issue; no downstream authority transfer |
| DocConverter-L2G | v7.9.5.1 | Preserve the exact runtime and registered McFirecoal v1.2.0 handshake baseline until a concrete extraction or package defect is demonstrated |
| L2G Scoper | v3.12 | Preserve the exact scope-context and scope-return behavior while Integrated Scope is designed under issue #139 and PR #141; no v3.13 or retirement work is authorized |
| CMMC L2 Gap Workshop Tool | v79.1 | Preserve the promoted strict workbook-merge and SSP-route behavior; v80 Regression Delta remains a separately bounded workstream |
| L2G Builder/Merger | v3.10.1 | Preserve the promoted governance-preservation and Word-QA behavior; v3.9 remains reserved for Advisor and Client Delivery Profiles |
| CMMC L2 SSP Modern Editable | v1.9.17 | Preserve the promoted RG-4 Word-QA consumer behavior, working-data schema v1.9.11, and exactly 110 requirements |

## Integrated Suite baseline

L2G Integrated Suite v0.5.0 Pre-Engagement and Interview Sessions was promoted by PR #137 and merged at `f0668fb3bf4bba2fc3574ce40e3c26dab413c93d`.

- final validated head: `43f3d3709a0e7c030ec44f4667f1a1bd4d54e42e`
- portable artifact: `L2G_Integrated_Suite_Pre_Engagement_Interview_v0.5.0.html`
- portable HTML SHA-256: `03838726fabb81e43a1e567f8c72680513b5e3d95609f656a6301b906963b1f3`
- project kind: `l2g_project_v1`
- encrypted envelope: `l2g_encrypted_project_v1` version `1.0`
- Engagement schema: `l2g_engagement_v1` version `1.0`
- Evidence schema/projection: `l2g_evidence_index_v1` / `l2g_evidence_projection_v1` version `1.0`
- Pre-Engagement schema/projection: `l2g_pre_engagement_v1` / `l2g_pre_engagement_projection_v1` version `1.0`
- Interview schema/projection: `l2g_interview_sessions_v1` / `l2g_interview_projection_v1` version `1.0`
- normal runtime dependencies: zero
- runtime model: local, offline, no install, no telemetry, no runtime network
- current data boundary: synthetic-only; not authorized for production, client, FCI, or CUI data
- current pointer: `apps/integrated-suite/current_release.json`
- rolling roadmap: `docs/integrated-suite/L2G_Integrated_Suite_Rolling_10_Release_Roadmap_v1.md`
- next design gate: issue #139 and PR #141, v0.6.0 Scope Vertical Slice

The current Integrated Suite provides the shared shell and eight workflow workspaces; Advisor, Client, and Reviewer presentation profiles; encrypted portable projects and encrypted browser recovery; command history, Undo/Redo, named checkpoints, and lock/unlock; canonical Engagement identity and planning records; canonical reference-only Evidence source identity, fingerprints, relink, revisions, duplicate disposition, source locations, bounded derived records, target-owned candidates, profile-filtered transient search, and stable-package adapters; canonical Pre-Engagement requests, versioned instruments, immutable assignment snapshots, submissions, typed responses, response-origin attribution, exceptions, factual completeness, imports, and proposals; and canonical Interview question versions, frozen plans, one-active-session lifecycle, live Interview Mode, participant statements, Advisor-only notes, exact-version locally asserted confirmations, summaries, follow-ups, imports, and proposals.

v0.5 added strict preview-first compatibility handling for current intake, meeting-context, and scope-context packages. Intake content does not become a client-provided answer automatically. Imported meeting context remains imported context rather than direct participant testimony. Scope context may inform questions but does not create authoritative Scope records. Source proposals publish only into target-owned candidates, and accepted target content changes only through explicit target-domain commands.

Client projections are constructed before counting, search, rendering, inspector creation, focus restoration, live-region announcements, and accessibility-tree construction. Raw Advisor notes remain exactly Advisor-only. A locally asserted confirmation is bound to an exact statement or approved Client-summary version; it is not authenticated identity, an electronic signature, broad client approval, or an assessment conclusion.

## v0.6 Scope design gate

Issue #139 and draft PR #141 define the next bounded authority boundary. The design package contains:

- `docs/architecture/adr/ADR-0011-canonical-scope-authority.md`;
- `docs/integrated-suite/L2G_Scope_v1_Contract_v1.md`;
- `docs/integrated-suite/L2G_Integrated_Suite_v0.6.0_Scope_Workbench_UX_v1.md`;
- `docs/integrated-suite/L2G_Integrated_Suite_v0.6.0_Threat_Model_v1.md`;
- `docs/integrated-suite/L2G_Integrated_Suite_v0.6.0_Scoper_Compatibility_v1.md`;
- `docs/integrated-suite/L2G_Integrated_Suite_v0.6.0_Acceptance_v1.md`;
- a reconciled decision/risk register, planning README, root README, and rolling roadmap.

The proposed design adds one future Scope domain at `domains/scope.json`, schema `l2g_scope_v1` version `1.0`, with a profile-safe `l2g_scope_projection_v1` version `1.0`. Objects describe boundaries, systems, assets, providers, services, locations, enclaves, flows, assumptions, unknowns, dependencies, and diagrams; Scope-owned decisions establish accepted category, disposition, relationship, responsibility, flow treatment, and diagram-representation state. Source domains may publish candidates but may not directly mutate Scope.

Asset category, scope disposition, boundary relationship, implementation location, responsibility, lifecycle, operational state, review state, visibility, currency/integrity, and decision state remain separate dimensions. Diagrams are exact-version governed representations, not independent authority sources. Unknowns may publish question candidates to Session Planner but never enter a live agenda automatically. Client Scope projections must be constructed before counts, search, render, inspector, differences, history, focus, live-region, diagram text-alternative, or accessibility-tree work.

The design preserves L2G Scoper v3.12 as independently distributable and freezes `l2g_scope_context_v1` and `l2g_scope_return_package_v1` version `1.0`. Preview, explicit duplicate/ambiguity treatment, atomic reviewed apply, return, and optional compatibility export preserve draft guardrails and zero practice records. A v0.5 migration would add an empty Scope domain and infer no objects, decisions, diagrams, categories, dispositions, or conclusions.

PR #141 changes design and planning records only. It does not add runtime code, schema JSON, migration code, release packaging, a current-pointer change, a stable-contract change, standalone-module change, or implementation authorization.

Original evidence remains outside the `.l2g` project. SHA-256 establishes byte equality only, browser file associations remain session-only, changed bytes create new source revisions, and imported, intake, interview, or generated information cannot silently mutate another domain. Existing standalone module releases remain authoritative and independently distributable.

No current release or proposed design authorizes production, client, FCI, or CUI data or establishes readiness, compliance, assessment, certification, scoring, risk, evidence sufficiency, implementation, automatic boundary determination, automatic applicability, or Met/Not Met conclusions. Presentation profiles remain non-security modes and are not safe client-distribution artifacts.

## Current contract and suite baseline

Workbook Handoff contract release 1.7 remains encoded as wire package version 1.0. Workbook Merge remains frozen at version 1.1. The optional governance-preservation assertion is valid only at `workbook_source.workshop_governance_preservation_v1`; the top-level property remains invalid. Missing governed values remain missing: Workshop v79.1 does not infer `candidate_id` from `ownership_record_id`.

Workshop v79.1, Builder/Merger v3.10.1, and SSP v1.9.17 passed the completed issue #101 RG-4 validation sequence. The validated `l2g_ssp_word_qa_sidecar_v1` version 1.0 route is registered, and the authoritative additive exact-suite snapshot remains `suite-2026.08.03-rg4-validated-mcfirecoal-v1.2.0`.

The prior exact-version technical regression snapshot `suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0` remains immutable at SHA-256 `c47fcdd8e8ac82d5d13d1e588ea48955415b7cc91485eb2925a994394c8356d6`. RG-4 validation and Integrated Suite validation make no readiness, compliance, assessment, certification, scoring, technical-accuracy, evidence-sufficiency, authenticated-identity, digital-signature, client-approval, or client-release conclusion.

## Repository layout

- `apps/integrated-suite/` — Integrated Suite current pointer and shared release governance
- `apps/integrated-suite-v0.1/` through `apps/integrated-suite-v0.5/` — additive versioned Integrated Suite source, schemas, build tooling, release packages, and validation evidence
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
