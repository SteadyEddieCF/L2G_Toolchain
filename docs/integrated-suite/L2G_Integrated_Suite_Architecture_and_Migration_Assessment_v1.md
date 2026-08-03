# L2G Integrated Suite Architecture and Migration Assessment v1

## Status

Proposed planning baseline. This document does not authorize production-module modification, contract promotion, current-pointer changes, or legacy retirement.

## Verified repository baseline

Branch creation baseline:

`69785ecd38f4d00345f27ca13e934dd0f688a1bf`

Current promoted module pointers at that baseline:

| Module | Current supplied release |
|---|---:|
| L2G Control Center | v0.3.4 |
| DocConverter-L2G | v7.9.5.1 |
| L2G Scoper | v3.12 |
| CMMC L2 Gap Workshop Tool | v79 |
| L2G Builder/Merger | v3.10 |
| CMMC L2 SSP Modern Editable | v1.9.17 |

The open correction stack remains:

- PR #112 — Workshop v79.1 Strict Workbook Merge Validation;
- PR #113 — Builder/Merger v3.10.1 Workshop Action and Ownership Preservation;
- issue #101 — merged-main RG-4 validation, six-tool regression, new suite snapshot, and registry-promotion decision.

The first integrated implementation baseline must be recorded only after that sequence is completed or explicitly deferred.

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

1. Freeze the exact current suite baseline after the open correction sequence.
2. Complete the six-module feature inventory and ownership classification.
3. Record architecture decisions.
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

Proceed only with the Integrated Foundation milestone until its project-lifecycle, authority-transition, security, accessibility, and file-origin acceptance criteria pass. Production module migration should begin in a later, separately reviewed milestone.
