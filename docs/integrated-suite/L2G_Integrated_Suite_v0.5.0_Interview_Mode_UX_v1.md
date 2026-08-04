# L2G Integrated Suite v0.5.0 — Interview Mode UX and Usability Handoff

## Status

Proposed v0.5-specific UX design record for issue #133. This refines the accepted suite-wide UX handoff for Pre-Engagement and Interview Sessions. It does not authorize implementation until the complete design gate merges.

## Design objective

Enable an advisor to prepare, facilitate, pause, resume, and review a structured discovery session inside the shared offline application while keeping participant statements, advisor observations, imported context, summaries, and target-domain candidates visibly distinct.

Interview Mode must reduce live-session cognitive load. It is not a compressed version of the full application and must not expose every record or technical diagnostic during facilitation.

## Primary workflow

1. Review intake state and unresolved preparation items.
2. Create or select a session.
3. Assemble a question plan from accepted question-bank items and reviewed candidates.
4. Run preflight and freeze a ready plan snapshot.
5. Start Interview Mode.
6. Capture responses and advisor notes separately.
7. Create follow-ups, parking-lot items, or candidate evidence requests under advisor control.
8. Pause/checkpoint/resume when needed.
9. End facilitation into `completed-pending-review`.
10. Complete post-session review, client-summary approval, and candidate publication.

## Information architecture

### Pre-Engagement workspace

Recommended stable views:

- **Requests** — intake requests, assignments, owners, due dates, operational state.
- **Questionnaires & Inventories** — definitions, versions, issued snapshots, completion state.
- **Submissions** — receipts, answers, review, exceptions, provenance.
- **Preparation** — unresolved inputs, session candidates, carryover questions, readiness for a specific session without any compliance/readiness claim.

The default page answers: what is missing, who owns it, what has arrived, what requires review, and what should happen next.

### Interview Sessions location

Interview Sessions appears as a stable view under Practice Review during v0.5 while its records remain a separate domain authority. Global search and Overview may route directly to a session. The user must not need to navigate through legacy Workshop terminology.

Recommended views:

- **Sessions** — planned, ready, active, paused, pending review, completed, cancelled.
- **Question Bank** — reusable question versions and origins.
- **Session Review** — responses, conflicts, summaries, follow-ups, candidates.

## Session planner

The planner uses a three-region workbench:

- left: available question candidates and filters;
- center: ordered session agenda;
- right inspector: question rationale, source context, prior answers, expected participants, history, and visibility.

Required behaviors:

- add, remove, reorder, edit session-specific wording, and defer;
- display origin labels: Scripted, Advisor-created, Source-derived, Questionnaire-derived, Suggested follow-up, Carryover, Imported;
- show stale source or changed question-version warnings;
- preview Advisor and Client presentation;
- show estimated duration as guidance only;
- preserve keyboard reordering and non-drag alternatives;
- freeze a plan only through explicit **Mark Ready** preflight.

Preflight blocks readiness for invalid references, empty required prompts, hidden-content leakage into the selected Client presentation, unresolved malformed imports, exceeded limits, or an agenda with no included items. It warns but does not automatically block for missing optional participants, unconfirmed prior statements, unresolved preparation questions, or time estimates.

## Live Interview Mode

### Layout at 1280 × 720

- compact top bar with engagement, session title, save state, profile, pause, and exit;
- collapsible agenda rail approximately 240 CSS px expanded and 64–72 px compact;
- central question stage using the largest available width;
- optional context drawer or inspector, closed by default during ordinary facilitation;
- persistent bottom action row for Previous, Defer, Follow-up, Save & Next, and agenda progress.

No oversized product hero, dashboard cards, dense multi-column table, or full technical toolbar appears in the main facilitation path.

### Current question stage

The stage displays:

- question number and total visible agenda items;
- short label and full prompt;
- origin, applicability note, and expected participants;
- optional profile-safe prior context;
- response capture;
- separate advisor observation capture;
- confirmation control;
- evidence-request/follow-up/parking-lot actions;
- clearly labeled save state.

Participant response and advisor observation must never share one unlabeled text box. Their visual distinction must not rely on color alone.

### Keyboard behavior

Minimum shortcuts:

- `Alt+J` / `Alt+K`: previous/next agenda item when focus is not inside an editor;
- `Ctrl+Enter`: save current changes without advancing;
- `Ctrl+Shift+Enter`: save and advance;
- `Alt+F`: create follow-up;
- `Alt+P`: move topic to parking lot;
- `Alt+A`: toggle agenda rail;
- `Alt+I`: open/close inspector;
- `Esc`: close transient overlay without discarding unsaved text.

Shortcuts are discoverable, remappable only in a later release, and never override browser or assistive-technology essentials.

### Progress model

Progress distinguishes:

- not visited;
- viewed;
- response captured;
- deferred;
- follow-up created;
- complete for facilitation;
- needs post-session review.

It must not use “complete” to imply the underlying CMMC practice, evidence, scope, or SSP content is complete.

### Save and recovery

Interview Mode surfaces truthful states: Saved, Saving locally, Unsaved changes, Checkpoint creating, Paused and checkpointed, Recovery available, and Save failed.

Pause is unavailable while a governed command is unresolved. A successful pause returns the checkpoint name and current agenda item. Resume returns to the same plan snapshot, agenda position, profile, and safe panel state. Unsaved editor buffers are either committed before pause or explicitly retained in encrypted recovery; the UI must never claim a checkpoint before persistence succeeds.

## Client Presentation Mode

Client Presentation Mode is activated through the existing profile control and changes the projection before render.

It presents:

- client-visible prompt and context;
- approved or client-safe participant response where allowed;
- session progress using client-safe labels;
- explicitly approved summary content;
- no advisor observation editor, internal rationale, candidate controls, hidden agenda labels, original filenames, provenance internals, exception details, or history.

Profile switching must clear selections, inspector content, prior search terms, hover previews, live-region messages, and cached counts before constructing the new projection. A brief flash of hidden content is a release-blocking defect.

The application must continue to state that Client Presentation Mode is not access control and that the complete project is not a client-distribution artifact.

## Post-session review

The post-session review is a grouped workbench, not one long transcript.

Groups:

- unconfirmed participant statements;
- advisor observations requiring disposition;
- conflicting or ambiguous records;
- facilitator summaries;
- follow-ups and parking-lot items;
- proposed decisions;
- candidates grouped by target authority;
- client-visible summary preview.

The reviewer can inspect source records side by side with a summary or candidate, then Accept for publication, Modify, Reject, Return, Withdraw, Supersede, or Leave unresolved according to target availability. Unsupported targets remain queued and visibly non-actionable.

Completing review requires explicit acknowledgment of unresolved conflicts and unconfirmed statements. It does not require forcing them into false resolution.

## Pre-Engagement interaction patterns

- Requests use list/detail with owner, due date, operational state, and review state shown separately.
- Submissions distinguish Participant-provided, Advisor-entered, Imported, and Unknown origin.
- Source-derived candidates never use client-answer styling.
- Batch review shows exact affected counts and creates a named checkpoint.
- Overdue is operational language only and never a negative assessment conclusion.
- Local reminders are clearly labeled as records that do not send email or notifications.

## Responsive behavior

- Optimal: 1440 × 900 or larger.
- Full-authoring minimum: approximately 1024 × 768.
- Interview Mode target: 1280 × 720 and tablet landscape.
- At narrower widths, the agenda becomes an overlay and the inspector becomes a full-height drawer.
- Phone is limited to read, status, simple confirmation, and follow-up review; full facilitation and planning are not target workflows.

## Accessibility requirements

Target WCAG 2.2 AA. Required validation includes:

- complete keyboard operation and logical focus order;
- visible focus and no focus loss during profile or agenda changes;
- headings, landmarks, labels, descriptions, and status announcements;
- no state communicated by color alone;
- 200% zoom and reflow at supported widths;
- reduced-motion behavior;
- minimum target sizes for tablet facilitation;
- error summary linked to invalid fields;
- screen-reader-safe progress and agenda position;
- Client projection tested in the accessibility tree, not only visually;
- no serious or critical axe-core findings on tested primary surfaces.

## Synthetic usability scenarios

Use synthetic McFirecoal records only.

1. Identify a missing questionnaire assignment within 15 seconds.
2. Review an imported answer and correctly distinguish it from participant-provided content.
3. Build a five-question session from mixed origins.
4. Detect a stale question version before marking the plan ready.
5. Conduct one question, record a participant statement and a separate advisor observation.
6. Create an evidence-request candidate without publishing it automatically.
7. Switch to Client Presentation Mode without disclosure.
8. Pause, close, reopen, unlock, and resume at the same question.
9. Complete facilitation and find all unconfirmed statements in post-session review.
10. Publish an Engagement candidate and verify Engagement governed content remains unchanged until target acceptance.
11. Leave a future Scope candidate queued without false acceptance controls.
12. Recover the agenda rail and inspector without assistance.

## Usability success criteria

- Advisors understand what record type they are creating before typing.
- The next facilitation action is evident without scanning the full application.
- Users do not confuse session completion with assessment or practice completion.
- Client profile tests reveal no advisor-only titles, content, snippets, counts, prior queries, inspector state, accessibility names, or live announcements.
- Pause/resume recovery succeeds without data loss or plan drift.
- Users can explain why a summary is not the same record as a participant statement.
- Users understand that published candidates still require target-owned acceptance.

## Deferred decisions

- optional second display/window;
- audio, video, speech-to-text, transcription, or meeting-bot integration;
- remote attendance or collaboration;
- automated question generation or answer drafting;
- final branding and animation system;
- phone facilitation;
- curated client export.
