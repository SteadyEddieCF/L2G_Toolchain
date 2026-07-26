# Backward compatibility report — v1.9.8

**Passed.**

- Valid v1.9.5 and v1.9.5.1 backups migrate to 1.9.8.
- v1.9.8 backup restore and repeated export are byte-identical under a fixed clock.
- 29 governed functions outside the authorized collect/migrate/apply schema changes remain byte-identical to v1.9.7.
- Workshop handoff 1.0, SSP return 1.0, audit 0.1, Word Review, portfolio/module exchange, and contracts 1.11–1.15 remain intact.
- Unknown optional top-level fields remain ignored rather than becoming governed output.
- Single-System remains the default; Portfolio remains Advanced.
