# L2G Integrated Suite v0.5.0 — Pre-Engagement and Interview Sessions Threat Model

## Scope

This update covers the new Pre-Engagement and Interview Sessions authorities, immutable instruments/assignments/questions/plans, intake submissions/responses, conflicts, live Interview Mode, participant statements, advisor notes, confirmations, summaries, follow-ups, parking-lot work, strict compatibility imports, profile-safe projections, transient search, cross-domain candidates, migration, checkpoints, and interrupted-session recovery.

ADR-0007 continues to govern encrypted projects/recovery, ADR-0008 Engagement, ADR-0009 Evidence, and ADR-0010 the two new authorities.

The release remains synthetic-only and is not authorized for production, client, FCI, or CUI data.

## Protected assets

- intake requests, instruments, assignment snapshots, submissions, responses, exceptions, and candidate mappings;
- participant/organization references and asserted submitter/speaker labels;
- question bank records, plan snapshots, session state, agenda order, and recovery position;
- participant statements, advisor notes, confirmations, facilitator/client summaries, follow-ups, and parking-lot items;
- provenance, source references, imported-context labels, internal rationale, review state, and history;
- Advisor-only content excluded from Client presentation/search/counts/inspector/accessibility tree;
- target-domain accepted state protected from source-domain candidate mutation;
- encrypted project, encrypted recovery, keys/passphrases in transient memory, integrity manifest, history, and checkpoints;
- public repository/CI surfaces restricted to synthetic content.

## Trust boundaries

1. Engagement/Evidence profile-safe projections into Pre-Engagement/Interview planning;
2. user-created instrument/question content into immutable assignment/plan snapshots;
3. recognized package bytes into strict parser and preview;
4. preview into atomic source-domain apply command;
5. facilitator/participant-entered text into participant statements;
6. facilitator-entered internal text into Advisor notes;
7. raw records into drafted summaries and candidates;
8. active session editors into Pause checkpoint/recovery;
9. source-domain candidate publication into target-owned candidate commands;
10. complete authorities into profile-safe projections;
11. profile-safe projections into transient search/render/inspector/focus/a11y tree;
12. project state into encrypted save/recovery;
13. synthetic fixtures/screenshots/logs into public repository/CI.

## Principal threats and controls

### Client answer provenance confusion

Threat: source-derived, imported, advisor-entered, or interpreted content is displayed or exported as a client-provided answer.

Controls:

- exact response-origin enum and persistent origin labels;
- `client-provided` requires asserted submitter provenance and permitted receipt method;
- Advisor entry on behalf remains separate;
- imported/source/advisor interpretations never use client-answer labels;
- conflict comparison retains every source/version;
- profile/accessibility text includes origin;
- import adapters cannot promote origin automatically;
- tests search DOM, projections, exports, history summaries, and inspector labels.

Residual limitation: asserted submitter identity is local workflow metadata, not authenticated identity.

### Instrument or assignment snapshot drift

Threat: editing a reusable instrument silently changes prior assignments or makes responses appear tied to wording/options that were never presented.

Controls:

- immutable published assignment snapshots with exact item IDs/versions/order/options;
- deterministic snapshot identity/hash;
- edits create new instrument version;
- response validates against exact assignment snapshot;
- stale/current/conflict/superseded state;
- compare and explicit new assignment/snapshot workflow;
- no in-place rewrite after receipt;
- snapshot drift and migration tests.

### Malicious questionnaire/response content

Threat: prompts/options/responses contain active HTML, script/event handlers, data URIs, binary payloads, prototype keys, huge nested JSON, bidi/control spoofing, or resource-exhausting content.

Controls:

- strict duplicate/prototype/unknown-key rejection;
- bounded plain text and flat scalar types;
- exact type/option validation;
- control/bidi sanitization where labels could spoof UI;
- no innerHTML for governed text;
- semantic and inherited archive limits;
- cloned-state/serialized-size preflight before mutation;
- adversarial rendering and import tests.

### Request/submission state overstatement

Threat: one received file/submission automatically marks all requests complete or intake “ready.”

Controls:

- request, assignment, submission, response, review, exception, and completeness are separate;
- explicit state transitions;
- transparent completeness facts/checklist;
- missing/partial/clarification remain visible;
- no readiness/compliance terminology or hidden formula;
- tests for partial receipt and explicit satisfied rationale.

### Conflict loss or last-write-wins

Threat: newer response, imported context, or advisor interpretation silently replaces another current value.

Controls:

- conflicts create explicit exception records;
- source/version/timestamp/provenance shown side by side;
- explicit Keep, Supersede with new response, Merge as new reviewed response, Defer, or Close;
- source records preserved;
- no timestamp auto-selection;
- Undo/history/checkpoint tests.

### Imported package authority escalation

Threat: intake/meeting/scope-context package content becomes direct client answers, participant statements, Scope decisions, findings, summaries, or accepted target records.

Controls:

- recognize only registered kind/version;
- strict parse/hash/registry/integrity/traceability before preview;
- package bytes not retained;
- imported IDs are provenance, not integrated IDs;
- explicit Apply/Modify/Reviewed Subset/Reject/Return;
- atomic source-domain commit;
- imported meeting context remains `imported-context`;
- intake imports do not manufacture authenticated/client-provided origin;
- scope context can inform questions only and is not Scope authority;
- target accepted state unchanged;
- malformed/ambiguous inputs fail before mutation.

### Stale question plan

Threat: question wording, applicability, source context, or expected participants change after planning and silently alter a live session.

Controls:

- versioned question records;
- frozen published plan item snapshots and canonical snapshot identity;
- current/stale/conflict/superseded/unsupported comparison;
- Start requires valid snapshot and explicit stale disposition;
- refresh creates new plan version;
- original snapshot preserved in session start record/history;
- no automatic source/context refresh;
- staleness/difference tests.

### Automatic suggestion promotion

Threat: generated/source-derived/suggested follow-up enters agenda, advances session, appears to Client, or creates a record without advisor review.

Controls:

- review tray with origin/basis;
- explicit Accept, Edit and Accept, Ask Now, Save for Later, Dismiss;
- no automatic agenda insertion, advancement, record creation, summary, or candidate;
- suggestions excluded from Client projection until deliberately accepted/presented;
- tests assert no state/history/count change from suggestion display alone.

### Live-session cognitive overload and accidental action

Threat: facilitator types in wrong record type, accidentally advances, loses context, or treats agenda progress as quality.

Controls:

- dedicated reduced Interview Mode;
- visually/semantically separate participant-statement and Advisor-note editors;
- stable Previous/Next/Pause/End placement;
- shortcut guards while typing;
- invalid drafts block navigation/pause with no-mutation message where required;
- progress shown as factual question counts only;
- no automatic confirmation/publication/conclusion;
- keyboard/touch/usability scenarios at target viewports.

### Advisor-note leakage

Threat: raw Advisor notes leak in Client presentation through visible text, DOM, counts, search, autocomplete, snippets, inspector cache, hidden tabs, prior query, focus restoration, live-region announcement, history summary, screenshot, or accessibility name.

Controls:

- contract invariant: Advisor note visibility is exactly `advisor-only`;
- no v0.5 command escalates a raw note;
- construct Client projection before calculation/search/render/inspector/focus/a11y tree;
- omit rather than CSS-hide;
- clear search, selection, inspector/editor/dialog, cached counts, focus target, and live-region pending messages before Client render;
- Client-visible summary is a separate reviewed record with source refs;
- profile-switch tests inspect projection, DOM text/attributes, accessibility snapshot, screenshots, keyboard traversal, and search;
- fail closed on projection/render error.

Residual limitation: Client profile is not access control; a holder of the unlocked complete project can switch back to Advisor.

### Imported context masquerading as participant statement

Threat: an imported transcript/meeting segment or source summary appears to be a statement made live by a named participant.

Controls:

- separate `imported-context` origin/recording method;
- preserve package/source refs and import receipt;
- direct statement conversion requires explicit reviewed command and retains origin lineage;
- no automatic asserted speaker mapping from text labels;
- imported context cannot be confirmed as direct testimony without explicit participant review of a new statement version;
- UI/accessibility labels distinguish Imported context.

### Confirmation overstatement or spoofing

Threat: locally recorded confirmation is treated as authenticated signature, broad client approval, legal acceptance, or confirmation of content that changed afterward.

Controls:

- separate confirmation record with exact target kind/ref/version;
- locally asserted confirmer/method/timestamp;
- permitted methods distinguish verbal/read-back/participant-entry/correction/decline;
- product copy states not authenticated/electronic signature;
- target edit/supersession marks confirmation stale/superseded;
- no confirmation of Advisor notes or hidden content;
- correction/decline never renders Confirmed;
- confirmation cannot imply target-domain acceptance or assessment conclusion.

### Summary replaces raw records

Threat: facilitator/generated summary silently edits/deletes statements/notes or becomes client-approved automatically.

Controls:

- summary is a separate record with source refs;
- raw records preserved;
- Draft/Pending by default;
- session completion does not approve;
- explicit review and client-presentation approval;
- version/supersession/history;
- dangling/hidden-source and profile-leak validation;
- no automated summary generation in v0.5.

### Interrupted-session data loss

Threat: browser crash/reload/lock during session loses drafts, resumes wrong question, duplicates text, or shows false saved state.

Controls:

- at most one active/paused session;
- Start/Pause/End checkpoints;
- bounded encrypted recovery/autosave with truthful labels;
- Pause atomically validates/commits drafts and exact current question/order/state;
- restore comparison when recovery differs materially;
- Resume from governed state only;
- idempotent recovery prevents duplicate drafts/events/elapsed time;
- lock/save/open/reload/crash/wrong-passphrase tests.

Residual limitation: edits made since the latest successful encrypted recovery write may be lost after abrupt endpoint failure; UI must not claim otherwise.

### Corrupt or conflicting session state

Threat: two active sessions, multiple current questions, orphan statements, cross-session refs, invalid plan hash, or broken supersession corrupts facilitation/recovery.

Controls:

- project-wide ID/reference inventory;
- exact state-transition validator;
- one-active-session and zero/one-current-question invariants;
- plan/session hash/version validation;
- endpoint-type and same-session reference rules;
- cycle/reverse-link checks;
- validate cloned proposed state before commit/open/migration/recovery;
- malformed-state tests.

### Elapsed-time misuse

Threat: elapsed time is interpreted as quality/completeness or restored incorrectly.

Controls:

- label as elapsed-time hint/operational metadata;
- no scoring/conclusion linkage;
- monotonic bounded updates while active;
- pause/end persistence rules;
- recovery avoids double counting;
- tests tolerate clock variation without using timing races for correctness.

### Cross-domain authority transfer

Threat: intake response/session statement/confirmation/candidate directly modifies Engagement, Evidence, Scope, Practice Review, SSP, Deliverables, or Reviews & Actions accepted state.

Controls:

- source-domain candidate creation only;
- implemented target publication invokes target-owned candidate command;
- target ref/decision receipt required;
- source mirrored state cannot manufacture decision;
- unimplemented targets queue with no false controls;
- session completion/confirmation/summary approval never implies target acceptance;
- target non-mutation and Undo tests.

### Profile-switch draft loss or disclosure

Threat: switching Advisor/Client during a live session loses unsaved text or renders sensitive draft before validation.

Controls:

- explicit switch handling when drafts exist;
- validate/commit or retain Advisor-only draft safely before switch;
- clear incompatible components before Client render;
- Client projection built first;
- return to Advisor restores governed draft/state, not stale DOM;
- failure keeps Advisor profile and shows no-mutation error;
- focus/live-region cleanup tests.

### Sensitive participant/contact leakage

Threat: participant/contact/organization labels appear in Client presentation or public fixtures beyond what was deliberately shared.

Controls:

- use Engagement profile-safe refs/projections;
- explicit visibility and selected attendee labels;
- no hidden participants in counts/search/context;
- no authenticated directory/contact service;
- synthetic public data only;
- profile/public-hygiene tests.

### Search leakage

Threat: hidden intake/session content leaks through tokens, autocomplete, counts, snippets, prior queries, empty states, or stale results.

Controls:

- filter by profile first;
- index only in memory;
- never persist index/query/recent results;
- rebuild/clear on unlock, lock, project/profile/domain change;
- Client excludes Advisor notes, hidden statements, imported internals, suggestions, candidates, conflicts, receipts, internal provenance/history;
- result refs point to frozen projections;
- DOM/accessibility/search leakage matrix.

### Endpoint compromise

Threat: unlocked project and current editor content are exposed by compromised OS/browser/extension/local user, clipboard, screenshot, or memory inspection.

Controls/limitations:

- encrypted project/recovery at rest;
- no runtime network and restrictive CSP;
- best-effort key/draft clearing on lock/reload;
- no original evidence/audio/video persisted;
- explicit non-security-profile qualification.

The release cannot protect a complete unlocked project from its holder or a compromised endpoint.

### Project size/history exhaustion

Threat: large instruments/responses/questions/statements/notes/checkpoints exceed semantic/archive/history limits and corrupt save/recovery.

Controls:

- semantic collection/string/ref caps;
- inherited 4 MiB entry, 12 MiB inner, 16 MiB outer, 5,000 history, 20 checkpoints;
- preflight cloned serialized size before commit/save;
- bounded plain text/flat fields;
- no media/package bytes;
- large synthetic scale tests;
- truthful no-partial-mutation errors.

### Public repository contamination

Threat: real participant names, client responses, notes, screenshots, meeting content, local paths, or package extracts enter public GitHub/CI/Releases.

Controls:

- synthetic McFirecoal fixtures only;
- content/path/secret scans;
- sanitized screenshots/traces/logs;
- release checklist and artifact review;
- no decrypted project/real package upload;
- fail public-hygiene gate before merge/promotion.

## Misuse cases

- importing real client/FCI/CUI data despite synthetic-only boundary;
- using Client profile as access control or distributing the complete `.l2g` project;
- labeling advisor-entered/imported/source-derived content as client-provided;
- treating imported context as direct participant testimony;
- treating local confirmation as electronic signature or broad client approval;
- editing a question/instrument and assuming prior plans/answers changed;
- allowing a suggestion to enter agenda automatically;
- using progress/time/completeness as readiness or quality;
- completing session and assuming summaries/candidates are approved;
- pasting full transcript/media/base64/active markup into bounded fields;
- changing mirrored candidate state to imply target acceptance;
- opening multiple active sessions through malformed state;
- putting sensitive details in client-safe labels;
- relying on recovery after a save failure without verifying status.

## Required verification

- schema/semantic validators for both domains;
- origin attribution and Client-answer non-confusion;
- immutable instrument/assignment/question/plan snapshots and staleness;
- malicious/oversized content rejection;
- request/completeness non-overstatement;
- conflict preservation/no last-write-wins;
- strict recognized import preview/apply and malformed/ambiguous rejection;
- suggestions create no mutation until action;
- statement/note/confirmation/summary separation;
- Advisor-note Client leakage tests across projection/count/search/DOM/inspector/focus/live regions/a11y/screenshots;
- imported-context non-testimony;
- exact-version confirmation and stale/correction/decline behavior;
- session start/pause/resume/complete/cancel/recovery and one-active-session;
- cross-domain target non-mutation;
- encrypted save/open/recovery/lock, wrong passphrase, tamper, AAD/purpose replay, truncation, and unsupported-profile regression;
- v0.4 empty-domain migration and v0.1-v0.3 regression;
- Linux/native Windows `file://`, axe-core, responsive, zero-network, CSP, deterministic build, public hygiene, current-suite, and standalone non-regression.

## Residual risk

v0.5 does not establish authenticated identity, signatures, consent capture, source authenticity, transcript accuracy, evidence sufficiency, production authorization, endpoint security, or client-safe distribution. It cannot protect an unlocked complete project from its holder. Locally entered responses/statements/confirmations depend on facilitator accuracy. The inherited project limits constrain long engagements. Recovery reduces but cannot eliminate data loss after abrupt endpoint failure before a successful encrypted save/recovery write.
