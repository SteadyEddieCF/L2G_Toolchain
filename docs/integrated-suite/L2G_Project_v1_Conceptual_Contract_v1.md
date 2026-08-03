# `l2g_project_v1` Conceptual Contract v1

## Status

Conceptual planning contract. Field-level schemas are not frozen by this document.

## Purpose

Define one user-visible engagement project container for the integrated suite while preserving modular domain ownership, reference-only evidence, source traceability, legacy interoperability, recovery, and deterministic integrity validation.

The normal user should open and save one file:

`<Client>_<Engagement>.l2g`

## Container

The `.l2g` project is a structured ZIP-based container rather than one flat JSON object.

Recommended layout:

```text
manifest.json

domains/
  engagement.json
  pre-engagement.json
  evidence-index.json
  scope.json
  workshop.json
  ssp.json
  delivery.json
  reviews-actions.json

interviews/
  <session-id>.json

evidence/
  extracts/
    <document-id>.json
  structured/
    <document-id>-<record-set>.json
  previews/
    <document-id>-<location>.json

history/
  events.ndjson
  checkpoints/
    <checkpoint-id>.json
  undo-boundaries.json

compatibility/
  imports/
    <immutable-import-id>.json
  exports/
    <immutable-export-id>.json
  legacy-contract-index.json

preferences/
  project-preferences.json

integrity/
  contents.json
  sha256-manifest.json

migrations/
  applied.json
```

## Root manifest responsibilities

`manifest.json` identifies project and domain resources. It does not duplicate complete domain data.

Conceptual example:

```json
{
  "project_kind": "l2g_project_v1",
  "project_version": "1.0",
  "project_id": "opaque-stable-id",
  "created_at": "2026-08-03T00:00:00Z",
  "updated_at": "2026-08-03T00:00:00Z",
  "application_identity": {
    "product": "L2G Integrated Suite",
    "release": "foundation-candidate"
  },
  "domains": {
    "engagement": {
      "schema": "l2g_engagement_v1",
      "version": "1.0",
      "path": "domains/engagement.json"
    }
  },
  "evidence_policy": "reference-only",
  "encryption": {
    "mode": "undecided"
  },
  "integrity_manifest": "integrity/sha256-manifest.json"
}
```

## Initial domain schemas

### `l2g_engagement_v1`

Engagement identity, objectives, phase, dates, participants, safe metadata, presentation preferences, and project-level configuration.

### `l2g_pre_engagement_v1`

Questionnaires, inventories, assumptions, known constraints, prior reports, client narratives, meeting participants, and initial responsibility candidates.

### `l2g_evidence_index_v1`

Document identities, SHA-256 fingerprints, parser metadata, extraction status, structured records, source locations, provenance, confidence, candidate mappings, and review status.

### `l2g_scope_model_v1`

Systems, environments, assets, providers, services, CUI and security-protection data flows, assumptions, decision ledger, unresolved questions, and authoritative reviewed scope decisions.

### `l2g_interview_session_v1`

Agenda, scripted questions, suggested questions, advisor-added questions, client responses, advisor notes, participants, evidence references, actions, requests, unresolved questions, and client-safe summary.

### `l2g_workshop_model_v1`

Practice review, conclusions, evidence review, evidence requests, gaps, recommendations, actions, blockers, provider follow-up, and responsibility discussion.

### `l2g_ssp_model_v1`

Governed SSP content, requirements, modules, narratives, inheritance, conflicts, baselines, review history, and controlled proposals from Practice Review.

### `l2g_delivery_model_v1`

Output profiles, assembly requests, template identities, generated-artifact receipts, manifests, hashes, reconciliation, and output history.

### `l2g_review_model_v1`

Cross-domain proposals, before-and-after state, assignments, comments, conflicts, decisions, rationale, and review history.

### `l2g_audit_history_v1`

Commands, changes, migrations, saves, imports, exports, checkpoints, restoration, and integrity events.

## Evidence policy

Reference-only evidence is the default.

The project should not embed duplicate original client evidence files. It stores only the information required for continued work and traceability, including:

- stable document ID;
- original filename;
- file type and size;
- last-modified value when available;
- SHA-256 fingerprint;
- extracted text or structured records needed by the application;
- page, paragraph, row, sheet, slide, object, speaker, or timestamp locations;
- parser and confidence information;
- review status;
- provenance;
- candidate mappings;
- evidence relationships.

## Relink Evidence

Relinking must:

1. ask the user to reselect source files;
2. hash each selected file;
3. match exact SHA-256 values first;
4. use filename, size, and modified time only as secondary hints;
5. require review for non-exact matches;
6. never silently replace a source identity;
7. record relink events in audit history.

## Authority transitions

Automatic visibility does not transfer authority.

A cross-domain proposal should contain at least:

```json
{
  "proposal_id": "stable-id",
  "source_domain": "evidence",
  "target_domain": "scope",
  "source_record_refs": [],
  "proposed_operation": "create-provider",
  "proposed_value": {},
  "state": "awaiting-review",
  "decision": null,
  "history": []
}
```

Rules:

- creating a proposal does not modify the target domain;
- Accept creates or updates a target-owned record with source links;
- Modify preserves the original proposal and accepted modification;
- Reject preserves proposal and rationale;
- Supersede links prior and replacement proposals;
- Published content changes only through a later governed revision;
- Deliverables consume approved projections only.

Shared transition states:

- Candidate;
- Suggested;
- Awaiting Review;
- Accepted;
- Modified;
- Rejected;
- Superseded;
- Approved;
- Published.

## Save and recovery semantics

The product must distinguish:

- browser-local working recovery;
- project-file save;
- backup creation;
- download initiation;
- fingerprint-verified saved artifact.

Recommended model:

- `.l2g` is the portable project;
- IndexedDB stores browser-local recovery and working checkpoints;
- local storage stores only capped, sanitized UI preferences and safe pointers;
- explicit Save writes the project container;
- autosave updates browser recovery, not an unverified downloaded file;
- import, migration, restoration, and large reconciliation create named checkpoints.

## History model

Use a command journal with checkpoints rather than unrestricted full event sourcing for the first implementation.

- meaningful user actions are commands;
- reversible commands provide explicit inverse operations;
- Undo and Redo never mean browser navigation;
- large imports and migrations restore from checkpoints;
- checkpoint restoration appends a restoration event rather than deleting history;
- audit history records actor labels as locally asserted unless a future authenticated host provides identity.

## Integrity

The project container should support:

- deterministic path inventory;
- SHA-256 for every entry;
- deterministic manifest fingerprint;
- duplicate-path rejection;
- traversal-path rejection;
- duplicate JSON-key rejection for governed JSON;
- bounded entry count and expanded size;
- decompression-ratio and recursive-container safeguards;
- schema and semantic validation before mutation.

## Encryption decision

Project encryption remains unresolved.

Because extracted text may contain CUI even when originals are reference-only, the first production-use release must not silently assume that an unencrypted ZIP is sufficient. A security ADR must decide:

- mandatory versus optional encryption;
- AES-GCM envelope design;
- passphrase derivation;
- recovery limitations;
- metadata exposure;
- browser compatibility;
- SharePoint-host differences.

Until that decision is approved, the conceptual `encryption.mode` remains `undecided` and no production-CUI suitability claim is made.

## Legacy compatibility

Existing handoff packages remain supported as:

- migration inputs;
- immutable import snapshots;
- standalone interoperability routes;
- export artifacts;
- audit evidence;
- backup or recovery artifacts;
- regression fixtures.

Normal integrated use should not require manual download and upload of intermediate JSON handoffs.
