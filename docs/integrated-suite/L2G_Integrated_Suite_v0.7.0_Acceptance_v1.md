# L2G Integrated Suite v0.7.0 — Exact Acceptance Matrix

## Status

Proposed design acceptance record for issue #143. Implementation is not authorized until ADR-0012, the Practice Review contract, focused UX record, threat model, Workshop compatibility posture, this matrix, and reconciled governance records are reviewed and merged.

## Release objective

Promote one bounded Practice Review vertical slice that adds canonical facilitated-review authority to the v0.6 Integrated Suite without changing Engagement, Evidence, Scope, Pre-Engagement, Interview Sessions, stable standalone modules, stable package contracts, or formal-assessment boundaries.

## Promotion identity requirements

The implementation PR must record and validate:

- exact protected-`main` baseline;
- exact merged v0.7 design-gate commit;
- exact implementation candidate head;
- exact final metadata head;
- deterministic portable HTML filename, byte length, and SHA-256;
- release ZIP filename and SHA-256;
- project/envelope/domain/projection/catalog kinds and versions;
- Linux and Windows artifact IDs/digests;
- dedicated v0.7, repository validation, shared Playwright, Workshop v79.1, RG-4/current-suite, and inherited materializer run IDs;
- SBOM and release-manifest identity;
- synthetic-only and production-data-unauthorized posture.

Candidate-head validation must complete before promotion metadata is added. The complete matrix must pass again on the unchanged final metadata head before merge.

## Required release artifacts

- `apps/integrated-suite-v0.7/` source/build/test tree;
- deterministic standalone HTML candidate;
- downloadable deterministic release ZIP;
- `l2g_practice_review_v1` version `1.0` schema;
- `l2g_practice_review_projection_v1` version `1.0` schema;
- exact 110-requirement catalog identity and fixture;
- release manifest;
- compatibility manifest/posture evidence;
- SBOM;
- release notes;
- validation report;
- synthetic fixture sources and generated fixtures;
- earlier encrypted-project migration fixtures;
- Workshop compatibility fixtures;
- Linux and native Windows `file://` browser evidence;
- current pointer update only after candidate validation;
- planning/roadmap/risk reconciliation after promotion.

## Test data posture

All fixtures must be synthetic, clearly qualified, and free of client-identifying content, FCI, CUI, secrets, credentials, tokens, private keys, private paths, proprietary unlicensed content, and production artifacts.

The primary fictional organization may use the existing McFirecoal/McFeddy context. Every fixture, claim, Evidence reference, observation, gap, recommendation, action, blocker, provider record, screenshot, package, log, and report must state or inherit the fictional/non-assessment posture.

## Acceptance matrix

### A. Build, identity, and offline runtime

| ID | Requirement | Pass evidence |
|---|---|---|
| A-01 | TypeScript strict compile succeeds | `tsc --noEmit` or governed equivalent passes |
| A-02 | Deterministic build succeeds twice | Second HTML SHA-256 and byte length equal first |
| A-03 | Deterministic release ZIP succeeds twice | Entry order, timestamps, bytes, and SHA-256 equal |
| A-04 | Filename/version/visible release labels are v0.7.0 Practice Review | Static and browser assertions |
| A-05 | Manifest/SBOM/schema/catalog identities match the candidate | Release validator passes |
| A-06 | No runtime external dependency or unexpected request | Static URL scan and browser request ledger equals zero unexpected requests |
| A-07 | Restrictive CSP is preserved | Static CSP assertion and browser operation under CSP |
| A-08 | Runtime opens from local HTTP and native Windows Chromium `file://` | Dedicated browser jobs pass |
| A-09 | No page errors or unexpected console errors on governed workflows | Browser logs pass |
| A-10 | Public-hygiene scan passes | No client/FCI/CUI/secrets/private paths/non-synthetic fixture markers/remote runtime URLs |
| A-11 | Emitted-runtime validator proves all v0.7 layers are bundled | Unique markers for domain, adapters, Practice Mode, profiles, recovery, and compatibility |
| A-12 | Additive shell enhancements are idempotent | Startup/main-thread readiness tests; no observer/render loop |

### B. Requirement catalog and schema validation

| ID | Requirement | Pass evidence |
|---|---|---|
| B-01 | Valid empty `l2g_practice_review_v1` validates | Positive fixture |
| B-02 | Catalog has exactly 110 unique requirement refs | Positive and 109/111/duplicate negative fixtures |
| B-03 | Catalog kind/version/SHA-256 and every text SHA-256 validate | Positive/negative fixtures |
| B-04 | Requirement-linked records reference one catalog entry | Orphan/wrong-catalog fixtures rejected |
| B-05 | Changed catalog or text fingerprint marks affected plans/reviews stale | Deterministic stale fixture |
| B-06 | Prior plan/review history retains original requirement refs | Version/history assertions |
| B-07 | All local IDs are unique and use correct family prefixes | Positive/negative matrix |
| B-08 | All cross-record refs exist and allowed families match | Orphan/wrong-family fixtures rejected |
| B-09 | Supersession links are reciprocal and acyclic | Negative fixtures rejected |
| B-10 | Lifecycle, operational, review, visibility, currency, claim, Evidence review, position, candidate, and receipt states remain separate | Schema/type assertions |
| B-11 | Exactly one active Requirement Review exists per requirement per review cycle | Conflict fixture rejected |
| B-12 | At most one current non-superseded position exists per active Requirement Review | Conflict fixture rejected |
| B-13 | Prototype-pollution keys reject at every depth | `__proto__`, `prototype`, `constructor` fixtures rejected |
| B-14 | Duplicate JSON keys reject at every depth | Root/nested fixtures rejected |
| B-15 | Collection/string/ref/depth/package limits enforce before mutation | Boundary fixtures pass/fail correctly |
| B-16 | Deterministic serialization ordering is stable | Repeated serialize/hash equality |

### C. Migration and encrypted project persistence

| ID | Requirement | Pass evidence |
|---|---|---|
| C-01 | Valid v0.6 project migrates to one valid empty Practice Review domain | Domain/index assertions |
| C-02 | Migration creates named checkpoint and history event | Exact event/checkpoint assertions |
| C-03 | Migration infers no plans, sessions, reviews, claims, Evidence reviews, observations, gaps, recommendations, actions, blockers, provider follow-ups, positions, candidates, or conclusions | Exact zero-count assertions |
| C-04 | v0.1-v0.5 projects migrate through established paths then receive the same empty domain | Versioned fixture matrix |
| C-05 | Requirement catalog validates before project replacement | Invalid catalog preserves current valid state |
| C-06 | Invalid legacy project fails before replacement | No-mutation project hash assertion |
| C-07 | Migrated project encrypts, saves/downloads, reopens, decrypts, and validates | Browser and domain workflow |
| C-08 | IndexedDB encrypted recovery preserves exact Practice Review state | Browser recovery workflow |
| C-09 | Wrong passphrase, truncated envelope, tampered ciphertext/tag, and invalid integrity manifest reject | Crypto/tamper matrix |
| C-10 | Lock clears decrypted Practice Review projection, editors, search, inspector, dialogs, focus, live regions, and session transient state | Browser DOM/state/a11y assertions |
| C-11 | Undo/Redo around migration and subsequent Practice Review commands preserves valid project/audit events | Domain/persistence matrix |
| C-12 | Checkpoint restore cannot create two active sessions or orphan target receipts | Negative restoration fixtures |

### D. Record-family and provenance separation

| ID | Requirement | Pass evidence |
|---|---|---|
| D-01 | Participant/client claim saves as `ImplementationClaim` only | Exact family/source assertions |
| D-02 | Advisor note saves as Advisor-only `AdvisorObservation` only | Exact family/visibility assertions |
| D-03 | Imported Workshop record saves as `ImportedPracticeContext` before conversion | Import/domain assertion |
| D-04 | Evidence link/review saves as `EvidenceReview` only | Exact family/ref assertion |
| D-05 | Question saves as `ReviewQuestion` only | Domain assertion |
| D-06 | Gap-like capture saves as qualified `GapObservation`, not formal finding | Domain/content assertion |
| D-07 | Recommendation, action, and blocker save as separate families | Domain assertions |
| D-08 | Responsibility/provider capture saves as discussion/follow-up, not Scope decision or implementation fact | Source/target hashes unchanged |
| D-09 | Review position is a separate explicit command | Claims/observations/Evidence do not auto-create position |
| D-10 | Summary conversion creates separate reviewed summary and exact source refs | Source version remains unchanged |
| D-11 | Switching editor family copies no text automatically | Browser editor-state assertion |
| D-12 | Same requirement/label does not imply record identity | Distinct-record fixture remains separate |
| D-13 | Imported status labels remain quoted source context only | Authority fields unchanged |
| D-14 | All family records retain exact origin/source/version/provenance | Domain fixture matrix |

### E. Plans, sessions, and Practice Mode

| ID | Requirement | Pass evidence |
|---|---|---|
| E-01 | Create/edit/archive/supersede review plan | Domain/browser tests |
| E-02 | Freeze immutable plan version with ordered requirement refs and exact context refs | Snapshot/hash assertions |
| E-03 | Editing plan after freeze creates a new version | Prior version unchanged |
| E-04 | Starting session requires valid frozen plan and creates named checkpoint/history | Browser/domain assertions |
| E-05 | At most one session is in-progress or paused | Multi-session negative test |
| E-06 | Practice Mode opens on exact first/current requirement with position counter | Browser test |
| E-07 | Previous/Next/jump navigation preserves valid drafts and exact position | Keyboard/browser tests |
| E-08 | Capture each record family through distinct editor/command | Browser/domain matrix |
| E-09 | `Save and next` is optional/local and never changes record family | Browser preference test |
| E-10 | Pause saves valid drafts, exact position/editor family, checkpoint, and history without publication | Recovery assertions |
| E-11 | Resume validates stale/conflict changes and returns to exact position | Browser recovery test |
| E-12 | End creates `ended-pending-review` and post-session queue only | No acceptance/publication hash assertion |
| E-13 | Complete requires explicit treatment of every queued record | Negative/positive queue matrix |
| E-14 | Complete creates no formal assessment outcome or automatic position | Domain/content assertion |
| E-15 | Interrupted session at each capture family recovers without duplicate/lost drafts | Fault/recovery matrix |
| E-16 | Keyboard shortcuts have visible equivalents and destructive commands lack single-key shortcuts | Keyboard/a11y test |
| E-17 | Focus restoration after navigation, dialogs, pause/resume, and profile switch is valid | Browser focus assertions |

### F. Claims, Evidence review, gaps, and positions

| ID | Requirement | Pass evidence |
|---|---|---|
| F-01 | Claim requires explicit origin and attribution/source ref | Negative missing-origin fixture |
| F-02 | Locally confirmed claim binds exact claim version and states non-signature qualification | Domain/content test |
| F-03 | Claim edit or withdrawal never changes current position automatically | Pre/post position hash equality |
| F-04 | Evidence review requires exact Evidence revision | Missing/stale ref fixtures |
| F-05 | Allowed Evidence review states remain factual | Schema/content assertions |
| F-06 | Evidence presence/review never creates gap, position, implementation, or sufficiency state | Non-mutation assertions |
| F-07 | Changed Evidence revision marks affected review/position stale | Deterministic stale test |
| F-08 | Scope-context version drift marks affected review/position stale | Deterministic stale test |
| F-09 | Gap observation always retains non-formal-finding qualification | Domain/browser/content tests |
| F-10 | Workflow priority is not rendered or serialized as risk | Schema/copy tests |
| F-11 | Create proposed qualified Practice Review position with exact basis refs | Domain/browser test |
| F-12 | Position acceptance/supersession is atomic and preserves prior history | Exact diff/history tests |
| F-13 | Changed basis ref marks position stale rather than rewriting/reaccepting | Stale matrix |
| F-14 | Conflicting current position blocks before mutation | Negative test |
| F-15 | Reviewer Concur/Concur with changes/Return/Reject changes only review disposition | Exact diff test |
| F-16 | Reviewer concurrence does not create formal assessment or target publication | Domain/content test |
| F-17 | Unsupported conclusion vocabulary in authority-bearing fields rejects | Met/Not Met/compliance/readiness/risk/sufficiency/effectiveness fixtures |
| F-18 | Quoted imported source vocabulary may remain only in clearly labeled imported context | Positive qualified-source fixture |

### G. Provider, responsibility, and Scope context

| ID | Requirement | Pass evidence |
|---|---|---|
| G-01 | Read-only Scope projection displays exact systems/assets/providers/services/flows/decisions | Projection/browser test |
| G-02 | Practice Review cannot directly mutate Scope | Pre/post Scope hash equality |
| G-03 | Responsibility discussion records claim-qualified values | Domain/content test |
| G-04 | Accepted Scope responsibility displays separately from claims | Browser hierarchy assertion |
| G-05 | Provider authorization/contract context does not create implementation position | Non-mutation test |
| G-06 | Provider follow-up preserves provider Scope ref and requested information/evidence types | Domain test |
| G-07 | Stale provider/Scope refs display exact diagnostics | Browser/domain test |
| G-08 | Publish Scope question/change candidate through target-owned adapter | Source/target receipt test |
| G-09 | Scope Return/Reject leaves Practice Review source record and Scope accepted state valid | Cross-domain tests |
| G-10 | Cross-domain Undo/Redo cannot orphan Scope candidate or receipt | Undo matrix |

### H. Source and target candidate authority

| ID | Requirement | Pass evidence |
|---|---|---|
| H-01 | Engagement context publishes Practice Review candidate without Engagement mutation | Hash/source-target test |
| H-02 | Evidence context publishes candidate without Evidence mutation | Hash/source-target test |
| H-03 | Scope context publishes candidate without Scope mutation | Hash/source-target test |
| H-04 | Pre-Engagement context publishes candidate without intake mutation | Hash/source-target test |
| H-05 | Interview context publishes candidate without Interview mutation | Hash/source-target test |
| H-06 | Active duplicate source publication is suppressed by exact source/version/family, not display name | Domain test |
| H-07 | Practice Review publishes Evidence request candidate through Evidence target command | Receipt/non-mutation test |
| H-08 | Practice Review publishes Scope question/change candidate through Scope target command | Receipt/non-mutation test |
| H-09 | Practice Review publishes session question candidate without automatic active-agenda insertion | Target test |
| H-10 | Future Reviews & Actions/SSP/Deliverables targets remain unaccepted until target authority exists | Negative capability test |
| H-11 | Target Accept/Modify/Return/Reject is mirrored only through validated receipt | Cross-domain assertions |
| H-12 | Source edit cannot manufacture target acceptance | Semantic rejection fixture |
| H-13 | Fault at every publication stage produces no partial mutation | Fault-injection matrix |
| H-14 | Cross-domain Undo/Redo preserves source/target refs and audit events | Undo/Redo matrix |

### I. Workshop and package compatibility

| ID | Requirement | Pass evidence |
|---|---|---|
| I-01 | Recognize `l2g_workshop_state_v1` wire `1.0` | Positive preview fixture |
| I-02 | Preserve Workshop Handoff contract release 1.7 / wire 1.0 identity | Registry/static tests |
| I-03 | Preserve Workbook Merge 1.1 as Workshop-owned apply route | No Integrated apply command; route regression |
| I-04 | Preserve SSP Handoff/Return 1.0 routes | Current route tests |
| I-05 | Recognize optional responsibility/observability/audit routes only as registered read-only/advisory context | Positive/negative route matrix |
| I-06 | Unsupported kind/version/release rejects before mutation | No-mutation hash assertion |
| I-07 | Duplicate/prototype keys reject before preview/apply | Parser tests |
| I-08 | Package SHA-256, kind, wire version, release, producer, traceability, guardrails, and diagnostics display | Browser assertion |
| I-09 | Package/workbook/original Evidence bytes are not retained | Serialized-project scan |
| I-10 | Workshop practices/notes/responses/findings/recommendations/actions/blockers/providers/SSP context stage as imported context | Preview/apply assertions |
| I-11 | Explicit conversion creates only selected destination families | Exact selected/unselected assertions |
| I-12 | Same-requirement/same-label records require Link/Keep separate/reject treatment | Apply disabled until resolved |
| I-13 | Valid reviewed subset applies while unrelated ambiguous records remain unapplied | Atomic subset test |
| I-14 | Source assessment-like status remains imported context and rejects from local authority fields | Content/domain test |
| I-15 | Responsibility overlay maps to claim-qualified discussion only | Domain/Scope non-mutation test |
| I-16 | SSP Return previews as context without changing Practice Review or SSP accepted state | Cross-domain hash test |
| I-17 | Active HTML/script/SVG/event/URL content is inert or rejected | Browser/XSS/zero-network tests |
| I-18 | Field-aware private-path leakage detection avoids broad opaque-text false positives | Positive/negative path fixtures |
| I-19 | Fault at every apply stage produces no partial mutation or false applied receipt | Fault-injection matrix |
| I-20 | Repeated preview/export is idempotent and package object/bytes remain unchanged | Repeated hash/count equality |
| I-21 | Optional Workshop State export, if implemented, validates in Workshop v79.1 and retains non-assessment guardrails | Consumer/browser test; otherwise explicit deferred assertion |
| I-22 | Existing Workshop v79.1 runtime/hash/materializer/storage/current pointer remain unchanged | Exact standalone regression |
| I-23 | Builder/Merger v3.10.1, SSP v1.9.17, Control Center, Scoper, DocConverter, and RG-4 routes remain green | Shared workflows |

### J. Profile projections and non-disclosure

| ID | Requirement | Pass evidence |
|---|---|---|
| J-01 | Advisor projection includes all permitted source context and raw Advisor records | Projection test |
| J-02 | Reviewer projection is content-read-only except explicit disposition commands | Projection/action test |
| J-03 | Client projection includes only explicit Client-visible family records with required label/summary | Projection test |
| J-04 | Advisor observations absent from Client DOM and serialized UI models | Leakage test |
| J-05 | Unreviewed imported context absent from Client surfaces | Leakage test |
| J-06 | Rejected/returned/withdrawn/superseded candidates absent from Client surfaces unless separately approved summary exists | Leakage test |
| J-07 | Internal package/path/diagnostic/private participant/provider metadata absent from Client surfaces | Leakage test |
| J-08 | Hidden labels, snippets, terms, group names, counts, progress totals, and differences absent | DOM/model tests |
| J-09 | Client counts/progress calculated from Client projection only | Hidden-only fixture yields zero visible count |
| J-10 | Inspector and comparison models rebuild from new projection | Rapid switch test |
| J-11 | Focus restoration never lands on hidden prior-profile editor/control | Keyboard/profile test |
| J-12 | Live regions contain no hidden record text/count | Accessibility assertion |
| J-13 | Accessibility tree contains no hidden Advisor/import content | Axe/accessibility snapshot |
| J-14 | Lock clears all decrypted/projection/transient state | Lock test |
| J-15 | Persistent qualification states profile is not access control, formal assessment, or safe distribution | Content assertion |

### K. UX, responsive behavior, and accessibility

| ID | Requirement | Pass evidence |
|---|---|---|
| K-01 | Subnavigation contains exactly Review Queue, Sessions, Evidence & Requests, Open Items, Providers & Responsibility, Review History | Browser assertion |
| K-02 | Practice Mode launches from valid frozen plan and is not a separate workspace/tab | Browser/domain assertion |
| K-03 | Review Queue is usable at 1440×900 and 1280×720 | Screenshot/interaction tests |
| K-04 | Practice Mode primary actions remain visible at 1280×720 | Screenshot/interaction tests |
| K-05 | Tablet landscape uses one pane/drawers without primary horizontal page scrolling | 1024×768 test |
| K-06 | Capture editors are distinct and visibly label origin/visibility/resulting family | Browser assertions |
| K-07 | Evidence factual states avoid sufficiency/effectiveness language | Content/browser test |
| K-08 | Gap observations visibly show non-formal-finding qualification | Browser assertion |
| K-09 | Provider claims and Scope authority display separately | Browser hierarchy test |
| K-10 | Post-session review previews exact effects before treatment/publication | Browser assertion |
| K-11 | Position composer previews exact basis/effects and blocks invalid/stale/conflicting input | Browser matrix |
| K-12 | Import preview displays identity/diagnostics and per-record treatment | Browser test |
| K-13 | All primary controls are keyboard reachable with visible focus | Keyboard test |
| K-14 | No primary action relies on color, hover, drag, or pointer-only interaction | Accessibility review |
| K-15 | Required keyboard shortcuts work and have visible equivalents | Browser test |
| K-16 | No single-key shortcut accepts/rejects/publishes/ends/completes/deletes | Static/keyboard test |
| K-17 | Zero serious or critical axe-core findings on all primary views/profiles/states | Axe matrix |
| K-18 | Light/dark visual baselines reviewed for populated, empty, stale, conflict, import, recovery, Client, Reviewer, and Practice Mode states | Visual evidence |
| K-19 | No oversized hero, decorative dashboard, or legacy equal-weight horizontal app tabs are introduced | Screenshot/static review |
| K-20 | Progress and next-work copy contain no hidden score/readiness/risk/compliance semantics | Content/domain test |

### L. History, checkpoints, Undo/Redo, and recovery

| ID | Requirement | Pass evidence |
|---|---|---|
| L-01 | Migration creates named checkpoint/history | Exact assertions |
| L-02 | Start, Pause, and End create named checkpoints/history | Session matrix |
| L-03 | Major Workshop apply creates named checkpoint/history | Import assertions |
| L-04 | Position acceptance/supersession creates history and checkpoint where specified | Exact assertions |
| L-05 | Candidate publication and target receipt append meaningful history | Cross-domain assertions |
| L-06 | Undo/Redo plan/version commands remains valid | Matrix |
| L-07 | Undo/Redo session Start/Pause/Resume/End/Complete remains valid and preserves one-active invariant | Matrix |
| L-08 | Undo/Redo capture-family commands remains valid | Matrix |
| L-09 | Undo/Redo position acceptance/supersession remains valid | Matrix |
| L-10 | Undo/Redo Workshop apply/conversion remains valid | Matrix |
| L-11 | Undo/Redo target publication remains cross-domain valid | Matrix |
| L-12 | Encrypted recovery after each major command restores exact valid state | Recovery matrix |
| L-13 | Recovery never restores duplicate active sessions, orphan refs, conflicting current positions, or partial imports | Negative recovery fixtures |
| L-14 | Audit events remain after Undo/Redo and identify reversal | History assertions |
| L-15 | Restore checkpoint previews exact effects and validates before replacement | Browser/domain test |

### M. Scale and resilience

| ID | Requirement | Pass evidence |
|---|---|---|
| M-01 | Validate exactly 110 requirement refs and all review families for one full cycle | Count/ref/hash assertions |
| M-02 | Validate 100 review cycles / 11,000 Requirement Reviews within limits | Count/ref/hash assertions |
| M-03 | Validate 50,000 claims, observations, questions, gaps, recommendations, or actions at family limits | Per-family bounded fixtures |
| M-04 | Validate 100,000 Evidence reviews or publication receipts at limits | Count/ref/hash assertions |
| M-05 | Validate 1,000 sessions and 500 plan versions while preserving one-active invariant | Boundary fixtures |
| M-06 | Reject over-limit batch before mutation | Project hash assertion |
| M-07 | Reject ref/dependency traversal depth >64 | Negative fixture |
| M-08 | Search/filter/profile projection remains semantically correct at scale | Deterministic visible-result/count tests |
| M-09 | Save/reopen/recovery preserves large valid synthetic project | Persistence test |
| M-10 | Truncated/corrupt/partial large project rejects without replacing valid state | Negative persistence tests |
| M-11 | Practice Mode remains functionally usable with a 110-requirement plan | Browser workflow test; no elapsed-time-only promotion gate |
| M-12 | Large Workshop preview remains bounded and non-mutating | Package scale test |

### N. Non-regression and explicit boundaries

| ID | Requirement | Pass evidence |
|---|---|---|
| N-01 | Engagement v1 behavior remains unchanged | Existing domain/browser tests |
| N-02 | Evidence v1 reference-only originals/revisions/relink behavior remains unchanged | Existing tests |
| N-03 | Pre-Engagement v1 behavior remains unchanged | Existing tests |
| N-04 | Interview Sessions v1 lifecycle, non-disclosure, and recovery remain unchanged | Existing tests |
| N-05 | Scope v1 objects/decisions/diagrams/imports/projections remain unchanged | v0.6 regression matrix |
| N-06 | Current project/envelope kinds remain `l2g_project_v1` and `l2g_encrypted_project_v1` `1.0` | Static/persistence tests |
| N-07 | Existing stable package contracts and registry remain unchanged | Contract diff check |
| N-08 | Control Center, DocConverter, Scoper, Workshop, Builder/Merger, and SSP exact current routes remain green | Shared Playwright/RG-4/current-suite workflows |
| N-09 | Workshop v79.1 remains independently distributable | Exact materializer/runtime/ZIP/hash tests |
| N-10 | v0.7 introduces no formal assessment, assessor, authentication, signature, chain of custody, applicability, Met/Not Met, readiness, compliance, risk, scoring, certification, Evidence sufficiency, implementation effectiveness, or assessment outcome | Static/schema/content/browser assertions |
| N-11 | Production/client/FCI/CUI authorization remains false in pointer/release/report | Metadata assertions |
| N-12 | Client profile remains presentation only; no curated export is introduced | Capability/content assertion |
| N-13 | Original Evidence and workbook bytes remain outside `.l2g` | Serialized project scan |
| N-14 | No cloud/network/telemetry/audio/video/transcription/AI functionality is introduced | Static/browser zero-network tests |

## Required browser workflows

1. Empty migrated Practice Review orientation with exact 110-requirement catalog loaded and no inferred review records.
2. Create, edit, freeze, and version a review plan.
3. Start Practice Mode for a 12-requirement plan.
4. Capture participant claim, Advisor observation, Evidence review, question, gap observation, recommendation, action, blocker, responsibility discussion, and provider follow-up as separate families.
5. Pause at requirement 7, close/reopen through encrypted recovery, review stale diagnostics, and resume at requirement 7 without duplicates.
6. End session and process the full post-session queue.
7. Create a qualified Practice Review position, then change a basis claim/Evidence/Scope ref and observe explicit stale state.
8. Reviewer Concur, Concur with changes, Return, and Reject without formal assessment or target publication.
9. Import Workshop State 1.0 with same-requirement/same-label ambiguity, reviewed subset apply, and explicit conversion.
10. Preserve source assessment-like labels only as quoted imported context.
11. Publish Evidence request and Scope question candidates through target-owned commands and receipts.
12. Review provider/shared/inherited responsibility claims alongside accepted Scope context.
13. Advisor → Client → Reviewer → Advisor rapid switch with DOM/count/focus/live-region/a11y leakage assertions.
14. Lock/unlock and encrypted save/reopen/recovery.
15. Malformed/unsupported/duplicate-key/prototype-key/oversized/path-leaking/active-content import rejection before mutation.
16. Complete primary workflow at 1440×900, 1280×720, and 1024×768.
17. Native Windows Chromium `file://` smoke for Review Queue, Practice Mode, post-session review, profile switch, and import preview.

## Required screenshots and visual states

Reviewed light and dark screenshots at supported desktop/tablet sizes for:

- empty migrated domain;
- Review Queue grouped by domain and workflow state;
- plan editor and frozen plan version;
- Practice Mode requirement with claim editor;
- Practice Mode Evidence review and stale Scope context;
- paused/resume recovery state;
- ended-pending-review/post-session queue;
- conflicting claims;
- gap observation with qualification;
- qualified position composer and stale/conflict states;
- Workshop import preview and ambiguity;
- Evidence & Requests;
- Open Items;
- Providers & Responsibility;
- Review History/version comparison;
- Advisor, Reviewer, and Client views;
- 1280×720 and 1024×768 responsive layouts;
- error states for invalid catalog, import failure, wrong passphrase, and corrupt recovery.

## Release blocker rules

The candidate is blocked if any of the following is true:

- required design record is missing, contradicted, or not merged;
- requirement catalog identity/count/fingerprints are invalid;
- claims, imported context, Advisor observations, Evidence review, gaps, recommendations, actions, blockers, responsibility discussions, provider follow-ups, or positions collapse into one record family;
- a source record automatically creates or changes a Practice Review position;
- Evidence presence/review implies sufficiency, effectiveness, implementation, Met/Not Met, readiness, or compliance;
- provider/Scope/imported context becomes implementation or responsibility authority automatically;
- End or Complete accepts/publishes records or creates assessment conclusions;
- more than one session can be in-progress/paused;
- interrupted recovery loses or duplicates drafts/position;
- source or target accepted state changes before a validated target command;
- preview or failed apply mutates governed state;
- hidden Advisor/import content appears in Client DOM, counts, search, inspector, differences, history, focus, live regions, export candidates, or accessibility tree;
- unsupported conclusion vocabulary enters authority-bearing fields;
- migration infers substantive Practice Review content;
- deterministic HTML/ZIP identity fails;
- native Windows `file://`, accessibility, zero-network, encrypted recovery, public hygiene, Workshop/current-suite/RG-4, or standalone non-regression fails;
- release metadata claims production/client/FCI/CUI authorization or unsupported conclusions;
- final metadata head differs from the fully validated unchanged head at merge time.

## Promotion sequence

1. Merge the complete v0.7 design gate.
2. Create implementation branch from the exact merged design head.
3. Implement bounded source, schemas, catalog identity, migration, adapters, UI, tests, fixtures, and packaging.
4. Keep implementation PR draft.
5. Validate candidate head with dedicated Linux/Windows, repository validation, shared Playwright, Workshop v79.1, RG-4/current-suite, inherited materializers, and every exact acceptance test.
6. Record candidate evidence, artifact identities, and digests.
7. Add pointer/release metadata only after candidate success.
8. Freeze final metadata head.
9. Re-run the complete matrix on that exact unchanged head.
10. Mark ready and merge only with expected head SHA.
11. Reconcile README/planning/roadmap/risk records and open the next bounded release design gate.

## Explicit non-claims

Passing this matrix establishes only that the synthetic v0.7 software candidate met the specified technical, authority, security, accessibility, compatibility, and governance tests. It does not authorize production, client, FCI, or CUI data and does not establish requirement applicability, implementation effectiveness, Evidence sufficiency, formal finding status, Met/Not Met, readiness, compliance, risk, scoring, certification, assessment outcome, authenticated approval, signature, or chain of custody.