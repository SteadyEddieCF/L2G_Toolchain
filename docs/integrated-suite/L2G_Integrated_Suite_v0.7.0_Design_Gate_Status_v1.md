# L2G Integrated Suite v0.7.0 — Design Gate Status

## Status

Final design-gate review phase under issue #143 and PR #145. The specialist UX dependency is received and reconciled. This record still does not authorize implementation until PR #145 is reviewed, passes exact-head CI, and merges.

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
- current-release UX correction route: issue #146 targeting bounded v0.6.1

## Complete design package

1. `docs/architecture/adr/ADR-0012-canonical-practice-review-authority.md`
2. `docs/integrated-suite/L2G_Practice_Review_v1_Contract_v1.md`
3. `docs/integrated-suite/L2G_Integrated_Suite_v0.7.0_Practice_Review_UX_v1.md`
4. `docs/integrated-suite/L2G_Integrated_Suite_v0.7.0_Threat_Model_v1.md`
5. `docs/integrated-suite/L2G_Integrated_Suite_v0.7.0_Workshop_Compatibility_v1.md`
6. `docs/integrated-suite/L2G_Integrated_Suite_v0.7.0_Acceptance_v1.md`
7. `docs/integrated-suite/L2G_Integrated_Suite_v0.7.0_UX_Finding_Reconciliation_v1.md`
8. `docs/integrated-suite/L2G_Integrated_Suite_v0.7.0_UX_Helper_Design_and_Acceptance_Addendum_v1.md`
9. this status record

## Authority and workflow design

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

## UX helper reconciliation

The specialist handoff was received as `L2G_Integrated_Suite_v0.6_Scope_Workbench_UX_Implementation_Review.md`, SHA-256 `cd3c46a8d615d9957e3f5d77776bedd46135c050116bf9a766abc19de91bd9a7`.

The helper reviewed an older v0.6 candidate, so every release blocker was rechecked against promoted `main`:

- the old missing-browser-CI finding was already satisfied before v0.6 promotion;
- projection-safe selection/inspector, Client-safe diagram rendering, structured decision review, import ambiguity, diagram supersession/accessibility, Unknown publication, and Reviewer Concur with changes remain valid current-release corrections;
- those corrections are routed separately to issue #146;
- reusable interaction, profile, responsive, accessibility, ambiguity, stale/supersession, and evidence requirements are binding through the UX helper addendum;
- every helper blocker, important correction, deferred improvement, and strength has a unique disposition in the reconciliation record.

## Binding shared UX requirements

The future implementation must, at minimum:

1. build the active projection before counts, search, selection, inspector, differences, history, related labels, focus, live regions, visual alternatives, export, or accessibility-tree content;
2. clear/rebuild transient state as one transaction on profile change;
3. use structured application review surfaces for authority-changing and target-publication commands;
4. display exact current → proposed effects, stale/conflict state, target authority, atomicity, and exclusions;
5. require explicit identity treatment for ambiguous imports and never auto-merge by name;
6. preserve exact historical records and use domain-authorized versioning/supersession rather than in-place rewrite;
7. use semantic dialogs and tablet drawers with keyboard/focus parity;
8. keep minimum-height desktop/tablet work surfaces compact and task-centered;
9. avoid raw numeric priority labels or score-like terminology;
10. prove Client non-disclosure, keyboard/accessibility, native Windows `file://`, zero network, deterministic packaging, recovery, and frozen compatibility on frozen candidate and unchanged final heads.

The exact supplemental tests are UXH-001 through UXH-015 in the UX helper addendum.

## Design review checklist

- [x] ADR-0012 defines the authority boundary.
- [x] Field-level domain/projection contract exists.
- [x] Focused Practice Review UX/usability record exists.
- [x] Threat model exists.
- [x] Workshop v79.1 compatibility posture exists.
- [x] Exact acceptance matrix exists.
- [x] UX helper findings are received and classified.
- [x] Obsolete helper findings are distinguished from promoted-release behavior.
- [x] Still-valid v0.6 findings are routed separately to issue #146.
- [x] Shared-pattern and Practice Review findings are incorporated through a binding design/acceptance addendum.
- [x] Root README, Integrated Suite planning index, roadmap, and decision/risk register already identify v0.6 as current and issue #143 as the next design gate through post-promotion reconciliation merge `1871d63e...`; issue #146 records the new bounded correction route.
- [ ] PR #145 exact-head CI is green after the final UX reconciliation commits.
- [ ] No unresolved review threads remain.
- [ ] PR #145 is marked ready, reviewed, and merged before any implementation branch is created.

## Implementation sequencing

1. Validate and merge PR #145 as a documentation-only design gate.
2. Prioritize issue #146 current-release correction before beginning the broad v0.7 runtime implementation.
3. A v0.7 implementation branch may be created only after PR #145 merges, and should remain paused behind any issue #146 disclosure/authority corrections that affect reusable shell behavior.
4. Do not mix v0.6.1 runtime changes into the v0.7 design PR.

## Implementation prohibition

Until PR #145 merges:

- do not create `apps/integrated-suite-v0.7/`;
- do not create a v0.7 implementation branch;
- do not add runtime code, schema JSON, requirement-catalog implementation, migration code, fixtures, workflows, release artifacts, or current-pointer changes;
- do not change the package registry or Workshop v79.1;
- do not simulate Reviews & Actions, SSP, Deliverables, or formal-assessment target acceptance;
- do not authorize production, client, FCI, or CUI data.

## Next action

Run the complete exact-head design PR matrix after these reconciliation commits, confirm no unresolved review threads, mark PR #145 ready, and merge the design gate only if all authority, compatibility, security, UX, and acceptance requirements remain coherent. Then begin issue #146 before broad v0.7 implementation.
