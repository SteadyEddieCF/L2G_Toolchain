namespace L2G {
  function publishScopeUnknownToSessionPlannerProjectSafe(
    scope: ScopeDomain,
    unknownId: string,
    interviews: InterviewSessionsDomain,
    profile: PresentationProfile
  ): InterviewQuestionRecord {
    const unknown = scope.unknowns.find(item => item.id === unknownId);
    if (!unknown) throw new Error("Scope unknown not found.");
    if (["resolved", "wont-resolve", "superseded"].includes(unknown.resolution_state)) {
      throw new Error("Resolved or superseded Scope unknowns cannot be published as new question candidates.");
    }
    if (unknown.session_question_candidate_ref) {
      const existing = interviews.questions.find(item => item.question_id === unknown.session_question_candidate_ref);
      if (existing) return existing;
    }
    const timestamp = nowIso();
    const exactScopeRef = `${unknown.id}@${unknown.version}`;
    const exactAffectedRefs = unknown.affected_refs.map(ref => {
      const record = scopeRecordMap(scope).get(ref);
      return `${ref}@${record?.version ?? "missing"}`;
    });
    const question: InterviewQuestionRecord = {
      question_id: newId("interview_question"),
      version_number: 1,
      version_label: "1.0",
      origin: "source-derived",
      topic_label: sanitizePlainText(unknown.label, 300),
      prompt: sanitizePlainText(unknown.statement, 8000),
      client_safe_explanation: sanitizePlainText("This question follows up on an unresolved Scope item. It does not accept a client statement or add the question to a live agenda.", 8000),
      rationale: sanitizePlainText(`Resolve exact Scope unknown ${exactScopeRef}. Affected exact Scope records: ${exactAffectedRefs.join(", ") || "none recorded"}.`, 8000),
      expected_participant_role_labels: ["Advisor-selected participant"],
      applicability_note: sanitizePlainText(`Source authority: Scope. Exact source: ${exactScopeRef}. This draft question does not determine applicability.`, 8000),
      source_refs: [],
      related_refs: [],
      lifecycle: "draft",
      visibility: unknown.visibility,
      supersedes_question_ref: null,
      superseded_by_question_ref: null,
      provenance: createV05Provenance("scope-unknown-publication", exactScopeRef, timestamp, profile, "not-evaluated", unknown.label),
      created_at: timestamp,
      updated_at: timestamp
    };
    interviews.questions.push(question);
    unknown.session_question_candidate_ref = question.question_id;
    unknown.updated_at = timestamp;
    unknown.updated_by_profile = profile;
    unknown.version++;
    scope.updated_at = timestamp;
    scope.revision++;
    validateInterviewSessionsDomain(interviews);
    validateScopeDomain(scope);
    return question;
  }

  (globalThis as unknown as { L2G: Record<string, unknown> }).L2G.publishScopeUnknownToSessionPlanner = publishScopeUnknownToSessionPlannerProjectSafe;
}
