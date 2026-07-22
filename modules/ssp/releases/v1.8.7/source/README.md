# Governed v1.8.7 runtime source

- Baseline: `CMMC_L2_SSP_Modern_Editable_v1.8.6.html`
- Baseline SHA-256: `a9f872d7e3f0e9dd8515ac34a784086d536306cd00d0768066f657025c82f630`
- Deterministic patch: `runtime-v1.8.6-to-v1.8.7.patch.gz.b64`
- Decompressed patch SHA-256: `928dae12a5524eeaec6fed01102c53bba390a04313da3242563a1043dda0e104`
- Expected runtime: `CMMC_L2_SSP_Modern_Editable_v1.8.7.html`
- Expected runtime SHA-256: `96736cd935d5d77fe32ec467e52aca6ea681545ce1eda8ea753a5fac543f6e4b`

Run `python materialize.py` from the release directory. The patch reconstructs the exact governed runtime without network access.
