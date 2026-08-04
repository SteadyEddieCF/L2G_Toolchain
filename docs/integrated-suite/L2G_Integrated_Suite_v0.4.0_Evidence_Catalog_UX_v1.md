# L2G Integrated Suite v0.4.0 — Evidence Catalog UX v1

## Status

Workflow and presentation specification for the v0.4.0 Evidence Catalog Core. It becomes the implementation UX gate when the design PR merges.

The release remains synthetic-only. This document does not authorize production, client, FCI, or CUI use and does not turn presentation profiles into security roles.

## UX objective

Provide a trustworthy Evidence workspace for registering, locating, reviewing, relinking, and proposing source-derived information without embedding original evidence, replacing DocConverter-L2G, or making unsupported assessment conclusions.

The primary advisor mental model is:

1. **Register the source reference.**
2. **Confirm exactly which bytes it represents.**
3. **Review exceptions and duplicates.**
4. **Inspect bounded source-derived records and provenance.**
5. **Publish candidates to an owning domain.**
6. **Relink exact bytes when the project is reopened.**

The product must distinguish:

- source identity from filename;
- byte equality from trust;
- linked-this-session from saved-in-project;
- processing completion from review completion;
- evidence relationships from evidence sufficiency;
- candidate publication from target acceptance.

## Workspace navigation

The Evidence workspace uses internal tabs or segmented navigation:

- **Catalog**
- **Add Evidence**
- **Exception & Trust Queue**
- **Duplicates & Revisions**
- **Derived Records**
- **Candidate Mappings**
- **Relink Evidence**
- **Import Packages**

`Processing Activity`, full extracted-content review, diagrams, security evidence, meetings/transcripts, OCR controls, parser diagnostics, and raw package structures remain either bounded read-only imported records, Advanced inspector content, or later-release work. v0.4 does not imply that the integrated runtime performs DocConverter parsing.

## Shared Evidence header

Keep visible within the workspace:

- catalog search;
- profile-safe factual counts;
- Add Evidence;
- Relink Evidence;
- Import Package;
- Exception & Trust Queue count;
- active filters;
- clear-filter control;
- qualification: “Source records and hashes do not determine evidence sufficiency or compliance.”

Counts are computed only from the active profile projection. Client View never receives hidden source counts.

## Catalog view

### Default table/list fields

Advisor and Reviewer:

- display label;
- original filename;
- media type;
- size;
- fingerprint short form;
- lifecycle;
- processing state;
- review state;
- trust/exception state;
- session link state;
- duplicate/revision indicator;
- visibility;
- updated time.

Client:

- client label;
- approved source type;
- approved review/presentation status;
- approved source relationship summary;
- no raw filename, collection hint, fingerprint, parser state, confidence, provenance, exception details, duplicate rationale, or internal updated-by information.

### Row actions

Advisor:

- Open inspector;
- Relink;
- Review metadata;
- Mark for attention;
- Resolve exception;
- Create revision;
- Review duplicate group;
- Create candidate mapping;
- Archive.

Reviewer:

- Open inspector;
- Review history and source traceability;
- Open related candidate/review item;
- no direct Evidence editing.

Client:

- Open approved presentation detail only;
- no relink, archive, provenance, candidate, trust, or duplicate action.

### Empty states

Advisor empty state:

> No evidence references have been registered. Add synthetic files or import a recognized synthetic DocConverter package.

Client empty state:

> No evidence references are approved for this presentation.

The Client empty state must not reveal that hidden evidence exists.

## Add Evidence flow

### Step 1 — Select

Provide a native file picker with:

- multi-select;
- visible 500-file batch limit;
- visible 2 GiB per-file limit;
- no directory-path persistence;
- no claim that selected files will be embedded.

Persistent qualification:

> Original files stay outside the project. The app records reference metadata and SHA-256 fingerprints only.

### Step 2 — Hash locally

Show each staged file with:

- sanitized base filename;
- size;
- type;
- hashing progress;
- Cancel;
- Retry after error.

Hashing runs in a local worker. The UI must stay responsive, expose cancellation, and avoid a false completed state before the entire file digest is available.

Cancelling or failing leaves governed state unchanged.

### Step 3 — Review identity and duplicates

After hashing, show one disposition card per staged source:

- **New bytes** — no exact catalog fingerprint;
- **Exact existing source** — same bytes already registered;
- **Exact duplicate candidate** — same bytes under a separately staged business reference;
- **Unsupported metadata** — metadata requires correction;
- **Limit/error** — cannot register.

File name, size, and modified time may appear as hints but the exact-hash result is visually primary.

For exact existing bytes, offer:

- Link this session to the existing source;
- Register a separate duplicate reference, with rationale;
- Skip.

Do not offer silent overwrite or automatic merge.

### Step 4 — Metadata

For each new source:

- display label;
- optional client label;
- optional collection label;
- tags;
- visibility;
- initial review state;
- initial trust/exception state;
- optional rationale.

Original filename is shown as read-only source metadata. The user edits the display label rather than renaming source identity.

### Step 5 — Commit

Show a final batch summary:

- new sources;
- session links;
- duplicate references;
- skipped items;
- warnings;
- checkpoint name.

Commit is one validated command and one named checkpoint. If any required record is invalid, no partial catalog mutation occurs.

## Exception & Trust Queue

This view is factual workflow, not an evidence-sufficiency queue.

Queue reasons:

- source bytes unavailable this session;
- last relink hash mismatch;
- external reference has no fingerprint;
- processing failed, partial, or unsupported;
- source unreviewed or marked needs attention;
- trust exception open;
- exact duplicate unresolved;
- revision chain inconsistent;
- imported record lacks source traceability;
- candidate returned by target;
- import preview awaiting decision.

Each card shows:

- reason;
- affected source;
- last verified time/result;
- provenance;
- related sources/locations;
- permitted commands;
- rationale/history.

Do not use red/green alone. Use text, icon, and accessible state labels.

Client View does not show the Exception & Trust Queue.

## Duplicates & Revisions

### Duplicate group review

Show:

- exact shared SHA-256;
- group members;
- display/original labels;
- source origins;
- revision relationships;
- review and lifecycle states;
- current dispositions;
- rationale/history.

Advisor can assign:

- Primary;
- Duplicate;
- Retained distinct;
- Excluded;
- Unresolved.

The UI must state:

> Exact duplicates contain the same bytes. The app does not decide which business reference should be retained.

No source is deleted by duplicate disposition.

### Revision review

Show old and new source metadata side by side:

- separate IDs;
- separate fingerprints;
- labels;
- sizes and modified hints;
- revision relationship;
- supersession choice;
- linked candidate mappings and derived records;
- rationale.

Creating a revision never edits the old fingerprint. Superseding the old source is a separate explicit choice.

## Relink Evidence flow

### Entry modes

- Relink one selected source;
- Relink all currently unlinked sources;
- Relink a filtered set;
- Select files and let the app identify exact matches.

### Matching process

For each selected file:

1. hash locally;
2. find exact SHA-256 matches;
3. rank filename/size/modified hints only for review ordering;
4. require user confirmation when more than one source shares the hash;
5. create an in-memory association and verification receipt.

### Exact match

Show:

- intended source;
- exact digest confirmation;
- selected metadata;
- last prior verification;
- Link this session.

After confirmation, session state becomes `linked-exact`. Explain that this state is temporary and clears on lock/reload.

### Hash mismatch

Show a blocking mismatch panel:

- intended source fingerprint;
- selected fingerprint;
- source and selected metadata;
- any exact match elsewhere in the catalog;
- Cancel;
- Link to another exact source;
- Create New Revision.

Never offer “force relink,” “replace hash,” or filename-only acceptance.

### Batch result

Summarize exact links, mismatches, duplicate matches, new revisions, cancelled items, and errors. A batch relink creates a checkpoint when it changes governed records; exact session links alone create receipts/history but do not change source identity.

## Derived Records

v0.4 supports bounded imported summaries and flat structured records only.

Views:

- All derived records;
- Extract summaries;
- Structured records;
- Diagram descriptions;
- Security-evidence items;
- Meeting segments;
- Parser diagnostics (Advisor only).

A card shows:

- title and kind;
- source label;
- source locations;
- bounded summary/fields;
- parser/import identity;
- confidence;
- review state;
- provenance;
- visibility;
- related candidate mappings.

The UI must distinguish:

- imported summary;
- reviewed derived record;
- parser diagnostic;
- source document itself.

No raw active HTML, binary preview, image, or large source text is rendered.

## Source inspector

Advisor/Reviewer sections:

- Identity;
- Fingerprint and verification;
- Session link status;
- Source locations;
- Derived records;
- Duplicate and revision relationships;
- Candidate mappings;
- Import provenance;
- Review/trust history;
- Command history.

Client inspector, where allowed, contains only approved presentation fields and source relationships from the Client projection.

Closing the inspector restores focus to the invoking row/card. Pinning remains supported. Switching to Client View closes any Advisor/Reviewer inspector before constructing the Client projection.

## Candidate Mappings

### Create mapping

Advisor selects:

- source records;
- source locations;
- derived records;
- target domain;
- target record type;
- proposed operation;
- bounded proposed fields;
- rationale;
- visibility.

Persistent warning:

> This creates a proposal. It does not change the target domain.

### Queue behavior

For implemented targets:

- Publish to target creates a target-owned candidate;
- Evidence retains source links and target candidate reference;
- target-domain review owns Accept, Modify, Reject, Return, and Supersede.

For unavailable targets:

- state remains Awaiting Review;
- show “Target workspace not yet implemented”;
- no disabled fake acceptance controls;
- allow edit, withdraw, or supersede.

v0.4 may demonstrate publication to Engagement candidates only. It may not directly edit accepted Engagement state.

### Reviewer view

Emphasize:

- source traceability;
- proposed fields;
- target domain;
- before/after where the target provides it;
- target candidate reference;
- returned/superseded history.

Client View never shows candidate mappings.

## Import Packages

Recognized package cards:

- `l2g_intake_package_v1` 1.0;
- `l2g_scope_context_v1` 1.0;
- `l2g_meeting_context_v1` 1.0.

### Import flow

1. Select package;
2. hash and identify package kind/version;
3. strict validation;
4. preview normalized sources, locations, derived records, and candidates;
5. show warnings/rejections;
6. Advisor Apply, Modify, or Reject;
7. create import receipt, checkpoint, and history.

The preview must show exactly which source identifiers and locations were preserved. Missing traceability is a visible exception, not silently invented.

Do not show unsupported package versions as partially usable. Do not change the legacy package or standalone DocConverter runtime.

## Search behavior

### General

- build the index only from the active profile projection;
- rebuild on unlock, profile change, Evidence mutation, import application, and project migration;
- do not persist queries, snippets, tokens, recent results, or search index data;
- clear results and inspector on profile change;
- support keyboard focus and Escape to clear/close.

### Result grouping

- Sources;
- Locations;
- Derived records;
- Relationships;
- Candidate mappings (Advisor/Reviewer only);
- Imports (Advisor/Reviewer only).

### Client non-disclosure

Client search must not reveal hidden content through:

- autocomplete;
- result counts;
- snippets;
- “no longer available” placeholders;
- prior queries;
- hidden tags;
- original filenames;
- fingerprint fragments;
- exception reasons;
- candidate titles;
- inspector state.

When a Client query has no visible result, show only:

> No approved evidence references match this search.

## Factual Overview integration

The Overview workspace may show profile-safe factual Evidence cards:

- registered sources;
- sources needing review;
- open exceptions;
- unresolved duplicates;
- failed/unsupported processing;
- mappings awaiting target review;
- sources requiring relink this session.

Do not show:

- evidence coverage percentages;
- practice coverage;
- sufficiency scores;
- readiness status;
- compliance status;
- risk scores;
- Met/Not Met.

## Presentation profiles

### Advisor View

Full Evidence workflow, including source registration, relink, original names, fingerprints, provenance, trust exceptions, duplicate disposition, imports, candidate creation, advanced diagnostics, and history.

### Reviewer View

Read-only review emphasis, including source identity, changes, fingerprints, verification receipts, import provenance, duplicate/revision rationale, candidate mappings, and history. Reviewer actions route through Reviews & Actions or target-domain review, not direct Evidence edits.

### Client View

Curated facilitated presentation only. A Client-visible source requires:

- record visibility `client-safe` or `approved-for-client-presentation`;
- nonempty `client_label`;
- no open internal exception requiring the record to be withheld;
- only client-approved derived records and relationships.

Hide original names, raw package names, fingerprints, collection hints, parser diagnostics, confidence, provenance, internal review/trust detail, duplicates, revisions not approved for discussion, candidates, receipts, imports, history, and all hidden counts.

### Qualification

Presentation profiles are not security roles. The complete unlocked project contains Advisor data. External distribution requires a later curated export capability.

## Accessibility

Required behavior:

- keyboard-operable internal tabs, filters, table/list navigation, staged-source cards, dialogs, and inspector;
- visible focus and logical focus order;
- hashing progress exposed through accessible status/live regions without excessive announcements;
- Cancel available by keyboard during hashing;
- no color-only duplicate, exception, trust, review, or link states;
- accessible names for hash copy, relink, duplicate, revision, and candidate controls;
- tables provide row/column context or switch to accessible cards at narrow widths;
- modal/dialog focus containment and restoration;
- error summaries link to invalid fields;
- fingerprint values remain selectable but are not the sole label;
- reduced-motion preference respected.

## Responsive requirements

### Advisor laptop: 1366×768

- header, search, Add Evidence, Relink, and Exception Queue remain reachable without horizontal page scrolling;
- catalog may use a scrollable data region with frozen primary label/actions;
- inspector overlays or collapses without hiding the active source identity;
- staged hashing progress and commit summary remain usable.

### Client presentation: 1280×720

- approved source cards and labels remain readable at distance;
- no dense fingerprint/provenance tables;
- Client search and approved-detail view remain keyboard operable;
- qualification remains visible but compact.

### Narrow viewport

- table becomes labeled cards;
- primary action order is preserved;
- no required action exists only in hover;
- inspector becomes a full-height drawer and restores focus on close.

## Error language

Use factual, actionable messages:

- “The selected bytes do not match this source fingerprint.”
- “This file matches another registered source.”
- “The package version is not supported.”
- “The import contains a source reference that cannot be resolved.”
- “Hashing was cancelled. No evidence record was changed.”
- “The project limit would be exceeded. No records were added.”

Avoid conclusions such as:

- “Evidence failed.”
- “Control not met.”
- “Insufficient evidence.”
- “Noncompliant.”
- “High risk.”

## Explicit exclusions

- full document viewer;
- PDF/Office/OCR parsing;
- image/thumbnail generation;
- automatic file watching;
- persisted portable file handles;
- cloud storage/sync;
- AI or fuzzy duplicate classification;
- evidence sufficiency or assessment scoring;
- automatic target acceptance;
- client-safe export generation;
- production/client/FCI/CUI authorization.
