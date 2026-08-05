# ADR-0011 — Canonical Scope Authority

## Status

Accepted for L2G Integrated Suite v0.6.0 implementation when this reviewed design package merges. Production, client, FCI, and CUI use remains unauthorized.

## Date

2026-08-04.

## Context

L2G Integrated Suite v0.5.0 provides one encrypted local project, the canonical Engagement spine, the reference-only Evidence catalog, governed Pre-Engagement intake, and governed Interview Sessions. The next bounded vertical slice must establish a canonical Scope authority before Practice Review, SSP, and Deliverables can depend on a stable boundary model.

The current toolchain already contains useful scoping concepts in L2G Scoper v3.12: draft assets, providers, CUI flows, unknowns, a scoping decision ledger, pre-Workshop questions, staged import preview, diagrams, source traceability, and explicit draft-only guardrails. The specialist UX handoff recommends preserving these capabilities while relocating them into an engagement-centered Scope workspace with compact views, one object inspector, a dedicated Decisions view, and object-linked diagrams. It also recommends moving pre-workshop question preparation into the session-planning workflow rather than duplicating it as a second Scope authority.

The design must prevent several authority failures:

- source-derived or imported content being mistaken for an accepted boundary decision;
- an asset category being overloaded as an inclusion/exclusion decision;
- a diagram becoming an independent source of truth;
- the latest note, participant statement, or import silently replacing an earlier accepted decision;
- provider responsibility or inherited service context being treated as an implementation or assessment conclusion;
- profile switching exposing Advisor-only rationale, internal conflicts, rejected candidates, or hidden counts;
- compatibility import changing governed Scope state before review;
- stable Scoper contracts being broken or the standalone Scoper being implicitly retired.

The product posture remains local, offline, no-install, no telemetry, no runtime network, one generated HTML runtime, one encrypted `.l2g` project, original evidence external by default, presentation profiles rather than security roles, and synthetic-only data authorization.

## Decision

### Canonical domain and archive placement

1. v0.6 adds one governed domain document:

   - archive path: `domains/scope.json`;
   - schema kind: `l2g_scope_v1`;
   - schema version: `1.0`;
   - projection kind: `l2g_scope_projection_v1`;
   - projection version: `1.0`.

2. Scope owns authoritative boundary records, systems, assets, providers, services, locations, enclaves, data flows, assumptions, unknowns, dependencies, diagrams, Scope decisions, Scope-owned target candidates, import receipts, projections, and factual next-work records.

3. Engagement remains authoritative for engagement identity, organizations, participants, milestones, constraints, and engagement-level assumptions/decisions.

4. Evidence remains authoritative for source identity, fingerprints, source locations, bounded derived records, verification/import receipts, and Evidence-origin candidates.

5. Pre-Engagement remains authoritative for intake requests, instrument/assignment snapshots, submissions, responses, completeness facts, and intake-origin candidates.

6. Interview Sessions remains authoritative for questions, frozen plans, sessions, participant statements, Advisor notes, confirmations, summaries, follow-ups, and Interview-origin candidates.

7. Scope consumes deep-cloned, profile-filtered projections and validated source references. It never receives writable references to another domain.

### Record taxonomy and identity

8. Every governed Scope record uses an opaque immutable type-prefixed identifier. Labels, names, IP ranges, hostnames, provider names, diagram node labels, filenames, and order positions are not identities.

9. The canonical collections are:

   - `boundaries`;
   - `systems`;
   - `assets`;
   - `providers`;
   - `services`;
   - `locations`;
   - `enclaves`;
   - `data_flows`;
   - `assumptions`;
   - `unknowns`;
   - `dependencies`;
   - `diagrams`;
   - `decisions`;
   - `candidates`;
   - `import_receipts`.

10. Records preserve explicit source/provenance references, asserted-by profile label, timestamps, version, supersession links, and affected-record references. Locally asserted identities are workflow metadata, not authenticated identity or signatures.

11. Governed records are archived, rejected, withdrawn, closed, or superseded rather than destructively deleted.

### Separate semantic dimensions

12. Scope must not use one overloaded status field. The following dimensions remain separate:

   - record type and subtype;
   - asset category;
   - scope disposition;
   - boundary relationship;
   - implementation location;
   - responsibility model;
   - lifecycle state;
   - operational state;
   - review state;
   - visibility;
   - currency/integrity state;
   - decision state.

13. Asset category values are `cui-asset`, `security-protection-asset`, `contractor-risk-managed-asset`, `specialized-asset`, `out-of-scope-asset`, and `unclassified`.

14. A category label does not by itself establish a boundary decision. Category assignment requires a Scope-owned decision or remains proposed/unknown.

15. Scope disposition values are `proposed-in-scope`, `accepted-in-scope`, `proposed-out-of-scope`, `accepted-out-of-scope`, `unknown`, `disputed`, `deferred`, and `superseded`.

16. Boundary relationship values are `inside`, `outside`, `crosses-boundary`, `supports-boundary`, `inherits-into-boundary`, `shared`, `unknown`, and `not-applicable`.

17. Implementation location values are `client-managed`, `provider-managed`, `co-managed`, `inherited`, `external`, `unknown`, and `not-applicable`.

18. Responsibility model values are `client`, `provider`, `shared`, `inherited`, `unassigned`, `disputed`, and `not-applicable`. Responsibility does not establish practice implementation, effectiveness, evidence sufficiency, or assessment outcome.

### Boundary, object, and relationship records

19. A boundary record describes one named boundary or boundary proposal, its purpose, included/excluded object references, entry/exit points, related locations/enclaves, source basis, accepted decision references, and current version.

20. Systems represent logical or business systems. Assets represent bounded technical or information assets. Providers represent external organizations. Services represent provided or shared capabilities. Locations and enclaves represent physical/logical placement. These records may relate to one another but cannot silently create each other.

21. A data-flow record identifies source, destination, data kind/description, path/intermediaries, protocols or transfer mechanism where known, protection notes, boundary crossings, source basis, unknowns, and related decisions. It does not establish that controls are implemented or effective.

22. Dependencies are explicit directed links among governed records. Dependency cycles are rejected unless the contract explicitly permits the relationship type and the cycle is informational rather than precedence-bearing.

23. Assumptions remain assumptions until resolved by a decision or superseded. Unknowns remain first-class records with severity/priority, owner, blocking effect, due date, source basis, and resolution links. Neither is converted to accepted fact automatically.

### Decision ledger authority

24. Scope decisions are the only records that can establish or change authoritative Scope disposition, accepted asset category, accepted boundary membership, accepted relationship, accepted responsibility assignment, accepted flow treatment, or approved diagram status.

25. A decision records:

   - decision ID and version;
   - decision type;
   - proposed and accepted values;
   - affected record references and exact versions;
   - rationale;
   - source basis and provenance;
   - assumptions and unknowns considered;
   - dependencies;
   - locally asserted Advisor analysis;
   - optional exact-version Client confirmation reference;
   - review disposition;
   - accepted/rejected/returned/superseded state;
   - timestamps and history.

26. Proposed disposition, Advisor analysis, participant/client statement, Client confirmation, Reviewer disposition, accepted Scope decision, and supersession are distinguishable records or references. One cannot be inferred from another.

27. Decision workflow values are `draft`, `proposed`, `awaiting-confirmation`, `awaiting-review`, `accepted`, `rejected`, `returned`, `withdrawn`, `superseded`, and `archived`.

28. Accepting a decision atomically updates only the affected Scope-owned record fields expressly governed by that decision and appends history. It does not mutate source-domain records.

29. Modifying an accepted decision creates a new decision version or superseding decision. Prior accepted decisions and their exact affected-record versions remain auditable.

30. If an affected source or dependency version changes, the decision becomes `stale` in currency/integrity state. It is not automatically reversed or reaccepted.

31. Conflicting active accepted decisions for the same governed field are rejected before mutation unless one transaction explicitly supersedes the other.

### Source-to-Scope candidates

32. Engagement, Evidence, Pre-Engagement, and Interview Sessions may publish candidates to Scope through their own source-domain commands.

33. Scope creates a target-owned candidate only after validating the source candidate reference, source version, proposed record type, proposed values, provenance, visibility, and semantic limits.

34. Scope candidate states are `received`, `in-review`, `accepted`, `modified-and-accepted`, `rejected`, `returned`, `withdrawn`, `superseded`, and `closed`.

35. Accepting or modifying a candidate creates or updates Scope-owned records through a Scope-owned command and, where authority changes are involved, creates a Scope decision. The source stores only validated target references and mirrored workflow state.

36. A candidate may not directly set an authoritative accepted disposition, category, responsibility, or boundary relationship without the Scope decision command.

37. Source candidates containing unsupported readiness, compliance, scoring, certification, risk, implementation, evidence-sufficiency, or Met/Not Met conclusions are rejected before mutation.

### Stable Scoper compatibility

38. L2G Scoper v3.12 remains independently distributable. v0.6 does not change its runtime, browser storage key, input/output wire contracts, or zero-practice guardrail.

39. The integrated adapter recognizes only registered supported kinds and versions, including:

   - `l2g_scope_context_v1` version `1.0`;
   - `l2g_scope_return_package_v1` version `1.0`.

40. Import performs strict JSON or bounded stored-ZIP validation as applicable, duplicate/prototype-key rejection, kind/version recognition, package SHA-256, source-traceability validation, local-path leakage checks in path-bearing fields, semantic limits, and preview before any mutation.

41. Scope-context content enters as imported context, source references, staged objects, unknowns, questions, or candidates. It never creates accepted Scope decisions automatically.

42. Scope-return content may stage assets, providers, flows, unknowns, decision-ledger proposals, and pre-workshop question references. Existing additive sections remain optional and unknown optional sections remain preserved in the receipt or safely ignored according to the registry posture.

43. Package bytes are not retained. The receipt preserves package kind/version, SHA-256, producer metadata, source references, selected/rejected record IDs, diagnostics, and apply history.

44. Supported actions are `Preview`, `Apply Reviewed Subset`, `Modify and Apply`, `Reject`, and `Return`. Apply is atomic; parser, identity, version, integrity, ambiguity, limit, traceability, or semantic failure leaves governed state unchanged.

45. Duplicate or ambiguous objects are never merged by display name alone. The preview requires explicit create, link-to-existing, keep-separate, or reject treatment.

46. A compatibility export may produce a registered `l2g_scope_return_package_v1` version `1.0` projection using only fields supported by that frozen contract. It remains draft/advisor-reviewed context, emits zero practice records, and cannot represent unsupported internal authority as a stronger external conclusion.

### Diagrams

47. A diagram is a governed representation, not an independent authority source.

48. Diagram records contain stable diagram ID/version, purpose, profile visibility, included object references and exact versions, nodes, edges, annotations, layout, source/decision basis, generated/manual origin, review state, currency/integrity state, and an accessible textual alternative.

49. Nodes and edges reference Scope objects or explicit proposal placeholders. Free-standing labels cannot silently create Scope objects.

50. Deterministic generated diagrams use accepted or clearly labeled proposed records selected by the Advisor. Generation never changes object or decision state.

51. When a referenced object version or accepted decision changes, the diagram becomes stale. It remains visible with a stale qualification until explicitly refreshed, retained, superseded, or archived.

52. Diagram approval means approved as a representation of the referenced records at exact versions. It does not approve the broader engagement, implementation, or assessment conclusion.

53. The accessible textual alternative lists included objects, relationships, boundary crossings, unresolved placeholders, and stale references. It is generated before Client rendering from the Client-safe projection.

### UX and presentation profiles

54. Scope uses one engagement-centered workbench with compact subviews:

   - Boundary;
   - Systems & Assets;
   - Providers & Services;
   - Data Flows;
   - Decisions;
   - Diagrams.

55. The central canvas supports list/detail or diagram work. The right inspector consistently shows identity, authority owner, provenance, exact version, related objects, decisions, conflicts, history, and permitted actions.

56. Pre-workshop questions generated from Scope are published to Interview/Practice Review session planning as candidates; they are not maintained as a second authoritative question bank inside Scope.

57. Advisor View may see all permitted Scope records, internal rationale, candidates, conflicts, imports, and decision history.

58. Reviewer View is read-only for governed object content except explicit review dispositions, return comments, and assigned decision actions.

59. Client View receives a new projection before counts, search, render, inspector, differences, history summaries, focus restoration, live-region announcements, or accessibility-tree creation.

60. Client View omits Advisor-only rationale/notes, internal provenance details, rejected/returned candidates, unresolved internal conflicts, hidden objects, confidence, diagnostic fields, private participant metadata, and hidden counts. It may show only explicitly Client-visible objects, plain-language rationale, approved diagrams, accepted or clearly proposed decisions selected for discussion, visible unknowns, and visible confirmations.

61. Profile switching clears incompatible search results, cached counts, current selections, inspector content, differences, focus targets, and live-region queues before rendering the new projection.

62. Profiles are not security roles. A holder who unlocks the complete project can access complete content. External Client distribution remains a curated-export concern.

### Migration, limits, and history

63. Opening a valid v0.5 project adds an empty `domains/scope.json`, updates the exact domain index, and creates a named migration checkpoint/history event. It infers no boundary, object, category, flow, assumption, unknown, decision, diagram, candidate, or conclusion.

64. v0.1-v0.4 projects migrate through their existing paths and then receive the same empty v0.6 Scope domain.

65. Scope mutations are command-based. Import apply, candidate acceptance, decision acceptance/supersession, batch relationship changes, diagram refresh/approval, and migration append named history; major imports, accepted boundary decisions, and migration create checkpoints.

66. Undo and Redo restore validated governed state without erasing audit events or manufacturing source-domain decisions.

67. Semantic limits are bounded below inherited archive/envelope limits. The contract defines collection, string, relationship, diagram node/edge, import batch, decision history, and dependency-depth limits. The stricter inherited limit always prevails.

68. v0.6 remains synthetic-only. It introduces no automated CUI-boundary determination, automatic applicability, hidden score, readiness, compliance, risk, certification, evidence-sufficiency, implementation, Met/Not Met, cloud service, authenticated identity, or standalone retirement decision.

## Consequences

### Positive

- Scope becomes a durable authority before Practice Review and SSP migration.
- Asset category, inclusion/exclusion, responsibility, review, visibility, and currency remain semantically clear.
- Imported Scoper context and participant statements can be used without escalating their authority.
- Decision history and supersession make boundary changes auditable.
- Diagrams remain linked, reviewable representations instead of ungoverned pictures.
- The UX preserves the strongest Scoper concepts without reproducing its tab-heavy shell.
- Stable standalone contracts and independent distribution remain protected.

### Negative

- The record and relationship model is larger than a flat asset inventory.
- Advisors must make explicit decisions rather than relying on a latest-note shortcut.
- Diagrams require stale-state management and exact-version references.
- Client View remains a presentation profile, not access control.
- Compatibility mapping cannot expose internal fields that the frozen contract cannot safely represent.

## Required acceptance evidence

- exact `l2g_scope_v1` and `l2g_scope_projection_v1` schemas and semantic validators;
- deterministic v0.5-to-v0.6 empty-domain migration and v0.1-v0.4 regression;
- separate state-dimension and taxonomy tests;
- Scope-owned candidate accept/modify/reject/return and source-state mirroring;
- decision conflict, stale dependency, supersession, and Undo/Redo tests;
- strict Scoper context/return preview, reviewed subset apply, duplicate/ambiguous handling, no-partial-mutation failure, and stable compatibility export;
- diagram generation, exact-version links, stale detection, approval qualification, accessible alternative, and profile filtering;
- Client non-disclosure across DOM, counts, search, inspector, differences, history, focus, live regions, and accessibility tree;
- bounded scale, dependency-cycle, oversized/malformed/tampered input, encrypted persistence/recovery, lock, and corruption tests;
- Linux and native Windows Chromium `file://`, restrictive CSP, zero unexpected network, deterministic build, public hygiene, current-suite, registered-route, and standalone-module non-regression.

## Non-decisions

This ADR does not authorize production data, Client distribution, authenticated identity, cloud collaboration, automatic boundary determination, automatic applicability, Practice Review findings, responsibility conclusions beyond Scope context, SSP narratives, Deliverables, readiness, compliance, scoring, certification, risk, evidence sufficiency, implementation conclusions, Met/Not Met, original-evidence embedding, or standalone Scoper retirement.