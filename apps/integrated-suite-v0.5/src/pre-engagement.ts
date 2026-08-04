namespace L2G {
  export const PRE_ENGAGEMENT_SCHEMA_KIND = "l2g_pre_engagement_v1" as const;
  export const PRE_ENGAGEMENT_SCHEMA_VERSION = "1.0" as const;

  const INTAKE_REQUEST_KINDS = ["questionnaire", "inventory", "document", "participant", "clarification", "evidence-reference", "other"] as const;
  const INTAKE_OPERATIONAL_STATES = ["not-requested", "requested", "in-progress", "partially-received", "received", "needs-clarification", "satisfied", "cancelled", "superseded"] as const;
  const INTAKE_LIFECYCLES = ["draft", "active", "superseded", "archived"] as const;
  const INSTRUMENT_KINDS = ["questionnaire", "inventory", "checklist", "file-request", "participant-request", "mixed"] as const;
  const INTAKE_ITEM_KINDS = ["question", "inventory-field", "check", "file-request", "participant-request", "instruction", "heading"] as const;
  const INTAKE_VALUE_TYPES = ["none", "short-text", "long-text", "integer", "decimal", "boolean", "date", "single-select", "multi-select", "reference-list"] as const;
  const ASSIGNMENT_CURRENCY_STATES = ["current", "stale", "conflict", "superseded", "unsupported"] as const;
  const RECEIPT_METHODS = ["local-entry", "advisor-facilitated-entry", "imported-package", "meeting-context-import", "other"] as const;
  const RESPONSE_ORIGINS = ["client-provided", "advisor-entered-on-behalf", "source-derived-candidate", "imported-context", "advisor-interpretation"] as const;
  const EXCEPTION_KINDS = ["missing-submission", "incomplete-response", "conflicting-response", "ambiguous-source", "stale-assignment", "invalid-participant", "unsupported-import", "due-date", "traceability", "other"] as const;
  const EXCEPTION_STATES = ["open", "waiting", "blocked", "resolved", "cancelled"] as const;
  const PRE_ENGAGEMENT_TARGETS = ["engagement", "evidence", "scope", "practice-review", "ssp", "reviews-actions"] as const;
  const CANDIDATE_OPERATIONS = ["create", "modify", "link", "supersede"] as const;
  const V05_CANDIDATE_STATES = ["draft", "awaiting-review", "published-to-target", "returned", "withdrawn", "superseded", "closed"] as const;
  const IMPORT_DISPOSITIONS = ["previewed", "applied", "applied-reviewed-subset", "rejected", "returned", "failed"] as const;

  export type IntakeRequestKind = typeof INTAKE_REQUEST_KINDS[number];
  export type IntakeOperationalState = typeof INTAKE_OPERATIONAL_STATES[number];
  export type IntakeLifecycle = typeof INTAKE_LIFECYCLES[number];
  export type IntakeReviewState = typeof V05_REVIEW_STATES[number];
  export type InstrumentKind = typeof INSTRUMENT_KINDS[number];
  export type IntakeItemKind = typeof INTAKE_ITEM_KINDS[number];
  export type IntakeValueType = typeof INTAKE_VALUE_TYPES[number];
  export type AssignmentCurrencyState = typeof ASSIGNMENT_CURRENCY_STATES[number];
  export type ReceiptMethod = typeof RECEIPT_METHODS[number];
  export type IntakeResponseOrigin = typeof RESPONSE_ORIGINS[number];
  export type IntakeExceptionKind = typeof EXCEPTION_KINDS[number];
  export type IntakeExceptionState = typeof EXCEPTION_STATES[number];
  export type PreEngagementTargetDomain = typeof PRE_ENGAGEMENT_TARGETS[number];
  export type V05CandidateState = typeof V05_CANDIDATE_STATES[number];

  export interface IntakeRequestRecord {
    request_id: string;
    kind: IntakeRequestKind;
    title: string;
    description: string;
    owner_label: string;
    participant_refs: string[];
    organization_refs: string[];
    due_date: string;
    operational_state: IntakeOperationalState;
    lifecycle: IntakeLifecycle;
    review_state: IntakeReviewState;
    visibility: Visibility;
    related_refs: string[];
    provenance: V05Provenance;
    created_at: string;
    updated_at: string;
  }

  export interface IntakeInstrumentSection {
    section_id: string;
    title: string;
    order: number;
    item_refs: string[];
  }

  export interface IntakeInstrumentItem {
    item_id: string;
    section_ref: string;
    order: number;
    kind: IntakeItemKind;
    prompt: string;
    client_safe_help: string;
    value_type: IntakeValueType;
    required: boolean;
    options: string[];
    applicability_note: string;
    visibility: Visibility;
    source_refs: string[];
    provenance: V05Provenance;
  }

  export interface IntakeInstrumentRecord {
    instrument_id: string;
    kind: InstrumentKind;
    title: string;
    version_label: string;
    version_number: number;
    lifecycle: IntakeLifecycle;
    visibility: Visibility;
    sections: IntakeInstrumentSection[];
    items: IntakeInstrumentItem[];
    provenance: V05Provenance;
    created_at: string;
    updated_at: string;
  }

  export interface IntakeAssignmentSnapshotItem {
    item_id: string;
    section_ref: string;
    order: number;
    kind: IntakeItemKind;
    prompt: string;
    client_safe_help: string;
    value_type: IntakeValueType;
    required: boolean;
    options: string[];
    applicability_note: string;
    visibility: Visibility;
  }

  export interface IntakeAssignmentSnapshot {
    snapshot_hash: string;
    title: string;
    items: IntakeAssignmentSnapshotItem[];
  }

  export interface IntakeAssignmentRecord {
    assignment_id: string;
    request_ref: string;
    instrument_ref: string;
    instrument_version_number: number;
    snapshot: IntakeAssignmentSnapshot;
    participant_refs: string[];
    organization_refs: string[];
    assigned_at: string;
    due_date: string;
    instructions: string;
    operational_state: IntakeOperationalState;
    currency_state: AssignmentCurrencyState;
    lifecycle: IntakeLifecycle;
    visibility: Visibility;
    provenance: V05Provenance;
    created_at: string;
    updated_at: string;
  }

  export interface IntakeSubmissionRecord {
    submission_id: string;
    assignment_ref: string;
    request_ref: string;
    receipt_method: ReceiptMethod;
    asserted_submitter_participant_ref: string | null;
    asserted_submitter_label: string;
    received_at: string;
    response_refs: string[];
    review_state: IntakeReviewState;
    lifecycle: IntakeLifecycle;
    visibility: Visibility;
    provenance: V05Provenance;
    created_at: string;
    updated_at: string;
  }

  export type IntakeResponseValue = string | number | boolean | null | string[];

  export interface IntakeResponseRecord {
    response_id: string;
    submission_ref: string;
    assignment_ref: string;
    item_ref: string;
    item_version_number: number;
    origin: IntakeResponseOrigin;
    value_type: IntakeValueType;
    value: IntakeResponseValue;
    display_text: string;
    currency_state: AssignmentCurrencyState;
    lifecycle: IntakeLifecycle;
    review_state: IntakeReviewState;
    visibility: Visibility;
    supersedes_response_ref: string | null;
    superseded_by_response_ref: string | null;
    related_source_refs: string[];
    provenance: V05Provenance;
    created_at: string;
    updated_at: string;
  }

  export interface IntakeExceptionResolution {
    disposition: "keep-current" | "superseding-response" | "merged-response" | "deferred" | "closed";
    rationale: string;
    resulting_record_ref: string | null;
    resolved_at: string;
    resolved_by: PresentationProfile;
  }

  export interface IntakeExceptionRecord {
    exception_id: string;
    kind: IntakeExceptionKind;
    title: string;
    detail: string;
    affected_refs: string[];
    owner_label: string;
    due_date: string;
    operational_state: IntakeExceptionState;
    review_state: IntakeReviewState;
    visibility: Visibility;
    resolution: IntakeExceptionResolution | null;
    provenance: V05Provenance;
    created_at: string;
    updated_at: string;
  }

  export interface PreEngagementCandidateRecord {
    candidate_id: string;
    source_refs: string[];
    target_domain: PreEngagementTargetDomain;
    target_type: string;
    proposed_operation: typeof CANDIDATE_OPERATIONS[number];
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

  export interface PreEngagementImportReceipt {
    import_receipt_id: string;
    package_kind: "l2g_intake_package_v1" | "l2g_meeting_context_v1" | "l2g_scope_context_v1";
    package_version: "1.0";
    package_sha256: string;
    package_size_bytes: number;
    source_evidence_ref: string | null;
    registry_version: string;
    disposition: typeof IMPORT_DISPOSITIONS[number];
    created_refs: string[];
    modified_refs: string[];
    rejected_rows: string[];
    warnings: string[];
    created_at: string;
  }

  export interface PreEngagementProjectionPolicy {
    client_visible_values: Array<"client-safe" | "approved-for-client-presentation">;
    search_index_persistence: "none";
    client_include_internal_provenance: false;
    client_include_candidates: false;
    client_include_exceptions: false;
  }

  export interface PreEngagementDomain {
    schema_kind: typeof PRE_ENGAGEMENT_SCHEMA_KIND;
    schema_version: typeof PRE_ENGAGEMENT_SCHEMA_VERSION;
    pre_engagement_id: string;
    requests: IntakeRequestRecord[];
    instruments: IntakeInstrumentRecord[];
    assignments: IntakeAssignmentRecord[];
    submissions: IntakeSubmissionRecord[];
    responses: IntakeResponseRecord[];
    exceptions: IntakeExceptionRecord[];
    candidates: PreEngagementCandidateRecord[];
    import_receipts: PreEngagementImportReceipt[];
    projection_policy: PreEngagementProjectionPolicy;
  }

  export interface PreEngagementNextWorkItem {
    kind: "overdue-request" | "missing-submission" | "missing-response" | "clarification" | "conflict" | "stale-assignment" | "review" | "candidate" | "due-soon" | "informational";
    record_ref: string;
    title: string;
    detail: string;
    priority: number;
  }

  export interface PreEngagementProjection {
    projection_kind: "l2g_pre_engagement_projection_v1";
    workspace: WorkspaceId;
    profile: PresentationProfile;
    generated_at: string;
    source_domain: "Pre-Engagement";
    source_pre_engagement_id: string;
    source_record_ids: string[];
    requests: Array<Record<string, unknown>>;
    instruments: Array<Record<string, unknown>>;
    assignments: Array<Record<string, unknown>>;
    submissions: Array<Record<string, unknown>>;
    responses: Array<Record<string, unknown>>;
    exceptions: Array<Record<string, unknown>>;
    candidates: Array<Record<string, unknown>>;
    import_receipts: Array<Record<string, unknown>>;
    completeness: {
      required_assignments: number;
      received_assignments: number;
      missing_required_responses: number;
      overdue_requests: number;
      unresolved_exceptions: number;
      unreviewed_responses: number;
    };
    next_work: PreEngagementNextWorkItem[];
  }

  export function emptyPreEngagementDomain(timestamp = nowIso()): PreEngagementDomain {
    return {
      schema_kind: PRE_ENGAGEMENT_SCHEMA_KIND,
      schema_version: PRE_ENGAGEMENT_SCHEMA_VERSION,
      pre_engagement_id: newId("pre_engagement"),
      requests: [],
      instruments: [],
      assignments: [],
      submissions: [],
      responses: [],
      exceptions: [],
      candidates: [],
      import_receipts: [],
      projection_policy: {
        client_visible_values: ["client-safe", "approved-for-client-presentation"],
        search_index_persistence: "none",
        client_include_internal_provenance: false,
        client_include_candidates: false,
        client_include_exceptions: false
      }
    };
  }

  export function createSyntheticPreEngagement(timestamp = nowIso()): PreEngagementDomain {
    const domain = emptyPreEngagementDomain(timestamp);
    const requestId = newId("intake_request");
    const instrumentId = newId("intake_instrument");
    const sectionId = newId("section");
    const itemId = newId("intake_item");
    const assignmentId = newId("intake_assignment");
    const submissionId = newId("intake_submission");
    const responseId = newId("intake_response");
    const provenance = createV05Provenance("synthetic-fixture", "mcfirecoal-v05-pre-engagement", timestamp, "system", "not-evaluated", "McFirecoal synthetic data");
    domain.requests.push({
      request_id: requestId,
      kind: "questionnaire",
      title: "Synthetic foundational questionnaire",
      description: "Collect synthetic organizational and system context before the first facilitated session.",
      owner_label: "Advisor",
      participant_refs: [],
      organization_refs: [],
      due_date: "2026-08-12",
      operational_state: "received",
      lifecycle: "active",
      review_state: "pending",
      visibility: "client-safe",
      related_refs: [instrumentId],
      provenance: deepClone(provenance),
      created_at: timestamp,
      updated_at: timestamp
    });
    const item: IntakeInstrumentItem = {
      item_id: itemId,
      section_ref: sectionId,
      order: 1,
      kind: "question",
      prompt: "Describe the synthetic role responsible for coordinating the system boundary.",
      client_safe_help: "Identify the role, not a private individual, that coordinates the synthetic boundary information.",
      value_type: "long-text",
      required: true,
      options: [],
      applicability_note: "",
      visibility: "client-safe",
      source_refs: [],
      provenance: deepClone(provenance)
    };
    domain.instruments.push({
      instrument_id: instrumentId,
      kind: "questionnaire",
      title: "Synthetic organizational questionnaire",
      version_label: "1.0",
      version_number: 1,
      lifecycle: "active",
      visibility: "client-safe",
      sections: [{ section_id: sectionId, title: "Organization", order: 1, item_refs: [itemId] }],
      items: [item],
      provenance: deepClone(provenance),
      created_at: timestamp,
      updated_at: timestamp
    });
    domain.assignments.push({
      assignment_id: assignmentId,
      request_ref: requestId,
      instrument_ref: instrumentId,
      instrument_version_number: 1,
      snapshot: {
        snapshot_hash: "0".repeat(64),
        title: "Synthetic organizational questionnaire",
        items: [{
          item_id: itemId,
          section_ref: sectionId,
          order: 1,
          kind: "question",
          prompt: item.prompt,
          client_safe_help: item.client_safe_help,
          value_type: item.value_type,
          required: item.required,
          options: [],
          applicability_note: "",
          visibility: "client-safe"
        }]
      },
      participant_refs: [],
      organization_refs: [],
      assigned_at: timestamp,
      due_date: "2026-08-12",
      instructions: "Complete the synthetic questionnaire before the first session.",
      operational_state: "received",
      currency_state: "current",
      lifecycle: "active",
      visibility: "client-safe",
      provenance: deepClone(provenance),
      created_at: timestamp,
      updated_at: timestamp
    });
    domain.submissions.push({
      submission_id: submissionId,
      assignment_ref: assignmentId,
      request_ref: requestId,
      receipt_method: "advisor-facilitated-entry",
      asserted_submitter_participant_ref: null,
      asserted_submitter_label: "Synthetic client representative",
      received_at: timestamp,
      response_refs: [responseId],
      review_state: "pending",
      lifecycle: "active",
      visibility: "client-safe",
      provenance: createV05Provenance("synthetic-facilitated-entry", submissionId, timestamp, "advisor", "not-evaluated", "Locally asserted synthetic response"),
      created_at: timestamp,
      updated_at: timestamp
    });
    domain.responses.push({
      response_id: responseId,
      submission_ref: submissionId,
      assignment_ref: assignmentId,
      item_ref: itemId,
      item_version_number: 1,
      origin: "advisor-entered-on-behalf",
      value_type: "long-text",
      value: "The synthetic Program Owner coordinates boundary information with the synthetic cloud and service-provider teams.",
      display_text: "The synthetic Program Owner coordinates boundary information with the synthetic cloud and service-provider teams.",
      currency_state: "current",
      lifecycle: "active",
      review_state: "pending",
      visibility: "client-safe",
      supersedes_response_ref: null,
      superseded_by_response_ref: null,
      related_source_refs: [],
      provenance: createV05Provenance("synthetic-facilitated-entry", responseId, timestamp, "advisor", "not-evaluated", "Advisor entered on behalf; not authenticated client entry"),
      created_at: timestamp,
      updated_at: timestamp
    });
    validatePreEngagementDomain(domain);
    return domain;
  }

  export function validatePreEngagementDomain(value: unknown): asserts value is PreEngagementDomain {
    const domain = requireV05Record(value, "Pre-Engagement domain");
    assertV05ExactKeys(domain, ["schema_kind", "schema_version", "pre_engagement_id", "requests", "instruments", "assignments", "submissions", "responses", "exceptions", "candidates", "import_receipts", "projection_policy"], "Pre-Engagement domain");
    if (domain.schema_kind !== PRE_ENGAGEMENT_SCHEMA_KIND || domain.schema_version !== PRE_ENGAGEMENT_SCHEMA_VERSION) throw new Error("Pre-Engagement schema identity is unsupported.");
    requireV05Id(domain.pre_engagement_id, "pre_engagement", "Pre-Engagement identifier");
    const requests = requireV05Array(domain.requests, "Pre-Engagement requests", 500);
    const instruments = requireV05Array(domain.instruments, "Pre-Engagement instruments", 100);
    const assignments = requireV05Array(domain.assignments, "Pre-Engagement assignments", 1000);
    const submissions = requireV05Array(domain.submissions, "Pre-Engagement submissions", 2000);
    const responses = requireV05Array(domain.responses, "Pre-Engagement responses", 10000);
    const exceptions = requireV05Array(domain.exceptions, "Pre-Engagement exceptions", 2000);
    const candidates = requireV05Array(domain.candidates, "Pre-Engagement candidates", 5000);
    const receipts = requireV05Array(domain.import_receipts, "Pre-Engagement import receipts", 250);
    const ids = new Set<string>();
    const addId = (id: string, label: string): void => { if (ids.has(id)) throw new Error(`${label} duplicates a project-domain identifier.`); ids.add(id); };
    for (const [index, raw] of requests.entries()) validateIntakeRequest(raw, index, addId);
    for (const [index, raw] of instruments.entries()) validateIntakeInstrument(raw, index, addId);
    for (const [index, raw] of assignments.entries()) validateIntakeAssignment(raw, index, addId);
    for (const [index, raw] of submissions.entries()) validateIntakeSubmission(raw, index, addId);
    for (const [index, raw] of responses.entries()) validateIntakeResponse(raw, index, addId);
    for (const [index, raw] of exceptions.entries()) validateIntakeException(raw, index, addId);
    for (const [index, raw] of candidates.entries()) validatePreEngagementCandidate(raw, index, addId);
    for (const [index, raw] of receipts.entries()) validatePreEngagementImportReceipt(raw, index, addId);
    validatePreEngagementPolicy(domain.projection_policy);
    validatePreEngagementReferences(domain as unknown as PreEngagementDomain);
  }

  function validateIntakeRequest(value: unknown, index: number, addId: (id: string, label: string) => void): void {
    const label = `Pre-Engagement request ${index + 1}`;
    const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["request_id", "kind", "title", "description", "owner_label", "participant_refs", "organization_refs", "due_date", "operational_state", "lifecycle", "review_state", "visibility", "related_refs", "provenance", "created_at", "updated_at"], label);
    const id = requireV05Id(record.request_id, "intake_request", `${label}.request_id`); addId(id, label);
    requireV05Enum(record.kind, INTAKE_REQUEST_KINDS, `${label}.kind`);
    requireV05String(record.title, `${label}.title`, 300);
    requireV05String(record.description, `${label}.description`, 8000, true);
    requireV05String(record.owner_label, `${label}.owner_label`, 300, true);
    validateV05ReferenceArray(record.participant_refs, `${label}.participant_refs`, 100);
    validateV05ReferenceArray(record.organization_refs, `${label}.organization_refs`, 100);
    requireV05Date(record.due_date, `${label}.due_date`);
    requireV05Enum(record.operational_state, INTAKE_OPERATIONAL_STATES, `${label}.operational_state`);
    requireV05Enum(record.lifecycle, INTAKE_LIFECYCLES, `${label}.lifecycle`);
    requireV05Enum(record.review_state, V05_REVIEW_STATES, `${label}.review_state`);
    validateV05Visibility(record.visibility, `${label}.visibility`);
    validateV05ReferenceArray(record.related_refs, `${label}.related_refs`);
    validateV05Provenance(record.provenance, `${label}.provenance`);
    requireV05Iso(record.created_at, `${label}.created_at`); requireV05Iso(record.updated_at, `${label}.updated_at`);
  }

  function validateIntakeInstrument(value: unknown, index: number, addId: (id: string, label: string) => void): void {
    const label = `Pre-Engagement instrument ${index + 1}`;
    const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["instrument_id", "kind", "title", "version_label", "version_number", "lifecycle", "visibility", "sections", "items", "provenance", "created_at", "updated_at"], label);
    const id = requireV05Id(record.instrument_id, "intake_instrument", `${label}.instrument_id`); addId(id, label);
    requireV05Enum(record.kind, INSTRUMENT_KINDS, `${label}.kind`);
    requireV05String(record.title, `${label}.title`, 300);
    requireV05String(record.version_label, `${label}.version_label`, 100);
    requireV05Integer(record.version_number, `${label}.version_number`, 1, 1000000);
    requireV05Enum(record.lifecycle, INTAKE_LIFECYCLES, `${label}.lifecycle`);
    validateV05Visibility(record.visibility, `${label}.visibility`);
    const sections = requireV05Array(record.sections, `${label}.sections`, 500);
    const items = requireV05Array(record.items, `${label}.items`, 500);
    const sectionIds = new Set<string>();
    for (const [sectionIndex, raw] of sections.entries()) {
      const sectionLabel = `${label}.sections[${sectionIndex}]`;
      const section = requireV05Record(raw, sectionLabel);
      assertV05ExactKeys(section, ["section_id", "title", "order", "item_refs"], sectionLabel);
      const sectionId = requireV05Id(section.section_id, "section", `${sectionLabel}.section_id`);
      if (sectionIds.has(sectionId)) throw new Error(`${label} contains duplicate section identifiers.`); sectionIds.add(sectionId); addId(sectionId, sectionLabel);
      requireV05String(section.title, `${sectionLabel}.title`, 300);
      requireV05Integer(section.order, `${sectionLabel}.order`, 1, 10000);
      validateV05ReferenceArray(section.item_refs, `${sectionLabel}.item_refs`, 500);
    }
    const itemIds = new Set<string>();
    for (const [itemIndex, raw] of items.entries()) {
      const itemLabel = `${label}.items[${itemIndex}]`;
      const item = requireV05Record(raw, itemLabel);
      assertV05ExactKeys(item, ["item_id", "section_ref", "order", "kind", "prompt", "client_safe_help", "value_type", "required", "options", "applicability_note", "visibility", "source_refs", "provenance"], itemLabel);
      const itemId = requireV05Id(item.item_id, "intake_item", `${itemLabel}.item_id`);
      if (itemIds.has(itemId)) throw new Error(`${label} contains duplicate item identifiers.`); itemIds.add(itemId); addId(itemId, itemLabel);
      const sectionRef = requireV05Id(item.section_ref, "section", `${itemLabel}.section_ref`);
      if (!sectionIds.has(sectionRef)) throw new Error(`${itemLabel} references an unknown section.`);
      requireV05Integer(item.order, `${itemLabel}.order`, 1, 10000);
      requireV05Enum(item.kind, INTAKE_ITEM_KINDS, `${itemLabel}.kind`);
      requireV05String(item.prompt, `${itemLabel}.prompt`, 8000, item.kind === "heading" || item.kind === "instruction");
      requireV05String(item.client_safe_help, `${itemLabel}.client_safe_help`, 8000, true);
      const valueType = requireV05Enum(item.value_type, INTAKE_VALUE_TYPES, `${itemLabel}.value_type`);
      requireV05Boolean(item.required, `${itemLabel}.required`);
      const options = requireV05StringArray(item.options, `${itemLabel}.options`, 200, 300);
      if (!["single-select", "multi-select"].includes(valueType) && options.length > 0) throw new Error(`${itemLabel} may define options only for select value types.`);
      if (["single-select", "multi-select"].includes(valueType) && options.length === 0) throw new Error(`${itemLabel} requires at least one option.`);
      requireV05String(item.applicability_note, `${itemLabel}.applicability_note`, 8000, true);
      validateV05Visibility(item.visibility, `${itemLabel}.visibility`);
      validateV05ReferenceArray(item.source_refs, `${itemLabel}.source_refs`);
      validateV05Provenance(item.provenance, `${itemLabel}.provenance`);
    }
    for (const raw of sections) {
      const section = raw as Record<string, unknown>;
      for (const itemRef of section.item_refs as string[]) if (!itemIds.has(itemRef)) throw new Error(`${label} section references an unknown item.`);
    }
    validateV05Provenance(record.provenance, `${label}.provenance`);
    requireV05Iso(record.created_at, `${label}.created_at`); requireV05Iso(record.updated_at, `${label}.updated_at`);
  }

  function validateAssignmentSnapshot(value: unknown, label: string): void {
    const snapshot = requireV05Record(value, label);
    assertV05ExactKeys(snapshot, ["snapshot_hash", "title", "items"], label);
    const hash = requireV05String(snapshot.snapshot_hash, `${label}.snapshot_hash`, 64);
    if (!/^[0-9a-f]{64}$/.test(hash)) throw new Error(`${label}.snapshot_hash must be lowercase SHA-256 hexadecimal.`);
    requireV05String(snapshot.title, `${label}.title`, 300);
    const items = requireV05Array(snapshot.items, `${label}.items`, 500);
    const ids = new Set<string>();
    for (const [index, raw] of items.entries()) {
      const itemLabel = `${label}.items[${index}]`;
      const item = requireV05Record(raw, itemLabel);
      assertV05ExactKeys(item, ["item_id", "section_ref", "order", "kind", "prompt", "client_safe_help", "value_type", "required", "options", "applicability_note", "visibility"], itemLabel);
      const id = requireV05Id(item.item_id, "intake_item", `${itemLabel}.item_id`);
      if (ids.has(id)) throw new Error(`${label} contains duplicate item identifiers.`); ids.add(id);
      requireV05Id(item.section_ref, "section", `${itemLabel}.section_ref`);
      requireV05Integer(item.order, `${itemLabel}.order`, 1, 10000);
      requireV05Enum(item.kind, INTAKE_ITEM_KINDS, `${itemLabel}.kind`);
      requireV05String(item.prompt, `${itemLabel}.prompt`, 8000, true);
      requireV05String(item.client_safe_help, `${itemLabel}.client_safe_help`, 8000, true);
      requireV05Enum(item.value_type, INTAKE_VALUE_TYPES, `${itemLabel}.value_type`);
      requireV05Boolean(item.required, `${itemLabel}.required`);
      requireV05StringArray(item.options, `${itemLabel}.options`, 200, 300);
      requireV05String(item.applicability_note, `${itemLabel}.applicability_note`, 8000, true);
      validateV05Visibility(item.visibility, `${itemLabel}.visibility`);
    }
  }

  function validateIntakeAssignment(value: unknown, index: number, addId: (id: string, label: string) => void): void {
    const label = `Pre-Engagement assignment ${index + 1}`;
    const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["assignment_id", "request_ref", "instrument_ref", "instrument_version_number", "snapshot", "participant_refs", "organization_refs", "assigned_at", "due_date", "instructions", "operational_state", "currency_state", "lifecycle", "visibility", "provenance", "created_at", "updated_at"], label);
    const id = requireV05Id(record.assignment_id, "intake_assignment", `${label}.assignment_id`); addId(id, label);
    requireV05Id(record.request_ref, "intake_request", `${label}.request_ref`);
    requireV05Id(record.instrument_ref, "intake_instrument", `${label}.instrument_ref`);
    requireV05Integer(record.instrument_version_number, `${label}.instrument_version_number`, 1, 1000000);
    validateAssignmentSnapshot(record.snapshot, `${label}.snapshot`);
    validateV05ReferenceArray(record.participant_refs, `${label}.participant_refs`, 100);
    validateV05ReferenceArray(record.organization_refs, `${label}.organization_refs`, 100);
    requireV05Iso(record.assigned_at, `${label}.assigned_at`); requireV05Date(record.due_date, `${label}.due_date`);
    requireV05String(record.instructions, `${label}.instructions`, 8000, true);
    requireV05Enum(record.operational_state, INTAKE_OPERATIONAL_STATES, `${label}.operational_state`);
    requireV05Enum(record.currency_state, ASSIGNMENT_CURRENCY_STATES, `${label}.currency_state`);
    requireV05Enum(record.lifecycle, INTAKE_LIFECYCLES, `${label}.lifecycle`);
    validateV05Visibility(record.visibility, `${label}.visibility`); validateV05Provenance(record.provenance, `${label}.provenance`);
    requireV05Iso(record.created_at, `${label}.created_at`); requireV05Iso(record.updated_at, `${label}.updated_at`);
  }

  function validateIntakeSubmission(value: unknown, index: number, addId: (id: string, label: string) => void): void {
    const label = `Pre-Engagement submission ${index + 1}`;
    const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["submission_id", "assignment_ref", "request_ref", "receipt_method", "asserted_submitter_participant_ref", "asserted_submitter_label", "received_at", "response_refs", "review_state", "lifecycle", "visibility", "provenance", "created_at", "updated_at"], label);
    const id = requireV05Id(record.submission_id, "intake_submission", `${label}.submission_id`); addId(id, label);
    requireV05Id(record.assignment_ref, "intake_assignment", `${label}.assignment_ref`); requireV05Id(record.request_ref, "intake_request", `${label}.request_ref`);
    requireV05Enum(record.receipt_method, RECEIPT_METHODS, `${label}.receipt_method`);
    if (record.asserted_submitter_participant_ref !== null) requireV05Id(record.asserted_submitter_participant_ref, "participant", `${label}.asserted_submitter_participant_ref`);
    requireV05String(record.asserted_submitter_label, `${label}.asserted_submitter_label`, 300, true);
    requireV05Iso(record.received_at, `${label}.received_at`); validateV05ReferenceArray(record.response_refs, `${label}.response_refs`, 500);
    requireV05Enum(record.review_state, V05_REVIEW_STATES, `${label}.review_state`); requireV05Enum(record.lifecycle, INTAKE_LIFECYCLES, `${label}.lifecycle`);
    validateV05Visibility(record.visibility, `${label}.visibility`); validateV05Provenance(record.provenance, `${label}.provenance`);
    requireV05Iso(record.created_at, `${label}.created_at`); requireV05Iso(record.updated_at, `${label}.updated_at`);
  }

  function validateResponseValue(valueType: IntakeValueType, value: unknown, label: string, options: string[]): void {
    if (valueType === "none") { if (value !== null && value !== "") throw new Error(`${label} must be empty for value type none.`); return; }
    if (["short-text", "long-text", "date", "single-select"].includes(valueType)) {
      const text = requireV05String(value, label, valueType === "long-text" ? 16000 : 8000, true);
      if (valueType === "date" && text !== "") requireV05Date(text, label, false);
      if (valueType === "single-select" && !options.includes(text)) throw new Error(`${label} is not an allowed option.`);
      return;
    }
    if (valueType === "integer") { requireV05Integer(value, label, -1000000000, 1000000000); return; }
    if (valueType === "decimal") { if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`${label} must be a finite number.`); return; }
    if (valueType === "boolean") { requireV05Boolean(value, label); return; }
    if (["multi-select", "reference-list"].includes(valueType)) {
      const values = requireV05StringArray(value, label, 200, 300);
      if (valueType === "multi-select" && values.some(item => !options.includes(item))) throw new Error(`${label} contains an unsupported option.`);
      return;
    }
    throw new Error(`${label} has unsupported value semantics.`);
  }

  function validateIntakeResponse(value: unknown, index: number, addId: (id: string, label: string) => void): void {
    const label = `Pre-Engagement response ${index + 1}`;
    const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["response_id", "submission_ref", "assignment_ref", "item_ref", "item_version_number", "origin", "value_type", "value", "display_text", "currency_state", "lifecycle", "review_state", "visibility", "supersedes_response_ref", "superseded_by_response_ref", "related_source_refs", "provenance", "created_at", "updated_at"], label);
    const id = requireV05Id(record.response_id, "intake_response", `${label}.response_id`); addId(id, label);
    requireV05Id(record.submission_ref, "intake_submission", `${label}.submission_ref`); requireV05Id(record.assignment_ref, "intake_assignment", `${label}.assignment_ref`); requireV05Id(record.item_ref, "intake_item", `${label}.item_ref`);
    requireV05Integer(record.item_version_number, `${label}.item_version_number`, 1, 1000000);
    requireV05Enum(record.origin, RESPONSE_ORIGINS, `${label}.origin`); requireV05Enum(record.value_type, INTAKE_VALUE_TYPES, `${label}.value_type`);
    requireV05String(record.display_text, `${label}.display_text`, 16000, true);
    requireV05Enum(record.currency_state, ASSIGNMENT_CURRENCY_STATES, `${label}.currency_state`); requireV05Enum(record.lifecycle, INTAKE_LIFECYCLES, `${label}.lifecycle`); requireV05Enum(record.review_state, V05_REVIEW_STATES, `${label}.review_state`);
    validateV05Visibility(record.visibility, `${label}.visibility`);
    if (record.supersedes_response_ref !== null) requireV05Id(record.supersedes_response_ref, "intake_response", `${label}.supersedes_response_ref`);
    if (record.superseded_by_response_ref !== null) requireV05Id(record.superseded_by_response_ref, "intake_response", `${label}.superseded_by_response_ref`);
    validateV05ReferenceArray(record.related_source_refs, `${label}.related_source_refs`); validateV05Provenance(record.provenance, `${label}.provenance`);
    requireV05Iso(record.created_at, `${label}.created_at`); requireV05Iso(record.updated_at, `${label}.updated_at`);
  }

  function validateIntakeException(value: unknown, index: number, addId: (id: string, label: string) => void): void {
    const label = `Pre-Engagement exception ${index + 1}`;
    const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["exception_id", "kind", "title", "detail", "affected_refs", "owner_label", "due_date", "operational_state", "review_state", "visibility", "resolution", "provenance", "created_at", "updated_at"], label);
    const id = requireV05Id(record.exception_id, "intake_exception", `${label}.exception_id`); addId(id, label);
    requireV05Enum(record.kind, EXCEPTION_KINDS, `${label}.kind`); requireV05String(record.title, `${label}.title`, 300); requireV05String(record.detail, `${label}.detail`, 8000, true);
    validateV05ReferenceArray(record.affected_refs, `${label}.affected_refs`); requireV05String(record.owner_label, `${label}.owner_label`, 300, true); requireV05Date(record.due_date, `${label}.due_date`);
    requireV05Enum(record.operational_state, EXCEPTION_STATES, `${label}.operational_state`); requireV05Enum(record.review_state, V05_REVIEW_STATES, `${label}.review_state`); validateV05Visibility(record.visibility, `${label}.visibility`);
    if (record.resolution !== null) {
      const resolution = requireV05Record(record.resolution, `${label}.resolution`);
      assertV05ExactKeys(resolution, ["disposition", "rationale", "resulting_record_ref", "resolved_at", "resolved_by"], `${label}.resolution`);
      requireV05Enum(resolution.disposition, ["keep-current", "superseding-response", "merged-response", "deferred", "closed"] as const, `${label}.resolution.disposition`);
      requireV05String(resolution.rationale, `${label}.resolution.rationale`, 8000);
      if (resolution.resulting_record_ref !== null) requireV05String(resolution.resulting_record_ref, `${label}.resolution.resulting_record_ref`, 160);
      requireV05Iso(resolution.resolved_at, `${label}.resolution.resolved_at`); requireV05Enum(resolution.resolved_by, ["advisor", "client", "reviewer"] as const, `${label}.resolution.resolved_by`);
    }
    validateV05Provenance(record.provenance, `${label}.provenance`); requireV05Iso(record.created_at, `${label}.created_at`); requireV05Iso(record.updated_at, `${label}.updated_at`);
  }

  function validatePreEngagementCandidate(value: unknown, index: number, addId: (id: string, label: string) => void): void {
    const label = `Pre-Engagement candidate ${index + 1}`;
    const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["candidate_id", "source_refs", "target_domain", "target_type", "proposed_operation", "proposed_fields", "rationale", "state", "target_candidate_ref", "target_decision_ref", "visibility", "supersedes_candidate_ref", "superseded_by_candidate_ref", "provenance", "created_at", "updated_at"], label);
    const id = requireV05Id(record.candidate_id, "pre_engagement_candidate", `${label}.candidate_id`); addId(id, label);
    validateV05ReferenceArray(record.source_refs, `${label}.source_refs`); requireV05Enum(record.target_domain, PRE_ENGAGEMENT_TARGETS, `${label}.target_domain`); requireV05String(record.target_type, `${label}.target_type`, 160);
    requireV05Enum(record.proposed_operation, CANDIDATE_OPERATIONS, `${label}.proposed_operation`); validateV05ScalarFields(record.proposed_fields, `${label}.proposed_fields`); requireV05String(record.rationale, `${label}.rationale`, 8000);
    requireV05Enum(record.state, V05_CANDIDATE_STATES, `${label}.state`);
    if (record.target_candidate_ref !== null) requireV05String(record.target_candidate_ref, `${label}.target_candidate_ref`, 160);
    if (record.target_decision_ref !== null) requireV05String(record.target_decision_ref, `${label}.target_decision_ref`, 160);
    validateV05Visibility(record.visibility, `${label}.visibility`);
    if (record.supersedes_candidate_ref !== null) requireV05Id(record.supersedes_candidate_ref, "pre_engagement_candidate", `${label}.supersedes_candidate_ref`);
    if (record.superseded_by_candidate_ref !== null) requireV05Id(record.superseded_by_candidate_ref, "pre_engagement_candidate", `${label}.superseded_by_candidate_ref`);
    validateV05Provenance(record.provenance, `${label}.provenance`); requireV05Iso(record.created_at, `${label}.created_at`); requireV05Iso(record.updated_at, `${label}.updated_at`);
  }

  function validatePreEngagementImportReceipt(value: unknown, index: number, addId: (id: string, label: string) => void): void {
    const label = `Pre-Engagement import receipt ${index + 1}`;
    const record = requireV05Record(value, label);
    assertV05ExactKeys(record, ["import_receipt_id", "package_kind", "package_version", "package_sha256", "package_size_bytes", "source_evidence_ref", "registry_version", "disposition", "created_refs", "modified_refs", "rejected_rows", "warnings", "created_at"], label);
    const id = requireV05Id(record.import_receipt_id, "pre_engagement_import", `${label}.import_receipt_id`); addId(id, label);
    requireV05Enum(record.package_kind, ["l2g_intake_package_v1", "l2g_meeting_context_v1", "l2g_scope_context_v1"] as const, `${label}.package_kind`);
    if (record.package_version !== "1.0") throw new Error(`${label}.package_version is unsupported.`);
    const hash = requireV05String(record.package_sha256, `${label}.package_sha256`, 64); if (!/^[0-9a-f]{64}$/.test(hash)) throw new Error(`${label}.package_sha256 is invalid.`);
    requireV05Integer(record.package_size_bytes, `${label}.package_size_bytes`, 0, 16 * 1024 * 1024);
    if (record.source_evidence_ref !== null) requireV05Id(record.source_evidence_ref, "evidence", `${label}.source_evidence_ref`);
    requireV05String(record.registry_version, `${label}.registry_version`, 100); requireV05Enum(record.disposition, IMPORT_DISPOSITIONS, `${label}.disposition`);
    validateV05ReferenceArray(record.created_refs, `${label}.created_refs`, 1000); validateV05ReferenceArray(record.modified_refs, `${label}.modified_refs`, 1000);
    requireV05StringArray(record.rejected_rows, `${label}.rejected_rows`, 1000, 1000); requireV05StringArray(record.warnings, `${label}.warnings`, 1000, 1000); requireV05Iso(record.created_at, `${label}.created_at`);
  }

  function validatePreEngagementPolicy(value: unknown): void {
    const policy = requireV05Record(value, "Pre-Engagement projection policy");
    assertV05ExactKeys(policy, ["client_visible_values", "search_index_persistence", "client_include_internal_provenance", "client_include_candidates", "client_include_exceptions"], "Pre-Engagement projection policy");
    const values = requireV05StringArray(policy.client_visible_values, "Pre-Engagement projection policy client values", 2, 60);
    if (stableStringify(values, 0) !== stableStringify(["client-safe", "approved-for-client-presentation"], 0)) throw new Error("Pre-Engagement client visibility policy is unsupported.");
    if (policy.search_index_persistence !== "none" || policy.client_include_internal_provenance !== false || policy.client_include_candidates !== false || policy.client_include_exceptions !== false) throw new Error("Pre-Engagement projection policy weakens the accepted v0.5 boundary.");
  }

  function validatePreEngagementReferences(domain: PreEngagementDomain): void {
    const requestIds = new Set(domain.requests.map(record => record.request_id));
    const instrumentIds = new Set(domain.instruments.map(record => record.instrument_id));
    const assignmentIds = new Set(domain.assignments.map(record => record.assignment_id));
    const submissionIds = new Set(domain.submissions.map(record => record.submission_id));
    const responseIds = new Set(domain.responses.map(record => record.response_id));
    const itemById = new Map<string, IntakeInstrumentItem>();
    for (const instrument of domain.instruments) for (const item of instrument.items) itemById.set(item.item_id, item);
    for (const assignment of domain.assignments) {
      if (!requestIds.has(assignment.request_ref) || !instrumentIds.has(assignment.instrument_ref)) throw new Error("Pre-Engagement assignment contains a dangling request or instrument reference.");
      const instrument = domain.instruments.find(record => record.instrument_id === assignment.instrument_ref)!;
      if (instrument.version_number !== assignment.instrument_version_number) throw new Error("Pre-Engagement assignment version does not match the referenced instrument version.");
    }
    for (const submission of domain.submissions) {
      if (!assignmentIds.has(submission.assignment_ref) || !requestIds.has(submission.request_ref)) throw new Error("Pre-Engagement submission contains a dangling reference.");
      for (const responseRef of submission.response_refs) if (!responseIds.has(responseRef)) throw new Error("Pre-Engagement submission references an unknown response.");
    }
    for (const response of domain.responses) {
      if (!submissionIds.has(response.submission_ref) || !assignmentIds.has(response.assignment_ref)) throw new Error("Pre-Engagement response contains a dangling submission or assignment reference.");
      const assignment = domain.assignments.find(record => record.assignment_id === response.assignment_ref)!;
      const snapshotItem = assignment.snapshot.items.find(item => item.item_id === response.item_ref);
      if (!snapshotItem || !itemById.has(response.item_ref)) throw new Error("Pre-Engagement response references an unknown assignment item.");
      if (snapshotItem.value_type !== response.value_type) throw new Error("Pre-Engagement response type does not match its immutable assignment snapshot.");
      validateResponseValue(response.value_type, response.value, `Response ${response.response_id}.value`, snapshotItem.options);
      if (response.origin === "client-provided" && response.provenance.asserted_by !== "client") throw new Error("A client-provided response requires client-attributed provenance.");
      if (response.supersedes_response_ref !== null && !responseIds.has(response.supersedes_response_ref)) throw new Error("Pre-Engagement response supersedes an unknown response.");
      if (response.superseded_by_response_ref !== null && !responseIds.has(response.superseded_by_response_ref)) throw new Error("Pre-Engagement response is superseded by an unknown response.");
    }
  }

  export function buildPreEngagementProjection(domain: PreEngagementDomain, workspace: WorkspaceId, profile: PresentationProfile, generatedAt = nowIso()): PreEngagementProjection {
    validatePreEngagementDomain(domain);
    const visible = <T extends { visibility: Visibility }>(records: readonly T[]): T[] => records.filter(record => canViewV05(record.visibility, profile));
    const sanitize = (record: unknown): Record<string, unknown> => {
      const clone = deepClone(record) as Record<string, unknown>;
      if (profile === "client") {
        delete clone.provenance;
        delete clone.source_refs;
        delete clone.related_source_refs;
        delete clone.related_refs;
        delete clone.rationale;
        delete clone.target_candidate_ref;
        delete clone.target_decision_ref;
      }
      return clone;
    };
    const requests = visible(domain.requests).map(sanitize);
    const instruments = visible(domain.instruments).map(record => {
      const clone = sanitize(record);
      if (profile === "client") {
        clone.items = record.items.filter(item => canViewV05(item.visibility, profile)).map(item => {
          const itemClone = sanitize(item);
          delete itemClone.source_refs;
          return itemClone;
        });
        clone.sections = deepClone(record.sections);
      }
      return clone;
    });
    const assignments = visible(domain.assignments).map(sanitize);
    const submissions = visible(domain.submissions).map(sanitize);
    const responses = visible(domain.responses).map(sanitize);
    const exceptions = profile === "client" ? [] : visible(domain.exceptions).map(sanitize);
    const candidates = profile === "client" ? [] : visible(domain.candidates).map(sanitize);
    const importReceipts = profile === "client" ? [] : domain.import_receipts.map(sanitize);
    const requiredAssignments = domain.assignments.filter(record => record.lifecycle === "active").length;
    const receivedAssignments = domain.assignments.filter(record => ["received", "satisfied"].includes(record.operational_state)).length;
    let missingRequiredResponses = 0;
    for (const assignment of domain.assignments) {
      for (const item of assignment.snapshot.items.filter(snapshotItem => snapshotItem.required)) {
        if (!domain.responses.some(response => response.assignment_ref === assignment.assignment_id && response.item_ref === item.item_id && response.lifecycle === "active")) missingRequiredResponses += 1;
      }
    }
    const sourceRecordIds = [
      ...requests.map(record => String(record.request_id)),
      ...instruments.map(record => String(record.instrument_id)),
      ...assignments.map(record => String(record.assignment_id)),
      ...submissions.map(record => String(record.submission_id)),
      ...responses.map(record => String(record.response_id)),
      ...exceptions.map(record => String(record.exception_id)),
      ...candidates.map(record => String(record.candidate_id))
    ];
    const projection: PreEngagementProjection = {
      projection_kind: "l2g_pre_engagement_projection_v1",
      workspace,
      profile,
      generated_at: generatedAt,
      source_domain: "Pre-Engagement",
      source_pre_engagement_id: domain.pre_engagement_id,
      source_record_ids: sourceRecordIds,
      requests,
      instruments,
      assignments,
      submissions,
      responses,
      exceptions,
      candidates,
      import_receipts: importReceipts,
      completeness: {
        required_assignments: requiredAssignments,
        received_assignments: receivedAssignments,
        missing_required_responses: missingRequiredResponses,
        overdue_requests: visible(domain.requests).filter(record => !["satisfied", "cancelled", "superseded"].includes(record.operational_state) && isV05Overdue(record.due_date, generatedAt)).length,
        unresolved_exceptions: profile === "client" ? 0 : domain.exceptions.filter(record => ["open", "waiting", "blocked"].includes(record.operational_state)).length,
        unreviewed_responses: visible(domain.responses).filter(record => ["pending", "in-review", "changes-requested"].includes(record.review_state)).length
      },
      next_work: buildPreEngagementNextWork(domain, profile, generatedAt)
    };
    return deepFreezeV05(projection);
  }

  export function buildPreEngagementNextWork(domain: PreEngagementDomain, profile: PresentationProfile, generatedAt = nowIso()): PreEngagementNextWorkItem[] {
    validatePreEngagementDomain(domain);
    const items: PreEngagementNextWorkItem[] = [];
    for (const request of domain.requests.filter(record => canViewV05(record.visibility, profile))) {
      if (!["satisfied", "cancelled", "superseded"].includes(request.operational_state) && isV05Overdue(request.due_date, generatedAt)) items.push({ kind: "overdue-request", record_ref: request.request_id, title: request.title, detail: `The request was due ${request.due_date}; this is a factual work-management flag, not a readiness conclusion.`, priority: 10 });
      else if (request.operational_state === "needs-clarification") items.push({ kind: "clarification", record_ref: request.request_id, title: request.title, detail: "Clarification is required before the request can be reviewed as satisfied.", priority: 20 });
    }
    for (const assignment of domain.assignments.filter(record => canViewV05(record.visibility, profile))) {
      if (assignment.currency_state === "stale" || assignment.currency_state === "conflict") items.push({ kind: "stale-assignment", record_ref: assignment.assignment_id, title: assignment.snapshot.title, detail: "Compare the immutable assignment snapshot with the current instrument and explicitly retain or issue a new assignment.", priority: 30 });
      if (!domain.submissions.some(submission => submission.assignment_ref === assignment.assignment_id && submission.lifecycle === "active")) items.push({ kind: "missing-submission", record_ref: assignment.assignment_id, title: assignment.snapshot.title, detail: "No active submission has been recorded for this assignment.", priority: 40 });
    }
    if (profile !== "client") {
      for (const exception of domain.exceptions.filter(record => ["open", "waiting", "blocked"].includes(record.operational_state))) items.push({ kind: "conflict", record_ref: exception.exception_id, title: exception.title, detail: exception.detail || "An intake exception requires explicit review.", priority: 50 });
      for (const candidate of domain.candidates.filter(record => ["awaiting-review", "returned"].includes(record.state))) items.push({ kind: "candidate", record_ref: candidate.candidate_id, title: candidate.target_type, detail: "Review this source-domain proposal; the target authority has not accepted it.", priority: 70 });
    }
    for (const response of domain.responses.filter(record => canViewV05(record.visibility, profile) && ["pending", "in-review", "changes-requested"].includes(record.review_state))) items.push({ kind: "review", record_ref: response.response_id, title: response.display_text.slice(0, 120) || "Intake response", detail: `Review the ${response.origin} response without changing its recorded origin.`, priority: 60 });
    if (items.length === 0) items.push({ kind: "informational", record_ref: domain.pre_engagement_id, title: "No immediate Pre-Engagement task", detail: "No profile-visible intake exception or pending work was identified. This is not a readiness or compliance conclusion.", priority: 999 });
    return items.sort((left, right) => left.priority - right.priority || left.title.localeCompare(right.title));
  }

  export function createPreEngagementCandidate(domain: PreEngagementDomain, input: {
    source_refs: string[];
    target_domain: PreEngagementTargetDomain;
    target_type: string;
    proposed_operation: typeof CANDIDATE_OPERATIONS[number];
    proposed_fields: Record<string, string>;
    rationale: string;
    visibility?: Visibility;
  }, profile: PresentationProfile): PreEngagementCandidateRecord {
    if (profile !== "advisor") throw new Error("Only Advisor View may create Pre-Engagement candidates.");
    validatePreEngagementDomain(domain);
    const timestamp = nowIso();
    const candidate: PreEngagementCandidateRecord = {
      candidate_id: newId("pre_engagement_candidate"),
      source_refs: validateV05ReferenceArray(input.source_refs, "Pre-Engagement candidate source references"),
      target_domain: requireV05Enum(input.target_domain, PRE_ENGAGEMENT_TARGETS, "Pre-Engagement candidate target"),
      target_type: requireV05String(input.target_type, "Pre-Engagement candidate target type", 160),
      proposed_operation: requireV05Enum(input.proposed_operation, CANDIDATE_OPERATIONS, "Pre-Engagement candidate operation"),
      proposed_fields: validateV05ScalarFields(input.proposed_fields, "Pre-Engagement candidate fields"),
      rationale: requireV05String(input.rationale, "Pre-Engagement candidate rationale", 8000),
      state: "awaiting-review",
      target_candidate_ref: null,
      target_decision_ref: null,
      visibility: input.visibility ?? "advisor-only",
      supersedes_candidate_ref: null,
      superseded_by_candidate_ref: null,
      provenance: createV05Provenance("pre-engagement-record", input.source_refs[0] ?? domain.pre_engagement_id, timestamp, "advisor", "not-evaluated"),
      created_at: timestamp,
      updated_at: timestamp
    };
    domain.candidates.push(candidate);
    validatePreEngagementDomain(domain);
    return candidate;
  }

  export function resolveIntakeException(domain: PreEngagementDomain, exceptionId: string, disposition: IntakeExceptionResolution["disposition"], rationale: string, resultingRecordRef: string | null, profile: PresentationProfile): IntakeExceptionRecord {
    if (profile !== "advisor" && profile !== "reviewer") throw new Error("Only Advisor or Reviewer View may resolve an intake exception.");
    const exception = domain.exceptions.find(record => record.exception_id === exceptionId);
    if (!exception) throw new Error("Intake exception was not found.");
    if (["resolved", "cancelled"].includes(exception.operational_state)) throw new Error("Intake exception is already closed.");
    const timestamp = nowIso();
    exception.operational_state = disposition === "deferred" ? "waiting" : "resolved";
    exception.review_state = disposition === "deferred" ? "changes-requested" : "closed";
    exception.resolution = { disposition, rationale: requireV05String(rationale, "Intake exception resolution rationale", 8000), resulting_record_ref: resultingRecordRef, resolved_at: timestamp, resolved_by: profile };
    exception.updated_at = timestamp;
    validatePreEngagementDomain(domain);
    return exception;
  }
}
