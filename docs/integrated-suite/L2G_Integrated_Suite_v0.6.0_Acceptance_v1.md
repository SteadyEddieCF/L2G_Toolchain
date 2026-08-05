# L2G Integrated Suite v0.6.0 — Exact Acceptance Matrix

## Status

Design acceptance record for issue #139. Implementation is not authorized until this matrix, ADR-0011, the Scope contract, UX record, threat model, and reconciled governance records are reviewed and merged.

## Release objective

Promote one bounded Scope vertical slice that adds canonical Scope authority to the v0.5 Integrated Suite without changing the authority of Engagement, Evidence, Pre-Engagement, Interview Sessions, stable standalone modules, or stable package contracts.

## Promotion identity requirements

The implementation PR must record and validate:

- exact protected-`main` baseline;
- exact design-gate merge commit;
- exact implementation candidate head;
- exact final metadata head;
- deterministic portable HTML filename and SHA-256;
- project/envelope/domain/projection kinds and versions;
- Linux and Windows artifact IDs/digests;
- dedicated v0.6, repository validation, shared Playwright, and RG-4/current-suite run IDs;
- SBOM and release-manifest identity;
- synthetic-only and production-data-unauthorized posture.

Candidate-head validation must complete before promotion metadata is added. The complete matrix must then pass again on the unchanged final metadata head before merge.

## Required release artifacts

- `apps/integrated-suite-v0.6/` source/build/test tree;
- deterministic standalone HTML candidate;
- downloadable release ZIP;
- `l2g_scope_v1` version `1.0` schema;
- `l2g_scope_projection_v1` version `1.0` schema;
- release manifest;
- compatibility manifest;
- SBOM;
- release notes;
- validation report;
- synthetic fixtures and fixture-generation sources;
- legacy encrypted migration fixtures;
- Linux and native Windows `file://` browser evidence;
- current pointer update only after candidate validation;
- planning and roadmap reconciliation after promotion.

## Test data posture

All fixtures must be synthetic, clearly qualified, and free of client-identifying content, FCI, CUI, secrets, private paths, credentials, tokens, private keys, proprietary unlicensed content, and production artifacts.

The primary reference organization may use the existing McFirecoal/McFeddy synthetic context, but every fixture must explicitly state that names and records are fictional and do not represent an assessment conclusion.

## Acceptance matrix

### A. Build, identity, and offline runtime

| ID | Requirement | Pass evidence |
|---|---|---|
| A-01 | TypeScript strict compile succeeds | `tsc --noEmit` or governed equivalent passes |
| A-02 | Deterministic build succeeds twice | Second generated HTML SHA-256 equals first |
| A-03 | Release filename/version/visible labels are v0.6.0 | Static and browser assertions |
| A-04 | Manifest/SBOM/schema identities match the candidate | Release validator passes |
| A-05 | No runtime external dependency or unexpected request | Static URL scan plus browser request ledger equals zero unexpected requests |
| A-06 | Restrictive CSP preserved | Static CSP assertion and browser operation under CSP |
| A-07 | Normal runtime opens from local HTTP and native Windows Chromium `file://` | Dedicated browser jobs pass |
| A-08 | No page errors or unexpected console errors on governed routes | Browser logs pass |
| A-09 | Public-hygiene scan passes | No client/FCI/CUI/secrets/private paths/non-synthetic fixture names/remote runtime URLs |
| A-10 | Existing v0.5 portable artifact remains deterministic and unchanged unless the v0.6 build intentionally consumes its source baseline | Exact baseline/materialization check |

### B. Schema and semantic validation

| ID | Requirement | Pass evidence |
|---|---|---|
| B-01 | Valid empty `l2g_scope_v1` validates | Positive fixture |
| B-02 | All collection IDs are unique and use correct prefixes | Positive/negative tests |
| B-03 | All cross-record refs exist and allowed families match | Negative orphan/wrong-family fixtures rejected |
| B-04 | Supersession links are reciprocal and same-family where required | Negative fixtures rejected |
| B-05 | Asset category and scope disposition remain separate | Schema/semantic tests reject overloaded or missing accepted-decision linkage |
| B-06 | Accepted category/disposition/relationship/location/responsibility requires one current accepted decision | Negative fixtures rejected |
| B-07 | Conflicting current accepted decisions for one field/version are rejected | Conflict fixture rejected before mutation |
| B-08 | Precedence-bearing dependency graph is acyclic | Cycle fixture rejected; informational allowed-cycle behavior explicitly tested if implemented |
| B-09 | Client-visible records satisfy family-specific label/summary requirements | Negative fixtures rejected or omitted from Client projection |
| B-10 | Prototype-pollution keys are rejected at every depth | `__proto__`, `prototype`, `constructor` fixtures rejected |
| B-11 | Semantic collection/string/ref/diagram/depth limits enforce inherited stricter limits | Boundary fixtures pass/fail correctly |
| B-12 | Deterministic serialization ordering is stable | Repeated serialize/hash equality |

### C. Migration and project persistence

| ID | Requirement | Pass evidence |
|---|---|---|
| C-01 | Valid v0.5 project migrates to one valid empty Scope domain | Domain/index assertions |
| C-02 | Migration creates named checkpoint and history event | Exact event/checkpoint assertions |
| C-03 | Migration infers no objects, candidates, decisions, diagrams, category, disposition, or conclusion | Exact zero-count assertions |
| C-04 | v0.1-v0.4 projects migrate through established paths then receive the same empty Scope domain | Versioned fixture matrix |
| C-05 | Invalid legacy project fails before replacement | No-mutation hash assertion |
| C-06 | Migrated project encrypts, downloads/saves, reopens, decrypts, and validates | Browser open/save/reopen workflow |
| C-07 | IndexedDB recovery preserves valid migrated Scope state | Browser recovery workflow |
| C-08 | Wrong passphrase, truncated envelope, tampered ciphertext/tag, and invalid integrity manifest are rejected | Crypto/tamper fixtures |
| C-09 | Lock clears decrypted Scope projection/search/inspector state | Browser DOM/state assertion |
| C-10 | Undo/Redo around migration and subsequent Scope commands preserves a valid project and audit events | Domain/persistence tests |

### D. Object model and separate dimensions

| ID | Requirement | Pass evidence |
|---|---|---|
| D-01 | Create/update/archive/supersede boundary | Command and persistence tests |
| D-02 | Create/update/archive/supersede system and asset | Command and persistence tests |
| D-03 | Create/update/archive/supersede provider and service | Command and persistence tests |
| D-04 | Create/update/archive/supersede location and enclave | Command and persistence tests |
| D-05 | Create/update/archive/supersede data flow | Command and persistence tests |
| D-06 | Create/update/resolve/supersede assumption and unknown | Command and persistence tests |
| D-07 | Create/link/unlink dependency with family validation | Positive/negative tests |
| D-08 | Display-name equality does not imply identity | Same-name distinct object fixture remains separate |
| D-09 | Category/disposition/relationship/location/responsibility filters and labels display separately | Browser assertions |
| D-10 | Object edits never mutate source-domain projections | Pre/post source-domain hash equality |
| D-11 | Accepted out-of-scope object cannot simultaneously appear in accepted included boundary list without explicit exception decision | Semantic rejection fixture |
| D-12 | Data classification labels remain locally/source asserted and do not create applicability or assessment conclusions | Static/content/domain assertions |

### E. Decision ledger

| ID | Requirement | Pass evidence |
|---|---|---|
| E-01 | Create and save decision draft | Domain/browser test |
| E-02 | Propose decision with exact affected versions and explicit field changes | Domain/browser test |
| E-03 | Request/record exact-version local confirmation without signature claim | Browser/content/version test |
| E-04 | Reviewer can Concur, Concur with changes, Return, or Reject only through disposition commands | Profile/action/domain tests |
| E-05 | Accept decision atomically changes only named Scope-owned fields | Exact diff assertion |
| E-06 | Modify and accept records explicit modifications and history | Domain/history assertions |
| E-07 | Reject/Return/Withdraw does not change governed object values | Pre/post object hash equality |
| E-08 | Superseding decision preserves prior accepted decision and links reciprocally | Version/history test |
| E-09 | Source/affected/dependency version drift marks decision stale | Deterministic stale test |
| E-10 | Stale decision is not automatically reversed or reaccepted | State assertion |
| E-11 | Conflicting acceptance blocks before mutation until explicit supersession/rejection/return | Negative browser/domain test |
| E-12 | Undo/Redo decision acceptance restores valid exact prior/new states without erasing audit events | Domain/persistence test |
| E-13 | Unsupported readiness/compliance/risk/score/certification/sufficiency/Met language in authority-bearing candidate fields is rejected | Adversarial fixture |

### F. Source-to-Scope candidate authority

| ID | Requirement | Pass evidence |
|---|---|---|
| F-01 | Engagement publishes candidate to Scope | Target candidate created; Engagement accepted state unchanged |
| F-02 | Evidence publishes candidate to Scope | Target candidate created; Evidence accepted state unchanged |
| F-03 | Pre-Engagement publishes candidate to Scope | Target candidate created; intake response unchanged |
| F-04 | Interview Sessions publishes candidate to Scope | Target candidate created; statements/notes/summaries unchanged |
| F-05 | Scope validates exact source candidate/version before receipt | Stale/missing source refs rejected |
| F-06 | Accept candidate creates/updates only Scope-owned records and required decision | Exact target diff |
| F-07 | Modify and accept preserves source proposal plus target modifications | Provenance/history assertions |
| F-08 | Reject and Return create mirrored source workflow receipt without source-content mutation | Cross-domain assertions |
| F-09 | Source cannot manufacture Scope acceptance by editing mirrored state | Validator/command rejection |
| F-10 | Withdrawal/supersession remains auditable | Domain/history test |
| F-11 | Cross-domain Undo cannot orphan source/target refs | Undo validation matrix |

### G. Scoper compatibility adapters

| ID | Requirement | Pass evidence |
|---|---|---|
| G-01 | Recognize `l2g_scope_context_v1` version `1.0` | Positive preview fixture |
| G-02 | Recognize `l2g_scope_return_package_v1` version `1.0` | Positive preview fixture |
| G-03 | Unsupported kind/version rejects before mutation | No-mutation hash assertion |
| G-04 | Duplicate keys/prototype keys reject before preview/apply | Parser tests |
| G-05 | Package SHA-256, producer, traceability, and diagnostics are displayed in preview | Browser assertion |
| G-06 | Package bytes are not retained in project | Serialized project scan |
| G-07 | Assets/providers/flows/unknowns/decision-ledger proposals stage as low-authority records/candidates | Preview/apply assertions |
| G-08 | Pre-workshop question package stages Session Planner candidates, not a second Scope question authority or live agenda items | Cross-domain test |
| G-09 | Same-name/ambiguous records require explicit treatment | Browser apply disabled until resolved |
| G-10 | Apply Reviewed Subset creates only selected records | Exact selected/unselected assertions |
| G-11 | Modify and Apply records modifications and provenance | Receipt/history assertions |
| G-12 | Reject/Return leaves governed Scope objects unchanged | Hash assertion |
| G-13 | Fault at every apply stage produces no partial mutation or false applied receipt | Fault-injection matrix |
| G-14 | Local-path leakage in path-bearing fields is detected field-wise without broad opaque-text false positives | Positive/negative path fixtures |
| G-15 | Active HTML/script/SVG/event content renders as inert text or rejects according to contract | Browser/XSS tests |
| G-16 | Compatibility export emits registered `l2g_scope_return_package_v1` `1.0`, zero practice records, stable guardrails, and no unsupported internal fields | Export schema/hash tests |
| G-17 | Repeated preview/export is idempotent and does not mutate source package object | Repeated hash/count equality |
| G-18 | Existing standalone Scoper v3.12 runtime/hash/materialization and current Workshop preview route remain unchanged | Exact standalone/route regression |

### H. Diagrams

| ID | Requirement | Pass evidence |
|---|---|---|
| H-01 | Create manual draft diagram referencing existing records | Domain/browser test |
| H-02 | Deterministic generation from selected accepted/proposed records creates draft only | Stable repeated output; no object/decision mutation |
| H-03 | Node/edge creation without governed ref produces explicit proposal placeholder or rejection | Domain/browser assertion |
| H-04 | Editing layout changes diagram presentation only | Object/decision hashes unchanged |
| H-05 | Selecting node/edge opens referenced object/flow/dependency in inspector | Browser test |
| H-06 | Approve as representation requires accepted diagram decision and exact versions | Domain/browser test |
| H-07 | Changing referenced version marks diagram stale with exact diagnostics | Stale test |
| H-08 | Refresh creates new version/supersession rather than silently overwriting approved diagram | Version/history assertions |
| H-09 | Accessible text alternative lists only projection-permitted objects/relationships/crossings/placeholders | Advisor/Reviewer/Client a11y tests |
| H-10 | Client View excludes unreviewed/Advisor-only diagrams and hidden nodes/labels/counts | DOM/canvas-model/a11y leakage tests |
| H-11 | Diagram node/edge limits enforce before mutation | Oversized fixtures |
| H-12 | Pan/zoom/fit and keyboard object navigation work at desktop and tablet targets | Browser usability tests |

### I. Profile projections and non-disclosure

| ID | Requirement | Pass evidence |
|---|---|---|
| I-01 | Advisor projection includes full permitted Scope context | Projection test |
| I-02 | Reviewer projection is object-read-only except explicit disposition commands | Projection/action test |
| I-03 | Client projection includes only explicit Client-visible records satisfying labels/summaries | Projection test |
| I-04 | Advisor analysis absent from Client DOM and serialized UI models | Leakage test |
| I-05 | Rejected/returned/withdrawn candidates absent from Client surfaces | Leakage test |
| I-06 | Internal provenance/diagnostics/private participant metadata absent from Client surfaces | Leakage test |
| I-07 | Hidden object labels and hidden counts absent from Client search, summaries, filters, and live regions | Leakage test |
| I-08 | Inspector and difference models are rebuilt from new projection | Rapid switch test |
| I-09 | Focus restoration never lands on hidden prior-profile element | Keyboard/profile test |
| I-10 | Accessibility tree contains no hidden Advisor record text | Axe/accessibility snapshot assertion |
| I-11 | Client diagram text alternative is generated from Client-safe projection | A11y leakage test |
| I-12 | Persistent qualification states profile is not access control or distribution approval | Content assertion |

### J. UX and accessibility

| ID | Requirement | Pass evidence |
|---|---|---|
| J-01 | Scope subnavigation contains exactly Boundary, Systems & Assets, Providers & Services, Data Flows, Decisions, Diagrams | Browser assertion |
| J-02 | Default Boundary list/detail/inspector workflow is usable at 1440×900 and 1280×720 | Screenshot and interaction tests |
| J-03 | Tablet landscape uses one-pane/inspector drawer without primary horizontal page scrolling | 1024×768 test |
| J-04 | Unknowns appear contextually and publish question candidates to Session Planner | Browser/cross-domain test |
| J-05 | Decision composer previews exact atomic effects before acceptance | Browser assertion |
| J-06 | All primary controls reachable by keyboard with visible focus | Keyboard test |
| J-07 | No primary action relies on color, hover, drag, or pointer-only interaction | Accessibility review |
| J-08 | Diagram has keyboard/list equivalent and reachable text alternative | Browser/a11y test |
| J-09 | Zero serious or critical axe-core findings on all primary Scope views/profiles | Axe matrix |
| J-10 | Light/dark visual baselines reviewed for populated and empty/error/stale states | Visual regression evidence |
| J-11 | No oversized hero or legacy horizontal tab shell is introduced | Screenshot/static review |
| J-12 | Factual next-work labels contain no hidden score/readiness/risk terminology | Content/domain test |

### K. History, checkpoints, Undo/Redo, and recovery

| ID | Requirement | Pass evidence |
|---|---|---|
| K-01 | Major import apply creates named checkpoint and history event | Exact assertion |
| K-02 | Accepted boundary decision creates named checkpoint and history event | Exact assertion |
| K-03 | Candidate, object, dependency, decision, diagram commands append meaningful history | Domain test |
| K-04 | Undo/Redo object creation/update/archive/supersession remains valid | Matrix |
| K-05 | Undo/Redo candidate acceptance/rejection/return remains cross-domain valid | Matrix |
| K-06 | Undo/Redo decision acceptance/supersession remains valid | Matrix |
| K-07 | Undo/Redo diagram creation/refresh/approval remains valid | Matrix |
| K-08 | Encrypted recovery after each major command restores exact valid Scope state | Recovery matrix |
| K-09 | Recovery never restores an invalid conflicting-decision or orphan-ref state | Negative recovery fixtures |
| K-10 | Audit events remain after Undo/Redo and identify reversal | History assertion |

### L. Scale and resilience

| ID | Requirement | Pass evidence |
|---|---|---|
| L-01 | Validate and round-trip 10,000 assets | Count/ref/hash assertions; no elapsed-time-only gate |
| L-02 | Validate and round-trip 20,000 flows and 50,000 dependencies within inherited project limits | Count/ref/hash assertions |
| L-03 | Validate 20,000 decisions/candidates with deterministic ordering | Count/hash assertions |
| L-04 | Validate 500 diagrams and max-node/edge boundary fixtures | Boundary assertions |
| L-05 | Reject over-limit batch before mutation | Hash assertion |
| L-06 | Reject dependency depth >64 and precedence cycle | Negative fixtures |
| L-07 | Search/filter/profile projection remains semantically correct at scale | Deterministic result/count tests |
| L-08 | Save/reopen/recovery preserves large valid synthetic project | Persistence test |
| L-09 | Truncated/corrupt/partial large project rejects without replacing valid state | Negative persistence tests |

### M. Non-regression and boundaries

| ID | Requirement | Pass evidence |
|---|---|---|
| M-01 | Engagement v1 behavior remains unchanged | Existing domain tests |
| M-02 | Evidence v1 behavior and reference-only originals remain unchanged | Existing tests |
| M-03 | Pre-Engagement v1 behavior remains unchanged | Existing tests |
| M-04 | Interview Sessions v1 lifecycle, Client note non-disclosure, and recovery remain unchanged | Existing browser/domain tests |
| M-05 | Current project/envelope kinds remain `l2g_project_v1` and `l2g_encrypted_project_v1` `1.0` | Static/persistence tests |
| M-06 | Existing stable package contracts remain unchanged | Registry/contract diff check |
| M-07 | Control Center, DocConverter, Scoper, Workshop, Builder/Merger, and SSP current exact routes remain green | Shared Playwright/RG-4/current-suite workflows |
| M-08 | Standalone Scoper v3.12 remains independently distributable | Exact materializer/runtime/ZIP/hash checks |
| M-09 | v0.6 introduces no Practice Review finding, SSP narrative, Deliverable, readiness, compliance, risk, score, certification, sufficiency, implementation, or Met/Not Met conclusion | Static/schema/content/browser assertions |
| M-10 | Production/client/FCI/CUI authorization remains false in pointer/release/report | Metadata assertions |

## Required browser workflows

1. Empty migrated Scope orientation.
2. Reviewed Scoper return preview and subset apply.
3. Same-name distinct asset ambiguity resolution.
4. Source candidate publication from each implemented source domain.
5. Asset category/disposition decision creation and acceptance.
6. Conflict block and explicit supersession.
7. Unknown publication to Session Planner without live agenda insertion.
8. Provider/service/responsibility context without practice conclusion.
9. Data-flow creation and boundary-crossing review.
10. Diagram generation, layout editing, accessible alternative, approval, stale detection, and refresh.
11. Advisor → Client → Reviewer → Advisor rapid profile switching with leakage assertions.
12. Encrypted save/reopen, lock/unlock, IndexedDB recovery, Undo/Redo, and legacy migration.
13. Malformed/unsupported/oversized/path-leaking/active-content import rejection before mutation.
14. Native Windows Chromium `file://` smoke for the primary Scope workflow.

## Required screenshots/visual states

Reviewed light and dark screenshots at supported desktop/tablet sizes for:

- empty Boundary view;
- populated Boundary with accepted/proposed/unknown states;
- Systems & Assets grouped list and detail;
- Providers & Services detail;
- Data Flow path detail;
- Decision composer and conflict state;
- Decisions accepted/stale/superseded queue;
- Diagram draft, approved, and stale states;
- import preview ambiguity and failure;
- Client presentation with approved diagram;
- Reviewer return state;
- 1280×720 and 1024×768 responsive layouts.

## Release blocker rules

The candidate is blocked if any of the following is true:

- required design record is missing or contradicted;
- accepted Scope state can be changed without a Scope-owned decision where required;
- source-domain state changes before a validated target command;
- preview or failed apply mutates governed state;
- hidden content appears in Client DOM, search, counts, inspector, differences, history, focus, live regions, or accessibility tree;
- diagram creates or silently changes object/decision authority;
- migration infers Scope content;
- deterministic build or exact SHA identity fails;
- native Windows `file://`, accessibility, zero-network, encrypted recovery, public hygiene, or current-suite non-regression fails;
- release metadata claims production/client/FCI/CUI authorization or unsupported conclusions;
- final metadata head differs from the fully validated unchanged head at merge time.

## Promotion sequence

1. Merge the design gate.
2. Create implementation branch from the exact merged design head.
3. Implement bounded v0.6 source, schema, migration, adapters, UI, tests, and packaging.
4. Keep implementation PR draft.
5. Validate candidate head with dedicated Linux/Windows, repository validation, Playwright, RG-4/current-suite, and all exact acceptance tests.
6. Record candidate evidence and artifact identity.
7. Add pointer/release metadata only after candidate success.
8. Freeze final metadata head.
9. Re-run the complete matrix on that exact head.
10. Mark ready and merge only with expected head SHA.
11. Reconcile README/planning/roadmap and open the next bounded release design gate.

## Explicit non-claims

Passing this matrix establishes only that the synthetic v0.6 software candidate met the specified technical and governance tests. It does not establish production suitability, client-data authorization, FCI/CUI authorization, technical accuracy of a real boundary, authenticity, evidence sufficiency, implementation, readiness, risk, compliance, certification, scoring, assessment outcome, or Met/Not Met.