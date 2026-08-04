namespace L2G {
  const V04_PATHS = [
    "compatibility/current-registry.json",
    "domains/engagement.json",
    "domains/evidence-index.json",
    "domains/reviews-actions.json",
    "history/checkpoints.json",
    "history/events.ndjson",
    "integrity/sha256-manifest.json",
    "manifest.json"
  ];
  const LEGACY_PATHS = V04_PATHS.filter(path => path !== "domains/evidence-index.json");
  const EXPECTED_DOMAINS = [
    { path: "domains/engagement.json", schema: "l2g_engagement_v1", authority: "Engagement" },
    { path: "domains/evidence-index.json", schema: "l2g_evidence_index_v1", authority: "Evidence" },
    { path: "domains/reviews-actions.json", schema: "reviews_actions_v1", authority: "Reviews & Actions" }
  ];
  const WORKSPACES: WorkspaceId[] = ["overview", "pre-engagement", "evidence", "scope", "practice-review", "ssp", "deliverables", "reviews-actions"];

  export function createNewProject(): ProjectDocument {
    const timestamp = nowIso(); const projectId = newId("project");
    const document: ProjectDocument = {
      manifest: {
        kind: "l2g_project_v1", schema_version: "1.0", project_id: projectId, created_at: timestamp, updated_at: timestamp,
        application: { name: "L2G Integrated Suite", version: window.__L2G_RELEASE__.version, product_runtime_compatibility_baseline: window.__L2G_RELEASE__.product_runtime_compatibility_baseline },
        evidence_policy: "reference-only", encryption_mode: "aes-256-gcm-pbkdf2-sha256-v1", domain_index: deepClone(EXPECTED_DOMAINS)
      },
      state: {
        engagement: createSyntheticEngagement(timestamp), evidence: createSyntheticEvidence(timestamp),
        reviews_actions: { schema_version: "reviews_actions_v1", examples: [
          { id: newId("review"), title: "Review Evidence candidate mapping", source_domain: "Evidence", target_domain: "Reviews & Actions", lifecycle: "Proposed", review_state: "Assigned", operational_state: "Open", visibility: "Advisor-only", rationale: "Evidence-origin proposals require target-owned candidate decisions." }
        ] },
        profile: "advisor", active_workspace: "overview", inspector_open: false, inspector_pinned: false, rail_collapsed: false
      },
      history: [{ event_id: newId("event"), timestamp, profile: "advisor", action: "project.created", object_type: "project", object_id: projectId, summary: "Created a synthetic v0.4 Evidence Catalog Core project.", transaction_id: newId("txn") }],
      checkpoints: []
    };
    validateProjectDocument(document, true); return document;
  }

  export function touchProject(document: ProjectDocument): void { document.manifest.updated_at = nowIso(); }
  export function appendHistory(document: ProjectDocument, action: string, objectType: string, objectId: string, summary: string, reverses?: string): HistoryEvent {
    const event: HistoryEvent = { event_id: newId("event"), timestamp: nowIso(), profile: document.state.profile, action, object_type: objectType, object_id: objectId, summary: sanitizePlainText(summary, 500), transaction_id: newId("txn") };
    if (reverses) event.reverses_event_id = reverses; document.history.push(event); return event;
  }
  export function addCheckpoint(document: ProjectDocument, name: string): Checkpoint {
    const checkpoint: Checkpoint = { checkpoint_id: newId("checkpoint"), name: sanitizePlainText(name, 120), created_at: nowIso(), state: deepClone(document.state) };
    document.checkpoints.push(checkpoint); if (document.checkpoints.length > 20) document.checkpoints.shift(); return checkpoint;
  }

  export async function serializeInnerProject(document: ProjectDocument): Promise<Uint8Array> {
    validateProjectDocument(document, true);
    const payloads = new Map<string, Uint8Array>();
    payloads.set("manifest.json", utf8(stableStringify(document.manifest)));
    payloads.set("domains/engagement.json", utf8(stableStringify(document.state.engagement)));
    payloads.set("domains/evidence-index.json", utf8(stableStringify(document.state.evidence)));
    payloads.set("domains/reviews-actions.json", utf8(stableStringify(document.state.reviews_actions)));
    payloads.set("history/events.ndjson", utf8(`${document.history.map(event => JSON.stringify(event)).join("\n")}\n`));
    payloads.set("history/checkpoints.json", utf8(stableStringify(document.checkpoints)));
    payloads.set("compatibility/current-registry.json", utf8(stableStringify(window.__L2G_CONTRACT_REGISTRY__)));
    const integrityEntries: IntegrityRecord["entries"] = [];
    for (const [path, data] of [...payloads.entries()].sort(([left],[right]) => left.localeCompare(right))) {
      if (data.length > ARCHIVE_LIMITS.maxEntryBytes) throw new Error(`${path} exceeds the inherited archive entry limit.`);
      integrityEntries.push({ path, sha256: await sha256Hex(data), size: data.length });
    }
    payloads.set("integrity/sha256-manifest.json", utf8(stableStringify({ algorithm: "SHA-256", entries: integrityEntries } satisfies IntegrityRecord)));
    const result = createStoredZip([...payloads.entries()].map(([path,data]) => ({ path, data })));
    if (result.length > ARCHIVE_LIMITS.maxExpandedBytes) throw new Error("Project exceeds the inherited expanded-project limit.");
    return result;
  }

  export async function deserializeInnerProject(bytes: Uint8Array, allowLegacy = true): Promise<{ document: ProjectDocument; legacy: boolean }> {
    const entries = readStoredZip(bytes); const entryMap = new Map(entries.map(entry => [entry.path, entry.data] as const)); const paths = [...entryMap.keys()].sort();
    const isCurrentShape = samePaths(paths, V04_PATHS); const isLegacyShape = samePaths(paths, LEGACY_PATHS);
    if (!isCurrentShape && !isLegacyShape) throw new Error("Project contains missing or unsupported archive paths.");
    if (isLegacyShape && !allowLegacy) throw new Error("Legacy project shape is not accepted here.");
    await validateIntegrity(entryMap, isCurrentShape ? V04_PATHS : LEGACY_PATHS);
    const manifest = parseEntry<ProjectManifest>(entryMap, "manifest.json");
    const engagementRaw = parseEntry<unknown>(entryMap, "domains/engagement.json");
    const evidenceRaw = isCurrentShape ? parseEntry<unknown>(entryMap, "domains/evidence-index.json") : null;
    const reviews = parseEntry<ReviewsActionsRecord>(entryMap, "domains/reviews-actions.json");
    const checkpointRaw = parseEntry<unknown[]>(entryMap, "history/checkpoints.json");
    const registry = parseEntry<ContractRegistry>(entryMap, "compatibility/current-registry.json");
    if (!isRecord(registry) || typeof registry.registry_version !== "string" || !Array.isArray(registry.contracts)) throw new Error("Compatibility registry snapshot is invalid.");
    const historyText = decodeUtf8(requireEntry(entryMap, "history/events.ndjson"));
    const history = historyText.split(/\r?\n/).filter(Boolean).map((line,index) => { try { return parseStrictJson(line) as HistoryEvent; } catch (error) { throw new Error(`History line ${index + 1} is invalid: ${errorMessage(error)}`); } });
    let legacy = !isCurrentShape; let engagement: EngagementDomain;
    if (isRecord(engagementRaw) && engagementRaw.schema_kind === "l2g_engagement_v1") engagement = engagementRaw as unknown as EngagementDomain;
    else { if (!allowLegacy) throw new Error("Legacy Engagement domain is not accepted here."); engagement = migrateLegacyEngagement(engagementRaw, manifest.updated_at); legacy = true; }
    let evidence: EvidenceDomain;
    if (isRecord(evidenceRaw) && evidenceRaw.schema_kind === "l2g_evidence_index_v1") evidence = evidenceRaw as unknown as EvidenceDomain;
    else { evidence = emptyEvidenceDomain(); legacy = true; }
    const state: ProjectState = { engagement, evidence, reviews_actions: reviews, profile: "advisor", active_workspace: "overview", inspector_open: false, inspector_pinned: false, rail_collapsed: false };
    const checkpoints = checkpointRaw.map((raw,index) => migrateCheckpoint(raw, evidence, manifest.updated_at, index)).filter((item): item is Checkpoint => item !== null).slice(-19);
    const document: ProjectDocument = { manifest, state, history, checkpoints };
    if (manifest.encryption_mode === "none-synthetic-foundation-only") { if (!allowLegacy) throw new Error("Unencrypted legacy project is not accepted here."); legacy = true; }
    if (legacy || manifest.application.version !== window.__L2G_RELEASE__.version || stableStringify(manifest.domain_index,0) !== stableStringify(EXPECTED_DOMAINS,0)) {
      document.manifest.application = { name: "L2G Integrated Suite", version: window.__L2G_RELEASE__.version, product_runtime_compatibility_baseline: window.__L2G_RELEASE__.product_runtime_compatibility_baseline };
      document.manifest.encryption_mode = "aes-256-gcm-pbkdf2-sha256-v1"; document.manifest.domain_index = deepClone(EXPECTED_DOMAINS); touchProject(document);
      addCheckpoint(document, "Migration to v0.4 Evidence Catalog Core");
      appendHistory(document, "evidence.migrated-v03", "evidence", evidence.catalog_id, "Migrated a valid earlier project into v0.4 with an empty Evidence domain where required; no source, fingerprint, relationship, candidate, trust state, or conclusion was inferred.");
      legacy = true;
    }
    validateProjectDocument(document, true); return { document, legacy };
  }

  async function validateIntegrity(entries: Map<string,Uint8Array>, paths: string[]): Promise<void> {
    const integrity = parseEntry<IntegrityRecord>(entries, "integrity/sha256-manifest.json");
    if (!isRecord(integrity) || integrity.algorithm !== "SHA-256" || !Array.isArray(integrity.entries)) throw new Error("Integrity manifest is invalid.");
    const expected = paths.filter(path => path !== "integrity/sha256-manifest.json"); const covered = integrity.entries.map(entry => entry.path).sort();
    if (!samePaths(covered, expected)) throw new Error("Integrity manifest does not cover the exact project payload set.");
    for (const record of integrity.entries) { if (!isRecord(record) || typeof record.path !== "string" || typeof record.sha256 !== "string" || typeof record.size !== "number") throw new Error("Integrity record is invalid."); const payload = entries.get(record.path); if (!payload || record.size !== payload.length || record.sha256 !== await sha256Hex(payload)) throw new Error(`Integrity validation failed: ${record.path}`); }
  }
  function samePaths(actual: string[], expected: string[]): boolean { const wanted = [...expected].sort(); return actual.length === wanted.length && actual.every((value,index) => value === wanted[index]); }
  function parseEntry<T>(entries: Map<string,Uint8Array>, path: string): T { return parseStrictJson(decodeUtf8(requireEntry(entries,path))) as T; }
  function requireEntry(entries: Map<string,Uint8Array>, path: string): Uint8Array { const value = entries.get(path); if (!value) throw new Error(`Missing project entry: ${path}`); return value; }

  function migrateCheckpoint(raw: unknown, emptyEvidence: EvidenceDomain, fallback: string, index: number): Checkpoint | null {
    if (!isRecord(raw) || typeof raw.checkpoint_id !== "string" || typeof raw.name !== "string" || typeof raw.created_at !== "string" || !isRecord(raw.state)) return null;
    const stateRaw = raw.state; const engagementRaw = stateRaw.engagement;
    let engagement: EngagementDomain;
    try { engagement = isRecord(engagementRaw) && engagementRaw.schema_kind === "l2g_engagement_v1" ? engagementRaw as unknown as EngagementDomain : migrateLegacyEngagement(engagementRaw, raw.created_at || fallback); }
    catch { return null; }
    const evidenceRaw = stateRaw.evidence; const evidence = isRecord(evidenceRaw) && evidenceRaw.schema_kind === "l2g_evidence_index_v1" ? evidenceRaw as unknown as EvidenceDomain : deepClone(emptyEvidence);
    const reviews: ReviewsActionsRecord = isRecord(stateRaw.reviews_actions) ? stateRaw.reviews_actions as unknown as ReviewsActionsRecord : { schema_version: "reviews_actions_v1", examples: [] };
    return { checkpoint_id: safeTypedId(raw.checkpoint_id,"checkpoint") ? raw.checkpoint_id : `checkpoint_migrated_${index + 1}`, name: sanitizePlainText(raw.name,120), created_at: isIsoDateTime(raw.created_at) ? raw.created_at : fallback, state: { engagement, evidence, reviews_actions: reviews, profile: "advisor", active_workspace: "overview", inspector_open: false, inspector_pinned: false, rail_collapsed: false } };
  }

  function migrateLegacyEngagement(value: unknown, sourceTimestamp: string): EngagementDomain {
    if (!isRecord(value) || value.schema_version !== "engagement_v1" || typeof value.engagement_id !== "string") throw new Error("Legacy engagement record is invalid.");
    const timestamp = isIsoDateTime(sourceTimestamp) ? sourceTimestamp : nowIso(); const engagementId = value.engagement_id; const organizationId = `organization_migrated_${stableIdPart(engagementId)}`;
    const participants: ParticipantRecord[] = [];
    if (Array.isArray(value.participants)) for (const [index,raw] of value.participants.entries()) { if (!isRecord(raw)) throw new Error("Legacy participant is invalid."); participants.push({ participant_id: typeof raw.id === "string" && safeTypedId(raw.id,"participant") ? raw.id : `participant_migrated_${stableIdPart(engagementId)}_${index + 1}`, display_name: sanitizePlainText(raw.name,200), role: sanitizePlainText(raw.role,200), organization_ref: organizationId, contact_reference: "", participation_state: "active", visibility: raw.visibility === "client-safe" ? "client-safe" : "advisor-only", provenance: { source_kind: "legacy-engagement-v1", source_id: engagementId, source_location_ref: null, asserted_at: timestamp, asserted_by: "migration", confidence: "not-evaluated" }, created_at: timestamp, updated_at: timestamp }); }
    return {
      schema_kind: "l2g_engagement_v1", schema_version: "1.0", engagement_id: engagementId,
      identity: { engagement_name: sanitizePlainText(value.engagement_name,200), client_name: sanitizePlainText(value.client_name,200), system_name: sanitizePlainText(value.system_name,200), delivery_context: "Migrated from the legacy Integrated Suite engagement foundation.", objectives: sanitizePlainText(value.objectives,8000), target_level: "Not specified", phase: legacyPhase(value.phase), start_date: "", target_end_date: "", information_label: "Synthetic", lifecycle: "accepted", visibility: "advisor-only", updated_at: timestamp },
      participants, organizations: [{ organization_id: organizationId, name: sanitizePlainText(value.client_name,200) || "Migrated client organization", relationship: "client", status: "active", visibility: "advisor-only", provenance: { source_kind: "legacy-engagement-v1", source_id: engagementId, source_location_ref: null, asserted_at: timestamp, asserted_by: "migration", confidence: "not-evaluated" }, created_at: timestamp, updated_at: timestamp }],
      assumptions: [], decisions: [], open_questions: [], constraints: [], milestones: [], blockers: [], candidates: [], projection_policy: { client_visible_values: ["client-safe","approved-for-client-presentation"], reviewer_include_provenance: true, client_include_candidates: false }
    };
  }
  function legacyPhase(value: unknown): EngagementPhase { const text = String(value ?? "").toLowerCase(); if (text.includes("scope")) return "scoping"; if (text.includes("practice") || text.includes("workshop")) return "practice-review"; if (text.includes("ssp")) return "ssp-development"; if (text.includes("deliver")) return "delivery"; if (text.includes("review")) return "review"; if (text.includes("discover")) return "discovery"; return "planning"; }
  function stableIdPart(value: string): string { return value.replace(/[^A-Za-z0-9_-]/g,"_").slice(-48) || "legacy"; }

  export function validateProjectDocument(document: ProjectDocument, requireEncrypted: boolean): void {
    if (!isRecord(document) || !isRecord(document.manifest) || !isRecord(document.state)) throw new Error("Project document is invalid.");
    assertExactObjectKeys(document, ["manifest","state","history","checkpoints"], "Project document");
    const manifest = document.manifest; assertExactObjectKeys(manifest, ["kind","schema_version","project_id","created_at","updated_at","application","evidence_policy","encryption_mode","domain_index"], "Project manifest");
    if (manifest.kind !== "l2g_project_v1" || manifest.schema_version !== "1.0" || manifest.evidence_policy !== "reference-only") throw new Error("Unsupported project kind or policy.");
    if (requireEncrypted && manifest.encryption_mode !== "aes-256-gcm-pbkdf2-sha256-v1") throw new Error("Project is not marked for encrypted persistence.");
    if (!["aes-256-gcm-pbkdf2-sha256-v1","none-synthetic-foundation-only"].includes(manifest.encryption_mode) || !safeTypedId(manifest.project_id,"project") || !isIsoDateTime(manifest.created_at) || !isIsoDateTime(manifest.updated_at)) throw new Error("Project identity, timestamps, or encryption mode is invalid.");
    if (!isRecord(manifest.application) || !["L2G Integrated Suite","L2G Integrated Suite Foundation"].includes(manifest.application.name) || typeof manifest.application.version !== "string" || !/^[0-9a-f]{40}$/.test(manifest.application.product_runtime_compatibility_baseline)) throw new Error("Project application identity is invalid.");
    if (stableStringify(manifest.domain_index,0) !== stableStringify(EXPECTED_DOMAINS,0)) throw new Error("Project domain index is unsupported.");
    validateProjectState(document.state);
    if (!Array.isArray(document.history) || document.history.length < 1 || document.history.length > 5000) throw new Error("Project history is invalid."); const eventIds = new Set<string>();
    for (const event of document.history) { validateHistoryEvent(event); if (eventIds.has(event.event_id)) throw new Error("Duplicate history event."); eventIds.add(event.event_id); }
    if (!Array.isArray(document.checkpoints) || document.checkpoints.length > 20) throw new Error("Checkpoint collection is invalid."); const checkpointIds = new Set<string>();
    for (const checkpoint of document.checkpoints) { assertExactObjectKeys(checkpoint,["checkpoint_id","name","created_at","state"],"Checkpoint"); if (!safeTypedId(checkpoint.checkpoint_id,"checkpoint") || checkpointIds.has(checkpoint.checkpoint_id) || typeof checkpoint.name !== "string" || !checkpoint.name || checkpoint.name.length > 120 || !isIsoDateTime(checkpoint.created_at)) throw new Error("Checkpoint is invalid."); checkpointIds.add(checkpoint.checkpoint_id); validateProjectState(checkpoint.state); }
  }

  function validateProjectState(state: ProjectState): void {
    assertExactObjectKeys(state,["engagement","evidence","reviews_actions","profile","active_workspace","inspector_open","inspector_pinned","rail_collapsed"],"Project state");
    const ids = new Set<string>(); validateEngagement(state.engagement,ids); validateEvidence(state.evidence,ids); validateReviewsActions(state.reviews_actions,ids);
    if (!["advisor","client","reviewer"].includes(state.profile) || !WORKSPACES.includes(state.active_workspace) || typeof state.inspector_open !== "boolean" || typeof state.inspector_pinned !== "boolean" || typeof state.rail_collapsed !== "boolean") throw new Error("Shell state is invalid.");
  }
  function validateReviewsActions(record: ReviewsActionsRecord, ids: Set<string>): void {
    assertExactObjectKeys(record,["schema_version","examples"],"Reviews & Actions domain"); if (record.schema_version !== "reviews_actions_v1" || !Array.isArray(record.examples) || record.examples.length > 100) throw new Error("Reviews & Actions domain is invalid.");
    for (const item of record.examples) { assertExactObjectKeys(item,["id","title","source_domain","target_domain","lifecycle","review_state","operational_state","visibility","rationale"],"Review item"); addUniqueId(ids,item.id,"review"); assertText(item.title,240,"Review title",true); assertText(item.source_domain,120,"Review source domain",true); assertText(item.target_domain,120,"Review target domain",true); assertText(item.rationale,2000,"Review rationale"); if (!["Draft","Proposed","Confirmed","Approved","Superseded"].includes(item.lifecycle) || !["Not requested","Assigned","In review","Changes requested","Approved","Closed"].includes(item.review_state) || !["Open","Waiting","Blocked","Done","Cancelled"].includes(item.operational_state) || !["Advisor-only","Client-safe","Approved for client presentation"].includes(item.visibility)) throw new Error("Review item state is invalid."); }
  }
  function validateHistoryEvent(event: HistoryEvent): void { if (!isRecord(event)) throw new Error("History event is invalid."); const keys = ["event_id","timestamp","profile","action","object_type","object_id","summary","transaction_id",...(event.reverses_event_id !== undefined ? ["reverses_event_id"] : [])]; assertExactObjectKeys(event,keys,"History event"); if (!safeTypedId(event.event_id,"event") || !safeTypedId(event.transaction_id,"txn") || !isIsoDateTime(event.timestamp) || !["advisor","client","reviewer"].includes(event.profile) || typeof event.action !== "string" || event.action.length > 120 || typeof event.object_type !== "string" || event.object_type.length > 120 || typeof event.object_id !== "string" || event.object_id.length > 160 || typeof event.summary !== "string" || event.summary.length > 500 || (event.reverses_event_id !== undefined && !safeTypedId(event.reverses_event_id,"event"))) throw new Error("History event is invalid."); }

  export class ProjectStore {
    private documentValue: ProjectDocument; private undoStack: ProjectDocument[] = []; private redoStack: ProjectDocument[] = []; private listeners = new Set<() => void>();
    migrationNotice = "";
    constructor(initial = createNewProject()) { this.documentValue = initial; }
    get document(): ProjectDocument { return this.documentValue; }
    get canUndo(): boolean { return this.undoStack.length > 0; }
    get canRedo(): boolean { return this.redoStack.length > 0; }
    subscribe(listener: () => void): () => void { this.listeners.add(listener); return () => this.listeners.delete(listener); }
    private emit(): void { for (const listener of this.listeners) listener(); }
    replace(document: ProjectDocument, migrated = false): void { validateProjectDocument(document,true); this.documentValue = deepClone(document); this.undoStack = []; this.redoStack = []; this.migrationNotice = migrated ? "Earlier project migrated to v0.4. Save a new encrypted v0.4 project file." : ""; this.emit(); }
    reset(): void { this.replace(createNewProject()); }
    execute(action: string, objectType: string, objectId: string, summary: string, mutator: (document: ProjectDocument) => void, checkpointName?: string): void {
      const before = deepClone(this.documentValue); const proposed = deepClone(this.documentValue); mutator(proposed); touchProject(proposed); appendHistory(proposed,action,objectType,objectId,summary); if (checkpointName) addCheckpoint(proposed,checkpointName); validateProjectDocument(proposed,true); this.undoStack.push(before); if (this.undoStack.length > 50) this.undoStack.shift(); this.redoStack = []; this.documentValue = proposed; this.emit();
    }
    undo(): void { const prior = this.undoStack.pop(); if (!prior) return; const current = deepClone(this.documentValue); const restored = deepClone(prior); restored.history = deepClone(current.history); const reversed = current.history.at(-1)?.event_id; touchProject(restored); appendHistory(restored,"project.undo","project",restored.manifest.project_id,"Restored the prior governed project state.",reversed); validateProjectDocument(restored,true); this.redoStack.push(current); this.documentValue = restored; this.emit(); }
    redo(): void { const next = this.redoStack.pop(); if (!next) return; const current = deepClone(this.documentValue); const restored = deepClone(next); restored.history = deepClone(current.history); touchProject(restored); appendHistory(restored,"project.redo","project",restored.manifest.project_id,"Reapplied the next governed project state."); validateProjectDocument(restored,true); this.undoStack.push(current); this.documentValue = restored; this.emit(); }
    restoreCheckpoint(checkpointId: string): void { const checkpoint = this.documentValue.checkpoints.find(item => item.checkpoint_id === checkpointId); if (!checkpoint) throw new Error("Checkpoint not found."); this.execute("checkpoint.restored","checkpoint",checkpointId,`Restored checkpoint ${checkpoint.name}.`,document => { document.state = deepClone(checkpoint.state); },`Restored ${checkpoint.name}`); }
  }
}
