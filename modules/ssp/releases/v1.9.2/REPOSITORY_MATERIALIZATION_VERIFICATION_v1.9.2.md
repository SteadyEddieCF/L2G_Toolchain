# Repository Materialization Verification — v1.9.2

- Baseline release: v1.9.1
- Baseline SHA-256: `a1db97b7b2ad1824d51145356fe3b829dc08cb20d6580f6f6a6404b0ba41b0ca`
- Runtime payload file SHA-256: `abf2a50caa1910c0375c29afc1c19ee8786a42661219865ea6711676926f44de`
- Materialized runtime SHA-256: `6b5028ce7de06d0d9dd37ea2f3f1709e1784da90f5d64be1adc760fd7e22af5d`
- Deterministic gzip timestamp: PASS
- Extracted release-directory materialization: PASS
- Runtime byte comparison against governed build: PASS
- Persisted portfolio foundation schema: unchanged at 1.10.0
- Existing approved repository workflows required: unchanged
- `.github/workflows` changes: none planned

The repository copy is intentionally lean: package-only generated fixtures, browser screenshot, embedded prior runtime source, and executable release-test sources remain in the complete deliverables ZIP. The canonical standalone runtime, schemas, verifiers, evidence reports, reminder fixtures, and compact delivery fixtures remain in git.
