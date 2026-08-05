namespace L2G {
  export interface ScopePublicationInput {
    source_ref: ScopeVersionedRef;
    candidate_kind: ScopeCandidate["candidate_kind"];
    label: string;
    proposed_values: Record<string, string>;
    visibility: Visibility;
  }

  function publishSourceCandidate(
    scope: ScopeDomain,
    sourceDomain: ScopeCandidate["source_domain"],
    input: ScopePublicationInput,
    profile: PresentationProfile
  ): ScopeCandidate {
    if (!input.source_ref.id || !Number.isInteger(input.source_ref.version) || input.source_ref.version < 1) {
      throw new Error("Scope publication requires an exact source record identifier and version.");
    }
    if (!input.label.trim()) throw new Error("Scope publication requires a candidate label.");
    const duplicate = scope.candidates.find(candidate =>
      candidate.source_domain === sourceDomain &&
      candidate.source_candidate_ref.id === input.source_ref.id &&
      candidate.source_candidate_ref.version === input.source_ref.version &&
      candidate.candidate_kind === input.candidate_kind &&
      candidate.candidate_state !== "withdrawn" &&
      candidate.candidate_state !== "superseded" &&
      candidate.candidate_state !== "closed"
    );
    if (duplicate) return duplicate;
    return createScopeCandidate(scope, {
      source_domain: sourceDomain,
      source_ref: input.source_ref,
      kind: input.candidate_kind,
      label: input.label,
      values: input.proposed_values,
      visibility: input.visibility
    }, profile);
  }

  export function publishEngagementContextToScope(
    scope: ScopeDomain,
    input: ScopePublicationInput,
    profile: PresentationProfile
  ): ScopeCandidate {
    return publishSourceCandidate(scope, "engagement", input, profile);
  }

  export function publishEvidenceContextToScope(
    scope: ScopeDomain,
    input: ScopePublicationInput,
    profile: PresentationProfile
  ): ScopeCandidate {
    return publishSourceCandidate(scope, "evidence", input, profile);
  }

  export function publishPreEngagementContextToScope(
    scope: ScopeDomain,
    input: ScopePublicationInput,
    profile: PresentationProfile
  ): ScopeCandidate {
    return publishSourceCandidate(scope, "pre-engagement", input, profile);
  }

  export function publishInterviewContextToScope(
    scope: ScopeDomain,
    input: ScopePublicationInput,
    profile: PresentationProfile
  ): ScopeCandidate {
    return publishSourceCandidate(scope, "interview-sessions", input, profile);
  }
}
