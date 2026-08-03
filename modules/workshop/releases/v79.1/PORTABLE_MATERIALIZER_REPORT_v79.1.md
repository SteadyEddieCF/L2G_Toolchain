# Portable Materializer Report — Workshop v79.1

- Protected-main reconciliation baseline: `69785ecd38f4d00345f27ca13e934dd0f688a1bf`
- Embedded v79 input: 1,836,145 bytes / `a1f63944d0573587e2a5b7826f72befa16f6d89b849f3129f7f6dbb080da54ca`
- Package-contained path: `source/v79_baseline.html` (exact verified HTML; generated into the complete deliverables ZIP)
- Corrected strict patch: `source/v79_1_corrected_patch.js.gz.b64`
- Queued-render non-mutation appliance: `source/v79_1_nonmutation_fix.js`
- Reproduced v79.1 runtime: 1885465 bytes / `1fa1e186269b45110240b7ca39eaf6f40bb2ec55b8c496aaf01dfe6a65032ee2`

`build_release.py` reads package-contained sources when extracted and uses the repository v79 materializer only as a development-tree fallback. `test_portable_materializer.py` copies the release directory to a clean temporary location, deletes the runtime, rebuilds it, and compares exact bytes. `package_release.py` repeats that proof from a clean extraction of the generated complete deliverables ZIP.
