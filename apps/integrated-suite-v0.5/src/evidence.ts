namespace L2G {
  const EVIDENCE_VISIBILITIES: Visibility[] = ["advisor-only", "client-safe", "approved-for-client-presentation"];
  const ORIGINS: EvidenceOriginKind[] = ["local-file", "legacy-package-record", "generated-output-reference", "external-reference"];
  const SOURCE_LIFECYCLES: EvidenceLifecycle[] = ["active", "superseded", "archived"];
  const PROCESSING_STATES: EvidenceProcessingState[] = ["not-requested", "pending", "processing", "complete", "partial", "failed", "unsupported"];
  const REVIEW_STATES: EvidenceReviewState[] = ["unreviewed", "in-review", "reviewed", "needs-attention", "excluded"];
  const TRUST_STATES: EvidenceTrustState[] = ["not-evaluated", "no-exception", "exception-open", "exception-resolved", "rejected"];
  const LOCATION_KINDS: EvidenceLocationKind[] = ["whole-source", "page", "paragraph", "sheet", "row", "cell-range", "slide", "object", "speaker-turn", "timestamp-range", "package-field", "unknown"];
  const DERIVED_KINDS: DerivedRecordKind[] = ["extract-summary", "structured-record", "diagram-description", "security-evidence-item", "meeting-segment", "parser-diagnostic"];
  const RELATIONSHIP_TYPES: EvidenceRelationshipType[] = ["duplicate-of", "revision-of", "derived-from", "contains", "supports", "related-to"];
  const CANDIDATE_STATES: EvidenceCandidateState[] = ["draft", "awaiting-review", "published-to-target", "returned", "withdrawn", "superseded", "closed"];
  const TARGET_DOMAINS: EvidenceTargetDomain[] = ["engagement", "pre-engagement", "scope", "practice-review", "ssp", "deliverables", "reviews-actions"];
  const PACKAGE_KINDS: EvidenceImportReceipt["package_kind"][] = ["l2g_intake_package_v1", "l2g_scope_context_v1", "l2g_meeting_context_v1"];
  const EVIDENCE_POLICY: EvidenceProjectionPolicy = {
    client_visible_values: ["client-safe", "approved-for-client-presentation"], client_requires_label: true,
    client_include_original_names: false, client_include_fingerprints: false, client_include_candidates: false,
    client_include_provenance: false, search_index_persistence: "none"
  };

  export function createSyntheticEvidence(timestamp: string): EvidenceDomain {
    const primaryId = newId("evidence");
    const duplicateId = newId("evidence");
    const externalId = newId("evidence");
    const groupId = newId("duplicate_group");
    const locationId = newId("location");
    const derivedId = newId("derived");
    const candidateId = newId("evidence_candidate");
    const sharedHash = "2f7e1f9bd2a87f2d478b5bb8feef5f3db8f6804f75b1f543cf49d15837f8e0a4";
    return {
      schema_kind: "l2g_evidence_index_v1", schema_version: "1.0", catalog_id: newId("evidence_catalog"),
      sources: [
        {
          evidence_id: primaryId, display_label: "Synthetic current network diagram", client_label: "Current network diagram", original_name: "McFirecoal_Synthetic_Network_Diagram.pdf", collection_label: "Synthetic architecture materials",
          origin_kind: "legacy-package-record", media_type: "application/pdf", extension: ".pdf", size_bytes: 48211, last_modified_ms: 1785811200000,
          fingerprint: { algorithm: "SHA-256", sha256: sharedHash }, lifecycle: "active", processing_state: "complete", review_state: "reviewed", trust_state: "no-exception",
          visibility: "approved-for-client-presentation", tags: ["synthetic", "network", "architecture"], supersedes_source_ref: null, superseded_by_source_ref: null, duplicate_group_ref: groupId,
          provenance: syntheticProvenance("fixture-evidence-primary", timestamp), created_at: timestamp, updated_at: timestamp
        },
        {
          evidence_id: duplicateId, display_label: "Synthetic intake copy of network diagram", client_label: "", original_name: "Synthetic_Intake_Copy.pdf", collection_label: "Synthetic intake upload",
          origin_kind: "local-file", media_type: "application/pdf", extension: ".pdf", size_bytes: 48211, last_modified_ms: 1785811300000,
          fingerprint: { algorithm: "SHA-256", sha256: sharedHash }, lifecycle: "active", processing_state: "not-requested", review_state: "unreviewed", trust_state: "not-evaluated",
          visibility: "advisor-only", tags: ["synthetic", "duplicate"], supersedes_source_ref: null, superseded_by_source_ref: null, duplicate_group_ref: groupId,
          provenance: syntheticProvenance("fixture-evidence-duplicate", timestamp), created_at: timestamp, updated_at: timestamp
        },
        {
          evidence_id: externalId, display_label: "Synthetic provider responsibility matrix reference", client_label: "", original_name: "Synthetic_Provider_Matrix.xlsx", collection_label: "Synthetic provider follow-up",
          origin_kind: "external-reference", media_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", extension: ".xlsx", size_bytes: 0, last_modified_ms: 0,
          fingerprint: null, lifecycle: "active", processing_state: "not-requested", review_state: "needs-attention", trust_state: "exception-open",
          visibility: "advisor-only", tags: ["synthetic", "provider"], supersedes_source_ref: null, superseded_by_source_ref: null, duplicate_group_ref: null,
          provenance: syntheticProvenance("fixture-evidence-external", timestamp), created_at: timestamp, updated_at: timestamp
        }
      ],
      locations: [{
        location_id: locationId, source_ref: primaryId, kind: "page", label: "Page 2, synthetic boundary overview", page_start: 2, page_end: 2,
        paragraph: null, sheet: null, row_start: null, row_end: null, column_start: null, column_end: null, slide_start: null, slide_end: null,
        object_label: null, speaker: null, start_ms: null, end_ms: null, package_path: null, record_path: null,
        visibility: "approved-for-client-presentation", provenance: syntheticProvenance("fixture-location", timestamp), created_at: timestamp, updated_at: timestamp
      }],
      derived_records: [{
        derived_id: derivedId, source_ref: primaryId, kind: "diagram-description", title: "Synthetic network boundary description",
        summary: "Synthetic diagram description showing a SaaS boundary with Azure and AWS provider dependencies. This description is source-derived and does not determine scope, responsibility, implementation, or evidence sufficiency.",
        fields: [{ name: "environment", value_type: "string", value: "Synthetic hybrid cloud" }], location_refs: [locationId],
        parser: { name: "DocConverter-L2G", version: "7.9.5.1", method: "legacy-package-import" }, confidence: "medium", review_state: "reviewed",
        visibility: "approved-for-client-presentation", provenance: syntheticProvenance("fixture-derived", timestamp), created_at: timestamp, updated_at: timestamp
      }],
      relationships: [{
        relationship_id: newId("evidence_relationship"), relationship_type: "derived-from", from_ref: derivedId, to_ref: primaryId,
        rationale: "Synthetic source traceability for the bounded diagram description.", visibility: "advisor-only", provenance: syntheticProvenance("fixture-derived-relationship", timestamp), created_at: timestamp
      }],
      duplicate_groups: [{
        duplicate_group_id: groupId, sha256: sharedHash,
        members: [{ source_ref: primaryId, disposition: "unresolved", rationale: "Awaiting explicit Advisor disposition." }, { source_ref: duplicateId, disposition: "unresolved", rationale: "Awaiting explicit Advisor disposition." }],
        state: "unresolved", visibility: "advisor-only", created_at: timestamp, updated_at: timestamp
      }],
      candidate_mappings: [{
        candidate_id: candidateId, source_refs: [primaryId], location_refs: [locationId], derived_refs: [derivedId], target_domain: "engagement", target_type: "open-question",
        proposed_operation: "create", proposed_fields: [{ name: "title", value: "Confirm synthetic network diagram currency" }, { name: "detail", value: "Confirm whether the synthetic boundary description reflects the current workshop discussion." }],
        state: "awaiting-review", rationale: "Source-derived proposal; Engagement must decide whether to create an open question.", target_candidate_ref: null,
        supersedes_candidate_ref: null, superseded_by_candidate_ref: null, visibility: "advisor-only", provenance: syntheticProvenance("fixture-evidence-candidate", timestamp), created_at: timestamp, updated_at: timestamp
      }],
      verification_receipts: [], import_receipts: [], projection_policy: deepClone(EVIDENCE_POLICY)
    };
  }

  export function emptyEvidenceDomain(): EvidenceDomain {
    return { schema_kind: "l2g_evidence_index_v1", schema_version: "1.0", catalog_id: newId("evidence_catalog"), sources: [], locations: [], derived_records: [], relationships: [], duplicate_groups: [], candidate_mappings: [], verification_receipts: [], import_receipts: [], projection_policy: deepClone(EVIDENCE_POLICY) };
  }

  export function sanitizeEvidenceFilename(raw: string): string {
    const stripped = String(raw ?? "").replace(/[\u0000-\u001f\u007f-\u009f\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, "").replace(/^.*[\\/]/, "").trim();
    const noUri = /^(?:[a-zA-Z]:|[a-zA-Z][a-zA-Z0-9+.-]*:)/.test(stripped) ? stripped.replace(/^[^:]+:/, "") : stripped;
    return sanitizePlainText(noUri.replace(/[\\/]/g, "_"), 300) || "unnamed-source";
  }

  export function createStagedSource(file: File, sha256: string, existing: EvidenceDomain): StagedSource {
    if (file.size > 2147483648) throw new Error("The selected source exceeds the 2 GiB v0.4 limit.");
    if (!/^[0-9a-f]{64}$/.test(sha256)) throw new Error("The staged SHA-256 fingerprint is invalid.");
    const originalName = sanitizeEvidenceFilename(file.name);
    const extensionMatch = /(?:\.[A-Za-z0-9]{1,16})$/.exec(originalName);
    return {
      staging_id: newId("staging"), file, original_name: originalName, media_type: sanitizePlainText(file.type || "application/octet-stream", 200), extension: extensionMatch?.[0]?.toLowerCase() ?? "",
      size_bytes: file.size, last_modified_ms: Math.max(0, Math.trunc(file.lastModified || 0)), sha256,
      display_label: originalName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim().slice(0, 300) || "New evidence source",
      client_label: "", collection_label: "", tags: [], visibility: "advisor-only",
      duplicate_source_refs: existing.sources.filter(source => source.fingerprint?.sha256 === sha256).map(source => source.evidence_id)
    };
  }

  export function registerStagedSources(domain: EvidenceDomain, staged: StagedSource[], profile: PresentationProfile): EvidenceSourceRecord[] {
    if (profile !== "advisor") throw new Error("Only Advisor View may register evidence sources.");
    if (!staged.length || staged.length > 500) throw new Error("Source registration batch is invalid.");
    const timestamp = nowIso();
    const created: EvidenceSourceRecord[] = [];
    for (const item of staged) {
      const source: EvidenceSourceRecord = {
        evidence_id: newId("evidence"), display_label: sanitizePlainText(item.display_label, 300), client_label: sanitizePlainText(item.client_label, 300), original_name: sanitizeEvidenceFilename(item.original_name), collection_label: sanitizePlainText(item.collection_label, 300),
        origin_kind: "local-file", media_type: sanitizePlainText(item.media_type, 200), extension: sanitizePlainText(item.extension, 20), size_bytes: item.size_bytes, last_modified_ms: item.last_modified_ms,
        fingerprint: { algorithm: "SHA-256", sha256: item.sha256 }, lifecycle: "active", processing_state: "not-requested", review_state: "unreviewed", trust_state: "not-evaluated",
        visibility: item.visibility, tags: normalizeTags(item.tags), supersedes_source_ref: null, superseded_by_source_ref: null, duplicate_group_ref: null,
        provenance: { source_kind: "local-selection", source_id: newId("verification"), source_label: "Local synthetic source selection", source_location_ref: null, asserted_at: timestamp, asserted_by: "advisor", confidence: "not-evaluated" },
        created_at: timestamp, updated_at: timestamp
      };
      domain.sources.push(source); created.push(source);
      domain.verification_receipts.push({
        verification_id: newId("verification"), source_ref: source.evidence_id, operation: item.duplicate_source_refs.length ? "duplicate-registration" : "initial-registration",
        selected_name: source.original_name, selected_size_bytes: source.size_bytes, selected_last_modified_ms: source.last_modified_ms, selected_sha256: item.sha256,
        result: item.duplicate_source_refs.length ? "duplicate-existing" : "exact-match", related_source_ref: item.duplicate_source_refs[0] ?? null,
        rationale: item.duplicate_source_refs.length ? "Registered as a separate business reference with exact matching bytes." : "Registered after complete local SHA-256 hashing.", performed_at: timestamp, performed_by: "advisor"
      });
    }
    rebuildDuplicateGroups(domain, timestamp);
    return created;
  }

  export function recordExactRelink(domain: EvidenceDomain, sourceId: string, staged: StagedSource, profile: PresentationProfile): VerificationReceipt {
    if (profile !== "advisor") throw new Error("Only Advisor View may relink evidence.");
    const source = requireEvidenceSource(domain, sourceId);
    if (!source.fingerprint || source.fingerprint.sha256 !== staged.sha256) throw new Error("The selected bytes do not match this source fingerprint.");
    const receipt: VerificationReceipt = {
      verification_id: newId("verification"), source_ref: sourceId, operation: "relink", selected_name: sanitizeEvidenceFilename(staged.original_name), selected_size_bytes: staged.size_bytes,
      selected_last_modified_ms: staged.last_modified_ms, selected_sha256: staged.sha256, result: "exact-match", related_source_ref: null,
      rationale: "Exact SHA-256 byte match confirmed for this browser session.", performed_at: nowIso(), performed_by: "advisor"
    };
    domain.verification_receipts.push(receipt); source.updated_at = receipt.performed_at; return receipt;
  }

  export function createEvidenceRevision(domain: EvidenceDomain, priorId: string, staged: StagedSource, supersede: boolean, rationale: string, profile: PresentationProfile): EvidenceSourceRecord {
    if (profile !== "advisor") throw new Error("Only Advisor View may create evidence revisions.");
    const prior = requireEvidenceSource(domain, priorId);
    if (!prior.fingerprint || prior.fingerprint.sha256 === staged.sha256) throw new Error("A revision requires changed source bytes.");
    const cleanRationale = sanitizePlainText(rationale, 8000); if (!cleanRationale.trim()) throw new Error("Revision rationale is required.");
    if (supersede && prior.duplicate_group_ref) {
      const group = domain.duplicate_groups.find(item => item.duplicate_group_id === prior.duplicate_group_ref);
      const member = group?.members.find(item => item.source_ref === prior.evidence_id);
      const otherActive = group?.members.some(item => item.source_ref !== prior.evidence_id && item.disposition !== "excluded" && domain.sources.some(source => source.evidence_id === item.source_ref && source.lifecycle === "active"));
      if (group?.state === "resolved" && member?.disposition === "primary" && otherActive) throw new Error("Select and review a replacement duplicate-group primary before superseding this source.");
    }
    const timestamp = nowIso();
    const revision: EvidenceSourceRecord = {
      evidence_id: newId("evidence"), display_label: sanitizePlainText(staged.display_label || `${prior.display_label} revision`, 300), client_label: sanitizePlainText(staged.client_label, 300), original_name: sanitizeEvidenceFilename(staged.original_name), collection_label: sanitizePlainText(staged.collection_label || prior.collection_label, 300),
      origin_kind: "local-file", media_type: sanitizePlainText(staged.media_type, 200), extension: sanitizePlainText(staged.extension, 20), size_bytes: staged.size_bytes, last_modified_ms: staged.last_modified_ms,
      fingerprint: { algorithm: "SHA-256", sha256: staged.sha256 }, lifecycle: "active", processing_state: "not-requested", review_state: "unreviewed", trust_state: "not-evaluated", visibility: staged.visibility,
      tags: normalizeTags(staged.tags.length ? staged.tags : prior.tags), supersedes_source_ref: supersede ? prior.evidence_id : null, superseded_by_source_ref: null, duplicate_group_ref: null,
      provenance: { source_kind: "local-selection", source_id: newId("verification"), source_label: "Changed synthetic source bytes", source_location_ref: null, asserted_at: timestamp, asserted_by: "advisor", confidence: "not-evaluated" }, created_at: timestamp, updated_at: timestamp
    };
    domain.sources.push(revision);
    domain.relationships.push({ relationship_id: newId("evidence_relationship"), relationship_type: "revision-of", from_ref: revision.evidence_id, to_ref: prior.evidence_id, rationale: cleanRationale, visibility: "advisor-only", provenance: deepClone(revision.provenance), created_at: timestamp });
    if (supersede) { prior.lifecycle = "superseded"; prior.superseded_by_source_ref = revision.evidence_id; prior.updated_at = timestamp; }
    domain.verification_receipts.push({ verification_id: newId("verification"), source_ref: revision.evidence_id, operation: "revision-registration", selected_name: revision.original_name, selected_size_bytes: revision.size_bytes, selected_last_modified_ms: revision.last_modified_ms, selected_sha256: staged.sha256, result: "new-revision-created", related_source_ref: prior.evidence_id, rationale: cleanRationale, performed_at: timestamp, performed_by: "advisor" });
    rebuildDuplicateGroups(domain, timestamp); return revision;
  }

  export function setDuplicateGroupDisposition(domain: EvidenceDomain, groupId: string, dispositions: Record<string, DuplicateDisposition>, rationale: string, profile: PresentationProfile): void {
    if (profile !== "advisor") throw new Error("Only Advisor View may decide duplicate disposition.");
    const group = domain.duplicate_groups.find(item => item.duplicate_group_id === groupId); if (!group) throw new Error("Duplicate group not found.");
    const clean = sanitizePlainText(rationale, 8000); if (!clean.trim()) throw new Error("Duplicate disposition rationale is required.");
    for (const member of group.members) { const disposition = dispositions[member.source_ref]; if (!disposition || !["unresolved","primary","duplicate","retained-distinct","excluded"].includes(disposition)) throw new Error("Every duplicate member requires a valid disposition."); member.disposition = disposition; member.rationale = clean; }
    const activeMembers = group.members.filter(member => { const source = domain.sources.find(item => item.evidence_id === member.source_ref); return source && source.lifecycle === "active" && member.disposition !== "excluded"; });
    const primaries = activeMembers.filter(member => member.disposition === "primary");
    const unresolved = activeMembers.some(member => member.disposition === "unresolved");
    if (!unresolved && activeMembers.length && primaries.length !== 1) throw new Error("A resolved active duplicate group requires exactly one primary.");
    group.state = unresolved ? "unresolved" : "resolved"; group.updated_at = nowIso();
  }

  export function createEvidenceCandidate(domain: EvidenceDomain, input: { source_refs: string[]; location_refs?: string[]; derived_refs?: string[]; target_domain: EvidenceTargetDomain; target_type: string; proposed_operation: EvidenceCandidateMapping["proposed_operation"]; proposed_fields: CandidateField[]; rationale: string; visibility?: Visibility }, profile: PresentationProfile): EvidenceCandidateMapping {
    if (profile !== "advisor") throw new Error("Only Advisor View may create Evidence candidate mappings.");
    const timestamp = nowIso();
    const candidate: EvidenceCandidateMapping = {
      candidate_id: newId("evidence_candidate"), source_refs: [...new Set(input.source_refs)], location_refs: [...new Set(input.location_refs ?? [])], derived_refs: [...new Set(input.derived_refs ?? [])],
      target_domain: input.target_domain, target_type: sanitizePlainText(input.target_type, 120), proposed_operation: input.proposed_operation,
      proposed_fields: input.proposed_fields.map(field => ({ name: sanitizePlainText(field.name, 100), value: sanitizePlainText(field.value, 8000) })),
      state: "awaiting-review", rationale: sanitizePlainText(input.rationale, 8000), target_candidate_ref: null, supersedes_candidate_ref: null, superseded_by_candidate_ref: null,
      visibility: input.visibility ?? "advisor-only", provenance: { source_kind: "evidence-catalog", source_id: newId("evidence_candidate_source"), source_label: "Evidence-origin proposal", source_location_ref: input.location_refs?.[0] ?? null, asserted_at: timestamp, asserted_by: "advisor", confidence: "not-evaluated" }, created_at: timestamp, updated_at: timestamp
    };
    domain.candidate_mappings.push(candidate); return candidate;
  }

  export function markEvidenceCandidatePublished(mapping: EvidenceCandidateMapping, targetCandidateRef: string): void {
    if (mapping.state !== "awaiting-review" || !safeTypedId(targetCandidateRef, "candidate")) throw new Error("Evidence candidate cannot be published.");
    mapping.state = "published-to-target"; mapping.target_candidate_ref = targetCandidateRef; mapping.updated_at = nowIso();
  }

  export function buildEvidenceProjection(domain: EvidenceDomain, workspace: WorkspaceId, profile: PresentationProfile, generatedAt = nowIso()): EvidenceProjection {
    const visible = (value: Visibility): boolean => profile !== "client" || value === "client-safe" || value === "approved-for-client-presentation";
    const sourceVisible = (source: EvidenceSourceRecord): boolean => visible(source.visibility) && (profile !== "client" || Boolean(source.client_label.trim()));
    const visibleSourceIds = new Set(domain.sources.filter(sourceVisible).map(source => source.evidence_id));
    const sources = domain.sources.filter(sourceVisible).map(source => profile === "client" ? ({ evidence_id: source.evidence_id, client_label: source.client_label, media_type: source.media_type, lifecycle: source.lifecycle, review_state: source.review_state, visibility: source.visibility, tags: [...source.tags], created_at: source.created_at, updated_at: source.updated_at } satisfies ClientEvidenceSource) : deepClone(source));
    const locations = domain.locations.filter(item => visible(item.visibility) && visibleSourceIds.has(item.source_ref)).map(item => profile === "client" ? omitProvenance(item) : deepClone(item));
    const visibleLocationIds = new Set(locations.map(item => item.location_id));
    const derivedRecords = domain.derived_records.filter(item => item.kind !== "parser-diagnostic" || profile !== "client").filter(item => visible(item.visibility) && visibleSourceIds.has(item.source_ref) && item.location_refs.every(ref => visibleLocationIds.has(ref))).map(item => {
      if (profile !== "client") return deepClone(item);
      const { provenance: _p, parser: _parser, confidence: _confidence, ...output } = deepClone(item); return output;
    });
    const visibleDerivedIds = new Set(derivedRecords.map(item => item.derived_id));
    const relationships = domain.relationships.filter(item => visible(item.visibility) && refVisible(item.from_ref, visibleSourceIds, visibleLocationIds, visibleDerivedIds) && refVisible(item.to_ref, visibleSourceIds, visibleLocationIds, visibleDerivedIds)).map(item => {
      if (profile !== "client") return deepClone(item); const { provenance: _p, rationale: _r, ...output } = deepClone(item); return output;
    });
    const projection: EvidenceProjection = {
      projection_kind: "l2g_evidence_projection_v1", workspace, profile, generated_at: generatedAt, source_domain: "Evidence", source_catalog_id: domain.catalog_id,
      source_record_ids: [...visibleSourceIds, ...visibleLocationIds, ...visibleDerivedIds], sources, locations, derived_records: derivedRecords, relationships,
      duplicate_groups: profile === "client" ? [] : deepClone(domain.duplicate_groups), candidate_mappings: profile === "client" ? [] : deepClone(domain.candidate_mappings),
      verification_receipts: profile === "client" ? [] : deepClone(domain.verification_receipts), import_receipts: profile === "client" ? [] : deepClone(domain.import_receipts),
      next_work: calculateEvidenceNextWork(domain, profile, generatedAt)
    };
    return deepFreezeValue(projection);
  }

  export function calculateEvidenceNextWork(domain: EvidenceDomain, profile: PresentationProfile, _asOf = nowIso()): EvidenceNextWorkItem[] {
    const visible = (source: EvidenceSourceRecord): boolean => profile !== "client" || ((source.visibility === "client-safe" || source.visibility === "approved-for-client-presentation") && Boolean(source.client_label.trim()));
    const output: EvidenceNextWorkItem[] = [];
    for (const source of domain.sources.filter(visible)) {
      const label = profile === "client" ? source.client_label : source.display_label;
      if (profile !== "client" && source.trust_state === "rejected") output.push({ kind: "exception", record_ref: source.evidence_id, title: label, detail: "Source trust state is rejected and requires an explicit disposition.", priority: 10 });
      else if (profile !== "client" && source.trust_state === "exception-open") output.push({ kind: "exception", record_ref: source.evidence_id, title: label, detail: "A source trust exception remains open.", priority: 20 });
      if (profile !== "client" && source.fingerprint === null) output.push({ kind: "missing-source", record_ref: source.evidence_id, title: label, detail: "External reference has no registered source bytes or fingerprint.", priority: 30 });
      if (profile !== "client" && ["failed","partial","unsupported"].includes(source.processing_state)) output.push({ kind: "processing", record_ref: source.evidence_id, title: label, detail: `Source processing state is ${source.processing_state}.`, priority: 50 });
      if (source.review_state === "unreviewed") output.push({ kind: "source-review", record_ref: source.evidence_id, title: label, detail: "Active source metadata is unreviewed.", priority: 60 });
    }
    if (profile !== "client") {
      for (const group of domain.duplicate_groups) if (group.state === "unresolved") output.push({ kind: "duplicate-group", record_ref: group.duplicate_group_id, title: "Review exact duplicate group", detail: `${group.members.length} registered references share the same bytes and require explicit disposition.`, priority: 40 });
      for (const candidate of domain.candidate_mappings) if (["awaiting-review","returned"].includes(candidate.state)) output.push({ kind: "candidate-mapping", record_ref: candidate.candidate_id, title: "Review Evidence candidate mapping", detail: `Proposal to ${candidate.target_domain} is ${candidate.state}.`, priority: 70 });
      for (const receipt of domain.import_receipts) if (receipt.state === "previewed") output.push({ kind: "import-review", record_ref: receipt.import_id, title: "Review package import", detail: `${receipt.package_kind} preview awaits an explicit decision.`, priority: 80 });
    }
    if (!output.length) output.push({ kind: "informational", record_ref: domain.catalog_id, title: "No factual Evidence next work identified", detail: "No visible unreviewed source, open exception, unresolved duplicate, failed processing item, pending candidate, or import preview was found.", priority: 99 });
    return output.sort((left, right) => left.priority - right.priority || left.record_ref.localeCompare(right.record_ref));
  }

  export function searchEvidenceProjection(projection: EvidenceProjection, query: string): Array<{ kind: string; id: string; title: string; detail: string }> {
    const needle = query.trim().toLocaleLowerCase(); if (!needle) return [];
    const results: Array<{ kind: string; id: string; title: string; detail: string }> = [];
    for (const source of projection.sources) {
      const client = projection.profile === "client";
      const title = client ? (source as ClientEvidenceSource).client_label : (source as EvidenceSourceRecord).display_label;
      const raw = client ? source as ClientEvidenceSource : source as EvidenceSourceRecord;
      const fields = client ? [title, raw.media_type, raw.lifecycle, raw.review_state, ...raw.tags] : [title, (raw as EvidenceSourceRecord).original_name, (raw as EvidenceSourceRecord).collection_label, raw.media_type, raw.lifecycle, raw.review_state, (raw as EvidenceSourceRecord).processing_state, (raw as EvidenceSourceRecord).trust_state, ...raw.tags];
      if (fields.some(value => String(value).toLocaleLowerCase().includes(needle))) results.push({ kind: "Source", id: raw.evidence_id, title, detail: raw.media_type });
    }
    for (const item of projection.derived_records) if ([item.title, item.summary, ...item.fields.flatMap(field => [field.name, String(field.value ?? "")])].some(value => value.toLocaleLowerCase().includes(needle))) results.push({ kind: "Derived", id: item.derived_id, title: item.title, detail: item.kind });
    for (const item of projection.locations) if (item.label.toLocaleLowerCase().includes(needle)) results.push({ kind: "Location", id: item.location_id, title: item.label, detail: item.kind });
    if (projection.profile !== "client") for (const item of projection.candidate_mappings) if ([item.target_domain, item.target_type, item.rationale, ...item.proposed_fields.flatMap(field => [field.name, field.value])].some(value => value.toLocaleLowerCase().includes(needle))) results.push({ kind: "Candidate", id: item.candidate_id, title: `${item.target_domain}: ${item.target_type}`, detail: item.state });
    return results.slice(0, 100);
  }

  export async function previewLegacyEvidencePackage(bytes: Uint8Array, selectedName: string): Promise<ImportPreview> {
    if (bytes.length > ARCHIVE_LIMITS.maxEntryBytes) throw new Error("The selected package exceeds the v0.4 import preview limit.");
    const value = parseStrictJson(decodeUtf8(bytes)); if (!isRecord(value)) throw new Error("The selected package is not a JSON object.");
    const packageKind = value.package_kind; const packageVersion = value.version ?? value.package_version ?? value.schema_version;
    if (typeof packageKind !== "string" || !PACKAGE_KINDS.includes(packageKind as EvidenceImportReceipt["package_kind"]) || packageVersion !== "1.0") throw new Error("The package kind or version is not supported.");
    const registryMatch = window.__L2G_CONTRACT_REGISTRY__.contracts.some(contract => contract.package_kind === packageKind && contract.version === "1.0" && contract.stability === "stable");
    if (!registryMatch) throw new Error("The package is not registered as a stable compatibility input.");
    const timestamp = nowIso(); const sourceDocuments = collectSourceDocuments(value); const records = collectPackageRecords(value);
    const sources: EvidenceSourceRecord[] = []; const locations: EvidenceLocation[] = []; const derived: EvidenceDerivedRecord[] = []; const candidates: EvidenceCandidateMapping[] = [];
    const sourceByLegacyId = new Map<string, string>(); const warnings: string[] = []; const rejected: string[] = [];
    for (const [index, raw] of sourceDocuments.entries()) {
      if (!isRecord(raw)) { rejected.push(`Source document ${index + 1} is not an object.`); continue; }
      const legacyId = firstText(raw, ["source_document_id","document_id","id"]); const name = firstText(raw, ["name","file_name","filename","title"]);
      if (!legacyId || !name) { rejected.push(`Source document ${index + 1} lacks stable ID or name.`); continue; }
      const digest = firstText(raw, ["sha256","source_sha256","hash"]); const validDigest = digest && /^[0-9a-f]{64}$/.test(digest) ? digest : null;
      const sourceId = newId("evidence"); sourceByLegacyId.set(legacyId, sourceId);
      const source: EvidenceSourceRecord = {
        evidence_id: sourceId, display_label: sanitizePlainText(name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "), 300), client_label: "", original_name: sanitizeEvidenceFilename(name), collection_label: `Imported from ${sanitizeEvidenceFilename(selectedName)}`,
        origin_kind: validDigest ? "legacy-package-record" : "external-reference", media_type: firstText(raw, ["media_type","mime_type","type"]) || "application/octet-stream", extension: (/\.[A-Za-z0-9]{1,16}$/.exec(name)?.[0] ?? "").toLowerCase(),
        size_bytes: validDigest ? safeInteger(raw.size_bytes, 0) : 0, last_modified_ms: safeInteger(raw.last_modified_ms, 0), fingerprint: validDigest ? { algorithm: "SHA-256", sha256: validDigest } : null,
        lifecycle: "active", processing_state: "complete", review_state: validDigest ? "unreviewed" : "needs-attention", trust_state: validDigest ? "not-evaluated" : "exception-open", visibility: "advisor-only", tags: ["synthetic-import"],
        supersedes_source_ref: null, superseded_by_source_ref: null, duplicate_group_ref: null,
        provenance: { source_kind: packageKind, source_id: legacyId, source_label: sanitizeEvidenceFilename(selectedName), source_location_ref: null, asserted_at: timestamp, asserted_by: "advisor", confidence: "not-evaluated" }, created_at: timestamp, updated_at: timestamp
      };
      if (!validDigest) warnings.push(`${legacyId}: source fingerprint was unavailable; imported as an unresolved external reference.`);
      sources.push(source);
    }
    for (const [index, raw] of records.entries()) {
      if (!isRecord(raw)) { rejected.push(`Record ${index + 1} is not an object.`); continue; }
      const legacySourceId = firstText(raw, ["source_document_id","document_id","source_id"]); const sourceRef = legacySourceId ? sourceByLegacyId.get(legacySourceId) : undefined;
      const title = firstText(raw, ["title","name","question"]); const summary = firstText(raw, ["summary","detail","description","text"]);
      if (!sourceRef || !title || !summary) { rejected.push(`Record ${index + 1} lacks resolvable source traceability, title, or summary.`); continue; }
      const location = normalizePackageLocation(raw, sourceRef, packageKind, legacySourceId!, timestamp); locations.push(location);
      const derivedRecord: EvidenceDerivedRecord = {
        derived_id: newId("derived"), source_ref: sourceRef, kind: packageDerivedKind(raw), title: sanitizePlainText(title, 300), summary: sanitizePlainText(summary, 16000), fields: normalizeScalarFields(raw.fields), location_refs: [location.location_id],
        parser: { name: "DocConverter-L2G", version: firstText(value, ["producer_version","application_version"]) || "legacy-package", method: "legacy-package-import" }, confidence: normalizeConfidence(raw.confidence), review_state: "unreviewed", visibility: "advisor-only",
        provenance: { source_kind: packageKind, source_id: firstText(raw, ["record_id","id"]) || `record-${index + 1}`, source_label: sanitizeEvidenceFilename(selectedName), source_location_ref: location.location_id, asserted_at: timestamp, asserted_by: "advisor", confidence: normalizeConfidence(raw.confidence) }, created_at: timestamp, updated_at: timestamp
      };
      derived.push(derivedRecord);
      const targetDomain = firstText(raw, ["target_domain"]); const targetType = firstText(raw, ["target_type"]);
      if (targetDomain && targetType && TARGET_DOMAINS.includes(targetDomain as EvidenceTargetDomain)) candidates.push({
        candidate_id: newId("evidence_candidate"), source_refs: [sourceRef], location_refs: [location.location_id], derived_refs: [derivedRecord.derived_id], target_domain: targetDomain as EvidenceTargetDomain, target_type: sanitizePlainText(targetType, 120), proposed_operation: "create",
        proposed_fields: [{ name: "title", value: derivedRecord.title }, { name: "detail", value: derivedRecord.summary }], state: "awaiting-review", rationale: "Imported source-derived proposal; target authority must decide.", target_candidate_ref: null, supersedes_candidate_ref: null, superseded_by_candidate_ref: null,
        visibility: "advisor-only", provenance: deepClone(derivedRecord.provenance), created_at: timestamp, updated_at: timestamp
      });
    }
    if (!sources.length && !derived.length) throw new Error("The package contains no reviewable source-traceable Evidence records.");
    return { package_kind: packageKind as EvidenceImportReceipt["package_kind"], package_version: "1.0", package_name: sanitizeEvidenceFilename(selectedName), package_size_bytes: bytes.length, package_sha256: await sha256Hex(bytes), source_document_ids: [...sourceByLegacyId.keys()], sources, locations, derived_records: derived, candidates, warnings, rejected };
  }

  export function applyImportPreview(domain: EvidenceDomain, preview: ImportPreview, selected: { source_ids?: string[]; derived_ids?: string[]; candidate_ids?: string[] } | undefined, profile: PresentationProfile): EvidenceImportReceipt {
    if (profile !== "advisor") throw new Error("Only Advisor View may apply Evidence imports.");
    const sourceSet = new Set(selected?.source_ids ?? preview.sources.map(item => item.evidence_id));
    const locationSet = new Set(preview.locations.filter(item => sourceSet.has(item.source_ref)).map(item => item.location_id));
    const derivedSet = new Set(selected?.derived_ids ?? preview.derived_records.filter(item => sourceSet.has(item.source_ref)).map(item => item.derived_id));
    const candidateSet = new Set(selected?.candidate_ids ?? preview.candidates.filter(item => item.source_refs.every(ref => sourceSet.has(ref))).map(item => item.candidate_id));
    const sources = preview.sources.filter(item => sourceSet.has(item.evidence_id)); const locations = preview.locations.filter(item => locationSet.has(item.location_id)); const derived = preview.derived_records.filter(item => derivedSet.has(item.derived_id) && item.location_refs.every(ref => locationSet.has(ref))); const candidates = preview.candidates.filter(item => candidateSet.has(item.candidate_id) && item.source_refs.every(ref => sourceSet.has(ref)));
    if (!sources.length && !derived.length && !candidates.length) throw new Error("No reviewed valid import records were selected.");
    domain.sources.push(...deepClone(sources)); domain.locations.push(...deepClone(locations)); domain.derived_records.push(...deepClone(derived)); domain.candidate_mappings.push(...deepClone(candidates));
    const partial = sources.length !== preview.sources.length || derived.length !== preview.derived_records.length || candidates.length !== preview.candidates.length || preview.rejected.length > 0;
    const receipt: EvidenceImportReceipt = {
      import_id: newId("evidence_import"), package_kind: preview.package_kind, package_version: "1.0", package_name: preview.package_name, package_size_bytes: preview.package_size_bytes, package_sha256: preview.package_sha256, registry_version: window.__L2G_CONTRACT_REGISTRY__.registry_version,
      source_document_ids: [...preview.source_document_ids], staged_source_refs: sources.map(item => item.evidence_id), staged_location_refs: locations.map(item => item.location_id), staged_derived_refs: derived.map(item => item.derived_id), staged_candidate_refs: candidates.map(item => item.candidate_id),
      warnings: [...preview.warnings, ...preview.rejected.map(item => `Excluded: ${item}`)].slice(0, 100), state: partial ? "partial" : "applied", imported_at: nowIso(), imported_by: "advisor"
    };
    domain.import_receipts.push(receipt); rebuildDuplicateGroups(domain, receipt.imported_at); return receipt;
  }

  export function validateEvidence(domain: EvidenceDomain, allIds?: Set<string>): void {
    assertExactObjectKeys(domain, ["schema_kind","schema_version","catalog_id","sources","locations","derived_records","relationships","duplicate_groups","candidate_mappings","verification_receipts","import_receipts","projection_policy"], "Evidence domain");
    if (domain.schema_kind !== "l2g_evidence_index_v1" || domain.schema_version !== "1.0" || !safeTypedId(domain.catalog_id, "evidence_catalog")) throw new Error("Evidence catalog identity is invalid.");
    if (stableStringify(domain.projection_policy, 0) !== stableStringify(EVIDENCE_POLICY, 0)) throw new Error("Evidence projection policy is unsupported.");
    const ids = allIds ?? new Set<string>(); addUniqueId(ids, domain.catalog_id, "evidence_catalog");
    validateArray(domain.sources, 2000, item => validateEvidenceSource(item, ids));
    validateArray(domain.locations, 5000, item => validateEvidenceLocation(item, ids));
    validateArray(domain.derived_records, 5000, item => validateDerivedRecord(item, ids));
    validateArray(domain.relationships, 10000, item => validateEvidenceRelationship(item, ids));
    validateArray(domain.duplicate_groups, 2000, item => validateDuplicateGroup(item, ids));
    validateArray(domain.candidate_mappings, 5000, item => validateEvidenceCandidate(item, ids));
    validateArray(domain.verification_receipts, 2000, item => validateVerification(item, ids));
    validateArray(domain.import_receipts, 100, item => validateImportReceipt(item, ids));
    const sourceIds = new Set(domain.sources.map(item => item.evidence_id)); const locationIds = new Set(domain.locations.map(item => item.location_id)); const derivedIds = new Set(domain.derived_records.map(item => item.derived_id)); const candidateIds = new Set(domain.candidate_mappings.map(item => item.candidate_id)); const groupIds = new Set(domain.duplicate_groups.map(item => item.duplicate_group_id));
    for (const source of domain.sources) {
      if (source.supersedes_source_ref && !sourceIds.has(source.supersedes_source_ref)) throw new Error("Evidence source has a dangling supersedes reference.");
      if (source.superseded_by_source_ref && !sourceIds.has(source.superseded_by_source_ref)) throw new Error("Evidence source has a dangling superseded-by reference.");
      if (source.duplicate_group_ref && !groupIds.has(source.duplicate_group_ref)) throw new Error("Evidence source has a dangling duplicate group reference.");
    }
    for (const location of domain.locations) if (!sourceIds.has(location.source_ref)) throw new Error("Evidence location has a dangling source reference.");
    for (const item of domain.derived_records) { if (!sourceIds.has(item.source_ref) || item.location_refs.some(ref => !locationIds.has(ref))) throw new Error("Derived record has dangling source traceability."); }
    for (const item of domain.relationships) { if (!refExists(item.from_ref, sourceIds, locationIds, derivedIds) || !refExists(item.to_ref, sourceIds, locationIds, derivedIds)) throw new Error("Evidence relationship has a dangling reference."); validateRelationshipSemantics(item, domain); }
    for (const group of domain.duplicate_groups) validateDuplicateSemantics(group, domain);
    for (const item of domain.candidate_mappings) { if (item.source_refs.some(ref => !sourceIds.has(ref)) || item.location_refs.some(ref => !locationIds.has(ref)) || item.derived_refs.some(ref => !derivedIds.has(ref))) throw new Error("Evidence candidate has dangling traceability."); if (item.target_candidate_ref && !allIds?.has(item.target_candidate_ref)) throw new Error("Published Evidence candidate has a dangling target candidate reference."); if (item.supersedes_candidate_ref && !candidateIds.has(item.supersedes_candidate_ref)) throw new Error("Evidence candidate has a dangling supersession reference."); }
    for (const item of domain.verification_receipts) if (!sourceIds.has(item.source_ref) || (item.related_source_ref && !sourceIds.has(item.related_source_ref))) throw new Error("Verification receipt has a dangling source reference.");
    for (const item of domain.import_receipts) if ([...item.staged_source_refs].some(ref => !sourceIds.has(ref)) || item.staged_location_refs.some(ref => !locationIds.has(ref)) || item.staged_derived_refs.some(ref => !derivedIds.has(ref)) || item.staged_candidate_refs.some(ref => !candidateIds.has(ref))) throw new Error("Import receipt has dangling normalized references.");
    validateRevisionCycles(domain.sources);
    if (utf8(stableStringify(domain, 0)).length > ARCHIVE_LIMITS.maxEntryBytes) throw new Error("Evidence domain exceeds the inherited archive entry limit.");
  }

  function validateEvidenceSource(item: EvidenceSourceRecord, ids: Set<string>): void {
    assertExactObjectKeys(item, ["evidence_id","display_label","client_label","original_name","collection_label","origin_kind","media_type","extension","size_bytes","last_modified_ms","fingerprint","lifecycle","processing_state","review_state","trust_state","visibility","tags","supersedes_source_ref","superseded_by_source_ref","duplicate_group_ref","provenance","created_at","updated_at"], "Evidence source");
    addUniqueId(ids, item.evidence_id, "evidence"); assertText(item.display_label, 300, "Evidence display label", true); assertText(item.client_label, 300, "Evidence client label"); assertText(item.original_name, 300, "Evidence original name", true); assertText(item.collection_label, 300, "Evidence collection label"); assertText(item.media_type, 200, "Evidence media type", true); assertText(item.extension, 20, "Evidence extension");
    if (sanitizeEvidenceFilename(item.original_name) !== item.original_name || !ORIGINS.includes(item.origin_kind) || !SOURCE_LIFECYCLES.includes(item.lifecycle) || !PROCESSING_STATES.includes(item.processing_state) || !REVIEW_STATES.includes(item.review_state) || !TRUST_STATES.includes(item.trust_state) || !EVIDENCE_VISIBILITIES.includes(item.visibility)) throw new Error("Evidence source state is invalid.");
    if (!Number.isSafeInteger(item.size_bytes) || item.size_bytes < 0 || item.size_bytes > 2147483648 || !Number.isSafeInteger(item.last_modified_ms) || item.last_modified_ms < 0) throw new Error("Evidence source size or modified time is invalid.");
    if (item.fingerprint === null) { if (item.origin_kind !== "external-reference" || item.size_bytes !== 0 || item.review_state !== "needs-attention" || item.trust_state !== "exception-open") throw new Error("Null fingerprint is allowed only for an unresolved external reference."); }
    else { assertExactObjectKeys(item.fingerprint, ["algorithm","sha256"], "Evidence fingerprint"); if (item.fingerprint.algorithm !== "SHA-256" || !/^[0-9a-f]{64}$/.test(item.fingerprint.sha256)) throw new Error("Evidence fingerprint is invalid."); }
    if (!Array.isArray(item.tags) || item.tags.length > 50 || new Set(item.tags).size !== item.tags.length || item.tags.some(tag => typeof tag !== "string" || !tag || tag.length > 100)) throw new Error("Evidence tags are invalid.");
    validateEvidenceMetadata(item);
  }

  function validateEvidenceLocation(item: EvidenceLocation, ids: Set<string>): void {
    assertExactObjectKeys(item, ["location_id","source_ref","kind","label","page_start","page_end","paragraph","sheet","row_start","row_end","column_start","column_end","slide_start","slide_end","object_label","speaker","start_ms","end_ms","package_path","record_path","visibility","provenance","created_at","updated_at"], "Evidence location");
    addUniqueId(ids, item.location_id, "location"); if (!safeTypedId(item.source_ref, "evidence") || !LOCATION_KINDS.includes(item.kind)) throw new Error("Evidence location identity is invalid."); assertText(item.label, 300, "Evidence location label", true); validateEvidenceMetadata(item);
    for (const value of [item.page_start,item.page_end,item.row_start,item.row_end,item.slide_start,item.slide_end,item.start_ms,item.end_ms]) if (value !== null && (!Number.isSafeInteger(value) || value < 0)) throw new Error("Evidence location range is invalid.");
    if ((item.page_start !== null && item.page_end !== null && item.page_start > item.page_end) || (item.row_start !== null && item.row_end !== null && item.row_start > item.row_end) || (item.slide_start !== null && item.slide_end !== null && item.slide_start > item.slide_end) || (item.start_ms !== null && item.end_ms !== null && item.start_ms > item.end_ms)) throw new Error("Evidence location range is reversed.");
    for (const [value, max] of [[item.paragraph,300],[item.sheet,300],[item.column_start,20],[item.column_end,20],[item.object_label,300],[item.speaker,300],[item.package_path,500],[item.record_path,500]] as Array<[string|null,number]>) if (value !== null) { assertText(value, max, "Evidence location text"); if ((value === item.package_path || value === item.record_path) && /(?:^[A-Za-z]:|^[\\/]|\.\.[\\/]|file:)/i.test(value)) throw new Error("Evidence logical location contains a filesystem path."); }
    const required = item.kind === "page" ? item.page_start !== null : item.kind === "paragraph" ? item.paragraph !== null : item.kind === "sheet" ? item.sheet !== null : item.kind === "row" ? item.row_start !== null : item.kind === "cell-range" ? item.sheet !== null && item.row_start !== null && item.column_start !== null : item.kind === "slide" ? item.slide_start !== null : item.kind === "object" ? item.object_label !== null : item.kind === "speaker-turn" ? item.speaker !== null : item.kind === "timestamp-range" ? item.start_ms !== null : item.kind === "package-field" ? item.package_path !== null || item.record_path !== null : true;
    if (!required) throw new Error("Evidence location lacks fields required by its kind.");
  }

  function validateDerivedRecord(item: EvidenceDerivedRecord, ids: Set<string>): void {
    assertExactObjectKeys(item, ["derived_id","source_ref","kind","title","summary","fields","location_refs","parser","confidence","review_state","visibility","provenance","created_at","updated_at"], "Derived record");
    addUniqueId(ids, item.derived_id, "derived"); if (!safeTypedId(item.source_ref, "evidence") || !DERIVED_KINDS.includes(item.kind) || !REVIEW_STATES.includes(item.review_state) || !EVIDENCE_VISIBILITIES.includes(item.visibility) || !["not-evaluated","low","medium","high"].includes(item.confidence)) throw new Error("Derived record state is invalid.");
    assertText(item.title, 300, "Derived title", true); assertText(item.summary, 16000, "Derived summary"); if (/<\/?[A-Za-z]|javascript:|data:|on\w+\s*=/i.test(item.summary)) throw new Error("Derived summary contains active-content markers.");
    if (!Array.isArray(item.fields) || item.fields.length > 100 || utf8(stableStringify(item.fields, 0)).length > 65536) throw new Error("Derived structured fields exceed limits.");
    const fieldNames = new Set<string>(); for (const field of item.fields) { assertExactObjectKeys(field, ["name","value_type","value"], "Derived scalar field"); assertText(field.name, 100, "Derived field name", true); if (fieldNames.has(field.name) || !["string","number","boolean","null"].includes(field.value_type)) throw new Error("Derived field is duplicate or invalid."); fieldNames.add(field.name); const valid = field.value_type === "null" ? field.value === null : field.value_type === typeof field.value; if (!valid || (typeof field.value === "string" && field.value.length > 8000)) throw new Error("Derived scalar value does not match its type or limit."); }
    if (!Array.isArray(item.location_refs) || item.location_refs.length > 200 || new Set(item.location_refs).size !== item.location_refs.length) throw new Error("Derived location references are invalid.");
    assertExactObjectKeys(item.parser, ["name","version","method"], "Parser identity"); assertText(item.parser.name, 200, "Parser name", true); assertText(item.parser.version, 100, "Parser version", true); assertText(item.parser.method, 200, "Parser method", true); if (item.kind === "parser-diagnostic" && item.visibility !== "advisor-only") throw new Error("Parser diagnostics must remain Advisor-only."); validateEvidenceMetadata(item);
  }

  function validateEvidenceRelationship(item: EvidenceRelationship, ids: Set<string>): void {
    assertExactObjectKeys(item, ["relationship_id","relationship_type","from_ref","to_ref","rationale","visibility","provenance","created_at"], "Evidence relationship");
    addUniqueId(ids, item.relationship_id, "evidence_relationship"); if (!RELATIONSHIP_TYPES.includes(item.relationship_type) || item.from_ref === item.to_ref || !EVIDENCE_VISIBILITIES.includes(item.visibility) || !isIsoDateTime(item.created_at)) throw new Error("Evidence relationship state is invalid."); assertText(item.rationale, 8000, "Relationship rationale"); validateProvenanceValue(item.provenance);
  }

  function validateDuplicateGroup(item: DuplicateGroup, ids: Set<string>): void {
    assertExactObjectKeys(item, ["duplicate_group_id","sha256","members","state","visibility","created_at","updated_at"], "Duplicate group");
    addUniqueId(ids, item.duplicate_group_id, "duplicate_group"); if (!/^[0-9a-f]{64}$/.test(item.sha256) || !["unresolved","resolved"].includes(item.state) || !EVIDENCE_VISIBILITIES.includes(item.visibility) || !isIsoDateTime(item.created_at) || !isIsoDateTime(item.updated_at) || !Array.isArray(item.members) || item.members.length < 2 || item.members.length > 200) throw new Error("Duplicate group is invalid.");
    const refs = new Set<string>(); for (const member of item.members) { assertExactObjectKeys(member, ["source_ref","disposition","rationale"], "Duplicate member"); if (!safeTypedId(member.source_ref, "evidence") || refs.has(member.source_ref) || !["unresolved","primary","duplicate","retained-distinct","excluded"].includes(member.disposition)) throw new Error("Duplicate member is invalid."); refs.add(member.source_ref); assertText(member.rationale, 8000, "Duplicate rationale"); }
  }

  function validateEvidenceCandidate(item: EvidenceCandidateMapping, ids: Set<string>): void {
    assertExactObjectKeys(item, ["candidate_id","source_refs","location_refs","derived_refs","target_domain","target_type","proposed_operation","proposed_fields","state","rationale","target_candidate_ref","supersedes_candidate_ref","superseded_by_candidate_ref","visibility","provenance","created_at","updated_at"], "Evidence candidate");
    addUniqueId(ids, item.candidate_id, "evidence_candidate"); if (!TARGET_DOMAINS.includes(item.target_domain) || !["create","update","link","request-review"].includes(item.proposed_operation) || !CANDIDATE_STATES.includes(item.state) || !EVIDENCE_VISIBILITIES.includes(item.visibility)) throw new Error("Evidence candidate state is invalid.");
    assertText(item.target_type, 120, "Evidence target type", true); assertText(item.rationale, 8000, "Evidence candidate rationale", true);
    for (const refs of [item.source_refs,item.location_refs,item.derived_refs]) if (!Array.isArray(refs) || refs.length > 200 || new Set(refs).size !== refs.length) throw new Error("Evidence candidate traceability is invalid.");
    if (!item.source_refs.length || !Array.isArray(item.proposed_fields) || !item.proposed_fields.length || item.proposed_fields.length > 100) throw new Error("Evidence candidate requires source and proposed fields.");
    const names = new Set<string>(); for (const field of item.proposed_fields) { assertExactObjectKeys(field, ["name","value"], "Evidence candidate field"); assertText(field.name, 100, "Candidate field name", true); assertText(field.value, 8000, "Candidate field value"); if (names.has(field.name)) throw new Error("Evidence candidate contains duplicate fields."); names.add(field.name); }
    if (item.state === "published-to-target" && !item.target_candidate_ref) throw new Error("Published Evidence candidate requires a target candidate reference."); validateEvidenceMetadata(item);
  }

  function validateVerification(item: VerificationReceipt, ids: Set<string>): void {
    assertExactObjectKeys(item, ["verification_id","source_ref","operation","selected_name","selected_size_bytes","selected_last_modified_ms","selected_sha256","result","related_source_ref","rationale","performed_at","performed_by"], "Verification receipt");
    addUniqueId(ids, item.verification_id, "verification"); if (!safeTypedId(item.source_ref, "evidence") || !["initial-registration","relink","revision-registration","duplicate-registration"].includes(item.operation) || !["exact-match","duplicate-existing","new-revision-created"].includes(item.result) || item.performed_by !== "advisor" || !isIsoDateTime(item.performed_at) || !/^[0-9a-f]{64}$/.test(item.selected_sha256)) throw new Error("Verification receipt is invalid.");
    if (sanitizeEvidenceFilename(item.selected_name) !== item.selected_name || !Number.isSafeInteger(item.selected_size_bytes) || item.selected_size_bytes < 0 || item.selected_size_bytes > 2147483648 || !Number.isSafeInteger(item.selected_last_modified_ms) || item.selected_last_modified_ms < 0) throw new Error("Verification metadata is invalid."); assertText(item.rationale, 8000, "Verification rationale", true);
  }

  function validateImportReceipt(item: EvidenceImportReceipt, ids: Set<string>): void {
    assertExactObjectKeys(item, ["import_id","package_kind","package_version","package_name","package_size_bytes","package_sha256","registry_version","source_document_ids","staged_source_refs","staged_location_refs","staged_derived_refs","staged_candidate_refs","warnings","state","imported_at","imported_by"], "Import receipt");
    addUniqueId(ids, item.import_id, "evidence_import"); if (!PACKAGE_KINDS.includes(item.package_kind) || item.package_version !== "1.0" || !/^[0-9a-f]{64}$/.test(item.package_sha256) || !["previewed","applied","partial","rejected","superseded"].includes(item.state) || item.imported_by !== "advisor" || !isIsoDateTime(item.imported_at) || !Number.isSafeInteger(item.package_size_bytes) || item.package_size_bytes < 1 || item.package_size_bytes > ARCHIVE_LIMITS.maxEntryBytes) throw new Error("Import receipt is invalid.");
    assertText(item.package_name, 300, "Import package name", true); assertText(item.registry_version, 100, "Registry version", true);
    for (const refs of [item.source_document_ids,item.staged_source_refs,item.staged_location_refs,item.staged_derived_refs,item.staged_candidate_refs,item.warnings]) if (!Array.isArray(refs) || refs.length > 500 || refs.some(value => typeof value !== "string" || value.length > 8000)) throw new Error("Import receipt collection is invalid.");
  }

  function validateEvidenceMetadata(item: { visibility: Visibility; provenance: Provenance; created_at: string; updated_at: string }): void { if (!EVIDENCE_VISIBILITIES.includes(item.visibility) || !isIsoDateTime(item.created_at) || !isIsoDateTime(item.updated_at)) throw new Error("Evidence metadata is invalid."); validateProvenanceValue(item.provenance); }

  function rebuildDuplicateGroups(domain: EvidenceDomain, timestamp: string): void {
    const byHash = new Map<string, EvidenceSourceRecord[]>();
    for (const source of domain.sources) if (source.fingerprint) { const list = byHash.get(source.fingerprint.sha256) ?? []; list.push(source); byHash.set(source.fingerprint.sha256, list); }
    const existingByHash = new Map(domain.duplicate_groups.map(group => [group.sha256, group]));
    const retained: DuplicateGroup[] = [];
    for (const [hash, members] of [...byHash.entries()].sort(([left],[right]) => left.localeCompare(right))) {
      if (members.length < 2) { for (const source of members) source.duplicate_group_ref = null; continue; }
      const group = existingByHash.get(hash) ?? { duplicate_group_id: newId("duplicate_group"), sha256: hash, members: [], state: "unresolved", visibility: "advisor-only", created_at: timestamp, updated_at: timestamp };
      const prior = new Map(group.members.map(member => [member.source_ref, member]));
      group.members = members.sort((a,b) => a.evidence_id.localeCompare(b.evidence_id)).map(source => prior.get(source.evidence_id) ?? { source_ref: source.evidence_id, disposition: "unresolved", rationale: "Awaiting explicit Advisor disposition." });
      group.state = group.members.some(member => member.disposition === "unresolved") ? "unresolved" : "resolved"; group.updated_at = timestamp;
      for (const source of members) source.duplicate_group_ref = group.duplicate_group_id; retained.push(group);
    }
    domain.duplicate_groups = retained;
  }

  function validateDuplicateSemantics(group: DuplicateGroup, domain: EvidenceDomain): void {
    const sources = group.members.map(member => domain.sources.find(source => source.evidence_id === member.source_ref));
    if (sources.some(source => !source || source.fingerprint?.sha256 !== group.sha256)) throw new Error("Duplicate group members do not share the group fingerprint.");
    for (const source of sources) if (source!.duplicate_group_ref !== group.duplicate_group_id) throw new Error("Duplicate group reverse reference is inconsistent.");
    const active = group.members.filter(member => { const source = domain.sources.find(item => item.evidence_id === member.source_ref)!; return source.lifecycle === "active" && member.disposition !== "excluded"; });
    if (group.state === "resolved" && active.length && active.filter(member => member.disposition === "primary").length !== 1) throw new Error("Resolved duplicate group requires exactly one active primary.");
    if (group.state === "unresolved" && !group.members.some(member => member.disposition === "unresolved")) throw new Error("Unresolved duplicate group has no unresolved member.");
  }

  function validateRelationshipSemantics(item: EvidenceRelationship, domain: EvidenceDomain): void {
    const sources = new Map(domain.sources.map(source => [source.evidence_id, source]));
    if (item.relationship_type === "duplicate-of") {
      const left = sources.get(item.from_ref); const right = sources.get(item.to_ref); if (!left?.fingerprint || !right?.fingerprint || left.fingerprint.sha256 !== right.fingerprint.sha256) throw new Error("duplicate-of requires matching source fingerprints.");
    }
    if (item.relationship_type === "revision-of" && (!sources.has(item.from_ref) || !sources.has(item.to_ref))) throw new Error("revision-of requires source records.");
    if (item.relationship_type === "derived-from" && !item.from_ref.startsWith("derived_")) throw new Error("derived-from must originate from a derived record.");
  }

  function validateRevisionCycles(sources: EvidenceSourceRecord[]): void {
    const next = new Map(sources.filter(source => source.supersedes_source_ref).map(source => [source.evidence_id, source.supersedes_source_ref!]));
    for (const start of next.keys()) { const seen = new Set<string>(); let current: string | undefined = start; while (current) { if (seen.has(current)) throw new Error("Evidence revision chain contains a cycle."); seen.add(current); current = next.get(current); } }
    for (const source of sources) if (source.supersedes_source_ref) { const prior = sources.find(item => item.evidence_id === source.supersedes_source_ref); if (prior?.superseded_by_source_ref && prior.superseded_by_source_ref !== source.evidence_id) throw new Error("Evidence supersession reverse link is inconsistent."); }
  }

  function normalizeTags(tags: string[]): string[] { return [...new Set(tags.map(tag => sanitizePlainText(tag, 100).trim()).filter(Boolean))].slice(0, 50); }
  function requireEvidenceSource(domain: EvidenceDomain, sourceId: string): EvidenceSourceRecord { const source = domain.sources.find(item => item.evidence_id === sourceId); if (!source) throw new Error("Evidence source not found."); return source; }
  function omitProvenance<T extends { provenance: Provenance }>(value: T): Omit<T, "provenance"> { const { provenance: _p, ...output } = deepClone(value); return output; }
  function refVisible(ref: string, sources: Set<string>, locations: Set<string>, derived: Set<string>): boolean { return sources.has(ref) || locations.has(ref) || derived.has(ref); }
  function refExists(ref: string, sources: Set<string>, locations: Set<string>, derived: Set<string>): boolean { return refVisible(ref, sources, locations, derived); }
  function firstText(value: Record<string, unknown>, keys: string[]): string { for (const key of keys) { const item = value[key]; if (typeof item === "string" && item.trim()) return sanitizePlainText(item, 16000); } return ""; }
  function safeInteger(value: unknown, fallback: number): number { return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : fallback; }
  function collectSourceDocuments(value: Record<string, unknown>): unknown[] { for (const key of ["source_documents","documents","document_register"]) if (Array.isArray(value[key])) return value[key] as unknown[]; return []; }
  function collectPackageRecords(value: Record<string, unknown>): unknown[] { const output: unknown[] = []; for (const key of ["evidence_records","records","capability_records","meeting_segments","questions","diagram_records","security_evidence_records"]) if (Array.isArray(value[key])) output.push(...value[key] as unknown[]); return output; }
  function normalizeConfidence(value: unknown): Provenance["confidence"] { return typeof value === "string" && ["low","medium","high"].includes(value.toLowerCase()) ? value.toLowerCase() as Provenance["confidence"] : "not-evaluated"; }
  function packageDerivedKind(raw: Record<string, unknown>): DerivedRecordKind { const value = firstText(raw, ["kind","record_type","type"]).toLowerCase(); if (value.includes("diagram")) return "diagram-description"; if (value.includes("security")) return "security-evidence-item"; if (value.includes("meeting") || value.includes("segment") || value.includes("transcript")) return "meeting-segment"; if (isRecord(raw.fields)) return "structured-record"; return "extract-summary"; }
  function normalizeScalarFields(value: unknown): ScalarField[] { if (!isRecord(value)) return []; const output: ScalarField[] = []; for (const [name, raw] of Object.entries(value).slice(0, 100)) { const cleanName = sanitizePlainText(name, 100); if (!cleanName) continue; if (raw === null) output.push({ name: cleanName, value_type: "null", value: null }); else if (typeof raw === "string") output.push({ name: cleanName, value_type: "string", value: sanitizePlainText(raw, 8000) }); else if (typeof raw === "number" && Number.isFinite(raw)) output.push({ name: cleanName, value_type: "number", value: raw }); else if (typeof raw === "boolean") output.push({ name: cleanName, value_type: "boolean", value: raw }); } return output; }
  function normalizePackageLocation(raw: Record<string, unknown>, sourceRef: string, packageKind: string, legacySourceId: string, timestamp: string): EvidenceLocation {
    const sourceLocation = isRecord(raw.source_location) ? raw.source_location : raw;
    const page = safeInteger(sourceLocation.page ?? sourceLocation.page_start, -1); const sheet = firstText(sourceLocation, ["sheet","sheet_name"]); const row = safeInteger(sourceLocation.row ?? sourceLocation.row_start, -1); const slide = safeInteger(sourceLocation.slide ?? sourceLocation.slide_start, -1); const recordPath = firstText(sourceLocation, ["record_path","path"]);
    const kind: EvidenceLocationKind = page >= 0 ? "page" : sheet && row >= 0 ? "row" : sheet ? "sheet" : slide >= 0 ? "slide" : recordPath ? "package-field" : "unknown";
    return { location_id: newId("location"), source_ref: sourceRef, kind, label: sanitizePlainText(firstText(sourceLocation, ["label"]) || `${packageKind} source ${legacySourceId}`, 300), page_start: page >= 0 ? page : null, page_end: page >= 0 ? page : null, paragraph: null, sheet: sheet || null, row_start: row >= 0 ? row : null, row_end: row >= 0 ? row : null, column_start: firstText(sourceLocation, ["column_start","column"]) || null, column_end: firstText(sourceLocation, ["column_end","column"]) || null, slide_start: slide >= 0 ? slide : null, slide_end: slide >= 0 ? slide : null, object_label: firstText(sourceLocation, ["object_label"]) || null, speaker: firstText(sourceLocation, ["speaker"]) || null, start_ms: safeInteger(sourceLocation.start_ms, -1) >= 0 ? safeInteger(sourceLocation.start_ms, 0) : null, end_ms: safeInteger(sourceLocation.end_ms, -1) >= 0 ? safeInteger(sourceLocation.end_ms, 0) : null, package_path: packageKind, record_path: recordPath || null, visibility: "advisor-only", provenance: { source_kind: packageKind, source_id: legacySourceId, source_label: packageKind, source_location_ref: null, asserted_at: timestamp, asserted_by: "advisor", confidence: "not-evaluated" }, created_at: timestamp, updated_at: timestamp };
  }
}
