# L2G Integrated Suite v0.7.0 — Practice Review UX and Usability Record

## Status

Proposed UX record for issue #143 and ADR-0012. This record becomes implementation authority only when the complete v0.7 design package is reviewed and merged.

The active v0.6 Scope UX helper review remains an input dependency for shared shell, inspector, disclosure, responsive, and accessibility patterns. Findings must be reconciled into this record before the design PR merges. They do not authorize a broad v0.6 redesign or change the Practice Review authority model.

## UX objective

Enable an advisor to prepare, facilitate, pause, resume, and review CMMC Level 2 practice-review sessions while preserving clear distinctions among:

- authoritative requirement identity;
- participant/client claims;
- imported Workshop context;
- referenced Evidence and factual Evidence review state;
- Advisor observations;
- unresolved questions;
- gap observations;
- recommendations;
- actions and blockers;
- provider/responsibility discussions;
- human-recorded qualified Practice Review positions;
- formal assessment conclusions, which remain outside the application boundary.

The interface must reduce facilitator cognitive load without hiding provenance, stale state, authority, or post-session review obligations.

## Design principles

1. **One engagement, one application, one Practice Review authority.** Do not reproduce a standalone Workshop shell inside the suite.
2. **Prepare before facilitating.** Plans, requirement order, participants, questions, Scope refs, and Evidence refs are reviewed before a session starts.
3. **One requirement at a time during facilitation.** Practice Mode prioritizes capture and orientation over browsing every record simultaneously.
4. **Claims are not conclusions.** Every captured statement identifies its origin and record family.
5. **Evidence references are not evidence sufficiency.** Review states remain factual and qualified.
6. **Advisor analysis is visually and structurally separate.** It never shares an editor with participant/client claims.
7. **Post-session review is mandatory.** Ending a session creates a queue; it does not approve, publish, or conclude.
8. **State dimensions remain visible.** Workflow, review, currency, visibility, origin, and target state do not collapse into one status color.
9. **Preview before apply or publish.** Imports, conversions, review positions, and target publications show exact effects first.
10. **No hidden scoring.** Progress is factual workflow completion only.
11. **Profiles filter before render.** Hidden data does not enter counts, search, inspector, focus, live regions, or accessibility trees.
12. **Offline and keyboard-first.** The primary workflow must function in one local HTML file at 1280×720 and tablet landscape.

## Workspace information architecture

Practice Review uses the established left application rail, compact top bar, central work canvas, and right inspector. The workspace-level subnavigation contains exactly:

1. **Review Queue**
2. **Sessions**
3. **Evidence & Requests**
4. **Open Items**
5. **Providers & Responsibility**
6. **Review History**

**Practice Mode** is launched from a planned session and temporarily replaces the normal central workspace canvas. It is not a seventh tab and does not create a second application state.

### Review Queue

Default entry view for advisors.

Purpose:

- orient to the 110-requirement review workload;
- find not-started, in-progress, paused/blocked, stale, ended-pending-review, and reviewed records;
- group by domain, family, custom session, or factual workflow state;
- surface exact next work without readiness/compliance scoring;
- launch requirement detail or add selected requirements to a plan.

Primary layout:

- compact toolbar: search, group, factual state filter, stale-only, participant/provider filter, selected-plan action;
- main list/table with sticky requirement identity column;
- optional grouped sections with collapsible domain/family headers;
- right inspector for the selected Requirement Review.

Required row information:

- requirement ID and qualified title;
- workflow state;
- current qualified Practice Review position, if any;
- claim count visible to the current profile;
- Evidence review count by factual state;
- open question/blocker count;
- stale/conflict indicator;
- active session/plan reference;
- next required action.

Rows must not show percentages, risk levels, readiness, compliance, evidence-sufficiency, Met, or Not Met.

### Sessions

Purpose:

- create and version plans;
- select and order requirements;
- review participants, questions, Scope context, Evidence refs, and imported context;
- start, pause, resume, end, and complete sessions;
- orient to interrupted-session recovery and post-session review.

Primary layout:

- left list of plans and sessions grouped by state;
- center plan/session detail;
- right inspector for selected requirement, participant, source ref, or question;
- prominent but guarded `Start Practice Mode` action only for a valid frozen plan version.

Plan detail sections:

1. purpose and participants;
2. ordered requirement list;
3. related Scope context;
4. related Evidence references;
5. planned questions;
6. imported context selected for facilitation;
7. stale/conflict diagnostics;
8. frozen version identity;
9. exact effects of creating a new version.

Session cards display workflow state and recovery information, never review outcome.

### Evidence & Requests

Purpose:

- review exact Evidence references by requirement;
- record factual review state;
- create Evidence request or clarification candidates;
- detect changed source revisions;
- navigate to Evidence authority without duplicating source metadata.

Primary layout:

- requirement/evidence matrix or grouped list;
- factual review-state filters;
- exact revision and source-current/stale indicator;
- review note and follow-up controls;
- target-publication preview for Evidence requests.

The UI uses labels such as:

- Not requested
- Requested
- Linked, not reviewed
- Reviewed — relevant
- Reviewed — not relevant
- Reviewed — follow-up needed
- Unavailable
- Stale source revision

It must not use Sufficient, Insufficient, Adequate, Effective, Satisfies, Coverage %, Met, or Not Met.

### Open Items

Purpose:

- consolidate questions, gap observations, recommendation candidates, actions, blockers, and target receipts while preserving record families;
- support post-session review and publication decisions;
- avoid presenting every open item as the same severity/status.

Default grouped sections:

- Questions
- Gap observations
- Recommendations
- Actions
- Blockers
- Returned target candidates
- Stale published candidates

Each section retains its own filters and allowed actions. A gap observation is always labeled `Advisor observation — not a formal finding` until and unless a future authorized domain accepts a formal finding candidate.

Primary actions:

- Review
- Modify
- Return
- Reject
- Withdraw
- Supersede
- Publish candidate to target authority
- Close factual workflow item

The UI previews the exact target domain, candidate kind, fields, source versions, and non-mutation rules before publication.

### Providers & Responsibility

Purpose:

- review provider, service, Scope, responsibility, inheritance, support-access, and follow-up context across requirement reviews;
- distinguish client/provider/shared/inherited claims from accepted Scope responsibility;
- prepare provider questions and requested Evidence types.

Primary layout:

- provider/service list from the current profile-safe Scope projection;
- requirement relationship count;
- responsibility-discussion records grouped by origin;
- provider follow-up queue;
- stale Scope-ref diagnostics;
- right inspector with exact Scope versions and source claims.

Required visual language:

- `Client claim`, `Provider claim`, `Shared claim`, `Inherited claim`, `Disputed`, `Unassigned`;
- accepted Scope responsibility, when available, appears in a separately labeled `Scope authority` section;
- no automatic implementation or control-inheritance conclusion;
- provider authorization and contract context are descriptive only.

### Review History

Purpose:

- inspect immutable prior plan versions, session events, review positions, supersession, imports, publications, returns, Undo/Redo, and migration history;
- compare exact versions without making the latest record silently authoritative.

Primary layout:

- chronological event list with domain/action filters;
- record-version comparison panel;
- source and target receipt links;
- checkpoint restore preview;
- explicit current/historical/stale/superseded labels.

Client profile sees only approved Client-safe history summaries built from the Client projection. It never sees hidden event counts or private record labels.

## Practice Mode

## Entry gate

Practice Mode may start only when:

- the plan has a frozen immutable version;
- all requirement refs validate against the current 110-requirement catalog or are explicitly acknowledged stale;
- no other Practice Review session is in-progress or paused;
- selected participant refs validate;
- required profile/non-disclosure rules validate;
- unsupported imported content or unresolved plan corruption is absent;
- the Advisor confirms the exact plan version.

Starting creates a named checkpoint and history event.

## Layout

At 1280×720, Practice Mode uses four stable regions:

1. **Session header**
   - session name and state;
   - requirement position, e.g. `12 of 37`;
   - exact requirement ID;
   - stale/conflict indicator;
   - profile indicator;
   - elapsed session time may be shown locally but is never persisted as performance data;
   - Pause and End controls.

2. **Requirement and context pane**
   - authoritative requirement identifier and qualified display text;
   - current Scope context summary;
   - existing claims/imported context;
   - referenced Evidence with factual review state;
   - prior current/stale Practice Review position;
   - provenance and version access through the inspector.

3. **Capture pane**
   Separate editors/tabs for:
   - Participant/client claim
   - Advisor observation
   - Evidence review
   - Question / parking lot
   - Gap observation
   - Recommendation
   - Action / blocker
   - Responsibility / provider follow-up

   Editors never share one generic notes field. Every editor shows origin, visibility, and resulting record family before save.

4. **Navigation and session queue**
   - Previous / Next requirement;
   - Save draft;
   - Mark for post-session review;
   - add planned/ad-hoc question through explicit Advisor action;
   - jump to a requirement through a compact searchable drawer, not a persistent dense grid;
   - unresolved and draft indicators.

The right inspector opens over or beside the context pane depending on viewport. It never displaces the capture editor off-screen.

## Capture behavior

- Drafts save through explicit commands and are included in encrypted recovery.
- Switching capture family never copies text automatically.
- Saving a participant claim requires an asserted participant/source origin.
- Saving an Advisor observation forces Advisor-only visibility.
- Evidence review requires an exact Evidence revision.
- Gap observation copy always includes the non-formal-finding qualification.
- Actions and blockers show workflow-priority qualification.
- Responsibility discussion shows claim origin and accepted Scope context separately.
- Generated or imported suggestions appear as candidates and require explicit conversion.
- A saved record does not advance automatically unless the Advisor enabled a local `Save and next` preference for the current session.
- Destructive actions require confirmation with record family and version.

## Keyboard interaction

Required shortcuts, shown in a help overlay and disabled while conflicting text-editor commands are active:

- `Alt+Left` / `Alt+Right`: previous/next requirement;
- `Ctrl+S`: save current draft;
- `Ctrl+Shift+S`: save and move next when enabled;
- `Ctrl+K`: open requirement jump/search drawer;
- `Ctrl+Shift+Q`: create review-question draft;
- `Ctrl+Shift+P`: open parking-lot queue;
- `Ctrl+Shift+E`: focus Evidence review section;
- `Ctrl+Shift+N`: focus Advisor observation editor;
- `Ctrl+Shift+C`: focus participant/client claim editor;
- `Escape`: close the topmost non-destructive drawer/inspector;
- no single-key shortcut may accept, reject, publish, end, complete, or delete.

All shortcuts have visible button equivalents. Focus returns to the invoking control or the next valid record after a command.

## Pause, resume, end, and recovery

### Pause

Pause:

- saves valid drafts;
- records exact requirement position and open editor family;
- creates a named checkpoint and history event;
- clears transient Client-presentation state;
- changes session state to `paused`;
- publishes or approves nothing.

### Resume

Resume:

- validates the exact plan version and source refs;
- shows stale/conflict changes before returning to capture;
- restores the last valid requirement and editor focus;
- prevents a second active session.

### End

End:

- creates a named checkpoint;
- changes state to `ended-pending-review`;
- creates a post-session queue containing every draft, imported conversion candidate, unresolved question, proposed position, gap, recommendation, action, blocker, provider follow-up, and stale ref requiring review;
- does not accept or publish any record.

### Complete

Complete is available only in post-session review after all queued records have explicit treatment. Completion means the facilitated session workflow is complete. It is not a formal assessment conclusion.

## Post-session review

Post-session review is a dedicated queue launched from Sessions or Open Items.

Each queue item shows:

- record family;
- requirement ID;
- source/origin;
- visibility;
- exact source versions;
- proposed values;
- stale/conflict state;
- target domain, if publication is proposed;
- exact effect preview.

Allowed treatment:

- Keep as draft
- Accept into the Practice Review record family
- Modify and accept
- Return for clarification
- Reject
- Withdraw
- Supersede an earlier record
- Publish a target-owned candidate

Batch operations are allowed only for records of the same family and treatment when each item validates independently and the complete batch validates atomically. Batch acceptance of review positions or target publications requires a final exact-effects review.

## Requirement-review detail and inspector

The Requirement Review detail uses a stable top summary followed by collapsible sections:

1. requirement identity and source version;
2. workflow and current qualified position;
3. claims;
4. Evidence review;
5. Advisor observations;
6. questions;
7. gap observations;
8. recommendations/actions/blockers;
9. providers/responsibility;
10. sessions and history;
11. source/target receipts.

The right inspector shows:

- local ID and exact version;
- authority owner;
- origin and source refs;
- requirement ref and text fingerprint;
- visibility and Client-safe labels;
- lifecycle, review, currency, candidate, and target state as separate rows;
- relationships;
- supersession;
- stale/conflict diagnostics;
- permitted commands for the active profile.

The inspector never shows a single overloaded `Status` field.

## Review-position composer

Creating or superseding a Practice Review position uses a side sheet or modal with:

1. selected qualified position;
2. exact affected Requirement Review version;
3. exact basis refs grouped by claim, Evidence review, observation, gap, question, blocker, Scope context, and import;
4. Advisor rationale;
5. separate Client-safe rationale;
6. Reviewer request option;
7. stale/conflict diagnostics;
8. preview of fields and supersession effects;
9. persistent qualification that this is not Met/Not Met or an assessment outcome.

Acceptance is disabled when:

- basis refs are missing or stale without explicit acknowledgement;
- another current position exists and no supersession is selected;
- unsupported conclusion vocabulary appears in authority-bearing fields;
- hidden Advisor content is copied into the Client rationale;
- exact requirement identity does not validate.

## Import preview

Workshop and related compatibility imports use a full preview surface before mutation.

Header displays:

- package kind, wire version, contract release, producer, filename, size, and SHA-256;
- exact recognized route;
- guardrails and diagnostics;
- package bytes-retention qualification.

Records group into:

- requirement/practice context;
- claims/imported notes;
- Evidence references/requests;
- key findings or gap-like context;
- recommendations;
- actions/blockers;
- providers/responsibility;
- SSP handoff/return context;
- unsupported/unmapped records.

Per-record treatment:

- Create imported context
- Convert to specified Practice Review candidate family
- Link to exact current record
- Keep separate
- Modify and create/link
- Reject
- Return

Display-name or requirement-title similarity never auto-links. A same-requirement ID may identify the requirement but does not establish identity for claims, gaps, actions, or observations.

The apply footer shows exact selected counts and effects. Apply remains disabled for unresolved selected ambiguity, unsupported version, invalid traceability, active content, over-limit input, or cross-record integrity failure.

## Profile behavior

### Advisor

- full permitted source context and raw Advisor records;
- create/edit/accept/return/reject/publish commands;
- import diagnostics and exact provenance;
- session facilitation and post-session review.

### Reviewer

- read-only record content and exact basis/provenance;
- Concur, Concur with changes, Return, or Reject on eligible proposed Practice Review positions or reviewed summaries;
- no direct editing of claims, observations, Evidence review, or accepted target state;
- no hidden automatic acceptance after concurrence.

### Client

- only explicit Client-visible requirement summaries, approved claims/summaries, factual Evidence request/review labels, reviewed questions, reviewed gap summaries with non-formal-finding qualification, reviewed recommendations/actions, provider follow-up summaries, and qualified review positions;
- no raw Advisor observations, import diagnostics, private provenance, rejected/returned candidates, hidden counts, internal participant metadata, source paths, or unreviewed records;
- no edit controls except separately allowed local facilitation confirmations in a future reviewed scope;
- persistent copy: `Client presentation is a locally filtered facilitation view, not access control, a formal assessment, or a safe distributable project.`

Rapid Advisor → Client → Reviewer → Advisor switching must rebuild projection, counts, search, inspector, history summaries, focus, live regions, and accessibility tree from the new profile. No prior-profile editor or hidden element remains in the DOM or receives focus.

## Responsive behavior

### 1440×900

- full list/detail/inspector layout;
- Practice Mode four-region layout;
- persistent compact session navigation;
- no oversized hero or decorative dashboard cards.

### 1280×720

- full primary workflow remains visible;
- list/detail and inspector use tighter spacing;
- Practice Mode header and navigation remain fixed while context/capture panes scroll independently;
- primary Save, Pause, End, Previous, and Next actions remain visible;
- no horizontal page scrolling.

### Tablet landscape around 1024×768

- normal views use one primary pane plus inspector drawer;
- Practice Mode uses requirement/context drawer, full-width capture pane, and bottom navigation bar;
- record-family capture selector is a horizontal scrollable tablist or compact menu with keyboard access;
- inspector and requirement jump drawer are mutually exclusive;
- no required action depends on hover, drag, or pointer precision;
- no primary page-level horizontal scroll.

Portrait/mobile phone optimization is excluded from v0.7 unless required to correct a severe accessibility defect.

## Empty, loading, stale, conflict, and error states

Required designed states:

- empty migrated Practice Review domain;
- valid catalog loaded with no review cycle;
- plan draft with no requirements;
- plan with stale requirement catalog;
- session blocked by another active session;
- paused session with exact recovery position;
- ended session with post-session queue;
- requirement review with no claim/Evidence;
- conflicting claims;
- stale Evidence revision;
- stale Scope context;
- unresolved provider responsibility;
- proposed position conflict;
- import unsupported version;
- import ambiguity;
- import failed-before-mutation;
- target candidate returned/rejected/stale;
- Client view with no approved content;
- lock/unlock and encrypted recovery states.

Errors state what was preserved and what did not change. They never imply silent partial apply.

## Accessibility requirements

- semantic headings and landmarks for every view;
- workspace subnavigation uses a labeled tablist/navigation pattern with correct selected state;
- all lists/tables have programmatic labels and sortable/group controls announce state;
- requirement identity is announced before workflow chips;
- no information relies on color alone;
- visible focus meets contrast requirements in light and dark modes;
- all buttons and icon controls have accessible names;
- dialogs, drawers, and inspectors trap/restore focus correctly;
- live regions announce command outcome without hidden record text;
- Practice Mode requirement change announces requirement ID, position, and stale state but not hidden counts;
- complex grouped rows have concise accessible names rather than reading every chip;
- Client accessibility tree is generated from Client-safe projection only;
- zero serious or critical axe-core findings on all primary views and profiles;
- keyboard completion of plan review, Practice Mode capture, pause/resume, post-session review, position review, import preview, and profile switch.

## Light and dark mode

Both modes must preserve:

- state-chip contrast;
- visible focus;
- readable long requirement text;
- clear distinction among claims, Advisor observations, Evidence review, and positions;
- stale/conflict warning visibility;
- non-color origin indicators;
- table/list row boundaries without excessive visual density;
- disabled-state legibility;
- Client presentation clarity.

No mode may hide text through inherited foreground/background mismatch.

## Required UX acceptance scenarios

1. Create a 12-requirement plan, freeze it, and start Practice Mode.
2. Capture a participant claim without creating a review position.
3. Capture an Advisor observation and prove it is absent from Client DOM/a11y.
4. Link an Evidence revision, mark factual relevance, and create a follow-up request without claiming sufficiency.
5. Record conflicting client/provider responsibility claims while showing accepted Scope context separately.
6. Pause at requirement 7, reopen through encrypted recovery, review stale diagnostics, and resume at requirement 7 without duplicate drafts.
7. End the session and process every item through post-session review.
8. Record a qualified position and then change a basis claim or Evidence revision so the position becomes stale.
9. Import Workshop context with two same-requirement records and require explicit separate/convert/link treatment.
10. Publish an action or Scope candidate and preserve source/target non-mutation and receipt state.
11. Switch Advisor → Client → Reviewer → Advisor rapidly with no hidden content, counts, focus, or live-region leakage.
12. Complete the primary workflow at 1280×720 and 1024×768 with keyboard-only operation.
13. Run all primary views in light and dark mode with zero serious/critical axe-core findings.

## Deferred UX work

- authenticated remote client completion;
- multiple simultaneous facilitators;
- second-display/window presentation;
- audio/video recording or transcription;
- AI-generated questions, summaries, observations, recommendations, or conclusions;
- formal assessment or assessor workflow;
- curated Client export;
- mobile-phone optimized Practice Mode;
- advanced analytics or scoring;
- standalone Workshop retirement.

## Explicit non-claims

The Practice Review UX supports facilitated advisory work. It does not authorize production, client, FCI, or CUI data and does not establish applicability, implementation effectiveness, Evidence sufficiency, formal finding status, Met/Not Met, readiness, compliance, risk, scoring, certification, or assessment outcome.