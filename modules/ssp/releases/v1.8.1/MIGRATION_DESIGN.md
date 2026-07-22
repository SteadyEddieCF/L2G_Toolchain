# Migration Design — v1.8.1

- Existing Single-System data through v1.8.0 loads without enabling portfolio mode.
- Existing v1.8.0 portfolio schema 1.0.0 is accepted and upgraded to schema 1.1.0.
- For each existing module, the migrator creates only missing requirement records; all created values are Pending decision / Undecided / Not assessed.
- Existing v1.8.0 portfolio, module, change-history, rollback, images, and Word Review data remain available.
- Duplicate module/requirement pairs, duplicate record IDs, unknown requirements, unknown modules, missing inheritance sources, and unsupported schemas are rejected.
- The v1.8.0 pre-conversion rollback snapshot remains recognized.

Migration does not interpret legacy free text as applicability, inheritance, responsibility, implementation, review, approval, or evidence.
