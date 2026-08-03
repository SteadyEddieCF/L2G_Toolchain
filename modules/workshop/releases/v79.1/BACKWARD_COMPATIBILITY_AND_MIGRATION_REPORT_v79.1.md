# Backward Compatibility and Migration — Workshop v79.1

- Workshop State remains 1.0 additive.
- Workbook Handoff remains contract release 1.7 encoded as wire package 1.0.
- Workbook Merge remains wire package 1.1.
- SSP Handoff and SSP Return remain 1.0.
- Workshop v79 data remains readable because v79.1 changes validation entry points, not Workshop state shape.
- Valid Builder/Merger v3.10 Merge 1.1 packages remain accepted.
- Previously tolerated invalid/ambiguous Merge packages now fail closed; this is intentional security hardening, not a migration path.
- Planned Workshop v80 Regression Delta work is preserved.
- Final compatibility with Builder/Merger v3.10.1 is pending its exact issue #106 candidate.
