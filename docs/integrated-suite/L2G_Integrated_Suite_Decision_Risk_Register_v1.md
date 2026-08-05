# L2G Integrated Suite Decision and Risk Register v1

## Status

Planning register reconciled through 2026-08-04. Integrated Suite v0.5.0 is promoted and current. The v0.6 Scope Vertical Slice design package is governed by issue #139. Decisions marked `Accepted when ADR-0011 design PR merges` become implementation authority only after reviewed merge. Risks remain open or managed until closure evidence is recorded.

## Decision register

| ID | Decision | Status | Required before | Notes |
|---|---|---|---|---|
| D-001 | Evolve the existing `SteadyEddieCF/L2G_Toolchain` monorepo rather than create a replacement repository | Accepted | Milestone 0 | No demonstrated technical constraint requires replacement |
| D-002 | Use a TypeScript modular monolith with one generated portable HTML runtime | Accepted under ADR-0001 and implemented | Milestone 0 | One deployment artifact retains internal domain boundaries |
| D-003 | Use one ZIP-based encrypted `.l2g` engagement project with modular domain documents | Accepted under ADR-0002 and ADR-0007 | Project implementation | Project kind and encrypted envelope remain version 1.0 |
| D-004 | Use read-only cross-domain projections and explicit reviewed transition proposals | Accepted under ADR-0008 through ADR-0011 | Domain migration | Automatic visibility does not transfer authority |
| D-005 | Use a command journal plus named checkpoints for Undo, Redo, history, and restoration | Accepted under ADR-0006 and implemented | Project store | Major migrations/imports/accepted boundary decisions use checkpoints |
| D-006 | Keep standalone module builds and legacy package contracts throughout migration | Accepted | First migration adapter | Every retirement requires a separate decision |
| D-007 | Preserve reference-only evidence by default | Accepted under ADR-0009 and implemented in v0.4 | Evidence implementation | Originals remain external; bounded metadata/derived summaries may be encrypted in project |
| D-008 | Keep Single-System as the default SSP experience and portfolio mode Advanced | Accepted migration posture | SSP migration | Existing SSP posture is preserved |
| D-009 | Treat Advisor, Client, and Reviewer as presentation/workflow profiles, not security roles | Accepted | Shell and domain projections | External distribution requires curated export |
| D-010 | Separate package wire version, schema identity, contract release, stability, producer, and consumer | Accepted registry posture | Compatibility adapters | Required to represent frozen and optional contracts correctly |
| D-011 | Freeze the first implementation baseline only after the merged-main six-tool RG-4 sequence | Satisfied | Milestone 0 | Governed product/runtime baseline is `85d6e783a250b373cd4b9ea356e4c341336f9259` |
| D-012 | Use a versioned AES-256-GCM/PBKDF2-SHA-256 encrypted project and recovery envelope while withholding production-data authorization | Accepted under ADR-0007 and implemented in v0.2 | Encrypted persistence | Encryption is necessary but not sufficient for production/client/FCI/CUI use |
| D-013 | Keep the repository public while prohibiting client data, FCI, CUI, secrets, private paths, client-identifying content, and unlicensed proprietary material from repository-controlled surfaces | Accepted | Milestone 0 onward | Owner accepted public visibility on 2026-08-03 |
| D-014 | Keep the clickable prototype separate from production domain migration | Accepted | Prototype and domain work | Prototype remains issue #120 work and cannot imply migrated authority |
| D-015 | Use Overview, Pre-Engagement, Evidence, Scope, Practice Review, SSP, Deliverables, and Reviews & Actions as workspace names/order | Accepted | Shell | A later rename requires reviewed usability evidence |
| D-016 | Use opaque Evidence IDs and complete SHA-256 fingerprints; filenames are metadata only | Accepted under ADR-0009 and implemented in v0.4 | Source registration | Hash proves byte equality only, not trust or sufficiency |
| D-017 | Keep source-to-browser-File associations in memory for the active session only | Accepted under ADR-0009 and implemented in v0.4 | Relink | No portable file handles, absolute paths, or automatic external watching |
| D-018 | Treat changed source bytes as a new revision identity rather than replacing an existing fingerprint | Accepted under ADR-0009 and implemented in v0.4 | Relink/revision | Prior source, hash, relationships, provenance, and history remain intact |
| D-019 | Rebuild search after profile filtering and persist no index or query history | Accepted and implemented for migrated domains | Search | Prevent hidden terms, counts, snippets, prior queries, inspector and focus leakage |
| D-020 | Consume stable packages through strict low-authority preview/apply adapters without changing contracts | Accepted and implemented for current adapters | Imports | Package bytes remain reference-only; source traceability is preserved |
| D-021 | Require separate Client labels/summaries and omit raw filenames/private source details from Client projections | Accepted and implemented for current domains | Client View | Visibility alone does not approve source metadata |
| D-022 | Keep inherited v0.2 archive/envelope/history/checkpoint limits unless a separately approved release changes them | Accepted | Every domain release | Metadata and bounded structured content only, not a large-content container |
| D-023 | Create separate Pre-Engagement and Interview Sessions authorities rather than one overloaded meeting/intake domain | Accepted under ADR-0010 and implemented in v0.5 | v0.5 | Separate schema ownership |
| D-024 | Keep Engagement authoritative for participants/organizations and Evidence authoritative for source identity while Pre-Engagement/Interview use immutable refs/projections | Accepted and implemented in v0.5 | v0.5 | No duplicated authority |
| D-025 | Preserve immutable instrument, assignment, question, and session-plan versions/snapshots | Accepted and implemented in v0.5 | Assignment/session start | Stale/current/conflict explicit |
| D-026 | Represent Client responses, imported context, participant statements, Advisor notes, confirmations, summaries, and candidates as separate records | Accepted and implemented in v0.5 | v0.5 data model | Record type and provenance cannot be collapsed |
| D-027 | Keep raw Advisor notes Advisor-only and filter before Client calculation/search/render/inspector/focus/live-region/a11y work | Accepted and implemented in v0.5 | Client Presentation | Client summaries are separate reviewed records |
| D-028 | Treat Client confirmation as a locally asserted exact-version facilitation event, not authenticated identity or signature | Accepted and implemented in v0.5 | Confirmations | Source edit stales prior confirmation |
| D-029 | Permit at most one In-progress or Paused Interview session per project and checkpoint Start, Pause, and End | Accepted and implemented in v0.5 | Recovery | Pause preserves valid drafts without approving/publishing |
| D-030 | Keep dynamic/source-generated questions Advisor-controlled and prohibit automatic agenda insertion | Accepted and implemented in v0.5 | Interview Mode | Explicit Advisor actions only |
| D-031 | Keep source publication source-owned until a target-owned command creates a target candidate | Accepted and implemented for current targets | Cross-domain transitions | Target owns decisions; source mirrors validated state only |
| D-032 | Use one application state with profile-sensitive Interview presentation and defer second-display/window support | Accepted and implemented in v0.5 | UX | Preserve offline `file://` and non-disclosure |
| D-033 | Exclude microphone/camera capture, recording, transcription, AI-generated answers, hidden scoring, and automatic assessment conclusions | Accepted | v0.5 onward until separately changed | Requires separate security/authority decision |
| D-034 | Add one canonical Scope domain at `domains/scope.json`, schema `l2g_scope_v1` 1.0 and projection `l2g_scope_projection_v1` 1.0 | Accepted when ADR-0011 design PR merges | v0.6 implementation | Scope becomes target-owned authority inside the suite |
| D-035 | Keep object identity/taxonomy separate from asset category, scope disposition, boundary relationship, implementation location, responsibility, lifecycle, review, visibility, currency, and decision state | Accepted when ADR-0011 design PR merges | v0.6 schema/UI | Prevent overloaded scope status and invalid inference |
| D-036 | Require a current accepted Scope decision for accepted category, disposition, relationship, responsibility, flow treatment, and diagram approval fields | Accepted when ADR-0011 design PR merges | v0.6 commands | Objects describe; decisions establish authority |
| D-037 | Preserve proposed disposition, Advisor analysis, participant/Client statement, exact-version confirmation, Reviewer disposition, accepted decision, and supersession as distinguishable records/references | Accepted when ADR-0011 design PR merges | v0.6 decision ledger | Latest note/statement never silently wins |
| D-038 | Make source/affected/dependency version drift stale a decision rather than automatically reversing or reaccepting it | Accepted when ADR-0011 design PR merges | v0.6 currency logic | Explicit compare/supersede required |
| D-039 | Treat diagrams as governed exact-version representations, not independent Scope authority | Accepted when ADR-0011 design PR merges | v0.6 diagrams | Nodes/edges link governed objects or proposal placeholders; stale on drift |
| D-040 | Use Scope subviews Boundary, Systems & Assets, Providers & Services, Data Flows, Decisions, and Diagrams with one shared inspector | Accepted when ADR-0011 design PR merges | v0.6 UX | Preserves specialist IA without copying Scoper tabs |
| D-041 | Publish Scope unknowns/questions to Interview/Practice Review Session Planner as candidates rather than maintain a second Scope question authority | Accepted when ADR-0011 design PR merges | v0.6 cross-domain adapter | No automatic live agenda insertion |
| D-042 | Support frozen `l2g_scope_context_v1` and `l2g_scope_return_package_v1` 1.0 through strict preview/apply/return and optional compatibility export without modifying Scoper v3.12 | Accepted when ADR-0011 design PR merges | v0.6 compatibility | Zero practice records and draft guardrails preserved |
| D-043 | Migrate v0.5 projects by adding an empty Scope domain only, with no inferred objects, decisions, diagrams, categories, dispositions, or conclusions | Accepted when ADR-0011 design PR merges | v0.6 migration | Named checkpoint/history event required |
| D-044 | Build Client Scope projection before counts/search/render/inspector/differences/history/focus/live-region/a11y and generate diagram text alternatives from that projection | Accepted when ADR-0011 design PR merges | v0.6 Client View | Prevent canvas/a11y/cache leakage |
| D-045 | Keep standalone Scoper v3.12 independently distributable and require exact non-regression before v0.6 promotion | Accepted when ADR-0011 design PR merges | v0.6 promotion | Retirement or v3.13 work requires separate issue |

## Architecture questions and dispositions

### A-001 — Component framework and SPFx compatibility

Open. Domain and application-service layers remain framework-neutral. ADR-0003 requires a bounded portable/SPFx compatibility spike before pinning exact host and React versions.

### A-002 — Supported browsers

Open beyond the current baseline. ADR-0004 uses current desktop Chromium on Windows as the portable release baseline with capability-based fallbacks. Firefox/Safari remain later compatibility work.

### A-003 — Production/client/FCI/CUI authorization

Open. Endpoint controls, operating procedures, pilot boundaries, support model, incident handling, data classification, approved users, distribution, and recovery governance remain required before changing the synthetic-only posture.

### A-004 — Project save implementation

Resolved for the portable baseline. `.l2g` is canonical, IndexedDB is bounded encrypted recovery, and save/download status is truthful. Reopen verification is used where the browser cannot prove a destination write.

### A-005 — Stable identifiers

Resolved for Engagement, Evidence, Pre-Engagement, Interview Sessions, and proposed Scope under ADR-0008 through ADR-0011: opaque typed IDs are immutable and labels are editable. Copied-project/cross-project merge remains future work.

### A-006 — Search persistence

Resolved for migrated domains: filter by profile first, rebuild in memory, persist no index/query/snippet/recent-result state, and clear on profile/project/lock changes. Broader ranking remains future work.

### A-007 — Extracted preview representation

Partially resolved: bounded plain-text summaries and flat/typed structured fields only. Sanitized HTML, images, thumbnails, full extracts, OCR layers, audio/video, and large transcripts require later decisions.

### A-008 — Deterministic ZIP behavior

Resolved for current releases through stored-only deterministic ordering, exact integrity manifest, strict path/CRC validation, and reproducible builds.

### A-009 — Client-safe visibility inheritance

Resolved for current domains and designed for Scope: explicit visibility plus family-specific labels/summaries, filtering before derived UI work, no hidden counts/snippets/queries/inspector/diff/focus/a11y state, curated export later.

### A-010 — State-dimension schemas and legacy mapping

Resolved for Scope design under ADR-0011. Practice Review, SSP, Deliverables, and complete Reviews & Actions transitions remain future decisions.

### A-011 — Interview presentation topology

Resolved for v0.5. Optional second-display/window support remains later work.

### A-012 — Large derived content

Open. Current releases preserve inherited project/archive limits. Full extracts, previews, images, OCR, audio/video, large transcripts, and high-resolution diagram source require separate storage/performance/export decisions.

### A-013 — Authenticity and chain of custody

Open. SHA-256 establishes byte equality only. Participant labels, confirmations, and Scope decisions are locally asserted. Digital signatures, trusted timestamps, authenticated actors, and external custody require separate models.

### A-014 — Questionnaire delivery/collection outside the application

Open. Email, portals, accounts, authenticated remote completion, reminders, and collaboration are excluded.

### A-015 — Interview audio/transcription and AI assistance

Open and excluded. Any future work requires consent, privacy, classification, model/provider, retention, accuracy, attribution, and authority decisions.

### A-016 — Diagram rendering implementation

Open until implementation. v0.6 design requires deterministic bundled rendering, no remote libraries/assets, object-linked nodes/edges, accessible list/text alternative, and exact-version stale detection. Exact rendering library/algorithm must preserve the single-file CSP.

### A-017 — Scope compatibility export consumer posture

Partially resolved. v0.6 may emit frozen `l2g_scope_return_package_v1` 1.0 for existing routes, but a consumer receipt/round-trip authority beyond current registered consumers requires separate validation.

### A-018 — Automated classification or boundary assistance

Open and explicitly excluded from v0.6. Any rules engine or AI assistance requires explainability, source attribution, human review, false-positive/negative handling, and non-conclusion controls.

### A-019 — Curated Client Scope export

Open. Client profile remains presentation only. External distribution requires a separately approved curated export and data-classification model.

## Risk register

| ID | Risk | Status | Impact | Treatment | Closure evidence |
|---|---|---|---|---|---|
| R-001 | Repository visibility is public | Accepted — managed | Public disclosure | Synthetic-only fixtures; prohibit client/FCI/CUI/secrets/private paths/client-identifying/unlicensed material | Ongoing public-hygiene CI/review |
| R-002 | Correction stack moved during initial planning | Closed | Adapters target unqualified contracts | Promoted RG-4/current suite baseline | PR #118 and `85d6e783a250b373cd4b9ea356e4c341336f9259` |
| R-003 | Temporary/accidental release branches remain | Open — verified | Baseline confusion | Preserve evidence; issue #119 cleanup | Reviewed cleanup report |
| R-004 | Contract identity overloads `version` | Open — managed | Compatibility errors | Separate kind/wire/schema/release/stability/producer/consumer | Contract tests |
| R-005 | `.l2g` may contain sensitive derived content | Open — partially mitigated | Data exposure at rest | Encryption; originals external; bounded content; synthetic-only | Approved production posture |
| R-006 | One project file concentrates corruption risk | Open — managed | Work loss | Integrity, recovery, checkpoints, validation, verified backups | Corruption/recovery matrix |
| R-007 | Large domain sets exceed browser limits | Open — bounded | Failure/unusable project | Semantic caps, preflight, inherited limits, bounded scale tests | Large synthetic report |
| R-008 | Cross-domain Undo creates invalid states | Open | Integrity corruption | Domain commands, cloned validation, target receipts, checkpoints | Undo/restoration matrix |
| R-009 | Worker/rendering support weakens single-file CSP | Open — managed | Attack surface | Bundled code only, no remote import, `connect-src 'none'` | CSP/zero-network tests |
| R-010 | Client View mistaken for access control | Open — managed | Internal disclosure | Persistent qualification, profile-first filtering, curated export later | Leakage/export tests |
| R-011 | Premature consolidation discards validated rules | Open | Regression | Inventory/golden tests before consolidation | Migration matrices |
| R-012 | Portable/SPFx editions diverge | Open | Incompatible products | Framework-neutral domains/host adapters | Shared host tests |
| R-013 | Release inventory incomplete | Open | Missing historical assets | Exact Release asset inventory | Inventory report |
| R-014 | Browser cannot prove destination write | Open — managed | Misleading save | Truthful labels and reopen verification | Save verification tests |
| R-015 | Standalone HTML hidden coupling | Open | Migration overrun/loss | Inventory functions/contracts/storage/tests | Feature inventories |
| R-016 | Synthetic fixtures lack production diversity | Open | False confidence | Expand adversarial synthetic fixtures | Diversity report |
| R-017 | Public Issues/PRs/artifacts receive sensitive content | Open — managed | Persistent disclosure | Content scans, synthetic screenshots, sanitized paths | CI/artifact review |
| R-018 | Prototype mistaken for production | Open — managed | Unsupported reliance | Separate issue #120 and mock disclosures | Usability report |
| R-019 | Same-name changed source replaces identity | Open — controlled | Broken traceability | Exact identity/version; no display-name merge | Identity tests |
| R-020 | Filename/path metadata leaks context | Open — controlled | Disclosure | Sanitization; field-aware detection; Client labels | Path tests |
| R-021 | Hash equality mistaken for authenticity/sufficiency | Open — managed | Misleading conclusions | Qualification; separate trust/review state | UX/content tests |
| R-022 | Transient search leaks hidden content | Open — designed | Advisor data exposed | Profile-first memory index; clear derived state | Leakage matrix |
| R-023 | Stale File association treated as portable link | Open — controlled | Wrong source | Session-only map; clear/re-hash | Relink tests |
| R-024 | Legacy import escalates authority | Open — managed | Silent authority transfer | Preview/apply receipt; target commands | Adapter/non-mutation tests |
| R-025 | Bounded text contains active/misleading content | Open — managed | XSS/spoofing | Plain text, sanitization, provenance, CSP | Adversarial tests |
| R-026 | Imported/source/Advisor content shown as Client answer/live statement | Open — controlled v0.5 | False attribution | Distinct records/origins, labels, reviewed conversion | Origin tests |
| R-027 | Snapshot source edits change prior assignment/session meaning | Open — controlled v0.5 | Lost meaning | Immutable snapshots, stale/conflict | Snapshot tests |
| R-028 | Raw Advisor content leaks during Client switch | Open — critical control | Sensitive disclosure | Pre-render filtering; clear caches/editors/focus/a11y | Leakage matrix |
| R-029 | Interrupted session loses/duplicates drafts | Open — controlled v0.5 | Corrupt record | One active session, checkpoints, atomic Pause | Recovery tests |
| R-030 | Confirmation mistaken for signature/broad approval | Open — managed | Governance overstatement | Exact version, local assertion, non-signature copy | Confirmation tests |
| R-031 | Suggestions enter agenda/create records automatically | Open — controlled v0.5 | Unreviewed facilitation | Explicit Advisor actions only | Non-mutation tests |
| R-032 | Facilitator cognitive load causes wrong capture/advance | Open — UX-managed | Poor session quality | Focused mode, separate editors, shortcut guards | Usability report |
| R-033 | Session completion mistaken for reviewed outcomes | Open — controlled v0.5 | Unreviewed content accepted | Separate lifecycle/review; publishes nothing | Completion tests |
| R-034 | Multiple active sessions corrupt recovery | Open — controlled v0.5 | Ambiguous context | One-active invariant | Multi-session tests |
| R-035 | Participant/contact labels remain sensitive | Open — partially mitigated | Disclosure unlocked project | Synthetic-only, bounded fields, profile filtering | Profile tests |
| R-036 | Questionnaire/import content contains active/oversized nested data | Open — managed | XSS/exhaustion | Strict JSON, plain bounded values, atomic preview/apply | Import tests |
| R-037 | Asset category is treated as accepted boundary disposition | Open — critical design control | Invalid Scope | Separate fields; accepted decision refs | Schema/UI tests |
| R-038 | Conflicting accepted Scope decisions coexist | Open — critical design control | Contradictory authority | Conflict block; atomic supersession | Decision matrix |
| R-039 | Source/version drift silently changes accepted Scope | Open — designed | Hidden authority change | Exact refs; stale state; explicit compare/supersede | Drift tests |
| R-040 | Diagram becomes independent authority or hides stale records | Open — critical design control | Misleading boundary | Object refs, draft generation, stale diagnostics, representation approval | Diagram tests |
| R-041 | Diagram accessibility text leaks hidden records | Open — critical disclosure control | Client exposure | Generate from Client projection; clear caches | DOM/a11y tests |
| R-042 | Same-name assets/providers auto-merge | Open — designed | Lost identity/provenance | Explicit create/link/keep separate/reject | Ambiguity fixtures |
| R-043 | Dependency cycle or graph size breaks validation/rendering | Open — bounded | DoS/corruption | Limits, traversal depth, precedence-cycle rejection | Scale/cycle tests |
| R-044 | Provider/inheritance context is mistaken for practice implementation | Open — managed | Unsupported conclusion | Scope-context-only language; no practice fields | Content/schema tests |
| R-045 | Scoper compatibility change breaks standalone route | Open — managed | Toolchain regression | Frozen contracts/runtime; exact non-regression | Scoper/Workshop route evidence |
| R-046 | Client-facing Scope view is distributed as a safe project | Open — managed | Full-project disclosure | Persistent qualification; curated export later | Export governance decision |
| R-047 | Migration infers boundary from existing records | Open — critical design control | Unreviewed authoritative Scope | Empty-domain migration only | Migration assertions |
| R-048 | Partial import/decision leaves orphan records | Open — critical integrity control | Invalid project | Cloned prospective state; atomic command | Fault-injection tests |

## Immediate governance actions

1. Review the issue #139 design package: ADR-0011, Scope contract, Scope workbench UX record, threat model, Scoper compatibility posture, exact acceptance matrix, and reconciled planning records.
2. Do not create a v0.6 implementation branch until the design PR merges.
3. After design merge, implement v0.6 additively from the exact design merge on current `main`, preserving v0.5 identity and the `85d6e783a250b373cd4b9ea356e4c341336f9259` standalone compatibility baseline.
4. Require exact candidate-head and final-head validation against `L2G_Integrated_Suite_v0.6.0_Acceptance_v1.md` before promotion.
5. Keep all v0.6 fixtures, Scope objects, decisions, diagrams, questions, screenshots, packages, logs, and artifacts synthetic and publicly safe.
6. Validate separate state dimensions, accepted-decision linkage, conflict/supersession, source drift, diagram stale/authority, dependency cycles, and atomic apply before promotion.
7. Validate Client non-disclosure before every count, search, render, inspector, differences, history, focus, live-region, diagram alternative, and accessibility-tree construction.
8. Revalidate exact Scoper v3.12 and current Workshop compatibility without changing frozen contracts or consuming v3.13 scope.
9. Continue issue #119 cleanup only after preservation gates pass.
10. Do not change the synthetic-only posture without a separately approved production/pilot security and operating decision.