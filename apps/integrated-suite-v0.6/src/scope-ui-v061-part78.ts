namespace L2G {
  export function v06BindDialog(main: HTMLElement, store: ProjectStore, projection: ScopeProjection): void {
    main.querySelectorAll<HTMLElement>("[data-v06-close-dialog]").forEach(button => button.addEventListener("click", () => { v06Dialog = null; v06FocusSelector = "#scope-title"; v06Render(main, store); }));
    main.querySelector<HTMLFormElement>("#v06-add-boundary-form")?.addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget as HTMLFormElement);
      const label = String(data.get("label") ?? "");
      const purpose = String(data.get("purpose") ?? "");
      store.execute("scope.boundary.created", "scope_boundary", newId("scope-action"), "Created a draft Scope boundary proposal.", document => {
        createScopeBoundaryProposal(v06Scope(document), label, purpose, document.state.profile);
      });
      v06Dialog = null;
      v06Announcement = "Draft boundary proposal created. No boundary membership or applicability decision was accepted.";
    });
    main.querySelector<HTMLFormElement>("#v06-add-asset-form")?.addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget as HTMLFormElement);
      const label = String(data.get("label") ?? "");
      const kind = String(data.get("kind") ?? "other");
      const description = String(data.get("description") ?? "");
      store.execute("scope.asset.created", "scope_asset", newId("scope-action"), "Created a draft Scope asset.", document => {
        createScopeAsset(v06Scope(document), { label, asset_kind: kind, visibility: "advisor-only", description }, document.state.profile);
      });
      v06Dialog = null;
      v06Announcement = "Draft Scope asset created. No authority dimension was accepted.";
    });
    main.querySelectorAll<HTMLButtonElement>("[data-v06-decision-submit]").forEach(button => button.addEventListener("click", () => {
      if (v06Dialog?.kind !== "decision") return;
      const id = v06Dialog.id;
      const decision = v06Scope(store.document).decisions.find(item => item.id === id);
      if (!decision) return;
      const modified = decision.field_changes.flatMap((change, index) => {
        const selected = main.querySelector<HTMLInputElement>(`[data-v06-change-index="${index}"]`)?.checked ?? false;
        if (!selected) return [];
        const value = main.querySelector<HTMLInputElement>(`[data-v06-change-value="${index}"]`)?.value ?? change.new_value;
        return [{ ...change, new_value: sanitizePlainText(value, 500) }];
      });
      if (!modified.length) { v06Announcement = "Select at least one proposed field change."; v06Render(main, store); return; }
      store.execute("scope.decision.accepted", "scope_decision", id, "Accepted an exact-version Scope decision after atomic-effect review.", document => {
        acceptScopeDecision(v06Scope(document), id, document.state.profile, button.dataset.v06DecisionSubmit === "exact" ? undefined : modified);
      }, "Accepted Scope decision");
      v06Dialog = null;
      v06Announcement = "Scope decision accepted. Only the reviewed Scope-owned fields changed.";
    }));
    main.querySelectorAll<HTMLButtonElement>("[data-v06-decision-return]").forEach(button => button.addEventListener("click", () => {
      const id = button.dataset.v06DecisionReturn ?? "";
      store.execute("scope.decision.returned", "scope_decision", id, "Returned a Scope decision without changing governed object values.", document => {
        const item = v06Scope(document).decisions.find(decision => decision.id === id);
        if (!item) throw new Error("Scope decision not found.");
        item.decision_state = "returned";
        item.review_state = "changes-requested";
        item.reviewer_comment = "Returned from atomic-effect review for clarification.";
        item.version++;
        item.updated_at = nowIso();
      });
      v06Dialog = null;
      v06Announcement = "Decision returned without changing governed Scope object values.";
    }));
    main.querySelectorAll<HTMLButtonElement>("[data-v06-review-submit]").forEach(button => button.addEventListener("click", () => {
      if (v06Dialog?.kind !== "review") return;
      const { id, action } = v06Dialog;
      const comment = main.querySelector<HTMLTextAreaElement>("#v06-review-comment")?.value ?? "";
      const decision = projection.decisions.find(item => item.id === id);
      const changes = decision?.field_changes.map((change, index) => ({ ...change, new_value: sanitizePlainText(main.querySelector<HTMLInputElement>(`[data-v06-review-change="${index}"]`)?.value ?? change.new_value, 500) }));
      store.execute(`scope.decision.reviewer-${action}`, "scope_decision", id, `Reviewer ${action} disposition recorded.`, document => {
        recordScopeReviewerDisposition(v06Scope(document), id, action, comment, document.state.profile, action === "concur-with-changes" ? changes : undefined);
      });
      v06Dialog = null;
      v06Announcement = `Reviewer ${v06Words(action)} disposition recorded without direct object mutation.`;
    }));
    main.querySelectorAll<HTMLButtonElement>("[data-v06-unknown-submit]").forEach(button => button.addEventListener("click", () => {
      const id = button.dataset.v06UnknownSubmit ?? "";
      let questionId = "";
      store.execute("scope.unknown.question-candidate-published", "scope_unknown", id, "Published one Scope Unknown as a draft Session Planner question candidate.", document => {
        questionId = publishScopeUnknownToSessionPlanner(v06Scope(document), id, document.state.interviews, document.state.profile).question_id;
      });
      v06Dialog = null;
      v06Announcement = `Session Planner question candidate created. It has not been added to a live agenda or accepted as a client statement. Candidate: ${questionId}.`;
    }));
    main.querySelectorAll<HTMLButtonElement>("[data-v06-candidate-submit]").forEach(button => button.addEventListener("click", () => {
      const id = button.dataset.v06CandidateSubmit ?? "";
      const action = main.querySelector<HTMLSelectElement>("#v06-candidate-action")?.value as "accept" | "modify" | "return" | "reject";
      const rationale = main.querySelector<HTMLTextAreaElement>("#v06-candidate-rationale")?.value ?? "";
      if (!rationale.trim()) { v06Announcement = "Candidate disposition requires rationale."; v06Render(main, store); return; }
      store.execute(`scope.candidate.${action}`, "scope_candidate", id, `${v06Words(action)}ed a Scope-owned candidate.`, document => {
        decideScopeCandidate(v06Scope(document), id, action, document.state.profile, rationale);
      });
      v06Dialog = null;
      v06Announcement = "Candidate disposition recorded. No source-domain accepted state was changed.";
    }));
  }

  export function v06GenerateDiagram(store: ProjectStore): void {
    store.execute("scope.diagram.generated", "scope_diagram", newId("scope-action"), "Generated a deterministic draft Scope diagram without changing object authority.", document => {
      const scope = v06Scope(document);
      const ids = [...scope.boundaries, ...scope.systems, ...scope.assets, ...scope.providers, ...scope.services, ...scope.data_flows].filter(item => item.lifecycle !== "archived").slice(0, 40).map(item => item.id);
      if (!ids.length) throw new Error("No Scope records are available for a diagram.");
      scope.diagrams.push(createScopeDiagram(scope, `Scope diagram ${scope.diagrams.length + 1}`, ids, document.state.profile));
      scope.updated_at = nowIso();
      scope.revision++;
    }, "Generated Scope diagram draft");
    v06Tab = "diagrams";
    v06Announcement = "Draft representation generated. Scope authority did not change.";
  }

  export function v06RefreshDiagram(store: ProjectStore, id: string): void {
    let nextId = "";
    store.execute("scope.diagram.superseding-draft-created", "scope_diagram", id, "Preserved a prior exact representation and created a refreshed superseding draft.", document => {
      nextId = createSupersedingScopeDiagram(v06Scope(document), id, document.state.profile).id;
    }, "Created superseding Scope diagram draft");
    v06Selected = nextId;
    v06Announcement = "Prior exact representation preserved; refreshed draft created with reciprocal supersession.";
  }

  export function v06ReviewDiagram(store: ProjectStore, id: string): void {
    store.execute("scope.diagram.reviewed", "scope_diagram", id, "Marked a diagram reviewed as a representation; no object authority changed.", document => {
      const item = v06Scope(document).diagrams.find(diagram => diagram.id === id);
      if (!item) throw new Error("Scope diagram not found.");
      item.diagram_review_state = "reviewed";
      item.review_state = "reviewed";
      item.version++;
      item.updated_at = nowIso();
    });
    v06Announcement = "Diagram marked reviewed as a representation only.";
  }

  export function v06DiagramControl(main: HTMLElement, store: ProjectStore, id: string, action: string): void {
    const current = v06DiagramZoom.get(id) ?? 1;
    let next = current;
    if (action === "fit") next = 0.75;
    else if (action === "100") next = 1;
    else if (action === "in") next = Math.min(1.75, current + 0.25);
    else if (action === "out") next = Math.max(0.5, current - 0.25);
    else if (action === "center") {
      const selected = v06Selected ? main.querySelector<HTMLElement>(`[data-v06-ref="${CSS.escape(v06Selected)}"]`) : null;
      selected?.scrollIntoView({ block: "center", inline: "center" });
      selected?.focus();
      return;
    }
    v06DiagramZoom.set(id, next);
    v06Render(main, store);
  }

  export function v06ChooseImport(): void {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (file) void v06LoadImport(file);
    });
    input.click();
  }

  async function v06LoadImport(file: File): Promise<void> {
    try {
      const hooks = v06Hooks();
      if (!hooks) return;
      const raw = await previewScopePackage(new Uint8Array(await file.arrayBuffer()), file.name);
      v06Preview = analyzeScopeImportPreview(v06Scope(hooks.store.document), raw);
      const main = document.getElementById("workspace");
      if (main) { v06FocusSelector = "#v06-import-title"; v06Render(main, hooks.store); }
    } catch (error) {
      v06Preview = null;
      v06Announcement = `Scope package preview failed: ${errorMessage(error)}`;
      const main = document.getElementById("workspace"), hooks = v06Hooks();
      if (main && hooks) v06Render(main, hooks.store);
    }
  }

}
namespace L2G {
  export function v06BindImport(main: HTMLElement, store: ProjectStore): void {
    if (!v06Preview) return;
    main.querySelector("#v06-close-import")?.addEventListener("click", () => { v06Preview = null; v06FocusSelector = "#v06-import"; v06Render(main, store); });
    main.querySelector("#v06-reject-import")?.addEventListener("click", () => { v06Preview = null; v06Announcement = "Import preview rejected before mutation."; v06Render(main, store); });
    main.querySelectorAll<HTMLInputElement>("[data-v06-import-record]").forEach(input => input.addEventListener("change", () => {
      const item = v06Preview?.records.find(record => record.import_record_id === input.dataset.v06ImportRecord);
      if (item) item.selected = input.checked;
      v06Render(main, store);
    }));
    main.querySelectorAll<HTMLSelectElement>("[data-v06-treatment]").forEach(select => select.addEventListener("change", () => {
      const item = v06Preview?.records.find(record => record.import_record_id === select.dataset.v06Treatment);
      if (item) item.treatment = select.value as ScopeImportCandidate["treatment"];
      v06Render(main, store);
    }));
    main.querySelectorAll<HTMLSelectElement>("[data-v06-target]").forEach(select => select.addEventListener("change", () => {
      const item = v06Preview?.records.find(record => record.import_record_id === select.dataset.v06Target);
      if (item) item.exact_target_ref = select.value || null;
      v06Render(main, store);
    }));
    main.querySelector("#v06-apply-import")?.addEventListener("click", () => {
      if (!v06Preview || v06ImportUnresolved(v06Preview)) return;
      const preview = v06Preview;
      store.execute("scope.import.applied", "scope_import", preview.package_sha256, "Applied a reviewed Scope package subset atomically as low-authority candidates or explicit links.", document => {
        applyScopeImport(v06Scope(document), preview, document.state.profile);
      }, "Applied Scope compatibility package");
      v06Preview = null;
      v06Tab = "decisions";
      v06Announcement = "Reviewed import subset applied atomically. Similar names were not auto-merged and no boundary decision was accepted.";
    });
  }

  document.addEventListener("change", event => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement) || !v06ProfileSelect(target)) return;
    const next = target.value as PresentationProfile;
    v06ResetTransient(next);
  }, true);

  export const v06Observer = new MutationObserver(() => v06Queue());
  export const v06Root = document.getElementById("app");
  if (v06Root) v06Observer.observe(v06Root, { childList: true, subtree: true });
  v06Queue();
}
