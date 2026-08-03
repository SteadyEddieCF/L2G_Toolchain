namespace L2G {
  class IntegratedSuiteApp extends IntegratedSuiteCore {
    protected attachEvents(): void {
      byId("rail-toggle").addEventListener("click", () => this.updateShellState(state => { state.rail_collapsed = !state.rail_collapsed; }));
      byId("undo-button").addEventListener("click", () => this.store.undo());
      byId("redo-button").addEventListener("click", () => this.store.redo());
      byId("search-button").addEventListener("click", () => this.showCommandPalette());
      byId("help-button").addEventListener("click", () => this.showHelp());
      byId("about-button").addEventListener("click", () => this.showAbout());
      byId("profile-select").addEventListener("change", event => this.switchProfile((event.target as HTMLSelectElement).value as PresentationProfile));
      byId("overflow-button").addEventListener("click", event => this.toggleOverflow(event.currentTarget as HTMLElement));
      byId("inspector-button").addEventListener("click", () => this.updateShellState(state => { state.inspector_open = !state.inspector_open; }));
      byId("close-inspector")?.addEventListener("click", () => this.updateShellState(state => { state.inspector_open = false; state.inspector_pinned = false; }));
      byId("pin-inspector")?.addEventListener("click", () => this.updateShellState(state => { state.inspector_open = true; state.inspector_pinned = !state.inspector_pinned; }));
      document.querySelectorAll<HTMLElement>("[data-workspace]").forEach(button => button.addEventListener("click", () => this.navigate(button.dataset.workspace as WorkspaceId)));
      document.querySelectorAll<HTMLElement>("[data-workspace-link]").forEach(button => button.addEventListener("click", () => this.navigate(button.dataset.workspaceLink as WorkspaceId)));
      document.querySelectorAll<HTMLElement>("[data-project-action]").forEach(button => button.addEventListener("click", () => void this.handleProjectAction(button.dataset.projectAction ?? "")));
      byId("open-project-input").addEventListener("change", event => void this.openSelectedProject(event));
      document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[data-engagement-field]").forEach(input => input.addEventListener("change", () => this.updateEngagementField(input.dataset.engagementField!, input.value)));
      findId("add-participant-button")?.addEventListener("click", () => this.showAddParticipant());
      findId("empty-add-participant")?.addEventListener("click", () => this.showAddParticipant());
      document.querySelectorAll<HTMLElement>("[data-remove-participant]").forEach(button => button.addEventListener("click", () => this.removeParticipant(button.dataset.removeParticipant!)));
      document.querySelectorAll<HTMLElement>("[data-review-action]").forEach(button => button.addEventListener("click", () => this.applyReviewAction(button.dataset.reviewId!, button.dataset.reviewAction!)));
      findId("create-checkpoint-button")?.addEventListener("click", () => this.promptCheckpoint());
      document.querySelectorAll<HTMLElement>("[data-restore-checkpoint]").forEach(button => button.addEventListener("click", () => this.restoreCheckpoint(button.dataset.restoreCheckpoint!)));
    }

    protected updateShellState(mutator: (state: ProjectState) => void): void {
      mutator(this.store.document.state);
      void this.persistRecoverySafely();
      this.render();
    }

    protected navigate(workspace: WorkspaceId): void {
      this.store.document.state.active_workspace = workspace;
      if (!this.store.document.state.inspector_pinned) this.store.document.state.inspector_open = false;
      void this.persistRecoverySafely();
      this.render();
      window.setTimeout(() => byId("workspace-main").focus(), 0);
    }

    protected switchProfile(profile: PresentationProfile): void {
      this.store.document.state.profile = profile;
      this.store.document.state.inspector_open = false;
      this.store.document.state.inspector_pinned = false;
      this.saveState = "Presentation preference saved in browser recovery";
      void this.persistRecoverySafely();
      this.render();
      this.showToast(`${profile[0]!.toUpperCase() + profile.slice(1)} View active. This is not a security boundary.`, "info");
    }

    protected updateEngagementField(fieldName: string, value: string): void {
      const allowed = new Set(["engagement_name", "client_name", "system_name", "phase", "objectives"]);
      if (!allowed.has(fieldName)) return;
      const clean = sanitizePlainText(value, fieldName === "objectives" ? 4000 : 160);
      const current = this.store.document.state.engagement as unknown as Record<string, string>;
      if (current[fieldName] === clean) return;
      this.store.execute(`Update ${fieldName.replace(/_/g, " ")}`, "engagement", this.store.document.state.engagement.engagement_id, state => {
        (state.engagement as unknown as Record<string, string>)[fieldName] = clean;
      });
    }

    protected showAddParticipant(): void {
      this.showDialog("Add synthetic participant", `<form id="participant-form" class="dialog-form"><label class="field"><span>Name</span><input id="participant-name" required maxlength="160" /></label><label class="field"><span>Role</span><input id="participant-role" maxlength="160" /></label><label class="field"><span>Organization</span><input id="participant-organization" maxlength="160" /></label><label class="field"><span>Visibility</span><select id="participant-visibility"><option value="advisor-only">Advisor-only</option><option value="client-safe">Client-safe</option></select></label><div class="dialog-actions"><button type="button" data-close-dialog class="secondary-button">Cancel</button><button type="submit" class="primary-button">Add participant</button></div></form>`);
      byId("participant-form").addEventListener("submit", event => {
        event.preventDefault();
        const name = sanitizePlainText((byId("participant-name") as HTMLInputElement).value, 160).trim();
        if (!name) return;
        const participant: Participant = { id: newId("participant"), name, role: sanitizePlainText((byId("participant-role") as HTMLInputElement).value, 160), organization: sanitizePlainText((byId("participant-organization") as HTMLInputElement).value, 160), visibility: (byId("participant-visibility") as HTMLSelectElement).value as Participant["visibility"] };
        this.store.execute(`Add participant “${participant.name}”`, "participant", participant.id, state => state.engagement.participants.push(participant));
        this.closeDialog();
      });
    }

    protected removeParticipant(id: string): void {
      const participant = this.store.document.state.engagement.participants.find(item => item.id === id);
      if (!participant || !window.confirm(`Remove synthetic participant “${participant.name}”?`)) return;
      this.store.execute(`Remove participant “${participant.name}”`, "participant", id, state => { state.engagement.participants = state.engagement.participants.filter(item => item.id !== id); });
    }

    protected applyReviewAction(id: string, action: string): void {
      const item = this.store.document.state.reviews_actions.examples.find(example => example.id === id);
      if (!item) return;
      if (action === "approve") this.store.execute(`Approve review example “${item.title}”`, "review", id, state => { const target = state.reviews_actions.examples.find(example => example.id === id)!; target.review_state = "Approved"; target.lifecycle = "Approved"; target.operational_state = "Done"; });
      if (action === "request") this.store.execute(`Request changes for review example “${item.title}”`, "review", id, state => { const target = state.reviews_actions.examples.find(example => example.id === id)!; target.review_state = "Changes requested"; target.operational_state = "Waiting"; });
    }

    protected restoreCheckpoint(id: string): void {
      if (!window.confirm("Restore this checkpoint? A new history event will preserve the restoration.")) return;
      this.store.restoreCheckpoint(id);
      this.showToast("Checkpoint restored. Prior history was retained.", "success");
    }

    protected promptCheckpoint(): void {
      const name = window.prompt("Checkpoint name", `Checkpoint ${this.store.document.checkpoints.length + 1}`);
      if (name === null) return;
      const checkpoint = this.store.createCheckpoint(name);
      this.showToast(`Checkpoint “${checkpoint.name}” created.`, "success");
    }

    protected async handleProjectAction(action: string): Promise<void> {
      this.hideOverflow();
      if (action === "new") {
        if (!window.confirm("Create a new synthetic foundation project? Browser recovery for the current project will be replaced.")) return;
        this.readOnlyRecovery = false;
        this.store.replaceDocument(createNewProject());
        await this.persistRecoverySafely();
        this.saveState = "New project saved in browser recovery";
        this.render();
      } else if (action === "open") {
        (byId("open-project-input") as HTMLInputElement).click();
      } else if (action === "save" || action === "save-as") {
        await this.saveProject(action === "save" ? "save" : "save-as");
      } else if (action === "backup") {
        this.store.createCheckpoint("Verified backup boundary");
        await this.saveProject("backup");
      } else if (action === "checkpoint") {
        this.promptCheckpoint();
      } else if (action === "history") {
        this.store.document.state.active_workspace = "reviews-actions";
        this.store.document.state.inspector_open = true;
        this.render();
      }
    }

    protected async saveProject(mode: "save" | "save-as" | "backup"): Promise<void> {
      try {
        this.saveState = "Preparing verified project…";
        this.render();
        await this.persistRecoverySafely();
        const bytes = await serializeProject(this.store.document);
        const suffix = mode === "backup" ? ".backup.l2g" : ".l2g";
        const name = safeFilename(this.store.document.state.engagement.engagement_name || "L2G_Project") + suffix;
        const blob = new Blob([bytes], { type: "application/zip" });
        if (window.showSaveFilePicker && mode !== "backup") {
          const handle = await window.showSaveFilePicker({ suggestedName: name, types: [{ description: "L2G engagement project", accept: { "application/zip": [".l2g"] } }] });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          this.saveState = "Project file saved and browser recovery current";
        } else {
          triggerDownload(blob, name);
          this.saveState = mode === "backup" ? "Verified backup download initiated" : "Project download initiated; destination write not verified";
        }
        this.render();
        this.showToast(this.saveState, "success");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          this.saveState = "Save cancelled; browser recovery remains current";
        } else {
          this.saveState = "Save failed — browser recovery remains available";
          this.showToast(`Save failed: ${message(error)}`, "error");
        }
        this.render();
      }
    }

    protected async openSelectedProject(event: Event): Promise<void> {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      input.value = "";
      if (!file) return;
      const beforeId = this.store.document.manifest.project_id;
      try {
        this.saveState = "Validating project before mutation…";
        this.render();
        const bytes = new Uint8Array(await file.arrayBuffer());
        const document = await deserializeProject(bytes);
        this.readOnlyRecovery = false;
        this.store.replaceDocument(document);
        await this.persistRecoverySafely();
        this.saveState = "Project validated and opened; browser recovery current";
        this.render();
        this.showToast("Project opened only after structure and integrity validation passed.", "success");
      } catch (error) {
        if (this.store.document.manifest.project_id !== beforeId) throw new Error("Governed state changed during a failed import.");
        this.saveState = "Open rejected; current project was not changed";
        this.render();
        this.showToast(`Project rejected: ${message(error)}`, "error");
      }
    }

    protected showCommandPalette(): void {
      this.showDialog("Search and commands", `<div class="command-palette"><label class="field"><span>Search commands and workspaces</span><input id="command-query" autocomplete="off" placeholder="Try “save”, “history”, or a workspace" /></label><div id="command-results" class="command-results"></div></div>`);
      const query = byId("command-query") as HTMLInputElement;
      const renderResults = () => {
        const value = query.value.toLowerCase().trim();
        const items = [
          ...WORKSPACES.map(item => ({ label: `Go to ${item.label}`, action: `workspace:${item.id}` })),
          { label: "Save project", action: "project:save" },
          { label: "Create checkpoint", action: "project:checkpoint" },
          { label: "Show history", action: "workspace:reviews-actions" },
          { label: "Toggle context inspector", action: "shell:inspector" }
        ].filter(item => !value || item.label.toLowerCase().includes(value));
        byId("command-results").innerHTML = items.map(item => `<button data-command="${escapeAttribute(item.action)}">${escapeHtml(item.label)}</button>`).join("") || `<p>No matching commands.</p>`;
        document.querySelectorAll<HTMLElement>("[data-command]").forEach(button => button.addEventListener("click", () => void this.runCommand(button.dataset.command!)));
      };
      query.addEventListener("input", renderResults);
      renderResults();
      window.setTimeout(() => query.focus(), 0);
    }

    protected async runCommand(command: string): Promise<void> {
      this.closeDialog();
      const [type, value] = command.split(":", 2);
      if (type === "workspace") this.navigate(value as WorkspaceId);
      if (type === "project" && value) await this.handleProjectAction(value);
      if (type === "shell" && value === "inspector") this.updateShellState(state => { state.inspector_open = !state.inspector_open; });
    }

    protected showHelp(): void {
      this.showDialog("Foundation help", `<div class="prose"><p>This additive release validates the shared shell, local project lifecycle, browser recovery, integrity, history, profiles, and compatibility catalog.</p><h3>Keyboard shortcuts</h3><dl><dt>Ctrl/Cmd + K</dt><dd>Search and commands</dd><dt>Ctrl/Cmd + Z</dt><dd>Undo meaningful data edit</dd><dt>Ctrl/Cmd + Shift + Z or Ctrl + Y</dt><dd>Redo</dd><dt>Ctrl/Cmd + \\</dt><dd>Toggle navigation rail</dd></dl><h3>Safety boundary</h3><p>Synthetic data only. Profiles are presentations, not security roles. No readiness, compliance, scoring, certification, Met/Not Met, or evidence-sufficiency claim is produced.</p><div class="dialog-actions"><button data-close-dialog class="primary-button">Close</button></div></div>`);
    }

    protected showAbout(): void {
      const release = window.__L2G_RELEASE__;
      this.showDialog("About L2G Integrated Suite Foundation", `<div class="prose"><dl><dt>Version</dt><dd>${escapeHtml(release.version)}</dd><dt>Project kind</dt><dd><code>l2g_project_v1</code></dd><dt>Compatibility baseline</dt><dd><code class="hash">${escapeHtml(release.product_runtime_compatibility_baseline)}</code></dd><dt>Registry</dt><dd>${escapeHtml(window.__L2G_CONTRACT_REGISTRY__.registry_version)} · ${window.__L2G_CONTRACT_REGISTRY__.contracts.length} routes</dd><dt>Runtime</dt><dd>Single-file, local, offline, no telemetry, no external runtime dependencies</dd></dl><div class="dialog-actions"><button data-close-dialog class="primary-button">Close</button></div></div>`);
    }

    protected showRecoveryDialog(envelope: RecoveryEnvelope): void {
      const currentUpdated = this.store.document.manifest.updated_at;
      this.showDialog("Recovery checkpoint available", `<div class="prose"><p>A browser-local recovery record is available. It is separate from any portable project file.</p><div class="comparison"><article><h3>Current session</h3><p>${escapeHtml(formatDate(currentUpdated))}</p><p>${escapeHtml(this.store.document.state.engagement.engagement_name)}</p></article><article><h3>Recovery</h3><p>${escapeHtml(formatDate(envelope.saved_at))}</p><p>${escapeHtml(envelope.document.state.engagement.engagement_name)}</p><p>${envelope.document.history.length} history events</p></article></div><div class="dialog-actions"><button id="discard-recovery" class="secondary-button">Discard recovery</button><button id="readonly-recovery" class="secondary-button">Open recovery read-only</button><button id="restore-recovery" class="primary-button">Restore recovery</button></div></div>`, false);
      byId("restore-recovery").addEventListener("click", () => { this.readOnlyRecovery = false; this.store.replaceDocument(envelope.document); this.store.document.history.push({ event_id: newId("event"), timestamp: nowIso(), profile: "advisor", action: "recovery.restored", object_type: "project", object_id: envelope.document.manifest.project_id, summary: "Restored browser recovery after explicit user choice.", transaction_id: newId("txn") }); this.closeDialog(); this.saveState = "Recovery restored and retained in history"; this.render(); });
      byId("readonly-recovery").addEventListener("click", () => { this.readOnlyRecovery = true; const document = deepClone(envelope.document); document.state.profile = "reviewer"; this.store.replaceDocument(document); this.closeDialog(); this.saveState = "Recovery opened read-only"; this.render(); });
      byId("discard-recovery").addEventListener("click", () => { void this.store.clearRecovery(); this.closeDialog(); this.showToast("Browser recovery discarded. Portable project files were not affected.", "info"); });
    }

    protected showDialog(title: string, body: string, closeable = true): void {
      const dialog = byId("generic-dialog") as HTMLDialogElement;
      this.previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      byId("dialog-content").innerHTML = `<div class="dialog-header"><h2 id="dialog-title">${escapeHtml(title)}</h2>${closeable ? `<button data-close-dialog class="icon-button" aria-label="Close dialog">×</button>` : ""}</div>${body}`;
      document.querySelectorAll<HTMLElement>("[data-close-dialog]").forEach(button => button.addEventListener("click", () => this.closeDialog()));
      dialog.addEventListener("cancel", event => { if (!closeable) event.preventDefault(); });
      dialog.showModal();
    }

    protected closeDialog(): void {
      const dialog = byId("generic-dialog") as HTMLDialogElement;
      if (dialog.open) dialog.close();
      this.previousFocus?.focus();
      this.previousFocus = null;
    }

    protected toggleOverflow(anchor: HTMLElement): void {
      const menu = byId("overflow-menu");
      const willOpen = menu.hidden;
      menu.hidden = !willOpen;
      if (willOpen) {
        const rect = anchor.getBoundingClientRect();
        menu.style.top = `${rect.bottom + 4}px`;
        menu.style.right = `${Math.max(8, window.innerWidth - rect.right)}px`;
        menu.querySelector<HTMLElement>("button")?.focus();
      }
    }

    protected hideOverflow(): void {
      byId("overflow-menu").hidden = true;
    }

    protected async persistRecoverySafely(): Promise<boolean> {
      try {
        await this.store.persistRecoveryNow();
        return true;
      } catch {
        this.saveState = "Browser recovery unavailable; portable project remains usable";
        return false;
      }
    }

    protected markUnsaved(): void {
      this.saveState = "Unsaved changes; browser recovery pending";
      if (this.saveTimer !== undefined) window.clearTimeout(this.saveTimer);
      this.saveTimer = window.setTimeout(async () => {
        try {
          await this.persistRecoverySafely();
          this.saveState = "Saved in browser recovery; project file not written";
        } catch {
          this.saveState = "Browser recovery save failed";
        }
        this.render();
      }, 850);
    }

    protected reviewAttentionCount(): number {
      return this.store.document.state.reviews_actions.examples.filter(item => item.review_state !== "Approved" && item.review_state !== "Closed").length;
    }

    protected showToast(text: string, kind: "info" | "success" | "warning" | "error"): void {
      const region = byId("toast-region");
      if (!region) return;
      const toast = document.createElement("div");
      toast.className = `toast ${kind}`;
      toast.textContent = text;
      region.replaceChildren(toast);
      window.setTimeout(() => toast.remove(), 5000);
    }

    protected installGlobalShortcuts(): void {
      document.addEventListener("keydown", event => {
        const modifier = event.ctrlKey || event.metaKey;
        if (modifier && event.key.toLowerCase() === "k") { event.preventDefault(); this.showCommandPalette(); }
        else if (modifier && event.key === "\\") { event.preventDefault(); this.updateShellState(state => { state.rail_collapsed = !state.rail_collapsed; }); }
        else if (modifier && event.key.toLowerCase() === "z" && event.shiftKey) { event.preventDefault(); this.store.redo(); }
        else if (modifier && event.key.toLowerCase() === "y") { event.preventDefault(); this.store.redo(); }
        else if (modifier && event.key.toLowerCase() === "z") { event.preventDefault(); this.store.undo(); }
        else if (event.key === "Escape") this.hideOverflow();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("app");
    if (!root) throw new Error("Application root is missing.");
    const recovery = new RecoveryStore();
    const store = new ProjectStore(createNewProject(), recovery);
    const app = new IntegratedSuiteApp(root, store, recovery);
    void app.start();
  });
}
