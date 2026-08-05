namespace L2G {
  interface V061DiagramFixedHooks { store: ProjectStore; }

  let v061DiagramFixedQueued = false;
  let v061DiagramFixedDialog: HTMLDialogElement | null = null;

  function v061DiagramFixedHooks(): V061DiagramFixedHooks | null {
    return ((window as unknown as { __L2G_TEST__?: V061DiagramFixedHooks }).__L2G_TEST__) ?? null;
  }

  function v061DiagramFixedEscape(value: unknown): string {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]!));
  }

  function v061DiagramFixedLabel(record: ScopeRecordBase | undefined): string {
    if (!record) return "Unknown or omitted record";
    if ("client_label" in record) {
      const value = String((record as unknown as { client_label: string }).client_label || "").trim();
      if (value) return value;
    }
    return record.label;
  }

  export function supersedeScopeDiagramRepresentation(scope: ScopeDomain, id: string, profile: PresentationProfile): ScopeDiagram {
    const prior = scope.diagrams.find(item => item.id === id);
    if (!prior) throw new Error("Scope diagram not found.");
    if (prior.lifecycle === "superseded" || prior.diagram_review_state === "superseded") throw new Error("This Scope diagram representation is already superseded.");
    const map = scopeRecordMap(scope);
    const timestamp = nowIso();
    const included = prior.included_record_refs.map(ref => {
      const record = map.get(ref.id);
      if (!record) throw new Error(`Cannot refresh a diagram with a missing governed record: ${ref.id}.`);
      return { id: record.id, version: record.version };
    });
    const nodes = prior.node_records.map(node => {
      if (!node.record_ref) return deepClone(node);
      const record = map.get(node.record_ref.id);
      if (!record) throw new Error(`Cannot refresh a diagram with a missing governed node record: ${node.record_ref.id}.`);
      return { ...deepClone(node), record_ref: { id: record.id, version: record.version } };
    });
    const nextLabel = `Refreshed draft of ${prior.label}`;
    const labels = nodes.map(node => node.record_ref ? v061DiagramFixedLabel(map.get(node.record_ref.id)) : (node.proposal_label || "Unresolved proposal"));
    const next: ScopeDiagram = {
      ...deepClone(prior),
      id: newId("scope-diagram"),
      version: 1,
      label: nextLabel,
      lifecycle: "draft",
      operational_state: "not-started",
      review_state: "not-reviewed",
      currency_state: "current",
      created_at: timestamp,
      updated_at: timestamp,
      created_by_profile: profile,
      updated_by_profile: profile,
      supersedes_id: prior.id,
      superseded_by_id: null,
      provenance: {
        origin_kind: "scope-local",
        source_refs: [{ id: prior.id, version: prior.version }],
        source_label: `Refreshed from preserved diagram representation ${prior.id} version ${prior.version}.`,
        asserted_at: timestamp,
        asserted_by: profile
      },
      included_record_refs: included,
      node_records: nodes,
      edge_records: deepClone(prior.edge_records),
      text_alternative: `${nextLabel}. Includes ${labels.join(", ")}. ${prior.edge_records.length} recorded relationship${prior.edge_records.length === 1 ? "" : "s"}.`,
      diagram_review_state: "draft",
      approval_decision_ref: null,
      stale_ref_diagnostics: []
    };
    prior.lifecycle = "superseded";
    prior.diagram_review_state = "superseded";
    prior.currency_state = "superseded";
    prior.superseded_by_id = next.id;
    prior.updated_at = timestamp;
    prior.updated_by_profile = profile;
    prior.version++;
    scope.diagrams.push(next);
    scope.updated_at = timestamp;
    scope.revision++;
    validateScopeDomain(scope);
    return next;
  }

  function v061DiagramFixedClose(origin?: HTMLElement | null): void {
    const dialog = v061DiagramFixedDialog;
    if (!dialog) return;
    v061DiagramFixedDialog = null;
    if (dialog.open) dialog.close();
    dialog.remove();
    queueMicrotask(() => origin?.focus());
  }

  function v061DiagramFixedOpenRefresh(id: string, origin: HTMLElement): void {
    const hooks = v061DiagramFixedHooks();
    const scope = hooks?.store.document.state.scope;
    const diagram = scope?.diagrams.find(item => item.id === id);
    if (!hooks || !scope || !diagram) throw new Error("Scope diagram not found.");
    v061DiagramFixedClose();
    const diagnostics = diagram.stale_ref_diagnostics.length
      ? diagram.stale_ref_diagnostics.map(item => `<li>${v061DiagramFixedEscape(item)}</li>`).join("")
      : "<li>No stale exact-reference diagnostic is currently recorded. The prior representation will still be preserved.</li>";
    const dialog = document.createElement("dialog");
    dialog.className = "scope-import-dialog v061-diagram-dialog";
    dialog.setAttribute("aria-labelledby", "v061-diagram-refresh-title");
    dialog.innerHTML = `<form method="dialog"><div class="scope-inspector-heading"><div><h2 id="v061-diagram-refresh-title">Create refreshed diagram draft</h2><p>${v061DiagramFixedEscape(diagram.label)} · ${v061DiagramFixedEscape(diagram.id)} · version ${diagram.version}</p></div><button value="cancel" data-v061-close aria-label="Close diagram refresh review">×</button></div><div class="notice">This diagram represents governed records at exact versions. The prior representation remains preserved. Creating a refreshed draft changes no Scope object, decision, category, disposition, responsibility, implementation, or assessment conclusion.</div><h3>Changed or reviewed exact references</h3><ul>${diagnostics}</ul><h3>Atomic effect</h3><ul><li>Preserve the current representation and exact refs.</li><li>Mark the prior representation superseded with a reciprocal link.</li><li>Create one new Draft representation using current exact record versions.</li><li>Do not carry forward representation approval.</li></ul><div class="scope-card-actions"><button type="button" data-v061-cancel>Cancel</button><button type="button" class="primary" data-v061-create>Preserve prior and create refreshed draft</button></div><p data-v061-error class="notice warning" hidden></p></form>`;
    document.body.append(dialog);
    v061DiagramFixedDialog = dialog;
    dialog.addEventListener("cancel", event => { event.preventDefault(); v061DiagramFixedClose(origin); });
    dialog.querySelector("[data-v061-close]")?.addEventListener("click", event => { event.preventDefault(); v061DiagramFixedClose(origin); });
    dialog.querySelector("[data-v061-cancel]")?.addEventListener("click", () => v061DiagramFixedClose(origin));
    dialog.querySelector("[data-v061-create]")?.addEventListener("click", () => {
      const error = dialog.querySelector<HTMLElement>("[data-v061-error]");
      try {
        hooks.store.execute("scope.diagram.superseding-draft-created", "scope_diagram", id, "Preserved a prior Scope diagram representation and created a refreshed exact-version draft.", documentValue => {
          const targetScope = documentValue.state.scope;
          if (!targetScope) throw new Error("Scope domain is missing.");
          supersedeScopeDiagramRepresentation(targetScope, id, documentValue.state.profile);
        }, "Created superseding Scope diagram draft");
        v061DiagramFixedClose(origin);
      } catch (caught) {
        if (error) { error.hidden = false; error.textContent = errorMessage(caught); }
      }
    });
    dialog.showModal();
    queueMicrotask(() => dialog.querySelector<HTMLElement>("button")?.focus());
  }

  function v061DiagramFixedProjectionMap(projection: ScopeProjection): Map<string, ScopeRecordBase> {
    const map = new Map<string, ScopeRecordBase>();
    const collections: ScopeRecordBase[][] = [projection.boundaries, projection.systems, projection.assets, projection.providers, projection.services, projection.locations, projection.enclaves, projection.data_flows, projection.unknowns, projection.decisions, projection.diagrams];
    for (const collection of collections) for (const record of collection) map.set(record.id, record);
    return map;
  }

  function v061DiagramFixedSetZoom(card: HTMLElement, value: number): void {
    const canvas = card.querySelector<HTMLElement>(".scope-diagram-canvas");
    if (!canvas) return;
    const bounded = Math.min(1.5, Math.max(0.5, value));
    canvas.dataset.v061Zoom = String(bounded);
    canvas.style.zoom = String(bounded);
    const status = card.querySelector<HTMLElement>("[data-v061-zoom-status]");
    if (status) status.textContent = `${Math.round(bounded * 100)}%`;
  }

  function v061DiagramFixedEnhance(): void {
    const hooks = v061DiagramFixedHooks();
    const scope = hooks?.store.document.state.scope;
    if (!hooks || !scope || hooks.store.document.state.active_workspace !== "scope") return;
    const projection = buildScopeProjection(scope, hooks.store.document.state.profile);
    const records = v061DiagramFixedProjectionMap(projection);
    document.querySelectorAll<HTMLElement>(".scope-diagram-card").forEach(card => {
      const diagramId = card.querySelector<HTMLElement>(".scope-diagram-heading [data-v06-ref]")?.dataset.v06Ref ?? "";
      const diagram = projection.diagrams.find(item => item.id === diagramId);
      if (!diagram) return;
      if (!card.querySelector(".v061-diagram-controls")) {
        const controls = document.createElement("div");
        controls.className = "scope-card-actions v061-diagram-controls";
        controls.setAttribute("aria-label", "Diagram presentation controls");
        controls.innerHTML = `<button type="button" data-v061-zoom="fit">Fit</button><button type="button" data-v061-zoom="1">100%</button><button type="button" data-v061-zoom="out">Zoom out</button><button type="button" data-v061-zoom="in">Zoom in</button><button type="button" data-v061-center>Center selection</button><span data-v061-zoom-status role="status">100%</span>`;
        card.querySelector(".scope-diagram-canvas")?.before(controls);
      }
      if (card.querySelector(".v061-diagram-equivalent")) return;
      const equivalent = document.createElement("details");
      equivalent.className = "v061-diagram-equivalent";
      const nodeById = new Map(diagram.node_records.map(node => [node.node_id, node]));
      const nodes = diagram.node_records.filter(node => !node.record_ref || records.has(node.record_ref.id)).map(node => {
        const record = node.record_ref ? records.get(node.record_ref.id) : undefined;
        return `<li><button type="button" data-v061-node-ref="${v061DiagramFixedEscape(node.record_ref?.id ?? "")}" ${node.record_ref ? "" : "disabled"}>${v061DiagramFixedEscape(v061DiagramFixedLabel(record) || node.proposal_label)}</button>${node.record_ref ? ` · <code>${v061DiagramFixedEscape(node.record_ref.id)}</code> v${node.record_ref.version}` : " · unresolved proposal"}</li>`;
      }).join("");
      const relationships = diagram.edge_records.filter(edge => {
        const from = nodeById.get(edge.from_node_id), to = nodeById.get(edge.to_node_id);
        return Boolean(from && to && (!from.record_ref || records.has(from.record_ref.id)) && (!to.record_ref || records.has(to.record_ref.id)) && (!edge.relationship_ref || records.has(edge.relationship_ref)));
      }).map(edge => {
        const from = nodeById.get(edge.from_node_id), to = nodeById.get(edge.to_node_id);
        const fromLabel = from?.record_ref ? v061DiagramFixedLabel(records.get(from.record_ref.id)) : from?.proposal_label;
        const toLabel = to?.record_ref ? v061DiagramFixedLabel(records.get(to.record_ref.id)) : to?.proposal_label;
        const relationship = edge.relationship_ref ? records.get(edge.relationship_ref) : undefined;
        return `<li><button type="button" data-v061-edge-ref="${v061DiagramFixedEscape(edge.relationship_ref ?? "")}" ${edge.relationship_ref ? "" : "disabled"}>${v061DiagramFixedEscape(fromLabel)} → ${v061DiagramFixedEscape(toLabel)}</button>${relationship ? ` · ${v061DiagramFixedEscape(relationship.label)} · <code>${v061DiagramFixedEscape(relationship.id)}</code> v${relationship.version}` : " · presentation relationship"}</li>`;
      }).join("");
      equivalent.innerHTML = `<summary>Nodes and relationships</summary><h4>Nodes</h4><ol>${nodes || "<li>No visible nodes.</li>"}</ol><h4>Relationships</h4><ol>${relationships || "<li>No visible relationships.</li>"}</ol><p class="muted">Layout and zoom controls change presentation only and do not alter Scope authority.</p>`;
      card.querySelector("details")?.before(equivalent);
    });
  }

  function v061DiagramFixedQueue(): void {
    if (v061DiagramFixedQueued) return;
    v061DiagramFixedQueued = true;
    queueMicrotask(() => {
      v061DiagramFixedQueued = false;
      v061DiagramFixedEnhance();
    });
  }

  document.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const refresh = target.closest<HTMLElement>("[data-v06-refresh-diagram]");
    if (refresh) {
      event.preventDefault();
      event.stopImmediatePropagation();
      v061DiagramFixedOpenRefresh(refresh.dataset.v06RefreshDiagram ?? "", refresh);
      return;
    }
    const zoom = target.closest<HTMLButtonElement>("[data-v061-zoom]");
    if (zoom) {
      const card = zoom.closest<HTMLElement>(".scope-diagram-card");
      if (!card) return;
      const current = Number(card.querySelector<HTMLElement>(".scope-diagram-canvas")?.dataset.v061Zoom ?? "1") || 1;
      const command = zoom.dataset.v061Zoom;
      v061DiagramFixedSetZoom(card, command === "fit" ? 0.75 : command === "in" ? current + 0.1 : command === "out" ? current - 0.1 : Number(command));
      return;
    }
    const center = target.closest<HTMLElement>("[data-v061-center]");
    if (center) {
      center.closest<HTMLElement>(".scope-diagram-card")?.querySelector<HTMLElement>(".scope-diagram-node:focus, .scope-diagram-node")?.scrollIntoView({ block: "center", inline: "center" });
      return;
    }
    const nodeButton = target.closest<HTMLElement>("[data-v061-node-ref]");
    const nodeRef = nodeButton?.dataset.v061NodeRef;
    if (nodeButton && nodeRef) {
      nodeButton.closest<HTMLElement>(".scope-diagram-card")?.querySelector<HTMLButtonElement>(`.scope-diagram-node[data-v06-ref="${CSS.escape(nodeRef)}"]`)?.click();
      return;
    }
    const edgeButton = target.closest<HTMLElement>("[data-v061-edge-ref]");
    const edgeRef = edgeButton?.dataset.v061EdgeRef;
    if (edgeButton && edgeRef) {
      document.querySelector<HTMLButtonElement>('[data-v06-tab="flows"]')?.click();
      queueMicrotask(() => document.querySelector<HTMLButtonElement>(`[data-v06-ref="${CSS.escape(edgeRef)}"]`)?.click());
    }
  }, true);

  const v061DiagramFixedRoot = document.getElementById("app");
  if (v061DiagramFixedRoot) new MutationObserver(v061DiagramFixedQueue).observe(v061DiagramFixedRoot, { childList: true, subtree: true });
  v061DiagramFixedQueue();
}
