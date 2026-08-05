# L2G Integrated Suite — Rolling Ten-Release Roadmap

## Purpose

This roadmap records the current Integrated Suite release and the bounded sequence through the first stable integrated release and its initial maintenance release. It is a planning and release-governance record, not authorization to bypass issue-level scope, architecture/security review, acceptance matrices, exact-head CI, human review at authority boundaries, or separate production-data approval.

## Current baseline

- repository: `SteadyEddieCF/L2G_Toolchain`
- current Integrated Suite release: `0.5.0`
- current working title: **Pre-Engagement and Interview Sessions**
- promotion PR: #137
- merge commit: `f0668fb3bf4bba2fc3574ce40e3c26dab413c93d`
- final validated head: `43f3d3709a0e7c030ec44f4667f1a1bd4d54e42e`
- portable artifact: `L2G_Integrated_Suite_Pre_Engagement_Interview_v0.5.0.html`
- portable HTML SHA-256: `03838726fabb81e43a1e567f8c72680513b5e3d95609f656a6301b906963b1f3`
- project kind: `l2g_project_v1`
- encrypted envelope: `l2g_encrypted_project_v1` version `1.0`
- Engagement schema: `l2g_engagement_v1` version `1.0`
- Evidence schema/projection: `l2g_evidence_index_v1` / `l2g_evidence_projection_v1` version `1.0`
- Pre-Engagement schema/projection: `l2g_pre_engagement_v1` / `l2g_pre_engagement_projection_v1` version `1.0`
- Interview schema/projection: `l2g_interview_sessions_v1` / `l2g_interview_projection_v1` version `1.0`
- runtime model: local, offline, no install, no telemetry, no runtime network
- current data authorization: synthetic-only; not authorized for production, client, FCI, or CUI content
- current standalone module releases remain authoritative and independently distributable
- governed standalone product/runtime compatibility baseline: `85d6e783a250b373cd4b9ea356e4c341336f9259`
- next bounded release: v0.6.0 issue #139, Scope Vertical Slice
- active design review: PR #141
- v0.6 implementation authority begins only after PR #141 passes the design gate and merges

## Promoted release history

| Release | Working title | Promotion | Portable HTML SHA-256 | Boundary |
|---|---|---|---|---|
| **v0.1.0** | Foundation | PR #122; merge `711b84ebbf675a8e005dbfba80a8dfbd42213bc9` | `67a69e026d789901dcfe0bf8aecb574d1ae5a9647b225db18099f5cb43e89e15` | Synthetic shell and project foundation; no substantive module migration |
| **v0.2.0** | Encrypted Project Safety Foundation | PR #127; merge `72584f3a9fd8f82ea580cc29903e06678907d2f8` | `84526756161fa44bc2dcaebe791a2ea1b73c06341c7563e34693aa6b7231af86` | Encrypted project/recovery foundation; no production-data authorization |
| **v0.3.0** | Engagement Spine | PR #129; merge `5cc028f78c683347081fbdd50b2e4773bb7ffd50` | `d4fe85feddf08b0e069546c04b40f3bb6e063da8fdba485b047beb879e847c2a` | Canonical Engagement authority; no Evidence/Scope/Practice/SSP/Deliverables migration |
| **v0.4.0** | Evidence Catalog Core | PR #132; merge `fff6c801c101bad63455b83703f20e095308f6e7` | `60c1fe78ecf1ce19fcca696f93f043aa26be3515a7bb1f3d07c3708fae8e4f09` | Canonical reference-only Evidence authority; originals remain external; no Scope/Practice/SSP or sufficiency conclusion |
| **v0.5.0** | Pre-Engagement and Interview Sessions | PR #137; merge `f0668fb3bf4bba2fc3574ce40e3c26dab413c93d` | `03838726fabb81e43a1e567f8c72680513b5e3d95609f656a6301b906963b1f3` | Canonical intake and Interview authorities; statements, notes, confirmations, summaries, and candidates remain separate; no Scope/Practice conclusion |

## Rolling ten-release sequence

| Sequence | Release | Working title | Primary outcome | Authority and safety boundary | Status |
|---:|---|---|---|---|---|
| 1 | **v0.5.0** | Pre-Engagement and Interview Sessions | Intake requests, instruments, immutable assignments, submissions/responses, meeting/session records, Interview Mode, questions, statements, Advisor notes, confirmations, summaries, follow-ups, compatibility previews, and candidate outputs | Pre-Engagement and Interview Sessions are separate authorities; outputs remain candidates until owning domains explicitly accept them | **Current — merged by PR #137** |
| 2 | **v0.6.0** | Scope Vertical Slice | Authoritative boundary, systems, assets, providers, services, locations, enclaves, data flows, assumptions, unknowns, dependencies, decisions, diagrams, and legacy Scoper compatibility | Scope owns authoritative Scope records; Engagement, Evidence, intake, Interview, imported, and generated sources may propose but not directly mutate Scope | **Design review — issue #139 / PR #141** |
| 3 | **v0.7.0** | Practice Review Vertical Slice | Facilitated practice review, evidence requests, gaps, recommendations, actions, blockers, responsibility discussion, provider follow-up, and Workshop compatibility | Practice Review owns facilitated conclusions; no automated Met/Not Met, readiness, compliance, or certification claim | Planned |
| 4 | **v0.8.0** | SSP Vertical Slice | Governed SSP narratives, inheritance, baselines, conflicts, Needs Attention, review history, and SSP handoff/return compatibility | SSP owns governed SSP content; linked inputs cannot silently overwrite narratives | Planned |
| 5 | **v0.9.0** | Deliverables Vertical Slice | Deterministic workbook/document/presentation assembly, reconciliation, profiles, packaging, manifests, hashes, and output QA | Deliverables render accepted governed records and do not create new assessment conclusions | Planned |
| 6 | **v1.0.0-beta.1** | Integrated Engagement Beta | One normal portable HTML, one encrypted project, end-to-end synthetic workflow, complete authority transitions, and full regression package | Standalone tools remain available; pilot authorization requires separate approval | Planned |
| 7 | **v1.0.0-beta.2** | Pilot Hardening and Curated Client Export | Approved non-CUI pilot controls where separately authorized, performance/scale hardening, curated Client-safe export, upgrade/rollback rehearsal, and support evidence | Client export contains approved projections only; pilot data class and participants require separate governance | Planned |
| 8 | **v1.0.0-rc.1** | Release Candidate and Retirement Readiness | Installation-free release candidate, migration/support documentation, recovery exercises, operational acceptance, and evidence-based standalone retirement recommendations | Standalone retirement remains a separate explicit decision; production/CUI posture requires approved security and operating controls | Planned |
| 9 | **v1.0.0** | Stable Integrated Suite | Stable portable release, governed upgrade path, support package, complete synthetic reference workflow, and documented operating boundaries | General availability of the software does not itself authorize client, FCI, CUI, or production use; those remain separately governed | Planned |
| 10 | **v1.0.1** | Stable Maintenance and Compatibility Hardening | Bounded defect correction, upgrade/recovery hardening, supported-platform compatibility evidence, accessibility correction, and documentation/support refinement | Maintenance does not expand authority, data authorization, assessment conclusions, or standalone retirement without separate reviewed scope | Planned horizon placeholder |

## v0.6.0 design package

Issue #139 and draft PR #141 contain the complete proposed design gate:

- `docs/architecture/adr/ADR-0011-canonical-scope-authority.md`;
- `docs/integrated-suite/L2G_Scope_v1_Contract_v1.md`;
- `docs/integrated-suite/L2G_Integrated_Suite_v0.6.0_Scope_Workbench_UX_v1.md`;
- `docs/integrated-suite/L2G_Integrated_Suite_v0.6.0_Threat_Model_v1.md`;
- `docs/integrated-suite/L2G_Integrated_Suite_v0.6.0_Scoper_Compatibility_v1.md`;
- `docs/integrated-suite/L2G_Integrated_Suite_v0.6.0_Acceptance_v1.md`;
- reconciled root README, Integrated Suite planning README, decision/risk register, and rolling roadmap.

The proposed design makes these bounded decisions:

1. Scope becomes one separate canonical authority at `domains/scope.json`, schema `l2g_scope_v1` version `1.0`, with `l2g_scope_projection_v1` version `1.0`.
2. Scope owns boundaries, systems, assets, providers, services, locations, enclaves, data flows, assumptions, unknowns, dependencies, diagrams, decisions, candidates, imports, projections, and factual next work.
3. Objects describe the environment. A current accepted Scope decision is required to establish accepted category, disposition, boundary relationship, implementation location, responsibility, flow treatment, and diagram representation approval.
4. Asset category, Scope disposition, boundary relationship, implementation location, responsibility, lifecycle, operational state, review state, visibility, currency/integrity, and decision state remain separate dimensions.
5. Proposed disposition, Advisor analysis, participant or Client statement, exact-version locally asserted confirmation, Reviewer disposition, accepted Scope decision, and supersession remain distinguishable records or references.
6. Source/affected/dependency version drift makes decisions stale. It does not automatically reverse, rewrite, or reaccept them.
7. Source domains publish candidates through their own commands. Scope creates and decides target-owned candidates without mutating accepted source-domain content.
8. L2G Scoper v3.12 remains independently distributable. `l2g_scope_context_v1` and `l2g_scope_return_package_v1` version `1.0`, the browser storage key, draft guardrails, optional additive sections, idempotency behavior, and zero-practice route remain frozen.
9. Compatibility import performs strict package identity/integrity/traceability/path/limit validation and preview. Same-name records never auto-merge; explicit create/link/keep-separate/modify/reject treatment is required; apply is atomic.
10. Scoper pre-workshop questions become Interview/Practice Review Session Planner candidates, not a second Scope-owned question bank or automatic agenda content.
11. Scope uses compact views: Boundary, Systems & Assets, Providers & Services, Data Flows, Decisions, and Diagrams, with one consistent right inspector.
12. Diagrams are exact-version governed representations. Drawing/layout changes do not create or modify objects; referenced-version drift makes a diagram stale; Client text alternatives are generated from the Client-safe projection.
13. Client projection is constructed before counts, search, render, inspector, differences, history summaries, focus, live regions, diagram text alternatives, or accessibility-tree construction.
14. Opening a v0.5 project adds one empty Scope domain, a domain-index entry, a named checkpoint, and a history event. Migration infers no objects, decisions, diagrams, categories, dispositions, or conclusions.
15. The exact acceptance matrix requires candidate-head validation before release metadata and a complete unchanged-final-head rerun before promotion.
16. v0.6 remains synthetic-only and introduces no automatic boundary determination, automatic applicability, Practice Review findings, SSP narrative authority, Deliverables authority, readiness, compliance, risk, scoring, certification, evidence sufficiency, implementation, or Met/Not Met conclusion.

PR #141 changes only design and planning records. It does not add runtime code, schema JSON, migration code, current-pointer changes, release packaging, stable-contract changes, standalone-module changes, or implementation authorization.

## Release-wide acceptance pattern

Every release must have:

1. a separately bounded issue with included and excluded scope;
2. architecture/security/authority decisions recorded before implementation when the release changes a trust boundary;
3. an implementation branch from current `main` while preserving the exact prior promoted baseline;
4. deterministic source-controlled build inputs and locked build dependencies;
5. exact-head Linux and native Windows `file://` validation;
6. zero unexpected runtime network requests;
7. zero serious or critical axe-core findings on tested primary surfaces;
8. malformed, oversized, tampered, unsupported, and ambiguous input rejection before governed-state mutation;
9. complete current six-tool and registered-route non-regression;
10. durable release notes, SHA-256 identity, SBOM, validation report, current pointer, downloadable ZIP, and standalone HTML;
11. no client data, FCI, CUI, secrets, private paths, or proprietary unlicensed content in repository history or CI evidence;
12. explicit statement of what the release does not conclude or authorize;
13. exact candidate-head validation before promotion metadata and complete final-head rerun before merge.

## Migration rules

- Migrate one bounded vertical slice at a time; do not perform a wholesale rewrite.
- Preserve existing standalone releases, package contracts, snapshots, and validated behavior until explicit retirement approval.
- A source domain may publish candidates or read-only projections to another domain, but the target authority must explicitly accept or modify them.
- Cross-domain acceptance must retain source links, rationale, timestamps, history, and supersession state.
- Legacy JSON contracts remain supported through reviewed adapters until a separate compatibility-retirement decision.
- Original evidence remains reference-only by default. Embedding evidence requires a separately approved security and size model.
- A hash match proves byte equality only; it does not prove authenticity, relevance, currency, or sufficiency.
- Presentation profiles do not create access control or a safe Client distribution artifact. Client distribution requires curated export.
- Intake answers, Interview statements, Advisor notes, confirmations, summaries, Scope candidates, decisions, and diagrams must preserve record type, source, exact version, and provenance.
- A facilitator summary or generated diagram cannot silently replace the governed source records it represents.
- Imported meeting context is not direct participant testimony, and imported Scope context is not an accepted boundary decision.
- Same-name or approximately similar records do not establish identity.
- Paused-session recovery cannot create a second active session or duplicate captured drafts.
- No release may infer readiness, compliance, certification, evidence sufficiency, scoring, risk, implementation, or Met/Not Met without an explicitly approved domain rule and human decision.

## Rolling-roadmap maintenance

After each promoted release:

- mark the completed release and exact merge/artifact identity;
- move the current marker and add the next bounded release so the roadmap retains a current-plus-nine horizon;
- reconcile the root README, Integrated Suite planning README, current pointer, release notes, validation report, QA commands/catalog, decision/risk register, and related issues;
- preserve prior roadmap versions when a major strategy change requires an auditable planning fork;
- avoid treating roadmap placement as implementation approval.
