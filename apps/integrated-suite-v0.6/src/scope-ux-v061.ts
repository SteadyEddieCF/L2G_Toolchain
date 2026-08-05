namespace L2G {
  interface V061ScopeHooks { store: ProjectStore; }

  let v061SanitizeQueued = false;
  let v061LastProfile: PresentationProfile | null = null;

  function v061Hooks(): V061ScopeHooks | null {
    return ((window as unknown as { __L2G_TEST__?: V061ScopeHooks }).__L2G_TEST__) ?? null;
  }

  function v061VisibleRecordMap(projection: ScopeProjection): Map<string, ScopeRecordBase> {
    const map = new Map<string, ScopeRecordBase>();
    const collections: ScopeRecordBase[][] = [
      projection.boundaries,
      projection.systems,
      projection.assets,
      projection.providers,
      projection.services,
      projection.locations,
      projection.enclaves,
      projection.data_flows,
      projection.assumptions,
      projection.unknowns,
      projection.dependencies,
      projection.decisions,
      projection.candidates,
      projection.diagrams
    ];
    for (const collection of collections) for (const record of collection) map.set(record.id, record);
    return map;
  }

  function v061PresentationLabel(record: ScopeRecordBase): string {
    if ("client_label" in record) {
      const clientLabel = String((record as unknown as { client_label: string }).client_label || "").trim();
      if (clientLabel) return clientLabel;
    }
    return record.label;
  }

  function v061SafeDiagramModel(
    diagram: ScopeDiagram,
    records: Map<string, ScopeRecordBase>
  ): { nodeIds: Set<string>; edgeCount: number; text: string } {
    const visibleNodes = diagram.node_records.filter(node => !node.record_ref || records.has(node.record_ref.id));
    const nodeIds = new Set(visibleNodes.map(node => node.node_id));
    const visibleEdges = diagram.edge_records.filter(edge =>
      nodeIds.has(edge.from_node_id) &&
      nodeIds.has(edge.to_node_id) &&
      (!edge.relationship_ref || records.has(edge.relationship_ref))
    );
    const labels = visibleNodes.map(node => {
      if (!node.record_ref) return node.proposal_label || "Unresolved proposal";
      const record = records.get(node.record_ref.id);
      return record ? v061PresentationLabel(record) : "Omitted record";
    });
    const text = `${diagram.label}. Includes ${labels.length ? labels.join(", ") : "no records approved for this presentation"}. ${visibleEdges.length} visible recorded relationship${visibleEdges.length === 1 ? "" : "s"}. This representation contains only records approved for this presentation profile; omitted internal records and relationships are not shown or counted.`;
    return { nodeIds, edgeCount: visibleEdges.length, text };
  }

  function v061SelectedInspectorId(): string {
    const identity = document.querySelector<HTMLElement>(".scope-inspector-heading p")?.textContent ?? "";
    return identity.split(" · ")[0]?.trim() ?? "";
  }

  function v061SanitizeScopePresentation(): void {
    const hooks = v061Hooks();
    if (!hooks || hooks.store.document.state.active_workspace !== "scope") return;
    const profile = hooks.store.document.state.profile;
    const scope = hooks.store.document.state.scope;
    if (!scope) return;

    if (v061LastProfile !== null && v061LastProfile !== profile) {
      document.querySelector<HTMLButtonElement>("#v06-close")?.click();
      document.querySelector<HTMLButtonElement>("#v06-close-import")?.click();
      queueMicrotask(() => {
        const heading = document.querySelector<HTMLElement>("#scope-title");
        if (heading) {
          heading.tabIndex = -1;
          heading.focus();
        }
      });
    }
    v061LastProfile = profile;

    const projection = buildScopeProjection(scope, profile);
    const records = v061VisibleRecordMap(projection);
    const selectedId = v061SelectedInspectorId();
    if (selectedId && !records.has(selectedId)) {
      document.querySelector<HTMLButtonElement>("#v06-close")?.click();
      return;
    }

    document.querySelectorAll<HTMLButtonElement>(".scope-related [data-v06-ref]").forEach(button => {
      const id = button.dataset.v06Ref ?? "";
      if (profile === "client" && id && !records.has(id)) button.remove();
    });

    document.querySelectorAll<HTMLElement>(".scope-diagram-canvas").forEach(canvas => {
      if (canvas.getAttribute("role") !== "region") canvas.setAttribute("role", "region");
    });

    if (profile !== "client") return;

    document.querySelectorAll<HTMLElement>(".scope-diagram-card").forEach(card => {
      const diagramId = card.querySelector<HTMLElement>(".scope-diagram-heading [data-v06-ref]")?.dataset.v06Ref ?? "";
      const diagram = projection.diagrams.find(item => item.id === diagramId);
      if (!diagram) {
        card.remove();
        return;
      }
      const safe = v061SafeDiagramModel(diagram, records);
      card.querySelectorAll<HTMLElement>(".scope-diagram-node").forEach(node => {
        const recordId = node.dataset.v06Ref ?? "";
        if (recordId && !records.has(recordId)) node.remove();
      });
      const count = card.querySelector<HTMLElement>(".scope-diagram-heading small");
      const visibleNodeCount = diagram.node_records.filter(node => safe.nodeIds.has(node.node_id)).length;
      const countText = `${visibleNodeCount} visible node${visibleNodeCount === 1 ? "" : "s"} · ${safe.edgeCount} visible edge${safe.edgeCount === 1 ? "" : "s"}`;
      if (count && count.textContent !== countText) count.textContent = countText;
      const canvas = card.querySelector<HTMLElement>(".scope-diagram-canvas");
      if (canvas && canvas.getAttribute("aria-label") !== safe.text) canvas.setAttribute("aria-label", safe.text);
      const alternative = card.querySelector<HTMLElement>("details p");
      if (alternative && alternative.textContent !== safe.text) alternative.textContent = safe.text;
      card.querySelector("details ul")?.remove();
      if (!card.querySelector(".scope-client-diagram-qualification")) {
        const qualification = document.createElement("p");
        qualification.className = "notice scope-client-diagram-qualification";
        qualification.textContent = "This representation contains only records approved for this presentation profile. Omitted internal records and relationships are not shown or counted.";
        card.querySelector("details")?.after(qualification);
      }
    });
  }

  function v061QueueSanitize(): void {
    if (v061SanitizeQueued) return;
    v061SanitizeQueued = true;
    queueMicrotask(() => {
      v061SanitizeQueued = false;
      v061SanitizeScopePresentation();
    });
  }

  document.addEventListener("change", event => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement) || target.id !== "profile-select") return;
    document.querySelector<HTMLButtonElement>("#v06-close")?.click();
    document.querySelector<HTMLButtonElement>("#v06-close-import")?.click();
  }, true);

  const v061Root = document.getElementById("app");
  if (v061Root) new MutationObserver(v061QueueSanitize).observe(v061Root, { childList: true, subtree: true });
  v061QueueSanitize();
}
