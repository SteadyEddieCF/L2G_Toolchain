# Migration Design — SSP v1.9.11

The working-data schema advances additively from 1.9.9 to 1.9.11 by adding required `wordReviewInspections`, defaulted to an empty array for prior backups. Existing RG-1 runs, RG-2 stages/corrective actions, UX-3 behavior, Word Review queue data, portfolio data, stable identifiers, and package contracts are preserved.

Accepted migrations remain v1.9.5, v1.9.5.1, v1.9.8, v1.9.9, and v1.9.10. Inspection records are normalized, de-duplicated by deterministic inspection ID, bounded to 500 entries, and retain explicit supersession/history links. Inspection records are excluded from the governed source fingerprint to prevent an inspection from staling itself.
