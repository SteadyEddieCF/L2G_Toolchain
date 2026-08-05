# L2G Integrated Suite v0.7.0 — Workshop Compatibility Posture

## Status

Proposed compatibility record for issue #143 and ADR-0012. It becomes implementation authority only when the complete v0.7 design package is reviewed and merged.

## Purpose

Define how canonical Integrated Suite Practice Review authority interoperates with the current independently distributable CMMC L2 Gap Workshop Tool v79.1 and its registered package routes without changing stable contracts, storage behavior, operational authority, workbook/SSP guardrails, or standalone release identity.

## Frozen standalone baseline

- standalone module: CMMC L2 Gap Workshop Tool
- current release: v79.1
- runtime: `modules/workshop/releases/v79.1/cmmc_l2_gap_workshop_tool_v79.1.html` when materialized by the governed release builder
- expected standalone HTML SHA-256: `1fa1e186269b45110240b7ca39eaf6f40bb2ec55b8c496aaf01dfe6a65032ee2`
- expected standalone HTML size: `1885465` bytes
- embedded exact v79 baseline SHA-256: `a1f63944d0573587e2a5b7826f72befa16f6d89b849f3129f7f6dbb080da54ca`
- local/offline/no-network posture: preserved
- independently materializable release package: preserved

v0.7 does not modify Workshop v79.1 source, runtime, current pointer, release package, storage key, package registry, Workbook Merge semantics, Workbook Handoff identity, SSP Handoff/Return identity, or standalone operational records.

## Registered routes

The current route registry remains unchanged:

| Package kind | Registered version/release | Producer | Current consumers/stability | v0.7 posture |
|---|---|---|---|---|
| `l2g_workshop_state_v1` | wire `1.0` | Workshop | Workshop / stable | Supported through strict Practice Review preview/import and optional reviewed compatibility export |
| `l2g_workbook_handoff_v1` | contract release `1.7`; wire package `1.0` | Workshop | Builder/Merger / stable-frozen | Preserve exact route; optional reviewed compatibility export only after exact field contract validation |
| `l2g_workbook_merge_v1` | `1.1` | Builder/Merger | Workshop / stable-frozen | Remains Workshop-owned apply route; Practice Review does not implement Workbook Merge apply semantics |
| `l2g_ssp_handoff_v1` | `1.0` | Workshop | SSP / validated | Preserve standalone route; Integrated export remains deferred until SSP authority exists in v0.8 |
| `l2g_ssp_return_package_v1` | `1.0` | SSP | Workshop / validated | May preview as imported SSP-return context only; no authoritative SSP mutation in v0.7 |
| `l2g_workshop_observability_v1` | `0.1` | Workshop | Control Center / optional read-only | Preserve; may consume read-only diagnostics only when exact registry route is used |
| `l2g_workshop_action_summary_v1` | `0.1` | Workshop | Control Center / optional read-only | Preserve; imported actions remain context/candidates |
| `l2g_workbook_round_trip_audit_v1` | `0.1` | Workshop | Control Center / optional read-only | Preserve as read-only audit context |
| `l2g_ssp_round_trip_audit_v1` | `0.1` | Workshop | Control Center and SSP / optional read-only | Preserve as read-only audit context |
| `l2g_responsibility_overlay_v1` | `0.1` | Workshop | Advisor and Control Center / foundation-draft | Preview as responsibility context only; no automatic responsibility acceptance |
| `l2g_responsibility_overlay_pack_v1` | `0.1` | Workshop | Advisor and Control Center / advisory-preview | Preview as context only |
| `l2g_responsibility_reconciliation_v1` | `0.1` | Workshop | Advisor and Control Center / advisory-working | Preview as context/candidates only |

The package registry must not be changed merely to add the Integrated Suite as a consumer. The v0.7 adapter records its compatibility internally until a separately reviewed registry change is required and validated across current consumers.

## Authority posture

1. Workshop package content is an external compatibility source, not a replacement Practice Review domain.
2. Imported Workshop operational status, practice notes, interview responses, key findings, recommendations, actions, blockers, provider context, responsibility overlays, and SSP context remain `ImportedPracticeContext` until an explicit conversion command creates a target-owned Practice Review record.
3. Requirement identity may map by exact authoritative requirement ID and text fingerprint, but requirement identity alone does not establish identity for claims, observations, findings, recommendations, actions, or blockers.
4. Imported Workshop values never create a current `PracticeReviewPosition` automatically.
5. Imported key findings remain imported context or explicitly converted `GapObservation` records qualified as Advisor observations, not formal findings.
6. Imported recommendations/actions/blockers remain separate candidate families and do not become accepted Reviews & Actions records.
7. Provider/responsibility overlays remain source-qualified discussions or Scope candidates and do not establish implementation or accepted responsibility.
8. Workbook Handoff and SSP routes retain their existing authority and guardrails; v0.7 does not reinterpret them as formal assessment or SSP acceptance.
9. Preview, rejection, or failed apply never mutates Practice Review, Workshop package objects, source domains, or target domains.
10. Standalone Workshop remains independently usable and distributable throughout and after v0.7.

## Primary supported direction: import Workshop State 1.0

### Purpose

Allow an advisor to bring existing standalone Workshop work into an Integrated Suite project without silently transferring authority.

### Recognition

The adapter recognizes only exact `l2g_workshop_state_v1` wire version `1.0` according to the registered contract and current Workshop producer identity.

### Preview groups

The adapter groups recognized records into:

- requirement/practice identity context;
- facilitated session/workshop context;
- participant/client statements or interview responses;
- Advisor/workshop notes;
- Evidence references and requests;
- key findings or gap-like context;
- recommendations;
- actions and blockers;
- provider, inheritance, and responsibility context;
- scope-related context;
- SSP handoff/return context;
- history/audit/observability context;
- unsupported or unmapped fields.

### Mapping posture

| Workshop source concept | Practice Review destination before explicit conversion |
|---|---|
| Practice/requirement record | Imported context linked to exact Requirement Review candidate |
| Interview response or attributed client statement | Imported context; may convert to `ImplementationClaim` only with explicit origin review |
| Workshop/Advisor notes | Advisor-only imported context; may convert to `AdvisorObservation` |
| Evidence reference/request | Imported context; may create exact Evidence review/request candidate after Evidence ref validation |
| Key finding | Imported context; may convert to qualified `GapObservation`, never formal finding |
| Recommendation | Imported context; may convert to `RecommendationCandidate` |
| Action | Imported context; may convert to `PracticeActionCandidate` |
| Blocker/open issue | Imported context; may convert to `PracticeReviewBlocker` or question |
| Provider/responsibility record | Imported context; may convert to `ResponsibilityDiscussion`, `ProviderFollowUp`, or Scope candidate |
| Status/readiness/assessment-like label | Preserve only as clearly quoted imported source label; never populate Practice Review authority fields |
| SSP handoff/return context | Imported context or future SSP candidate; no SSP authority in v0.7 |
| Audit/observability | Read-only import receipt diagnostics; not operational authority |

### Per-record treatment

- **Create imported context** — retain qualified source record and provenance only.
- **Convert to claim** — create `ImplementationClaim` with reviewed origin/attribution.
- **Convert to Advisor observation** — create Advisor-only `AdvisorObservation`.
- **Convert to Evidence review/request candidate** — require exact Evidence identity/version.
- **Convert to gap observation** — add non-formal-finding qualification.
- **Convert to recommendation/action/blocker** — create correct separate family.
- **Convert to responsibility discussion/provider follow-up** — preserve claim origin and Scope refs.
- **Link to exact existing record** — allowed only with immutable local/source identity evidence.
- **Keep separate** — preserve distinct record despite matching requirement or label.
- **Modify and convert/link** — record Advisor modifications and original source values.
- **Reject** — preserve receipt diagnostics only.
- **Return** — record reviewed disposition for a future/manual return route; do not invent producer consumption.

No treatment accepts a Practice Review position or target-domain record automatically.

## Optional direction: reviewed Workshop State compatibility export

A v0.7 implementation may emit an advisor-reviewed `l2g_workshop_state_v1` wire version `1.0` compatibility projection only when:

- the exact Workshop State field contract and current producer/consumer tolerance are inspected and encoded in tests;
- unsupported Integrated Suite fields are omitted;
- original local IDs are not represented as Workshop-native IDs unless a deterministic adapter mapping exists;
- every exported record is explicitly selected;
- Advisor-only or hidden Client content is excluded according to the chosen export profile;
- qualified Practice Review positions are not converted to Met/Not Met or assessment status;
- package guardrails state that the output is draft compatibility context, not a formal assessment result;
- repeated export of unchanged selected state is semantically idempotent;
- current Workshop v79.1 can preview/open the package without mutating operational state before explicit apply.

If these conditions cannot be satisfied within the bounded release, compatibility export is deferred while import remains supported.

## Workbook Handoff 1.7 / wire 1.0 posture

Workbook Handoff remains a Workshop → Builder/Merger route. The Integrated Suite must not silently claim Workshop producer identity.

An optional compatibility export may be considered only if:

- the exact current Handoff contract-release and wire-version distinction is retained;
- all required fields, guardrails, counts, stable IDs, fingerprints, and source linkage validate;
- the producer is accurately identified as the Integrated Suite compatibility adapter where the contract permits it;
- zero unsupported Practice Review fields are added;
- no formal assessment/readiness/compliance interpretation is introduced;
- Builder/Merger current consumer tests pass unchanged;
- the output remains separately selected and reviewed.

Otherwise v0.7 preserves the route through standalone Workshop and does not emit Handoff packages.

## Workbook Merge 1.1 posture

`l2g_workbook_merge_v1` version `1.1` remains a Builder/Merger → Workshop route.

Practice Review does not:

- implement the Workbook Merge 1.1 apply algorithm;
- modify the nested governance-preservation assertion rules;
- accept top-level `workshop_governance_preservation_v1`;
- infer missing candidate IDs or governed values;
- mutate Workshop operational records from a merge package;
- represent a merge preview as Practice Review acceptance.

The Integrated Suite may display package identity and route guidance or store read-only imported context only after strict validation, but the authoritative apply path remains Workshop v79.1.

## SSP Handoff/Return posture

### SSP Handoff 1.0

Practice Review may prepare future SSP narrative candidates but cannot emit authoritative `l2g_ssp_handoff_v1` in v0.7 unless the exact current route can be preserved without simulating SSP acceptance. Normal integrated publication to SSP remains deferred to v0.8 target authority.

### SSP Return 1.0

`l2g_ssp_return_package_v1` may be previewed as imported context linked to exact requirement reviews. Returned SSP content does not overwrite Practice Review claims, observations, positions, or future SSP authority. Conversion requires explicit Practice Review or future SSP commands.

## Responsibility overlay posture

Responsibility overlays and reconciliation packages are advisory context only.

Mapping rules:

- preserve source package/record ID and version;
- preserve provider, service, requirement, and source references;
- map responsibility labels to claim-qualified values such as client-claim, provider-claim, shared-claim, inherited-claim, unassigned, or disputed;
- display accepted Scope responsibility separately;
- create no Practice Review position, Scope decision, implementation conclusion, or SSP narrative automatically;
- unresolved conflicts create questions/blockers/candidates through explicit commands.

## Strict parser and preview pipeline

1. Read bytes without retaining them in governed state.
2. Detect JSON or bounded stored-ZIP route.
3. Enforce package, entry, expanded-size, string, collection, ref, and depth limits.
4. Reject duplicate keys at every depth.
5. Reject `__proto__`, `prototype`, and `constructor` at every depth.
6. Recognize exact package kind, wire version, contract release where applicable, producer, and registered route.
7. Compute package SHA-256.
8. Validate required source identity, fingerprints, stable IDs, counts, guardrails, and traceability.
9. Detect traversal and field-aware private local-path leakage.
10. Reject or normalize active HTML/script/SVG/event-handler/URL content to inert plain text according to the field contract.
11. Validate requirement IDs against the exact 110-requirement catalog and text fingerprints where present.
12. Preserve source values without using source status as local authority.
13. Build a non-mutating preview grouped by source concept and proposed destination family.
14. Identify exact links, possible links, same-requirement distinct records, duplicates, ambiguity, conflicts, stale refs, unsupported records, and diagnostics.
15. Require explicit treatment for every selected record.
16. Preview exact Practice Review and target-candidate effects.
17. Apply one prospective atomic command only after all selected records and cross-record refs validate.

## Duplicate and ambiguity rules

The following may identify the authoritative requirement but never identify a source record instance:

- requirement ID;
- requirement title;
- requirement text;
- domain or family;
- list position;
- status;
- display label.

Record identity requires one of:

- immutable local/source record ID plus validated producer/version;
- explicit prior import mapping;
- exact stable identifier and fingerprint under the current contract;
- explicit human Link decision recorded with provenance.

Same-requirement claims, findings, notes, actions, and recommendations remain distinct unless explicitly linked or superseded.

## Atomic apply and non-mutation

- Apply executes against a cloned prospective project.
- All selected conversions, links, requirement refs, source refs, and target candidate effects validate before commit.
- A receipt is marked applied only after complete project validation.
- Any parser, identity, version, guardrail, count, fingerprint, path, active-content, ambiguity, mapping, limit, target-adapter, or semantic error leaves governed project state byte-equivalent to pre-apply state.
- Preview and apply do not modify the source package object or bytes.
- Imported source records remain unchanged in receipt diagnostics.
- Existing Engagement, Evidence, Scope, Pre-Engagement, Interview, SSP, Reviews & Actions, and Deliverables accepted records remain unchanged.
- Undo/Redo preserves valid Practice Review records, import receipts, and any target receipts without orphans.

## Return and round-trip behavior

A reviewed return record may contain:

- source package/record identity;
- local import receipt ID;
- reviewed disposition: context-created, converted, linked, kept-separate, modified, rejected, clarification-needed, unsupported, withdrawn, or superseded;
- sanitized Advisor comment;
- local Practice Review refs where permitted;
- exact version and timestamp;
- draft/non-assessment qualification.

A return record does not imply Workshop consumed it unless a registered and tested consumer route exists. v0.7 does not invent a new Workshop return package kind.

## Required standalone and route non-regression

The implementation gate must revalidate:

- exact Workshop v79.1 materialization, size, and SHA-256;
- local/offline/no-network behavior;
- strict duplicate-key and undeclared-field handling;
- Workbook Handoff contract release 1.7 / wire 1.0 identity;
- Workbook Merge 1.1 nested governance-preservation rules and non-mutating preview;
- explicit apply, duplicate handling, and Undo;
- Workshop↔SSP Handoff/Return 1.0;
- current Builder/Merger v3.10.1 and SSP v1.9.17 routes;
- Control Center read-only observability routes;
- current package registry and exact-suite snapshots;
- complete RG-4 and current-suite Linux/Windows browser validation;
- no standalone release-pointer or storage change.

## Required compatibility scenarios

1. Import a valid Workshop State 1.0 package containing all 110 requirement records as context only.
2. Convert one attributed response to a claim while preserving the source record and package hash.
3. Convert one key-finding-like source record to a qualified gap observation without formal finding language.
4. Keep two same-requirement/same-label source records separate.
5. Block an unresolved ambiguous selected record while applying a separately reviewed valid subset.
6. Preserve a source status resembling Met/Not Met only as quoted imported context and reject it from local authority fields.
7. Map responsibility overlay values to claim-qualified discussions while showing accepted Scope context separately.
8. Preview SSP Return context without changing Practice Review or SSP accepted state.
9. Reject unsupported package version, duplicate keys, prototype keys, active content, oversized archive, path leakage, missing fingerprints, and invalid requirement identity before mutation.
10. Fault every apply stage and prove no partial mutation or false applied receipt.
11. Repeated preview/export is idempotent and does not mutate package objects.
12. Exact Workshop, Builder/Merger, SSP, Control Center, and RG-4 routes remain green.

## Explicit exclusions

This posture does not authorize:

- changing Workshop v79.1;
- creating Workshop v80 scope;
- changing registered contract versions;
- direct Workbook Merge apply inside Practice Review;
- automatic imported-record conversion;
- formal finding or Met/Not Met mapping;
- authoritative SSP Handoff before v0.8 target authority;
- standalone Workshop retirement;
- original Evidence or workbook-byte embedding;
- production/client/FCI/CUI use;
- readiness, compliance, risk, scoring, certification, Evidence sufficiency, implementation effectiveness, or assessment outcome.