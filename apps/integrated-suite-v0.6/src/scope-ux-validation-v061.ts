namespace L2G {
  type V061ValidateScope = (scope: ScopeDomain) => void;
  type V061RefreshScope = (scope: ScopeDomain) => void;
  const V061_HISTORICAL_DIAGRAM_VALIDATE = (globalThis as unknown as { L2G: { validateScopeDomain: V061ValidateScope } }).L2G.validateScopeDomain;
  const V061_BASE_REFRESH_SCOPE = (globalThis as unknown as { L2G: { refreshScopeCurrency: V061RefreshScope } }).L2G.refreshScopeCurrency;

  function v061DecisionRefIsHistorical(decision: ScopeDecision, map: Map<string, ScopeRecordBase>): boolean {
    return decision.affected_record_refs.some(ref => map.get(ref.id)?.version !== ref.version);
  }

  function refreshScopeCurrencyIncludingProposals(scope: ScopeDomain): void {
    V061_BASE_REFRESH_SCOPE(scope);
    const map = scopeRecordMap(scope);
    for (const decision of scope.decisions) {
      if (decision.decision_state === "superseded" || decision.currency_state === "superseded") {
        decision.currency_state = "superseded";
        continue;
      }
      decision.currency_state = v061DecisionRefIsHistorical(decision, map) ? "stale" : "current";
    }
  }

  function validateScopeWithHistoricalStaleDecisionRefs(scope: ScopeDomain): void {
    const map = scopeRecordMap(scope);
    for (const decision of scope.decisions) {
      if (!v061DecisionRefIsHistorical(decision, map)) continue;
      for (const ref of decision.affected_record_refs) {
        if (!map.has(ref.id) || !Number.isInteger(ref.version) || ref.version < 1) {
          throw new Error(`${decision.id} references a missing or invalid historical Scope version ${ref.id}.`);
        }
      }
    }
    const prospective = deepClone(scope);
    const prospectiveMap = scopeRecordMap(prospective);
    for (const decision of prospective.decisions) {
      if (!v061DecisionRefIsHistorical(decision, prospectiveMap)) continue;
      decision.affected_record_refs = decision.affected_record_refs.map(ref => ({
        id: ref.id,
        version: prospectiveMap.get(ref.id)?.version ?? ref.version
      }));
    }
    V061_HISTORICAL_DIAGRAM_VALIDATE(prospective);
  }

  const namespace = (globalThis as unknown as { L2G: Record<string, unknown> }).L2G;
  namespace.refreshScopeCurrency = refreshScopeCurrencyIncludingProposals;
  namespace.validateScopeDomain = validateScopeWithHistoricalStaleDecisionRefs;
}
