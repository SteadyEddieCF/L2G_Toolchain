namespace L2G {
  const REQUIRED_PROJECT_PATHS = Object.freeze([
    "compatibility/current-registry.json",
    "domains/engagement.json",
    "domains/reviews-actions.json",
    "history/checkpoints.json",
    "history/events.ndjson",
    "integrity/sha256-manifest.json",
    "manifest.json"
  ]);

  export function createNewProject(): ProjectDocument {
    const timestamp = nowIso();
    const projectId = newId("project");
    const engagementId = newId("engagement");
    const state: ProjectState = {
      engagement: {
        schema_version: "engagement_v1",
        engagement_id: engagementId,
        engagement_name: "Synthetic Foundation Engagement",
        client_name: "McFirecoal Synthetic Client",
        system_name: "Integrated Suite Foundation System",
        phase: "Foundation",
        objectives: "Validate the local, offline, additive Integrated Suite foundation using synthetic data only.",
        participants: []
      },
      reviews_actions: {
        schema_version: "reviews_actions_v1",
        examples: [
          {
            id: newId("review"),
            title: "Confirm synthetic engagement identity",
            source_domain: "Pre-Engagement",
            target_domain: "Reviews & Actions",
            lifecycle: "Proposed",
            review_state: "Assigned",
            operational_state: "Open",
            visibility: "Advisor-only",
            rationale: "Foundation-only example used to validate explicit review-state presentation."
          }
        ]
      },
      profile: "advisor",
      active_workspace: "overview",
      inspector_open: false,
      inspector_pinned: false,
      rail_collapsed: false
    };
    return {
      manifest: {
        kind: "l2g_project_v1",
        schema_version: "1.0",
        project_id: projectId,
        created_at: timestamp,
        updated_at: timestamp,
        application: {
          name: "L2G Integrated Suite Foundation",
          version: window.__L2G_RELEASE__.version,
          product_runtime_compatibility_baseline: window.__L2G_RELEASE__.product_runtime_compatibility_baseline
        },
        evidence_policy: "reference-only",
        encryption_mode: "none-synthetic-foundation-only",
        domain_index: [
          { path: "domains/engagement.json", schema: "engagement_v1", authority: "Engagement" },
          { path: "domains/reviews-actions.json", schema: "reviews_actions_v1", authority: "Reviews & Actions" }
        ]
      },
      state,
      history: [
        {
          event_id: newId("event"),
          timestamp,
          profile: "advisor",
          action: "project.created",
          object_type: "project",
          object_id: projectId,
          summary: "Created a synthetic-only L2G foundation project.",
          transaction_id: newId("txn")
        }
      ],
      checkpoints: []
    };
  }

  export function touchProject(document: ProjectDocument): void {
    document.manifest.updated_at = nowIso();
  }

  export async function serializeProject(document: ProjectDocument): Promise<Uint8Array> {
    validateProjectDocument(document);
    const payloads = new Map<string, Uint8Array>();
    payloads.set("manifest.json", utf8(stableStringify(document.manifest)));
    payloads.set("domains/engagement.json", utf8(stableStringify(document.state.engagement)));
    payloads.set("domains/reviews-actions.json", utf8(stableStringify(document.state.reviews_actions)));
    payloads.set("history/events.ndjson", utf8(document.history.map(event => JSON.stringify(event)).join("\n") + "\n"));
    payloads.set("history/checkpoints.json", utf8(stableStringify(document.checkpoints)));
    payloads.set("compatibility/current-registry.json", utf8(stableStringify(window.__L2G_CONTRACT_REGISTRY__)));

    const integrityEntries: IntegrityRecord["entries"] = [];
    for (const [path, data] of [...payloads.entries()].sort(([a], [b]) => a.localeCompare(b))) {
      integrityEntries.push({ path, sha256: await sha256Hex(data), size: data.byteLength });
    }
    const integrity: IntegrityRecord = { algorithm: "SHA-256", entries: integrityEntries };
    payloads.set("integrity/sha256-manifest.json", utf8(stableStringify(integrity)));
    return createStoredZip([...payloads.entries()].map(([path, data]) => ({ path, data })));
  }

  export async function deserializeProject(bytes: Uint8Array): Promise<ProjectDocument> {
    const entries = readStoredZip(bytes);
    const entryMap = new Map(entries.map(entry => [entry.path, entry.data] as const));
    const actualPaths = [...entryMap.keys()].sort();
    if (actualPaths.length !== REQUIRED_PROJECT_PATHS.length || actualPaths.some((path, index) => path !== REQUIRED_PROJECT_PATHS[index])) {
      throw new Error("The foundation project contains missing or unsupported archive paths.");
    }

    const integrity = parseTyped<IntegrityRecord>(entryMap, "integrity/sha256-manifest.json");
    if (integrity.algorithm !== "SHA-256" || !Array.isArray(integrity.entries)) throw new Error("Integrity manifest is invalid.");
    const expectedPaths = REQUIRED_PROJECT_PATHS.filter(path => path !== "integrity/sha256-manifest.json");
    const integrityPaths = integrity.entries.map(entry => entry.path).sort();
    if (integrityPaths.length !== expectedPaths.length || integrityPaths.some((path, index) => path !== expectedPaths[index])) {
      throw new Error("Integrity manifest does not cover the exact governed payload set.");
    }
    for (const record of integrity.entries) {
      validateArchivePath(record.path);
      const payload = entryMap.get(record.path);
      if (!payload) throw new Error(`Integrity payload is missing: ${record.path}`);
      if (record.size !== payload.byteLength) throw new Error(`Integrity size mismatch: ${record.path}`);
      if (record.sha256 !== await sha256Hex(payload)) throw new Error(`Integrity hash mismatch: ${record.path}`);
    }

    const manifest = parseTyped<ProjectManifest>(entryMap, "manifest.json");
    const engagement = parseTyped<EngagementRecord>(entryMap, "domains/engagement.json");
    const reviewsActions = parseTyped<ReviewsActionsRecord>(entryMap, "domains/reviews-actions.json");
    const checkpoints = parseTyped<Checkpoint[]>(entryMap, "history/checkpoints.json");
    const registry = parseTyped<ContractRegistry>(entryMap, "compatibility/current-registry.json");
    validateRegistrySnapshot(registry);
    const historyText = decodeUtf8(requireEntry(entryMap, "history/events.ndjson"));
    const history = historyText.split(/\r?\n/).filter(Boolean).map((line, index) => {
      try {
        return parseStrictJson(line) as HistoryEvent;
      } catch (error) {
        throw new Error(`History line ${index + 1} is invalid: ${error instanceof Error ? error.message : String(error)}`);
      }
    });

    const state: ProjectState = {
      engagement,
      reviews_actions: reviewsActions,
      profile: "advisor",
      active_workspace: "overview",
      inspector_open: false,
      inspector_pinned: false,
      rail_collapsed: false
    };
    const document: ProjectDocument = { manifest, state, history, checkpoints };
    validateProjectDocument(document);
    return document;
  }

  function parseTyped<T>(entries: Map<string, Uint8Array>, path: string): T {
    const text = decodeUtf8(requireEntry(entries, path));
    return parseStrictJson(text) as T;
  }

  function requireEntry(entries: Map<string, Uint8Array>, path: string): Uint8Array {
    const value = entries.get(path);
    if (!value) throw new Error(`Required project entry is missing: ${path}`);
    return value;
  }

  function validateRegistrySnapshot(registry: ContractRegistry): void {
    if (!isRecord(registry) || typeof registry.registry_version !== "string" || !Array.isArray(registry.contracts)) {
      throw new Error("Compatibility registry snapshot is invalid.");
    }
  }

  export function validateProjectDocument(document: ProjectDocument): void {
    if (!isRecord(document) || !isRecord(document.manifest) || !isRecord(document.state)) throw new Error("Project document is invalid.");
    const manifest = document.manifest;
    if (manifest.kind !== "l2g_project_v1" || manifest.schema_version !== "1.0") throw new Error("Unsupported project kind or schema version.");
    if (manifest.encryption_mode !== "none-synthetic-foundation-only" || manifest.evidence_policy !== "reference-only") throw new Error("Unsupported project safety posture for this foundation release.");
    if (!isSafeId(manifest.project_id, "project")) throw new Error("Project identifier is invalid.");
    if (!isIso(manifest.created_at) || !isIso(manifest.updated_at)) throw new Error("Project timestamps are invalid.");
    if (!isRecord(manifest.application) || manifest.application.name !== "L2G Integrated Suite Foundation" || manifest.application.version !== window.__L2G_RELEASE__.version || manifest.application.product_runtime_compatibility_baseline !== window.__L2G_RELEASE__.product_runtime_compatibility_baseline) throw new Error("Project application identity is unsupported.");
    const expectedDomains = [
      { path: "domains/engagement.json", schema: "engagement_v1", authority: "Engagement" },
      { path: "domains/reviews-actions.json", schema: "reviews_actions_v1", authority: "Reviews & Actions" }
    ];
    if (!Array.isArray(manifest.domain_index) || stableStringify(manifest.domain_index, 0) !== stableStringify(expectedDomains, 0)) throw new Error("Project domain index is unsupported.");
    validateState(document.state);
    if (!Array.isArray(document.history) || document.history.length === 0 || document.history.length > 5000) throw new Error("Project history is missing or exceeds the foundation limit.");
    const eventIds = new Set<string>();
    for (const event of document.history) {
      validateHistoryEvent(event);
      if (eventIds.has(event.event_id)) throw new Error("History event identifier is duplicated.");
      eventIds.add(event.event_id);
    }
    if (!Array.isArray(document.checkpoints) || document.checkpoints.length > 20) throw new Error("Checkpoint collection is invalid.");
    const checkpointIds = new Set<string>();
    for (const checkpoint of document.checkpoints) {
      if (!isSafeId(checkpoint.checkpoint_id, "checkpoint") || checkpointIds.has(checkpoint.checkpoint_id) || typeof checkpoint.name !== "string" || checkpoint.name.length > 120 || !isIso(checkpoint.created_at)) throw new Error("Checkpoint is invalid or duplicated.");
      checkpointIds.add(checkpoint.checkpoint_id);
      validateState(checkpoint.state);
    }
  }

  function validateState(state: ProjectState): void {
    if (!isRecord(state)) throw new Error("Project state is invalid.");
    validateEngagement(state.engagement);
    validateReviewsActions(state.reviews_actions);
    if (!["advisor", "client", "reviewer"].includes(state.profile)) throw new Error("Presentation profile is invalid.");
    const workspaces: WorkspaceId[] = ["overview", "pre-engagement", "evidence", "scope", "practice-review", "ssp", "deliverables", "reviews-actions"];
    if (!workspaces.includes(state.active_workspace)) throw new Error("Active workspace is invalid.");
    if (typeof state.inspector_open !== "boolean" || typeof state.inspector_pinned !== "boolean" || typeof state.rail_collapsed !== "boolean") throw new Error("Shell state is invalid.");
  }

  function validateEngagement(engagement: EngagementRecord): void {
    if (!isRecord(engagement) || engagement.schema_version !== "engagement_v1") throw new Error("Engagement record is invalid.");
    if (!isSafeId(engagement.engagement_id, "engagement")) throw new Error("Engagement identifier is invalid.");
    for (const [label, value, limit] of [
      ["engagement name", engagement.engagement_name, 160],
      ["client name", engagement.client_name, 160],
      ["system name", engagement.system_name, 160],
      ["phase", engagement.phase, 80],
      ["objectives", engagement.objectives, 4000]
    ] as Array<[string, string, number]>) {
      if (typeof value !== "string" || value.length > limit) throw new Error(`Invalid ${label}.`);
    }
    if (!Array.isArray(engagement.participants) || engagement.participants.length > 100) throw new Error("Participant collection is invalid.");
    const ids = new Set<string>();
    for (const participant of engagement.participants) {
      if (!isSafeId(participant.id, "participant") || ids.has(participant.id)) throw new Error("Participant identifier is invalid or duplicated.");
      ids.add(participant.id);
      if (typeof participant.name !== "string" || participant.name.length > 160 || typeof participant.role !== "string" || participant.role.length > 160 || typeof participant.organization !== "string" || participant.organization.length > 160) throw new Error("Participant content is invalid.");
      if (!["advisor-only", "client-safe"].includes(participant.visibility)) throw new Error("Participant visibility is invalid.");
    }
  }

  function validateReviewsActions(record: ReviewsActionsRecord): void {
    if (!isRecord(record) || record.schema_version !== "reviews_actions_v1" || !Array.isArray(record.examples) || record.examples.length > 50) throw new Error("Reviews & Actions record is invalid.");
    const ids = new Set<string>();
    const lifecycle = ["Draft", "Proposed", "Confirmed", "Approved", "Superseded"];
    const reviewStates = ["Not requested", "Assigned", "In review", "Changes requested", "Approved", "Closed"];
    const operationalStates = ["Open", "Waiting", "Blocked", "Done", "Cancelled"];
    const visibility = ["Advisor-only", "Client-safe", "Approved for client presentation"];
    for (const item of record.examples) {
      if (!isRecord(item) || !isSafeId(item.id, "review") || ids.has(item.id)) throw new Error("Review example identifier is invalid or duplicated.");
      ids.add(item.id);
      if (typeof item.title !== "string" || item.title.length > 240 || typeof item.rationale !== "string" || item.rationale.length > 2000 || typeof item.source_domain !== "string" || item.source_domain.length > 100 || typeof item.target_domain !== "string" || item.target_domain.length > 100) throw new Error("Review example content is invalid.");
      if (!lifecycle.includes(item.lifecycle) || !reviewStates.includes(item.review_state) || !operationalStates.includes(item.operational_state) || !visibility.includes(item.visibility)) throw new Error("Review example state is invalid.");
    }
  }

  function validateHistoryEvent(event: HistoryEvent): void {
    if (!isRecord(event) || !isSafeId(event.event_id, "event") || !isSafeId(event.transaction_id, "txn") || !isIso(event.timestamp)) throw new Error("History event is invalid.");
    if (!["advisor", "client", "reviewer"].includes(event.profile) || typeof event.action !== "string" || event.action.length > 120 || typeof event.object_type !== "string" || event.object_type.length > 120 || typeof event.object_id !== "string" || event.object_id.length > 160 || typeof event.summary !== "string" || event.summary.length > 500) throw new Error("History event content is invalid.");
    if (event.reverses_event_id !== undefined && !isSafeId(event.reverses_event_id, "event")) throw new Error("History reversal link is invalid.");
  }

  function isSafeId(value: unknown, prefix: string): value is string {
    return typeof value === "string" && value.startsWith(`${prefix}_`) && value.length <= 128 && /^[A-Za-z0-9_-]+$/.test(value);
  }

  function isIso(value: unknown): value is string {
    return typeof value === "string" && Number.isFinite(Date.parse(value));
  }

  function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }
}
