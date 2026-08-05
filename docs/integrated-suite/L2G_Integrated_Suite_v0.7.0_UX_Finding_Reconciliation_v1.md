# L2G Integrated Suite v0.7.0 — UX Finding Reconciliation

## Status

Awaiting the temporary Scope UX helper handoff. This record is part of draft PR #145 and must be completed before the design gate may merge.

## Purpose

Provide one durable, auditable place to classify and resolve findings from the v0.6 Scope implementation review and determine whether each finding:

1. blocks the promoted v0.6 runtime and requires a separately bounded correction;
2. is a reusable shared-shell or interaction rule for v0.7;
3. is specific to Practice Review design;
4. is safe to defer beyond v0.7;
5. is rejected because it conflicts with authority, security, compatibility, accessibility, or release boundaries.

Chat discussion alone is not sufficient evidence of reconciliation.

## Source handoff identity

Complete after the helper returns:

- source thread/title:
- review date:
- repository baseline inspected:
- v0.6 implementation/release inspected:
- PR/artifact/screenshots inspected:
- reviewer assumptions and limitations:
- exact handoff text or durable attachment reference:

## Classification values

### Severity

- **Release blocker** — material v0.6 usability, disclosure, accessibility, authority, startup, or data-integrity defect that makes continued reliance unsafe or prevents a primary workflow.
- **Important correction** — high-value correction that should be considered before or alongside v0.7 but does not invalidate the current release boundary.
- **Post-v0.7 improvement** — useful but outside the bounded v0.7 design or promotion gate.
- **Strength to preserve** — implemented pattern that should remain explicit in future work.

### Disposition

- `v0.6-correction-issue`
- `v0.7-shared-pattern`
- `v0.7-practice-review-specific`
- `defer-post-v0.7`
- `already-satisfied`
- `reject-authority-conflict`
- `reject-security-or-disclosure-conflict`
- `reject-compatibility-conflict`
- `reject-out-of-scope`

### Change boundary

- presentation/copy only;
- interaction/state presentation;
- accessibility/focus/semantic structure;
- responsive layout;
- profile projection/non-disclosure;
- application shell/shared component;
- domain contract/authority escalation required;
- compatibility/contract change required;
- release/security posture change required.

Any finding that requires one of the final three change boundaries must be escalated to the authoritative development chat and cannot be accepted as a simple UX correction.

## Reconciliation table

Add one row per distinct finding. Do not combine findings that have different severity, affected profile, authority effect, or acceptance test.

| Finding ID | Source priority | Severity | Affected view/workflow/profile | Exact observed behavior | Advisor/Reviewer/Client impact | Recommended correction | Change boundary | Disposition | Design records updated | Acceptance test | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| UX-001 | Pending | Pending | Pending | Pending helper handoff | Pending | Pending | Pending | Pending | Pending | Pending | Awaiting review |

## Required review categories

Every helper finding must be checked against these categories even when the handoff does not use the same terminology.

### Shell and orientation

- workspace entry and initial orientation;
- left-rail and subnavigation clarity;
- top-bar density and release/profile state;
- factual next-work presentation;
- migration and empty-state comprehension;
- avoidance of oversized hero areas or decorative dashboards.

### State and authority comprehension

- object versus decision authority;
- category versus disposition;
- proposed versus accepted versus stale versus superseded;
- source candidate versus target-owned record;
- imported context versus local authority;
- representation/diagram state versus object authority;
- qualified Practice Review position versus formal assessment outcome.

### List, detail, and inspector

- information hierarchy;
- row density and scanability;
- grouping and filtering;
- selected-state visibility;
- inspector consistency;
- source/provenance readability;
- exact version and stale/conflict explanation;
- mobile/tablet drawer behavior.

### Decision and candidate workflows

- effect preview;
- Accept/Modify/Return/Reject/Withdraw/Supersede semantics;
- conflict blocking;
- post-command orientation;
- destructive-action safeguards;
- source/target receipt comprehension;
- batch-operation constraints.

### Import review

- package identity and SHA visibility;
- duplicate and ambiguity comprehension;
- per-record treatment;
- selected/unselected clarity;
- exact atomic effects;
- error/no-mutation messaging;
- path/content/security diagnostics.

### Diagram and visual representation

- governed object/version identity;
- draft/reviewed/approved/stale/superseded state;
- node/edge to record navigation;
- refresh/supersession comprehension;
- Client disclosure;
- useful accessible alternative;
- keyboard/list equivalent.

### Profile and disclosure

- Advisor/Reviewer/Client distinctions;
- hidden record and hidden count leakage;
- inspector/search/history/focus/live-region/a11y clearing;
- Client-safe label and summary quality;
- persistent profile-not-access-control qualification;
- rapid profile switching.

### Practice Mode and facilitation

- one-requirement-at-a-time orientation;
- separate capture-family editors;
- participant claim attribution;
- Evidence factual-state comprehension;
- provider/responsibility context;
- Pause/Resume/End/Complete semantics;
- post-session review workload;
- keyboard and facilitator cognitive load.

### Responsive and visual modes

- 1440×900;
- 1280×720;
- 1024×768 tablet landscape;
- inspector/drawer behavior;
- primary-action visibility;
- horizontal overflow;
- light/dark contrast;
- visible focus;
- non-color state cues.

### Accessibility

- headings and landmarks;
- tablist/navigation semantics;
- accessible row names;
- dialog/drawer focus trap and restoration;
- live regions;
- keyboard parity;
- Client accessibility-tree non-disclosure;
- zero serious/critical axe-core findings.

## v0.6 correction routing

For each accepted `v0.6-correction-issue` finding, record:

- correction issue number:
- correction PR number:
- exact v0.6/current-main baseline:
- included and excluded scope:
- whether the v0.6 release pointer or artifact identity changes:
- dedicated regression tests:
- relationship to PR #145:

A v0.6 correction must remain separately bounded. It must not be hidden inside the v0.7 design or future implementation.

## v0.7 design update routing

For each accepted v0.7 finding, identify every updated record:

- ADR-0012;
- Practice Review contract;
- Practice Review UX record;
- threat model;
- Workshop compatibility posture;
- acceptance matrix;
- decision/risk register;
- root/planning README;
- roadmap;
- PR #145 body;
- issue #143 comment.

A finding is not resolved merely because it appears in this table. The governing design and exact acceptance test must be updated.

## Authority and safety rejection rules

Reject or escalate any recommendation that would:

- collapse claim, observation, Evidence review, gap, recommendation, action, blocker, responsibility discussion, provider follow-up, or review-position families;
- use one generic status for lifecycle, review, currency, candidate, receipt, and authority state;
- treat Evidence presence/relevance as sufficiency or implementation;
- turn provider authorization, contract, or responsibility context into automatic implementation or inheritance authority;
- create automatic or hidden Met/Not Met, readiness, compliance, risk, score, certification, or assessment conclusions;
- allow imports or generated suggestions to auto-apply;
- let Practice Review directly mutate Evidence, Scope, SSP, Deliverables, or Reviews & Actions accepted state;
- present Client View as access control or a safe project export;
- weaken strict package validation, atomic apply, encrypted persistence, zero-network, public-hygiene, or standalone compatibility requirements;
- authorize production, client, FCI, or CUI data.

## Completion criteria

This reconciliation is complete only when:

1. every helper finding has a unique row and disposition;
2. every accepted release blocker has a separately bounded route;
3. every accepted v0.7 finding appears in the governing design record and an exact acceptance test;
4. every rejected finding includes a clear authority/security/compatibility/scope rationale;
5. strengths to preserve are reflected in the Practice Review UX/acceptance records where relevant;
6. root/planning/roadmap/risk records reflect the final reviewed design package;
7. PR #145 has no unresolved review threads;
8. exact-head CI passes after the final reconciliation;
9. PR #145 remains unmerged until these criteria are met.

## Current disposition summary

- helper handoff received: **No**
- release blockers identified: **Pending**
- v0.6 correction route required: **Pending**
- v0.7 shared-pattern findings accepted: **Pending**
- v0.7 Practice Review-specific findings accepted: **Pending**
- deferred findings: **Pending**
- rejected findings: **Pending**
- design gate ready to merge: **No**
