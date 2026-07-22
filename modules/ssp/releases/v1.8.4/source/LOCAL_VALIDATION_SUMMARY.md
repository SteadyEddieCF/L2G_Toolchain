# Local Validation Summary — SSP v1.8.4

- Static release checks: 21/21 passed
- Schema/fixture checks: 4 modules, 440 requirement records; six invalid fixtures rejected
- Browser CRM metrics: 440 rows; 35 authoritative; 36 inherited; 398 pending; 1 open conflict
- CSV exports: 440 consolidated rows and 110 selected-module rows
- Mixed reconciliation: 1 safe, 1 conflict, 1 invalid, 1 applied
- Browser page errors: none
- Deterministic materialization: exact runtime SHA-256 reproduced

Direct local Chromium `file://` execution was blocked by the host browser policy. The equivalent in-memory browser flow passed; repository Playwright and Windows `file://` smoke remain independent release gates.
