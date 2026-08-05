namespace L2G {
  const V061_CLOSURE_BASE_ACCEPT_SCOPE_DECISION = acceptScopeDecision;
  const V061_CLOSURE_BASE_REVIEWER_DISPOSITION = recordScopeReviewerDisposition;
  const V061_CLOSURE_REVIEWABLE_DECISION_STATES = new Set<ScopeDecisionState>([
    "proposed",
    "awaiting-review",
    "awaiting-confirmation"
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

  function acceptScopeDecisionWithSupersession(
    scope: ScopeDomain,
    id: string,
    profile: PresentationProfile,
    modified?: ScopeFieldChange[]
  ): ScopeDecision {
    const pending = scope.decisions.find(item => item.id === id);
    const priorId = pending?.supersedes_decision_ref ?? null;
    const accepted = V061_CLOSURE_BASE_ACCEPT_SCOPE_DECISION(scope, id, profile, modified);
    if (!priorId) return accepted;
    const prior = scope.decisions.find(item => item.id === priorId);
    if (!prior) throw new Error("Superseded Scope decision was not found after acceptance.");
    prior.decision_state = "superseded";
    prior.lifecycle = "superseded";
    prior.currency_state = "superseded";
    prior.review_state = "closed";
    prior.superseded_by_decision_ref = accepted.id;
    prior.updated_at = nowIso();
    prior.updated_by_profile = profile;
    prior.version++;
    accepted.supersedes_decision_ref = prior.id;
    accepted.updated_at = nowIso();
    accepted.version++;
    scope.updated_at = nowIso();
    scope.revision++;
    validateScopeDomain(scope);
    return accepted;
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
