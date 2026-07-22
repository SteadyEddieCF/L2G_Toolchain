# CMMC L2 SSP Modern Editable

Local SSP authoring and Word Review round-trip module with Workshop handoff/return integration.

- Current supplied release candidate: **v1.8.3**
- Current release focus: **Grouped parent-change impact review and conflict escalation**
- Next bounded action: **v1.8.4 consolidated and module-specific CRM**

Single-System remains the default. Portfolio mode is opt-in and local-only. Every module retains exactly 110 explicit requirement records. Stale records are grouped by source module and show field-level child/source impact. Refresh, preserve, defer, and escalate are explicit author decisions; no parent value propagates automatically. Local-override collisions can create governed open conflict records. Do not infer approval, assessment, certification, or compliance conclusions.

Preserve existing SSP and Word-reviewed values at higher precedence than imported draft candidates. Preserve `l2g_ssp_handoff_v1` and `l2g_ssp_return_package_v1` at version 1.0.
