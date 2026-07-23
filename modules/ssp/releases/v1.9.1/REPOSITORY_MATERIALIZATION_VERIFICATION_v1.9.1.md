# Repository Materialization Verification — v1.9.1

- Baseline release: v1.9.0
- Baseline SHA-256: `e22f7fd7d0abf1d3c1d2186d133255ee092b6dbc51f1ec5d1d6b919e62a9bb27`
- Runtime payload file SHA-256: `80ded8d9a50a0d78777a1564a9f4edc0fd0f0f71fa840addf226ba907cd37be7`
- Materialized runtime SHA-256: `a1db97b7b2ad1824d51145356fe3b829dc08cb20d6580f6f6a6404b0ba41b0ca`
- Deterministic gzip timestamp: PASS
- Extracted release-directory materialization: PASS
- Runtime byte comparison against governed build: PASS
- Persisted portfolio foundation schema: unchanged at 1.10.0
- Existing approved repository workflows required: unchanged
- `.github/workflows` changes: none planned

- Repository copy is intentionally lean: package-only generated fixtures, browser screenshot, embedded prior runtime source, and executable release-test sources remain in the complete deliverables ZIP. The canonical standalone runtime, schemas, verifiers, evidence reports, maintenance fixtures, and compact delivery fixtures remain in git.
