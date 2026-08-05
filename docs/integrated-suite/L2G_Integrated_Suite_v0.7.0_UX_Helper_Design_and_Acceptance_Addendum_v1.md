# L2G Integrated Suite v0.7.0 — UX Helper Design and Acceptance Addendum

## Status

Binding design-gate addendum for issue #143 and PR #145. This record incorporates the reusable findings from the specialist v0.6 Scope implementation review into the future Practice Review vertical slice.

This record does not authorize implementation. It supplements ADR-0012, the Practice Review contract, UX record, threat model, Workshop compatibility posture, and acceptance matrix. If a conflict exists, the more restrictive authority, non-disclosure, atomicity, accessibility, or compatibility requirement governs until the authoritative development chat resolves it.

## Source and current-release routing

- specialist handoff: `L2G_Integrated_Suite_v0.6_Scope_Workbench_UX_Implementation_Review.md`
- handoff SHA-256: `cd3c46a8d615d9957e3f5d77776bedd46135c050116bf9a766abc19de91bd9a7`
- handoff reviewed older v0.6 candidate head: `3852e59433fe2a0d071ac2cb5a826625820e75a2`
- handoff reviewed older artifact SHA-256: `8da327d3ffbc7a7f03a2f3496371921cd41d3ca9601cbc461f9e5a6f13208c09`
- promoted v0.6 final metadata head: `6e33079575e3ecc0b5d3043ba9b0d440e858b2e8`
- promoted v0.6 portable SHA-256: `1a06f10d874d0873b8add9cb398f980651ad605367d5fcf3dd354ce948220a46`
- separately bounded current-release correction route: issue #146

The helper's old missing-browser-CI blocker was satisfied before v0.6 promotion. The remaining current-release findings are not hidden in this addendum; they are routed to issue #146.

## Shared interaction requirements

### 1. Projection-first derived UI

For Advisor, Reviewer, and Client profiles, build the active profile projection before any:

- counts or summary metrics;
- search index or filter options;
- selected-record resolution;
- inspector, comparison, differences, or history model;
- source or related-record label lookup;
- next-work computation shown to the user;
- diagram, relationship map, or accessible alternative;
- focus target or live-region announcement;
- export or accessibility-tree content.

A renderer must never recover a hidden label or relationship from canonical state after projection filtering.

### 2. Profile-switch transaction

Changing presentation profile is one UI-state transaction. Before the new profile renders, clear or rebuild:

- selected requirement, work item, source record, claim, observation, Evidence review, question, gap, recommendation, action, blocker, responsibility discussion, provider follow-up, review position, candidate, and receipt;
- inspector and differences state;
- Practice Mode transient editor state that is not yet governed;
- search results and filter values that reveal hidden categories or counts;
- cached labels, relationship summaries, history summaries, and accessible alternatives;
- focus target and queued live-region content;
- open non-authoritative preview surfaces.

Restore focus only to a visible element in the new projection, normally the workspace heading, selected visible row, or first valid workspace control.

### 3. Structured effect review

Every authority-changing or target-publication action uses an application review surface, not a native prompt or generic confirmation. The review must show:

- exact affected record IDs and versions;
- current and proposed values by field or record family;
- source basis and provenance;
- assumptions, unknowns, blockers, conflicts, and stale refs;
- target authority and exact records that may be created or changed;
- atomic no-partial-mutation statement;
- what the command explicitly does not change;
- available state-valid actions such as Accept, Modify and accept, Return, Reject, Withdraw, Supersede, or Cancel.

Stale, conflicted, invalid, or unauthorized actions are disabled before submission with a factual explanation and a Compare or Update path.

### 4. Separate semantic dimensions and record families

Do not combine category, disposition, lifecycle, operational state, review state, currency, candidate state, receipt state, responsibility, provider context, or qualified review position into one generic status.

For Practice Review, claims, imported Workshop context, Advisor observations, Evidence reviews, questions, gap observations, recommendations, actions, blockers, responsibility discussions, provider follow-ups, review positions, target candidates, and receipts remain separate editors, records, lists, counts, and histories.

### 5. Import identity and ambiguity

Workshop or other compatible imports must distinguish:

- exact stable-identity match;
- deterministic possible match;
- same-name or same-label ambiguity;
- distinct record with similar presentation text;
- no match.

The preview shows package kind/version, producer, size, SHA-256, source path, source stable identity, distinguishing fields, proposed exact target version, match rationale, warnings, and diagnostics.

No name-based auto-merge is permitted. Every ambiguous record requires one explicit supported treatment before Apply. The receipt records the reviewed per-record treatment and exact target refs. Apply remains clone-first, atomic, and no-partial-mutation.

### 6. Exact-version comparison and supersession

When an accepted proposal, reviewed context, plan item, Evidence ref, Scope ref, Workshop import, or representation becomes stale:

- show the exact expected and current versions;
- explain the changed fields or relationship;
- disable actions that require the prior exact version;
- preserve the prior reviewed/accepted historical record;
- create a new draft/version or reciprocal supersession through the domain-authorized command;
- never silently rewrite an exact historical representation.

### 7. Semantic dialogs and drawers

Authority-changing reviews and import applies use semantic modal dialogs with labelled purpose, validation, Escape behavior, focus containment, background inertness, and deterministic focus restoration.

At tablet landscape, inspectors use an explicit accessible drawer model. Background interaction, focus behavior, and close semantics must match whether the drawer is modal or non-modal. No fixed visual overlay may impersonate a dialog without dialog behavior.

### 8. Compact minimum-height layout

At 1280×720 and 1024×768:

- the workspace title, current task, first meaningful record, and primary valid action are visible without page-level horizontal scrolling;
- factual metrics collapse to a compact summary rather than occupying dashboard-height space;
- long safety qualifications remain available while a short visible qualification persists;
- inspector/drawer and Practice Mode controls do not obscure required actions;
- no oversized hero or decorative dashboard displaces the working surface.

### 9. Factual next work without score-like numbers

Do not expose internal numeric priorities as user-facing `Priority N`, readiness, risk, maturity, or scoring. Use factual labels such as Blocking, Do next, Follow up, Waiting, or Informational and state the deterministic reason for ordering.

### 10. Keyboard and accessibility parity

Provide logical heading/landmark structure, visible focus, meaningful row names, keyboard list navigation, Enter to inspect, Escape to close, and shortcuts only when discoverable and conflict-free.

Any relationship or visual representation has an ordered keyboard-operable list equivalent. Interactive controls must not be nested inside an inappropriate `role="img"`. State is communicated by text and semantics, not color alone.

### 11. Reviewer middle disposition

Where the approved domain supports it, Reviewer View provides Concur, Concur with changes, Return, and Reject. Concur with changes shows the exact proposed modifications and does not directly edit the target-owned accepted record.

### 12. Target-publication acknowledgement

Publishing a question, action, recommendation, gap, blocker, or other target candidate must confirm:

- target authority;
- exact source refs;
- one candidate/receipt identity;
- no automatic acceptance in the target;
- no live agenda/session insertion unless separately authorized;
- no source accepted-state mutation beyond an approved reciprocal link/receipt.

## Practice Review-specific application

The future v0.7 runtime must apply the shared requirements as follows:

1. Practice Mode is one requirement at a time and keeps claim, observation, Evidence review, question, gap, recommendation, action, blocker, responsibility, provider follow-up, and qualified-position capture visibly separate.
2. Switching profile or leaving Practice Mode clears ungoverned editor state or requires an explicit Save draft / Discard choice; hidden content may not survive into Client or Reviewer presentation.
3. Workshop imports are low-authority context and receive exact identity/ambiguity treatment before conversion to local Practice Review records.
4. Evidence and Scope refs are projection-safe, exact-version, read-only context. Their presence is never presented as Evidence sufficiency, implementation, applicability, readiness, or a formal finding.
5. Provider authorization, inherited context, contract context, responsibility discussion, and support-access statements remain assertions or context until a Practice Review-owned qualified position is explicitly created.
6. Mandatory post-session review presents each captured family separately and shows exact changes before acceptance.
7. Client View never exposes Advisor-only notes, imported internal labels, hidden counts, source paths, stale-difference details, provider-internal comments, or accessibility-tree text.
8. Reviewer View is read-only for governed Practice Review content except explicit reviewer disposition commands and comments.
9. Practice Review empty migration states state that nothing was inferred and provide bounded start actions without auto-populating requirements, plans, sessions, claims, Evidence reviews, positions, or conclusions.

## Exact acceptance addendum

These tests supplement the main v0.7 acceptance matrix and are mandatory.

| ID | Scenario | Required result |
|---|---|---|
| UXH-001 | Select an Advisor-only record, open inspector/differences, then switch Advisor → Client → Reviewer → Client | Hidden label, ID, provenance, relationship, count, history, difference, live-region, focus, and accessibility-tree text never appears; focus lands on a visible target. |
| UXH-002 | Open Practice Mode with unsaved Advisor-only capture, then switch profile or leave the mode | Explicit Save draft / Discard behavior; no hidden editor content persists into another profile or DOM. |
| UXH-003 | Review a target-publication command | Exact source versions, target authority, proposed target record, atomic effects, exclusions, and Cancel/valid actions are visible before mutation. |
| UXH-004 | Make a source ref stale before an acceptance/publication command | Acceptance is disabled; exact expected/current versions and differences are shown; Update/Supersede path preserves history. |
| UXH-005 | Import two same-name Workshop records, one exact match and one distinct | No auto-merge; Apply disabled until explicit per-record treatment; exact receipt records separate outcomes and target refs. |
| UXH-006 | Open import and authority-changing dialogs at 1440×900, 1280×720, and 1024×768 | Semantic dialog behavior, no obscured actions, Escape/focus containment/restoration, and no page-level horizontal overflow. |
| UXH-007 | Open inspector at 1024×768 | Correct drawer semantics, keyboard close, background behavior, focus restoration, and primary task remains reachable. |
| UXH-008 | Review qualified Practice Review positions and provider/responsibility context | Separate record families and dimensions remain visible; no implementation, inheritance, sufficiency, readiness, compliance, risk, score, or Met/Not Met inference. |
| UXH-009 | Reviewer uses Concur with changes | Exact modifications and source versions are recorded; governed target content is not directly edited; history and receipts remain valid. |
| UXH-010 | Publish a question/action/recommendation candidate | Exactly one target candidate/receipt; zero automatic target acceptance or live-session insertion; source accepted state unchanged except allowed reciprocal link. |
| UXH-011 | Filter/search large Practice Review datasets | Search/filter options and counts derive only from active projection; same-name rows remain distinguishable by safe identity/context. |
| UXH-012 | Render minimum-height desktop and tablet light/dark states | Current task, first record, primary action, qualification, focus, warning/error/stale/conflict states remain visible and understandable without page-level horizontal scroll. |
| UXH-013 | Keyboard-only full workflow | All primary lists, inspector, Practice Mode, dialogs, post-session review, candidate publication, and reviewer actions are operable without pointer-only controls. |
| UXH-014 | Client accessibility/non-disclosure matrix | Zero serious/critical axe findings and zero hidden content in DOM, accessible names, live regions, relationship alternatives, or focus order. |
| UXH-015 | Frozen candidate and unchanged metadata head | Dedicated Linux Chromium, native Windows Chromium `file://`, shared Playwright, visual evidence, repository validation, deterministic packaging, SBOM/manifest, public hygiene, and compatibility regressions all pass on the exact heads. |

## Evidence expectations

The future implementation must upload exact-head evidence for:

- 1440×900, 1280×720, and 1024×768;
- light and dark modes;
- Advisor, Reviewer, and Client profiles;
- populated, empty, warning, validation-error, stale, conflict, paused-session, and recovery states;
- keyboard, focus, dialog/drawer, live-region, and accessibility-tree behavior;
- native Windows Chromium `file://`;
- zero runtime network dependencies and no page/CSP errors;
- encrypted save/reopen, migration, checkpoint, Undo/Redo, and interrupted-session recovery;
- frozen Workshop v79.1 and SSP/package routes.

## Non-authority statement

These requirements improve comprehension, disclosure safety, accessibility, and interaction evidence. They do not change Practice Review authority, create formal assessment conclusions, merge record families, authorize automatic imports or target acceptance, weaken exact-version or atomicity rules, or authorize production, client, FCI, or CUI data.
