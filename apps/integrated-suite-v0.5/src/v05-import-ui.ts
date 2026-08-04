namespace L2G {
  let importStore: ProjectStore | null = null;
  let importObserver: MutationObserver | null = null;
  let pendingCompatibilityPreview: V05CompatibilityPreview | null = null;
  let importStatus = "";
  let importRendering = false;

  const importSubscribe = ProjectStore.prototype.subscribe;
  ProjectStore.prototype.subscribe = function (this: ProjectStore, listener: () => void): () => void {
    importStore = this;
    return importSubscribe.call(this, listener);
  };

  function ix(value: unknown): string {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[character] ?? character));
  }

  function ensureImportInput(): HTMLInputElement {
    let input = document.getElementById("v05-package-import-input") as HTMLInputElement | null;
    if (!input) {
      input = document.createElement("input");
      input.id = "v05-package-import-input";
      input.type = "file";
      input.accept = ".json,application/json";
      input.hidden = true;
      document.body.appendChild(input);
      input.addEventListener("change", () => { void stageSelectedPackage(input!); });
    }
    return input;
  }

  function previewDialog(preview: V05CompatibilityPreview): string {
    return `<div class="modal-backdrop" data-v05-import-dialog>
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="v05-import-title">
        <div class="modal-header"><div><h2 id="v05-import-title">Review compatibility import</h2><p>${ix(preview.package_kind)} version ${ix(preview.package_version)}</p></div><button data-v05-import-action="cancel" aria-label="Close import preview">×</button></div>
        <div class="modal-body">
          <div class="notice">Preview only. No governed state has changed. Meeting context remains imported context—not direct testimony—and intake content does not become a client answer.</div>
          <div class="metrics">
            <div class="metric"><strong>${preview.evidence_preview.sources.length}</strong><span>Evidence sources</span></div>
            <div class="metric"><strong>${preview.intake_proposals.length}</strong><span>intake proposals</span></div>
            <div class="metric"><strong>${preview.interview_question_proposals.length}</strong><span>Interview questions</span></div>
            <div class="metric"><strong>${preview.rejected_rows.length}</strong><span>rejected rows</span></div>
          </div>
          <p><strong>Package:</strong> ${ix(preview.package_name)}</p>
          <p class="meta">SHA-256 ${ix(preview.package_sha256)} · ${preview.package_size_bytes} bytes · registry ${ix(window.__L2G_CONTRACT_REGISTRY__.registry_version)}</p>
          <h3>Proposed intake records</h3><div class="grid">${preview.intake_proposals.map(item => `<article class="card"><h4>${ix(item.request.title)}</h4><p>${ix(item.request.description)}</p><p class="meta">Advisor-only · not requested · immutable snapshot</p></article>`).join("") || `<div class="empty">No intake records are proposed.</div>`}</div>
          <h3>Proposed Interview questions</h3><div class="grid">${preview.interview_question_proposals.map(item => `<article class="card"><h4>${ix(item.question.topic_label)}</h4><p>${ix(item.question.rationale)}</p><p class="meta">Imported context · Advisor review required</p></article>`).join("") || `<div class="empty">No Interview questions are proposed.</div>`}</div>
          ${preview.warnings.length ? `<h3>Warnings</h3><ul>${preview.warnings.map(item => `<li>${ix(item)}</li>`).join("")}</ul>` : ""}
          ${preview.rejected_rows.length ? `<h3>Rejected rows</h3><ul>${preview.rejected_rows.map(item => `<li>${ix(item)}</li>`).join("")}</ul>` : ""}
        </div>
        <div class="modal-footer"><button data-v05-import-action="cancel">Cancel without changes</button><button class="primary" data-v05-import-action="apply">Apply reviewed records</button></div>
      </section>
    </div>`;
  }

  async function stageSelectedPackage(input: HTMLInputElement): Promise<void> {
    const file = input.files?.[0];
    input.value = "";
    if (!file || !importStore) return;
    try {
      if (file.size > ARCHIVE_LIMITS.maxEntryBytes) throw new Error("The selected package exceeds the compatibility preview limit.");
      const bytes = new Uint8Array(await file.arrayBuffer());
      pendingCompatibilityPreview = await previewV05CompatibilityPackage(bytes, file.name);
      importStatus = "Package preview created; governed state is unchanged.";
      document.body.insertAdjacentHTML("beforeend", previewDialog(pendingCompatibilityPreview));
      document.querySelector<HTMLElement>("[data-v05-import-dialog] [data-v05-import-action=\"cancel\"]")?.focus();
    } catch (error) {
      pendingCompatibilityPreview = null;
      importStatus = `Import preview failed before mutation: ${errorMessage(error)}`;
      renderImportControls();
    }
  }

  function closeImportDialog(): void {
    document.querySelector("[data-v05-import-dialog]")?.remove();
    pendingCompatibilityPreview = null;
    document.querySelector<HTMLElement>("[data-v05-import-action=\"choose\"]")?.focus();
  }

  function applyPendingPreview(): void {
    if (!importStore || !pendingCompatibilityPreview) throw new Error("No reviewed compatibility preview is available.");
    const preview = pendingCompatibilityPreview;
    importStore.execute(
      "compatibility.preview-applied",
      "compatibility-import",
      preview.package_sha256,
      `Applied reviewed ${preview.package_kind} records atomically into Evidence and the applicable v0.5 authorities.`,
      document => { applyV05CompatibilityPreview(document, preview, undefined, "advisor"); },
      `Applied ${preview.package_kind} compatibility preview`
    );
    importStatus = "Reviewed package records applied atomically; original package bytes were not retained.";
    closeImportDialog();
  }

  function renderImportControls(): void {
    if (importRendering || !importStore || importStore.document.state.profile !== "advisor") return;
    const workspace = document.querySelector<HTMLElement>("#workspace");
    if (!workspace) return;
    const target = workspace.querySelector<HTMLElement>('[data-v05-workspace="pre-engagement"], [data-v05-workspace="interviews"], [data-v05-workspace="interview-live"]');
    if (!target || target.querySelector("[data-v05-import-ui]")) return;
    importRendering = true;
    try {
      target.insertAdjacentHTML("afterbegin", `<section data-v05-import-ui>
        ${importStatus ? `<div class="notice ok" role="status">${ix(importStatus)}</div>` : ""}
        <div class="card-actions"><button data-v05-import-action="choose">Import reviewed context</button><span class="meta">Recognized stable JSON packages only; preview and explicit apply are required.</span></div>
      </section>`);
    } finally {
      importRendering = false;
    }
  }

  function initializeImportUi(): void {
    const app = document.getElementById("app");
    if (!app) return;
    ensureImportInput();
    if (!importObserver) {
      importObserver = new MutationObserver(renderImportControls);
      importObserver.observe(app, { childList: true, subtree: true });
      document.addEventListener("click", event => {
        const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-v05-import-action]") : null;
        if (!target) return;
        const action = target.dataset.v05ImportAction;
        try {
          if (action === "choose") ensureImportInput().click();
          else if (action === "cancel") closeImportDialog();
          else if (action === "apply") applyPendingPreview();
        } catch (error) {
          importStatus = `Import action failed without partial mutation: ${errorMessage(error)}`;
          document.querySelector("[data-v05-import-dialog]")?.remove();
          pendingCompatibilityPreview = null;
          renderImportControls();
        }
      });
    }
    renderImportControls();
  }

  queueMicrotask(initializeImportUi);
  window.addEventListener("DOMContentLoaded", initializeImportUi, { once: true });
}
