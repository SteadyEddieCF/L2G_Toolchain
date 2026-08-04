namespace L2G {
  let authorityStore: ProjectStore | null = null;
  let authorityObserver: MutationObserver | null = null;
  let authorityRendering = false;
  let authorityMessage = "";

  const authoritySubscribe = ProjectStore.prototype.subscribe;
  ProjectStore.prototype.subscribe = function (this: ProjectStore, listener: () => void): () => void {
    authorityStore = this;
    return authoritySubscribe.call(this, listener);
  };

  function ax(value: unknown): string {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[character] ?? character));
  }

  function sourceCandidateCard(candidate: PreEngagementCandidateRecord | InterviewCandidateRecord, source: "pre" | "interview"): string {
    const canPublish = candidate.state === "awaiting-review" && candidate.target_domain === "engagement";
    return `<article class="card">
      <div class="card-heading"><div><h3>${ax(candidate.target_type)}</h3><p>${ax(candidate.rationale)}</p></div><span class="status">${ax(candidate.state)}</span></div>
      <p class="meta">Source authority: ${source === "pre" ? "Pre-Engagement" : "Interview Sessions"} · target: ${ax(candidate.target_domain)}</p>
      ${canPublish ? `<button data-v05-authority-action="publish-${source}" data-candidate-id="${ax(candidate.candidate_id)}">Publish to Engagement review</button>` : ""}
    </article>`;
  }

  function targetCandidateCard(candidate: CandidateRecord): string {
    return `<article class="card">
      <div class="card-heading"><div><h3>Engagement review: ${ax(candidate.target_type)}</h3><p>${ax(candidate.rationale)}</p></div><span class="status">${ax(candidate.state)}</span></div>
      <p class="meta">Target authority owns this decision. Source proposal ${ax(candidate.source_ref)} remains separate.</p>
      ${candidate.state === "candidate" ? `<div class="card-actions">
        <button data-v05-authority-action="decide-target" data-candidate-id="${ax(candidate.candidate_id)}" data-decision="reject">Reject target proposal</button>
        <button class="primary" data-v05-authority-action="decide-target" data-candidate-id="${ax(candidate.candidate_id)}" data-decision="accept">Accept in Engagement</button>
      </div>` : ""}
    </article>`;
  }

  function renderAuthoritySection(source: "pre" | "interview"): string {
    if (!authorityStore || authorityStore.document.state.profile !== "advisor") return "";
    const sourceCandidates = source === "pre"
      ? authorityStore.document.state.pre_engagement.candidates
      : authorityStore.document.state.interviews.candidates;
    const sourceKind = source === "pre" ? "pre-engagement-candidate" : "interview-candidate";
    const targetCandidates = authorityStore.document.state.engagement.candidates.filter(candidate => candidate.source_kind === sourceKind);
    return `<section data-v05-authority-ui="${source}" aria-labelledby="v05-authority-title-${source}">
      ${authorityMessage ? `<div class="notice ok" role="status">${ax(authorityMessage)}</div>` : ""}
      <h2 id="v05-authority-title-${source}">Authority transition review</h2>
      <div class="notice">Publishing creates an Engagement-owned candidate only. Accepted Engagement records remain unchanged until an explicit target-domain decision.</div>
      <h3>Source proposals</h3><div class="grid">${sourceCandidates.map(candidate => sourceCandidateCard(candidate, source)).join("") || `<div class="empty">No source proposals are queued.</div>`}</div>
      <h3>Engagement-owned target candidates</h3><div class="grid">${targetCandidates.map(targetCandidateCard).join("") || `<div class="empty">No Engagement-owned candidates were published from this source.</div>`}</div>
    </section>`;
  }

  function renderAuthorityUi(): void {
    if (authorityRendering || !authorityStore) return;
    const workspace = document.querySelector<HTMLElement>("#workspace");
    if (!workspace) return;
    authorityRendering = true;
    try {
      const pre = workspace.querySelector<HTMLElement>('[data-v05-workspace="pre-engagement"]');
      if (pre && !pre.querySelector('[data-v05-authority-ui="pre"]')) pre.insertAdjacentHTML("beforeend", renderAuthoritySection("pre"));
      const interview = workspace.querySelector<HTMLElement>('[data-v05-workspace="interviews"], [data-v05-workspace="interview-live"]');
      if (interview && !interview.querySelector('[data-v05-authority-ui="interview"]')) interview.insertAdjacentHTML("beforeend", renderAuthoritySection("interview"));
    } finally {
      authorityRendering = false;
    }
  }

  function executeAuthorityAction(target: HTMLElement): void {
    if (!authorityStore) throw new Error("The project store is unavailable.");
    const action = target.dataset.v05AuthorityAction ?? "";
    const candidateId = target.dataset.candidateId ?? "";
    const profile = authorityStore.document.state.profile;
    if (profile !== "advisor") throw new Error("Only Advisor View may perform authority transitions.");

    if (action === "publish-pre") {
      authorityStore.execute(
        "pre-engagement.candidate-published",
        "pre-engagement-candidate",
        candidateId,
        "Published a Pre-Engagement proposal into an Engagement-owned candidate without changing accepted Engagement records.",
        document => { publishPreEngagementCandidateToEngagement(document.state.engagement, document.state.pre_engagement, candidateId, profile); },
        "Pre-Engagement proposal published to Engagement review"
      );
      authorityMessage = "Engagement-owned candidate created; accepted Engagement records are unchanged.";
    } else if (action === "publish-interview") {
      authorityStore.execute(
        "interview.candidate-published",
        "interview-candidate",
        candidateId,
        "Published an Interview proposal into an Engagement-owned candidate without changing accepted Engagement records.",
        document => { publishInterviewCandidateToEngagement(document.state.engagement, document.state.interviews, candidateId, profile); },
        "Interview proposal published to Engagement review"
      );
      authorityMessage = "Engagement-owned candidate created; accepted Engagement records are unchanged.";
    } else if (action === "decide-target") {
      const decision = target.dataset.decision;
      if (decision !== "accept" && decision !== "reject") throw new Error("The target decision is unsupported.");
      authorityStore.execute(
        "engagement.candidate-decided",
        "candidate",
        candidateId,
        `${decision === "accept" ? "Accepted" : "Rejected"} the Engagement-owned target candidate and mirrored its decision to the source proposal.`,
        document => {
          const targetCandidate = document.state.engagement.candidates.find(candidate => candidate.candidate_id === candidateId);
          if (!targetCandidate) throw new Error("The Engagement candidate was not found.");
          decideCandidate(document.state.engagement, candidateId, decision, decision === "accept"
            ? "Engagement explicitly accepted the reviewed source proposal."
            : "Engagement explicitly rejected the reviewed source proposal.", profile);
          if (targetCandidate.source_kind === "pre-engagement-candidate") {
            const source = document.state.pre_engagement.candidates.find(candidate => candidate.candidate_id === targetCandidate.source_ref);
            if (!source) throw new Error("The Pre-Engagement source proposal was not found.");
            mirrorV05EngagementCandidateDecision(source, targetCandidate);
          } else if (targetCandidate.source_kind === "interview-candidate") {
            const source = document.state.interviews.candidates.find(candidate => candidate.candidate_id === targetCandidate.source_ref);
            if (!source) throw new Error("The Interview source proposal was not found.");
            mirrorV05EngagementCandidateDecision(source, targetCandidate);
          } else {
            throw new Error("The target candidate is not linked to a v0.5 source authority.");
          }
        },
        "Engagement target candidate decided"
      );
      authorityMessage = decision === "accept"
        ? "Engagement accepted the target candidate through its own command; the source proposal is now closed."
        : "Engagement rejected the target candidate; the source proposal is now returned.";
    }
  }

  function initializeAuthorityUi(): void {
    const app = document.getElementById("app");
    if (!app) return;
    if (!authorityObserver) {
      authorityObserver = new MutationObserver(renderAuthorityUi);
      authorityObserver.observe(app, { childList: true, subtree: true });
      document.addEventListener("click", event => {
        const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-v05-authority-action]") : null;
        if (!target || target.hasAttribute("disabled")) return;
        try {
          executeAuthorityAction(target);
        } catch (error) {
          authorityMessage = errorMessage(error);
          renderAuthorityUi();
        }
      });
    }
    renderAuthorityUi();
  }

  queueMicrotask(initializeAuthorityUi);
  window.addEventListener("DOMContentLoaded", initializeAuthorityUi, { once: true });
}
