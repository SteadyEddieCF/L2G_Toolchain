# Acceptance Criteria Traceability — v1.8.0

| Criterion | Evidence | Result |
|---|---|---|
| Existing single-system data opens without forcing modules | v1.7.1 migration runtime test | Pass |
| Single-System remains default | Runtime/UI test | Pass |
| Conversion is explicit and previewed | Migration preview test | Pass |
| Conversion creates a complete rollback snapshot | Runtime/local-storage test | Pass |
| Rollback restores Single-System state | Runtime rollback test | Pass |
| Stable portfolio/module identifiers | Schema and runtime static test | Pass |
| One top-level anchor plus child hierarchy | McFirecoal fixture and runtime test | Pass |
| Missing parents and cycles are rejected | Runtime negative tests | Pass |
| SSP content is not duplicated or reinterpreted | Empty moduleRequirements and visible limitation | Pass |
| Portfolio and module foundation export/import | Runtime package-shape test | Pass |
| Existing 110-requirement model is unchanged | Semantic model hash comparison | Pass |
| Stable Workshop and Word Review contracts | Contract static regression | Pass |
| Local-only operation | External-asset/static network dependency scan | Pass |
| Accessibility and browser regression | Repository Playwright/axe/visual/Windows gates | Pending draft PR |
| Later epic criteria | Roadmap v1.8.1–v1.8.9 | Deferred by design |
