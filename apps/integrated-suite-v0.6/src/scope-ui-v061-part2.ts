namespace L2G {
  export function v06Boundary(projection: ScopeProjection, map: Map<string, ScopeRecordBase>, profile: PresentationProfile): string {
    const active = projection.boundaries.find(item => item.id === v06Selected) ?? projection.boundaries[0];
    const emptyActions = profile === "advisor" ? `<div class="scope-empty-actions"><button id="v06-empty-import">Import Scoper package</button><button data-v06-tab="decisions">Review source candidates</button><button id="v06-empty-boundary">Add boundary proposal</button></div>` : "";
    const detail = active ? `<section class="scope-boundary-detail" aria-labelledby="boundary-detail-title">
      <h2 id="boundary-detail-title">${v06H(v06Label(active))}</h2>
      <p>${v06H(active.purpose)}</p>
      <div class="scope-detail-grid">
        <div><h3>Included groups</h3>${v06RefList(active.included_refs, map)}</div>
        <div><h3>Excluded groups</h3>${v06RefList(active.excluded_refs, map)}</div>
        <div><h3>Entry and exit points</h3>${v06RefList(active.entry_exit_point_refs, map)}</div>
        <div><h3>Blocking unknowns</h3>${v06RefList(active.unknown_refs, map)}</div>
        <div><h3>Related representations</h3>${v06RefList(active.diagram_refs, map)}</div>
      </div>
      <p class="qualification">This boundary view describes locally governed Scope records and does not determine applicability or an assessment result.</p>
    </section>` : `<div class="empty"><strong>Nothing was inferred from the prior project.</strong><p>Start with a reviewed import, source candidate, or explicit boundary proposal.</p>${emptyActions}</div>`;
    return `<div class="scope-boundary-layout">
      <section class="scope-panel"><div class="scope-panel-heading"><h2>Boundary records</h2><span>${projection.boundaries.length}</span></div>${projection.boundaries.map(item => `<button class="scope-list-card" data-v06-ref="${v06H(item.id)}"><strong>${v06H(v06Label(item))}</strong><small>${v06H(item.purpose)}</small><span>${v06Chip("Disposition", item.scope_disposition)}${v06Chip("Review", item.review_state)}${v06Chip("Currency", item.currency_state)}</span></button>`).join("") || `<div class="empty">No visible boundary exists.</div>`}</section>
      ${detail}
      <section class="scope-panel"><div class="scope-panel-heading"><h2>Factual next work</h2><span>${projection.next_work.length}</span></div>${projection.next_work.slice(0, 10).map(item => `<button class="scope-list-card" data-v06-ref="${v06H(item.record_ref)}"><strong>${v06H(item.title)}</strong><small>${v06H(item.detail)}</small><span class="scope-priority">${v06H(v06PriorityLabel(item))}</span></button>`).join("")}</section>
    </div>`;
  }

  export function v06ObjectToolbar(): string {
    return `<div class="scope-toolbar" role="search">
      <label>Search Scope <input id="v06-search" type="search" value="${v06H(v06Search)}" placeholder="Search visible labels and identifiers"></label>
      <label>Category <select id="v06-category-filter"><option value="all">All</option>${["cui-asset", "security-protection-asset", "contractor-risk-managed-asset", "specialized-asset", "out-of-scope-asset", "unclassified"].map(value => `<option value="${value}" ${v06CategoryFilter === value ? "selected" : ""}>${v06Words(value)}</option>`).join("")}</select></label>
      <label>Disposition <select id="v06-disposition-filter"><option value="all">All</option>${["proposed-in-scope", "accepted-in-scope", "proposed-out-of-scope", "accepted-out-of-scope", "unknown", "disputed", "deferred"].map(value => `<option value="${value}" ${v06DispositionFilter === value ? "selected" : ""}>${v06Words(value)}</option>`).join("")}</select></label>
      <label>Responsibility <select id="v06-responsibility-filter"><option value="all">All</option>${["client", "provider", "shared", "inherited", "unassigned", "disputed"].map(value => `<option value="${value}" ${v06ResponsibilityFilter === value ? "selected" : ""}>${v06Words(value)}</option>`).join("")}</select></label>
      <div class="scope-mode" aria-label="Inventory mode"><button data-v06-object-mode="grouped" aria-pressed="${v06ObjectMode === "grouped"}">Group by system</button><button data-v06-object-mode="assets" aria-pressed="${v06ObjectMode === "assets"}">Asset list</button></div>
    </div>`;
  }

  export function v06ObjectMatches(item: ScopeObject): boolean {
    const haystack = `${item.label} ${item.client_label} ${item.identifier_summary} ${item.function_summary} ${item.object_kind}`.toLocaleLowerCase();
    return (!v06Search || haystack.includes(v06Search.toLocaleLowerCase()))
      && (v06CategoryFilter === "all" || item.asset_category === v06CategoryFilter)
      && (v06DispositionFilter === "all" || item.scope_disposition === v06DispositionFilter)
      && (v06ResponsibilityFilter === "all" || item.responsibility_model === v06ResponsibilityFilter);
  }

  export function v06ObjectRow(item: ScopeObject): string {
    return `<button class="scope-object-row" data-v06-ref="${v06H(item.id)}"><span><strong>${v06H(v06Label(item))}</strong><small>${v06H(v06Words(item.family))} · ${v06H(v06Words(item.object_kind))} · ${v06H(item.identifier_summary || item.id)}</small></span><span class="scope-dimensions">${v06Chip("Category", item.asset_category)}${v06Chip("Disposition", item.scope_disposition)}${v06Chip("Boundary", item.boundary_relationship)}${v06Chip("Location", item.implementation_location)}${v06Chip("Responsibility", item.responsibility_model)}</span></button>`;
  }

  export function v06Objects(projection: ScopeProjection, map: Map<string, ScopeRecordBase>): string {
    const systems = projection.systems.filter(v06ObjectMatches);
    const assets = projection.assets.filter(v06ObjectMatches);
    let content = "";
    if (v06ObjectMode === "assets") {
      content = assets.map(v06ObjectRow).join("");
    } else {
      const linked = new Set<string>();
      content = systems.map(system => {
        const children = system.related_refs.map(ref => map.get(ref)).filter((item): item is ScopeObject => Boolean(item && "family" in item && (item as ScopeObject).family === "asset" && v06ObjectMatches(item as ScopeObject)));
        children.forEach(item => linked.add(item.id));
        return `<section class="scope-system-group"><h2><button data-v06-ref="${v06H(system.id)}">${v06H(v06Label(system))}</button></h2>${children.map(v06ObjectRow).join("") || `<p class="muted">No visible matching assets are linked to this system.</p>`}</section>`;
      }).join("");
      const ungrouped = assets.filter(item => !linked.has(item.id));
      if (ungrouped.length) content += `<section class="scope-system-group"><h2>Ungrouped assets</h2>${ungrouped.map(v06ObjectRow).join("")}</section>`;
    }
    return `${v06ObjectToolbar()}<div class="scope-object-list">${content || `<div class="empty">No visible systems or assets match the active profile-safe filters.</div>`}</div>`;
  }

  export function v06Providers(projection: ScopeProjection, map: Map<string, ScopeRecordBase>): string {
    const items = [...projection.providers, ...projection.services];
    return `<div class="scope-provider-list">${items.map(item => {
      const unknowns = projection.unknowns.filter(unknown => unknown.affected_refs.includes(item.id));
      const relatedFlows = projection.data_flows.filter(flow => flow.source_ref === item.id || flow.destination_ref === item.id || flow.intermediary_refs.includes(item.id));
      const provider = item.provider_ref ? map.get(item.provider_ref) : undefined;
      return `<article class="scope-provider-card"><button data-v06-ref="${v06H(item.id)}"><strong>${v06H(v06Label(item))}</strong><small>${v06H(item.function_summary || item.description || item.plain_language_summary)}</small></button><div>${v06Chip("Location", item.implementation_location)}${v06Chip("Responsibility", item.responsibility_model)}${v06Chip("Disposition", item.scope_disposition)}</div><dl><dt>Responsibility context</dt><dd>${v06H(item.responsibility_summary || "No additional responsibility summary recorded.")}</dd><dt>Provider</dt><dd>${v06H(v06Label(provider))}</dd><dt>Support-access unknowns</dt><dd>${unknowns.length}</dd><dt>Related flows</dt><dd>${relatedFlows.length}</dd></dl>${unknowns.length ? `<div class="scope-related">${unknowns.map(unknown => `<button data-v06-ref="${v06H(unknown.id)}">${v06H(v06Label(unknown))}</button>`).join("")}</div>` : ""}<p class="qualification">Responsibility and inheritance context do not establish implementation or effectiveness.</p></article>`;
    }).join("") || `<div class="empty">No visible providers or services.</div>`}</div>`;
  }

  export function v06Flows(projection: ScopeProjection, map: Map<string, ScopeRecordBase>): string {
    return projection.data_flows.length ? `<div class="scope-flow-list">${projection.data_flows.map(flow => {
      const source = map.get(flow.source_ref);
      const destination = map.get(flow.destination_ref);
      const intermediaries = flow.intermediary_refs.map(ref => map.get(ref)).filter((item): item is ScopeRecordBase => Boolean(item));
      const crossings = flow.boundary_crossing_refs.map(ref => map.get(ref)).filter((item): item is ScopeRecordBase => Boolean(item));
      return `<article class="scope-flow-card"><button data-v06-ref="${v06H(flow.id)}"><strong>${v06H(v06Label(flow))}</strong><span class="scope-flow-path"><b>${v06H(v06Label(source))}</b><i>→</i>${intermediaries.map(item => `<em>${v06H(v06Label(item))}</em><i>→</i>`).join("")}<b>${v06H(v06Label(destination))}</b></span><small>${v06H(flow.data_description)}</small></button><div>${v06Chip("Data", flow.data_classification_label)}${v06Chip("Disposition", flow.scope_disposition)}${v06Chip("Currency", flow.currency_state)}</div><dl><dt>Crossings</dt><dd>${crossings.map(v06Label).join(", ") || "No visible crossing recorded"}</dd><dt>Transfer</dt><dd>${v06H(flow.transfer_mechanism)} · ${v06H(flow.protocol_summary)}</dd><dt>Direction and frequency</dt><dd>${v06H(v06Words(flow.direction))} · ${v06H(v06Words(flow.frequency))}</dd><dt>Protection context</dt><dd>${v06H(flow.protection_summary)}</dd><dt>Unknowns</dt><dd>${flow.unknown_refs.length}</dd></dl><button data-v06-show-diagram="${v06H(flow.id)}">Show on diagram</button><p class="qualification">Classification labels are locally or source asserted and do not establish an assessment conclusion.</p></article>`;
    }).join("")}</div>` : `<div class="empty">No visible data flow exists.</div>`;
  }

  export function v06DecisionReady(item: ScopeDecision): boolean {
    return item.currency_state === "current" && ["draft", "proposed", "awaiting-confirmation", "awaiting-review", "returned"].includes(item.decision_state);
  }

}
