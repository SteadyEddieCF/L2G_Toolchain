namespace L2G {
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const hooks = v06Hooks();
    if (!hooks || hooks.store.document.state.active_workspace !== "scope") return;
    if (!v06Dialog && !v06Preview && !v06Selected) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    v06Dialog = null;
    v06Preview = null;
    v06Selected = "";
    v06FocusSelector = "#scope-title";
    const main = document.getElementById("workspace");
    if (!main) return;
    v06Render(main, hooks.store);
    queueMicrotask(() => document.getElementById("scope-title")?.focus());
  }, true);
}
