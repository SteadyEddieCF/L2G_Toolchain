# L2G Integrated Suite v0.7.0 — Practice Review Threat Model

## Status

Proposed threat model for issue #143, ADR-0012, and `l2g_practice_review_v1`. It becomes implementation authority only when the complete v0.7 design package is reviewed and merged.

## Security and governance objective

Protect the integrity, provenance, confidentiality, recoverability, and authority boundaries of facilitated Practice Review records in one local/offline encrypted project while preventing:

- false attribution;
- automatic or misleading assessment conclusions;
- stale source context;
- hidden Advisor disclosure;
- malicious or ambiguous Workshop imports;
- partial cross-domain mutation;
- interrupted-session corruption;
- unsupported Evidence, Scope, provider, responsibility, or requirement conclusions;
- public-repository disclosure;
- runtime network access.

## System boundary

### In scope

- generated single-file v0.7 portable HTML;
- local browser runtime under restrictive CSP;
- encrypted `.l2g` project and IndexedDB encrypted recovery;
- `l2g_practice_review_v1` and profile-safe projection;
- requirement-catalog identity and 110 requirement refs;
- plans, plan versions, sessions, requirement reviews, claims, imported context, observations, Evidence reviews, questions, gaps, recommendations, actions, blockers, responsibility discussions, provider follow-ups, positions, candidates, and receipts;
- read-only projections from Engagement, Evidence, Scope, Pre-Engagement, and Interview Sessions;
- Workshop v79.1 and registered compatibility packages;
- source/target candidate publication;
- Advisor, Reviewer, and Client presentation profiles;
- deterministic build, SBOM, release artifacts, CI evidence, and synthetic fixtures.

### Out of scope

- authenticated user accounts or security roles;
- remote collaboration, cloud storage, email, portals, or telemetry;
- original Evidence bytes inside the project;
- audio/video capture or transcription;
- AI-generated answers, observations, recommendations, positions, or assessment conclusions;
- formal assessment, assessor identity, attestation, certification, signature, trusted timestamp, or chain-of-custody services;
- production/client/FCI/CUI authorization;
- standalone Workshop retirement;
- curated external Client export.

## Assets

### High-value integrity assets

- requirement catalog kind/version/SHA-256 and exactly 110 requirement refs;
- requirement text fingerprints;
- immutable plan versions and session position;
- exact source and basis refs;
- record-family identity and origin;
- current/historical/stale/superseded Practice Review positions;
- source/target candidate and receipt state;
- import package identity and diagnostics;
- project history, checkpoints, Undo/Redo, and recovery state;
- deterministic artifact identity and release metadata.

### High-value confidentiality assets

- raw Advisor observations and analysis;
- private participant/provider metadata;
- unreviewed claims and imported context;
- rejected, returned, or withdrawn gaps/recommendations/actions;
- internal package diagnostics and source paths;
- hidden counts, search terms, snippets, inspector state, focus targets, live-region text, and accessibility-tree content;
- decrypted project content in browser memory.

### Availability assets

- ability to save, reopen, and recover encrypted projects;
- exact session position and drafts after Pause or interruption;
- bounded behavior at 110 requirements and synthetic scale limits;
- standalone local runtime without network dependency;
- independent Workshop and current-suite routes.

## Actors

### Advisor

Trusted to create and edit permitted Practice Review records, facilitate sessions, review imports, record qualified positions, and publish candidates. Advisor mistakes or misunderstood authority remain threat sources.

### Reviewer

Trusted only for explicit review/disposition commands on eligible records. Reviewer access is a presentation/workflow profile, not authenticated authorization.

### Client participant

May view a filtered presentation and may be attributed to claims through locally asserted facilitation records. Identity is not authenticated by the application.

### Malicious or malformed package producer

Can supply crafted JSON/ZIP/workbook/package fields, duplicate keys, prototype keys, active content, oversized structures, false package identities, misleading requirement mappings, stale IDs, or conclusion-like text.

### Local endpoint user or malware

Can access an unlocked browser session, memory, downloads, IndexedDB, clipboard, screenshots, or files available under the operating-system account. Endpoint security is outside the application.

### Repository contributor

Can accidentally or intentionally place sensitive or misleading content in source, fixtures, logs, screenshots, Actions artifacts, Issues, PRs, or Releases.

## Trust boundaries

1. **External package bytes → strict parser/preview**
2. **Preview model → reviewed atomic apply command**
3. **Source domain → Practice Review target candidate**
4. **Practice Review source candidate → target-domain command/receipt**
5. **Requirement catalog → immutable requirement refs**
6. **Evidence/Scope projection → Practice Review read-only context**
7. **Advisor domain state → Reviewer/Client projection**
8. **Decrypted project state → encrypted save/recovery envelope**
9. **Source-controlled build → deterministic portable HTML/release artifacts**
10. **Synthetic fixture generation → public repository/CI surfaces**

## Threat catalog and mitigations

### T-01 — Participant or client claim becomes a Practice Review conclusion

**Attack/failure:** A statement captured during facilitation is displayed or exported as implementation fact, gap finding, Met/Not Met, or accepted position.

**Impact:** False attribution, unsupported assessment conclusion, downstream SSP or deliverable contamination.

**Mitigations:**

- separate `ImplementationClaim` family and required origin;
- claims never update `PracticeReviewPosition` automatically;
- claim-state labels remain Recorded, Confirmed locally, Disputed, Clarification needed, Withdrawn, or Superseded;
- exact version and participant/source refs;
- post-session review before conversion/publication;
- prohibited conclusion vocabulary in authority-bearing claim transformations;
- browser tests showing claim capture without position mutation.

### T-02 — Imported Workshop state escalates authority

**Attack/failure:** Imported practice records, key findings, recommendations, actions, or statuses become canonical Practice Review records without review.

**Impact:** Silent authority transfer, provenance loss, misleading conclusions.

**Mitigations:**

- strict kind/version/release/producer validation;
- imported records first become `ImportedPracticeContext`;
- explicit per-record Create context / Convert / Link / Keep separate / Reject / Return actions;
- no display-name auto-merge;
- non-mutating preview and atomic apply;
- package/source IDs retained only in provenance;
- exact no-partial-mutation and repeated-preview tests.

### T-03 — Requirement text or identity drift

**Attack/failure:** Imported Workshop text, stale catalog, changed practice IDs, or reordered records silently change the requirement being reviewed.

**Impact:** Review work mapped to the wrong requirement.

**Mitigations:**

- one exact catalog kind/version/SHA-256;
- exactly 110 unique refs;
- per-requirement text fingerprint;
- immutable plan versions;
- changed catalog/ref marks plans and reviews stale;
- no migration inference;
- exact 110-record fixtures and changed-catalog adversarial tests.

### T-04 — Evidence presence is interpreted as sufficiency or effectiveness

**Attack/failure:** A linked or reviewed Evidence record automatically changes a position or is labeled sufficient/adequate.

**Impact:** Unsupported implementation or assessment conclusion.

**Mitigations:**

- factual Evidence review states only;
- prohibited sufficient/insufficient/effective/Met terminology;
- separate Evidence review, observation, gap, and position records;
- exact Evidence revision refs;
- changed revision creates stale state;
- no automatic position or gap creation;
- content/schema/browser assertions.

### T-05 — Stale Scope context remains hidden

**Attack/failure:** A changed asset, provider, flow, responsibility decision, or boundary version is not visible during review.

**Impact:** Practice Review relies on obsolete environment context.

**Mitigations:**

- exact Scope refs in plans and records;
- source-current/stale diagnostics at plan start, resume, detail, and position composer;
- stale context blocks configured commands where material;
- explicit refresh/review; historical state retained;
- no direct Scope mutation;
- stale Scope acceptance scenarios.

### T-06 — Provider or inheritance context becomes implementation fact

**Attack/failure:** Provider authorization, contract, shared-responsibility label, or imported inheritance note automatically establishes responsibility or implementation.

**Impact:** Incorrect responsibility assignment and misleading practice position.

**Mitigations:**

- separate `ResponsibilityDiscussion` with claim-qualified values;
- accepted Scope responsibility shown separately;
- provider follow-up as question/request workflow;
- no automatic position, gap, or SSP narrative;
- source/version labels and client/provider/shared/inherited claim terminology;
- provider scenario tests.

### T-07 — Raw Advisor observations leak into Client presentation

**Attack/failure:** Raw observations appear through DOM, count, search, snippets, inspector, history, focus, live region, export candidate, or accessibility tree.

**Impact:** Sensitive disclosure and trust harm.

**Mitigations:**

- Advisor observations always Advisor-only;
- separate reviewed Client summaries;
- projection before every derived operation;
- clear editors, caches, inspector, focus, live regions, and search on profile change/lock;
- rapid profile-switch leakage matrix;
- DOM and accessibility snapshots;
- zero serious/critical axe findings.

### T-08 — Hidden counts reveal Advisor work

**Attack/failure:** Client sees that hidden gaps, rejected candidates, or private records exist through totals, progress, group counts, empty-state wording, or navigation badges.

**Impact:** Indirect disclosure.

**Mitigations:**

- counts and progress computed from projected records only;
- no server/global aggregate reused across profiles;
- Client-specific empty states;
- tests with hidden-only records and zero visible counts;
- accessibility/live-region count checks.

### T-09 — Interrupted session loses or duplicates drafts

**Attack/failure:** Browser close, crash, lock, or recovery creates duplicate claims/observations or loses exact requirement position.

**Impact:** Corrupt or incomplete facilitated record.

**Mitigations:**

- at most one active/paused session;
- command IDs and idempotent recovery handling;
- Start/Pause/End named checkpoints;
- encrypted IndexedDB recovery;
- exact requirement position/editor family/draft refs;
- prospective whole-project validation before commit;
- interruption at every capture family and repeated-resume tests.

### T-10 — End or Complete is mistaken for approval

**Attack/failure:** Ending a session accepts records or shows review/compliance completion.

**Impact:** Unreviewed content accepted or relied upon.

**Mitigations:**

- End → `ended-pending-review` and creates queue only;
- Complete requires explicit treatment of every queue item;
- completion copy states facilitated workflow only;
- no position creation/publishing on End/Complete;
- domain/browser non-mutation tests.

### T-11 — One generic notes field destroys record-family provenance

**Attack/failure:** Participant claims, Advisor analysis, gaps, actions, and Evidence notes share an editor and later cannot be distinguished.

**Impact:** False attribution and unsafe downstream use.

**Mitigations:**

- separate capture editors and commands;
- visible origin/visibility/resulting family before save;
- no automatic text copying between editors;
- family-specific schema validation;
- UX and browser capture tests.

### T-12 — Malicious JSON keys cause prototype pollution

**Attack/failure:** `__proto__`, `prototype`, or `constructor` modifies runtime objects.

**Impact:** Integrity compromise or code behavior manipulation.

**Mitigations:**

- strict parser rejects forbidden keys at every depth;
- no direct object spreading from untrusted parsed data;
- normalized plain records only;
- adversarial nested-key fixtures;
- failure before preview/apply mutation.

### T-13 — Duplicate keys obscure actual package meaning

**Attack/failure:** Duplicate JSON keys cause parser-dependent values.

**Impact:** Inconsistent mapping or hidden malicious content.

**Mitigations:**

- duplicate-key-aware strict parser;
- exact package-byte SHA;
- deterministic rejection diagnostics;
- tests at root and every nested structure.

### T-14 — Active HTML, SVG, URLs, or event handlers execute

**Attack/failure:** Imported text renders executable content or remote references.

**Impact:** XSS, spoofing, network access, or content disclosure.

**Mitigations:**

- inert plain-text rendering;
- strict field sanitization;
- no `innerHTML` from imported content;
- restrictive CSP with `connect-src 'none'` and no remote script/style/font;
- active-content and URL fixtures;
- zero-network browser ledger.

### T-15 — Oversized or deeply nested package exhausts memory/CPU

**Attack/failure:** Huge arrays, ZIP expansion, long strings, or deep refs freeze the local application.

**Impact:** Denial of service or lost work.

**Mitigations:**

- pre-read size caps;
- stored-ZIP and expanded-size caps;
- collection/string/ref/depth limits;
- maximum 10,000 selected apply records;
- validation before cloning/commit where possible;
- bounded scale and over-limit tests without elapsed-time-only gates.

### T-16 — Same requirement ID causes unrelated records to merge

**Attack/failure:** Two claims, gaps, actions, or provider records under one requirement are treated as the same record.

**Impact:** Lost provenance and incorrect supersession.

**Mitigations:**

- requirement ID identifies requirement only;
- local opaque IDs identify record instances;
- exact imported source ID/version mapping;
- explicit Link/Keep separate;
- same-requirement/same-label ambiguity fixtures.

### T-17 — Cross-domain publication partially mutates source or target

**Attack/failure:** Candidate publication creates one side without the other or Undo orphans refs.

**Impact:** Invalid project and misleading workflow state.

**Mitigations:**

- source-owned publish command;
- target validates exact source candidate/version;
- prospective combined state validation;
- target-owned candidate and receipt;
- source mirrors only validated target state;
- atomic failure and fault injection at every stage;
- cross-domain Undo/Redo matrix.

### T-18 — Source edits manufacture target acceptance

**Attack/failure:** Practice Review edits mirrored target state to Accepted.

**Impact:** Authority bypass.

**Mitigations:**

- mirrored target state excluded from source-edit commands;
- target receipt signature consists of local exact IDs/versions and validated command, not editable text;
- semantic validator rejects unsupported source transitions;
- adversarial direct-object fixtures.

### T-19 — Reviewer concurrence is treated as formal assessment approval

**Attack/failure:** Reviewer Concur creates or is displayed as Met/compliant/approved.

**Impact:** Governance overstatement.

**Mitigations:**

- reviewer disposition separate from qualified position;
- persistent non-assessment qualification;
- no authentication/signature claim;
- no automatic target publication;
- content/browser tests.

### T-20 — Practice Review position uses unsupported conclusion language

**Attack/failure:** Advisor types Met, compliant, sufficient evidence, risk score, or certification recommendation into authority-bearing fields.

**Impact:** Unsupported formal conclusion.

**Mitigations:**

- enumerated qualified position values;
- restricted vocabulary validation in authority-bearing fields;
- source quotations may preserve external wording only as clearly labeled imported context;
- Client-safe rationale validation;
- adversarial content tests.

### T-21 — Hidden profile state remains after rapid switch

**Attack/failure:** Advisor editor, selection, inspector, search result, or focused node remains accessible after switching to Client.

**Impact:** Direct or indirect disclosure.

**Mitigations:**

- destroy and rebuild projection-derived models;
- clear transient search/index/selection/editor state;
- focus fallback to visible workspace heading or control;
- clear live-region queue;
- rapid switch and focus/a11y tests.

### T-22 — Lock leaves decrypted Practice Review content visible

**Attack/failure:** Project locks but editor/DOM/search/inspector retains content.

**Impact:** Local disclosure.

**Mitigations:**

- zeroize key/session material according to current envelope rules;
- replace app with locked shell;
- clear Practice Mode drafts, projection, search, inspector, dialogs, live regions, and clipboard helper state;
- lock/unlock browser tests.

### T-23 — Wrong passphrase or tampered envelope replaces valid state

**Attack/failure:** Failed decryption corrupts the open project or recovery entry.

**Impact:** Work loss or attacker-controlled state.

**Mitigations:**

- AES-GCM authentication;
- derive/decrypt/validate complete prospective project before replace;
- preserve current valid state on error;
- wrong-passphrase, tampered tag/ciphertext, truncated envelope, and invalid-manifest tests.

### T-24 — Migration infers review records from prior domains

**Attack/failure:** Existing Interview/Scope/Evidence/Workshop-related records become Practice Review reviews or positions automatically.

**Impact:** Unreviewed authority creation.

**Mitigations:**

- empty-domain migration only;
- exact migration history copy;
- named checkpoint;
- zero-count assertions for all substantive collections;
- no package import during migration.

### T-25 — Undo/Redo removes audit history or restores invalid session state

**Attack/failure:** Undo erases events, reopens a second active session, or orphans refs.

**Impact:** Integrity and audit failure.

**Mitigations:**

- audit events append after reversal;
- complete project validation on restore;
- one-active-session invariant;
- source/target receipt validation;
- command-family Undo/Redo matrix.

### T-26 — Public fixture or log contains client/FCI/CUI content

**Attack/failure:** Real engagement content enters repository history, screenshots, logs, artifacts, or Releases.

**Impact:** Persistent public disclosure.

**Mitigations:**

- synthetic-only fixture generators and labels;
- public-hygiene scanners;
- secret/private-path/client marker detection;
- sanitized screenshots and browser logs;
- artifact review before promotion;
- production-data authorization remains false.

### T-27 — Standalone Workshop route regresses

**Attack/failure:** Integrated adapter changes package semantics or existing current routes.

**Impact:** Broken toolchain and lost compatibility.

**Mitigations:**

- frozen route registry and exact identities;
- standalone runtime/materializer/hash non-regression;
- Workshop preview/apply/undo/SSP/workbook route tests;
- no standalone source modification in v0.7 without separate issue;
- complete current-suite and RG-4 validation.

### T-28 — MutationObserver or inherited overlay causes startup loop

**Attack/failure:** Additive UI overlays repeatedly mutate the same DOM and starve the main thread.

**Impact:** Portable runtime never becomes usable.

**Mitigations:**

- idempotent DOM enhancements;
- consistent release labels across inherited overlays;
- emitted-runtime markers;
- startup readiness tests under Linux and native Windows `file://`;
- page-error and zero-network ledgers.

### T-29 — Factual workflow progress is interpreted as readiness

**Attack/failure:** Completed/reviewed counts or progress bars resemble compliance score.

**Impact:** Misleading management or client interpretation.

**Mitigations:**

- only factual workflow categories;
- no percentage when it could imply compliance without explicit `workflow completion` label;
- persistent qualification;
- Client progress computed from Client-safe records only;
- copy and visual review tests.

### T-30 — Client-safe summary copies hidden Advisor analysis

**Attack/failure:** Summary conversion copies raw observation text or private source details.

**Impact:** Disclosure.

**Mitigations:**

- separate summary command and record;
- explicit selected source refs;
- preview with hidden-field detector;
- independent Client label/summary validation;
- source edit stales summary rather than auto-updating it.

## Abuse and misuse cases

1. Advisor bulk-imports Workshop records and selects Apply All without resolving same-requirement ambiguities.
2. Advisor records a client claim in an Advisor observation editor to avoid attribution requirements.
3. Reviewer clicks Concur and assumes it is formal assessment approval.
4. Client sees a `37 of 110 reviewed` progress display and interprets it as 34% compliant.
5. Provider FedRAMP or contract context is shown next to a practice and interpreted as implemented.
6. Evidence is linked and a user assumes the practice is satisfied.
7. Paused session recovery creates duplicate gap/action drafts.
8. A stale Scope provider responsibility decision is hidden behind a cached inspector.
9. Imported HTML includes event handlers or misleading links.
10. A user shares the `.l2g` project because Client profile looked filtered.

Each case requires explicit UX copy, validation, and browser tests rather than relying only on documentation.

## Required security acceptance evidence

- strict parser duplicate/prototype-key matrix;
- active-content and URL inertness/zero-network matrix;
- package/ZIP size, entry, expansion, string, ref, collection, and depth limits;
- requirement-catalog identity and changed-catalog tests;
- claim/observation/Evidence/position non-mutation tests;
- same-requirement/same-label ambiguity tests;
- source/target publication fault injection and Undo/Redo;
- session interruption at each lifecycle point and record family;
- wrong-passphrase/tamper/truncation/recovery tests;
- lock/projection/search/inspector/focus/live-region/a11y clearing;
- Advisor/Reviewer/Client rapid-switch leakage tests;
- Workshop v79.1 exact standalone/current-route non-regression;
- deterministic build, CSP, SBOM, public hygiene, Linux and Windows `file://`;
- complete candidate-head and unchanged-final-head evidence.

## Residual risks

- an unlocked local endpoint or user can view decrypted content;
- profiles do not authenticate identity or prevent screenshots;
- local confirmations and review positions are not signatures or external attestations;
- human users may misunderstand qualified positions despite copy and training;
- synthetic fixtures cannot prove production suitability;
- browser/device limitations may constrain very large projects despite enforced bounds;
- external package producers may provide semantically misleading but structurally valid content;
- formal assessment and curated Client distribution remain separate unresolved trust boundaries.

## Explicit non-claims

Mitigating these threats does not authorize production, client, FCI, or CUI data and does not establish authenticated identity, signature, chain of custody, formal assessment, applicability, implementation effectiveness, Evidence sufficiency, Met/Not Met, readiness, compliance, risk, scoring, certification, or assessment outcome.