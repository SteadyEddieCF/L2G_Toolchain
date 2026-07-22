# Import and Export Specification — v1.8.5

## Package contracts
- `cmmc_l2_ssp_portfolio_exchange_v1`, package version `1.5`
- `cmmc_l2_ssp_module_exchange_v1`, package version `1.5`

Each package contains a stable exchange ID, source identity, schema version, deterministic FNV-1a 64-bit payload fingerprint, record counts, and the bounded payload.

## Reconciliation
Imports are previewed before application. Empty/default editable fields and new stable-ID records may be applied. Existing substantive values, identity mismatches, inheritance-source changes, duplicate requirements, cross-portfolio modules, and malformed fingerprints are preserved or rejected. A complete backup is offered before application.

## Word Review
Selected modules export `cmmc-l2-ssp-word-review-v1` DOCX packages with `reviewScope=module`, portfolio/module identity, source fingerprint, and mapped content controls. Reviewed packages return to the same module queue. Comments and tracked edits are proposals only.
