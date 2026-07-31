# CMMC L2 SSP Modern Editable

Local/offline SSP authoring and Word Review round-trip module with Workshop handoff/return integration.

- Current supplied release: **v1.9.16 — Review Workspace Compact Header Parity**
- Current candidate: **v1.9.17 — Final Word-QA Sidecar Consumer and Evidence History** under issue #93
- Candidate baseline: **Frozen proposal contract head `cb5c41abf015d7eee095b10fabe2fc0059473e89`; Builder/Merger v3.10 candidate head `bdb03e47cb92656a2965f5fd867ff3ef770650d6` is an external handshake input, not an SSP code dependency.**
- Independent review gate: **Keep the stacked v1.9.17 PR draft and unmerged until exact materialization/static, repository validation, Playwright/axe, visual regression, native Windows Chromium `file://`, no-network, security, compatibility, and joint producer/consumer gates pass on unchanged exact heads.**
- Contract state: **`l2g_ssp_word_qa_sidecar_v1` 1.0 remains `proposal`; this candidate must not mark it validated.**

Single-System remains the default. Portfolio mode remains Advanced and optional. The module retains exactly 110 authoritative requirements, the v1.9.11 working-data schema, built-in profile v0.1/v0.2, RG-1/RG-2/UX-3/RG-3 evidence, Word Review, Needs Attention, Workshop handoff/return, and all existing package routes. v1.9.17 adds only a preview-first RG-4 consumer and browser-local append-only evidence history. It does not modify Builder/Merger, Workshop, Control Center, Scoper, or DocConverter.

Stable contracts remain: handoff/return 1.0, optional audit 0.1, Word Review, exchange 1.5/1.6, formal review 1.6, baselines 1.7, register 1.8, policy 1.9, delivery/foundation 1.10, maintenance 1.11, reminders 1.12, dependency 1.13, calendar 1.14, and responsibility matrix 1.15. The RG-4 sidecar route is additive and proposal-only until joint promotion.
