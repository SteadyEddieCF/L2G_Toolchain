# L2G Integrated Suite Decision and Risk Register v1

## Status

Planning register reconciled through 2026-08-04, including promoted Integrated Suite v0.3.0, issue #130, and the v0.4 Evidence Catalog Core design package. Decisions marked `Accepted when design PR merges` become implementation authority only after reviewed merge. Risks remain open or managed until closure evidence is recorded.

## Decision register

| ID | Decision | Status | Required before | Notes |
|---|---|---|---|---|
| D-001 | Evolve the existing `SteadyEddieCF/L2G_Toolchain` monorepo rather than create a replacement repository | Accepted | Milestone 0 | No demonstrated technical constraint requires replacement |
| D-002 | Use a TypeScript modular monolith with one generated portable HTML runtime | Accepted under ADR-0001 and implemented | Milestone 0 | One deployment artifact retains internal domain boundaries |
| D-003 | Use one ZIP-based encrypted `.l2g` engagement project with modular domain documents | Accepted under ADR-0002 and ADR-0007 | Project implementation | Project kind and encrypted envelope remain version 1.0 |
| D-004 | Use read-only cross-domain projections and explicit reviewed transition proposals | Accepted under ADR-0008 and ADR-0009 | Domain migration | Automatic visibility does not transfer authority |
| D-005 | Use a command journal plus named checkpoints for Undo, Redo, history, and restoration | Accepted under ADR-0006 and implemented | Project store | Large migration/import boundaries use checkpoints |
| D-006 | Keep standalone module builds and legacy package contracts throughout migration | Accepted | First migration adapter | Every retirement requires a separate decision |
| D-007 | Preserve reference-only evidence by default | Accepted when ADR-0009 design PR merges | Evidence implementation | Originals remain external; bounded metadata/derived summaries may be encrypted in project |
| D-008 | Keep Single-System as the default SSP experience and portfolio mode Advanced | Accepted migration posture | SSP migration | Existing SSP posture is preserved |
| D-009 | Treat Advisor, Client, and Reviewer as presentation/workflow profiles, not security roles | Accepted | Shell and domain projections | External distribution requires curated export |
| D-010 | Separate package wire version, schema identity, contract release, stability, producer, and consumer | Accepted registry posture | Compatibility adapters | Required to represent frozen and optional contracts correctly |
| D-011 | Freeze the first implementation baseline only after the merged-main six-tool RG-4 sequence | Satisfied | Milestone 0 | Governed product/runtime baseline is `85d6e783a250b373cd4b9ea356e4c341336f9259` |
| D-012 | Use a versioned AES-256-GCM/PBKDF2-SHA-256 encrypted project and recovery envelope while withholding production-data authorization | Accepted under ADR-0007 and implemented in v0.2 | Encrypted persistence | Encryption is necessary but not sufficient for production/client/FCI/CUI use |
| D-013 | Keep the repository public while prohibiting client data, FCI, CUI, secrets, private paths, client-identifying content, and unlicensed proprietary material from repository-controlled surfaces | Accepted | Milestone 0 onward | Owner explicitly accepted public visibility on 2026-08-03 |
| D-014 | Keep the six-screen clickable prototype separate from production domain migration | Accepted | Prototype and domain work | Prototype remains issue #120 work and cannot imply migrated authority |
| D-015 | Use Overview, Pre-Engagement, Evidence, Scope, Practice Review, SSP, Deliverables, and Reviews & Actions as workspace names/order | Accepted | Shell | A later rename requires reviewed usability evidence |
| D-016 | Use opaque Evidence IDs and complete SHA-256 fingerprints; filenames are metadata only | Accepted when ADR-0009 design PR merges | v0.4 source registration | Hash proves byte equality only, not trust or sufficiency |
| D-017 | Keep source-to-browser-File associations in memory for the active session only | Accepted when ADR-0009 design PR merges | v0.4 relink | No portable file handles, absolute paths, or automatic external watching |
| D-018 | Treat changed source bytes as a new revision identity rather than replacing an existing fingerprint | Accepted when ADR-0009 design PR merges | v0.4 relink/revision | Prior source, hash, relationships, provenance, and history remain intact |
| D-019 | Rebuild Evidence search after profile filtering and persist no index or query history | Accepted when ADR-0009 design PR merges | v0.4 search | Prevent hidden-record terms, counts, snippets, prior queries, and inspector leakage |
| D-020 | Consume stable DocConverter packages through strict low-authority preview/apply adapters without changing their contracts | Accepted when ADR-0009 design PR merges | v0.4 imports | Package bytes remain reference-only; source traceability is preserved |
| D-021 | Require a separate client label and omit raw filenames from Client projections | Accepted when ADR-0009 design PR merges | v0.4 Client View | Client-visible record state alone does not approve an original filename |
| D-022 | Keep inherited v0.2 archive/envelope/history/checkpoint limits unchanged in v0.4 | Accepted when ADR-0009 design PR merges | v0.4 implementation | v0.4 is catalog metadata and bounded summaries, not a large-content container |

## Architecture questions and dispositions

### A-001 — Component framework and SPFx compatibility

Open. Domain and application-service layers remain framework-neutral. ADR-0003 requires a bounded portable/SPFx compatibility spike before pinning exact host and React versions.

### A-002 — Supported browsers

Open beyond the current baseline. ADR-0004 uses current desktop Chromium on Windows as the portable release baseline with capability-based fallbacks. Firefox/Safari remain later compatibility work.

### A-003 — Production/client/FCI/CUI authorization

Open. ADR-0007 resolved the encrypted envelope, but endpoint controls, operating procedures, pilot boundaries, support model, incident handling, data classification, approved users, distribution, and recovery governance remain required before changing the synthetic-only posture.

### A-004 — Project save implementation

Resolved for the portable baseline. `.l2g` is canonical, IndexedDB is bounded encrypted recovery, and save/download status is truthful. Reopen verification is used where the browser cannot prove a destination write.

### A-005 — Stable identifiers

Resolved for Engagement and Evidence under ADR-0008/0009: opaque typed IDs are immutable and labels are editable. Copied-project, cross-project merge, and later bulk-reconciliation identity remain future decisions.

### A-006 — Search persistence

Resolved for v0.4 Evidence: filter by profile first, rebuild the index in browser memory, persist no index/query/snippet/recent-result state, and clear on profile/project/lock changes. Global multi-domain search remains a later bounded implementation.

### A-007 — Extracted preview representation

Partially resolved for v0.4: bounded plain-text summaries and flat scalar structured fields only. Sanitized HTML, images, thumbnails, full extracts, OCR layers, and large transcripts require a later security/size/UX decision.

### A-008 — Deterministic ZIP behavior

Resolved for current Integrated Suite releases through stored-only deterministic path ordering, fixed archive semantics, exact integrity manifest, strict path/CRC validation, and reproducible application builds.

### A-009 — Client-safe visibility inheritance

Resolved for Engagement and Evidence projections: per-record visibility, explicit Client label where required, profile filtering before calculations/search/render, no hidden counts/snippets/queries/inspector state, and curated export required for external distribution. Other domains must define equivalent rules when migrated.

### A-010 — State-dimension schemas and legacy mapping

Partially resolved. Engagement and Evidence have separate lifecycle, operational/processing, review, visibility, and domain-specific state vocabularies. Pre-Engagement, Scope, Practice Review, SSP, Deliverables, and cross-domain review transitions remain future decisions.

### A-011 — Interview presentation topology

Open. The initial Interview Mode uses one application with profile-sensitive presentation. A later release may evaluate an optional second display/window compatible with offline `file://` operation.

### A-012 — Large derived Evidence content

Open. v0.4 deliberately preserves the inherited 4 MiB-entry/12 MiB-inner/16 MiB-outer limits and allows only bounded summaries/flat records. Full extracted text, previews, images, OCR, and large transcripts require a separately approved storage, lazy-loading, encryption, performance, and export model.

### A-013 — Authenticity and chain of custody

Open. SHA-256 relinking establishes byte equality only. Digital signatures, trusted timestamps, authenticated collectors, custody events, external evidence repositories, and authenticity claims require a separate model.

## Risk register

| ID | Risk | Status | Impact | Treatment | Closure evidence |
|---|---|---|---|---|---|
| R-001 | Repository visibility is public | Accepted — managed | Public disclosure of repository-controlled content | Enforce synthetic-only fixtures and prohibit client/FCI/CUI/secrets/private paths/client-identifying and unlicensed proprietary material | Ongoing public-hygiene CI and review evidence |
| R-002 | Correction stack moved during initial planning | Closed | Adapters could target unqualified contracts | Workshop v79.1, Builder/Merger v3.10.1, SSP v1.9.17, registry, snapshot, and RG-4 were promoted | PR #118 and baseline `85d6e783a250b373cd4b9ea356e4c341336f9259` |
| R-003 | Temporary and accidental release branches remain | Open — verified | Baseline confusion and review mistakes | Preserve evidence and use issue #119 for reachability-based cleanup | Reviewed cleanup report under issue #119 |
| R-004 | Contract identity overloads `version` | Open — managed | Incorrect compatibility decisions | Maintain package kind, wire/schema version, contract release, stability, producer, consumer, and validation metadata | Contract identity schema/tests |
| R-005 | `.l2g` may contain sensitive derived content | Open — partially mitigated | Data exposure at rest | Encryption implemented; v0.4 originals external and summaries bounded; synthetic-only remains | Approved production operating/security posture and pilot evidence |
| R-006 | One project file concentrates corruption risk | Open — managed | Loss of engagement work | Integrity, encrypted recovery, checkpoints, deterministic validation, verified backups/restoration | Continued corruption/recovery matrix |
| R-007 | Large evidence sets may exceed browser memory/storage | Open — bounded for v0.4 | Processing failure or unusable project | Worker hashing, 2 GiB/file and 500-file batch limits, 2,000-source catalog target, inherited archive limits, no original bytes | Large synthetic catalog/file performance report |
| R-008 | Cross-domain Undo may create invalid states | Open | Authority/integrity corruption | Domain-aware commands, cloned-state validation, target-owned transitions, checkpoint boundaries | Cross-domain Undo/restoration matrix |
| R-009 | Worker support may weaken single-file CSP | Open — managed | Runtime attack surface/policy failure | Blob workers only, bundled code, no remote import, `connect-src 'none'`, worker/no-network tests | v0.4 CSP/worker validation |
| R-010 | Users may mistake Client View for access control | Open — managed | Internal information disclosed | Persistent qualification, explicit client labels, pre-render/filter search, curated export later | Profile leakage and export-content tests |
| R-011 | Premature duplicate-code consolidation may discard validated rules | Open | Parsing/review regression | Feature inventory and golden tests before consolidation | Approved module migration matrices |
| R-012 | Portable and SPFx editions may diverge | Open | Incompatible products | Framework-neutral domains and host adapters | Shared package tests in both hosts |
| R-013 | GitHub Release inventory remains incomplete | Open | Missing historical binaries/unverified release state | Perform exact Releases asset inventory through a supported path | Asset inventory report |
| R-014 | Browser download APIs cannot always prove destination write | Open — managed | Misleading save status | Truthful state labels and selected-file verification when possible | Save-state/file verification tests |
| R-015 | Large standalone HTML applications contain hidden coupling | Open | Migration overruns/behavior loss | Inventory functions/contracts/storage/tests before extraction | Module feature inventories |
| R-016 | Synthetic fixtures may not represent production diversity | Open | False confidence | Expand synthetic/adversarial fixtures without client data | Approved scale/diversity report |
| R-017 | Public Issues/PRs/screenshots/artifacts/Releases may receive sensitive content | Open — managed | Persistent public disclosure | Content scans, synthetic screenshots, sanitized paths, release checklist | CI/content-scan and artifact-review evidence |
| R-018 | Clickable prototype may be mistaken for production behavior | Open — managed | Unsupported reliance | Keep issue #120 separate and label mock/synthetic behavior | Prototype disclosures/usability report |
| R-019 | Same-name changed source may silently replace prior evidence identity | Open — designed control | Broken traceability and incorrect downstream links | Exact-hash relink only; mismatch blocks; new revision ID/relationship; immutable old hash | Relink/mismatch/revision tests |
| R-020 | Filename or directory metadata may leak client/context information | Open — designed control | Disclosure through project, Client View, search, screenshots, CI | Base-name sanitization, no paths/handles, explicit client label, profile-first search, synthetic fixtures | Filename/path and Client leakage tests |
| R-021 | Users may treat hash equality as authenticity or sufficiency | Open — managed | Misleading advisory conclusions | Repeated qualification; separate trust/review states; prohibited conclusion language | UX/content and next-work tests |
| R-022 | Transient search may leak hidden profile content | Open — designed control | Advisor-only titles/counts/snippets exposed | Build after filtering, never persist index/query, clear on profile change, DOM/accessibility tests | Profile-specific search leakage matrix |
| R-023 | Stale browser File associations may be mistaken as portable links | Open — designed control | Wrong source used after reload/project switch | Session-only map keyed by project/source; clear on lock/close/reload/failure; always rehash | Session-clear/relink tests |
| R-024 | Legacy import may escalate low-authority content into accepted target records | Open — designed control | Silent authority transfer | Strict preview/apply, immutable receipt, target-owned candidate command, unavailable-target hold | Adapter and target non-mutation tests |
| R-025 | Bounded derived plain text may still contain active-looking or misleading content | Open — managed | XSS/spoofing or incorrect interpretation | Plain text/flat scalars only, no HTML/data URIs/binary/nested JSON, sanitization and review state | Derived-content adversarial tests |

## Immediate governance actions

1. Review and merge the v0.4 Evidence design package under issue #130 before creating a production implementation branch.
2. After design merge, implement v0.4 additively from the exact current `main`, preserving v0.3 deterministic identity and `85d6e783a250b373cd4b9ea356e4c341336f9259` as the standalone compatibility baseline.
3. Require exact candidate-head and final-head validation against `L2G_Integrated_Suite_v0.4.0_Acceptance_v1.md` before promotion.
4. Keep all v0.4 fixtures, filenames, screenshots, packages, source bytes, logs, and artifacts synthetic and publicly safe.
5. Preserve DocConverter v7.9.5.1 and its stable package contracts unchanged; use reviewed adapters only.
6. Keep original evidence bytes outside project/recovery and ensure static/runtime tests prove the boundary.
7. Continue issue #119 branch cleanup only after its preservation gates pass.
8. Complete detailed standalone feature inventories before parsing/OCR or duplicate-code migration.
9. Do not change the synthetic-only posture without a separately approved production/pilot security and operating decision.
