# L2G Integrated Suite v0.6.0 — Scoper Compatibility Posture

## Status

Design compatibility record for issue #139. It becomes implementation authority only when the complete v0.6 design package is reviewed and merged.

## Purpose

Define exactly how the Integrated Suite Scope authority interoperates with the current independently distributable L2G Scoper v3.12 without changing stable wire contracts, weakening draft guardrails, or treating imported Scoper output as accepted Scope truth.

## Frozen standalone baseline

- standalone module: L2G Scoper
- current release: v3.12
- standalone runtime: `modules/scoper/releases/v3.12/L2Scoper-v3.12.html`
- expected standalone HTML SHA-256: `2adf329557fb2df4699e13bb572bcde762667292700200f8edeae0dd6ade7ef3`
- input contract: `l2g_scope_context_v1` version `1.0`
- output contract: `l2g_scope_return_package_v1` version `1.0`
- browser storage key: `l2scoper_v30_state`
- optional additive return sections:
  - `scoping_decision_ledger_v1`
  - `pre_workshop_question_package_v1`
- zero-practice guardrail: preserved
- local/offline/no-network posture: preserved

v0.6 does not modify the Scoper runtime, storage key, package kinds/versions, current pointer, package-route registry, or standalone release artifacts.

## Authority posture

1. Inside the Integrated Suite, `l2g_scope_v1` is canonical for accepted Scope records.
2. A Scoper package is an external compatibility source, not an authoritative project-domain replacement.
3. Imported assets, providers, flows, unknowns, decisions, or questions remain staged context or candidates until reviewed.
4. Accepted category, disposition, boundary relationship, implementation location, responsibility, flow treatment, or diagram approval requires a Scope-owned decision.
5. Scoper decision-ledger records are proposals/source context unless an explicit Scope decision command accepts or modifies them.
6. Scoper pre-workshop questions become Interview/Practice Review Session Planner candidates; they do not become a second Scope-owned question bank or live agenda items.
7. Package preview and rejection never mutate Scope or source-domain content.
8. Compatibility export is draft/advisor-reviewed context only and cannot claim stronger authority than the frozen wire contract represents.

## Supported package directions

### Import `l2g_scope_context_v1` version `1.0`

Intended route:

- DocConverter or other registered producer → Integrated Scope preview.

Recognized content may stage:

- source-document references and fingerprints;
- asset candidates;
- provider candidates;
- CUI/data-flow candidates;
- technology/context records;
- boundary/unknown/review candidates;
- validation-question candidates;
- draft guardrail and producer metadata.

It may not create:

- accepted Scope objects or decisions;
- direct participant statements or Client confirmations;
- Practice Review records;
- SSP narratives;
- readiness, compliance, risk, scoring, certification, evidence-sufficiency, implementation, or Met/Not Met conclusions.

### Import `l2g_scope_return_package_v1` version `1.0`

Intended route:

- standalone Scoper → Integrated Scope preview.

Recognized content may stage:

- assets;
- providers;
- flows;
- boundary/context summaries;
- technology profiles mapped to systems/providers/services candidates;
- unknowns/review items;
- legacy validation questions;
- optional `scoping_decision_ledger_v1` proposals;
- optional `pre_workshop_question_package_v1` Session Planner candidates;
- source/fingerprint/lineage records;
- draft guardrails and producer metadata.

Unknown optional fields follow the package registry posture: preserve bounded namespaced receipt metadata or safely ignore with diagnostics. They never become governed Scope fields automatically.

### Export `l2g_scope_return_package_v1` version `1.0`

The Integrated Suite may emit a compatibility projection for existing external routes only after explicit Advisor review.

Rules:

- use only fields supported by the frozen contract;
- preserve package kind/version exactly;
- preserve draft/advisor-review guardrails;
- emit zero practice records;
- include stable source/provenance references supported by the contract;
- include optional decision-ledger and question-package sections only when they validate under current additive semantics;
- never expose Advisor-only notes, hidden candidates, internal diagnostics, private paths, secrets, or unsupported internal authority fields;
- never represent a locally accepted Scope decision as an authenticated client approval, assessment conclusion, or Scoper-final determination;
- repeated export of unchanged selected state is semantically idempotent.

## Preview pipeline

1. Read bytes without retaining them in governed state.
2. Determine JSON or bounded stored-ZIP path.
3. Enforce inherited archive, entry, expanded-size, and envelope limits.
4. Reject duplicate keys and `__proto__`, `prototype`, or `constructor` at any depth.
5. Recognize exact package kind/version through the registry.
6. Compute package SHA-256.
7. Validate producer metadata, source identity, fingerprints, lineage, and required traceability.
8. Detect path traversal and field-aware local-path leakage in path-bearing fields.
9. Treat active HTML/script/SVG/URL content as hostile; reject or normalize to inert plain text according to field rules.
10. Enforce semantic collection/string/ref limits.
11. Normalize only contract-approved aliases and preserve original source identity.
12. Build a non-mutating preview grouped by record family.
13. Identify exact matches, possible matches, duplicates, ambiguities, conflicts, unsupported records, and diagnostics.
14. Require explicit per-record treatment before apply.
15. Preview the exact atomic Scope and Session Planner effects.

## Per-record review actions

- **Create new** — create a new Scope candidate/object through the validated command path.
- **Link to exact existing** — preserve both package source identity and target record ref.
- **Keep separate** — create a distinct record even when display labels match.
- **Modify and create/link** — record explicit Advisor modifications and provenance.
- **Reject** — retain receipt diagnostics only.
- **Return** — produce a reviewed return/disposition record without changing stable wire versions.

No fuzzy or display-name match auto-applies. Suggestions explain the matched fields and remain non-authoritative.

## Atomic apply rules

- Apply uses one Scope-owned ProjectStore command over a cloned prospective project state.
- All selected object/candidate/question effects validate before commit.
- Session Planner question candidates are created through the target-domain adapter in the same validated transaction boundary or the entire apply fails.
- A receipt is marked applied only after project validation succeeds.
- Any parser, identity, integrity, version, ambiguity, mapping, limit, source-traceability, path-leak, active-content, target-adapter, or semantic error leaves governed state byte-equivalent to pre-apply state.
- Package objects/bytes are not modified by preview or apply.

## Duplicate and ambiguity rules

A record is an exact link candidate only when a governed immutable identifier or validated source identity establishes the relationship. The following do not establish identity alone:

- display name;
- hostname;
- IP address;
- provider name;
- service name;
- filename;
- approximate text similarity;
- list position;
- latest timestamp.

Same-name distinct assets/providers must remain separable. Ambiguity blocks batch apply only for unresolved selected records; an explicitly reviewed subset may proceed when cross-record integrity remains valid.

## Mapping posture

### Technology profiles

Map to one or more staged system/provider/service candidates with complete source links. Do not create a monolithic `technology_profile` authority in Scope.

### Decision ledger

Map each record to a Scope decision candidate preserving source decision ID, exact source version, rationale, affected source refs, status, and lineage. It remains proposed until a Scope-owned command accepts/modifies it.

### Pre-workshop questions

Map to Interview/Practice Review question candidates preserving source IDs, prompts, rationale, expected participants, related object/unknown refs, and provenance. No automatic agenda insertion.

### Unknowns

Map to Scope unknown candidates with workflow priority/blocking treatment requiring Advisor review. Imported severity labels are workflow context only and are not risk scores.

### Flows

Map to data-flow candidates with asserted data label, source/destination/intermediary mapping, boundary crossings, and unresolved endpoints. No flow is accepted or diagrammed as authoritative without review.

## Return behavior

A reviewed imported record may be returned with:

- source package/record identity;
- disposition (`accepted-as-candidate`, `modified`, `linked`, `rejected`, `needs-clarification`, `unsupported`, `superseded`);
- sanitized Advisor comment;
- target Scope candidate/object/decision refs where permitted;
- exact version and timestamp;
- no private internal analysis unless the route explicitly supports and the user selects it;
- draft/non-assessment qualification.

Return does not change the stable package version or imply the standalone producer consumed the return unless a registered consumer route exists.

## Non-mutation requirements

Validation must prove:

- preview causes no project mutation;
- failed apply causes no project mutation;
- package object and bytes remain unchanged;
- source-domain records remain unchanged;
- Scope apply changes only selected validated records;
- Session Planner receives only selected question candidates;
- rejected/unselected records remain absent from target domains;
- repeated preview/export produces stable counts/semantic hash;
- Undo/Redo preserves valid target/source references and receipts.

## Standalone non-regression

The v0.6 implementation gate must revalidate:

- exact Scoper v3.12 materialization and runtime SHA-256;
- existing current module catalog entry;
- local/offline/no-network behavior;
- stable input/output kind/version;
- 10 technology profiles, 54 material decisions, 73 clean pre-Workshop questions, and zero practice records in the governed synthetic regression where applicable;
- repeated `makeReturn()` idempotency;
- path-leak regression behavior;
- current Workshop preview route remains non-mutating before Apply;
- unknown optional additive sections remain safely handled.

## Explicit exclusions

This compatibility posture does not authorize changing Scoper v3.12, introducing v3.13 scope, breaking package contracts, retiring the standalone Scoper, importing original evidence bytes, automatic boundary determination, automatic decision acceptance, authenticated approval, Practice Review conclusions, SSP content, Deliverables, readiness, compliance, risk, scoring, certification, evidence sufficiency, implementation, or Met/Not Met.