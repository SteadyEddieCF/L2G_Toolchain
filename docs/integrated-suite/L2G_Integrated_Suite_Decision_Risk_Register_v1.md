# L2G Integrated Suite Decision and Risk Register v1

## Status

Planning register reconciled through 2026-08-04, including promoted Integrated Suite v0.4.0 and the proposed v0.5 Pre-Engagement and Interview Sessions design package under issue #133. Decisions marked `Accepted when design PR merges` become implementation authority only after reviewed merge. Risks remain open or managed until closure evidence is recorded.

## Decision register

| ID | Decision | Status | Required before | Notes |
|---|---|---|---|---|
| D-001 | Evolve the existing `SteadyEddieCF/L2G_Toolchain` monorepo rather than create a replacement repository | Accepted | Milestone 0 | No demonstrated technical constraint requires replacement |
| D-002 | Use a TypeScript modular monolith with one generated portable HTML runtime | Accepted under ADR-0001 and implemented | Milestone 0 | One deployment artifact retains internal domain boundaries |
| D-003 | Use one ZIP-based encrypted `.l2g` engagement project with modular domain documents | Accepted under ADR-0002 and ADR-0007 | Project implementation | Project kind and encrypted envelope remain version 1.0 |
| D-004 | Use read-only cross-domain projections and explicit reviewed transition proposals | Accepted under ADR-0008, ADR-0009, and ADR-0010 | Domain migration | Automatic visibility does not transfer authority |
| D-005 | Use a command journal plus named checkpoints for Undo, Redo, history, and restoration | Accepted under ADR-0006 and implemented | Project store | Major migrations/imports and session start/pause/end use checkpoints |
| D-006 | Keep standalone module builds and legacy package contracts throughout migration | Accepted | First migration adapter | Every retirement requires a separate decision |
| D-007 | Preserve reference-only evidence by default | Accepted under ADR-0009 and implemented in v0.4 | Evidence implementation | Originals remain external; bounded metadata/derived summaries may be encrypted in project |
| D-008 | Keep Single-System as the default SSP experience and portfolio mode Advanced | Accepted migration posture | SSP migration | Existing SSP posture is preserved |
| D-009 | Treat Advisor, Client, and Reviewer as presentation/workflow profiles, not security roles | Accepted | Shell and domain projections | External distribution requires curated export |
| D-010 | Separate package wire version, schema identity, contract release, stability, producer, and consumer | Accepted registry posture | Compatibility adapters | Required to represent frozen and optional contracts correctly |
| D-011 | Freeze the first implementation baseline only after the merged-main six-tool RG-4 sequence | Satisfied | Milestone 0 | Governed product/runtime baseline is `85d6e783a250b373cd4b9ea356e4c341336f9259` |
| D-012 | Use a versioned AES-256-GCM/PBKDF2-SHA-256 encrypted project and recovery envelope while withholding production-data authorization | Accepted under ADR-0007 and implemented in v0.2 | Encrypted persistence | Encryption is necessary but not sufficient for production/client/FCI/CUI use |
| D-013 | Keep the repository public while prohibiting client data, FCI, CUI, secrets, private paths, client-identifying content, and unlicensed proprietary material from repository-controlled surfaces | Accepted | Milestone 0 onward | Owner explicitly accepted public visibility on 2026-08-03 |
| D-014 | Keep the clickable prototype separate from production domain migration | Accepted | Prototype and domain work | Prototype remains issue #120 work and cannot imply migrated authority |
| D-015 | Use Overview, Pre-Engagement, Evidence, Scope, Practice Review, SSP, Deliverables, and Reviews & Actions as workspace names/order | Accepted | Shell | A later rename requires reviewed usability evidence |
| D-016 | Use opaque Evidence IDs and complete SHA-256 fingerprints; filenames are metadata only | Accepted under ADR-0009 and implemented in v0.4 | Source registration | Hash proves byte equality only, not trust or sufficiency |
| D-017 | Keep source-to-browser-File associations in memory for the active session only | Accepted under ADR-0009 and implemented in v0.4 | Relink | No portable file handles, absolute paths, or automatic external watching |
| D-018 | Treat changed source bytes as a new revision identity rather than replacing an existing fingerprint | Accepted under ADR-0009 and implemented in v0.4 | Relink/revision | Prior source, hash, relationships, provenance, and history remain intact |
| D-019 | Rebuild Evidence search after profile filtering and persist no index or query history | Accepted under ADR-0009 and implemented in v0.4 | Evidence search | Prevent hidden-record terms, counts, snippets, prior queries, and inspector leakage |
| D-020 | Consume stable DocConverter packages through strict low-authority preview/apply adapters without changing their contracts | Accepted under ADR-0009 and implemented in v0.4 | Imports | Package bytes remain reference-only; source traceability is preserved |
| D-021 | Require a separate client label and omit raw filenames from Client projections | Accepted under ADR-0009 and implemented in v0.4 | Client View | Client-visible record state alone does not approve an original filename |
| D-022 | Keep inherited v0.2 archive/envelope/history/checkpoint limits unchanged in v0.4 | Accepted and implemented | v0.4 | Metadata/bounded summaries only, not a large-content container |
| D-023 | Create separate Pre-Engagement and Interview Sessions authorities rather than one overloaded meeting/intake domain | Accepted when ADR-0010 design PR merges | v0.5 implementation | `domains/pre-engagement.json` and `domains/interview-sessions.json` have separate schemas and ownership |
| D-024 | Keep Engagement authoritative for participants/organizations and Evidence authoritative for source identity while Pre-Engagement/Interview use immutable references/projections | Accepted when ADR-0010 design PR merges | v0.5 implementation | No duplicated or silently updated Engagement/Evidence authority |
| D-025 | Preserve immutable instrument, assignment, question, and session-plan versions/snapshots | Accepted when ADR-0010 design PR merges | v0.5 assignment/session start | Stale/current/conflict state is explicit; captured answers and sessions are never silently rebound |
| D-026 | Represent client responses, imported context, participant statements, advisor notes, confirmations, summaries, and candidates as separate records | Accepted when ADR-0010 design PR merges | v0.5 data model | Record type and provenance cannot be collapsed for convenience |
| D-027 | Keep raw advisor notes Advisor-only in v0.5 and filter them before Client calculation, search, render, inspector, focus restoration, and accessibility-tree construction | Accepted when ADR-0010 design PR merges | v0.5 Client Presentation Mode | Client-visible summaries are separate reviewed records |
| D-028 | Treat Client confirmation as a locally asserted facilitation event bound to an exact record version, not authenticated identity or electronic signature | Accepted when ADR-0010 design PR merges | v0.5 confirmations | Editing the source record stales/invalidates prior confirmation |
| D-029 | Permit at most one In-progress or Paused Interview session per project and checkpoint Start, Pause, and End | Accepted when ADR-0010 design PR merges | v0.5 recovery | Pause preserves valid drafts/position but does not approve, publish, or conclude |
| D-030 | Keep dynamic/source-generated questions advisor-controlled and prohibit automatic agenda insertion or record creation | Accepted when ADR-0010 design PR merges | v0.5 Interview Mode | Accept/edit/ask-now/save/dismiss are explicit Advisor actions |
| D-031 | Keep Pre-Engagement and Interview candidate publication source-owned until a target-owned command creates a target candidate | Accepted when ADR-0010 design PR merges | v0.5 cross-domain transition | Engagement/Evidence targets own decisions; unavailable targets remain queued |
| D-032 | Use one application state with profile-sensitive Interview presentation for v0.5 and defer optional second-display/window support | Accepted when ADR-0010 design PR merges | v0.5 UX | Must preserve offline `file://` behavior and profile non-disclosure |
| D-033 | Exclude microphone/camera capture, recording, speech-to-text, automated transcription, AI-generated answers, hidden scoring, and automatic assessment conclusions from v0.5 | Accepted when ADR-0010 design PR merges | v0.5 scope | Any future inclusion requires a separately approved security/authority decision |

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

Resolved for Engagement, Evidence, Pre-Engagement, and Interview Sessions under ADR-0008 through ADR-0010: opaque typed IDs are immutable and labels are editable. Copied-project, cross-project merge, and later bulk-reconciliation identity remain future decisions.

### A-006 — Search persistence

Resolved for currently migrated domains: filter by profile first, rebuild indexes in browser memory, persist no index/query/snippet/recent-result state, and clear on profile/project/lock changes. Broader multi-domain relevance/ranking remains later work.

### A-007 — Extracted preview representation

Partially resolved: bounded plain-text summaries and flat scalar structured fields only. Sanitized HTML, images, thumbnails, full extracts, OCR layers, audio/video, and large transcripts require later security/size/UX decisions.

### A-008 — Deterministic ZIP behavior

Resolved for current Integrated Suite releases through stored-only deterministic path ordering, fixed archive semantics, exact integrity manifest, strict path/CRC validation, and reproducible builds.

### A-009 — Client-safe visibility inheritance

Resolved for Engagement, Evidence, Pre-Engagement, and Interview projections: explicit per-record visibility, additional client label/prompt/summary requirements, filtering before calculations/search/render, no hidden counts/snippets/queries/inspector state, and curated export required. Future domains must define equivalent rules.

### A-010 — State-dimension schemas and legacy mapping

Partially resolved. Engagement, Evidence, Pre-Engagement, and Interview Sessions have separate lifecycle, operational/processing, review, visibility, currency/integrity, and domain-specific state vocabularies. Scope, Practice Review, SSP, Deliverables, and complete Reviews & Actions transitions remain future decisions.

### A-011 — Interview presentation topology

Resolved for v0.5: one application state with profile-sensitive Advisor/Client presentation. Optional second-display/window support remains later work requiring offline `file://`, disclosure, focus, recovery, and browser-capability evidence.

### A-012 — Large derived Evidence and interview content

Open. Current releases preserve inherited project/archive limits and allow bounded summaries, responses, notes, and structured records. Full extracts, previews, images, OCR, audio/video, and large transcripts require separately approved storage, lazy-loading, encryption, performance, and export models.

### A-013 — Authenticity and chain of custody

Open. SHA-256 establishes byte equality only. Interview participant labels and confirmations are locally asserted only. Digital signatures, trusted timestamps, authenticated collectors/participants, custody events, external repositories, and authenticity claims require separate models.

### A-014 — Questionnaire delivery/collection outside the application

Open. v0.5 models local assignments, submissions, imports, and facilitated entry. Email delivery, portals, accounts, authenticated remote completion, reminders, and collaboration are excluded and require a separate online/service architecture decision.

### A-015 — Interview audio/transcription and AI assistance

Open and explicitly excluded from v0.5. Any future work requires consent, privacy, classification, model/provider, retention, offline/online, accuracy, source-attribution, and authority-boundary decisions.

## Risk register

| ID | Risk | Status | Impact | Treatment | Closure evidence |
|---|---|---|---|---|---|
| R-001 | Repository visibility is public | Accepted — managed | Public disclosure | Synthetic-only fixtures; prohibit client/FCI/CUI/secrets/private paths/client-identifying/unlicensed material | Ongoing public-hygiene CI/review |
| R-002 | Correction stack moved during initial planning | Closed | Adapters could target unqualified contracts | Promoted Workshop/Builder/SSP/registry/snapshot/RG-4 | PR #118 and baseline `85d6e783a250b373cd4b9ea356e4c341336f9259` |
| R-003 | Temporary/accidental release branches remain | Open — verified | Baseline confusion | Preserve evidence; issue #119 reachability cleanup | Reviewed cleanup report |
| R-004 | Contract identity overloads `version` | Open — managed | Compatibility errors | Maintain kind, wire/schema version, release, stability, producer, consumer, validation metadata | Contract identity tests |
| R-005 | `.l2g` may contain sensitive derived content | Open — partially mitigated | Data exposure at rest | Encryption; originals external; bounded content; synthetic-only | Approved production posture |
| R-006 | One project file concentrates corruption risk | Open — managed | Work loss | Integrity, recovery, checkpoints, validation, verified backups | Corruption/recovery matrix |
| R-007 | Large evidence/intake/session sets exceed browser limits | Open — bounded | Failure/unusable project | Semantic caps, bounded text, size preflight, inherited archive limits | Large synthetic report |
| R-008 | Cross-domain Undo creates invalid states | Open | Integrity corruption | Domain commands, cloned validation, target transitions, checkpoints | Undo/restoration matrix |
| R-009 | Worker support weakens single-file CSP | Open — managed | Attack surface | Bundled blob workers only where needed, no remote import, `connect-src 'none'` | CSP/worker tests |
| R-010 | Client View mistaken for access control | Open — managed | Internal disclosure | Persistent qualification, profile-first filtering, curated export later | Leakage/export tests |
| R-011 | Premature code consolidation discards validated rules | Open | Regression | Inventory/golden tests before consolidation | Migration matrices |
| R-012 | Portable/SPFx editions diverge | Open | Incompatible products | Framework-neutral domains/host adapters | Shared host tests |
| R-013 | Release inventory incomplete | Open | Missing historical assets | Exact Release asset inventory | Inventory report |
| R-014 | Browser cannot prove destination write | Open — managed | Misleading save | Truthful labels and reopen verification | Save verification tests |
| R-015 | Standalone HTML hidden coupling | Open | Migration overrun/loss | Inventory functions/contracts/storage/tests | Feature inventories |
| R-016 | Synthetic fixtures lack production diversity | Open | False confidence | Expand adversarial synthetic fixtures | Diversity report |
| R-017 | Public Issues/PRs/artifacts receive sensitive content | Open — managed | Persistent disclosure | Content scans, synthetic screenshots, sanitized paths, checklist | CI/artifact review |
| R-018 | Prototype mistaken for production | Open — managed | Unsupported reliance | Separate issue #120 and mock/synthetic disclosures | Usability report |
| R-019 | Same-name changed source replaces identity | Open — controlled v0.4 | Broken traceability | Exact-hash relink; mismatch block; new revision identity | Relink/revision tests |
| R-020 | Filename/path metadata leaks context | Open — controlled v0.4 | Disclosure | Sanitization; no paths/handles; client labels | Filename/path tests |
| R-021 | Hash equality mistaken for authenticity/sufficiency | Open — managed | Misleading conclusions | Qualification; separate trust/review state | UX/content tests |
| R-022 | Transient search leaks hidden content | Open — designed | Advisor data exposed | Profile-first memory index, no persistence, clear on change | Search leakage matrix |
| R-023 | Stale File association treated as portable link | Open — controlled v0.4 | Wrong source | Session-only map; clear/re-hash | Relink tests |
| R-024 | Legacy import escalates authority | Open — managed | Silent authority transfer | Preview/apply receipt; target commands | Adapter/non-mutation tests |
| R-025 | Bounded text contains misleading/sensitive content | Open — managed | XSS/spoofing/bad interpretation | Plain text/flat scalars, sanitization, provenance/review | Adversarial tests |
| R-026 | Imported/source/advisor content shown as client answer/live statement | Open — designed | False attribution | Distinct origins/types, labels, reviewed conversion, provenance | Origin/import tests |
| R-027 | Instrument/question edits change prior assignments/plans | Open — designed | Lost meaning | Immutable snapshots, stale/conflict, explicit new snapshot | Snapshot tests |
| R-028 | Raw Advisor notes leak during Client presentation/switch | Open — critical control | Sensitive disclosure | Advisor-only invariant, pre-render filtering, clear caches/editors/focus, DOM/a11y tests | Leakage matrix/screenshots |
| R-029 | Interrupted session loses/duplicates/misplaces drafts | Open — designed | Corrupt record/distrust | One active session, checkpoints, atomic Pause, deterministic recovery | Crash/recovery tests |
| R-030 | Confirmation mistaken for signature/broad approval | Open — managed | Legal/governance overstatement | Exact version, locally asserted labels, non-signature copy | Confirmation tests |
| R-031 | Suggestions enter agenda/create records automatically | Open — designed | Unreviewed facilitation | Explicit Advisor actions only; no auto progression | Suggestion non-mutation tests |
| R-032 | Facilitator cognitive load causes wrong capture/advance | Open — UX-managed | Poor session quality | Focused mode, separate editors, shortcut guards, save state, usability | Usability report |
| R-033 | Session completion mistaken for reviewed outcomes | Open — designed | Unreviewed content treated accepted | Separate lifecycle/post-review; completion publishes nothing | Completion tests |
| R-034 | Multiple active sessions corrupt recovery | Open — designed | Ambiguous context | One-active invariant on commands/open/migration/recovery/Undo | Multi-session tests |
| R-035 | Participant/contact labels remain sensitive | Open — partially mitigated | Disclosure unlocked project | Synthetic-only, bounded fields, profile filtering | Classification/profile tests |
| R-036 | Questionnaire/import content contains active/oversized nested data | Open — designed | XSS/exhaustion/ambiguity | Strict JSON, plain bounded values, atomic preview/apply | Malformed/oversized tests |

## Immediate governance actions

1. Review and merge the v0.5 ADR-0010 design package under issue #133 before creating an implementation branch.
2. After design merge, implement v0.5 additively from the exact design merge on current `main`, preserving v0.4 identity and `85d6e783a250b373cd4b9ea356e4c341336f9259` compatibility baseline.
3. Require exact candidate-head and final-head validation against `L2G_Integrated_Suite_v0.5.0_Acceptance_v1.md` before promotion.
4. Keep all v0.5 fixtures, participant labels, responses, notes, questions, screenshots, packages, logs, and artifacts synthetic/publicly safe.
5. Preserve DocConverter v7.9.5.1, Scoper v3.12, Workshop v79.1, Builder/Merger v3.10.1, SSP v1.9.17, and stable package contracts unless separately bounded defects require change.
6. Validate Advisor-note/hidden-record non-disclosure before every Client route, count, search, inspector, focus, and accessibility-tree construction.
7. Validate immutable assignment/question/plan snapshots and stale-plan behavior before session Start.
8. Validate one-active-session, Pause/recovery, target non-mutation, malformed import, and v0.4 migration before promotion.
9. Continue issue #119 branch cleanup only after preservation gates pass.
10. Do not change synthetic-only posture without separately approved production/pilot security and operating decision.
