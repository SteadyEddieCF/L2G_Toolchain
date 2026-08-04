namespace L2G {
  let v05AppStore: ProjectStore | null = null;
  let v05UiObserver: MutationObserver | null = null;
  let v05UiEnhancing = false;
  let v05UiMessage = "";

  const originalProjectStoreSubscribe = ProjectStore.prototype.subscribe;
  ProjectStore.prototype.subscribe = function (this: ProjectStore, listener: () => void): () => void {
    v05AppStore = this;
    return originalProjectStoreSubscribe.call(this, listener);
  };

  function v05Escape(value: unknown): string {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character] ?? character));
  }

  function v05Text(record: Record<string, unknown>, key: string): string {
    const value = record[key];
    return typeof value === "string" ? value : value === null || value === undefined ? "" : String(value);
  }

  function v05Number(record: Record<string, unknown>, key: string): number {
    const value = record[key];
    return typeof value === "number" && Number.isFinite(value) ? value : 0;
  }

  function v05Records(value: unknown): Array<Record<string, unknown>> {
    return Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => isRecord(item)) : [];
  }

  function v05SetMessage(message: string): void {
    v05UiMessage = message;
  }

  function v05Notice(): string {
    return v05UiMessage ? `<div class="notice ok" role="status">${v05Escape(v05UiMessage)}</div>` : "";
  }

  function v05ProfileLabel(profile: PresentationProfile): string {
    return profile === "advisor" ? "Advisor" : profile === "reviewer" ? "Reviewer" : "Client presentation";
  }

  function renderV05PreEngagement(store: ProjectStore): string {
    const profile = store.document.state.profile;
    const projection = buildPreEngagementProjection(store.document.state.pre_engagement, "pre-engagement", profile);
    const requests = projection.requests;
    const assignments = projection.assignments;
    const responses = projection.responses;
    const exceptions = projection.exceptions;
    const candidates = projection.candidates;
    const completeness = projection.completeness;

    const requestCards = requests.length
      ? requests.map(request => `<article class="card">
          <div class="card-heading"><div><h2>${v05Escape(v05Text(request, "title"))}</h2><p>${v05Escape(v05Text(request, "description"))}</p></div><span class="status">${v05Escape(v05Text(request, "operational_state"))}</span></div>
          <p class="meta">${v05Escape(v05Text(request, "kind"))} · owner ${v05Escape(v05Text(request, "owner_label") || "Unassigned")} · due ${v05Escape(v05Text(request, "due_date") || "not set")}</p>
          <p class="meta">Lifecycle ${v05Escape(v05Text(request, "lifecycle"))} · review ${v05Escape(v05Text(request, "review_state"))}</p>
        </article>`).join("")
      : `<div class="empty">No profile-visible intake requests are recorded.</div>`;

    const responseRows = responses.length
      ? responses.map(response => {
          const responseId = v05Text(response, "response_id");
          const reviewState = v05Text(response, "review_state");
          return `<tr>
            <td data-label="Response"><strong>${v05Escape(v05Text(response, "display_text") || "Blank response")}</strong></td>
            <td data-label="Origin"><span class="status">${v05Escape(v05Text(response, "origin"))}</span></td>
            <td data-label="Currency">${v05Escape(v05Text(response, "currency_state"))}</td>
            <td data-label="Review">${v05Escape(reviewState)}</td>
            <td data-label="Actions">${profile === "advisor" ? `<div class="card-actions">
              ${reviewState !== "approved" ? `<button data-v05-action="approve-response" data-record-id="${v05Escape(responseId)}">Approve response</button>` : ""}
              <button data-v05-action="candidate-from-response" data-record-id="${v05Escape(responseId)}">Create proposal</button>
            </div>` : "Read only"}</td>
          </tr>`;
        }).join("")
      : `<tr><td colspan="5">No profile-visible responses are recorded.</td></tr>`;

    const assignmentCards = assignments.map(assignment => `<article class="card">
      <h2>${v05Escape(v05Text(v05Records(assignment.snapshot)[0] ?? assignment, "title") || "Assignment snapshot")}</h2>
      <p><strong>${v05Escape(v05Text(assignment, "operational_state"))}</strong> · ${v05Escape(v05Text(assignment, "currency_state"))}</p>
      <p class="meta">Immutable instrument version ${v05Escape(v05Text(assignment, "instrument_version_number"))} · due ${v05Escape(v05Text(assignment, "due_date") || "not set")}</p>
    </article>`).join("");

    const exceptionCards = exceptions.length
      ? exceptions.map(exception => `<article class="card">
          <h2>${v05Escape(v05Text(exception, "title"))}</h2><p>${v05Escape(v05Text(exception, "detail"))}</p>
          <p class="meta">${v05Escape(v05Text(exception, "kind"))} · ${v05Escape(v05Text(exception, "operational_state"))}</p>
          ${profile !== "client" && !["resolved", "cancelled"].includes(v05Text(exception, "operational_state")) ? `<button data-v05-action="resolve-exception" data-record-id="${v05Escape(v05Text(exception, "exception_id"))}">Close with rationale</button>` : ""}
        </article>`).join("")
      : `<div class="empty">No profile-visible intake exceptions are open.</div>`;

    const candidateCards = profile === "client" ? "" : candidates.length
      ? candidates.map(candidate => `<article class="card"><h2>${v05Escape(v05Text(candidate, "target_type"))}</h2><p>${v05Escape(v05Text(candidate, "rationale"))}</p><p class="meta">${v05Escape(v05Text(candidate, "target_domain"))} · ${v05Escape(v05Text(candidate, "state"))}</p></article>`).join("")
      : `<div class="empty">No Pre-Engagement proposals are queued.</div>`;

    return `<section data-v05-ui="pre-engagement" aria-labelledby="workspace-title">
      ${v05Notice()}
      <div class="workspace-header"><div><h1 id="workspace-title">Pre-Engagement</h1><p>Govern intake requests, immutable questionnaire and inventory assignments, submissions, responses, conflicts, and proposals without changing another workspace’s accepted records.</p></div><span class="badge">${v05Escape(v05ProfileLabel(profile))}</span></div>
      <div class="notice">Response origin is preserved. Advisor-entered, imported, source-derived, and interpreted content is never relabeled as a client-provided answer.</div>
      <div class="metrics">
        <div class="metric"><strong>${completeness.received_assignments}/${completeness.required_assignments}</strong><span>assignments received</span></div>
        <div class="metric"><strong>${completeness.missing_required_responses}</strong><span>required responses missing</span></div>
        <div class="metric"><strong>${completeness.overdue_requests}</strong><span>overdue requests</span></div>
        <div class="metric"><strong>${completeness.unresolved_exceptions}</strong><span>unresolved exceptions</span></div>
      </div>
      <h2>Requests</h2><div class="grid">${requestCards}</div>
      <h2>Assignments</h2><div class="grid">${assignmentCards || `<div class="empty">No profile-visible assignments are recorded.</div>`}</div>
      <h2>Responses and origin</h2><div class="table-wrap"><table><thead><tr><th>Response</th><th>Origin</th><th>Currency</th><th>Review</th><th>Actions</th></tr></thead><tbody>${responseRows}</tbody></table></div>
      <h2>Next work</h2><div class="grid">${projection.next_work.map(item => `<article class="card"><h3>${v05Escape(item.title)}</h3><p>${v05Escape(item.detail)}</p><p class="meta">${v05Escape(item.kind)}</p></article>`).join("")}</div>
      ${profile !== "client" ? `<h2>Exceptions</h2><div class="grid">${exceptionCards}</div><h2>Proposals</h2><div class="grid">${candidateCards}</div>` : ""}
      <div class="notice">These counts describe intake work only. They do not determine readiness, compliance, risk, evidence sufficiency, certification, scoring, implementation, or Met/Not Met.</div>
    </section>`;
  }

  function renderV05Interview(store: ProjectStore): string {
    const profile = store.document.state.profile;
    const projection = buildInterviewProjection(store.document.state.interviews, "practice-review", profile);
    const sessions = projection.sessions;
    const activeSession = projection.active_session_ref
      ? sessions.find(record => v05Text(record, "session_id") === projection.active_session_ref) ?? null
      : null;

    if (activeSession) return renderV05ActiveInterview(store, projection, activeSession);

    const sessionCards = sessions.length
      ? sessions.map(session => {
          const id = v05Text(session, "session_id");
          const lifecycle = v05Text(session, "lifecycle");
          return `<article class="card">
            <div class="card-heading"><div><h2>${v05Escape(v05Text(session, "title"))}</h2><p>${v05Escape(v05Text(session, "purpose"))}</p></div><span class="status">${v05Escape(lifecycle)}</span></div>
            <p class="meta">Facilitator ${v05Escape(v05Text(session, "facilitator_label") || "Unassigned")} · review ${v05Escape(v05Text(session, "post_session_review_state"))}</p>
            ${profile === "advisor" ? `<div class="card-actions">
              ${lifecycle === "ready" ? `<button class="primary" data-v05-action="start-session" data-session-id="${v05Escape(id)}">Start Interview Mode</button>` : ""}
              ${lifecycle === "paused" ? `<button class="primary" data-v05-action="resume-session" data-session-id="${v05Escape(id)}">Resume</button>` : ""}
              ${lifecycle === "completed" && v05Text(session, "post_session_review_state") !== "reviewed" ? `<button data-v05-action="review-session" data-session-id="${v05Escape(id)}">Mark post-session review complete</button>` : ""}
            </div>` : ""}
          </article>`;
        }).join("")
      : `<div class="empty">No profile-visible Interview sessions are recorded.</div>`;

    const planCards = projection.plans.map(plan => `<article class="card"><h2>${v05Escape(v05Text(plan, "title"))}</h2><p>${v05Escape(v05Text(plan, "purpose"))}</p><p class="meta">${v05Escape(v05Text(plan, "lifecycle"))} · ${v05Escape(v05Text(plan, "currency_state"))} · ${v05Number(plan, "planned_duration_minutes")} minutes</p></article>`).join("");
    const statementCards = projection.participant_statements.map(statement => `<article class="card"><h3>${v05Escape(v05Text(statement, "asserted_speaker_label") || "Locally asserted speaker")}</h3><p>${v05Escape(v05Text(statement, "text"))}</p><p class="meta">${v05Escape(v05Text(statement, "recording_method"))} · version ${v05Escape(v05Text(statement, "version_number"))}</p></article>`).join("");
    const noteCards = profile === "client" ? "" : projection.advisor_notes.map(note => `<article class="card"><h3>${v05Escape(v05Text(note, "title") || "Internal note")}</h3><p>${v05Escape(v05Text(note, "text"))}</p><p class="meta">Advisor-only · ${v05Escape(v05Text(note, "kind"))}</p></article>`).join("");

    return `<section data-v05-ui="interview" aria-labelledby="workspace-title">
      ${v05Notice()}
      <div class="workspace-header"><div><h1 id="workspace-title">Practice Review · Interview Sessions</h1><p>Prepare, facilitate, pause, resume, and review structured discovery sessions before authoritative practice conclusions are introduced in a later release.</p></div><span class="badge">${v05Escape(v05ProfileLabel(profile))}</span></div>
      <div class="notice">Session records remain Interview authority. Completion, confirmation, or summary review does not create a Scope, Practice Review, SSP, readiness, compliance, or Met/Not Met conclusion.</div>
      <h2>Session planner</h2><div class="grid">${planCards || `<div class="empty">No profile-visible plans are recorded.</div>`}</div>
      <h2>Sessions</h2><div class="grid">${sessionCards}</div>
      <h2>Next work</h2><div class="grid">${projection.next_work.map(item => `<article class="card"><h3>${v05Escape(item.title)}</h3><p>${v05Escape(item.detail)}</p><p class="meta">${v05Escape(item.kind)}</p></article>`).join("")}</div>
      ${statementCards ? `<h2>Participant statements</h2><div class="grid">${statementCards}</div>` : ""}
      ${noteCards ? `<h2>Internal Advisor notes</h2><div class="grid">${noteCards}</div>` : ""}
    </section>`;
  }

  function renderV05ActiveInterview(store: ProjectStore, projection: InterviewProjection, session: Record<string, unknown>): string {
    const profile = store.document.state.profile;
    const sessionId = v05Text(session, "session_id");
    const lifecycle = v05Text(session, "lifecycle");
    const questions = projection.session_questions
      .filter(record => v05Text(record, "session_ref") === sessionId)
      .sort((left, right) => v05Number(left, "order") - v05Number(right, "order"));
    const activeQuestionRef = v05Text(session, "active_session_question_ref");
    const activeQuestion = questions.find(record => v05Text(record, "session_question_id") === activeQuestionRef) ?? questions[0] ?? null;
    const questionId = activeQuestion ? v05Text(activeQuestion, "session_question_id") : "";
    const snapshot = activeQuestion && isRecord(activeQuestion.question_snapshot) ? activeQuestion.question_snapshot : {};
    const currentIndex = activeQuestion ? questions.findIndex(record => v05Text(record, "session_question_id") === questionId) : -1;
    const previous = currentIndex > 0 ? questions[currentIndex - 1] : null;
    const next = currentIndex >= 0 && currentIndex + 1 < questions.length ? questions[currentIndex + 1] : null;
    const statements = projection.participant_statements.filter(record => v05Text(record, "session_question_ref") === questionId);
    const notes = profile === "client" ? [] : projection.advisor_notes.filter(record => v05Text(record, "session_question_ref") === questionId);
    const confirmations = projection.confirmations.filter(record => v05Text(record, "session_ref") === sessionId);

    return `<section data-v05-ui="interview-live" aria-labelledby="workspace-title">
      ${v05Notice()}
      <div class="workspace-header"><div><h1 id="workspace-title">Interview Mode</h1><p>${v05Escape(v05Text(session, "title"))}</p></div><span class="badge">${v05Escape(projection.progress.label)}</span></div>
      <div class="notice">${profile === "client" ? "Client Presentation Mode shows only the profile-safe projection. Internal notes, proposals, receipts, and hidden counts are omitted before this view is constructed." : "Participant statements and Advisor observations are separate records. Suggested or imported context is never promoted automatically."}</div>
      <div class="grid">
        <article class="card">
          <p class="meta">${v05Escape(v05Text(snapshot, "topic_label"))} · ${v05Escape(v05Text(activeQuestion ?? {}, "origin"))}</p>
          <h2>${v05Escape(v05Text(snapshot, "prompt") || "No active question")}</h2>
          <p>${v05Escape(v05Text(snapshot, "client_safe_explanation"))}</p>
          ${profile === "advisor" && lifecycle === "in-progress" ? `<div class="card-actions">
            <button data-v05-action="navigate-question" data-session-id="${v05Escape(sessionId)}" data-question-id="${v05Escape(previous ? v05Text(previous, "session_question_id") : "")}" ${previous ? "" : "disabled"}>Previous</button>
            <button data-v05-action="navigate-question" data-session-id="${v05Escape(sessionId)}" data-question-id="${v05Escape(next ? v05Text(next, "session_question_id") : "")}" ${next ? "" : "disabled"}>Next</button>
            <button data-v05-action="pause-session" data-session-id="${v05Escape(sessionId)}">Pause and checkpoint</button>
            <button data-v05-action="complete-session" data-session-id="${v05Escape(sessionId)}">End session</button>
          </div>` : ""}
          ${profile === "advisor" && lifecycle === "paused" ? `<button class="primary" data-v05-action="resume-session" data-session-id="${v05Escape(sessionId)}">Resume at recorded question</button>` : ""}
        </article>
        <article class="card">
          <h2>Agenda</h2>
          <div class="list">${questions.map(question => `<button class="search-result" data-v05-action="navigate-question" data-session-id="${v05Escape(sessionId)}" data-question-id="${v05Escape(v05Text(question, "session_question_id"))}" ${profile === "advisor" && lifecycle === "in-progress" ? "" : "disabled"}><strong>${v05Escape(`${v05Number(question, "order")}. ${v05Text(isRecord(question.question_snapshot) ? question.question_snapshot : {}, "topic_label")}`)}</strong><br><span class="muted">${v05Escape(v05Text(question, "state"))}</span></button>`).join("")}</div>
        </article>
      </div>
      ${lifecycle === "in-progress" && questionId ? `<div class="grid">
        <form class="card" data-v05-form="statement" data-session-id="${v05Escape(sessionId)}" data-question-id="${v05Escape(questionId)}">
          <h2>Participant statement</h2><label>Locally asserted speaker<input name="speaker" value="${v05Escape(profile === "client" ? "Participant" : "Synthetic participant")}"></label><label>Statement<textarea name="text" rows="6" required></textarea></label><button class="primary" type="submit">Record separate statement</button><p class="meta">The speaker label is locally asserted, not authenticated identity.</p>
        </form>
        ${profile === "advisor" ? `<form class="card" data-v05-form="advisor-note" data-session-id="${v05Escape(sessionId)}" data-question-id="${v05Escape(questionId)}"><h2>Internal Advisor note</h2><label>Title<input name="title" value="Facilitation observation"></label><label>Advisor-only note<textarea name="text" rows="6" required></textarea></label><button type="submit">Save Advisor-only note</button><p class="meta">This record cannot be escalated to Client visibility in v0.5.</p></form>` : ""}
      </div>` : ""}
      <h2>Statements for this question</h2><div class="grid">${statements.length ? statements.map(statement => {
        const statementId = v05Text(statement, "statement_id");
        const alreadyConfirmed = confirmations.some(confirmation => v05Text(confirmation, "confirmed_record_ref") === statementId && v05Text(confirmation, "state") === "confirmed");
        return `<article class="card"><h3>${v05Escape(v05Text(statement, "asserted_speaker_label") || "Locally asserted speaker")}</h3><p>${v05Escape(v05Text(statement, "text"))}</p><p class="meta">${v05Escape(v05Text(statement, "recording_method"))} · version ${v05Escape(v05Text(statement, "version_number"))}</p><div class="card-actions">${!alreadyConfirmed && (profile === "advisor" || profile === "client") ? `<button data-v05-action="confirm-statement" data-session-id="${v05Escape(sessionId)}" data-record-id="${v05Escape(statementId)}">Record read-back confirmation</button>` : alreadyConfirmed ? `<span class="status">Locally confirmed</span>` : ""}${profile === "advisor" ? `<button data-v05-action="candidate-from-statement" data-record-id="${v05Escape(statementId)}">Create proposal</button>` : ""}</div></article>`;
      }).join("") : `<div class="empty">No participant statement is recorded for this question.</div>`}</div>
      ${profile !== "client" ? `<h2>Advisor-only notes for this question</h2><div class="grid">${notes.length ? notes.map(note => `<article class="card"><h3>${v05Escape(v05Text(note, "title") || "Internal note")}</h3><p>${v05Escape(v05Text(note, "text"))}</p><p class="meta">Advisor-only · ${v05Escape(v05Text(note, "kind"))}</p></article>`).join("") : `<div class="empty">No internal Advisor note is recorded for this question.</div>`}</div>` : ""}
    </section>`;
  }

  function v05Execute(action: string, objectType: string, objectId: string, summary: string, mutator: (document: ProjectDocument) => void, checkpoint?: string): void {
    if (!v05AppStore) throw new Error("The application project store is unavailable.");
    v05AppStore.execute(action, objectType, objectId, summary, mutator, checkpoint);
  }

  function handleV05Action(element: HTMLElement): void {
    if (!v05AppStore) return;
    const action = element.dataset.v05Action ?? "";
    const recordId = element.dataset.recordId ?? "";
    const sessionId = element.dataset.sessionId ?? "";
    const questionId = element.dataset.questionId ?? "";
    const profile = v05AppStore.document.state.profile;

    if (action === "approve-response") {
      v05Execute("pre-engagement.response-reviewed", "intake-response", recordId, "Approved the response while preserving its recorded origin.", document => {
        const response = document.state.pre_engagement.responses.find(item => item.response_id === recordId);
        if (!response) throw new Error("The intake response was not found.");
        response.review_state = "approved";
        response.updated_at = nowIso();
      });
      v05SetMessage("Response approved; its source origin was preserved.");
    } else if (action === "candidate-from-response") {
      v05Execute("pre-engagement.candidate-created", "intake-response", recordId, "Created a target-owned review proposal from an intake response.", document => {
        const response = document.state.pre_engagement.responses.find(item => item.response_id === recordId);
        if (!response) throw new Error("The intake response was not found.");
        createPreEngagementCandidate(document.state.pre_engagement, {
          source_refs: [recordId], target_domain: "engagement", target_type: "open-question", proposed_operation: "create",
          proposed_fields: { title: "Review intake response", detail: response.display_text },
          rationale: "Advisor-created proposal; Engagement must explicitly accept or modify it."
        }, profile);
      }, "Pre-Engagement proposal created");
      v05SetMessage("Proposal queued without changing accepted Engagement records.");
    } else if (action === "resolve-exception") {
      const rationale = window.prompt("Resolution rationale", "Reviewed and closed without changing another domain.") ?? "";
      if (!rationale.trim()) return;
      v05Execute("pre-engagement.exception-resolved", "intake-exception", recordId, "Resolved an intake exception with an explicit rationale.", document => {
        resolveIntakeException(document.state.pre_engagement, recordId, "closed", rationale, null, profile);
      }, "Intake exception resolved");
      v05SetMessage("Intake exception resolved with history retained.");
    } else if (action === "start-session") {
      v05Execute("interview.session-started", "interview-session", sessionId, "Started the governed Interview session from its frozen plan snapshot.", document => startInterviewSession(document.state.interviews, sessionId, profile), "Interview session started");
      v05SetMessage("Interview Mode started from the frozen plan snapshot.");
    } else if (action === "pause-session") {
      const session = v05AppStore.document.state.interviews.sessions.find(item => item.session_id === sessionId);
      const elapsed = session?.elapsed_seconds_hint ?? 0;
      v05Execute("interview.session-paused", "interview-session", sessionId, "Paused the Interview session at its exact current question.", document => pauseInterviewSession(document.state.interviews, sessionId, elapsed, profile), "Interview session paused");
      v05SetMessage("Session paused and checkpointed at the recorded question.");
    } else if (action === "resume-session") {
      v05Execute("interview.session-resumed", "interview-session", sessionId, "Resumed the governed Interview session at its recorded question.", document => resumeInterviewSession(document.state.interviews, sessionId, profile), "Interview session resumed");
      v05SetMessage("Session resumed at the recorded question.");
    } else if (action === "complete-session") {
      v05Execute("interview.session-completed", "interview-session", sessionId, "Completed facilitation and opened post-session review without approving summaries or proposals.", document => completeInterviewSession(document.state.interviews, sessionId, profile), "Interview session completed");
      v05SetMessage("Session completed; post-session review is pending.");
    } else if (action === "navigate-question" && questionId) {
      v05Execute("interview.question-navigated", "session-question", questionId, "Navigated the Interview agenda without creating a conclusion.", document => navigateInterviewQuestion(document.state.interviews, sessionId, questionId, profile));
    } else if (action === "confirm-statement") {
      v05Execute("interview.confirmation-recorded", "participant-statement", recordId, "Recorded a locally asserted read-back confirmation for the exact statement version.", document => recordInterviewConfirmation(document.state.interviews, {
        session_ref: sessionId, confirmed_record_kind: "participant-statement", confirmed_record_ref: recordId,
        asserted_confirmer_participant_ref: null, asserted_confirmer_label: profile === "client" ? "Participant" : "Synthetic participant",
        method: "read-back-and-confirmed", visibility: "client-safe"
      }, profile), "Statement confirmation recorded");
      v05SetMessage("Locally asserted confirmation recorded for the exact statement version.");
    } else if (action === "candidate-from-statement") {
      v05Execute("interview.candidate-created", "participant-statement", recordId, "Created a target-owned review proposal from a participant statement.", document => {
        const statement = document.state.interviews.participant_statements.find(item => item.statement_id === recordId);
        if (!statement) throw new Error("The participant statement was not found.");
        createInterviewCandidate(document.state.interviews, {
          source_refs: [recordId], target_domain: "engagement", target_type: "open-question", proposed_operation: "create",
          proposed_fields: { title: "Review participant statement", detail: statement.text },
          rationale: "Advisor-created proposal; Engagement must explicitly accept or modify it."
        }, profile);
      }, "Interview proposal created");
      v05SetMessage("Proposal queued without changing accepted Engagement records.");
    } else if (action === "review-session") {
      v05Execute("interview.post-session-reviewed", "interview-session", sessionId, "Completed the explicit post-session review without approving hidden content or target-domain conclusions.", document => {
        const session = document.state.interviews.sessions.find(item => item.session_id === sessionId);
        if (!session || session.lifecycle !== "completed") throw new Error("A completed session is required.");
        session.post_session_review_state = "reviewed";
        session.updated_at = nowIso();
      }, "Post-session review completed");
      v05SetMessage("Post-session review marked complete; proposals remain target-owned.");
    }
  }

  function handleV05Form(form: HTMLFormElement): void {
    if (!v05AppStore) return;
    const kind = form.dataset.v05Form ?? "";
    const sessionId = form.dataset.sessionId ?? "";
    const questionId = form.dataset.questionId ?? "";
    const data = new FormData(form);
    const text = String(data.get("text") ?? "").trim();
    if (!text) throw new Error("Enter text before saving this record.");
    const profile = v05AppStore.document.state.profile;

    if (kind === "statement") {
      const speaker = String(data.get("speaker") ?? "").trim();
      v05Execute("interview.statement-recorded", "session-question", questionId, "Recorded a participant statement separately from Advisor observations.", document => recordParticipantStatement(document.state.interviews, {
        session_ref: sessionId, session_question_ref: questionId, asserted_participant_ref: null,
        asserted_speaker_label: speaker, recording_method: profile === "client" ? "participant-entered" : "facilitator-entered",
        text, visibility: "client-safe"
      }, profile));
      v05SetMessage("Participant statement recorded as a separate locally asserted record.");
    } else if (kind === "advisor-note") {
      const title = String(data.get("title") ?? "").trim();
      v05Execute("interview.advisor-note-recorded", "session-question", questionId, "Recorded a separate Advisor-only observation.", document => recordAdvisorNote(document.state.interviews, {
        session_ref: sessionId, session_question_ref: questionId, kind: "observation", title, text
      }, profile));
      v05SetMessage("Advisor-only note saved and excluded from Client projection.");
    }
  }

  function enhanceV05Ui(): void {
    if (v05UiEnhancing || !v05AppStore) return;
    const root = document.getElementById("app");
    if (!root) return;
    v05UiEnhancing = true;
    try {
      const badge = root.querySelector<HTMLElement>(".release-badge");
      if (badge && badge.textContent !== `v${window.__L2G_RELEASE__.version} · Pre-Engagement & Interviews`) badge.textContent = `v${window.__L2G_RELEASE__.version} · Pre-Engagement & Interviews`;
      const workspace = root.querySelector<HTMLElement>("#workspace");
      if (!workspace) return;
      const active = v05AppStore.document.state.active_workspace;
      if (active === "pre-engagement" && !workspace.querySelector('[data-v05-ui="pre-engagement"]')) workspace.innerHTML = renderV05PreEngagement(v05AppStore);
      else if (active === "practice-review" && !workspace.querySelector("[data-v05-ui^=\"interview\"]")) workspace.innerHTML = renderV05Interview(v05AppStore);
    } finally {
      v05UiEnhancing = false;
    }
  }

  function initializeV05Ui(): void {
    const root = document.getElementById("app");
    if (!root) return;
    if (!v05UiObserver) {
      v05UiObserver = new MutationObserver(() => enhanceV05Ui());
      v05UiObserver.observe(root, { childList: true, subtree: true });
      document.addEventListener("click", event => {
        const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-v05-action]") : null;
        if (!target || target.hasAttribute("disabled")) return;
        try { handleV05Action(target); } catch (error) { v05SetMessage(errorMessage(error)); enhanceV05Ui(); }
      });
      document.addEventListener("submit", event => {
        const form = event.target instanceof HTMLFormElement ? event.target : null;
        if (!form?.dataset.v05Form) return;
        event.preventDefault();
        try { handleV05Form(form); form.reset(); } catch (error) { v05SetMessage(errorMessage(error)); enhanceV05Ui(); }
      });
    }
    enhanceV05Ui();
  }

  queueMicrotask(initializeV05Ui);
  window.addEventListener("DOMContentLoaded", initializeV05Ui, { once: true });
}
