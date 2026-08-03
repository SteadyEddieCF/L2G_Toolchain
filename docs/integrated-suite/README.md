# L2G Integrated Suite Planning

This directory contains the first durable architecture, migration, UX-governance, project-format, risk, and milestone-planning records for the next-generation L2G Integrated Suite.

## Status

- Planning only.
- No production module runtime is changed by this planning branch.
- No contract-registry status, suite snapshot, or release identity is changed by this planning branch.
- The existing standalone tools remain authoritative during migration.
- The integrated suite must evolve inside this monorepo unless a demonstrated technical constraint requires otherwise.

## Baseline and reconciliation

This planning branch was created from protected `main` at:

`69785ecd38f4d00345f27ca13e934dd0f688a1bf`

The corrective and validation sequence is complete:

- Builder/Merger v3.10.1 — PR #113, merge commit `d3cd223befb3aa1b53b2feea291b9f38b8d2645e`;
- Workshop v79.1 — PR #112, merge commit `e14ed000e490040182b529d7e2b3bc7155c03287`;
- corrected merged-main RG-4 six-tool validation and registry/snapshot promotion — PR #118, merge commit `85d6e783a250b373cd4b9ea356e4c341336f9259`;
- issue #101 — closed completed;
- superseded evidence PR #103 — closed without merge.

The authoritative current exact-suite snapshot is `suite-2026.08.03-rg4-validated-mcfirecoal-v1.2.0`. The earlier `suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0` record remains immutable.

Commit `85d6e783a250b373cd4b9ea356e4c341336f9259` is the candidate Milestone 0 implementation baseline. It becomes the recorded foundation baseline only after this planning PR is promoted and the remaining prerequisites in issue #117 are explicitly resolved or deferred—most importantly repository visibility/exposure posture and acceptance of the proposed ADR set.

## Documents

- `L2G_Integrated_Suite_Architecture_and_Migration_Assessment_v1.md`
- `L2G_Integrated_Suite_Feature_Inventory_Template_v1.csv`
- `L2G_Project_v1_Conceptual_Contract_v1.md`
- `L2G_Integrated_Suite_UX_Information_Architecture_v1.md`
- `L2G_Integrated_Suite_Decision_Risk_Register_v1.md`
- `L2G_Integrated_Suite_Milestone_0_Acceptance_v1.md`

## Proposed architecture decisions

- `docs/architecture/adr/ADR-0001-integrated-suite-modular-monolith.md`
- `docs/architecture/adr/ADR-0002-l2g-project-container.md`
- `docs/architecture/adr/ADR-0003-ui-framework-and-spfx-host-boundary.md`
- `docs/architecture/adr/ADR-0004-portable-browser-support.md`
- `docs/architecture/adr/ADR-0005-project-encryption-posture.md`
- `docs/architecture/adr/ADR-0006-project-persistence-history-and-recovery.md`

## Governing principles

1. One deployable application does not mean one tangled codebase.
2. Domain owners retain authority over their records.
3. Cross-workspace visibility is automatic; authority transfer is explicit and reviewable.
4. Legacy contracts remain supported until separately retired.
5. The normal portable runtime remains local, offline, no-install, no-telemetry, and free of runtime network dependencies.
6. No unsupported readiness, compliance, scoring, certification, Met/Not Met, or evidence-sufficiency conclusions are introduced.
7. Architecture decisions must be persisted in the repository rather than existing only in chat history.
