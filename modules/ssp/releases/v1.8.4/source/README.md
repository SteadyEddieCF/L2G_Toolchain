# Governed SSP v1.8.4 Source

`materialize.py` concatenates the numbered `release-source-v1.8.4.tar.gz.b64.part-*` files, verifies the governed archive hash, safely extracts the bounded release source, migrates deterministic fixtures from the authoritative sibling v1.8.3 release, and applies the governed runtime patch.

The materialized runtime must have SHA-256 `976251ec10d227844a7b1b4f8131f9dbcb17e2ebb1aa31c5296d711274aeeb6b`. The source archive must have SHA-256 `cf4f2e6d345a15b1082a369b523fb5fbc682761d8bc67f141faac12208cbb22b`.

The complete deliverables ZIP remains an external release artifact; the repository stores deterministic, reviewable source and generated release files.
