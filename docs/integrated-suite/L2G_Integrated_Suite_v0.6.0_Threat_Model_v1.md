# L2G Integrated Suite v0.6.0 — Scope Threat Model

## Status

Design threat model for issue #139. It becomes implementation authority only when the complete v0.6 design package is reviewed and merged.

## Security posture

v0.6 remains:

- local, offline, no-install, and no telemetry;
- one generated HTML runtime with no runtime network dependency;
- one encrypted `.l2g` project and encrypted bounded browser recovery;
- synthetic-only and unauthorized for production, client, FCI, or CUI data;
- original-evidence-external by default;
- profile-sensitive presentation rather than access control;
- compatible with independently distributable stable standalone modules and contracts.

Encryption protects the project at rest but does not authorize sensitive-data use, establish authenticated identity, prevent disclosure after unlock, or make Client View a security boundary.

## Security objectives

1. Only Scope-owned commands can establish or change authoritative Scope state.
2. Imported/source/session content cannot silently escalate into accepted boundary decisions.
3. Asset category, disposition, relationship, responsibility, lifecycle, review, visibility, and currency remain semantically distinct.
4. Client projections contain no Advisor-only content, hidden counts, private provenance, or stale cached material.
5. Diagrams cannot create objects, decisions, or unsupported conclusions.
6. Stable Scoper package import rejects malformed, tampered, unsupported, ambiguous, oversized, or path-leaking content before mutation.
7. Exact-version decisions and diagrams become stale rather than silently following changed sources.
8. Encrypted persistence, recovery, migration, Undo/Redo, history, and checkpoints preserve domain integrity.
9. Public repository and CI surfaces contain only synthetic, sanitized content.
10. No feature introduces a runtime network path, remote dependency, secret, or executable imported content.

## Protected assets

- encrypted project envelope and integrity metadata;
- Scope domain records and exact versions;
- accepted decisions and supersession history;
- source-domain candidate references and target receipts;
- imported package identity, provenance, and diagnostics;
- profile-safe projections;
- Advisor-only analysis and internal rationale;
- Client-visible labels, summaries, and approved representations;
- diagram object/version references and accessible alternatives;
- unknowns, assumptions, dependencies, and blocking state;
- command journal, checkpoints, Undo/Redo, migration history, and recovery state;
- deterministic release source, schemas, manifest, SBOM, validation records, and hashes;
- public repository hygiene and synthetic-only fixtures.

## Trust boundaries

### TB-1 — Locked versus unlocked project

A passphrase unlocks complete project content for the local holder. Presentation profiles do not limit the unlocked holder’s technical access.

### TB-2 — Runtime source versus imported package

Imported JSON/ZIP/package content is hostile until strict parsing, identity, limits, provenance, and preview validation complete.

### TB-3 — Source domains versus Scope authority

Engagement, Evidence, Pre-Engagement, and Interview Sessions may publish candidates only. Scope owns target decisions and record mutation.

### TB-4 — Scope objects versus Scope decisions

Objects describe entities and relationships; accepted decisions govern authoritative inclusion, category, relationship, responsibility, and approval fields.

### TB-5 — Scope records versus diagram representation

A diagram references exact governed versions. Drawing content cannot become independent authority.

### TB-6 — Advisor/Reviewer content versus Client projection

Client content is constructed from a filtered projection before all downstream calculation and UI work.

### TB-7 — Browser session state versus portable project state

Selections, search indexes, query history, focus targets, File associations, diagram viewport, and transient editor state are not automatically portable governed content.

### TB-8 — Public repository/CI versus engagement data

Repository, Issues, PRs, logs, screenshots, artifacts, and releases must remain synthetic and sanitized.

## Threat actors and failure sources

- accidental advisor action;
- misunderstood imported context;
- malicious or malformed package producer;
- compromised or stale source package;
- local holder switching to Client View without clearing Advisor state;
- reviewer acting outside the assigned disposition command;
- corrupted project or recovery record;
- implementation defect in validation, projection, history, or migration;
- public contributor or automation introducing client-identifying or secret content;
- unsupported browser/runtime behavior;
- user misunderstanding local confirmation or diagram approval as stronger authority.

## Threats and mitigations

### T-01 — Imported context becomes accepted Scope truth

**Scenario:** A `l2g_scope_context_v1` or `l2g_scope_return_package_v1` record is applied directly to accepted object fields.

**Impact:** False boundary, category, responsibility, or flow treatment.

**Mitigations:**

- strict preview before apply;
- imported content maps to context, staged objects, unknowns, questions, or candidates;
- accepted authoritative values require a Scope decision;
- atomic command validation;
- package receipt and source-domain reference;
- non-mutation tests for preview and failed apply.

### T-02 — Asset category is mistaken for boundary inclusion

**Scenario:** A specialized/security-protection/contractor-risk-managed label is used as both category and final disposition.

**Impact:** Semantically invalid Scope and misleading downstream work.

**Mitigations:**

- separate `asset_category` and `scope_disposition` fields;
- accepted values require explicit decision refs;
- UI presents dimensions separately;
- schema/semantic invariants reject overloaded fields;
- migration infers no category/disposition.

### T-03 — Latest source or note silently overrides accepted decision

**Scenario:** A newer intake answer, Interview statement, provider note, or Evidence-derived record changes an accepted boundary field.

**Impact:** Hidden authority transfer and loss of auditability.

**Mitigations:**

- exact-version source refs;
- source changes mark decision currency `stale`;
- explicit compare and supersede workflow;
- no timestamp-based automatic winner;
- prior decision/version remains immutable in history.

### T-04 — Conflicting accepted decisions coexist

**Scenario:** In-scope and out-of-scope decisions are both accepted for the same record field/version.

**Impact:** Internally contradictory boundary.

**Mitigations:**

- conflict detection before mutation;
- one current accepted decision per governed field/version unless atomic supersession occurs;
- explicit return/reject/supersede actions;
- decision-ledger conflict queue;
- adversarial concurrency/Undo tests.

### T-05 — Source candidate mutates another domain or manufactures a target receipt

**Scenario:** Scope acceptance edits source records or source state is updated without a validated target candidate/decision.

**Impact:** Broken domain authority and false workflow history.

**Mitigations:**

- cloned projections only;
- target-owned candidate creation and receipt validation;
- Scope commands mutate only Scope state;
- source mirroring occurs through source-domain receipt command;
- cross-domain non-mutation hash tests.

### T-06 — Diagram creates or changes authority

**Scenario:** Drawing a node/edge or importing a layout creates objects or accepted flows.

**Impact:** Ungoverned Scope records and misleading picture-led decisions.

**Mitigations:**

- nodes/edges reference existing object/flow/dependency IDs or proposal placeholders;
- object creation requires an explicit candidate/object command;
- layout is presentation state only;
- diagram approval is approval as representation at exact versions;
- generated diagrams are drafts;
- diagram-source non-mutation tests.

### T-07 — Stale diagram appears current

**Scenario:** Referenced object/decision versions change after diagram approval.

**Impact:** Client/advisor relies on outdated boundary representation.

**Mitigations:**

- exact-version refs;
- deterministic stale diagnostics;
- visible stale qualification in every profile where diagram is visible;
- explicit refresh/retain/supersede;
- approved historical version preserved;
- Client projection excludes unqualified stale detail unless explicitly approved as plain-language context.

### T-08 — Diagram text alternative leaks hidden records

**Scenario:** Canvas is filtered for Client View but the accessibility text lists Advisor-only nodes or hidden counts.

**Impact:** Sensitive disclosure through accessibility tree.

**Mitigations:**

- build diagram and text alternative from the already filtered projection;
- discard cached alternative on profile/project/lock change;
- DOM and accessibility-tree leakage tests;
- no hidden record labels in live regions.

### T-09 — Client View leaks Advisor-only content during profile switch

**Scenario:** Inspector, search results, comparison model, focus target, history summary, or cached count survives the switch.

**Impact:** Advisor analysis, rejected candidates, private metadata, or source internals become visible.

**Mitigations:**

- clear prior projection and all derived/cached UI state before new projection construction;
- profile-first filtering before calculation/search/render/inspector/diff/history/focus/live-region/a11y;
- persistent qualification that profile is not access control;
- repeated rapid-switch leakage tests in light/dark and responsive views.

### T-10 — Reviewer directly edits governed object state

**Scenario:** Reviewer uses a general editor rather than a disposition command.

**Impact:** Bypassed Advisor/decision workflow and untraceable changes.

**Mitigations:**

- Reviewer projection read-only for objects;
- only explicit Concur, Concur with changes, Return, Reject commands;
- any accepted change becomes a decision version with history;
- UI/action and domain-command authorization tests.

### T-11 — Locally asserted confirmation is mistaken for signature or broad approval

**Scenario:** A Client confirmation is displayed as authenticated consent to the full boundary.

**Impact:** Legal/governance overstatement.

**Mitigations:**

- exact record/version binding;
- locally asserted confirmer/method/timestamp;
- visible non-signature qualification;
- source edit stales confirmation;
- no broad engagement-approval language;
- content and stale-confirmation tests.

### T-12 — Duplicate or ambiguous import auto-merges records

**Scenario:** Same display name, hostname, provider name, or fuzzy match is treated as identity.

**Impact:** Distinct systems/assets/providers collapse and provenance is lost.

**Mitigations:**

- opaque IDs and exact source refs;
- no auto-merge by display label;
- explicit Create, Link, Keep separate, Modify, Reject treatment;
- ambiguity blocks apply until reviewed;
- duplicate-name adversarial fixtures.

### T-13 — Prototype pollution or active content in package

**Scenario:** JSON contains `__proto__`, `prototype`, `constructor`, active HTML/script, formula-like payload, or executable URLs.

**Impact:** State corruption, XSS, or unsafe rendering.

**Mitigations:**

- duplicate/prototype-key rejection at every depth;
- plain-text-only fields and safe DOM construction;
- restrictive CSP and no remote loads;
- no imported HTML/SVG/script execution;
- URL/protocol allowlist or plain-text treatment;
- adversarial parser/browser tests.

### T-14 — Path, secret, or private metadata leakage

**Scenario:** Imported filenames/path-bearing fields or fixtures contain local paths, credentials, tokens, private keys, or client identifiers.

**Impact:** Public or Client disclosure.

**Mitigations:**

- field-aware path detection;
- sanitization and Client labels;
- secret/token/private-key public-hygiene scans;
- package rejection or explicit sanitized mapping;
- synthetic-only repository/CI artifacts;
- no package bytes retained.

### T-15 — Oversized relationship graph or dependency cycle causes failure

**Scenario:** Large import exhausts browser memory or precedence-bearing cycles break next-work/diagram traversal.

**Impact:** Denial of service, corruption, or infinite traversal.

**Mitigations:**

- semantic collection and field limits beneath inherited archive limits;
- bounded traversal depth and visited-set cycle detection;
- precedence-bearing cycle rejection;
- preview size/count diagnostics;
- large synthetic and cycle fixtures;
- no elapsed-time-only acceptance criteria.

### T-16 — Partial import or decision mutation

**Scenario:** Some objects are written before a later validation error.

**Impact:** Orphan records, invalid refs, false receipt.

**Mitigations:**

- construct and validate cloned prospective state;
- single atomic ProjectStore command;
- append receipt/history only after validation;
- failure leaves byte-equivalent governed state;
- fault-injection tests across every apply stage.

### T-17 — Undo/Redo breaks cross-record invariants

**Scenario:** Undo removes an object but leaves decision, diagram, or dependency refs.

**Impact:** Invalid project and misleading history.

**Mitigations:**

- command snapshot includes complete affected Scope state;
- validate restored prospective state;
- cross-domain source records never included in Scope Undo;
- audit event remains even when state is undone;
- object/decision/diagram/candidate Undo/Redo matrix.

### T-18 — Migration infers Scope content

**Scenario:** Existing Engagement, Evidence, intake, or Interview content is automatically classified into Scope during v0.5-to-v0.6 migration.

**Impact:** Unreviewed authoritative boundary.

**Mitigations:**

- migration adds an empty valid domain only;
- named checkpoint/history event;
- exact no-inference assertions;
- v0.1-v0.5 migration fixtures;
- browser open/save/reopen migration test.

### T-19 — Browser recovery restores conflicting domain state

**Scenario:** Recovery state contains conflicting accepted decisions, missing refs, or stale domain index.

**Impact:** Corrupted Scope authority after crash.

**Mitigations:**

- decrypt then fully validate before replace;
- exact domain index and integrity manifest checks;
- reject invalid recovery without overwriting current valid state;
- named recovery history;
- corruption/tamper/wrong-passphrase/partial-record fixtures.

### T-20 — Runtime unexpectedly uses network

**Scenario:** diagram library, font, icon, schema, or package validation fetches remote content.

**Impact:** Offline failure and data disclosure.

**Mitigations:**

- all runtime code/assets bundled;
- `connect-src 'none'` and restrictive CSP;
- no remote fonts/images/scripts;
- zero unexpected request browser assertions under HTTP and `file://`;
- SBOM and static URL scan.

### T-21 — Imported classification label is treated as verified CUI determination

**Scenario:** `cui-asserted` on a flow is displayed as an authoritative data-classification determination.

**Impact:** False boundary and compliance conclusion.

**Mitigations:**

- labels explicitly locally asserted/source-derived;
- accepted Scope decision still required for boundary treatment;
- no content storage;
- plain-language qualification;
- no automatic applicability or control conclusion.

### T-22 — Provider inheritance context becomes implementation conclusion

**Scenario:** provider service, contract, authorization, or inheritance claim is displayed as proof the client meets a requirement.

**Impact:** Unsupported Practice Review/SSP/assessment conclusion.

**Mitigations:**

- Scope responsibility/inheritance fields are context only;
- no practice/objective/status fields in Scope contract;
- unsupported conclusion vocabulary rejected in authority-bearing fields;
- downstream targets require separate target-owned review.

### T-23 — Public repository contamination

**Scenario:** tests, screenshots, logs, fixtures, PR text, or release artifacts contain client data, FCI/CUI, private paths, secrets, or proprietary content.

**Impact:** Persistent public disclosure.

**Mitigations:**

- synthetic named organizations and data only;
- path/secret/client-identifier scans;
- fixture manifest and synthetic qualification;
- no decrypted project logs or screenshots;
- release artifact review and public-hygiene gate.

### T-24 — Stable Scoper contract or standalone behavior regresses

**Scenario:** integrated adapter changes frozen package semantics or current standalone routing.

**Impact:** broken toolchain interoperability.

**Mitigations:**

- no Scoper runtime/contract changes in v0.6;
- registered exact kind/version mapping;
- compatibility export constrained to frozen fields and zero practice records;
- exact standalone runtime hash/materialization and route non-regression;
- preview leaves package object/bytes unchanged.

## Security controls inherited unchanged

- AES-256-GCM encrypted envelope;
- PBKDF2-SHA-256 key derivation and versioned parameters;
- strict deterministic stored ZIP parsing and integrity manifest;
- archive path, count, per-entry, expanded-size, and envelope limits;
- duplicate/prototype-key rejection;
- command journal, named checkpoints, Undo/Redo, and encrypted recovery;
- restrictive CSP and bundled runtime dependencies;
- session-only File associations;
- profile-first projection/search rules;
- deterministic build, release manifest, SBOM, SHA identity, Linux/Windows browser validation, and public-hygiene scanning.

## Required adversarial fixtures

- unsupported kind/version;
- duplicate keys at root and nested levels;
- prototype-pollution keys;
- malformed JSON and malformed stored ZIP;
- CRC/hash/integrity mismatch;
- path traversal and absolute path fields;
- active HTML/script/SVG/event-handler content;
- remote URL references;
- secret/token/private-key-like strings in forbidden fields;
- oversized collections, strings, refs, diagram nodes/edges, and dependency depth;
- same-label distinct assets/providers;
- ambiguous candidate links;
- conflicting accepted decisions;
- stale source and dependency versions;
- precedence-bearing dependency cycle;
- orphan diagram nodes/edges and stale approved diagram;
- Client-hidden label in search/count/inspector/diff/history/focus/live-region/a11y surfaces;
- wrong passphrase, truncated envelope, tampered ciphertext/tag, invalid recovery, and incomplete migration;
- compatibility package mutation detection;
- source-domain non-mutation before and after candidate disposition.

## Required validation evidence

- static security/offline/CSP scan;
- schema and semantic-validator tests;
- package parser and no-partial-mutation tests;
- source/target authority hash comparisons;
- decision conflict/stale/supersession tests;
- diagram authority/stale/text-alternative tests;
- Client leakage matrix including accessibility tree;
- encrypted persistence/recovery/tamper/migration tests;
- bounded scale and dependency-cycle tests;
- zero-network browser tests under local HTTP and native Windows `file://`;
- axe-core and keyboard tests on all primary Scope views;
- deterministic build and second-build hash equality;
- public-hygiene and exact standalone/registered-route non-regression.

## Residual risks

- A holder of the unlocked project can access complete content regardless of active profile.
- Locally asserted identities and confirmations are not authenticated.
- Synthetic scale and adversarial fixtures cannot prove suitability for real client/CUI data.
- Browser memory and file-save behavior vary by environment.
- A diagram can still be misunderstood despite qualifications; Advisor review remains required.
- SHA-256 proves byte equality only, not authenticity, relevance, currency, or sufficiency.
- Provider/inheritance context may still be misinterpreted by users; downstream domains must preserve their own authority controls.

## Explicit exclusions

This threat model does not approve production/client/FCI/CUI use, external Client distribution, cloud collaboration, authenticated identity, digital signatures, automatic CUI-boundary determination, automated classification/applicability, Practice Review findings, SSP authority, Deliverables authority, readiness, compliance, risk, scoring, certification, evidence sufficiency, implementation conclusions, Met/Not Met, or standalone Scoper retirement.