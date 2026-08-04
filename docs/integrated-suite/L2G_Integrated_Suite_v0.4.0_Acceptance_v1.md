# L2G Integrated Suite v0.4.0 — Evidence Catalog Core Acceptance

## Purpose

This document is the exact implementation and promotion gate for v0.4.0. Every required criterion must pass on the unchanged final implementation head before the current release pointer changes and the implementation PR merges.

Passing this matrix does not authorize production, client, FCI, or CUI data and does not establish evidence authenticity, evidence sufficiency, readiness, compliance, scoring, certification, risk, or Met/Not Met.

## Baselines

- prior Integrated Suite release: `0.3.0`;
- prior merge: `5cc028f78c683347081fbdd50b2e4773bb7ffd50`;
- prior final reviewed head: `ddbce5090e95d6459885f84c13c2df0705303585`;
- prior portable HTML SHA-256: `d4fe85feddf08b0e069546c04b40f3bb6e063da8fdba485b047beb879e847c2a`;
- encrypted envelope: `l2g_encrypted_project_v1` version `1.0`;
- project kind: `l2g_project_v1`;
- Engagement schema: `l2g_engagement_v1` version `1.0`;
- product/runtime compatibility baseline: `85d6e783a250b373cd4b9ea356e4c341336f9259`;
- stable DocConverter packages: `l2g_intake_package_v1`, `l2g_scope_context_v1`, and `l2g_meeting_context_v1`, version `1.0`;
- governing issue: #130.

## Release identity

- application version: `0.4.0`;
- Evidence schema: `l2g_evidence_index_v1` version `1.0`;
- Evidence projection: `l2g_evidence_projection_v1` version `1.0`;
- portable artifact: `L2G_Integrated_Suite_Evidence_Catalog_v0.4.0.html`;
- source remains additive; v0.1, v0.2, and v0.3 sources and deterministic release identities remain reproducible and immutable;
- project and encrypted-envelope kinds remain unchanged.

## Required functional criteria

### Canonical Evidence authority

- create an empty valid Evidence catalog for a new project;
- register one or more staged source records only after complete local hashing and explicit Advisor commit;
- use stable opaque IDs independent of filename, digest, or browser session;
- preserve original name as metadata while using editable display and client labels;
- support the exact lifecycle, processing, review, trust/exception, visibility, duplicate, candidate, verification, and import vocabularies in ADR-0009 and the contract;
- validate exact keys, IDs, timestamps, fingerprints, scalar field types, limits, reverse links, and state transitions;
- manage source lifecycle by archive or supersession rather than destructive deletion;
- preserve all meaningful Evidence mutations in command history;
- Undo and Redo restore state without deleting audit events;
- named checkpoints and checkpoint restoration remain functional.

### Local hashing and staged registration

- hash complete file bytes with SHA-256 in a cancellable worker using bounded slices;
- pass published fixed SHA-256 vectors, including empty, short, multi-chunk, exact-boundary, and non-ASCII byte cases;
- produce the same digest regardless of chunk boundaries;
- expose progress and cancellation without blocking the primary UI;
- reject a file above 2 GiB or a batch above 500 files before hashing;
- cancelling, worker failure, limit rejection, or invalid staged metadata leaves governed state unchanged;
- original bytes are absent from ProjectStore state, command history, checkpoints, recovery, localStorage, logs, and generated QA evidence;
- batch commit is atomic and creates one named checkpoint.

### Source identity and metadata

- exact digest is immutable after source registration;
- original name is a sanitized base filename with no path persistence;
- reject or sanitize control characters, bidi controls, separators, drive letters, URIs, and directory structures according to the contract;
- persist no `File`, Blob, handle, absolute path, `webkitRelativePath`, user profile, or drive metadata;
- support local-file, legacy-package-record, generated-output-reference, and external-reference origin kinds;
- unhashed external references remain needs-attention/exception-open and cannot be treated as exact linked sources;
- file type, extension, size, and modified time remain hints and never override a digest result;
- fingerprint language says byte equality only and does not assert authenticity or sufficiency.

### Runtime session linking

- maintain source-to-File associations only in browser memory for the active project;
- show session link state distinctly from portable saved state;
- clear associations on lock, project close, reload, project replacement, migration, failed unlock, and explicit unlink;
- saving and reopening the project returns sources to unlinked runtime state;
- source identity and verification history remain preserved when session links clear.

### Relink Evidence

- reselect and hash source bytes before any relink mutation;
- exact intended-source digest creates a `linked-exact` session association, verification receipt, and history event without changing source identity;
- name/size/modified hints cannot create an exact relink result;
- wrong same-name bytes produce a blocking mismatch;
- mismatch cannot force-replace a fingerprint;
- when bytes match another source, offer association to that exact source or explicit duplicate registration;
- changed bytes may create a new revision source with a new ID and fingerprint;
- revision creation preserves the old source and adds validated `revision-of` and optional supersession links;
- batch relink summary is factual and atomic for governed record changes;
- wrong/malformed/cancelled relink leaves active governed state unchanged.

### Exact duplicate detection and disposition

- detect exact duplicate candidates only when complete SHA-256 fingerprints match;
- create/update unresolved duplicate groups without deleting, merging, archiving, or selecting a primary;
- require Advisor rationale for primary, duplicate, retained-distinct, excluded, or unresolved dispositions;
- resolved active group has exactly one valid active primary unless every member is excluded/archived;
- reject group members with mismatched fingerprints, duplicate membership, invalid primary, or dangling refs;
- prevent archive/supersession of a required primary without a reviewed replacement;
- preserve duplicate decisions in history and Reviewer View;
- Client View receives no duplicate rationale, fingerprint, internal member count, or hidden group existence.

### Source locations

- support whole-source, page, paragraph, sheet, row, cell-range, slide, object, speaker-turn, timestamp-range, package-field, and unknown kinds;
- validate kind-specific required fields and reject contradictory fields;
- validate ordered nonnegative page, row, slide, and timestamp ranges;
- reject local filesystem paths in package/record location fields;
- preserve valid source refs and provenance;
- reject duplicate IDs and dangling source refs.

### Bounded derived records

- support extract-summary, structured-record, diagram-description, security-evidence-item, meeting-segment, and parser-diagnostic kinds;
- accept bounded plain-text title/summary and flat scalar fields only;
- reject nested arbitrary JSON, arrays as field values, executable markup, active HTML, scripts, event handlers, data URIs, binary payloads, Blob/File objects, and oversized content;
- enforce 100 scalar fields and 64 KiB serialized field cap per structured record;
- preserve source/location refs, parser identity, confidence, review state, provenance, and visibility;
- parser diagnostics remain Advisor-only and absent from Client projection/search;
- imported derived content remains unreviewed or needs-attention until explicit review.

### Evidence relationships and revisions

- support duplicate-of, revision-of, derived-from, contains, supports, and related-to;
- validate allowable endpoint types by relationship kind;
- duplicate-of requires matching source fingerprints;
- revision-of and supersession chains are acyclic and have consistent reverse links;
- derived-from references the correct source/location;
- prohibited self-relations are rejected;
- dangling, duplicate, contradictory, broken reverse, and unsupported relationships are rejected before mutation;
- `supports` is qualified as a relationship assertion and never produces an evidence-sufficiency conclusion.

### Candidate mappings and authority boundary

- create Evidence-origin candidates without changing target-domain accepted state;
- preserve source, location, derived, target, proposed operation/fields, rationale, provenance, visibility, and supersession refs;
- support draft, awaiting-review, published-to-target, returned, withdrawn, superseded, and closed states;
- unavailable target domains remain awaiting-review and expose no false acceptance action;
- publish to the implemented Engagement target only through an Engagement-owned candidate creation command;
- target accepted state remains unchanged before explicit Engagement Accept or Modify;
- target candidate reference is required for published-to-target;
- Evidence mirrors target workflow state but cannot manufacture a target decision;
- candidate decisions and source traceability appear in Reviewer View and history;
- Client View receives no candidate content, counts, target names, source labels, rationale, or stale inspector/search state;
- candidate text and calculations contain no readiness, compliance, evidence-sufficiency, certification, scoring, risk, implementation, or Met/Not Met conclusion.

### DocConverter compatibility adapters

For each recognized package kind/version:

- compute package SHA-256 and size;
- strictly identify package kind and version before normalization;
- verify registry presence and expected stability metadata;
- reject duplicate JSON keys, forbidden prototype keys, unsafe archive paths, duplicate paths, CRC/integrity failures, compression/recursive archive violations, unsupported version, and size violations;
- stage a preview without mutating Evidence;
- show accepted candidates, modifications, warnings, and rejected records;
- preserve valid source document IDs and source locations in provenance;
- generate separately opaque integrated IDs;
- require Advisor Apply, Modify, or Reject;
- apply atomically with one import receipt, checkpoint, and history event;
- preserve package name/hash/size/kind/version/registry version and normalized record refs without retaining package bytes;
- reject missing source traceability or ambiguous source refs without invented values;
- infer no Scope, responsibility, practice, SSP, evidence-sufficiency, client approval, readiness, compliance, risk, or Met/Not Met result;
- leave stable package schemas, registry entries, DocConverter source, and DocConverter current pointer unchanged.

Required recognized inputs:

- `l2g_intake_package_v1` 1.0;
- `l2g_scope_context_v1` 1.0;
- `l2g_meeting_context_v1` 1.0.

Required negative inputs:

- unknown package kind;
- unsupported version;
- missing package identity;
- duplicate keys;
- prototype pollution;
- oversized package;
- ambiguous source ID;
- missing source traceability;
- invalid location;
- raw JSON fragments outside bounded flat fields;
- unsupported nested payload;
- partial malformed batch.

### Search

- build search index only after profile filtering;
- rebuild on project open/unlock, profile change, Evidence mutation, import application, and migration;
- store no search index, tokens, snippets, query history, recent results, or result selections in `.l2g`, recovery, localStorage, history, or telemetry;
- Advisor and Reviewer search the allowed contract fields;
- Client search only approved client labels, approved tags, approved derived content, and approved visible states/relationships;
- hidden original names, fingerprints, collection labels, provenance, confidence, diagnostics, exceptions, duplicates, candidates, receipts, imports, and history contribute no Client terms or counts;
- clear results, autocomplete, and inspector before profile-switch render;
- hidden record queries return the generic Client no-result state only;
- search results reference frozen projections and cannot mutate Evidence authority.

### Presentation profiles and projections

- Advisor View supports source registration, metadata review, relink, exceptions, duplicates, revisions, imports, candidates, and provenance inspection;
- Reviewer View is direct-edit read-only and emphasizes change/history/source traceability;
- Client View is constructed before rendering, counting, next-work, search indexing, or inspector creation;
- Client-visible sources require client-visible record visibility and nonempty client label;
- Client projection omits original names, collection labels, raw package names, fingerprints unless separately approved by future design, confidence, provenance, diagnostics, exception details, duplicate rationale, candidates, verification receipts, import receipts, internal history, and hidden IDs;
- hidden records do not affect counts, search, next-work, autocomplete, snippets, empty states, DOM text, accessibility tree, or screenshots;
- profile switch closes/clears incompatible inspector and search state;
- every workspace receives a deep-cloned recursively frozen Evidence projection;
- attempted downstream mutation cannot alter Evidence authority;
- external client distribution remains explicitly qualified as requiring a later curated export.

### Factual next work

- deterministic ordering follows the contract;
- support hash mismatch/changed source, open trust exception, missing/unavailable source, unresolved duplicate group, failed/partial/unsupported processing, unreviewed source, returned/unpublished candidate, pending import, stale verification, and no-work informational state;
- Client calculation uses only Client-visible records and approved state text;
- next-work contains no readiness, compliance, evidence-sufficiency, certification, scoring, risk, implementation, or Met/Not Met language.

### Compatibility and migration

- open a valid v0.3 encrypted project and deterministically add an empty `l2g_evidence_index_v1` domain;
- preserve project ID, Engagement domain, history, supported checkpoints, encryption profile, compatibility baseline, and existing relationships;
- update exact manifest domain index;
- create `Migration to v0.4 Evidence Catalog Core` checkpoint and named history event;
- infer no sources, hashes, locations, derived records, relationships, imports, candidates, trust states, or conclusions;
- open valid v0.1/v0.2 projects through existing paths, then apply the same empty v0.4 migration;
- open, save, reopen, recover, lock, and unlock a native v0.4 project;
- wrong passphrase or failed migration leaves active governed state unchanged;
- v0.1/v0.2/v0.3 deterministic runtime identities remain unchanged;
- prior current pointers and release artifacts remain immutable.

## Required security and robustness criteria

- strict duplicate-key and prototype-pollution rejection;
- exact archive path, entry count, CRC, integrity, size, trailing-content, and stored-only validation before mutation;
- unknown-key rejection for governed Evidence records;
- inherited 64-entry, 4 MiB-entry, 12 MiB-inner, 16 MiB-outer, 240-path, 5,000-history, and 20-checkpoint limits remain unchanged;
- enforce Evidence semantic collection/string/field/tag/ref/file/batch limits;
- preflight proposed serialized project size before commit;
- malformed states, invalid fingerprints, duplicate IDs, dangling refs, unsupported enums, oversized fields, invalid transitions, broken duplicate groups, invalid revisions, cycles, and contradictory reverse links rejected;
- encrypted outer package and IndexedDB recovery contain no known plaintext marker;
- every encryption uses fresh salt and IV;
- wrong passphrase, ciphertext tamper, AAD tamper, purpose replay, truncation, and unsupported profile rejected;
- localStorage contains no governed records, keys, passphrases, ciphertexts, recovery envelopes, filenames, fingerprints, search data, or source associations;
- zero unexpected runtime network requests;
- restrictive CSP including `connect-src 'none'` and bounded `worker-src blob:` behavior;
- worker makes no network requests and imports no remote scripts;
- no client, FCI, CUI, secret, private path, client-identifying, or proprietary unlicensed repository/CI content.

## Required UX and accessibility criteria

- Evidence internal navigation is keyboard operable and indicates current location;
- catalog table/card, filters, search, staged hashing, dialogs, queues, duplicate review, revision comparison, candidate creation, import preview, and inspector have accessible names and visible focus;
- hashing progress uses accessible status/live behavior without excessive announcements;
- Cancel remains keyboard reachable during hashing;
- no serious or critical axe-core violations in tested Advisor, Client, and Reviewer routes;
- no color-only lifecycle, processing, review, trust, link, duplicate, revision, import, or candidate states;
- error summary links to invalid fields and describes no-mutation result;
- inspector focus returns correctly after close;
- profile switch clears incompatible focus/search/inspector content;
- Advisor layout usable at 1366×768;
- Client presentation readable at 1280×720;
- narrow table converts to labeled cards without hover-only actions;
- native Windows Chromium `file://` and Linux Chromium `file://` pass;
- reduced-motion behavior respected.

## Required performance criteria

- 500-file synthetic staging metadata list remains operable while hashing is serialized or bounded-concurrency;
- cancellation responds within a bounded next chunk boundary;
- 2,000-source metadata-only synthetic catalog opens and profile-filters without browser hang;
- transient search rebuild and common queries remain usable on the 2,000-source catalog;
- no full original source bytes enter ProjectStore or recovery regardless of source size;
- project save rejects before mutation when inherited archive limits would be exceeded;
- performance evidence records environment and limitations without claiming production scale.

## Required release engineering criteria

- strict TypeScript check;
- deterministic portable application build on Linux and Windows;
- release manifest, SHA-256 sums, SPDX SBOM, release notes, Evidence schema, synthetic fixtures, adapter fixtures, fixed hash vectors, and validation report;
- generated release and dist artifacts byte-identical;
- dedicated v0.4 Linux and Windows workflows;
- dedicated browser tests for hashing, relink, duplicates, revisions, search, imports, candidates, migration, recovery, profiles, and accessibility;
- v0.1/v0.2/v0.3 integrated-suite regression;
- current six-tool runtime, axe-core, visual, Windows file-origin, RG-4, SSP history, repository validation, foundation validation, and all inherited materializers;
- static public-hygiene scan of filenames, fixtures, logs, screenshots, manifests, SBOM, and release package;
- no unresolved review threads;
- exact candidate-head workflow and artifact identities recorded before promotion;
- promotion commit changes only release-state/evidence metadata and any narrowly required later-current validator reconciliation;
- final exact head reruns the complete required matrix before merge;
- downloadable ZIP and standalone HTML supplied after merge.

## Explicit exclusions

- original evidence embedding;
- persisted portable file handles or automatic source watching;
- full extracted documents, PDF/Office/OCR parsing, image/thumbnail generation, diagram analysis, transcript processing, or DocConverter replacement;
- fuzzy/semantic/AI duplicate classification;
- cloud services, sharing, sync, collaboration, authenticated identity, access control, telemetry, or security roles;
- Scope authority, Practice Review conclusions, responsibility determinations, SSP narratives, evidence sufficiency, gaps, recommendations, risk, readiness, compliance, scoring, certification, Met/Not Met, workbook/DOCX/PPTX generation, client-safe export, standalone retirement, or production authorization.
