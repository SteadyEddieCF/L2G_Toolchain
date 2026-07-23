# CMMC L2 SSP Modern Editable

Local SSP authoring and Word Review round-trip module with Workshop handoff/return integration.

- Current supplied release candidate: **v1.9.1**
- Current release focus: **Derived portfolio/module health and maintenance dashboard, deterministic administrative indicator queue, SHA-256 maintenance snapshots, and JSON/CSV maintenance exports**
- Next bounded action: **v1.9.2 evidence freshness and ownership reminders (suggested)**

Single-System remains the default. Portfolio mode is opt-in and local-only. Every module retains exactly 110 explicit requirement records. v1.9.1 adds a read-only administrative maintenance dashboard with 21 deterministic indicators across authoring, ownership/evidence, review/approval, inheritance/impact, and governance. It exports fingerprinted maintenance snapshots and CSV queues and includes both artifacts in existing delivery packages without creating assessment findings, readiness scores, risk scores, compliance scores, or certification decisions.

Preserve existing SSP and Word-reviewed values at higher precedence than imported draft candidates. Preserve `l2g_ssp_handoff_v1` and `l2g_ssp_return_package_v1` at version 1.0. Portfolio/module exchange remains version 1.5 compatible, formal review remains version 1.6, named baselines remain version 1.7, the consolidated register remains version 1.8, policy profiles remain version 1.9, delivery/foundation packages remain version 1.10, and maintenance snapshots use version 1.11. SHA-256 provides integrity detection, not authenticated identity, digital signature, assessment, certification, or compliance conclusion.
