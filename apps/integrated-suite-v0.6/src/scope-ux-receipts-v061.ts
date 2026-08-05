namespace L2G {
  type V061ApplyScopeImport = (scope: ScopeDomain, preview: ScopeImportPreview, profile: PresentationProfile) => ScopeImportReceipt;
  const V061_IDENTITY_APPLY = (globalThis as unknown as { L2G: { applyScopeImport: V061ApplyScopeImport } }).L2G.applyScopeImport;

  function applyScopeImportReceiptsV061(scope: ScopeDomain, preview: ScopeImportPreview, profile: PresentationProfile): ScopeImportReceipt {
    const beforeCandidateIds = new Set(scope.candidates.map(item => item.id));
    const receipt = V061_IDENTITY_APPLY(scope, preview, profile);
    const created = scope.candidates.filter(item => !beforeCandidateIds.has(item.id));
    const candidateRows = preview.records.filter(item => item.selected && item.treatment !== "reject" && item.treatment !== "link");
    if (created.length !== candidateRows.length) throw new Error("Reviewed Scope import candidate mapping is incomplete.");
    candidateRows.forEach((item, index) => {
      const candidate = created[index]!;
      candidate.proposed_values.identity_treatment = item.treatment;
      candidate.proposed_values.source_import_record_id = item.import_record_id;
      candidate.target_record_refs = item.exact_target_ref ? [item.exact_target_ref] : [];
      if (item.exact_target_ref) candidate.proposed_values.exact_target_ref = item.exact_target_ref;
      candidate.decision_rationale = item.treatment === "keep-separate"
        ? "Explicitly kept separate after identity review; similar names did not establish identity."
        : item.treatment === "modify"
          ? "Reviewed modification linked to an exact current Scope target; no governed target fields changed."
          : "Created as a low-authority Scope-owned candidate after explicit identity review.";
      candidate.updated_at = nowIso();
      candidate.version++;
    });
    const applied = scope.import_receipts.find(item => item.id === receipt.id);
    if (!applied) throw new Error("Reviewed Scope import receipt was not preserved.");
    applied.diagnostics.push(...preview.records.map(item =>
      `${item.import_record_id}: ${item.selected ? item.treatment : "not-selected"}${item.exact_target_ref ? ` -> ${item.exact_target_ref}` : ""}.`
    ));
    applied.updated_at = nowIso();
    applied.version++;
    validateScopeDomain(scope);
    return applied;
  }

  (globalThis as unknown as { L2G: Record<string, unknown> }).L2G.applyScopeImport = applyScopeImportReceiptsV061;
}
