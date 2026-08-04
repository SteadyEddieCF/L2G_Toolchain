namespace L2G {
  let workspaceStore: ProjectStore | null = null;
  let workspaceObserver: MutationObserver | null = null;
  let workspaceMessage = "";
  let workspaceRendering = false;

  const inheritedSubscribe = ProjectStore.prototype.subscribe;
  ProjectStore.prototype.subscribe = function (this: ProjectStore, listener: () => void): () => void {
    workspaceStore = this;
    return inheritedSubscribe.call(this, listener);
  };

  function wx(value: unknown): string {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[character] ?? character));
  }

  function wt(record: Record<string, unknown>, key: string): string {
    const value = record[key];
    return typeof value === "string" ? value : value === null || value === undefined ? "" : String(value);
  }

  function wn(record: Record<string, unknown>, key: string): number {
    const value = record[key];
    return typeof value === "number" && Number.isFinite(value) ? value : 0;
  }

  function notice(): string {
    return workspaceMessage ? `<div class="notice ok" role="status">${wx(workspaceMessage)}</div>` : "";
  }

  function command(
    action: string,
    objectType: string,
    objectId: string,
    summary: string,
    mutator: (document: ProjectDocument) => void,
    checkpoint?: string
  ): void {
    if (!workspaceStore) throw new Error("The project store is unavailable.");
    workspaceStore.execute(action, objectType, objectId, summary, mutator, checkpoint);
  }

  function renderPreEngagement(store: ProjectStore): string {
    const profile = store.document.state.profile;
    const projection = buildPreEngagementProjection(store.document.state.pre_engagement, "pre-engagement", profile);
    const responseRows = projection.responses.map(response => {
      const id = wt(response, "response_id");
      const review = wt(response, "review_state");
      return `<tr>
        <td data-label="Response"><strong>${wx(wt(response, "display_text") || "Blank response")}</strong></td>
        <td data-label="Origin"><span class="status">${wx(wt(response, "origin"))}</span></td>
        <td data-label="Review">${wx(review)}</td>
        <td data-label="Actions">${profile === "advisor" ? `<div class="card-actions">
          ${review !== "reviewed" ? `<button data-v05-action="review-response" data-record-id="${wx(id)}">Approve response</button>` : ""}
          <button data-v05-action="propose-response" data-record-id="${wx(id)}">Create proposal</button>
        </div>` : "Read only"}</td>
      </tr>`;
    }).join("") || `<tr><td colspan="4">No profile-visible responses are recorded.</td></tr>`;

    const requests = projection.requests.map(request => `<article class="card">
      <div class="card-heading"><div><h2>${wx(wt(request, "title"))}</h2><p>${wx(wt(request, "description"))}</p></div><span class="status">${wx(wt(request, "operational_state"))}</span></div>
      <p class="meta">${wx(wt(request, "kind"))} · due ${wx(wt(request, "due_date") || "not set")} · review ${wx(wt(request, "review_state"))}</p>
    </article>`).join("") || `<div class="empty">No profile-visible intake requests are recorded.</div>`;

    const candidates = profile === "client" ? "" : projection.candidates.map(candidate => `<article class="card">
      <h3>${wx(wt(candidate, "target_type"))}</h3><p>${wx(wt(candidate, "rationale"))}</p><p class="meta">${wx(wt(candidate, "target_domain"))} · ${wx(wt(candidate, "state"))}</p>
    </article>`).join("") || `<div class="empty">No Pre-Engagement proposals are queued.</div>`;

    return `<section data-v05-workspace="pre-engagement" aria-labelledby="workspace-title">
      ${notice()}
      <div class="workspace-header"><div><h1 id="workspace-title">Pre-Engagement</h1><p>Govern intake requests, immutable assignment snapshots, submissions, response origin, conflicts, and proposals.</p></div><span class="badge">${wx(profile)}</span></div>
      <div class="notice">Response origin is preserved. Advisor-entered, imported, source-derived, and interpreted content is never relabeled as a client-provided answer.</div>
      <div class="metrics">
        <div class="metric"><strong>${projection.completeness.received_assignments}/${projection.completeness.required_assignments}</strong><span>assignments received</span></div>
        <div class="metric"><strong>${projection.completeness.missing_required_responses}</strong><span>required responses missing</span></div>
        <div class="metric"><strong>${projection.completeness.overdue_requests}</strong><span>overdue requests</span></div>
        <div class="metric"><strong>${projection.completeness.unresolved_exceptions}</strong><span>unresolved exceptions</span></div>
      </div>
      <h2>Requests</h2><div class="grid">${requests}</div>
      <h2>Responses and origin</h2><div class="table-wrap"><table><thead><tr><th>Response</th><th>Origin</th><th>Review</th><th>Actions</th></tr></thead><tbody>${responseRows}</tbody></table></div>
      <h2>Next work</h2><div class="grid">${projection.next_work.map(item => `<article class="card"><h3>${wx(item.title)}</h3><p>${wx(item.detail)}</p><p class="meta">${wx(item.kind)}</p></article>`).join("")}</div>
      ${profile !== "client" ? `<h2>Proposals</h2><div class="grid">${candidates}</div>` : ""}
      <div class="notice">These are factual intake indicators only. They do not determine readiness, compliance, risk, evidence sufficiency, certification, scoring, implementation, or Met/Not Met.</div>
    </section>`;
  }

  function renderSessionList(store: ProjectStore, projection: InterviewProjection): string {
    const profile = store.document.state.profile;
    const sessionCards = projection.sessions.map(session => {
      const id = wt(session, "session_id");
      const lifecycle = wt(session, "lifecycle");
      return `<article class="card">
        <div class="card-heading"><div><h2>${wx(wt(session, "title"))}</h2><p>${wx(wt(session, "purpose"))}</p></div><span class="status">${wx(lifecycle)}</span></div>
        <p class="meta">Facilitator ${wx(wt(session, "facilitator_label") || "Unassigned")} · review ${wx(wt(session, "post_session_review_state"))}</p>
        ${profile === "advisor" ? `<div class="card-actions">
          ${lifecycle === "ready" ? `<button class="primary" data-v05-action="start-session" data-session-id="${wx(id)}">Start Interview Mode</button>` : ""}
          ${lifecycle === "paused" ? `<button class="primary" data-v05-action="resume-session" data-session-id="${wx(id)}">Resume</button>` : ""}
          ${lifecycle === "completed" && wt(session, "post_session_review_state") !== "reviewed" ? `<button data-v05-action="review-session" data-session-id="${wx(id)}">Mark post-session review complete</button>` : ""}
        </div>` : ""}
      </article>`;
    }).join("") || `<div class="empty">No profile-visible Interview sessions are recorded.</div>`;

    return `<section data-v05-workspace="interviews" aria-labelledby="workspace-title">
      ${notice()}
      <div class="workspace-header"><div><h1 id="workspace-title">Practice Review · Interview Sessions</h1><p>Plan and facilitate structured discovery before authoritative Practice Review conclusions are introduced in a later release.</p></div><span class="badge">${wx(profile)}</span></div>
      <div class="notice">Completing a session, confirming a statement, or reviewing a summary does not create Scope, Practice Review, SSP, readiness, compliance, or Met/Not Met conclusions.</div>
      <h2>Session planner</h2><div class="grid">${projection.plans.map(plan => `<article class="card"><h3>${wx(wt(plan, "title"))}</h3><p>${wx(wt(plan, "purpose"))}</p><p class="meta">${wx(wt(plan, "lifecycle"))} · ${wx(wt(plan, "currency_state"))} · ${wn(plan, "planned_duration_minutes")} minutes</p></article>`).join("")}</div>
      <h2>Sessions</h2><div class="grid">${sessionCards}</div>
      <h2>Next work</h2><div class="grid">${projection.next_work.map(item => `<article class="card"><h3>${wx(item.title)}</h3><p>${wx(item.detail)}</p><p class="meta">${wx(item.kind)}</p></article>`).join("")}</div>
    </section>`;
  }

  function renderLiveSession(store: ProjectStore, projection: InterviewProjection, session: Record<string, unknown>): string {
    const profile = store.document.state.profile;
    const sessionId = wt(session, "session_id");
    const lifecycle = wt(session, "lifecycle");
    const questions = projection.session_questions.filter(record => wt(record, "session_ref") === sessionId).sort((left, right) => wn(left, "order") - wn(right, "order"));
    const activeRef = wt(session, "active_session_question_ref");
    const current = questions.find(record => wt(record, "session_question_id") === activeRef) ?? questions[0] ?? null;
    const questionId = current ? wt(current, "session_question_id") : "";
    const snapshot = current && isRecord(current.question_snapshot) ? current.question_snapshot : {};
    const index = current ? questions.findIndex(record => wt(record, "session_question_id") === questionId) : -1;
    const previous = index > 0 ? questions[index - 1] : null;
    const next = index >= 0 && index + 1 < questions.length ? questions[index + 1] : null;
    const statements = projection.participant_statements.filter(record => wt(record, "session_question_ref") === questionId);
    const notes = profile === "client" ? [] : projection.advisor_notes.filter(record => wt(record, "session_question_ref") === questionId);

    return `<section data-v05-workspace="interview-live" aria-labelledby="workspace-title">
      ${notice()}
      <div class="workspace-header"><div><h1 id="workspace-title">Interview Mode</h1><p>${wx(wt(session, "title"))}</p></div><span class="badge">${wx(projection.progress.label)}</span></div>
      <div class="notice">${profile === "client" ? "Client Presentation Mode is constructed from a filtered projection. Internal notes, proposals, receipts, and hidden counts are omitted before rendering." : "Participant statements and Advisor observations remain separate records."}</div>
      <div class="grid">
        <article class="card">
          <p class="meta">${wx(wt(snapshot, "topic_label"))} · ${wx(wt(current ?? {}, "origin"))}</p>
          <h2>${wx(wt(snapshot, "prompt") || "No active question")}</h2><p>${wx(wt(snapshot, "client_safe_explanation"))}</p>
          ${profile === "advisor" && lifecycle === "in-progress" ? `<div class="card-actions">
            <button data-v05-action="navigate" data-session-id="${wx(sessionId)}" data-question-id="${wx(previous ? wt(previous, "session_question_id") : "")}" ${previous ? "" : "disabled"}>Previous</button>
            <button data-v05-action="navigate" data-session-id="${wx(sessionId)}" data-question-id="${wx(next ? wt(next, "session_question_id") : "")}" ${next ? "" : "disabled"}>Next</button>
            <button data-v05-action="pause-session" data-session-id="${wx(sessionId)}">Pause and checkpoint</button>
            <button data-v05-action="complete-session" data-session-id="${wx(sessionId)}">End session</button>
          </div>` : ""}
          ${profile === "advisor" && lifecycle === "paused" ? `<button class="primary" data-v05-action="resume-session" data-session-id="${wx(sessionId)}">Resume at recorded question</button>` : ""}
        </article>
        <article class="card"><h2>Agenda</h2>${questions.map(question => `<button class="search-result" data-v05-action="navigate" data-session-id="${wx(sessionId)}" data-question-id="${wx(wt(question, "session_question_id"))}" ${profile === "advisor" && lifecycle === "in-progress" ? "" : "disabled"}><strong>${wn(question, "order")}. ${wx(wt(isRecord(question.question_snapshot) ? question.question_snapshot : {}, "topic_label"))}</strong><br><span class="muted">${wx(wt(question, "state"))}</span></button>`).join("")}</article>
      </div>
      ${lifecycle === "in-progress" && questionId ? `<div class="grid">
        <form class="card" data-v05-form="statement" data-session-id="${wx(sessionId)}" data-question-id="${wx(questionId)}"><h2>Participant statement</h2><label>Locally asserted speaker<input name="speaker" value="${profile === "client" ? "Participant" : "Synthetic participant"}"></label><label>Statement<textarea name="text" rows="6" required></textarea></label><button class="primary" type="submit">Record separate statement</button><p class="meta">Speaker identity is locally asserted, not authenticated.</p></form>
        ${profile === "advisor" ? `<form class="card" data-v05-form="note" data-session-id="${wx(sessionId)}" data-question-id="${wx(questionId)}"><h2>Internal Advisor note</h2><label>Title<input name="title" value="Facilitation observation"></label><label>Advisor-only note<textarea name="text" rows="6" required></textarea></label><button type="submit">Save Advisor-only note</button><p class="meta">This record cannot be escalated to Client visibility in v0.5.</p></form>` : ""}
      </div>` : ""}
      <h2>Statements for this question</h2><div class="grid">${statements.map(statement => {
        const statementId = wt(statement, "statement_id");
        const confirmed = projection.confirmations.some(record => wt(record, "confirmed_record_ref") === statementId && wt(record, "state") === "confirmed");
        return `<article class="card"><h3>${wx(wt(statement, "asserted_speaker_label") || "Locally asserted speaker")}</h3><p>${wx(wt(statement, "text"))}</p><p class="meta">${wx(wt(statement, "recording_method"))} · version ${wx(wt(statement, "version_number"))}</p><div class="card-actions">${confirmed ? `<span class="status">Locally confirmed</span>` : `<button data-v05-action="confirm" data-session-id="${wx(sessionId)}" data-record-id="${wx(statementId)}">Record read-back confirmation</button>`}${profile === "advisor" ? `<button data-v05-action="propose-statement" data-record-id="${wx(statementId)}">Create proposal</button>` : ""}</div></article>`;
      }).join("") || `<div class="empty">No participant statement is recorded for this question.</div>`}</div>
      ${profile !== "client" ? `<h2>Advisor-only notes for this question</h2><div class="grid">${notes.map(note => `<article class="card"><h3>${wx(wt(note, "title") || "Internal note")}</h3><p>${wx(wt(note, "text"))}</p><p class="meta">Advisor-only · ${wx(wt(note, "kind"))}</p></article>`).join("") || `<div class="empty">No internal Advisor note is recorded for this question.</div>`}</div>` : ""}
    </section>`;
  }

  function renderInterviews(store: ProjectStore): string {
    const projection = buildInterviewProjection(store.document.state.interviews, "practice-review", store.document.state.profile);
    const active = projection.active_session_ref ? projection.sessions.find(record => wt(record, "session_id") === projection.active_session_ref) ?? null : null;
    return active ? renderLiveSession(store, projection, active) : renderSessionList(store, projection);
  }

  function act(element: HTMLElement): void {
    if (!workspaceStore) return;
    const action = element.dataset.v05Action ?? "";
    const recordId = element.dataset.recordId ?? "";
    const sessionId = element.dataset.sessionId ?? "";
    const questionId = element.dataset.questionId ?? "";
    const profile = workspaceStore.document.state.profile;

    if (action === "review-response") {
      command("pre-engagement.response-reviewed", "intake-response", recordId, "Reviewed an intake response while preserving its origin.", document => {
        const response = document.state.pre_engagement.responses.find(item => item.response_id === recordId);
        if (!response) throw new Error("The intake response was not found.");
        response.review_state = "reviewed";
        response.updated_at = nowIso();
      });
      workspaceMessage = "Response approved; its source origin was preserved.";
    } else if (action === "propose-response") {
      command("pre-engagement.candidate-created", "intake-response", recordId, "Created a Pre-Engagement proposal without changing accepted target records.", document => {
        const response = document.state.pre_engagement.responses.find(item => item.response_id === recordId);
        if (!response) throw new Error("The intake response was not found.");
        createPreEngagementCandidate(document.state.pre_engagement, {
          source_refs: [recordId], target_domain: "engagement", target_type: "open-question", proposed_operation: "create",
          proposed_fields: { title: "Review intake response", detail: response.display_text },
          rationale: "Advisor-created proposal; Engagement must explicitly accept or modify it."
        }, profile);
      }, "Pre-Engagement proposal created");
      workspaceMessage = "Proposal queued without changing accepted Engagement records.";
    } else if (action === "start-session") {
      command("interview.session-started", "interview-session", sessionId, "Started the governed session from its frozen plan.", document => startInterviewSession(document.state.interviews, sessionId, profile), "Interview session started");
      workspaceMessage = "Interview Mode started from the frozen plan snapshot.";
    } else if (action === "pause-session") {
      const elapsed = workspaceStore.document.state.interviews.sessions.find(item => item.session_id === sessionId)?.elapsed_seconds_hint ?? 0;
      command("interview.session-paused", "interview-session", sessionId, "Paused the session at its exact current question.", document => pauseInterviewSession(document.state.interviews, sessionId, elapsed, profile), "Interview session paused");
      workspaceMessage = "Session paused and checkpointed at the recorded question.";
    } else if (action === "resume-session") {
      command("interview.session-resumed", "interview-session", sessionId, "Resumed the governed session at its recorded question.", document => resumeInterviewSession(document.state.interviews, sessionId, profile), "Interview session resumed");
      workspaceMessage = "Session resumed at the recorded question.";
    } else if (action === "complete-session") {
      command("interview.session-completed", "interview-session", sessionId, "Completed facilitation and opened post-session review.", document => completeInterviewSession(document.state.interviews, sessionId, profile), "Interview session completed");
      workspaceMessage = "Session completed; post-session review is pending.";
    } else if (action === "navigate" && questionId) {
      command("interview.question-navigated", "session-question", questionId, "Navigated the agenda without creating a conclusion.", document => navigateInterviewQuestion(document.state.interviews, sessionId, questionId, profile));
    } else if (action === "confirm") {
      command("interview.confirmation-recorded", "participant-statement", recordId, "Recorded a locally asserted confirmation for the exact statement version.", document => recordInterviewConfirmation(document.state.interviews, {
        session_ref: sessionId, confirmed_record_kind: "participant-statement", confirmed_record_ref: recordId,
        asserted_confirmer_participant_ref: null, asserted_confirmer_label: profile === "client" ? "Participant" : "Synthetic participant",
        method: "read-back-and-confirmed", visibility: "client-safe"
      }, profile), "Statement confirmation recorded");
      workspaceMessage = "Locally asserted confirmation recorded for the exact statement version.";
    } else if (action === "propose-statement") {
      command("interview.candidate-created", "participant-statement", recordId, "Created an Interview proposal without changing accepted target records.", document => {
        const statement = document.state.interviews.participant_statements.find(item => item.statement_id === recordId);
        if (!statement) throw new Error("The participant statement was not found.");
        createInterviewCandidate(document.state.interviews, {
          source_refs: [recordId], target_domain: "engagement", target_type: "open-question", proposed_operation: "create",
          proposed_fields: { title: "Review participant statement", detail: statement.text },
          rationale: "Advisor-created proposal; Engagement must explicitly accept or modify it."
        }, profile);
      }, "Interview proposal created");
      workspaceMessage = "Proposal queued without changing accepted Engagement records.";
    } else if (action === "review-session") {
      command("interview.post-session-reviewed", "interview-session", sessionId, "Completed explicit post-session review.", document => {
        const session = document.state.interviews.sessions.find(item => item.session_id === sessionId);
        if (!session || session.lifecycle !== "completed") throw new Error("A completed session is required.");
        session.post_session_review_state = "reviewed";
        session.updated_at = nowIso();
      }, "Post-session review completed");
      workspaceMessage = "Post-session review marked complete; proposals remain target-owned.";
    }
  }

  function submit(form: HTMLFormElement): void {
    if (!workspaceStore) return;
    const kind = form.dataset.v05Form ?? "";
    const sessionId = form.dataset.sessionId ?? "";
    const questionId = form.dataset.questionId ?? "";
    const data = new FormData(form);
    const text = String(data.get("text") ?? "").trim();
    if (!text) throw new Error("Enter text before saving this record.");
    const profile = workspaceStore.document.state.profile;
    if (kind === "statement") {
      command("interview.statement-recorded", "session-question", questionId, "Recorded a separate participant statement.", document => recordParticipantStatement(document.state.interviews, {
        session_ref: sessionId, session_question_ref: questionId, asserted_participant_ref: null,
        asserted_speaker_label: String(data.get("speaker") ?? "").trim(),
        recording_method: profile === "client" ? "participant-entered" : "facilitator-entered",
        text, visibility: "client-safe"
      }, profile));
      workspaceMessage = "Participant statement recorded as a separate locally asserted record.";
    } else if (kind === "note") {
      command("interview.advisor-note-recorded", "session-question", questionId, "Recorded a separate Advisor-only observation.", document => recordAdvisorNote(document.state.interviews, {
        session_ref: sessionId, session_question_ref: questionId, kind: "observation",
        title: String(data.get("title") ?? "").trim(), text
      }, profile));
      workspaceMessage = "Advisor-only note saved and excluded from Client projection.";
    }
  }

  function enhance(): void {
    if (!workspaceStore || workspaceRendering) return;
    const root = document.getElementById("app");
    const workspace = root?.querySelector<HTMLElement>("#workspace");
    if (!root || !workspace) return;
    workspaceRendering = true;
    try {
      const badge = root.querySelector<HTMLElement>(".release-badge");
      const desired = `v${window.__L2G_RELEASE__.version} · Pre-Engagement & Interviews`;
      if (badge && badge.textContent !== desired) badge.textContent = desired;
      const active = workspaceStore.document.state.active_workspace;
      if (active === "pre-engagement" && !workspace.querySelector('[data-v05-workspace="pre-engagement"]')) workspace.innerHTML = renderPreEngagement(workspaceStore);
      if (active === "practice-review" && !workspace.querySelector('[data-v05-workspace^="interview"]')) workspace.innerHTML = renderInterviews(workspaceStore);
    } finally {
      workspaceRendering = false;
    }
  }

  function initialize(): void {
    const root = document.getElementById("app");
    if (!root) return;
    if (!workspaceObserver) {
      workspaceObserver = new MutationObserver(enhance);
      workspaceObserver.observe(root, { childList: true, subtree: true });
      document.addEventListener("click", event => {
        const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-v05-action]") : null;
        if (!target || target.hasAttribute("disabled")) return;
        try { act(target); } catch (error) { workspaceMessage = errorMessage(error); enhance(); }
      });
      document.addEventListener("submit", event => {
        const form = event.target instanceof HTMLFormElement ? event.target : null;
        if (!form?.dataset.v05Form) return;
        event.preventDefault();
        try { submit(form); } catch (error) { workspaceMessage = errorMessage(error); enhance(); }
      });
    }
    enhance();
  }

  queueMicrotask(initialize);
  window.addEventListener("DOMContentLoaded", initialize, { once: true });
}
