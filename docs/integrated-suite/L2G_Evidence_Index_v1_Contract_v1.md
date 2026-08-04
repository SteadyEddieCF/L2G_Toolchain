# `l2g_evidence_index_v1` Contract v1

## Status

Field-level design contract for the L2G Integrated Suite v0.4.0 Evidence Catalog Core. It becomes the implementation authority when the design PR merges.

This contract remains synthetic-only and does not authorize production, client, FCI, or CUI data.

## Purpose

Define the canonical reference-only Evidence domain that:

- identifies selected source bytes with stable opaque IDs and SHA-256 fingerprints;
- preserves source metadata and provenance without embedding original source files;
- supports exact relinking after project reopen;
- exposes changed-source and duplicate conditions without making automatic disposition decisions;
- stores bounded source locations and derived summaries from reviewed legacy imports;
- publishes reviewable candidate mappings without mutating target-domain authority;
- provides profile-filtered read-only projections and deterministic factual next work;
- preserves the encrypted `l2g_project_v1` container and the existing standalone DocConverter contracts.

## Archive placement

The canonical domain is stored at:

```text
domains/evidence-index.json
```

The v0.4 exact governed payload set is conceptually:

```text
manifest.json
domains/engagement.json
domains/evidence-index.json
domains/reviews-actions.json
history/events.ndjson
history/checkpoints.json
compatibility/current-registry.json
integrity/sha256-manifest.json
```

No original evidence bytes, browser file handles, absolute paths, per-source binary entries, images, thumbnails, Office/PDF payloads, OCR layers, or large raw extracts are stored in v0.4.

## Top-level domain

```json
{
  "schema_kind": "l2g_evidence_index_v1",
  "schema_version": "1.0",
  "catalog_id": "evidence_catalog_<opaque-id>",
  "sources": [],
  "locations": [],
  "derived_records": [],
  "relationships": [],
  "duplicate_groups": [],
  "candidate_mappings": [],
  "verification_receipts": [],
  "import_receipts": [],
  "projection_policy": {
    "client_visible_values": [
      "client-safe",
      "approved-for-client-presentation"
    ],
    "client_requires_label": true,
    "client_include_original_names": false,
    "client_include_fingerprints": false,
    "client_include_candidates": false,
    "client_include_provenance": false,
    "search_index_persistence": "none"
  }
}
```

Exact top-level keys are required. Unknown keys are rejected.

## Shared types

### Visibility

- `advisor-only`
- `client-safe`
- `approved-for-client-presentation`

### Provenance

```json
{
  "source_kind": "local-selection",
  "source_id": "verification_<opaque-id>",
  "source_label": "Synthetic source selection",
  "source_location_ref": null,
  "asserted_at": "2026-08-04T00:00:00.000Z",
  "asserted_by": "advisor",
  "confidence": "not-evaluated"
}
```

Rules:

- `source_kind`, `source_id`, `asserted_at`, `asserted_by`, and `confidence` are required;
- `source_label` and `source_location_ref` are optional;
- `asserted_by` is `advisor`, `client`, `reviewer`, `migration`, or `system`;
- confidence is `not-evaluated`, `low`, `medium`, or `high`;
- confidence is descriptive source-processing metadata and is not evidence sufficiency.

### Stable IDs

| Record | Prefix |
|---|---|
| Catalog | `evidence_catalog_` |
| Source | `evidence_` |
| Location | `location_` |
| Derived record | `derived_` |
| Relationship | `evidence_relationship_` |
| Duplicate group | `duplicate_group_` |
| Candidate mapping | `evidence_candidate_` |
| Verification receipt | `verification_` |
| Import receipt | `evidence_import_` |

IDs are opaque, immutable, unique across the project, and unrelated to filenames or hashes. User-facing labels are editable and never record identities.

## Source record

```json
{
  "evidence_id": "evidence_<opaque-id>",
  "display_label": "Synthetic network diagram",
  "client_label": "Current network diagram",
  "original_name": "McFirecoal_Network_Diagram_Synthetic.pdf",
  "collection_label": "Architecture materials",
  "origin_kind": "local-file",
  "media_type": "application/pdf",
  "extension": ".pdf",
  "size_bytes": 123456,
  "last_modified_ms": 1785811200000,
  "fingerprint": {
    "algorithm": "SHA-256",
    "sha256": "<64-lowercase-hex>"
  },
  "lifecycle": "active",
  "processing_state": "not-requested",
  "review_state": "unreviewed",
  "trust_state": "not-evaluated",
  "visibility": "advisor-only",
  "tags": ["synthetic", "network"],
  "supersedes_source_ref": null,
  "superseded_by_source_ref": null,
  "duplicate_group_ref": null,
  "provenance": {},
  "created_at": "2026-08-04T00:00:00.000Z",
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

### Required fields

- `evidence_id`
- `display_label`
- `client_label`
- `original_name`
- `collection_label`
- `origin_kind`
- `media_type`
- `extension`
- `size_bytes`
- `last_modified_ms`
- `fingerprint`
- `lifecycle`
- `processing_state`
- `review_state`
- `trust_state`
- `visibility`
- `tags`
- `supersedes_source_ref`
- `superseded_by_source_ref`
- `duplicate_group_ref`
- `provenance`
- `created_at`
- `updated_at`

Nullable keys remain present with `null` where the value is unavailable. This prevents ambiguous unknown-key and missing-key behavior.

The `fingerprint` key is always present. Its value is either:

- an object with exactly `algorithm: "SHA-256"` and a valid 64-character lowercase hexadecimal `sha256`; or
- `null`, allowed only when `origin_kind` is `external-reference`, the source bytes have never been selected, `size_bytes` is `0`, `review_state` is `needs-attention`, and `trust_state` is `exception-open`.

No other source kind may use a null fingerprint. Once exact bytes are registered, the external reference receives a new hashed source identity or is explicitly linked/superseded according to the revision rules; the unhashed record is not silently rewritten into a different byte identity.

### Origin kinds

- `local-file`
- `legacy-package-record`
- `generated-output-reference`
- `external-reference`

An `external-reference` with no selected bytes uses `fingerprint: null` under the exact conditions above. It remains a factual unresolved reference, not an exact linked source, until reviewed source bytes are registered.

### Lifecycle

- `active`
- `superseded`
- `archived`

No destructive deletion command is supported in v0.4. A never-committed staged item may be discarded before registration; once accepted, it is archived or superseded.

### Processing state

- `not-requested`
- `pending`
- `processing`
- `complete`
- `partial`
- `failed`
- `unsupported`

The state records processing history or imported parser results. v0.4 performs hashing and catalog registration but does not perform PDF, Office, OCR, diagram, or transcript parsing.

### Review state

- `unreviewed`
- `in-review`
- `reviewed`
- `needs-attention`
- `excluded`

### Trust/exception state

- `not-evaluated`
- `no-exception`
- `exception-open`
- `exception-resolved`
- `rejected`

Trust state is an exception-workflow indicator. It is not authenticity, evidence sufficiency, or control validation.

### Filename and path rules

- `original_name` is the browser-provided base filename after control-character and bidi-control removal;
- no slash, backslash, drive letter, URI, absolute path, user profile, or directory hierarchy is stored in `original_name`;
- `collection_label` is optional user-entered text and is never treated as a path;
- `client_label` is required for Client-visible presentation;
- Client projection omits `original_name`, `collection_label`, and raw package names.

### Fingerprint rules

- a non-null fingerprint has algorithm exactly `SHA-256`;
- its digest is exactly 64 lowercase hexadecimal characters;
- `null` is permitted only for the unresolved `external-reference` case defined above;
- a digest identifies bytes, not trust or meaning;
- the digest cannot be edited after registration;
- changed bytes create a new source identity and revision relationship.

## Source location

```json
{
  "location_id": "location_<opaque-id>",
  "source_ref": "evidence_<opaque-id>",
  "kind": "page",
  "label": "Page 4, network boundary note",
  "page_start": 4,
  "page_end": 4,
  "paragraph": null,
  "sheet": null,
  "row_start": null,
  "row_end": null,
  "column_start": null,
  "column_end": null,
  "slide_start": null,
  "slide_end": null,
  "object_label": null,
  "speaker": null,
  "start_ms": null,
  "end_ms": null,
  "package_path": null,
  "record_path": null,
  "visibility": "advisor-only",
  "provenance": {},
  "created_at": "2026-08-04T00:00:00.000Z",
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

### Location kinds

- `whole-source`
- `page`
- `paragraph`
- `sheet`
- `row`
- `cell-range`
- `slide`
- `object`
- `speaker-turn`
- `timestamp-range`
- `package-field`
- `unknown`

Validation requires the fields appropriate to the kind and rejects contradictory combinations. Page, row, slide, and timestamp ranges must be ordered and nonnegative. Package and record paths are logical source locations, not local filesystem paths.

## Derived record

```json
{
  "derived_id": "derived_<opaque-id>",
  "source_ref": "evidence_<opaque-id>",
  "kind": "extract-summary",
  "title": "Synthetic boundary summary",
  "summary": "A bounded synthetic summary imported from a recognized package.",
  "fields": [
    {
      "name": "environment",
      "value_type": "string",
      "value": "Azure Government"
    }
  ],
  "location_refs": ["location_<opaque-id>"],
  "parser": {
    "name": "DocConverter-L2G",
    "version": "7.9.5.1",
    "method": "legacy-package-import"
  },
  "confidence": "not-evaluated",
  "review_state": "unreviewed",
  "visibility": "advisor-only",
  "provenance": {},
  "created_at": "2026-08-04T00:00:00.000Z",
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

### Derived kinds

- `extract-summary`
- `structured-record`
- `diagram-description`
- `security-evidence-item`
- `meeting-segment`
- `parser-diagnostic`

### Flat scalar fields

Each field has:

- `name`: normalized field label;
- `value_type`: `string`, `number`, `boolean`, or `null`;
- `value`: scalar value matching the declared type.

Nested objects, arrays, HTML, scripts, binary content, data URIs, active content, and arbitrary JSON are rejected. A record may contain at most 100 fields and at most 64 KiB serialized field data.

Parser diagnostics are always `advisor-only` and never indexed for Client search.

## Evidence relationship

```json
{
  "relationship_id": "evidence_relationship_<opaque-id>",
  "relationship_type": "derived-from",
  "from_ref": "derived_<opaque-id>",
  "to_ref": "evidence_<opaque-id>",
  "rationale": "Imported source traceability",
  "visibility": "advisor-only",
  "provenance": {},
  "created_at": "2026-08-04T00:00:00.000Z"
}
```

### Relationship types

- `duplicate-of`
- `revision-of`
- `derived-from`
- `contains`
- `supports`
- `related-to`

Rules:

- every reference resolves to a source, location, or derived record allowed for that relationship type;
- no self-relation except `related-to` where separately justified;
- `revision-of` forms an acyclic chain;
- `duplicate-of` requires matching SHA-256 source fingerprints;
- `derived-from` points from a derived record to its source or location;
- `contains` does not imply ownership or authority;
- `supports` is a user/import assertion and does not determine evidence sufficiency.

## Duplicate group

```json
{
  "duplicate_group_id": "duplicate_group_<opaque-id>",
  "sha256": "<64-lowercase-hex>",
  "members": [
    {
      "source_ref": "evidence_<opaque-id>",
      "disposition": "primary",
      "rationale": "Selected as the working reference."
    },
    {
      "source_ref": "evidence_<opaque-id>",
      "disposition": "duplicate",
      "rationale": "Same bytes retained under a separate intake label."
    }
  ],
  "state": "resolved",
  "visibility": "advisor-only",
  "created_at": "2026-08-04T00:00:00.000Z",
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

### Group state

- `unresolved`
- `resolved`

### Member disposition

- `unresolved`
- `primary`
- `duplicate`
- `retained-distinct`
- `excluded`

Rules:

- every member fingerprint equals the group fingerprint;
- a resolved group contains exactly one active primary unless all members are excluded or archived;
- detection creates or updates unresolved membership only;
- disposition requires an Advisor command and rationale;
- disposition never deletes a source.

## Candidate mapping

```json
{
  "candidate_id": "evidence_candidate_<opaque-id>",
  "source_refs": ["evidence_<opaque-id>"],
  "location_refs": ["location_<opaque-id>"],
  "derived_refs": ["derived_<opaque-id>"],
  "target_domain": "engagement",
  "target_type": "open-question",
  "proposed_operation": "create",
  "proposed_fields": [
    {
      "name": "title",
      "value": "Confirm synthetic boundary diagram currency"
    }
  ],
  "state": "awaiting-review",
  "rationale": "Source-derived candidate; target authority must decide.",
  "target_candidate_ref": null,
  "supersedes_candidate_ref": null,
  "superseded_by_candidate_ref": null,
  "visibility": "advisor-only",
  "provenance": {},
  "created_at": "2026-08-04T00:00:00.000Z",
  "updated_at": "2026-08-04T00:00:00.000Z"
}
```

### Target domains

- `engagement`
- `pre-engagement`
- `scope`
- `practice-review`
- `ssp`
- `deliverables`
- `reviews-actions`

### Proposed operations

- `create`
- `update`
- `link`
- `request-review`

### Candidate state

- `draft`
- `awaiting-review`
- `published-to-target`
- `returned`
- `withdrawn`
- `superseded`
- `closed`

Evidence does not store target decisions as authority. When a target command exists, `published-to-target` requires a valid `target_candidate_ref`. Accept, Modify, Reject, Return, and Supersede are target-domain decisions. For an unavailable target, the candidate remains `awaiting-review` and the UI exposes no false action.

## Verification receipt

```json
{
  "verification_id": "verification_<opaque-id>",
  "source_ref": "evidence_<opaque-id>",
  "operation": "relink",
  "selected_name": "Synthetic_Diagram.pdf",
  "selected_size_bytes": 123456,
  "selected_last_modified_ms": 1785811200000,
  "selected_sha256": "<64-lowercase-hex>",
  "result": "exact-match",
  "related_source_ref": null,
  "rationale": "Exact byte match selected by Advisor.",
  "performed_at": "2026-08-04T00:00:00.000Z",
  "performed_by": "advisor"
}
```

### Operation

- `initial-registration`
- `relink`
- `revision-registration`
- `duplicate-registration`

### Result

- `exact-match`
- `hash-mismatch`
- `duplicate-existing`
- `new-revision-created`
- `cancelled`
- `error`

Receipts contain no source bytes, paths, file handles, passphrases, or keys. Cancelled and error receipts may be represented by history only if no governed source existed; when persisted, their selected metadata must be bounded and sanitized.

## Import receipt

```json
{
  "import_id": "evidence_import_<opaque-id>",
  "package_kind": "l2g_intake_package_v1",
  "package_version": "1.0",
  "package_name": "Synthetic intake package",
  "package_size_bytes": 123456,
  "package_sha256": "<64-lowercase-hex>",
  "registry_version": "1.1",
  "source_document_ids": ["sd_synthetic_001"],
  "staged_source_refs": ["evidence_<opaque-id>"],
  "staged_location_refs": ["location_<opaque-id>"],
  "staged_derived_refs": ["derived_<opaque-id>"],
  "staged_candidate_refs": ["evidence_candidate_<opaque-id>"],
  "warnings": [],
  "state": "applied",
  "imported_at": "2026-08-04T00:00:00.000Z",
  "imported_by": "advisor"
}
```

### Recognized packages

- `l2g_intake_package_v1` version `1.0`
- `l2g_scope_context_v1` version `1.0`
- `l2g_meeting_context_v1` version `1.0`

### Import state

- `previewed`
- `applied`
- `partial`
- `rejected`
- `superseded`

The package bytes are not retained. The receipt preserves package identity and the normalized records created from an explicit import preview. Unknown package kinds or versions never partially mutate governed state.

## Runtime-only session link map

The browser runtime maintains an in-memory map conceptually equivalent to:

```text
Map<evidence_id, File>
```

Associated runtime metadata may include:

- `link_state`;
- hashing progress;
- last runtime error;
- selected base name;
- selected size;
- selected modified time.

It is never serialized into the project, recovery record, localStorage, logs, screenshots, or export. Lock, close, reload, failed unlock, and explicit unlink clear the map.

## Relink algorithm

For each selected file:

1. sanitize staged metadata;
2. enforce source and batch size limits;
3. hash the complete bytes in a cancellable worker;
4. compare the digest to the intended source;
5. if exact, create an exact verification receipt and associate the runtime File;
6. otherwise compare the digest to every active catalog source;
7. if another exact source exists, offer association with that source or explicit duplicate registration;
8. if no exact source exists, offer Cancel or Create New Revision;
9. never replace an existing fingerprint or source identity;
10. validate the complete proposed state before mutation;
11. append command history and create a checkpoint for batch relink/revision operations.

Filename, size, media type, and modified time may rank possible intended records in the review UI but cannot produce an exact relink result.

## Search projection

The search index is transient and rebuilt from the already profile-filtered Evidence projection.

### Advisor searchable fields

- display label;
- original name;
- collection label;
- client label;
- media type and extension;
- tags;
- source states;
- location labels;
- derived titles, summaries, and flat scalar fields;
- relationship labels;
- import package kinds;
- candidate titles/operations where visible.

### Reviewer searchable fields

Advisor-visible governed records plus review/history emphasis, but no editing reference.

### Client searchable fields

- client label;
- approved display label where explicitly allowed;
- approved tags;
- client-visible derived titles/summaries/fields;
- client-visible location labels and relationship labels;
- client-visible states intentionally approved for presentation.

Client search excludes original names, fingerprints, provenance, confidence, parser diagnostics, raw import names, collection hints, exception details, duplicate rationale, verification receipts, candidate mappings, history rationale, and hidden-record counts.

Search queries, index tokens, result selections, snippets, and recent-query state are not persisted.

## Profile-safe projection

A projection includes:

```json
{
  "projection_kind": "l2g_evidence_projection_v1",
  "workspace": "evidence",
  "profile": "advisor",
  "generated_at": "2026-08-04T00:00:00.000Z",
  "source_domain": "Evidence",
  "source_catalog_id": "evidence_catalog_<opaque-id>",
  "source_record_ids": [],
  "sources": [],
  "locations": [],
  "derived_records": [],
  "relationships": [],
  "duplicate_groups": [],
  "candidate_mappings": [],
  "verification_receipts": [],
  "import_receipts": [],
  "next_work": []
}
```

Rules:

- construct from a deep clone after profile filtering;
- recursively freeze before handing it to any workspace renderer;
- Client View receives no candidate mappings, verification receipts, import receipts, provenance, original names, fingerprints, internal exception detail, or hidden counts;
- Reviewer View includes provenance and receipts but is direct-edit read-only;
- attempted projection mutation cannot alter Evidence authority.

## Factual next work

Supported kinds:

- `source-review`
- `exception`
- `missing-source`
- `hash-mismatch`
- `duplicate-group`
- `processing`
- `candidate-mapping`
- `import-review`
- `verification`
- `informational`

Deterministic priority order:

1. hash mismatch or changed source;
2. rejected source or open trust exception;
3. missing/unavailable source required by an active relationship;
4. unresolved exact duplicate group;
5. failed, partial, or unsupported processing;
6. unreviewed active source;
7. returned or unpublished candidate mapping;
8. import preview awaiting decision;
9. stale verification based on an explicit project preference;
10. informational no-work state.

Next-work text is factual and must not contain readiness, compliance, evidence-sufficiency, scoring, certification, risk, implementation, or Met/Not Met conclusions.

## Command semantics

Required Evidence-owned commands include:

- `evidence.register-sources`
- `evidence.update-metadata`
- `evidence.set-review-state`
- `evidence.set-trust-state`
- `evidence.archive-source`
- `evidence.create-revision`
- `evidence.record-verification`
- `evidence.set-duplicate-disposition`
- `evidence.create-location`
- `evidence.create-derived-record`
- `evidence.create-relationship`
- `evidence.create-candidate-mapping`
- `evidence.publish-candidate-to-target`
- `evidence.withdraw-candidate`
- `evidence.supersede-candidate`
- `evidence.preview-import`
- `evidence.apply-import`
- `evidence.reject-import`
- `evidence.migrate-v03`

Every mutation validates a cloned proposed document before commit and appends history. Batch registration, import application, duplicate disposition across a group, revision creation, and migration create named checkpoints.

## Legal transitions

### Source lifecycle

- `active -> superseded`
- `active -> archived`
- `superseded -> archived`

No reverse transition is automatic. Restoration uses Undo, checkpoint restoration, or a new revision command with history.

### Review

- `unreviewed -> in-review`
- `unreviewed -> reviewed`
- `unreviewed -> needs-attention`
- `in-review -> reviewed`
- `in-review -> needs-attention`
- `needs-attention -> in-review`
- `needs-attention -> reviewed`
- any non-excluded active state -> `excluded`

### Trust/exception

- `not-evaluated -> no-exception`
- `not-evaluated -> exception-open`
- `exception-open -> exception-resolved`
- `exception-open -> rejected`
- `exception-resolved -> exception-open`

### Candidate mapping

- `draft -> awaiting-review`
- `draft -> withdrawn`
- `awaiting-review -> published-to-target`
- `awaiting-review -> returned`
- `awaiting-review -> withdrawn`
- `returned -> awaiting-review`
- active state -> `superseded`
- `published-to-target -> closed` after a valid target reference and mirrored target disposition

## Validation limits

The inherited archive limits remain controlling:

- maximum ZIP entries: 64;
- maximum entry bytes: 4 MiB;
- maximum expanded inner project: 12 MiB;
- maximum encrypted envelope: 16 MiB;
- maximum path length: 240 characters;
- maximum history events: 5,000;
- maximum checkpoints: 20.

Evidence semantic caps:

- sources: 2,000;
- locations: 5,000;
- derived records: 5,000;
- relationships: 10,000;
- duplicate groups: 2,000;
- candidate mappings: 5,000;
- verification receipts: 2,000;
- import receipts: 100;
- source batch: 500 files;
- individual selected source: 2 GiB;
- title/label: 300 characters;
- normal detail/rationale: 8,000 characters;
- derived summary: 16,000 characters;
- structured fields: 100 scalar fields and 64 KiB serialized;
- tags: 50 values, 100 characters each;
- relationship references per record: 200.

When semantic caps and archive-size caps conflict, the stricter limit wins. Limit rejection occurs before governed-state mutation.

## Migration

### v0.3 to v0.4

- preserve project ID, Engagement domain, history, supported checkpoints, encryption profile, and compatibility baseline;
- add an empty Evidence catalog with a new opaque catalog ID;
- add the Evidence domain to the exact manifest domain index;
- create a checkpoint named `Migration to v0.4 Evidence Catalog Core`;
- append `evidence.migrated-v03` history;
- infer no sources, fingerprints, locations, relationships, imports, candidates, trust, or conclusions;
- require the next portable save to use the v0.4 application identity.

### v0.1 and v0.2

Migrate through the existing deterministic v0.3 path, then apply the empty v0.4 Evidence migration. Failed migration leaves the active governed project unchanged.

## Legacy package adapter rules

1. identify package kind and version before normalization;
2. verify the package against the current registry snapshot;
3. compute package SHA-256 and size;
4. strictly parse with duplicate-key, prototype-pollution, archive-path, CRC, integrity, and size checks as applicable;
5. stage normalized records without mutating the catalog;
6. preserve valid source document IDs and source locations in provenance;
7. show warnings and rejected rows in an import preview;
8. require explicit Advisor Apply, Modify, or Reject;
9. create one import receipt and one checkpoint for an applied batch;
10. never infer missing scope, practice, responsibility, evidence-sufficiency, SSP, or client-approval values;
11. reject unsupported package versions and ambiguous source references without partial mutation;
12. leave the stable legacy contract and standalone runtime unchanged.

## Security qualification

Reference-only source bytes reduce but do not remove sensitivity. Filenames, sizes, modified times, hashes, derived summaries, locations, relationships, candidate mappings, and import receipts may contain sensitive information. The project remains encrypted at rest but synthetic-only. Presentation profiles do not protect a complete unlocked project from its holder or from endpoint compromise.

## Explicit non-conclusions

The Evidence catalog records source identity, processing/review/trust workflow, provenance, relationships, and proposals. It does not conclude:

- that evidence is authentic;
- that evidence is current or applicable;
- that evidence is sufficient;
- that a practice or objective is implemented;
- that responsibility is assigned correctly;
- that scope is correct;
- that an SSP narrative is accurate;
- that an organization is ready, compliant, certified, low risk, or Met/Not Met.
