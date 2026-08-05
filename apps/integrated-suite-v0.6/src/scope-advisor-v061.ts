namespace L2G {
  interface V061AdvisorHooks { store: ProjectStore; }

  let v061AdvisorQueued = false;
  let v061InspectorReturnRef = "";

  function v061AdvisorHooks(): V061AdvisorHooks | null {
    return ((window as unknown as { __L2G_TEST__?: V061AdvisorHooks }).__L2G_TEST__) ?? null;
  }

  function v061AdvisorEscape(value: unknown): string {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]!));
  }

  function v061AdvisorLabel(record: ScopeRecordBase | undefined): string {
    if (!record) return "Unknown or omitted record";
    if ("client_label" in record) {
      const value = String((record as unknown as { client_label: string }).client_label || "").trim();
      if (value) return value;
    }
    return record.label;
  }

  function v061AdvisorRecordMap(projection: ScopeProjection): Map<string, ScopeRecordBase> {
    const map = new Map<string, ScopeRecordBase>();
    const collections: ScopeRecordBase[][] = [projection.boundaries, projection.systems, projection.assets, projection.providers, projection.services, projection.locations, projection.enclaves, projection.data_flows, projection.assumptions, projection.unknowns, projection.dependencies, projection.decisions, projection.candidates, projection.diagrams];
    for (const collection of collections) for (const record of collection) map.set(record.id, record);
    return map;
  }

  function v061AdvisorSelectedId(): string {
    const identity = document.querySelector<HTMLElement>(".scope-inspector-heading p")?.textContent ?? "";
    return identity.split(" · ")[0]?.trim() ?? "";
  }

  function v061AdvisorCurrentTab(): string {
    return document.querySelector<HTMLElement>("[data-v06-tab][aria-current=page]")?.dataset.v06Tab ?? "";
  }

  function v061AdvisorGroupLabels(refs: string[], map: Map<string, ScopeRecordBase>): string {
    const grouped = new Map<string, string[]>();
    for (const ref of refs) {
      const record = map.get(ref);
      if (!record) continue;
      const family = record.id.split("_")[0]!.replace("scope-", "").replace(/-/g, " ");
      const list = grouped.get(family) ?? [];
      list.push(v061AdvisorLabel(record));
      grouped.set(family, list);
    }
    return [...grouped.entries()].map(([family, labels]) => `<li><strong>${v061AdvisorEscape(family)}</strong>: ${labels.map(v061AdvisorEscape).join(", ")}</li>`).join("") || "<li>None visible for this profile.</li>";
  }

  function v061EnhanceBoundary(projection: ScopeProjection, map: Map<string, ScopeRecordBase>): void {
    if (v061AdvisorCurrentTab() !== "boundary") return;
    const canvas = document.querySelector<HTMLElement>(".scope-canvas");
    if (!canvas || canvas.querySelector(".v061-boundary-detail")) return;
    if (!projection.boundaries.length) {
      const empty = document.createElement("section");
      empty.className = "scope-panel v061-boundary-detail";
      empty.innerHTML = `<h2>Start an intentionally empty Scope</h2><p>Nothing was inferred from the earlier project. Choose an explicit non-authoritative starting action.</p><div class="scope-card-actions"><button type="button" data-v061-start-import>Import Scoper package</button><button type="button" data-v061-start-candidates>Review source candidates</button><button type="button" data-v061-start-boundary disabled title="Boundary proposal creation requires the governed Scope draft command.">Add boundary proposal</button></div>`;
      canvas.append(empty);
      return;
    }
    const selected = projection.boundaries.find(item => item.id === v061AdvisorSelectedId()) ?? projection.boundaries[0]!;
    const relatedDiagramRefs = [...new Set([
      ...selected.diagram_refs,
      ...projection.diagrams
        .filter(diagram => diagram.included_record_refs.some(ref => ref.id === selected.id))
        .map(diagram => diagram.id)
    ])];
    const detail = document.createElement("section");
    detail.className = "scope-panel v061-boundary-detail";
    detail.innerHTML = `<div class="scope-panel-heading"><h2>${v061AdvisorEscape(selected.client_label || selected.label)}</h2><span>${v061AdvisorEscape(selected.scope_disposition)}</span></div><p>${v061AdvisorEscape(selected.purpose || selected.plain_language_summary)}</p><div class="v061-context-grid"><section><h3>Included records</h3><ul>${v061AdvisorGroupLabels(selected.included_refs, map)}</ul></section><section><h3>Excluded records</h3><ul>${v061AdvisorGroupLabels(selected.excluded_refs, map)}</ul></section><section><h3>Entry and exit context</h3><ul>${v061AdvisorGroupLabels(selected.entry_exit_point_refs, map)}</ul></section><section><h3>Locations and enclaves</h3><ul>${v061AdvisorGroupLabels([...selected.location_refs, ...selected.enclave_refs], map)}</ul></section><section><h3>Blocking unknowns</h3><ul>${v061AdvisorGroupLabels(selected.unknown_refs, map)}</ul></section><section><h3>Related representations</h3><ul>${v061AdvisorGroupLabels(relatedDiagramRefs, map)}</ul></section></div>`;
    canvas.append(detail);
  }

  function v061EnhanceObjectFilters(): void {
    if (v061AdvisorCurrentTab() !== "objects") return;
    const list = document.querySelector<HTMLElement>(".scope-object-list");
    if (!list || list.previousElementSibling?.classList.contains("v061-object-filters")) return;
    const controls = document.createElement("section");
    controls.className = "scope-panel v061-object-filters";
    controls.setAttribute("aria-label", "Systems and assets filters");
    controls.innerHTML = `<label>Search systems and assets<input type="search" data-v061-object-search placeholder="Search safe labels and visible context"></label><label>Category<select data-v061-object-category><option value="">All visible categories</option><option>Unclassified</option><option>Cui Asset</option><option>Security Protection Asset</option><option>Contractor Risk Managed Asset</option><option>Specialized Asset</option><option>Out Of Scope Asset</option></select></label><label>Disposition<select data-v061-object-disposition><option value="">All visible dispositions</option><option>Proposed In Scope</option><option>Accepted In Scope</option><option>Proposed Out Of Scope</option><option>Accepted Out Of Scope</option><option>Unknown</option><option>Disputed</option><option>Deferred</option></select></label><p data-v061-filter-status role="status"></p>`;
    list.before(controls);
    const apply = () => {
      const query = (controls.querySelector<HTMLInputElement>("[data-v061-object-search]")?.value ?? "").trim().toLocaleLowerCase();
      const category = controls.querySelector<HTMLSelectElement>("[data-v061-object-category]")?.value ?? "";
      const disposition = controls.querySelector<HTMLSelectElement>("[data-v061-object-disposition]")?.value ?? "";
      let visible = 0;
      list.querySelectorAll<HTMLElement>(".scope-object-row").forEach(row => {
        const text = (row.textContent ?? "").toLocaleLowerCase();
        const show = (!query || text.includes(query)) && (!category || text.includes(category.toLocaleLowerCase())) && (!disposition || text.includes(disposition.toLocaleLowerCase()));
        row.hidden = !show;
        if (show) visible++;
      });
      const status = controls.querySelector<HTMLElement>("[data-v061-filter-status]");
      if (status) status.textContent = `${visible} visible record${visible === 1 ? "" : "s"}. Similar names do not establish identity; inspect stable IDs and context before deciding.`;
    };
    controls.addEventListener("input", apply);
    controls.addEventListener("change", apply);
    apply();
  }

  function v061EnhanceInspector(projection: ScopeProjection, map: Map<string, ScopeRecordBase>): void {
    const inspector = document.querySelector<HTMLElement>(".scope-inspector");
    if (!inspector || inspector.classList.contains("empty-inspector")) return;
    const id = v061AdvisorSelectedId();
    const record = map.get(id);
    if (!record) return;
    if (!inspector.querySelector(".v061-inspector-sections")) {
      const sections = document.createElement("div");
      sections.className = "v061-inspector-sections";
      const relatedUnknowns = projection.unknowns.filter(item => item.affected_refs.includes(record.id));
      const relatedDecisions = projection.decisions.filter(item => item.affected_record_refs.some(ref => ref.id === record.id));
      const relatedFlows = projection.data_flows.filter(item => item.source_ref === record.id || item.destination_ref === record.id || item.intermediary_refs.includes(record.id));
      let specialized = "";
      if ("family" in record) {
        const object = record as ScopeObject;
        if (object.family === "provider" || object.family === "service") {
          specialized = `<section><h3>Provider and responsibility context</h3><dl><dt>Implementation location</dt><dd>${v061AdvisorEscape(object.implementation_location)}</dd><dt>Responsibility assertion</dt><dd>${v061AdvisorEscape(object.responsibility_model)}</dd><dt>Responsibility summary</dt><dd>${v061AdvisorEscape(object.responsibility_summary || "No summary recorded.")}</dd><dt>Function/context</dt><dd>${v061AdvisorEscape(object.function_summary || "No context recorded.")}</dd><dt>Provider reference</dt><dd>${object.provider_ref ? v061AdvisorEscape(v061AdvisorLabel(map.get(object.provider_ref))) : "None recorded"}</dd></dl></section>`;
        }
      }
      if ("transfer_mechanism" in record) {
        const flow = record as ScopeDataFlow;
        specialized = `<section><h3>Flow crossing and transport context</h3><dl><dt>Mechanism</dt><dd>${v061AdvisorEscape(flow.transfer_mechanism)}</dd><dt>Protocol</dt><dd>${v061AdvisorEscape(flow.protocol_summary)}</dd><dt>Direction/frequency</dt><dd>${v061AdvisorEscape(flow.direction)} · ${v061AdvisorEscape(flow.frequency)}</dd><dt>Boundary crossings</dt><dd>${v061AdvisorEscape(flow.boundary_crossing_refs.map(ref => v061AdvisorLabel(map.get(ref))).join(", ") || "None recorded")}</dd><dt>Protection context</dt><dd>${v061AdvisorEscape(flow.protection_summary || "No context recorded.")}</dd></dl></section>`;
      }
      sections.innerHTML = `${specialized}<section><h3>Unknowns</h3><ul>${relatedUnknowns.map(item => `<li><button type="button" data-v06-ref="${v061AdvisorEscape(item.id)}">${v061AdvisorEscape(item.label)}</button> · ${v061AdvisorEscape(item.blocking_effect)}</li>`).join("") || "<li>None visible.</li>"}</ul></section><section><h3>Decisions and differences</h3><ul>${relatedDecisions.map(item => `<li><button type="button" data-v06-ref="${v061AdvisorEscape(item.id)}">${v061AdvisorEscape(item.label)}</button> · ${v061AdvisorEscape(item.decision_state)} · ${v061AdvisorEscape(item.currency_state)}</li>`).join("") || "<li>No visible governing proposal or decision.</li>"}</ul></section><section><h3>Related flows</h3><ul>${relatedFlows.map(item => `<li><button type="button" data-v061-open-flow="${v061AdvisorEscape(item.id)}">${v061AdvisorEscape(item.client_label || item.label)}</button></li>`).join("") || "<li>None visible.</li>"}</ul></section><section><h3>History</h3><p>Current exact record version ${record.version}; updated ${v061AdvisorEscape(record.updated_at)} by ${v061AdvisorEscape(record.updated_by_profile)}. Use project history for command-level audit detail.</p></section>`;
      inspector.append(sections);
    }
    if (matchMedia("(max-width: 1100px)").matches) {
      inspector.setAttribute("role", "dialog");
      inspector.setAttribute("aria-modal", "false");
      inspector.setAttribute("aria-label", `Scope inspector — ${v061AdvisorLabel(record)}`);
    } else {
      inspector.setAttribute("role", "complementary");
      inspector.removeAttribute("aria-modal");
    }
  }

  function v061EnhancePriorities(): void {
    const labels: Record<string, string> = { "0": "Blocking", "1": "Blocking", "2": "Do next", "3": "Follow up", "9": "Informational" };
    document.querySelectorAll<HTMLElement>(".scope-priority").forEach(node => {
      const match = (node.textContent ?? "").match(/Priority\s+(\d+)/i);
      if (match) node.textContent = `${labels[match[1]!] ?? "Follow up"} — ordered by the recorded workflow state.`;
    });
  }

  function v061EnhanceAdvisor(): void {
    const hooks = v061AdvisorHooks();
    const scope = hooks?.store.document.state.scope;
    if (!hooks || !scope || hooks.store.document.state.active_workspace !== "scope") return;
    const projection = buildScopeProjection(scope, hooks.store.document.state.profile);
    const map = v061AdvisorRecordMap(projection);
    v061EnhanceBoundary(projection, map);
    v061EnhanceObjectFilters();
    v061EnhanceInspector(projection, map);
    v061EnhancePriorities();
  }

  function v061QueueAdvisor(): void {
    if (v061AdvisorQueued) return;
    v061AdvisorQueued = true;
    queueMicrotask(() => {
      v061AdvisorQueued = false;
      v061EnhanceAdvisor();
    });
  }

  document.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const selectable = target.closest<HTMLElement>("[data-v06-ref]");
    if (selectable) v061InspectorReturnRef = selectable.dataset.v06Ref ?? "";
    if (target.closest("[data-v061-start-import]")) document.querySelector<HTMLButtonElement>("#v06-import")?.click();
    if (target.closest("[data-v061-start-candidates]")) document.querySelector<HTMLButtonElement>('[data-v06-tab="decisions"]')?.click();
    const flow = target.closest<HTMLElement>("[data-v061-open-flow]");
    if (flow?.dataset.v061OpenFlow) {
      document.querySelector<HTMLButtonElement>('[data-v06-tab="flows"]')?.click();
      const ref = flow.dataset.v061OpenFlow;
      queueMicrotask(() => document.querySelector<HTMLButtonElement>(`[data-v06-ref="${CSS.escape(ref)}"]`)?.click());
    }
  }, true);

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const inspector = document.querySelector<HTMLElement>(".scope-inspector:not(.empty-inspector)");
    if (!inspector || !matchMedia("(max-width: 1100px)").matches) return;
    const returnRef = v061InspectorReturnRef;
    document.querySelector<HTMLButtonElement>("#v06-close")?.click();
    queueMicrotask(() => {
      const selector = returnRef ? `.scope-object-row[data-v06-ref="${CSS.escape(returnRef)}"], .scope-flow-card[data-v06-ref="${CSS.escape(returnRef)}"], .scope-list-card[data-v06-ref="${CSS.escape(returnRef)}"]` : "";
      const target = selector ? document.querySelector<HTMLElement>(selector) : null;
      const fallback = document.querySelector<HTMLElement>("#scope-title");
      if (!target && fallback) fallback.tabIndex = -1;
      (target ?? fallback)?.focus();
    });
  });

  const v061AdvisorRoot = document.getElementById("app");
  if (v061AdvisorRoot) new MutationObserver(v061QueueAdvisor).observe(v061AdvisorRoot, { childList: true, subtree: true });
  matchMedia("(max-width: 1100px)").addEventListener("change", v061QueueAdvisor);
  v061QueueAdvisor();
}
