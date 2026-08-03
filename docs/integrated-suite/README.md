# L2G Integrated Suite Planning

This directory contains the first durable architecture, migration, UX-governance, project-format, risk, and milestone-planning records for the next-generation L2G Integrated Suite.

## Status

- Planning only.
- No production module runtime is changed.
- No current module pointer, contract-registry status, suite snapshot, or release identity is changed.
- The existing standalone tools remain authoritative during migration.
- The integrated suite must evolve inside this monorepo unless a demonstrated technical constraint requires otherwise.

## Baseline

This planning branch was created from protected `main` at:

`69785ecd38f4d00345f27ca13e934dd0f688a1bf`

At branch creation, the corrective Workshop v79.1 and Builder/Merger v3.10.1 pull requests remained open and draft as PRs #112 and #113. Their eventual disposition and the issue #101 registry-promotion sequence remain prerequisites for freezing the first implementation baseline.

## Documents

- `L2G_Integrated_Suite_Architecture_and_Migration_Assessment_v1.md`
- `L2G_Integrated_Suite_Feature_Inventory_Template_v1.csv`
- `L2G_Project_v1_Conceptual_Contract_v1.md`
- `L2G_Integrated_Suite_UX_Information_Architecture_v1.md`
- `L2G_Integrated_Suite_Decision_Risk_Register_v1.md`
- `L2G_Integrated_Suite_Milestone_0_Acceptance_v1.md`

## Governing principles

1. One deployable application does not mean one tangled codebase.
2. Domain owners retain authority over their records.
3. Cross-workspace visibility is automatic; authority transfer is explicit and reviewable.
4. Legacy contracts remain supported until separately retired.
5. The normal portable runtime remains local, offline, no-install, no-telemetry, and free of runtime network dependencies.
6. No unsupported readiness, compliance, scoring, certification, Met/Not Met, or evidence-sufficiency conclusions are introduced.
7. Architecture decisions must be persisted in the repository rather than existing only in chat history.
