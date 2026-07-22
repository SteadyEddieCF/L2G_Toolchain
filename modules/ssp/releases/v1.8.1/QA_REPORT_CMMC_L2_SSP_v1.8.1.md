# QA Report — CMMC L2 SSP v1.8.1

Local deterministic validation: **67/67 passed**.

- Static, version, offline, contract, data-model, and integrity: 43/43.
- DOM runtime migration, module lifecycle, individual/bulk decisions, queue, round trip, and rollback: 16/16.
- Schema/fixture/package/materialization checks: included in the release regression total.
- Embedded 110-requirement model: unchanged from governed v1.8.0.
- Runtime SHA-256: `f1142a23378780afc544348b84ad62cd965fe1fe353f0c3d6f6adfb3318fb640`.

Repository validation, Playwright/axe, visual regression, and Windows `file://` remain the independent draft-PR gates.
