namespace L2G {
  const WORKSPACES: Array<{ id: WorkspaceId; label: string; icon: string; description: string }> = [
    { id: "overview", label: "Overview", icon: "⌂", description: "Engagement awareness, project protection, next work, and recovery state." },
    { id: "pre-engagement", label: "Pre-Engagement", icon: "◫", description: "Low-authority engagement identity, objectives, and participants." },
    { id: "evidence", label: "Evidence", icon: "▤", description: "Foundation shell only. Production ingestion and OCR remain excluded." },
    { id: "scope", label: "Scope", icon: "◇", description: "Foundation shell only. No authoritative scope decisions are created." },
    { id: "practice-review", label: "Practice Review", icon: "☑", description: "Foundation shell only. No CMMC conclusions are calculated." },
    { id: "ssp", label: "SSP", icon: "▣", description: "Foundation shell only. Governed SSP content remains standalone." },
    { id: "deliverables", label: "Deliverables", icon: "⇩", description: "Read-only compatibility catalog and future output boundary." },
    { id: "reviews-actions", label: "Reviews & Actions", icon: "!", description: "Synthetic review examples, checkpoints, and append-oriented history." }
  ];

  class App {
    private store = new ProjectStore(createNewProject());
    private recovery = new RecoveryStore();
    private protection: SessionProtection = {};
    private saveState = "Encrypted recovery unavailable until a passphrase is created";
    private recoveryTimer: number | undefined;
    private readOnly = false;
    private legacyMigration = false;

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
      const advisor = profile === "advisor" && !this.readOnly;
      const workspace = WORKSPACES.find(item => item.id === state.active_workspace) ?? WORKSPACES[0]!;
      const protectedSession = Boolean(this.protection.baseKey);
      const profileLabel = profile[0]!.toUpperCase() + profile.slice(1);
      this.root.innerHTML = `<div class="app-shell theme-system profile-${profile}" data-testid="app-shell">
        <a class="skip-link" href="#workspace-main">Skip to workspace</a>
        <header class="top-bar">
          <button class="icon-button" id="rail-toggle" aria-label="${state.rail_collapsed ? "Expand" : "Collapse"} navigation rail">☰</button>
          <div class="engagement-identity"><strong id="top-engagement-name">${escapeHtml(state.engagement.engagement_name || "Untitled engagement")}</strong><span>${escapeHtml(state.engagement.phase || "No phase")}</span></div>
          <span class="protection-badge ${protectedSession ? "protected" : "unprotected"}" data-testid="protection-state">${protectedSession ? "🔒 Encrypted session" : "⚠ Unprotected session"}</span>
          <div class="save-state" role="status" aria-live="polite" data-testid="save-state">${escapeHtml(this.saveState)}</div>
          <div class="top-actions">
            <button id="undo" class="icon-button" ${this.store.canUndo ? "" : "disabled"} aria-label="Undo${this.store.undoDescription ? ` ${escapeAttr(this.store.undoDescription)}` : ""}">↶</button>
            <button id="redo" class="icon-button" ${this.store.canRedo ? "" : "disabled"} aria-label="Redo${this.store.redoDescription ? ` ${escapeAttr(this.store.redoDescription)}` : ""}">↷</button>
            <label class="profile-control"><span class="sr-only">Presentation profile</span><select id="profile-select" aria-label="Presentation profile">${["advisor", "client", "reviewer"].map(item => `<option value="${item}" ${item === profile ? "selected" : ""}>${item[0]!.toUpperCase() + item.slice(1)}</option>`).join("")}</select></label>
            <button id="help" class="icon-button" aria-label="Open help">?</button>
            <button id="overflow" class="icon-button" aria-label="Open project actions" aria-haspopup="menu">⋯</button>
          </div>
        </header>
        <div class="profile-banner" role="status"><strong>${profileLabel} View</strong> · Presentation profile only—not a security boundary.${this.readOnly ? " Project is read-only." : ""}</div>
        <div class="body-grid">
          <nav class="nav-rail ${state.rail_collapsed ? "collapsed" : ""}" aria-label="Primary workspaces"><div class="rail-items">${WORKSPACES.map(item => `<button class="nav-item ${item.id === state.active_workspace ? "active" : ""}" data-workspace="${item.id}" aria-current="${item.id === state.active_workspace ? "page" : "false"}"><span class="nav-icon">${item.icon}</span><span class="nav-label">${escapeHtml(item.label)}</span></button>`).join("")}</div><button id="about" class="nav-item rail-bottom"><span class="nav-icon">ⓘ</span><span class="nav-label">About</span></button></nav>
          <main id="workspace-main" class="workspace" tabindex="-1"><header class="workspace-header"><div><p class="eyebrow">${profileLabel} View · Synthetic-only v0.2</p><h1>${escapeHtml(workspace.label)}</h1><p>${escapeHtml(workspace.description)}</p></div><div class="workspace-actions">${workspace.id === "pre-engagement" && advisor ? '<button id="add-participant" class="primary-button">Add participant</button>' : ""}<button id="context" class="secondary-button">Context</button></div></header>${this.workspace(workspace.id, advisor)}</main>
          <aside class="inspector ${state.inspector_open ? "open" : ""}" aria-label="Context inspector" aria-hidden="${!state.inspector_open}" ${state.inspector_open ? "" : "inert"}><div class="inspector-header"><strong>Context inspector</strong><button id="close-inspector" class="icon-button" aria-label="Close inspector">×</button></div><div class="prose"><p><strong>Project ID</strong></p><code class="hash">${escapeHtml(documentValue.manifest.project_id)}</code><p><strong>Protection</strong></p><p>${protectedSession ? "A non-extractable session key is active. Portable saves and browser recovery are encrypted." : "No passphrase-derived key is active. Browser recovery is disabled."}</p><p><strong>Data boundary</strong></p><p>Synthetic-only. Client data, FCI, and CUI remain unauthorized.</p></div></aside>
        </div>
        <div id="toast-region" class="toast-region" aria-live="polite"></div>
        <input id="open-input" type="file" accept=".l2g,application/zip" hidden>
        <div id="menu" class="menu" role="menu" hidden>
          <button role="menuitem" data-action="new">New project</button>
          <button role="menuitem" data-action="open">Open .l2g</button>
          <button role="menuitem" data-action="save">Save encrypted project</button>
          <button role="menuitem" data-action="backup">Create encrypted backup</button>
          <button role="menuitem" data-action="checkpoint">Create checkpoint</button>
          <button role="menuitem" data-action="lock" ${protectedSession ? "" : "disabled"}>Lock project</button>
          <button role="menuitem" data-action="clear-recovery">Clear browser recovery</button>
        </div>
        <dialog id="dialog" aria-labelledby="dialog-title"><div id="dialog-content"></div></dialog>
      </div>`;
      this.attach();
    }

    private workspace(workspace: WorkspaceId, advisor: boolean): string {
      if (workspace === "overview") return this.overview();
      if (workspace === "pre-engagement") return this.preEngagement(advisor);
      if (workspace === "reviews-actions") return this.reviews(advisor);
      if (workspace === "deliverables") return this.deliverables();
      const item = WORKSPACES.find(entry => entry.id === workspace)!;
      return `<section class="empty-state large"><div class="empty-icon">${item.icon}</div><h2>${escapeHtml(item.label)} foundation shell</h2><p>${escapeHtml(item.description)}</p><p>v0.2 adds project confidentiality and recovery safeguards only; substantive domain migration remains excluded.</p></section>`;
    }

    private overview(): string {
      const documentValue = this.store.document;
      const protectedSession = Boolean(this.protection.baseKey);
      return `<section class="dashboard">
        <article class="stage-card wide"><p class="eyebrow">Project protection</p><h2>${protectedSession ? "Encrypted working session" : "Passphrase required before first save"}</h2><p>${protectedSession ? "Portable saves and browser recovery use AES-256-GCM with PBKDF2-HMAC-SHA-256 at 600,000 iterations." : "The active synthetic project exists only in memory. Create an encrypted save to enable encrypted recovery."}</p>${this.legacyMigration ? '<div class="notice"><strong>Legacy project imported</strong><p>Save now to migrate it into the encrypted v0.2 format.</p></div>' : ""}</article>
        <article class="next-work"><p class="eyebrow">Recommended next work</p><h2>${protectedSession ? "Create a verified encrypted backup" : "Create the first encrypted project file"}</h2><p>Forgotten passphrases cannot be reset or recovered.</p><button class="primary-button" data-quick="save">${protectedSession ? "Save encrypted project" : "Set passphrase and save"}</button></article>
        <article><p class="eyebrow">Participants</p><div class="metric">${documentValue.state.engagement.participants.length}</div><p>Synthetic participants.</p></article>
        <article><p class="eyebrow">History</p><div class="metric">${documentValue.history.length}</div><p>Append-oriented actions.</p></article>
        <article><p class="eyebrow">Checkpoints</p><div class="metric">${documentValue.checkpoints.length}</div><p>Named restoration boundaries.</p></article>
        <article><p class="eyebrow">Recovery</p><div class="metric">${protectedSession ? "ON" : "OFF"}</div><p>${protectedSession ? "Encrypted IndexedDB recovery enabled." : "No plaintext recovery is written."}</p></article>
        <article class="wide"><p class="eyebrow">Release boundary</p><h2>Synthetic-only encryption foundation</h2><p>Encryption is necessary but not sufficient for production authorization. This release does not authorize client data, FCI, CUI, readiness, compliance, scoring, certification, or Met/Not Met conclusions.</p></article>
      </section>`;
    }

    private preEngagement(advisor: boolean): string {
      const engagement = this.store.document.state.engagement;
      const profile = this.store.document.state.profile;
      const participants = engagement.participants.filter(item => profile !== "client" || item.visibility === "client-safe");
      const disabled = advisor ? "" : "disabled";
      return `<section class="workbench"><div class="form-card"><h2>Engagement identity</h2><p class="supporting">Low-authority synthetic records only.</p><div class="field-grid">${this.field("Engagement name", "engagement_name", engagement.engagement_name, disabled)}${this.field("Client name", "client_name", engagement.client_name, disabled)}${this.field("System name", "system_name", engagement.system_name, disabled)}${this.field("Phase", "phase", engagement.phase, disabled)}</div><label class="field full"><span>Objectives</span><textarea data-engagement="objectives" ${disabled}>${escapeHtml(engagement.objectives)}</textarea></label></div><div class="list-card"><div class="section-title"><div><h2>Participants</h2><p>${participants.length} visible in ${profile} profile.</p></div></div>${participants.length ? `<div class="record-list">${participants.map(item => `<article class="record-card"><div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.role)} · ${escapeHtml(item.organization)}</p></div><div class="record-meta"><span class="chip">${escapeHtml(item.visibility)}</span>${advisor ? `<button class="text-button" data-remove="${item.id}">Remove</button>` : ""}</div></article>`).join("")}</div>` : '<div class="empty-state"><h3>No participants added</h3><p>Add synthetic participants to validate encrypted persistence and profile visibility.</p></div>'}</div></section>`;
    }

    private field(label: string, name: string, value: string, disabled: string): string {
      return `<label class="field"><span>${escapeHtml(label)}</span><input data-engagement="${name}" value="${escapeAttr(value)}" ${disabled} maxlength="160"></label>`;
    }

    private reviews(advisor: boolean): string {
      const documentValue = this.store.document;
      return `<section class="workbench"><div class="list-card"><h2>Transition inbox</h2><div class="record-list">${documentValue.state.reviews_actions.examples.map(item => `<article class="review-card"><div><p class="eyebrow">${escapeHtml(item.source_domain)} → ${escapeHtml(item.target_domain)}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.rationale)}</p><div class="chip-row"><span class="chip">${item.lifecycle}</span><span class="chip">${item.review_state}</span><span class="chip">${item.operational_state}</span></div></div>${advisor ? `<div class="review-actions"><button class="primary-button" data-review="approve" data-id="${item.id}">Approve</button><button class="secondary-button" data-review="request" data-id="${item.id}">Request changes</button></div>` : ""}</article>`).join("")}</div></div><div class="list-card"><h2>Recent history</h2><ol class="history-list">${[...documentValue.history].reverse().slice(0, 15).map(event => `<li><time>${escapeHtml(new Date(event.timestamp).toLocaleString())}</time><strong>${escapeHtml(event.summary)}</strong><span>${escapeHtml(event.profile)} · ${escapeHtml(event.action)}</span></li>`).join("")}</ol>${documentValue.checkpoints.length ? `<h3>Checkpoints</h3>${[...documentValue.checkpoints].reverse().map(checkpoint => `<article class="record-card"><div><strong>${escapeHtml(checkpoint.name)}</strong><p>${escapeHtml(new Date(checkpoint.created_at).toLocaleString())}</p></div>${advisor ? `<button class="secondary-button" data-restore="${checkpoint.checkpoint_id}">Restore</button>` : ""}</article>`).join("")}` : ""}</div></section>`;
    }

    private deliverables(): string {
      const registry = window.__L2G_CONTRACT_REGISTRY__;
      return `<section><div class="notice"><strong>Read-only compatibility catalog</strong><p>v0.2 does not migrate or mutate legacy contracts.</p></div><div class="table-wrap" tabindex="0"><table><caption>Current contract registry ${escapeHtml(registry.registry_version)}</caption><thead><tr><th>Package kind</th><th>Version</th><th>Producer</th><th>Stability</th></tr></thead><tbody>${registry.contracts.map(contract => `<tr><td><code>${escapeHtml(String(contract.package_kind ?? ""))}</code></td><td>${escapeHtml(String(contract.version ?? ""))}</td><td>${escapeHtml(String(contract.producer ?? ""))}</td><td><span class="chip">${escapeHtml(String(contract.stability ?? ""))}</span></td></tr>`).join("")}</tbody></table></div></section>`;
    }

    private attach(): void {
      this.by("rail-toggle").onclick = () => { this.store.document.state.rail_collapsed = !this.store.document.state.rail_collapsed; this.render(); };
      this.by("undo").onclick = () => this.store.undo();
      this.by("redo").onclick = () => this.store.redo();
      this.by("profile-select").onchange = event => { this.store.document.state.profile = (event.target as HTMLSelectElement).value as PresentationProfile; this.store.document.state.inspector_open = false; this.render(); };
      this.by("help").onclick = () => this.help();
      this.by("about").onclick = () => this.about();
      this.by("overflow").onclick = () => { const menu = this.by("menu"); menu.hidden = !menu.hidden; };
      this.by("context").onclick = () => { this.store.document.state.inspector_open = !this.store.document.state.inspector_open; this.render(); };
      this.by("close-inspector").onclick = () => { this.store.document.state.inspector_open = false; this.render(); };
      document.querySelectorAll<HTMLElement>("[data-workspace]").forEach(button => button.onclick = () => { this.store.document.state.active_workspace = button.dataset.workspace as WorkspaceId; this.render(); });
      document.querySelectorAll<HTMLElement>("[data-action]").forEach(button => button.onclick = () => void this.action(button.dataset.action!));
      document.querySelectorAll<HTMLElement>("[data-quick]").forEach(button => button.onclick = () => void this.action(button.dataset.quick!));
      this.by("open-input").onchange = event => void this.openSelected(event);
      document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[data-engagement]").forEach(input => input.onchange = () => this.updateEngagement(input.dataset.engagement!, input.value));
      document.getElementById("add-participant")?.addEventListener("click", () => this.addParticipantDialog());
      document.querySelectorAll<HTMLElement>("[data-remove]").forEach(button => button.onclick = () => this.removeParticipant(button.dataset.remove!));
      document.querySelectorAll<HTMLElement>("[data-review]").forEach(button => button.onclick = () => this.reviewAction(button.dataset.id!, button.dataset.review!));
      document.querySelectorAll<HTMLElement>("[data-restore]").forEach(button => button.onclick = () => { if (confirm("Restore this checkpoint?")) { this.store.restoreCheckpoint(button.dataset.restore!); this.toast("Checkpoint restored; history retained.", "success"); } });
    }

    private async action(action: string): Promise<void> {
      this.by("menu").hidden = true;
      if (action === "new") {
        if (!confirm("Create a new synthetic project? Existing browser recovery will be replaced after a passphrase is set.")) return;
        this.protection = {};
        this.legacyMigration = false;
        this.store.replaceDocument(createNewProject());
        this.saveState = "Encrypted recovery unavailable until a passphrase is created";
        this.render();
      } else if (action === "open") {
        (this.by("open-input") as HTMLInputElement).click();
      } else if (action === "save" || action === "backup") {
        await this.save(action === "backup");
      } else if (action === "checkpoint") {
        const name = prompt("Checkpoint name", `Checkpoint ${this.store.document.checkpoints.length + 1}`);
        if (name !== null) this.store.createCheckpoint(name);
      } else if (action === "lock") {
        await this.lock();
      } else if (action === "clear-recovery") {
        await this.recovery.clear();
        this.saveState = "Browser recovery cleared";
        this.render();
        this.toast("Encrypted browser recovery cleared.", "success");
      }
    }

    private async ensurePassphrase(): Promise<boolean> {
      if (this.protection.baseKey) return true;
      return new Promise(resolve => {
        this.dialog("Create project passphrase", `<form id="passphrase-form" class="dialog-form"><p>This passphrase protects portable project files and browser recovery. It cannot be reset or recovered.</p><label class="field"><span>Passphrase</span><input id="pass-one" type="password" autocomplete="new-password" required minlength="12"></label><label class="field"><span>Confirm passphrase</span><input id="pass-two" type="password" autocomplete="new-password" required minlength="12"></label><p class="passphrase-note">Use a unique passphrase of at least 12 characters. L2G does not store it.</p><div class="dialog-actions"><button type="button" data-cancel class="secondary-button">Cancel</button><button type="submit" class="primary-button">Create encrypted session</button></div></form>`);
        this.by("passphrase-form").onsubmit = event => {
          event.preventDefault();
          const first = (this.by("pass-one") as HTMLInputElement).value;
          const second = (this.by("pass-two") as HTMLInputElement).value;
          if (first !== second) { this.toast("Passphrases do not match.", "error"); return; }
          try { validatePassphrase(first); } catch (error) { this.toast(errorMessage(error), "error"); return; }
          void importPassphrase(first).then(key => {
            this.protection.baseKey = key;
            (this.by("pass-one") as HTMLInputElement).value = "";
            (this.by("pass-two") as HTMLInputElement).value = "";
            this.closeDialog();
            this.saveState = "Encrypted session active; recovery will be written after change or save";
            this.render();
            resolve(true);
          });
        };
        this.by("passphrase-form").querySelector<HTMLElement>("[data-cancel]")!.onclick = () => { this.closeDialog(); resolve(false); };
      });
    }

    private async save(backup: boolean): Promise<void> {
      try {
        if (!await this.ensurePassphrase()) return;
        this.saveState = "Encrypting project…";
        this.render();
        const result = await encryptProject(this.store.document, this.protection.baseKey!, "portable-project");
        this.protection.portableKey = result.key;
        this.protection.portableSalt = result.salt;
        await this.persistRecovery();
        const filename = safeFilename(this.store.document.manifest.project_id, backup);
        const blob = new Blob([result.bytes], { type: "application/vnd.l2g.encrypted-project" });
        if (window.showSaveFilePicker && !backup) {
          const handle = await window.showSaveFilePicker({ suggestedName: filename, types: [{ description: "Encrypted L2G project", accept: { "application/vnd.l2g.encrypted-project": [".l2g"] } }] });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          this.saveState = "Encrypted project file saved and encrypted recovery current";
        } else {
          triggerDownload(blob, filename);
          this.saveState = backup ? "Encrypted backup download initiated" : "Encrypted project download initiated; destination write not verified";
        }
        this.legacyMigration = false;
        this.render();
        this.toast(this.saveState, "success");
      } catch (error) {
        this.saveState = "Encrypted save failed; current project remains open";
        this.render();
        this.toast(`Save failed: ${errorMessage(error)}`, "error");
      }
    }

    private async openSelected(event: Event): Promise<void> {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      input.value = "";
      if (!file) return;
      const bytes = new Uint8Array(await file.arrayBuffer());
      const beforeId = this.store.document.manifest.project_id;
      try {
        if (isEncryptedPackage(bytes)) {
          const passphrase = await this.requestPassphrase("Unlock encrypted project");
          if (passphrase === null) return;
          const result = await decryptProject(bytes, passphrase, "portable-project");
          this.protection = { baseKey: result.baseKey, portableKey: result.key, portableSalt: result.salt };
          this.legacyMigration = false;
          this.store.replaceDocument(result.document);
          await this.persistRecovery();
          this.saveState = "Encrypted project opened; encrypted recovery current";
          this.render();
          this.toast("Encrypted project authenticated, validated, and opened.", "success");
        } else {
          const result = await deserializeInnerProject(bytes, true);
          if (!result.legacy) throw new Error("Only encrypted v0.2 or valid v0.1 synthetic projects are accepted.");
          this.protection = {};
          this.legacyMigration = true;
          this.store.replaceDocument(result.document);
          this.saveState = "Legacy project opened; save with a passphrase to enable encrypted recovery";
          this.render();
          this.toast("Legacy synthetic project imported for encrypted migration.", "warning");
        }
      } catch (error) {
        if (this.store.document.manifest.project_id !== beforeId) throw new Error("Governed state changed during a failed import.");
        this.saveState = "Open rejected; current project was not changed";
        this.render();
        this.toast(`Project rejected: ${errorMessage(error)}`, "error");
      }
    }

    private requestPassphrase(title: string): Promise<string | null> {
      return new Promise(resolve => {
        this.dialog(title, `<form id="unlock-form" class="dialog-form"><p>Enter the project passphrase. Wrong passphrases and modified encrypted content produce the same error.</p><label class="field"><span>Passphrase</span><input id="unlock-pass" type="password" autocomplete="current-password" required></label><div class="dialog-actions"><button type="button" data-cancel class="secondary-button">Cancel</button><button type="submit" class="primary-button">Unlock</button></div></form>`);
        this.by("unlock-form").onsubmit = event => {
          event.preventDefault();
          const value = (this.by("unlock-pass") as HTMLInputElement).value;
          (this.by("unlock-pass") as HTMLInputElement).value = "";
          this.closeDialog();
          resolve(value);
        };
        this.by("unlock-form").querySelector<HTMLElement>("[data-cancel]")!.onclick = () => { this.closeDialog(); resolve(null); };
      });
    }

    private showRecoveryUnlock(record: RecoveryRecord): void {
      this.dialog("Encrypted recovery available", `<div class="prose"><p>An encrypted browser recovery record from ${escapeHtml(new Date(record.saved_at).toLocaleString())} is available.</p><p>Unlocking requires the same passphrase used for the working session. Cancelling leaves recovery unchanged.</p><div class="dialog-actions"><button id="discard-recovery" class="secondary-button">Discard recovery</button><button id="unlock-recovery" class="primary-button">Unlock recovery</button></div></div>`);
      this.by("discard-recovery").onclick = () => void this.recovery.clear().then(() => { this.closeDialog(); this.toast("Encrypted recovery discarded.", "info"); });
      this.by("unlock-recovery").onclick = () => void this.requestPassphrase("Unlock encrypted recovery").then(async passphrase => {
        if (passphrase === null) return;
        try {
          const result = await decryptProject(new Uint8Array(record.bytes), passphrase, "browser-recovery");
          this.protection = { baseKey: result.baseKey, recoveryKey: result.key, recoverySalt: result.salt };
          this.store.replaceDocument(result.document);
          this.closeDialog();
          this.saveState = "Encrypted recovery unlocked";
          this.render();
          this.toast("Encrypted recovery restored after authentication and validation.", "success");
        } catch (error) {
          this.toast(errorMessage(error), "error");
        }
      });
    }

    private scheduleRecovery(): void {
      if (!this.protection.baseKey) return;
      if (this.recoveryTimer !== undefined) clearTimeout(this.recoveryTimer);
      this.recoveryTimer = window.setTimeout(() => void this.persistRecovery().catch(() => undefined), 750);
    }

    private async persistRecovery(): Promise<void> {
      if (!this.protection.baseKey) return;
      const result = await encryptProject(this.store.document, this.protection.baseKey, "browser-recovery");
      this.protection.recoveryKey = result.key;
      this.protection.recoverySalt = result.salt;
      await this.recovery.save(result.bytes);
      this.saveState = "Saved in encrypted browser recovery; project file not necessarily written";
      this.render();
    }

    private async lock(): Promise<void> {
      if (!this.protection.baseKey) return;
      if (!confirm("Lock this project? The page will reload and encrypted recovery will require the passphrase.")) return;
      try {
        await this.persistRecovery();
        this.protection = {};
        location.reload();
      } catch (error) {
        this.toast(`Lock failed because encrypted recovery could not be saved: ${errorMessage(error)}`, "error");
      }
    }

    private updateEngagement(name: string, value: string): void {
      const allowed = new Set(["engagement_name", "client_name", "system_name", "phase", "objectives"]);
      if (!allowed.has(name)) return;
      const clean = sanitizePlainText(value, name === "objectives" ? 4000 : 160);
      this.store.execute(`Update ${name.replace(/_/g, " ")}`, "engagement", this.store.document.state.engagement.engagement_id, state => {
        (state.engagement as unknown as Record<string, string>)[name] = clean;
      });
    }

    private addParticipantDialog(): void {
      this.dialog("Add synthetic participant", `<form id="participant-form" class="dialog-form"><label class="field"><span>Name</span><input id="p-name" required maxlength="160"></label><label class="field"><span>Role</span><input id="p-role" maxlength="160"></label><label class="field"><span>Organization</span><input id="p-org" maxlength="160"></label><label class="field"><span>Visibility</span><select id="p-vis"><option value="advisor-only">Advisor-only</option><option value="client-safe">Client-safe</option></select></label><div class="dialog-actions"><button type="button" data-close class="secondary-button">Cancel</button><button type="submit" class="primary-button">Add participant</button></div></form>`);
      this.by("participant-form").onsubmit = event => {
        event.preventDefault();
        const participant: Participant = {
          id: newId("participant"),
          name: sanitizePlainText((this.by("p-name") as HTMLInputElement).value, 160),
          role: sanitizePlainText((this.by("p-role") as HTMLInputElement).value, 160),
          organization: sanitizePlainText((this.by("p-org") as HTMLInputElement).value, 160),
          visibility: (this.by("p-vis") as HTMLSelectElement).value as Participant["visibility"]
        };
        if (!participant.name.trim()) return;
        this.store.execute(`Add participant “${participant.name}”`, "participant", participant.id, state => state.engagement.participants.push(participant));
        this.closeDialog();
      };
      this.by("participant-form").querySelector<HTMLElement>("[data-close]")!.onclick = () => this.closeDialog();
    }

    private removeParticipant(identifier: string): void {
      const participant = this.store.document.state.engagement.participants.find(item => item.id === identifier);
      if (!participant || !confirm(`Remove “${participant.name}”?`)) return;
      this.store.execute(`Remove participant “${participant.name}”`, "participant", identifier, state => { state.engagement.participants = state.engagement.participants.filter(item => item.id !== identifier); });
    }

    private reviewAction(identifier: string, action: string): void {
      this.store.execute(`${action === "approve" ? "Approve" : "Request changes for"} review example`, "review", identifier, state => {
        const item = state.reviews_actions.examples.find(entry => entry.id === identifier);
        if (!item) return;
        if (action === "approve") { item.lifecycle = "Approved"; item.review_state = "Approved"; item.operational_state = "Done"; }
        else { item.review_state = "Changes requested"; item.operational_state = "Waiting"; }
      });
    }

    private help(): void {
      this.dialog("Encrypted project help", `<div class="prose"><h3>Project protection</h3><p>Every v0.2 portable save is AES-256-GCM encrypted. Browser recovery is encrypted or absent. Passphrases cannot be reset or recovered.</p><h3>Limitations</h3><p>JavaScript cannot guarantee immediate memory erasure, prevent screenshots or OS memory capture, or protect an unlocked project on a compromised endpoint. This release remains synthetic-only.</p><div class="dialog-actions"><button data-close class="primary-button">Close</button></div></div>`);
      this.by("dialog-content").querySelector<HTMLElement>("[data-close]")!.onclick = () => this.closeDialog();
    }

    private about(): void {
      const release = window.__L2G_RELEASE__;
      this.dialog("About L2G Integrated Suite", `<div class="prose"><dl><dt>Version</dt><dd>${escapeHtml(release.version)}</dd><dt>Envelope</dt><dd><code>l2g_encrypted_project_v1</code></dd><dt>Project</dt><dd><code>l2g_project_v1</code></dd><dt>Runtime</dt><dd>Single local HTML, no telemetry, no runtime network</dd><dt>Authorization</dt><dd>Synthetic-only; production/client/FCI/CUI use not authorized</dd></dl><div class="dialog-actions"><button data-close class="primary-button">Close</button></div></div>`);
      this.by("dialog-content").querySelector<HTMLElement>("[data-close]")!.onclick = () => this.closeDialog();
    }

    private dialog(title: string, body: string): void {
      const dialog = this.by("dialog") as HTMLDialogElement;
      this.by("dialog-content").innerHTML = `<h2 id="dialog-title">${escapeHtml(title)}</h2>${body}`;
      if (!dialog.open) dialog.showModal();
    }
    private closeDialog(): void { const dialog = this.by("dialog") as HTMLDialogElement; if (dialog.open) dialog.close(); }
    private toast(text: string, kind: "info" | "success" | "warning" | "error"): void {
      const region = document.getElementById("toast-region");
      if (!region) return;
      const item = document.createElement("div");
      item.className = `toast ${kind}`;
      item.textContent = text;
      region.append(item);
      setTimeout(() => item.remove(), 5000);
    }
    private by(identifier: string): HTMLElement {
      const element = document.getElementById(identifier);
      if (!element) throw new Error(`Missing element: ${identifier}`);
      return element;
    }
  }

  const root = document.getElementById("app");
  if (!root) throw new Error("Application root missing.");
  void new App(root).start();
}
