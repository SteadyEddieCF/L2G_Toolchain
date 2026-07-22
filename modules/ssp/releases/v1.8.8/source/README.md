# Governed v1.8.8 runtime source

- Baseline: `CMMC_L2_SSP_Modern_Editable_v1.8.7.html`
- Baseline SHA-256: `96736cd935d5d77fe32ec467e52aca6ea681545ce1eda8ea753a5fac543f6e4b`
- Deterministic patch: `runtime-v1.8.7-to-v1.8.8.patch.gz.b64`
- Decompressed patch SHA-256: `77e2fcff2f527d80cec1e8e62c554d42d94b476ee70727b564cde84dbb84c828`
- Expected runtime: `CMMC_L2_SSP_Modern_Editable_v1.8.8.html`
- Expected runtime SHA-256: `c919bf7728fdca903c852a0cbc674f07b023d1bed2e59f32e030f32b56e43efe`

Run `python materialize.py` from the release directory. The patch reconstructs the exact governed runtime without network access.
