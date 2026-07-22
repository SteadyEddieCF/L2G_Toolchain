# Repository Materialization Verification — v1.8.3

The governed source is the authoritative v1.8.2 runtime plus `source/runtime-v1.8.2-to-v1.8.3.patch.gz.b64`, applied by `materialize.py`.

- Baseline SHA-256: `d43294c9121aa968bed5ec983c174b2cc5edfbea7b695f9d323707ae95419d19`
- Expected v1.8.3 runtime SHA-256: `81602cf206a05efb39297dce21bc06d1d3d43ec495465bb8acf97ceed632b2f5`
- Local deterministic materialization: passed
- Repository materializer: passed on bot commit `689ea782ca8b2fe23fd4c3cda60f2f29fc88a850`
- Materialized runtime Git blob: `ba6e5c12155c60de84325d6721b719efcf1d95a1` (exact match to the locally verified candidate)

The materializer reproduced the exact runtime. Repository validation, browser/accessibility, visual, and Windows `file://` gates remain required on the final maintainer head.
