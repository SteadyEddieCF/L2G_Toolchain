# CMMC L2 SSP Modern Editable v1.7.1

Bounded repository-promotion candidate for the governed SSP v1.7.1 runtime.

## Scope

- Runtime: `CMMC_L2_SSP_Modern_Editable_v1.7.1.html`
- Workshop compatibility target: CMMC L2 Gap Workshop Tool v76
- Workshop → SSP contract: `l2g_ssp_handoff_v1` version `1.0`
- SSP → Workshop contract: `l2g_ssp_return_package_v1` version `1.0`
- Optional read-only audit: `l2g_ssp_round_trip_audit_v1` version `0.1`

No SSP features or package identities changed during repository promotion.

## Exact-version smoke

The packaged v1.7.1 release candidate completed a bounded bidirectional smoke against the authoritative Workshop v76 runtime. The smoke verifies preview-only import behavior, source precedence, protected text, explicit application, backup/undo/redo, return-package export, Workshop preview without assessment-state mutation, read-only audit behavior, repeated identity/count stability, offline operation, and absence of local-path leakage.

## Approval posture

This release is suitable for independent repository review and controlled pilot use. It is not a claim of company-wide production-baseline approval. SME/QMS pilot and production-governance gates remain open.
