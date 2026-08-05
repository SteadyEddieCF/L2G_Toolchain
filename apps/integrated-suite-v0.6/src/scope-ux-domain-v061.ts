namespace L2G {
  const V061_BASE_BUILD_SCOPE_PROJECTION = buildScopeProjection;
  const V061_BASE_APPLY_SCOPE_IMPORT = applyScopeImport;
  const V061_BASE_REFRESH_SCOPE_CURRENCY = refreshScopeCurrency;
  const V061_REVIEWABLE_FIELDS = new Set([
    "asset_category",
    "scope_disposition",
    "boundary_relationship",
    "implementation_location",
    "responsibility_model",
    "diagram_review_state",
    "resolution_state"
  ]);

  function v061ProjectionCollections(projection: ScopeProjection): ScopeRecordBase[][] {
    return [
      projection.boundaries,
      projection.systems,
      projection.assets,
      projection.providers,
      projection.services,
      projection.locations,
      projection.enclaves,
      projection.data_flows,
      projection.assumptions,
      projection.unknowns,
      projection.dependencies,
      projection.decisions,
      projection.candidates,
      projection.diagrams
    ];
  }

  export function scopeProjectionRecordMap(projection: ScopeProjection): Map<string, ScopeRecordBase> {
    const map = new Map<string, ScopeRecordBase>();
    for (const collection of v061ProjectionCollections(projection)) {
      for (const item of collection) map.set(item.id, item);
    }
    return map;
  }

  function v061VisibleLabel(record: ScopeRecordBase | undefined): string {
    if (!record) return "Unavailable record";
    if ("client_label" in record) {
      const value = String((record as unknown as { client_label: string }).client_label || "").trim();
      if (value) return value;
    }
    return record.label;
  }

  function v061SanitizeClientProjection(projection: ScopeProjection): ScopeProjection {
    const output = deepClone(projection);
    const initialMap = scopeProjectionRecordMap(output);
    const visibleIds = new Set(initialMap.keys());
    const keepIds = (values: string[]): string[] => values.filter(value => visibleIds.has(value));
    const keepVersioned = (values: ScopeVersionedRef[]): ScopeVersionedRef[] => values.filter(value => visibleIds.has(value.id));

    output.boundaries = output.boundaries.map(item => ({
      ...item,
      included_refs: keepIds(item.included_refs),
      excluded_refs: keepIds(item.excluded_refs),
      entry_exit_point_refs: keepIds(item.entry_exit_point_refs),
      location_refs: keepIds(item.location_refs),
      enclave_refs: keepIds(item.enclave_refs),
      decision_refs: keepIds(item.decision_refs),
      assumption_refs: [],
      unknown_refs: keepIds(item.unknown_refs),
      diagram_refs: keepIds(item.diagram_refs)
    }));

    const sanitizeObject = (item: ScopeObject): ScopeObject => ({
      ...item,
      related_refs: keepIds(item.related_refs),
      decision_refs: keepIds(item.decision_refs),
      owner_org_ref: item.owner_org_ref && visibleIds.has(item.owner_org_ref) ? item.owner_org_ref : null,
      provider_ref: item.provider_ref && visibleIds.has(item.provider_ref) ? item.provider_ref : null
    });
    output.systems = output.systems.map(sanitizeObject);
    output.assets = output.assets.map(sanitizeObject);
    output.providers = output.providers.map(sanitizeObject);
    output.services = output.services.map(sanitizeObject);
    output.locations = output.locations.map(sanitizeObject);
    output.enclaves = output.enclaves.map(sanitizeObject);

    output.data_flows = output.data_flows
      .filter(item => visibleIds.has(item.source_ref) && visibleIds.has(item.destination_ref))
      .map(item => ({
        ...item,
        intermediary_refs: keepIds(item.intermediary_refs),
        boundary_crossing_refs: keepIds(item.boundary_crossing_refs),
        unknown_refs: keepIds(item.unknown_refs),
        decision_refs: keepIds(item.decision_refs)
      }));
    output.unknowns = output.unknowns.map(item => ({ ...item, affected_refs: keepIds(item.affected_refs) }));
    output.decisions = output.decisions.map(item => ({
      ...item,
      affected_record_refs: keepVersioned(item.affected_record_refs),
      source_basis_refs: [],
      assumption_refs: [],
      unknown_refs: keepIds(item.unknown_refs),
      dependency_refs: [],
      advisor_analysis: "",
      reviewer_comment: ""
    }));

    const safeMap = scopeProjectionRecordMap(output);
    const safeIds = new Set(safeMap.keys());
    output.diagrams = output.diagrams.map(diagram => {
      const nodes = diagram.node_records.filter(node => Boolean(node.record_ref && safeIds.has(node.record_ref.id)));
      const nodeIds = new Set(nodes.map(node => node.node_id));
      const edges = diagram.edge_records.filter(edge =>
        nodeIds.has(edge.from_node_id) &&
        nodeIds.has(edge.to_node_id) &&
        (!edge.relationship_ref || safeIds.has(edge.relationship_ref))
      );
      const refs = diagram.included_record_refs.filter(ref => safeIds.has(ref.id));
      const labels = refs.map(ref => v061VisibleLabel(safeMap.get(ref.id)));
      return {
        ...diagram,
        included_record_refs: refs,
        node_records: nodes,
        edge_records: edges,
        annotations: [],
        stale_ref_diagnostics: [],
        text_alternative: `${diagram.label}. Includes ${labels.join(", ") || "no visible records"}. ${edges.length} visible relationship${edges.length === 1 ? "" : "s"}. Internal records and relationships omitted by this presentation profile are not shown or counted.`
      };
    });

    output.counts = {
      boundaries: output.boundaries.length,
      systems: output.systems.length,
      assets: output.assets.length,
      providers: output.providers.length,
      services: output.services.length,
      flows: output.data_flows.length,
      unknowns: output.unknowns.length,
      decisions: output.decisions.length,
      diagrams: output.diagrams.length,
      candidates: 0
    };
    output.next_work = scopeNextWork(output);
    output.qualifications = [
      "This is a locally facilitated Scope view. It is not access control, an authenticated approval, an assessment conclusion, or authorization to distribute the complete project.",
      "Profile-filtered representations omit internal records and relationships from labels, counts, text alternatives, focus targets, live regions, and the accessibility tree."
    ];
    return output;
  }

  function buildScopeProjectionV061(scope: ScopeDomain, profile: PresentationProfile): ScopeProjection {
    const projection = V061_BASE_BUILD_SCOPE_PROJECTION(scope, profile);
    return profile === "client" ? v061SanitizeClientProjection(projection) : projection;
  }

  function v061NormalizeIdentity(value: string): string {
    return value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  function v061ImportFamilyRecords(scope: ScopeDomain, family: ScopeImportCandidate["family"]): ScopeRecordBase[] {
    switch (family) {
      case "system": return scope.systems;
      case "asset": return scope.assets;
      case "provider": return scope.providers;
      case "service": return scope.services;
      case "location": return scope.locations;
      case "enclave": return scope.enclaves;
      case "flow": return scope.data_flows;
      case "unknown": return scope.unknowns;
      case "decision": return scope.decisions;
      case "diagram": return scope.diagrams;
      case "boundary": return scope.boundaries;
      case "assumption": return scope.assumptions;
      case "dependency": return scope.dependencies;
      default: return [];
    }
  }

  function v061SourceStableId(item: ScopeImportCandidate): string {
    const separator = item.import_record_id.indexOf(":");
    return separator >= 0 ? item.import_record_id.slice(separator + 1) : item.import_record_id;
  }

  function v061RecordStableSourceIds(record: ScopeRecordBase): string[] {
    const ids = record.provenance.source_refs.map(ref => ref.id);
    if ("identifier_summary" in record) {
      const summary = String((record as ScopeObject).identifier_summary || "").trim();
      if (summary) ids.push(summary);
    }
    return ids;
  }

  export function analyzeScopeImportPreview(scope: ScopeDomain, preview: ScopeImportPreview): ScopeImportPreview {
    const output = deepClone(preview);
    for (const item of output.records) {
      const records = v061ImportFamilyRecords(scope, item.family).filter(record => record.lifecycle !== "archived" && record.lifecycle !== "superseded");
      const sourceStableId = v061SourceStableId(item);
      const exact = records.find(record => v061RecordStableSourceIds(record).includes(sourceStableId));
      const labelKey = v061NormalizeIdentity(item.label);
      const possible = records.filter(record =>
        !exact || record.id !== exact.id
      ).filter(record => {
        const values = [record.label];
        if ("client_label" in record) values.push(String((record as unknown as { client_label: string }).client_label || ""));
        return values.some(value => v061NormalizeIdentity(value) === labelKey);
      });
      item.exact_target_ref = exact?.id ?? null;
      item.ambiguity = possible.map(record => record.id);
      if (exact) item.treatment = "link";
      else if (possible.length) item.treatment = "create";
    }
    return output;
  }

  function v061ValidImportTreatment(scope: ScopeDomain, item: ScopeImportCandidate): void {
    if (!item.selected || item.treatment === "reject") return;
    const target = item.exact_target_ref ? scopeRecordMap(scope).get(item.exact_target_ref) : undefined;
    if ((item.treatment === "link" || item.treatment === "modify") && !target) {
      throw new Error(`Import treatment ${item.treatment} requires an exact current Scope target for ${item.import_record_id}.`);
    }
    if (item.ambiguity.length && item.treatment === "create" && !item.exact_target_ref) {
      throw new Error(`Resolve ambiguous import record ${item.import_record_id}: choose an explicit identity treatment before apply.`);
    }
  }

  function applyScopeImportV061(scope: ScopeDomain, preview: ScopeImportPreview, profile: PresentationProfile): ScopeImportReceipt {
    const before = stableStringify(scope, 0);
    const prospective = deepClone(scope);
    try {
      for (const item of preview.records) v061ValidImportTreatment(prospective, item);
      const receipt = V061_BASE_APPLY_SCOPE_IMPORT(prospective, preview, profile);
      const imported = prospective.candidates.filter(candidate =>
        candidate.source_domain === "compatibility-import" &&
        candidate.provenance.source_label === preview.package_name
      );
      for (const item of preview.records.filter(record => record.selected && record.treatment !== "reject")) {
        const candidate = imported.find(record => record.label === item.label && record.candidate_kind === item.family && record.target_record_refs.length === 0);
        if (!candidate) continue;
        if (item.treatment === "modify") candidate.candidate_state = "modified-and-accepted";
        candidate.target_record_refs = item.exact_target_ref ? [item.exact_target_ref] : [];
        candidate.decision_rationale = item.treatment === "keep-separate"
          ? "Explicitly kept separate after identity review; similar names did not establish identity."
          : item.treatment === "modify"
            ? "Reviewed modification linked to an exact current Scope target; no governed target fields changed."
            : "Created as a low-authority Scope-owned candidate after explicit identity review.";
      }
      receipt.diagnostics.push("Similar names do not establish identity; every ambiguous selected record received an explicit reviewed treatment.");
      receipt.updated_at = nowIso();
      receipt.version++;
      validateScopeDomain(prospective);
      Object.assign(scope, prospective);
      const applied = scope.import_receipts.find(item => item.id === receipt.id);
      if (!applied) throw new Error("Scope import receipt was not preserved after v0.6.1 identity review.");
      return applied;
    } catch (error) {
      if (stableStringify(scope, 0) !== before) throw new Error("Scope import failure mutated governed state.");
      throw error;
    }
  }

  function refreshScopeCurrencyV061(scope: ScopeDomain): void {
    const superseded = new Set(scope.diagrams.filter(item => item.lifecycle === "superseded" || item.diagram_review_state === "superseded").map(item => item.id));
    V061_BASE_REFRESH_SCOPE_CURRENCY(scope);
    for (const diagram of scope.diagrams) {
      if (superseded.has(diagram.id)) {
        diagram.lifecycle = "superseded";
        diagram.diagram_review_state = "superseded";
        diagram.currency_state = "superseded";
      }
    }
  }

  export function createSupersedingScopeDiagram(
    scope: ScopeDomain,
    priorId: string,
    profile: PresentationProfile
  ): ScopeDiagram {
    const prior = scope.diagrams.find(item => item.id === priorId);
    if (!prior) throw new Error("Scope diagram not found.");
    if (prior.lifecycle === "superseded" || prior.diagram_review_state === "superseded") {
      throw new Error("A superseded Scope representation cannot be refreshed again.");
    }
    const map = scopeRecordMap(scope);
    const timestamp = nowIso();
    const next = deepClone(prior);
    next.id = newId("scope-diagram");
    next.version = 1;
    next.label = `${prior.label} — refreshed draft`;
    next.lifecycle = "draft";
    next.review_state = "not-reviewed";
    next.currency_state = "current";
    next.diagram_review_state = "draft";
    next.approval_decision_ref = null;
    next.stale_ref_diagnostics = [];
    next.supersedes_id = prior.id;
    next.superseded_by_id = null;
    next.created_at = timestamp;
    next.updated_at = timestamp;
    next.created_by_profile = profile;
    next.updated_by_profile = profile;
    next.provenance = {
      origin_kind: "scope-local",
      source_refs: [{ id: prior.id, version: prior.version }],
      source_label: "Refreshed from a preserved exact-version Scope representation",
      asserted_at: timestamp,
      asserted_by: profile
    };
    next.included_record_refs = prior.included_record_refs.map(ref => ({ id: ref.id, version: map.get(ref.id)?.version ?? ref.version }));
    next.node_records = prior.node_records.map(node => node.record_ref ? {
      ...node,
      record_ref: { id: node.record_ref.id, version: map.get(node.record_ref.id)?.version ?? node.record_ref.version }
    } : deepClone(node));
    const labels = next.included_record_refs.map(ref => map.get(ref.id)?.label ?? ref.id);
    next.text_alternative = `${next.label}. Includes ${labels.join(", ")}. ${next.edge_records.length} recorded relationship${next.edge_records.length === 1 ? "" : "s"}.`;

    prior.lifecycle = "superseded";
    prior.diagram_review_state = "superseded";
    prior.review_state = "closed";
    prior.currency_state = "superseded";
    prior.superseded_by_id = next.id;
    prior.updated_at = timestamp;
    prior.updated_by_profile = profile;
    prior.version++;
    scope.diagrams.push(next);
    scope.updated_at = timestamp;
    scope.revision++;
    validateScopeDomain(scope);
    return next;
  }

  export function publishScopeUnknownToSessionPlanner(
    scope: ScopeDomain,
    unknownId: string,
    interviews: InterviewSessionsDomain,
    profile: PresentationProfile
  ): InterviewQuestionRecord {
    const unknown = scope.unknowns.find(item => item.id === unknownId);
    if (!unknown) throw new Error("Scope unknown not found.");
    if (["resolved", "wont-resolve", "superseded"].includes(unknown.resolution_state)) {
      throw new Error("Resolved or superseded Scope unknowns cannot be published as new question candidates.");
    }
    if (unknown.session_question_candidate_ref) {
      const existing = interviews.questions.find(item => item.question_id === unknown.session_question_candidate_ref);
      if (existing) return existing;
    }
    const timestamp = nowIso();
    const question: InterviewQuestionRecord = {
      question_id: newId("interview_question"),
      version_number: 1,
      version_label: "1.0",
      origin: "source-derived",
      topic_label: sanitizePlainText(unknown.label, 300),
      prompt: sanitizePlainText(unknown.statement, 8000),
      client_safe_explanation: sanitizePlainText(`This question follows up on an unresolved Scope item. It does not accept a client statement or add the question to a live agenda.`, 8000),
      rationale: sanitizePlainText(`Resolve Scope unknown ${unknown.id} before the affected Scope decision is finalized.`, 8000),
      expected_participant_role_labels: ["Advisor-selected participant"],
      applicability_note: "",
      source_refs: [unknown.id],
      related_refs: deepClone(unknown.affected_refs),
      lifecycle: "draft",
      visibility: unknown.visibility,
      supersedes_question_ref: null,
      superseded_by_question_ref: null,
      provenance: createV05Provenance("scope-unknown-publication", unknown.id, timestamp, profile, "not-evaluated", unknown.label),
      created_at: timestamp,
      updated_at: timestamp
    };
    interviews.questions.push(question);
    unknown.session_question_candidate_ref = question.question_id;
    unknown.updated_at = timestamp;
    unknown.updated_by_profile = profile;
    unknown.version++;
    scope.updated_at = timestamp;
    scope.revision++;
    validateInterviewSessionsDomain(interviews);
    validateScopeDomain(scope);
    return question;
  }

  export function createScopeBoundaryProposal(
    scope: ScopeDomain,
    label: string,
    purpose: string,
    profile: PresentationProfile
  ): ScopeBoundary {
    const timestamp = nowIso();
    const cleanLabel = sanitizePlainText(label, 500);
    const boundary: ScopeBoundary = {
      id: newId("scope-boundary"),
      version: 1,
      label: cleanLabel,
      description: "",
      lifecycle: "draft",
      operational_state: "not-started",
      review_state: "not-reviewed",
      visibility: "advisor-only",
      currency_state: "current",
      provenance: {
        origin_kind: "scope-local",
        source_refs: [],
        source_label: "Locally created Scope boundary proposal",
        asserted_at: timestamp,
        asserted_by: profile
      },
      created_at: timestamp,
      updated_at: timestamp,
      created_by_profile: profile,
      updated_by_profile: profile,
      supersedes_id: null,
      superseded_by_id: null,
      tags: [],
      boundary_kind: "cui-environment",
      purpose: sanitizePlainText(purpose, 100000),
      scope_disposition: "unknown",
      included_refs: [],
      excluded_refs: [],
      entry_exit_point_refs: [],
      location_refs: [],
      enclave_refs: [],
      decision_refs: [],
      assumption_refs: [],
      unknown_refs: [],
      diagram_refs: [],
      client_label: "",
      plain_language_summary: ""
    };
    scope.boundaries.push(boundary);
    scope.updated_at = timestamp;
    scope.revision++;
    validateScopeDomain(scope);
    return boundary;
  }

  export function recordScopeReviewerDisposition(
    scope: ScopeDomain,
    decisionId: string,
    disposition: ScopeDecision["reviewer_disposition"],
    comment: string,
    profile: PresentationProfile,
    proposedChanges?: ScopeFieldChange[]
  ): ScopeDecision {
    if (profile !== "reviewer") throw new Error("Reviewer disposition requires Reviewer View.");
    if (!(["concur", "concur-with-changes", "return", "reject"] as ScopeDecision["reviewer_disposition"][]).includes(disposition)) {
      throw new Error("Unsupported reviewer disposition.");
    }
    const decision = scope.decisions.find(item => item.id === decisionId);
    if (!decision) throw new Error("Scope decision not found.");
    const cleanedComment = sanitizePlainText(comment, 100000);
    if (disposition !== "concur" && !cleanedComment) throw new Error("This reviewer disposition requires a comment.");
    if (disposition === "concur-with-changes") {
      if (!proposedChanges?.length) throw new Error("Concur with changes requires at least one exact proposed field change.");
      for (const change of proposedChanges) {
        if (!V061_REVIEWABLE_FIELDS.has(change.field)) throw new Error(`Unsupported Scope authority field: ${change.field}.`);
      }
      decision.field_changes = deepClone(proposedChanges);
      decision.decision_state = "awaiting-confirmation";
      decision.review_state = "reviewed";
    } else if (disposition === "concur") {
      decision.review_state = "reviewed";
      if (decision.decision_state === "awaiting-review") decision.decision_state = "awaiting-confirmation";
    } else if (disposition === "return") {
      decision.review_state = "changes-requested";
      decision.decision_state = "returned";
    } else {
      decision.review_state = "rejected";
      decision.decision_state = "rejected";
    }
    decision.reviewer_disposition = disposition;
    decision.reviewer_comment = cleanedComment;
    decision.updated_at = nowIso();
    decision.updated_by_profile = profile;
    decision.version++;
    scope.updated_at = nowIso();
    scope.revision++;
    validateScopeDomain(scope);
    return decision;
  }

  const v061Namespace = (globalThis as unknown as { L2G: Record<string, unknown> }).L2G;
  v061Namespace.buildScopeProjection = buildScopeProjectionV061;
  v061Namespace.applyScopeImport = applyScopeImportV061;
  v061Namespace.refreshScopeCurrency = refreshScopeCurrencyV061;
}
