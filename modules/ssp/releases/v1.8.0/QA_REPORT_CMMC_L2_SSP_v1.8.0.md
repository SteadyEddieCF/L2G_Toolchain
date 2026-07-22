# QA Report — CMMC L2 SSP v1.8.0

Local deterministic validation: **50/50 passed**.

- Static, version, offline, contract, hierarchy, and package integrity: 34/34.
- DOM runtime, migration, hierarchy, package import, and rollback: 16/16.
- Embedded 110-requirement model: unchanged from governed v1.7.1.
- Runtime SHA-256: `b51cfe17065fd900c6360c3b85c9e4f29600ac8440ff35a5e6b4ba79f719bdff`.

Repository Playwright/axe, visual regression, and Windows `file://` gates remain pending until the draft PR runs. The PR must remain unmerged for independent review.
