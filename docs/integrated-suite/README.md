# L2G Integrated Suite Planning

This directory contains the durable architecture, migration, UX-governance, project-format, domain-contract, risk, threat-model, release-roadmap, security, and acceptance records for the next-generation L2G Integrated Suite.

## Status

- L2G Integrated Suite v0.5.0 Pre-Engagement and Interview Sessions is current, promoted by PR #137 and merged at `f0668fb3bf4bba2fc3574ce40e3c26dab413c93d`.
- Its final validated head is `43f3d3709a0e7c030ec44f4667f1a1bd4d54e42e`.
- Its portable HTML SHA-256 is `03838726fabb81e43a1e567f8c72680513b5e3d95609f656a6301b906963b1f3`.
- Milestone 0 issue #117, v0.2 issue #123, v0.3 issue #126, v0.4 issue #130, and v0.5 issue #133 are closed completed.
- v0.6.0 Scope Vertical Slice design is governed by issue #139 and draft PR #141.
- PR #141 contains ADR-0011, the Scope field contract, Scope workbench UX record, threat model, Scoper compatibility posture, exact acceptance matrix, and reconciled governance records.
- Issue #139 and PR #141 authorize design and planning only. No v0.6 implementation begins until the complete design package is reviewed and merged.
- The current release and proposed v0.6 design remain synthetic-only and do not authorize production, client, FCI, or CUI data.
- No authoritative Scope implementation, Practice Review, SSP, or Deliverables migration is authorized beyond the promoted Engagement, Evidence, Pre-Engagement, and Interview authorities.
- DocConverter-L2G remains the authoritative standalone intake-file ingestion, extraction, normalization, Exception & Trust Queue, and provenance tool; stable package contracts remain unchanged compatibility inputs.
- L2G Scoper v3.12 remains the authoritative independently distributable standalone scoping application. PR #141 freezes its runtime, storage key, scope-context/scope-return package versions, draft guardrails, and zero-practice behavior.
- Original evidence remains outside the `.l2g` project by default. Reference metadata, hashes, bounded derived summaries, source locations, provenance, and candidates are stored only under reviewed encrypted-project limits.
- Engagement owns canonical engagement identity, participants, organizations, and planning records.
- Evidence owns source identity, fingerprints, provenance, source relationships, and Evidence-origin candidates.
- Pre-Engagement owns intake requests, instruments, immutable assignment snapshots, submissions, responses, response-origin attribution, intake exceptions, factual completeness, imports, and Pre-Engagement-origin candidates.
- Interview Sessions owns question/version records, frozen plans, sessions, participant statements, Advisor notes, confirmations, summaries, follow-ups, parking-lot items, imports, and Interview-origin candidates.
- The proposed Scope authority owns boundaries, systems, assets, providers, services, locations, enclaves, data flows, assumptions, unknowns, dependencies, diagrams, Scope decisions, Scope-owned candidates, imports, projections, and factual next work.
- Source-domain content may propose Scope records but cannot silently establish or change the authoritative boundary.
- Objects describe the environment; current accepted Scope decisions establish accepted category, disposition, boundary relationship, implementation location, responsibility, flow treatment, and approved diagram-representation state.
- Asset category, Scope disposition, boundary relationship, implementation location, responsibility, lifecycle, operational state, review state, visibility, currency/integrity, and decision state remain separate dimensions.
- Diagrams are exact-version governed representations and not independent authority sources. They become stale when referenced objects or decisions change.
- Unknowns and Scoper pre-workshop questions may publish candidates to Interview/Practice Review Session Planner but never enter a live agenda automatically.
- Client-visible content is projected before counts, search, render, inspector, differences, history, focus restoration, live-region announcements, diagram text-alternative creation, and accessibility-tree construction.
- Raw Advisor notes/analysis, private source diagnostics, rejected/returned candidates, hidden counts, and private participant metadata remain outside Client projections.
- A Client confirmation remains a locally recorded facilitation event bound to an exact record version; it is not authenticated identity, an electronic signature, client approval of the full engagement, or an assessment conclusion.
- Strict compatibility preview occurs before mutation. Same-name records never auto-merge, unresolved ambiguity blocks selected apply, and apply is atomic.
- The existing standalone tools remain authoritative and independently distributable during migration.
- The Integrated Suite evolves inside this monorepo unless a demonstrated technical constraint requires otherwise.
- The repository is intentionally public, but all source, fixtures, Issues, pull requests, screenshots, logs, Actions artifacts, Releases, and test packages must remain free of client data, FCI, CUI, secrets, private local paths, client-identifying content, and proprietary unlicensed material.

## Baseline and reconciliation

The promoted and planned sequence is:

- Builder/Merger v3.10.1 — PR #113, merge commit `d3cd223befb3aa1b53b2feea291b9f38b8d2645e`;
- Workshop v79.1 — PR #112, merge commit `e14ed000e490040182b529d7e2b3bc7155c03287`;
- corrected merged-main RG-4 six-tool validation and registry/snapshot promotion — PR #118, merge commit `85d6e783a250b373cd4b9ea356e4c341336f9259`;
- architecture and migration planning — PR #116, merge commit `8fd6d14754e72a401aad85d70b64e150f1882ba2`;
- UX handoff and public-repository posture — PR #121;
- Integrated Suite Foundation v0.1.0 — PR #122, merge commit `711b84ebbf675a8e005dbfba80a8dfbd42213bc9`;
- initial rolling roadmap and README reconciliation — PR #124, merge commit `f0b91a0ce211a7d20db8e71cdd08f709a8bcd987`;
- v0.2 security design — PR #125, merge commit `6b35e955e854d3ba5507a7a97f8f9bdaa1cdacec`;
- Integrated Suite v0.2.0 — PR #127, merge commit `72584f3a9fd8f82ea580cc29903e06678907d2f8`;
- v0.3 Engagement design package — PR #128, merge commit `c65fee2dd893e23a0adaf339c8efbc7a7f929dde`;
- Integrated Suite v0.3.0 — PR #129, merge commit `5cc028f78c683347081fbdd50b2e4773bb7ffd50`;
- v0.4 Evidence Catalog design — PR #131, merge commit `5011e83e855c29dc5a40ea97c81ae1892bff463b`;
- Integrated Suite v0.4.0 — PR #132, merge commit `fff6c801c101bad63455b83703f20e095308f6e7`;
- v0.5 Pre-Engagement and Interview Sessions design package — ADR-0010 and issue #133;
- Integrated Suite v0.5.0 — PR #137, merge commit `f0668fb3bf4bba2fc3574ce40e3c26dab413c93d`;
- v0.5 post-promotion reconciliation — PR #140, merge commit `e766cd36fdca067f7e3e551cbb9921f325a94d76`;
- v0.6 Scope Vertical Slice design review — issue #139 and PR #141.

The authoritative current exact-suite snapshot remains `suite-2026.08.03-rg4-validated-mcfirecoal-v1.2.0`. The earlier `suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0` record remains immutable.

Commit `85d6e783a250b373cd4b9ea356e4c341336f9259` remains the governed standalone product/runtime compatibility baseline. Integrated Suite implementation branches start from current `main` while preserving that exact baseline identity.

## Documents

### Foundational planning

- `L2G_Integrated_Suite_Architecture_and_Migration_Assessment_v1.md`
- `L2G_Integrated_Suite_Feature_Inventory_Template_v1.csv`
- `L2G_Project_v1_Conceptual_Contract_v1.md`
- `L2G_Integrated_Suite_UX_Information_Architecture_v1.md`
- `L2G_Integrated_Suite_UX_Handoff_Reconciliation_v1.md`
- `L2G_Integrated_Suite_Decision_Risk_Register_v1.md`
- `L2G_Integrated_Suite_Milestone_0_Acceptance_v1.md`
- `L2G_Integrated_Suite_Rolling_10_Release_Roadmap_v1.md`

### v0.2 encrypted project safety

- `L2G_Integrated_Suite_v0.2.0_Threat_Model_v1.md`
- `L2G_Integrated_Suite_v0.2.0_Acceptance_v1.md`

### v0.3 Engagement Spine

- `L2G_Engagement_v1_Contract_v1.md`
- `L2G_Integrated_Suite_v0.3.0_Engagement_Spine_UX_v1.md`
- `L2G_Integrated_Suite_v0.3.0_Threat_Model_v1.md`
- `L2G_Integrated_Suite_v0.3.0_Acceptance_v1.md`

### v0.4 Evidence Catalog Core

- `L2G_Evidence_Index_v1_Contract_v1.md`
- `L2G_Integrated_Suite_v0.4.0_Evidence_Catalog_UX_v1.md`
- `L2G_Integrated_Suite_v0.4.0_Threat_Model_v1.md`
- `L2G_Integrated_Suite_v0.4.0_Acceptance_v1.md`

### v0.5 Pre-Engagement and Interview Sessions

- `L2G_Pre_Engagement_v1_Contract_v1.md`
- `L2G_Interview_Sessions_v1_Contract_v1.md`
- `L2G_Integrated_Suite_v0.5.0_Pre_Engagement_Interview_UX_v1.md`
- `L2G_Integrated_Suite_v0.5.0_Threat_Model_v1.md`
- `L2G_Integrated_Suite_v0.5.0_Acceptance_v1.md`
- `apps/integrated-suite-v0.5/release/VALIDATION_REPORT_v0.5.0.md`

### v0.6 Scope Vertical Slice design gate

- `L2G_Scope_v1_Contract_v1.md`
- `L2G_Integrated_Suite_v0.6.0_Scope_Workbench_UX_v1.md`
- `L2G_Integrated_Suite_v0.6.0_Threat_Model_v1.md`
- `L2G_Integrated_Suite_v0.6.0_Scoper_Compatibility_v1.md`
- `L2G_Integrated_Suite_v0.6.0_Acceptance_v1.md`

These records become implementation authority only after PR #141 is reviewed and merged. They do not add runtime code, schema JSON, migration code, release packaging, a current-pointer update, a stable package change, or production-data authorization.

## Architecture decisions

- `docs/architecture/adr/ADR-0001-integrated-suite-modular-monolith.md`
- `docs/architecture/adr/ADR-0002-l2g-project-container.md`
- `docs/architecture/adr/ADR-0003-ui-framework-and-spfx-host-boundary.md`
- `docs/architecture/adr/ADR-0004-portable-browser-support.md`
- `docs/architecture/adr/ADR-0005-project-encryption-posture.md`
- `docs/architecture/adr/ADR-0006-project-persistence-history-and-recovery.md`
- `docs/architecture/adr/ADR-0007-encrypted-project-envelope-and-recovery.md`
- `docs/architecture/adr/ADR-0008-engagement-spine.md`
- `docs/architecture/adr/ADR-0009-evidence-catalog-core.md`
- `docs/architecture/adr/ADR-0010-pre-engagement-and-interview-sessions.md`
- `docs/architecture/adr/ADR-0011-canonical-scope-authority.md`

## Governing principles

1. One deployable application does not mean one tangled codebase.
2. Domain owners retain authority over their records.
3. Cross-workspace visibility is automatic; authority transfer is explicit and reviewable.
4. Legacy contracts remain supported until separately retired.
5. The normal portable runtime remains local, offline, no-install, no-telemetry, and free of runtime network dependencies.
6. No unsupported readiness, compliance, scoring, certification, risk, implementation, Met/Not Met, or evidence-sufficiency conclusions are introduced.
7. Architecture, UX, security, domain-contract, and release decisions must be persisted in the repository rather than existing only in chat history.
8. Public repository visibility never authorizes client, FCI, CUI, secret, private-path, or proprietary engagement content in repository-controlled surfaces.
9. Encryption is necessary but not sufficient for production-data authorization.
10. Cross-domain projections are read-only; imported metadata and source statements remain candidate material until explicitly reviewed.
11. A SHA-256 match establishes byte equality only; it does not establish authenticity, relevance, currency, or sufficiency.
12. Browser source-file associations are session-only and never portable project state.
13. Changed source bytes create new revision identities rather than silently replacing prior Evidence records.
14. Search indexes are transient and built only after profile filtering.
15. Original evidence remains reference-only unless a later security and size decision explicitly approves embedding.
16. Intake responses and Interview statements preserve origin, exact source/version, asserted participant/profile, and provenance.
17. Participant statements, Advisor notes, confirmations, summaries, and candidates are separate records; none silently replaces another.
18. Raw Advisor notes and approved Client-visible summaries are filtered before render, search, count, inspector, focus restoration, live-region announcements, and accessibility-tree construction.
19. Instruments, assignments, questions, and session plans preserve immutable version/snapshot identity. Stale plans require explicit review.
20. Pause/recovery preserves valid drafts and exact session position without creating a second active session or publishing/approving content.
21. Audio/video capture, automated transcription, AI-generated answers, automatic question promotion, hidden scoring, and automatic assessment conclusions require separately approved scope and remain excluded.
22. Scope is a separate target-owned authority; Evidence, intake, Interview, imported, and generated context may propose but may not establish the authoritative boundary.
23. Scope objects describe the environment; accepted Scope decisions establish accepted authority fields and retain exact affected/source/dependency versions.
24. Asset category, Scope disposition, relationship, implementation location, responsibility, lifecycle, review, visibility, currency, and decision state remain separate dimensions.
25. A diagram is a versioned representation of governed records, never an independent authority source; stale references remain explicit.
26. Same-name or approximately similar imported records never auto-merge. Preview, explicit treatment, atomic apply, receipt, and no-partial-mutation remain mandatory.
27. Client Scope projections and diagram alternatives are built before any derived UI work and contain no hidden Advisor content, hidden counts, or stale cached state.
28. L2G Scoper v3.12 and frozen scope package contracts remain independently distributable until a separately reviewed retirement or compatibility decision.
