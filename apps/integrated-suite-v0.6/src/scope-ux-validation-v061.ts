namespace L2G {
  type V061ValidateScope = (scope: ScopeDomain) => void;
  const V061_HISTORICAL_DIAGRAM_VALIDATE = (globalThis as unknown as { L2G: { validateScopeDomain: V061ValidateScope } }).L2G.validateScopeDomain;

  function validateScopeWithHistoricalStaleDecisionRefs(scope: ScopeDomain): void {
    const map = scopeRecordMap(scope);
    for (const decision of scope.decisions) {
      if (decision.currency_state === "current") continue;
      for (const ref of decision.affected_record_refs) {
        if (!map.has(ref.id) || !Number.isInteger(ref.version) || ref.version < 1) {
          throw new Error(`${decision.id} references a missing or invalid historical Scope version ${ref.id}.`);
        }
      }
    }
    const prospective = deepClone(scope);
    const prospectiveMap = scopeRecordMap(prospective);
    for (const decision of prospective.decisions) {
      if (decision.currency_state === "current") continue;
      decision.affected_record_refs = decision.affected_record_refs.map(ref => ({
        id: ref.id,
        version: prospectiveMap.get(ref.id)?.version ?? ref.version
      }));
    }
    V061_HISTORICAL_DIAGRAM_VALIDATE(prospective);
  }

  (globalThis as unknown as { L2G: Record<string, unknown> }).L2G.validateScopeDomain = validateScopeWithHistoricalStaleDecisionRefs;
}
