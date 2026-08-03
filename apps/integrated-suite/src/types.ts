namespace L2G {
  export type PresentationProfile = "advisor" | "client" | "reviewer";
  export type WorkspaceId =
    | "overview"
    | "pre-engagement"
    | "evidence"
    | "scope"
    | "practice-review"
    | "ssp"
    | "deliverables"
    | "reviews-actions";

  export interface Participant {
    id: string;
    name: string;
    role: string;
    organization: string;
    visibility: "advisor-only" | "client-safe";
  }

  export interface EngagementRecord {
    schema_version: "engagement_v1";
    engagement_id: string;
    engagement_name: string;
    client_name: string;
    system_name: string;
    phase: string;
    objectives: string;
    participants: Participant[];
  }

  export interface ReviewTransitionExample {
    id: string;
    title: string;
    source_domain: string;
    target_domain: string;
    lifecycle: "Draft" | "Proposed" | "Confirmed" | "Approved" | "Superseded";
    review_state: "Not requested" | "Assigned" | "In review" | "Changes requested" | "Approved" | "Closed";
    operational_state: "Open" | "Waiting" | "Blocked" | "Done" | "Cancelled";
    visibility: "Advisor-only" | "Client-safe" | "Approved for client presentation";
    rationale: string;
  }

  export interface ReviewsActionsRecord {
    schema_version: "reviews_actions_v1";
    examples: ReviewTransitionExample[];
  }

  export interface HistoryEvent {
    event_id: string;
    timestamp: string;
    profile: PresentationProfile;
    action: string;
    object_type: string;
    object_id: string;
    summary: string;
    transaction_id: string;
    reverses_event_id?: string;
  }

  export interface Checkpoint {
    checkpoint_id: string;
    name: string;
    created_at: string;
    state: ProjectState;
  }

  export interface ProjectState {
    engagement: EngagementRecord;
    reviews_actions: ReviewsActionsRecord;
    profile: PresentationProfile;
    active_workspace: WorkspaceId;
    inspector_open: boolean;
    inspector_pinned: boolean;
    rail_collapsed: boolean;
  }

  export interface ProjectManifest {
    kind: "l2g_project_v1";
    schema_version: "1.0";
    project_id: string;
    created_at: string;
    updated_at: string;
    application: {
      name: "L2G Integrated Suite Foundation";
      version: string;
      product_runtime_compatibility_baseline: string;
    };
    evidence_policy: "reference-only";
    encryption_mode: "none-synthetic-foundation-only";
    domain_index: Array<{ path: string; schema: string; authority: string }>;
  }

  export interface ProjectDocument {
    manifest: ProjectManifest;
    state: ProjectState;
    history: HistoryEvent[];
    checkpoints: Checkpoint[];
  }

  export interface IntegrityRecord {
    algorithm: "SHA-256";
    entries: Array<{ path: string; sha256: string; size: number }>;
  }

  export interface ZipEntry {
    path: string;
    data: Uint8Array;
  }

  export interface ContractRegistry {
    registry_version: string;
    status: string;
    updated_at: string;
    contracts: Array<{
      package_kind: string;
      version: string;
      producer: string;
      consumers: string[];
      stability: string;
      validation_issue?: number;
      validation_pr?: number;
      validation_evidence_head?: string;
    }>;
  }

  export interface CommandSnapshot {
    description: string;
    before: ProjectState;
    after: ProjectState;
    event_id: string;
  }

  export interface RecoveryEnvelope {
    kind: "l2g_recovery_v1";
    saved_at: string;
    document: ProjectDocument;
  }

  export interface AppReleaseInfo {
    application: string;
    version: string;
    product_runtime_compatibility_baseline: string;
    synthetic_only: boolean;
  }

  export interface Window {
    __L2G_RELEASE__: AppReleaseInfo;
    __L2G_CONTRACT_REGISTRY__: ContractRegistry;
  }
}
