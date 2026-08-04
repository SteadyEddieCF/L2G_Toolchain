namespace L2G {
  let labelObserver: MutationObserver | null = null;
  let labelUpdating = false;

  function updateV05VisibleLabels(): void {
    if (labelUpdating) return;
    labelUpdating = true;
    try {
      document.querySelectorAll<HTMLElement>(".notice.ok, #workspace p, .release-badge").forEach(element => {
        const text = element.textContent ?? "";
        let replacement = text;
        replacement = replacement.replace("Project migrated to v0.4. Save a new encrypted file.", "Project migrated to v0.5. Save a new encrypted file.");
        replacement = replacement.replace("Encrypted v0.4 project opened.", "Encrypted v0.5 project opened.");
        replacement = replacement.replace("This v0.4 workspace consumes frozen Engagement and Evidence projections.", "This v0.5 workspace consumes frozen projections from the authorities implemented so far.");
        if (element.classList.contains("release-badge")) replacement = `v${window.__L2G_RELEASE__.version} · Pre-Engagement & Interviews`;
        if (replacement !== text) element.textContent = replacement;
      });
    } finally {
      labelUpdating = false;
    }
  }

  function initializeV05Labels(): void {
    const app = document.getElementById("app");
    if (!app) return;
    if (!labelObserver) {
      labelObserver = new MutationObserver(updateV05VisibleLabels);
      labelObserver.observe(app, { childList: true, subtree: true, characterData: true });
    }
    updateV05VisibleLabels();
  }

  queueMicrotask(initializeV05Labels);
  window.addEventListener("DOMContentLoaded", initializeV05Labels, { once: true });
}
