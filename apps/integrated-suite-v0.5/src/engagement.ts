namespace L2G {
  const ENGAGEMENT_PHASES: EngagementPhase[] = ["planning", "discovery", "scoping", "practice-review", "ssp-development", "delivery", "review", "closed"];
  const ENGAGEMENT_VISIBILITIES: Visibility[] = ["advisor-only", "client-safe", "approved-for-client-presentation"];
  const IDENTITY_FIELDS = new Set(["engagement_name", "client_name", "system_name", "delivery_context", "objectives", "target_level", "phase", "start_date", "target_end_date", "information_label", "visibility"]);

  export function syntheticProvenance(sourceId: string, timestamp: string, assertedBy: Provenance["asserted_by"] = "system"): Provenance {
    return { source_kind: "synthetic-fixture", source_id: sourceId, source_label: "McFirecoal synthetic data", source_location_ref: null, asserted_at: timestamp, asserted_by: assertedBy, confidence: "not-evaluated" };
  }

  export function createSyntheticEngagement(timestamp: string): EngagementDomain {
    const engagementId = newId("engagement");
    const clientOrgId = newId("organization");
    const advisorOrgId = newId("organization");
    const questionId = newId("question");
    const milestoneId = newId("milestone");
    return {
      schema_kind: "l2g_engagement_v1",
      schema_version: "1.0",
      engagement_id: engagementId,
      identity: {
        engagement_name: "McFirecoal Synthetic CMMC Engagement",
        client_name: "McFirecoal Synthetic Client",
        system_name: "Synthetic SaaS Environment",
        delivery_context: "Offline advisory discovery, scoping, practice review, SSP development, deliverable preparation, and reference-only Evidence catalog validation using synthetic data only.",
        objectives: "Exercise governed engagement and Evidence workflows without making readiness, compliance, evidence-sufficiency, certification, scoring, risk, implementation, or Met/Not Met conclusions.",
        target_level: "CMMC Level 2",
        phase: "planning",
        start_date: "2026-08-04",
        target_end_date: "2026-10-30",
        information_label: "Synthetic",
        lifecycle: "accepted",
        visibility: "approved-for-client-presentation",
        updated_at: timestamp
      },
      organizations: [
        { organization_id: clientOrgId, name: "McFirecoal Synthetic Client", relationship: "client", status: "active", visibility: "approved-for-client-presentation", provenance: syntheticProvenance("fixture-client", timestamp), created_at: timestamp, updated_at: timestamp },
        { organization_id: advisorOrgId, name: "Synthetic Advisory Team", relationship: "advisor", status: "active", visibility: "advisor-only", provenance: syntheticProvenance("fixture-advisor", timestamp), created_at: timestamp, updated_at: timestamp }
      ],
      participants: [
        { participant_id: newId("participant"), display_name: "Morgan Client", role: "Program Owner", organization_ref: clientOrgId, contact_reference: "synthetic:morgan.client", participation_state: "active", visibility: "approved-for-client-presentation", provenance: syntheticProvenance("fixture-participant-client", timestamp), created_at: timestamp, updated_at: timestamp },
        { participant_id: newId("participant"), display_name: "Avery Advisor", role: "Principal Advisor", organization_ref: advisorOrgId, contact_reference: "synthetic:avery.advisor", participation_state: "active", visibility: "advisor-only", provenance: syntheticProvenance("fixture-participant-advisor", timestamp), created_at: timestamp, updated_at: timestamp }
      ],
      assumptions: [
        { assumption_id: newId("assumption"), title: "Synthetic-only validation", detail: "All records, files, package inputs, screenshots, and examples are synthetic and are not authorized for production, client, FCI, or CUI use.", status: "confirmed", visibility: "approved-for-client-presentation", provenance: syntheticProvenance("fixture-assumption", timestamp), related_refs: [], created_at: timestamp, updated_at: timestamp }
      ],
      decisions: [
        { decision_id: newId("decision"), title: "Reference-only evidence posture", detail: "The project retains bounded metadata, hashes, source locations, summaries, provenance, and candidates—not original evidence bytes.", status: "accepted", rationale: "Preserves the accepted offline safety boundary while establishing Evidence authority.", visibility: "client-safe", provenance: syntheticProvenance("fixture-decision", timestamp), related_refs: [], created_at: timestamp, updated_at: timestamp }
      ],
      open_questions: [
        { question_id: questionId, title: "Confirm synthetic delivery participants", detail: "Confirm the synthetic participant list before discovery planning.", status: "open", visibility: "client-safe", provenance: syntheticProvenance("fixture-question", timestamp), related_refs: [], created_at: timestamp, updated_at: timestamp }
      ],
      constraints: [
        { constraint_id: newId("constraint"), title: "No runtime network", detail: "The portable runtime must not make network requests, load remote assets, emit telemetry, or persist original source files.", status: "active", visibility: "client-safe", provenance: syntheticProvenance("fixture-constraint", timestamp), related_refs: [], created_at: timestamp, updated_at: timestamp }
      ],
      milestones: [
        { milestone_id: milestoneId, title: "Engagement and Evidence context review", detail: "Review identity, source references, exceptions, duplicates, candidates, and factual next work.", target_date: "2026-08-18", owner_label: "Advisor", workstream: "Engagement", operational_state: "planned", visibility: "approved-for-client-presentation", provenance: syntheticProvenance("fixture-milestone", timestamp), related_refs: [questionId], created_at: timestamp, updated_at: timestamp }
      ],
      blockers: [],
      candidates: [
        { candidate_id: newId("candidate"), source_kind: "legacy-metadata", source_ref: "synthetic-intake-001", target_type: "identity", proposed_fields: { delivery_context: "Facilitated CMMC Level 2 advisory engagement with synthetic Azure and AWS service context." }, state: "candidate", rationale: "Awaiting Advisor review; creation does not mutate accepted identity.", provenance: syntheticProvenance("fixture-candidate", timestamp), visibility: "advisor-only" }
      ],
      projection_policy: { client_visible_values: ["client-safe", "approved-for-client-presentation"], reviewer_include_provenance: true, client_include_candidates: false }
    };
  }

  export function createEngagementCandidateFromEvidence(domain: EngagementDomain, mapping: EvidenceCandidateMapping, profile: PresentationProfile): CandidateRecord {
    if (profile !== "advisor") throw new Error("Only Advisor View may publish Evidence candidates.");
    if (mapping.target_domain !== "engagement") throw new Error("This target is not implemented in v0.4.");
    if (mapping.state !== "awaiting-review") throw new Error("Only an awaiting-review Evidence mapping may be published.");
    const targetType = mapping.target_type as CandidateTargetType;
    if (!["identity", "participant", "organization", "assumption", "decision", "open-question", "constraint", "milestone", "blocker"].includes(targetType)) throw new Error("Evidence mapping target type is not supported by Engagement.");
    const fields: Record<string, string> = {};
    for (const field of mapping.proposed_fields) {
      const key = sanitizePlainText(field.name, 100);
      if (!key || Object.prototype.hasOwnProperty.call(fields, key)) throw new Error("Evidence mapping contains duplicate or invalid proposed fields.");
      fields[key] = sanitizePlainText(field.value, 8000);
    }
    if (Object.keys(fields).length === 0) throw new Error("Evidence mapping contains no proposed fields.");
    const candidate: CandidateRecord = {
      candidate_id: newId("candidate"),
      source_kind: "evidence-candidate-mapping",
      source_ref: mapping.candidate_id,
      target_type: targetType,
      proposed_fields: fields,
      state: "candidate",
      rationale: sanitizePlainText(mapping.rationale, 8000),
      provenance: deepClone(mapping.provenance),
      visibility: "advisor-only"
    };
    domain.candidates.push(candidate);
    return candidate;
  }

  export function decideCandidate(domain: EngagementDomain, candidateId: string, action: "accept" | "modify" | "reject", rationale: string, profile: PresentationProfile, modifiedFields?: Record<string, string>): void {
    if (profile !== "advisor") throw new Error("Only Advisor View may decide engagement candidates.");
    const candidate = domain.candidates.find(item => item.candidate_id === candidateId);
    if (!candidate) throw new Error("Candidate not found.");
    if (candidate.state !== "candidate") throw new Error("A decided candidate cannot be decided again; create a superseding candidate.");
    const cleanRationale = sanitizePlainText(rationale, 8000);
    if (!cleanRationale.trim()) throw new Error("Candidate decisions require rationale.");
    if (action === "reject") {
      candidate.state = "rejected"; candidate.rationale = cleanRationale; candidate.decided_at = nowIso(); candidate.decided_by = profile; return;
    }
    if (candidate.target_type !== "identity") throw new Error("The current UI applies accepted candidate fields only to Engagement identity; other candidates remain reviewable proposals.");
    const accepted = action === "modify" ? modifiedFields : candidate.proposed_fields;
    if (!accepted || Object.keys(accepted).length === 0) throw new Error("Candidate contains no accepted fields.");
    applyIdentityFields(domain.identity, accepted);
    candidate.accepted_fields = deepClone(accepted);
    candidate.state = action === "modify" ? "modified" : "accepted";
    candidate.rationale = cleanRationale;
    candidate.decided_at = nowIso(); candidate.decided_by = profile; candidate.accepted_record_ref = domain.engagement_id;
  }

  export function supersedeCandidate(domain: EngagementDomain, candidateId: string, proposedFields: Record<string, string>, rationale: string, profile: PresentationProfile): CandidateRecord {
    if (profile !== "advisor") throw new Error("Only Advisor View may supersede engagement candidates.");
    const prior = domain.candidates.find(item => item.candidate_id === candidateId);
    if (!prior || prior.state === "superseded") throw new Error("Candidate cannot be superseded.");
    const replacement: CandidateRecord = {
      candidate_id: newId("candidate"), source_kind: prior.source_kind, source_ref: prior.source_ref, target_type: prior.target_type,
      proposed_fields: sanitizeFieldMap(proposedFields), state: "candidate", rationale: sanitizePlainText(rationale, 8000),
      supersedes_candidate_id: prior.candidate_id, provenance: deepClone(prior.provenance), visibility: prior.visibility
    };
    replacement.provenance.asserted_at = nowIso(); replacement.provenance.asserted_by = profile;
    prior.state = "superseded"; prior.superseded_by_candidate_id = replacement.candidate_id; prior.decided_at = nowIso(); prior.decided_by = profile; prior.rationale = replacement.rationale;
    domain.candidates.push(replacement);
    return replacement;
  }

  export function updateEngagementIdentity(identity: IdentityRecord, key: string, raw: string): void {
    applyIdentityFields(identity, { [key]: raw });
  }

  function sanitizeFieldMap(fields: Record<string, string>): Record<string, string> {
    const output: Record<string, string> = {};
    for (const [key, value] of Object.entries(fields)) output[sanitizePlainText(key, 100)] = sanitizePlainText(value, 8000);
    return output;
  }

  function applyIdentityFields(identity: IdentityRecord, fields: Record<string, string>): void {
    for (const [key, raw] of Object.entries(fields)) {
      if (!IDENTITY_FIELDS.has(key)) throw new Error(`Unsupported identity candidate field: ${key}`);
      const value = sanitizePlainText(raw, ["delivery_context", "objectives"].includes(key) ? 8000 : 200);
      if (key === "phase") { if (!ENGAGEMENT_PHASES.includes(value as EngagementPhase)) throw new Error("Unsupported engagement phase."); identity.phase = value as EngagementPhase; }
      else if (key === "target_level") { if (!["CMMC Level 2", "CMMC Level 1", "Other", "Not specified"].includes(value)) throw new Error("Unsupported target level."); identity.target_level = value as IdentityRecord["target_level"]; }
      else if (key === "information_label") { if (!["Synthetic", "Public", "Internal", "FCI", "CUI", "Unknown"].includes(value)) throw new Error("Unsupported information label."); identity.information_label = value as InformationLabel; }
      else if (key === "visibility") { if (!ENGAGEMENT_VISIBILITIES.includes(value as Visibility)) throw new Error("Unsupported visibility."); identity.visibility = value as Visibility; }
      else if (key === "engagement_name") identity.engagement_name = value;
      else if (key === "client_name") identity.client_name = value;
      else if (key === "system_name") identity.system_name = value;
      else if (key === "delivery_context") identity.delivery_context = value;
      else if (key === "objectives") identity.objectives = value;
      else if (key === "start_date") identity.start_date = value;
      else if (key === "target_end_date") identity.target_end_date = value;
    }
    identity.updated_at = nowIso();
  }

  export function buildEngagementProjection(domain: EngagementDomain, workspace: WorkspaceId, profile: PresentationProfile, generatedAt = nowIso()): EngagementProjection {
    const include = (visibility: Visibility): boolean => profile !== "client" || visibility === "client-safe" || visibility === "approved-for-client-presentation";
    const withProfile = <T extends { visibility: Visibility; provenance: Provenance }>(records: T[]): Array<Omit<T, "provenance"> & { provenance?: Provenance }> => records.filter(record => include(record.visibility)).map(record => {
      const clone = deepClone(record);
      if (profile === "client") { const { provenance: _provenance, ...output } = clone; return output as Omit<T, "provenance">; }
      return clone;
    });
    const projection: EngagementProjection = {
      projection_kind: "l2g_engagement_projection_v1", workspace, profile, generated_at: generatedAt, source_domain: "Engagement", source_engagement_id: domain.engagement_id,
      source_record_ids: collectEngagementIds(domain, include), identity: deepClone(domain.identity),
      participants: withProfile(domain.participants), organizations: withProfile(domain.organizations), assumptions: withProfile(domain.assumptions), decisions: withProfile(domain.decisions),
      open_questions: withProfile(domain.open_questions), constraints: withProfile(domain.constraints), milestones: withProfile(domain.milestones), blockers: withProfile(domain.blockers),
      candidates: profile === "client" ? [] : deepClone(domain.candidates), next_work: calculateEngagementNextWork(domain, generatedAt).filter(item => profile !== "client" || item.kind !== "candidate")
    };
    return deepFreezeValue(projection);
  }

  export function calculateEngagementNextWork(domain: EngagementDomain, asOf = nowIso()): EngagementNextWorkItem[] {
    const output: EngagementNextWorkItem[] = [];
    const date = new Date(asOf); const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    const required: Array<[keyof IdentityRecord, string]> = [["engagement_name", "Engagement name"], ["client_name", "Client name"], ["system_name", "System or program name"], ["delivery_context", "Delivery context"], ["objectives", "Objectives"]];
    for (const [key, label] of required) if (!String(domain.identity[key]).trim()) output.push({ kind: "missing-field", record_ref: domain.engagement_id, title: `Complete ${label}`, detail: "Required accepted engagement identity metadata is empty.", priority: 10 });
    for (const candidate of domain.candidates) if (candidate.state === "candidate") output.push({ kind: "candidate", record_ref: candidate.candidate_id, title: "Review engagement candidate", detail: `Candidate from ${candidate.source_kind} awaits an explicit target-domain decision.`, priority: 20 });
    for (const blocker of domain.blockers) if (["critical", "high"].includes(blocker.severity) && ["open", "waiting"].includes(blocker.operational_state)) output.push({ kind: "blocker", record_ref: blocker.blocker_id, title: blocker.title, detail: `${blocker.severity} work-management blocker is ${blocker.operational_state}.`, priority: 30 });
    for (const milestone of domain.milestones) {
      if (milestone.operational_state === "blocked") output.push({ kind: "milestone", record_ref: milestone.milestone_id, title: milestone.title, detail: "Milestone is blocked.", priority: 40 });
      if (!["completed", "cancelled"].includes(milestone.operational_state) && milestone.target_date) {
        const target = Date.parse(`${milestone.target_date}T00:00:00Z`);
        if (Number.isFinite(target) && target < today) output.push({ kind: "milestone", record_ref: milestone.milestone_id, title: milestone.title, detail: `Milestone was due ${milestone.target_date}.`, priority: 50 });
      }
    }
    for (const question of domain.open_questions) if (question.status === "open") output.push({ kind: "question", record_ref: question.question_id, title: question.title, detail: "Open engagement question requires an answer or explicit deferral.", priority: 60 });
    if (output.length === 0) output.push({ kind: "informational", record_ref: domain.engagement_id, title: "No factual engagement next work identified", detail: "No missing identity field, pending candidate, high blocker, overdue milestone, or open question was found.", priority: 99 });
    return output.sort((left, right) => left.priority - right.priority || left.record_ref.localeCompare(right.record_ref));
  }

  function collectEngagementIds(domain: EngagementDomain, include: (visibility: Visibility) => boolean): string[] {
    const ids = [domain.engagement_id];
    for (const collection of [domain.participants, domain.organizations, domain.assumptions, domain.decisions, domain.open_questions, domain.constraints, domain.milestones, domain.blockers]) {
      for (const record of collection) {
        const id = engagementRecordId(record);
        if (id && include(record.visibility)) ids.push(id);
      }
    }
    return ids;
  }

  function engagementRecordId(record: object): string | undefined {
    for (const key of ["participant_id", "organization_id", "assumption_id", "decision_id", "question_id", "constraint_id", "milestone_id", "blocker_id"]) {
      const value = (record as Record<string, unknown>)[key]; if (typeof value === "string") return value;
    }
    return undefined;
  }

  export function validateEngagement(domain: EngagementDomain, allIds?: Set<string>): void {
    assertExactObjectKeys(domain, ["schema_kind","schema_version","engagement_id","identity","participants","organizations","assumptions","decisions","open_questions","constraints","milestones","blockers","candidates","projection_policy"], "Engagement domain");
    if (domain.schema_kind !== "l2g_engagement_v1" || domain.schema_version !== "1.0" || !safeTypedId(domain.engagement_id, "engagement")) throw new Error("Engagement identity is invalid.");
    const ids = allIds ?? new Set<string>(); addUniqueId(ids, domain.engagement_id, "engagement");
    validateIdentity(domain.identity);
    validateArray(domain.organizations, 100, record => { assertText(record.name, 200, "Organization name"); if (!safeTypedId(record.organization_id, "organization") || !["client","advisor","MSP","CSP","provider","assessor","other"].includes(record.relationship) || !["active","inactive","superseded"].includes(record.status)) throw new Error("Organization is invalid."); addUniqueId(ids, record.organization_id, "organization"); validateRecordMetadata(record); });
    validateArray(domain.participants, 200, record => { if (!safeTypedId(record.participant_id, "participant") || !["active","inactive","superseded"].includes(record.participation_state)) throw new Error("Participant is invalid."); assertText(record.display_name, 200, "Participant name"); assertText(record.role, 200, "Participant role"); assertText(record.contact_reference, 500, "Contact reference"); addUniqueId(ids, record.participant_id, "participant"); validateRecordMetadata(record); });
    validateRelatedCollection(domain.assumptions, "assumption_id", "assumption", ["open","confirmed","rejected","superseded"], ids);
    validateRelatedCollection(domain.decisions, "decision_id", "decision", ["proposed","accepted","revised","superseded"], ids);
    validateRelatedCollection(domain.open_questions, "question_id", "question", ["open","answered","deferred","closed"], ids);
    validateRelatedCollection(domain.constraints, "constraint_id", "constraint", ["active","resolved","superseded","archived"], ids);
    validateRelatedCollection(domain.milestones, "milestone_id", "milestone", ["planned","in-progress","waiting","blocked","completed","cancelled"], ids, "operational_state");
    validateRelatedCollection(domain.blockers, "blocker_id", "blocker", ["open","waiting","resolved","cancelled"], ids, "operational_state");
    validateArray(domain.candidates, 500, record => validateEngagementCandidate(record, ids));
    for (const participant of domain.participants) if (!ids.has(participant.organization_ref) && !participant.organization_ref.startsWith("external_")) throw new Error("Participant has a dangling organization reference.");
    for (const collection of [domain.assumptions, domain.decisions, domain.open_questions, domain.constraints, domain.milestones, domain.blockers]) for (const record of collection) for (const ref of record.related_refs) if (!ids.has(ref) && !ref.startsWith("external_")) throw new Error(`Dangling engagement reference: ${ref}`);
    if (stableStringify(domain.projection_policy, 0) !== stableStringify({ client_visible_values: ["client-safe", "approved-for-client-presentation"], reviewer_include_provenance: true, client_include_candidates: false }, 0)) throw new Error("Engagement projection policy is unsupported.");
  }

  function validateIdentity(identity: IdentityRecord): void {
    assertExactObjectKeys(identity, ["engagement_name","client_name","system_name","delivery_context","objectives","target_level","phase","start_date","target_end_date","information_label","lifecycle","visibility","updated_at"], "Engagement identity");
    assertText(identity.engagement_name, 200, "Engagement name"); assertText(identity.client_name, 200, "Client name"); assertText(identity.system_name, 200, "System name"); assertText(identity.delivery_context, 8000, "Delivery context"); assertText(identity.objectives, 8000, "Objectives");
    if (!["CMMC Level 2","CMMC Level 1","Other","Not specified"].includes(identity.target_level) || !ENGAGEMENT_PHASES.includes(identity.phase) || !["Synthetic","Public","Internal","FCI","CUI","Unknown"].includes(identity.information_label) || identity.lifecycle !== "accepted" || !ENGAGEMENT_VISIBILITIES.includes(identity.visibility) || !isIsoDateTime(identity.updated_at) || !isDateOrEmptyValue(identity.start_date) || !isDateOrEmptyValue(identity.target_end_date)) throw new Error("Engagement identity state is invalid.");
  }

  function validateRelatedCollection<T extends RelatedRecordBase>(records: T[], idKey: string, prefix: string, states: string[], ids: Set<string>, stateKey = "status"): void {
    validateArray(records, 250, record => {
      const raw = record as unknown as Record<string, unknown>; const id = raw[idKey]; const state = raw[stateKey];
      if (typeof id !== "string" || !safeTypedId(id, prefix) || typeof state !== "string" || !states.includes(state)) throw new Error(`${prefix} record is invalid.`);
      addUniqueId(ids, id, prefix); assertText(record.title, 200, `${prefix} title`); assertText(record.detail, 8000, `${prefix} detail`);
      if (!Array.isArray(record.related_refs) || record.related_refs.length > 50 || new Set(record.related_refs).size !== record.related_refs.length) throw new Error(`${prefix} related references are invalid.`);
      validateRecordMetadata(record);
      if (prefix === "decision" && ["accepted","revised"].includes(state) && !(record as unknown as DecisionRecord).rationale.trim()) throw new Error("Accepted or revised decision requires rationale.");
    });
  }

  function validateEngagementCandidate(record: CandidateRecord, ids: Set<string>): void {
    if (!safeTypedId(record.candidate_id, "candidate")) throw new Error("Engagement candidate ID is invalid."); addUniqueId(ids, record.candidate_id, "candidate");
    assertText(record.source_kind, 200, "Candidate source kind"); assertText(record.source_ref, 500, "Candidate source reference"); assertText(record.rationale, 8000, "Candidate rationale");
    if (!["identity","participant","organization","assumption","decision","open-question","constraint","milestone","blocker"].includes(record.target_type) || !["candidate","accepted","modified","rejected","superseded"].includes(record.state) || !ENGAGEMENT_VISIBILITIES.includes(record.visibility)) throw new Error("Engagement candidate state is invalid.");
    if (!isRecord(record.proposed_fields) || Object.keys(record.proposed_fields).length > 50) throw new Error("Engagement candidate fields are invalid.");
    if (record.decided_at !== undefined && !isIsoDateTime(record.decided_at)) throw new Error("Engagement candidate decision time is invalid.");
    validateProvenanceValue(record.provenance);
  }

  export function validateProvenanceValue(value: Provenance): void {
    if (!isRecord(value)) throw new Error("Provenance is invalid.");
    assertText(value.source_kind, 200, "Provenance source kind"); assertText(value.source_id, 200, "Provenance source ID");
    if (value.source_label !== undefined) assertText(value.source_label, 300, "Provenance label");
    if (value.source_location_ref !== undefined && value.source_location_ref !== null) assertText(value.source_location_ref, 200, "Provenance location");
    if (!isIsoDateTime(value.asserted_at) || !["advisor","client","reviewer","migration","system"].includes(value.asserted_by) || !["not-evaluated","low","medium","high"].includes(value.confidence)) throw new Error("Provenance state is invalid.");
  }

  function validateRecordMetadata(record: { visibility: Visibility; provenance: Provenance; created_at: string; updated_at: string }): void {
    if (!ENGAGEMENT_VISIBILITIES.includes(record.visibility) || !isIsoDateTime(record.created_at) || !isIsoDateTime(record.updated_at)) throw new Error("Record metadata is invalid."); validateProvenanceValue(record.provenance);
  }

  export function deepFreezeValue<T>(value: T): T {
    if (value && typeof value === "object" && !Object.isFrozen(value)) { Object.freeze(value); for (const item of Object.values(value as Record<string, unknown>)) deepFreezeValue(item); }
    return value;
  }
  export function assertExactObjectKeys(value: object, expected: string[], label: string): void { const actual = Object.keys(value).sort(); const wanted = [...expected].sort(); if (actual.length !== wanted.length || actual.some((key, index) => key !== wanted[index])) throw new Error(`${label} contains unknown or missing fields.`); }
  export function safeTypedId(value: unknown, prefix: string): value is string { return typeof value === "string" && value.startsWith(`${prefix}_`) && value.length <= 128 && /^[A-Za-z0-9_-]+$/.test(value); }
  export function addUniqueId(ids: Set<string>, value: string, prefix: string): void { if (!safeTypedId(value, prefix) || ids.has(value)) throw new Error(`Duplicate or invalid ${prefix} identifier.`); ids.add(value); }
  export function isIsoDateTime(value: unknown): value is string { return typeof value === "string" && Number.isFinite(Date.parse(value)); }
  export function isDateOrEmptyValue(value: unknown): value is string { return typeof value === "string" && (value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value)); }
  export function assertText(value: unknown, max: number, label: string, required = false): asserts value is string { if (typeof value !== "string" || value.length > max || (required && !value.trim())) throw new Error(`${label} is invalid.`); }
  export function validateArray<T>(value: T[], max: number, validator: (record: T) => void): void { if (!Array.isArray(value) || value.length > max) throw new Error("Collection is invalid."); for (const record of value) validator(record); }
}
