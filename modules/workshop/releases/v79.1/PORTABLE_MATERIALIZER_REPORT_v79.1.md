# Portable Materializer Report — Workshop v79.1

- Protected-main reconciliation baseline: `69785ecd38f4d00345f27ca13e934dd0f688a1bf`
- Embedded v79 input: 1,836,145 bytes / `a1f63944d0573587e2a5b7826f72befa16f6d89b849f3129f7f6dbb080da54ca`
- Package-contained path: `source/v79_baseline.html` (exact verified HTML; generated into the complete deliverables ZIP)
- Patch source: `source/v79_1_patch.js`
- Reproduced v79.1 runtime: 1883583 bytes / `2845b634fb4302a7637f4e47ead49adaf20f7f71b3ca32f937c9b64f549622a4`

`build_release.py` reads only package-contained files. `test_portable_materializer.py` copies the release directory to a clean temporary location, deletes the runtime, rebuilds it, and compares exact bytes. `package_release.py` repeats that proof from a clean extraction of the generated complete deliverables ZIP.
