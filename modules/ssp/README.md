# CMMC L2 SSP Modern Editable

Local SSP authoring and Word Review round-trip module with Workshop handoff/return integration.

- Current supplied release candidate: **v1.8.5**
- Current release focus: **Fingerprinted portfolio/module JSON exchange and per-module Word Review round trip**
- Next bounded action: **v1.8.6 formal review and approval workflow**

Single-System remains the default. Portfolio mode is opt-in and local-only. Every module retains exactly 110 explicit requirement records. Portfolio and selected-module JSON exchange use deterministic fingerprints, preview counts, and safe-only reconciliation; substantive conflicts remain unapplied governed review items. Module Word Review exports carry portfolio/module identity and return into a module-specific review queue that requires an explicit apply action. No exchange creates assessment, certification, or compliance conclusions.

Preserve existing SSP and Word-reviewed values at higher precedence than imported draft candidates. Preserve `l2g_ssp_handoff_v1` and `l2g_ssp_return_package_v1` at version 1.0.
