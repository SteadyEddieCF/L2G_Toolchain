# L2G Integrated Suite Planning

This directory contains the durable architecture, migration, UX-governance, project-format, risk, release-roadmap, security, and milestone-planning records for the next-generation L2G Integrated Suite.

## Status

- L2G Integrated Suite v0.2.0 Encrypted Project Safety Foundation is current, merged by PR #127 at `72584f3a9fd8f82ea580cc29903e06678907d2f8`.
- Its portable HTML SHA-256 is `84526756161fa44bc2dcaebe791a2ea1b73c06341c7563e34693aa6b7231af86`.
- Milestone 0 issue #117 and v0.2 issue #123 are closed completed.
- v0.3.0 Engagement Spine is governed by issue #126.
- ADR-0008, the `l2g_engagement_v1` contract, v0.3 UX record, threat model, and acceptance matrix define the implementation gate.
- v0.3.0 remains synthetic-only and does not authorize production, client, FCI, or CUI data.
- No substantive Evidence, Scope, Practice Review, SSP, or Deliverables migration is authorized by these planning records.
- The existing standalone tools remain authoritative during migration.
- The integrated suite must evolve inside this monorepo unless a demonstrated technical constraint requires otherwise.
- The repository is intentionally public, but all source, fixtures, issues, screenshots, logs, Actions artifacts, Releases, and test packages must remain free of client data, FCI, CUI, secrets, and client-identifying content.

## Baseline and reconciliation

The current sequence is:

- Builder/Merger v3.10.1 — PR #113, merge commit `d3cd223befb3aa1b53b2feea291b9f38b8d2645e`;
- Workshop v79.1 — PR #112, merge commit `e14ed000e490040182b529d7e2b3bc7155c03287`;
- corrected merged-main RG-4 six-tool validation and registry/snapshot promotion — PR #118, merge commit `85d6e783a250b373cd4b9ea356e4c341336f9259`;
- architecture and migration planning — PR #116, merge commit `8fd6d14754e72a401aad85d70b64e150f1882ba2`;
- UX handoff and public-repository posture — PR #121;
- Integrated Suite Foundation v0.1.0 — PR #122, merge commit `711b84ebbf675a8e005dbfba80a8dfbd42213bc9`;
- rolling roadmap and README reconciliation — PR #124, merge commit `f0b91a0ce211a7d20db8e71cdd08f709a8bcd987`;
- v0.2 security design — PR #125, merge commit `6b35e955e854d3ba5507a7a97f8f9bdaa1cdacec`;
- Integrated Suite v0.2.0 — PR #127, merge commit `72584f3a9fd8f82ea580cc29903e06678907d2f8`.

The authoritative current exact-suite snapshot is `suite-2026.08.03-rg4-validated-mcfirecoal-v1.2.0`. The earlier `suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0` record remains immutable.

Commit `85d6e783a250b373cd4b9ea356e4c341336f9259` remains the governed standalone product/runtime compatibility baseline. Integrated Suite implementation branches start from current `main` while preserving that exact baseline identity.

## Documents

- `L2G_Integrated_Suite_Architecture_and_Migration_Assessment_v1.md`
- `L2G_Integrated_Suite_Feature_Inventory_Template_v1.csv`
- `L2G_Project_v1_Conceptual_Contract_v1.md`
- `L2G_Integrated_Suite_UX_Information_Architecture_v1.md`
- `L2G_Integrated_Suite_UX_Handoff_Reconciliation_v1.md`
- `L2G_Integrated_Suite_Decision_Risk_Register_v1.md`
- `L2G_Integrated_Suite_Milestone_0_Acceptance_v1.md`
- `L2G_Integrated_Suite_Rolling_10_Release_Roadmap_v1.md`
- `L2G_Integrated_Suite_v0.2.0_Threat_Model_v1.md`
- `L2G_Integrated_Suite_v0.2.0_Acceptance_v1.md`
- `L2G_Engagement_v1_Contract_v1.md`
- `L2G_Integrated_Suite_v0.3.0_Engagement_Spine_UX_v1.md`
- `L2G_Integrated_Suite_v0.3.0_Threat_Model_v1.md`
- `L2G_Integrated_Suite_v0.3.0_Acceptance_v1.md`

## Architecture decisions

- `docs/architecture/adr/ADR-0001-integrated-suite-modular-monolith.md`
- `docs/architecture/adr/ADR-0002-l2g-project-container.md`
- `docs/architecture/adr/ADR-0003-ui-framework-and-spfx-host-boundary.md`
- `docs/architecture/adr/ADR-0004-portable-browser-support.md`
- `docs/architecture/adr/ADR-0005-project-encryption-posture.md`
- `docs/architecture/adr/ADR-0006-project-persistence-history-and-recovery.md`
- `docs/architecture/adr/ADR-0007-encrypted-project-envelope-and-recovery.md`
- `docs/architecture/adr/ADR-0008-engagement-spine.md`

## Governing principles

1. One deployable application does not mean one tangled codebase.
2. Domain owners retain authority over their records.
3. Cross-workspace visibility is automatic; authority transfer is explicit and reviewable.
4. Legacy contracts remain supported until separately retired.
5. The normal portable runtime remains local, offline, no-install, no-telemetry, and free of runtime network dependencies.
6. No unsupported readiness, compliance, scoring, certification, Met/Not Met, or evidence-sufficiency conclusions are introduced.
7. Architecture, UX, security, and release decisions must be persisted in the repository rather than existing only in chat history.
8. Public repository visibility never authorizes client, FCI, CUI, secret, or proprietary engagement content in repository-controlled surfaces.
9. Encryption is necessary but not sufficient for production-data authorization.
10. Engagement projections are read-only; imported metadata remains candidate material until explicitly reviewed.
