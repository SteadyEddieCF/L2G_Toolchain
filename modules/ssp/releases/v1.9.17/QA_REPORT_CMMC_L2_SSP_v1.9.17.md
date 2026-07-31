# QA Report — CMMC L2 SSP v1.9.17

Local browser validation used the exact Builder/Merger v3.10 sidecars and exact SSP v1.9.16 current/changed DOCX fixtures. Current attempt 1 validated and accepted; preview was non-mutating; re-import was idempotent; the controlled source change caused stale display without history loss; attempt 2 validated, was explicitly accepted, and derived attempt 1 superseded. Blocked/incomplete records remained separate and non-superseding. Stale acknowledgement, backup/restore, local reload, and repeated export preserved evidence history.

Negative testing rejected artifact, manifest, source snapshot, profile order, aggregate, lineage, timestamp, scope, duplicate-key, unknown-version, extra-property, malformed-package, and path-traversal cases. Injected HTML/script-like strings remained inert. Local testing observed zero external requests, page errors, or unexpected console errors.

Exact candidate identity: `bfd9d10a780809ba259406f0770641da6a40ac2d8a6d1e372b070d6f5273351b`, 2,266,611 bytes. The working-data schema remains v1.9.11 and exactly 110 requirements remain.

GitHub repository validation, Playwright/axe, visual regression, and native Windows Chromium `file://` results are pending the initial exact draft-PR head and must be recorded before any promotion recommendation.
