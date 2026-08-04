# `l2g_interview_sessions_v1` Contract v1

## Status

Field-level design contract for L2G Integrated Suite v0.5.0 Interview Sessions. It becomes implementation authority when the reviewed design pull request merges.

This contract remains synthetic-only and does not authorize production, client, FCI, or CUI data.

## Purpose

Define a canonical facilitated-discovery authority that:

- manages reusable versioned questions and frozen session plans;
- supports a dedicated one-question-at-a-time Interview Mode;
- distinguishes participant statements, advisor notes, confirmations, summaries, follow-ups, parking-lot items, and candidates;
- preserves question/session source provenance and plan staleness;
- checkpoints Start, Pause, Resume, Complete, and Cancel behavior;
- recovers an interrupted session without duplicating or silently publishing drafts;
- provides profile-safe projections and Client Presentation Mode;
- publishes candidates through target-owned commands without automatic conclusions;
- consumes recognized meeting/intake context through strict preview/apply adapters.

## Archive placement

The canonical domain is stored at:

```text
domains/interview-sessions.json
```

No audio/video, microphone/camera stream, transcript media, browser device handle, package bytes, original evidence bytes, or unbounded raw meeting transcript is stored.

## Root shape

```json
{
  "schema_kind": "l2g_interview_sessions_v1",
  "schema_version": "1.0",
  "interview_domain_id": "interview_domain_<opaque>",
  "questions": [],
  "plans": [],
  "sessions": [],
  "session_questions": [],
  "participant_statements": [],
  "advisor_notes": [],
  "confirmations": [],
  "summaries": [],
  "follow_ups": [],
  "parking_lot_items": [],
  "candidates": [],
  "import_receipts": [],
  "projection_policy": {
    "client_visible_values": ["client-safe", "approved-for-client-presentation"],
    "client_include_advisor_notes": false,
    "client_include_candidates": false,
    "client_include_internal_provenance": false,
    "search_index_persistence": "none"
  }
}
```

Exact top-level keys are required. Unknown keys are rejected.

## Shared rules

### Visibility

- `advisor-only`
- `client-safe`
- `approved-for-client-presentation`

### Review state

- `not-requested`
- `pending`
- `in-review`
- `reviewed`
- `changes-requested`
- `closed`

### Provenance

```json
{
  "source_kind": "advisor-entry",
  "source_id": "history_<opaque>",
  "source_label": "Synthetic interview preparation",
  "source_location_ref": null,
  "asserted_at": "2026-08-04T00:00:00.000Z",
  "asserted_by": "advisor",
  "confidence": "not-evaluated"
}
```

Asserted participant/profile labels are local workflow metadata, not authenticated identity or electronic signatures. Confidence is advisory metadata and not correctness, sufficiency, or an assessment conclusion.

### Stable IDs

| Record | Prefix |
|---|---|
| Root | `interview_domain_` |
| Question | `interview_question_` |
| Plan | `interview_plan_` |
| Plan item | `interview_plan_item_` |
| Session | `interview_session_` |
| Session question | `session_question_` |
| Participant statement | `participant_statement_` |
| Advisor note | `advisor_note_` |
| Confirmation | `interview_confirmation_` |
| Summary | `interview_summary_` |
| Follow-up | `interview_follow_up_` |
| Parking-lot item | `parking_lot_` |
| Candidate | `interview_candidate_` |
| Import receipt | `interview_import_` |

IDs are opaque, immutable, unique project-wide, and unrelated to wording, order, participant names, timestamps, or imported IDs.

## Question record

```json
{
  "question_id": "interview_question_<opaque>",
  "version_number": 1,
  "version_label": "1.0",
  "origin": "advisor-created",
  "topic_label": "Synthetic access control discussion",
  "prompt": "Describe how synthetic access decisions are reviewed.",
  "client_safe_explanation": "This question helps document the current process.",
  "rationale": "Clarify the current workflow.",
  "expected_participant_role_labels": ["System owner"],
  "applicability_note": "",
  "source_refs": [],
  "related_refs": [],
  "lifecycle": "active",
  "visibility": "client-safe",
  "supersedes_question_ref": null,
  "superseded_by_question_ref": null,
  "provenance": {},
  "created_at": "2026-08-04T00:00:00.000Z",
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

Origins:

- `scripted`
- `advisor-created`
- `source-derived`
- `suggested-follow-up`
- `prior-session-carryover`
- `imported-context`

Lifecycle:

- `draft`
- `active`
- `superseded`
- `archived`

Rules:

1. Question identity is independent of wording/order.
2. Governed wording changes after use create a new version and preserve supersession links.
3. Origin is rendered in Advisor/Reviewer views and accessibility text.
4. Suggested/source-derived/imported questions do not become active agenda items without explicit Advisor action.
5. Client-safe explanation is optional for Advisor-only questions but required before a question appears in Client Presentation Mode.
6. Source-derived/imported questions require traceable source/provenance refs.
7. Question text is bounded plain text; active markup and arbitrary nested data are rejected.

## Session plan

```json
{
  "plan_id": "interview_plan_<opaque>",
  "title": "Synthetic discovery session",
  "purpose": "Review current synthetic process context.",
  "facilitator_label": "Advisor",
  "expected_participant_refs": ["participant_<opaque>"],
  "expected_role_labels": ["System owner"],
  "planned_start": "2026-08-10T13:00:00.000Z",
  "planned_duration_minutes": 60,
  "items": [],
  "lifecycle": "draft",
  "currency_state": "current",
  "visibility": "client-safe",
  "snapshot_hash": null,
  "published_at": null,
  "provenance": {},
  "created_at": "2026-08-04T00:00:00.000Z",
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

### Plan item

```json
{
  "plan_item_id": "interview_plan_item_<opaque>",
  "order": 1,
  "question_ref": "interview_question_<opaque>",
  "question_version_number": 1,
  "question_snapshot": {
    "prompt": "Describe how synthetic access decisions are reviewed.",
    "client_safe_explanation": "This question helps document the current process.",
    "origin": "advisor-created",
    "topic_label": "Synthetic access control discussion",
    "source_refs": []
  },
  "included": true,
  "expected_participant_refs": [],
  "expected_role_labels": ["System owner"],
  "estimated_minutes": 8,
  "applicability_note": "",
  "advisor_rationale": "",
  "visibility": "client-safe"
}
```

Plan lifecycle:

- `draft`
- `published`
- `superseded`
- `archived`

Currency states:

- `current`
- `stale`
- `conflict`
- `superseded`
- `unsupported`

Rules:

1. A published plan stores deterministic exact question snapshots and a canonical snapshot hash; the hash is not a signature.
2. Plan order uses unique positive integers and stable item IDs.
3. Editing a question never rewrites a published plan.
4. Current question versions are compared to snapshots at plan review/start. Differences create stale/conflict state.
5. Start from stale/conflict requires explicit acknowledgement/retain or a newly published snapshot according to command rules.
6. Refresh creates a new plan version/snapshot and preserves the prior plan.
7. Drag/reorder requires keyboard move alternatives and one history transaction.

## Session

```json
{
  "session_id": "interview_session_<opaque>",
  "plan_ref": "interview_plan_<opaque>",
  "plan_snapshot_hash": "<sha256-of-canonical-plan-snapshot>",
  "title": "Synthetic discovery session",
  "purpose": "Review synthetic process context.",
  "facilitator_label": "Advisor",
  "attendee_participant_refs": ["participant_<opaque>"],
  "attendee_display_labels": ["Synthetic system owner"],
  "scheduled_start": "2026-08-10T13:00:00.000Z",
  "actual_start": null,
  "actual_end": null,
  "lifecycle": "planned",
  "post_session_review_state": "not-started",
  "active_session_question_ref": null,
  "elapsed_seconds_hint": 0,
  "start_snapshot": null,
  "pause_state": null,
  "visibility": "client-safe",
  "supersedes_session_ref": null,
  "superseded_by_session_ref": null,
  "provenance": {},
  "created_at": "2026-08-04T00:00:00.000Z",
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

Lifecycle:

- `planned`
- `ready`
- `in-progress`
- `paused`
- `completed`
- `cancelled`
- `superseded`

Post-session review states:

- `not-started`
- `pending`
- `in-review`
- `reviewed`
- `changes-requested`
- `closed`

Transition rules:

1. Planned may become Ready, Cancelled, or Superseded.
2. Ready may become In progress, Planned, Cancelled, or Superseded.
3. In progress may become Paused, Completed, or Cancelled.
4. Paused may become In progress, Completed, or Cancelled.
5. Completed/Cancelled/Superseded are terminal except creation of a new linked session.
6. At most one session is In progress or Paused per project.
7. `completed` means meeting ended only; it does not approve summaries/candidates or close unresolved work.

### Start snapshot

Starting records exact plan/version/hash, ordered session-question snapshots, attendee refs/labels, facilitator, start timestamp, selected profile label, and initial active question. It is immutable.

Start fails without mutation when plan identity, refs, limits, stale-plan acknowledgement, or single-active-session validation fails. Successful Start creates a named checkpoint/history event.

### Pause/resume

Pause atomically validates and commits current participant-statement draft, advisor-note draft, current question, live agenda order, unresolved markers, elapsed hint, and lifecycle. It creates a named checkpoint. Invalid drafts block Pause with a clear no-mutation error.

Pause does not publish candidates, approve summaries, confirm statements, close follow-ups, or mark questions answered automatically.

Resume restores the same session and active question from governed state. Presentation-only drawer/inspector arrangement may restore as a safe local preference, not authority. Resume cannot duplicate drafts or elapsed time.

### Complete/cancel

Complete records end time, lifecycle Completed, post-session review Pending, unresolved/deferred/skipped question state, and checkpoint/history. Cancel records rationale and preserves captured content. Neither deletes statements/notes nor publishes candidates/summaries.

## Session question

```json
{
  "session_question_id": "session_question_<opaque>",
  "session_ref": "interview_session_<opaque>",
  "plan_item_ref": "interview_plan_item_<opaque>",
  "order": 1,
  "question_ref": "interview_question_<opaque>",
  "question_version_number": 1,
  "question_snapshot": {},
  "origin": "advisor-created",
  "state": "upcoming",
  "statement_refs": [],
  "advisor_note_refs": [],
  "follow_up_refs": [],
  "unresolved": false,
  "disposition_rationale": "",
  "created_at": "2026-08-10T13:00:00.000Z",
  "updated_at": "2026-08-10T13:00:00.000Z"
}
```

States:

- `upcoming`
- `current`
- `answered`
- `deferred`
- `skipped`
- `closed`

Rules:

- exactly zero or one Current question per active/paused session;
- Next/Previous changes navigation only and does not imply answer quality, confirmation, review, or conclusion;
- progress is factual question counts, not a quality/readiness score;
- Ask Now/accepted follow-up creates an explicit session-question with origin/provenance and deterministic order;
- skip/defer rationale is preserved where required;
- orphan refs, duplicate positions, mixed session refs, or invalid transitions are rejected.

## Participant statement

```json
{
  "statement_id": "participant_statement_<opaque>",
  "session_ref": "interview_session_<opaque>",
  "session_question_ref": "session_question_<opaque>",
  "asserted_participant_ref": "participant_<opaque>",
  "asserted_speaker_label": "Synthetic system owner",
  "recording_method": "facilitator-entered",
  "text": "Synthetic participant statement.",
  "lifecycle": "active",
  "review_state": "pending",
  "visibility": "client-safe",
  "supersedes_statement_ref": null,
  "superseded_by_statement_ref": null,
  "provenance": {},
  "created_at": "2026-08-10T13:05:00.000Z",
  "updated_at": "2026-08-10T13:05:00.000Z"
}
```

Recording methods:

- `facilitator-entered`
- `participant-entered`
- `read-back-and-accepted`
- `imported-context`
- `other-locally-asserted`

Lifecycle:

- `draft`
- `active`
- `superseded`
- `archived`

Rules:

1. Statement is separate from advisor note, confirmation, summary, and candidate.
2. Participant identity is locally asserted and references Engagement where available.
3. Imported context remains imported context and never masquerades as direct live testimony.
4. A statement used by confirmation/summary/candidate is versioned/superseded rather than silently overwritten.
5. Text is bounded plain text; active content is rejected.
6. Confirmation binds to an exact statement/version.

## Advisor note

```json
{
  "advisor_note_id": "advisor_note_<opaque>",
  "session_ref": "interview_session_<opaque>",
  "session_question_ref": "session_question_<opaque>",
  "kind": "observation",
  "title": "Synthetic advisor observation",
  "text": "Advisor-only synthetic note.",
  "visibility": "advisor-only",
  "lifecycle": "active",
  "provenance": {},
  "created_at": "2026-08-10T13:06:00.000Z",
  "updated_at": "2026-08-10T13:06:00.000Z"
}
```

Note kinds:

- `observation`
- `interpretation`
- `facilitation-note`
- `source-concern`
- `internal-follow-up`
- `responsibility-discussion`
- `other`

Rules:

1. `visibility` is exactly `advisor-only`; no v0.5 command escalates it.
2. Client projections/search/counts/DOM/inspector/history summaries/focus/a11y tree exclude notes before construction.
3. Reviewer receives notes only when explicitly included in assigned review scope.
4. A note cannot be a participant statement or confirmation target.
5. Client-visible content derived from a note requires a separate summary/candidate with source refs and review.

## Confirmation

```json
{
  "confirmation_id": "interview_confirmation_<opaque>",
  "session_ref": "interview_session_<opaque>",
  "confirmed_record_kind": "participant-statement",
  "confirmed_record_ref": "participant_statement_<opaque>",
  "confirmed_record_version": 1,
  "asserted_confirmer_participant_ref": "participant_<opaque>",
  "asserted_confirmer_label": "Synthetic system owner",
  "method": "displayed-and-verbally-confirmed",
  "state": "confirmed",
  "detail": "Locally recorded facilitation confirmation; not an electronic signature.",
  "visibility": "client-safe",
  "provenance": {},
  "created_at": "2026-08-10T13:07:00.000Z"
}
```

Confirmed record kinds:

- `participant-statement`
- `client-visible-summary`

Methods:

- `displayed-and-verbally-confirmed`
- `read-back-and-confirmed`
- `participant-entered`
- `correction-requested`
- `explicitly-declined`
- `other-locally-asserted`

States:

- `pending`
- `confirmed`
- `correction-requested`
- `declined`
- `stale`
- `superseded`

Rules:

- binds exact record/version;
- editing/superseding target makes prior confirmation stale/superseded;
- correction/decline never renders as confirmed;
- no confirmation of advisor notes, hidden records, or unreviewed imported context as direct testimony;
- product copy never calls it authenticated signature, legal approval, or broad engagement approval.

## Summary

```json
{
  "summary_id": "interview_summary_<opaque>",
  "session_ref": "interview_session_<opaque>",
  "kind": "client-visible-session-summary",
  "title": "Synthetic session summary",
  "text": "Reviewed synthetic summary.",
  "source_statement_refs": [],
  "source_advisor_note_refs": [],
  "source_follow_up_refs": [],
  "lifecycle": "draft",
  "review_state": "pending",
  "visibility": "advisor-only",
  "supersedes_summary_ref": null,
  "superseded_by_summary_ref": null,
  "provenance": {},
  "created_at": "2026-08-10T14:00:00.000Z",
  "updated_at": "2026-08-10T14:00:00.000Z"
}
```

Summary kinds:

- `facilitator-summary`
- `client-visible-session-summary`
- `topic-summary`
- `unresolved-interpretation`
- `other`

Lifecycle:

- `draft`
- `proposed`
- `reviewed`
- `approved-for-client-presentation`
- `superseded`
- `archived`

Rules:

1. Summary references all source records used.
2. It never replaces/deletes source statements or notes.
3. Generated/facilitator summaries start Draft/Pending.
4. Client approval requires explicit review, permitted visibility, and source traceability.
5. Session completion does not approve summaries.
6. Hidden source-note content cannot leak through titles, snippets, provenance metadata, or accessibility names.

## Follow-up

```json
{
  "follow_up_id": "interview_follow_up_<opaque>",
  "session_ref": "interview_session_<opaque>",
  "session_question_ref": "session_question_<opaque>",
  "kind": "clarification",
  "title": "Clarify synthetic process ownership",
  "detail": "Follow up with the synthetic owner.",
  "owner_label": "Advisor",
  "due_date": "2026-08-15",
  "operational_state": "open",
  "related_refs": [],
  "visibility": "advisor-only",
  "provenance": {},
  "created_at": "2026-08-10T13:30:00.000Z",
  "updated_at": "2026-08-10T13:30:00.000Z"
}
```

Kinds:

- `question`
- `clarification`
- `evidence-reference-request`
- `action-proposal`
- `blocker-proposal`
- `responsibility-discussion`
- `decision-proposal`
- `meeting`
- `other`

Operational states:

- `open`
- `waiting`
- `blocked`
- `done`
- `cancelled`

Follow-ups remain Interview authority unless published as target candidates. End Session does not close them automatically.

## Parking-lot item

Contains stable ID, session/question refs, title/detail, deferral reason, intended destination/session, owner, due date, operational state, related refs, visibility, provenance, and timestamps. It remains open until explicit resolution/cancellation and is not silently closed by question/session completion.

## Candidate

```json
{
  "candidate_id": "interview_candidate_<opaque>",
  "source_refs": [],
  "target_domain": "engagement",
  "target_type": "open-question",
  "proposed_operation": "create",
  "proposed_fields": {},
  "rationale": "Synthetic interview follow-up.",
  "state": "awaiting-review",
  "target_candidate_ref": null,
  "target_decision_ref": null,
  "visibility": "advisor-only",
  "supersedes_candidate_ref": null,
  "superseded_by_candidate_ref": null,
  "provenance": {},
  "created_at": "2026-08-10T14:00:00.000Z",
  "updated_at": "2026-08-10T14:00:00.000Z"
}
```

Candidate targets:

- `engagement`
- `evidence`
- `scope`
- `practice-review`
- `ssp`
- `reviews-actions`

States:

- `draft`
- `awaiting-review`
- `published-to-target`
- `returned`
- `withdrawn`
- `superseded`
- `closed`

Rules:

- candidate creation changes only Interview authority;
- source refs identify exact record versions;
- implemented target publication invokes target-owned candidate command;
- source cannot manufacture target decision;
- unimplemented targets remain queued;
- session completion/confirmation/summary approval never implies target acceptance;
- proposed fields contain no unsupported conclusions.

## Meeting/context import receipt

Stores package kind/version/hash/size, source Evidence ref, registry version, disposition, created/modified/rejected refs, warnings, and timestamp. Package bytes are not retained.

`l2g_meeting_context_v1` and other registered supported context enter through strict preview/apply. Imported context remains imported context, may create staged question/agenda/context candidates, and never silently creates live participant statements, confirmations, summaries, findings, or decisions.

## Interview Mode projection

`l2g_interview_projection_v1` is generated at runtime and not stored as a second authority. It contains active profile, generated timestamp, session/plan/question refs, profile-filtered current question, agenda, statements, notes where permitted, context, follow-ups, save/recovery state, and factual progress/next work.

Client projection is built before render/count/search/inspector/focus/a11y work. It includes only selected current question, client-safe explanation, approved selected context, permitted client-visible response/confirmation, and agreed visible follow-up/summary. Hidden data contributes no counts/terms/snippets/empty states.

Projection objects are deep-cloned and recursively frozen.

## Search

Search is transient, profile-filtered first, never persisted, and rebuilt on project/profile/domain changes. Client search excludes advisor notes, hidden statements, imported-context internals, suggestions, candidates, internal provenance, conflicts, receipts, and hidden participant metadata. Profile switch clears stale results/queries/inspector before new render.

## Factual next work

Deterministic next work may include:

- plan missing required identity/items;
- plan stale/conflicting;
- session ready to start;
- active/paused session;
- interrupted/recovery decision;
- deferred/skipped/unresolved questions;
- unreviewed statements/interpretations;
- confirmations pending/correction requested/stale;
- post-session review pending;
- summaries awaiting review;
- open/overdue follow-ups;
- parking-lot items;
- awaiting/returned candidates;
- no-next-work state.

No quality score, readiness, compliance, sufficiency, risk, certification, implementation, or Met/Not Met.

## Commands and checkpoints

Commands include create/version/archive question; create/edit/publish/supersede plan; create/ready/start/pause/resume/complete/cancel/supersede session; navigate/reorder/defer/skip/close session question; create/revise/supersede statement/note/confirmation/summary; create/update/close follow-up/parking; preview/apply/reject import; create/publish/withdraw/supersede candidate; migration.

All validate cloned proposed state before commit. Start, Pause, Complete/Cancel, major import, and migration create named checkpoints. Undo/Redo cannot create two active sessions, multiple current questions, broken snapshots, dangling confirmations, advisor-note visibility escalation, or target accepted mutations.

## Migration

Opening v0.4 adds an empty domain and exact manifest entry with the shared v0.5 migration checkpoint/history. It infers no sessions/questions/statements/notes/summaries. v0.1-v0.3 migrate through existing paths. Failed migration leaves active state unchanged.

## Limits

Semantic caps:

- questions: 2,000;
- question versions represented as records: 4,000;
- plans: 250;
- plan items per plan: 250;
- sessions: 250;
- session questions: 10,000;
- participant statements: 20,000;
- advisor notes: 20,000;
- confirmations: 10,000;
- summaries: 2,000;
- follow-ups: 5,000;
- parking-lot items: 2,000;
- candidates: 5,000;
- import receipts: 250;
- attendees per session: 100;
- related refs per record: 200;
- title/label: 300 characters;
- prompt/explanation/rationale/detail: 8,000 characters;
- statement/note/summary text: 16,000 characters;
- flat proposed fields: 100 scalar fields and 64 KiB serialized.

The inherited 4 MiB domain-entry, 12 MiB expanded-project, and 16 MiB encrypted-envelope limits always prevail.

## Accessibility and responsive requirements

Interview Mode is keyboard-first. Current question, response editor, separate advisor-note editor, Previous/Next, Pause, End, agenda navigation, follow-up actions, profile switch, and inspector must have visible focus/accessibility names. Drag/reorder has button alternatives. Status uses text/icons, not color alone. Advisor path is usable at 1366×768, Client presentation at 1280×720, and tablet landscape through agenda/context drawers. Profile switch clears sensitive focus/editor state before Client render.

## Safety boundary

This contract introduces no audio/video capture, speech-to-text, automated transcription, meeting bots, authenticated attendance, electronic signatures, AI-generated answers/summaries, automatic question acceptance, automatic applicability, hidden scoring, Scope authority, Practice Review conclusions, SSP narratives, Deliverables, readiness, compliance, risk, evidence sufficiency, implementation conclusions, certification, or Met/Not Met.
