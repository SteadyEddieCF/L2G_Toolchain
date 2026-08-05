# L2G Integrated Suite Planning

This directory contains the durable architecture, migration, UX-governance, project-format, domain-contract, risk, threat-model, release-roadmap, security, compatibility, and acceptance records for the next-generation L2G Integrated Suite.

## Status

- L2G Integrated Suite v0.6.0 Scope Vertical Slice is current, promoted by PR #142 and merged at `3cfa31e8e5100927ca1a96221e5af715108eddd6`.
- Its fully validated final metadata head is `6e33079575e3ecc0b5d3043ba9b0d440e858b2e8`.
- Its frozen validated candidate head is `24b326620d3cb7d8f49d266299b9aa0116c4e4fe`.
- Its portable HTML SHA-256 is `1a06f10d874d0873b8add9cb398f980651ad605367d5fcf3dd354ce948220a46`.
- Milestone 0 issue #117 and release issues #123, #126, #130, #133, and #139 are closed completed.
- v0.7.0 Practice Review design is governed by issue #143.
- Issue #143 authorizes design and planning only. No v0.7 implementation branch begins until the ADR, field-level contract, focused UX/usability record, profile/non-disclosure rules, Workshop compatibility posture, threat model, and exact acceptance matrix are reviewed and merged.
- The current release and planned v0.7 design remain synthetic-only and do not authorize production, client, FCI, or CUI data.
- No authoritative Practice Review, SSP, Deliverables, or curated Client-export migration is authorized beyond the promoted Engagement, Evidence, Pre-Engagement, Interview Sessions, and Scope authorities.
- DocConverter-L2G remains the authoritative standalone intake-file ingestion, extraction, normalization, Exception & Trust Queue, and provenance tool; stable package contracts remain unchanged compatibility inputs.
- L2G Scoper v3.12 remains independently distributable. Its runtime, storage key, scope-context/scope-return package versions, draft guardrails, and zero-practice behavior remain frozen unless a separately approved issue changes them.
- CMMC L2 Gap Workshop Tool v79.1 remains independently distributable and authoritative for its current standalone facilitated-review workflow while issue #143 designs Practice Review compatibility.
- Original evidence remains outside the `.l2g` project by default. Reference metadata, hashes, bounded derived summaries, source locations, provenance, and candidates are stored only under reviewed encrypted-project limits.

## Current authority map

- **Engagement** owns canonical engagement identity, participants, organizations, and planning records.
- **Evidence** owns source identity, fingerprints, provenance, source relationships, reference-only evidence context, and Evidence-origin candidates.
- **Pre-Engagement** owns intake requests, instruments, immutable assignment snapshots, submissions, responses, response-origin attribution, intake exceptions, factual completeness, imports, and Pre-Engagement-origin candidates.
- **Interview Sessions** owns question/version records, frozen plans, sessions, participant statements, Advisor notes, confirmations, summaries, follow-ups, parking-lot items, imports, and Interview-origin candidates.
- **Scope** owns boundaries, systems, assets, providers, services, locations, enclaves, data flows, assumptions, unknowns, dependencies, diagrams, exact-version Scope decisions, Scope-owned candidates, imports, projections, and factual next work.
- **Practice Review** remains future authority under issue #143; Workshop, Evidence, Scope, Interview, and imported context may inform it but cannot silently create accepted review records or conclusions.

Scope objects describe the environment; current accepted Scope decisions establish accepted category, disposition, boundary relationship, implementation location, responsibility, flow treatment, and approved diagram-representation state. Asset category, Scope disposition, boundary relationship, implementation location, responsibility, lifecycle, operational state, review state, visibility, currency/integrity, and decision state remain separate dimensions.

Source-domain content may propose Scope records but cannot silently establish or change the authoritative boundary. Same-name records never auto-merge. Strict compatibility preview occurs before mutation, unresolved ambiguity blocks selected apply, and apply is atomic. Diagrams are exact-version governed representations rather than independent authority sources and become visibly stale when referenced records change.

Client-visible content is projected before counts, search, render, inspector, differences, history, focus restoration, live-region announcements, diagram text-alternative creation, and accessibility-tree construction. Raw Advisor notes/analysis, private diagnostics, rejected/returned candidates, hidden counts, and private participant metadata remain outside Client projections. Presentation profiles are not security roles or safe distribution artifacts.

## Baseline and reconciliation

The promoted sequence is:

- Builder/Merger v3.10.1 — PR #113, merge `d3cd223befb3aa1b53b2feea291b9f38b8d2645e`;
- Workshop v79.1 — PR #112, merge `e14ed000e490040182b529d7e2b3bc7155c03287`;
- merged-main RG-4 six-tool validation and registry/snapshot promotion — PR #118, merge `85d6e783a250b373cd4b9ea356e4c341336f9259`;
- architecture and migration planning — PR #116, merge `8fd6d14754e72a401aad85d70b64e150f1882ba2`;
- UX handoff and public-repository posture — PR #121;
- Integrated Suite Foundation v0.1.0 — PR #122, merge `711b84ebbf675a8e005dbfba80a8dfbd42213bc9`;
- v0.2 encrypted project safety — PRs #125 and #127;
- v0.3 Engagement Spine — PRs #128 and #129;
- v0.4 Evidence Catalog Core — PRs #131 and #132;
- v0.5 Pre-Engagement and Interview Sessions — issue #133, PR #137, merge `f0668fb3bf4bba2fc3574ce40e3c26dab413c93d`;
- v0.5 post-promotion reconciliation — PR #140, merge `e766cd36fdca067f7e3e551cbb9921f325a94d76`;
- v0.6 Scope design — issue #139 and PR #141, merge `97d5ebaf7d4b63b8c062e4c3e4a9e11f919e592e`;
- v0.6 Scope implementation and promotion — PR #142, merge `3cfa31e8e5100927ca1a96221e5af715108eddd6`;
- v0.7 Practice Review design — issue #143, open.

The authoritative current exact-suite snapshot remains `suite-2026.08.03-rg4-validated-mcfirecoal-v1.2.0`. The earlier `suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0` record remains immutable. Commit `85d6e783a250b373cd4b9ea356e4c341336f9259` remains the governed standalone product/runtime compatibility baseline.

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

### v0.6 Scope Vertical Slice

- `L2G_Scope_v1_Contract_v1.md`
- `L2G_Integrated_Suite_v0.6.0_Scope_Workbench_UX_v1.md`
- `L2G_Integrated_Suite_v0.6.0_Threat_Model_v1.md`
- `L2G_Integrated_Suite_v0.6.0_Scoper_Compatibility_v1.md`
- `L2G_Integrated_Suite_v0.6.0_Acceptance_v1.md`
- `apps/integrated-suite-v0.6/release/VALIDATION_REPORT_v0.6.0.md`

### v0.7 Practice Review design gate

Issue #143 requires these records before implementation:

- ADR-0012 for canonical Practice Review authority;
- a `l2g_practice_review_v1` and profile-safe projection field-level contract;
- a focused Practice Review UX/usability record;
- a Practice Review threat model;
- a Workshop v79.1 compatibility posture;
- an exact v0.7 acceptance matrix;
- reconciled planning and decision/risk records.

Exact file names and schema versions remain design decisions until the design PR is reviewed and merged.

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
17. Participant statements, Advisor notes, confirmations, summaries, candidates, Practice Review claims, observations, gaps, recommendations, and actions remain separate record types; none silently replaces another.
18. Raw Advisor content and approved Client-visible summaries are filtered before render, search, count, inspector, focus restoration, live-region announcements, export, and accessibility-tree construction.
19. Instruments, assignments, questions, session plans, Scope decisions, diagrams, and future Practice Review plans preserve immutable version/snapshot identity. Stale records require explicit review.
20. Pause/recovery preserves valid drafts and exact session position without creating a second active session or publishing/approving content.
21. Audio/video capture, automated transcription, AI-generated answers, automatic promotion, hidden scoring, and automatic assessment conclusions require separately approved scope and remain excluded.
22. Scope is a separate target-owned authority; Evidence, intake, Interview, imported, and generated context may propose but may not establish the authoritative boundary.
23. Scope objects describe the environment; accepted Scope decisions establish accepted authority fields and retain exact affected/source/dependency versions.
24. A diagram is a versioned representation of governed records, never an independent authority source; stale references remain explicit.
25. Same-name or approximately similar imported records never auto-merge. Preview, explicit treatment, atomic apply, receipt, and no-partial-mutation remain mandatory.
26. Practice Review must distinguish requirement text, claims, imported context, referenced Evidence, Advisor observations, factual review state, gaps, recommendations, actions, blockers, provider context, and human decisions.
27. Workshop v79.1 and frozen registered routes remain independently distributable until a separately reviewed compatibility or retirement decision.
