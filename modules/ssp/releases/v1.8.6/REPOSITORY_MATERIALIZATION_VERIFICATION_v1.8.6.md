# Repository Materialization Verification — v1.8.6

- Baseline release: v1.8.5
- Baseline SHA-256: `4fb6eea6a95cbc311a6f6b008a7733590d88e275c61b74aa8b0b73be1802131a`
- Decompressed governed patch SHA-256: `30bdfc53c81acc45fa47328e4d936d4d9137d5389c438d3009e0d6cd82b8a545`
- Materialized v1.8.6 runtime SHA-256: `a9f872d7e3f0e9dd8515ac34a784086d536306cd00d0768066f657025c82f630`
- Gzip timestamp fixed at zero: PASS
- Extracted complete-package materialization: PASS
- Runtime byte comparison against governed build: PASS
- Repository dependency repair: two validated CRM CSV fixtures omitted from the prior v1.8.5 repository materialization are reconstructed byte-for-byte during generation, copied into the governed v1.8.6 fixture set, and then removed from the unchanged v1.8.5 release tree.
- Workflow governance: no `.github/workflows` file is added or modified by this release.
