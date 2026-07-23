# CMMC L2 SSP Modern Editable

Local SSP authoring and Word Review round-trip module with Workshop handoff/return integration.

- Current supplied release candidate: **v1.9.2**
- Current release focus: **Evidence freshness and ownership reminders with deterministic as-of policy, portfolio/module scope, fingerprinted JSON snapshots, CSV queues, and delivery-package inclusion**
- Next bounded action: **v1.9.3 module dependency visualization and export (suggested)**

Single-System remains the default. Portfolio mode is opt-in and local-only. Every module retains exactly 110 explicit requirement records. v1.9.2 adds read-only evidence freshness and ownership reminders with current, due-soon, stale, expired, date-missing, future-date, unresolved, duplicate, direct-owner, derived-owner, missing-owner, and unlinked-evidence paths. It does not send notifications or determine evidence sufficiency, implementation effectiveness, readiness, risk, compliance, certification, identity, signature, or legal custody.

Preserve existing SSP and Word-reviewed values at higher precedence than imported draft candidates. Preserve `l2g_ssp_handoff_v1` and `l2g_ssp_return_package_v1` at version 1.0. Portfolio/module exchange remains version 1.5 compatible, formal review remains version 1.6, named baselines remain version 1.7, the consolidated register remains version 1.8, policy profiles remain version 1.9, delivery/foundation packages remain version 1.10, maintenance snapshots remain version 1.11, and evidence reminder snapshots use version 1.12. SHA-256 provides integrity detection, not authenticated identity, digital signature, assessment, certification, or compliance conclusion.
