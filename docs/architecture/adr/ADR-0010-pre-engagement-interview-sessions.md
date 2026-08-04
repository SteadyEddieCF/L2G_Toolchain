# ADR-0010 — Pre-Engagement and Interview Session Authorities

## Status

Proposed for L2G Integrated Suite v0.5.0 implementation after this design package is reviewed and merged. Production, client, FCI, and CUI use remains unauthorized.

## Date

2026-08-04.

## Context

The Integrated Suite has a shared offline shell, encrypted project lifecycle, canonical Engagement authority, and canonical reference-only Evidence authority. The next bounded vertical slice must support pre-engagement intake and advisor-facilitated interviews without collapsing source, statement, interpretation, or target-domain authority.

The current standalone tools already contain useful intake packages, questionnaires, meeting context, pre-workshop questions, facilitation notes, evidence follow-up, and client/advisor presentation concepts. v0.5 integrates the workflow, not the legacy application shells. Existing standalone products and stable contracts remain independently authoritative and distributable.

The primary risks are silent authority transfer, accidental Client-view disclosure, stale question plans, misleading summaries, interrupted sessions, and treating participant statements or advisor notes as accepted Scope, Practice Review, SSP, readiness, compliance, evidence-sufficiency, or Met/Not Met conclusions.

## Decision

### 1. Domain ownership

1. Pre-Engagement owns `domains/pre-engagement.json`, schema kind `l2g_pre_engagement_v1`, version `1.0`.
2. Interview Sessions owns `domains/interview-sessions.json`, schema kind `l2g_interview_sessions_v1`, version `1.0`.
3. Engagement remains authoritative for engagement identity, organizations, participants, objectives, phase, milestones, assumptions, decisions, constraints, and Engagement-owned candidates.
4. Evidence remains authoritative for source identity, fingerprints, source locations, bounded derived records, evidence relationships, verification/import receipts, and Evidence-origin candidates.
5. Pre-Engagement owns requests, assignments, questionnaire/inventory definitions and snapshots, submissions, receipts, review outcomes, exceptions, reminders as local work records, and Pre-Engagement-origin candidates.
6. Interview Sessions owns question banks, immutable session-plan snapshots, session lifecycle, attendance snapshots, participant statements, advisor observations, imported context notes, facilitator summaries, proposed decisions, follow-ups, parking-lot items, completion review, and Interview-origin candidates.
7. No Pre-Engagement or Interview command directly mutates Scope, Practice Review, SSP, Deliverables, or Reviews & Actions governed content. Candidate publication invokes a target-owned candidate command where the target exists; otherwise the proposal remains queued.

### 2. Authority classes

Every response or note record has one immutable `record_kind`:

- `participant-statement` — attributed direct statement or answer;
- `advisor-observation` — advisor interpretation or observation;
- `imported-context` — content imported from a recognized package;
- `facilitator-summary` — bounded synthesis that cites its source records;
- `proposed-decision` — proposed decision requiring owning-domain review;
- `follow-up` — requested next action or unanswered item;
- `parking-lot` — deferred topic not resolved in the session.

Changing a record from one kind to another creates a new superseding record; it does not rewrite the original authority class.

Participant statements are not client-confirmed merely because they were captured during a session. Confirmation is an explicit event recording confirmer reference, timestamp, statement version, and method such as `verbal-in-session`, `written-follow-up`, or `advisor-recorded-unconfirmed`.

### 3. Pre-Engagement model

Pre-Engagement distinguishes independent dimensions:

- lifecycle: `draft`, `issued`, `closed`, `cancelled`, `superseded`;
- operational state: `not-started`, `in-progress`, `waiting`, `received`, `overdue`, `blocked`;
- review state: `unreviewed`, `in-review`, `accepted`, `changes-requested`, `rejected`;
- visibility: `advisor-only`, `client-safe`, `approved-client-summary`;
- candidate state: `draft`, `awaiting-review`, `published-to-target`, `returned`, `withdrawn`, `superseded`, `closed`.

An intake request is distinct from an assignment, response, receipt, review, exception, and candidate. The UI may present them together, but the schema and history do not overload one status field.

Questionnaires and inventories use stable definition IDs and versioned snapshots. Issuing an assignment freezes the exact ordered prompt set, helper text, required flags, answer constraints, and source references used for that assignment. Later question-bank edits do not alter issued or completed snapshots.

### 4. Interview planning and lifecycle

A question bank item has a stable `question_id`, version, origin, prompt, rationale, expected participants, applicability note, source references, visibility, and lifecycle.

A session plan is an immutable ordered snapshot of selected question versions plus session-specific wording, ordering, inclusion, rationale, and expected participants. Editing a ready or started plan creates a new plan version and records whether the session adopts it.

Session lifecycle is:

- `planned` — identity and draft plan exist;
- `ready` — preflight completed and plan snapshot frozen;
- `in-progress` — facilitation started;
- `paused` — named recovery checkpoint created;
- `completed-pending-review` — facilitation ended but post-session review is incomplete;
- `completed` — completion review approved;
- `cancelled` — session will not occur;
- `superseded` — replaced by another session while history remains.

Legal transitions are command-validated. A completed session is not reopened in place; additional work occurs in a follow-up session or a new explicit revision event.

Starting, pausing, resuming, completing facilitation, completing post-session review, and superseding a session create named history events. Pausing must create a recovery checkpoint before the UI reports success.

### 5. Interview Mode

Interview Mode is a focused presentation state inside the same application and project. It is not a separate authority or security boundary.

The default facilitation surface shows one current question or topic, progress, agenda position, source context available to the active profile, separate participant-response and advisor-note capture, defer/follow-up actions, evidence-request candidate creation, and explicit next/previous controls.

No generated or source-derived follow-up advances the agenda, creates a governed response, or publishes a candidate without an advisor command.

Client Presentation Mode is a profile-sensitive projection constructed before rendering. It omits advisor-only note titles, content, snippets, counts, search terms, prior queries, inspector state, hidden agenda items, internal rationale, provenance details, candidate controls, and history details. Switching profiles clears transient search, selection, hover, announcement, and inspector state before the new projection renders.

### 6. Summaries and post-session review

Facilitator summaries must cite one or more source record IDs and remain distinct from those records. A summary may not replace, merge, or silently edit participant statements, observations, or imported context.

Completing a session requires a post-session review that:

- identifies unconfirmed statements;
- resolves or explicitly retains conflicts;
- classifies advisor-only versus approved client-visible summaries;
- reviews proposed decisions and follow-ups;
- previews candidates by target authority;
- confirms no unsupported readiness, compliance, evidence-sufficiency, scoring, risk, certification, implementation, or Met/Not Met conclusion is being created.

### 7. Candidate publication

Pre-Engagement and Interview candidates identify source records, proposed target domain/type, proposed operation, bounded proposed fields, rationale, provenance, visibility, and supersession links.

Publication to implemented Engagement and Evidence targets creates a target-owned candidate and stores the returned target reference. Target decisions include Accept, Modify, Reject, Return, Withdraw, Supersede, and Close according to the target contract. Source domains mirror workflow state but do not own acceptance.

For Scope, Practice Review, SSP, Deliverables, or other targets not yet implemented, candidates remain `awaiting-review` and the UI exposes no false acceptance control.

### 8. Compatibility adapters

Recognized `l2g_meeting_context_v1`, `l2g_intake_package_v1`, and current registered questionnaire/context packages enter through strict recognition, duplicate-key rejection, bounded parsing, registry lookup, preview, source receipt, and atomic apply.

Imported content remains `imported-context` or Pre-Engagement response candidates until explicitly reviewed. Adapters preserve valid source identifiers and locations but generate separate integrated stable IDs. Unknown versions, malformed structures, oversized content, ambiguous source references, invalid identifiers, or missing required provenance are rejected before mutation or routed to a reviewed exception path.

Adapters do not infer participant confirmation, scope boundaries, provider responsibility, practice conclusions, evidence sufficiency, SSP narratives, readiness, compliance, scoring, certification, risk, implementation, or Met/Not Met.

### 9. Profiles and visibility

Advisor, Reviewer, and Client are presentation profiles, not authenticated roles. The complete unlocked `.l2g` project remains accessible to its holder.

Client-visible content requires explicit visibility and, where applicable, an approved client summary. Raw advisor observations are never inherited into Client visibility. Reviewer View is direct-edit read-only and emphasizes traceability, differences, confirmation, conflicts, candidate publication, and history.

All workspace projections are deep-cloned, recursively frozen, profile-filtered, and factual. Hidden records do not contribute counts, next-work text, search, snippets, command suggestions, inspector relationships, accessibility names, or live-region messages.

### 10. Limits and migration

v0.5 retains the v0.4 encrypted envelope, cryptographic profile, strict JSON/ZIP handling, project entry limits, history model, checkpoint model, restrictive CSP, deterministic build, and zero-runtime-network posture unless separately reviewed.

Semantic caps are:

- 500 intake requests;
- 1,000 assignments;
- 2,000 submissions/receipts;
- 2,000 questionnaire or inventory definitions/versions;
- 5,000 question-bank versions;
- 500 sessions;
- 25,000 session-plan items;
- 50,000 response/note records;
- 10,000 follow-up and parking-lot records;
- 10,000 candidates.

The stricter inherited archive and domain-size limits always prevail. Normal labels are capped at 300 characters, prompts and answers at 16,000 characters, advisor notes at 32,000 characters, and facilitator summaries at 16,000 characters.

Opening a valid v0.4 project adds empty Pre-Engagement and Interview domains, updates the domain index, and creates a named migration checkpoint and history event. Migration infers no request, answer, participant statement, note, summary, candidate, decision, or conclusion.

## Consequences

### Positive

- Intake and facilitated discovery become first-class integrated workflows without transferring authority silently.
- Direct statements, advisor observations, imported context, and summaries remain distinguishable and auditable.
- Interview Mode can optimize live facilitation while preserving the shared project and command model.
- Client presentation rules are defined before substantive sensitive-note implementation.
- Later Scope, Practice Review, and SSP releases receive explicit reviewed candidates instead of ambiguous copied text.

### Negative

- The data model is more verbose than a single notes document.
- Advisors must perform post-session review and explicit candidate publication.
- Client Presentation Mode still is not safe external distribution or access control.
- Stable snapshots and supersession create additional history and storage overhead.

## Explicit exclusions

- production/client/FCI/CUI authorization;
- cloud scheduling, email, collaboration, accounts, authenticated identity, or enforceable roles;
- audio/video recording, microphone access, speech-to-text, automated transcription, meeting bots, or biometrics;
- AI-generated answers or automatic follow-up acceptance;
- automatic Scope, Practice Review, SSP, readiness, compliance, evidence-sufficiency, scoring, risk, certification, implementation, or Met/Not Met conclusions;
- replacing DocConverter, Scoper, Workshop, SSP, Builder/Merger, or stable package contracts;
- embedding original evidence in the project;
- curated client export or standalone module retirement.
