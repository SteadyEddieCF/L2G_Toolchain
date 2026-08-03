# ADR-0002 — Structured `.l2g` Project Container

## Status

Proposed

## Context

The integrated suite requires one user-visible project file while retaining modular domain schemas, source traceability, recovery, legacy compatibility, and safe handling of large engagement records.

A single flat JSON document would couple unrelated domains, create large rewrites for small changes, complicate migration, and make evidence extracts and immutable compatibility snapshots difficult to manage.

## Decision

Use a structured ZIP-based container identified as `l2g_project_v1`.

The project will contain:

- a small root manifest;
- versioned domain documents;
- separate interview sessions;
- reference-only evidence indexes and extracts;
- command history and checkpoints;
- immutable legacy import and export snapshots;
- project preferences;
- migration records;
- deterministic integrity manifests.

Original evidence files are not embedded by default.

## Required properties

- stable project identity;
- explicit domain schema identities and versions;
- deterministic path inventory;
- SHA-256 entry hashes;
- duplicate-path rejection;
- traversal-path rejection;
- duplicate governed JSON-key rejection;
- bounded entry count and expanded size;
- recursive-container and decompression-ratio limits;
- validation before mutation;
- hash-based evidence relinking;
- truthful save and recovery states.

## Save model

- `.l2g` is the portable user-visible project.
- IndexedDB may hold working recovery and checkpoints.
- Local storage is limited to capped, sanitized UI preferences and safe pointers.
- Explicit Save writes a project container.
- Autosave updates browser recovery and must not claim the portable project was written.
- Imports, migrations, and restoration create checkpoints.

## History model

Use a command journal plus named checkpoints for the first implementation.

- reversible commands support Undo and Redo;
- large operations restore from checkpoints;
- restoration appends an event rather than deleting history;
- actor identity remains locally asserted in the offline edition.

## Evidence model

Reference-only evidence stores:

- stable document ID;
- original filename;
- type and size;
- last-modified value when available;
- SHA-256 fingerprint;
- extracted text or structured records needed for work;
- source locations;
- parser and confidence information;
- review status;
- provenance and relationships.

Relinking matches exact SHA-256 first and never silently replaces a source identity.

## Encryption boundary

This ADR does not decide encryption. A separate security ADR must determine whether encryption is mandatory or optional before production-CUI suitability is claimed.

## Consequences

### Positive

- modular schemas;
- isolated migrations;
- efficient handling of extracts and sessions;
- explicit integrity inventory;
- preserved legacy snapshots;
- easier recovery and forensic review.

### Negative

- archive-safety implementation is required;
- partial save semantics need careful design;
- deterministic ZIP behavior must be specified;
- browser storage limits still require large-project testing;
- unencrypted projects may contain sensitive extracted content.

## Rejected alternatives

### Flat JSON project

Rejected because it couples domains and makes large records, immutable snapshots, and modular migrations difficult.

### Embed all original evidence

Rejected because it duplicates client material, increases project size, and expands handling risk.

### Browser storage only

Rejected because it is not a portable engagement file and can be lost through browser cleanup or profile changes.

## Validation required before acceptance

- project create, save, close, and reopen;
- deterministic or explicitly normalized round trip;
- integrity-manifest verification;
- corrupted entry rejection;
- duplicate and traversal path rejection;
- oversized and decompression-bomb fixtures;
- recovery checkpoint restoration;
- hash-based evidence relinking tests;
- no governed mutation before complete validation.
