# L2G Integrated Suite v0.4.0 — Evidence Catalog Core Threat Model

## Scope

This update covers the new Evidence authority, local file selection and hashing, reference-only source identity, runtime relinking, exact duplicate grouping, revision handling, bounded derived records, search, DocConverter package adapters, candidate mappings, profile-safe projections, migration, and factual next-work behavior.

ADR-0007 continues to govern encrypted portable projects and encrypted browser recovery. ADR-0008 continues to govern Engagement authority. ADR-0009 governs Evidence.

The release remains synthetic-only and is not authorized for production, client, FCI, or CUI data.

## Protected assets

- canonical Evidence source identities and SHA-256 fingerprints;
- source metadata, original filenames, collection labels, tags, and handling labels;
- source locations and bounded derived summaries/structured records;
- provenance, confidence, parser/import identity, and source traceability;
- verification and import receipts;
- duplicate and revision decisions;
- trust exceptions and internal rationale;
- candidate mappings and target references;
- Advisor-only content excluded from Client View and Client search;
- encrypted project, browser recovery, history, checkpoints, and integrity manifests;
- user-selected original source bytes while transiently processed in browser memory.

## Trust boundaries

1. user-selected file metadata and bytes to the hashing worker;
2. hashing worker output to staged source registration;
3. selected source bytes to an in-memory session link map;
4. recognized legacy package bytes to strict parser and adapter preview;
5. import preview to Evidence-owned apply command;
6. Evidence authority to profile-safe read-only projections;
7. profile-safe projection to transient search index;
8. Evidence candidate mapping to a target-owned candidate command;
9. complete project state to encrypted save and encrypted recovery;
10. public repository and CI to synthetic fixtures and sanitized evidence only.

## Principal threats and controls

### Original evidence accidentally embedded

Threat: source bytes, browser file handles, paths, thumbnails, active content, or raw extracts are serialized into the project, recovery, logs, screenshots, or CI.

Controls:

- source registration stores only bounded metadata and complete SHA-256 fingerprint;
- runtime `File` associations live only in an in-memory map;
- exact schema rejects byte arrays, Blob/File objects, handles, path fields, data URIs, executable markup, and arbitrary nested payloads;
- lock, reload, close, and failed unlock clear runtime associations;
- static scans and runtime assertions inspect project, recovery, localStorage, logs, and generated evidence for known source markers;
- public fixtures use synthetic content only.

Residual limitation: unlocked browser memory contains selected source bytes while hashing and may be exposed by endpoint compromise, extensions, debugging tools, or memory inspection.

### Hashing denial of service or memory exhaustion

Threat: large or numerous files freeze the UI, exhaust memory, or produce partial/incorrect registration.

Controls:

- 2 GiB per-file and 500-file batch limits checked before hashing;
- bounded slice reads in a cancellable worker using incremental SHA-256;
- progress and cancellation;
- no governed mutation until the full batch review is committed;
- worker errors are generic and leave active state unchanged;
- fixed hash vectors, large synthetic files, cancellation, and retry tests;
- inherited project/archive limits remain unchanged.

Residual limitation: permitted large files may still be slow on constrained endpoints.

### Filename or path privacy leakage

Threat: filenames, directory structures, drive letters, usernames, or package names disclose sensitive context, especially through Client View, search, history, screenshots, or public tests.

Controls:

- persist base filename only after control and bidi-control sanitization;
- prohibit absolute paths, `webkitRelativePath`, drive letters, profile directories, URIs, and browser file handles;
- use a separately authored `client_label` for Client presentation;
- filter original names and collection labels before Client search and render;
- public fixtures and screenshots use synthetic names;
- profile-change tests clear search results and inspector state.

Residual limitation: an Advisor-visible original base filename may itself be sensitive inside the encrypted project.

### Hash confusion or trust overstatement

Threat: users or downstream code interpret a SHA-256 match as proof of authenticity, relevance, currency, control implementation, or evidence sufficiency.

Controls:

- product language says hash matches prove byte equality only;
- trust/review/processing dimensions remain separate;
- exact relink does not alter trust or review state;
- `supports` relationships and confidence do not determine assessment conclusions;
- tests prohibit readiness, compliance, sufficiency, certification, risk, scoring, and Met/Not Met language in Evidence calculations.

Residual limitation: users can still make poor human judgments; the tool cannot establish authenticity without a separately governed signature or chain-of-custody model.

### Silent source replacement

Threat: a same-named or similarly sized changed file silently replaces the fingerprint or identity of an existing source.

Controls:

- exact SHA-256 comparison is authoritative for relink;
- filename, size, type, and modified time are hints only;
- mismatch cannot be force accepted;
- changed bytes create a new source ID and `revision-of` relationship;
- prior source and fingerprint remain immutable;
- verification receipt and history preserve the decision;
- failed relink leaves state unchanged.

### Duplicate disposition corruption

Threat: exact duplicates are automatically merged/deleted, the wrong primary is selected, or a primary is archived while dependent records remain.

Controls:

- detection creates an unresolved group only;
- disposition requires Advisor rationale;
- no deletion command;
- resolved groups require one valid active primary unless all members are excluded/archived;
- relationship and dependency validation before archive/supersession;
- Undo, checkpoint, and history tests.

### Malicious or ambiguous source metadata

Threat: control characters, bidi overrides, extremely long labels, prototype keys, invalid Unicode, spoofed extensions, or contradictory media metadata confuse users or validators.

Controls:

- strict UTF-8 and JSON parsing;
- control/bidi removal for filenames and labels;
- bounded strings and tags;
- unknown-key and prototype-pollution rejection;
- extension and media type are hints, never parser-selection authority in v0.4;
- complete fingerprint remains independent of names/types;
- UI shows source type as metadata, not trust.

### Unsafe derived content

Threat: imported summaries or structured fields contain scripts, active HTML, binary data, huge nested JSON, hidden payloads, or misleading parser output.

Controls:

- allow bounded plain text and flat scalar fields only;
- reject markup, data URIs, binary content, nested arbitrary JSON, active content, and unsupported field types;
- parser diagnostics remain Advisor-only;
- derived records retain source/location references, parser identity, confidence, review state, and provenance;
- import preview before apply;
- sanitization and size validation before mutation.

Residual limitation: plain text may still contain misleading or sensitive content and requires human review.

### Legacy package authority escalation

Threat: DocConverter package content is treated as accepted Evidence, Scope, Practice, responsibility, SSP, or client-approved content without review.

Controls:

- recognize only registered package kinds and versions;
- strict parse, package hash, registry lookup, and preview;
- normalized records remain staged until explicit Advisor Apply/Modify/Reject;
- imported identifiers remain provenance links; integrated IDs are separate;
- missing traceability and ambiguous source references route to exceptions or rejection;
- no partial mutation on unsupported/malformed packages;
- no stable legacy contract or standalone runtime changes.

### Cross-domain authority transfer

Threat: Evidence candidate mappings directly mutate Engagement or future Scope/Practice/SSP records.

Controls:

- mapping creation changes only Evidence;
- target publication invokes a target-owned candidate creation command;
- target candidate reference required for `published-to-target`;
- target authority owns Accept, Modify, Reject, Return, and Supersede;
- unavailable targets expose no false acceptance controls;
- tests verify accepted target state is unchanged before target decision.

### Search leakage

Threat: hidden Evidence content leaks through search tokens, autocomplete, result counts, snippets, previous queries, empty states, or stale Client results.

Controls:

- build index only after profile filtering;
- index exists only in memory and is rebuilt on unlock/profile change/mutation;
- do not persist queries, snippets, tokens, recent results, or index data;
- clear results and inspector before profile switch render;
- Client index excludes original names, fingerprints, provenance, parser diagnostics, exceptions, duplicate rationale, candidates, receipts, imports, and history;
- DOM and count non-disclosure tests.

### Projection mutation

Threat: another workspace modifies Evidence authority through shared references.

Controls:

- deep clone and recursively freeze projections;
- no direct store references in renderers or search results;
- downstream changes require Evidence commands or target proposals;
- mutation attempts tested.

### Relationship corruption

Threat: duplicate IDs, dangling refs, self-relations, invalid duplicate fingerprints, cycles in revision/supersession chains, or contradictory reverse links corrupt traceability.

Controls:

- type-prefixed opaque IDs;
- exact-key validation;
- complete project-wide reference inventory;
- cycle detection;
- relationship-type rules;
- exact duplicate fingerprint requirement;
- validate cloned proposed state before mutation;
- malformed relationship adversarial tests.

### Session link confusion

Threat: the UI implies a source remains locally accessible after reload/lock, or associates a stale File object with the wrong project/source.

Controls:

- link state is runtime-only and visibly labeled “this session”;
- session map keyed by current project ID and evidence ID;
- clear on lock, close, reload, migration, failed unlock, and project replacement;
- relink always rehashes selected bytes;
- portable save never claims to preserve file access.

### Project-size and history exhaustion

Threat: many sources, locations, receipts, relationships, imports, or summaries exceed archive/history limits and corrupt save/recovery.

Controls:

- semantic caps plus inherited 4 MiB entry, 12 MiB inner, 16 MiB outer, 5,000-history, and 20-checkpoint limits;
- preflight serialized-size validation before command commit and save;
- bounded summaries/fields;
- no per-source archive entry explosion;
- large synthetic catalog tests;
- truthful user error with no partial mutation.

### Client-profile information leakage

Threat: Advisor-only source metadata leaks through counts, original names, hash fragments, duplicate/revision links, exceptions, provenance, candidate mappings, receipts, inspector, or search.

Controls:

- require Client-visible record visibility plus nonempty `client_label`;
- construct new Client projection before calculations, search, and render;
- omit restricted fields rather than hiding them with CSS;
- close inspector and clear search on profile switch;
- profile-specific counts, empty states, DOM text, keyboard navigation, and screenshots tested.

### Migration ambiguity

Threat: v0.3 projects gain inferred Evidence records, lose Engagement state, or silently change archive/security behavior.

Controls:

- deterministic empty Evidence domain only;
- preserve project/Engagement IDs and data;
- named migration checkpoint and event;
- exact domain index update;
- no source/hash/import/candidate inference;
- v0.1/v0.2 migrate through existing paths;
- failed migration leaves active state unchanged;
- inherited envelope and limits unchanged.

### Endpoint compromise

Threat: an unlocked project or selected source is exposed by a compromised browser, extension, operating system, local user, clipboard, screenshot, or memory snapshot.

Controls and limitations:

- encrypted-at-rest project and recovery;
- no runtime network access;
- restrictive CSP;
- best-effort key/source-reference clearing on lock/reload;
- no original bytes persisted;
- explicit product qualification.

This release cannot protect an unlocked session from a compromised endpoint or authorized local user.

## Misuse cases

- importing real client, FCI, or CUI content despite the synthetic-only boundary;
- using Client View as a safe distribution artifact or access-control boundary;
- treating exact hash match as authenticity or chain of custody;
- marking every source reviewed without inspection;
- resolving duplicates by deleting files outside the application and assuming portability;
- forcing a same-name changed file to represent the prior source;
- using `supports` relationships as evidence sufficiency;
- publishing candidates and assuming the target accepted them;
- putting sensitive path details into user-authored labels;
- importing unsupported packages by renaming `package_kind` or `version`;
- storing full raw extracts inside summary/structured fields;
- relying on stale session link indicators after reload or project change.

## Required verification

- fixed SHA-256 vectors, worker chunk boundaries, cancellation, retry, and large-file limit tests;
- known-source bytes absent from serialized project, encrypted recovery, localStorage, logs, and CI artifacts;
- filename/path sanitization and Client raw-name non-disclosure;
- exact relink, filename-hint mismatch, changed-file revision, duplicate-existing, and session-clear tests;
- duplicate group state/disposition/dependency validation;
- bounded derived text/field sanitization and active-content rejection;
- strict recognized package preview/apply/reject and malformed/unsupported/ambiguous package rejection;
- target non-mutation and Engagement candidate publication boundary;
- profile-filtered search/next-work/render/inspector non-disclosure;
- projection immutability and relationship cycle/dangling/self-reference tests;
- v0.3 empty Evidence migration and v0.1/v0.2 regression;
- encrypted save/open/recovery/lock, wrong-passphrase, tamper, AAD/purpose replay, truncation, and unsupported-profile regression;
- Linux and native Windows `file://`, axe-core, responsive, zero-network, CSP, deterministic build, public hygiene, current-suite, and standalone-module non-regression.

## Residual risk

v0.4 does not establish source authenticity, chain of custody, evidence sufficiency, production-data authorization, or endpoint security. It does not protect a complete unlocked project from its holder. It does not retain original evidence, so successful continued work depends on the user preserving and reselecting exact source bytes. The inherited project-size limits constrain large derived catalogs. Client View remains a presentation aid, not a security or distribution boundary.
