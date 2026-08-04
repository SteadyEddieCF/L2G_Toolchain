# L2G Integrated Suite v0.5.0 — Pre-Engagement and Interview Sessions Acceptance

## Purpose

This document is the exact implementation and promotion gate for L2G Integrated Suite v0.5.0. Every required criterion must pass on the unchanged final implementation head before the current release pointer changes and the implementation pull request merges.

Passing this matrix does not authorize production, client, FCI, or CUI data. It does not establish authenticated identity, electronic signature, evidence authenticity, evidence sufficiency, scope accuracy, readiness, compliance, scoring, certification, risk, implementation, or Met/Not Met.

## Baselines

- prior release: `0.4.0`;
- prior promotion PR: #132;
- prior merge: `fff6c801c101bad63455b83703f20e095308f6e7`;
- prior final reviewed head: `f86002d53cdc144b01fa2fc537ca61e6207bf107`;
- prior portable HTML SHA-256: `60c1fe78ecf1ce19fcca696f93f043aa26be3515a7bb1f3d07c3708fae8e4f09`;
- project kind: `l2g_project_v1`;
- encrypted envelope: `l2g_encrypted_project_v1` version `1.0`;
- Engagement: `l2g_engagement_v1` version `1.0`;
- Evidence: `l2g_evidence_index_v1` version `1.0`;
- compatibility baseline: `85d6e783a250b373cd4b9ea356e4c341336f9259`;
- stable inputs: `l2g_intake_package_v1`, `l2g_scope_context_v1`, and `l2g_meeting_context_v1` version `1.0`;
- governing issue: #133;
- governing architecture decision: ADR-0010.

## Release identity

- application version: `0.5.0`;
- Pre-Engagement schema/projection: `l2g_pre_engagement_v1` / `l2g_pre_engagement_projection_v1` version `1.0`;
- Interview schema/projection: `l2g_interview_sessions_v1` / `l2g_interview_projection_v1` version `1.0`;
- additive source root: `apps/integrated-suite-v0.5/`;
- portable artifact: `L2G_Integrated_Suite_Pre_Engagement_Interview_v0.5.0.html`;
- project/envelope kinds remain unchanged;
- v0.1-v0.4 source and deterministic release identities remain reproducible and immutable.

## Required functional criteria

### Canonical authority

- store Pre-Engagement at exactly `domains/pre-engagement.json`;
- store Interview Sessions at exactly `domains/interview-sessions.json`;
- create valid empty domains for a new project;
- preserve Engagement ownership of identity/participants/organizations/planning records;
- preserve Evidence ownership of source identity/provenance/relationships;
- prohibit direct writes from either new domain into accepted Engagement, Evidence, Scope, Practice Review, SSP, Deliverables, or Reviews & Actions state;
- use target-owned candidate commands for implemented targets;
- keep unavailable-target candidates queued without false acceptance controls;
- validate exact keys/schema versions/typed IDs/timestamps/refs/enums/limits/state combinations;
- reject duplicate keys, prototype keys, unknown governed keys, duplicate IDs, dangling refs, invalid reverse links/cycles/timestamps/states, and oversized content before mutation;
- preserve meaningful commands in history and support valid Undo/Redo/checkpoint restore/encrypted persistence/recovery/lock.

### Intake requests

- create stable request IDs independent of title/date/owner/import ID;
- support exact contract request kinds and separate lifecycle/operational/review/visibility/due-date/owner dimensions;
- use explicit transitions rather than deriving satisfaction from one submission;
- preserve partial receipt, clarification, cancellation, supersession, and rationale;
- reject contradictory states and invalid participant/organization refs;
- calculate overdue/due-soon work factually without readiness/compliance language;
- compute Client counts only from Client-visible requests.

### Instruments and item identity

- support exact instrument/item kinds/value types/options;
- use opaque immutable instrument/item IDs and explicit versions;
- preserve order, prompt, help, required/applicability, options, provenance, and visibility;
- prohibit in-place edits to a published/assigned snapshot;
- create a new instrument version after governed changes;
- preserve prior versions referenced by assignments/responses/plans/history;
- reject invalid options/types, duplicate IDs/order, unsupported required/applicability states, active content, and oversized fields.

### Assignments and snapshots

- create assignments with Engagement refs, due date, instructions, lifecycle/operational/currency/visibility;
- store immutable exact instrument/item wording/options/order/version snapshot and deterministic identity;
- mark current/stale/conflict/superseded explicitly when source instrument changes;
- never rewrite prior responses;
- support explicit reassign/extend/cancel/supersede with history;
- reject missing/mixed versions, invalid refs, duplicate ordering, unsupported visibility;
- hide hidden assignments/counts from Client View.

### Submissions and responses

- store submission receipt separately from item responses;
- preserve receipt method, asserted submitter, timestamp, snapshot identity, review state, provenance;
- label submitter/profile as locally asserted, not authenticated;
- create responses with exact item/version refs, origin, typed value, currency/review/visibility, provenance, supersession;
- distinguish `client-provided`, `advisor-entered-on-behalf`, `source-derived-candidate`, `imported-context`, and `advisor-interpretation`;
- never render non-client origins as client answers;
- validate exact snapshot type/options;
- reject active markup, binary/data URIs, nested arbitrary JSON, invalid refs, oversized values;
- commit valid batch/import atomically with receipt/checkpoint/history;
- parser failure, rejected preview, cancellation, or invalid subset leaves governed state unchanged.

### Exceptions, conflicts, and Intake Completeness

- support exact exception kinds and preserve reason/affected refs/owner/due date/resolution/history;
- detect client-vs-source, response-vs-response, response-vs-interpretation, and stale-version conflicts without choosing a winner;
- show compared values/versions/provenance and require explicit Keep, Supersede, Merge as new reviewed response, Defer, or Close where permitted;
- preserve source records;
- calculate Intake Completeness from transparent factual checklist/count inputs only;
- never display readiness score, compliance percentage, certification probability, evidence-sufficiency result, risk score, or Met/Not Met;
- Client completeness uses only Client-visible records and hides internal categories/totals.

### Pre-Engagement candidates

- preserve exact source refs, target, proposed operation/fields, rationale, provenance, visibility, workflow state, and supersession;
- creating candidate changes only Pre-Engagement;
- publish to Engagement/Evidence only through target-owned candidate creation;
- accepted target state remains unchanged until target Accept/Modify;
- mirror target decisions only through valid target refs/receipts;
- future targets remain queued;
- reject unsupported conclusion fields;
- hide candidates/counts/rationale/targets from Client View.

### Questions and versions

- create immutable question IDs and versioned content/origin/source basis;
- support scripted/advisor-created/source-derived/suggested-follow-up/carryover/imported-context origins;
- render origin in Advisor/Reviewer/accessibility text;
- create a new version for governed wording changes after use;
- require Advisor Accept/Edit/Ask Now/Save/Dismiss for suggestions;
- suggestion display alone changes no domain/history/progress and never appears to Client automatically;
- reject invalid versions/origins/refs/oversized content.

### Plans and snapshots

- create plan with title/purpose/facilitator/expected attendees/time/topics/ordered items/lifecycle/currency/visibility;
- each item references one exact question/version and stores frozen snapshot, inclusion, order, expected participant/role, estimate, applicability, rationale;
- support keyboard reorder alternatives;
- publish/freeze a deterministic snapshot before Start;
- expose Current/Stale/Conflict/Superseded/Unsupported against current sources;
- never silently refresh frozen plan;
- require explicit stale acknowledgement/retain or new snapshot before Start;
- reject duplicate positions/items, invalid question versions, dangling refs, inconsistent identity;
- preserve checkpoint/history.

### Session lifecycle and recovery

- support Planned, Ready, In progress, Paused, Completed, Cancelled, Superseded and exact legal transitions;
- enforce at most one In progress/Paused session per project;
- Start creates immutable plan/start snapshot, exact active question, timestamp, participant/facilitator context, named checkpoint/history;
- reject Start when validation fails or another active session exists;
- Pause atomically validates/commits valid response/note drafts, current question, agenda order, unresolved state, elapsed hint, then checkpoints;
- Pause publishes/approves/confirms/closes nothing automatically;
- Resume restores same session/question/drafts/order safely without duplication;
- Complete requires explicit action, preserves deferred/unresolved/open follow-ups, sets post-session review Pending, checkpoints;
- Cancel preserves content/rationale/history;
- recovery/open/lock/reload/wrong-passphrase/failed migration cannot create two active sessions or duplicate drafts/time.

### Session questions and progress

- instantiate from frozen plan without mutating source question bank;
- support exact Upcoming/Current/Answered/Deferred/Skipped/Closed behavior;
- allow zero/one Current per active/paused session;
- Previous/Next navigate only and imply no quality/review/confirmation/conclusion;
- show factual counts such as `7 of 18 planned questions`, not a score;
- preserve defer/skip rationale;
- Ask Now/accepted follow-up creates explicit sourced session question/order;
- reject orphan/mixed refs, duplicate positions, invalid states.

### Participant statements

- store separately from notes/confirmations/summaries/candidates;
- preserve exact session/question, asserted participant/speaker, recording method, text/value, lifecycle/review/visibility/provenance/version;
- support exact recording methods and label imported context distinctly;
- never represent imported context as direct live testimony without reviewed conversion/source lineage;
- locally asserted participant attribution is not authenticated;
- use version/supersession when depended upon;
- reject invalid refs/methods/content/size.

### Advisor notes

- store separately with exact note kind/session/question/provenance/history;
- enforce visibility exactly `advisor-only` with no v0.5 escalation command;
- exclude note title/text/metadata before Client projection/count/search/snippet/autocomplete/DOM/inspector/history summary/focus/a11y/screenshot;
- Reviewer receives only when explicitly in assigned scope;
- profile switch clears incompatible state before Client render;
- reject note confirmation targets or visibility escalation.

### Confirmations

- store separately and bind exact statement/client-summary kind/ref/version;
- preserve locally asserted confirmer, method, state, timestamp, facilitator/profile label, visibility/history;
- support verbal/read-back/participant-entry/correction/decline exact methods/states;
- label as locally recorded facilitation event, not authenticated identity/signature/legal/broad approval;
- edit/supersede target makes prior confirmation stale/superseded;
- correction/decline never renders Confirmed;
- reject confirmation of notes, hidden content, invalid versions, unreviewed imported context as direct testimony.

### Summaries and post-session review

- store summary separately from statements/notes;
- preserve kind/source refs/authoring profile/lifecycle/visibility/review/version history;
- draft/generated/facilitator summaries begin unapproved;
- never replace/delete/rewrite raw source records;
- group post-session records by statement/confirmation, Advisor interpretation/note, unresolved question, follow-up, evidence/action/blocker proposal, responsibility, parking, candidate, facilitator summary, Client summary;
- session completion approves/publishes nothing;
- Client summary approval requires explicit review/visibility/source traceability;
- reject dangling/hidden-source leakage/invalid lifecycle/oversize.

### Follow-ups and parking

- preserve stable ID/kind/title/detail/owner/due date/operational/related refs/visibility/provenance/history;
- remain Interview authority until target candidate accepted;
- creating evidence/action/blocker proposal does not mutate unavailable target;
- End Session does not close open work;
- expose open/overdue work factually without conclusions.

### Interview candidates

- preserve exact source record versions, target/type/operation/fields/rationale/provenance/visibility/workflow/supersession;
- candidate creation changes only Interview;
- Engagement/Evidence publication uses target-owned commands;
- target accepted state unchanged before target action;
- future targets remain queued;
- completion/confirmation/summary approval never implies target decision;
- Client sees only deliberately visible agreed summaries/follow-ups, not hidden candidate queues.

### Compatibility adapters

For each recognized package:

- compute SHA-256/size and strictly identify kind/version/registry stability;
- reject duplicate/prototype keys, unsafe paths, duplicate paths, CRC/integrity/compression/recursive/version/size/ambiguity failures;
- stage preview before mutation;
- show proposed requests/instruments/assignments/submissions/responses/questions/context/warnings/rejections;
- preserve source IDs/locations as provenance and generate opaque integrated IDs;
- require Apply, Modify, Reviewed Subset, Reject, or Return;
- commit selected valid set atomically with receipt/checkpoint/history;
- parser/identity/integrity/batch failure has no partial mutation;
- retain no package bytes;
- meeting context remains imported context, not testimony;
- intake answers retain asserted origin;
- keep stable package schemas/registry/standalone sources/pointers unchanged.

Recognized: `l2g_intake_package_v1`, `l2g_meeting_context_v1`, registered current questionnaire/inventory content, and `l2g_scope_context_v1` only as low-authority question context.

Negative fixtures include unknown/unsupported/missing identity, duplicate/prototype keys, oversized/malformed/unsafe/integrity failure, ambiguous participant/source/item/question, answer without snapshot, meeting segment as direct testimony, active/nested content, and mixed batch seeking automatic partial mutation.

### Profiles, search, and non-disclosure

- construct Advisor/Reviewer/Client projections before counts/search/next-work/render/inspector/editor/focus/a11y;
- Client includes only explicit visible requests/prompts, participant-facing controls, selected current question/explanation/context, permitted statements/confirmations, agreed follow-ups, approved summaries;
- Client omits notes/interpretations/hidden statements/import internals/conflicts/confidence/rationale/candidates/target queues/receipts/raw package/internal history/diagnostics;
- hidden content affects no counts/progress/terms/autocomplete/snippets/empty states/DOM/a11y/screenshots;
- switch clears incompatible results/editors/dialogs/inspector/focus/live messages before Client render;
- switch with live drafts safely validates/commits or stays Advisor with no mutation;
- profiles remain non-security; complete `.l2g` is not client distribution;
- search is transient, profile-filtered first, never persisted, rebuilt on project/profile/domain/import/migration/lock changes;
- results use frozen projections and cannot mutate authority;
- factual next work is deterministic/profile-safe and contains no unsupported conclusions.

### Migration

- open v0.4 and add empty exact Pre-Engagement/Interview domains;
- preserve project/Engagement/Evidence/reviews foundation/history/checkpoints/encryption/compatibility/source/candidate state;
- update exact manifest domain index;
- create one named `Migration to v0.5 Pre-Engagement and Interview Sessions` checkpoint/history;
- infer no requests/instruments/assignments/submissions/responses/questions/plans/sessions/statements/notes/confirmations/summaries/follow-ups/imports/candidates/conclusions;
- v0.1-v0.3 use existing paths first;
- open/save/reopen/recover/lock/unlock native v0.5;
- wrong passphrase/malformed legacy/failed migration/limit failure leaves active state unchanged;
- prior deterministic identities/current pointers and all standalone routes pass non-regression.

### History, Undo/Redo, checkpoints

- use ProjectStore commands for meaningful changes;
- history is human-readable and excludes navigation/filter/profile/panel noise;
- assignment publication/import/plan publication/session start-pause-resume-end/cancel/summary approval/candidate publication/migration use named events;
- start/pause/end/cancel/major import/migration use checkpoints;
- Undo/Redo cannot create two active sessions, multiple current questions, broken snapshots, dangling confirmations, note visibility escalation, or accepted cross-domain mutation;
- reversing depended-on publication/approval creates explicit new event rather than erasing history;
- recovery comparison requires explicit choice when materially different.

## Security and robustness criteria

- preserve strict duplicate/prototype/unknown-key/archive path/entry/CRC/integrity/stored-only/trailing-content/size validation;
- preserve inherited 64 entries, 4 MiB entry, 12 MiB inner, 16 MiB outer, 240 paths, 5,000 history, 20 checkpoints;
- enforce both contracts' semantic limits and serialized-size preflight;
- reject invalid transitions/IDs/refs/versions/snapshots/multiple active/current/confirmation mismatch/note visibility/active content/enums/cycles/reverse links;
- encrypted package/recovery contain no known plaintext response/note/participant/question/session marker;
- fresh salt/IV each encryption;
- reject wrong passphrase, ciphertext/AAD tamper, purpose replay, truncation, unsupported profile;
- localStorage contains no governed content, keys/passphrases/ciphertext/recovery, responses/notes/participant/search/active drafts;
- zero unexpected runtime network;
- restrictive CSP including `connect-src 'none'`;
- no microphone/camera/MediaRecorder/speech recognition/WebRTC/remote script-font/analytics/telemetry/collaboration/cloud sync/meeting bot;
- repository/CI/release/log/screenshot/trace content is synthetic and contains no client/FCI/CUI/secret/private path/unlicensed proprietary content.

## UX, accessibility, and usability criteria

- Pre-Engagement and Interview Mode are fully keyboard operable;
- lists/items/editors/agenda/follow-up/dialog/profile/inspector/post-review have accessible names and visible focus;
- drag/reorder has buttons;
- Advisor Interview usable at 1366×768 with current question, both editor labels, Next/Pause, save state visible;
- Client presentation readable at 1280×720 with no Advisor content;
- tablet landscape supports agenda/context drawers, response/confirmation, pause/resume;
- no page horizontal overflow on primary path;
- no serious/critical axe-core findings;
- no color-only states;
- polite live regions for save/pause/resume/profile/question/disposition/end without keystroke spam;
- focus trap/restoration and safe profile-switch focus;
- 200% zoom and reduced motion;
- errors link fields, state whether data changed, and expose no paths/stack/hidden text on Client screen;
- shortcuts do not fire while typing/bypass validation.

Synthetic usability scenarios prove an advisor can find missing intake; distinguish origins; resolve conflict; build mixed-origin plan; handle stale plan; capture statement and separate note; add reviewed follow-up; switch Client without leakage; record exact-version local confirmation; pause/reopen/recover/resume same question once; complete with deferred/open work; review Client summary while retaining raw records; publish target candidate without accepted mutation; recover rail/inspector.

Success requires understood record distinctions, Advisor-controlled suggestions, trusted deterministic recovery, factual-not-quality progress, actionable stale/open work, and an inspector that reduces navigation.

## Performance and scale criteria

Under local Chromium `file://`:

- semantic-cap synthetic domains validate and remain navigable;
- 500-item instrument uses bounded rendering and remains operable;
- response/filter/next-work remain responsive at caps;
- 500-question bank, 250-item plan, and 25-session synthetic project remain operable;
- Next/Previous/edit/Pause/checkpoint remain responsive with inspector;
- profile-switch search rebuild exposes no stale results;
- large valid preview cancellable/rejectable before mutation;
- oversized input fails before mutation;
- generated HTML remains deterministic and within release expectations;
- no timing-race correctness tests.

## Build, release, and regression evidence

Before promotion:

- design authority merged separately;
- implementation starts from exact design merge/current main;
- deterministic build twice yields byte-identical HTML;
- pinned dependencies/license/SBOM checks pass;
- source/domain/project/encryption/adapter/Playwright/axe/visual/responsive/public-hygiene/repository validation pass;
- exact candidate-head Linux and native Windows `file://` pass;
- zero network on primary routes/Interview Mode;
- complete registered standalone/package/snapshot/RG-4/portable-suite non-regression passes;
- v0.4 source/artifact identity unchanged;
- deterministic release notes/SBOM/manifest/validation/SHA/HTML/ZIP generated;
- current pointer remains v0.4 until reviewed candidate promotion;
- after pointer metadata, all dedicated/Foundation/repository/Playwright/RG-4/Windows/a11y/visual/materializer/determinism/public-hygiene/standalone gates rerun on unchanged final head;
- validation report records exact heads/runs/artifacts/digests/SHA/limitations/synthetic boundary.

## Explicit non-regression boundaries

v0.5 must not alter stable standalone package schemas/wire versions; replace DocConverter extraction/OCR/diagram/transcript; replace Scoper Scope; replace Workshop Practice conclusions; replace SSP narratives; move Builder/Merger generation; embed original evidence; introduce recording/transcription/AI/automatic acceptance/scoring/conclusions; introduce cloud/accounts/auth/collaboration/telemetry/network; authorize production/client/FCI/CUI; retire standalone modules; or claim readiness/compliance/assessment/certification/scoring/risk/sufficiency/implementation/Met or Not Met.

## Promotion decision

Promotion is permitted only when every applicable criterion passes on exact unchanged heads; no unresolved serious/critical accessibility, security, integrity, disclosure, migration, recovery, or authority defect remains; artifacts/SHA identities are recorded; pointer/release notes/validation/README/roadmap/risk register agree; issue #133 records design and promoted evidence; and synthetic-only posture remains unless separately approved.
