# L2G Integrated Suite Planning

This directory contains the durable architecture, migration, UX-governance, project-format, domain-contract, risk, threat-model, release-roadmap, security, and acceptance records for the next-generation L2G Integrated Suite.

## Status

- L2G Integrated Suite v0.4.0 Evidence Catalog Core is current, merged by PR #132 at `fff6c801c101bad63455b83703f20e095308f6e7`.
- Its portable HTML SHA-256 is `60c1fe78ecf1ce19fcca696f93f043aa26be3515a7bb1f3d07c3708fae8e4f09`.
- Milestone 0 issue #117, v0.2 issue #123, v0.3 issue #126, and v0.4 issue #130 are closed completed.
- v0.5.0 Pre-Engagement and Interview Sessions is governed by issue #133.
- v0.5 requires accepted domain contracts, an Interview Mode UX prototype/usability handoff, profile/non-disclosure rules, compatibility-adapter posture, threat-model update, and exact acceptance matrix before implementation.
- The current release and planned v0.5 release remain synthetic-only and do not authorize production, client, FCI, or CUI data.
- No authoritative Scope, Practice Review, SSP, or Deliverables migration is authorized by the v0.5 planning issue.
- DocConverter-L2G remains the authoritative standalone intake, extraction, normalization, Exception & Trust Queue, and provenance tool; its stable package contracts remain unchanged compatibility inputs.
- Original evidence remains outside the `.l2g` project by default. Reference metadata, hashes, bounded derived summaries, source locations, provenance, and candidates are stored only under reviewed encrypted-project limits.
- Engagement owns canonical engagement identity and planning records. Evidence owns source identity, provenance, reference metadata, source relationships, and Evidence-origin candidates.
- Pre-Engagement and Interview Session outputs must remain in their own authority or become target-owned candidates; they may not silently mutate Engagement, Evidence, Scope, Practice Review, SSP, Deliverables, or Reviews & Actions.
- The existing standalone tools remain authoritative during migration.
- The Integrated Suite evolves inside this monorepo unless a demonstrated technical constraint requires otherwise.
- The repository is intentionally public, but all source, fixtures, Issues, pull requests, screenshots, logs, Actions artifacts, Releases, and test packages must remain free of client data, FCI, CUI, secrets, private local paths, client-identifying content, and proprietary unlicensed material.

## Baseline and reconciliation

The current sequence is:

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
- v0.5 Pre-Engagement and Interview Sessions design gate — issue #133.

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

### v0.5 Pre-Engagement and Interview Sessions design gate

Issue #133 governs the upcoming architecture decision, field-level contracts, Interview Mode UX prototype/usability handoff, profile/non-disclosure rules, compatibility adapters, threat model, and exact acceptance matrix. These records do not yet exist and implementation is not authorized until they are reviewed and merged.

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
10. Engagement and Evidence projections are read-only; imported metadata remains candidate material until explicitly reviewed.
11. A SHA-256 match establishes byte equality only; it does not establish authenticity, relevance, currency, or sufficiency.
12. Browser source-file associations are session-only and never portable project state.
13. Changed source bytes create new revision identities rather than silently replacing prior evidence records.
14. Search indexes are transient and built only after profile filtering.
15. Original evidence remains reference-only unless a later security and size decision explicitly approves embedding.
16. Interview responses and notes must preserve statement type, source, authoring profile, and provenance; summaries cannot silently replace raw records.
17. Raw advisor notes and approved client-visible summaries are separate records and must be filtered before render, search, count, inspector, and accessibility-tree construction.
18. Audio/video capture, automated transcription, AI-generated answers, hidden scoring, and automatic assessment conclusions require separately approved scope and are excluded from v0.5.
