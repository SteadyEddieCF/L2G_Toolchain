# L2G Integrated Suite UX Handoff Reconciliation v1

## Status

Authoritative reconciliation of the temporary UX, information-architecture, workflow-design, interaction-pattern, presentation-profile, and prototype-priority handoff received on 2026-08-03.

This record accepts the handoff as detailed product-design input while preserving the architecture, authority, schema, security, compatibility, and release boundaries already recorded in the repository.

## Overall disposition

The handoff is accepted as strongly aligned with the Integrated Suite direction.

The product will be designed around:

- one engagement;
- eight durable workspaces;
- one unified review system;
- one consistent object-inspection model;
- a compact top bar;
- a collapsible left workspace rail;
- a task-focused central canvas;
- a profile-sensitive right inspector;
- Advisor, Client, and Reviewer presentation profiles;
- explicit, preview-first, provenance-preserving transitions.

The six legacy modules remain compatibility and migration sources. They must not appear as the primary integrated navigation model or be reproduced as six applications embedded in tabs or frames.

## Accepted workspace model

The following names and order are accepted for the Milestone 0 shell and initial prototype:

1. Overview
2. Pre-Engagement
3. Evidence
4. Scope
5. Practice Review
6. SSP
7. Deliverables
8. Reviews & Actions

They are durable work domains rather than a disposable linear wizard. A later reviewed information-architecture decision may rename a workspace only if usability evidence demonstrates a material benefit.

## Accepted shell and interaction direction

### Top bar

The Milestone 0 shell should include fixed, predictable locations for:

- navigation toggle;
- engagement identity and compact phase context;
- truthful local save state;
- Undo;
- Redo;
- global search or command entry;
- active presentation profile;
- help;
- overflow actions.

Routine work should not be displaced by a permanent product hero area.

### Left rail

The left rail should:

- support expanded and compact states;
- expose only actionable counts;
- preserve accessible labels and keyboard recovery;
- avoid legacy module names;
- keep workspace ordering stable;
- maintain separate remembered state by presentation profile and width class where safe.

Suggested dimensions are design targets, not schema or acceptance-contract fields:

- expanded: approximately 232–248 CSS px;
- compact: approximately 64–72 CSS px.

### Right inspector

The inspector is accepted as the normal cross-workspace context surface for:

- summary;
- provenance;
- source excerpts;
- relationships;
- comments;
- review;
- differences;
- history;
- related actions.

It should be context-sensitive rather than showing every tab for every object. It may open automatically for high-value source, candidate, conflict, or review context. Advisor and Reviewer profiles may pin it. Client profile rendering must filter content before display and must not briefly expose hidden advisor information during profile changes.

Suggested desktop width of approximately 340–400 CSS px is a design target, not a hard architecture constraint.

### Global search and command palette

The handoff’s combined local search and command-palette direction is accepted for design and foundation planning. Milestone 0 may implement a bounded foundation covering workspace navigation, profile switching, history/checkpoint actions, and synthetic low-authority records. Production extracted-text indexing remains outside Milestone 0.

## Accepted governance and state principles

### Separate status dimensions

The application must not compress lifecycle, review, operational, visibility, and currency/integrity meaning into one ambiguous badge.

The following dimensions are accepted conceptually:

- content lifecycle;
- review state;
- operational state;
- visibility classification;
- currency or integrity state where applicable.

The handoff’s labels—such as Draft, Proposed, Confirmed, Approved, Superseded, Assigned, In review, Changes requested, Open, Waiting, Blocked, Advisor-only, Client-safe, Current, Stale, Conflict, Rejected, and Unsupported—are approved UX vocabulary candidates.

Exact enum values, transition legality, domain applicability, migration mapping, and reversal semantics remain governed schema and command-model decisions. Existing validated legacy states must not be discarded merely to make every domain use an identical enum.

### Authority transitions

The following rule is authoritative:

- review actions normally create review records, proposals, revision requests, or explicit domain commands;
- a reviewer surface must not directly mutate another domain’s governed content through an untracked field write;
- acceptance or modification of a proposal must execute an explicit owning-domain command;
- approval, supersession, publication, and reversal must remain visible in history;
- downstream dependencies may require an explicit new reversal event instead of erasing a prior approval.

### Client-safe visibility

Client-safe visibility is a stored, explicit property or governed projection—not an assumption based solely on the active profile.

For Milestone 0:

- profiles are presentation modes, not security roles;
- profile-specific rendering and search must not leak hidden titles, snippets, counts, prior queries, or inspector content;
- external client distribution remains a curated export concern;
- the complete `.l2g` project is not a client-safe delivery artifact merely because Client View is active.

Exact inheritance rules for client-safe visibility remain unresolved and require schema-level tests before substantive domain migration.

## Accepted workflow direction

### Overview

Overview should prioritize:

- engagement position;
- recommended next work;
- workstream state;
- actions, blockers, and evidence requests;
- review queue;
- meaningful changes;
- currently available outputs.

It must not display unsupported readiness, compliance, certification, scoring, or evidence-sufficiency conclusions.

### Pre-Engagement

Pre-Engagement should clearly distinguish:

- client-provided answers;
- source-derived candidates;
- advisor interpretations;
- confirmed decisions.

Source-derived information must never be presented as though it were a client answer.

### Evidence

Evidence owns source intake, local processing, provenance, candidates, evidence records, and evidence requests. Routine downstream package-selection and handoff mechanics should disappear from the normal integrated workflow. Technical diagnostics remain advanced.

### Scope

Scope should use list/detail and decision-ledger patterns with explicit rationale, source basis, affected records, confirmation state, unresolved dependencies, and history. Dense tables remain optional advisor tools rather than the default for all records.

### Practice Review and Interview Mode

The session-planning and dedicated Interview Mode direction is accepted for prototype validation and later bounded implementation.

Key rules include:

- generated or source-derived questions remain advisor-controlled candidates;
- advisor notes and client responses are separate records;
- suggested follow-ups never advance the session or create governed records automatically;
- client-confirmed statements are explicit;
- pause creates a recovery checkpoint;
- post-session review is required before generated summaries or proposals become accepted records;
- Client Presentation Mode is not a security boundary.

An optional second display or window is deferred. The first implementation should use one application state with profile-sensitive presentation and must preserve `file://` operation.

### SSP

Workshop conclusions, confirmed statements, scope changes, evidence references, and imported review content appear as explicit SSP proposals. They do not silently overwrite governed narratives. Single-System remains the default; portfolio remains Advanced.

### Deliverables

The ownership boundary is clarified as follows:

- Evidence may expose evidence-register, source-register, technical-exchange, and diagnostic outputs where they are genuinely evidence-domain artifacts;
- Deliverables owns audience-oriented documents, workbooks, presentations, client-safe packages, manifests, preflight, generation history, and delivery status;
- output generation may consume approved or selected source-domain content but may not rewrite source-domain conclusions.

### Reviews & Actions

The unified inbox is accepted as a judgment and follow-up queue—not a generic list of every incomplete field. It should cover proposals, assignments, conflicts, stale reviews, revision requests, actions, evidence requests, blockers, and responsibility disputes while preserving substantive domain ownership.

## Responsive and accessibility disposition

The handoff’s WCAG 2.2 AA target and detailed keyboard, focus, landmark, status, live-region, table, touch, zoom, reduced-motion, diagram-alternative, and profile-switch requirements are accepted as product requirements subject to automated and manual validation.

Initial device posture:

- optimal desktop/laptop experience at 1440 × 900 or larger;
- full-authoring minimum target approximately 1024 × 768;
- tablet landscape supported for review, intake, facilitation, and moderate editing;
- phone support limited to bounded read, status, action, and simple-confirmation scenarios;
- phone is not a target for full evidence processing, diagram editing, practice workshops, SSP authoring, or deliverable generation.

## Prototype disposition

The recommended clickable prototype is accepted as a separate UX-validation workstream and must not silently expand Milestone 0 into production domain migration.

### Core prototype screens

1. Advisor Overview dashboard
2. Pre-Engagement intake and candidate review
3. Scope decision ledger
4. Interview Session Planner
5. Live Interview Mode
6. Reviews & Actions inbox

An SSP proposal-adoption screen is optional and should be added only after the six core screens are coherent.

### Prototype data and behavior

Use synthetic McFirecoal-style data only. Static or mock domain behavior is permitted for prototype validation, but it must be visibly separated from production schemas and business logic.

The prototype should validate:

- eight-workspace comprehension;
- next-action clarity;
- inspector usefulness;
- state-dimension comprehension;
- advisor-controlled suggestions;
- Client View non-disclosure;
- pause/resume recovery behavior;
- review disposition;
- navigation and inspector recovery;
- desktop and tablet-landscape layouts.

### Prototype boundaries

The first prototype does not authorize:

- production parsing or OCR;
- production legacy migration;
- all 110 practices;
- production Office generation;
- cryptographic production claims;
- enforceable roles;
- full phone authoring;
- complete portfolio-mode SSP behavior;
- final visual branding.

## Relationship to Milestone 0

Milestone 0 remains the additive foundation described by issue #117 and the acceptance matrix.

The UX handoff informs Milestone 0 in these areas:

- shell hierarchy;
- rail and inspector behavior;
- profile-sensitive rendering;
- truthful save labels;
- Undo/Redo descriptions and disabled states;
- empty, warning, error, conflict, stale, and superseded examples;
- keyboard/focus behavior;
- responsive shell behavior;
- bounded search/command foundation;
- reusable interaction-pattern placeholders.

Milestone 0 does not implement production Pre-Engagement, Evidence, Scope, Interview, Practice Review, SSP, or Deliverables semantics. The richer prototype may run as a separate synthetic experience or follow the foundation shell, but it may not be mistaken for migrated production behavior.

## Remaining authoritative decisions

The following remain open or require implementation evidence:

1. Exact shared-object schemas and legacy-state mappings.
2. Exact client-safe visibility inheritance and projection rules.
3. Exact lifecycle transition and reversal matrix by domain.
4. Stable-ID strategy across imports, copies, merges, and migrations.
5. Search-index persistence and rebuild behavior.
6. Detailed extracted-preview representation.
7. Deterministic ZIP normalization details.
8. Final component framework and SPFx host version after the compatibility spike.
9. Whether a later Interview release supports a second display/window.
10. Final allocation of rare technical outputs after the full feature inventory.

## UX specialist thread disposition

No additional response is required from the temporary UX specialist thread at this time. The handoff is complete and has been reconciled into the authoritative development direction.

The specialist thread may be re-engaged later for:

- clickable-prototype review;
- usability findings;
- visual-system refinement;
- Interview Mode testing;
- Client Presentation Mode disclosure testing;
- accessibility and responsive-design review.
