# `l2g_pre_engagement_v1` Contract v1

## Status

Field-level design contract for L2G Integrated Suite v0.5.0 Pre-Engagement. It becomes implementation authority when the reviewed design pull request merges.

This contract remains synthetic-only and does not authorize production, client, FCI, or CUI data.

## Purpose

Define the canonical Pre-Engagement domain that:

- manages requested intake without duplicating Engagement identity;
- preserves immutable questionnaire/inventory assignment snapshots;
- distinguishes requests, assignments, submissions, responses, exceptions, and candidates;
- distinguishes client-provided responses, advisor entry on behalf, source-derived candidates, imported context, and advisor interpretations;
- calculates factual Intake Completeness without readiness/compliance conclusions;
- consumes Engagement and Evidence through immutable projections;
- publishes candidates without mutating target-domain accepted state;
- supports strict low-authority compatibility imports;
- preserves encrypted project, recovery, history, checkpoints, and existing package contracts.

## Archive placement

The canonical domain is stored at:

```text
domains/pre-engagement.json
```

The conceptual v0.5 governed payload includes:

```text
manifest.json
domains/engagement.json
domains/evidence-index.json
domains/pre-engagement.json
domains/interview-sessions.json
domains/reviews-actions.json
history/events.ndjson
history/checkpoints.json
compatibility/current-registry.json
integrity/sha256-manifest.json
```

Original evidence files, package bytes, browser file handles, local paths, audio/video, and unbounded raw questionnaire exports are not stored.

## Root shape

```json
{
  "schema_kind": "l2g_pre_engagement_v1",
  "schema_version": "1.0",
  "pre_engagement_id": "pre_engagement_<opaque>",
  "requests": [],
  "instruments": [],
  "assignments": [],
  "submissions": [],
  "responses": [],
  "exceptions": [],
  "candidates": [],
  "import_receipts": [],
  "projection_policy": {
    "client_visible_values": ["client-safe", "approved-for-client-presentation"],
    "search_index_persistence": "none",
    "client_include_internal_provenance": false,
    "client_include_candidates": false,
    "client_include_exceptions": false
  }
}
```

Exact top-level keys are required. Unknown keys are rejected.

## Shared rules

### Visibility

- `advisor-only`
- `client-safe`
- `approved-for-client-presentation`

### Lifecycle

Unless narrowed by a record type:

- `draft`
- `active`
- `superseded`
- `archived`

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
  "source_label": "Synthetic intake preparation",
  "source_location_ref": null,
  "asserted_at": "2026-08-04T00:00:00.000Z",
  "asserted_by": "advisor",
  "confidence": "not-evaluated"
}
```

Rules:

- required: `source_kind`, `source_id`, `asserted_at`, `asserted_by`, `confidence`;
- optional/nullable: `source_label`, `source_location_ref`;
- `asserted_by` is `advisor`, `client`, `reviewer`, `migration`, `system`, or `import`;
- confidence is `not-evaluated`, `low`, `medium`, or `high`;
- asserted labels are local workflow metadata, not authenticated identity;
- confidence never establishes correctness, sufficiency, or assessment conclusions.

### Stable IDs

| Record | Prefix |
|---|---|
| Root | `pre_engagement_` |
| Intake request | `intake_request_` |
| Instrument | `intake_instrument_` |
| Instrument item | `intake_item_` |
| Assignment | `intake_assignment_` |
| Submission | `intake_submission_` |
| Response | `intake_response_` |
| Exception/conflict | `intake_exception_` |
| Candidate | `pre_engagement_candidate_` |
| Import receipt | `pre_engagement_import_` |

IDs are opaque, immutable, unique project-wide, and unrelated to wording, position, participant names, imported IDs, or timestamps.

## Intake request

```json
{
  "request_id": "intake_request_<opaque>",
  "kind": "questionnaire",
  "title": "Synthetic foundational questionnaire",
  "description": "Requested pre-engagement context.",
  "owner_label": "Advisor",
  "participant_refs": ["participant_<opaque>"],
  "organization_refs": ["organization_<opaque>"],
  "due_date": "2026-08-12",
  "operational_state": "requested",
  "lifecycle": "active",
  "review_state": "pending",
  "visibility": "client-safe",
  "related_refs": [],
  "provenance": {},
  "created_at": "2026-08-04T00:00:00.000Z",
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

### Request kinds

- `questionnaire`
- `inventory`
- `document`
- `participant`
- `clarification`
- `evidence-reference`
- `other`

### Operational states

- `not-requested`
- `requested`
- `in-progress`
- `partially-received`
- `received`
- `needs-clarification`
- `satisfied`
- `cancelled`
- `superseded`

Rules:

1. State changes are explicit commands with history.
2. One received submission does not automatically satisfy every related request.
3. `satisfied` requires the contract-defined required assignments/submissions/responses to be present and reviewed or an explicit exception/rationale.
4. `cancelled` and `superseded` preserve rationale and prior links.
5. Participant/organization references resolve through the Engagement projection and never create or edit Engagement records.
6. Due dates are factual work-management metadata, not readiness indicators.

## Instrument

```json
{
  "instrument_id": "intake_instrument_<opaque>",
  "kind": "questionnaire",
  "title": "Synthetic organizational questionnaire",
  "version_label": "1.0",
  "version_number": 1,
  "lifecycle": "active",
  "visibility": "client-safe",
  "sections": [
    {
      "section_id": "section_<opaque>",
      "title": "Organization",
      "order": 1,
      "item_refs": ["intake_item_<opaque>"]
    }
  ],
  "items": [],
  "provenance": {},
  "created_at": "2026-08-04T00:00:00.000Z",
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

Instrument kinds:

- `questionnaire`
- `inventory`
- `checklist`
- `file-request`
- `participant-request`
- `mixed`

### Instrument item

```json
{
  "item_id": "intake_item_<opaque>",
  "section_ref": "section_<opaque>",
  "order": 1,
  "kind": "question",
  "prompt": "Describe the synthetic system boundary owner.",
  "client_safe_help": "Identify the role responsible for coordinating boundary information.",
  "value_type": "long-text",
  "required": true,
  "options": [],
  "applicability_note": "",
  "visibility": "client-safe",
  "source_refs": [],
  "provenance": {}
}
```

Item kinds:

- `question`
- `inventory-field`
- `check`
- `file-request`
- `participant-request`
- `instruction`
- `heading`

Value types:

- `none`
- `short-text`
- `long-text`
- `integer`
- `decimal`
- `boolean`
- `date`
- `single-select`
- `multi-select`
- `reference-list`

Rules:

1. Published/assigned instrument content is immutable by version.
2. Editing after assignment creates a new instrument version; prior assignments retain snapshots.
3. Sections/items use stable IDs and deterministic order.
4. Options are bounded plain text with stable option values.
5. Executable markup, active HTML, data URIs, binary payloads, and arbitrary nested values are rejected.
6. Required/applicability conflicts and duplicate IDs/order positions are rejected.

## Assignment

```json
{
  "assignment_id": "intake_assignment_<opaque>",
  "request_ref": "intake_request_<opaque>",
  "instrument_ref": "intake_instrument_<opaque>",
  "instrument_version_number": 1,
  "snapshot": {
    "snapshot_hash": "<sha256-of-canonical-snapshot>",
    "title": "Synthetic organizational questionnaire",
    "items": []
  },
  "participant_refs": ["participant_<opaque>"],
  "organization_refs": ["organization_<opaque>"],
  "assigned_at": "2026-08-04T00:00:00.000Z",
  "due_date": "2026-08-12",
  "instructions": "Complete the synthetic questionnaire.",
  "operational_state": "requested",
  "currency_state": "current",
  "lifecycle": "active",
  "visibility": "client-safe",
  "provenance": {},
  "created_at": "2026-08-04T00:00:00.000Z",
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

Currency states:

- `current`
- `stale`
- `conflict`
- `superseded`
- `unsupported`

Rules:

1. Snapshot includes exact presented item IDs, wording, options, order, required flags, and version identity.
2. Snapshot hash uses deterministic canonical JSON and is not a digital signature.
3. Instrument changes never rewrite assignment snapshots or prior responses.
4. Reassignment/extension/cancellation/supersession are explicit commands with rationale.
5. Invalid participants, mixed versions, duplicate item order, or missing item refs are rejected.

## Submission

```json
{
  "submission_id": "intake_submission_<opaque>",
  "assignment_ref": "intake_assignment_<opaque>",
  "request_ref": "intake_request_<opaque>",
  "receipt_method": "local-entry",
  "asserted_submitter_participant_ref": "participant_<opaque>",
  "asserted_submitter_label": "Synthetic client representative",
  "received_at": "2026-08-05T00:00:00.000Z",
  "response_refs": ["intake_response_<opaque>"],
  "review_state": "pending",
  "lifecycle": "active",
  "visibility": "client-safe",
  "provenance": {},
  "created_at": "2026-08-05T00:00:00.000Z",
  "updated_at": "2026-08-05T00:00:00.000Z"
}
```

Receipt methods:

- `local-entry`
- `advisor-facilitated-entry`
- `imported-package`
- `meeting-context-import`
- `other`

Rules:

- asserted submitter identity is not authenticated;
- submission groups a receipt event and does not replace item-level responses;
- apply is atomic with one history event and named checkpoint for major imports/batches;
- rejected/cancelled/invalid previews create no governed submission.

## Response

```json
{
  "response_id": "intake_response_<opaque>",
  "submission_ref": "intake_submission_<opaque>",
  "assignment_ref": "intake_assignment_<opaque>",
  "item_ref": "intake_item_<opaque>",
  "item_version_number": 1,
  "origin": "client-provided",
  "value_type": "long-text",
  "value": "Synthetic response text.",
  "display_text": "Synthetic response text.",
  "currency_state": "current",
  "lifecycle": "active",
  "review_state": "pending",
  "visibility": "client-safe",
  "supersedes_response_ref": null,
  "superseded_by_response_ref": null,
  "related_source_refs": [],
  "provenance": {},
  "created_at": "2026-08-05T00:00:00.000Z",
  "updated_at": "2026-08-05T00:00:00.000Z"
}
```

Response origins:

- `client-provided`
- `advisor-entered-on-behalf`
- `source-derived-candidate`
- `imported-context`
- `advisor-interpretation`

Rules:

1. `client-provided` requires asserted submitter provenance and a permitted receipt method.
2. Advisor entry on behalf stays separately labeled.
3. Source-derived/imported/advisor interpretation never renders as a client answer.
4. Values must match the exact snapshot item type and option set.
5. Changes create new response versions/supersession when prior content was reviewed, used, confirmed, or depended on.
6. Response text is bounded plain text; nested arbitrary JSON and active content are rejected.
7. Conflicting current responses are exposed through an exception; no last-write-wins selection.

## Exception

```json
{
  "exception_id": "intake_exception_<opaque>",
  "kind": "conflicting-response",
  "title": "Conflicting synthetic responses",
  "detail": "Two current responses require review.",
  "affected_refs": [],
  "owner_label": "Advisor",
  "due_date": "",
  "operational_state": "open",
  "review_state": "pending",
  "visibility": "advisor-only",
  "resolution": null,
  "provenance": {},
  "created_at": "2026-08-05T00:00:00.000Z",
  "updated_at": "2026-08-05T00:00:00.000Z"
}
```

Exception kinds:

- `missing-submission`
- `incomplete-response`
- `conflicting-response`
- `ambiguous-source`
- `stale-assignment`
- `invalid-participant`
- `unsupported-import`
- `due-date`
- `traceability`
- `other`

Operational states:

- `open`
- `waiting`
- `blocked`
- `resolved`
- `cancelled`

Resolution preserves compared values/versions, rationale, disposition, and history. The interface supports explicit Keep, Create superseding response, Merge as new reviewed response, Defer, or Close as permitted. It never silently selects a newer timestamp.

## Candidate

```json
{
  "candidate_id": "pre_engagement_candidate_<opaque>",
  "source_refs": [],
  "target_domain": "engagement",
  "target_type": "open-question",
  "proposed_operation": "create",
  "proposed_fields": {},
  "rationale": "Synthetic intake follow-up.",
  "state": "awaiting-review",
  "target_candidate_ref": null,
  "target_decision_ref": null,
  "visibility": "advisor-only",
  "supersedes_candidate_ref": null,
  "superseded_by_candidate_ref": null,
  "provenance": {},
  "created_at": "2026-08-05T00:00:00.000Z",
  "updated_at": "2026-08-05T00:00:00.000Z"
}
```

Target domains:

- `engagement`
- `evidence`
- `scope`
- `practice-review`
- `ssp`
- `reviews-actions`

Proposed operations:

- `create`
- `modify`
- `link`
- `supersede`

Candidate states:

- `draft`
- `awaiting-review`
- `published-to-target`
- `returned`
- `withdrawn`
- `superseded`
- `closed`

Rules:

1. Candidate creation changes only Pre-Engagement.
2. Publication invokes an implemented target-owned candidate command.
3. Target accepted state does not change until target Accept/Modify.
4. Source domain cannot manufacture target decisions.
5. Unimplemented targets stay awaiting review and expose no false acceptance control.
6. Proposed fields are bounded flat JSON and cannot contain unsupported conclusions.

## Import receipt

```json
{
  "import_receipt_id": "pre_engagement_import_<opaque>",
  "package_kind": "l2g_intake_package_v1",
  "package_version": "1.0",
  "package_sha256": "<64-lowercase-hex>",
  "package_size_bytes": 1234,
  "source_evidence_ref": "evidence_<opaque>",
  "registry_version": "<version>",
  "disposition": "applied",
  "created_refs": [],
  "modified_refs": [],
  "rejected_rows": [],
  "warnings": [],
  "created_at": "2026-08-05T00:00:00.000Z"
}
```

Dispositions:

- `previewed`
- `applied`
- `applied-reviewed-subset`
- `rejected`
- `returned`
- `failed`

Rules:

- strict kind/version/registry/integrity/traceability validation precedes preview;
- package bytes are not retained;
- imported identifiers are provenance, not integrated IDs;
- apply is atomic;
- batch-level failure produces no partial mutation;
- imported answers retain origin and never become authenticated/client-provided automatically.

## Intake completeness projection

The persisted domain does not store an authoritative percentage. A runtime projection may report factual items such as:

- required assignments requested/received/reviewed;
- required item responses missing;
- requests partially received;
- overdue requests;
- responses needing clarification;
- unresolved conflicts/exceptions;
- source-derived candidates awaiting review;
- primary participant roles identified;
- first-session question plan prepared.

The projection includes transparent numerator/denominator inputs when it displays counts. It never labels the result readiness, compliance, assessment completeness, evidence sufficiency, risk, certification likelihood, or Met/Not Met.

## Projections

`l2g_pre_engagement_projection_v1` is generated at runtime and not stored as a second authority. It records workspace/profile, generated timestamp, source domain ID, source record IDs, profile-filtered records, and factual next work.

Projection objects are deep-cloned and recursively frozen before use. Hidden records do not contribute counts, terms, suggestions, snippets, empty states, inspector content, focus targets, or accessibility names.

## Factual next work

Deterministic ordering may include:

1. invalid/missing foundational request fields;
2. overdue required requests/assignments;
3. missing required submissions/responses;
4. needs-clarification items;
5. unresolved conflicts/exceptions;
6. stale assignments;
7. unreviewed imports/submissions;
8. awaiting/returned candidates;
9. upcoming due dates;
10. no-next-work informational state.

No item asserts readiness, compliance, evidence sufficiency, certification, risk, implementation, scoring, or Met/Not Met.

## Commands and transitions

Meaningful commands include create/update/archive request; create/version/archive instrument; assign/reassign/extend/cancel/supersede assignment; preview/apply/reject import; record/revise/supersede submission/response; open/resolve exception; create/publish/withdraw/supersede candidate; and migration.

Commands validate a cloned proposed state before committing. Batch assignment, major import, candidate publication, and migration use named checkpoints. Undo/Redo cannot break snapshots, references, or target authority.

## Migration

Opening a valid v0.4 project adds an empty domain and exact manifest entry, creates `Migration to v0.5 Pre-Engagement and Interview Sessions` checkpoint/history, and infers no intake records. v0.1-v0.3 use existing migrations first. Failed migration leaves active state unchanged.

## Limits

Semantic caps for v0.5 Pre-Engagement:

- requests: 500;
- instruments: 100;
- items across instruments: 5,000;
- items per instrument: 500;
- assignments: 1,000;
- submissions: 2,000;
- responses: 10,000;
- exceptions: 2,000;
- candidates: 5,000;
- import receipts: 250;
- option values per item: 200;
- related refs per record: 200;
- title/label: 300 characters;
- normal detail/prompt/help/response text: 8,000 characters;
- long response text: 16,000 characters;
- flat proposed fields: 100 scalar fields and 64 KiB serialized;
- tags: 50 values of 100 characters each.

The inherited 4 MiB domain-entry, 12 MiB expanded-project, and 16 MiB encrypted-envelope limits always prevail.

## Profile behavior

### Advisor

May create/edit requests, instruments, assignments, responses, exceptions, imports, completeness review, candidates, and provenance.

### Reviewer

Direct-edit read-only for governed Pre-Engagement content; may inspect differences/provenance and create review artifacts/dispositions when assigned.

### Client

Receives only explicit visible requests/assignments, client-facing prompts/help, permitted responses, clarification requests, and approved summaries/status. Client projection omits advisor interpretations, source-derived candidates, internal exceptions/conflicts, confidence, internal provenance, import metadata, hidden counts, target queues, and internal history.

## Safety boundary

This contract introduces no email/portal delivery, authenticated remote completion, accounts, collaboration, cloud sync, evidence parsing/OCR, Scope authority, Practice Review conclusions, SSP narratives, Deliverables, readiness, compliance, risk, evidence sufficiency, certification, scoring, implementation conclusions, or Met/Not Met.
