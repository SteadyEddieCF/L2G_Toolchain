namespace L2G {
  const V05_ENGAGEMENT_TARGET_TYPES: readonly CandidateTargetType[] = [
    "identity", "participant", "organization", "assumption", "decision", "open-question", "constraint", "milestone", "blocker"
  ];

  function createV05EngagementTargetCandidate(input: {
    source_kind: "pre-engagement-candidate" | "interview-candidate";
    source_ref: string;
    target_type: string;
    proposed_fields: Record<string, string>;
    rationale: string;
    operation: string;
    source_label?: string;
  }, profile: PresentationProfile): CandidateRecord {
    if (profile !== "advisor") throw new Error("Only Advisor View may publish a v0.5 proposal to Engagement.");
    if (!V05_ENGAGEMENT_TARGET_TYPES.includes(input.target_type as CandidateTargetType)) throw new Error("The v0.5 proposal target type is not supported by Engagement.");
    const fields = validateV05ScalarFields(input.proposed_fields, "Engagement target candidate fields");
    if (Object.keys(fields).length === 0) throw new Error("The v0.5 proposal contains no target fields.");
    const timestamp = nowIso();
    return {
      candidate_id: newId("candidate"),
      source_kind: input.source_kind,
      source_ref: input.source_ref,
      target_type: input.target_type as CandidateTargetType,
      proposed_fields: fields,
      state: "candidate",
      rationale: sanitizePlainText(`${input.rationale} Proposed operation: ${input.operation}.`, 8000),
      provenance: {
        source_kind: input.source_kind,
        source_id: input.source_ref,
        source_label: sanitizePlainText(input.source_label ?? "", 300),
        source_location_ref: null,
        asserted_at: timestamp,
        asserted_by: "advisor",
        confidence: "not-evaluated"
      },
      visibility: "advisor-only"
    };
  }

  export function publishPreEngagementCandidateToEngagement(
    engagement: EngagementDomain,
    preEngagement: PreEngagementDomain,
    candidateId: string,
    profile: PresentationProfile
  ): CandidateRecord {
    if (profile !== "advisor") throw new Error("Only Advisor View may publish Pre-Engagement proposals.");
    validatePreEngagementDomain(preEngagement);
    const source = preEngagement.candidates.find(record => record.candidate_id === candidateId);
    if (!source) throw new Error("Pre-Engagement candidate was not found.");
    if (source.target_domain !== "engagement") throw new Error("The Pre-Engagement candidate does not target Engagement.");
    if (source.state !== "awaiting-review") throw new Error("Only an awaiting-review Pre-Engagement candidate may be published.");
    const target = createV05EngagementTargetCandidate({
      source_kind: "pre-engagement-candidate",
      source_ref: source.candidate_id,
      target_type: source.target_type,
      proposed_fields: source.proposed_fields,
      rationale: source.rationale,
      operation: source.proposed_operation,
      source_label: "Pre-Engagement proposal"
    }, profile);
    engagement.candidates.push(target);
    source.state = "published-to-target";
    source.target_candidate_ref = target.candidate_id;
    source.updated_at = nowIso();
    validatePreEngagementDomain(preEngagement);
    return target;
  }

  export function publishInterviewCandidateToEngagement(
    engagement: EngagementDomain,
    interviews: InterviewSessionsDomain,
    candidateId: string,
    profile: PresentationProfile
  ): CandidateRecord {
    if (profile !== "advisor") throw new Error("Only Advisor View may publish Interview proposals.");
    validateInterviewSessionsDomain(interviews);
    const source = interviews.candidates.find(record => record.candidate_id === candidateId);
    if (!source) throw new Error("Interview candidate was not found.");
    if (source.target_domain !== "engagement") throw new Error("The Interview candidate does not target Engagement.");
    if (source.state !== "awaiting-review") throw new Error("Only an awaiting-review Interview candidate may be published.");
    const target = createV05EngagementTargetCandidate({
      source_kind: "interview-candidate",
      source_ref: source.candidate_id,
      target_type: source.target_type,
      proposed_fields: source.proposed_fields,
      rationale: source.rationale,
      operation: source.proposed_operation,
      source_label: "Interview proposal"
    }, profile);
    engagement.candidates.push(target);
    source.state = "published-to-target";
    source.target_candidate_ref = target.candidate_id;
    source.updated_at = nowIso();
    validateInterviewSessionsDomain(interviews);
    return target;
  }

  export function mirrorV05EngagementCandidateDecision(
    source: PreEngagementCandidateRecord | InterviewCandidateRecord,
    target: CandidateRecord
  ): void {
    if (source.target_candidate_ref !== target.candidate_id) throw new Error("The target candidate does not match the source proposal reference.");
    if (target.state === "candidate") return;
    source.target_decision_ref = target.candidate_id;
    source.state = target.state === "superseded" ? "superseded" : target.state === "rejected" ? "returned" : "closed";
    source.updated_at = nowIso();
  }
}
