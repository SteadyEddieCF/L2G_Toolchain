# L2G Practice Review v1 — Field-Level Contract

## Status

Proposed field-level contract for the L2G Integrated Suite v0.7.0 design gate under issue #143 and ADR-0012. It becomes implementation authority only when the complete design package is reviewed and merged.

## Contract identity

- archive path: `domains/practice-review.json`
- schema kind: `l2g_practice_review_v1`
- schema version: `1.0`
- projection kind: `l2g_practice_review_projection_v1`
- projection version: `1.0`
- project kind: `l2g_project_v1`
- encrypted envelope kind/version: `l2g_encrypted_project_v1` / `1.0`

## Authority statement

Practice Review is authoritative only for facilitated review work records and their lifecycle. It is not authoritative for original Evidence, Scope boundary decisions, participant/organization identity, requirement-source text, accepted Reviews & Actions records, SSP narratives, Deliverables, or formal assessment findings.

The domain preserves distinct records for requirement identity, claims, imported context, Advisor observations, Evidence review, unresolved questions, gap observations, recommendations, actions, blockers, responsibility discussions, provider follow-up, review positions, and source/target receipts.

## Root document

```ts
interface PracticeReviewDomain {
  schema_kind: "l2g_practice_review_v1";
  schema_version: "1.0";
  practice_review_id: string;
  created_at: string;
  updated_at: string;
  revision: number;

  requirement_catalog: RequirementCatalogReference;
  plans: PracticeReviewPlan[];
  plan_versions: PracticeReviewPlanVersion[];
  sessions: PracticeReviewSession[];
  requirement_reviews: RequirementReview[];
  implementation_claims: ImplementationClaim[];
  imported_context: ImportedPracticeContext[];
  advisor_observations: AdvisorObservation[];
  evidence_reviews: EvidenceReview[];
  review_questions: ReviewQuestion[];
  gap_observations: GapObservation[];
  recommendation_candidates: RecommendationCandidate[];
  action_candidates: PracticeActionCandidate[];
  blockers: PracticeReviewBlocker[];
  responsibility_discussions: ResponsibilityDiscussion[];
  provider_follow_ups: ProviderFollowUp[];
  review_positions: PracticeReviewPosition[];
  target_candidates: PracticeReviewTargetCandidate[];
  publication_receipts: PracticeReviewPublicationReceipt[];
  import_receipts: PracticeReviewImportReceipt[];

  projection_policy: PracticeReviewProjectionPolicy;
}
```

## Stable identifier families

All identifiers are opaque, immutable, unique within a project, and generated independently of labels, list positions, requirement IDs, filenames, or imported source IDs.

| Family | Prefix |
|---|---|
| Practice Review domain | `practice-review_` |
| Plan | `practice-plan_` |
| Plan version | `practice-plan-version_` |
| Session | `practice-session_` |
| Requirement review | `requirement-review_` |
| Implementation claim | `implementation-claim_` |
| Imported context | `practice-imported-context_` |
| Advisor observation | `advisor-observation_` |
| Evidence review | `practice-evidence-review_` |
| Review question | `practice-question_` |
| Gap observation | `gap-observation_` |
| Recommendation candidate | `recommendation-candidate_` |
| Action candidate | `practice-action-candidate_` |
| Blocker | `practice-blocker_` |
| Responsibility discussion | `responsibility-discussion_` |
| Provider follow-up | `provider-follow-up_` |
| Review position | `practice-review-position_` |
| Target candidate | `practice-target-candidate_` |
| Publication receipt | `practice-publication-receipt_` |
| Import receipt | `practice-import-receipt_` |

Imported identifiers are stored in provenance records and never replace local IDs.

## Common record fields

```ts
interface PracticeReviewRecordBase {
  id: string;
  version: number;                    // integer >= 1
  label: string;                      // <= 500 characters
  description: string;                // <= 100,000 characters
  lifecycle: PracticeLifecycle;
  operational_state: PracticeOperationalState;
  review_state: PracticeReviewState;
  visibility: "advisor-only" | "client-safe" | "approved-for-client-presentation";
  currency_state: "current" | "stale" | "conflicted" | "unverified" | "superseded";
  provenance: PracticeProvenance;
  created_at: string;
  updated_at: string;
  created_by_profile: "advisor" | "client" | "reviewer" | "system-migration";
  updated_by_profile: "advisor" | "client" | "reviewer" | "system-migration";
  supersedes_id: string | null;
  superseded_by_id: string | null;
  tags: string[];                     // <= 100, each <= 200 characters
}
```

```ts
type PracticeLifecycle =
  | "draft"
  | "active"
  | "inactive"
  | "archived"
  | "superseded";

type PracticeOperationalState =
  | "not-started"
  | "in-progress"
  | "paused"
  | "blocked"
  | "waiting"
  | "complete"
  | "cancelled"
  | "not-applicable";

type PracticeReviewState =
  | "not-reviewed"
  | "pending"
  | "in-review"
  | "reviewed"
  | "changes-requested"
  | "rejected"
  | "closed";
```

Lifecycle, operational state, review state, visibility, currency, claim state, Evidence review state, review position, candidate state, and target receipt state remain separate dimensions.

## Provenance and exact references

```ts
interface PracticeVersionedRef {
  id: string;
  version: number;
}

interface RequirementRef {
  requirement_id: string;             // canonical identifier, e.g. practice ID
  catalog_kind: string;
  catalog_version: string;
  text_sha256: string;                // lowercase 64-character SHA-256
  display_title: string;              // qualified presentation copy only
}

interface PracticeProvenance {
  origin_kind:
    | "practice-review-local"
    | "requirement-catalog"
    | "engagement"
    | "evidence"
    | "scope"
    | "pre-engagement"
    | "interview-sessions"
    | "workshop-import"
    | "ssp-return-import"
    | "migration";
  source_refs: PracticeVersionedRef[];
  requirement_refs: RequirementRef[];
  package_ref: {
    package_kind: string;
    package_version: string;
    package_sha256: string;
    source_record_id: string;
  } | null;
  source_label: string;
  asserted_at: string;
  asserted_by: "advisor" | "client" | "reviewer" | "system" | "migration";
}
```

Every authority-bearing record retains its exact source versions. Display labels, requirement order, filename, package row, or text similarity never establish identity.

## Requirement catalog reference

```ts
interface RequirementCatalogReference {
  catalog_kind: string;
  catalog_version: string;
  catalog_sha256: string;
  requirement_count: 110;
  requirement_refs: RequirementRef[]; // exactly 110 unique requirement_id values
  loaded_at: string;
  source_label: string;
}
```

Rules:

- exactly 110 unique requirement references are required for the v0.7 CMMC Level 2 baseline;
- every requirement-linked record refers to one current catalog entry;
- the domain does not store an independently editable authoritative requirement text;
- changed catalog identity, version, count, or text fingerprint marks affected plans/reviews stale;
- prior plans and review history retain their original requirement refs;
- migration does not infer requirement reviews merely because the catalog exists.

## Plan and session records

### Practice Review plan

```ts
interface PracticeReviewPlan extends PracticeReviewRecordBase {
  current_plan_version_ref: string | null;
  session_refs: string[];
  purpose: string;
  owner_participant_ref: string | null;    // Engagement ref
  expected_participant_refs: string[];     // Engagement refs
  selected_requirement_ids: string[];
  grouping_mode: "domain" | "family" | "custom" | "all-110";
  source_candidate_refs: string[];
  client_label: string;
  plain_language_summary: string;
}
```

### Immutable plan version

```ts
interface PracticeReviewPlanVersion extends PracticeReviewRecordBase {
  plan_ref: string;
  plan_version_number: number;
  requirement_refs: RequirementRef[];
  ordered_requirement_ids: string[];
  related_scope_refs: PracticeVersionedRef[];
  related_evidence_refs: PracticeVersionedRef[];
  question_refs: PracticeVersionedRef[];
  expected_participant_refs: PracticeVersionedRef[];
  imported_context_refs: PracticeVersionedRef[];
  facilitation_notes: string;              // Advisor-only unless separately summarized
  frozen_at: string;
  frozen_by_profile: "advisor";
  stale_diagnostics: string[];
}
```

A started session references one immutable plan version. A changed plan creates a new version; it does not rewrite active or completed sessions.

### Practice Review session

```ts
interface PracticeReviewSession extends PracticeReviewRecordBase {
  plan_version_ref: string;
  session_state:
    | "planned"
    | "in-progress"
    | "paused"
    | "ended-pending-review"
    | "post-session-review"
    | "completed"
    | "cancelled"
    | "superseded";
  started_at: string | null;
  paused_at: string | null;
  resumed_at: string | null;
  ended_at: string | null;
  completed_at: string | null;
  current_requirement_id: string | null;
  current_requirement_index: number;
  attendee_refs: PracticeVersionedRef[];    // Engagement refs
  requirement_review_refs: string[];
  parking_lot_question_refs: string[];
  draft_record_refs: string[];
  post_session_queue_refs: string[];
  recovery_checkpoint_refs: string[];
}
```

Invariants:

- at most one session per project may be `in-progress` or `paused`;
- Start, Pause, Resume, End, and Complete append history events;
- Start, Pause, and End create named checkpoints;
- Pause/recovery preserves exact requirement position and valid drafts;
- End creates post-session-review work and publishes nothing;
- Complete requires every included draft to be explicitly retained, returned, rejected, superseded, or accepted into the appropriate Practice Review record family;
- completion is not an assessment outcome.

## Requirement review

```ts
interface RequirementReview extends PracticeReviewRecordBase {
  requirement_ref: RequirementRef;
  review_cycle_id: string;
  plan_version_ref: string | null;
  session_refs: string[];
  claim_refs: string[];
  imported_context_refs: string[];
  advisor_observation_refs: string[];
  evidence_review_refs: string[];
  question_refs: string[];
  gap_observation_refs: string[];
  recommendation_candidate_refs: string[];
  action_candidate_refs: string[];
  blocker_refs: string[];
  responsibility_discussion_refs: string[];
  provider_follow_up_refs: string[];
  current_position_ref: string | null;
  prior_position_refs: string[];
  source_currency_state: "current" | "stale-requirement" | "stale-evidence" | "stale-scope" | "conflicted" | "unverified";
  client_label: string;
  plain_language_summary: string;
}
```

There may be multiple historical reviews for the same requirement across review cycles. Within one review cycle, exactly one active `RequirementReview` may exist for a given requirement ID.

## Implementation claims

```ts
interface ImplementationClaim extends PracticeReviewRecordBase {
  requirement_review_ref: string;
  claim_origin:
    | "participant-statement"
    | "client-submission"
    | "pre-engagement-response"
    | "interview-statement"
    | "workshop-import"
    | "provider-statement"
    | "advisor-entered-attribution";
  statement: string;
  asserted_participant_ref: PracticeVersionedRef | null;
  asserted_provider_scope_ref: PracticeVersionedRef | null;
  source_statement_ref: PracticeVersionedRef | null;
  claim_state:
    | "recorded"
    | "confirmed-locally"
    | "disputed"
    | "clarification-needed"
    | "withdrawn"
    | "superseded";
  confirmation_ref: PracticeVersionedRef | null;
  advisor_note: string;                      // always Advisor-only
  client_label: string;
  plain_language_summary: string;
}
```

A claim records what was asserted. It does not establish implementation, applicability, responsibility, effectiveness, compliance, or sufficiency.

## Imported context

```ts
interface ImportedPracticeContext extends PracticeReviewRecordBase {
  requirement_review_ref: string | null;
  package_kind: string;
  package_version: string;
  package_sha256: string;
  source_record_id: string;
  context_kind:
    | "workshop-practice-record"
    | "workshop-note"
    | "workshop-key-finding"
    | "workshop-recommendation"
    | "workshop-action"
    | "workshop-blocker"
    | "workshop-provider-context"
    | "ssp-return-context"
    | "other";
  original_status_label: string;
  normalized_text: string;
  mapping_diagnostics: string[];
  conversion_state:
    | "imported-context-only"
    | "candidate-created"
    | "rejected"
    | "returned"
    | "superseded";
  converted_target_refs: string[];
}
```

Imported context never becomes a claim, observation, gap, recommendation, action, blocker, review position, or target record without an explicit conversion command.

## Advisor observations

```ts
interface AdvisorObservation extends PracticeReviewRecordBase {
  requirement_review_ref: string;
  observation_kind:
    | "facilitation-note"
    | "implementation-observation"
    | "evidence-observation"
    | "scope-observation"
    | "responsibility-observation"
    | "consistency-observation"
    | "follow-up-observation"
    | "other";
  observation: string;
  basis_refs: PracticeVersionedRef[];
  analysis_state: "draft" | "reviewed" | "superseded" | "archived";
  client_summary_ref: PracticeVersionedRef | null;
}
```

Advisor observations are always Advisor-only. Client-visible summaries are separate reviewed records; changing an observation does not silently update a summary.

## Evidence review

```ts
interface EvidenceReview extends PracticeReviewRecordBase {
  requirement_review_ref: string;
  evidence_ref: PracticeVersionedRef;
  source_revision_sha256: string;
  review_status:
    | "not-requested"
    | "requested"
    | "linked-unreviewed"
    | "reviewed-relevant"
    | "reviewed-not-relevant"
    | "reviewed-follow-up-needed"
    | "unavailable"
    | "stale-source-revision"
    | "superseded";
  reviewed_at: string | null;
  reviewed_by_profile: "advisor" | "reviewer" | null;
  relevance_note: string;
  follow_up_question_refs: string[];
  evidence_request_candidate_ref: string | null;
  client_label: string;
  plain_language_summary: string;
}
```

Forbidden Evidence review fields include sufficient, insufficient, adequate, effective, proves implementation, satisfies, Met, Not Met, readiness, compliance, and numeric coverage scores.

## Review questions

```ts
interface ReviewQuestion extends PracticeReviewRecordBase {
  requirement_review_ref: string | null;
  question_origin:
    | "advisor"
    | "scope-unknown"
    | "evidence-follow-up"
    | "pre-engagement"
    | "interview"
    | "workshop-import"
    | "provider-follow-up";
  prompt: string;
  rationale: string;
  expected_participant_refs: PracticeVersionedRef[];
  related_scope_refs: PracticeVersionedRef[];
  related_evidence_refs: PracticeVersionedRef[];
  question_state:
    | "candidate"
    | "planned"
    | "asked"
    | "answered-unreviewed"
    | "reviewed"
    | "returned"
    | "withdrawn"
    | "superseded"
    | "closed";
  response_claim_refs: string[];
  session_refs: string[];
}
```

No imported or generated question enters an active session automatically. Advisor action is required to plan and order it.

## Gap observations

```ts
interface GapObservation extends PracticeReviewRecordBase {
  requirement_review_ref: string;
  gap_kind:
    | "description-missing"
    | "claim-conflict"
    | "evidence-follow-up"
    | "scope-follow-up"
    | "responsibility-follow-up"
    | "process-observation"
    | "technology-observation"
    | "documentation-observation"
    | "other";
  statement: string;
  basis_refs: PracticeVersionedRef[];
  qualification: "advisor-observation-not-formal-finding";
  gap_state:
    | "draft"
    | "proposed"
    | "reviewed"
    | "returned"
    | "rejected"
    | "withdrawn"
    | "superseded"
    | "closed";
  target_candidate_refs: string[];
  client_label: string;
  plain_language_summary: string;
}
```

`GapObservation` is not a formal assessment finding and cannot use formal finding identifiers or Met/Not Met semantics.

## Recommendations, actions, and blockers

```ts
interface RecommendationCandidate extends PracticeReviewRecordBase {
  requirement_review_ref: string;
  statement: string;
  rationale: string;
  basis_refs: PracticeVersionedRef[];
  recommendation_state:
    | "draft"
    | "proposed"
    | "reviewed"
    | "returned"
    | "rejected"
    | "withdrawn"
    | "superseded"
    | "closed";
  target_candidate_ref: string | null;
  client_label: string;
  plain_language_summary: string;
}

interface PracticeActionCandidate extends PracticeReviewRecordBase {
  requirement_review_ref: string | null;
  action_kind:
    | "evidence-request"
    | "clarification"
    | "scope-review"
    | "provider-follow-up"
    | "process-update"
    | "technology-review"
    | "documentation-update"
    | "ssp-input"
    | "other";
  action_statement: string;
  owner_participant_ref: PracticeVersionedRef | null;
  due_at: string | null;
  priority: "low" | "medium" | "high" | "critical";
  priority_is_workflow_only: true;
  action_state:
    | "draft"
    | "proposed"
    | "published-candidate"
    | "target-accepted"
    | "target-returned"
    | "target-rejected"
    | "withdrawn"
    | "superseded"
    | "closed";
  target_candidate_ref: string | null;
}

interface PracticeReviewBlocker extends PracticeReviewRecordBase {
  requirement_review_ref: string | null;
  blocker_kind:
    | "missing-participant"
    | "missing-evidence"
    | "scope-unknown"
    | "provider-dependency"
    | "conflicting-claim"
    | "stale-source"
    | "technical-error"
    | "other";
  statement: string;
  blocking_effect:
    | "none"
    | "blocks-question"
    | "blocks-review-position"
    | "blocks-session-completion"
    | "blocks-publication";
  owner_ref: PracticeVersionedRef | null;
  due_at: string | null;
  blocker_state:
    | "open"
    | "investigating"
    | "waiting"
    | "resolved-unreviewed"
    | "resolved"
    | "wont-resolve"
    | "superseded";
  resolution_summary: string;
  resolving_record_refs: PracticeVersionedRef[];
}
```

Priority and blocker labels are workflow controls only. They are not risk scores.

## Responsibility discussions and provider follow-up

```ts
interface ResponsibilityDiscussion extends PracticeReviewRecordBase {
  requirement_review_ref: string;
  related_scope_refs: PracticeVersionedRef[];
  discussion_origin: "participant" | "provider" | "scope-context" | "workshop-import" | "advisor";
  asserted_responsibility:
    | "client-claim"
    | "provider-claim"
    | "shared-claim"
    | "inherited-claim"
    | "unassigned"
    | "disputed"
    | "not-applicable-claim";
  statement: string;
  source_statement_refs: PracticeVersionedRef[];
  responsibility_state:
    | "recorded"
    | "clarification-needed"
    | "reviewed-context"
    | "returned"
    | "withdrawn"
    | "superseded";
  scope_candidate_ref: string | null;
}

interface ProviderFollowUp extends PracticeReviewRecordBase {
  requirement_review_ref: string | null;
  provider_scope_ref: PracticeVersionedRef;
  question_ref: string | null;
  requested_information: string;
  requested_evidence_types: string[];
  due_at: string | null;
  follow_up_state:
    | "draft"
    | "requested"
    | "waiting"
    | "response-imported-unreviewed"
    | "reviewed"
    | "returned"
    | "withdrawn"
    | "superseded"
    | "closed";
  response_context_refs: string[];
  target_candidate_refs: string[];
}
```

Provider authorization, contract, inheritance, or responsibility context does not automatically establish practice implementation.

## Practice Review position

```ts
interface PracticeReviewPosition extends PracticeReviewRecordBase {
  requirement_review_ref: string;
  position:
    | "not-recorded"
    | "implementation-described"
    | "implementation-partially-described"
    | "implementation-not-described"
    | "conflicting-claims"
    | "evidence-follow-up-needed"
    | "scope-or-responsibility-follow-up-needed"
    | "not-applicable-claim-recorded"
    | "reviewed-no-position"
    | "superseded";
  rationale: string;
  source_basis_refs: PracticeVersionedRef[];
  claim_refs: string[];
  observation_refs: string[];
  evidence_review_refs: string[];
  gap_observation_refs: string[];
  question_refs: string[];
  blocker_refs: string[];
  recorded_at: string;
  recorded_by_profile: "advisor" | "reviewer";
  reviewer_disposition:
    | "not-requested"
    | "pending"
    | "concur"
    | "concur-with-changes"
    | "return"
    | "reject";
  reviewer_comment: string;
  client_safe_rationale: string;
  supersedes_position_ref: string | null;
  superseded_by_position_ref: string | null;
}
```

Rules:

- exactly one current non-superseded position may exist per active requirement review;
- creating or editing claims, Evidence reviews, observations, gaps, questions, blockers, requirement refs, Scope refs, or basis refs makes an affected current position stale;
- stale positions remain historical and require explicit compare/supersede;
- Reviewer concurrence does not create a formal assessment outcome;
- position labels and copy always retain the Practice Review qualification.

## Target candidates and publication receipts

```ts
interface PracticeReviewTargetCandidate extends PracticeReviewRecordBase {
  source_record_ref: PracticeVersionedRef;
  source_family:
    | "review-question"
    | "gap-observation"
    | "recommendation"
    | "action"
    | "blocker"
    | "provider-follow-up"
    | "review-position"
    | "evidence-review"
    | "responsibility-discussion";
  target_domain: "evidence" | "scope" | "interview-sessions" | "reviews-actions" | "ssp" | "deliverables";
  candidate_kind: string;
  proposed_values: Record<string, string>;
  candidate_state:
    | "received"
    | "in-review"
    | "accepted"
    | "modified-and-accepted"
    | "rejected"
    | "returned"
    | "withdrawn"
    | "superseded"
    | "closed";
  target_record_refs: string[];
  target_receipt_ref: string | null;
  decision_rationale: string;
  return_comment: string;
}

interface PracticeReviewPublicationReceipt extends PracticeReviewRecordBase {
  source_record_ref: PracticeVersionedRef;
  target_domain: string;
  target_candidate_ref: string;
  target_candidate_version: number;
  mirrored_target_state: string;
  target_record_refs: string[];
  receipt_state: "published" | "accepted" | "modified" | "returned" | "rejected" | "withdrawn" | "superseded" | "closed";
  validated_at: string;
}
```

The source cannot edit `mirrored_target_state` directly. Target commands validate exact source candidate/version, create target-owned state, and return a receipt. Cross-domain Undo/Redo cannot orphan either side.

## Compatibility import receipts

```ts
interface PracticeReviewImportReceipt extends PracticeReviewRecordBase {
  package_kind: string;
  package_version: string;
  package_release: string;
  package_name: string;
  package_size_bytes: number;
  package_sha256: string;
  producer: string;
  selected_record_ids: string[];
  rejected_record_ids: string[];
  returned_record_ids: string[];
  diagnostics: string[];
  status:
    | "previewed"
    | "applied"
    | "partially-applied-reviewed-subset"
    | "rejected"
    | "returned"
    | "failed-before-mutation"
    | "superseded";
  command_ref: string | null;
}
```

Package bytes, embedded workbook bytes, original Evidence, and private local paths are never retained in governed project state.

## Projection contract

```ts
interface PracticeReviewProjection {
  projection_kind: "l2g_practice_review_projection_v1";
  projection_version: "1.0";
  workspace: "practice-review";
  profile: "advisor" | "client" | "reviewer";
  generated_at: string;
  source_practice_review_id: string;
  source_revision: number;

  plans: PracticeReviewPlan[];
  sessions: PracticeReviewSession[];
  requirement_reviews: RequirementReview[];
  implementation_claims: ImplementationClaim[];
  imported_context: ImportedPracticeContext[];
  advisor_observations: AdvisorObservation[];
  evidence_reviews: EvidenceReview[];
  review_questions: ReviewQuestion[];
  gap_observations: GapObservation[];
  recommendation_candidates: RecommendationCandidate[];
  action_candidates: PracticeActionCandidate[];
  blockers: PracticeReviewBlocker[];
  responsibility_discussions: ResponsibilityDiscussion[];
  provider_follow_ups: ProviderFollowUp[];
  review_positions: PracticeReviewPosition[];
  target_candidates: PracticeReviewTargetCandidate[];

  counts: Record<string, number>;
  progress: PracticeReviewProgress;
  next_work: PracticeReviewNextWorkItem[];
  qualifications: string[];
}
```

### Advisor projection

Includes all permitted records, raw Advisor analysis, import diagnostics, source provenance, and candidate controls.

### Reviewer projection

Includes reviewable records and source context but is read-only except explicit Concur, Concur with changes, Return, and Reject commands on eligible Practice Review positions or proposals.

### Client projection

Includes only explicitly Client-visible records with family-specific `client_label` and `plain_language_summary`. It excludes:

- all `AdvisorObservation` records;
- Advisor-only fields embedded in any record;
- unreviewed imported context;
- rejected, returned, withdrawn, or superseded candidates unless a separately approved historical summary exists;
- internal package/path/diagnostic data;
- hidden record labels, snippets, counts, progress totals, group names, search terms, differences, focus targets, live-region announcements, or accessibility-tree text;
- provider/private participant metadata not separately approved for Client presentation.

Client progress and counts are calculated from the Client-safe projection only. Profiles are not access control or safe project distribution.

## Factual progress model

```ts
interface PracticeReviewProgress {
  visible_requirement_count: number;
  not_started_count: number;
  in_progress_count: number;
  paused_or_blocked_count: number;
  ended_pending_review_count: number;
  reviewed_with_position_count: number;
  reviewed_without_position_count: number;
  stale_count: number;
  open_question_count: number;
  open_blocker_count: number;
}
```

Progress reports workflow completion only. It must not calculate readiness, compliance, risk, score, coverage, evidence sufficiency, implementation effectiveness, Met, or Not Met.

## Next-work contract

Allowed next-work kinds:

- `session-preparation`;
- `requirement-review`;
- `claim-clarification`;
- `evidence-follow-up`;
- `scope-follow-up`;
- `provider-follow-up`;
- `question-review`;
- `gap-review`;
- `recommendation-review`;
- `action-review`;
- `blocker-resolution`;
- `position-review`;
- `stale-reference-review`;
- `post-session-review`;
- `target-receipt-review`;
- `import-review`;
- `informational`.

Priority is a workflow ordering value only. Next-work copy cannot use readiness, compliance, risk, score, certification, sufficiency, effectiveness, Met, or Not Met language.

## Semantic limits

Inherited project/archive limits remain unchanged. Domain limits:

| Collection | Maximum |
|---|---:|
| Plans | 100 |
| Plan versions | 500 |
| Sessions | 1,000 |
| Requirement reviews | 11,000 |
| Implementation claims | 50,000 |
| Imported context records | 50,000 |
| Advisor observations | 50,000 |
| Evidence reviews | 100,000 |
| Review questions | 50,000 |
| Gap observations | 50,000 |
| Recommendation candidates | 50,000 |
| Action candidates | 50,000 |
| Blockers | 25,000 |
| Responsibility discussions | 50,000 |
| Provider follow-ups | 25,000 |
| Review positions | 25,000 |
| Target candidates | 50,000 |
| Publication receipts | 100,000 |
| Import receipts | 1,000 |

Additional limits:

- exactly 110 current requirement refs;
- maximum 110 requirements in one plan version;
- maximum one active/paused session per project;
- maximum 500 source refs per record;
- maximum 10,000 selected records in one compatibility apply;
- maximum dependency/traversal depth 64;
- maximum plain-text field 100,000 characters unless a stricter family limit applies;
- maximum imported package bytes and expanded archive bytes inherit the current project/package caps;
- no embedded original Evidence or workbook binaries.

All limits are enforced before governed-state mutation.

## Semantic validation invariants

1. All IDs are unique and use the correct family prefix.
2. All local refs exist and point to an allowed family.
3. All exact refs contain valid versions; stale refs remain explicit rather than silently currentized.
4. Supersession links are reciprocal and acyclic.
5. Requirement catalog contains exactly 110 unique refs and valid SHA-256 fingerprints.
6. A requirement review references one current catalog requirement and one review cycle.
7. Only one active requirement review exists per requirement per review cycle.
8. Only one session is in-progress or paused.
9. A session plan version is immutable after session start.
10. Claims, imported context, observations, Evidence reviews, gaps, recommendations, actions, blockers, responsibility discussions, provider follow-ups, and positions remain separate records.
11. Advisor observations are always Advisor-only.
12. Client-visible family records require non-empty Client labels and plain-language summaries.
13. A current position is bound to exact basis versions and becomes stale when they change.
14. Conflicting current positions for one active requirement review are rejected.
15. Evidence review states cannot imply sufficiency, effectiveness, or implementation.
16. Gap observations retain `advisor-observation-not-formal-finding` qualification.
17. Workflow priority cannot be stored or rendered as a risk score.
18. Source publication cannot manufacture target acceptance.
19. Import preview and failed apply cause no governed-state mutation.
20. Prototype-pollution keys `__proto__`, `prototype`, and `constructor` are rejected at every depth.
21. Duplicate JSON keys are rejected at every depth.
22. Active HTML/script/SVG/event-handler content is rejected or normalized to inert plain text according to the field contract.
23. Unsupported conclusion vocabulary in authority-bearing fields is rejected.
24. Projection is built before every count, search, render, inspector, difference, history, focus, live-region, export, or accessibility operation.
25. Deterministic serialization order and semantic hashes are stable.

## Prohibited inference and conclusion rules

No command, import, calculation, helper, migration, display rule, or generated text may automatically infer:

- requirement applicability;
- implementation status or effectiveness;
- evidence authenticity, coverage, adequacy, or sufficiency;
- provider responsibility acceptance;
- formal gap/finding status;
- Met or Not Met;
- readiness or compliance;
- risk score or risk level;
- certification status or recommendation;
- assessment outcome.

Strings representing those concepts are permitted only in clearly quoted source/import context or a future separately authorized domain. They cannot populate authority-bearing Practice Review fields.

## Migration

A valid v0.1-v0.6 project receives:

- one empty Practice Review domain;
- current requirement-catalog identity only after successful exact catalog validation;
- one domain-index entry;
- one named checkpoint `Migration to v0.7 canonical Practice Review authority`;
- one history event stating that no plans, sessions, reviews, claims, Evidence review states, observations, gaps, recommendations, actions, blockers, provider follow-ups, positions, or conclusions were inferred.

Migration fails before replacement if the earlier project, requirement catalog, or resulting project is invalid.

## Explicit non-claims

This contract defines a facilitated Practice Review workflow. It does not authorize production, client, FCI, or CUI data and does not establish formal assessment, assessor identity, authenticated approval, chain of custody, applicability, implementation effectiveness, evidence sufficiency, Met/Not Met, readiness, compliance, risk, scoring, certification, or assessment outcome.