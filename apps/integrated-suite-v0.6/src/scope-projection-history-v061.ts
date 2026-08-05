namespace L2G {
  type V061ProjectionBuilder = (scope: ScopeDomain, profile: PresentationProfile) => ScopeProjection;
  const V061_CLIENT_SAFE_PROJECTION = (globalThis as unknown as { L2G: { buildScopeProjection: V061ProjectionBuilder } }).L2G.buildScopeProjection;

  function buildScopeProjectionWithHistoricalDecisionRefs(scope: ScopeDomain, profile: PresentationProfile): ScopeProjection {
    const map = scopeRecordMap(scope);
    const historical = new Map<string, ScopeVersionedRef[]>();
    for (const decision of scope.decisions) {
      const stale = decision.affected_record_refs.some(ref => map.get(ref.id)?.version !== ref.version);
      if (stale) historical.set(decision.id, deepClone(decision.affected_record_refs));
    }
    if (!historical.size) return V061_CLIENT_SAFE_PROJECTION(scope, profile);
    const prospective = deepClone(scope);
    const prospectiveMap = scopeRecordMap(prospective);
    for (const decision of prospective.decisions) {
      if (!historical.has(decision.id)) continue;
      decision.affected_record_refs = decision.affected_record_refs.map(ref => ({
        id: ref.id,
        version: prospectiveMap.get(ref.id)?.version ?? ref.version
      }));
      decision.currency_state = "current";
    }
    const projection = V061_CLIENT_SAFE_PROJECTION(prospective, profile);
    for (const decision of projection.decisions) {
      const originalRefs = historical.get(decision.id);
      if (!originalRefs) continue;
      decision.affected_record_refs = deepClone(originalRefs);
      decision.currency_state = "stale";
    }
    return projection;
  }

  (globalThis as unknown as { L2G: Record<string, unknown> }).L2G.buildScopeProjection = buildScopeProjectionWithHistoricalDecisionRefs;
}
