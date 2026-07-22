# Repository Materialization Verification — v1.8.3

The governed source is the authoritative v1.8.2 runtime plus `source/runtime-v1.8.2-to-v1.8.3.patch.gz.b64`, applied by `materialize.py`.

- Baseline SHA-256: `d43294c9121aa968bed5ec983c174b2cc5edfbea7b695f9d323707ae95419d19`
- Expected v1.8.3 runtime SHA-256: `81602cf206a05efb39297dce21bc06d1d3d43ec495465bb8acf97ceed632b2f5`
- Local deterministic materialization: passed
- Repository materializer: required on the draft PR

The materializer must reproduce the exact runtime before repository browser, accessibility, visual, and Windows `file://` gates are accepted.
