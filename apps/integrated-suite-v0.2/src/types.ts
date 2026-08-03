namespace L2G {
  export type PresentationProfile = "advisor" | "client" | "reviewer";
  export type WorkspaceId = "overview" | "pre-engagement" | "evidence" | "scope" | "practice-review" | "ssp" | "deliverables" | "reviews-actions";
  export type EnvelopePurpose = "portable-project" | "browser-recovery";

  export interface Participant { id: string; name: string; role: string; organization: string; visibility: "advisor-only" | "client-safe"; }
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
  export interface ReviewItem {
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
  export interface ReviewsActionsRecord { schema_version: "reviews_actions_v1"; examples: ReviewItem[]; }
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
  export interface ProjectState {
    engagement: EngagementRecord;
    reviews_actions: ReviewsActionsRecord;
    profile: PresentationProfile;
    active_workspace: WorkspaceId;
    inspector_open: boolean;
    inspector_pinned: boolean;
    rail_collapsed: boolean;
  }
  export interface Checkpoint { checkpoint_id: string; name: string; created_at: string; state: ProjectState; }
  export interface ProjectManifest {
    kind: "l2g_project_v1";
    schema_version: "1.0";
    project_id: string;
    created_at: string;
    updated_at: string;
    application: {
      name: "L2G Integrated Suite" | "L2G Integrated Suite Foundation";
      version: string;
      product_runtime_compatibility_baseline: string;
    };
    evidence_policy: "reference-only";
    encryption_mode: "aes-256-gcm-pbkdf2-sha256-v1" | "none-synthetic-foundation-only";
    domain_index: Array<{ path: string; schema: string; authority: string }>;
  }
  export interface ProjectDocument { manifest: ProjectManifest; state: ProjectState; history: HistoryEvent[]; checkpoints: Checkpoint[]; }
  export interface ZipEntry { path: string; data: Uint8Array; }
  export interface IntegrityRecord { algorithm: "SHA-256"; entries: Array<{ path: string; sha256: string; size: number }>; }
  export interface ContractRegistry { registry_version: string; status: string; updated_at: string; contracts: Array<Record<string, unknown>>; }
  export interface EnvelopeMetadata {
    kind: "l2g_encrypted_project_v1";
    version: "1.0";
    purpose: EnvelopePurpose;
    cipher: { name: "AES-GCM"; key_bits: 256; tag_bits: 128; iv_b64: string };
    kdf: { name: "PBKDF2"; hash: "SHA-256"; iterations: 600000; salt_b64: string };
    inner: {
      media_type: "application/vnd.l2g.project+zip";
      project_kind: "l2g_project_v1";
      schema_version: "1.0";
      plaintext_bytes: number;
      plaintext_sha256: string;
    };
    application: { name: "L2G Integrated Suite"; version: string };
  }
  export interface SessionProtection {
    baseKey?: CryptoKey;
    portableKey?: CryptoKey;
    recoveryKey?: CryptoKey;
    portableSalt?: Uint8Array;
    recoverySalt?: Uint8Array;
  }
  export interface ReleaseInfo {
    application: string;
    version: string;
    product_runtime_compatibility_baseline: string;
    synthetic_only: boolean;
    artifact_name: string;
    envelope_kind: string;
    project_kind: string;
  }
  export interface RecoveryRecord { kind: "l2g_encrypted_recovery_v1"; saved_at: string; bytes: ArrayBuffer; }
}

interface Window {
  __L2G_RELEASE__: L2G.ReleaseInfo;
  __L2G_CONTRACT_REGISTRY__: L2G.ContractRegistry;
  showSaveFilePicker?: (options?: {
    suggestedName?: string;
    types?: Array<{ description: string; accept: Record<string, string[]> }>;
  }) => Promise<{ createWritable: () => Promise<{ write: (data: Blob) => Promise<void>; close: () => Promise<void> }> }>;
}
