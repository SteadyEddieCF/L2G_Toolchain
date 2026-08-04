namespace L2G {
  const INNER_PATHS = [
    "compatibility/current-registry.json",
    "domains/engagement.json",
    "domains/reviews-actions.json",
    "history/checkpoints.json",
    "history/events.ndjson",
    "integrity/sha256-manifest.json",
    "manifest.json"
  ];
  const EXPECTED_DOMAINS = [
    { path: "domains/engagement.json", schema: "l2g_engagement_v1", authority: "Engagement" },
    { path: "domains/reviews-actions.json", schema: "reviews_actions_v1", authority: "Reviews & Actions" }
  ];
  const WORKSPACES: WorkspaceId[] = ["overview", "pre-engagement", "evidence", "scope", "practice-review", "ssp", "deliverables", "reviews-actions"];
  const VISIBILITIES: Visibility[] = ["advisor-only", "client-safe", "approved-for-client-presentation"];
  const PHASES: EngagementPhase[] = ["planning", "discovery", "scoping", "practice-review", "ssp-development", "delivery", "review", "closed"];
  const IDENTITY_FIELDS = new Set(["engagement_name", "client_name", "system_name", "delivery_context", "objectives", "target_level", "phase", "start_date", "target_end_date", "information_label", "visibility"]);

  function syntheticProvenance(sourceId: string, timestamp: string, assertedBy: Provenance["asserted_by"] = "system"): Provenance {
    return { source_kind: "synthetic-fixture", source_id: sourceId, source_label: "McFirecoal synthetic data", asserted_at: timestamp, asserted_by: assertedBy, confidence: "not-evaluated" };
  }

  export function createNewProject(): ProjectDocument {
    const timestamp = nowIso();
    const projectId = newId("project");
    const engagementId = newId("engagement");
    const clientOrgId = newId("organization");
    const advisorOrgId = newId("organization");
    const questionId = newId("question");
    const milestoneId = newId("milestone");
    const candidateId = newId("candidate");
    return {
      manifest: {
        kind: "l2g_project_v1",
        schema_version: "1.0",
        project_id: projectId,
        created_at: timestamp,
        updated_at: timestamp,
        application: { name: "L2G Integrated Suite", version: window.__L2G_RELEASE__.version, product_runtime_compatibility_baseline: window.__L2G_RELEASE__.product_runtime_compatibility_baseline },
        evidence_policy: "reference-only",
        encryption_mode: "aes-256-gcm-pbkdf2-sha256-v1",
        domain_index: deepClone(EXPECTED_DOMAINS)
      },
      state: {
        engagement: {
          schema_kind: "l2g_engagement_v1",
          schema_version: "1.0",
          engagement_id: engagementId,
          identity: {
            engagement_name: "McFirecoal Synthetic CMMC Engagement",
            client_name: "McFirecoal Synthetic Client",
            system_name: "Synthetic SaaS Environment",
            delivery_context: "Offline advisory discovery, scoping, practice review, SSP development, and deliverable preparation using synthetic data only.",
            objectives: "Establish a governed engagement context without making readiness, compliance, evidence-sufficiency, certification, or Met/Not Met conclusions.",
            target_level: "CMMC Level 2",
            phase: "planning",
            start_date: "2026-08-04",
            target_end_date: "2026-10-30",
            information_label: "Synthetic",
            lifecycle: "accepted",
            visibility: "approved-for-client-presentation",
            updated_at: timestamp
          },
          organizations: [
            { organization_id: clientOrgId, name: "McFirecoal Synthetic Client", relationship: "client", status: "active", visibility: "approved-for-client-presentation", provenance: syntheticProvenance("fixture-client", timestamp), created_at: timestamp, updated_at: timestamp },
            { organization_id: advisorOrgId, name: "Synthetic Advisory Team", relationship: "advisor", status: "active", visibility: "advisor-only", provenance: syntheticProvenance("fixture-advisor", timestamp), created_at: timestamp, updated_at: timestamp }
          ],
          participants: [
            { participant_id: newId("participant"), display_name: "Morgan Client", role: "Program Owner", organization_ref: clientOrgId, contact_reference: "synthetic:morgan.client", participation_state: "active", visibility: "approved-for-client-presentation", provenance: syntheticProvenance("fixture-participant-client", timestamp), created_at: timestamp, updated_at: timestamp },
            { participant_id: newId("participant"), display_name: "Avery Advisor", role: "Principal Advisor", organization_ref: advisorOrgId, contact_reference: "synthetic:avery.advisor", participation_state: "active", visibility: "advisor-only", provenance: syntheticProvenance("fixture-participant-advisor", timestamp), created_at: timestamp, updated_at: timestamp }
          ],
          assumptions: [
            { assumption_id: newId("assumption"), title: "Synthetic-only validation", detail: "All records and examples are synthetic and are not authorized for client, FCI, or CUI use.", status: "confirmed", visibility: "approved-for-client-presentation", provenance: syntheticProvenance("fixture-assumption", timestamp), related_refs: [], created_at: timestamp, updated_at: timestamp }
          ],
          decisions: [
            { decision_id: newId("decision"), title: "Reference-only evidence posture", detail: "The project retains metadata and references, not original evidence files.", status: "accepted", rationale: "Preserves the accepted offline safety boundary while evidence migration remains excluded.", visibility: "client-safe", provenance: syntheticProvenance("fixture-decision", timestamp), related_refs: [], created_at: timestamp, updated_at: timestamp }
          ],
          open_questions: [
            { question_id: questionId, title: "Confirm delivery participants", detail: "Confirm the synthetic participant list before discovery planning.", status: "open", visibility: "client-safe", provenance: syntheticProvenance("fixture-question", timestamp), related_refs: [], created_at: timestamp, updated_at: timestamp }
          ],
          constraints: [
            { constraint_id: newId("constraint"), title: "No runtime network", detail: "The portable runtime must not make network requests, load remote assets, or emit telemetry.", status: "active", visibility: "client-safe", provenance: syntheticProvenance("fixture-constraint", timestamp), related_refs: [], created_at: timestamp, updated_at: timestamp }
          ],
          milestones: [
            { milestone_id: milestoneId, title: "Engagement context review", detail: "Review identity, participants, assumptions, decisions, questions, and milestones.", target_date: "2026-08-18", owner_label: "Advisor", workstream: "Engagement", operational_state: "planned", visibility: "approved-for-client-presentation", provenance: syntheticProvenance("fixture-milestone", timestamp), related_refs: [questionId], created_at: timestamp, updated_at: timestamp }
          ],
          blockers: [
            { blocker_id: newId("blocker"), title: "Synthetic participant confirmation", detail: "Participant confirmation is pending before the synthetic discovery schedule is finalized.", severity: "medium", operational_state: "waiting", owner_label: "Client", visibility: "client-safe", provenance: syntheticProvenance("fixture-blocker", timestamp), related_refs: [questionId, milestoneId], created_at: timestamp, updated_at: timestamp }
          ],
          candidates: [
            { candidate_id: candidateId, source_kind: "legacy-metadata", source_ref: "synthetic-intake-001", target_type: "identity", proposed_fields: { delivery_context: "Facilitated CMMC Level 2 advisory engagement with synthetic Azure and AWS service context." }, state: "candidate", rationale: "Awaiting Advisor review; creation does not mutate accepted identity.", provenance: syntheticProvenance("fixture-candidate", timestamp), visibility: "advisor-only" }
          ],
          projection_policy: { client_visible_values: ["client-safe", "approved-for-client-presentation"], reviewer_include_provenance: true, client_include_candidates: false }
        },
        reviews_actions: {
          schema_version: "reviews_actions_v1",
          examples: [{ id: newId("review"), title: "Review engagement candidate", source_domain: "Engagement", target_domain: "Reviews & Actions", lifecycle: "Proposed", review_state: "Assigned", operational_state: "Open", visibility: "Advisor-only", rationale: "Candidates require an explicit Engagement-owned decision command." }]
        },
        profile: "advisor",
        active_workspace: "overview",
        inspector_open: false,
        inspector_pinned: false,
        rail_collapsed: false
      },
      history: [{ event_id: newId("event"), timestamp, profile: "advisor", action: "project.created", object_type: "project", object_id: projectId, summary: "Created a synthetic v0.3 engagement-spine project.", transaction_id: newId("txn") }],
      checkpoints: []
    };
  }

  export function touchProject(document: ProjectDocument): void { document.manifest.updated_at = nowIso(); }

  export function appendHistory(document: ProjectDocument, action: string, objectType: string, objectId: string, summary: string, reverses?: string): HistoryEvent {
    const event: HistoryEvent = { event_id: newId("event"), timestamp: nowIso(), profile: document.state.profile, action, object_type: objectType, object_id: objectId, summary: sanitizePlainText(summary, 500), transaction_id: newId("txn") };
    if (reverses) event.reverses_event_id = reverses;
    document.history.push(event);
    return event;
  }

  export function decideCandidate(domain: EngagementDomain, candidateId: string, action: "accept" | "modify" | "reject", rationale: string, profile: PresentationProfile, modifiedFields?: Record<string, string>): void {
    if (profile !== "advisor") throw new Error("Only Advisor View may decide engagement candidates.");
    const candidate = domain.candidates.find(item => item.candidate_id === candidateId);
    if (!candidate) throw new Error("Candidate not found.");
    if (candidate.state !== "candidate") throw new Error("A decided candidate cannot be decided again; create a superseding candidate.");
    const cleanRationale = sanitizePlainText(rationale, 8000);
    if (!cleanRationale.trim()) throw new Error("Candidate decisions require rationale.");
    if (action === "reject") {
      candidate.state = "rejected";
      candidate.rationale = cleanRationale;
      candidate.decided_at = nowIso();
      candidate.decided_by = profile;
      return;
    }
    if (candidate.target_type !== "identity") throw new Error("This v0.3 UI applies candidate fields only to the canonical identity; other targets remain reviewable proposals.");
    const accepted = action === "modify" ? modifiedFields : candidate.proposed_fields;
    if (!accepted || Object.keys(accepted).length === 0) throw new Error("Candidate contains no accepted fields.");
    applyIdentityFields(domain.identity, accepted);
    candidate.accepted_fields = deepClone(accepted);
    candidate.state = action === "modify" ? "modified" : "accepted";
    candidate.rationale = cleanRationale;
    candidate.decided_at = nowIso();
    candidate.decided_by = profile;
    candidate.accepted_record_ref = domain.engagement_id;
  }

  export function supersedeCandidate(domain: EngagementDomain, candidateId: string, proposedFields: Record<string, string>, rationale: string, profile: PresentationProfile): CandidateRecord {
    if (profile !== "advisor") throw new Error("Only Advisor View may supersede engagement candidates.");
    const candidate = domain.candidates.find(item => item.candidate_id === candidateId);
    if (!candidate) throw new Error("Candidate not found.");
    if (candidate.state === "superseded") throw new Error("Candidate is already superseded.");
    const timestamp = nowIso();
    const replacement: CandidateRecord = {
      candidate_id: newId("candidate"), source_kind: candidate.source_kind, source_ref: candidate.source_ref, target_type: candidate.target_type,
      proposed_fields: sanitizeFieldMap(proposedFields), state: "candidate", rationale: sanitizePlainText(rationale, 8000),
      supersedes_candidate_id: candidate.candidate_id, provenance: deepClone(candidate.provenance), visibility: candidate.visibility
    };
    replacement.provenance.asserted_at = timestamp;
    replacement.provenance.asserted_by = profile;
    candidate.state = "superseded";
    candidate.superseded_by_candidate_id = replacement.candidate_id;
    candidate.decided_at = timestamp;
    candidate.decided_by = profile;
    candidate.rationale = sanitizePlainText(rationale, 8000);
    domain.candidates.push(replacement);
    return replacement;
  }

  function sanitizeFieldMap(fields: Record<string, string>): Record<string, string> {
    const output: Record<string, string> = {};
    for (const [key, value] of Object.entries(fields)) output[sanitizePlainText(key, 100)] = sanitizePlainText(value, 8000);
    return output;
  }

  function applyIdentityFields(identity: IdentityRecord, fields: Record<string, string>): void {
    for (const [key, raw] of Object.entries(fields)) {
      if (!IDENTITY_FIELDS.has(key)) throw new Error(`Unsupported identity candidate field: ${key}`);
      const value = sanitizePlainText(raw, ["delivery_context", "objectives"].includes(key) ? 8000 : 200);
      if (key === "phase") {
        if (!PHASES.includes(value as EngagementPhase)) throw new Error("Candidate proposes an unsupported engagement phase.");
        identity.phase = value as EngagementPhase;
      } else if (key === "target_level") {
        if (!["CMMC Level 2", "CMMC Level 1", "Other", "Not specified"].includes(value)) throw new Error("Candidate proposes an unsupported target level.");
        identity.target_level = value as IdentityRecord["target_level"];
      } else if (key === "information_label") {
        if (!["Synthetic", "Public", "Internal", "FCI", "CUI", "Unknown"].includes(value)) throw new Error("Candidate proposes an unsupported information label.");
        identity.information_label = value as InformationLabel;
      } else if (key === "visibility") {
        if (!VISIBILITIES.includes(value as Visibility)) throw new Error("Candidate proposes unsupported visibility.");
        identity.visibility = value as Visibility;
      } else if (key === "engagement_name") identity.engagement_name = value;
      else if (key === "client_name") identity.client_name = value;
      else if (key === "system_name") identity.system_name = value;
      else if (key === "delivery_context") identity.delivery_context = value;
      else if (key === "objectives") identity.objectives = value;
      else if (key === "start_date") identity.start_date = value;
      else if (key === "target_end_date") identity.target_end_date = value;
    }
    identity.updated_at = nowIso();
  }

  export function buildEngagementProjection(domain: EngagementDomain, workspace: WorkspaceId, profile: PresentationProfile, generatedAt = nowIso()): EngagementProjection {
    const include = (visibility: Visibility): boolean => profile !== "client" || visibility === "client-safe" || visibility === "approved-for-client-presentation";
    const withProfile = <T extends { visibility: Visibility; provenance: Provenance }>(records: T[]): Array<Omit<T, "provenance"> & { provenance?: Provenance }> => records.filter(record => include(record.visibility)).map(record => {
      const clone = deepClone(record) as T;
      if (profile === "client") {
        const output = { ...clone } as T & { provenance?: Provenance };
        delete output.provenance;
        return output;
      }
      return clone;
    });
    const sourceRecordIds: string[] = [domain.engagement_id];
    for (const collection of [domain.participants, domain.organizations, domain.assumptions, domain.decisions, domain.open_questions, domain.constraints, domain.milestones, domain.blockers]) {
      for (const record of collection) {
        const identifier = recordIdentifier(record);
        if (identifier && include(record.visibility)) sourceRecordIds.push(identifier);
      }
    }
    const projection: EngagementProjection = {
      projection_kind: "l2g_engagement_projection_v1",
      workspace,
      profile,
      generated_at: generatedAt,
      source_domain: "Engagement",
      source_engagement_id: domain.engagement_id,
      source_record_ids: sourceRecordIds,
      identity: deepClone(domain.identity),
      participants: withProfile(domain.participants),
      organizations: withProfile(domain.organizations),
      assumptions: withProfile(domain.assumptions),
      decisions: withProfile(domain.decisions),
      open_questions: withProfile(domain.open_questions),
      constraints: withProfile(domain.constraints),
      milestones: withProfile(domain.milestones),
      blockers: withProfile(domain.blockers),
      candidates: profile === "client" ? [] : deepClone(domain.candidates),
      next_work: calculateNextWork(domain, generatedAt).filter(item => profile !== "client" || item.kind !== "candidate")
    };
    return deepFreeze(projection);
  }

  export function calculateNextWork(domain: EngagementDomain, asOf = nowIso()): NextWorkItem[] {
    const output: NextWorkItem[] = [];
    const date = new Date(asOf);
    const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    const required: Array<[keyof IdentityRecord, string]> = [["engagement_name", "Engagement name"], ["client_name", "Client name"], ["system_name", "System or program name"], ["delivery_context", "Delivery context"], ["objectives", "Objectives"]];
    for (const [key, label] of required) if (!String(domain.identity[key]).trim()) output.push({ kind: "missing-field", record_ref: domain.engagement_id, title: `Complete ${label}`, detail: "Required accepted engagement identity metadata is empty.", priority: 10 });
    for (const candidate of domain.candidates) if (candidate.state === "candidate") output.push({ kind: "candidate", record_ref: candidate.candidate_id, title: "Review engagement candidate", detail: `Candidate from ${candidate.source_kind} awaits an explicit decision.`, priority: 20 });
    for (const blocker of domain.blockers) if (["critical", "high"].includes(blocker.severity) && ["open", "waiting"].includes(blocker.operational_state)) output.push({ kind: "blocker", record_ref: blocker.blocker_id, title: blocker.title, detail: `${blocker.severity} work-management blocker is ${blocker.operational_state}.`, priority: 30 });
    for (const milestone of domain.milestones) {
      if (milestone.operational_state === "blocked") output.push({ kind: "milestone", record_ref: milestone.milestone_id, title: milestone.title, detail: "Milestone is blocked.", priority: 40 });
      if (!["completed", "cancelled"].includes(milestone.operational_state) && milestone.target_date) {
        const target = Date.parse(`${milestone.target_date}T00:00:00Z`);
        if (Number.isFinite(target) && target < today) output.push({ kind: "milestone", record_ref: milestone.milestone_id, title: milestone.title, detail: `Milestone was due ${milestone.target_date}.`, priority: 50 });
      }
    }
    for (const question of domain.open_questions) if (question.status === "open") output.push({ kind: "question", record_ref: question.question_id, title: question.title, detail: "Open engagement question requires an answer or explicit deferral.", priority: 60 });
    for (const milestone of domain.milestones) {
      if (["completed", "cancelled"].includes(milestone.operational_state) || !milestone.target_date) continue;
      const target = Date.parse(`${milestone.target_date}T00:00:00Z`);
      const days = Math.ceil((target - today) / 86400000);
      if (Number.isFinite(target) && days >= 0 && days <= 14) output.push({ kind: "milestone", record_ref: milestone.milestone_id, title: milestone.title, detail: `Milestone is due ${milestone.target_date}.`, priority: 70 });
    }
    if (output.length === 0) output.push({ kind: "informational", record_ref: domain.engagement_id, title: "No factual next work identified", detail: "No missing identity fields, pending candidates, high blockers, blocked or overdue milestones, open questions, or near-term milestones were found.", priority: 99 });
    return output.sort((left, right) => left.priority - right.priority || left.record_ref.localeCompare(right.record_ref));
  }

  function deepFreeze<T>(value: T): T {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.freeze(value);
      for (const item of Object.values(value as Record<string, unknown>)) deepFreeze(item);
    }
    return value;
  }

  function recordIdentifier(record: object): string | undefined {
    for (const key of ["participant_id", "organization_id", "assumption_id", "decision_id", "question_id", "constraint_id", "milestone_id", "blocker_id"]) {
      const value = (record as Record<string, unknown>)[key];
      if (typeof value === "string") return value;
    }
    return undefined;
  }

  export async function serializeInnerProject(document: ProjectDocument): Promise<Uint8Array> {
    validateProjectDocument(document, true);
    const payloads = new Map<string, Uint8Array>();
    payloads.set("manifest.json", utf8(stableStringify(document.manifest)));
    payloads.set("domains/engagement.json", utf8(stableStringify(document.state.engagement)));
    payloads.set("domains/reviews-actions.json", utf8(stableStringify(document.state.reviews_actions)));
    payloads.set("history/events.ndjson", utf8(document.history.map(event => JSON.stringify(event)).join("\n") + "\n"));
    payloads.set("history/checkpoints.json", utf8(stableStringify(document.checkpoints)));
    payloads.set("compatibility/current-registry.json", utf8(stableStringify(window.__L2G_CONTRACT_REGISTRY__)));
    const integrityEntries: IntegrityRecord["entries"] = [];
    for (const [path, data] of [...payloads.entries()].sort(([left], [right]) => left.localeCompare(right))) integrityEntries.push({ path, sha256: await sha256Hex(data), size: data.length });
    payloads.set("integrity/sha256-manifest.json", utf8(stableStringify({ algorithm: "SHA-256", entries: integrityEntries } satisfies IntegrityRecord)));
    return createStoredZip([...payloads.entries()].map(([path, data]) => ({ path, data })));
  }

  export async function deserializeInnerProject(bytes: Uint8Array, allowLegacy = true): Promise<{ document: ProjectDocument; legacy: boolean }> {
    const entries = readStoredZip(bytes);
    const entryMap = new Map(entries.map(entry => [entry.path, entry.data] as const));
    const paths = [...entryMap.keys()].sort();
    if (paths.length !== INNER_PATHS.length || paths.some((path, index) => path !== INNER_PATHS[index])) throw new Error("Project contains missing or unsupported archive paths.");
    const integrity = parseEntry<IntegrityRecord>(entryMap, "integrity/sha256-manifest.json");
    if (integrity.algorithm !== "SHA-256" || !Array.isArray(integrity.entries)) throw new Error("Integrity manifest is invalid.");
    const expected = INNER_PATHS.filter(path => path !== "integrity/sha256-manifest.json");
    const covered = integrity.entries.map(entry => entry.path).sort();
    if (covered.length !== expected.length || covered.some((path, index) => path !== expected[index])) throw new Error("Integrity manifest does not cover the exact project payload set.");
    for (const record of integrity.entries) {
      const payload = entryMap.get(record.path);
      if (!payload || record.size !== payload.length || record.sha256 !== await sha256Hex(payload)) throw new Error(`Integrity validation failed: ${record.path}`);
    }
    const manifest = parseEntry<ProjectManifest>(entryMap, "manifest.json");
    const engagementValue = parseEntry<unknown>(entryMap, "domains/engagement.json");
    const reviews = parseEntry<ReviewsActionsRecord>(entryMap, "domains/reviews-actions.json");
    const checkpointsValue = parseEntry<Checkpoint[]>(entryMap, "history/checkpoints.json");
    const registry = parseEntry<ContractRegistry>(entryMap, "compatibility/current-registry.json");
    if (!isRecord(registry) || typeof registry.registry_version !== "string" || !Array.isArray(registry.contracts)) throw new Error("Compatibility registry snapshot is invalid.");
    const historyText = decodeUtf8(requireEntry(entryMap, "history/events.ndjson"));
    const history = historyText.split(/\r?\n/).filter(Boolean).map((line, index) => {
      try { return parseStrictJson(line) as HistoryEvent; }
      catch (error) { throw new Error(`History line ${index + 1} is invalid: ${errorMessage(error)}`); }
    });
    let migrated = false;
    let engagement: EngagementDomain;
    if (isRecord(engagementValue) && engagementValue.schema_kind === "l2g_engagement_v1") engagement = engagementValue as unknown as EngagementDomain;
    else {
      if (!allowLegacy) throw new Error("Legacy engagement domain is not accepted here.");
      engagement = migrateLegacyEngagement(engagementValue, manifest.updated_at);
      migrated = true;
    }
    const state: ProjectState = { engagement, reviews_actions: reviews, profile: "advisor", active_workspace: "overview", inspector_open: false, inspector_pinned: false, rail_collapsed: false };
    const document: ProjectDocument = { manifest, state, history, checkpoints: migrated ? [] : checkpointsValue };
    if (manifest.encryption_mode === "none-synthetic-foundation-only") {
      if (!allowLegacy) throw new Error("Unencrypted legacy project is not accepted here.");
      migrated = true;
    }
    if (migrated) {
      document.manifest.application = { name: "L2G Integrated Suite", version: window.__L2G_RELEASE__.version, product_runtime_compatibility_baseline: window.__L2G_RELEASE__.product_runtime_compatibility_baseline };
      document.manifest.encryption_mode = "aes-256-gcm-pbkdf2-sha256-v1";
      document.manifest.domain_index = deepClone(EXPECTED_DOMAINS);
      touchProject(document);
      document.checkpoints.push({ checkpoint_id: newId("checkpoint"), name: "Migration to v0.3 engagement spine", created_at: nowIso(), state: deepClone(document.state) });
      appendHistory(document, "engagement.migrated", "engagement", engagement.engagement_id, "Migrated legacy engagement metadata into l2g_engagement_v1; next save requires the v0.3 application identity.");
    }
    validateProjectDocument(document, true);
    return { document, legacy: migrated };
  }

  function migrateLegacyEngagement(value: unknown, sourceTimestamp: string): EngagementDomain {
    if (!isRecord(value) || value.schema_version !== "engagement_v1" || typeof value.engagement_id !== "string") throw new Error("Legacy engagement record is invalid.");
    const timestamp = isIso(sourceTimestamp) ? sourceTimestamp : nowIso();
    const engagementId = value.engagement_id;
    const organizationId = `organization_migrated_${stableIdPart(engagementId)}`;
    const participants: ParticipantRecord[] = [];
    if (Array.isArray(value.participants)) {
      for (const [index, raw] of value.participants.entries()) {
        if (!isRecord(raw)) throw new Error("Legacy participant is invalid.");
        participants.push({
          participant_id: typeof raw.id === "string" && safeId(raw.id, "participant") ? raw.id : `participant_migrated_${stableIdPart(engagementId)}_${index + 1}`,
          display_name: sanitizePlainText(raw.name, 200), role: sanitizePlainText(raw.role, 200), organization_ref: organizationId,
          contact_reference: "", participation_state: "active", visibility: raw.visibility === "client-safe" ? "client-safe" : "advisor-only",
          provenance: { source_kind: "legacy-engagement-v1", source_id: engagementId, asserted_at: timestamp, asserted_by: "migration", confidence: "not-evaluated" }, created_at: timestamp, updated_at: timestamp
        });
      }
    }
    return {
      schema_kind: "l2g_engagement_v1", schema_version: "1.0", engagement_id: engagementId,
      identity: {
        engagement_name: sanitizePlainText(value.engagement_name, 200), client_name: sanitizePlainText(value.client_name, 200), system_name: sanitizePlainText(value.system_name, 200),
        delivery_context: "Migrated from the legacy Integrated Suite engagement foundation.", objectives: sanitizePlainText(value.objectives, 8000), target_level: "Not specified",
        phase: legacyPhase(value.phase), start_date: "", target_end_date: "", information_label: "Synthetic", lifecycle: "accepted", visibility: "advisor-only", updated_at: timestamp
      },
      participants,
      organizations: [{ organization_id: organizationId, name: sanitizePlainText(value.client_name, 200) || "Migrated client organization", relationship: "client", status: "active", visibility: "advisor-only", provenance: { source_kind: "legacy-engagement-v1", source_id: engagementId, asserted_at: timestamp, asserted_by: "migration", confidence: "not-evaluated" }, created_at: timestamp, updated_at: timestamp }],
      assumptions: [], decisions: [], open_questions: [], constraints: [], milestones: [], blockers: [], candidates: [],
      projection_policy: { client_visible_values: ["client-safe", "approved-for-client-presentation"], reviewer_include_provenance: true, client_include_candidates: false }
    };
  }

  function legacyPhase(value: unknown): EngagementPhase {
    const text = String(value ?? "").toLowerCase();
    if (text.includes("scope")) return "scoping";
    if (text.includes("practice") || text.includes("workshop")) return "practice-review";
    if (text.includes("ssp")) return "ssp-development";
    if (text.includes("deliver")) return "delivery";
    if (text.includes("review")) return "review";
    if (text.includes("discover")) return "discovery";
    return "planning";
  }

  function stableIdPart(value: string): string { return value.replace(/[^A-Za-z0-9_-]/g, "_").slice(-48) || "legacy"; }
  function parseEntry<T>(entries: Map<string, Uint8Array>, path: string): T { return parseStrictJson(decodeUtf8(requireEntry(entries, path))) as T; }
  function requireEntry(entries: Map<string, Uint8Array>, path: string): Uint8Array { const value = entries.get(path); if (!value) throw new Error(`Missing project entry: ${path}`); return value; }

  export function validateProjectDocument(document: ProjectDocument, requireEncrypted: boolean): void {
    if (!isRecord(document) || !isRecord(document.manifest) || !isRecord(document.state)) throw new Error("Project document is invalid.");
    const manifest = document.manifest;
    if (manifest.kind !== "l2g_project_v1" || manifest.schema_version !== "1.0" || manifest.evidence_policy !== "reference-only") throw new Error("Unsupported project kind or policy.");
    if (requireEncrypted && manifest.encryption_mode !== "aes-256-gcm-pbkdf2-sha256-v1") throw new Error("Project is not marked for encrypted persistence.");
    if (!["aes-256-gcm-pbkdf2-sha256-v1", "none-synthetic-foundation-only"].includes(manifest.encryption_mode)) throw new Error("Unsupported project encryption mode.");
    if (!safeId(manifest.project_id, "project") || !isIso(manifest.created_at) || !isIso(manifest.updated_at)) throw new Error("Project identity or timestamps are invalid.");
    if (!isRecord(manifest.application) || !["L2G Integrated Suite", "L2G Integrated Suite Foundation"].includes(manifest.application.name) || typeof manifest.application.version !== "string" || !/^[0-9a-f]{40}$/.test(manifest.application.product_runtime_compatibility_baseline)) throw new Error("Project application identity is invalid.");
    if (stableStringify(manifest.domain_index, 0) !== stableStringify(EXPECTED_DOMAINS, 0)) throw new Error("Project domain index is unsupported.");
    validateState(document.state);
    if (!Array.isArray(document.history) || document.history.length < 1 || document.history.length > 5000) throw new Error("Project history is invalid.");
    const eventIds = new Set<string>();
    for (const event of document.history) { validateHistory(event); if (eventIds.has(event.event_id)) throw new Error("Duplicate history event."); eventIds.add(event.event_id); }
    if (!Array.isArray(document.checkpoints) || document.checkpoints.length > 20) throw new Error("Checkpoint collection is invalid.");
    const checkpointIds = new Set<string>();
    for (const checkpoint of document.checkpoints) {
      if (!safeId(checkpoint.checkpoint_id, "checkpoint") || checkpointIds.has(checkpoint.checkpoint_id) || typeof checkpoint.name !== "string" || checkpoint.name.length > 120 || !isIso(checkpoint.created_at)) throw new Error("Checkpoint is invalid.");
      checkpointIds.add(checkpoint.checkpoint_id);
      validateState(checkpoint.state);
    }
  }

  function validateState(state: ProjectState): void {
    validateEngagement(state.engagement);
    validateReviews(state.reviews_actions);
    if (!["advisor", "client", "reviewer"].includes(state.profile) || !WORKSPACES.includes(state.active_workspace) || typeof state.inspector_open !== "boolean" || typeof state.inspector_pinned !== "boolean" || typeof state.rail_collapsed !== "boolean") throw new Error("Shell state is invalid.");
  }

  export function validateEngagement(domain: EngagementDomain): void {
    assertExactKeys(domain, ["schema_kind","schema_version","engagement_id","identity","participants","organizations","assumptions","decisions","open_questions","constraints","milestones","blockers","candidates","projection_policy"], "Engagement domain");
    if (domain.schema_kind !== "l2g_engagement_v1" || domain.schema_version !== "1.0" || !safeId(domain.engagement_id, "engagement")) throw new Error("Engagement identity is invalid.");
    assertExactKeys(domain.identity, ["engagement_name","client_name","system_name","delivery_context","objectives","target_level","phase","start_date","target_end_date","information_label","lifecycle","visibility","updated_at"], "Engagement identity");
    for (const [value, limit] of [[domain.identity.engagement_name,200],[domain.identity.client_name,200],[domain.identity.system_name,200],[domain.identity.delivery_context,8000],[domain.identity.objectives,8000]] as Array<[string,number]>) if (typeof value !== "string" || value.length > limit) throw new Error("Engagement identity content is invalid.");
    if (!["CMMC Level 2","CMMC Level 1","Other","Not specified"].includes(domain.identity.target_level) || !PHASES.includes(domain.identity.phase) || !["Synthetic","Public","Internal","FCI","CUI","Unknown"].includes(domain.identity.information_label) || domain.identity.lifecycle !== "accepted" || !VISIBILITIES.includes(domain.identity.visibility) || !isIso(domain.identity.updated_at) || !isDateOrEmpty(domain.identity.start_date) || !isDateOrEmpty(domain.identity.target_end_date)) throw new Error("Engagement identity state is invalid.");
    const ids = new Set<string>([domain.engagement_id]);
    validateCollection(domain.organizations, 100, record => validateOrganization(record, ids));
    validateCollection(domain.participants, 200, record => validateParticipant(record, ids));
    validateCollection(domain.assumptions, 250, record => validateRelated(record, "assumption_id", "assumption", ["open","confirmed","rejected","superseded"], ids));
    validateCollection(domain.decisions, 250, record => { validateRelated(record, "decision_id", "decision", ["proposed","accepted","revised","superseded"], ids); if (["accepted","revised"].includes(record.status) && !record.rationale.trim()) throw new Error("Accepted or revised decision requires rationale."); });
    validateCollection(domain.open_questions, 250, record => validateRelated(record, "question_id", "question", ["open","answered","deferred","closed"], ids));
    validateCollection(domain.constraints, 250, record => validateRelated(record, "constraint_id", "constraint", ["active","resolved","superseded","archived"], ids));
    validateCollection(domain.milestones, 250, record => { validateRelated(record, "milestone_id", "milestone", ["planned","in-progress","waiting","blocked","completed","cancelled"], ids, "operational_state"); if (!isDateOrEmpty(record.target_date) || record.owner_label.length > 200 || record.workstream.length > 200) throw new Error("Milestone metadata is invalid."); });
    validateCollection(domain.blockers, 250, record => { validateRelated(record, "blocker_id", "blocker", ["open","waiting","resolved","cancelled"], ids, "operational_state"); if (!["low","medium","high","critical"].includes(record.severity) || record.owner_label.length > 200) throw new Error("Blocker metadata is invalid."); });
    validateCollection(domain.candidates, 250, record => validateCandidate(record, ids));
    for (const participant of domain.participants) if (!ids.has(participant.organization_ref) && !participant.organization_ref.startsWith("external_")) throw new Error("Participant has a dangling organization reference.");
    for (const collection of [domain.assumptions, domain.decisions, domain.open_questions, domain.constraints, domain.milestones, domain.blockers]) for (const record of collection) for (const reference of record.related_refs) if (!ids.has(reference) && !reference.startsWith("external_")) throw new Error(`Dangling related reference: ${reference}`);
    if (stableStringify(domain.projection_policy, 0) !== stableStringify({ client_visible_values: ["client-safe", "approved-for-client-presentation"], reviewer_include_provenance: true, client_include_candidates: false }, 0)) throw new Error("Projection policy is unsupported.");
    if (utf8(stableStringify(domain, 0)).length > ARCHIVE_LIMITS.maxEntryBytes) throw new Error("Engagement domain exceeds the archive entry limit.");
  }

  function validateCollection<T>(value: T[], limit: number, validator: (record: T) => void): void { if (!Array.isArray(value) || value.length > limit) throw new Error("Engagement collection is invalid."); for (const record of value) validator(record); }
  function addId(ids: Set<string>, value: string, prefix: string): void { if (!safeId(value, prefix) || ids.has(value)) throw new Error(`Duplicate or invalid ${prefix} identifier.`); ids.add(value); }
  function validateOrganization(record: OrganizationRecord, ids: Set<string>): void { addId(ids, record.organization_id, "organization"); if (record.name.length > 200 || !["client","advisor","MSP","CSP","provider","assessor","other"].includes(record.relationship) || !["active","inactive","superseded"].includes(record.status)) throw new Error("Organization is invalid."); validateCommon(record.visibility, record.provenance, record.created_at, record.updated_at); }
  function validateParticipant(record: ParticipantRecord, ids: Set<string>): void { addId(ids, record.participant_id, "participant"); if (record.display_name.length > 200 || record.role.length > 200 || record.contact_reference.length > 500 || !["active","inactive","superseded"].includes(record.participation_state)) throw new Error("Participant is invalid."); validateCommon(record.visibility, record.provenance, record.created_at, record.updated_at); }
  function validateRelated<T extends RelatedRecordBase>(record: T, idKey: string, prefix: string, statuses: string[], ids: Set<string>, statusKey = "status"): void {
    const raw = record as unknown as Record<string, unknown>; const identifier = raw[idKey]; const status = raw[statusKey];
    if (typeof identifier !== "string") throw new Error("Related record identifier is invalid."); addId(ids, identifier, prefix);
    if (record.title.length > 200 || record.detail.length > 8000 || !Array.isArray(record.related_refs) || record.related_refs.length > 50 || new Set(record.related_refs).size !== record.related_refs.length || typeof status !== "string" || !statuses.includes(status)) throw new Error(`${prefix} record is invalid.`);
    validateCommon(record.visibility, record.provenance, record.created_at, record.updated_at);
  }
  function validateCandidate(record: CandidateRecord, ids: Set<string>): void {
    addId(ids, record.candidate_id, "candidate");
    if (!record.source_kind || record.source_kind.length > 200 || !record.source_ref || record.source_ref.length > 500 || !["identity","participant","organization","assumption","decision","open-question","constraint","milestone","blocker"].includes(record.target_type) || !["candidate","accepted","modified","rejected","superseded"].includes(record.state) || record.rationale.length > 8000 || !VISIBILITIES.includes(record.visibility)) throw new Error("Candidate is invalid.");
    if (!isRecord(record.proposed_fields) || Object.keys(record.proposed_fields).length > 50) throw new Error("Candidate proposed fields are invalid.");
    if (record.decided_at !== undefined && !isIso(record.decided_at)) throw new Error("Candidate decision timestamp is invalid.");
    if (record.decided_by !== undefined && !["advisor","client","reviewer"].includes(record.decided_by)) throw new Error("Candidate decision profile is invalid.");
    validateProvenance(record.provenance);
  }
  function validateCommon(visibility: Visibility, provenance: Provenance, createdAt: string, updatedAt: string): void { if (!VISIBILITIES.includes(visibility) || !isIso(createdAt) || !isIso(updatedAt)) throw new Error("Record metadata is invalid."); validateProvenance(provenance); }
  function validateProvenance(value: Provenance): void { if (!isRecord(value) || !value.source_kind || value.source_kind.length > 200 || !value.source_id || value.source_id.length > 200 || !isIso(value.asserted_at) || !["advisor","client","reviewer","migration","system"].includes(value.asserted_by) || !["not-evaluated","low","medium","high"].includes(value.confidence)) throw new Error("Provenance is invalid."); }
  function validateReviews(record: ReviewsActionsRecord): void { if (!isRecord(record) || record.schema_version !== "reviews_actions_v1" || !Array.isArray(record.examples) || record.examples.length > 50) throw new Error("Reviews are invalid."); }
  function validateHistory(event: HistoryEvent): void { if (!isRecord(event) || !safeId(event.event_id, "event") || !safeId(event.transaction_id, "txn") || !isIso(event.timestamp) || !["advisor","client","reviewer"].includes(event.profile) || typeof event.action !== "string" || event.action.length > 120 || typeof event.object_type !== "string" || event.object_type.length > 120 || typeof event.object_id !== "string" || event.object_id.length > 160 || typeof event.summary !== "string" || event.summary.length > 500) throw new Error("History event is invalid."); if (event.reverses_event_id !== undefined && !safeId(event.reverses_event_id, "event")) throw new Error("History reversal is invalid."); }
  function assertExactKeys(value: object, expected: string[], label: string): void { const actual = Object.keys(value).sort(); const wanted = [...expected].sort(); if (actual.length !== wanted.length || actual.some((key, index) => key !== wanted[index])) throw new Error(`${label} contains unknown or missing fields.`); }
  function safeId(value: unknown, prefix: string): value is string { return typeof value === "string" && value.startsWith(`${prefix}_`) && value.length <= 128 && /^[A-Za-z0-9_-]+$/.test(value); }
  function isIso(value: unknown): value is string { return typeof value === "string" && Number.isFinite(Date.parse(value)); }
  function isDateOrEmpty(value: unknown): value is string { return typeof value === "string" && (value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value)); }
}
