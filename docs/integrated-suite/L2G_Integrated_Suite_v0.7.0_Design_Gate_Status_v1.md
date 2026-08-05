# L2G Integrated Suite v0.7.0 — Design Gate Status

## Status

Draft design gate under issue #143 and PR #145. This record does not authorize implementation.

## Exact baseline

- current Integrated Suite release: `0.6.0`
- v0.6 promotion PR: #142
- v0.6 promotion merge: `3cfa31e8e5100927ca1a96221e5af715108eddd6`
- v0.6 post-promotion reconciliation merge: `1871d63ee56f0c1b197e3cc216b8a4a5897c1f91`
- v0.6 fully validated final metadata head: `6e33079575e3ecc0b5d3043ba9b0d440e858b2e8`
- v0.6 portable HTML SHA-256: `1a06f10d874d0873b8add9cb398f980651ad605367d5fcf3dd354ce948220a46`
- standalone product/runtime compatibility baseline: `85d6e783a250b373cd4b9ea356e4c341336f9259`
- standalone Workshop baseline: v79.1, independently distributable
- design branch: `agent/integrated-suite-v07-practice-review-design`
- design PR: #145

## Current design package

1. `docs/architecture/adr/ADR-0012-canonical-practice-review-authority.md`
2. `docs/integrated-suite/L2G_Practice_Review_v1_Contract_v1.md`
3. `docs/integrated-suite/L2G_Integrated_Suite_v0.7.0_Practice_Review_UX_v1.md`
4. `docs/integrated-suite/L2G_Integrated_Suite_v0.7.0_Threat_Model_v1.md`
5. `docs/integrated-suite/L2G_Integrated_Suite_v0.7.0_Workshop_Compatibility_v1.md`
6. `docs/integrated-suite/L2G_Integrated_Suite_v0.7.0_Acceptance_v1.md`

The design proposes:

- canonical `l2g_practice_review_v1` version `1.0` authority at `domains/practice-review.json`;
- profile-safe `l2g_practice_review_projection_v1` version `1.0`;
- exact identity for the authoritative 110-requirement catalog;
- immutable review plans and plan versions;
- at most one in-progress or paused Practice Review session;
- one-requirement-at-a-time Practice Mode;
- mandatory post-session review;
- separate claims, imported context, Advisor observations, Evidence reviews, questions, gap observations, recommendations, actions, blockers, responsibility discussions, provider follow-ups, qualified review positions, target candidates, and receipts;
- exact read-only Scope and Evidence context;
- target-owned cross-domain candidate publication;
- strict Workshop v79.1 compatibility without changing current routes;
- Client and Reviewer projection before all derived UI work;
- empty-domain migration from earlier valid projects;
- no automatic or hidden formal assessment conclusion.

## UX helper dependency

The active v0.6 Scope UX helper review is a required input before PR #145 may merge.

The helper may identify bounded corrections or reusable rules for:

- shell orientation and workspace navigation;
- list/detail/inspector hierarchy;
- state-chip density and terminology;
- decision/candidate review workflows;
- diagram and accessible-alternative presentation;
- import preview and ambiguity handling;
- Advisor, Reviewer, and Client disclosure behavior;
- 1440×900, 1280×720, and tablet-landscape layouts;
- keyboard navigation, focus restoration, live regions, and accessibility;
- light/dark mode readability.

Reconciliation rules:

1. Release-blocking v0.6 findings are handled through a separately bounded v0.6 correction issue/PR when they affect the promoted runtime.
2. Shared-pattern findings are incorporated into the v0.7 UX, threat, and acceptance records before design merge.
3. Practice Review-specific findings are added to the v0.7 design package.
4. Findings do not change domain authority merely to simplify presentation.
5. Findings do not introduce readiness, compliance, risk, scoring, certification, Evidence-sufficiency, implementation-effectiveness, or Met/Not Met semantics.
6. Findings do not authorize v0.7 implementation before the design gate merges.

## Design review checklist

The design PR remains draft until all items are satisfied:

- [x] ADR-0012 defines the authority boundary.
- [x] Field-level domain/projection contract exists.
- [x] Focused Practice Review UX/usability record exists.
- [x] Threat model exists.
- [x] Workshop v79.1 compatibility posture exists.
- [x] Exact acceptance matrix exists.
- [ ] UX helper findings are received and classified.
- [ ] Release-blocking v0.6 findings, if any, are routed separately.
- [ ] Shared-pattern and Practice Review findings are reconciled into the v0.7 records.
- [ ] Root README, Integrated Suite planning index, roadmap, and decision/risk register are reconciled to the final reviewed design package.
- [ ] PR #145 exact-head CI is green after the final reconciliation.
- [ ] No unresolved review threads remain.
- [ ] PR #145 is reviewed and merged before any implementation branch is created.

## Implementation prohibition

Until PR #145 merges:

- do not create `apps/integrated-suite-v0.7/`;
- do not create a v0.7 implementation branch;
- do not add runtime code, schema JSON, requirement-catalog implementation, migration code, fixtures, workflows, release artifacts, or current-pointer changes;
- do not change the package registry or Workshop v79.1;
- do not simulate Reviews & Actions, SSP, Deliverables, or formal-assessment target acceptance;
- do not authorize production, client, FCI, or CUI data.

## Next action

Receive the UX helper handoff, classify every finding, reconcile the complete design package and durable planning records, validate the exact final design head, and merge the design gate only if all authority, compatibility, security, UX, and acceptance requirements remain coherent.