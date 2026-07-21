# CMMC L2 SSP Modern Editable

Local SSP authoring and Word Review round-trip module with Workshop handoff/return integration.

- Current release candidate: **v1.7.1**
- Governed runtime target: `modules/ssp/releases/1.7.1/CMMC_L2_SSP_Modern_Editable_v1.7.1.html`
- Exact-version integration evidence: **Workshop v76 ↔ SSP v1.7.1, 32/32 PASS**
- Next bounded action: **Independent draft-PR review and SME/QMS pilot; release only for a demonstrated defect or compatibility need**

Stable contracts remain `l2g_ssp_handoff_v1` version 1.0 and `l2g_ssp_return_package_v1` version 1.0. Optional `l2g_ssp_round_trip_audit_v1` version 0.1 remains read-only observability.

Preserve existing SSP and accepted Word-reviewed values at higher precedence than imported draft candidates. Imported control values, statuses, responsibility conclusions, and assessment conclusions are never applied automatically.
