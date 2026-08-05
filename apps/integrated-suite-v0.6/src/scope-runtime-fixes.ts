namespace L2G {
  const V06_BASE_VALIDATE_SCOPE = validateScopeDomain;
  const V06_BASE_ACCEPT_SCOPE_DECISION = acceptScopeDecision;
  const V06_BASE_BUILD_SCOPE_PROJECTION = buildScopeProjection;
  const V06_BASE_APPLY_SCOPE_IMPORT = applyScopeImport;

  function currentizeDiagramRefsForValidation(scope: ScopeDomain): ScopeDomain {
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
    return prospective;
  }

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
    V06_BASE_VALIDATE_SCOPE(currentizeDiagramRefsForValidation(scope));
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

  function buildScopeProjectionWithHistoricalDiagrams(scope: ScopeDomain, profile: PresentationProfile): ScopeProjection {
    validateScopeAllowingHistoricalDiagramVersions(scope);
    const normalized = currentizeDiagramRefsForValidation(scope);
    const projection = V06_BASE_BUILD_SCOPE_PROJECTION(normalized, profile);
    const visible = (diagram: ScopeDiagram): boolean => profile !== "client" || (
      (diagram.visibility === "client-safe" || diagram.visibility === "approved-for-client-presentation") &&
      (diagram.diagram_review_state === "reviewed" || diagram.diagram_review_state === "approved-representation")
    );
    projection.diagrams = scope.diagrams.filter(visible).map(diagram => {
      const clone = deepClone(diagram);
      if (profile === "client") {
        clone.provenance = {
          origin_kind: "scope-local",
          source_refs: [],
          source_label: "Reviewed Scope context",
          asserted_at: clone.updated_at,
          asserted_by: "system"
        };
      }
      return clone;
    });
    projection.counts.diagrams = projection.diagrams.length;
    projection.next_work = scopeNextWork(projection);
    return projection;
  }

  function applyScopeImportWithHistoricalDiagrams(
    scope: ScopeDomain,
    preview: ScopeImportPreview,
    profile: PresentationProfile
  ): ScopeImportReceipt {
    const historicalDiagrams = scope.diagrams;
    scope.diagrams = [];
    try {
      const receipt = V06_BASE_APPLY_SCOPE_IMPORT(scope, preview, profile);
      scope.diagrams = historicalDiagrams;
      refreshScopeCurrency(scope);
      validateScopeAllowingHistoricalDiagramVersions(scope);
      return receipt;
    } catch (error) {
      scope.diagrams = historicalDiagrams;
      throw error;
    }
  }

  const v06ScopeNamespace = (globalThis as unknown as { L2G: Record<string, unknown> }).L2G;
  v06ScopeNamespace.validateScopeDomain = validateScopeAllowingHistoricalDiagramVersions;
  v06ScopeNamespace.acceptScopeDecision = acceptScopeDecisionWithHistoricalDiagrams;
  v06ScopeNamespace.buildScopeProjection = buildScopeProjectionWithHistoricalDiagrams;
  v06ScopeNamespace.applyScopeImport = applyScopeImportWithHistoricalDiagrams;
}
