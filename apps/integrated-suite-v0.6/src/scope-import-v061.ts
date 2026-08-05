namespace L2G {
  export interface ScopeImportCandidate {
    source_identity?: string;
    match_kind?: "exact" | "possible" | "none" | "import-duplicate";
    match_reason?: string;
    exact_target_version?: number | null;
    possible_target_refs?: string[];
    distinguishing_summary?: string;
    treatment_reviewed?: boolean;
  }

  interface V061ImportHooks { store: ProjectStore; }

  const V061_BASE_PREVIEW_SCOPE_PACKAGE = previewScopePackage;
  const V061_BASE_APPLY_SCOPE_IMPORT = applyScopeImport;
  let v061ImportDialog: HTMLDialogElement | null = null;

  function v061ImportHooks(): V061ImportHooks | null {
    return ((window as unknown as { __L2G_TEST__?: V061ImportHooks }).__L2G_TEST__) ?? null;
  }

  function v061ImportEscape(value: unknown): string {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]!));
  }

  function v061NormalizeIdentity(value: string): string {
    return value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
  }

  function v061ImportFamilyRecords(scope: ScopeDomain, family: ScopeCandidate["candidate_kind"]): ScopeRecordBase[] {
    if (family === "system") return scope.systems;
    if (family === "asset") return scope.assets;
    if (family === "provider") return scope.providers;
    if (family === "service") return scope.services;
    if (family === "location") return scope.locations;
    if (family === "enclave") return scope.enclaves;
    if (family === "flow") return scope.data_flows;
    if (family === "unknown") return scope.unknowns;
    if (family === "assumption") return scope.assumptions;
    if (family === "dependency") return scope.dependencies;
    if (family === "diagram") return scope.diagrams;
    if (family === "decision") return scope.decisions;
    return [];
  }

  export function enrichScopeImportPreview(scope: ScopeDomain, preview: ScopeImportPreview): ScopeImportPreview {
    const enriched = deepClone(preview);
    const duplicateGroups = new Map<string, ScopeImportCandidate[]>();
    for (const item of enriched.records) {
      const sourceIdentity = item.import_record_id.split(":").slice(1).join(":") || item.import_record_id;
      item.source_identity = sourceIdentity;
      item.distinguishing_summary = `${item.proposed_values.object_kind ?? item.family}; ${item.proposed_values.description || "no description supplied"}`;
      item.possible_target_refs = [];
      item.exact_target_version = null;
      item.treatment_reviewed = true;
      const candidates = v061ImportFamilyRecords(scope, item.family);
      const exact = candidates.filter(record => record.id === sourceIdentity || record.provenance.source_refs.some(ref => ref.id === sourceIdentity));
      const sameName = candidates.filter(record => v061NormalizeIdentity(record.label) === v061NormalizeIdentity(item.label) && !exact.some(value => value.id === record.id));
      if (exact.length === 1) {
        item.match_kind = "exact";
        item.match_reason = "Stable source identity matches one exact Scope record.";
        item.exact_target_ref = exact[0]!.id;
        item.exact_target_version = exact[0]!.version;
        item.possible_target_refs = [exact[0]!.id];
        item.treatment = "link";
        item.treatment_reviewed = false;
      } else if (exact.length > 1) {
        item.match_kind = "possible";
        item.match_reason = "The source identity maps to more than one current Scope record and requires explicit treatment.";
        item.ambiguity = exact.map(record => record.id);
        item.possible_target_refs = exact.map(record => record.id);
        item.exact_target_ref = null;
        item.treatment_reviewed = false;
      } else if (sameName.length) {
        item.match_kind = "possible";
        item.match_reason = "Similar names do not establish identity. Review the possible current Scope records.";
        item.ambiguity = sameName.map(record => record.id);
        item.possible_target_refs = sameName.map(record => record.id);
        item.exact_target_ref = null;
        item.treatment_reviewed = false;
      } else {
        item.match_kind = "none";
        item.match_reason = "No exact or same-name current Scope record was found.";
        item.ambiguity = [];
        item.exact_target_ref = null;
        item.treatment = "create";
      }
      const groupKey = `${item.family}:${v061NormalizeIdentity(item.label)}`;
      const group = duplicateGroups.get(groupKey) ?? [];
      group.push(item);
      duplicateGroups.set(groupKey, group);
    }
    for (const group of duplicateGroups.values()) {
      if (group.length < 2) continue;
      for (const item of group) {
        item.match_kind = item.match_kind === "exact" ? "exact" : "import-duplicate";
        item.match_reason = `${item.match_reason ?? ""} The same label appears ${group.length} times in this package; each record requires an explicit identity treatment.`.trim();
        item.ambiguity = [...new Set([...item.ambiguity, ...group.filter(other => other.import_record_id !== item.import_record_id).map(other => `import:${other.import_record_id}`)])];
        item.treatment_reviewed = false;
      }
    }
    return enriched;
  }

  function v061ImportUnresolved(item: ScopeImportCandidate, scope: ScopeDomain): string | null {
    if (!item.selected || item.treatment === "reject") return null;
    if (!item.treatment_reviewed) return "Choose an explicit treatment.";
    if (item.treatment === "link" || item.treatment === "modify") {
      if (!item.exact_target_ref) return "Choose an exact existing Scope target.";
      const target = scopeRecordMap(scope).get(item.exact_target_ref);
      if (!target) return "The selected exact target no longer exists.";
      if (item.exact_target_version !== null && item.exact_target_version !== undefined && target.version !== item.exact_target_version) return "The selected exact target version changed; preview the package again.";
    }
    return null;
  }

  export function applyReviewedScopeImport(scope: ScopeDomain, preview: ScopeImportPreview, profile: PresentationProfile): ScopeImportReceipt {
    const unresolved = preview.records.map(item => ({ item, reason: v061ImportUnresolved(item, scope) })).filter(value => value.reason);
    if (unresolved.length) throw new Error(`Resolve import identity treatment before apply: ${unresolved[0]!.item.import_record_id} — ${unresolved[0]!.reason}`);
    const reviewed = deepClone(preview);
    reviewed.warnings.push(...reviewed.records.map(item => `Treatment ${item.import_record_id}: ${item.selected ? item.treatment : "not-selected"}${item.exact_target_ref ? ` → ${item.exact_target_ref} v${item.exact_target_version ?? "current"}` : ""}.`));
    for (const item of reviewed.records) {
      if (!item.selected || item.treatment === "reject") continue;
      item.ambiguity = [];
      if (item.treatment === "create" || item.treatment === "keep-separate") item.exact_target_ref = null;
    }
    return V061_BASE_APPLY_SCOPE_IMPORT(scope, reviewed, profile);
  }

  function v061CloseImportDialog(origin?: HTMLElement | null): void {
    if (!v061ImportDialog) return;
    const dialog = v061ImportDialog;
    v061ImportDialog = null;
    if (dialog.open) dialog.close();
    dialog.remove();
    queueMicrotask(() => origin?.focus());
  }

  function v061TargetOptions(scope: ScopeDomain, item: ScopeImportCandidate): string {
    const map = scopeRecordMap(scope);
    const refs = item.possible_target_refs ?? [];
    return `<option value="">Choose exact target…</option>${refs.map(ref => {
      const record = map.get(ref);
      return `<option value="${v061ImportEscape(ref)}" ${item.exact_target_ref === ref ? "selected" : ""}>${v061ImportEscape(record?.label ?? ref)} · ${v061ImportEscape(ref)} · v${record?.version ?? "?"}</option>`;
    }).join("")}`;
  }

  function v061UpdateImportApplyState(dialog: HTMLDialogElement, scope: ScopeDomain, preview: ScopeImportPreview): void {
    const unresolved = preview.records.filter(item => v061ImportUnresolved(item, scope));
    const apply = dialog.querySelector<HTMLButtonElement>("[data-v061-apply-import]");
    const status = dialog.querySelector<HTMLElement>("[data-v061-import-status]");
    if (apply) apply.disabled = unresolved.length > 0;
    if (status) status.textContent = unresolved.length
      ? `${unresolved.length} selected record${unresolved.length === 1 ? "" : "s"} still require explicit identity treatment.`
      : "All selected records have explicit reviewed treatments. Apply remains atomic and creates candidates or exact links only.";
  }

  function v061OpenImportDialog(scope: ScopeDomain, preview: ScopeImportPreview, origin: HTMLElement): void {
    v061CloseImportDialog();
    const dialog = document.createElement("dialog");
    dialog.className = "scope-import-dialog v061-import-dialog";
    dialog.setAttribute("aria-labelledby", "v061-import-title");
    dialog.innerHTML = `<form method="dialog"><div class="scope-inspector-heading"><div><h2 id="v061-import-title">Review Scope package identity</h2><p>${v061ImportEscape(preview.package_kind)} ${v061ImportEscape(preview.package_version)} · ${v061ImportEscape(preview.package_name)}</p></div><button value="cancel" data-v061-close-import aria-label="Close import review">×</button></div><div class="notice">Similar names do not establish identity. Choose how each imported record relates to an exact existing Scope record. Applying this reviewed subset creates Scope-owned candidates or explicit links only; it does not accept a boundary decision.</div><dl><dt>Producer</dt><dd>${v061ImportEscape(preview.producer)}</dd><dt>Size</dt><dd>${preview.package_size_bytes} bytes</dd><dt>SHA-256</dt><dd><code>${v061ImportEscape(preview.package_sha256)}</code></dd></dl><div class="scope-import-records">${preview.records.map((item, index) => `<section class="scope-list-card" data-v061-import-row="${index}"><label><input type="checkbox" data-v061-selected="${index}" ${item.selected ? "checked" : ""}><span><strong>${v061ImportEscape(item.label)}</strong><small>${v061ImportEscape(item.family)} · ${v061ImportEscape(item.source_path)} · source ${v061ImportEscape(item.source_identity)}</small></span></label><p>${v061ImportEscape(item.distinguishing_summary)}</p><p class="notice ${item.match_kind === "none" ? "" : "warning"}"><strong>${v061ImportEscape(item.match_kind ?? "none")}</strong> — ${v061ImportEscape(item.match_reason)}</p><label>Treatment<select data-v061-treatment="${index}"><option value="" ${item.treatment_reviewed ? "" : "selected"}>Choose treatment…</option><option value="create">Create new candidate</option><option value="link">Link exact existing</option><option value="keep-separate">Keep separate candidate</option><option value="modify">Modify and create/link candidate</option><option value="reject">Reject imported record</option></select></label><label data-v061-target-wrap="${index}" ${item.possible_target_refs?.length ? "" : "hidden"}>Exact current target<select data-v061-target="${index}">${v061TargetOptions(scope, item)}</select></label></section>`).join("")}</div>${[...preview.warnings, ...preview.rejected].length ? `<div class="notice warning">${[...preview.warnings, ...preview.rejected].map(item => `<div>${v061ImportEscape(item)}</div>`).join("")}</div>` : ""}<p data-v061-import-status role="status"></p><div class="scope-card-actions"><button type="button" data-v061-cancel-import>Cancel</button><button type="button" class="primary" data-v061-apply-import>Apply reviewed subset atomically</button></div><p data-v061-import-error class="notice warning" hidden></p></form>`;
    document.body.append(dialog);
    v061ImportDialog = dialog;
    const hooks = v061ImportHooks();
    dialog.addEventListener("cancel", event => { event.preventDefault(); v061CloseImportDialog(origin); });
    dialog.querySelector("[data-v061-close-import]")?.addEventListener("click", event => { event.preventDefault(); v061CloseImportDialog(origin); });
    dialog.querySelector("[data-v061-cancel-import]")?.addEventListener("click", () => v061CloseImportDialog(origin));
    dialog.querySelectorAll<HTMLInputElement>("[data-v061-selected]").forEach(input => input.addEventListener("change", () => {
      const item = preview.records[Number(input.dataset.v061Selected)];
      if (item) item.selected = input.checked;
      v061UpdateImportApplyState(dialog, scope, preview);
    }));
    dialog.querySelectorAll<HTMLSelectElement>("[data-v061-treatment]").forEach(select => select.addEventListener("change", () => {
      const index = Number(select.dataset.v061Treatment);
      const item = preview.records[index];
      if (!item) return;
      if (!select.value) {
        item.treatment_reviewed = false;
      } else {
        item.treatment = select.value as ScopeImportCandidate["treatment"];
        item.treatment_reviewed = true;
      }
      const targetWrap = dialog.querySelector<HTMLElement>(`[data-v061-target-wrap="${index}"]`);
      if (targetWrap) targetWrap.hidden = !(item.treatment === "link" || item.treatment === "modify") || !(item.possible_target_refs?.length);
      v061UpdateImportApplyState(dialog, scope, preview);
    }));
    dialog.querySelectorAll<HTMLSelectElement>("[data-v061-target]").forEach(select => select.addEventListener("change", () => {
      const item = preview.records[Number(select.dataset.v061Target)];
      if (!item) return;
      item.exact_target_ref = select.value || null;
      const target = item.exact_target_ref ? scopeRecordMap(scope).get(item.exact_target_ref) : undefined;
      item.exact_target_version = target?.version ?? null;
      v061UpdateImportApplyState(dialog, scope, preview);
    }));
    dialog.querySelector("[data-v061-apply-import]")?.addEventListener("click", () => {
      const error = dialog.querySelector<HTMLElement>("[data-v061-import-error]");
      try {
        if (!hooks) throw new Error("Project store is unavailable.");
        hooks.store.execute("scope.import.applied", "scope_import", preview.package_sha256, "Applied a reviewed Scope package subset with explicit identity treatments.", documentValue => {
          const targetScope = documentValue.state.scope;
          if (!targetScope) throw new Error("Scope domain is missing.");
          applyReviewedScopeImport(targetScope, preview, documentValue.state.profile);
        }, "Applied reviewed Scope compatibility package");
        v061CloseImportDialog(origin);
        document.querySelector<HTMLButtonElement>('[data-v06-tab="decisions"]')?.click();
      } catch (caught) {
        if (error) { error.hidden = false; error.textContent = errorMessage(caught); }
      }
    });
    v061UpdateImportApplyState(dialog, scope, preview);
    dialog.showModal();
    queueMicrotask(() => dialog.querySelector<HTMLElement>("select, input, button")?.focus());
  }

  async function v061ChooseScopeImport(origin: HTMLElement): Promise<void> {
    const hooks = v061ImportHooks();
    if (!hooks) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const base = await V061_BASE_PREVIEW_SCOPE_PACKAGE(new Uint8Array(await file.arrayBuffer()), file.name);
        const scope = hooks.store.document.state.scope;
        if (!scope) throw new Error("Scope domain is missing.");
        v061OpenImportDialog(scope, enrichScopeImportPreview(scope, base), origin);
      } catch (caught) {
        window.alert(`Scope package preview failed: ${errorMessage(caught)}`);
      }
    }, { once: true });
    input.click();
  }

  document.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const importButton = target.closest<HTMLElement>("#v06-import");
    if (!importButton) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    void v061ChooseScopeImport(importButton);
  }, true);
}
