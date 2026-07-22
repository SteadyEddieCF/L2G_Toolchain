# Repository Materialization Verification — SSP v1.8.4

The repository materializer was reproduced against the authoritative v1.8.3 sibling release before publication.

- Governed source archive SHA-256: `cf4f2e6d345a15b1082a369b523fb5fbc682761d8bc67f141faac12208cbb22b`
- v1.8.3 baseline SHA-256: `81602cf206a05efb39297dce21bc06d1d3d43ec495465bb8acf97ceed632b2f5`
- Governed patch source SHA-256: `3d9efef235652abd2743bb4e068621dd3176677b0e24e4259c23f07af80a577f`
- Materialized v1.8.4 runtime SHA-256: `976251ec10d227844a7b1b4f8131f9dbcb17e2ebb1aa31c5296d711274aeeb6b`
- Embedded authoritative 110-requirement model: semantically unchanged

Local repository-layout reproduction passed static, schema, browser, CSV export, and safe-only reconciliation tests. Pull-request workflows remain the independent repository gate.
