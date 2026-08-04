namespace L2G {
  const WORKSPACE_DEFINITIONS: Array<{ id: WorkspaceId; label: string; icon: string; description: string }> = [
    { id: "overview", label: "Overview", icon: "⌂", description: "Engagement awareness, factual next work, project protection, and recovery state." },
    { id: "pre-engagement", label: "Pre-Engagement", icon: "◫", description: "Authoritative engagement identity, participants, organizations, planning context, and candidate review." },
    { id: "evidence", label: "Evidence", icon: "▤", description: "Read-only engagement context for the future Evidence vertical slice." },
    { id: "scope", label: "Scope", icon: "◇", description: "Read-only engagement context; no authoritative scope boundary is created here." },
    { id: "practice-review", label: "Practice Review", icon: "☑", description: "Read-only engagement context; no practice conclusion or score is calculated." },
    { id: "ssp", label: "SSP", icon: "▣", description: "Read-only engagement context; governed SSP content remains excluded." },
    { id: "deliverables", label: "Deliverables", icon: "⇩", description: "Read-only engagement and compatibility projections for future outputs." },
    { id: "reviews-actions", label: "Reviews & Actions", icon: "!", description: "Candidate decisions, unresolved planning records, checkpoints, and append-oriented history." }
  ];

  class App {
    private store = new ProjectStore(createNewProject());
    private recovery = new RecoveryStore();
    private protection: SessionProtection = {};
    private saveState = "Encrypted recovery unavailable until a passphrase is created";
    private recoveryTimer: number | undefined;
    private migrationRequired = false;

    constructor(private readonly root: HTMLElement) {
      this.store.subscribe(() => {
        this.saveState = this.protection.baseKey ? "Changes pending encrypted recovery" : "Unprotected session; encrypted recovery unavailable";
        this.render();
        this.scheduleRecovery();
      });
    }

    async start(): Promise<void> {
      this.render();
      try {
        const record = await this.recovery.load();
        if (record) this.showRecoveryUnlock(record);
      } catch (error) {
        this.toast(`Recovery could not be read: ${errorMessage(error)}`, "warning");
      }
    }

    private render(): void {
      const documentValue = this.store.document;
      const state = documentValue.state;
      const profile = state.profile;
      const advisor = profile === "advisor";
      const workspace = WORKSPACE_DEFINITIONS.find(item => item.id === state.active_workspace) ?? WORKSPACE_DEFINITIONS[0]!;
      const projection = buildEngagementProjection(state.engagement, workspace.id, profile);
      const protectedSession = Boolean(this.protection.baseKey);
      const profileLabel = profile[0]!.toUpperCase() + profile.slice(1);
      const inspectorAllowed = profile !== "client";
      if (!inspectorAllowed) state.inspector_open = false;
      this.root.innerHTML = `<div class="app-shell profile-${profile}" data-testid="app-shell">
        <a class="skip-link" href="#workspace-main">Skip to workspace</a>
        <header class="top-bar">
          <button class="icon-button" id="rail-toggle" aria-label="${state.rail_collapsed ? "Expand" : "Collapse"} navigation rail">☰</button>
          <div class="engagement-identity"><strong id="top-engagement-name">${escapeHtml(projection.identity.engagement_name || "Untitled engagement")}</strong><span>${escapeHtml(projection.identity.phase)} · ${escapeHtml(projection.identity.target_level)}</span></div>
          <span class="protection-badge ${protectedSession ? "protected" : "unprotected"}" data-testid="protection-state">${protectedSession ? "🔒 Encrypted session" : "⚠ Unprotected session"}</span>
          <div class="save-state" role="status" aria-live="polite" data-testid="save-state">${escapeHtml(this.saveState)}</div>
          <div class="top-actions">
            <button id="undo" class="icon-button" ${this.store.canUndo && advisor ? "" : "disabled"} aria-label="Undo${this.store.undoDescription ? ` ${escapeAttr(this.store.undoDescription)}` : ""}">↶</button>
            <button id="redo" class="icon-button" ${this.store.canRedo && advisor ? "" : "disabled"} aria-label="Redo${this.store.redoDescription ? ` ${escapeAttr(this.store.redoDescription)}` : ""}">↷</button>
            <label class="profile-control"><span class="sr-only">Presentation profile</span><select id="profile-select" aria-label="Presentation profile">${["advisor", "client", "reviewer"].map(item => `<option value="${item}" ${item === profile ? "selected" : ""}>${item[0]!.toUpperCase() + item.slice(1)}</option>`).join("")}</select></label>
            <button id="help" class="icon-button" aria-label="Open help">?</button>
            <button id="overflow" class="icon-button" aria-label="Open project actions" aria-haspopup="menu">⋯</button>
          </div>
        </header>
        <div class="profile-banner" role="status"><strong>${profileLabel} View</strong> · Presentation profile only—not a security boundary.${profile === "client" ? " Client-safe records are filtered before rendering." : ""}</div>
        <div class="body-grid">
          <nav class="nav-rail ${state.rail_collapsed ? "collapsed" : ""}" aria-label="Primary workspaces"><div class="rail-items">${WORKSPACE_DEFINITIONS.map(item => `<button class="nav-item ${item.id === state.active_workspace ? "active" : ""}" data-workspace="${item.id}" aria-current="${item.id === state.active_workspace ? "page" : "false"}"><span class="nav-icon">${item.icon}</span><span class="nav-label">${escapeHtml(item.label)}</span></button>`).join("")}</div><button id="about" class="nav-item rail-bottom"><span class="nav-icon">ⓘ</span><span class="nav-label">About</span></button></nav>
          <main id="workspace-main" class="workspace" tabindex="-1"><header class="workspace-header"><div><p class="eyebrow">${profileLabel} View · Synthetic-only v0.3</p><h1>${escapeHtml(workspace.label)}</h1><p>${escapeHtml(workspace.description)}</p></div><div class="workspace-actions">${workspace.id === "pre-engagement" && advisor ? '<button id="add-participant" class="primary-button">Add participant</button>' : ""}${inspectorAllowed ? '<button id="context" class="secondary-button">Context</button>' : ""}</div></header>${this.workspace(workspace.id, projection, advisor)}</main>
          ${inspectorAllowed ? `<aside class="inspector ${state.inspector_open ? "open" : ""}" aria-label="Context inspector" aria-hidden="${!state.inspector_open}" ${state.inspector_open ? "" : "inert"}><div class="inspector-header"><strong>Context inspector</strong><button id="close-inspector" class="icon-button" aria-label="Close inspector">×</button></div>${this.inspector(projection)}</aside>` : ""}
        </div>
        <div id="toast-region" class="toast-region" aria-live="polite"></div>
        <input id="open-input" type="file" accept=".l2g,application/zip" hidden>
        <div id="menu" class="menu" role="menu" hidden>
          <button role="menuitem" data-action="new">New synthetic project</button>
          <button role="menuitem" data-action="open">Open .l2g</button>
          <button role="menuitem" data-action="save">Save encrypted project</button>
          <button role="menuitem" data-action="backup">Create encrypted backup</button>
          <button role="menuitem" data-action="checkpoint" ${advisor ? "" : "disabled"}>Create checkpoint</button>
          <button role="menuitem" data-action="lock" ${protectedSession ? "" : "disabled"}>Lock project</button>
          <button role="menuitem" data-action="clear-recovery">Clear browser recovery</button>
        </div>
        <dialog id="dialog" aria-labelledby="dialog-title"><div id="dialog-content"></div></dialog>
      </div>`;
      this.attach();
    }

    private workspace(workspace: WorkspaceId, projection: EngagementProjection, advisor: boolean): string {
      if (workspace === "overview") return this.overview(projection);
      if (workspace === "pre-engagement") return this.preEngagement(projection, advisor);
      if (workspace === "reviews-actions") return this.reviews(projection, advisor);
      if (workspace === "deliverables") return this.deliverables(projection);
      return this.readOnlyProjection(workspace, projection);
    }

    private overview(projection: EngagementProjection): string {
      const protectedSession = Boolean(this.protection.baseKey);
      return `<section class="dashboard">
        <article class="wide"><p class="eyebrow">Engagement stage</p><h2>${escapeHtml(projection.identity.phase)}</h2><p>${escapeHtml(projection.identity.delivery_context)}</p>${this.migrationRequired ? '<div class="notice"><strong>Migration checkpoint created</strong><p>Save this project to complete migration into the v0.3 application identity.</p></div>' : ""}</article>
        <article class="next-work"><p class="eyebrow">Next work</p><h2>${escapeHtml(projection.next_work[0]?.title ?? "No next work")}</h2><p>${escapeHtml(projection.next_work[0]?.detail ?? "")}</p></article>
        <article><p class="eyebrow">Participants</p><div class="metric">${projection.participants.length}</div><p>Visible in this profile.</p></article>
        <article><p class="eyebrow">Open questions</p><div class="metric">${projection.open_questions.filter(item => item.status === "open").length}</div><p>Visible unresolved questions.</p></article>
        <article><p class="eyebrow">Milestones</p><div class="metric">${projection.milestones.filter(item => !["completed", "cancelled"].includes(item.operational_state)).length}</div><p>Active visible milestones.</p></article>
        <article><p class="eyebrow">Protection</p><div class="metric">${protectedSession ? "ON" : "OFF"}</div><p>${protectedSession ? "Encrypted recovery is available." : "Create an encrypted save first."}</p></article>
        <article class="wide"><p class="eyebrow">Factual next-work projection</p><ol class="next-work-list">${projection.next_work.map(item => `<li><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.detail)}</span></li>`).join("")}</ol></article>
        <article><p class="eyebrow">Release boundary</p><h2>Synthetic-only</h2><p>No readiness, compliance, scoring, certification, evidence sufficiency, or Met/Not Met conclusion is calculated.</p></article>
      </section>`;
    }

    private preEngagement(projection: EngagementProjection, advisor: boolean): string {
      const identity = projection.identity;
      return `<section class="workbench"><div class="form-card"><h2>Accepted engagement identity</h2><p class="supporting">User-facing names are editable labels, not record identifiers.</p><div class="field-grid">
        ${this.field("Engagement name", "engagement_name", identity.engagement_name, advisor)}${this.field("Client name", "client_name", identity.client_name, advisor)}${this.field("System or program", "system_name", identity.system_name, advisor)}
        <label class="field"><span>Phase</span><select data-identity="phase" ${advisor ? "" : "disabled"}>${["planning","discovery","scoping","practice-review","ssp-development","delivery","review","closed"].map(value => `<option value="${value}" ${value === identity.phase ? "selected" : ""}>${value}</option>`).join("")}</select></label>
        <label class="field"><span>Target level</span><select data-identity="target_level" ${advisor ? "" : "disabled"}>${["CMMC Level 2","CMMC Level 1","Other","Not specified"].map(value => `<option value="${value}" ${value === identity.target_level ? "selected" : ""}>${value}</option>`).join("")}</select></label>
        ${this.field("Start date", "start_date", identity.start_date, advisor, "date")}${this.field("Target end date", "target_end_date", identity.target_end_date, advisor, "date")}
      </div><label class="field full"><span>Delivery context</span><textarea data-identity="delivery_context" ${advisor ? "" : "disabled"}>${escapeHtml(identity.delivery_context)}</textarea></label><label class="field full"><span>Objectives</span><textarea data-identity="objectives" ${advisor ? "" : "disabled"}>${escapeHtml(identity.objectives)}</textarea></label></div>
      <div class="list-card"><div class="section-title"><div><h2>Participants</h2><p>Only records visible to the active profile are rendered.</p></div></div>${this.recordList(projection.participants.map(item => ({ id: item.participant_id, title: item.display_name, detail: `${item.role}${item.organization_ref ? ` · ${this.organizationName(projection, item.organization_ref)}` : ""}`, visibility: item.visibility })), "No visible participants")}</div>
      <div class="list-card"><h2>Organizations</h2>${this.recordList(projection.organizations.map(item => ({ id: item.organization_id, title: item.name, detail: `${item.relationship} · ${item.status}`, visibility: item.visibility })), "No visible organizations")}</div>
      <div class="list-card"><h2>Planning records</h2>${this.recordList([
        ...projection.assumptions.map(item => ({ id: item.assumption_id, title: item.title, detail: `Assumption · ${item.status}`, visibility: item.visibility })),
        ...projection.decisions.map(item => ({ id: item.decision_id, title: item.title, detail: `Decision · ${item.status}`, visibility: item.visibility })),
        ...projection.open_questions.map(item => ({ id: item.question_id, title: item.title, detail: `Question · ${item.status}`, visibility: item.visibility })),
        ...projection.constraints.map(item => ({ id: item.constraint_id, title: item.title, detail: `Constraint · ${item.status}`, visibility: item.visibility }))
      ], "No visible planning records")}</div></section>`;
    }

    private field(label: string, name: string, value: string, enabled: boolean, type = "text"): string { return `<label class="field"><span>${escapeHtml(label)}</span><input data-identity="${name}" type="${type}" value="${escapeAttr(value)}" ${enabled ? "" : "disabled"} maxlength="${["delivery_context","objectives"].includes(name) ? "8000" : "200"}"></label>`; }

    private recordList(records: Array<{ id: string; title: string; detail: string; visibility: Visibility }>, empty: string): string {
      if (!records.length) return `<div class="empty-state"><h3>${escapeHtml(empty)}</h3></div>`;
      return `<div class="record-list">${records.map(item => `<article class="record-card"><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.detail)}</p></div><div class="record-meta"><span class="chip">${escapeHtml(item.visibility)}</span></div></article>`).join("")}</div>`;
    }

    private reviews(projection: EngagementProjection, advisor: boolean): string {
      const candidates = projection.candidates;
      const history = [...this.store.document.history].reverse().slice(0, 20);
      return `<section class="workbench"><div class="list-card"><h2>Engagement candidates</h2>${candidates.length ? `<div class="record-list">${candidates.map(candidate => `<article class="candidate-card" data-candidate-card="${candidate.candidate_id}"><div><p class="eyebrow">${escapeHtml(candidate.target_type)} · ${escapeHtml(candidate.state)}</p><h3>${escapeHtml(candidate.source_kind)}</h3><p>${escapeHtml(candidate.rationale)}</p><pre class="candidate-diff">${escapeHtml(JSON.stringify(candidate.proposed_fields, null, 2))}</pre></div>${advisor && candidate.state === "candidate" ? `<div class="candidate-actions"><button class="primary-button" data-candidate-action="accept" data-id="${candidate.candidate_id}">Accept</button><button class="secondary-button" data-candidate-action="modify" data-id="${candidate.candidate_id}">Modify</button><button class="secondary-button" data-candidate-action="reject" data-id="${candidate.candidate_id}">Reject</button><button class="text-button" data-candidate-action="supersede" data-id="${candidate.candidate_id}">Supersede</button></div>` : ""}</article>`).join("")}</div>` : '<div class="empty-state"><h3>No candidates visible</h3><p>Client View never receives candidates or hidden candidate counts.</p></div>'}</div>
      <div class="list-card"><h2>Milestones and blockers</h2>${this.recordList([...projection.milestones.map(item => ({ id: item.milestone_id, title: item.title, detail: `${item.operational_state} · ${item.target_date || "no date"}`, visibility: item.visibility })), ...projection.blockers.map(item => ({ id: item.blocker_id, title: item.title, detail: `${item.severity} · ${item.operational_state}`, visibility: item.visibility }))], "No visible milestones or blockers")}</div>
      <div class="list-card"><h2>Recent append-oriented history</h2><ol class="history-list">${history.map(event => `<li><time>${escapeHtml(new Date(event.timestamp).toLocaleString())}</time><strong>${escapeHtml(event.summary)}</strong><span>${escapeHtml(event.profile)} · ${escapeHtml(event.action)}</span></li>`).join("")}</ol>${this.store.document.checkpoints.length ? `<h3>Checkpoints</h3>${[...this.store.document.checkpoints].reverse().map(checkpoint => `<article class="record-card"><div><strong>${escapeHtml(checkpoint.name)}</strong><p>${escapeHtml(new Date(checkpoint.created_at).toLocaleString())}</p></div>${advisor ? `<button class="secondary-button" data-restore="${checkpoint.checkpoint_id}">Restore</button>` : ""}</article>`).join("")}` : ""}</div></section>`;
    }

    private deliverables(projection: EngagementProjection): string {
      const registry = window.__L2G_CONTRACT_REGISTRY__;
      return `<section><div class="notice"><strong>Read-only compatibility catalog</strong><p>v0.3 does not migrate or mutate standalone contracts or output generators.</p></div>${this.readOnlyProjection("deliverables", projection)}<div class="table-wrap" tabindex="0"><table><caption>Compatibility registry ${escapeHtml(registry.registry_version)}</caption><thead><tr><th>Package kind</th><th>Version</th><th>Producer</th><th>Stability</th></tr></thead><tbody>${registry.contracts.map(contract => `<tr><td><code>${escapeHtml(String(contract.package_kind ?? ""))}</code></td><td>${escapeHtml(String(contract.version ?? ""))}</td><td>${escapeHtml(String(contract.producer ?? ""))}</td><td><span class="chip">${escapeHtml(String(contract.stability ?? ""))}</span></td></tr>`).join("")}</tbody></table></div></section>`;
    }

    private readOnlyProjection(workspace: WorkspaceId, projection: EngagementProjection): string {
      const definition = WORKSPACE_DEFINITIONS.find(item => item.id === workspace)!;
      return `<section class="projection-card"><p class="eyebrow">Immutable engagement projection</p><h2>${escapeHtml(definition.label)} context</h2><p>${escapeHtml(projection.identity.engagement_name)} · ${escapeHtml(projection.identity.phase)} · ${escapeHtml(projection.identity.target_level)}</p><div class="chip-row"><span class="chip">${projection.participants.length} participants</span><span class="chip">${projection.open_questions.filter(item => item.status === "open").length} open questions</span><span class="chip">${projection.milestones.length} milestones</span><span class="chip">${projection.blockers.length} blockers</span></div><div class="notice"><strong>Authority boundary</strong><p>This workspace receives a frozen copy. It cannot silently mutate Engagement authority and creates no domain conclusion in v0.3.</p></div><p class="projection-meta">Projection: <code>${escapeHtml(projection.projection_kind)}</code> · source: ${escapeHtml(projection.source_engagement_id)} · profile: ${escapeHtml(projection.profile)}</p></section>`;
    }

    private inspector(projection: EngagementProjection): string {
      const provenance = projection.profile === "reviewer" ? `<p><strong>Visible source records</strong></p><p>${projection.source_record_ids.length} record identifiers are included in this Reviewer projection.</p>` : "";
      return `<div class="prose"><p><strong>Project ID</strong></p><code class="hash">${escapeHtml(this.store.document.manifest.project_id)}</code><p><strong>Engagement ID</strong></p><code class="hash">${escapeHtml(projection.source_engagement_id)}</code><p><strong>Projection policy</strong></p><p>Deep-cloned and frozen before workspace delivery.</p>${provenance}<p><strong>Data boundary</strong></p><p>Synthetic-only. Project encryption does not authorize client data, FCI, or CUI.</p></div>`;
    }

    private organizationName(projection: EngagementProjection, identifier: string): string { return projection.organizations.find(item => item.organization_id === identifier)?.name ?? "Organization"; }

    private attach(): void {
      this.by("rail-toggle").onclick = () => { this.store.document.state.rail_collapsed = !this.store.document.state.rail_collapsed; this.render(); };
      this.by("undo").onclick = () => this.store.undo();
      this.by("redo").onclick = () => this.store.redo();
      this.by("profile-select").onchange = event => { this.store.document.state.profile = (event.target as HTMLSelectElement).value as PresentationProfile; this.store.document.state.inspector_open = false; this.render(); };
      this.by("help").onclick = () => this.help();
      this.by("about").onclick = () => this.about();
      this.by("overflow").onclick = () => { const menu = this.by("menu"); menu.hidden = !menu.hidden; };
      document.getElementById("context")?.addEventListener("click", () => { this.store.document.state.inspector_open = !this.store.document.state.inspector_open; this.render(); });
      document.getElementById("close-inspector")?.addEventListener("click", () => { this.store.document.state.inspector_open = false; this.render(); });
      document.querySelectorAll<HTMLElement>("[data-workspace]").forEach(button => button.onclick = () => { this.store.document.state.active_workspace = button.dataset.workspace as WorkspaceId; this.render(); });
      document.querySelectorAll<HTMLElement>("[data-action]").forEach(button => button.onclick = () => void this.action(button.dataset.action!));
      this.by("open-input").onchange = event => void this.openSelected(event);
      document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("[data-identity]").forEach(input => input.onchange = () => this.updateIdentity(input.dataset.identity!, input.value));
      document.getElementById("add-participant")?.addEventListener("click", () => this.addParticipantDialog());
      document.querySelectorAll<HTMLElement>("[data-candidate-action]").forEach(button => button.onclick = () => this.candidateDialog(button.dataset.id!, button.dataset.candidateAction!));
      document.querySelectorAll<HTMLElement>("[data-restore]").forEach(button => button.onclick = () => { if (confirm("Restore this checkpoint?")) { this.store.restoreCheckpoint(button.dataset.restore!); this.toast("Checkpoint restored; history retained.", "success"); } });
    }

    private updateIdentity(name: string, value: string): void {
      if (this.store.document.state.profile !== "advisor") return;
      this.store.execute(`Update ${name.replace(/_/g, " ")}`, "engagement.identity.updated", "engagement", this.store.document.state.engagement.engagement_id, state => {
        const fields: Record<string, string> = {}; fields[name] = value;
        const temporary: CandidateRecord = { candidate_id: newId("candidate"), source_kind: "advisor-edit", source_ref: state.engagement.engagement_id, target_type: "identity", proposed_fields: fields, state: "candidate", rationale: "Direct Advisor edit", provenance: { source_kind: "advisor-edit", source_id: state.engagement.engagement_id, asserted_at: nowIso(), asserted_by: "advisor", confidence: "not-evaluated" }, visibility: "advisor-only" };
        state.engagement.candidates.push(temporary);
        decideCandidate(state.engagement, temporary.candidate_id, "accept", "Direct Advisor edit applied through an Engagement-owned command.", "advisor");
      });
    }

    private addParticipantDialog(): void {
      const organizations = this.store.document.state.engagement.organizations;
      this.dialog("Add synthetic participant", `<form id="participant-form" class="dialog-form"><label class="field"><span>Name</span><input id="p-name" required maxlength="200"></label><label class="field"><span>Role</span><input id="p-role" maxlength="200"></label><label class="field"><span>Organization</span><select id="p-org">${organizations.map(item => `<option value="${item.organization_id}">${escapeHtml(item.name)}</option>`).join("")}</select></label><label class="field"><span>Contact reference</span><input id="p-contact" maxlength="500" placeholder="synthetic:reference"></label><label class="field"><span>Visibility</span><select id="p-vis"><option value="advisor-only">Advisor-only</option><option value="client-safe">Client-safe</option><option value="approved-for-client-presentation">Approved for client presentation</option></select></label><div class="dialog-actions"><button type="button" data-close class="secondary-button">Cancel</button><button type="submit" class="primary-button">Add participant</button></div></form>`);
      this.by("participant-form").onsubmit = event => {
        event.preventDefault(); const timestamp = nowIso(); const identifier = newId("participant");
        const participant: ParticipantRecord = { participant_id: identifier, display_name: sanitizePlainText((this.by("p-name") as HTMLInputElement).value, 200), role: sanitizePlainText((this.by("p-role") as HTMLInputElement).value, 200), organization_ref: (this.by("p-org") as HTMLSelectElement).value, contact_reference: sanitizePlainText((this.by("p-contact") as HTMLInputElement).value, 500), participation_state: "active", visibility: (this.by("p-vis") as HTMLSelectElement).value as Visibility, provenance: { source_kind: "advisor-entry", source_id: identifier, asserted_at: timestamp, asserted_by: "advisor", confidence: "not-evaluated" }, created_at: timestamp, updated_at: timestamp };
        this.store.execute(`Add participant “${participant.display_name}”`, "engagement.participant.created", "participant", identifier, state => state.engagement.participants.push(participant));
        this.closeDialog();
      };
      this.by("participant-form").querySelector<HTMLElement>("[data-close]")!.onclick = () => this.closeDialog();
    }

    private candidateDialog(identifier: string, action: string): void {
      const candidate = this.store.document.state.engagement.candidates.find(item => item.candidate_id === identifier);
      if (!candidate || candidate.state !== "candidate") return;
      const fields = JSON.stringify(candidate.proposed_fields, null, 2);
      const edit = action === "modify" || action === "supersede";
      this.dialog(`${action[0]!.toUpperCase() + action.slice(1)} candidate`, `<form id="candidate-form" class="dialog-form"><p>Accepted Engagement state is unchanged until this command succeeds.</p>${edit ? `<label class="field"><span>${action === "modify" ? "Accepted fields" : "Replacement proposal"}</span><textarea id="candidate-fields">${escapeHtml(fields)}</textarea></label>` : `<pre class="candidate-diff">${escapeHtml(fields)}</pre>`}<label class="field"><span>Rationale</span><textarea id="candidate-rationale" required>${escapeHtml(candidate.rationale)}</textarea></label><div class="dialog-actions"><button type="button" data-close class="secondary-button">Cancel</button><button type="submit" class="primary-button">Confirm ${escapeHtml(action)}</button></div></form>`);
      this.by("candidate-form").onsubmit = event => {
        event.preventDefault();
        try {
          const rationale = (this.by("candidate-rationale") as HTMLTextAreaElement).value;
          let parsed: Record<string, string> | undefined;
          if (edit) {
            const raw = parseStrictJson((this.by("candidate-fields") as HTMLTextAreaElement).value);
            if (!isRecord(raw) || Object.values(raw).some(value => typeof value !== "string")) throw new Error("Candidate fields must be a JSON object containing string values.");
            parsed = raw as Record<string, string>;
          }
          this.store.execute(`${action} engagement candidate`, `engagement.candidate.${action}`, "candidate", identifier, state => {
            if (action === "supersede") supersedeCandidate(state.engagement, identifier, parsed!, rationale, "advisor");
            else decideCandidate(state.engagement, identifier, action as "accept" | "modify" | "reject", rationale, "advisor", parsed);
          });
          this.closeDialog(); this.toast(`Candidate ${action} command completed.`, "success");
        } catch (error) { this.toast(errorMessage(error), "error"); }
      };
      this.by("candidate-form").querySelector<HTMLElement>("[data-close]")!.onclick = () => this.closeDialog();
    }

    private async action(action: string): Promise<void> {
      this.by("menu").hidden = true;
      if (action === "new") {
        if (!confirm("Create a new synthetic project?")) return;
        this.protection = {}; this.migrationRequired = false; this.store.replaceDocument(createNewProject()); this.saveState = "Encrypted recovery unavailable until a passphrase is created"; this.render();
      } else if (action === "open") (this.by("open-input") as HTMLInputElement).click();
      else if (action === "save" || action === "backup") await this.save(action === "backup");
      else if (action === "checkpoint") { const name = prompt("Checkpoint name", `Checkpoint ${this.store.document.checkpoints.length + 1}`); if (name !== null) this.store.createCheckpoint(name); }
      else if (action === "lock") await this.lock();
      else if (action === "clear-recovery") { await this.recovery.clear(); this.saveState = "Browser recovery cleared"; this.render(); this.toast("Encrypted browser recovery cleared.", "success"); }
    }

    private async ensurePassphrase(): Promise<boolean> {
      if (this.protection.baseKey) return true;
      return new Promise(resolve => {
        this.dialog("Create project passphrase", `<form id="passphrase-form" class="dialog-form"><p>This passphrase protects portable project files and browser recovery. It cannot be reset or recovered.</p><label class="field"><span>Passphrase</span><input id="pass-one" type="password" autocomplete="new-password" required minlength="12"></label><label class="field"><span>Confirm passphrase</span><input id="pass-two" type="password" autocomplete="new-password" required minlength="12"></label><p class="passphrase-note">Use a unique passphrase of at least 12 characters.</p><div class="dialog-actions"><button type="button" data-cancel class="secondary-button">Cancel</button><button type="submit" class="primary-button">Create encrypted session</button></div></form>`);
        this.by("passphrase-form").onsubmit = event => {
          event.preventDefault(); const first = (this.by("pass-one") as HTMLInputElement).value; const second = (this.by("pass-two") as HTMLInputElement).value;
          if (first !== second) { this.toast("Passphrases do not match.", "error"); return; }
          try { validatePassphrase(first); } catch (error) { this.toast(errorMessage(error), "error"); return; }
          void importPassphrase(first).then(key => { this.protection.baseKey = key; this.closeDialog(); this.saveState = "Encrypted session active"; this.render(); resolve(true); });
        };
        this.by("passphrase-form").querySelector<HTMLElement>("[data-cancel]")!.onclick = () => { this.closeDialog(); resolve(false); };
      });
    }

    private async save(backup: boolean): Promise<void> {
      try {
        if (!await this.ensurePassphrase()) return;
        this.saveState = "Encrypting project…"; this.render();
        const result = await encryptProject(this.store.document, this.protection.baseKey!, "portable-project");
        this.protection.portableKey = result.key; this.protection.portableSalt = result.salt; await this.persistRecovery();
        const filename = safeFilename(this.store.document.manifest.project_id, backup); const blob = new Blob([result.bytes], { type: "application/vnd.l2g.encrypted-project" });
        if (window.showSaveFilePicker && !backup) { const handle = await window.showSaveFilePicker({ suggestedName: filename, types: [{ description: "Encrypted L2G project", accept: { "application/vnd.l2g.encrypted-project": [".l2g"] } }] }); const writable = await handle.createWritable(); await writable.write(blob); await writable.close(); this.saveState = "Encrypted project file saved and recovery current"; }
        else { triggerDownload(blob, filename); this.saveState = backup ? "Encrypted backup download initiated" : "Encrypted project download initiated"; }
        this.migrationRequired = false; this.render(); this.toast(this.saveState, "success");
      } catch (error) { this.saveState = "Encrypted save failed; current project remains open"; this.render(); this.toast(`Save failed: ${errorMessage(error)}`, "error"); }
    }

    private async openSelected(event: Event): Promise<void> {
      const input = event.target as HTMLInputElement; const file = input.files?.[0]; input.value = ""; if (!file) return;
      const bytes = new Uint8Array(await file.arrayBuffer()); const before = stableStringify(this.store.document, 0);
      try {
        if (isEncryptedPackage(bytes)) {
          const passphrase = await this.requestPassphrase("Unlock encrypted project"); if (passphrase === null) return;
          const result = await decryptProject(bytes, passphrase, "portable-project");
          this.protection = { baseKey: result.baseKey, portableKey: result.key, portableSalt: result.salt }; this.migrationRequired = result.migrated; this.store.replaceDocument(result.document); await this.persistRecovery(); this.saveState = result.migrated ? "Legacy encrypted project migrated; v0.3 save required" : "Encrypted project opened; recovery current"; this.render(); this.toast(this.saveState, result.migrated ? "warning" : "success");
        } else {
          const result = await deserializeInnerProject(bytes, true); if (!result.legacy) throw new Error("Only encrypted v0.3/v0.2 or valid v0.1 synthetic projects are accepted.");
          this.protection = {}; this.migrationRequired = true; this.store.replaceDocument(result.document); this.saveState = "Legacy project migrated in memory; encrypted v0.3 save required"; this.render(); this.toast(this.saveState, "warning");
        }
      } catch (error) {
        if (stableStringify(this.store.document, 0) !== before) throw new Error("Governed state changed during a failed import.");
        this.saveState = "Open rejected; current project was not changed"; this.render(); this.toast(`Project rejected: ${errorMessage(error)}`, "error");
      }
    }

    private requestPassphrase(title: string): Promise<string | null> {
      return new Promise(resolve => {
        this.dialog(title, `<form id="unlock-form" class="dialog-form"><p>Wrong passphrases and modified encrypted content produce the same error.</p><label class="field"><span>Passphrase</span><input id="unlock-pass" type="password" autocomplete="current-password" required></label><div class="dialog-actions"><button type="button" data-cancel class="secondary-button">Cancel</button><button type="submit" class="primary-button">Unlock</button></div></form>`);
        this.by("unlock-form").onsubmit = event => { event.preventDefault(); const value = (this.by("unlock-pass") as HTMLInputElement).value; this.closeDialog(); resolve(value); };
        this.by("unlock-form").querySelector<HTMLElement>("[data-cancel]")!.onclick = () => { this.closeDialog(); resolve(null); };
      });
    }

    private showRecoveryUnlock(record: RecoveryRecord): void {
      this.dialog("Encrypted recovery available", `<div class="prose"><p>An encrypted browser recovery record from ${escapeHtml(new Date(record.saved_at).toLocaleString())} is available.</p><div class="dialog-actions"><button id="discard-recovery" class="secondary-button">Discard recovery</button><button id="unlock-recovery" class="primary-button">Unlock recovery</button></div></div>`);
      this.by("discard-recovery").onclick = () => void this.recovery.clear().then(() => { this.closeDialog(); this.toast("Encrypted recovery discarded.", "info"); });
      this.by("unlock-recovery").onclick = () => void this.requestPassphrase("Unlock encrypted recovery").then(async passphrase => {
        if (passphrase === null) return;
        try { const result = await decryptProject(new Uint8Array(record.bytes), passphrase, "browser-recovery"); this.protection = { baseKey: result.baseKey, recoveryKey: result.key, recoverySalt: result.salt }; this.store.replaceDocument(result.document); this.closeDialog(); this.saveState = "Encrypted recovery unlocked"; this.render(); this.toast("Encrypted recovery restored.", "success"); }
        catch (error) { this.toast(errorMessage(error), "error"); }
      });
    }

    private scheduleRecovery(): void { if (!this.protection.baseKey) return; if (this.recoveryTimer !== undefined) clearTimeout(this.recoveryTimer); this.recoveryTimer = window.setTimeout(() => void this.persistRecovery().catch(() => undefined), 750); }
    private async persistRecovery(): Promise<void> { if (!this.protection.baseKey) return; const result = await encryptProject(this.store.document, this.protection.baseKey, "browser-recovery"); this.protection.recoveryKey = result.key; this.protection.recoverySalt = result.salt; await this.recovery.save(result.bytes); this.saveState = "Saved in encrypted browser recovery; project file not necessarily written"; this.render(); }
    private async lock(): Promise<void> { if (!this.protection.baseKey || !confirm("Lock this project? Encrypted recovery will require the passphrase.")) return; try { await this.persistRecovery(); this.protection = {}; location.reload(); } catch (error) { this.toast(`Lock failed: ${errorMessage(error)}`, "error"); } }

    private help(): void { this.dialog("Engagement spine help", `<div class="prose"><h3>Authority</h3><p>Engagement owns identity, planning context, participants, organizations, assumptions, decisions, questions, constraints, milestones, blockers, and candidates. Other workspaces receive frozen projections.</p><h3>Client View</h3><p>Client-safe data is filtered before render. Presentation profiles remain presentation behavior, not access-control roles.</p><h3>Limitations</h3><p>Synthetic-only. No readiness, compliance, scoring, certification, evidence sufficiency, or Met/Not Met conclusion is produced.</p><div class="dialog-actions"><button data-close class="primary-button">Close</button></div></div>`); this.by("dialog-content").querySelector<HTMLElement>("[data-close]")!.onclick = () => this.closeDialog(); }
    private about(): void { const release = window.__L2G_RELEASE__; this.dialog("About L2G Integrated Suite", `<div class="prose"><dl><dt>Version</dt><dd>${escapeHtml(release.version)}</dd><dt>Engagement schema</dt><dd><code>${escapeHtml(release.engagement_schema_kind)}</code></dd><dt>Envelope</dt><dd><code>${escapeHtml(release.envelope_kind)}</code></dd><dt>Runtime</dt><dd>Single local HTML, no telemetry, no runtime network</dd><dt>Authorization</dt><dd>Synthetic-only; production/client/FCI/CUI use not authorized</dd></dl><div class="dialog-actions"><button data-close class="primary-button">Close</button></div></div>`); this.by("dialog-content").querySelector<HTMLElement>("[data-close]")!.onclick = () => this.closeDialog(); }
    private dialog(title: string, body: string): void { const dialog = this.by("dialog") as HTMLDialogElement; this.by("dialog-content").innerHTML = `<h2 id="dialog-title">${escapeHtml(title)}</h2>${body}`; if (!dialog.open) dialog.showModal(); }
    private closeDialog(): void { const dialog = this.by("dialog") as HTMLDialogElement; if (dialog.open) dialog.close(); }
    private toast(text: string, kind: "info" | "success" | "warning" | "error"): void { const region = document.getElementById("toast-region"); if (!region) return; const item = document.createElement("div"); item.className = `toast ${kind}`; item.textContent = text; region.append(item); setTimeout(() => item.remove(), 5000); }
    private by(identifier: string): HTMLElement { const element = document.getElementById(identifier); if (!element) throw new Error(`Missing element: ${identifier}`); return element; }
  }

  const root = document.getElementById("app");
  if (!root) throw new Error("Application root missing.");
  void new App(root).start();
}
