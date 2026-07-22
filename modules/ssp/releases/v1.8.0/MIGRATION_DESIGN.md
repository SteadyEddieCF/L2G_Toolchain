# Migration Design — v1.8.0

1. Existing v1.7.1 local state or JSON is loaded into Single-System mode.
2. The user explicitly opens optional portfolio setup.
3. A preview reports retained requirement, populated-field, status, and table counts.
4. Confirmation writes a complete pre-conversion snapshot to the isolated v1.8.0 rollback key.
5. The tool creates one portfolio and one top-level anchor module around the existing SSP without duplicating fields.
6. Rollback reapplies the captured SSP snapshot and returns to Single-System mode.

Conversion stops if the rollback snapshot cannot be stored. Existing content is never deleted during conversion. Child module records are metadata-only. Free-form legacy text is not treated as approval, inheritance, applicability, responsibility, or implementation.
