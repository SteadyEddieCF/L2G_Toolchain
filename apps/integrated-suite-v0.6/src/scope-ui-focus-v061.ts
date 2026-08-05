namespace L2G {
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const hooks = v06Hooks();
    if (!hooks || hooks.store.document.state.active_workspace !== "scope") return;
    if (!v06Dialog && !v06Preview && !v06Selected) return;
    event.preventDefault();
    event.stopImmediatePropagation();

    const selectedRef = !v06Dialog && !v06Preview ? v06Selected : "";
    const restoreSelector = selectedRef
      ? `[data-v06-ref="${CSS.escape(selectedRef)}"]`
      : "#scope-title";
    v06Dialog = null;
    v06Preview = null;
    v06Selected = "";
    v06FocusSelector = restoreSelector;
    const main = document.getElementById("workspace");
    if (!main) return;
    v06Render(main, hooks.store);
    queueMicrotask(() => {
      const target = main.querySelector<HTMLElement>(restoreSelector) ?? document.getElementById("scope-title");
      target?.focus();
    });
  }, true);
}
