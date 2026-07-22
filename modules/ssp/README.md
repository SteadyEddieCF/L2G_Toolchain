# CMMC L2 SSP Modern Editable

Local SSP authoring and Word Review round-trip module with Workshop handoff/return integration.

- Current supplied release candidate: **v1.8.6**
- Current release focus: **Role-aware formal review and fingerprint-bound authoring approval workflow**
- Next bounded action: **v1.8.7 immutable named baselines**

Single-System remains the default. Portfolio mode is opt-in and local-only. Every module retains exactly 110 explicit requirement records. v1.8.6 adds scoped Author, Reviewer, Approver, and Administrator assignments; portfolio/module review rounds; reviewer dispositions; segregation of duties; fingerprint-bound approvals; derived stale status after governed-content changes; revocation history; and an exportable review register. These records support controlled SSP authoring governance only and do not create assessment findings, certification decisions, authenticated signatures, or compliance conclusions.

Preserve existing SSP and Word-reviewed values at higher precedence than imported draft candidates. Preserve `l2g_ssp_handoff_v1` and `l2g_ssp_return_package_v1` at version 1.0. Portfolio/module exchange remains version 1.5 compatible, while the formal review register is version 1.6.
