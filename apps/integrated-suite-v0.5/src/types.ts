namespace L2G {
  export type PresentationProfile = "advisor" | "client" | "reviewer";
  export type WorkspaceId = "overview" | "pre-engagement" | "evidence" | "scope" | "practice-review" | "ssp" | "deliverables" | "reviews-actions";
  export type EnvelopePurpose = "portable-project" | "browser-recovery";
  export type Visibility = "advisor-only" | "client-safe" | "approved-for-client-presentation";
  export type EngagementPhase = "planning" | "discovery" | "scoping" | "practice-review" | "ssp-development" | "delivery" | "review" | "closed";
  export type InformationLabel = "Synthetic" | "Public" | "Internal" | "FCI" | "CUI" | "Unknown";

  export interface Provenance {
    source_kind: string;
    source_id: string;
    source_label?: string;
    source_location_ref?: string | null;
    asserted_at: string;
    asserted_by: PresentationProfile | "migration" | "system";
    confidence: "not-evaluated" | "low" | "medium" | "high";
  }

  export interface IdentityRecord {
    engagement_name: string; client_name: string; system_name: string; delivery_context: string; objectives: string;
    target_level: "CMMC Level 2" | "CMMC Level 1" | "Other" | "Not specified";
    phase: EngagementPhase; start_date: string; target_end_date: string; information_label: InformationLabel;
    lifecycle: "accepted"; visibility: Visibility; updated_at: string;
  }
  export interface OrganizationRecord { organization_id: string; name: string; relationship: "client" | "advisor" | "MSP" | "CSP" | "provider" | "assessor" | "other"; status: "active" | "inactive" | "superseded"; visibility: Visibility; provenance: Provenance; created_at: string; updated_at: string; }
  export interface ParticipantRecord { participant_id: string; display_name: string; role: string; organization_ref: string; contact_reference: string; participation_state: "active" | "inactive" | "superseded"; visibility: Visibility; provenance: Provenance; created_at: string; updated_at: string; }
  export interface RelatedRecordBase { title: string; detail: string; visibility: Visibility; provenance: Provenance; related_refs: string[]; created_at: string; updated_at: string; }
  export interface AssumptionRecord extends RelatedRecordBase { assumption_id: string; status: "open" | "confirmed" | "rejected" | "superseded"; }
  export interface DecisionRecord extends RelatedRecordBase { decision_id: string; status: "proposed" | "accepted" | "revised" | "superseded"; rationale: string; }
  export interface QuestionRecord extends RelatedRecordBase { question_id: string; status: "open" | "answered" | "deferred" | "closed"; answer_ref?: string; }
  export interface ConstraintRecord extends RelatedRecordBase { constraint_id: string; status: "active" | "resolved" | "superseded" | "archived"; }
  export interface MilestoneRecord extends RelatedRecordBase { milestone_id: string; target_date: string; owner_label: string; workstream: string; operational_state: "planned" | "in-progress" | "waiting" | "blocked" | "completed" | "cancelled"; }
  export interface BlockerRecord extends RelatedRecordBase { blocker_id: string; severity: "low" | "medium" | "high" | "critical"; operational_state: "open" | "waiting" | "resolved" | "cancelled"; owner_label: string; }
  export type CandidateTargetType = "identity" | "participant" | "organization" | "assumption" | "decision" | "open-question" | "constraint" | "milestone" | "blocker";
  export interface CandidateRecord {
    candidate_id: string; source_kind: string; source_ref: string; target_type: CandidateTargetType;
    proposed_fields: Record<string, string>; accepted_fields?: Record<string, string>;
    state: "candidate" | "accepted" | "modified" | "rejected" | "superseded"; rationale: string;
    decided_at?: string; decided_by?: PresentationProfile; accepted_record_ref?: string;
    supersedes_candidate_id?: string; superseded_by_candidate_id?: string; provenance: Provenance; visibility: Visibility;
  }
  export interface EngagementProjectionPolicy { client_visible_values: Array<"client-safe" | "approved-for-client-presentation">; reviewer_include_provenance: boolean; client_include_candidates: false; }
  export interface EngagementDomain {
    schema_kind: "l2g_engagement_v1"; schema_version: "1.0"; engagement_id: string; identity: IdentityRecord;
    participants: ParticipantRecord[]; organizations: OrganizationRecord[]; assumptions: AssumptionRecord[]; decisions: DecisionRecord[];
    open_questions: QuestionRecord[]; constraints: ConstraintRecord[]; milestones: MilestoneRecord[]; blockers: BlockerRecord[];
    candidates: CandidateRecord[]; projection_policy: EngagementProjectionPolicy;
  }
  export interface EngagementNextWorkItem { kind: "missing-field" | "candidate" | "blocker" | "milestone" | "question" | "informational"; record_ref: string; title: string; detail: string; priority: number; }
  export interface EngagementProjection {
    projection_kind: "l2g_engagement_projection_v1"; workspace: WorkspaceId; profile: PresentationProfile; generated_at: string;
    source_domain: "Engagement"; source_engagement_id: string; source_record_ids: string[]; identity: IdentityRecord;
    participants: Array<Omit<ParticipantRecord, "provenance"> & { provenance?: Provenance }>;
    organizations: Array<Omit<OrganizationRecord, "provenance"> & { provenance?: Provenance }>;
    assumptions: Array<Omit<AssumptionRecord, "provenance"> & { provenance?: Provenance }>;
    decisions: Array<Omit<DecisionRecord, "provenance"> & { provenance?: Provenance }>;
    open_questions: Array<Omit<QuestionRecord, "provenance"> & { provenance?: Provenance }>;
    constraints: Array<Omit<ConstraintRecord, "provenance"> & { provenance?: Provenance }>;
    milestones: Array<Omit<MilestoneRecord, "provenance"> & { provenance?: Provenance }>;
    blockers: Array<Omit<BlockerRecord, "provenance"> & { provenance?: Provenance }>;
    candidates: CandidateRecord[]; next_work: EngagementNextWorkItem[];
  }

  export type EvidenceOriginKind = "local-file" | "legacy-package-record" | "generated-output-reference" | "external-reference";
  export type EvidenceLifecycle = "active" | "superseded" | "archived";
  export type EvidenceProcessingState = "not-requested" | "pending" | "processing" | "complete" | "partial" | "failed" | "unsupported";
  export type EvidenceReviewState = "unreviewed" | "in-review" | "reviewed" | "needs-attention" | "excluded";
  export type EvidenceTrustState = "not-evaluated" | "no-exception" | "exception-open" | "exception-resolved" | "rejected";
  export type SessionLinkState = "unlinked" | "hashing" | "linked-exact" | "mismatch" | "cancelled" | "error";
  export interface EvidenceFingerprint { algorithm: "SHA-256"; sha256: string; }
  export interface EvidenceSourceRecord {
    evidence_id: string; display_label: string; client_label: string; original_name: string; collection_label: string;
    origin_kind: EvidenceOriginKind; media_type: string; extension: string; size_bytes: number; last_modified_ms: number;
    fingerprint: EvidenceFingerprint | null; lifecycle: EvidenceLifecycle; processing_state: EvidenceProcessingState;
    review_state: EvidenceReviewState; trust_state: EvidenceTrustState; visibility: Visibility; tags: string[];
    supersedes_source_ref: string | null; superseded_by_source_ref: string | null; duplicate_group_ref: string | null;
    provenance: Provenance; created_at: string; updated_at: string;
  }
  export type EvidenceLocationKind = "whole-source" | "page" | "paragraph" | "sheet" | "row" | "cell-range" | "slide" | "object" | "speaker-turn" | "timestamp-range" | "package-field" | "unknown";
  export interface EvidenceLocation {
    location_id: string; source_ref: string; kind: EvidenceLocationKind; label: string;
    page_start: number | null; page_end: number | null; paragraph: string | null; sheet: string | null;
    row_start: number | null; row_end: number | null; column_start: string | null; column_end: string | null;
    slide_start: number | null; slide_end: number | null; object_label: string | null; speaker: string | null;
    start_ms: number | null; end_ms: number | null; package_path: string | null; record_path: string | null;
    visibility: Visibility; provenance: Provenance; created_at: string; updated_at: string;
  }
  export type DerivedRecordKind = "extract-summary" | "structured-record" | "diagram-description" | "security-evidence-item" | "meeting-segment" | "parser-diagnostic";
  export interface ScalarField { name: string; value_type: "string" | "number" | "boolean" | "null"; value: string | number | boolean | null; }
  export interface ParserIdentity { name: string; version: string; method: string; }
  export interface EvidenceDerivedRecord {
    derived_id: string; source_ref: string; kind: DerivedRecordKind; title: string; summary: string; fields: ScalarField[];
    location_refs: string[]; parser: ParserIdentity; confidence: Provenance["confidence"]; review_state: EvidenceReviewState;
    visibility: Visibility; provenance: Provenance; created_at: string; updated_at: string;
  }
  export type EvidenceRelationshipType = "duplicate-of" | "revision-of" | "derived-from" | "contains" | "supports" | "related-to";
  export interface EvidenceRelationship { relationship_id: string; relationship_type: EvidenceRelationshipType; from_ref: string; to_ref: string; rationale: string; visibility: Visibility; provenance: Provenance; created_at: string; }
  export type DuplicateDisposition = "unresolved" | "primary" | "duplicate" | "retained-distinct" | "excluded";
  export interface DuplicateMember { source_ref: string; disposition: DuplicateDisposition; rationale: string; }
  export interface DuplicateGroup { duplicate_group_id: string; sha256: string; members: DuplicateMember[]; state: "unresolved" | "resolved"; visibility: Visibility; created_at: string; updated_at: string; }
  export type EvidenceTargetDomain = "engagement" | "pre-engagement" | "scope" | "practice-review" | "ssp" | "deliverables" | "reviews-actions";
  export type EvidenceCandidateState = "draft" | "awaiting-review" | "published-to-target" | "returned" | "withdrawn" | "superseded" | "closed";
  export interface CandidateField { name: string; value: string; }
  export interface EvidenceCandidateMapping {
    candidate_id: string; source_refs: string[]; location_refs: string[]; derived_refs: string[]; target_domain: EvidenceTargetDomain;
    target_type: string; proposed_operation: "create" | "update" | "link" | "request-review"; proposed_fields: CandidateField[];
    state: EvidenceCandidateState; rationale: string; target_candidate_ref: string | null;
    supersedes_candidate_ref: string | null; superseded_by_candidate_ref: string | null;
    visibility: Visibility; provenance: Provenance; created_at: string; updated_at: string;
  }
  export type VerificationOperation = "initial-registration" | "relink" | "revision-registration" | "duplicate-registration";
  export type VerificationResult = "exact-match" | "duplicate-existing" | "new-revision-created";
  export interface VerificationReceipt {
    verification_id: string; source_ref: string; operation: VerificationOperation; selected_name: string; selected_size_bytes: number;
    selected_last_modified_ms: number; selected_sha256: string; result: VerificationResult; related_source_ref: string | null;
    rationale: string; performed_at: string; performed_by: "advisor";
  }
  export type ImportState = "previewed" | "applied" | "partial" | "rejected" | "superseded";
  export interface EvidenceImportReceipt {
    import_id: string; package_kind: "l2g_intake_package_v1" | "l2g_scope_context_v1" | "l2g_meeting_context_v1";
    package_version: "1.0"; package_name: string; package_size_bytes: number; package_sha256: string; registry_version: string;
    source_document_ids: string[]; staged_source_refs: string[]; staged_location_refs: string[]; staged_derived_refs: string[];
    staged_candidate_refs: string[]; warnings: string[]; state: ImportState; imported_at: string; imported_by: "advisor";
  }
  export interface EvidenceProjectionPolicy {
    client_visible_values: Array<"client-safe" | "approved-for-client-presentation">; client_requires_label: true;
    client_include_original_names: false; client_include_fingerprints: false; client_include_candidates: false;
    client_include_provenance: false; search_index_persistence: "none";
  }
  export interface EvidenceDomain {
    schema_kind: "l2g_evidence_index_v1"; schema_version: "1.0"; catalog_id: string;
    sources: EvidenceSourceRecord[]; locations: EvidenceLocation[]; derived_records: EvidenceDerivedRecord[];
    relationships: EvidenceRelationship[]; duplicate_groups: DuplicateGroup[]; candidate_mappings: EvidenceCandidateMapping[];
    verification_receipts: VerificationReceipt[]; import_receipts: EvidenceImportReceipt[]; projection_policy: EvidenceProjectionPolicy;
  }
  export interface EvidenceNextWorkItem {
    kind: "source-review" | "exception" | "missing-source" | "hash-mismatch" | "duplicate-group" | "processing" | "candidate-mapping" | "import-review" | "verification" | "informational";
    record_ref: string; title: string; detail: string; priority: number;
  }
  export type ClientEvidenceSource = Pick<EvidenceSourceRecord, "evidence_id" | "client_label" | "media_type" | "lifecycle" | "review_state" | "visibility" | "tags" | "created_at" | "updated_at">;
  export interface EvidenceProjection {
    projection_kind: "l2g_evidence_projection_v1"; workspace: WorkspaceId; profile: PresentationProfile; generated_at: string;
    source_domain: "Evidence"; source_catalog_id: string; source_record_ids: string[];
    sources: Array<EvidenceSourceRecord | ClientEvidenceSource>; locations: Array<EvidenceLocation | Omit<EvidenceLocation, "provenance">>;
    derived_records: Array<EvidenceDerivedRecord | Omit<EvidenceDerivedRecord, "provenance" | "parser" | "confidence">>;
    relationships: Array<EvidenceRelationship | Omit<EvidenceRelationship, "provenance" | "rationale">>;
    duplicate_groups: DuplicateGroup[]; candidate_mappings: EvidenceCandidateMapping[];
    verification_receipts: VerificationReceipt[]; import_receipts: EvidenceImportReceipt[]; next_work: EvidenceNextWorkItem[];
  }
  export interface StagedSource {
    staging_id: string; file: File; original_name: string; media_type: string; extension: string; size_bytes: number; last_modified_ms: number;
    sha256: string; display_label: string; client_label: string; collection_label: string; tags: string[]; visibility: Visibility;
    duplicate_source_refs: string[];
  }
  export interface ImportPreview {
    package_kind: EvidenceImportReceipt["package_kind"]; package_version: "1.0"; package_name: string; package_size_bytes: number;
    package_sha256: string; source_document_ids: string[]; sources: EvidenceSourceRecord[]; locations: EvidenceLocation[];
    derived_records: EvidenceDerivedRecord[]; candidates: EvidenceCandidateMapping[]; warnings: string[]; rejected: string[];
  }

  export interface ReviewItem { id: string; title: string; source_domain: string; target_domain: string; lifecycle: "Draft" | "Proposed" | "Confirmed" | "Approved" | "Superseded"; review_state: "Not requested" | "Assigned" | "In review" | "Changes requested" | "Approved" | "Closed"; operational_state: "Open" | "Waiting" | "Blocked" | "Done" | "Cancelled"; visibility: "Advisor-only" | "Client-safe" | "Approved for client presentation"; rationale: string; }
  export interface ReviewsActionsRecord { schema_version: "reviews_actions_v1"; examples: ReviewItem[]; }
  export interface HistoryEvent { event_id: string; timestamp: string; profile: PresentationProfile; action: string; object_type: string; object_id: string; summary: string; transaction_id: string; reverses_event_id?: string; }
  export interface ProjectState { engagement: EngagementDomain; evidence: EvidenceDomain; reviews_actions: ReviewsActionsRecord; profile: PresentationProfile; active_workspace: WorkspaceId; inspector_open: boolean; inspector_pinned: boolean; rail_collapsed: boolean; }
  export interface Checkpoint { checkpoint_id: string; name: string; created_at: string; state: ProjectState; }
  export interface ProjectManifest {
    kind: "l2g_project_v1"; schema_version: "1.0"; project_id: string; created_at: string; updated_at: string;
    application: { name: "L2G Integrated Suite" | "L2G Integrated Suite Foundation"; version: string; product_runtime_compatibility_baseline: string; };
    evidence_policy: "reference-only"; encryption_mode: "aes-256-gcm-pbkdf2-sha256-v1" | "none-synthetic-foundation-only";
    domain_index: Array<{ path: string; schema: string; authority: string }>;
  }
  export interface ProjectDocument { manifest: ProjectManifest; state: ProjectState; history: HistoryEvent[]; checkpoints: Checkpoint[]; }
  export interface ZipEntry { path: string; data: Uint8Array; }
  export interface IntegrityRecord { algorithm: "SHA-256"; entries: Array<{ path: string; sha256: string; size: number }>; }
  export interface ContractRegistry { registry_version: string; status: string; updated_at: string; contracts: Array<Record<string, unknown>>; }
  export interface EnvelopeMetadata {
    kind: "l2g_encrypted_project_v1"; version: "1.0"; purpose: EnvelopePurpose;
    cipher: { name: "AES-GCM"; key_bits: 256; tag_bits: 128; iv_b64: string };
    kdf: { name: "PBKDF2"; hash: "SHA-256"; iterations: 600000; salt_b64: string };
    inner: { media_type: "application/vnd.l2g.project+zip"; project_kind: "l2g_project_v1"; schema_version: "1.0"; plaintext_bytes: number; plaintext_sha256: string; };
    application: { name: "L2G Integrated Suite"; version: string };
  }
  export interface SessionProtection { baseKey?: CryptoKey; portableKey?: CryptoKey; recoveryKey?: CryptoKey; portableSalt?: Uint8Array; recoverySalt?: Uint8Array; }
  export interface ReleaseInfo { application: string; version: string; product_runtime_compatibility_baseline: string; synthetic_only: boolean; artifact_name: string; envelope_kind: string; project_kind: string; engagement_schema_kind: string; engagement_schema_version: string; evidence_schema_kind: string; evidence_schema_version: string; }
  export interface RecoveryRecord { kind: "l2g_encrypted_recovery_v1"; saved_at: string; bytes: ArrayBuffer; }
}

interface Window {
  __L2G_RELEASE__: L2G.ReleaseInfo;
  __L2G_CONTRACT_REGISTRY__: L2G.ContractRegistry;
  showSaveFilePicker?: (options?: { suggestedName?: string; types?: Array<{ description: string; accept: Record<string, string[]> }>; }) => Promise<{ createWritable: () => Promise<{ write: (data: Blob) => Promise<void>; close: () => Promise<void> }> }>;
}
