namespace L2G {
  const V061_CLOSURE_BASE_ACCEPT_SCOPE_DECISION = acceptScopeDecision;
  const V061_CLOSURE_BASE_REVIEWER_DISPOSITION = recordScopeReviewerDisposition;
  const V061_CLOSURE_REVIEWABLE_DECISION_STATES = new Set<ScopeDecisionState>([
    "proposed",
    "awaiting-review",
    "awaiting-confirmation"
  ]);
  const V061_CLOSURE_AUTHORITY_FIELDS = new Set([
    "asset_category",
    "scope_disposition",
    "boundary_relationship",
    "implementation_location",
    "responsibility_model",
    "diagram_review_state",
    "resolution_state"
  ]);

  export interface ScopeDecisionVersionComparison {
    decision_id: string;
    decision_version: number;
    decision_state: ScopeDecisionState;
    currency_state: ScopeCurrencyState;
    records: Array<{
      id: string;
      label: string;
      expected_version: number;
      current_version: number | null;
      missing: boolean;
      changed: boolean;
    }>;
  }

  export function isScopeDecisionReviewable(decision: ScopeDecision): boolean {
    return V061_CLOSURE_REVIEWABLE_DECISION_STATES.has(decision.decision_state)
      && decision.currency_state !== "superseded";
  }

  export function compareScopeDecisionVersions(scope: ScopeDomain, decisionId: string): ScopeDecisionVersionComparison {
    const decision = scope.decisions.find(item => item.id === decisionId);
    if (!decision) throw new Error("Scope decision not found.");
    const map = scopeRecordMap(scope);
    return {
      decision_id: decision.id,
      decision_version: decision.version,
      decision_state: decision.decision_state,
      currency_state: decision.currency_state,
      records: decision.affected_record_refs.map(ref => {
        const current = map.get(ref.id);
        return {
          id: ref.id,
          label: current?.label ?? ref.id,
          expected_version: ref.version,
          current_version: current?.version ?? null,
          missing: !current,
          changed: !current || current.version !== ref.version
        };
      })
    };
  }

  export function createSupersedingScopeDecisionDraft(
    scope: ScopeDomain,
    priorId: string,
    profile: PresentationProfile
  ): ScopeDecision {
    if (profile !== "advisor") throw new Error("Creating a superseding Scope decision draft requires Advisor View.");
    refreshScopeCurrency(scope);
    const prior = scope.decisions.find(item => item.id === priorId);
    if (!prior) throw new Error("Prior Scope decision not found.");
    if (prior.currency_state !== "stale") throw new Error("Only a stale Scope decision can create this recovery draft.");
    if (["rejected", "withdrawn", "superseded", "archived"].includes(prior.decision_state)) {
      throw new Error("A terminal Scope decision cannot create a superseding draft.");
    }
    if (prior.superseded_by_decision_ref) {
      const existing = scope.decisions.find(item => item.id === prior.superseded_by_decision_ref);
      if (existing && !["rejected", "withdrawn", "superseded", "archived"].includes(existing.decision_state)) return existing;
    }

    const map = scopeRecordMap(scope);
    const affected = prior.affected_record_refs.map(ref => {
      const current = map.get(ref.id);
      if (!current) throw new Error(`Cannot supersede a decision whose affected record is missing: ${ref.id}.`);
      return { id: current.id, version: current.version };
    });
    const first = map.get(affected[0]?.id ?? "");
    const changes = prior.field_changes.map(change => ({
      ...deepClone(change),
      old_value: first ? String((first as unknown as Record<string, unknown>)[change.field] ?? "") : change.old_value
    }));
    const next = createScopeDecision(scope, {
      label: `${prior.label} — superseding draft`,
      type: prior.decision_type,
      affected,
      changes,
      rationale: `Proposed recovery from stale decision ${prior.id}. ${prior.rationale}`,
      client_rationale: prior.client_safe_rationale,
      unknown_refs: prior.unknown_refs
    }, profile);
    next.source_basis_refs = deepClone(prior.source_basis_refs);
    next.assumption_refs = deepClone(prior.assumption_refs);
    next.dependency_refs = deepClone(prior.dependency_refs);
    next.advisor_analysis = prior.advisor_analysis
      ? `Copied as proposed context from ${prior.id}; review again before acceptance. ${prior.advisor_analysis}`
      : `Created from stale decision ${prior.id}; review every proposed field before acceptance.`;
    next.supersedes_decision_ref = prior.id;
    next.provenance = {
      origin_kind: "scope-local",
      source_refs: [{ id: prior.id, version: prior.version }],
      source_label: "Superseding draft created from a preserved stale Scope decision",
      asserted_at: nowIso(),
      asserted_by: profile
    };
    prior.superseded_by_decision_ref = next.id;
    prior.updated_at = nowIso();
    prior.updated_by_profile = profile;
    prior.version++;
    scope.updated_at = nowIso();
    scope.revision++;
    refreshScopeCurrency(scope);
    validateScopeDomain(scope);
    return next;
  }

  function acceptSupersedingScopeDecisionAtomically(
    scope: ScopeDomain,
    id: string,
    priorId: string,
    profile: PresentationProfile,
    modified?: ScopeFieldChange[]
  ): ScopeDecision {
    const prospective = deepClone(scope);
    const next = prospective.decisions.find(item => item.id === id);
    const prior = prospective.decisions.find(item => item.id === priorId);
    if (!next || !prior || next.supersedes_decision_ref !== prior.id || prior.superseded_by_decision_ref !== next.id) {
      throw new Error("Superseding Scope decision linkage is incomplete.");
    }
    if (!["draft", "proposed", "awaiting-confirmation", "awaiting-review", "returned"].includes(next.decision_state)) {
      throw new Error("Superseding Scope decision is not acceptance-ready.");
    }
    const changes = modified ? deepClone(modified) : deepClone(next.field_changes);
    if (!changes.length) throw new Error("Superseding Scope decision requires at least one reviewed field change.");
    const map = scopeRecordMap(prospective);
    const newRefs: ScopeVersionedRef[] = [];

    prior.decision_state = "superseded";
    prior.lifecycle = "superseded";
    prior.currency_state = "superseded";
    prior.review_state = "closed";
    prior.superseded_by_decision_ref = next.id;
    prior.updated_at = nowIso();
    prior.updated_by_profile = profile;
    prior.version++;

    for (const ref of next.affected_record_refs) {
      const record = map.get(ref.id);
      if (!record || record.version !== ref.version) {
        throw new Error("Superseding Scope decision is stale because an affected exact version changed.");
      }
      for (const change of changes) {
        if (!V061_CLOSURE_AUTHORITY_FIELDS.has(change.field)) {
          throw new Error(`Unsupported Scope authority field: ${change.field}.`);
        }
        for (const other of prospective.decisions) {
          if (
            other.id === next.id ||
            other.id === prior.id ||
            other.decision_state !== "accepted" ||
            other.currency_state !== "current"
          ) continue;
          if (
            other.affected_record_refs.some(item => item.id === ref.id) &&
            other.field_changes.some(item => item.field === change.field)
          ) {
            throw new Error(`A conflicting accepted decision already governs ${ref.id}:${change.field}.`);
          }
        }
        (record as unknown as Record<string, unknown>)[change.field] = change.new_value;
      }
      if ("decision_refs" in record) {
        const refs = (record as unknown as { decision_refs: string[] }).decision_refs;
        if (!refs.includes(next.id)) refs.push(next.id);
      }
      record.version++;
      record.updated_at = nowIso();
      record.updated_by_profile = profile;
      newRefs.push({ id: record.id, version: record.version });
    }

    next.field_changes = changes;
    next.affected_record_refs = newRefs;
    next.decision_state = "accepted";
    next.accepted_at = nowIso();
    next.accepted_by_profile = profile;
    next.review_state = "reviewed";
    next.currency_state = "current";
    next.supersedes_decision_ref = prior.id;
    next.updated_at = nowIso();
    next.updated_by_profile = profile;
    next.version++;
    prospective.updated_at = nowIso();
    prospective.revision++;
    refreshScopeCurrency(prospective);
    prior.currency_state = "superseded";
    validateScopeDomain(prospective);
    Object.assign(scope, prospective);
    const committed = scope.decisions.find(item => item.id === id);
    if (!committed) throw new Error("Superseding Scope decision transaction did not commit.");
    return committed;
  }

  function acceptScopeDecisionWithSupersession(
    scope: ScopeDomain,
    id: string,
    profile: PresentationProfile,
    modified?: ScopeFieldChange[]
  ): ScopeDecision {
    const pending = scope.decisions.find(item => item.id === id);
    const priorId = pending?.supersedes_decision_ref ?? null;
    if (!priorId) return V061_CLOSURE_BASE_ACCEPT_SCOPE_DECISION(scope, id, profile, modified);
    return acceptSupersedingScopeDecisionAtomically(scope, id, priorId, profile, modified);
  }

  function recordScopeReviewerDispositionWithStateGate(
    scope: ScopeDomain,
    decisionId: string,
    disposition: ScopeDecision["reviewer_disposition"],
    comment: string,
    profile: PresentationProfile,
    proposedChanges?: ScopeFieldChange[]
  ): ScopeDecision {
    const decision = scope.decisions.find(item => item.id === decisionId);
    if (!decision) throw new Error("Scope decision not found.");
    if (!isScopeDecisionReviewable(decision)) {
      throw new Error(`Reviewer disposition is unavailable for terminal or non-reviewable decision state ${decision.decision_state}.`);
    }
    return V061_CLOSURE_BASE_REVIEWER_DISPOSITION(scope, decisionId, disposition, comment, profile, proposedChanges);
  }

  const v061ClosureNamespace = (globalThis as unknown as { L2G: Record<string, unknown> }).L2G;
  v061ClosureNamespace.acceptScopeDecision = acceptScopeDecisionWithSupersession;
  v061ClosureNamespace.recordScopeReviewerDisposition = recordScopeReviewerDispositionWithStateGate;
}
