# CMMC L2 SSP Modern Editable

Local/offline SSP authoring and Word Review round-trip module with Workshop handoff/return integration.

- Current supplied release: **v1.9.17 — Final Word-QA Sidecar Consumer and Evidence History**
- Runtime SHA-256: `bfd9d10a780809ba259406f0770641da6a40ac2d8a6d1e372b070d6f5273351b`
- Promotion: PR #99, integrated head `17e487e2c6434b988ef1cda57e3f57c15b70b93d`, merge commit `95aae59cf4543994721f895a0faacef87e90edf0`
- Contract state: **`l2g_ssp_word_qa_sidecar_v1` 1.0 remains `proposal` pending issue #101.**

Single-System remains the default. Portfolio mode remains Advanced and optional. The module retains exactly 110 authoritative requirements, the v1.9.11 working-data schema, built-in profile v0.1/v0.2, RG-1/RG-2/UX-3/RG-3 evidence, Word Review, Needs Attention, Workshop handoff/return, and all existing package routes.

v1.9.17 adds a preview-first RG-4 consumer and browser-local append-only evidence history. It validates one Builder/Merger sidecar and paired SSP DOCX, independently derives current/stale state, requires explicit local acceptance or stale acknowledgement, and applies idempotent retry and supersession rules. It does not modify Builder/Merger, Workshop, Control Center, Scoper, or DocConverter.

The module does not establish readiness, compliance, assessment, certification, scoring, evidence sufficiency, technical accuracy, authenticated identity, digital signature, client approval, or client-release authority.

Stable contracts remain: handoff/return 1.0, optional audit 0.1, Word Review, exchange 1.5/1.6, formal review 1.6, baselines 1.7, register 1.8, policy 1.9, delivery/foundation 1.10, maintenance 1.11, reminders 1.12, dependency 1.13, calendar 1.14, and responsibility matrix 1.15. The RG-4 sidecar route is additive and proposal-only until joint promotion.
