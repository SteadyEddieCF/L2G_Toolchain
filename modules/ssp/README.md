# CMMC L2 SSP Modern Editable

Local SSP authoring and Word Review round-trip module with Workshop handoff/return integration.

- Current supplied release candidate: **v1.8.2**
- Current release focus: **Deterministic inheritance, supplements, overrides, and stale-parent detection**
- Next bounded action: **v1.8.3 parent-change impact and conflict workflow**

Single-System remains the default. Portfolio mode is opt-in and local-only. Every module retains exactly 110 explicit requirement records. Eligible same-requirement sources are an ancestor or an active shared-service module. Parent changes mark inherited snapshots stale and never overwrite child work automatically. Local supplements remain separate; local overrides require rationale. Do not infer approval, assessment, certification, or compliance conclusions.

Preserve existing SSP and Word-reviewed values at higher precedence than imported draft candidates. Preserve `l2g_ssp_handoff_v1` and `l2g_ssp_return_package_v1` at version 1.0.
