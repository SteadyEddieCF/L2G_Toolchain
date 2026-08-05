namespace L2G {
  export type V06ScopeTab = "boundary" | "objects" | "providers" | "flows" | "decisions" | "diagrams";
  export type V06DialogState =
    | { kind: "decision"; id: string }
    | { kind: "review"; id: string; action: ScopeDecision["reviewer_disposition"] }
    | { kind: "unknown"; id: string }
    | { kind: "candidate"; id: string }
    | { kind: "add-boundary"; id?: never }
    | { kind: "add-asset"; id?: never };
  export interface V06TestHooks { store: ProjectStore; }

  export let v06Tab: V06ScopeTab = "boundary";
  export let v06Selected = "";
  export let v06Preview: ScopeImportPreview | null = null;
  export let v06Dialog: V06DialogState | null = null;
  export let v06Queued = false;
  export let v06LastProfile: PresentationProfile | null = null;
  export let v06Search = "";
  export let v06CategoryFilter = "all";
  export let v06DispositionFilter = "all";
  export let v06ResponsibilityFilter = "all";
  export let v06ObjectMode: "grouped" | "assets" = "grouped";
  export let v06Announcement = "";
  export let v06FocusSelector = "";
  export const v06DiagramZoom = new Map<string, number>();

  export function v06Hooks(): V06TestHooks | null {
    return ((window as unknown as { __L2G_TEST__?: V06TestHooks }).__L2G_TEST__) ?? null;
  }

  export function v06Scope(document: ProjectDocument): ScopeDomain {
    const value = document.state.scope;
    if (!value) throw new Error("The v0.6 Scope domain is missing.");
    return value;
  }

  export function v06H(value: unknown): string {
    return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]!));
  }

  export function v06Words(value: string): string {
    return value.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
  }

  export function v06Status(value: string): string {
    return /stale|conflict|blocked|rejected|returned|unknown|disputed/.test(value)
      ? "attention"
      : /accepted|reviewed|approved|complete|current/.test(value)
        ? "success"
        : "";
  }

  export function v06Chip(label: string, value: string): string {
    return `<span class="scope-chip ${v06Status(value)}"><small>${v06H(label)}</small><strong>${v06H(v06Words(value))}</strong></span>`;
  }

  export function v06Label(item: ScopeRecordBase | undefined): string {
    if (!item) return "Unavailable record";
    if ("client_label" in item) {
      const clientLabel = String((item as unknown as { client_label: string }).client_label || "").trim();
      if (clientLabel) return clientLabel;
    }
    return item.label;
  }

  export function v06ProfileSelect(element: HTMLSelectElement): boolean {
    const values = new Set([...element.options].map(option => option.value));
    return values.has("advisor") && values.has("client") && values.has("reviewer");
  }

  export function v06ResetTransient(nextProfile?: PresentationProfile): void {
    v06Selected = "";
    v06Preview = null;
    v06Dialog = null;
    v06Search = "";
    v06CategoryFilter = "all";
    v06DispositionFilter = "all";
    v06ResponsibilityFilter = "all";
    v06Announcement = "";
    v06FocusSelector = "#scope-title";
    if (nextProfile) v06LastProfile = nextProfile;
  }

  export function v06Queue(): void {
    if (v06Queued) return;
    v06Queued = true;
    queueMicrotask(() => {
      v06Queued = false;
      v06Enhance();
    });
  }

  export function v06Enhance(): void {
    const hooks = v06Hooks();
    if (!hooks) return;
    const badge = document.querySelector<HTMLElement>(".release-badge");
    const desiredBadge = `v${window.__L2G_RELEASE__.version} · Scope Vertical Slice`;
    if (badge && badge.textContent !== desiredBadge) badge.textContent = desiredBadge;
    document.querySelectorAll<HTMLElement>(".notice,.qualification").forEach(node => {
      if (node.textContent?.includes("v0.4")) node.textContent = node.textContent.replace(/v0\.4/g, "v0.6");
    });
    if (hooks.store.document.state.active_workspace !== "scope") return;
    const profile = hooks.store.document.state.profile;
    if (v06LastProfile !== null && profile !== v06LastProfile) v06ResetTransient(profile);
    v06LastProfile = profile;
    const main = document.getElementById("workspace");
    if (!main || main.querySelector('[data-scope-v061="ready"]')) return;
    v06Render(main, hooks.store);
  }

  export function v06Render(main: HTMLElement, store: ProjectStore): void {
    const scope = v06Scope(store.document);
    refreshScopeCurrency(scope);
    const profile = store.document.state.profile;
    const projection = buildScopeProjection(scope, profile);
    const recordMap = scopeProjectionRecordMap(projection);
    const selected = v06Selected ? recordMap.get(v06Selected) : undefined;
    if (v06Selected && !selected) v06Selected = "";
    const nextWorkCount = projection.next_work.filter(item => item.kind !== "informational").length;
    main.innerHTML = `${store.migrationNotice ? `<div class="notice warning" role="status">${v06H(store.migrationNotice)}</div>` : ""}
      <section class="scope-workbench" data-scope-v061="ready" aria-labelledby="scope-title">
        <div class="workspace-header scope-header">
          <div><h1 id="scope-title" tabindex="-1">Scope</h1><p>Build an explicit, auditable boundary. Objects describe the environment; Scope-owned decisions establish accepted authority.</p></div>
          <div class="workspace-actions">
            ${profile === "advisor" ? `<button id="v06-add-asset" class="primary">Add asset</button><button id="v06-import">Import Scoper package</button><button id="v06-diagram">Generate diagram</button>` : ""}
            <span class="badge">${nextWorkCount} visible next-work item${nextWorkCount === 1 ? "" : "s"}</span>
          </div>
        </div>
        <div class="notice scope-short-qualification">Synthetic-only. Scope records and locally asserted data labels do not establish readiness, compliance, risk, evidence sufficiency, implementation, certification, applicability, or Met/Not Met.</div>
        <nav class="scope-tabs" aria-label="Scope views">${v06Tabs()}</nav>
        ${v06Metrics(projection)}
        <div class="scope-layout">
          <div class="scope-canvas">${v06TabView(projection, recordMap, profile)}</div>
          ${selected ? v06Inspector(selected, projection, recordMap, profile) : `<aside class="scope-inspector empty-inspector" aria-label="Scope inspector"><h2>Inspector</h2><p>Select a visible Scope record to review identity, authority dimensions, provenance, decisions, differences, unknowns, history, and valid actions.</p></aside>`}
        </div>
        ${v06Preview ? v06ImportPanel(v06Preview, projection, recordMap) : ""}
        ${v06Dialog ? v06DialogPanel(v06Dialog, projection, recordMap, profile) : ""}
        ${profile === "client" ? `<div class="notice scope-client-qualification">This is a locally facilitated Scope view. It is not access control, an authenticated approval, an assessment conclusion, or authorization to distribute the complete project.</div>` : ""}
        <div id="v06-live" class="scope-sr-only" aria-live="polite" aria-atomic="true">${v06H(v06Announcement)}</div>
      </section>`;
    v06Bind(main, store, projection, recordMap);
    if (v06FocusSelector) {
      const target = main.querySelector<HTMLElement>(v06FocusSelector);
      v06FocusSelector = "";
      target?.focus();
    }
  }

  export function v06Tabs(): string {
    const labels: Record<V06ScopeTab, string> = {
      boundary: "Boundary",
      objects: "Systems & Assets",
      providers: "Providers & Services",
      flows: "Data Flows",
      decisions: "Decisions",
      diagrams: "Diagrams"
    };
    return (Object.keys(labels) as V06ScopeTab[]).map(tab =>
      `<button data-v06-tab="${tab}" aria-current="${v06Tab === tab ? "page" : "false"}">${v06H(labels[tab])}</button>`
    ).join("");
  }

  export function v06Metrics(projection: ScopeProjection): string {
    const entries = [
      ["assets", projection.counts.assets ?? 0],
      ["providers", projection.counts.providers ?? 0],
      ["flows", projection.counts.flows ?? 0],
      ["decisions", projection.counts.decisions ?? 0],
      ["unknowns", projection.counts.unknowns ?? 0],
      ["diagrams", projection.counts.diagrams ?? 0]
    ];
    return `<details class="scope-metrics" open><summary>${entries.map(([label, value]) => `${value} ${label}`).join(" · ")}</summary><div>${entries.map(([label, value]) => `<span><strong>${value}</strong> ${label}</span>`).join("")}</div></details>`;
  }

  export function v06TabView(projection: ScopeProjection, map: Map<string, ScopeRecordBase>, profile: PresentationProfile): string {
    if (v06Tab === "boundary") return v06Boundary(projection, map, profile);
    if (v06Tab === "objects") return v06Objects(projection, map);
    if (v06Tab === "providers") return v06Providers(projection, map);
    if (v06Tab === "flows") return v06Flows(projection, map);
    if (v06Tab === "decisions") return v06Decisions(projection, profile);
    return v06Diagrams(projection, map, profile);
  }

  export function v06PriorityLabel(item: ScopeNextWorkItem): string {
    if (item.kind === "validation" || item.priority <= 0) return "Blocking";
    if (item.priority === 1) return "Do next";
    if (item.priority <= 3) return "Follow up";
    if (item.kind === "informational") return "Informational";
    return "Waiting";
  }

}
