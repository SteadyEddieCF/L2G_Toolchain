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
    { path: "domains/engagement.json", schema: "engagement_v1", authority: "Engagement" },
    { path: "domains/reviews-actions.json", schema: "reviews_actions_v1", authority: "Reviews & Actions" }
  ];

  export function createNewProject(): ProjectDocument {
    const timestamp = nowIso();
    const projectId = newId("project");
    const engagementId = newId("engagement");
    return {
      manifest: {
        kind: "l2g_project_v1",
        schema_version: "1.0",
        project_id: projectId,
        created_at: timestamp,
        updated_at: timestamp,
        application: {
          name: "L2G Integrated Suite",
          version: window.__L2G_RELEASE__.version,
          product_runtime_compatibility_baseline: window.__L2G_RELEASE__.product_runtime_compatibility_baseline
        },
        evidence_policy: "reference-only",
        encryption_mode: "aes-256-gcm-pbkdf2-sha256-v1",
        domain_index: deepClone(EXPECTED_DOMAINS)
      },
      state: {
        engagement: {
          schema_version: "engagement_v1",
          engagement_id: engagementId,
          engagement_name: "Synthetic Encrypted Engagement",
          client_name: "McFirecoal Synthetic Client",
          system_name: "Integrated Suite Encrypted Project",
          phase: "Project Protection",
          objectives: "Validate encrypted portable projects and encrypted browser recovery using synthetic data only.",
          participants: []
        },
        reviews_actions: {
          schema_version: "reviews_actions_v1",
          examples: [{
            id: newId("review"),
            title: "Confirm encrypted-project safety boundary",
            source_domain: "Overview",
            target_domain: "Reviews & Actions",
            lifecycle: "Proposed",
            review_state: "Assigned",
            operational_state: "Open",
            visibility: "Advisor-only",
            rationale: "Synthetic example for explicit review-state and encrypted persistence validation."
          }]
        },
        profile: "advisor",
        active_workspace: "overview",
        inspector_open: false,
        inspector_pinned: false,
        rail_collapsed: false
      },
      history: [{
        event_id: newId("event"),
        timestamp,
        profile: "advisor",
        action: "project.created",
        object_type: "project",
        object_id: projectId,
        summary: "Created a synthetic encrypted-project session.",
        transaction_id: newId("txn")
      }],
      checkpoints: []
    };
  }

  export function touchProject(document: ProjectDocument): void { document.manifest.updated_at = nowIso(); }

  export function appendHistory(document: ProjectDocument, action: string, objectType: string, objectId: string, summary: string, reverses?: string): HistoryEvent {
    const event: HistoryEvent = {
      event_id: newId("event"),
      timestamp: nowIso(),
      profile: document.state.profile,
      action,
      object_type: objectType,
      object_id: objectId,
      summary: sanitizePlainText(summary, 500),
      transaction_id: newId("txn")
    };
    if (reverses) event.reverses_event_id = reverses;
    document.history.push(event);
    return event;
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
    for (const [path, data] of [...payloads.entries()].sort(([left], [right]) => left.localeCompare(right))) {
      integrityEntries.push({ path, sha256: await sha256Hex(data), size: data.length });
    }
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
    const engagement = parseEntry<EngagementRecord>(entryMap, "domains/engagement.json");
    const reviews = parseEntry<ReviewsActionsRecord>(entryMap, "domains/reviews-actions.json");
    const checkpoints = parseEntry<Checkpoint[]>(entryMap, "history/checkpoints.json");
    const registry = parseEntry<ContractRegistry>(entryMap, "compatibility/current-registry.json");
    if (!isRecord(registry) || typeof registry.registry_version !== "string" || !Array.isArray(registry.contracts)) throw new Error("Compatibility registry snapshot is invalid.");
    const historyText = decodeUtf8(requireEntry(entryMap, "history/events.ndjson"));
    const history = historyText.split(/\r?\n/).filter(Boolean).map((line, index) => {
      try { return parseStrictJson(line) as HistoryEvent; }
      catch (error) { throw new Error(`History line ${index + 1} is invalid: ${errorMessage(error)}`); }
    });
    const document: ProjectDocument = {
      manifest,
      state: { engagement, reviews_actions: reviews, profile: "advisor", active_workspace: "overview", inspector_open: false, inspector_pinned: false, rail_collapsed: false },
      history,
      checkpoints
    };
    const legacy = manifest.encryption_mode === "none-synthetic-foundation-only";
    if (legacy && !allowLegacy) throw new Error("Unencrypted legacy project is not accepted here.");
    validateProjectDocument(document, !legacy);
    if (legacy) {
      document.manifest.application = {
        name: "L2G Integrated Suite",
        version: window.__L2G_RELEASE__.version,
        product_runtime_compatibility_baseline: window.__L2G_RELEASE__.product_runtime_compatibility_baseline
      };
      document.manifest.encryption_mode = "aes-256-gcm-pbkdf2-sha256-v1";
      touchProject(document);
      appendHistory(document, "project.migrated", "project", document.manifest.project_id, "Imported a valid v0.1 synthetic project for encrypted v0.2 migration.");
    }
    return { document, legacy };
  }

  function parseEntry<T>(entries: Map<string, Uint8Array>, path: string): T { return parseStrictJson(decodeUtf8(requireEntry(entries, path))) as T; }
  function requireEntry(entries: Map<string, Uint8Array>, path: string): Uint8Array {
    const value = entries.get(path);
    if (!value) throw new Error(`Missing project entry: ${path}`);
    return value;
  }

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
    for (const event of document.history) {
      validateHistory(event);
      if (eventIds.has(event.event_id)) throw new Error("Duplicate history event.");
      eventIds.add(event.event_id);
    }
    if (!Array.isArray(document.checkpoints) || document.checkpoints.length > 20) throw new Error("Checkpoint collection is invalid.");
    const checkpointIds = new Set<string>();
    for (const checkpoint of document.checkpoints) {
      if (!safeId(checkpoint.checkpoint_id, "checkpoint") || checkpointIds.has(checkpoint.checkpoint_id) || typeof checkpoint.name !== "string" || checkpoint.name.length > 120 || !isIso(checkpoint.created_at)) throw new Error("Checkpoint is invalid.");
      checkpointIds.add(checkpoint.checkpoint_id);
      validateState(checkpoint.state);
    }
  }

  function validateState(state: ProjectState): void {
    if (!isRecord(state)) throw new Error("Project state is invalid.");
    validateEngagement(state.engagement);
    validateReviews(state.reviews_actions);
    if (!["advisor", "client", "reviewer"].includes(state.profile)) throw new Error("Presentation profile is invalid.");
    const workspaces: WorkspaceId[] = ["overview", "pre-engagement", "evidence", "scope", "practice-review", "ssp", "deliverables", "reviews-actions"];
    if (!workspaces.includes(state.active_workspace) || typeof state.inspector_open !== "boolean" || typeof state.inspector_pinned !== "boolean" || typeof state.rail_collapsed !== "boolean") throw new Error("Shell state is invalid.");
  }

  function validateEngagement(engagement: EngagementRecord): void {
    if (!isRecord(engagement) || engagement.schema_version !== "engagement_v1" || !safeId(engagement.engagement_id, "engagement")) throw new Error("Engagement record is invalid.");
    for (const [value, limit] of [[engagement.engagement_name, 160], [engagement.client_name, 160], [engagement.system_name, 160], [engagement.phase, 80], [engagement.objectives, 4000]] as Array<[string, number]>) {
      if (typeof value !== "string" || value.length > limit) throw new Error("Engagement content is invalid.");
    }
    if (!Array.isArray(engagement.participants) || engagement.participants.length > 100) throw new Error("Participants are invalid.");
    const identifiers = new Set<string>();
    for (const participant of engagement.participants) {
      if (!safeId(participant.id, "participant") || identifiers.has(participant.id) || typeof participant.name !== "string" || participant.name.length > 160 || typeof participant.role !== "string" || participant.role.length > 160 || typeof participant.organization !== "string" || participant.organization.length > 160 || !["advisor-only", "client-safe"].includes(participant.visibility)) throw new Error("Participant is invalid.");
      identifiers.add(participant.id);
    }
  }

  function validateReviews(record: ReviewsActionsRecord): void {
    if (!isRecord(record) || record.schema_version !== "reviews_actions_v1" || !Array.isArray(record.examples) || record.examples.length > 50) throw new Error("Reviews are invalid.");
    const identifiers = new Set<string>();
    for (const item of record.examples) {
      if (!isRecord(item) || !safeId(item.id, "review") || identifiers.has(item.id) || typeof item.title !== "string" || item.title.length > 240 || typeof item.rationale !== "string" || item.rationale.length > 2000 || !["Draft", "Proposed", "Confirmed", "Approved", "Superseded"].includes(item.lifecycle) || !["Not requested", "Assigned", "In review", "Changes requested", "Approved", "Closed"].includes(item.review_state) || !["Open", "Waiting", "Blocked", "Done", "Cancelled"].includes(item.operational_state) || !["Advisor-only", "Client-safe", "Approved for client presentation"].includes(item.visibility)) throw new Error("Review item is invalid.");
      identifiers.add(item.id);
    }
  }

  function validateHistory(event: HistoryEvent): void {
    if (!isRecord(event) || !safeId(event.event_id, "event") || !safeId(event.transaction_id, "txn") || !isIso(event.timestamp) || !["advisor", "client", "reviewer"].includes(event.profile) || typeof event.action !== "string" || event.action.length > 120 || typeof event.object_type !== "string" || event.object_type.length > 120 || typeof event.object_id !== "string" || event.object_id.length > 160 || typeof event.summary !== "string" || event.summary.length > 500) throw new Error("History event is invalid.");
    if (event.reverses_event_id !== undefined && !safeId(event.reverses_event_id, "event")) throw new Error("History reversal is invalid.");
  }

  function safeId(value: unknown, prefix: string): value is string { return typeof value === "string" && value.startsWith(`${prefix}_`) && value.length <= 128 && /^[A-Za-z0-9_-]+$/.test(value); }
  function isIso(value: unknown): value is string { return typeof value === "string" && Number.isFinite(Date.parse(value)); }
}
