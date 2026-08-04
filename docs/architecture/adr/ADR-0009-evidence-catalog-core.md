# ADR-0009 — Canonical Evidence Catalog Core

## Status

Accepted for L2G Integrated Suite v0.4.0 implementation when this reviewed design package merges. Production, client, FCI, and CUI use remains unauthorized.

## Date

2026-08-04.

## Context

The Integrated Suite now has an encrypted project foundation and a governed Engagement domain. The next bounded release needs one canonical Evidence catalog before Pre-Engagement, Scope, Practice Review, SSP, or Deliverables can consume source-derived information inside the integrated workflow.

The Evidence catalog must preserve the existing product posture:

- original evidence remains outside the `.l2g` project by default;
- DocConverter-L2G remains the authoritative standalone ingestion, extraction, normalization, Exception & Trust Queue, and provenance tool;
- stable DocConverter package contracts remain unchanged compatibility inputs;
- imported or derived content may propose records to another domain but may not silently mutate that domain;
- evidence presence, hashes, review states, or relationships may not be converted into readiness, compliance, evidence-sufficiency, certification, scoring, risk, or Met/Not Met conclusions;
- Advisor, Client, and Reviewer remain presentation profiles, not security roles;
- the normal runtime remains one local, offline, no-install HTML file with no runtime network dependency or telemetry.

A file name is not a durable identity. A successful hash comparison proves only that two selected byte sequences are identical; it does not prove authenticity, trustworthiness, relevance, currency, sufficiency, or applicability. Browser file handles and absolute paths are not portable project data. These distinctions must be explicit before implementation.

## Decision

### Domain ownership and archive location

1. The Evidence domain owns `domains/evidence-index.json` and schema kind `l2g_evidence_index_v1` version `1.0`.
2. The v0.4 project domain index contains Engagement, Evidence, and Reviews & Actions authorities.
3. The Evidence domain owns source identities, reference metadata, fingerprints, source locations, bounded derived-record summaries, evidence relationships, duplicate groups, verification receipts, import receipts, and Evidence-origin candidate mappings.
4. Original source bytes, persisted browser file handles, absolute paths, and automatic external-file watchers are excluded.
5. v0.4 does not require per-source archive entries. The bounded catalog remains one governed domain document so the inherited exact-path, stored-ZIP, 64-entry, 4 MiB-per-entry, 12 MiB-expanded, and 16 MiB-encrypted-envelope safeguards remain unchanged.
6. Full extracted documents, images, thumbnails, OCR layers, Office/PDF parsing payloads, and large transcript bodies are not introduced in v0.4. The contract supports bounded plain-text summaries and flat structured records imported from recognized packages for synthetic validation only.
7. Compatibility imports are represented by immutable import receipts and normalized candidate records inside the Evidence domain. Original import package bytes remain reference-only and are identified by hash.

### Stable source identity

8. Every Evidence source uses an opaque immutable `evidence_id` with the `evidence_` prefix.
9. `original_name`, display labels, media type, extension, size, and last-modified values are metadata and never record identities.
10. A source fingerprint is the lowercase hexadecimal SHA-256 of the complete selected byte sequence.
11. An accepted source record requires a complete SHA-256 fingerprint unless its `origin_kind` is `external-reference`; external references remain explicitly unhashed and require attention until a local byte source is selected.
12. A hash match proves byte equality only. Product language and tests must not describe it as authenticity, trust, relevance, currency, evidence sufficiency, or control validation.
13. File names are sanitized for control characters and display spoofing. Absolute paths, drive letters, browser `webkitRelativePath`, user profile names, and directory structures are not persisted by default.
14. A user-entered collection label may group sources, but it is not a path and does not affect identity.
15. The raw original filename is Advisor/Reviewer metadata. Client projections never expose it. A separate `client_label` is required before a source can be presented by name in Client View.

### State dimensions

16. Evidence lifecycle values are `active`, `superseded`, and `archived`.
17. Processing states are `not-requested`, `pending`, `processing`, `complete`, `partial`, `failed`, and `unsupported`.
18. Review states are `unreviewed`, `in-review`, `reviewed`, `needs-attention`, and `excluded`.
19. Trust/exception states are `not-evaluated`, `no-exception`, `exception-open`, `exception-resolved`, and `rejected`.
20. Session link states are `unlinked`, `hashing`, `linked-exact`, `mismatch`, `cancelled`, and `error`. They exist only in browser memory and are never portable project fields.
21. Duplicate member dispositions are `unresolved`, `primary`, `duplicate`, `retained-distinct`, and `excluded`.
22. Candidate-mapping states are `draft`, `awaiting-review`, `published-to-target`, `returned`, `withdrawn`, `superseded`, and `closed`.
23. These dimensions are independent. For example, a source can be active, complete, needs-attention, and exception-open without implying an assessment conclusion.

### Source selection and hashing

24. User-selected files are processed locally. File bytes are read in bounded slices by a cancellable Web Worker using a bundled incremental SHA-256 implementation; source bytes are not copied into project state, browser recovery, history, logs, screenshots, or CI artifacts.
25. The portable baseline uses ordinary browser file selection and the File API. Optional browser save APIs remain capability enhancements and are not required for evidence relinking.
26. The implementation must reject a single source larger than 2 GiB and a selection batch larger than 500 files before hashing begins. These limits are a v0.4 safety baseline, not a claim that every permitted batch will be convenient on every endpoint.
27. Hashing progress, cancellation, failure, and retry are visible. Cancelling, failing, or rejecting a staged hash operation before an explicit commit leaves governed state, history, and persistent receipts unchanged.
28. Registering selected material is a two-step command: hash and stage first, then explicitly add accepted source records after duplicate and metadata review.

### Relink Evidence and revisions

29. Relink Evidence asks the user to reselect one or more files and hashes each selection before any governed mutation.
30. Exact SHA-256 matches are evaluated first. File name, size, media type, and modified time are secondary hints only and may never override a hash mismatch.
31. An exact match associates the selected browser `File` with the existing source in an in-memory session map, appends a verification receipt and history event, and does not change the source identity.
32. Session associations are cleared on project lock, reload, project close, failed unlock, or explicit unlink.
33. A hash mismatch never replaces the selected source record. The permitted choices are Cancel, create a new revision source, or associate the bytes with another existing exact-hash source.
34. Creating a new revision creates a new `evidence_id`, preserves the prior record, and adds a `revision-of` relationship plus supersession links when the user explicitly chooses to supersede the prior version.
35. Completed, explicitly confirmed relink and revision decisions preserve selected metadata, resulting hash, decision, rationale, timestamp, profile label, and source references in verification receipts and history. A cancelled mismatch or worker error remains transient and writes no governed record.
36. No passphrase, key, original bytes, absolute path, or persistent file handle appears in a verification receipt.

### Duplicate detection and disposition

37. Exact duplicate candidates are records sharing the same SHA-256 fingerprint.
38. Duplicate groups are deterministic by fingerprint membership but use an opaque stable `duplicate_group_id` for governed decisions.
39. Detection does not delete, merge, archive, or choose a primary source.
40. Advisor disposition explicitly selects a primary, marks a duplicate, retains records as distinct business references, excludes a record, or leaves the group unresolved.
41. Every disposition requires rationale and history. A primary record may not be archived or superseded while active members still depend on it without a reviewed replacement.
42. Fuzzy, semantic, AI-based, image-similarity, or partial-content duplicate classification is excluded from v0.4.

### Locations, derived records, and relationships

43. Source locations use stable `location_id` values and one of: `whole-source`, `page`, `paragraph`, `sheet`, `row`, `cell-range`, `slide`, `object`, `speaker-turn`, `timestamp-range`, `package-field`, or `unknown`.
44. Location fields are typed and bounded. A location may identify page numbers, paragraph labels, sheet/row/cell ranges, slide/object labels, speaker labels, timestamp ranges, package paths, or record paths without storing source bytes.
45. Bounded derived records use stable `derived_id` values and one of: `extract-summary`, `structured-record`, `diagram-description`, `security-evidence-item`, `meeting-segment`, or `parser-diagnostic`.
46. Derived records contain a title, bounded plain-text summary, optional flat scalar fields, source and location references, parser metadata, confidence, provenance, review state, and visibility.
47. v0.4 allows no executable markup, arbitrary HTML, scripts, active Office content, image payloads, binary blobs, nested arbitrary JSON, or unbounded raw extracts.
48. Evidence relationships use stable IDs and one of: `duplicate-of`, `revision-of`, `derived-from`, `contains`, `supports`, or `related-to`.
49. `supports` means only that a user or recognized import asserted a relationship. It is not an evidence-sufficiency or practice-conclusion determination.
50. Duplicate IDs, dangling references, cycles in revision/supersession chains, self-relations where prohibited, unsupported kinds, and inconsistent reverse links are rejected before mutation.

### Search

51. The Evidence search index is rebuilt in browser memory on project open, unlock, profile change, and governed Evidence mutation.
52. The search index is built only after profile filtering. Hidden records never contribute terms, counts, suggestions, snippets, empty states, prior-query completion, or inspector content.
53. The index is not stored in `.l2g`, IndexedDB recovery, localStorage, history, or telemetry. Search queries and result selections are not persisted.
54. Advisor and Reviewer search may index visible display labels, original names, client labels, tags, bounded derived summaries, flat structured fields, source-location labels, relationship labels, and visible status terms. Client search indexes only explicit client labels plus separately client-visible tags, bounded derived content, location labels, relationship labels, and approved status terms; Advisor display labels are not a Client fallback.
55. Raw original filenames, parser diagnostics, provenance, internal rationale, exception details, and candidate proposals are excluded from Client search.
56. Results return references to profile-safe projections, not mutable Evidence authority objects.

### Candidate mappings and target authority

57. An Evidence candidate mapping identifies source and location references, target domain and target type, proposed operation, bounded proposed fields, rationale, provenance, visibility, and supersession links.
58. Creating a mapping does not mutate Engagement, Pre-Engagement, Scope, Practice Review, SSP, Deliverables, or Reviews & Actions.
59. Evidence may publish a mapping to an implemented target only by invoking a target-owned candidate creation command. The target candidate receives the Evidence mapping and source references.
60. Accept, Modify, Reject, Return, or Supersede decisions belong to the target authority. Evidence stores only a validated target reference and mirrored workflow state.
61. For target domains not yet implemented, mappings remain `awaiting-review`; the UI must not display nonfunctional acceptance controls.
62. v0.4 may demonstrate the boundary through the implemented Engagement candidate command, but direct Evidence-to-Engagement accepted-state mutation is prohibited.
63. No candidate mapping may propose readiness, compliance, certification, scoring, evidence sufficiency, risk, or Met/Not Met conclusions.

### DocConverter compatibility adapters

64. `l2g_intake_package_v1`, `l2g_scope_context_v1`, and `l2g_meeting_context_v1`, all version `1.0`, remain stable standalone contracts.
65. Import begins with package-kind/version recognition, strict JSON or bounded stored-ZIP validation as applicable, registry lookup, duplicate-key rejection, and a review preview.
66. The adapter records an immutable import receipt containing package identity, package SHA-256, size, selected source name, registry version, warnings, normalized candidate references, and disposition. Package bytes are not retained.
67. Imported document metadata, locations, derived summaries, structured fields, questions, diagrams, security-evidence records, or meeting segments remain candidates until the Advisor explicitly applies the import preview.
68. Adapters preserve source document identifiers and source locations when valid, but integrated Evidence IDs are separately generated and linked through provenance.
69. Unknown fields, unsupported versions, missing source traceability, invalid identifiers, oversized content, ambiguous source references, and malformed packages are rejected or routed to the Exception & Trust Queue without partial mutation. An Advisor may explicitly apply a reviewed valid subset; that selected subset commits atomically and the receipt records excluded/rejected rows.
70. Adapters do not infer scope boundaries, provider responsibility, practice conclusions, evidence sufficiency, SSP narratives, or client approval.
71. Stable legacy packages and standalone runtimes are not changed by v0.4.

### Presentation profiles and projections

72. Advisor View may add sources, review metadata, inspect original names and provenance, resolve exceptions, manage duplicate disposition, relink, create revisions, apply imports, and create candidate mappings.
73. Reviewer View is direct-edit read-only and emphasizes changes, source traceability, verification receipts, duplicate decisions, exceptions, imports, candidate mappings, and history.
74. Client View receives a separately constructed projection before rendering and search indexing.
75. Client projections omit original filenames, raw import package names, local collection hints, fingerprints, parser diagnostics, confidence, provenance, internal exception details, duplicate rationale, candidate mappings, verification receipts, and inspector content. Fingerprint presentation is outside v0.4 and requires a later reviewed design.
76. Client-visible sources require both a client-visible record visibility and a nonempty `client_label`. Otherwise the source is absent rather than shown under a fallback filename.
77. Presentation profiles remain non-security modes. A holder who unlocks the complete project can access full project content; external distribution still requires a curated export in a later release.
78. Every workspace receives a deep-cloned, recursively frozen, read-only Evidence projection with source domain, generated timestamp, profile, source record IDs, and factual next-work items.

### Factual next work

79. Evidence next-work may identify unreviewed sources, open exceptions, missing sources, hash mismatches, unresolved duplicate groups, failed/partial/unsupported processing, unpublished or returned candidate mappings, stale verification, and imports awaiting review.
80. Ordering is deterministic and profile-filtered.
81. Next-work text may not assert evidence sufficiency, practice implementation, readiness, compliance, risk, certification, scoring, or Met/Not Met.

### Migration, history, and limits

82. Opening a valid v0.3 project adds an empty `l2g_evidence_index_v1` domain, updates the exact domain index, creates a named migration checkpoint and history event, and requires the next save to use the v0.4 application identity.
83. v0.1 and v0.2 projects migrate through their existing paths and then receive the same empty Evidence domain. Migration infers no source, hash, relationship, candidate, or conclusion.
84. Evidence mutations are command-based. Undo and Redo restore state without deleting audit events. Large imports, batch registration, duplicate disposition, and migration create named checkpoints.
85. The inherited encrypted envelope, PBKDF2 profile, AES-GCM profile, ZIP parser, strict JSON parser, archive limits, history cap, and checkpoint cap remain unchanged unless a separate reviewed security decision explicitly changes them.
86. Semantic collection caps for v0.4 are: 2,000 sources, 5,000 locations, 5,000 derived records, 10,000 relationships, 2,000 duplicate groups, 5,000 candidate mappings, 2,000 verification receipts, and 100 import receipts. The stricter inherited 4 MiB domain-entry and 12 MiB expanded-project limits always prevail.
87. Titles and labels are capped at 300 characters, normal detail fields at 8,000 characters, derived summaries at 16,000 characters, flat structured records at 100 scalar fields and 64 KiB serialized, relationship arrays at 200 references per record, and tags at 50 values of 100 characters each.

### Safety posture

88. v0.4 remains synthetic-only.
89. Encryption and reference-only originals do not authorize production, client, FCI, or CUI use because derived summaries, filenames, metadata, locations, relationships, and import receipts may still be sensitive.
90. No runtime network, telemetry, cloud storage, synchronization, collaboration, authenticated identity, security roles, automatic file watching, or client distribution is introduced.
91. No parsing, OCR, diagram analysis, transcript processing, evidence sufficiency, readiness, compliance, risk, certification, scoring, or Met/Not Met conclusion is introduced.

## Consequences

### Positive

- Evidence receives one stable authority before downstream vertical slices depend on it.
- Users can continue work after reopening a portable project by explicitly relinking exact source bytes.
- Changed source files become visible revisions instead of silent identity replacement.
- Duplicate detection is deterministic without making business disposition decisions automatically.
- Search and Client View are designed to avoid hidden-record leakage.
- DocConverter packages become useful integrated inputs without changing their contracts or transferring authority.
- The current encrypted envelope and archive security limits remain reusable.

### Negative

- Original evidence must be reselected after reload or lock because portable browser file handles are not persisted.
- The catalog cannot provide full document viewing or reprocessing without the original file or a future approved derived-content model.
- The inherited 12 MiB project limit constrains imported summaries and structured records.
- Exact hashes cannot identify semantically similar or reformatted documents.
- Client View requires explicit client labels and still does not provide access control.
- Production use remains blocked despite local encryption and reference-only originals.

## Required acceptance evidence

- exact schema and semantic validation for every Evidence collection and state dimension;
- deterministic v0.3-to-v0.4 migration with an empty Evidence domain, checkpoint, and history event;
- v0.1/v0.2 migration regression through existing paths;
- chunked worker hashing, fixed vectors, progress, cancellation, failure, and no-mutation tests;
- exact relink, mismatch, changed-file revision, session-clear, and verification-receipt tests;
- exact-hash duplicate grouping and explicit disposition tests;
- source-location, derived-record, relationship, revision-chain, and dangling-reference validation;
- strict DocConverter package recognition, preview, apply, provenance, unsupported-version, malformed, oversized, and missing-traceability tests;
- target-domain non-mutation and narrow Engagement-candidate publication tests;
- profile filtering before search and render, including no original-name, hidden-count, query, snippet, candidate, provenance, exception, or inspector leakage;
- immutable cross-workspace projections and deterministic factual next-work tests;
- encrypted save/open/recovery/lock, Undo/Redo, checkpoint, strict archive, and cryptographic regression;
- Linux and native Windows Chromium `file://`, axe-core, 1280×720 Client presentation, 1366×768 Advisor workflow, zero-network, CSP, deterministic build, public hygiene, current-suite, and standalone-module non-regression.

## Non-decisions

This ADR does not authorize production/client/FCI/CUI data, original evidence embedding, large extracted-content storage, PDF/Office/OCR parsing, DocConverter replacement, fuzzy duplicate detection, cloud file access, persisted file handles, Scope authority, Practice Review conclusions, evidence sufficiency, SSP narratives, Deliverables generation, client export, authenticated identity, access control, readiness, compliance, risk, scoring, certification, or Met/Not Met.
