# L2G Integrated Suite Decision and Risk Register v1

## Status

Planning register reconciled through 2026-08-05. Integrated Suite v0.6.0 Scope Vertical Slice is promoted and current through PR #142, merge `3cfa31e8e5100927ca1a96221e5af715108eddd6`. Its fully validated final metadata head is `6e33079575e3ecc0b5d3043ba9b0d440e858b2e8`, and the portable HTML SHA-256 is `1a06f10d874d0873b8add9cb398f980651ad605367d5fcf3dd354ce948220a46`. The next bounded release is the v0.7 Practice Review design gate under issue #143. Decisions marked `Open under issue #143` are not implementation authority until the complete design package is reviewed and merged. Risks remain open or managed until closure evidence is recorded.

## Decision register

| ID | Decision | Status | Required before | Notes |
|---|---|---|---|---|
| D-001 | Evolve the existing `SteadyEddieCF/L2G_Toolchain` monorepo rather than create a replacement repository | Accepted | Milestone 0 | No demonstrated technical constraint requires replacement |
| D-002 | Use a TypeScript modular monolith with one generated portable HTML runtime | Accepted and implemented | Milestone 0 | One deployment artifact retains internal domain boundaries |
| D-003 | Use one ZIP-based encrypted `.l2g` engagement project with modular domain documents | Accepted and implemented | Project implementation | Project kind and encrypted envelope remain version 1.0 |
| D-004 | Use read-only cross-domain projections and explicit reviewed transition proposals | Accepted and implemented through ADR-0011 | Domain migration | Automatic visibility does not transfer authority |
| D-005 | Use a command journal plus named checkpoints for Undo, Redo, history, and restoration | Accepted and implemented | Project store | Major migrations/imports/accepted authority decisions use checkpoints |
| D-006 | Keep standalone module builds and legacy package contracts throughout migration | Accepted | First migration adapter | Every retirement requires a separate decision |
| D-007 | Preserve reference-only evidence by default | Accepted and implemented in v0.4 | Evidence implementation | Originals remain external; bounded metadata/derived summaries may be encrypted in project |
| D-008 | Keep Single-System as the default SSP experience and portfolio mode Advanced | Accepted migration posture | SSP migration | Existing SSP posture is preserved |
| D-009 | Treat Advisor, Client, and Reviewer as presentation/workflow profiles, not security roles | Accepted and implemented | Shell and domain projections | External distribution requires curated export |
| D-010 | Separate package wire version, schema identity, contract release, stability, producer, and consumer | Accepted registry posture | Compatibility adapters | Prevent contract identity ambiguity |
| D-011 | Freeze the first implementation baseline only after the merged-main six-tool RG-4 sequence | Satisfied | Milestone 0 | Governed product/runtime baseline is `85d6e783a250b373cd4b9ea356e4c341336f9259` |
| D-012 | Use a versioned AES-256-GCM/PBKDF2-SHA-256 encrypted project and recovery envelope while withholding production-data authorization | Accepted and implemented in v0.2 | Encrypted persistence | Encryption is necessary but not sufficient for production/client/FCI/CUI use |
| D-013 | Keep the repository public while prohibiting client data, FCI, CUI, secrets, private paths, client-identifying content, and unlicensed proprietary material from repository-controlled surfaces | Accepted | Milestone 0 onward | Public visibility never changes the data authorization boundary |
| D-014 | Keep the clickable prototype separate from production domain migration | Accepted | Prototype and domain work | Prototype remains issue #120 work and cannot imply migrated authority |
| D-015 | Use Overview, Pre-Engagement, Evidence, Scope, Practice Review, SSP, Deliverables, and Reviews & Actions as workspace names/order | Accepted | Shell | A later rename requires reviewed usability evidence |
| D-016 | Use opaque Evidence IDs and complete SHA-256 fingerprints; filenames are metadata only | Accepted and implemented in v0.4 | Source registration | Hash proves byte equality only, not trust or sufficiency |
| D-017 | Keep source-to-browser-File associations in memory for the active session only | Accepted and implemented in v0.4 | Relink | No portable file handles, absolute paths, or automatic external watching |
| D-018 | Treat changed source bytes as a new revision identity rather than replacing an existing fingerprint | Accepted and implemented in v0.4 | Relink/revision | Prior source, hash, relationships, provenance, and history remain intact |
| D-019 | Rebuild search after profile filtering and persist no index or query history | Accepted and implemented for migrated domains | Search | Prevent hidden terms, counts, snippets, prior queries, inspector and focus leakage |
| D-020 | Consume stable packages through strict low-authority preview/apply adapters without changing contracts | Accepted and implemented for current adapters | Imports | Package bytes remain reference-only; source traceability is preserved |
| D-021 | Require separate Client labels/summaries and omit raw filenames/private source details from Client projections | Accepted and implemented for current domains | Client View | Visibility alone does not approve source metadata |
| D-022 | Keep inherited archive/envelope/history/checkpoint limits unless a separately approved release changes them | Accepted | Every domain release | Metadata and bounded structured content only, not a large-content container |
| D-023 | Create separate Pre-Engagement and Interview Sessions authorities rather than one overloaded meeting/intake domain | Accepted and implemented in v0.5 | v0.5 | Separate schema ownership |
| D-024 | Keep Engagement authoritative for participants/organizations and Evidence authoritative for source identity while Pre-Engagement/Interview use immutable refs/projections | Accepted and implemented in v0.5 | v0.5 | No duplicated authority |
| D-025 | Preserve immutable instrument, assignment, question, and session-plan versions/snapshots | Accepted and implemented in v0.5 | Assignment/session start | Stale/current/conflict explicit |
| D-026 | Represent Client responses, imported context, participant statements, Advisor notes, confirmations, summaries, and candidates as separate records | Accepted and implemented in v0.5 | v0.5 data model | Record type and provenance cannot be collapsed |
| D-027 | Keep raw Advisor notes Advisor-only and filter before Client calculation/search/render/inspector/focus/live-region/a11y work | Accepted and implemented in v0.5 | Client Presentation | Client summaries are separate reviewed records |
| D-028 | Treat Client confirmation as a locally asserted exact-version facilitation event, not authenticated identity or signature | Accepted and implemented in v0.5 | Confirmations | Source edit stales prior confirmation |
| D-029 | Permit at most one In-progress or Paused Interview session per project and checkpoint Start, Pause, and End | Accepted and implemented in v0.5 | Recovery | Pause preserves valid drafts without approving/publishing |
| D-030 | Keep dynamic/source-generated questions Advisor-controlled and prohibit automatic agenda insertion | Accepted and implemented in v0.5 | Interview Mode | Explicit Advisor actions only |
| D-031 | Keep source publication source-owned until a target-owned command creates a target candidate | Accepted and implemented for current targets | Cross-domain transitions | Target owns decisions; source accepted state remains unchanged |
| D-032 | Use one application state with profile-sensitive Interview presentation and defer second-display/window support | Accepted and implemented in v0.5 | UX | Preserve offline `file://` and non-disclosure |
| D-033 | Exclude microphone/camera capture, recording, transcription, AI-generated answers, hidden scoring, and automatic assessment conclusions | Accepted | v0.5 onward until separately changed | Requires separate security/authority decision |
| D-034 | Add one canonical Scope domain at `domains/scope.json`, schema `l2g_scope_v1` 1.0 and projection `l2g_scope_projection_v1` 1.0 | Accepted under ADR-0011 and implemented in v0.6 | v0.6 | Scope is target-owned authority inside the suite |
| D-035 | Keep object identity/taxonomy separate from asset category, Scope disposition, boundary relationship, implementation location, responsibility, lifecycle, review, visibility, currency, and decision state | Accepted and implemented in v0.6 | v0.6 schema/UI | Prevent overloaded Scope status and invalid inference |
| D-036 | Require a current accepted Scope decision for accepted category, disposition, relationship, responsibility, flow treatment, and approved diagram-representation fields | Accepted and implemented in v0.6 | v0.6 commands | Objects describe; decisions establish authority |
| D-037 | Preserve proposed disposition, Advisor analysis, participant/Client statement, Reviewer disposition, accepted decision, and supersession as distinguishable records/references | Accepted and implemented in v0.6 | v0.6 decision ledger | Latest note or statement never silently wins |
| D-038 | Make source/affected/dependency version drift stale a decision rather than automatically reversing or reaccepting it | Accepted and implemented in v0.6 | v0.6 currency logic | Explicit compare/supersede required |
| D-039 | Treat diagrams as governed exact-version representations, not independent Scope authority | Accepted and implemented in v0.6 | v0.6 diagrams | Historical references remain valid and visibly stale on drift |
| D-040 | Use Scope subviews Boundary, Systems & Assets, Providers & Services, Data Flows, Decisions, and Diagrams with one shared inspector | Accepted and implemented in v0.6 | v0.6 UX | Preserves integrated IA rather than copying Scoper tabs |
| D-041 | Publish Scope unknowns/questions as candidates rather than maintain a second Scope question authority | Accepted and implemented in v0.6 | Cross-domain adapter | No automatic live agenda insertion |
| D-042 | Support frozen `l2g_scope_context_v1` and `l2g_scope_return_package_v1` 1.0 through strict preview/apply/return behavior without modifying Scoper v3.12 | Accepted and implemented in v0.6 | v0.6 compatibility | Draft guardrails and zero-practice behavior preserved |
| D-043 | Migrate earlier projects by adding an empty Scope domain only, with no inferred objects, decisions, diagrams, categories, dispositions, responsibilities, flow treatments, or conclusions | Accepted and implemented in v0.6 | v0.6 migration | Named checkpoint/history event required |
| D-044 | Build Client Scope projection before counts/search/render/inspector/differences/history/focus/live-region/a11y and generate diagram alternatives from that projection | Accepted and implemented in v0.6 | v0.6 Client View | Prevent DOM, canvas, cache, count, and a11y leakage |
| D-045 | Keep standalone Scoper v3.12 independently distributable and require exact non-regression before Scope promotion | Accepted and satisfied in v0.6 | v0.6 promotion | Retirement or v3.13 work requires a separate issue |
| D-046 | Create one separate canonical Practice Review authority rather than overload Interview Sessions, Scope, Workshop imports, or Reviews & Actions | Open under issue #143 | v0.7 design merge | Exact schema, archive path, and ownership remain design decisions |
| D-047 | Keep requirement text, participant/client claims, imported Workshop context, referenced Evidence, Advisor observations, factual evidence-review state, gaps, recommendations, actions, blockers, provider context, and review positions as separate record types | Open under issue #143 | v0.7 contract | Prevent false attribution and premature conclusions |
| D-048 | Preserve immutable Practice Review plans/snapshots and one-at-a-time facilitated session state with pause/resume and post-session review | Open under issue #143 | v0.7 UX/contract | Must not duplicate or auto-publish captured records |
| D-049 | Keep Evidence authoritative for source identity and original evidence while Practice Review stores exact references and factual review context only | Open under issue #143 | v0.7 authority model | Evidence reference or review does not imply sufficiency |
| D-050 | Keep Scope authoritative for boundary, provider, service, flow, and responsibility context consumed by Practice Review | Open under issue #143 | v0.7 projections | Practice Review cannot rewrite the accepted boundary |
| D-051 | Preserve Workshop v79.1 as independently distributable and use strict preview/apply/return compatibility without contract-breaking changes | Open under issue #143 | v0.7 compatibility | Standalone retirement requires a separate decision |
| D-052 | Prohibit automatic or hidden Met/Not Met, applicability, readiness, compliance, risk, scoring, certification, evidence-sufficiency, and implementation-effectiveness conclusions | Open under issue #143 | v0.7 acceptance | Human-recorded workflow states must remain explicitly qualified |
| D-053 | Require Client and Reviewer Practice Review projections before counts, search, render, inspector, history, focus, live regions, export, or accessibility-tree creation | Open under issue #143 | v0.7 profile rules | Raw Advisor analysis and rejected/returned material remain hidden |

## Architecture questions and dispositions

### A-001 — Component framework and SPFx compatibility

Open. Domain and application-service layers remain framework-neutral. ADR-0003 requires a bounded portable/SPFx compatibility spike before pinning exact host and React versions.

### A-002 — Supported browsers

Open beyond the current baseline. Current desktop Chromium on Windows remains the portable release baseline with capability-based fallbacks. Firefox and Safari remain later compatibility work.

### A-003 — Production/client/FCI/CUI authorization

Open. Endpoint controls, operating procedures, pilot boundaries, support model, incident handling, data classification, approved users, distribution, and recovery governance remain required before changing the synthetic-only posture.

### A-004 — Project save implementation

Resolved for the portable baseline. `.l2g` is canonical, IndexedDB is bounded encrypted recovery, and save/download status is truthful. Reopen verification is used where the browser cannot prove a destination write.

### A-005 — Stable identifiers

Resolved for Engagement, Evidence, Pre-Engagement, Interview Sessions, and Scope: opaque typed IDs are immutable and labels are editable. Copied-project/cross-project merge remains future work. Practice Review identifiers remain an issue #143 design decision.

### A-006 — Search persistence

Resolved for migrated domains: filter by profile first, rebuild in memory, persist no index/query/snippet/recent-result state, and clear on profile/project/lock changes. Practice Review must preserve this rule.

### A-007 — Extracted preview representation

Partially resolved: bounded plain-text summaries and flat/typed structured fields only. Sanitized HTML, images, thumbnails, full extracts, OCR layers, audio/video, and large transcripts require later decisions.

### A-008 — Deterministic ZIP behavior

Resolved for current releases through stored-only deterministic ordering, exact integrity manifest, strict path/CRC validation, and reproducible builds.

### A-009 — Client-safe visibility inheritance

Resolved for current domains. Practice Review must define family-specific Client labels/summaries and filter before every derived UI operation.

### A-010 — State-dimension schemas and legacy mapping

Resolved through Scope under ADR-0011. Practice Review, SSP, Deliverables, and complete Reviews & Actions transitions remain future decisions.

### A-011 — Interview presentation topology

Resolved for v0.5. Optional second-display/window support remains later work.

### A-012 — Large derived content

Open. Current releases preserve inherited project/archive limits. Full extracts, previews, images, OCR, audio/video, large transcripts, and high-resolution diagram source require separate storage/performance/export decisions.

### A-013 — Authenticity and chain of custody

Open. SHA-256 establishes byte equality only. Participant labels, confirmations, Scope decisions, and future Practice Review positions are locally asserted. Digital signatures, trusted timestamps, authenticated actors, and external custody require separate models.

### A-014 — Questionnaire delivery/collection outside the application

Open. Email, portals, accounts, authenticated remote completion, reminders, and collaboration are excluded.

### A-015 — Audio/transcription and AI assistance

Open and excluded. Any future work requires consent, privacy, classification, model/provider, retention, accuracy, attribution, and authority decisions.

### A-016 — Diagram rendering implementation

Resolved for the v0.6 bounded representation model: deterministic bundled rendering, no remote assets, object-linked nodes/edges, accessible alternatives, and explicit stale state. Rich diagram editing and export remain future work.

### A-017 — Scope compatibility export consumer posture

Partially resolved. Frozen Scope contracts remain compatible with current routes, but broader consumer receipt or retirement authority requires separate validation.

### A-018 — Automated classification or boundary assistance

Open and excluded. Any rules engine or AI assistance requires explainability, source attribution, human review, false-positive/negative handling, and non-conclusion controls.

### A-019 — Curated Client export

Open. Client profile remains presentation only. External distribution requires a separately approved curated export and data-classification model.

### A-020 — Practice Review requirement source and version authority

Open under issue #143. The design must identify the authoritative 110-requirement source/version and prevent imported Workshop text from silently replacing it.

### A-021 — Practice Review conclusion vocabulary

Open under issue #143. The design must define allowed human-recorded review positions while prohibiting automatic or misleading formal-assessment conclusions.

### A-022 — Practice Review target ownership

Open under issue #143. Gaps, recommendations, actions, blockers, provider follow-ups, SSP proposals, and deliverable inputs require explicit target authorities, receipts, and reversal behavior.

## Risk register

| ID | Risk | Status | Impact | Treatment | Closure evidence |
|---|---|---|---|---|---|
| R-001 | Repository visibility is public | Accepted — managed | Public disclosure | Synthetic-only fixtures; prohibit client/FCI/CUI/secrets/private paths/client-identifying/unlicensed material | Ongoing public-hygiene CI/review |
| R-002 | Correction stack moved during initial planning | Closed | Adapters target unqualified contracts | Promoted RG-4/current suite baseline | PR #118 and `85d6e783a250b373cd4b9ea356e4c341336f9259` |
| R-003 | Temporary/accidental release branches remain | Open — verified | Baseline confusion | Preserve evidence; issue #119 cleanup | Reviewed cleanup report |
| R-004 | Contract identity overloads `version` | Open — managed | Compatibility errors | Separate kind/wire/schema/release/stability/producer/consumer | Contract tests |
| R-005 | `.l2g` may contain sensitive derived content | Open — partially mitigated | Data exposure at rest | Encryption; originals external; bounded content; synthetic-only | Approved production posture |
| R-006 | One project file concentrates corruption risk | Open — managed | Work loss | Integrity, recovery, checkpoints, validation, verified backups | Corruption/recovery matrix |
| R-007 | Large domain sets exceed browser limits | Open — bounded | Failure/unusable project | Semantic caps, preflight, inherited limits, bounded scale tests | v0.6 10k/20k/50k synthetic matrix |
| R-008 | Cross-domain Undo creates invalid states | Open — controlled | Integrity corruption | Domain commands, prospective validation, target receipts, checkpoints | v0.6 Undo/Redo and source-target tests; future-domain matrices still required |
| R-009 | Worker/rendering support weakens single-file CSP | Open — managed | Attack surface | Bundled code only, no remote import, `connect-src 'none'` | Current CSP/zero-network tests |
| R-010 | Client View mistaken for access control | Open — managed | Internal disclosure | Persistent qualification, profile-first filtering, curated export later | Leakage/axe tests; export decision remains open |
| R-011 | Premature consolidation discards validated rules | Open | Regression | Inventory/golden tests before consolidation | Migration matrices |
| R-012 | Portable/SPFx editions diverge | Open | Incompatible products | Framework-neutral domains/host adapters | Shared host tests |
| R-013 | Release inventory incomplete | Open | Missing historical assets | Exact Release asset inventory | Inventory report |
| R-014 | Browser cannot prove destination write | Open — managed | Misleading save | Truthful labels and reopen verification | Save verification tests |
| R-015 | Standalone HTML hidden coupling | Open — demonstrated and controlled | Startup/performance regression | Emitted-runtime markers, exact browser startup tests, idempotent observers | v0.6 observer-loop correction and native Linux/Windows acceptance |
| R-016 | Synthetic fixtures lack production diversity | Open | False confidence | Expand adversarial synthetic fixtures | Diversity report |
| R-017 | Public Issues/PRs/artifacts receive sensitive content | Open — managed | Persistent disclosure | Content scans, synthetic screenshots, sanitized paths | CI/artifact review |
| R-018 | Prototype mistaken for production | Open — managed | Unsupported reliance | Separate issue #120 and mock disclosures | Usability report |
| R-019 | Same-name changed source replaces identity | Open — controlled | Broken traceability | Exact identity/version; no display-name merge | Evidence and Scope identity tests |
| R-020 | Filename/path metadata leaks context | Open — controlled | Disclosure | Sanitization; field-aware detection; Client labels | Path tests |
| R-021 | Hash equality mistaken for authenticity/sufficiency | Open — managed | Misleading conclusions | Qualification; separate trust/review state | UX/content tests |
| R-022 | Transient search leaks hidden content | Open — controlled | Advisor data exposed | Profile-first memory index; clear derived state | Current leakage matrix |
| R-023 | Stale File association treated as portable link | Open — controlled | Wrong source | Session-only map; clear/re-hash | Relink tests |
| R-024 | Legacy import escalates authority | Open — managed | Silent authority transfer | Preview/apply receipt; target commands | Adapter/non-mutation tests |
| R-025 | Bounded text contains active/misleading content | Open — managed | XSS/spoofing | Plain text, sanitization, provenance, CSP | Adversarial tests |
| R-026 | Imported/source/Advisor content shown as Client answer/live statement | Open — controlled | False attribution | Distinct records/origins, labels, reviewed conversion | Origin and Client-projection tests |
| R-027 | Snapshot source edits change prior assignment/session meaning | Open — controlled | Lost meaning | Immutable snapshots, stale/conflict | Snapshot tests |
| R-028 | Raw Advisor content leaks during Client switch | Open — critical control | Sensitive disclosure | Pre-render filtering; clear caches/editors/focus/a11y | v0.5/v0.6 leakage and axe matrices |
| R-029 | Interrupted session loses/duplicates drafts | Open — controlled for Interview | Corrupt record | One active session, checkpoints, atomic Pause | Interview recovery tests; Practice Review design pending |
| R-030 | Confirmation mistaken for signature/broad approval | Open — managed | Governance overstatement | Exact version, local assertion, non-signature copy | Confirmation tests |
| R-031 | Suggestions enter agenda/create records automatically | Open — controlled | Unreviewed facilitation | Explicit Advisor actions only | Non-mutation tests |
| R-032 | Facilitator cognitive load causes wrong capture/advance | Open — UX-managed | Poor session quality | Focused mode, separate editors, shortcut guards | Interview evidence plus v0.7 usability review required |
| R-033 | Session completion mistaken for reviewed outcomes | Open — controlled for Interview | Unreviewed content accepted | Separate lifecycle/review; completion publishes nothing | Completion tests; Practice Review design pending |
| R-034 | Multiple active sessions corrupt recovery | Open — controlled for Interview | Ambiguous context | One-active invariant | Multi-session tests; Practice Review rule pending |
| R-035 | Participant/contact labels remain sensitive | Open — partially mitigated | Disclosure in unlocked project | Synthetic-only, bounded fields, profile filtering | Profile tests |
| R-036 | Questionnaire/import content contains active/oversized nested data | Open — managed | XSS/exhaustion | Strict JSON, plain bounded values, atomic preview/apply | Import tests |
| R-037 | Asset category is treated as accepted boundary disposition | Closed for v0.6 model | Invalid Scope | Separate fields and accepted-decision refs | v0.6 schema/UI/domain tests |
| R-038 | Conflicting accepted Scope decisions coexist | Closed for v0.6 command path | Contradictory authority | Prospective conflict block and atomic acceptance | v0.6 decision matrix |
| R-039 | Source/version drift silently changes accepted Scope | Closed for v0.6 model | Hidden authority change | Exact refs, stale state, explicit supersession | v0.6 stale-decision and diagram tests |
| R-040 | Diagram becomes independent authority or hides stale records | Closed for v0.6 bounded model | Misleading boundary | Object refs, representation state, stale diagnostics | v0.6 diagram domain/browser tests |
| R-041 | Diagram accessibility text leaks hidden records | Closed for v0.6 tested projection | Client exposure | Generate from Client projection and test axe/DOM | v0.6 Client browser/axe matrix |
| R-042 | Same-name assets/providers auto-merge | Closed for v0.6 imports | Lost identity/provenance | Explicit treatment and ambiguity block | v0.6 import fixtures/tests |
| R-043 | Dependency cycle or graph size breaks validation/rendering | Closed for v0.6 bounded limits | DoS/corruption | Limits, depth, precedence-cycle rejection | 10k assets, 20k flows, 50k dependencies, cycle/over-limit tests |
| R-044 | Provider/inheritance context is mistaken for practice implementation | Open — managed | Unsupported conclusion | Scope context only; Practice Review authority separation required | v0.7 design/acceptance pending |
| R-045 | Scoper compatibility change breaks standalone route | Closed for v0.6 release | Toolchain regression | Frozen contracts/runtime and exact non-regression | PR #142 RG-4/current-suite evidence |
| R-046 | Client-facing Scope view is distributed as a safe project | Open — managed | Full-project disclosure | Persistent qualification; curated export later | Export governance decision |
| R-047 | Migration infers boundary from existing records | Closed for v0.6 migration | Unreviewed authoritative Scope | Empty-domain migration only | v0.6 migration assertions |
| R-048 | Partial import/decision leaves orphan records | Closed for v0.6 command paths | Invalid project | Prospective cloned state and atomic commit | v0.6 fault/non-mutation tests |
| R-049 | Participant/client claim is presented as an accepted Practice Review conclusion | Open — critical design risk | False attribution and unsupported conclusion | Separate record families, explicit review/acceptance, qualified copy | v0.7 contract/UX/acceptance |
| R-050 | Referenced Evidence is treated as sufficient or effective by mere presence | Open — critical design risk | Misleading review outcome | Factual review state only; no implied sufficiency | v0.7 authority and evidence-request tests |
| R-051 | Stale Scope or Evidence context remains hidden during Practice Review | Open — critical integrity risk | Review based on obsolete context | Exact refs, visible stale state, explicit refresh/review | v0.7 stale-reference matrix |
| R-052 | Workshop import silently becomes authoritative Practice Review state | Open — critical compatibility risk | Authority escalation | Strict preview, explicit treatment, atomic target command | v0.7 Workshop compatibility tests |
| R-053 | Practice Review completion is mistaken for formal assessment or Met/Not Met | Open — critical governance risk | Unsupported reliance | Separate workflow position, persistent qualifications, prohibited automatic conclusion vocabulary | v0.7 content/domain/browser tests |
| R-054 | Provider/responsibility discussion becomes automatic implementation or ownership conclusion | Open — high | Incorrect responsibility assignment | Preserve claims/source/version and require explicit human decision | v0.7 provider scenarios |
| R-055 | Interrupted Practice Review session loses or duplicates claims, observations, requests, or open items | Open — high | Corrupt review record | One-active/session invariant, checkpoints, atomic pause/recovery | v0.7 recovery matrix |
| R-056 | Raw Advisor observations or rejected gaps leak into Client presentation | Open — critical disclosure risk | Sensitive disclosure | Projection before all derived UI work and export | v0.7 Client leakage/axe matrix |
| R-057 | Gap, recommendation, action, blocker, or follow-up is published to the wrong target authority | Open — high | Cross-domain corruption | Target-owned candidates, receipts, explicit accept/modify/reject/return | v0.7 transition/Undo matrix |
| R-058 | Requirement identity or text drifts from the authoritative 110-practice baseline | Open — high | Review mapped to wrong requirement | Immutable requirement source/version refs and exact migration rules | v0.7 contract and 110-record fixtures |

## Immediate governance actions

1. Treat v0.6.0 as the current Integrated Suite release through PR #142 and merge `3cfa31e8e5100927ca1a96221e5af715108eddd6`.
2. Preserve portable HTML SHA-256 `1a06f10d874d0873b8add9cb398f980651ad605367d5fcf3dd354ce948220a46`, the validation report, release pointer, and exact candidate/final-head evidence.
3. Keep issue #143 design-only; do not create a v0.7 implementation branch until ADR-0012, the Practice Review contract, focused UX record, Workshop compatibility posture, threat model, profile rules, and exact acceptance matrix are reviewed and merged.
4. Reconcile the Scope UX helper findings as bounded v0.6/shared-pattern corrections or v0.7 design inputs; do not silently broaden either release.
5. Define the authoritative 110-requirement source/version and distinguish claims, imported context, Evidence references, observations, factual review state, gaps, recommendations, actions, blockers, provider context, and human review positions.
6. Preserve Workshop v79.1 and all current registered routes without contract-breaking changes or retirement claims.
7. Require exact source/target non-mutation, interrupted-session recovery, stale Scope/Evidence handling, profile non-disclosure, malformed/oversized/ambiguous import rejection, deterministic packaging, Linux/native Windows, axe-core, zero-network, RG-4, and current-suite validation for any v0.7 implementation candidate.
8. Continue issue #119 cleanup only after preservation gates pass.
9. Do not change the synthetic-only posture without a separately approved production/pilot security and operating decision.
