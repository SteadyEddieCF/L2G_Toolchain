# L2G Integrated Suite Planning

This directory contains the durable architecture, migration, UX-governance, project-format, risk, release-roadmap, security, and milestone-planning records for the next-generation L2G Integrated Suite.

## Status

- L2G Integrated Suite Foundation v0.1.0 is current, merged by PR #122 at `711b84ebbf675a8e005dbfba80a8dfbd42213bc9`.
- Milestone 0 issue #117 is closed completed.
- The rolling ten-release roadmap is merged through PR #124.
- v0.2.0 Encrypted Project Safety Foundation is governed by issue #123.
- ADR-0007, the v0.2.0 threat model, and the v0.2.0 acceptance matrix define the cryptographic implementation gate.
- v0.2.0 remains synthetic-only and does not authorize production, client, FCI, or CUI data.
- No substantive production module migration is authorized by these planning records.
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
- rolling roadmap and README reconciliation — PR #124, merge commit `f0b91a0ce211a7d20db8e71cdd08f709a8bcd987`.

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

## Architecture decisions

- `docs/architecture/adr/ADR-0001-integrated-suite-modular-monolith.md`
- `docs/architecture/adr/ADR-0002-l2g-project-container.md`
- `docs/architecture/adr/ADR-0003-ui-framework-and-spfx-host-boundary.md`
- `docs/architecture/adr/ADR-0004-portable-browser-support.md`
- `docs/architecture/adr/ADR-0005-project-encryption-posture.md`
- `docs/architecture/adr/ADR-0006-project-persistence-history-and-recovery.md`
- `docs/architecture/adr/ADR-0007-encrypted-project-envelope-and-recovery.md`

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
