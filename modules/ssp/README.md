# CMMC L2 SSP Modern Editable

Local SSP authoring and Word Review round-trip module with Workshop handoff/return integration.

- Current supplied release candidate: **v1.8.7**
- Current release focus: **Approval-linked immutable named baselines, deterministic comparison, and governed restoration**
- Next bounded action: **v1.8.8 consolidated change and decision register**

Single-System remains the default. Portfolio mode is opt-in and local-only. Every module retains exactly 110 explicit requirement records. v1.8.7 adds portfolio/module named baseline creation after fresh formal approval, conflict-aware creation gates, deterministic local integrity fingerprints, append-only supersession and restoration events, field-level comparison, baseline export, and restoration through a new working version. These records support controlled SSP authoring governance only and do not create digital signatures, assessment findings, certification decisions, or compliance conclusions.

Preserve existing SSP and Word-reviewed values at higher precedence than imported draft candidates. Preserve `l2g_ssp_handoff_v1` and `l2g_ssp_return_package_v1` at version 1.0. Portfolio/module exchange remains version 1.5 compatible, the formal review register remains version 1.6, and immutable named baseline packages use version 1.7.
