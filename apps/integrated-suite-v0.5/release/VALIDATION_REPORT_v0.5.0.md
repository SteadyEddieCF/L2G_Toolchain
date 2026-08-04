# L2G Integrated Suite v0.5.0 — Validation Report

## Candidate identity

- Release: **L2G Integrated Suite v0.5.0 — Pre-Engagement and Interview Sessions**
- Governing issue: **#133**
- Promotion pull request: **#137**
- Accepted design baseline: `cca2acef47dd4427eb1cd8620f56c42ff15f786b`
- Validated candidate head: `875b4592ac15e129df6e7e026009ef3b48e0aef6`
- Product/runtime compatibility baseline: `85d6e783a250b373cd4b9ea356e4c341336f9259`
- Engagement schema: `l2g_engagement_v1` version `1.0`
- Evidence schema: `l2g_evidence_index_v1` version `1.0`
- Pre-Engagement schema/projection: `l2g_pre_engagement_v1` / `l2g_pre_engagement_projection_v1` version `1.0`
- Interview schema/projection: `l2g_interview_sessions_v1` / `l2g_interview_projection_v1` version `1.0`
- Encrypted envelope: `l2g_encrypted_project_v1` version `1.0`

## Deterministic release artifact

- Artifact: `L2G_Integrated_Suite_Pre_Engagement_Interview_v0.5.0.html`
- SHA-256: `0383b4799b7fb0dfe9fcabaec80bcfec4d2b1594bd2762e9438c0c3ff1f6fb44`
- Size: `464765` bytes

The portable HTML, release manifest, exact schemas, SPDX SBOM, release notes, and SHA-256 set rebuilt deterministically to the same identities on the validated candidate head. Runtime project encryption remained intentionally nondeterministic through fresh salt and IV generation. Synthetic encrypted fixtures generated during validation are run evidence rather than reusable production secrets or fixed ciphertext vectors.

## Exact candidate-head validation runs

| Gate | Run | Result |
|---|---:|---|
| Integrated Suite Pre-Engagement and Interview v0.5 | `30956392379` | Passed dedicated Linux workflow, native Windows `file://`, adapters, scale, migration, accessibility, recovery, hygiene, and deterministic packaging |
| Playwright QA | `30956392381` | Passed current runtime, axe-core, governed-route, Windows file-origin, and visual-regression checks |
| RG-4 Merged-Main Six-Tool Validation | `30956392472` | Passed static identities, joint runtime, and Windows current-file-origin validation |
| Validate L2G Toolchain | `30956392549` | Passed |

All inherited SSP materializers triggered for the candidate head also passed.

## Dedicated evidence artifacts

### Linux candidate evidence

- Artifact ID: `8911948471`
- Workflow artifact digest: `sha256:b818d5265681d16f81492c48ce35c75d070a421af407daa3c91e50041e95dcca`

### Windows native file-origin evidence

- Artifact ID: `8911962293`
- Workflow artifact digest: `sha256:8254e0ee4e1993508e531f13a915593b83415e2bdb79c96c454b6338019b0380`

## Validated behaviors

- strict TypeScript compilation with indexed-access and exact-optional-property checks enabled;
- deterministic portable-HTML packaging, release manifest, exact JSON Schemas, SPDX SBOM, release notes, and SHA-256 identities;
- restrictive hash-pinned CSP with `default-src 'none'`, `connect-src 'none'`, and `worker-src blob:`;
- zero unexpected runtime network requests, no remote assets, no telemetry SDKs, and no source maps;
- eight-workspace shell under local HTTP test serving and native Windows `file://` origin;
- canonical Pre-Engagement authority for requests, versioned instruments and items, immutable assignment snapshots, submissions, typed responses, origin attribution, conflicts/exceptions, factual completeness, candidates, receipts, profile-safe projections, and deterministic next work;
- canonical Interview Sessions authority for versioned questions, frozen plans, one-active-session enforcement, session lifecycle, agenda questions, participant statements, Advisor-only notes, exact-version locally asserted confirmations, summaries, follow-ups, parking-lot work, candidates, receipts, profile-safe projections, and deterministic next work;
- functional Pre-Engagement review, Session Planner, live Interview Mode, Client Presentation Mode, pause/resume checkpointing, post-session review, and responsive tablet-landscape behavior;
- participant statements, Advisor observations, imported context, confirmations, summaries, and target-domain candidates remain separate governed records;
- Advisor notes remain exactly `advisor-only`; Client projections omit their titles, text, metadata, counts, search terms, snippets, inspector state, focus targets, live-region content, and accessibility-tree exposure before rendering;
- locally asserted confirmations bind an exact statement or Client-summary version and are not authenticated identity, signatures, legal acceptance, or broad client approval;
- completion, confirmation, factual intake completeness, elapsed time, and agenda progress create no readiness, compliance, risk, scoring, certification, evidence-sufficiency, implementation, or Met/Not Met conclusion;
- source proposals publish only into target-owned Engagement candidates; accepted Engagement content remains unchanged until an explicit Engagement command, and target decisions mirror back through validated references;
- strict preview-first compatibility adapters for `l2g_intake_package_v1`, `l2g_meeting_context_v1`, and `l2g_scope_context_v1` version `1.0` reuse the stable Evidence parser and registry;
- package preview performs no governed mutation, selected valid records apply atomically, original package bytes are not retained, and reviewed subsets are recorded explicitly;
- intake package content creates low-authority Advisor-review records rather than automatic client answers, submissions, or confirmed responses;
- meeting context creates imported-context questions only and never direct participant testimony, speaker identity, confirmation, or live statement records;
- Scope context may inform an imported-context question but cannot create or change authoritative Scope boundaries or decisions;
- duplicate JSON keys, unknown package kinds/versions, missing traceability, active content, malformed input, oversized input, ambiguous selections, and Client-profile apply attempts are rejected before mutation;
- bounded scale validation covered 500 intake items, 500 Interview questions, 250 frozen plan items, 25 sessions, project validation, profile-safe projections, deterministic archive serialization, and reopen validation without timing-based pass criteria;
- encrypted portable save/open, encrypted browser recovery, project locking, checkpoints, Undo, Redo, append-oriented history, and purpose-bound AES-GCM envelopes passed;
- wrong passphrase, ciphertext tampering, archive corruption, purpose replay, duplicate/prototype keys, dangling references, invalid state combinations, note-visibility escalation, and cross-domain authority violations are rejected without partial mutation;
- a deterministic encrypted v0.3 fixture opened through the real application UI and migrated to v0.5 with empty Evidence, Pre-Engagement, and Interview authorities, exact migration history/checkpoint, and no inferred answers, questions, sessions, statements, notes, confirmations, candidates, or conclusions;
- public-hygiene validation rejected private local paths, common secret/token forms, non-synthetic fixture names, remote URLs, and missing synthetic-only qualification;
- current standalone tools, registered package routes, visual baselines, exact portable identities, and the RG-4 Workshop/Builder/SSP matrix remained unchanged.

## Promotion procedure

This report records the exact green **candidate head**. The current-release pointer and promotion metadata are updated only after this evidence exists. Because this validation report and the metadata-only pointer update create a new final head, the complete required matrix must pass again on that exact final head before PR #137 may leave draft or merge. Final-head run IDs and immutable artifact evidence are recorded in PR #137 and issue #133 without changing the validated application artifact.

## Release boundary

This release remains **synthetic-only**. It does not authorize production, client, FCI, or CUI data. Original Evidence remains outside the project. Imported and session-derived information remains low authority until explicitly reviewed. A SHA-256 match establishes byte equality only; it does not establish authenticity, relevance, currency, evidence sufficiency, implementation, readiness, compliance, risk, scoring, certification, or Met/Not Met. Presentation profiles are not security roles, locally asserted identities and confirmations are not authentication or signatures, and the complete `.l2g` project is not a client-safe distribution artifact.
