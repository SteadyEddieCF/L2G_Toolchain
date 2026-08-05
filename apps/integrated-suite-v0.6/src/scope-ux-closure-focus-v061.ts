namespace L2G {
  let v061FocusedInspectorRef = "";
  let v061FocusPatchQueued = false;

  function v061PatchInspectorHeadingFocus(): void {
    const main = document.getElementById("workspace");
    const title = main?.querySelector<HTMLElement>("#scope-inspector-title");
    const inspector = title?.closest<HTMLElement>(".scope-inspector");
    if (!title || !inspector || !v06Selected) {
      v061FocusedInspectorRef = "";
      return;
    }
    title.tabIndex = -1;
    if (!window.matchMedia("(max-width: 1100px)").matches) return;
    if (v061FocusedInspectorRef === v06Selected && inspector.contains(document.activeElement)) return;
    v061FocusedInspectorRef = v06Selected;
    queueMicrotask(() => title.focus());
  }

  function v061QueueInspectorHeadingFocus(): void {
    if (v061FocusPatchQueued) return;
    v061FocusPatchQueued = true;
    queueMicrotask(() => {
      v061FocusPatchQueued = false;
      v061PatchInspectorHeadingFocus();
    });
  }

  const v061FocusObserver = new MutationObserver(() => v061QueueInspectorHeadingFocus());
  const v061FocusRoot = document.getElementById("app");
  if (v061FocusRoot) v061FocusObserver.observe(v061FocusRoot, { childList: true, subtree: true });
  v061QueueInspectorHeadingFocus();
}
