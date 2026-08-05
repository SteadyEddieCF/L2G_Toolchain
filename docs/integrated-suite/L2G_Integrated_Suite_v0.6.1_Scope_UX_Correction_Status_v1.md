# L2G Integrated Suite v0.6.1 — Scope UX Correction Status

## Status

Implementation started for issue #146 on branch `agent/integrated-suite-v061-scope-ux-corrections`.

This correction line is limited to the still-valid Scope UX, disclosure, interaction, responsive, accessibility, and exact-version lifecycle findings from the specialist v0.6 Scope workbench handoff. It does not authorize Practice Review implementation or broaden Scope authority.

## Exact baseline

- promoted release: L2G Integrated Suite v0.6.0
- v0.6 promotion PR: #142
- v0.6 promotion merge: `3cfa31e8e5100927ca1a96221e5af715108eddd6`
- v0.6 post-promotion reconciliation merge: `1871d63ee56f0c1b197e3cc216b8a4a5897c1f91`
- v0.7 design-gate merge: `98b64a02ef1ea190267820cd999a17df6c96e815`
- current portable SHA-256: `1a06f10d874d0873b8add9cb398f980651ad605367d5fcf3dd354ce948220a46`
- governing correction issue: #146
- specialist handoff SHA-256: `cd3c46a8d615d9957e3f5d77776bedd46135c050116bf9a766abc19de91bd9a7`

## Implementation order

The correction will be implemented in authority-risk order.

### Phase 1 — Non-disclosure and projection safety

- [ ] Clear Scope selection, inspector, differences, diagram selection, import preview, cached labels/counts, focus target, and live-region state before profile changes.
- [ ] Resolve selection, related labels, inspector content, counts, diagram content, text alternatives, and accessibility-tree content only from the active projection.
- [ ] Build a Client-safe diagram view model that removes hidden nodes, edges, annotations, counts, and orphan relationships.
- [ ] Add rapid Advisor → Client → Reviewer → Client disclosure tests.

### Phase 2 — Authority-changing interaction review

- [ ] Replace native decision confirmation with a semantic Decision Review surface.
- [ ] Show exact affected refs/versions and every current → proposed field change.
- [ ] Keep asset category and Scope disposition visibly independent.
- [ ] Disable acceptance for stale, conflicted, invalid, or superseded proposals.
- [ ] Add Compare, Update proposal, Return, Supersede, Modify and accept, and Accept exact decision only where domain-valid.

### Phase 3 — Import identity and ambiguity

- [ ] Detect exact source-identity matches separately from possible same-name/context matches.
- [ ] Display source identifier/path, distinguishing values, match reason, and exact target version.
- [ ] Require Create new, Link exact existing, Keep separate, Modify and create/link, or Reject for each ambiguous record.
- [ ] Disable apply until every ambiguity is resolved.
- [ ] Preserve clone-first atomic apply and exact receipts.

### Phase 4 — Diagram lifecycle and accessible interaction

- [ ] Preserve reviewed/approved stale representations.
- [ ] Create a new draft/superseding representation on refresh with reciprocal links.
- [ ] Render or list all permitted edges.
- [ ] Add ordered Nodes and Relationships equivalents.
- [ ] Replace interactive descendants inside `role="img"` with a labelled accessible region.
- [ ] Add Fit, 100%, Zoom in/out, and Center selection as presentation-only controls.

### Phase 5 — Missing governed transitions

- [ ] Expose Unknown → Session Planner question-candidate publication with preview and acknowledgement.
- [ ] Prove zero live-agenda additions and no accepted client statement.
- [ ] Add Reviewer `Concur with changes` with exact differences/source context.
- [ ] Prevent Reviewer actions from directly mutating governed Scope objects.

### Phase 6 — Bounded usability completion

- [ ] Improve selected Boundary orientation.
- [ ] Add projection-safe Systems & Assets search/filter/grouping.
- [ ] Add provider/service responsibility, support-access, inheritance/context, unknown, flow, and decision sections.
- [ ] Add flow crossing/mechanism/direction/frequency/protection/unknown/decision detail.
- [ ] Standardize inspector sections for Overview, Relationships, Provenance, Decisions, Differences, Unknowns, History, and Actions.
- [ ] Replace remaining authority-changing native prompt/confirm dialogs.
- [ ] Add accessible tablet drawer and semantic modal behavior.
- [ ] Compress minimum-height metrics and replace numeric priority labels with factual workflow labels.
- [ ] Add explicit no-inference start actions for migrated empty Scope.

## Acceptance evidence

The release cannot be promoted until one frozen exact candidate and its unchanged final metadata head pass:

1. strict TypeScript and deterministic package validation;
2. projection-safe profile-switch and diagram non-disclosure tests;
3. exact decision-effect and stale/conflict tests;
4. same-name import ambiguity and no-auto-merge tests;
5. diagram supersession and prior-representation preservation tests;
6. Unknown publication and Reviewer disposition tests;
7. 1440×900, 1280×720, and 1024×768 light/dark workflows;
8. keyboard, focus, dialog/drawer, ordered diagram alternative, and axe-core tests;
9. Linux Chromium and native Windows Chromium `file://` with zero network and page errors;
10. encrypted save/reopen, migration, Undo/Redo, history, checkpoint, manifest, SBOM, repository validation, shared Playwright, and RG-4 regressions.

## Explicit exclusions

- no Practice Review runtime;
- no automatic boundary or applicability determination;
- no readiness, compliance, risk, scoring, certification, Evidence-sufficiency, implementation, assessment outcome, or Met/Not Met conclusion;
- no Scoper v3.12 contract identity or standalone-distribution change;
- no production, client, FCI, or CUI authorization;
- no direct mutation of accepted state in Engagement, Evidence, Pre-Engagement, Interview Sessions, SSP, Deliverables, or Reviews & Actions.
