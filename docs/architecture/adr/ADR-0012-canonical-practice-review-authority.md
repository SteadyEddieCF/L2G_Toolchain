# ADR-0012 — Canonical Practice Review Authority

## Status

Proposed for the L2G Integrated Suite v0.7.0 design gate under issue #143. This ADR does not authorize implementation until the complete v0.7 design package is reviewed and merged.

## Context

The promoted Integrated Suite v0.6.0 contains canonical Engagement, Evidence, Pre-Engagement, Interview Sessions, and Scope authorities. The next vertical slice must support an advisor preparing and facilitating CMMC Level 2 practice review sessions, reviewing referenced evidence, documenting claims and observations, identifying unresolved work, and preparing later SSP and deliverable workflows.

The current standalone CMMC L2 Gap Workshop Tool v79.1 already provides a validated local/offline facilitated-review workflow and stable package routes. It remains independently distributable. Its current packages, workbook routes, SSP routes, storage behavior, and operational records cannot be silently replaced or reinterpreted.

Practice Review creates a particularly high authority risk because several different facts can appear similar in a user interface:

- authoritative requirement identity and text;
- a participant or client implementation claim;
- imported Workshop context;
- a reference to Evidence;
- an Advisor observation about what was discussed or reviewed;
- a factual evidence-review state;
- an unresolved question;
- a gap observation or issue candidate;
- a recommendation;
- an action or blocker;
- provider, inheritance, or responsibility context;
- a human-recorded review position;
- a formal assessment conclusion.

Collapsing those concepts would create false attribution, unsupported conclusions, hidden authority transfer, and unsafe downstream SSP or deliverable generation.

## Decision

### 1. Add one canonical Practice Review domain

The Integrated Suite will add:

- archive path: `domains/practice-review.json`;
- schema kind: `l2g_practice_review_v1`;
- schema version: `1.0`;
- projection kind: `l2g_practice_review_projection_v1`;
- projection version: `1.0`.

The existing project kind remains `l2g_project_v1`, and the encrypted envelope remains `l2g_encrypted_project_v1` version `1.0`.

### 2. Keep authoritative requirement content outside Practice Review record ownership

Practice Review does not author or silently replace the 110 CMMC Level 2 requirement texts. Every requirement-linked record uses an immutable requirement reference containing:

- requirement identifier;
- requirement-catalog kind and version;
- text fingerprint;
- display title copied only as qualified presentation metadata;
- source provenance.

A changed requirement catalog or text fingerprint makes affected plans and reviews stale. It does not rewrite prior review history.

### 3. Practice Review owns facilitated review work records, not formal assessment authority

Practice Review owns:

- review plans and immutable plan versions;
- facilitated review sessions and session position;
- requirement-review work records;
- participant/client implementation claims;
- imported Workshop context;
- Advisor observations;
- Evidence review references and factual review states;
- unresolved questions and parking-lot items;
- Practice Review gap observations and gap candidates;
- recommendation candidates;
- action, blocker, and provider-follow-up candidates;
- responsibility and inheritance discussions;
- human-recorded Practice Review positions;
- source/target publication receipts;
- compatibility import receipts;
- profile-safe projections and factual next work.

Practice Review does not own:

- original Evidence bytes or Evidence source identity;
- accepted Scope boundary records or Scope decisions;
- participant identity or organization authority;
- authoritative SSP narratives or baselines;
- accepted cross-engagement Reviews & Actions records unless that domain accepts a candidate;
- Deliverables conclusions or rendered authority;
- formal assessment findings, assessor determinations, certification, or attestation.

### 4. Preserve distinct record families and origins

The domain must keep these concepts separate:

1. `requirement_review` — the governed work record for one requirement and review cycle;
2. `implementation_claim` — what a participant/client/imported source asserted;
3. `advisor_observation` — what the Advisor observed or inferred, clearly marked as analysis;
4. `evidence_review` — exact Evidence refs plus factual review status and notes;
5. `review_question` — an unresolved facilitation or follow-up question;
6. `gap_observation` — an Advisor-recorded discrepancy or concern, not a formal finding;
7. `recommendation_candidate` — proposed improvement or next step;
8. `action_candidate` — proposed work for a target authority;
9. `blocker` — a factual workflow blocker, not a risk score;
10. `responsibility_discussion` — claims and context about client/provider/shared/inherited responsibility;
11. `provider_follow_up` — a question or requested artifact directed toward a provider context;
12. `review_position` — a human-recorded qualified facilitation position;
13. `publication_receipt` — validated source/target transition state;
14. `compatibility_import_receipt` — package preview/apply/return evidence.

No record family silently overwrites another. A summary may reference source versions but cannot replace them.

### 5. Use qualified review positions rather than automatic assessment outcomes

Allowed Practice Review position values are workflow/facilitation states only:

- `not-recorded`;
- `implementation-described`;
- `implementation-partially-described`;
- `implementation-not-described`;
- `conflicting-claims`;
- `evidence-follow-up-needed`;
- `scope-or-responsibility-follow-up-needed`;
- `not-applicable-claim-recorded`;
- `reviewed-no-position`;
- `superseded`.

They must be visibly qualified as locally recorded Practice Review positions. They are not Met, Not Met, readiness, compliance, risk, certification, evidence-sufficiency, or assessment outcomes.

The domain and UI must reject or prevent automatic authority-bearing values such as:

- `met` / `not-met`;
- compliant / noncompliant;
- ready / not ready;
- sufficient / insufficient evidence;
- effective / ineffective implementation;
- certification recommendation;
- numeric or percentage readiness/compliance/risk scores.

Any future formal assessment domain requires a separate ADR, threat model, authenticated actor model, and acceptance matrix.

### 6. Evidence remains reference-only and evidence review remains factual

Practice Review may store immutable references to Evidence records and exact revisions. It may record factual states such as:

- not requested;
- requested;
- linked but not reviewed;
- reviewed and relevant;
- reviewed and not relevant;
- reviewed with follow-up needed;
- unavailable;
- stale source revision;
- superseded.

These states do not establish authenticity, implementation effectiveness, coverage, or sufficiency. Changed Evidence revisions make affected review records stale and require explicit re-review.

### 7. Scope remains authoritative for boundary and responsibility context

Practice Review consumes read-only Scope projections for systems, assets, providers, services, flows, boundary decisions, unknowns, responsibility context, and stale state. Practice Review may publish a Scope question or change candidate, but only Scope can accept or modify canonical Scope records.

A provider, inheritance, or responsibility statement in Practice Review remains a claim/discussion until explicitly accepted by the owning authority. Practice Review cannot infer implementation from provider presence, authorization status, contractual language, or a shared-responsibility label.

### 8. Use target-owned candidate publication

Practice Review publishes candidates through explicit source-owned commands. The target authority validates source identity/version and creates a target-owned candidate. Practice Review mirrors only validated target state through receipts.

Potential targets include:

- Evidence requests or source-link candidates → Evidence;
- Scope questions/change proposals → Scope;
- session questions → Interview/Practice Review planning;
- action/blocker/follow-up candidates → Reviews & Actions when that target is implemented;
- narrative/control-description candidates → SSP when that target is implemented;
- reviewed output candidates → Deliverables when that target is implemented.

No target acceptance is simulated before the target authority exists.

### 9. Preserve Workshop v79.1 through strict compatibility adapters

The Integrated Suite may preview and adapt these current routes without changing their registered identity:

- `l2g_workshop_state_v1` version `1.0`;
- `l2g_workbook_handoff_v1` contract release `1.7`, wire package version `1.0`;
- `l2g_workbook_merge_v1` version `1.1`;
- `l2g_ssp_handoff_v1` version `1.0`;
- `l2g_ssp_return_package_v1` version `1.0`;
- optional read-only observability, action-summary, round-trip-audit, and responsibility-overlay routes where currently registered.

Compatibility rules:

- strict duplicate-key and prototype-key rejection;
- exact kind/version/producer/traceability validation;
- non-mutating preview;
- explicit per-record treatment;
- no display-name auto-merge;
- atomic reviewed apply;
- deterministic receipt and diagnostics;
- package bytes are not retained in governed project state;
- imported Workshop operational state remains imported context until converted through explicit Practice Review commands;
- Workbook and SSP package routes retain their current authority and guardrails;
- standalone Workshop v79.1 remains independently distributable.

### 10. Preserve immutable plans and one active facilitated session

A Practice Review plan freezes:

- requirement refs and order;
- related Scope and Evidence refs at exact versions;
- selected questions/prompts;
- expected participants;
- session topics;
- source package/import refs;
- visibility/profile rules.

At most one Practice Review session may be `in-progress` or `paused` per project. Start, Pause, Resume, and End create named checkpoints and history events. Pause/recovery preserves drafts and exact position without approving, publishing, or duplicating records. End creates a post-session-review queue and does not accept conclusions.

### 11. Apply profile filtering before every derived UI operation

Advisor, Reviewer, and Client projections are produced before:

- counts;
- search indexing;
- filtering and grouping;
- render models;
- inspector and comparison models;
- history summaries;
- focus restoration;
- live-region announcements;
- export candidates;
- accessibility-tree construction.

Client projection excludes raw Advisor observations/analysis, internal diagnostics, rejected/returned/withdrawn candidates, hidden counts, private participant metadata, internal package paths, and unreviewed gaps or recommendations. Reviewer projection is read-only except explicit review/disposition commands. Profiles are not access control or safe project-distribution artifacts.

### 12. Migrate earlier projects by adding an empty domain only

Opening a valid v0.1-v0.6 project adds:

- one empty `l2g_practice_review_v1` domain;
- one domain-index entry;
- one named migration checkpoint;
- one history event.

Migration infers no requirement reviews, plans, sessions, claims, evidence-review states, observations, gaps, recommendations, actions, blockers, provider follow-ups, review positions, or conclusions.

## Consequences

### Positive

- advisors gain one integrated review workflow without collapsing authority boundaries;
- requirement-linked facilitation can consume current Scope, Evidence, intake, and Interview context;
- claims, observations, and evidence review remain attributable and reversible;
- Workshop compatibility is preserved while future SSP and Deliverables targets gain controlled inputs;
- Client and Reviewer presentation can be useful without exposing raw Advisor work;
- formal assessment functionality remains outside the release boundary.

### Costs

- more record families and explicit transitions than a flat per-practice form;
- additional stale/version handling across requirement, Evidence, Scope, and session refs;
- more demanding UX for one-at-a-time facilitation and post-session review;
- compatibility mapping must preserve Workshop semantics without copying its full implementation;
- candidate/receipt logic is required even when future target domains are not implemented.

## Rejected alternatives

### Reuse Interview Sessions as Practice Review authority

Rejected because Interview Sessions owns statements, notes, confirmations, summaries, and follow-ups, not requirement-linked review positions, Evidence review, gaps, recommendations, and cross-domain publications.

### Reuse Scope as Practice Review authority

Rejected because Scope owns the boundary and related decisions, not practice implementation claims or review work.

### Import Workshop state as authoritative Practice Review records

Rejected because it would silently transfer authority and erase origin/version distinctions.

### Store one status and notes field per requirement

Rejected because it collapses claims, evidence, observations, gaps, recommendations, actions, provider context, review state, and formal conclusions.

### Add automatic Met/Not Met or readiness scoring

Rejected because it exceeds the facilitated-review scope and creates unsupported assessment conclusions.

### Retire Workshop v79.1 during v0.7

Rejected because independent distribution, package compatibility, and regression evidence remain required throughout progressive migration.

## Validation obligations

The implementation candidate must satisfy the exact v0.7 acceptance matrix, including:

- all 110 requirement refs and text fingerprints;
- record-family and provenance separation;
- exact-version stale behavior;
- one-active-session and interrupted-session recovery;
- source/target non-mutation;
- Workshop preview/apply/return compatibility;
- malformed, duplicate-key, prototype-key, oversized, ambiguous, and active-content rejection before mutation;
- Client/Reviewer non-disclosure before all derived work;
- encrypted migration/save/reopen/recovery/Undo/Redo;
- bounded scale;
- deterministic packaging and restrictive CSP;
- Linux and native Windows `file://` browser acceptance;
- axe-core and keyboard coverage;
- zero unexpected network requests;
- complete standalone and registered-route non-regression;
- unchanged-final-head validation before promotion.

## Explicit non-claims

This ADR does not authorize production, client, FCI, or CUI data. It does not establish formal assessment authority, assessor identity, authentication, signature, chain of custody, applicability, implementation effectiveness, evidence sufficiency, Met/Not Met, readiness, compliance, risk, scoring, certification, or assessment outcome.