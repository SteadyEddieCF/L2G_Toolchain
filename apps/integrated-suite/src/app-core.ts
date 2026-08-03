namespace L2G {
  export abstract class IntegratedSuiteCore {
    protected abstract attachEvents(): void;
    protected abstract installGlobalShortcuts(): void;
    protected abstract showRecoveryDialog(envelope: RecoveryEnvelope): void;
    protected abstract showToast(text: string, kind: "info" | "success" | "warning" | "error"): void;
    protected abstract markUnsaved(): void;
    protected abstract reviewAttentionCount(): number;
    protected saveState = "Saved in browser recovery";
    protected saveTimer: number | undefined;
    protected readOnlyRecovery = false;
    protected previousFocus: HTMLElement | null = null;

    constructor(protected readonly root: HTMLElement, protected readonly store: ProjectStore, protected readonly recovery: RecoveryStore) {
      store.subscribe(() => {
        this.markUnsaved();
        this.render();
      });
      this.installGlobalShortcuts();
    }

    async start(): Promise<void> {
      this.render();
      try {
        const recovery = await this.recovery.load();
        if (recovery) this.showRecoveryDialog(recovery);
      } catch (error) {
        this.showToast(`Recovery could not be read: ${message(error)}`, "warning");
      }
    }

    protected render(): void {
      const state = this.store.document.state;
      const profile = state.profile;
      const workspace = WORKSPACES.find(item => item.id === state.active_workspace) ?? WORKSPACES[0]!;
      const advisor = profile === "advisor" && !this.readOnlyRecovery;
      const profileLabel = profile[0]!.toUpperCase() + profile.slice(1);
      const railClass = state.rail_collapsed ? "nav-rail collapsed" : "nav-rail";
      const inspectorClass = state.inspector_open ? `inspector open${state.inspector_pinned ? " pinned" : ""}` : "inspector";
      this.root.innerHTML = `
        <div class="app-shell theme-system profile-${profile}" data-testid="app-shell">
          <a class="skip-link" href="#workspace-main">Skip to workspace</a>
          <header class="top-bar">
            <button class="icon-button" id="rail-toggle" aria-label="${state.rail_collapsed ? "Expand" : "Collapse"} navigation rail" aria-expanded="${!state.rail_collapsed}" title="Toggle navigation (Ctrl+\\)">☰</button>
            <div class="engagement-identity">
              <strong id="top-engagement-name">${escapeHtml(state.engagement.engagement_name || "Untitled engagement")}</strong>
              <span>${escapeHtml(state.engagement.phase || "No phase")}</span>
            </div>
            <div class="save-state" role="status" aria-live="polite" data-testid="save-state">${escapeHtml(this.saveState)}</div>
            <div class="top-actions">
              <button id="undo-button" class="icon-button" ${this.store.canUndo ? "" : "disabled"} aria-label="Undo${this.store.undoDescription ? ` ${escapeAttribute(this.store.undoDescription)}` : ""}" title="${this.store.undoDescription ? `Undo “${escapeAttribute(this.store.undoDescription)}”` : "Nothing to undo"}">↶</button>
              <button id="redo-button" class="icon-button" ${this.store.canRedo ? "" : "disabled"} aria-label="Redo${this.store.redoDescription ? ` ${escapeAttribute(this.store.redoDescription)}` : ""}" title="${this.store.redoDescription ? `Redo “${escapeAttribute(this.store.redoDescription)}”` : "Nothing to redo"}">↷</button>
              <button id="search-button" class="command-button" aria-label="Open search and commands" title="Search and commands (Ctrl+K)">⌕ Search</button>
              <label class="profile-control"><span class="sr-only">Presentation profile</span>
                <select id="profile-select" aria-label="Presentation profile">
                  ${["advisor", "client", "reviewer"].map(item => `<option value="${item}" ${item === profile ? "selected" : ""}>${item[0]!.toUpperCase() + item.slice(1)}</option>`).join("")}
                </select>
              </label>
              <button id="help-button" class="icon-button" aria-label="Open help">?</button>
              <button id="overflow-button" class="icon-button" aria-label="Open project actions" aria-haspopup="menu">⋯</button>
            </div>
          </header>
          <div class="profile-banner" role="status"><strong>${profileLabel} View</strong> · Presentation profile only—not a security boundary.${this.readOnlyRecovery ? " Recovery is open read-only." : ""}</div>
          <div class="body-grid">
            <nav class="${railClass}" aria-label="Primary workspaces">
              <div class="rail-items">
                ${WORKSPACES.map(item => `<button class="nav-item ${item.id === state.active_workspace ? "active" : ""}" data-workspace="${item.id}" aria-current="${item.id === state.active_workspace ? "page" : "false"}" title="${escapeAttribute(item.label)}"><span class="nav-icon" aria-hidden="true">${item.icon}</span><span class="nav-label">${escapeHtml(item.label)}</span>${item.id === "reviews-actions" ? `<span class="count-badge" aria-label="${this.reviewAttentionCount()} items needing attention">${this.reviewAttentionCount()}</span>` : ""}</button>`).join("")}
              </div>
              <button id="about-button" class="nav-item rail-bottom" title="About this foundation"><span class="nav-icon">ⓘ</span><span class="nav-label">About</span></button>
            </nav>
            <main id="workspace-main" class="workspace" tabindex="-1">
              <header class="workspace-header">
                <div><p class="eyebrow">${profileLabel} View · Synthetic foundation</p><h1>${escapeHtml(workspace.label)}</h1><p>${escapeHtml(workspace.description)}</p></div>
                <div class="workspace-actions">${this.workspaceActions(workspace.id, advisor)}</div>
              </header>
              ${this.renderWorkspace(workspace.id, advisor)}
            </main>
            <aside class="${inspectorClass}" aria-label="Context inspector" aria-hidden="${!state.inspector_open}">
              <div class="inspector-header"><strong>Context inspector</strong><div><button id="pin-inspector" class="icon-button" aria-pressed="${state.inspector_pinned}" title="Pin inspector">⌖</button><button id="close-inspector" class="icon-button" aria-label="Close inspector">×</button></div></div>
              ${this.renderInspector()}
            </aside>
          </div>
          <div id="toast-region" class="toast-region" aria-live="polite" aria-atomic="true"></div>
          <input id="open-project-input" type="file" accept=".l2g,application/zip" hidden />
          <div id="overflow-menu" class="menu" role="menu" hidden>
            <button role="menuitem" data-project-action="new">New project</button>
            <button role="menuitem" data-project-action="open">Open .l2g</button>
            <button role="menuitem" data-project-action="save">Save</button>
            <button role="menuitem" data-project-action="save-as">Save As</button>
            <button role="menuitem" data-project-action="backup">Create verified backup</button>
            <button role="menuitem" data-project-action="checkpoint">Create checkpoint</button>
            <button role="menuitem" data-project-action="history">Show history</button>
          </div>
          <dialog id="generic-dialog" aria-labelledby="dialog-title"><div id="dialog-content"></div></dialog>
        </div>`;
      this.attachEvents();
    }

    protected workspaceActions(workspace: WorkspaceId, advisor: boolean): string {
      const common = `<button id="inspector-button" class="secondary-button" aria-expanded="${this.store.document.state.inspector_open}">Context</button>`;
      if (workspace === "pre-engagement" && advisor) return `<button id="add-participant-button" class="primary-button">Add participant</button>${common}`;
      if (workspace === "reviews-actions" && advisor) return `<button id="create-checkpoint-button" class="primary-button">Create checkpoint</button>${common}`;
      return common;
    }

    protected renderWorkspace(workspace: WorkspaceId, advisor: boolean): string {
      switch (workspace) {
        case "overview": return this.renderOverview();
        case "pre-engagement": return this.renderPreEngagement(advisor);
        case "deliverables": return this.renderDeliverables();
        case "reviews-actions": return this.renderReviewsActions(advisor);
        default: return this.renderEmptyWorkspace(workspace);
      }
    }

    protected renderOverview(): string {
      const document = this.store.document;
      const participantCount = document.state.engagement.participants.filter(item => document.state.profile !== "client" || item.visibility === "client-safe").length;
      const reviewCount = this.reviewAttentionCount();
      return `<section class="dashboard" aria-label="Engagement overview">
        <article class="stage-card wide"><p class="eyebrow">Engagement position</p><h2>${escapeHtml(document.state.engagement.phase || "Foundation")}</h2><div class="milestone-strip" aria-label="Foundation milestones"><span class="done">Planning</span><span class="active">Foundation</span><span>Workflow prototype</span><span>Bounded migration</span></div><p>This release validates application and project lifecycle foundations. It does not calculate readiness or compliance.</p></article>
        <article class="next-work"><p class="eyebrow">Recommended next work</p><h2>Complete foundation verification</h2><p>Exercise save, recovery, Undo/Redo, profiles, archive rejection, accessibility, and Windows file-origin behavior.</p><button class="primary-button" data-workspace-link="pre-engagement">Review engagement identity</button></article>
        <article><p class="eyebrow">Participants</p><div class="metric">${participantCount}</div><p>Low-authority synthetic participants in the project.</p></article>
        <article><p class="eyebrow">Review attention</p><div class="metric">${reviewCount}</div><p>Synthetic transition examples awaiting disposition.</p></article>
        <article><p class="eyebrow">History events</p><div class="metric">${document.history.length}</div><p>Append-oriented project actions and reversals.</p></article>
        <article><p class="eyebrow">Checkpoints</p><div class="metric">${document.checkpoints.length}</div><p>Named restoration boundaries retained in the project.</p></article>
        <article class="wide"><p class="eyebrow">Safety boundary</p><h2>Synthetic-only foundation</h2><p>No client data, FCI, CUI, secrets, or production suitability claim is permitted. Evidence remains reference-only and production modules remain authoritative.</p></article>
      </section>`;
    }

    protected renderPreEngagement(advisor: boolean): string {
      const engagement = this.store.document.state.engagement;
      const profile = this.store.document.state.profile;
      const participants = engagement.participants.filter(item => profile !== "client" || item.visibility === "client-safe");
      const disabled = advisor ? "" : "disabled";
      return `<section class="workbench">
        <div class="form-card"><h2>Engagement identity</h2><p class="supporting">Low-authority foundation records only. These values do not create authoritative scope or assessment conclusions.</p>
          <div class="field-grid">
            ${field("Engagement name", "engagement_name", engagement.engagement_name, disabled)}
            ${field("Client name", "client_name", engagement.client_name, disabled)}
            ${field("System name", "system_name", engagement.system_name, disabled)}
            ${field("Phase", "phase", engagement.phase, disabled)}
          </div>
          <label class="field full"><span>Objectives</span><textarea data-engagement-field="objectives" ${disabled}>${escapeHtml(engagement.objectives)}</textarea></label>
        </div>
        <div class="list-card"><div class="section-title"><div><h2>Participants</h2><p>${participants.length} visible in ${escapeHtml(profile)} profile.</p></div></div>
          ${participants.length ? `<div class="record-list">${participants.map(item => `<article class="record-card" data-participant-id="${item.id}"><div><h3>${escapeHtml(item.name || "Unnamed participant")}</h3><p>${escapeHtml(item.role || "No role")} · ${escapeHtml(item.organization || "No organization")}</p></div><div class="record-meta"><span class="chip">${escapeHtml(item.visibility)}</span>${advisor ? `<button class="text-button" data-remove-participant="${item.id}">Remove</button>` : ""}</div></article>`).join("")}</div>` : `<div class="empty-state"><h3>No participants added</h3><p>Add synthetic participants to validate stable IDs, profile visibility, save, history, and recovery.</p>${advisor ? `<button class="primary-button" id="empty-add-participant">Add participant</button>` : ""}</div>`}
        </div>
      </section>`;
    }

    protected renderDeliverables(): string {
      const registry = window.__L2G_CONTRACT_REGISTRY__;
      return `<section><div class="notice"><strong>Read-only compatibility catalog</strong><p>This foundation displays current registry metadata but does not import, export, translate, promote, or mutate legacy contracts.</p></div><div class="table-wrap" tabindex="0"><table><caption>Current contract registry ${escapeHtml(registry.registry_version)}</caption><thead><tr><th>Package kind</th><th>Version</th><th>Producer</th><th>Consumers</th><th>Stability</th></tr></thead><tbody>${registry.contracts.map(contract => `<tr><td><code>${escapeHtml(contract.package_kind)}</code></td><td>${escapeHtml(contract.version)}</td><td>${escapeHtml(contract.producer)}</td><td>${escapeHtml(contract.consumers.join(", "))}</td><td><span class="chip">${escapeHtml(contract.stability)}</span></td></tr>`).join("")}</tbody></table></div></section>`;
    }

    protected renderReviewsActions(advisor: boolean): string {
      const record = this.store.document.state.reviews_actions;
      const history = [...this.store.document.history].reverse().slice(0, 12);
      return `<section class="workbench"><div class="list-card"><h2>Transition inbox</h2><p class="supporting">Synthetic examples demonstrate separate lifecycle, review, operational, and visibility dimensions.</p><div class="record-list">${record.examples.map(item => `<article class="review-card"><div><p class="eyebrow">${escapeHtml(item.source_domain)} → ${escapeHtml(item.target_domain)}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.rationale)}</p><div class="chip-row"><span class="chip">${escapeHtml(item.lifecycle)}</span><span class="chip">${escapeHtml(item.review_state)}</span><span class="chip">${escapeHtml(item.operational_state)}</span><span class="chip">${escapeHtml(item.visibility)}</span></div></div>${advisor ? `<div class="review-actions"><button data-review-action="approve" data-review-id="${item.id}" class="primary-button">Approve example</button><button data-review-action="request" data-review-id="${item.id}" class="secondary-button">Request changes</button></div>` : ""}</article>`).join("")}</div></div><div class="list-card"><h2>Recent history</h2><ol class="history-list">${history.map(event => `<li><time>${escapeHtml(formatDate(event.timestamp))}</time><strong>${escapeHtml(event.summary)}</strong><span>${escapeHtml(event.profile)} · ${escapeHtml(event.action)}</span></li>`).join("")}</ol>${this.store.document.checkpoints.length ? `<h3>Checkpoints</h3><div class="record-list">${this.store.document.checkpoints.slice().reverse().map(checkpoint => `<article class="record-card"><div><strong>${escapeHtml(checkpoint.name)}</strong><p>${escapeHtml(formatDate(checkpoint.created_at))}</p></div>${advisor ? `<button class="secondary-button" data-restore-checkpoint="${checkpoint.checkpoint_id}">Restore</button>` : ""}</article>`).join("")}</div>` : ""}</div></section>`;
    }

    protected renderEmptyWorkspace(workspace: WorkspaceId): string {
      const item = WORKSPACES.find(entry => entry.id === workspace)!;
      return `<section class="empty-state large"><div class="empty-icon" aria-hidden="true">${item.icon}</div><h2>${escapeHtml(item.label)} foundation shell</h2><p>${escapeHtml(item.description)}</p><p>Existing standalone modules and validated contracts remain unchanged and authoritative during progressive migration.</p><button class="secondary-button" data-workspace-link="overview">Return to Overview</button></section>`;
    }

    protected renderInspector(): string {
      const document = this.store.document;
      const workspace = WORKSPACES.find(item => item.id === document.state.active_workspace)!;
      return `<div class="inspector-content"><section><p class="eyebrow">Current context</p><h2>${escapeHtml(workspace.label)}</h2><p>${escapeHtml(workspace.description)}</p></section><section><h3>Project identity</h3><dl><dt>Kind</dt><dd><code>${escapeHtml(document.manifest.kind)}</code></dd><dt>Project ID</dt><dd><code>${escapeHtml(document.manifest.project_id)}</code></dd><dt>Updated</dt><dd>${escapeHtml(formatDate(document.manifest.updated_at))}</dd><dt>Evidence policy</dt><dd>${escapeHtml(document.manifest.evidence_policy)}</dd><dt>Encryption</dt><dd>${escapeHtml(document.manifest.encryption_mode)}</dd></dl></section><section><h3>Compatibility baseline</h3><code class="hash">${escapeHtml(document.manifest.application.product_runtime_compatibility_baseline)}</code></section><section><h3>Important qualification</h3><p>Advisor, Client, and Reviewer are presentation profiles in the offline edition. Client-safe distribution requires a separately governed curated export.</p></section></div>`;
    }
  }
}
