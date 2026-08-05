namespace L2G {
  export function v06UnknownDialog(id: string, projection: ScopeProjection, map: Map<string, ScopeRecordBase>): string {
    const item = projection.unknowns.find(unknown => unknown.id === id);
    if (!item) return "";
    return `<div class="scope-modal-backdrop"><section class="scope-modal" role="dialog" aria-modal="true" aria-labelledby="v06-dialog-title"><div class="scope-inspector-heading"><div><h2 id="v06-dialog-title">Publish question candidate</h2><p>${v06H(item.label)}</p></div><button data-v06-close-dialog aria-label="Close dialog">×</button></div><dl><dt>Prompt</dt><dd>${v06H(item.statement)}</dd><dt>Client-safe explanation</dt><dd>This question follows up on an unresolved Scope item and does not accept a client statement.</dd><dt>Affected exact Scope records</dt><dd>${v06H(item.affected_refs.map(ref => v06Label(map.get(ref))).join(", ") || "None visible")}</dd><dt>Participant suggestion</dt><dd>Advisor-selected participant</dd><dt>Visibility</dt><dd>${v06H(v06Words(item.visibility))}</dd></dl><p class="qualification">Publishing creates one draft Session Planner question candidate. It does not add the question to a live agenda or accept a client statement.</p><div class="scope-card-actions"><button type="button" data-v06-close-dialog>Cancel</button><button type="button" class="primary" data-v06-unknown-submit="${v06H(id)}">Create question candidate</button></div></section></div>`;
  }

  export function v06CandidateDialog(id: string, projection: ScopeProjection): string {
    const item = projection.candidates.find(candidate => candidate.id === id);
    if (!item) return "";
    return `<div class="scope-modal-backdrop"><section class="scope-modal" role="dialog" aria-modal="true" aria-labelledby="v06-dialog-title"><div class="scope-inspector-heading"><div><h2 id="v06-dialog-title">Review candidate disposition</h2><p>${v06H(item.label)}</p></div><button data-v06-close-dialog aria-label="Close dialog">×</button></div><label>Disposition<select id="v06-candidate-action"><option value="accept">Accept as target-owned draft</option><option value="modify">Modify and accept as target-owned draft</option><option value="return">Return</option><option value="reject">Reject</option></select></label><label>Rationale<textarea id="v06-candidate-rationale" maxlength="100000" required></textarea></label><p class="qualification">Candidate disposition never changes another domain's accepted state and does not establish a boundary or assessment conclusion.</p><div class="scope-card-actions"><button type="button" data-v06-close-dialog>Cancel</button><button type="button" class="primary" data-v06-candidate-submit="${v06H(id)}">Apply candidate disposition</button></div></section></div>`;
  }

  export function v06ImportUnresolved(preview: ScopeImportPreview): boolean {
    return preview.records.some(item => item.selected && item.treatment !== "reject" && (
      (item.ambiguity.length > 0 && item.treatment === "create" && !item.exact_target_ref) ||
      ((item.treatment === "link" || item.treatment === "modify") && !item.exact_target_ref)
    ));
  }

  export function v06ImportPanel(preview: ScopeImportPreview, projection: ScopeProjection, map: Map<string, ScopeRecordBase>): string {
    const unresolved = v06ImportUnresolved(preview);
    return `<div class="scope-modal-backdrop"><section class="scope-modal scope-import-panel" role="dialog" aria-modal="true" aria-labelledby="v06-import-title"><div class="scope-inspector-heading"><div><h2 id="v06-import-title">Review Scope package</h2><p>${v06H(preview.package_kind)} ${v06H(preview.package_version)} · ${v06H(preview.package_name)}</p></div><button id="v06-close-import" aria-label="Close import preview">×</button></div><dl><dt>Producer</dt><dd>${v06H(preview.producer)}</dd><dt>Size</dt><dd>${preview.package_size_bytes} bytes</dd><dt>SHA-256</dt><dd class="mono">${v06H(preview.package_sha256)}</dd></dl><p class="qualification">Similar names do not establish identity. Choose how each imported record relates to an exact existing Scope record.</p><div class="scope-import-records">${preview.records.map(item => {
      const targets = [...new Set([...(item.exact_target_ref ? [item.exact_target_ref] : []), ...item.ambiguity])];
      return `<fieldset data-import-row="${v06H(item.import_record_id)}"><legend><label><input type="checkbox" data-v06-import-record="${v06H(item.import_record_id)}" ${item.selected ? "checked" : ""}> ${v06H(item.label)}</label></legend><dl><dt>Source identity</dt><dd class="mono">${v06H(item.import_record_id)}</dd><dt>Source path</dt><dd>${v06H(item.source_path)}</dd><dt>Family</dt><dd>${v06H(v06Words(item.family))}</dd><dt>Possible matches</dt><dd>${targets.length ? targets.map(ref => `${v06H(v06Label(map.get(ref)))} (${v06H(ref)})`).join("; ") : "No deterministic match"}</dd></dl><div class="scope-import-treatment"><label>Treatment<select data-v06-treatment="${v06H(item.import_record_id)}"><option value="create" ${item.treatment === "create" ? "selected" : ""}>Create new candidate</option><option value="link" ${item.treatment === "link" ? "selected" : ""}>Link exact existing</option><option value="keep-separate" ${item.treatment === "keep-separate" ? "selected" : ""}>Keep separate</option><option value="modify" ${item.treatment === "modify" ? "selected" : ""}>Modify and create/link</option><option value="reject" ${item.treatment === "reject" ? "selected" : ""}>Reject</option></select></label><label>Exact target<select data-v06-target="${v06H(item.import_record_id)}"><option value="">Choose exact target</option>${targets.map(ref => `<option value="${v06H(ref)}" ${item.exact_target_ref === ref ? "selected" : ""}>${v06H(v06Label(map.get(ref)))} · ${v06H(ref)} · version ${map.get(ref)?.version ?? "?"}</option>`).join("")}</select></label></div>${item.ambiguity.length && !item.exact_target_ref && item.treatment === "create" ? `<p class="notice warning">Identity is ambiguous. Choose an exact link/modify target, Keep separate, or Reject before apply.</p>` : ""}</fieldset>`;
    }).join("")}</div>${preview.rejected.length || preview.warnings.length ? `<div class="notice warning">${[...preview.warnings, ...preview.rejected].map(item => `<div>${v06H(item)}</div>`).join("")}</div>` : ""}<p class="qualification">Applying this reviewed subset creates Scope-owned candidates or explicit links only. It does not accept a boundary decision.</p><div class="scope-card-actions"><button id="v06-reject-import">Reject preview</button><button id="v06-apply-import" class="primary" ${unresolved ? "disabled" : ""}>Apply reviewed subset atomically</button></div></section></div>`;
  }

}
namespace L2G {
  export function v06Bind(main: HTMLElement, store: ProjectStore, projection: ScopeProjection, map: Map<string, ScopeRecordBase>): void {
    main.querySelectorAll<HTMLButtonElement>("[data-v06-tab]").forEach(button => button.addEventListener("click", () => {
      v06Tab = button.dataset.v06Tab as V06ScopeTab;
      v06Selected = "";
      v06FocusSelector = `[data-v06-tab="${v06Tab}"]`;
      v06Render(main, store);
    }));
    main.querySelectorAll<HTMLButtonElement>("[data-v06-ref]").forEach(button => button.addEventListener("click", () => {
      const ref = button.dataset.v06Ref ?? "";
      if (!map.has(ref)) return;
      v06Selected = ref;
      v06FocusSelector = "#scope-inspector-title";
      v06Render(main, store);
    }));
    main.querySelector("#v06-close")?.addEventListener("click", () => {
      v06Selected = "";
      v06FocusSelector = "#scope-title";
      v06Render(main, store);
    });
    main.querySelector("#v06-add-asset")?.addEventListener("click", () => { v06Dialog = { kind: "add-asset" }; v06FocusSelector = "#v06-dialog-title"; v06Render(main, store); });
    main.querySelector("#v06-import")?.addEventListener("click", () => v06ChooseImport());
    main.querySelector("#v06-empty-import")?.addEventListener("click", () => v06ChooseImport());
    main.querySelector("#v06-empty-boundary")?.addEventListener("click", () => { v06Dialog = { kind: "add-boundary" }; v06FocusSelector = "#v06-dialog-title"; v06Render(main, store); });
    main.querySelector("#v06-diagram")?.addEventListener("click", () => v06GenerateDiagram(store));
    main.querySelectorAll<HTMLButtonElement>("[data-v06-open-candidate]").forEach(button => button.addEventListener("click", () => { v06Dialog = { kind: "candidate", id: button.dataset.v06OpenCandidate ?? "" }; v06FocusSelector = "#v06-dialog-title"; v06Render(main, store); }));
    main.querySelectorAll<HTMLButtonElement>("[data-v06-open-decision]").forEach(button => button.addEventListener("click", () => { v06Dialog = { kind: "decision", id: button.dataset.v06OpenDecision ?? "" }; v06FocusSelector = "#v06-dialog-title"; v06Render(main, store); }));
    main.querySelectorAll<HTMLButtonElement>("[data-v06-return-decision]").forEach(button => button.addEventListener("click", () => { v06Dialog = { kind: "decision", id: button.dataset.v06ReturnDecision ?? "" }; v06FocusSelector = "#v06-dialog-title"; v06Render(main, store); }));
    main.querySelectorAll<HTMLButtonElement>("[data-v06-review]").forEach(button => button.addEventListener("click", () => { v06Dialog = { kind: "review", id: button.dataset.v06Review ?? "", action: button.dataset.v06ReviewAction as ScopeDecision["reviewer_disposition"] }; v06FocusSelector = "#v06-dialog-title"; v06Render(main, store); }));
    main.querySelectorAll<HTMLButtonElement>("[data-v06-refresh-diagram]").forEach(button => button.addEventListener("click", () => v06RefreshDiagram(store, button.dataset.v06RefreshDiagram ?? "")));
    main.querySelectorAll<HTMLButtonElement>("[data-v06-review-diagram]").forEach(button => button.addEventListener("click", () => v06ReviewDiagram(store, button.dataset.v06ReviewDiagram ?? "")));
    main.querySelectorAll<HTMLButtonElement>("[data-v06-publish-unknown]").forEach(button => button.addEventListener("click", () => { v06Dialog = { kind: "unknown", id: button.dataset.v06PublishUnknown ?? "" }; v06FocusSelector = "#v06-dialog-title"; v06Render(main, store); }));
    main.querySelectorAll<HTMLButtonElement>("[data-v06-diagram-control]").forEach(button => button.addEventListener("click", () => v06DiagramControl(main, store, button.dataset.v06Diagram ?? "", button.dataset.v06DiagramControl ?? "100")));
    main.querySelectorAll<HTMLButtonElement>("[data-v06-show-diagram]").forEach(button => button.addEventListener("click", () => { v06Tab = "diagrams"; v06Selected = button.dataset.v06ShowDiagram ?? ""; v06Render(main, store); }));
    main.querySelectorAll<HTMLButtonElement>("[data-v06-object-mode]").forEach(button => button.addEventListener("click", () => { v06ObjectMode = button.dataset.v06ObjectMode as "grouped" | "assets"; v06Render(main, store); }));
    main.querySelector<HTMLInputElement>("#v06-search")?.addEventListener("input", event => { v06Search = (event.currentTarget as HTMLInputElement).value; v06Render(main, store); });
    main.querySelector<HTMLSelectElement>("#v06-category-filter")?.addEventListener("change", event => { v06CategoryFilter = (event.currentTarget as HTMLSelectElement).value; v06Render(main, store); });
    main.querySelector<HTMLSelectElement>("#v06-disposition-filter")?.addEventListener("change", event => { v06DispositionFilter = (event.currentTarget as HTMLSelectElement).value; v06Render(main, store); });
    main.querySelector<HTMLSelectElement>("#v06-responsibility-filter")?.addEventListener("change", event => { v06ResponsibilityFilter = (event.currentTarget as HTMLSelectElement).value; v06Render(main, store); });
    v06BindImport(main, store);
    v06BindDialog(main, store, projection);
    v06BindKeyboard(main, store);
  }

  export function v06BindKeyboard(main: HTMLElement, store: ProjectStore): void {
    main.querySelectorAll<HTMLElement>("[data-v06-ref]").forEach(item => item.addEventListener("keydown", event => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      const items = [...main.querySelectorAll<HTMLElement>("[data-v06-ref]")].filter(node => !node.hasAttribute("disabled"));
      const index = items.indexOf(item);
      if (index < 0) return;
      event.preventDefault();
      const next = event.key === "ArrowDown" ? Math.min(items.length - 1, index + 1) : Math.max(0, index - 1);
      items[next]?.focus();
    }));
    main.addEventListener("keydown", event => {
      const target = event.target as HTMLElement;
      if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        const search = main.querySelector<HTMLInputElement>("#v06-search");
        if (search) { event.preventDefault(); search.focus(); }
      }
      if (event.key === "Escape") {
        if (v06Dialog || v06Preview) { event.preventDefault(); v06Dialog = null; v06Preview = null; v06FocusSelector = "#scope-title"; v06Render(main, store); }
        else if (v06Selected) { event.preventDefault(); v06Selected = ""; v06FocusSelector = "#scope-title"; v06Render(main, store); }
      }
      if (event.key === "Tab") v06TrapDialogFocus(main, event);
    });
  }

  export function v06TrapDialogFocus(main: HTMLElement, event: KeyboardEvent): void {
    const dialog = main.querySelector<HTMLElement>('[role="dialog"][aria-modal="true"]');
    if (!dialog) return;
    const focusable = [...dialog.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    const first = focusable[0]!, last = focusable[focusable.length - 1]!;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

}
