# `l2g_engagement_v1` Domain Contract v1

## Status

Accepted field and behavior contract for L2G Integrated Suite v0.3.0.

## Authority

The Engagement workspace owns `domains/engagement.json`. Other workspaces receive read-only projections and may create proposals through Reviews & Actions, but may not directly mutate Engagement records.

## Root shape

```json
{
  "schema_kind": "l2g_engagement_v1",
  "schema_version": "1.0",
  "engagement_id": "engagement_<opaque>",
  "identity": {},
  "participants": [],
  "organizations": [],
  "assumptions": [],
  "decisions": [],
  "open_questions": [],
  "constraints": [],
  "milestones": [],
  "blockers": [],
  "candidates": [],
  "projection_policy": {}
}
```

Unknown fields are rejected in governed records. JSON duplicate keys and prototype-pollution keys are rejected before schema validation.

## Identity

Required fields:

- `engagement_name` — editable display label;
- `client_name` — editable display label;
- `system_name` — system or program display label;
- `delivery_context` — short engagement delivery description;
- `objectives` — planning objectives, not assessment conclusions;
- `target_level` — `CMMC Level 2`, `CMMC Level 1`, `Other`, or `Not specified`;
- `phase` — one of the ADR-0008 phase states;
- `start_date` and `target_end_date` — ISO date or empty;
- `information_label` — `Synthetic`, `Public`, `Internal`, `FCI`, `CUI`, or `Unknown`;
- `lifecycle` — `accepted` for the canonical identity;
- `visibility` — presentation visibility value;
- `updated_at` — ISO timestamp.

`information_label` is locally asserted metadata and does not authorize repository or runtime handling of FCI or CUI. v0.3 fixtures and normal validation remain Synthetic only.

## Participants and organizations

Participants contain immutable `participant_id`; display name, role, organization reference, and contact reference; participation state `active`, `inactive`, or `superseded`; visibility; provenance; and created/updated timestamps.

Organizations contain immutable `organization_id`; name and relationship such as client, advisor, MSP, CSP, provider, assessor, or other; status, visibility, and provenance.

Contact references are plain-text synthetic references in v0.3. No external directory or authenticated identity is introduced.

## Assumptions, decisions, questions, and constraints

All records include immutable ID, title, detail, lifecycle/status, visibility, provenance, timestamps, and `related_refs`.

Additional rules:

- assumptions may be `open`, `confirmed`, `rejected`, or `superseded`;
- decisions may be `proposed`, `accepted`, `revised`, or `superseded` and require rationale when accepted or revised;
- questions may be `open`, `answered`, `deferred`, or `closed` and may reference an answer record;
- constraints may be `active`, `resolved`, `superseded`, or `archived`.

Relationships must point to existing records in the same Engagement document or to a registered external record reference. Dangling local references are rejected.

## Milestones and blockers

Milestones contain immutable ID; title, description, target date, owner label, workstream, and operational state; related record references; visibility and provenance.

Blockers contain immutable ID; title, detail, severity `low`, `medium`, `high`, or `critical`; operational state `open`, `waiting`, `resolved`, or `cancelled`; owner label, related references, visibility, and provenance.

Severity is a work-management label and is not an assessment risk score.

## Candidates

Candidate records contain:

- immutable `candidate_id`;
- source kind and immutable source reference;
- proposed target record type;
- proposed fields;
- candidate state `candidate`, `accepted`, `modified`, `rejected`, or `superseded`;
- rationale and decision metadata;
- optional `accepted_record_ref`;
- optional `supersedes_candidate_id` and `superseded_by_candidate_id`;
- provenance and visibility.

Rules:

1. creation does not modify accepted Engagement state;
2. Accept applies the proposed fields exactly through an Engagement-owned command;
3. Modify stores both the original proposal and accepted modification;
4. Reject preserves the proposal and rationale;
5. Supersede preserves both candidate records and their relationship;
6. a decided candidate cannot be decided again except by creating a new superseding candidate.

## Provenance

Provenance includes source kind, source ID, optional source label and location, asserted timestamp, asserted-by profile label, and confidence label `not-evaluated`, `low`, `medium`, or `high`.

Confidence is advisory metadata and is hidden from Client View.

## Workspace projections

A projection is generated at runtime and is not stored as a second authority. It contains:

- `projection_kind: l2g_engagement_projection_v1`;
- workspace and presentation profile;
- generated timestamp;
- source engagement ID and source record IDs;
- profile-filtered identity, participants, organizations, open questions, milestones, blockers, and next-work items.

Projection objects are deep-cloned and frozen before delivery to workspace renderers.

## Factual next-work rules

The ordered list may include:

1. required identity fields that are empty;
2. candidate records awaiting review;
3. critical or high open blockers;
4. blocked milestones;
5. overdue incomplete milestones;
6. open questions;
7. milestones due within 14 days;
8. no-next-work informational state.

The calculation must not infer readiness, compliance, evidence sufficiency, certification, or Met/Not Met.

## Limits

- participants: 200;
- organizations: 100;
- assumptions, decisions, questions, constraints, milestones, blockers, and candidates: 250 each;
- title/display fields: 200 characters;
- descriptive fields: 8,000 characters;
- related references per record: 50;
- total serialized Engagement domain: bounded by the existing archive entry limit.
