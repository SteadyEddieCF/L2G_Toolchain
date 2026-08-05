namespace L2G {
  interface V061DiagramHooks { store: ProjectStore; }

  let v061DiagramEnhanceQueued = false;
  let v061DiagramDialog: HTMLDialogElement | null = null;

  function v061DiagramHooks(): V061DiagramHooks | null {
    return ((window as unknown as { __L2G_TEST__?: V061DiagramHooks }).__L2G_TEST__) ?? null;
  }

  function v061DiagramEscape(value: unknown): string {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]!));
  }

  function v061DiagramPresentationLabel(record: ScopeRecordBase | undefined): string {
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
    const currentRefs = prior.included_record_refs.map(ref => {
      const record = map.get(ref.id);
      if (!record) throw new Error(`Cannot refresh a diagram with a missing governed record: ${ref.id}.`);
      return { id: ref.id, version: record.version };
    });
    const nodes = prior.node_records.map(node => {
      if (!node.record_ref) return deepClone(node);
      const record = map.get(node.record_ref.id);
      if (!record) throw new Error(`Cannot refresh a diagram with a missing governed node record: ${node.record_ref.id}.`);
      return { ...deepClone(node), record_ref: { id: record.id, version: record.version } };
    });
    const visibleLabels = nodes.map(node => node.record_ref ? v061DiagramPresentationLabel(map.get(node.record_ref.id)) : (node.proposal_label || "Unresolved proposal"));
    const next: ScopeDiagram = {
      ...deepClone(prior),
      id: newId("scope-diagram"),
      version: 1,
      label: `Refreshed draft of ${prior.label}`,
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
      included_record_refs: currentRefs,
      node_records: nodes,
      edge_records: deepClone(prior.edge_records),
      text_alternative: `${`Refreshed draft of ${prior.label}`}. Includes ${visibleLabels.join(", ")}. ${prior.edge_records.length} recorded relationship${prior.edge_records.length === 1 ? "" : "s"}.`,
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

  function v061CloseDiagramDialog(origin?: HTMLElement | null): void {
    if (!v061DiagramDialog) return;
    const dialog = v061DiagramDialog;
    v061DiagramDialog = null;
    if (dialog.open) dialog.close();
    dialog.remove();
    queueMicrotask(() => origin?.focus());
  }

  function v061OpenDiagramRefresh(id: string, origin: HTMLElement): void {
    const hooks = v061DiagramHooks();
    if (!hooks) return;
    const scope = hooks.store.document.state.scope;
    const diagram = scope?.diagrams.find(item => item.id === id);
    if (!scope || !diagram) throw new Error("Scope diagram not found.");
    const diagnostics = diagram.stale_ref_diagnostics.length
      ? diagram.stale_ref_diagnostics.map(item => `<li>${v061DiagramEscape(item)}</li>`).join("")
      : `<li>No stale exact-reference diagnostic is currently recorded. A refreshed draft will still preserve this representation.</li>`;
    const dialogElement = document.createElement("dialog");
    dialogElement.className = "scope-import-dialog v061-diagram-dialog";
    dialogElement.setAttribute("aria-labelledby", "v061-diagram-refresh-title");
    dialogElement.innerHTML = `<form method="dialog"><div class="scope-inspector-heading"><div><h2 id="v061-diagram-refresh-title">Create refreshed diagram draft</h2><p>${v061DiagramEscape(diagram.label)} · ${v061DiagramEscape(diagram.id)} · version ${diagram.version}</p></div><button value="cancel" data-v061-close aria-label="Close diagram refresh review">×</button></div><div class="notice">This diagram represents governed records at exact versions. The prior representation remains preserved. Creating a refreshed draft changes no Scope object, decision, category, disposition, responsibility, implementation, or assessment conclusion.</div><h3>Changed or reviewed exact references</h3><ul>${diagnostics}</ul><h3>Atomic effect</h3><ul><li>Preserve the current representation and exact refs.</li><li>Mark the prior representation superseded with a reciprocal link.</li><li>Create one new Draft representation using current exact record versions.</li><li>Do not carry forward representation approval.</li></ul><div class="scope-card-actions"><button type="button" data-v061-cancel>Cancel</button><button type="button" class="primary" data-v061-create>Preserve prior and create refreshed draft</button></div><p data-v061-error class="notice warning" hidden></p></form>`;
    document.body.append(dialogElement);
    v061DiagramDialog = dialogElement;
    dialogElement.addEventListener("cancel", event => { event.preventDefault(); v061CloseDiagramDialog(origin); });
    dialogElement.querySelector("[data-v061-close]")?.addEventListener("click", event => { event.preventDefault(); v061CloseDiagramDialog(origin); });
    dialogElement.querySelector("[data-v061-cancel]")?.addEventListener("click", () => v061CloseDiagramDialog(origin));
    dialogElement.querySelector("[data-v061-create]")?.addEventListener("click", () => {
      const error = dialogElement.querySelector<HTMLElement>("[data-v061-error]");
      try {
        hooks.store.execute("scope.diagram.superseding-draft-created", "scope_diagram", id, "Preserved a prior Scope diagram representation and created a refreshed exact-version draft.", documentValue => {
          const targetScope = documentValue.state.scope;
          if (!targetScope) throw new Error("Scope domain is missing.");
          supersedeScopeDiagramRepresentation(targetScope, id, documentValue.state.profile);
        }, "Created superseding Scope diagram draft");
        v061CloseDiagramDialog(origin);
      } catch (caught) {
        if (error) { error.hidden = false; error.textContent = errorMessage(caught); }
      }
    });
    dialogElement.showModal();
    queueMicrotask(() => dialogElement.querySelector<HTMLElement>("button")?.focus());
  }

  function v061ProjectionRecordMap(projection: ScopeProjection): Map<string, ScopeRecordBase> {
    const map = new Map<string, ScopeRecordBase>();
    for (const collection of [projection.boundaries, projection.systems, projection.assets, projection.providers, projection.services, projection.locations, projection.enclaves, projection.data_flows, projection.unknowns, projection.decisions, projection.diagrams] as ScopeRecordBase[][]) {
      for (const record of collection) map.set(record.id, record);
    }
    return map;
  }

  function v061SetDiagramZoom(card: HTMLElement, value: number): void {
    const canvas = card.querySelector<HTMLElement>(".scope-diagram-canvas");
    if (!canvas) return;
    const bounded = Math.min(1.5, Math.max(0.5, value));
    canvas.dataset.v061Zoom = String(bounded);
    canvas.style.zoom = String(bounded);
    const status = card.querySelector<HTMLElement>("[data-v061-zoom-status]");
    if (status) status.textContent = `${Math.round(bounded * 100)}%`;
  }

  function v061EnhanceDiagramCards(): void {
    const hooks = v061DiagramHooks();
    if (!hooks || hooks.store.document.state.active_workspace !== "scope") return;
    const scope = hooks.store.document.state.scope;
    if (!scope) return;
    const projection = buildScopeProjection(scope, hooks.store.document.state.profile);
    const records = v061ProjectionRecordMap(projection);
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
      if (!card.querySelector(".v061-diagram-equivalent")) {
        const equivalent = document.createElement("details");
        equivalent.className = "v061-diagram-equivalent";
        const nodeById = new Map(diagram.node_records.map(node => [node.node_id, node]));
        const nodes = diagram.node_records.filter(node => !node.record_ref || records.has(node.record_ref.id)).map(node => {
          const record = node.record_ref ? records.get(node.record_ref.id) : undefined;
          return `<li><button type="button" data-v061-node-ref="${v061DiagramEscape(node.record_ref?.id ?? "")}" ${node.record_ref ? "" : "disabled"}>${v061DiagramEscape(v061DiagramPresentationLabel(record) || node.proposal_label)}</button>${node.record_ref ? ` · <code>${v061DiagramEscape(node.record_ref.id)}</code> v${node.record_ref.version}` : " · unresolved proposal"}</li>`;
        }).join("");
        const relationships = diagram.edge_records.filter(edge => {
          const from = nodeById.get(edge.from_node_id), to = nodeById.get(edge.to_node_id);
          return Boolean(from && to && (!from.record_ref || records.has(from.record_ref.id)) && (!to.record_ref || records.has(to.record_ref.id)) && (!edge.relationship_ref || records.has(edge.relationship_ref)));
        }).map(edge => {
          const from = nodeById.get(edge.from_node_id), to = nodeById.get(edge.to_node_id);
          const fromLabel = from?.record_ref ? v061DiagramPresentationLabel(records.get(from.record_ref.id)) : from?.proposal_label;
          const toLabel = to?.record_ref ? v061DiagramPresentationLabel(records.get(to.record_ref.id)) : to?.proposal_label;
          const relationship = edge.relationship_ref ? records.get(edge.relationship_ref) : undefined;
          return `<li><button type="button" data-v061-edge-ref="${v061DiagramEscape(edge.relationship_ref ?? "")}" ${edge.relationship_ref ? "" : "disabled"}>${v061DiagramEscape(fromLabel)} → ${v061DiagramEscape(toLabel)}</button>${relationship ? ` · ${v061DiagramEscape(relationship.label)} · <code>${v061DiagramEscape(relationship.id)}</code> v${relationship.version}` : " · presentation relationship"}</li>`;
        }).join("");
        equivalent.innerHTML = `<summary>Nodes and relationships</summary><h4>Nodes</h4><ol>${nodes || "<li>No visible nodes.</li>"}</ol><h4>Relationships</h4><ol>${relationships || "<li>No visible relationships.</li>"}</ol><p class="muted">Layout and zoom controls change presentation only and do not alter Scope authority.</p>`;
        card.querySelector("details")?.before(equivalent);
      }
    });
  }

  function v061QueueDiagramEnhance(): void {
    if (v061DiagramEnhanceQueued) return;
    v061DiagramEnhanceQueued = true;
    queueMicrotask(() => {
      v061DiagramEnhanceQueued = false;
      v061EnhanceDiagramCards();
    });
  }

  document.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const refresh = target.closest<HTMLElement>("[data-v06-refresh-diagram]");
    if (refresh) {
      event.preventDefault();
      event.stopImmediatePropagation();
      v061OpenDiagramRefresh(refresh.dataset.v06RefreshDiagram ?? "", refresh);
      return;
    }
    const zoom = target.closest<HTMLButtonElement>("[data-v061-zoom]");
    if (zoom) {
      const card = zoom.closest<HTMLElement>(".scope-diagram-card");
      if (!card) return;
      const canvas = card.querySelector<HTMLElement>(".scope-diagram-canvas");
      const current = Number(canvas?.dataset.v061Zoom ?? "1") || 1;
      const command = zoom.dataset.v061Zoom;
      v061SetDiagramZoom(card, command === "fit" ? 0.75 : command === "in" ? current + 0.1 : command === "out" ? current - 0.1 : Number(command));
      return;
    }
    const center = target.closest<HTMLElement>("[data-v061-center]");
    if (center) {
      center.closest<HTMLElement>(".scope-diagram-card")?.querySelector<HTMLElement>(".scope-diagram-node:focus, .scope-diagram-node")?.scrollIntoView({ block: "center", inline: "center" });
      return;
    }
    const node = target.closest<HTMLElement>("[data-v061-node-ref]");
    if (node?.dataset.v061NodeRef) {
      node.closest<HTMLElement>(".scope-diagram-card")?.querySelector<HTMLButtonElement>(`.scope-diagram-node[data-v06-ref="${CSS.escape(node.dataset.v061NodeRef)}"]`)?.click();
      return;
    }
    const edge = target.closest<HTMLElement>("[data-v061-edge-ref]");
    if (edge?.dataset.v061EdgeRef) {
      document.querySelector<HTMLButtonElement>('[data-v06-tab="flows"]')?.click();
      queueMicrotask(() => document.querySelector<HTMLButtonElement>(`[data-v06-ref="${CSS.escape(edge.dataset.v061EdgeRef)}"]`)?.click());
    }
  }, true);

  const v061DiagramRoot = document.getElementById("app");
  if (v061DiagramRoot) new MutationObserver(v061QueueDiagramEnhance).observe(v061DiagramRoot, { childList: true, subtree: true });
  v061QueueDiagramEnhance();
}
