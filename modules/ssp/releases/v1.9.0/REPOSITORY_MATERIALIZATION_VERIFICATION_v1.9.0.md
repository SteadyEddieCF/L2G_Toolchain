# Repository Materialization Verification — v1.9.0

- Baseline release: v1.8.9
- Baseline SHA-256: `1710cc9af8d167f6d5a6283ac9db2a20e8a838a2c4750a09f66edb0dcfbda3d8`
- Runtime payload file SHA-256: `06e0eb353165ab25da4d24dadc52f468ef5ffcadb3c42f72361426f3e3878676`
- Materialized runtime SHA-256: `e22f7fd7d0abf1d3c1d2186d133255ee092b6dbc51f1ec5d1d6b919e62a9bb27`
- Deterministic gzip timestamp: PASS
- Extracted release-directory materialization: PASS
- Runtime byte comparison against governed build: PASS
- Existing approved repository workflows required: unchanged
- `.github/workflows` changes: none planned

- Repository copy is intentionally lean: package-only generated fixtures, browser screenshot, embedded prior runtime source, and executable release-test sources remain in the complete deliverables ZIP. The canonical standalone runtime, schemas, verifier, evidence reports, and compact delivery fixtures remain in git.
