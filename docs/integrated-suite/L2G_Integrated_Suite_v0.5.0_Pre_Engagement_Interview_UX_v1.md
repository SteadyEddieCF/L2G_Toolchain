# L2G Integrated Suite v0.5.0 — Pre-Engagement and Interview Mode UX / Prototype Handoff v1

## Status

Workflow, presentation, and focused prototype specification for v0.5.0. It becomes the implementation UX gate when the design pull request merges.

The release remains synthetic-only. This document does not authorize production, client, FCI, or CUI use and does not turn presentation profiles into security roles.

## UX objective

Provide a coherent advisor workflow for organizing intake, preparing a facilitated session, conducting one question or topic at a time, pausing/recovering safely, and reviewing the resulting records without collapsing authority or record types.

The primary workflow is:

1. **Request and track intake.**
2. **Review submissions, response origins, conflicts, and missing items.**
3. **Build a versioned question plan from reviewed context.**
4. **Start a focused Interview Mode.**
5. **Capture participant statements separately from advisor notes.**
6. **Record confirmations and follow-ups explicitly.**
7. **Pause/resume through governed checkpoints.**
8. **Review summaries and candidates after the session.**

The UI must distinguish:

- request from assignment;
- assignment snapshot from current reusable instrument;
- submission from item response;
- client response from advisor entry, imported context, source candidate, or interpretation;
- question bank record from frozen plan item and live session question;
- participant statement from advisor note;
- statement from confirmation;
- raw records from facilitator/client summary;
- session completion from post-session review closure;
- candidate publication from target acceptance;
- agenda progress from quality/readiness/compliance.

## Workspace placement

### Pre-Engagement workspace views

- **Intake Overview**
- **Requests**
- **Questionnaires & Inventories**
- **Submissions & Responses**
- **Exceptions & Conflicts**
- **Meeting Preparation**

### Practice Review workspace views used by v0.5

- **Session Planner**
- **Interview Sessions**
- **Post-Session Review**

v0.5 does not migrate authoritative Practice Review conclusions. The Practice Review workspace hosts the session workflow while Interview Sessions remains its own governed domain.

## Pre-Engagement UX

### Intake Overview

The landing view answers:

- What has been requested?
- What is due or overdue?
- What has been received?
- What needs clarification or review?
- What conflicts exist?
- Is enough factual preparation complete to plan the next meeting?

Primary regions:

1. Recommended next intake task.
2. Requested/received/missing summary using profile-safe factual counts.
3. Due-soon and overdue requests.
4. Exceptions/conflicts requiring judgment.
5. Session-preparation summary.
6. Recent meaningful changes.

Do not use equal-weight KPI cards or a readiness percentage. “Intake completeness” is a transparent checklist/count view only.

### Request workbench

Use a list/detail pattern.

List/card content:

- request title and kind;
- assigned participant/organization display labels;
- due date;
- operational state;
- review state;
- visibility;
- received/required factual item summary;
- exception/conflict indicator;
- last meaningful change.

Detail editor:

- purpose/description;
- owner/facilitator;
- participant/organization references from Engagement;
- due date;
- related instrument/assignment/submission;
- source/provenance;
- permitted transition actions;
- history.

Primary actions depend on state: Assign, Record receipt, Request clarification, Mark satisfied with rationale, Cancel, Supersede, Open inspector.

Client View receives only requests explicitly visible to that presentation. Hidden request counts and due-state categories do not leak.

### Questionnaire and inventory experience

The advisor can:

- create or select a reusable instrument;
- organize bounded sections/items;
- preview the exact client-facing assignment snapshot;
- assign to Engagement participants/organizations;
- set due date and instructions;
- publish the immutable assignment snapshot;
- compare a stale assignment to a newer instrument version;
- create a new assignment/snapshot rather than rewriting prior answers.

Instrument editor shows:

- stable item label/ID in Advanced context;
- prompt and client-safe help;
- value type/options;
- required/applicability state;
- origin/source;
- visibility;
- version.

The normal path is content-focused. Technical snapshot hash, exact schema identity, and raw imported IDs remain in inspector/Advanced diagnostics.

### Submission and response review

Use explicit origin chips and accessible text:

- Client-provided
- Advisor entered on behalf
- Source-derived candidate
- Imported context
- Advisor interpretation

Never rely on color alone and never present the latter four as client answers.

A response review card shows:

- prompt snapshot/version;
- current response/value;
- asserted submitter/recording method;
- origin;
- received date;
- review/currency state;
- source/provenance;
- related conflicting values;
- permitted dispositions.

Conflict view presents side-by-side or three-way comparison where available. Actions include Keep current, Create superseding response, Merge into a new reviewed response, Defer, and Close with rationale. No last-write-wins behavior.

### Intake completeness

Show a checklist with exact contributing facts such as:

- required questionnaire assignments received;
- required inventory assignments received;
- required responses missing;
- primary participant roles identified;
- material missing submissions identified;
- source-derived candidates reviewed enough for the session plan;
- unresolved conflicts acknowledged;
- meeting agenda prepared.

Use labels such as Complete, Incomplete, Needs review, Waiting, or Not applicable with rationale. Do not display CMMC-ready, compliant, evidence sufficient, risk score, certification probability, or readiness percentage.

## Session Planner

### Planner header

- session title and purpose;
- date/time and estimated duration;
- facilitator;
- expected participants/roles;
- plan lifecycle/currency state;
- active presentation profile;
- primary action: Publish plan or Start session.

Start is unavailable until a valid published snapshot exists. A stale/conflicting plan displays Compare, Retain with acknowledgement, and Create refreshed plan actions.

### Three-region desktop layout

#### Left — Agenda builder

- topic groups;
- ordered plan items;
- included/excluded state;
- estimated time;
- expected participant/role;
- origin label;
- unresolved/source-warning indicator;
- move up/down and drag/reorder controls.

#### Center — Question plan

Selected question editor/preview:

- topic;
- origin;
- exact version;
- prompt;
- client-safe explanation;
- rationale;
- expected participants;
- applicability note;
- source basis;
- include/exclude;
- save as new question version where needed.

#### Right — Preparation inspector

Context tabs as applicable:

- Source & provenance
- Questionnaire answers
- Evidence references
- Prior statements
- Engagement questions/decisions
- Open intake exceptions
- Follow-ups
- History/differences

The inspector does not display every tab for every question.

### Suggested questions

Suggested/source-derived questions appear in a review tray containing:

- origin and basis;
- why it may be useful;
- proposed prompt;
- client-safe explanation if available;
- source refs;
- Edit and accept;
- Accept;
- Ask now only during an active session;
- Save for later;
- Dismiss.

Suggestions never enter the plan/agenda, create a governed question, advance progress, or appear in Client Presentation Mode without advisor action.

### Session preparation check

Use a practical checklist, not readiness/compliance:

- valid published plan snapshot;
- required participants identified;
- included questions reviewed;
- client-safe explanations available for shared questions;
- Advisor-only material excluded from Client presentation;
- stale/conflicting sources acknowledged;
- no other active/paused session;
- local save/recovery available.

## Live Interview Mode

Interview Mode is a dedicated application state, not ordinary Practice Review with more fields.

### Reduced top bar

Keep visible:

- session title/current topic;
- lifecycle and factual progress;
- elapsed-time hint;
- local save state;
- Undo/Redo in a compact fixed cluster;
- Pause/Resume;
- Advisor/Client presentation switch;
- End session;
- Help/shortcuts.

The global workspace rail is replaced by or reduced to session-specific navigation. It restores after exit.

### Desktop layout

#### Left — Agenda rail, approximately 240–280 CSS px

- attendee summary;
- topic groups;
- completed/current/upcoming/deferred/skipped states;
- quick jump;
- unresolved count;
- “7 of 18 planned questions” progress;
- no score or percent quality indicator.

#### Center — Question stage

Header:

- topic/practice-context label without asserting a conclusion;
- origin/version;
- prompt;
- client-safe explanation;
- selected evidence expectation/context label.

Editors:

1. **Participant response/statement** — clearly labeled with asserted speaker and recording method.
2. **Advisor-only notes** — visually and semantically separate; persistent Advisor-only label.
3. Optional structured helpers only when they do not misrepresent free-form statements.
4. Confirmation control bound to the exact statement version.
5. Unresolved/defer marker and rationale.

Bottom action strip:

- Previous
- Next
- Defer
- Skip/reorder
- Add reviewed follow-up
- Create evidence-reference request proposal
- Create action proposal
- Create blocker proposal
- Discuss responsibility
- Add parking-lot item

Next/Previous navigate only. They never save invalid drafts silently, mark quality, confirm, publish, or conclude.

#### Right — Context inspector

Advisor tabs as relevant:

- Context
- Sources
- Intake responses
- Prior statements
- Evidence
- Engagement context
- Follow-ups
- History

It defaults open on desktop Advisor View and can collapse. Client View receives a separately constructed client-safe context panel, not a CSS-hidden Advisor inspector.

### Dynamic follow-up tray

Each proposed follow-up shows basis/origin, editable text, expected participant, and actions: Accept into agenda, Ask now, Save for later, Dismiss. No automatic insertion or progression.

### Keyboard behavior

Required examples:

- `Alt+Left` / `Alt+Right` or documented equivalents for Previous/Next when focus is not in an editor;
- shortcut for Pause;
- shortcut to focus participant response;
- shortcut to focus Advisor notes in Advisor View;
- shortcut to open agenda/context drawer;
- Escape closes overlay drawers/dialogs;
- move up/down alternatives for reorder.

Shortcuts never fire while typing in text controls and never bypass validation/confirmation.

## Client Presentation Mode

The shared-screen presentation may include:

- session title/current topic;
- current question;
- client-safe explanation;
- deliberately selected approved diagram/reference/context;
- client-visible response/statement editor/display;
- exact-version confirmation control and plain-language qualification;
- agreed client-visible action/evidence-reference/follow-up summary;
- factual agenda progress.

Hidden before construction:

- raw advisor notes;
- advisor interpretations not explicitly summarized/reviewed;
- imported-context internals;
- internal source conflicts;
- source-derived/suggested questions not accepted for presentation;
- rejected/deferred candidates;
- confidence/heuristics;
- internal provenance/package IDs;
- review comments;
- target candidate queues;
- hidden participants/counts;
- internal history.

Client View is built from a profile-safe projection before render, count, search, inspector, focus restoration, and accessibility-tree creation. Switching profile clears incompatible search/results/inspector/editors/dialogs/focus before Client render.

A persistent help/switch qualification states that Client Presentation Mode is a presentation aid, not access control or a client-safe project export. The qualification must not obstruct live facilitation.

## Pause and resume

Pause:

1. validates current response/note drafts;
2. atomically commits valid drafts;
3. records current question, live order, unresolved state, elapsed hint, and lifecycle;
4. creates a named checkpoint/history event;
5. shows “Session paused — saved locally” only after success.

Invalid draft fields block Pause with a linked error summary and explicit “No governed data changed.” Pause never publishes candidates, approves summaries, confirms statements, or closes follow-ups.

Resume returns to the same valid active question and restores safe presentation state. It does not duplicate drafts or elapsed time. If recovery and last-saved states materially differ, the user compares/chooses before resuming.

## End session and post-session review

End Session requires explicit confirmation and shows unresolved/deferred/open follow-up counts. Completion preserves them and creates a checkpoint.

Post-session review groups:

1. Participant statements
2. Statements needing confirmation/correction
3. Advisor interpretations/notes
4. Unresolved/deferred questions
5. Evidence-reference requests
6. Action/blocker proposals
7. Responsibility discussions
8. Parking-lot items
9. Candidate proposals by target
10. Draft facilitator summary
11. Draft client-visible summary

The advisor reviews each group separately. No summary is approved and no candidate is published merely because the session completed.

A client-visible summary editor shows source traceability and an explicit “Approve for client presentation” action only after review. Raw notes remain separate and Advisor-only.

## Responsive behavior

### 1366×768 Advisor minimum

- reduced top bar;
- agenda rail remains usable or compact;
- current prompt, both editor labels, primary controls, save state, and Pause stay visible without page-level horizontal overflow;
- inspector may collapse.

### 1280×720 Client presentation

- question and client-safe explanation are dominant;
- selected context is bounded;
- response/confirmation and agreed follow-ups remain readable;
- no tiny diagnostics or dense tables.

### Tablet landscape

- agenda is an overlay drawer;
- central question stage is primary;
- context is a separate overlay drawer;
- one drawer at a time;
- frequent targets are at least 44×44 CSS px;
- no hover-only controls;
- portrait mode may support client presentation/review but recommends landscape for facilitation.

Phone is not a full Interview Mode authoring target.

## Accessibility

Target WCAG 2.2 AA for all primary routes.

- semantic header/navigation/main/complementary regions;
- visible focus in light/dark mode;
- logical heading hierarchy;
- current agenda/question state programmatically exposed;
- keyboard operation for every action;
- no color-only state;
- editor labels include record type and visibility;
- origin information is available to screen readers;
- polite live regions for save, pause/resume, profile switch, question change, candidate disposition, and session end;
- no announcement on every keystroke;
- focus trap/restoration for overlays/dialogs;
- profile switch moves focus to a safe status/workspace heading after projection reconstruction;
- 200% zoom without loss of primary controls/content;
- reduced-motion support;
- errors identify affected field and whether governed data changed.

## Focused synthetic prototype

Before implementation promotion, validate a focused prototype using synthetic McFirecoal-style data covering:

- Intake Overview with missing/overdue/conflicting submissions;
- questionnaire assignment snapshot and stale-version comparison;
- response-origin comparison and conflict disposition;
- Session Planner with mixed question origins;
- stale plan review;
- live Advisor Interview Mode;
- separate participant statement and Advisor note;
- reviewed dynamic follow-up;
- Client Presentation Mode;
- exact-version confirmation;
- pause/reload/recovery/resume;
- post-session grouping and client-summary review;
- target candidate publication without target accepted mutation.

### Usability tasks

An advisor should be able to:

1. find missing intake submissions;
2. distinguish response origins;
3. resolve a conflict without overwrite;
4. build a five-question mixed-origin plan;
5. identify and handle plan staleness;
6. capture a statement and separate note;
7. add a reviewed follow-up;
8. switch to Client Presentation Mode without leakage;
9. record an exact-version locally asserted confirmation;
10. pause and resume at the same question;
11. complete while retaining deferred/open work;
12. review a client summary without losing raw records;
13. publish a target candidate without accepted target mutation;
14. recover the agenda/inspector without assistance.

### Success criteria

- eight-workspace model remains understandable without legacy module knowledge;
- next action is clear;
- request/assignment/submission/response distinctions are understood;
- statement/note/confirmation/summary/candidate distinctions are understood;
- suggestions are understood as Advisor-controlled;
- Client profile exposes no Advisor-only content in any tested path;
- pause/resume is trusted and deterministic;
- progress is understood as agenda progress, not quality/readiness;
- stale plans and open follow-ups are visible/actionable;
- inspector reduces navigation rather than adding another form.

## Explicit exclusions

- production/client/FCI/CUI authorization;
- email delivery, client portals, accounts, authenticated identity, collaboration, cloud sync, or security roles;
- microphone/camera, audio/video recording, speech recognition, automated transcription, or meeting bots;
- AI-generated answers/summaries, hidden scoring, automatic applicability, automatic question promotion, or automatic conclusions;
- authoritative Scope, Practice Review, SSP, Deliverables, readiness, compliance, risk, evidence sufficiency, certification, implementation, or Met/Not Met;
- second-display/window support;
- full phone authoring;
- final visual branding.
