namespace L2G {
  let v061InspectorReturnSelector = "#scope-title";
  const v061FitDiagramIds = new Set<string>();
  let v061PatchQueued = false;
  let v061FitQueued = false;

  function v061Workspace(): HTMLElement | null {
    return document.getElementById("workspace");
  }

  function v061Context(): { store: ProjectStore; scope: ScopeDomain; projection: ScopeProjection; map: Map<string, ScopeRecordBase> } | null {
    const hooks = v06Hooks();
    if (!hooks || hooks.store.document.state.active_workspace !== "scope") return null;
    const scope = v06Scope(hooks.store.document);
    refreshScopeCurrency(scope);
    const projection = buildScopeProjection(scope, hooks.store.document.state.profile);
    return { store: hooks.store, scope, projection, map: scopeProjectionRecordMap(projection) };
  }

  function v061SelectorForRef(ref: string): string {
    return `[data-v06-ref="${CSS.escape(ref)}"]`;
  }

  function v061RestoreInspectorFocus(main: HTMLElement): void {
    const target = main.querySelector<HTMLElement>(v061InspectorReturnSelector) ?? main.querySelector<HTMLElement>("#scope-title");
    target?.focus();
  }

  function v061CloseInspector(main: HTMLElement, store: ProjectStore): void {
    v06Selected = "";
    v06FocusSelector = v061InspectorReturnSelector;
    v06Render(main, store);
    queueMicrotask(() => v061RestoreInspectorFocus(main));
  }

  function v061PatchTabletInspector(main: HTMLElement): void {
    const inspector = main.querySelector<HTMLElement>(".scope-inspector:not(.empty-inspector)");
    if (!inspector) return;
    const tablet = window.matchMedia("(max-width: 1100px)").matches;
    if (tablet) {
      if (inspector.getAttribute("role") !== "dialog") inspector.setAttribute("role", "dialog");
      if (inspector.getAttribute("aria-modal") !== "true") inspector.setAttribute("aria-modal", "true");
      inspector.classList.add("scope-inspector-drawer");
    } else {
      inspector.removeAttribute("role");
      inspector.removeAttribute("aria-modal");
      inspector.classList.remove("scope-inspector-drawer");
    }
  }

  function v061PatchProviderCopy(context: ReturnType<typeof v061Context>, main: HTMLElement): void {
    if (!context) return;
    for (const card of main.querySelectorAll<HTMLElement>(".scope-provider-card")) {
      const ref = card.querySelector<HTMLElement>("[data-v06-ref]")?.dataset.v06Ref ?? "";
      const item = context.map.get(ref);
      if (!item || !("family" in item)) continue;
      const object = item as ScopeObject;
      const terms = [...card.querySelectorAll<HTMLElement>("dt")];
      const providerTerm = terms.find(term => term.textContent?.trim() === "Provider");
      const providerValue = providerTerm?.nextElementSibling as HTMLElement | null;
      if (object.family === "provider") {
        if (providerTerm) providerTerm.remove();
        if (providerValue) providerValue.remove();
        const heading = card.querySelector<HTMLElement>("strong");
        if (heading && !heading.dataset.v061ProviderLabel) {
          heading.dataset.v061ProviderLabel = "true";
          heading.insertAdjacentHTML("afterend", `<small class="meta">Provider organization</small>`);
        }
      } else if (object.family === "service" && providerValue && !object.provider_ref && providerValue.textContent !== "Not assigned") {
        providerValue.textContent = "Not assigned";
      }
    }
  }

  function v061PatchUnknownDialog(context: ReturnType<typeof v061Context>, main: HTMLElement): void {
    if (!context || v06Dialog?.kind !== "unknown") return;
    const dialog = main.querySelector<HTMLElement>('.scope-modal[role="dialog"]');
    if (!dialog || dialog.dataset.v061UnknownVersions === "true") return;
    const unknown = context.projection.unknowns.find(item => item.id === v06Dialog?.id);
    if (!unknown) return;
    const terms = [...dialog.querySelectorAll<HTMLElement>("dt")];
    const affectedTerm = terms.find(term => term.textContent?.trim() === "Affected exact Scope records");
    const affectedValue = affectedTerm?.nextElementSibling as HTMLElement | null;
    if (affectedValue) {
      const refs = unknown.affected_refs.map(ref => {
        const item = context.map.get(ref);
        return item
          ? `<li><strong>${v06H(v06Label(item))}</strong> <span class="mono">${v06H(item.id)}</span> · version ${item.version}</li>`
          : `<li><span class="mono">${v06H(ref)}</span> · unavailable in this presentation projection</li>`;
      }).join("");
      affectedValue.innerHTML = refs ? `<ul>${refs}</ul>` : "None visible";
      affectedTerm?.insertAdjacentHTML("beforebegin", `<dt>Scope Unknown identity</dt><dd><span class="mono">${v06H(unknown.id)}</span> · version ${unknown.version}</dd>`);
    }
    const qualification = dialog.querySelector<HTMLElement>(".qualification");
    if (qualification) qualification.textContent = "Publishing creates one draft Session Planner question candidate carrying a bounded Scope source reference. It does not become Scope authority, add a live agenda item, or accept a client statement.";
    dialog.dataset.v061UnknownVersions = "true";
  }

  function v061PatchDecisionInspector(context: ReturnType<typeof v061Context>, main: HTMLElement): void {
    if (!context || !v06Selected) return;
    const decision = context.projection.decisions.find(item => item.id === v06Selected);
    const inspector = main.querySelector<HTMLElement>(".scope-inspector:not(.empty-inspector)");
    if (!decision || !inspector || inspector.querySelector("[data-v061-decision-versions]")) return;
    const comparison = compareScopeDecisionVersions(context.scope, decision.id);
    const rows = comparison.records.map(item => `<li><strong>${v06H(item.label)}</strong> <span class="mono">${v06H(item.id)}</span> · expected version ${item.expected_version} · current ${item.current_version ?? "missing"}${item.changed ? " · changed" : " · unchanged"}</li>`).join("");
    inspector.insertAdjacentHTML("beforeend", `<section data-v061-decision-versions><h3>Affected exact versions</h3><ul>${rows}</ul>${decision.currency_state === "stale" ? `<button data-v061-stale-compare="${v06H(decision.id)}">Compare and recover</button>` : ""}</section>`);
  }

  function v061PatchDecisionCards(context: ReturnType<typeof v061Context>, main: HTMLElement): void {
    if (!context) return;
    const profile = context.store.document.state.profile;
    for (const card of main.querySelectorAll<HTMLElement>(".scope-decision-card")) {
      const ref = card.querySelector<HTMLElement>(":scope > button[data-v06-ref]")?.dataset.v06Ref ?? "";
      const decision = context.projection.decisions.find(item => item.id === ref);
      if (!decision) continue;
      if (profile === "reviewer" && !isScopeDecisionReviewable(decision)) {
        card.querySelectorAll<HTMLElement>("[data-v06-review]").forEach(button => button.remove());
        const actions = card.querySelector<HTMLElement>(".scope-card-actions");
        if (actions && !actions.children.length) actions.remove();
      }
      if (profile === "advisor" && decision.currency_state === "stale" && !card.querySelector("[data-v061-stale-compare]")) {
        card.insertAdjacentHTML("beforeend", `<div class="scope-card-actions scope-stale-actions"><button data-v061-stale-compare="${v06H(decision.id)}">Compare versions</button><button data-v061-stale-create="${v06H(decision.id)}" class="primary">Create superseding draft</button></div>`);
      }
    }
  }

  function v061PatchSearchClear(main: HTMLElement): void {
    const toolbar = main.querySelector<HTMLElement>(".scope-toolbar");
    if (!toolbar || !v06Search || toolbar.querySelector("#v061-clear-search")) return;
    toolbar.insertAdjacentHTML("beforeend", `<button id="v061-clear-search" type="button">Clear search</button>`);
  }

  function v061PatchWorkspace(): void {
    const main = v061Workspace();
    if (!main?.querySelector('[data-scope-v061="ready"]')) return;
    const context = v061Context();
    v061PatchTabletInspector(main);
    v061PatchProviderCopy(context, main);
    v061PatchUnknownDialog(context, main);
    v061PatchDecisionInspector(context, main);
    v061PatchDecisionCards(context, main);
    v061PatchSearchClear(main);
    v061ScheduleFit();
  }

  function v061QueuePatch(): void {
    if (v061PatchQueued) return;
    v061PatchQueued = true;
    queueMicrotask(() => {
      v061PatchQueued = false;
      v061PatchWorkspace();
    });
  }

  function v061DiagramBounds(article: HTMLElement): { minX: number; minY: number; maxX: number; maxY: number } | null {
    const nodes = [...article.querySelectorAll<HTMLElement>(".scope-diagram-node")];
    if (!nodes.length) return null;
    const values = nodes.map(node => {
      const left = Number.parseFloat(node.style.left || "0");
      const top = Number.parseFloat(node.style.top || "0");
      const width = node.offsetWidth || Number.parseFloat(node.style.width || "180");
      const height = node.offsetHeight || 72;
      return { left, top, right: left + width, bottom: top + height };
    });
    return {
      minX: Math.min(...values.map(item => item.left)),
      minY: Math.min(...values.map(item => item.top)),
      maxX: Math.max(...values.map(item => item.right)),
      maxY: Math.max(...values.map(item => item.bottom))
    };
  }

  function v061CenterDiagram(id: string, bounds: { minX: number; minY: number; maxX: number; maxY: number }, zoom: number): void {
    const main = v061Workspace();
    const article = main?.querySelector<HTMLElement>(`[data-diagram-id="${CSS.escape(id)}"]`);
    const canvas = article?.querySelector<HTMLElement>(".scope-diagram-canvas");
    if (!canvas) return;
    canvas.scrollLeft = Math.max(0, ((bounds.minX + bounds.maxX) / 2) * zoom - canvas.clientWidth / 2);
    canvas.scrollTop = Math.max(0, ((bounds.minY + bounds.maxY) / 2) * zoom - canvas.clientHeight / 2);
  }

  function v061ApplyFit(id: string): void {
    const main = v061Workspace();
    const context = v061Context();
    if (!main || !context) return;
    const article = main.querySelector<HTMLElement>(`[data-diagram-id="${CSS.escape(id)}"]`);
    const canvas = article?.querySelector<HTMLElement>(".scope-diagram-canvas");
    if (!article || !canvas) return;
    const bounds = v061DiagramBounds(article);
    if (!bounds) return;
    const width = Math.max(1, bounds.maxX - bounds.minX);
    const height = Math.max(1, bounds.maxY - bounds.minY);
    const next = Math.max(0.25, Math.min(1.75, (canvas.clientWidth - 32) / width, (canvas.clientHeight - 32) / height));
    const current = v06DiagramZoom.get(id) ?? 1;
    if (Math.abs(current - next) > 0.01) {
      v06DiagramZoom.set(id, next);
      v06Render(main, context.store);
      requestAnimationFrame(() => v061CenterDiagram(id, bounds, next));
    } else {
      v061CenterDiagram(id, bounds, current);
    }
    v06Announcement = `Diagram fit calculated from visible bounds at ${Math.round(next * 100)} percent.`;
  }

  function v061ScheduleFit(): void {
    if (v061FitQueued || !v061FitDiagramIds.size) return;
    v061FitQueued = true;
    requestAnimationFrame(() => {
      v061FitQueued = false;
      for (const id of v061FitDiagramIds) v061ApplyFit(id);
    });
  }

  function v061OpenEdgePlaceholder(button: HTMLElement, label: string): void {
    document.getElementById("v061-edge-placeholder")?.remove();
    const panel = document.createElement("div");
    panel.id = "v061-edge-placeholder";
    panel.className = "notice";
    panel.tabIndex = -1;
    panel.setAttribute("role", "status");
    panel.textContent = `${label}. This is a non-authoritative proposal relationship and is not linked to a governed Scope flow or dependency.`;
    button.closest("li")?.append(panel);
    panel.focus();
  }

  function v061ActivateEdge(button: HTMLElement): void {
    const context = v061Context();
    const main = v061Workspace();
    if (!context || !main) return;
    const edgeId = button.dataset.v06Edge ?? "";
    const diagramId = button.closest<HTMLElement>("[data-diagram-id]")?.dataset.diagramId ?? "";
    const diagram = context.projection.diagrams.find(item => item.id === diagramId);
    const edge = diagram?.edge_records.find(item => item.edge_id === edgeId);
    if (!edge) return;
    if (edge.relationship_ref && context.map.has(edge.relationship_ref)) {
      v061InspectorReturnSelector = `[data-v06-edge="${CSS.escape(edgeId)}"]`;
      v06Selected = edge.relationship_ref;
      v06FocusSelector = "#scope-inspector-title";
      v06Announcement = `Opened visible governed relationship ${v06Label(context.map.get(edge.relationship_ref))}.`;
      v06Render(main, context.store);
      return;
    }
    v061OpenEdgePlaceholder(button, edge.proposal_label || "Proposal relationship");
  }

  function v061CloseStaleDialog(): void {
    const dialog = document.getElementById("v061-stale-dialog");
    if (!dialog) return;
    dialog.remove();
    const main = v061Workspace();
    const target = main?.querySelector<HTMLElement>(v061InspectorReturnSelector) ?? main?.querySelector<HTMLElement>("#scope-title");
    target?.focus();
  }

  function v061OpenStaleDialog(id: string): void {
    const context = v061Context();
    const main = v061Workspace();
    if (!context || !main) return;
    document.getElementById("v061-stale-dialog")?.remove();
    const decision = context.projection.decisions.find(item => item.id === id);
    if (!decision) return;
    const comparison = compareScopeDecisionVersions(context.scope, id);
    const rows = comparison.records.map(item => `<tr><th scope="row">${v06H(item.label)}<br><span class="mono">${v06H(item.id)}</span></th><td>${item.expected_version}</td><td>${item.current_version ?? "Missing"}</td><td>${item.changed ? "Changed" : "Unchanged"}</td></tr>`).join("");
    const overlay = document.createElement("div");
    overlay.id = "v061-stale-dialog";
    overlay.className = "scope-modal-backdrop";
    overlay.innerHTML = `<section class="scope-modal scope-effect-review" role="dialog" aria-modal="true" aria-labelledby="v061-stale-title"><div class="scope-inspector-heading"><div><h2 id="v061-stale-title" tabindex="-1">Compare stale decision versions</h2><p>${v06H(decision.label)} · decision version ${decision.version}</p></div><button data-v061-close-stale aria-label="Close stale decision comparison">×</button></div><p>The preserved decision references historical exact versions. Current records are shown for comparison; no governed object changes until a new decision is separately reviewed and accepted.</p><div class="scope-table-scroll"><table><thead><tr><th>Record</th><th>Expected</th><th>Current</th><th>Drift</th></tr></thead><tbody>${rows}</tbody></table></div><section><h3>Proposed recovery</h3><p>Create a linked superseding draft using current exact record versions. Prior rationale and source basis are copied only as proposed context and must be reviewed again.</p></section><div class="scope-card-actions"><button data-v061-close-stale>Cancel</button><button class="primary" data-v061-stale-create="${v06H(id)}">Create superseding draft</button></div></section>`;
    main.querySelector(".scope-workbench")?.append(overlay);
    overlay.querySelector<HTMLElement>("#v061-stale-title")?.focus();
  }

  function v061CreateSupersedingDraft(id: string): void {
    const context = v061Context();
    const main = v061Workspace();
    if (!context || !main) return;
    let nextId = "";
    context.store.execute("scope.decision.superseding-draft-created", "scope_decision", id, "Created a current-version superseding Scope decision draft while preserving the stale prior decision.", document => {
      nextId = createSupersedingScopeDecisionDraft(v06Scope(document), id, document.state.profile).id;
    }, "Created superseding Scope decision draft");
    v061CloseStaleDialog();
    v06Tab = "decisions";
    v06Selected = nextId;
    v06Dialog = { kind: "decision", id: nextId };
    v06FocusSelector = "#v06-dialog-title";
    v06Announcement = "Superseding decision draft created from current exact versions. The preserved prior decision remains historical and no governed object changed.";
    v06Render(main, context.store);
  }

  document.addEventListener("input", event => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.id !== "v06-search") return;
    event.stopImmediatePropagation();
    const main = v061Workspace();
    const hooks = v06Hooks();
    if (!main || !hooks) return;
    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? start;
    v06Search = target.value;
    v06FocusSelector = "#v06-search";
    v06Render(main, hooks.store);
    queueMicrotask(() => {
      const next = main.querySelector<HTMLInputElement>("#v06-search");
      next?.focus();
      next?.setSelectionRange(Math.min(start, next.value.length), Math.min(end, next.value.length));
    });
  }, true);

  document.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const main = v061Workspace();
    const hooks = v06Hooks();
    if (!main || !hooks) return;

    const closeInspector = target.closest("#v06-close");
    if (closeInspector) {
      event.preventDefault();
      event.stopImmediatePropagation();
      v061CloseInspector(main, hooks.store);
      return;
    }
    const closeStale = target.closest("[data-v061-close-stale]");
    if (closeStale) {
      event.preventDefault();
      event.stopImmediatePropagation();
      v061CloseStaleDialog();
      return;
    }
    const clearSearch = target.closest("#v061-clear-search");
    if (clearSearch) {
      event.preventDefault();
      event.stopImmediatePropagation();
      v06Search = "";
      v06FocusSelector = "#v06-search";
      v06Render(main, hooks.store);
      return;
    }
    const staleCompare = target.closest<HTMLElement>("[data-v061-stale-compare]");
    if (staleCompare) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const id = staleCompare.dataset.v061StaleCompare ?? "";
      v061InspectorReturnSelector = `[data-v061-stale-compare="${CSS.escape(id)}"]`;
      v061OpenStaleDialog(id);
      return;
    }
    const staleCreate = target.closest<HTMLElement>("[data-v061-stale-create]");
    if (staleCreate) {
      event.preventDefault();
      event.stopImmediatePropagation();
      v061CreateSupersedingDraft(staleCreate.dataset.v061StaleCreate ?? "");
      return;
    }
    const edgeButton = target.closest<HTMLElement>("[data-v06-edge]");
    if (edgeButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      v061ActivateEdge(edgeButton);
      return;
    }
    const diagramControl = target.closest<HTMLElement>("[data-v06-diagram-control]");
    if (diagramControl) {
      const id = diagramControl.dataset.v06Diagram ?? "";
      if (diagramControl.dataset.v06DiagramControl === "fit") {
        event.preventDefault();
        event.stopImmediatePropagation();
        v061FitDiagramIds.add(id);
        v061ApplyFit(id);
        return;
      }
      v061FitDiagramIds.delete(id);
    }
    const refButton = target.closest<HTMLElement>("[data-v06-ref]");
    if (refButton && !refButton.closest(".scope-inspector")) {
      const ref = refButton.dataset.v06Ref ?? "";
      if (ref) v061InspectorReturnSelector = v061SelectorForRef(ref);
    }
  }, true);

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    if (document.getElementById("v061-stale-dialog")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      v061CloseStaleDialog();
      return;
    }
    if (v06Dialog || v06Preview || !v06Selected) return;
    const main = v061Workspace();
    const hooks = v06Hooks();
    if (!main || !hooks) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    v061CloseInspector(main, hooks.store);
  }, true);

  window.addEventListener("resize", () => {
    v061QueuePatch();
    v061ScheduleFit();
  });

  const v061ClosureObserver = new MutationObserver(() => v061QueuePatch());
  const v061ClosureRoot = document.getElementById("app");
  if (v061ClosureRoot) v061ClosureObserver.observe(v061ClosureRoot, { childList: true, subtree: true });
  v061QueuePatch();
}
