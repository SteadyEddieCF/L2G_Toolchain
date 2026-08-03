# L2G Integrated Suite Architecture and Migration Assessment v1

## Status

Proposed planning baseline, reconciled after completion of the corrective and merged-main validation sequence. This document does not authorize production-module modification, standalone retirement, or production/client/CUI use.

## Verified repository baseline

Original planning-branch baseline:

`69785ecd38f4d00345f27ca13e934dd0f688a1bf`

The correction and validation sequence subsequently completed:

- Builder/Merger v3.10.1 — PR #113, merge `d3cd223befb3aa1b53b2feea291b9f38b8d2645e`;
- Workshop v79.1 — PR #112, merge `e14ed000e490040182b529d7e2b3bc7155c03287`;
- exact current six-tool RG-4 validation, metadata reconciliation, additive snapshot, and registry promotion — PR #118, final reviewed head `e976c072315a101b974e1af0b996e3d4c2c056d7`, merge `85d6e783a250b373cd4b9ea356e4c341336f9259`;
- issue #101 — closed completed;
- superseded evidence PR #103 — closed without merge.

Current promoted module pointers at the candidate implementation baseline:

| Module | Current supplied release |
|---|---:|
| L2G Control Center | v0.3.4 |
| DocConverter-L2G | v7.9.5.1 |
| L2G Scoper | v3.12 |
| CMMC L2 Gap Workshop Tool | v79.1 |
| L2G Builder/Merger | v3.10.1 |
| CMMC L2 SSP Modern Editable | v1.9.17 |

The authoritative exact-suite technical snapshot is `suite-2026.08.03-rg4-validated-mcfirecoal-v1.2.0`. The earlier `suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0` snapshot remains immutable.

Commit `85d6e783a250b373cd4b9ea356e4c341336f9259` is the candidate Milestone 0 implementation baseline. It should be recorded as the foundation baseline only after this planning PR is promoted and issue #117 records the remaining prerequisite decisions, especially repository visibility/exposure posture and acceptance or explicit revision of the proposed ADR set.

## Assessment

The existing monorepo is suitable for the integrated product. No demonstrated technical constraint currently justifies a replacement repository.

The integrated suite should be implemented as a TypeScript modular monolith:

- one generated portable HTML application;
- one user-visible `.l2g` engagement project;
- one shared application shell;
- strongly separated domain packages;
- explicit commands and review transitions;
- read-only cross-domain projections;
- compatibility adapters for existing package contracts;
- standalone builds retained throughout migration;
- a future SharePoint Framework host reusing the same domain packages.

The migration must not be a wholesale rewrite and must not place the six current interfaces into tabs or frames.

## Product-domain ownership

### Engagement and Overview

Owns engagement identity, safe metadata, navigation, compatibility, progress observability, recent activity, and factual counts. It does not own assessment conclusions.

### Pre-Engagement

Owns questionnaires, inventories, initial narratives, assumptions, known constraints, meeting participants, and initial responsibility candidates. Pre-engagement information remains candidate material until accepted by the owning downstream domain.

### Evidence

Owns file ingestion, extraction, normalization, parser metadata, source locations, fingerprints, provenance, review status, and candidate generation.

### Scope

Owns proposed CUI boundaries, systems, environments, assets, providers, services, data flows, assumptions, scoping rationale, unresolved questions, and reviewed scope decisions.

### Practice Review

Owns facilitated practice conclusions, interviews, evidence review, evidence requests, gaps, recommendations, actions, blockers, provider follow-up, and responsibility discussions.

### SSP

Owns governed SSP content, modules, narratives, inheritance, conflicts, baselines, SSP-local review history, and controlled SSP updates.

### Deliverables

Owns rendering, formatting, workbook and document assembly, reconciliation, manifests, output profiles, and final packaging. It may not modify source-domain conclusions.

### Reviews & Actions

Owns transition proposals, review assignments, comments, conflicts, review decisions, and consolidated administrative views. Underlying substantive records remain owned by their source domains.

## Architectural rules

1. Domain packages may depend on shared foundation packages.
2. A domain may not directly mutate another domain's authoritative records.
3. Cross-domain availability uses typed read-only projections.
4. Authority transfer uses explicit proposal and review records.
5. User-interface packages do not contain authoritative business rules.
6. Legacy adapters translate stable contracts without becoming domain owners.
7. Portable and SPFx hosts share domain logic but use host-specific persistence and identity adapters.
8. Standalone module builds remain separately generated until explicit retirement.
9. Imported content is sanitized and rendered inert.
10. All consequential imports and transitions are preview-first and non-mutating until explicit application.

## Proposed repository additions

Do not reorganize the current `modules/` tree during the foundation milestone.

```text
apps/
  integrated-suite/
    src/
    public/
    build/
  integrated-suite-spfx/
    src/
  standalone/

packages/
  app-shell/
  design-system/
  presentation-profiles/
  project-format/
  project-store/
  project-history/
  project-recovery/
  contract-registry/
  compatibility/
  legacy-adapters/
  security/
  archive-safety/
  source-traceability/
  search/
  validation/
  export-runtime/

  domain-engagement/
  domain-pre-engagement/
  domain-evidence/
  domain-scope/
  domain-interviews/
  domain-practice-review/
  domain-ssp/
  domain-deliverables/
  domain-reviews-actions/
  domain-audit/

  workers-document-processing/
  workers-ocr/
  workers-workbook/
  workers-search-index/

schemas/
  project/
  engagement/
  pre-engagement/
  evidence/
  scope/
  interview/
  workshop/
  ssp/
  delivery/
  review/
  audit/
  compatibility/

tests/
  unit/
  contracts/
  migrations/
  integration/
  playwright/
  accessibility/
  visual/
  file-origin/
  performance/
  adversarial/
  fixtures/
```

## Shared packages to establish first

- design tokens and accessible components;
- project-format and integrity handling;
- project-store and command execution;
- Undo, Redo, history, checkpoints, and recovery;
- contract identity and compatibility;
- sanitization and archive safety;
- source traceability and document identity;
- review states and transition records;
- notifications and error handling;
- deterministic single-file build and release manifest generation.

Shared packages must not be created by blindly copying apparently duplicate code. Existing implementations may contain different validated business rules and must first be inventoried.

## Migration sequence

1. Use exact candidate foundation baseline `85d6e783a250b373cd4b9ea356e4c341336f9259` after this planning PR and issue #117 prerequisites are resolved.
2. Complete the six-module feature inventory and ownership classification.
3. Accept, revise, or explicitly defer the architecture ADRs.
4. Create the TypeScript workspace and empty integrated application shell.
5. Implement project open, save, backup, integrity, recovery, Undo, Redo, and history.
6. Implement Engagement, Overview, Pre-Engagement, Reviews & Actions, and empty domain shells.
7. Add read-only compatibility catalog and immutable legacy import snapshots.
8. Integrate legacy modules through adapters where practical.
9. Replace routine file handoffs with internal validated transitions.
10. Migrate one bounded workflow at a time.
11. Verify equivalent behavior before consolidating duplicate code.
12. Keep integrated and standalone releases in parallel.
13. Record an explicit retirement decision for every standalone release.

## Recommended migration order

1. Engagement metadata and application shell.
2. Pre-Engagement records.
3. Reviews & Actions transition framework.
4. Evidence indexing and source traceability.
5. Scope records and candidate decisions.
6. Practice Review and Interview Mode.
7. SSP presentation and selected SSP domain services.
8. Deliverables and output assembly.
9. Advanced portfolio and remaining maintenance capabilities.

This order minimizes authority risk and creates the shared project lifecycle before moving complex substantive records.

## Technical constraints

The portable runtime must:

- run from an extracted local folder in an approved modern browser;
- require no installation, server, administrator rights, extension, executable, Python, Node.js, or PowerShell for normal use;
- contain no remote JavaScript, CSS, fonts, images, APIs, telemetry, analytics, or CDNs;
- use a restrictive Content Security Policy with `connect-src 'none'`;
- lazy-initialize heavy workspaces;
- load OCR only when requested;
- use Web Workers where useful;
- avoid repeated copies of large extracted data;
- remain testable under native Windows Chromium `file://` operation.

Development and CI may use Node.js, TypeScript, Playwright, axe-core, packaging tools, and Python validation helpers.

## Compatibility posture

Existing package contracts remain supported as:

- migration inputs;
- standalone interoperability routes;
- immutable import and export snapshots;
- audit records;
- backup and recovery artifacts;
- regression fixtures.

The integrated project should use a richer contract-identity model that separates:

- package kind;
- wire version;
- schema identity;
- contract or enhancement release;
- stability;
- producer;
- consumer;
- validation status.

This avoids overloading one `version` field, particularly for Workbook Handoff wire version 1.0 and contract release 1.7.

## Preserved non-claims

The integrated suite must not automatically create or imply:

- final scope;
- Met or Not Met conclusions;
- evidence sufficiency;
- readiness percentages;
- compliance scores;
- risk scores;
- certification claims;
- authenticated identity;
- digital signatures;
- client approval;
- legal custody.

## Recommendation

Proceed only with the Integrated Foundation milestone after issue #117 records the remaining prerequisite decisions. Production module migration should begin in a later, separately reviewed milestone after the project-lifecycle, authority-transition, security, accessibility, and file-origin acceptance criteria pass.
