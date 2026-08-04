namespace L2G {
  export const INTERVIEW_SCHEMA_KIND = "l2g_interview_sessions_v1" as const;
  export const INTERVIEW_SCHEMA_VERSION = "1.0" as const;

  const QUESTION_ORIGINS = ["scripted", "advisor-created", "source-derived", "suggested-follow-up", "prior-session-carryover", "imported-context"] as const;
  const QUESTION_LIFECYCLES = ["draft", "active", "superseded", "archived"] as const;
  const PLAN_LIFECYCLES = ["draft", "published", "superseded", "archived"] as const;
  const PLAN_CURRENCY_STATES = ["current", "stale", "conflict", "superseded", "unsupported"] as const;
  const SESSION_LIFECYCLES = ["planned", "ready", "in-progress", "paused", "completed", "cancelled", "superseded"] as const;
  const POST_SESSION_REVIEW_STATES = ["not-started", "pending", "in-review", "reviewed", "changes-requested", "closed"] as const;
  const SESSION_QUESTION_STATES = ["upcoming", "current", "answered", "deferred", "skipped", "closed"] as const;
  const STATEMENT_METHODS = ["facilitator-entered", "participant-entered", "read-back-and-accepted", "imported-context", "other-locally-asserted"] as const;
  const RECORD_LIFECYCLES = ["draft", "active", "superseded", "archived"] as const;
  const ADVISOR_NOTE_KINDS = ["observation", "interpretation", "facilitation-note", "source-concern", "internal-follow-up", "responsibility-discussion", "other"] as const;
  const CONFIRMATION_TARGET_KINDS = ["participant-statement", "client-visible-summary"] as const;
  const CONFIRMATION_METHODS = ["displayed-and-verbally-confirmed", "read-back-and-confirmed", "participant-entered", "correction-requested", "explicitly-declined", "other-locally-asserted"] as const;
  const CONFIRMATION_STATES = ["pending", "confirmed", "correction-requested", "declined", "stale", "superseded"] as const;
  const SUMMARY_KINDS = ["facilitator-summary", "client-visible-session-summary", "topic-summary", "unresolved-interpretation", "other"] as const;
  const SUMMARY_LIFECYCLES = ["draft", "proposed", "reviewed", "approved-for-client-presentation", "superseded", "archived"] as const;
  const FOLLOW_UP_KINDS = ["question", "clarification", "evidence-reference-request", "action-proposal", "blocker-proposal", "responsibility-discussion", "decision-proposal", "meeting", "other"] as const;
  const FOLLOW_UP_STATES = ["open", "waiting", "blocked", "done", "cancelled"] as const;
  const INTERVIEW_TARGETS = ["engagement", "evidence", "scope", "practice-review", "ssp", "reviews-actions"] as const;
  const INTERVIEW_CANDIDATE_OPERATIONS = ["create", "modify", "link", "supersede"] as const;
  const INTERVIEW_IMPORT_DISPOSITIONS = ["previewed", "applied", "applied-reviewed-subset", "rejected", "returned", "failed"] as const;

  export type InterviewQuestionOrigin = typeof QUESTION_ORIGINS[number];
  export type InterviewQuestionLifecycle = typeof QUESTION_LIFECYCLES[number];
  export type InterviewPlanLifecycle = typeof PLAN_LIFECYCLES[number];
  export type InterviewPlanCurrency = typeof PLAN_CURRENCY_STATES[number];
  export type InterviewSessionLifecycle = typeof SESSION_LIFECYCLES[number];
  export type PostSessionReviewState = typeof POST_SESSION_REVIEW_STATES[number];
  export type SessionQuestionState = typeof SESSION_QUESTION_STATES[number];
  export type ParticipantStatementMethod = typeof STATEMENT_METHODS[number];
  export type InterviewRecordLifecycle = typeof RECORD_LIFECYCLES[number];
  export type AdvisorNoteKind = typeof ADVISOR_NOTE_KINDS[number];
  export type ConfirmationState = typeof CONFIRMATION_STATES[number];
  export type SummaryLifecycle = typeof SUMMARY_LIFECYCLES[number];
  export type FollowUpState = typeof FOLLOW_UP_STATES[number];
  export type InterviewTargetDomain = typeof INTERVIEW_TARGETS[number];

  export interface InterviewQuestionRecord {
    question_id: string;
    version_number: number;
    version_label: string;
    origin: InterviewQuestionOrigin;
    topic_label: string;
    prompt: string;
    client_safe_explanation: string;
    rationale: string;
    expected_participant_role_labels: string[];
    applicability_note: string;
    source_refs: string[];
    related_refs: string[];
    lifecycle: InterviewQuestionLifecycle;
    visibility: Visibility;
    supersedes_question_ref: string | null;
    superseded_by_question_ref: string | null;
    provenance: V05Provenance;
    created_at: string;
    updated_at: string;
  }

  export interface InterviewQuestionSnapshot {
    prompt: string;
    client_safe_explanation: string;
    origin: InterviewQuestionOrigin;
    topic_label: string;
    source_refs: string[];
  }

  export interface InterviewPlanItem {
    plan_item_id: string;
    order: number;
    question_ref: string;
    question_version_number: number;
    question_snapshot: InterviewQuestionSnapshot;
    included: boolean;
    expected_participant_refs: string[];
    expected_role_labels: string[];
    estimated_minutes: number;
    applicability_note: string;
    advisor_rationale: string;
    visibility: Visibility;
  }

  export interface InterviewPlanRecord {
    plan_id: string;
    title: string;
    purpose: string;
    facilitator_label: string;
    expected_participant_refs: string[];
    expected_role_labels: string[];
    planned_start: string | null;
    planned_duration_minutes: number;
    items: InterviewPlanItem[];
    lifecycle: InterviewPlanLifecycle;
    currency_state: InterviewPlanCurrency;
    visibility: Visibility;
    snapshot_hash: string | null;
    published_at: string | null;
    provenance: V05Provenance;
    created_at: string;
    updated_at: string;
  }

  export interface InterviewStartSnapshot {
    plan_ref: string;
    plan_snapshot_hash: string;
    plan_title: string;
    ordered_session_question_refs: string[];
    attendee_participant_refs: string[];
    attendee_display_labels: string[];
    facilitator_label: string;
    started_at: string;
    started_profile: PresentationProfile;
    initial_session_question_ref: string | null;
  }

  export interface InterviewPauseState {
    paused_at: string;
    active_session_question_ref: string | null;
    ordered_session_question_refs: string[];
    elapsed_seconds_hint: number;
    unresolved_session_question_refs: string[];
  }

  export interface InterviewSessionRecord {
    session_id: string;
    plan_ref: string;
    plan_snapshot_hash: string;
    title: string;
    purpose: string;
    facilitator_label: string;
    attendee_participant_refs: string[];
    attendee_display_labels: string[];
    scheduled_start: string | null;
    actual_start: string | null;
    actual_end: string | null;
    lifecycle: InterviewSessionLifecycle;
    post_session_review_state: PostSessionReviewState;
    active_session_question_ref: string | null;
    elapsed_seconds_hint: number;
    start_snapshot: InterviewStartSnapshot | null;
    pause_state: InterviewPauseState | null;
    visibility: Visibility;
    supersedes_session_ref: string | null;
    superseded_by_session_ref: string | null;
    provenance: V05Provenance;
    created_at: string;
    updated_at: string;
  }

  export interface InterviewSessionQuestionRecord {
    session_question_id: string;
    session_ref: string;
    plan_item_ref: string | null;
    order: number;
    question_ref: string;
    question_version_number: number;
    question_snapshot: InterviewQuestionSnapshot;
    origin: InterviewQuestionOrigin;
    state: SessionQuestionState;
    statement_refs: string[];
    advisor_note_refs: string[];
    follow_up_refs: string[];
    unresolved: boolean;
    disposition_rationale: string;
    visibility: Visibility;
    created_at: string;
    updated_at: string;
  }

  export interface ParticipantStatementRecord {
    statement_id: string;
    session_ref: string;
    session_question_ref: string;
    asserted_participant_ref: string | null;
    asserted_speaker_label: string;
    recording_method: ParticipantStatementMethod;
    text: string;
    version_number: number;
    lifecycle: InterviewRecordLifecycle;
    review_state: typeof V05_REVIEW_STATES[number];
    visibility: Visibility;
    supersedes_statement_ref: string | null;
    superseded_by_statement_ref: string | null;
    provenance: V05Provenance;
    created_at: string;
    updated_at: string;
  }

  export interface AdvisorNoteRecord {
    advisor_note_id: string;
    session_ref: string;
    session_question_ref: string;
    kind: AdvisorNoteKind;
    title: string;
    text: string;
    visibility: "advisor-only";
    lifecycle: InterviewRecordLifecycle;
    provenance: V05Provenance;
    created_at: string;
    updated_at: string;
  }

  export interface InterviewConfirmationRecord {
    confirmation_id: string;
    session_ref: string;
    confirmed_record_kind: typeof CONFIRMATION_TARGET_KINDS[number];
    confirmed_record_ref: string;
    confirmed_record_version: number;
    asserted_confirmer_participant_ref: string | null;
    asserted_confirmer_label: string;
    method: typeof CONFIRMATION_METHODS[number];
    state: ConfirmationState;
    detail: string;
    visibility: Visibility;
    provenance: V05Provenance;
    created_at: string;
  }

  export interface InterviewSummaryRecord {
    summary_id: string;
    session_ref: string;
    kind: typeof SUMMARY_KINDS[number];
    title: string;
    text: string;
    version_number: number;
    source_statement_refs: string[];
    source_advisor_note_refs: string[];
    source_follow_up_refs: string[];
    lifecycle: SummaryLifecycle;
    review_state: typeof V05_REVIEW_STATES[number];
    visibility: Visibility;
    supersedes_summary_ref: string | null;
    superseded_by_summary_ref: string | null;
    provenance: V05Provenance;
    created_at: string;
    updated_at: string;
  }

  export interface InterviewFollowUpRecord {
    follow_up_id: string;
    session_ref: string;
    session_question_ref: string | null;
    kind: typeof FOLLOW_UP_KINDS[number];
    title: string;
    detail: string;
    owner_label: string;
    due_date: string;
    operational_state: FollowUpState;
    related_refs: string[];
    visibility: Visibility;
    provenance: V05Provenance;
    created_at: string;
    updated_at: string;
  }

  export interface InterviewParkingLotRecord {
    parking_lot_id: string;
    session_ref: string;
    session_question_ref: string | null;
    title: string;
    detail: string;
    deferral_reason: string;
    intended_destination: string;
    owner_label: string;
    due_date: string;
    operational_state: FollowUpState;
    related_refs: string[];
    visibility: Visibility;
    provenance: V05Provenance;
    created_at: string;
    updated_at: string;
  }

  export interface InterviewCandidateRecord {
    candidate_id: string;
    source_refs: string[];
    target_domain: InterviewTargetDomain;
    target_type: string;
    proposed_operation: typeof INTERVIEW_CANDIDATE_OPERATIONS[number];
    proposed_fields: Record<string, string>;
    rationale: string;
    state: V05CandidateState;
    target_candidate_ref: string | null;
    target_decision_ref: string | null;
    visibility: Visibility;
    supersedes_candidate_ref: string | null;
    superseded_by_candidate_ref: string | null;
    provenance: V05Provenance;
    created_at: string;
    updated_at: string;
  }

  export interface InterviewImportReceipt {
    import_receipt_id: string;
    package_kind: "l2g_meeting_context_v1" | "l2g_intake_package_v1" | "l2g_scope_context_v1";
    package_version: "1.0";
    package_sha256: string;
    package_size_bytes: number;
    source_evidence_ref: string | null;
    registry_version: string;
    disposition: typeof INTERVIEW_IMPORT_DISPOSITIONS[number];
    created_refs: string[];
    modified_refs: string[];
    rejected_rows: string[];
    warnings: string[];
    created_at: string;
  }

  export interface InterviewProjectionPolicy {
    client_visible_values: Array<"client-safe" | "approved-for-client-presentation">;
    client_include_advisor_notes: false;
    client_include_candidates: false;
    client_include_internal_provenance: false;
    search_index_persistence: "none";
  }

  export interface InterviewSessionsDomain {
    schema_kind: typeof INTERVIEW_SCHEMA_KIND;
    schema_version: typeof INTERVIEW_SCHEMA_VERSION;
    interview_domain_id: string;
    questions: InterviewQuestionRecord[];
    plans: InterviewPlanRecord[];
    sessions: InterviewSessionRecord[];
    session_questions: InterviewSessionQuestionRecord[];
    participant_statements: ParticipantStatementRecord[];
    advisor_notes: AdvisorNoteRecord[];
    confirmations: InterviewConfirmationRecord[];
    summaries: InterviewSummaryRecord[];
    follow_ups: InterviewFollowUpRecord[];
    parking_lot_items: InterviewParkingLotRecord[];
    candidates: InterviewCandidateRecord[];
    import_receipts: InterviewImportReceipt[];
    projection_policy: InterviewProjectionPolicy;
  }

  export interface InterviewNextWorkItem {
    kind: "plan-validation" | "stale-plan" | "ready-session" | "active-session" | "paused-session" | "unresolved-question" | "confirmation" | "post-session-review" | "summary" | "follow-up" | "candidate" | "informational";
    record_ref: string;
    title: string;
    detail: string;
    priority: number;
  }

  export interface InterviewProjection {
    projection_kind: "l2g_interview_projection_v1";
    workspace: WorkspaceId;
    profile: PresentationProfile;
    generated_at: string;
    source_domain: "Interview Sessions";
    source_interview_domain_id: string;
    source_record_ids: string[];
    questions: Array<Record<string, unknown>>;
    plans: Array<Record<string, unknown>>;
    sessions: Array<Record<string, unknown>>;
    session_questions: Array<Record<string, unknown>>;
    participant_statements: Array<Record<string, unknown>>;
    advisor_notes: Array<Record<string, unknown>>;
    confirmations: Array<Record<string, unknown>>;
    summaries: Array<Record<string, unknown>>;
    follow_ups: Array<Record<string, unknown>>;
    parking_lot_items: Array<Record<string, unknown>>;
    candidates: Array<Record<string, unknown>>;
    import_receipts: Array<Record<string, unknown>>;
    active_session_ref: string | null;
    progress: { current: number; total: number; label: string };
    next_work: InterviewNextWorkItem[];
  }

  export function emptyInterviewSessionsDomain(): InterviewSessionsDomain {
    return {
      schema_kind: INTERVIEW_SCHEMA_KIND,
      schema_version: INTERVIEW_SCHEMA_VERSION,
      interview_domain_id: newId("interview_domain"),
      questions: [],
      plans: [],
      sessions: [],
      session_questions: [],
      participant_statements: [],
      advisor_notes: [],
      confirmations: [],
      summaries: [],
      follow_ups: [],
      parking_lot_items: [],
      candidates: [],
      import_receipts: [],
      projection_policy: {
        client_visible_values: ["client-safe", "approved-for-client-presentation"],
        client_include_advisor_notes: false,
        client_include_candidates: false,
        client_include_internal_provenance: false,
        search_index_persistence: "none"
      }
    };
  }

  export function createSyntheticInterviewSessions(timestamp = nowIso()): InterviewSessionsDomain {
    const domain = emptyInterviewSessionsDomain();
    const questionId = newId("interview_question");
    const planId = newId("interview_plan");
    const planItemId = newId("interview_plan_item");
    const sessionId = newId("interview_session");
    const provenance = createV05Provenance("synthetic-fixture", "mcfirecoal-v05-interview", timestamp, "system", "not-evaluated", "McFirecoal synthetic data");
    const snapshot: InterviewQuestionSnapshot = {
      prompt: "Describe how the synthetic team reviews changes to privileged access.",
      client_safe_explanation: "This question documents the current synthetic process and does not make a compliance conclusion.",
      origin: "advisor-created",
      topic_label: "Privileged access review",
      source_refs: []
    };
    domain.questions.push({
      question_id: questionId,
      version_number: 1,
      version_label: "1.0",
      origin: "advisor-created",
      topic_label: snapshot.topic_label,
      prompt: snapshot.prompt,
      client_safe_explanation: snapshot.client_safe_explanation,
      rationale: "Clarify the current synthetic workflow before later practice review.",
      expected_participant_role_labels: ["System owner"],
      applicability_note: "",
      source_refs: [],
      related_refs: [],
      lifecycle: "active",
      visibility: "client-safe",
      supersedes_question_ref: null,
      superseded_by_question_ref: null,
      provenance: deepClone(provenance),
      created_at: timestamp,
      updated_at: timestamp
    });
    domain.plans.push({
      plan_id: planId,
      title: "Synthetic discovery session",
      purpose: "Review synthetic access-management context before authoritative Practice Review migration.",
      facilitator_label: "Advisor",
      expected_participant_refs: [],
      expected_role_labels: ["System owner"],
      planned_start: "2026-08-14T13:00:00.000Z",
      planned_duration_minutes: 60,
      items: [{
        plan_item_id: planItemId,
        order: 1,
        question_ref: questionId,
        question_version_number: 1,
        question_snapshot: snapshot,
        included: true,
        expected_participant_refs: [],
        expected_role_labels: ["System owner"],
        estimated_minutes: 8,
        applicability_note: "",
        advisor_rationale: "",
        visibility: "client-safe"
      }],
      lifecycle: "published",
      currency_state: "current",
      visibility: "client-safe",
      snapshot_hash: "0".repeat(64),
      published_at: timestamp,
      provenance: deepClone(provenance),
      created_at: timestamp,
      updated_at: timestamp
    });
    domain.sessions.push({
      session_id: sessionId,
      plan_ref: planId,
      plan_snapshot_hash: "0".repeat(64),
      title: "Synthetic discovery session",
      purpose: "Review synthetic access-management context.",
      facilitator_label: "Advisor",
      attendee_participant_refs: [],
      attendee_display_labels: ["Synthetic system owner"],
      scheduled_start: "2026-08-14T13:00:00.000Z",
      actual_start: null,
      actual_end: null,
      lifecycle: "ready",
      post_session_review_state: "not-started",
      active_session_question_ref: null,
      elapsed_seconds_hint: 0,
      start_snapshot: null,
      pause_state: null,
      visibility: "client-safe",
      supersedes_session_ref: null,
      superseded_by_session_ref: null,
      provenance: deepClone(provenance),
      created_at: timestamp,
      updated_at: timestamp
    });
    validateInterviewSessionsDomain(domain);
    return domain;
  }

  export function validateInterviewSessionsDomain(value: unknown): asserts value is InterviewSessionsDomain {
    const domain = requireV05Record(value, "Interview Sessions domain");
    assertV05ExactKeys(domain, ["schema_kind", "schema_version", "interview_domain_id", "questions", "plans", "sessions", "session_questions", "participant_statements", "advisor_notes", "confirmations", "summaries", "follow_ups", "parking_lot_items", "candidates", "import_receipts", "projection_policy"], "Interview Sessions domain");
    if (domain.schema_kind !== INTERVIEW_SCHEMA_KIND || domain.schema_version !== INTERVIEW_SCHEMA_VERSION) throw new Error("Interview Sessions schema identity is unsupported.");
    requireV05Id(domain.interview_domain_id, "interview_domain", "Interview domain identifier");
    const questions = requireV05Array(domain.questions, "Interview questions", 4000);
    const plans = requireV05Array(domain.plans, "Interview plans", 250);
    const sessions = requireV05Array(domain.sessions, "Interview sessions", 250);
    const sessionQuestions = requireV05Array(domain.session_questions, "Session questions", 10000);
    const statements = requireV05Array(domain.participant_statements, "Participant statements", 20000);
    const notes = requireV05Array(domain.advisor_notes, "Advisor notes", 20000);
    const confirmations = requireV05Array(domain.confirmations, "Interview confirmations", 10000);
    const summaries = requireV05Array(domain.summaries, "Interview summaries", 2000);
    const followUps = requireV05Array(domain.follow_ups, "Interview follow-ups", 5000);
    const parking = requireV05Array(domain.parking_lot_items, "Interview parking-lot items", 2000);
    const candidates = requireV05Array(domain.candidates, "Interview candidates", 5000);
    const receipts = requireV05Array(domain.import_receipts, "Interview import receipts", 250);
    const ids = new Set<string>();
    const addId = (id: string, label: string): void => { if (ids.has(id)) throw new Error(`${label} duplicates a domain identifier.`); ids.add(id); };
    for (const [index, raw] of questions.entries()) validateInterviewQuestion(raw, index, addId);
    for (const [index, raw] of plans.entries()) validateInterviewPlan(raw, index, addId);
    for (const [index, raw] of sessions.entries()) validateInterviewSession(raw, index, addId);
    for (const [index, raw] of sessionQuestions.entries()) validateSessionQuestion(raw, index, addId);
    for (const [index, raw] of statements.entries()) validateParticipantStatement(raw, index, addId);
    for (const [index, raw] of notes.entries()) validateAdvisorNote(raw, index, addId);
    for (const [index, raw] of confirmations.entries()) validateInterviewConfirmation(raw, index, addId);
    for (const [index, raw] of summaries.entries()) validateInterviewSummary(raw, index, addId);
    for (const [index, raw] of followUps.entries()) validateInterviewFollowUp(raw, index, addId);
    for (const [index, raw] of parking.entries()) validateParkingLotItem(raw, index, addId);
    for (const [index, raw] of candidates.entries()) validateInterviewCandidate(raw, index, addId);
    for (const [index, raw] of receipts.entries()) validateInterviewImportReceipt(raw, index, addId);
    validateInterviewProjectionPolicy(domain.projection_policy);
    validateInterviewReferences(domain as unknown as InterviewSessionsDomain);
  }

  function validateInterviewQuestion(value: unknown, index: number, addId: (id: string, label: string) => void): void {
    const label = `Interview question ${index + 1}`;
    const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["question_id", "version_number", "version_label", "origin", "topic_label", "prompt", "client_safe_explanation", "rationale", "expected_participant_role_labels", "applicability_note", "source_refs", "related_refs", "lifecycle", "visibility", "supersedes_question_ref", "superseded_by_question_ref", "provenance", "created_at", "updated_at"], label);
    const id = requireV05Id(record.question_id, "interview_question", `${label}.question_id`); addId(id, label);
    requireV05Integer(record.version_number, `${label}.version_number`, 1, 1000000); requireV05String(record.version_label, `${label}.version_label`, 100);
    requireV05Enum(record.origin, QUESTION_ORIGINS, `${label}.origin`); requireV05String(record.topic_label, `${label}.topic_label`, 300); requireV05String(record.prompt, `${label}.prompt`, 8000);
    requireV05String(record.client_safe_explanation, `${label}.client_safe_explanation`, 8000, record.visibility === "advisor-only"); requireV05String(record.rationale, `${label}.rationale`, 8000, true);
    requireV05StringArray(record.expected_participant_role_labels, `${label}.expected_participant_role_labels`, 100, 300); requireV05String(record.applicability_note, `${label}.applicability_note`, 8000, true);
    validateV05ReferenceArray(record.source_refs, `${label}.source_refs`); validateV05ReferenceArray(record.related_refs, `${label}.related_refs`); requireV05Enum(record.lifecycle, QUESTION_LIFECYCLES, `${label}.lifecycle`); validateV05Visibility(record.visibility, `${label}.visibility`);
    if (record.supersedes_question_ref !== null) requireV05Id(record.supersedes_question_ref, "interview_question", `${label}.supersedes_question_ref`);
    if (record.superseded_by_question_ref !== null) requireV05Id(record.superseded_by_question_ref, "interview_question", `${label}.superseded_by_question_ref`);
    validateV05Provenance(record.provenance, `${label}.provenance`); requireV05Iso(record.created_at, `${label}.created_at`); requireV05Iso(record.updated_at, `${label}.updated_at`);
  }

  function validateQuestionSnapshot(value: unknown, label: string): void {
    const snapshot = requireV05Record(value, label);
    assertV05ExactKeys(snapshot, ["prompt", "client_safe_explanation", "origin", "topic_label", "source_refs"], label);
    requireV05String(snapshot.prompt, `${label}.prompt`, 8000); requireV05String(snapshot.client_safe_explanation, `${label}.client_safe_explanation`, 8000, true); requireV05Enum(snapshot.origin, QUESTION_ORIGINS, `${label}.origin`); requireV05String(snapshot.topic_label, `${label}.topic_label`, 300); validateV05ReferenceArray(snapshot.source_refs, `${label}.source_refs`);
  }

  function validateInterviewPlan(value: unknown, index: number, addId: (id: string, label: string) => void): void {
    const label = `Interview plan ${index + 1}`;
    const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["plan_id", "title", "purpose", "facilitator_label", "expected_participant_refs", "expected_role_labels", "planned_start", "planned_duration_minutes", "items", "lifecycle", "currency_state", "visibility", "snapshot_hash", "published_at", "provenance", "created_at", "updated_at"], label);
    const id = requireV05Id(record.plan_id, "interview_plan", `${label}.plan_id`); addId(id, label);
    requireV05String(record.title, `${label}.title`, 300); requireV05String(record.purpose, `${label}.purpose`, 8000, true); requireV05String(record.facilitator_label, `${label}.facilitator_label`, 300, true);
    validateV05ReferenceArray(record.expected_participant_refs, `${label}.expected_participant_refs`, 100); requireV05StringArray(record.expected_role_labels, `${label}.expected_role_labels`, 100, 300);
    if (record.planned_start !== null) requireV05Iso(record.planned_start, `${label}.planned_start`); requireV05Integer(record.planned_duration_minutes, `${label}.planned_duration_minutes`, 0, 1440);
    const items = requireV05Array(record.items, `${label}.items`, 250); const orders = new Set<number>(); const itemIds = new Set<string>();
    for (const [itemIndex, raw] of items.entries()) {
      const itemLabel = `${label}.items[${itemIndex}]`; const item = requireV05Record(raw, itemLabel);
      assertV05ExactKeys(item, ["plan_item_id", "order", "question_ref", "question_version_number", "question_snapshot", "included", "expected_participant_refs", "expected_role_labels", "estimated_minutes", "applicability_note", "advisor_rationale", "visibility"], itemLabel);
      const itemId = requireV05Id(item.plan_item_id, "interview_plan_item", `${itemLabel}.plan_item_id`); if (itemIds.has(itemId)) throw new Error(`${label} contains duplicate plan-item identifiers.`); itemIds.add(itemId); addId(itemId, itemLabel);
      const order = requireV05Integer(item.order, `${itemLabel}.order`, 1, 10000); if (orders.has(order)) throw new Error(`${label} contains duplicate order positions.`); orders.add(order);
      requireV05Id(item.question_ref, "interview_question", `${itemLabel}.question_ref`); requireV05Integer(item.question_version_number, `${itemLabel}.question_version_number`, 1, 1000000); validateQuestionSnapshot(item.question_snapshot, `${itemLabel}.question_snapshot`); requireV05Boolean(item.included, `${itemLabel}.included`);
      validateV05ReferenceArray(item.expected_participant_refs, `${itemLabel}.expected_participant_refs`, 100); requireV05StringArray(item.expected_role_labels, `${itemLabel}.expected_role_labels`, 100, 300); requireV05Integer(item.estimated_minutes, `${itemLabel}.estimated_minutes`, 0, 1440); requireV05String(item.applicability_note, `${itemLabel}.applicability_note`, 8000, true); requireV05String(item.advisor_rationale, `${itemLabel}.advisor_rationale`, 8000, true); validateV05Visibility(item.visibility, `${itemLabel}.visibility`);
    }
    requireV05Enum(record.lifecycle, PLAN_LIFECYCLES, `${label}.lifecycle`); requireV05Enum(record.currency_state, PLAN_CURRENCY_STATES, `${label}.currency_state`); validateV05Visibility(record.visibility, `${label}.visibility`);
    if (record.snapshot_hash !== null) { const hash = requireV05String(record.snapshot_hash, `${label}.snapshot_hash`, 64); if (!/^[0-9a-f]{64}$/.test(hash)) throw new Error(`${label}.snapshot_hash is invalid.`); }
    if (record.lifecycle === "published" && (record.snapshot_hash === null || record.published_at === null)) throw new Error(`${label} published plans require snapshot identity and timestamp.`);
    if (record.published_at !== null) requireV05Iso(record.published_at, `${label}.published_at`);
    validateV05Provenance(record.provenance, `${label}.provenance`); requireV05Iso(record.created_at, `${label}.created_at`); requireV05Iso(record.updated_at, `${label}.updated_at`);
  }

  function validateInterviewStartSnapshot(value: unknown, label: string): void {
    const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["plan_ref", "plan_snapshot_hash", "plan_title", "ordered_session_question_refs", "attendee_participant_refs", "attendee_display_labels", "facilitator_label", "started_at", "started_profile", "initial_session_question_ref"], label);
    requireV05Id(record.plan_ref, "interview_plan", `${label}.plan_ref`); const hash = requireV05String(record.plan_snapshot_hash, `${label}.plan_snapshot_hash`, 64); if (!/^[0-9a-f]{64}$/.test(hash)) throw new Error(`${label}.plan_snapshot_hash is invalid.`);
    requireV05String(record.plan_title, `${label}.plan_title`, 300); validateV05ReferenceArray(record.ordered_session_question_refs, `${label}.ordered_session_question_refs`, 250); validateV05ReferenceArray(record.attendee_participant_refs, `${label}.attendee_participant_refs`, 100); requireV05StringArray(record.attendee_display_labels, `${label}.attendee_display_labels`, 100, 300); requireV05String(record.facilitator_label, `${label}.facilitator_label`, 300); requireV05Iso(record.started_at, `${label}.started_at`); requireV05Enum(record.started_profile, ["advisor", "client", "reviewer"] as const, `${label}.started_profile`); if (record.initial_session_question_ref !== null) requireV05Id(record.initial_session_question_ref, "session_question", `${label}.initial_session_question_ref`);
  }

  function validatePauseState(value: unknown, label: string): void {
    const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["paused_at", "active_session_question_ref", "ordered_session_question_refs", "elapsed_seconds_hint", "unresolved_session_question_refs"], label);
    requireV05Iso(record.paused_at, `${label}.paused_at`); if (record.active_session_question_ref !== null) requireV05Id(record.active_session_question_ref, "session_question", `${label}.active_session_question_ref`); validateV05ReferenceArray(record.ordered_session_question_refs, `${label}.ordered_session_question_refs`, 250); requireV05Integer(record.elapsed_seconds_hint, `${label}.elapsed_seconds_hint`, 0, 604800); validateV05ReferenceArray(record.unresolved_session_question_refs, `${label}.unresolved_session_question_refs`, 250);
  }

  function validateInterviewSession(value: unknown, index: number, addId: (id: string, label: string) => void): void {
    const label = `Interview session ${index + 1}`; const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["session_id", "plan_ref", "plan_snapshot_hash", "title", "purpose", "facilitator_label", "attendee_participant_refs", "attendee_display_labels", "scheduled_start", "actual_start", "actual_end", "lifecycle", "post_session_review_state", "active_session_question_ref", "elapsed_seconds_hint", "start_snapshot", "pause_state", "visibility", "supersedes_session_ref", "superseded_by_session_ref", "provenance", "created_at", "updated_at"], label);
    const id = requireV05Id(record.session_id, "interview_session", `${label}.session_id`); addId(id, label); requireV05Id(record.plan_ref, "interview_plan", `${label}.plan_ref`); const hash = requireV05String(record.plan_snapshot_hash, `${label}.plan_snapshot_hash`, 64); if (!/^[0-9a-f]{64}$/.test(hash)) throw new Error(`${label}.plan_snapshot_hash is invalid.`);
    requireV05String(record.title, `${label}.title`, 300); requireV05String(record.purpose, `${label}.purpose`, 8000, true); requireV05String(record.facilitator_label, `${label}.facilitator_label`, 300); validateV05ReferenceArray(record.attendee_participant_refs, `${label}.attendee_participant_refs`, 100); requireV05StringArray(record.attendee_display_labels, `${label}.attendee_display_labels`, 100, 300);
    if (record.scheduled_start !== null) requireV05Iso(record.scheduled_start, `${label}.scheduled_start`); if (record.actual_start !== null) requireV05Iso(record.actual_start, `${label}.actual_start`); if (record.actual_end !== null) requireV05Iso(record.actual_end, `${label}.actual_end`);
    const lifecycle = requireV05Enum(record.lifecycle, SESSION_LIFECYCLES, `${label}.lifecycle`); requireV05Enum(record.post_session_review_state, POST_SESSION_REVIEW_STATES, `${label}.post_session_review_state`); if (record.active_session_question_ref !== null) requireV05Id(record.active_session_question_ref, "session_question", `${label}.active_session_question_ref`); requireV05Integer(record.elapsed_seconds_hint, `${label}.elapsed_seconds_hint`, 0, 604800);
    if (record.start_snapshot !== null) validateInterviewStartSnapshot(record.start_snapshot, `${label}.start_snapshot`); if (record.pause_state !== null) validatePauseState(record.pause_state, `${label}.pause_state`); validateV05Visibility(record.visibility, `${label}.visibility`);
    if (["in-progress", "paused", "completed", "cancelled"].includes(lifecycle) && record.start_snapshot === null) throw new Error(`${label} requires an immutable start snapshot after Start.`);
    if (lifecycle === "paused" && record.pause_state === null) throw new Error(`${label} requires pause state while paused.`); if (lifecycle !== "paused" && record.pause_state !== null) throw new Error(`${label} may retain pause state only while paused.`);
    if (["completed", "cancelled"].includes(lifecycle) && record.actual_end === null) throw new Error(`${label} requires an actual end timestamp.`);
    if (record.supersedes_session_ref !== null) requireV05Id(record.supersedes_session_ref, "interview_session", `${label}.supersedes_session_ref`); if (record.superseded_by_session_ref !== null) requireV05Id(record.superseded_by_session_ref, "interview_session", `${label}.superseded_by_session_ref`);
    validateV05Provenance(record.provenance, `${label}.provenance`); requireV05Iso(record.created_at, `${label}.created_at`); requireV05Iso(record.updated_at, `${label}.updated_at`);
  }

  function validateSessionQuestion(value: unknown, index: number, addId: (id: string, label: string) => void): void {
    const label = `Session question ${index + 1}`; const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["session_question_id", "session_ref", "plan_item_ref", "order", "question_ref", "question_version_number", "question_snapshot", "origin", "state", "statement_refs", "advisor_note_refs", "follow_up_refs", "unresolved", "disposition_rationale", "visibility", "created_at", "updated_at"], label);
    const id = requireV05Id(record.session_question_id, "session_question", `${label}.session_question_id`); addId(id, label); requireV05Id(record.session_ref, "interview_session", `${label}.session_ref`); if (record.plan_item_ref !== null) requireV05Id(record.plan_item_ref, "interview_plan_item", `${label}.plan_item_ref`); requireV05Integer(record.order, `${label}.order`, 1, 10000); requireV05Id(record.question_ref, "interview_question", `${label}.question_ref`); requireV05Integer(record.question_version_number, `${label}.question_version_number`, 1, 1000000); validateQuestionSnapshot(record.question_snapshot, `${label}.question_snapshot`); requireV05Enum(record.origin, QUESTION_ORIGINS, `${label}.origin`); requireV05Enum(record.state, SESSION_QUESTION_STATES, `${label}.state`); validateV05ReferenceArray(record.statement_refs, `${label}.statement_refs`, 1000); validateV05ReferenceArray(record.advisor_note_refs, `${label}.advisor_note_refs`, 1000); validateV05ReferenceArray(record.follow_up_refs, `${label}.follow_up_refs`, 1000); requireV05Boolean(record.unresolved, `${label}.unresolved`); requireV05String(record.disposition_rationale, `${label}.disposition_rationale`, 8000, true); validateV05Visibility(record.visibility, `${label}.visibility`); requireV05Iso(record.created_at, `${label}.created_at`); requireV05Iso(record.updated_at, `${label}.updated_at`);
  }

  function validateParticipantStatement(value: unknown, index: number, addId: (id: string, label: string) => void): void {
    const label = `Participant statement ${index + 1}`; const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["statement_id", "session_ref", "session_question_ref", "asserted_participant_ref", "asserted_speaker_label", "recording_method", "text", "version_number", "lifecycle", "review_state", "visibility", "supersedes_statement_ref", "superseded_by_statement_ref", "provenance", "created_at", "updated_at"], label);
    const id = requireV05Id(record.statement_id, "participant_statement", `${label}.statement_id`); addId(id, label); requireV05Id(record.session_ref, "interview_session", `${label}.session_ref`); requireV05Id(record.session_question_ref, "session_question", `${label}.session_question_ref`); if (record.asserted_participant_ref !== null) requireV05Id(record.asserted_participant_ref, "participant", `${label}.asserted_participant_ref`); requireV05String(record.asserted_speaker_label, `${label}.asserted_speaker_label`, 300, true); requireV05Enum(record.recording_method, STATEMENT_METHODS, `${label}.recording_method`); requireV05String(record.text, `${label}.text`, 16000); requireV05Integer(record.version_number, `${label}.version_number`, 1, 1000000); requireV05Enum(record.lifecycle, RECORD_LIFECYCLES, `${label}.lifecycle`); requireV05Enum(record.review_state, V05_REVIEW_STATES, `${label}.review_state`); validateV05Visibility(record.visibility, `${label}.visibility`); if (record.supersedes_statement_ref !== null) requireV05Id(record.supersedes_statement_ref, "participant_statement", `${label}.supersedes_statement_ref`); if (record.superseded_by_statement_ref !== null) requireV05Id(record.superseded_by_statement_ref, "participant_statement", `${label}.superseded_by_statement_ref`); validateV05Provenance(record.provenance, `${label}.provenance`); requireV05Iso(record.created_at, `${label}.created_at`); requireV05Iso(record.updated_at, `${label}.updated_at`);
  }

  function validateAdvisorNote(value: unknown, index: number, addId: (id: string, label: string) => void): void {
    const label = `Advisor note ${index + 1}`; const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["advisor_note_id", "session_ref", "session_question_ref", "kind", "title", "text", "visibility", "lifecycle", "provenance", "created_at", "updated_at"], label);
    const id = requireV05Id(record.advisor_note_id, "advisor_note", `${label}.advisor_note_id`); addId(id, label); requireV05Id(record.session_ref, "interview_session", `${label}.session_ref`); requireV05Id(record.session_question_ref, "session_question", `${label}.session_question_ref`); requireV05Enum(record.kind, ADVISOR_NOTE_KINDS, `${label}.kind`); requireV05String(record.title, `${label}.title`, 300, true); requireV05String(record.text, `${label}.text`, 16000); if (record.visibility !== "advisor-only") throw new Error(`${label} visibility must remain advisor-only.`); requireV05Enum(record.lifecycle, RECORD_LIFECYCLES, `${label}.lifecycle`); validateV05Provenance(record.provenance, `${label}.provenance`); requireV05Iso(record.created_at, `${label}.created_at`); requireV05Iso(record.updated_at, `${label}.updated_at`);
  }

  function validateInterviewConfirmation(value: unknown, index: number, addId: (id: string, label: string) => void): void {
    const label = `Interview confirmation ${index + 1}`; const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["confirmation_id", "session_ref", "confirmed_record_kind", "confirmed_record_ref", "confirmed_record_version", "asserted_confirmer_participant_ref", "asserted_confirmer_label", "method", "state", "detail", "visibility", "provenance", "created_at"], label);
    const id = requireV05Id(record.confirmation_id, "interview_confirmation", `${label}.confirmation_id`); addId(id, label); requireV05Id(record.session_ref, "interview_session", `${label}.session_ref`); requireV05Enum(record.confirmed_record_kind, CONFIRMATION_TARGET_KINDS, `${label}.confirmed_record_kind`); requireV05String(record.confirmed_record_ref, `${label}.confirmed_record_ref`, 160); requireV05Integer(record.confirmed_record_version, `${label}.confirmed_record_version`, 1, 1000000); if (record.asserted_confirmer_participant_ref !== null) requireV05Id(record.asserted_confirmer_participant_ref, "participant", `${label}.asserted_confirmer_participant_ref`); requireV05String(record.asserted_confirmer_label, `${label}.asserted_confirmer_label`, 300, true); requireV05Enum(record.method, CONFIRMATION_METHODS, `${label}.method`); requireV05Enum(record.state, CONFIRMATION_STATES, `${label}.state`); requireV05String(record.detail, `${label}.detail`, 8000, true); validateV05Visibility(record.visibility, `${label}.visibility`); validateV05Provenance(record.provenance, `${label}.provenance`); requireV05Iso(record.created_at, `${label}.created_at`);
  }

  function validateInterviewSummary(value: unknown, index: number, addId: (id: string, label: string) => void): void {
    const label = `Interview summary ${index + 1}`; const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["summary_id", "session_ref", "kind", "title", "text", "version_number", "source_statement_refs", "source_advisor_note_refs", "source_follow_up_refs", "lifecycle", "review_state", "visibility", "supersedes_summary_ref", "superseded_by_summary_ref", "provenance", "created_at", "updated_at"], label);
    const id = requireV05Id(record.summary_id, "interview_summary", `${label}.summary_id`); addId(id, label); requireV05Id(record.session_ref, "interview_session", `${label}.session_ref`); requireV05Enum(record.kind, SUMMARY_KINDS, `${label}.kind`); requireV05String(record.title, `${label}.title`, 300); requireV05String(record.text, `${label}.text`, 16000); requireV05Integer(record.version_number, `${label}.version_number`, 1, 1000000); validateV05ReferenceArray(record.source_statement_refs, `${label}.source_statement_refs`, 1000); validateV05ReferenceArray(record.source_advisor_note_refs, `${label}.source_advisor_note_refs`, 1000); validateV05ReferenceArray(record.source_follow_up_refs, `${label}.source_follow_up_refs`, 1000); const lifecycle = requireV05Enum(record.lifecycle, SUMMARY_LIFECYCLES, `${label}.lifecycle`); requireV05Enum(record.review_state, V05_REVIEW_STATES, `${label}.review_state`); const visibility = validateV05Visibility(record.visibility, `${label}.visibility`); if (lifecycle === "approved-for-client-presentation" && visibility !== "approved-for-client-presentation") throw new Error(`${label} approved Client summaries require approved-for-client-presentation visibility.`); if (record.supersedes_summary_ref !== null) requireV05Id(record.supersedes_summary_ref, "interview_summary", `${label}.supersedes_summary_ref`); if (record.superseded_by_summary_ref !== null) requireV05Id(record.superseded_by_summary_ref, "interview_summary", `${label}.superseded_by_summary_ref`); validateV05Provenance(record.provenance, `${label}.provenance`); requireV05Iso(record.created_at, `${label}.created_at`); requireV05Iso(record.updated_at, `${label}.updated_at`);
  }

  function validateInterviewFollowUp(value: unknown, index: number, addId: (id: string, label: string) => void): void {
    const label = `Interview follow-up ${index + 1}`; const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["follow_up_id", "session_ref", "session_question_ref", "kind", "title", "detail", "owner_label", "due_date", "operational_state", "related_refs", "visibility", "provenance", "created_at", "updated_at"], label);
    const id = requireV05Id(record.follow_up_id, "interview_follow_up", `${label}.follow_up_id`); addId(id, label); requireV05Id(record.session_ref, "interview_session", `${label}.session_ref`); if (record.session_question_ref !== null) requireV05Id(record.session_question_ref, "session_question", `${label}.session_question_ref`); requireV05Enum(record.kind, FOLLOW_UP_KINDS, `${label}.kind`); requireV05String(record.title, `${label}.title`, 300); requireV05String(record.detail, `${label}.detail`, 8000, true); requireV05String(record.owner_label, `${label}.owner_label`, 300, true); requireV05Date(record.due_date, `${label}.due_date`); requireV05Enum(record.operational_state, FOLLOW_UP_STATES, `${label}.operational_state`); validateV05ReferenceArray(record.related_refs, `${label}.related_refs`); validateV05Visibility(record.visibility, `${label}.visibility`); validateV05Provenance(record.provenance, `${label}.provenance`); requireV05Iso(record.created_at, `${label}.created_at`); requireV05Iso(record.updated_at, `${label}.updated_at`);
  }

  function validateParkingLotItem(value: unknown, index: number, addId: (id: string, label: string) => void): void {
    const label = `Parking-lot item ${index + 1}`; const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["parking_lot_id", "session_ref", "session_question_ref", "title", "detail", "deferral_reason", "intended_destination", "owner_label", "due_date", "operational_state", "related_refs", "visibility", "provenance", "created_at", "updated_at"], label);
    const id = requireV05Id(record.parking_lot_id, "parking_lot", `${label}.parking_lot_id`); addId(id, label); requireV05Id(record.session_ref, "interview_session", `${label}.session_ref`); if (record.session_question_ref !== null) requireV05Id(record.session_question_ref, "session_question", `${label}.session_question_ref`); requireV05String(record.title, `${label}.title`, 300); requireV05String(record.detail, `${label}.detail`, 8000, true); requireV05String(record.deferral_reason, `${label}.deferral_reason`, 8000); requireV05String(record.intended_destination, `${label}.intended_destination`, 300, true); requireV05String(record.owner_label, `${label}.owner_label`, 300, true); requireV05Date(record.due_date, `${label}.due_date`); requireV05Enum(record.operational_state, FOLLOW_UP_STATES, `${label}.operational_state`); validateV05ReferenceArray(record.related_refs, `${label}.related_refs`); validateV05Visibility(record.visibility, `${label}.visibility`); validateV05Provenance(record.provenance, `${label}.provenance`); requireV05Iso(record.created_at, `${label}.created_at`); requireV05Iso(record.updated_at, `${label}.updated_at`);
  }

  function validateInterviewCandidate(value: unknown, index: number, addId: (id: string, label: string) => void): void {
    const label = `Interview candidate ${index + 1}`; const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["candidate_id", "source_refs", "target_domain", "target_type", "proposed_operation", "proposed_fields", "rationale", "state", "target_candidate_ref", "target_decision_ref", "visibility", "supersedes_candidate_ref", "superseded_by_candidate_ref", "provenance", "created_at", "updated_at"], label);
    const id = requireV05Id(record.candidate_id, "interview_candidate", `${label}.candidate_id`); addId(id, label); validateV05ReferenceArray(record.source_refs, `${label}.source_refs`); requireV05Enum(record.target_domain, INTERVIEW_TARGETS, `${label}.target_domain`); requireV05String(record.target_type, `${label}.target_type`, 160); requireV05Enum(record.proposed_operation, INTERVIEW_CANDIDATE_OPERATIONS, `${label}.proposed_operation`); validateV05ScalarFields(record.proposed_fields, `${label}.proposed_fields`); requireV05String(record.rationale, `${label}.rationale`, 8000); requireV05Enum(record.state, ["draft", "awaiting-review", "published-to-target", "returned", "withdrawn", "superseded", "closed"] as const, `${label}.state`); if (record.target_candidate_ref !== null) requireV05String(record.target_candidate_ref, `${label}.target_candidate_ref`, 160); if (record.target_decision_ref !== null) requireV05String(record.target_decision_ref, `${label}.target_decision_ref`, 160); validateV05Visibility(record.visibility, `${label}.visibility`); if (record.supersedes_candidate_ref !== null) requireV05Id(record.supersedes_candidate_ref, "interview_candidate", `${label}.supersedes_candidate_ref`); if (record.superseded_by_candidate_ref !== null) requireV05Id(record.superseded_by_candidate_ref, "interview_candidate", `${label}.superseded_by_candidate_ref`); validateV05Provenance(record.provenance, `${label}.provenance`); requireV05Iso(record.created_at, `${label}.created_at`); requireV05Iso(record.updated_at, `${label}.updated_at`);
  }

  function validateInterviewImportReceipt(value: unknown, index: number, addId: (id: string, label: string) => void): void {
    const label = `Interview import receipt ${index + 1}`; const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["import_receipt_id", "package_kind", "package_version", "package_sha256", "package_size_bytes", "source_evidence_ref", "registry_version", "disposition", "created_refs", "modified_refs", "rejected_rows", "warnings", "created_at"], label);
    const id = requireV05Id(record.import_receipt_id, "interview_import", `${label}.import_receipt_id`); addId(id, label); requireV05Enum(record.package_kind, ["l2g_meeting_context_v1", "l2g_intake_package_v1", "l2g_scope_context_v1"] as const, `${label}.package_kind`); if (record.package_version !== "1.0") throw new Error(`${label}.package_version is unsupported.`); const hash = requireV05String(record.package_sha256, `${label}.package_sha256`, 64); if (!/^[0-9a-f]{64}$/.test(hash)) throw new Error(`${label}.package_sha256 is invalid.`); requireV05Integer(record.package_size_bytes, `${label}.package_size_bytes`, 0, 16 * 1024 * 1024); if (record.source_evidence_ref !== null) requireV05Id(record.source_evidence_ref, "evidence", `${label}.source_evidence_ref`); requireV05String(record.registry_version, `${label}.registry_version`, 100); requireV05Enum(record.disposition, INTERVIEW_IMPORT_DISPOSITIONS, `${label}.disposition`); validateV05ReferenceArray(record.created_refs, `${label}.created_refs`, 1000); validateV05ReferenceArray(record.modified_refs, `${label}.modified_refs`, 1000); requireV05StringArray(record.rejected_rows, `${label}.rejected_rows`, 1000, 1000); requireV05StringArray(record.warnings, `${label}.warnings`, 1000, 1000); requireV05Iso(record.created_at, `${label}.created_at`);
  }

  function validateInterviewProjectionPolicy(value: unknown): void {
    const policy = requireV05Record(value, "Interview projection policy");
    assertV05ExactKeys(policy, ["client_visible_values", "client_include_advisor_notes", "client_include_candidates", "client_include_internal_provenance", "search_index_persistence"], "Interview projection policy");
    const values = requireV05StringArray(policy.client_visible_values, "Interview client visibility policy", 2, 60); if (stableStringify(values, 0) !== stableStringify(["client-safe", "approved-for-client-presentation"], 0)) throw new Error("Interview client visibility policy is unsupported.");
    if (policy.client_include_advisor_notes !== false || policy.client_include_candidates !== false || policy.client_include_internal_provenance !== false || policy.search_index_persistence !== "none") throw new Error("Interview projection policy weakens the accepted v0.5 boundary.");
  }

  function validateInterviewReferences(domain: InterviewSessionsDomain): void {
    const questionIds = new Set(domain.questions.map(record => record.question_id));
    const planIds = new Set(domain.plans.map(record => record.plan_id));
    const planItemIds = new Set(domain.plans.flatMap(record => record.items.map(item => item.plan_item_id)));
    const sessionIds = new Set(domain.sessions.map(record => record.session_id));
    const sessionQuestionIds = new Set(domain.session_questions.map(record => record.session_question_id));
    const statementIds = new Set(domain.participant_statements.map(record => record.statement_id));
    const noteIds = new Set(domain.advisor_notes.map(record => record.advisor_note_id));
    const summaryIds = new Set(domain.summaries.map(record => record.summary_id));
    const followUpIds = new Set(domain.follow_ups.map(record => record.follow_up_id));
    const activeSessions = domain.sessions.filter(record => record.lifecycle === "in-progress" || record.lifecycle === "paused");
    if (activeSessions.length > 1) throw new Error("Only one Interview session may be in progress or paused.");
    for (const plan of domain.plans) for (const item of plan.items) {
      const question = domain.questions.find(record => record.question_id === item.question_ref);
      if (!question || question.version_number !== item.question_version_number) throw new Error("Interview plan item references an unknown question version.");
      if (item.question_snapshot.prompt !== item.question_snapshot.prompt) throw new Error("Interview plan snapshot is invalid.");
    }
    for (const session of domain.sessions) {
      if (!planIds.has(session.plan_ref)) throw new Error("Interview session references an unknown plan.");
      const questions = domain.session_questions.filter(record => record.session_ref === session.session_id);
      const current = questions.filter(record => record.state === "current");
      if (current.length > 1) throw new Error("Interview session contains multiple current questions.");
      if (session.active_session_question_ref !== null && !questions.some(record => record.session_question_id === session.active_session_question_ref)) throw new Error("Interview session active question is invalid.");
      if (session.lifecycle === "in-progress" && questions.length > 0 && current.length !== 1) throw new Error("An in-progress Interview session requires exactly one current question.");
      if (session.lifecycle === "paused" && session.pause_state?.active_session_question_ref !== session.active_session_question_ref) throw new Error("Paused Interview state does not match the active question.");
    }
    const perSessionOrders = new Map<string, Set<number>>();
    for (const record of domain.session_questions) {
      if (!sessionIds.has(record.session_ref) || !questionIds.has(record.question_ref)) throw new Error("Session question contains a dangling session or question reference.");
      if (record.plan_item_ref !== null && !planItemIds.has(record.plan_item_ref)) throw new Error("Session question references an unknown plan item.");
      const orders = perSessionOrders.get(record.session_ref) ?? new Set<number>(); if (orders.has(record.order)) throw new Error("Session contains duplicate question order positions."); orders.add(record.order); perSessionOrders.set(record.session_ref, orders);
      for (const ref of record.statement_refs) if (!statementIds.has(ref)) throw new Error("Session question references an unknown statement.");
      for (const ref of record.advisor_note_refs) if (!noteIds.has(ref)) throw new Error("Session question references an unknown Advisor note.");
      for (const ref of record.follow_up_refs) if (!followUpIds.has(ref)) throw new Error("Session question references an unknown follow-up.");
    }
    for (const statement of domain.participant_statements) {
      const sessionQuestion = domain.session_questions.find(record => record.session_question_id === statement.session_question_ref);
      if (!sessionIds.has(statement.session_ref) || !sessionQuestion || sessionQuestion.session_ref !== statement.session_ref) throw new Error("Participant statement crosses or references an unknown session.");
      if (statement.recording_method === "imported-context" && statement.provenance.asserted_by !== "import") throw new Error("Imported-context statements require import provenance.");
      if (statement.supersedes_statement_ref !== null && !statementIds.has(statement.supersedes_statement_ref)) throw new Error("Participant statement supersedes an unknown statement.");
      if (statement.superseded_by_statement_ref !== null && !statementIds.has(statement.superseded_by_statement_ref)) throw new Error("Participant statement is superseded by an unknown statement.");
    }
    for (const note of domain.advisor_notes) {
      const sessionQuestion = domain.session_questions.find(record => record.session_question_id === note.session_question_ref);
      if (!sessionIds.has(note.session_ref) || !sessionQuestion || sessionQuestion.session_ref !== note.session_ref) throw new Error("Advisor note crosses or references an unknown session.");
    }
    for (const confirmation of domain.confirmations) {
      if (!sessionIds.has(confirmation.session_ref)) throw new Error("Interview confirmation references an unknown session.");
      if (confirmation.confirmed_record_kind === "participant-statement") {
        const statement = domain.participant_statements.find(record => record.statement_id === confirmation.confirmed_record_ref);
        if (!statement || statement.session_ref !== confirmation.session_ref || statement.version_number !== confirmation.confirmed_record_version) throw new Error("Interview confirmation does not match the exact participant statement version.");
      } else {
        const summary = domain.summaries.find(record => record.summary_id === confirmation.confirmed_record_ref);
        if (!summary || summary.session_ref !== confirmation.session_ref || summary.version_number !== confirmation.confirmed_record_version || summary.kind !== "client-visible-session-summary") throw new Error("Interview confirmation does not match the exact Client-visible summary version.");
      }
      if ((confirmation.method === "correction-requested" && confirmation.state !== "correction-requested") || (confirmation.method === "explicitly-declined" && confirmation.state !== "declined")) throw new Error("Interview confirmation method and state are inconsistent.");
    }
    for (const summary of domain.summaries) {
      if (!sessionIds.has(summary.session_ref)) throw new Error("Interview summary references an unknown session.");
      for (const ref of summary.source_statement_refs) if (!statementIds.has(ref)) throw new Error("Interview summary references an unknown statement.");
      for (const ref of summary.source_advisor_note_refs) if (!noteIds.has(ref)) throw new Error("Interview summary references an unknown Advisor note.");
      for (const ref of summary.source_follow_up_refs) if (!followUpIds.has(ref)) throw new Error("Interview summary references an unknown follow-up.");
      if (summary.supersedes_summary_ref !== null && !summaryIds.has(summary.supersedes_summary_ref)) throw new Error("Interview summary supersedes an unknown summary.");
      if (summary.superseded_by_summary_ref !== null && !summaryIds.has(summary.superseded_by_summary_ref)) throw new Error("Interview summary is superseded by an unknown summary.");
    }
    for (const followUp of domain.follow_ups) {
      if (!sessionIds.has(followUp.session_ref)) throw new Error("Interview follow-up references an unknown session.");
      if (followUp.session_question_ref !== null && !sessionQuestionIds.has(followUp.session_question_ref)) throw new Error("Interview follow-up references an unknown session question.");
    }
    for (const item of domain.parking_lot_items) {
      if (!sessionIds.has(item.session_ref)) throw new Error("Parking-lot item references an unknown session.");
      if (item.session_question_ref !== null && !sessionQuestionIds.has(item.session_question_ref)) throw new Error("Parking-lot item references an unknown session question.");
    }
  }

  export function assessInterviewPlanCurrency(domain: InterviewSessionsDomain, planId: string): InterviewPlanCurrency {
    const plan = domain.plans.find(record => record.plan_id === planId);
    if (!plan) throw new Error("Interview plan was not found.");
    if (plan.lifecycle === "superseded") return "superseded";
    if (plan.lifecycle !== "published" || plan.snapshot_hash === null) return "unsupported";
    let stale = false;
    for (const item of plan.items) {
      const question = domain.questions.find(record => record.question_id === item.question_ref);
      if (!question) return "conflict";
      if (question.version_number !== item.question_version_number || question.prompt !== item.question_snapshot.prompt || question.client_safe_explanation !== item.question_snapshot.client_safe_explanation || question.origin !== item.question_snapshot.origin || question.topic_label !== item.question_snapshot.topic_label || stableStringify(question.source_refs, 0) !== stableStringify(item.question_snapshot.source_refs, 0)) stale = true;
    }
    return stale ? "stale" : "current";
  }

  export function startInterviewSession(domain: InterviewSessionsDomain, sessionId: string, profile: PresentationProfile): InterviewSessionRecord {
    if (profile !== "advisor") throw new Error("Only Advisor View may start an Interview session.");
    validateInterviewSessionsDomain(domain);
    if (domain.sessions.some(record => record.session_id !== sessionId && (record.lifecycle === "in-progress" || record.lifecycle === "paused"))) throw new Error("Another Interview session is already active or paused.");
    const session = domain.sessions.find(record => record.session_id === sessionId); if (!session) throw new Error("Interview session was not found.");
    if (session.lifecycle !== "ready") throw new Error("Only a ready Interview session may start.");
    const plan = domain.plans.find(record => record.plan_id === session.plan_ref); if (!plan || plan.lifecycle !== "published" || plan.snapshot_hash === null) throw new Error("Interview session requires a valid published plan snapshot.");
    const currency = assessInterviewPlanCurrency(domain, plan.plan_id); if (currency !== "current") throw new Error(`Interview plan is ${currency}; explicitly retain or publish a refreshed snapshot before Start.`);
    const timestamp = nowIso();
    const included = v05SortedByOrder(plan.items.filter(item => item.included));
    const created: InterviewSessionQuestionRecord[] = included.map((item, index) => ({
      session_question_id: newId("session_question"),
      session_ref: session.session_id,
      plan_item_ref: item.plan_item_id,
      order: index + 1,
      question_ref: item.question_ref,
      question_version_number: item.question_version_number,
      question_snapshot: deepClone(item.question_snapshot),
      origin: item.question_snapshot.origin,
      state: index === 0 ? "current" : "upcoming",
      statement_refs: [],
      advisor_note_refs: [],
      follow_up_refs: [],
      unresolved: false,
      disposition_rationale: "",
      visibility: item.visibility,
      created_at: timestamp,
      updated_at: timestamp
    }));
    domain.session_questions.push(...created);
    const initialRef = created[0]?.session_question_id ?? null;
    session.lifecycle = "in-progress";
    session.actual_start = timestamp;
    session.actual_end = null;
    session.active_session_question_ref = initialRef;
    session.elapsed_seconds_hint = 0;
    session.start_snapshot = {
      plan_ref: plan.plan_id,
      plan_snapshot_hash: plan.snapshot_hash,
      plan_title: plan.title,
      ordered_session_question_refs: created.map(record => record.session_question_id),
      attendee_participant_refs: deepClone(session.attendee_participant_refs),
      attendee_display_labels: deepClone(session.attendee_display_labels),
      facilitator_label: session.facilitator_label,
      started_at: timestamp,
      started_profile: profile,
      initial_session_question_ref: initialRef
    };
    session.pause_state = null;
    session.updated_at = timestamp;
    validateInterviewSessionsDomain(domain);
    return session;
  }

  export function navigateInterviewQuestion(domain: InterviewSessionsDomain, sessionId: string, targetQuestionId: string, profile: PresentationProfile): InterviewSessionQuestionRecord {
    if (profile !== "advisor") throw new Error("Only Advisor View may navigate the governed Interview agenda.");
    const session = domain.sessions.find(record => record.session_id === sessionId); if (!session || session.lifecycle !== "in-progress") throw new Error("Interview session is not in progress.");
    const target = domain.session_questions.find(record => record.session_question_id === targetQuestionId && record.session_ref === sessionId); if (!target) throw new Error("Target session question was not found.");
    const timestamp = nowIso();
    for (const record of domain.session_questions.filter(item => item.session_ref === sessionId)) {
      if (record.state === "current") record.state = record.statement_refs.length > 0 ? "answered" : "upcoming";
      if (record.session_question_id === targetQuestionId) record.state = "current";
      record.updated_at = timestamp;
    }
    session.active_session_question_ref = targetQuestionId; session.updated_at = timestamp;
    validateInterviewSessionsDomain(domain);
    return target;
  }

  export function pauseInterviewSession(domain: InterviewSessionsDomain, sessionId: string, elapsedSecondsHint: number, profile: PresentationProfile): InterviewSessionRecord {
    if (profile !== "advisor") throw new Error("Only Advisor View may pause an Interview session.");
    const session = domain.sessions.find(record => record.session_id === sessionId); if (!session || session.lifecycle !== "in-progress") throw new Error("Only an in-progress Interview session may pause.");
    const timestamp = nowIso();
    const questions = v05SortedByOrder(domain.session_questions.filter(record => record.session_ref === sessionId));
    session.elapsed_seconds_hint = requireV05Integer(elapsedSecondsHint, "Interview elapsed-time hint", 0, 604800);
    session.lifecycle = "paused";
    session.pause_state = {
      paused_at: timestamp,
      active_session_question_ref: session.active_session_question_ref,
      ordered_session_question_refs: questions.map(record => record.session_question_id),
      elapsed_seconds_hint: session.elapsed_seconds_hint,
      unresolved_session_question_refs: questions.filter(record => record.unresolved || record.state === "deferred").map(record => record.session_question_id)
    };
    session.updated_at = timestamp;
    validateInterviewSessionsDomain(domain);
    return session;
  }

  export function resumeInterviewSession(domain: InterviewSessionsDomain, sessionId: string, profile: PresentationProfile): InterviewSessionRecord {
    if (profile !== "advisor") throw new Error("Only Advisor View may resume an Interview session.");
    if (domain.sessions.some(record => record.session_id !== sessionId && (record.lifecycle === "in-progress" || record.lifecycle === "paused"))) throw new Error("Another Interview session is already active or paused.");
    const session = domain.sessions.find(record => record.session_id === sessionId); if (!session || session.lifecycle !== "paused" || session.pause_state === null) throw new Error("Only a valid paused Interview session may resume.");
    session.lifecycle = "in-progress";
    session.active_session_question_ref = session.pause_state.active_session_question_ref;
    session.elapsed_seconds_hint = session.pause_state.elapsed_seconds_hint;
    session.pause_state = null;
    session.updated_at = nowIso();
    validateInterviewSessionsDomain(domain);
    return session;
  }

  export function completeInterviewSession(domain: InterviewSessionsDomain, sessionId: string, profile: PresentationProfile): InterviewSessionRecord {
    if (profile !== "advisor") throw new Error("Only Advisor View may complete an Interview session.");
    const session = domain.sessions.find(record => record.session_id === sessionId); if (!session || !["in-progress", "paused"].includes(session.lifecycle)) throw new Error("Only an active or paused Interview session may complete.");
    const timestamp = nowIso();
    const current = domain.session_questions.find(record => record.session_ref === sessionId && record.state === "current");
    if (current) { current.state = current.statement_refs.length > 0 ? "answered" : "closed"; current.updated_at = timestamp; }
    session.lifecycle = "completed";
    session.post_session_review_state = "pending";
    session.actual_end = timestamp;
    session.active_session_question_ref = null;
    session.pause_state = null;
    session.updated_at = timestamp;
    validateInterviewSessionsDomain(domain);
    return session;
  }

  export function cancelInterviewSession(domain: InterviewSessionsDomain, sessionId: string, rationale: string, profile: PresentationProfile): InterviewSessionRecord {
    if (profile !== "advisor") throw new Error("Only Advisor View may cancel an Interview session.");
    const session = domain.sessions.find(record => record.session_id === sessionId); if (!session || !["planned", "ready", "in-progress", "paused"].includes(session.lifecycle)) throw new Error("Interview session cannot be cancelled from its current state.");
    const reason = requireV05String(rationale, "Interview cancellation rationale", 8000); const timestamp = nowIso();
    session.lifecycle = "cancelled"; session.actual_end = timestamp; session.active_session_question_ref = null; session.pause_state = null; session.post_session_review_state = "closed"; session.updated_at = timestamp;
    domain.parking_lot_items.push({ parking_lot_id: newId("parking_lot"), session_ref: sessionId, session_question_ref: null, title: "Cancelled session rationale", detail: reason, deferral_reason: reason, intended_destination: "Replacement session if required", owner_label: session.facilitator_label, due_date: "", operational_state: "cancelled", related_refs: [], visibility: "advisor-only", provenance: createV05Provenance("session-cancellation", sessionId, timestamp, "advisor", "not-evaluated"), created_at: timestamp, updated_at: timestamp });
    validateInterviewSessionsDomain(domain);
    return session;
  }

  export function recordParticipantStatement(domain: InterviewSessionsDomain, input: { session_ref: string; session_question_ref: string; asserted_participant_ref: string | null; asserted_speaker_label: string; recording_method: ParticipantStatementMethod; text: string; visibility: Visibility; }, profile: PresentationProfile): ParticipantStatementRecord {
    if (profile !== "advisor" && profile !== "client") throw new Error("Participant statements may be recorded only during Advisor or Client presentation workflows.");
    const session = domain.sessions.find(record => record.session_id === input.session_ref); if (!session || session.lifecycle !== "in-progress") throw new Error("Participant statement requires an in-progress session.");
    const question = domain.session_questions.find(record => record.session_question_id === input.session_question_ref && record.session_ref === input.session_ref); if (!question) throw new Error("Participant statement requires a valid session question.");
    if (input.recording_method === "imported-context") throw new Error("Imported context must enter through a reviewed import adapter, not the live statement command.");
    const timestamp = nowIso();
    const statement: ParticipantStatementRecord = { statement_id: newId("participant_statement"), session_ref: input.session_ref, session_question_ref: input.session_question_ref, asserted_participant_ref: input.asserted_participant_ref, asserted_speaker_label: requireV05String(input.asserted_speaker_label, "Asserted speaker label", 300, true), recording_method: input.recording_method, text: requireV05String(input.text, "Participant statement", 16000), version_number: 1, lifecycle: "active", review_state: "pending", visibility: validateV05Visibility(input.visibility, "Participant statement visibility"), supersedes_statement_ref: null, superseded_by_statement_ref: null, provenance: createV05Provenance("live-session-entry", input.session_question_ref, timestamp, profile, "not-evaluated", "Locally asserted facilitation entry"), created_at: timestamp, updated_at: timestamp };
    domain.participant_statements.push(statement); question.statement_refs.push(statement.statement_id); question.updated_at = timestamp; validateInterviewSessionsDomain(domain); return statement;
  }

  export function recordAdvisorNote(domain: InterviewSessionsDomain, input: { session_ref: string; session_question_ref: string; kind: AdvisorNoteKind; title: string; text: string; }, profile: PresentationProfile): AdvisorNoteRecord {
    if (profile !== "advisor") throw new Error("Only Advisor View may record Advisor notes.");
    const session = domain.sessions.find(record => record.session_id === input.session_ref); if (!session || !["in-progress", "paused"].includes(session.lifecycle)) throw new Error("Advisor note requires an active or paused session.");
    const question = domain.session_questions.find(record => record.session_question_id === input.session_question_ref && record.session_ref === input.session_ref); if (!question) throw new Error("Advisor note requires a valid session question.");
    const timestamp = nowIso();
    const note: AdvisorNoteRecord = { advisor_note_id: newId("advisor_note"), session_ref: input.session_ref, session_question_ref: input.session_question_ref, kind: input.kind, title: requireV05String(input.title, "Advisor note title", 300, true), text: requireV05String(input.text, "Advisor note text", 16000), visibility: "advisor-only", lifecycle: "active", provenance: createV05Provenance("advisor-session-note", input.session_question_ref, timestamp, "advisor", "not-evaluated"), created_at: timestamp, updated_at: timestamp };
    domain.advisor_notes.push(note); question.advisor_note_refs.push(note.advisor_note_id); question.updated_at = timestamp; validateInterviewSessionsDomain(domain); return note;
  }

  export function recordInterviewConfirmation(domain: InterviewSessionsDomain, input: { session_ref: string; confirmed_record_kind: typeof CONFIRMATION_TARGET_KINDS[number]; confirmed_record_ref: string; asserted_confirmer_participant_ref: string | null; asserted_confirmer_label: string; method: typeof CONFIRMATION_METHODS[number]; visibility: Visibility; }, profile: PresentationProfile): InterviewConfirmationRecord {
    if (profile !== "advisor" && profile !== "client") throw new Error("Interview confirmation requires Advisor or Client presentation workflow.");
    const session = domain.sessions.find(record => record.session_id === input.session_ref); if (!session) throw new Error("Interview confirmation requires a valid session.");
    let version: number;
    if (input.confirmed_record_kind === "participant-statement") {
      const statement = domain.participant_statements.find(record => record.statement_id === input.confirmed_record_ref && record.session_ref === input.session_ref); if (!statement || statement.recording_method === "imported-context") throw new Error("Only a valid direct participant statement may be confirmed through this command."); version = statement.version_number;
    } else {
      const summary = domain.summaries.find(record => record.summary_id === input.confirmed_record_ref && record.session_ref === input.session_ref && record.kind === "client-visible-session-summary"); if (!summary) throw new Error("Only a valid Client-visible summary may be confirmed."); version = summary.version_number;
    }
    const timestamp = nowIso(); const state: ConfirmationState = input.method === "correction-requested" ? "correction-requested" : input.method === "explicitly-declined" ? "declined" : "confirmed";
    const confirmation: InterviewConfirmationRecord = { confirmation_id: newId("interview_confirmation"), session_ref: input.session_ref, confirmed_record_kind: input.confirmed_record_kind, confirmed_record_ref: input.confirmed_record_ref, confirmed_record_version: version, asserted_confirmer_participant_ref: input.asserted_confirmer_participant_ref, asserted_confirmer_label: requireV05String(input.asserted_confirmer_label, "Asserted confirmer label", 300, true), method: input.method, state, detail: "Locally recorded facilitation confirmation; not authenticated identity, an electronic signature, legal approval, or approval of the full engagement.", visibility: validateV05Visibility(input.visibility, "Interview confirmation visibility"), provenance: createV05Provenance("local-facilitation-confirmation", input.confirmed_record_ref, timestamp, profile, "not-evaluated"), created_at: timestamp };
    domain.confirmations.push(confirmation); validateInterviewSessionsDomain(domain); return confirmation;
  }

  export function createInterviewCandidate(domain: InterviewSessionsDomain, input: { source_refs: string[]; target_domain: InterviewTargetDomain; target_type: string; proposed_operation: typeof INTERVIEW_CANDIDATE_OPERATIONS[number]; proposed_fields: Record<string, string>; rationale: string; visibility?: Visibility; }, profile: PresentationProfile): InterviewCandidateRecord {
    if (profile !== "advisor") throw new Error("Only Advisor View may create Interview candidates.");
    const timestamp = nowIso(); const candidate: InterviewCandidateRecord = { candidate_id: newId("interview_candidate"), source_refs: validateV05ReferenceArray(input.source_refs, "Interview candidate source references"), target_domain: requireV05Enum(input.target_domain, INTERVIEW_TARGETS, "Interview candidate target"), target_type: requireV05String(input.target_type, "Interview candidate target type", 160), proposed_operation: requireV05Enum(input.proposed_operation, INTERVIEW_CANDIDATE_OPERATIONS, "Interview candidate operation"), proposed_fields: validateV05ScalarFields(input.proposed_fields, "Interview candidate fields"), rationale: requireV05String(input.rationale, "Interview candidate rationale", 8000), state: "awaiting-review", target_candidate_ref: null, target_decision_ref: null, visibility: input.visibility ?? "advisor-only", supersedes_candidate_ref: null, superseded_by_candidate_ref: null, provenance: createV05Provenance("interview-record", input.source_refs[0] ?? domain.interview_domain_id, timestamp, "advisor", "not-evaluated"), created_at: timestamp, updated_at: timestamp };
    domain.candidates.push(candidate); validateInterviewSessionsDomain(domain); return candidate;
  }

  export function buildInterviewProjection(domain: InterviewSessionsDomain, workspace: WorkspaceId, profile: PresentationProfile, generatedAt = nowIso()): InterviewProjection {
    validateInterviewSessionsDomain(domain);
    const visible = <T extends { visibility: Visibility }>(records: readonly T[]): T[] => records.filter(record => canViewV05(record.visibility, profile));
    const sanitize = (record: unknown): Record<string, unknown> => {
      const clone = deepClone(record) as Record<string, unknown>;
      if (profile === "client") {
        delete clone.provenance; delete clone.rationale; delete clone.advisor_rationale; delete clone.source_refs; delete clone.related_refs; delete clone.target_candidate_ref; delete clone.target_decision_ref; delete clone.source_advisor_note_refs;
      }
      return clone;
    };
    const sessions = visible(domain.sessions).map(sanitize);
    const visibleSessionIds = new Set(sessions.map(record => String(record.session_id)));
    const sessionQuestions = visible(domain.session_questions.filter(record => visibleSessionIds.has(record.session_ref))).map(sanitize);
    const visibleSessionQuestionIds = new Set(sessionQuestions.map(record => String(record.session_question_id)));
    const statements = visible(domain.participant_statements.filter(record => visibleSessionQuestionIds.has(record.session_question_ref))).map(sanitize);
    const summaries = visible(domain.summaries.filter(record => visibleSessionIds.has(record.session_ref) && (profile !== "client" || record.lifecycle === "approved-for-client-presentation"))).map(sanitize);
    const confirmations = visible(domain.confirmations.filter(record => visibleSessionIds.has(record.session_ref))).map(sanitize);
    const followUps = visible(domain.follow_ups.filter(record => visibleSessionIds.has(record.session_ref))).map(sanitize);
    const parking = visible(domain.parking_lot_items.filter(record => visibleSessionIds.has(record.session_ref))).map(sanitize);
    const questions = visible(domain.questions).map(sanitize);
    const plans = visible(domain.plans).map(record => {
      const clone = sanitize(record);
      if (profile === "client") clone.items = record.items.filter(item => canViewV05(item.visibility, profile)).map(item => { const itemClone = sanitize(item); delete itemClone.advisor_rationale; delete itemClone.source_refs; return itemClone; });
      return clone;
    });
    const notes = profile === "client" ? [] : domain.advisor_notes.map(sanitize);
    const candidates = profile === "client" ? [] : visible(domain.candidates).map(sanitize);
    const receipts = profile === "client" ? [] : domain.import_receipts.map(sanitize);
    const active = domain.sessions.find(record => record.lifecycle === "in-progress" || record.lifecycle === "paused");
    const activeQuestions = active ? v05SortedByOrder(domain.session_questions.filter(record => record.session_ref === active.session_id && canViewV05(record.visibility, profile))) : [];
    const currentIndex = activeQuestions.findIndex(record => record.session_question_id === active?.active_session_question_ref);
    const sourceIds = [...questions, ...plans, ...sessions, ...sessionQuestions, ...statements, ...notes, ...confirmations, ...summaries, ...followUps, ...parking, ...candidates].map(record => String(record.question_id ?? record.plan_id ?? record.session_id ?? record.session_question_id ?? record.statement_id ?? record.advisor_note_id ?? record.confirmation_id ?? record.summary_id ?? record.follow_up_id ?? record.parking_lot_id ?? record.candidate_id ?? "")).filter(Boolean);
    const projection: InterviewProjection = { projection_kind: "l2g_interview_projection_v1", workspace, profile, generated_at: generatedAt, source_domain: "Interview Sessions", source_interview_domain_id: domain.interview_domain_id, source_record_ids: sourceIds, questions, plans, sessions, session_questions: sessionQuestions, participant_statements: statements, advisor_notes: notes, confirmations, summaries, follow_ups: followUps, parking_lot_items: parking, candidates, import_receipts: receipts, active_session_ref: active && canViewV05(active.visibility, profile) ? active.session_id : null, progress: { current: currentIndex >= 0 ? currentIndex + 1 : 0, total: activeQuestions.length, label: activeQuestions.length > 0 ? `${currentIndex >= 0 ? currentIndex + 1 : 0} of ${activeQuestions.length} planned questions` : "No active planned questions" }, next_work: buildInterviewNextWork(domain, profile, generatedAt) };
    return deepFreezeV05(projection);
  }

  export function buildInterviewNextWork(domain: InterviewSessionsDomain, profile: PresentationProfile, generatedAt = nowIso()): InterviewNextWorkItem[] {
    validateInterviewSessionsDomain(domain); const items: InterviewNextWorkItem[] = [];
    for (const plan of domain.plans.filter(record => canViewV05(record.visibility, profile))) {
      const currency = assessInterviewPlanCurrency(domain, plan.plan_id); if (currency === "stale" || currency === "conflict") items.push({ kind: "stale-plan", record_ref: plan.plan_id, title: plan.title, detail: `The frozen plan is ${currency}; compare and explicitly retain or publish a refreshed snapshot.`, priority: 10 }); else if (plan.lifecycle === "draft") items.push({ kind: "plan-validation", record_ref: plan.plan_id, title: plan.title, detail: "Review and publish a valid immutable plan snapshot before Start.", priority: 20 });
    }
    for (const session of domain.sessions.filter(record => canViewV05(record.visibility, profile))) {
      if (session.lifecycle === "in-progress") items.push({ kind: "active-session", record_ref: session.session_id, title: session.title, detail: "Continue the in-progress session or pause/end it explicitly.", priority: 1 });
      else if (session.lifecycle === "paused") items.push({ kind: "paused-session", record_ref: session.session_id, title: session.title, detail: "Resume the governed paused session at its recorded question or end it explicitly.", priority: 2 });
      else if (session.lifecycle === "ready") items.push({ kind: "ready-session", record_ref: session.session_id, title: session.title, detail: "The session is ready to start after final plan and participant review.", priority: 30 });
      else if (session.lifecycle === "completed" && ["pending", "in-review", "changes-requested"].includes(session.post_session_review_state)) items.push({ kind: "post-session-review", record_ref: session.session_id, title: session.title, detail: "Review statements, confirmations, notes, unresolved questions, follow-ups, summaries, and candidates separately.", priority: 40 });
    }
    for (const question of domain.session_questions.filter(record => canViewV05(record.visibility, profile) && (record.unresolved || record.state === "deferred"))) items.push({ kind: "unresolved-question", record_ref: question.session_question_id, title: question.question_snapshot.topic_label, detail: "The session question remains unresolved or deferred; completion does not close it automatically.", priority: 50 });
    for (const confirmation of domain.confirmations.filter(record => canViewV05(record.visibility, profile) && ["pending", "correction-requested", "stale"].includes(record.state))) items.push({ kind: "confirmation", record_ref: confirmation.confirmation_id, title: "Confirmation requires attention", detail: "Review the exact statement or Client-summary version and preserve correction/decline state.", priority: 60 });
    for (const summary of domain.summaries.filter(record => canViewV05(record.visibility, profile) && ["draft", "proposed"].includes(record.lifecycle))) items.push({ kind: "summary", record_ref: summary.summary_id, title: summary.title, detail: "Review this separate summary without replacing its raw source records.", priority: 70 });
    for (const followUp of domain.follow_ups.filter(record => canViewV05(record.visibility, profile) && ["open", "waiting", "blocked"].includes(record.operational_state))) items.push({ kind: "follow-up", record_ref: followUp.follow_up_id, title: followUp.title, detail: isV05Overdue(followUp.due_date, generatedAt) ? `Follow-up was due ${followUp.due_date}; this is an operational flag, not an assessment conclusion.` : followUp.detail || "Follow-up remains open.", priority: 80 });
    if (profile !== "client") for (const candidate of domain.candidates.filter(record => ["awaiting-review", "returned"].includes(record.state))) items.push({ kind: "candidate", record_ref: candidate.candidate_id, title: candidate.target_type, detail: "The source-domain proposal remains unaccepted by the target authority.", priority: 90 });
    if (items.length === 0) items.push({ kind: "informational", record_ref: domain.interview_domain_id, title: "No immediate Interview task", detail: "No profile-visible session task was identified. This is not a readiness, compliance, or evidence-sufficiency conclusion.", priority: 999 });
    return items.sort((left, right) => left.priority - right.priority || left.title.localeCompare(right.title));
  }
}
