# L2G Scope v1 — Field-Level Contract

## Status

Design contract for issue #139. It becomes implementation authority only when the complete v0.6 design package is reviewed and merged.

## Contract identity

- archive path: `domains/scope.json`
- schema kind: `l2g_scope_v1`
- schema version: `1.0`
- projection kind: `l2g_scope_projection_v1`
- projection version: `1.0`
- owner: Scope domain
- data posture: synthetic-only; production, client, FCI, and CUI use unauthorized

## Contract principles

1. Scope is the sole authority for accepted boundary membership and Scope disposition inside the Integrated Suite.
2. Imported context, Evidence-derived content, intake responses, Interview statements, Advisor analysis, and generated diagrams remain source material or candidates until a Scope-owned decision accepts them.
3. Asset category, scope disposition, boundary relationship, implementation location, responsibility, lifecycle, operational state, review state, visibility, currency/integrity, and decision state are separate fields.
4. Display labels are not identity. All governed records use opaque immutable type-prefixed IDs.
5. A diagram represents referenced records and exact versions; it cannot create or silently modify those records.
6. All cross-domain references are immutable IDs plus exact source version or source snapshot identity.
7. All imported batches preview before apply and apply atomically.
8. Client projections are constructed before counts, search, rendering, inspection, differences, history summaries, focus, live regions, or accessibility-tree work.
9. This contract carries no readiness, compliance, risk, scoring, certification, evidence-sufficiency, implementation, or Met/Not Met conclusion.

## Root document

| Field | Type | Required | Rules |
|---|---|---:|---|
| `kind` | string | yes | Exact `l2g_scope_v1` |
| `version` | string | yes | Exact `1.0` |
| `domain_id` | string | yes | Exact project-domain identifier; immutable |
| `project_id` | string | yes | Must match project root |
| `created_at` | RFC 3339 string | yes | UTC-normalized |
| `updated_at` | RFC 3339 string | yes | UTC-normalized; not earlier than `created_at` |
| `revision` | integer | yes | Non-negative, monotonically increasing under commands |
| `boundaries` | array | yes | Boundary records |
| `systems` | array | yes | System records |
| `assets` | array | yes | Asset records |
| `providers` | array | yes | Provider records |
| `services` | array | yes | Service records |
| `locations` | array | yes | Location records |
| `enclaves` | array | yes | Enclave records |
| `data_flows` | array | yes | Data-flow records |
| `assumptions` | array | yes | Scope assumptions |
| `unknowns` | array | yes | Unresolved Scope unknowns |
| `dependencies` | array | yes | Directed typed relationships |
| `diagrams` | array | yes | Governed diagram representations |
| `decisions` | array | yes | Scope decision ledger |
| `candidates` | array | yes | Scope-owned target candidates |
| `import_receipts` | array | yes | Stable-package preview/apply receipts |
| `projection_state` | object | yes | Derived generation metadata only; no hidden index/query content |
| `extensions` | object | yes | Namespaced optional content; prototype keys forbidden |

## Common governed-record envelope

Every governed collection record contains the following fields unless a stricter record rule applies.

| Field | Type | Required | Rules |
|---|---|---:|---|
| `id` | string | yes | Opaque immutable type-prefixed ID |
| `version` | integer | yes | Positive; increments when governed content changes |
| `label` | string | yes | Human-readable; not identity |
| `description` | string | no | Plain text only |
| `lifecycle` | enum | yes | `draft`, `active`, `inactive`, `archived`, `superseded` |
| `operational_state` | enum | yes | `not-started`, `in-progress`, `blocked`, `waiting`, `complete`, `cancelled`, `not-applicable` |
| `review_state` | enum | yes | `not-reviewed`, `pending`, `in-review`, `reviewed`, `changes-requested`, `rejected`, `closed` |
| `visibility` | enum | yes | `advisor-only`, `reviewer-visible`, `client-visible` |
| `currency_state` | enum | yes | `current`, `stale`, `conflicted`, `unverified`, `superseded` |
| `source_refs` | array | yes | Validated immutable references; may be empty only for locally created records |
| `provenance` | object | yes | Origin kind, source record/package refs, asserted profile, timestamp, recording/import method |
| `created_at` | RFC 3339 | yes | UTC-normalized |
| `updated_at` | RFC 3339 | yes | UTC-normalized |
| `created_by_profile` | enum | yes | `advisor`, `reviewer`, `client`, `system-migration` |
| `updated_by_profile` | enum | yes | Same vocabulary |
| `supersedes_id` | string/null | yes | Same record family only unless explicit cross-family rule exists |
| `superseded_by_id` | string/null | yes | Reciprocal when populated |
| `tags` | string array | yes | Bounded plain-text tags; no authority semantics |
| `extensions` | object | yes | Namespaced; forbidden keys rejected |

### ID prefixes

| Record | Prefix |
|---|---|
| Boundary | `scope-boundary-` |
| System | `scope-system-` |
| Asset | `scope-asset-` |
| Provider | `scope-provider-` |
| Service | `scope-service-` |
| Location | `scope-location-` |
| Enclave | `scope-enclave-` |
| Data flow | `scope-flow-` |
| Assumption | `scope-assumption-` |
| Unknown | `scope-unknown-` |
| Dependency | `scope-dependency-` |
| Diagram | `scope-diagram-` |
| Decision | `scope-decision-` |
| Candidate | `scope-candidate-` |
| Import receipt | `scope-import-` |

## Separate state dimensions

### Asset category

`asset_category` values:

- `cui-asset`
- `security-protection-asset`
- `contractor-risk-managed-asset`
- `specialized-asset`
- `out-of-scope-asset`
- `unclassified`

Rules:

- `unclassified` is the default for a new or imported candidate.
- A non-default accepted category requires an accepted Scope decision reference.
- Category does not imply implementation, effectiveness, evidence sufficiency, or assessment treatment beyond the recorded Scope decision.

### Scope disposition

`scope_disposition` values:

- `proposed-in-scope`
- `accepted-in-scope`
- `proposed-out-of-scope`
- `accepted-out-of-scope`
- `unknown`
- `disputed`
- `deferred`
- `superseded`

Rules:

- `accepted-in-scope` and `accepted-out-of-scope` require one current accepted decision governing the exact record version.
- A source candidate may propose but cannot directly set an accepted value.
- `superseded` requires a reciprocal supersession link.

### Boundary relationship

`boundary_relationship` values:

- `inside`
- `outside`
- `crosses-boundary`
- `supports-boundary`
- `inherits-into-boundary`
- `shared`
- `unknown`
- `not-applicable`

### Implementation location

`implementation_location` values:

- `client-managed`
- `provider-managed`
- `co-managed`
- `inherited`
- `external`
- `unknown`
- `not-applicable`

### Responsibility model

`responsibility_model` values:

- `client`
- `provider`
- `shared`
- `inherited`
- `unassigned`
- `disputed`
- `not-applicable`

Responsibility is Scope context only. It does not establish practice implementation, control ownership conclusions, or evidence sufficiency.

## Boundary record

| Field | Type | Required | Rules |
|---|---|---:|---|
| `id` | string | yes | Prefix `scope-boundary-` |
| `boundary_kind` | enum | yes | `cui-environment`, `security-protection`, `corporate-support`, `development-test`, `provider-hosted`, `other` |
| `purpose` | string | yes | Plain-language purpose |
| `scope_disposition` | enum | yes | Separate vocabulary above |
| `included_refs` | ref array | yes | Scope object refs only |
| `excluded_refs` | ref array | yes | Scope object refs only; cannot overlap included refs at same accepted version |
| `entry_exit_point_refs` | ref array | yes | Assets/services/flows/locations/enclaves |
| `location_refs` | ref array | yes | Existing locations |
| `enclave_refs` | ref array | yes | Existing enclaves |
| `decision_refs` | ref array | yes | Scope decision refs; accepted disposition requires current accepted decision |
| `assumption_refs` | ref array | yes | Existing assumptions |
| `unknown_refs` | ref array | yes | Existing unknowns |
| `diagram_refs` | ref array | yes | Existing diagrams |
| `plain_language_summary` | string | no | Required for Client-visible record |
| `client_label` | string | no | Required for Client-visible record |

Invariant: an accepted boundary cannot include an object whose current accepted disposition is `accepted-out-of-scope` unless an explicit accepted exception decision explains the conflict.

## System record

| Field | Type | Required | Rules |
|---|---|---:|---|
| `id` | string | yes | Prefix `scope-system-` |
| `system_kind` | enum | yes | `business-system`, `platform`, `application`, `network`, `identity`, `security`, `management`, `other` |
| `owner_org_ref` | ref/null | yes | Engagement organization ref or null |
| `asset_refs` | ref array | yes | Existing assets |
| `service_refs` | ref array | yes | Existing services |
| `provider_refs` | ref array | yes | Existing providers |
| `location_refs` | ref array | yes | Existing locations/enclaves |
| `scope_disposition` | enum | yes | Separate dimension |
| `boundary_relationship` | enum | yes | Separate dimension |
| `implementation_location` | enum | yes | Separate dimension |
| `responsibility_model` | enum | yes | Separate dimension |
| `decision_refs` | ref array | yes | Required for accepted authoritative values |

## Asset record

| Field | Type | Required | Rules |
|---|---|---:|---|
| `id` | string | yes | Prefix `scope-asset-` |
| `asset_kind` | enum | yes | `endpoint`, `server`, `virtual-machine`, `container`, `network-device`, `security-tool`, `identity-object`, `data-store`, `repository`, `saas-tenant`, `cloud-resource`, `mobile-device`, `removable-media`, `facility-device`, `other` |
| `asset_category` | enum | yes | Separate category vocabulary |
| `scope_disposition` | enum | yes | Separate disposition vocabulary |
| `boundary_relationship` | enum | yes | Separate relationship vocabulary |
| `implementation_location` | enum | yes | Separate location vocabulary |
| `responsibility_model` | enum | yes | Separate responsibility vocabulary |
| `system_refs` | ref array | yes | Existing systems |
| `provider_refs` | ref array | yes | Existing providers |
| `service_refs` | ref array | yes | Existing services |
| `location_refs` | ref array | yes | Existing locations/enclaves |
| `flow_refs` | ref array | yes | Existing flows |
| `identifier_summary` | string | no | Sanitized label; no local paths/secrets |
| `cui_function_summary` | string | no | Descriptive context only |
| `security_function_summary` | string | no | Descriptive context only; no effectiveness conclusion |
| `decision_refs` | ref array | yes | Required for accepted category/disposition |

## Provider record

| Field | Type | Required | Rules |
|---|---|---:|---|
| `id` | string | yes | Prefix `scope-provider-` |
| `provider_kind` | enum | yes | `csp`, `msp`, `mssp`, `saas`, `paas`, `iaas`, `consultant`, `subcontractor`, `data-center`, `telecom`, `other` |
| `engagement_org_ref` | ref/null | yes | Optional link to Engagement organization authority |
| `service_refs` | ref array | yes | Existing services |
| `system_refs` | ref array | yes | Existing systems |
| `asset_refs` | ref array | yes | Existing assets |
| `responsibility_model` | enum | yes | Scope context only |
| `implementation_location` | enum | yes | Separate dimension |
| `scope_disposition` | enum | yes | Separate dimension |
| `support_access_summary` | string | no | Plain text; no credentials/secrets |
| `inheritance_summary` | string | no | Context only; no implementation conclusion |
| `contract_reference_refs` | ref array | yes | Evidence refs only, original document remains external |
| `decision_refs` | ref array | yes | Required for accepted authoritative values |

## Service record

| Field | Type | Required | Rules |
|---|---|---:|---|
| `id` | string | yes | Prefix `scope-service-` |
| `service_kind` | enum | yes | `hosting`, `identity`, `network`, `security`, `logging`, `backup`, `development`, `support`, `data-processing`, `collaboration`, `other` |
| `provider_ref` | ref/null | yes | Existing provider or null for client-managed service |
| `consumer_refs` | ref array | yes | Systems/assets/enclaves |
| `scope_disposition` | enum | yes | Separate dimension |
| `boundary_relationship` | enum | yes | Separate dimension |
| `implementation_location` | enum | yes | Separate dimension |
| `responsibility_model` | enum | yes | Separate dimension |
| `inheritance_claims` | array | yes | Claims remain context until accepted decision; no practice conclusion |
| `decision_refs` | ref array | yes | Required for accepted authoritative values |

## Location and enclave records

Location fields include `location_kind`, sanitized address/region description, jurisdiction/region, provider/client management context, related systems/assets/services, disposition, boundary relationship, and decision refs.

Enclave fields include `enclave_kind`, purpose, network/security-zone description, related locations, systems/assets/services, entry/exit points, disposition, boundary relationship, and decision refs.

No absolute local filesystem path, secret, credential, private key, token, or full sensitive network diagram source may be stored.

## Data-flow record

| Field | Type | Required | Rules |
|---|---|---:|---|
| `id` | string | yes | Prefix `scope-flow-` |
| `source_ref` | ref | yes | Existing Scope object |
| `destination_ref` | ref | yes | Existing Scope object; may not equal source unless loopback explicitly justified |
| `intermediary_refs` | ref array | yes | Ordered existing Scope objects |
| `data_description` | string | yes | Plain text; do not store CUI content |
| `data_classification_label` | enum | yes | `cui-asserted`, `fci-asserted`, `non-cui-business`, `mixed-asserted`, `unknown`; locally asserted only |
| `transfer_mechanism` | string | no | Plain text |
| `protocol_summary` | string | no | Plain text |
| `protection_summary` | string | no | Descriptive only; no effectiveness conclusion |
| `boundary_crossing_refs` | ref array | yes | Existing boundaries/entry-exit points |
| `direction` | enum | yes | `one-way`, `bidirectional`, `unknown` |
| `frequency` | enum | yes | `continuous`, `scheduled`, `event-driven`, `manual`, `rare`, `unknown` |
| `scope_disposition` | enum | yes | Separate dimension |
| `unknown_refs` | ref array | yes | Existing unknowns |
| `decision_refs` | ref array | yes | Required for accepted authoritative treatment |

## Assumption record

Required fields include statement, rationale, affected refs, source basis, owner, due/review date, lifecycle, review state, resolution state (`open`, `validated`, `invalidated`, `superseded`, `closed`), and resolving decision ref.

A validated assumption remains an assumption with validation evidence; it does not silently become an object fact without the object/decision command.

## Unknown record

| Field | Type | Required | Rules |
|---|---|---:|---|
| `id` | string | yes | Prefix `scope-unknown-` |
| `unknown_kind` | enum | yes | `boundary`, `asset`, `provider`, `service`, `flow`, `location`, `responsibility`, `inheritance`, `classification`, `source-conflict`, `other` |
| `statement` | string | yes | Plain text |
| `priority` | enum | yes | `low`, `medium`, `high`, `critical` — workflow priority only, not risk score |
| `blocking_effect` | enum | yes | `none`, `blocks-decision`, `blocks-diagram-approval`, `blocks-session`, `blocks-handoff` |
| `owner_ref` | ref/null | yes | Engagement participant/org ref or null |
| `due_at` | RFC 3339/null | yes | Optional |
| `affected_refs` | ref array | yes | Existing records |
| `resolution_state` | enum | yes | `open`, `investigating`, `answered-unreviewed`, `resolved`, `wont-resolve`, `superseded` |
| `resolution_summary` | string | no | Required when resolved/wont-resolve |
| `resolving_decision_ref` | ref/null | yes | Required when accepted Scope state changes |
| `session_question_candidate_ref` | ref/null | yes | Optional source-domain candidate; not a duplicate question authority |

## Dependency record

| Field | Type | Required | Rules |
|---|---|---:|---|
| `id` | string | yes | Prefix `scope-dependency-` |
| `from_ref` | ref | yes | Existing governed record |
| `to_ref` | ref | yes | Existing governed record |
| `relationship_kind` | enum | yes | `depends-on`, `provided-by`, `hosted-on`, `contains`, `connects-to`, `flows-through`, `supports`, `inherits-from`, `located-at`, `governed-by`, `represented-by`, `conflicts-with`, `supersedes` |
| `precedence_bearing` | boolean | yes | Cycles forbidden when true |
| `rationale` | string | yes | Plain text |
| `decision_ref` | ref/null | yes | Required when relationship is authoritative |

## Diagram record

| Field | Type | Required | Rules |
|---|---|---:|---|
| `id` | string | yes | Prefix `scope-diagram-` |
| `diagram_kind` | enum | yes | `boundary`, `system-context`, `asset`, `provider-service`, `data-flow`, `enclave`, `custom` |
| `origin` | enum | yes | `manual`, `deterministic-generated`, `imported-layout` |
| `purpose` | string | yes | Plain text |
| `included_record_refs` | versioned ref array | yes | Exact Scope record versions |
| `node_records` | array | yes | Each node references a Scope record or explicit proposal placeholder |
| `edge_records` | array | yes | Each edge references a dependency/flow or explicit proposal placeholder |
| `annotations` | array | yes | Plain text, bounded, visibility-aware |
| `layout` | object | yes | Positions, grouping, zoom baseline; presentation only |
| `text_alternative` | string | yes | Includes objects, relationships, crossings, unresolved placeholders, stale refs |
| `diagram_review_state` | enum | yes | `draft`, `proposed`, `reviewed`, `approved-representation`, `changes-requested`, `superseded`, `archived` |
| `currency_state` | enum | yes | `current`, `stale`, `conflicted`, `unverified`, `superseded` |
| `approval_decision_ref` | ref/null | yes | Required for `approved-representation` |
| `stale_ref_diagnostics` | array | yes | Exact version differences; hidden before Client projection |

Invariant: generated or imported node/edge content never creates Scope records. Unknown object labels become explicit proposal placeholders or are rejected.

## Decision record

| Field | Type | Required | Rules |
|---|---|---:|---|
| `id` | string | yes | Prefix `scope-decision-` |
| `decision_type` | enum | yes | `boundary-membership`, `scope-disposition`, `asset-category`, `boundary-relationship`, `implementation-location`, `responsibility`, `flow-treatment`, `assumption-resolution`, `unknown-resolution`, `dependency`, `diagram-approval`, `other` |
| `decision_state` | enum | yes | `draft`, `proposed`, `awaiting-confirmation`, `awaiting-review`, `accepted`, `rejected`, `returned`, `withdrawn`, `superseded`, `archived` |
| `affected_record_refs` | versioned ref array | yes | Exact current versions required at acceptance |
| `field_changes` | array | yes | Explicit path, old value, proposed/accepted value |
| `rationale` | string | yes | Plain text |
| `source_basis_refs` | array | yes | Evidence/source/intake/interview/candidate refs |
| `assumption_refs` | ref array | yes | Existing Scope assumptions |
| `unknown_refs` | ref array | yes | Existing Scope unknowns |
| `dependency_refs` | ref array | yes | Existing dependencies |
| `advisor_analysis` | string | no | Advisor-only unless separately approved plain-language rationale exists |
| `client_confirmation_ref` | ref/null | yes | Exact-version locally asserted confirmation; not signature |
| `reviewer_disposition` | enum | yes | `not-requested`, `pending`, `concur`, `concur-with-changes`, `return`, `reject` |
| `reviewer_comment` | string | no | Visibility-aware |
| `accepted_at` | RFC 3339/null | yes | Required only when accepted |
| `accepted_by_profile` | enum/null | yes | `advisor` or `reviewer`; locally asserted |
| `supersedes_decision_ref` | ref/null | yes | Required when superseding |
| `superseded_by_decision_ref` | ref/null | yes | Reciprocal |
| `currency_state` | enum | yes | Stale when source/affected/dependency version drifts |

Acceptance invariants:

- all affected record refs must exist at the exact versions recorded;
- no conflicting current accepted decision may govern the same field unless this decision supersedes it atomically;
- unsupported target fields or conclusion language reject before mutation;
- acceptance updates only Scope-owned records and mirrors no source state except through validated receipt commands.

## Candidate record

| Field | Type | Required | Rules |
|---|---|---:|---|
| `id` | string | yes | Prefix `scope-candidate-` |
| `source_domain` | enum | yes | `engagement`, `evidence`, `pre-engagement`, `interview-sessions`, `compatibility-import`, `scope-local` |
| `source_candidate_ref` | versioned ref | yes | Exact immutable source reference |
| `candidate_kind` | enum | yes | `boundary`, `system`, `asset`, `provider`, `service`, `location`, `enclave`, `flow`, `assumption`, `unknown`, `dependency`, `decision`, `diagram`, `question-handoff` |
| `proposed_values` | object | yes | Strict allowed fields only |
| `provenance` | object | yes | Complete source basis |
| `candidate_state` | enum | yes | `received`, `in-review`, `accepted`, `modified-and-accepted`, `rejected`, `returned`, `withdrawn`, `superseded`, `closed` |
| `target_record_refs` | ref array | yes | Empty until accepted |
| `target_decision_ref` | ref/null | yes | Required when authority field changes |
| `decision_rationale` | string | no | Required for accept/modify/reject/return |
| `return_comment` | string | no | Required when returned |
| `source_receipt_ref` | ref/null | yes | Validated source-domain mirroring receipt |

## Import receipt

The receipt records package kind/version, SHA-256, producer/tool metadata, original package display label after sanitization, recognized registry row, preview timestamp, selected/rejected/modified record IDs, duplicate/ambiguity resolutions, diagnostics, source-traceability result, path-leak result, applied command ID, result counts, and status.

Receipt status values:

- `previewed`
- `applied`
- `partially-applied-reviewed-subset`
- `rejected`
- `returned`
- `failed-before-mutation`
- `superseded`

Package bytes, absolute paths, secrets, and private handles are never stored.

## Projection contract

`l2g_scope_projection_v1` is immutable and deep-cloned. Root fields:

- `kind` = `l2g_scope_projection_v1`;
- `version` = `1.0`;
- `project_id`;
- `profile`;
- `generated_at`;
- `source_scope_revision`;
- profile-safe arrays for each permitted record family;
- `counts` computed after filtering;
- `next_work` factual items computed after filtering;
- `qualifications`;
- no persisted search index, query, snippets, ranking, recent selection, focus target, or hidden count.

### Advisor projection

May include all records permitted to Advisor View, internal rationale, provenance, diagnostics, conflicts, candidates, stale details, import receipts, and complete decision history.

### Reviewer projection

May include records assigned or visible for review, accepted/proposed decisions, source basis needed for disposition, return controls, and review history. It omits unassigned Advisor-only notes and unrelated internal diagnostics.

### Client projection

May include only records explicitly marked `client-visible` and satisfying family-specific requirements:

- sanitized `client_label` or plain-language summary;
- approved or clearly proposed state label;
- no Advisor-only analysis;
- no hidden provenance internals;
- no rejected/returned candidate content;
- no private participant metadata;
- no hidden counts or stale diagnostics unless explicitly Client-visible and plain-language;
- diagrams only when `reviewed` or `approved-representation` and generated from the Client-safe projection;
- decisions only with a Client-safe rationale and selected visibility;
- unknowns only when explicitly selected for discussion.

Profile switching discards prior projection, search index, inspector model, difference model, current selection, cached counts, focus target, and live-region queue before constructing the next projection.

## Commands

Required Scope-owned commands include:

- create/update/archive/supersede each object family;
- create/link/unlink dependency;
- receive candidate;
- accept candidate;
- modify and accept candidate;
- reject candidate;
- return candidate;
- withdraw/supersede candidate receipt;
- create decision draft;
- propose decision;
- request/record exact-version confirmation;
- accept/reject/return/supersede decision;
- create/refresh/retain/supersede/approve diagram representation;
- preview compatibility package;
- apply reviewed subset;
- modify and apply;
- reject/return import;
- publish question candidate to Interview/Practice Review session planning;
- migrate empty v0.6 Scope domain.

Every command validates a cloned prospective state, appends history on success, and leaves governed state unchanged on failure.

## Compatibility mapping

### `l2g_scope_context_v1` version `1.0`

May stage:

- source references;
- assets;
- providers;
- flows;
- technology/context records;
- unknowns;
- validation-question candidates;
- boundary-context candidates.

It may not create accepted decisions, accepted categories/dispositions, direct participant statements, practice records, or assessment conclusions.

### `l2g_scope_return_package_v1` version `1.0`

May stage current supported fields plus optional additive:

- `scoping_decision_ledger_v1`;
- `pre_workshop_question_package_v1`.

Question-package content maps to Interview/Practice Review session-planning candidates, not a second Scope question authority. Practice record count must remain zero for the compatibility export.

### Duplicate and ambiguity treatment

For each staged object the Advisor must choose one:

- create new;
- link to exact existing record;
- keep separate;
- reject;
- modify and create/link.

Display-name equality, filename equality, or approximate text similarity never auto-merges governed records.

## Semantic limits

The stricter inherited archive/envelope limit always wins.

| Limit | Maximum |
|---|---:|
| Boundaries | 50 |
| Systems | 1,000 |
| Assets | 10,000 |
| Providers | 1,000 |
| Services | 5,000 |
| Locations | 1,000 |
| Enclaves | 1,000 |
| Data flows | 20,000 |
| Assumptions | 5,000 |
| Unknowns | 10,000 |
| Dependencies | 50,000 |
| Diagrams | 500 |
| Nodes per diagram | 2,000 |
| Edges per diagram | 5,000 |
| Decisions | 20,000 |
| Candidates | 20,000 |
| Import records per batch | 10,000 |
| Relationship refs per record | 5,000 |
| Dependency traversal depth | 64 |
| Plain-text field | 100,000 UTF-16 code units unless stricter family limit applies |
| Label/client label | 500 UTF-16 code units |
| Tag | 200 UTF-16 code units |
| Tags per record | 100 |

The acceptance matrix must include a bounded 10,000-asset / 20,000-flow synthetic semantic-validation case without relying on elapsed-time thresholds as the pass criterion.

## Validation invariants

- unique IDs across all Scope collections;
- correct type prefixes;
- reciprocal supersession links;
- all refs exist and permitted families match;
- accepted authoritative fields have current accepted decision refs;
- no overlapping accepted boundary inclusion/exclusion without explicit exception decision;
- precedence-bearing dependency graph is acyclic;
- exact-version diagram references and stale diagnostics are coherent;
- candidate target refs and decision refs are consistent;
- import receipts cannot claim apply without a valid command/history ref;
- Client projection contains no Advisor-only content or hidden counts;
- no prototype-pollution keys (`__proto__`, `prototype`, `constructor`) anywhere;
- no absolute local paths in path-bearing fields;
- no secrets/tokens/private keys in committed synthetic fixtures;
- no unsupported conclusion vocabulary in authority-bearing fields;
- deterministic serialization and stable projection ordering.

## Migration

A v0.5 project migrates by adding a valid empty Scope document and domain-index entry. The migration creates:

- one named checkpoint;
- one history event;
- no objects;
- no candidates;
- no decisions;
- no diagrams;
- no inferred boundary or category.

Older projects migrate through each established version in order and then receive the same empty Scope domain.

## Explicit exclusions

This contract does not define Practice Review findings, control applicability, assessment results, SSP narrative authority, Deliverables authority, authenticated identity, digital signatures, cloud collaboration, automatic CUI-boundary determination, automatic asset classification, original-evidence embedding, or standalone Scoper retirement.