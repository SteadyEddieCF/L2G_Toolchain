namespace L2G {
  interface V061ActionHooks { store: ProjectStore; }

  let v061ActiveDialog: HTMLDialogElement | null = null;
  let v061ActionEnhanceQueued = false;

  function v061ActionHooks(): V061ActionHooks | null {
    return ((window as unknown as { __L2G_TEST__?: V061ActionHooks }).__L2G_TEST__) ?? null;
  }

  function v061ActionEscape(value: unknown): string {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]!));
  }

  function v061ActionScope(document: ProjectDocument): ScopeDomain {
    const scope = document.state.scope;
    if (!scope) throw new Error("The v0.6.1 Scope domain is missing.");
    return scope;
  }

  function v061CloseActionDialog(): void {
    if (!v061ActiveDialog) return;
    const dialog = v061ActiveDialog;
    v061ActiveDialog = null;
    if (dialog.open) dialog.close();
    dialog.remove();
  }

  function v061OpenActionDialog(
    title: string,
    body: string,
    origin: HTMLElement | null,
    bind: (dialog: HTMLDialogElement) => void
  ): HTMLDialogElement {
    v061CloseActionDialog();
    const dialog = document.createElement("dialog");
    dialog.className = "scope-import-dialog v061-action-dialog";
    dialog.setAttribute("aria-labelledby", "v061-action-title");
    dialog.innerHTML = `<form method="dialog"><div class="scope-inspector-heading"><div><h2 id="v061-action-title">${v061ActionEscape(title)}</h2><p>Review exact effects before any governed mutation.</p></div><button value="cancel" data-v061-close aria-label="Close action review">×</button></div>${body}</form>`;
    document.body.append(dialog);
    v061ActiveDialog = dialog;
    dialog.addEventListener("cancel", event => {
      event.preventDefault();
      v061CloseActionDialog();
      queueMicrotask(() => origin?.focus());
    });
    dialog.querySelector("[data-v061-close]")?.addEventListener("click", event => {
      event.preventDefault();
      v061CloseActionDialog();
      queueMicrotask(() => origin?.focus());
    });
    bind(dialog);
    dialog.showModal();
    queueMicrotask(() => dialog.querySelector<HTMLElement>("button:not([disabled]), input:not([disabled]), textarea:not([disabled])")?.focus());
    return dialog;
  }

  function v061DecisionRecordMap(scope: ScopeDomain): Map<string, ScopeRecordBase> {
    return scopeRecordMap(scope);
  }

  function v061DecisionIsStale(decision: ScopeDecision, scope: ScopeDomain): boolean {
    if (decision.currency_state === "stale" || decision.currency_state === "conflicted") return true;
    const map = v061DecisionRecordMap(scope);
    return decision.affected_record_refs.some(ref => map.get(ref.id)?.version !== ref.version);
  }

  function v061OpenDecisionReview(id: string, origin: HTMLElement): void {
    const hooks = v061ActionHooks();
    if (!hooks) return;
    const scope = v061ActionScope(hooks.store.document);
    const decision = scope.decisions.find(item => item.id === id);
    if (!decision) throw new Error("Scope decision not found.");
    const map = v061DecisionRecordMap(scope);
    const stale = v061DecisionIsStale(decision, scope);
    const affected = decision.affected_record_refs.map(ref => {
      const record = map.get(ref.id);
      return `<li><strong>${v061ActionEscape(record?.label ?? ref.id)}</strong><br><code>${v061ActionEscape(ref.id)}</code> · expected version ${ref.version} · current version ${record?.version ?? "missing"}</li>`;
    }).join("");
    const changes = decision.field_changes.map((change, index) => {
      const current = decision.affected_record_refs.length === 1
        ? String((map.get(decision.affected_record_refs[0]!.id) as unknown as Record<string, unknown> | undefined)?.[change.field] ?? change.old_value)
        : change.old_value;
      return `<label class="scope-list-card"><input type="checkbox" data-v061-change="${index}" checked ${stale ? "disabled" : ""}><span><strong>${v061ActionEscape(change.field.replace(/_/g, " "))}</strong><small>${v061ActionEscape(current)} → ${v061ActionEscape(change.new_value)}</small></span></label>`;
    }).join("");
    const warning = stale
      ? `<div class="notice warning" role="alert">Acceptance is unavailable because an affected exact record version changed or the proposal is conflicted. Compare the current record and update or supersede this proposal.</div>`
      : "";
    const body = `<div class="notice">Accepting this decision changes only the selected Scope-owned fields. It does not change Engagement, Evidence, Pre-Engagement, Interview Sessions, source packages, implementation state, or assessment conclusions.</div><p><strong>${v061ActionEscape(decision.label)}</strong></p><p>${v061ActionEscape(decision.rationale)}</p><h3>Affected exact records</h3><ul>${affected}</ul><h3>Proposed field changes</h3><p class="muted">Asset category and Scope disposition are separate dimensions. Review each proposed change independently.</p><div>${changes}</div><h3>Source and unresolved context</h3><p>Source basis: ${decision.source_basis_refs.length ? decision.source_basis_refs.map(ref => `${v061ActionEscape(ref.id)} v${ref.version}`).join(", ") : "No exact source basis recorded."}</p><p>Unknowns: ${decision.unknown_refs.length ? decision.unknown_refs.map(v061ActionEscape).join(", ") : "None recorded."}</p>${warning}<label>Return or modification comment<textarea data-v061-comment rows="3" placeholder="Optional comment for history"></textarea></label><div class="scope-card-actions"><button type="button" data-v061-cancel>Cancel</button><button type="button" data-v061-return>Return proposal</button><button type="button" class="primary" data-v061-accept ${stale ? "disabled" : ""}>Accept selected Scope changes</button></div><p data-v061-error class="notice warning" hidden></p>`;
    v061OpenActionDialog("Review Scope decision effects", body, origin, dialog => {
      dialog.querySelector("[data-v061-cancel]")?.addEventListener("click", () => { v061CloseActionDialog(); origin.focus(); });
      dialog.querySelector("[data-v061-return]")?.addEventListener("click", () => {
        const comment = (dialog.querySelector<HTMLTextAreaElement>("[data-v061-comment]")?.value ?? "").trim() || "Returned after structured effect review.";
        hooks.store.execute("scope.decision.returned", "scope_decision", id, "Returned a Scope decision without changing governed object values.", documentValue => {
          const item = v061ActionScope(documentValue).decisions.find(candidate => candidate.id === id);
          if (!item) throw new Error("Scope decision not found.");
          item.decision_state = "returned";
          item.review_state = "changes-requested";
          item.reviewer_comment = sanitizePlainText(comment, 100000);
          item.version++;
          item.updated_at = nowIso();
        });
        v061CloseActionDialog();
      });
      dialog.querySelector("[data-v061-accept]")?.addEventListener("click", () => {
        const selected = [...dialog.querySelectorAll<HTMLInputElement>("[data-v061-change]:checked")].map(input => decision.field_changes[Number(input.dataset.v061Change)]).filter((value): value is ScopeFieldChange => Boolean(value));
        const error = dialog.querySelector<HTMLElement>("[data-v061-error]");
        if (!selected.length) {
          if (error) { error.hidden = false; error.textContent = "Select at least one independent Scope field change."; }
          return;
        }
        try {
          hooks.store.execute("scope.decision.accepted", "scope_decision", id, "Accepted selected exact-version Scope decision effects.", documentValue => {
            acceptScopeDecision(v061ActionScope(documentValue), id, documentValue.state.profile, selected);
          }, "Accepted selected Scope decision effects");
          v061CloseActionDialog();
        } catch (caught) {
          if (error) { error.hidden = false; error.textContent = errorMessage(caught); }
        }
      });
    });
  }

  function v061OpenReviewerDisposition(id: string, action: "concur" | "concur-with-changes" | "return" | "reject", origin: HTMLElement): void {
    const hooks = v061ActionHooks();
    if (!hooks) return;
    const decision = v061ActionScope(hooks.store.document).decisions.find(item => item.id === id);
    if (!decision) throw new Error("Scope decision not found.");
    const label = action === "concur-with-changes" ? "Concur with changes" : action.replace(/\b\w/g, char => char.toUpperCase());
    const body = `<div class="notice">Reviewer dispositions do not directly edit governed Scope objects. Accepted field changes remain Scope decision actions.</div><p><strong>${v061ActionEscape(decision.label)}</strong></p><ul>${decision.affected_record_refs.map(ref => `<li><code>${v061ActionEscape(ref.id)}</code> · version ${ref.version}</li>`).join("")}</ul><h3>Proposed changes</h3><ul>${decision.field_changes.map(change => `<li>${v061ActionEscape(change.field)}: ${v061ActionEscape(change.old_value)} → ${v061ActionEscape(change.new_value)}</li>`).join("")}</ul><label>Reviewer comment<textarea data-v061-review-comment rows="4" ${action === "concur-with-changes" || action === "return" || action === "reject" ? "required" : ""}></textarea></label><div class="scope-card-actions"><button type="button" data-v061-cancel>Cancel</button><button type="button" class="primary" data-v061-submit-review>${v061ActionEscape(label)}</button></div><p data-v061-error class="notice warning" hidden></p>`;
    v061OpenActionDialog(`Reviewer disposition — ${label}`, body, origin, dialog => {
      dialog.querySelector("[data-v061-cancel]")?.addEventListener("click", () => { v061CloseActionDialog(); origin.focus(); });
      dialog.querySelector("[data-v061-submit-review]")?.addEventListener("click", () => {
        const comment = (dialog.querySelector<HTMLTextAreaElement>("[data-v061-review-comment]")?.value ?? "").trim();
        const error = dialog.querySelector<HTMLElement>("[data-v061-error]");
        if ((action === "concur-with-changes" || action === "return" || action === "reject") && !comment) {
          if (error) { error.hidden = false; error.textContent = "A reviewer comment is required for this disposition."; }
          return;
        }
        hooks.store.execute(`scope.decision.reviewer-${action}`, "scope_decision", id, `Reviewer ${label.toLowerCase()} disposition recorded.`, documentValue => {
          const item = v061ActionScope(documentValue).decisions.find(candidate => candidate.id === id);
          if (!item) throw new Error("Scope decision not found.");
          item.reviewer_disposition = action;
          item.reviewer_comment = sanitizePlainText(comment, 100000);
          item.review_state = action === "concur" ? "reviewed" : action === "reject" ? "rejected" : "changes-requested";
          item.version++;
          item.updated_at = nowIso();
        });
        v061CloseActionDialog();
      });
    });
  }

  function v061OpenUnknownPublication(id: string, origin: HTMLElement): void {
    const hooks = v061ActionHooks();
    if (!hooks) return;
    const scope = v061ActionScope(hooks.store.document);
    const unknown = scope.unknowns.find(item => item.id === id);
    if (!unknown) throw new Error("Scope unknown not found.");
    const body = `<div class="notice">Publishing creates one Session Planner question candidate. It does not add a live agenda item, accept a client statement, or resolve the Scope unknown.</div><p><strong>${v061ActionEscape(unknown.label)}</strong></p><p>${v061ActionEscape(unknown.statement)}</p><dl><dt>Exact source</dt><dd><code>${v061ActionEscape(unknown.id)}</code> · version ${unknown.version}</dd><dt>Visibility</dt><dd>${v061ActionEscape(unknown.visibility)}</dd><dt>Affected records</dt><dd>${unknown.affected_refs.length ? unknown.affected_refs.map(v061ActionEscape).join(", ") : "None recorded"}</dd><dt>Suggested participants</dt><dd>Advisor-selected participants</dd></dl><div class="scope-card-actions"><button type="button" data-v061-cancel>Cancel</button><button type="button" class="primary" data-v061-publish>Publish question candidate</button></div><p data-v061-result class="notice" hidden></p>`;
    v061OpenActionDialog("Publish Scope unknown to Session Planner", body, origin, dialog => {
      dialog.querySelector("[data-v061-cancel]")?.addEventListener("click", () => { v061CloseActionDialog(); origin.focus(); });
      dialog.querySelector("[data-v061-publish]")?.addEventListener("click", () => {
        let candidateId = "";
        hooks.store.execute("scope.unknown.question-candidate-published", "scope_unknown", id, "Published a Scope unknown as a Session Planner question candidate without agenda insertion.", documentValue => {
          candidateId = publishScopeUnknownQuestion(v061ActionScope(documentValue), id, documentValue.state.interviews, documentValue.state.profile);
        }, "Published Scope question candidate");
        const result = dialog.querySelector<HTMLElement>("[data-v061-result]");
        if (result) {
          result.hidden = false;
          result.textContent = `Session Planner question candidate created (${candidateId}). It has not been added to a live agenda or accepted as a client statement.`;
        }
        const button = dialog.querySelector<HTMLButtonElement>("[data-v061-publish]");
        if (button) button.disabled = true;
      });
    });
  }

  function v061EnhanceActionSurfaces(): void {
    const hooks = v061ActionHooks();
    if (!hooks || hooks.store.document.state.active_workspace !== "scope") return;
    const profile = hooks.store.document.state.profile;
    const scope = hooks.store.document.state.scope;
    if (!scope) return;

    if (profile === "reviewer") {
      document.querySelectorAll<HTMLElement>(".scope-decision-card").forEach(card => {
        const id = card.querySelector<HTMLElement>("[data-v06-ref]")?.dataset.v06Ref ?? "";
        const actions = card.querySelector<HTMLElement>(".scope-card-actions");
        if (!id || !actions || actions.querySelector("[data-v061-review-changes]")) return;
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.v061ReviewChanges = id;
        button.textContent = "Concur with changes";
        actions.insertBefore(button, actions.children[1] ?? null);
      });
    }

    if (profile === "advisor") {
      const identity = document.querySelector<HTMLElement>(".scope-inspector-heading p")?.textContent ?? "";
      const id = identity.split(" · ")[0]?.trim() ?? "";
      const unknown = scope.unknowns.find(item => item.id === id);
      const inspector = document.querySelector<HTMLElement>(".scope-inspector");
      if (unknown && inspector && !inspector.querySelector("[data-v061-publish-unknown]")) {
        const heading = document.createElement("h3");
        heading.textContent = "Valid actions";
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.v061PublishUnknown = unknown.id;
        button.textContent = unknown.session_question_candidate_ref ? "Question candidate already published" : "Publish question candidate";
        button.disabled = Boolean(unknown.session_question_candidate_ref);
        inspector.append(heading, button);
      }
    }
  }

  function v061QueueActionEnhance(): void {
    if (v061ActionEnhanceQueued) return;
    v061ActionEnhanceQueued = true;
    queueMicrotask(() => {
      v061ActionEnhanceQueued = false;
      v061EnhanceActionSurfaces();
    });
  }

  document.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const accept = target.closest<HTMLElement>("[data-v06-accept-decision]");
    if (accept) {
      event.preventDefault();
      event.stopImmediatePropagation();
      v061OpenDecisionReview(accept.dataset.v06AcceptDecision ?? "", accept);
      return;
    }
    const review = target.closest<HTMLElement>("[data-v06-review]");
    if (review) {
      event.preventDefault();
      event.stopImmediatePropagation();
      v061OpenReviewerDisposition(review.dataset.v06Review ?? "", (review.dataset.v06ReviewAction ?? "return") as "concur" | "return" | "reject", review);
      return;
    }
    const reviewChanges = target.closest<HTMLElement>("[data-v061-review-changes]");
    if (reviewChanges) {
      event.preventDefault();
      event.stopImmediatePropagation();
      v061OpenReviewerDisposition(reviewChanges.dataset.v061ReviewChanges ?? "", "concur-with-changes", reviewChanges);
      return;
    }
    const publish = target.closest<HTMLElement>("[data-v061-publish-unknown]");
    if (publish) {
      event.preventDefault();
      event.stopImmediatePropagation();
      v061OpenUnknownPublication(publish.dataset.v061PublishUnknown ?? "", publish);
    }
  }, true);

  const v061ActionRoot = document.getElementById("app");
  if (v061ActionRoot) new MutationObserver(v061QueueActionEnhance).observe(v061ActionRoot, { childList: true, subtree: true });
  v061QueueActionEnhance();
}
