# ADR-0008 — Canonical Engagement Spine

## Status

Accepted for L2G Integrated Suite v0.3.0 implementation. Production, client, FCI, and CUI use remains unauthorized.

## Date

2026-08-03.

## Context

The integrated suite needs one durable engagement context before Evidence, Scope, Practice Review, SSP, or Deliverables are migrated. v0.2.0 protects the complete project and browser recovery but its engagement record is intentionally minimal and synthetic. Without a governed engagement spine, later workspaces would independently duplicate client identity, system identity, participants, dates, assumptions, decisions, questions, milestones, and visibility rules.

The engagement spine must support all eight workspaces while preserving domain authority. It must not turn pre-engagement statements or imported legacy metadata into authoritative scope, practice, responsibility, evidence-sufficiency, readiness, or compliance conclusions.

## Decision

### Domain ownership and archive location

1. The Engagement domain owns `domains/engagement.json` and the schema kind `l2g_engagement_v1`.
2. The domain contains engagement-level identity, planning context, participants, assumptions, decisions, open questions, constraints, milestones, blockers, candidate metadata, presentation visibility, and read-only workspace projections.
3. Scope, Evidence, Practice Review, SSP, Deliverables, and Reviews & Actions may read approved Engagement projections. They may not silently mutate Engagement records.
4. The existing `l2g_project_v1` archive layout and `l2g_encrypted_project_v1` outer envelope remain unchanged.
5. v0.2 `engagement_v1` records are accepted only through an explicit deterministic migration to `l2g_engagement_v1`.

### Identity and authority

6. Every governed Engagement record uses an opaque immutable identifier with a type prefix.
7. User-facing names are editable labels and are never record identities.
8. Canonical engagement identity has lifecycle state `accepted`; imported or derived records begin as candidates.
9. A candidate cannot mutate accepted state until an Advisor explicitly Accepts or Modifies it.
10. Reject and Supersede preserve the candidate, rationale, provenance, decision timestamp, and replacement link.
11. Merge is an explicit command that identifies the surviving record and preserves source identifiers in provenance.
12. Deletion of governed Engagement history is not supported in v0.3. Records may be deactivated, rejected, cancelled, completed, or superseded.

### Record model

13. The canonical engagement record includes engagement, client, system/program, and delivery-context labels; objectives and target level; phase and date range; a low-authority information label; participants and organizations; assumptions, decisions, open questions, and constraints; milestones, blockers, candidates, provenance, and visibility metadata.
14. Target level is descriptive planning metadata only. It is not a readiness, certification, or assessment result.
15. Information labels are locally asserted handling reminders, not automated data-classification decisions.
16. Relationships between assumptions, decisions, questions, constraints, milestones, and blockers use stable record references.

### State vocabularies

17. Engagement phases are `planning`, `discovery`, `scoping`, `practice-review`, `ssp-development`, `delivery`, `review`, and `closed`.
18. Record lifecycle states are `draft`, `candidate`, `accepted`, `rejected`, `superseded`, and `archived`.
19. Milestone operational states are `planned`, `in-progress`, `waiting`, `blocked`, `completed`, and `cancelled`.
20. Question states are `open`, `answered`, `deferred`, and `closed`.
21. Decision states are `proposed`, `accepted`, `revised`, and `superseded`.
22. Visibility values are `advisor-only`, `client-safe`, and `approved-for-client-presentation`.

### Presentation profiles

23. Advisor View may create and edit Engagement records, review candidates, and inspect provenance.
24. Client View is a curated projection. It filters records before rendering and never exposes hidden titles, snippets, counts, prior queries, internal notes, candidate rationale, or inspector content.
25. Reviewer View emphasizes changes, provenance, unresolved questions, decisions, and revision history.
26. Presentation profiles remain presentation behavior, not access-control roles.
27. External distribution still requires a separately generated client-safe export.

### Projections and next work

28. Every workspace receives a read-only projection created from the accepted Engagement state plus profile filtering.
29. Projections contain copies or immutable views, never writable references to the domain store.
30. The projection API records its source domain, generated timestamp, profile, and source record identifiers.
31. Suggested next work is factual and deterministic. It may identify overdue milestones, blocked milestones, unanswered questions, unreviewed candidates, missing required engagement labels, and upcoming milestones.
32. Suggested next work may not calculate readiness percentages, compliance scores, evidence sufficiency, certification likelihood, or Met/Not Met.

### History, migration, and compatibility

33. Meaningful Engagement mutations are ProjectStore commands and append history events.
34. Undo and Redo operate on Engagement commands while preserving append-only audit history.
35. Candidate acceptance, modification, rejection, supersession, milestone completion, and migration create named history events.
36. Opening a valid v0.2 encrypted project deterministically migrates its minimal engagement record, creates a migration checkpoint, and requires the next save to use the v0.3 application identity.
37. v0.1 unencrypted synthetic migration remains supported through the existing v0.2 path and then the v0.3 engagement migration.
38. v0.3 saves remain compatible with the v1 encrypted envelope and retain the complete inner integrity validation.
39. Existing standalone contracts remain immutable compatibility inputs; imported engagement metadata is low-authority candidate material.

### Safety posture

40. v0.3.0 remains synthetic-only.
41. Project encryption does not authorize production, client, FCI, or CUI use.
42. No original evidence is embedded.
43. No network, telemetry, sync, collaboration, multi-user identity, or security-role enforcement is introduced.
44. No readiness, compliance, scoring, certification, evidence-sufficiency, or assessment conclusion is introduced.

## Consequences

### Positive

- Later workspaces share one stable engagement context instead of duplicating metadata.
- Cross-workspace visibility is immediate while domain authority remains explicit.
- Imported legacy metadata can be useful without silently becoming authoritative.
- Profile filtering and provenance are designed before substantive client-facing workflows are migrated.
- v0.2 encryption and recovery remain reusable without changing the envelope.

### Negative

- The domain schema and migration logic are more complex than the v0.2 minimal record.
- Presentation profiles still cannot protect data from a holder of the complete project file.
- Candidate review and immutable history require more deliberate user interaction.
- Production use remains blocked despite the richer encrypted project.

## Required acceptance evidence

- schema and semantic validation for every Engagement collection and state vocabulary;
- deterministic v0.2-to-v0.3 migration with preserved identifiers and history;
- v0.1-to-v0.3 migration through the existing legacy path;
- explicit candidate Accept, Modify, Reject, and Supersede behavior;
- no target mutation before explicit acceptance;
- profile filtering before render, including hidden-count and inspector non-disclosure;
- immutable cross-workspace projections;
- deterministic factual next-work calculation;
- Undo, Redo, checkpoint, encrypted save/open, encrypted recovery, and lock regression;
- malformed, duplicate-ID, dangling-reference, unsupported-state, oversized-field, and prototype-pollution rejection;
- Linux and native Windows Chromium `file://` validation;
- zero unexpected network requests, axe-core, responsive layout, deterministic build, public hygiene, and existing-suite non-regression.

## Non-decisions

This ADR does not migrate Evidence, Scope, Practice Review, SSP, Deliverables, original evidence, OCR, parsing, document generation, cloud services, sharing, access control, production authorization, readiness, compliance, scoring, evidence sufficiency, or assessment conclusions.
