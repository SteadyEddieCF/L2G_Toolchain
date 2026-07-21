# CMMC L2 SSP Modern Editable v1.7.1

Governed repository promotion candidate for the bounded documentation/package-integrity closeout and exact-version Workshop v76 round-trip smoke.

## Runtime

- `CMMC_L2_SSP_Modern_Editable_v1.7.1.html`
- Deterministically materialized from the governed v1.7 runtime plus the reviewable patch in `source/`.
- Expected SHA-256: `8d1e7bd57808b4af216918bf8f692611f27b41ddf222a99cb47a848aec23a1b3`

## Stable contracts

- Inbound: `l2g_ssp_handoff_v1` version `1.0`
- Outbound: `l2g_ssp_return_package_v1` version `1.0`
- Optional read-only observability: `l2g_ssp_round_trip_audit_v1` version `0.1`

## Validation posture

- Packaged release regression: 150/150 passed.
- Exact Workshop v76 round-trip smoke: 38/38 passed.
- No new SSP features and no Workshop modifications.
- SME/QMS pilot and production-governance gates remain open.

See `evidence/` for the Workshop v76 handoff, SSP return, audit, and exact-version smoke record.
