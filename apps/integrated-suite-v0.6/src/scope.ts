namespace L2G {
  export const SCOPE_SCHEMA_KIND = "l2g_scope_v1" as const;
  export const SCOPE_SCHEMA_VERSION = "1.0" as const;
  export const SCOPE_PROJECTION_KIND = "l2g_scope_projection_v1" as const;
  export const SCOPE_PROJECTION_VERSION = "1.0" as const;

  export type ScopeLifecycle = "draft" | "active" | "inactive" | "archived" | "superseded";
  export type ScopeOperationalState = "not-started" | "in-progress" | "blocked" | "waiting" | "complete" | "cancelled" | "not-applicable";
  export type ScopeReviewState = "not-reviewed" | "pending" | "in-review" | "reviewed" | "changes-requested" | "rejected" | "closed";
  export type ScopeCurrencyState = "current" | "stale" | "conflicted" | "unverified" | "superseded";
  export type ScopeAssetCategory = "cui-asset" | "security-protection-asset" | "contractor-risk-managed-asset" | "specialized-asset" | "out-of-scope-asset" | "unclassified";
  export type ScopeDisposition = "proposed-in-scope" | "accepted-in-scope" | "proposed-out-of-scope" | "accepted-out-of-scope" | "unknown" | "disputed" | "deferred" | "superseded";
  export type ScopeBoundaryRelationship = "inside" | "outside" | "crosses-boundary" | "supports-boundary" | "inherits-into-boundary" | "shared" | "unknown" | "not-applicable";
  export type ScopeImplementationLocation = "client-managed" | "provider-managed" | "co-managed" | "inherited" | "external" | "unknown" | "not-applicable";
  export type ScopeResponsibility = "client" | "provider" | "shared" | "inherited" | "unassigned" | "disputed" | "not-applicable";
  export type ScopeDecisionState = "draft" | "proposed" | "awaiting-confirmation" | "awaiting-review" | "accepted" | "rejected" | "returned" | "withdrawn" | "superseded" | "archived";
  export type ScopeCandidateState = "received" | "in-review" | "accepted" | "modified-and-accepted" | "rejected" | "returned" | "withdrawn" | "superseded" | "closed";

  export interface ScopeVersionedRef { id: string; version: number; }
  export interface ScopeProvenance {
    origin_kind: "scope-local" | "engagement" | "evidence" | "pre-engagement" | "interview-sessions" | "compatibility-import" | "migration";
    source_refs: ScopeVersionedRef[];
    source_label: string;
    asserted_at: string;
    asserted_by: PresentationProfile | "migration" | "system";
  }
  export interface ScopeRecordBase {
    id: string;
    version: number;
    label: string;
    description: string;
    lifecycle: ScopeLifecycle;
    operational_state: ScopeOperationalState;
    review_state: ScopeReviewState;
    visibility: Visibility;
    currency_state: ScopeCurrencyState;
    provenance: ScopeProvenance;
    created_at: string;
    updated_at: string;
    created_by_profile: PresentationProfile | "system-migration";
    updated_by_profile: PresentationProfile | "system-migration";
    supersedes_id: string | null;
    superseded_by_id: string | null;
    tags: string[];
  }
  export interface ScopeAuthorityDimensions {
    asset_category: ScopeAssetCategory;
    scope_disposition: ScopeDisposition;
    boundary_relationship: ScopeBoundaryRelationship;
    implementation_location: ScopeImplementationLocation;
    responsibility_model: ScopeResponsibility;
    decision_refs: string[];
  }
  export interface ScopeBoundary extends ScopeRecordBase {
    boundary_kind: "cui-environment" | "security-protection" | "corporate-support" | "development-test" | "provider-hosted" | "other";
    purpose: string;
    scope_disposition: ScopeDisposition;
    included_refs: string[];
    excluded_refs: string[];
    entry_exit_point_refs: string[];
    location_refs: string[];
    enclave_refs: string[];
    decision_refs: string[];
    assumption_refs: string[];
    unknown_refs: string[];
    diagram_refs: string[];
    client_label: string;
    plain_language_summary: string;
  }
  export interface ScopeSystem extends ScopeRecordBase, ScopeAuthorityDimensions {
    system_kind: "business-system" | "platform" | "application" | "network" | "identity" | "security" | "management" | "other";
    owner_org_ref: string | null;
    asset_refs: string[];
    service_refs: string[];
    provider_refs: string[];
    location_refs: string[];
    client_label: string;
    plain_language_summary: string;
  }
  export interface ScopeAsset extends ScopeRecordBase, ScopeAuthorityDimensions {
    asset_kind: "endpoint" | "server" | "virtual-machine" | "container" | "network-device" | "security-tool" | "identity-object" | "data-store" | "repository" | "saas-tenant" | "cloud-resource" | "mobile-device" | "removable-media" | "facility-device" | "other";
    system_refs: string[];
    provider_refs: string[];
    service_refs: string[];
    location_refs: string[];
    flow_refs: string[];
    identifier_summary: string;
    cui_function_summary: string;
    security_function_summary: string;
    client_label: string;
    plain_language_summary: string;
  }
  export interface ScopeProvider extends ScopeRecordBase {
    provider_kind: "csp" | "msp" | "mssp" | "saas" | "paas" | "iaas" | "consultant" | "subcontractor" | "data-center" | "telecom" | "other";
    engagement_org_ref: string | null;
    service_refs: string[];
    system_refs: string[];
    asset_refs: string[];
    responsibility_model: ScopeResponsibility;
    implementation_location: ScopeImplementationLocation;
    scope_disposition: ScopeDisposition;
    support_access_summary: string;
    inheritance_summary: string;
    contract_reference_refs: string[];
    decision_refs: string[];
    client_label: string;
    plain_language_summary: string;
  }
  export interface ScopeService extends ScopeRecordBase, ScopeAuthorityDimensions {
    service_kind: "hosting" | "identity" | "network" | "security" | "logging" | "backup" | "development" | "support" | "data-processing" | "collaboration" | "other";
    provider_ref: string | null;
    consumer_refs: string[];
    inheritance_claims: string[];
    client_label: string;
    plain_language_summary: string;
  }
  export interface ScopeLocation extends ScopeRecordBase {
    location_kind: "physical" | "cloud-region" | "data-center" | "remote-work" | "logical" | "other";
    region_summary: string;
    related_refs: string[];
    scope_disposition: ScopeDisposition;
    boundary_relationship: ScopeBoundaryRelationship;
    decision_refs: string[];
    client_label: string;
    plain_language_summary: string;
  }
  export interface ScopeEnclave extends ScopeRecordBase {
    enclave_kind: "network-zone" | "cloud-subscription" | "cloud-account" | "tenant" | "facility" | "logical" | "other";
    purpose: string;
    location_refs: string[];
    related_refs: string[];
    entry_exit_point_refs: string[];
    scope_disposition: ScopeDisposition;
    boundary_relationship: ScopeBoundaryRelationship;
    decision_refs: string[];
    client_label: string;
    plain_language_summary: string;
  }
  export interface ScopeDataFlow extends ScopeRecordBase {
    source_ref: string;
    destination_ref: string;
    intermediary_refs: string[];
    data_description: string;
    data_classification_label: "cui-asserted" | "fci-asserted" | "non-cui-business" | "mixed-asserted" | "unknown";
    transfer_mechanism: string;
    protocol_summary: string;
    protection_summary: string;
    boundary_crossing_refs: string[];
    direction: "one-way" | "bidirectional" | "unknown";
    frequency: "continuous" | "scheduled" | "event-driven" | "manual" | "rare" | "unknown";
    scope_disposition: ScopeDisposition;
    unknown_refs: string[];
    decision_refs: string[];
    client_label: string;
    plain_language_summary: string;
  }
  export interface ScopeAssumption extends ScopeRecordBase {
    statement: string;
    rationale: string;
    affected_refs: string[];
    owner_label: string;
    due_at: string | null;
    resolution_state: "open" | "validated" | "invalidated" | "superseded" | "closed";
    resolving_decision_ref: string | null;
  }
  export interface ScopeUnknown extends ScopeRecordBase {
    unknown_kind: "boundary" | "asset" | "provider" | "service" | "flow" | "location" | "responsibility" | "inheritance" | "classification" | "source-conflict" | "other";
    statement: string;
    priority: "low" | "medium" | "high" | "critical";
    blocking_effect: "none" | "blocks-decision" | "blocks-diagram-approval" | "blocks-session" | "blocks-handoff";
    owner_ref: string | null;
    due_at: string | null;
    affected_refs: string[];
    resolution_state: "open" | "investigating" | "answered-unreviewed" | "resolved" | "wont-resolve" | "superseded";
    resolution_summary: string;
    resolving_decision_ref: string | null;
    session_question_candidate_ref: string | null;
  }
  export interface ScopeDependency extends ScopeRecordBase {
    from_ref: string;
    to_ref: string;
    relationship_kind: "depends-on" | "provided-by" | "hosted-on" | "contains" | "connects-to" | "flows-through" | "supports" | "inherits-from" | "located-at" | "governed-by" | "represented-by" | "conflicts-with" | "supersedes";
    precedence_bearing: boolean;
    rationale: string;
    decision_ref: string | null;
  }
  export interface ScopeDiagramNode { node_id: string; record_ref: ScopeVersionedRef | null; proposal_label: string; x: number; y: number; width: number; height: number; }
  export interface ScopeDiagramEdge { edge_id: string; from_node_id: string; to_node_id: string; relationship_ref: string | null; proposal_label: string; }
  export interface ScopeDiagram extends ScopeRecordBase {
    diagram_kind: "boundary" | "system-context" | "asset" | "provider-service" | "data-flow" | "enclave" | "custom";
    origin: "manual" | "deterministic-generated" | "imported-layout";
    purpose: string;
    included_record_refs: ScopeVersionedRef[];
    node_records: ScopeDiagramNode[];
    edge_records: ScopeDiagramEdge[];
    annotations: string[];
    text_alternative: string;
    diagram_review_state: "draft" | "proposed" | "reviewed" | "approved-representation" | "changes-requested" | "superseded" | "archived";
    approval_decision_ref: string | null;
    stale_ref_diagnostics: string[];
  }
  export interface ScopeFieldChange { field: string; old_value: string; new_value: string; }
  export interface ScopeDecision extends ScopeRecordBase {
    decision_type: "boundary-membership" | "scope-disposition" | "asset-category" | "boundary-relationship" | "implementation-location" | "responsibility" | "flow-treatment" | "assumption-resolution" | "unknown-resolution" | "dependency" | "diagram-approval" | "other";
    decision_state: ScopeDecisionState;
    affected_record_refs: ScopeVersionedRef[];
    field_changes: ScopeFieldChange[];
    rationale: string;
    client_safe_rationale: string;
    source_basis_refs: ScopeVersionedRef[];
    assumption_refs: string[];
    unknown_refs: string[];
    dependency_refs: string[];
    advisor_analysis: string;
    client_confirmation_ref: string | null;
    reviewer_disposition: "not-requested" | "pending" | "concur" | "concur-with-changes" | "return" | "reject";
    reviewer_comment: string;
    accepted_at: string | null;
    accepted_by_profile: PresentationProfile | null;
    supersedes_decision_ref: string | null;
    superseded_by_decision_ref: string | null;
  }
  export interface ScopeCandidate extends ScopeRecordBase {
    source_domain: "engagement" | "evidence" | "pre-engagement" | "interview-sessions" | "compatibility-import" | "scope-local";
    source_candidate_ref: ScopeVersionedRef;
    candidate_kind: "boundary" | "system" | "asset" | "provider" | "service" | "location" | "enclave" | "flow" | "assumption" | "unknown" | "dependency" | "decision" | "diagram" | "question-handoff";
    proposed_values: Record<string, string>;
    candidate_state: ScopeCandidateState;
    target_record_refs: string[];
    target_decision_ref: string | null;
    decision_rationale: string;
    return_comment: string;
    source_receipt_ref: string | null;
  }
  export interface ScopeImportReceipt extends ScopeRecordBase {
    package_kind: "l2g_scope_context_v1" | "l2g_scope_return_package_v1";
    package_version: "1.0";
    package_name: string;
    package_size_bytes: number;
    package_sha256: string;
    selected_record_ids: string[];
    rejected_record_ids: string[];
    diagnostics: string[];
    status: "previewed" | "applied" | "partially-applied-reviewed-subset" | "rejected" | "returned" | "failed-before-mutation" | "superseded";
    command_ref: string | null;
  }
  export interface ScopeProjectionPolicy { client_visible_values: Array<"client-safe" | "approved-for-client-presentation">; search_index_persistence: "none"; client_include_advisor_analysis: false; client_include_hidden_counts: false; }
  export interface ScopeDomain {
    schema_kind: typeof SCOPE_SCHEMA_KIND;
    schema_version: typeof SCOPE_SCHEMA_VERSION;
    scope_id: string;
    created_at: string;
    updated_at: string;
    revision: number;
    boundaries: ScopeBoundary[];
    systems: ScopeSystem[];
    assets: ScopeAsset[];
    providers: ScopeProvider[];
    services: ScopeService[];
    locations: ScopeLocation[];
    enclaves: ScopeEnclave[];
    data_flows: ScopeDataFlow[];
    assumptions: ScopeAssumption[];
    unknowns: ScopeUnknown[];
    dependencies: ScopeDependency[];
    diagrams: ScopeDiagram[];
    decisions: ScopeDecision[];
    candidates: ScopeCandidate[];
    import_receipts: ScopeImportReceipt[];
    projection_policy: ScopeProjectionPolicy;
  }
  export interface ScopeNextWorkItem { kind: "candidate" | "decision" | "unknown" | "stale" | "diagram" | "validation" | "informational"; record_ref: string; title: string; detail: string; priority: number; }
  export interface ScopeProjection {
    projection_kind: typeof SCOPE_PROJECTION_KIND;
    projection_version: typeof SCOPE_PROJECTION_VERSION;
    workspace: "scope";
    profile: PresentationProfile;
    generated_at: string;
    source_scope_id: string;
    source_scope_revision: number;
    boundaries: ScopeBoundary[];
    systems: ScopeSystem[];
    assets: ScopeAsset[];
    providers: ScopeProvider[];
    services: ScopeService[];
    locations: ScopeLocation[];
    enclaves: ScopeEnclave[];
    data_flows: ScopeDataFlow[];
    assumptions: ScopeAssumption[];
    unknowns: ScopeUnknown[];
    dependencies: ScopeDependency[];
    diagrams: ScopeDiagram[];
    decisions: ScopeDecision[];
    candidates: ScopeCandidate[];
    counts: Record<string, number>;
    next_work: ScopeNextWorkItem[];
    qualifications: string[];
  }
  export interface ScopeImportCandidate { import_record_id: string; family: ScopeCandidate["candidate_kind"]; label: string; proposed_values: Record<string, string>; source_path: string; selected: boolean; treatment: "create" | "link" | "keep-separate" | "modify" | "reject"; exact_target_ref: string | null; ambiguity: string[]; }
  export interface ScopeImportPreview {
    package_kind: ScopeImportReceipt["package_kind"];
    package_version: "1.0";
    package_name: string;
    package_size_bytes: number;
    package_sha256: string;
    producer: string;
    records: ScopeImportCandidate[];
    warnings: string[];
    rejected: string[];
  }

  export interface ProjectState { scope: ScopeDomain; }
  export interface ReleaseInfo { scope_schema_kind: typeof SCOPE_SCHEMA_KIND; scope_schema_version: typeof SCOPE_SCHEMA_VERSION; scope_projection_kind: typeof SCOPE_PROJECTION_KIND; scope_projection_version: typeof SCOPE_PROJECTION_VERSION; }

  const SCOPE_COLLECTION_LIMITS: Record<keyof Pick<ScopeDomain,"boundaries"|"systems"|"assets"|"providers"|"services"|"locations"|"enclaves"|"data_flows"|"assumptions"|"unknowns"|"dependencies"|"diagrams"|"decisions"|"candidates"|"import_receipts">,number> = {
    boundaries:50, systems:1000, assets:10000, providers:1000, services:5000, locations:1000, enclaves:1000, data_flows:20000,
    assumptions:5000, unknowns:10000, dependencies:50000, diagrams:500, decisions:20000, candidates:20000, import_receipts:1000
  };

  function scopeProvenance(origin: ScopeProvenance["origin_kind"], label: string, profile: ScopeProvenance["asserted_by"], refs: ScopeVersionedRef[] = []): ScopeProvenance {
    return { origin_kind: origin, source_refs: deepClone(refs), source_label: sanitizePlainText(label, 500), asserted_at: nowIso(), asserted_by: profile };
  }
  function scopeBase(prefix: string, label: string, visibility: Visibility, profile: PresentationProfile | "system-migration" = "advisor"): ScopeRecordBase {
    const timestamp=nowIso();
    return { id:newId(prefix), version:1, label:sanitizePlainText(label,500), description:"", lifecycle:"draft", operational_state:"not-started", review_state:"not-reviewed", visibility, currency_state:"current", provenance:scopeProvenance("scope-local","Locally created Scope record",profile==="system-migration"?"migration":profile), created_at:timestamp, updated_at:timestamp, created_by_profile:profile, updated_by_profile:profile, supersedes_id:null, superseded_by_id:null, tags:[] };
  }
  export function emptyScopeDomain(timestamp=nowIso()): ScopeDomain {
    return { schema_kind:SCOPE_SCHEMA_KIND, schema_version:SCOPE_SCHEMA_VERSION, scope_id:newId("scope"), created_at:timestamp, updated_at:timestamp, revision:0, boundaries:[], systems:[], assets:[], providers:[], services:[], locations:[], enclaves:[], data_flows:[], assumptions:[], unknowns:[], dependencies:[], diagrams:[], decisions:[], candidates:[], import_receipts:[], projection_policy:{client_visible_values:["client-safe","approved-for-client-presentation"],search_index_persistence:"none",client_include_advisor_analysis:false,client_include_hidden_counts:false} };
  }
  export function createSyntheticScope(timestamp=nowIso()): ScopeDomain {
    const scope=emptyScopeDomain(timestamp);
    const boundary={...scopeBase("scope-boundary","Synthetic CUI environment proposal","client-safe"),boundary_kind:"cui-environment",purpose:"Describe the fictional McFirecoal service boundary for workflow testing.",scope_disposition:"proposed-in-scope",included_refs:[],excluded_refs:[],entry_exit_point_refs:[],location_refs:[],enclave_refs:[],decision_refs:[],assumption_refs:[],unknown_refs:[],diagram_refs:[],client_label:"Proposed service boundary",plain_language_summary:"A synthetic boundary proposal for facilitated scoping review."} satisfies ScopeBoundary;
    const system={...scopeBase("scope-system","McFirecoal SaaS platform","client-safe"),system_kind:"platform",owner_org_ref:null,asset_refs:[],service_refs:[],provider_refs:[],location_refs:[],asset_category:"unclassified",scope_disposition:"proposed-in-scope",boundary_relationship:"inside",implementation_location:"co-managed",responsibility_model:"shared",decision_refs:[],client_label:"SaaS platform",plain_language_summary:"The fictional platform being discussed for Scope."} satisfies ScopeSystem;
    const asset={...scopeBase("scope-asset","Synthetic Azure application service","client-safe"),asset_kind:"cloud-resource",system_refs:[system.id],provider_refs:[],service_refs:[],location_refs:[],flow_refs:[],identifier_summary:"Synthetic application service",cui_function_summary:"Asserted processing context for workshop testing only.",security_function_summary:"No effectiveness conclusion.",asset_category:"unclassified",scope_disposition:"proposed-in-scope",boundary_relationship:"inside",implementation_location:"provider-managed",responsibility_model:"shared",decision_refs:[],client_label:"Application service",plain_language_summary:"A fictional cloud application service proposed for discussion."} satisfies ScopeAsset;
    const provider={...scopeBase("scope-provider","Synthetic cloud provider","client-safe"),provider_kind:"csp",engagement_org_ref:null,service_refs:[],system_refs:[system.id],asset_refs:[asset.id],responsibility_model:"shared",implementation_location:"provider-managed",scope_disposition:"proposed-in-scope",support_access_summary:"Support access requires confirmation.",inheritance_summary:"Provider context only; no implementation conclusion.",contract_reference_refs:[],decision_refs:[],client_label:"Cloud provider",plain_language_summary:"A fictional provider supporting the proposed platform."} satisfies ScopeProvider;
    const service={...scopeBase("scope-service","Synthetic hosting service","client-safe"),service_kind:"hosting",provider_ref:provider.id,consumer_refs:[system.id,asset.id],inheritance_claims:["Provider context requires human review."],asset_category:"unclassified",scope_disposition:"proposed-in-scope",boundary_relationship:"supports-boundary",implementation_location:"provider-managed",responsibility_model:"shared",decision_refs:[],client_label:"Hosting service",plain_language_summary:"A fictional hosted service considered during Scope review."} satisfies ScopeService;
    system.asset_refs=[asset.id]; system.provider_refs=[provider.id]; system.service_refs=[service.id]; provider.service_refs=[service.id]; asset.provider_refs=[provider.id]; asset.service_refs=[service.id];
    const unknown={...scopeBase("scope-unknown","Confirm provider support access","client-safe"),unknown_kind:"provider",statement:"Confirm whether provider support personnel can access asserted CUI-processing resources.",priority:"high",blocking_effect:"blocks-decision",owner_ref:null,due_at:null,affected_refs:[provider.id,service.id],resolution_state:"open",resolution_summary:"",resolving_decision_ref:null,session_question_candidate_ref:null} satisfies ScopeUnknown;
    boundary.included_refs=[system.id,asset.id,provider.id,service.id]; boundary.unknown_refs=[unknown.id];
    const flow={...scopeBase("scope-flow","Synthetic client upload flow","client-safe"),source_ref:system.id,destination_ref:asset.id,intermediary_refs:[service.id],data_description:"Asserted CUI upload path for synthetic testing; no CUI content is stored.",data_classification_label:"cui-asserted",transfer_mechanism:"HTTPS upload",protocol_summary:"TLS-protected web transfer asserted for discussion.",protection_summary:"Descriptive context only; no effectiveness conclusion.",boundary_crossing_refs:[boundary.id],direction:"one-way",frequency:"event-driven",scope_disposition:"proposed-in-scope",unknown_refs:[unknown.id],decision_refs:[],client_label:"Client upload path",plain_language_summary:"A fictional upload path selected for scoping discussion."} satisfies ScopeDataFlow;
    asset.flow_refs=[flow.id];
    const decision={...scopeBase("scope-decision","Propose application service in scope","client-safe"),decision_type:"scope-disposition",decision_state:"proposed",affected_record_refs:[{id:asset.id,version:asset.version}],field_changes:[{field:"scope_disposition",old_value:"proposed-in-scope",new_value:"accepted-in-scope"},{field:"asset_category",old_value:"unclassified",new_value:"cui-asset"}],rationale:"Synthetic proposal requiring explicit Scope acceptance.",client_safe_rationale:"The application service is proposed because it is asserted to process regulated information.",source_basis_refs:[],assumption_refs:[],unknown_refs:[unknown.id],dependency_refs:[],advisor_analysis:"Advisor-only synthetic analysis.",client_confirmation_ref:null,reviewer_disposition:"not-requested",reviewer_comment:"",accepted_at:null,accepted_by_profile:null,supersedes_decision_ref:null,superseded_by_decision_ref:null} satisfies ScopeDecision;
    const diagram=createScopeDiagram(scope,"Synthetic boundary diagram",[boundary.id,system.id,asset.id,provider.id,service.id,flow.id],"advisor");
    scope.boundaries=[boundary]; scope.systems=[system]; scope.assets=[asset]; scope.providers=[provider]; scope.services=[service]; scope.data_flows=[flow]; scope.unknowns=[unknown]; scope.decisions=[decision]; scope.diagrams=[diagram]; scope.revision=1; scope.updated_at=timestamp;
    validateScopeDomain(scope);
    return scope;
  }

  export function scopeRecordMap(scope: ScopeDomain): Map<string,ScopeRecordBase> {
    const map=new Map<string,ScopeRecordBase>();
    for(const collection of scopeCollections(scope)) for(const item of collection) map.set(item.id,item);
    return map;
  }
  function scopeCollections(scope: ScopeDomain): ScopeRecordBase[][] { return [scope.boundaries,scope.systems,scope.assets,scope.providers,scope.services,scope.locations,scope.enclaves,scope.data_flows,scope.assumptions,scope.unknowns,scope.dependencies,scope.diagrams,scope.decisions,scope.candidates,scope.import_receipts]; }
  function exactKeys(value: unknown, keys: string[], label: string): void { assertExactObjectKeys(value,keys,label); }
  function validateScopeBase(item: ScopeRecordBase, ids: Set<string>): void {
    if(!isRecord(item)||typeof item.id!=="string"||!item.id.startsWith("scope-")||ids.has(item.id)) throw new Error("Scope record identifier is invalid or duplicated.");
    ids.add(item.id);
    if(!Number.isInteger(item.version)||item.version<1||typeof item.label!=="string"||item.label.length>500||typeof item.description!=="string"||item.description.length>100000) throw new Error(`Scope record ${item.id} has invalid identity fields.`);
    if(item.tags.length>100||item.tags.some(tag=>typeof tag!=="string"||tag.length>200)) throw new Error(`Scope record ${item.id} has invalid tags.`);
    if(item.visibility!=="advisor-only"&&item.visibility!=="client-safe"&&item.visibility!=="approved-for-client-presentation") throw new Error(`Scope record ${item.id} has invalid visibility.`);
    if(item.supersedes_id===item.id||item.superseded_by_id===item.id) throw new Error(`Scope record ${item.id} cannot supersede itself.`);
    if(!isRecord(item.provenance)||typeof item.provenance.origin_kind!=="string"||typeof item.provenance.source_label!=="string"||!Array.isArray(item.provenance.source_refs)) throw new Error(`Scope record ${item.id} has invalid provenance.`);
  }
  function refsExist(refs: string[], map: Map<string,ScopeRecordBase>, label: string): void { for(const ref of refs) if(!map.has(ref)) throw new Error(`${label} references missing Scope record ${ref}.`); }
  function versionedRefsExist(refs: ScopeVersionedRef[], map: Map<string,ScopeRecordBase>, label: string): void { for(const ref of refs){const item=map.get(ref.id);if(!item||item.version!==ref.version)throw new Error(`${label} references a missing or stale exact version ${ref.id}.`);} }
  function acceptedDecisionRequired(item: ScopeRecordBase & {decision_refs:string[]}, values: string[], map: Map<string,ScopeRecordBase>): void {
    if(!values.some(value=>value.startsWith("accepted-")||value==="cui-asset"||value==="security-protection-asset"||value==="contractor-risk-managed-asset"||value==="specialized-asset"||value==="out-of-scope-asset")) return;
    const accepted=item.decision_refs.map(ref=>map.get(ref)).filter((record):record is ScopeDecision=>Boolean(record&&refIsDecision(record)&&record.decision_state==="accepted"));
    if(!accepted.length) throw new Error(`${item.id} has accepted Scope authority fields without a current accepted decision.`);
  }
  function refIsDecision(record: ScopeRecordBase): record is ScopeDecision { return record.id.startsWith("scope-decision-"); }
  export function validateScopeDomain(scope: ScopeDomain): void {
    if(!isRecord(scope))throw new Error("Scope domain is invalid.");
    exactKeys(scope,["schema_kind","schema_version","scope_id","created_at","updated_at","revision","boundaries","systems","assets","providers","services","locations","enclaves","data_flows","assumptions","unknowns","dependencies","diagrams","decisions","candidates","import_receipts","projection_policy"],"Scope domain");
    if(scope.schema_kind!==SCOPE_SCHEMA_KIND||scope.schema_version!==SCOPE_SCHEMA_VERSION||typeof scope.scope_id!=="string"||!scope.scope_id.startsWith("scope_")||!Number.isInteger(scope.revision)||scope.revision<0)throw new Error("Unsupported Scope schema identity.");
    for(const [key,limit] of Object.entries(SCOPE_COLLECTION_LIMITS) as Array<[keyof typeof SCOPE_COLLECTION_LIMITS,number]>){const collection=scope[key];if(!Array.isArray(collection)||collection.length>limit)throw new Error(`Scope ${key} exceeds its semantic limit.`);}
    const ids=new Set<string>(); for(const collection of scopeCollections(scope)) for(const item of collection) validateScopeBase(item,ids);
    const map=scopeRecordMap(scope);
    for(const boundary of scope.boundaries){refsExist([...boundary.included_refs,...boundary.excluded_refs,...boundary.entry_exit_point_refs,...boundary.location_refs,...boundary.enclave_refs,...boundary.decision_refs,...boundary.assumption_refs,...boundary.unknown_refs,...boundary.diagram_refs],map,boundary.id);if(boundary.included_refs.some(ref=>boundary.excluded_refs.includes(ref)))throw new Error(`${boundary.id} includes and excludes the same record.`);acceptedDecisionRequired(boundary,[boundary.scope_disposition],map);}
    for(const system of scope.systems){refsExist([...system.asset_refs,...system.service_refs,...system.provider_refs,...system.location_refs,...system.decision_refs],map,system.id);acceptedDecisionRequired(system,[system.asset_category,system.scope_disposition],map);}
    for(const asset of scope.assets){refsExist([...asset.system_refs,...asset.provider_refs,...asset.service_refs,...asset.location_refs,...asset.flow_refs,...asset.decision_refs],map,asset.id);acceptedDecisionRequired(asset,[asset.asset_category,asset.scope_disposition],map);}
    for(const provider of scope.providers){refsExist([...provider.service_refs,...provider.system_refs,...provider.asset_refs,...provider.decision_refs],map,provider.id);acceptedDecisionRequired(provider,[provider.scope_disposition],map);}
    for(const service of scope.services){refsExist([...service.consumer_refs,...service.decision_refs,...(service.provider_ref?[service.provider_ref]:[])],map,service.id);acceptedDecisionRequired(service,[service.asset_category,service.scope_disposition],map);}
    for(const location of scope.locations)refsExist([...location.related_refs,...location.decision_refs],map,location.id);
    for(const enclave of scope.enclaves)refsExist([...enclave.location_refs,...enclave.related_refs,...enclave.entry_exit_point_refs,...enclave.decision_refs],map,enclave.id);
    for(const flow of scope.data_flows){refsExist([flow.source_ref,flow.destination_ref,...flow.intermediary_refs,...flow.boundary_crossing_refs,...flow.unknown_refs,...flow.decision_refs],map,flow.id);if(flow.source_ref===flow.destination_ref&&flow.intermediary_refs.length===0)throw new Error(`${flow.id} has an unjustified self-loop.`);acceptedDecisionRequired(flow,[flow.scope_disposition],map);}
    for(const assumption of scope.assumptions)refsExist(assumption.affected_refs,map,assumption.id);
    for(const unknown of scope.unknowns)refsExist(unknown.affected_refs,map,unknown.id);
    for(const dependency of scope.dependencies)refsExist([dependency.from_ref,dependency.to_ref,...(dependency.decision_ref?[dependency.decision_ref]:[])],map,dependency.id);
    detectScopeDependencyCycles(scope.dependencies);
    for(const decision of scope.decisions){versionedRefsExist(decision.affected_record_refs,map,decision.id);versionedRefsExist(decision.source_basis_refs,map,decision.id);refsExist([...decision.assumption_refs,...decision.unknown_refs,...decision.dependency_refs],map,decision.id);}
    for(const diagram of scope.diagrams){versionedRefsExist(diagram.included_record_refs,map,diagram.id);const nodeIds=new Set(diagram.node_records.map(node=>node.node_id));if(diagram.node_records.length>2000||diagram.edge_records.length>5000)throw new Error(`${diagram.id} exceeds diagram limits.`);for(const node of diagram.node_records){if(node.record_ref)versionedRefsExist([node.record_ref],map,diagram.id);}for(const edge of diagram.edge_records)if(!nodeIds.has(edge.from_node_id)||!nodeIds.has(edge.to_node_id))throw new Error(`${diagram.id} has an orphan edge.`);if(diagram.diagram_review_state==="approved-representation"&&!diagram.approval_decision_ref)throw new Error(`${diagram.id} lacks an approval decision.`);}
    const currentByTarget=new Map<string,string>();for(const decision of scope.decisions.filter(item=>item.decision_state==="accepted"&&item.currency_state==="current")){for(const change of decision.field_changes){for(const ref of decision.affected_record_refs){const key=`${ref.id}:${change.field}`;const prior=currentByTarget.get(key);if(prior&&prior!==decision.id)throw new Error(`Conflicting accepted Scope decisions govern ${key}.`);currentByTarget.set(key,decision.id);}}}
  }
  function detectScopeDependencyCycles(dependencies: ScopeDependency[]): void {
    const graph=new Map<string,string[]>();for(const dep of dependencies.filter(item=>item.precedence_bearing)){const list=graph.get(dep.from_ref)??[];list.push(dep.to_ref);graph.set(dep.from_ref,list);}
    const visiting=new Set<string>(),visited=new Set<string>();const walk=(id:string,depth:number)=>{if(depth>64)throw new Error("Scope dependency traversal exceeds 64 levels.");if(visiting.has(id))throw new Error("Scope precedence dependency cycle detected.");if(visited.has(id))return;visiting.add(id);for(const next of graph.get(id)??[])walk(next,depth+1);visiting.delete(id);visited.add(id);};for(const id of graph.keys())walk(id,0);
  }

  export function buildScopeProjection(scope: ScopeDomain, profile: PresentationProfile): ScopeProjection {
    validateScopeDomain(scope);
    const allowed=(item:ScopeRecordBase)=>profile==="advisor"||profile==="reviewer"?true:item.visibility==="client-safe"||item.visibility==="approved-for-client-presentation";
    const clean=<T extends ScopeRecordBase>(items:T[]):T[]=>items.filter(allowed).map(item=>{const clone=deepClone(item);if(profile==="client"){clone.provenance={origin_kind:"scope-local",source_refs:[],source_label:"Reviewed Scope context",asserted_at:clone.updated_at,asserted_by:"system"};if("advisor_analysis" in clone)(clone as unknown as ScopeDecision).advisor_analysis="";if("reviewer_comment" in clone)(clone as unknown as ScopeDecision).reviewer_comment="";}return clone;});
    const projection:ScopeProjection={projection_kind:SCOPE_PROJECTION_KIND,projection_version:SCOPE_PROJECTION_VERSION,workspace:"scope",profile,generated_at:nowIso(),source_scope_id:scope.scope_id,source_scope_revision:scope.revision,boundaries:clean(scope.boundaries),systems:clean(scope.systems),assets:clean(scope.assets),providers:clean(scope.providers),services:clean(scope.services),locations:clean(scope.locations),enclaves:clean(scope.enclaves),data_flows:clean(scope.data_flows),assumptions:profile==="client"?[]:clean(scope.assumptions),unknowns:clean(scope.unknowns),dependencies:profile==="client"?[]:clean(scope.dependencies),diagrams:clean(scope.diagrams).filter(item=>profile!=="client"||item.diagram_review_state==="reviewed"||item.diagram_review_state==="approved-representation"),decisions:clean(scope.decisions).filter(item=>profile!=="client"||Boolean(item.client_safe_rationale)),candidates:profile==="client"?[]:clean(scope.candidates),counts:{},next_work:[],qualifications:["Scope records are locally governed workflow records, not an assessment conclusion.","Presentation profiles are not access control or safe project distribution."]};
    projection.counts={boundaries:projection.boundaries.length,systems:projection.systems.length,assets:projection.assets.length,providers:projection.providers.length,services:projection.services.length,flows:projection.data_flows.length,unknowns:projection.unknowns.length,decisions:projection.decisions.length,diagrams:projection.diagrams.length,candidates:projection.candidates.length};
    projection.next_work=scopeNextWork(projection);return projection;
  }
  export function scopeNextWork(projection: ScopeProjection): ScopeNextWorkItem[] {
    const items:ScopeNextWorkItem[]=[];
    for(const candidate of projection.candidates.filter(item=>item.candidate_state==="received"||item.candidate_state==="in-review"))items.push({kind:"candidate",record_ref:candidate.id,title:`Review ${candidate.label}`,detail:"A source proposal is waiting for Scope-owned disposition.",priority:2});
    for(const decision of projection.decisions.filter(item=>["draft","proposed","awaiting-confirmation","awaiting-review","returned"].includes(item.decision_state)))items.push({kind:"decision",record_ref:decision.id,title:`Decide ${decision.label}`,detail:`Decision state: ${decision.decision_state}.`,priority:decision.currency_state==="conflicted"?0:2});
    for(const unknown of projection.unknowns.filter(item=>item.resolution_state!=="resolved"&&item.resolution_state!=="wont-resolve"&&item.resolution_state!=="superseded"))items.push({kind:"unknown",record_ref:unknown.id,title:unknown.label,detail:`${unknown.blocking_effect}; workflow priority ${unknown.priority}.`,priority:unknown.blocking_effect==="blocks-decision"?1:3});
    for(const diagram of projection.diagrams.filter(item=>item.currency_state==="stale"))items.push({kind:"diagram",record_ref:diagram.id,title:`Refresh ${diagram.label}`,detail:"The diagram references a changed exact record version.",priority:2});
    if(!items.length)items.push({kind:"informational",record_ref:projection.source_scope_id,title:"No visible Scope action is currently queued",detail:"This is a factual workflow state, not readiness or compliance.",priority:9});
    return items.sort((a,b)=>a.priority-b.priority||a.title.localeCompare(b.title));
  }

  export function createScopeAsset(scope:ScopeDomain,input:{label:string;asset_kind:ScopeAsset["asset_kind"];visibility:Visibility;description?:string},profile:PresentationProfile):ScopeAsset{
    const asset={...scopeBase("scope-asset",input.label,input.visibility,profile),description:sanitizePlainText(input.description??"",100000),asset_kind:input.asset_kind,system_refs:[],provider_refs:[],service_refs:[],location_refs:[],flow_refs:[],identifier_summary:"",cui_function_summary:"",security_function_summary:"",asset_category:"unclassified",scope_disposition:"unknown",boundary_relationship:"unknown",implementation_location:"unknown",responsibility_model:"unassigned",decision_refs:[],client_label:input.visibility==="advisor-only"?"":sanitizePlainText(input.label,500),plain_language_summary:""} satisfies ScopeAsset;scope.assets.push(asset);touchScope(scope);return asset;
  }
  export function createScopeCandidate(scope:ScopeDomain,input:{source_domain:ScopeCandidate["source_domain"];source_ref:ScopeVersionedRef;kind:ScopeCandidate["candidate_kind"];label:string;values:Record<string,string>;visibility:Visibility},profile:PresentationProfile):ScopeCandidate{
    const candidate={...scopeBase("scope-candidate",input.label,input.visibility,profile),source_domain:input.source_domain,source_candidate_ref:deepClone(input.source_ref),candidate_kind:input.kind,proposed_values:deepClone(input.values),candidate_state:"received",target_record_refs:[],target_decision_ref:null,decision_rationale:"",return_comment:"",source_receipt_ref:null} satisfies ScopeCandidate;candidate.provenance=scopeProvenance(input.source_domain,input.label,profile,[input.source_ref]);scope.candidates.push(candidate);touchScope(scope);return candidate;
  }
  export function decideScopeCandidate(scope:ScopeDomain,id:string,action:"accept"|"modify"|"reject"|"return",profile:PresentationProfile,reason:string):ScopeCandidate{
    const candidate=scope.candidates.find(item=>item.id===id);if(!candidate)throw new Error("Scope candidate not found.");if(candidate.candidate_state!=="received"&&candidate.candidate_state!=="in-review")throw new Error("Scope candidate is not decision-ready.");
    const rationale=sanitizePlainText(reason,100000);if(!rationale)throw new Error("Scope candidate disposition requires rationale.");candidate.decision_rationale=rationale;candidate.updated_at=nowIso();candidate.updated_by_profile=profile;candidate.version++;
    if(action==="reject")candidate.candidate_state="rejected";else if(action==="return"){candidate.candidate_state="returned";candidate.return_comment=rationale;}else{candidate.candidate_state=action==="modify"?"modified-and-accepted":"accepted";if(candidate.candidate_kind==="asset"){const asset=createScopeAsset(scope,{label:candidate.proposed_values.label??candidate.label,asset_kind:(candidate.proposed_values.asset_kind as ScopeAsset["asset_kind"])||"other",visibility:candidate.visibility,description:candidate.proposed_values.description},profile);candidate.target_record_refs=[asset.id];}else if(candidate.candidate_kind==="unknown"){const unknown={...scopeBase("scope-unknown",candidate.proposed_values.label??candidate.label,candidate.visibility,profile),unknown_kind:"other",statement:candidate.proposed_values.statement??candidate.label,priority:"medium",blocking_effect:"blocks-decision",owner_ref:null,due_at:null,affected_refs:[],resolution_state:"open",resolution_summary:"",resolving_decision_ref:null,session_question_candidate_ref:null} satisfies ScopeUnknown;scope.unknowns.push(unknown);candidate.target_record_refs=[unknown.id];}}
    touchScope(scope);return candidate;
  }
  export function createScopeDecision(scope:ScopeDomain,input:{label:string;type:ScopeDecision["decision_type"];affected:ScopeVersionedRef[];changes:ScopeFieldChange[];rationale:string;client_rationale:string;unknown_refs?:string[]},profile:PresentationProfile):ScopeDecision{
    const decision={...scopeBase("scope-decision",input.label,"client-safe",profile),decision_type:input.type,decision_state:"proposed",affected_record_refs:deepClone(input.affected),field_changes:deepClone(input.changes),rationale:sanitizePlainText(input.rationale,100000),client_safe_rationale:sanitizePlainText(input.client_rationale,100000),source_basis_refs:[],assumption_refs:[],unknown_refs:deepClone(input.unknown_refs??[]),dependency_refs:[],advisor_analysis:"",client_confirmation_ref:null,reviewer_disposition:"not-requested",reviewer_comment:"",accepted_at:null,accepted_by_profile:null,supersedes_decision_ref:null,superseded_by_decision_ref:null} satisfies ScopeDecision;scope.decisions.push(decision);touchScope(scope);return decision;
  }
  export function acceptScopeDecision(scope:ScopeDomain,id:string,profile:PresentationProfile,modify?:ScopeFieldChange[]):ScopeDecision{
    const decision=scope.decisions.find(item=>item.id===id);if(!decision)throw new Error("Scope decision not found.");if(!["draft","proposed","awaiting-confirmation","awaiting-review","returned"].includes(decision.decision_state))throw new Error("Scope decision is not acceptance-ready.");const map=scopeRecordMap(scope);const changes=modify?deepClone(modify):decision.field_changes;
    for(const ref of decision.affected_record_refs){const record=map.get(ref.id);if(!record||record.version!==ref.version)throw new Error("Scope decision is stale because an affected exact version changed.");for(const change of changes){const key=`${ref.id}:${change.field}`;for(const other of scope.decisions){if(other.id===decision.id||other.decision_state!=="accepted"||other.currency_state!=="current")continue;if(other.affected_record_refs.some(item=>item.id===ref.id)&&other.field_changes.some(item=>item.field===change.field))throw new Error(`A conflicting accepted decision already governs ${key}.`);}if(!scopeAuthorityFieldAllowed(change.field))throw new Error(`Unsupported Scope authority field: ${change.field}.`);(record as unknown as Record<string,unknown>)[change.field]=change.new_value;if("decision_refs" in record&&!((record as unknown as {decision_refs:string[]}).decision_refs.includes(decision.id)))(record as unknown as {decision_refs:string[]}).decision_refs.push(decision.id);record.version++;record.updated_at=nowIso();record.updated_by_profile=profile;}}
    decision.field_changes=changes;decision.decision_state="accepted";decision.accepted_at=nowIso();decision.accepted_by_profile=profile;decision.review_state="reviewed";decision.updated_at=nowIso();decision.updated_by_profile=profile;decision.version++;touchScope(scope);refreshScopeCurrency(scope);validateScopeDomain(scope);return decision;
  }
  function scopeAuthorityFieldAllowed(field:string):boolean{return ["asset_category","scope_disposition","boundary_relationship","implementation_location","responsibility_model","diagram_review_state","resolution_state"].includes(field);}
  export function supersedeScopeDecision(scope:ScopeDomain,priorId:string,next:ScopeDecision,profile:PresentationProfile):void{const prior=scope.decisions.find(item=>item.id===priorId);if(!prior)throw new Error("Prior Scope decision not found.");prior.decision_state="superseded";prior.currency_state="superseded";prior.superseded_by_decision_ref=next.id;prior.updated_at=nowIso();prior.version++;next.supersedes_decision_ref=prior.id;next.updated_by_profile=profile;touchScope(scope);}
  export function refreshScopeCurrency(scope:ScopeDomain):void{const map=scopeRecordMap(scope);for(const decision of scope.decisions){if(decision.decision_state==="accepted"&&decision.currency_state!=="superseded"){decision.currency_state=decision.affected_record_refs.every(ref=>map.get(ref.id)?.version===ref.version||decision.affected_record_refs.some(item=>item.id===ref.id&&item.version+1===map.get(ref.id)?.version))?"current":"stale";}}for(const diagram of scope.diagrams){const stale=diagram.included_record_refs.filter(ref=>map.get(ref.id)?.version!==ref.version);diagram.stale_ref_diagnostics=stale.map(ref=>`${ref.id} expected version ${ref.version}, current ${map.get(ref.id)?.version??"missing"}`);diagram.currency_state=stale.length?"stale":"current";}}
  export function createScopeDiagram(scope:ScopeDomain,label:string,recordIds:string[],profile:PresentationProfile):ScopeDiagram{const map=scopeRecordMap(scope);const refs=recordIds.map(id=>{const record=map.get(id);if(!record)throw new Error(`Cannot diagram missing Scope record ${id}.`);return{id,version:record.version};}).sort((a,b)=>a.id.localeCompare(b.id));const nodes=refs.map((ref,index)=>({node_id:`diagram-node-${index+1}`,record_ref:ref,proposal_label:"",x:80+(index%4)*220,y:80+Math.floor(index/4)*140,width:180,height:72}));const edges:ScopeDiagramEdge[]=[];for(const flow of scope.data_flows.filter(item=>recordIds.includes(item.id))){const from=nodes.find(node=>node.record_ref?.id===flow.source_ref),to=nodes.find(node=>node.record_ref?.id===flow.destination_ref);if(from&&to)edges.push({edge_id:newId("diagram-edge"),from_node_id:from.node_id,to_node_id:to.node_id,relationship_ref:flow.id,proposal_label:""});}const alternative=`${label}. Includes ${refs.map(ref=>map.get(ref.id)?.label??ref.id).join(", ")}. ${edges.length} recorded relationship${edges.length===1?"":"s"}.`;const diagram={...scopeBase("scope-diagram",label,"client-safe",profile),diagram_kind:"boundary",origin:"deterministic-generated",purpose:"Represent selected Scope records at exact versions.",included_record_refs:refs,node_records:nodes,edge_records:edges,annotations:[],text_alternative:alternative,diagram_review_state:"draft",approval_decision_ref:null,stale_ref_diagnostics:[]} satisfies ScopeDiagram;return diagram;}
  export function publishScopeUnknownQuestion(scope:ScopeDomain,unknownId:string,interviews:InterviewSessionsDomain,profile:PresentationProfile):string{
    const unknown=scope.unknowns.find(item=>item.id===unknownId);if(!unknown)throw new Error("Scope unknown not found.");if(unknown.session_question_candidate_ref)return unknown.session_question_candidate_ref;const candidate=createScopeCandidate(scope,{source_domain:"scope-local",source_ref:{id:unknown.id,version:unknown.version},kind:"question-handoff",label:`Question: ${unknown.label}`,values:{prompt:unknown.statement,rationale:`Resolve Scope unknown ${unknown.id}.`,expected_participants:"Advisor-selected participants"},visibility:unknown.visibility},profile);candidate.candidate_state="accepted";candidate.target_record_refs=[];candidate.decision_rationale="Published as a Session Planner question candidate; no live agenda insertion.";unknown.session_question_candidate_ref=candidate.id;unknown.updated_at=nowIso();unknown.version++;void interviews;touchScope(scope);return candidate.id;
  }
  function touchScope(scope:ScopeDomain):void{scope.updated_at=nowIso();scope.revision++;}

  function unsupportedConclusion(value:string):boolean{return /\b(met|not met|compliant|noncompliant|ready|readiness score|risk score|certified|evidence sufficient|implemented effectively)\b/i.test(value);}
  export async function previewScopePackage(bytes:Uint8Array,name:string):Promise<ScopeImportPreview>{
    if(bytes.length>10*1024*1024)throw new Error("Scope package exceeds the bounded preview size.");const text=decodeUtf8(bytes);const parsed=parseStrictJson(text);if(!isRecord(parsed))throw new Error("Scope package root must be an object.");const kind=parsed.kind;const version=parsed.version;if((kind!=="l2g_scope_context_v1"&&kind!=="l2g_scope_return_package_v1")||version!=="1.0")throw new Error("Unsupported Scope package kind or version.");const sha=await sha256Hex(bytes);const records:ScopeImportCandidate[]=[];const rejected:string[]=[];const warnings:string[]=[];const sourceArrays:Array<[ScopeCandidate["candidate_kind"],unknown,string]>= [["asset",parsed.assets,"assets"],["provider",parsed.providers,"providers"],["flow",parsed.flows??parsed.cui_flows,"flows"],["unknown",parsed.unknowns??parsed.review_items,"unknowns"],["decision",parsed.scoping_decision_ledger_v1,"scoping_decision_ledger_v1"],["question-handoff",parsed.pre_workshop_question_package_v1,"pre_workshop_question_package_v1"]];
    for(const [family,raw,path] of sourceArrays){const list=Array.isArray(raw)?raw:isRecord(raw)&&Array.isArray(raw.records)?raw.records:[];for(let index=0;index<list.length;index++){const item=list[index];if(!isRecord(item)){rejected.push(`${path}[${index}] is not an object.`);continue;}const label=sanitizePlainText(String(item.label??item.name??item.title??item.question??`${family} ${index+1}`),500);const valueText=stableStringify(item,0);if(unsupportedConclusion(valueText)){rejected.push(`${path}[${index}] contains unsupported conclusion language.`);continue;}records.push({import_record_id:`${path}:${String(item.id??item.asset_id??item.provider_id??item.flow_id??item.decision_id??item.question_id??index+1)}`,family,label,proposed_values:{label,description:sanitizePlainText(String(item.description??item.summary??item.rationale??item.question??""),100000),asset_kind:sanitizePlainText(String(item.asset_kind??item.type??"other"),100)},source_path:`${path}[${index}]`,selected:true,treatment:"create",exact_target_ref:null,ambiguity:[]});}}
    if(records.length>10000)throw new Error("Scope import exceeds 10,000 reviewed records.");if(!records.length)warnings.push("The recognized package contains no supported Scope records.");return{package_kind:kind,package_version:"1.0",package_name:sanitizePlainText(name,500),package_size_bytes:bytes.length,package_sha256:sha,producer:sanitizePlainText(String(parsed.producer??parsed.application??"unknown producer"),500),records,warnings,rejected};
  }
  export function applyScopeImport(scope:ScopeDomain,preview:ScopeImportPreview,profile:PresentationProfile):ScopeImportReceipt{
    const selected=preview.records.filter(item=>item.selected&&item.treatment!=="reject");for(const item of selected)if(item.ambiguity.length&&!item.exact_target_ref&&item.treatment!=="keep-separate")throw new Error(`Resolve ambiguous import record ${item.import_record_id} before apply.`);const before=stableStringify(scope,0);const clone=deepClone(scope);try{for(const item of selected){if(item.treatment==="link"){if(!item.exact_target_ref||!scopeRecordMap(clone).has(item.exact_target_ref))throw new Error(`Import link target is invalid for ${item.import_record_id}.`);continue;}createScopeCandidate(clone,{source_domain:"compatibility-import",source_ref:{id:`scope-import-source-${preview.package_sha256.slice(0,16)}-${selected.indexOf(item)+1}`,version:1},kind:item.family,label:item.label,values:item.proposed_values,visibility:"advisor-only"},profile);}const receipt={...scopeBase("scope-import",preview.package_name,"advisor-only",profile),package_kind:preview.package_kind,package_version:"1.0",package_name:preview.package_name,package_size_bytes:preview.package_size_bytes,package_sha256:preview.package_sha256,selected_record_ids:selected.map(item=>item.import_record_id),rejected_record_ids:[...preview.records.filter(item=>!item.selected||item.treatment==="reject").map(item=>item.import_record_id),...preview.rejected],diagnostics:[...preview.warnings,...preview.rejected],status:selected.length===preview.records.length?"applied":"partially-applied-reviewed-subset",command_ref:null} satisfies ScopeImportReceipt;clone.import_receipts.push(receipt);touchScope(clone);validateScopeDomain(clone);Object.assign(scope,clone);return receipt;}catch(error){if(stableStringify(scope,0)!==before)throw new Error("Scope import failure mutated governed state.");throw error;}
  }
}
