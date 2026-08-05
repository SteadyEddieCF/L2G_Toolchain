namespace L2G {
  const V06_BASE_VALIDATE_SCOPE = validateScopeDomain;
  const V06_BASE_ACCEPT_SCOPE_DECISION = acceptScopeDecision;

  function validateScopeAllowingHistoricalDiagramVersions(scope: ScopeDomain): void {
    const originalMap = scopeRecordMap(scope);
    for (const diagram of scope.diagrams) {
      for (const ref of diagram.included_record_refs) {
        if (!originalMap.has(ref.id) || !Number.isInteger(ref.version) || ref.version < 1) {
          throw new Error(`${diagram.id} references a missing or invalid historical Scope version ${ref.id}.`);
        }
      }
      for (const node of diagram.node_records) {
        if (node.record_ref && (!originalMap.has(node.record_ref.id) || !Number.isInteger(node.record_ref.version) || node.record_ref.version < 1)) {
          throw new Error(`${diagram.id} contains a missing or invalid historical node reference ${node.record_ref.id}.`);
        }
      }
    }

    const prospective = deepClone(scope);
    const prospectiveMap = scopeRecordMap(prospective);
    for (const diagram of prospective.diagrams) {
      diagram.included_record_refs = diagram.included_record_refs.map(ref => ({
        id: ref.id,
        version: prospectiveMap.get(ref.id)?.version ?? ref.version
      }));
      diagram.node_records = diagram.node_records.map(node => node.record_ref ? {
        ...node,
        record_ref: {
          id: node.record_ref.id,
          version: prospectiveMap.get(node.record_ref.id)?.version ?? node.record_ref.version
        }
      } : node);
    }
    V06_BASE_VALIDATE_SCOPE(prospective);
  }

  function acceptScopeDecisionWithHistoricalDiagrams(
    scope: ScopeDomain,
    id: string,
    profile: PresentationProfile,
    modified?: ScopeFieldChange[]
  ): ScopeDecision {
    const historicalDiagrams = scope.diagrams;
    scope.diagrams = [];
    try {
      const accepted = V06_BASE_ACCEPT_SCOPE_DECISION(scope, id, profile, modified);
      scope.diagrams = historicalDiagrams;
      refreshScopeCurrency(scope);
      validateScopeAllowingHistoricalDiagramVersions(scope);
      return accepted;
    } catch (error) {
      scope.diagrams = historicalDiagrams;
      throw error;
    }
  }

  const v06ScopeNamespace = (globalThis as unknown as { L2G: Record<string, unknown> }).L2G;
  v06ScopeNamespace.validateScopeDomain = validateScopeAllowingHistoricalDiagramVersions;
  v06ScopeNamespace.acceptScopeDecision = acceptScopeDecisionWithHistoricalDiagrams;
}
