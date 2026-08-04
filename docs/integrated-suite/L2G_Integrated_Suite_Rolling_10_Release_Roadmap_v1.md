# L2G Integrated Suite — Rolling Ten-Release Roadmap

## Purpose

This roadmap records the current Integrated Suite release and the bounded sequence through the first stable integrated release. It is a planning and release-governance record, not authorization to bypass issue-level scope, architecture/security review, acceptance matrices, exact-head CI, human review at authority boundaries, or separate production-data approval.

## Current baseline

- repository: `SteadyEddieCF/L2G_Toolchain`
- current Integrated Suite release: `0.4.0`
- current working title: **Evidence Catalog Core**
- promotion PR: #132
- merge commit: `fff6c801c101bad63455b83703f20e095308f6e7`
- final reviewed head: `f86002d53cdc144b01fa2fc537ca61e6207bf107`
- portable artifact: `L2G_Integrated_Suite_Evidence_Catalog_v0.4.0.html`
- portable HTML SHA-256: `60c1fe78ecf1ce19fcca696f93f043aa26be3515a7bb1f3d07c3708fae8e4f09`
- project kind: `l2g_project_v1`
- encrypted envelope: `l2g_encrypted_project_v1` version `1.0`
- Engagement schema: `l2g_engagement_v1` version `1.0`
- Evidence schema: `l2g_evidence_index_v1` version `1.0`
- Evidence projection: `l2g_evidence_projection_v1` version `1.0`
- runtime model: local, offline, no install, no telemetry, no runtime network
- current data authorization: synthetic-only; not authorized for production, client, FCI, or CUI content
- current standalone module releases remain authoritative and independently distributable
- governed standalone product/runtime compatibility baseline: `85d6e783a250b373cd4b9ea356e4c341336f9259`
- next bounded release: v0.5.0 issue #133, Pre-Engagement and Interview Sessions

## Promoted release history

| Release | Working title | Promotion | Portable HTML SHA-256 | Boundary |
|---|---|---|---|---|
| **v0.1.0** | Foundation | PR #122; merge `711b84ebbf675a8e005dbfba80a8dfbd42213bc9` | `67a69e026d789901dcfe0bf8aecb574d1ae5a9647b225db18099f5cb43e89e15` | Synthetic shell and project foundation; no substantive module migration |
| **v0.2.0** | Encrypted Project Safety Foundation | PR #127; merge `72584f3a9fd8f82ea580cc29903e06678907d2f8` | `84526756161fa44bc2dcaebe791a2ea1b73c06341c7563e34693aa6b7231af86` | Encrypted project/recovery foundation; no production-data authorization |
| **v0.3.0** | Engagement Spine | PR #129; merge `5cc028f78c683347081fbdd50b2e4773bb7ffd50` | `d4fe85feddf08b0e069546c04b40f3bb6e063da8fdba485b047beb879e847c2a` | Canonical Engagement authority; no Evidence/Scope/Practice/SSP/Deliverables migration |
| **v0.4.0** | Evidence Catalog Core | PR #132; merge `fff6c801c101bad63455b83703f20e095308f6e7` | `60c1fe78ecf1ce19fcca696f93f043aa26be3515a7bb1f3d07c3708fae8e4f09` | Canonical reference-only Evidence authority; originals remain external; no Scope/Practice/SSP or sufficiency conclusion |

## Rolling ten-release sequence

| Sequence | Release | Working title | Primary outcome | Authority and safety boundary | Status |
|---:|---|---|---|---|---|
| 1 | **v0.4.0** | Evidence Catalog Core | Reference-only source records, SHA-256 identity, relink, exact duplicates, revisions, source locations, bounded derived summaries, transient search, candidate mappings, and stable package adapters | Evidence owns source identity/provenance; originals remain external; no automatic Scope/Practice/SSP or sufficiency conclusions | **Current — merged by PR #132** |
| 2 | **v0.5.0** | Pre-Engagement and Interview Sessions | Intake requests, questionnaires, inventories, meeting/session records, Interview Mode, attendees, questions, responses, notes, follow-ups, and candidate outputs | Pre-Engagement and Interview records retain their authority; outputs remain candidates until owning domains explicitly accept them | **Design gate — issue #133** |
| 3 | **v0.6.0** | Scope Vertical Slice | Proposed boundary, systems, assets, providers, data flows, assumptions, decisions, diagrams, and legacy Scoper compatibility | Scope owns authoritative scope records; Evidence and interviews may propose but not directly mutate Scope | Planned |
| 4 | **v0.7.0** | Practice Review Vertical Slice | Facilitated practice review, evidence requests, gaps, recommendations, actions, blockers, responsibility discussion, provider follow-up, and Workshop compatibility | Practice Review owns facilitated conclusions; no automated Met/Not Met, readiness, compliance, or certification claim | Planned |
| 5 | **v0.8.0** | SSP Vertical Slice | Governed SSP narratives, inheritance, baselines, conflicts, Needs Attention, review history, and SSP handoff/return compatibility | SSP owns governed SSP content; linked inputs cannot silently overwrite narratives | Planned |
| 6 | **v0.9.0** | Deliverables Vertical Slice | Deterministic workbook/document/presentation assembly, reconciliation, profiles, packaging, manifests, hashes, and output QA | Deliverables render accepted governed records and do not create new assessment conclusions | Planned |
| 7 | **v1.0.0-beta.1** | Integrated Engagement Beta | One normal portable HTML, one encrypted project, end-to-end synthetic workflow, complete authority transitions, and full regression package | Standalone tools remain available; pilot authorization requires separate approval | Planned |
| 8 | **v1.0.0-beta.2** | Pilot Hardening and Curated Client Export | Approved non-CUI pilot controls where separately authorized, performance/scale hardening, curated client-safe export, upgrade/rollback rehearsal, and support evidence | Client export contains approved projections only; pilot data class and participants require separate governance | Planned |
| 9 | **v1.0.0-rc.1** | Release Candidate and Retirement Readiness | Installation-free release candidate, migration/support documentation, recovery exercises, operational acceptance, and evidence-based standalone retirement recommendations | Standalone retirement remains a separate explicit decision; production/CUI posture requires approved security and operating controls | Planned |
| 10 | **v1.0.0** | Stable Integrated Suite | Stable portable release, governed upgrade path, support package, complete synthetic reference workflow, and documented operating boundaries | General availability of the software does not itself authorize client, FCI, CUI, or production use; those remain separately governed | Planned |

## v0.5.0 design package

Issue #133 requires the following records to merge before implementation begins:

- an architecture decision for Pre-Engagement and Interview Session authority;
- field-level contracts for intake, questionnaire/inventory, question-plan, session, response/note, follow-up, and candidate records;
- an Interview Mode UX prototype/usability handoff reconciled against actual advisor workflows;
- profile-safe raw-note versus approved-client-summary presentation rules;
- compatibility-adapter rules for recognized meeting, intake, and questionnaire packages;
- a v0.5 threat model covering sensitive notes, interrupted sessions, stale question plans, misleading summaries, and accidental Client-view disclosure;
- an exact synthetic acceptance matrix covering preparation, facilitation, pause/resume, candidate publication, target non-mutation, migration, accessibility, and local `file://` operation.

The v0.5 design must preserve Engagement and Evidence authority, keep imported context low-authority until explicit review, distinguish direct participant statements from advisor observations and summaries, and exclude audio/video recording, automated transcription, AI-generated answers, scoring, and assessment conclusions.

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
- Presentation profiles do not create access control or a safe client distribution artifact. Client distribution requires curated export.
- Interview notes and responses must preserve statement type and provenance; summaries cannot silently replace raw source records.
- No release may infer readiness, compliance, certification, evidence sufficiency, scoring, risk, implementation, or Met/Not Met without an explicitly approved domain rule and human decision.

## Rolling-roadmap maintenance

After each promoted release:

- mark the completed release and exact merge/artifact identity;
- move the current marker and add the next bounded release so the roadmap retains a current-plus-nine horizon;
- reconcile the root README, Integrated Suite planning README, current pointer, release notes, validation report, QA commands/catalog, decision/risk register, and related issues;
- preserve prior roadmap versions when a major strategy change requires an auditable planning fork;
- avoid treating roadmap placement as implementation approval.
