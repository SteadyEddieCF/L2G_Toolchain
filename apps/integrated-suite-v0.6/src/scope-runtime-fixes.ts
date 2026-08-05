namespace L2G {
  const V06_BASE_VALIDATE_SCOPE = validateScopeDomain;
  const V06_BASE_BUILD_SCOPE_PROJECTION = buildScopeProjection;
  const V06_BASE_APPLY_SCOPE_IMPORT = applyScopeImport;
  const V06_AUTHORITY_FIELDS = new Set([
    "asset_category",
    "scope_disposition",
    "boundary_relationship",
    "implementation_location",
    "responsibility_model",
    "diagram_review_state",
    "resolution_state"
  ]);

  function rewriteKnownIds(value: unknown, replacements: Map<string, string>): unknown {
    if (typeof value === "string") return replacements.get(value) ?? value;
    if (Array.isArray(value)) return value.map(item => rewriteKnownIds(item, replacements));
    if (isRecord(value)) {
      for (const key of Object.keys(value)) value[key] = rewriteKnownIds(value[key], replacements);
    }
    return value;
  }

  function decisionValidationMaps(scope: ScopeDomain): {
    forward: Map<string, string>;
    reverse: Map<string, string>;
  } {
    const forward = new Map<string, string>();
    const reverse = new Map<string, string>();
    for (const decision of scope.decisions) {
      const validationId = decision.id.startsWith("scope-decision_")
        ? decision.id.replace("scope-decision_", "scope-decision-")
        : decision.id;
      if (validationId !== decision.id) {
        forward.set(decision.id, validationId);
        reverse.set(validationId, decision.id);
      }
    }
    return { forward, reverse };
  }

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

  function normalizedScopeForBaseValidation(scope: ScopeDomain): {
    normalized: ScopeDomain;
    reverse: Map<string, string>;
  } {
    const normalized = currentizeDiagramRefsForValidation(scope);
    const maps = decisionValidationMaps(normalized);
    rewriteKnownIds(normalized, maps.forward);
    return { normalized, reverse: maps.reverse };
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
    V06_BASE_VALIDATE_SCOPE(normalizedScopeForBaseValidation(scope).normalized);
  }

  function acceptScopeDecisionAtomically(
    scope: ScopeDomain,
    id: string,
    profile: PresentationProfile,
    modified?: ScopeFieldChange[]
  ): ScopeDecision {
    const prospective = deepClone(scope);
    const decision = prospective.decisions.find(item => item.id === id);
    if (!decision) throw new Error("Scope decision not found.");
    if (!["draft", "proposed", "awaiting-confirmation", "awaiting-review", "returned"].includes(decision.decision_state)) {
      throw new Error("Scope decision is not acceptance-ready.");
    }

    const map = scopeRecordMap(prospective);
    const changes = modified ? deepClone(modified) : deepClone(decision.field_changes);
    const newRefs: ScopeVersionedRef[] = [];
    for (const ref of decision.affected_record_refs) {
      const record = map.get(ref.id);
      if (!record || record.version !== ref.version) {
        throw new Error("Scope decision is stale because an affected exact version changed.");
      }
      for (const change of changes) {
        if (!V06_AUTHORITY_FIELDS.has(change.field)) {
          throw new Error(`Unsupported Scope authority field: ${change.field}.`);
        }
        for (const other of prospective.decisions) {
          if (other.id === decision.id || other.decision_state !== "accepted" || other.currency_state !== "current") continue;
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
        if (!refs.includes(decision.id)) refs.push(decision.id);
      }
      record.version++;
      record.updated_at = nowIso();
      record.updated_by_profile = profile;
      newRefs.push({ id: record.id, version: record.version });
    }

    decision.field_changes = changes;
    decision.affected_record_refs = newRefs;
    decision.decision_state = "accepted";
    decision.accepted_at = nowIso();
    decision.accepted_by_profile = profile;
    decision.review_state = "reviewed";
    decision.updated_at = nowIso();
    decision.updated_by_profile = profile;
    decision.version++;
    prospective.updated_at = nowIso();
    prospective.revision++;
    refreshScopeCurrency(prospective);
    validateScopeAllowingHistoricalDiagramVersions(prospective);
    Object.assign(scope, prospective);
    const accepted = scope.decisions.find(item => item.id === id);
    if (!accepted) throw new Error("Accepted Scope decision was not preserved after validation.");
    return accepted;
  }

  function buildScopeProjectionWithHistoricalDiagrams(scope: ScopeDomain, profile: PresentationProfile): ScopeProjection {
    validateScopeAllowingHistoricalDiagramVersions(scope);
    const { normalized, reverse } = normalizedScopeForBaseValidation(scope);
    const projection = V06_BASE_BUILD_SCOPE_PROJECTION(normalized, profile);
    rewriteKnownIds(projection, reverse);
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
    const { normalized: working, reverse } = normalizedScopeForBaseValidation(scope);
    const historicalDiagrams = deepClone(scope.diagrams);
    const receipt = V06_BASE_APPLY_SCOPE_IMPORT(working, preview, profile);
    rewriteKnownIds(working, reverse);
    working.diagrams = historicalDiagrams;
    refreshScopeCurrency(working);
    validateScopeAllowingHistoricalDiagramVersions(working);
    Object.assign(scope, working);
    const applied = scope.import_receipts.find(item => item.id === receipt.id);
    if (!applied) throw new Error("Scope import receipt was not preserved after atomic apply.");
    return applied;
  }

  const v06ScopeNamespace = (globalThis as unknown as { L2G: Record<string, unknown> }).L2G;
  v06ScopeNamespace.validateScopeDomain = validateScopeAllowingHistoricalDiagramVersions;
  v06ScopeNamespace.acceptScopeDecision = acceptScopeDecisionAtomically;
  v06ScopeNamespace.buildScopeProjection = buildScopeProjectionWithHistoricalDiagrams;
  v06ScopeNamespace.applyScopeImport = applyScopeImportWithHistoricalDiagrams;
}
