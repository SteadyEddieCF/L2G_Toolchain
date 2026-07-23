# CMMC L2 SSP Modern Editable

Local SSP authoring and Word Review round-trip module with Workshop handoff/return integration.

- Current supplied release candidate: **v1.9.0**
- Current release focus: **Portfolio/module delivery packages, deterministic SHA-256 inventories, recipient handling instructions, and fail-closed extracted-bundle verification**
- Next bounded action: **v1.9.1 portfolio health and maintenance dashboard (suggested)**

Single-System remains the default. Portfolio mode is opt-in and local-only. Every module retains exactly 110 explicit requirement records. v1.8.9 adds configurable inheritance and reconciliation policy profiles. v1.9.0 adds portfolio/module delivery envelopes with active-policy, formal-review, approval, baseline, register, CRM, and scoped-record summaries; safe-path and cryptographic inventory checks; recipient handling instructions; and browser/Python verification.

Preserve existing SSP and Word-reviewed values at higher precedence than imported draft candidates. Preserve `l2g_ssp_handoff_v1` and `l2g_ssp_return_package_v1` at version 1.0. Portfolio/module exchange remains version 1.5 compatible, formal review remains version 1.6, named baselines remain version 1.7, the consolidated register remains version 1.8, policy profiles remain version 1.9, and delivery/foundation packages use version 1.10. SHA-256 provides integrity detection, not authenticated identity, digital signature, assessment, certification, or compliance conclusion.
