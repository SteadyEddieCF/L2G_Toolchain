# L2G Builder/Merger v3.10.1 — Workshop Action and Ownership Preservation

Corrective candidate governed by issue #106 and reconciled to protected main `69785ecd38f4d00345f27ca13e934dd0f688a1bf`.

- Moves the optional preservation extension from the invalid package top level to `workbook_source.workshop_governance_preservation_v1`.
- Keeps Workbook Merge `l2g_workbook_merge_v1` version `1.1` and its frozen top-level shape.
- Uses schema version `1.0`, canonical SHA-256 record fingerprints, canonical SHA-256 preservation fingerprint, exact counts, stable IDs, source-Handoff linkage, and three non-mutation guardrails.
- Preserves the visible helper sheets and the original 12 workbook sheets, formulas, styles, merged cells, conditional formatting, validation, comments, hidden states, and reviewer values.
- Preserves Build, Merge, External CSV, Decision Plan, and SSP Final Word-QA routes.
- Materializer and validators use repository-relative or explicit command-line paths.

The corrected Workshop v79.1 exact candidate and final Orchestrator round trip remain pending. The PR remains draft and unmerged.
