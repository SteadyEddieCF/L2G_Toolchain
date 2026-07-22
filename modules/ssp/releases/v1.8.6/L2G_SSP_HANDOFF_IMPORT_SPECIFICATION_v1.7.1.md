# L2G SSP Handoff Import Specification — v1.7.1

## Accepted contract
- `package_kind`: `l2g_ssp_handoff_v1`
- `package_version`: `1.0`
- recognized generator: CMMC L2 Gap Workshop Tool
- required control records: 110

## Selection policy
- Existing SSP and Word Review values are never replaced automatically.
- Exact identity fields listed by the Workshop as `recommended_safe` may be preselected only when the target is empty or a placeholder.
- Control values and status candidates are always unselected initially.
- Empty or unavailable candidates cannot be selected.
- Protected requirement and assessment-objective fields are outside the mapping.

## Source precedence
1. Existing SSP or Word Review value accepted by the author
2. Reviewer-approved or revision-controlled SSP value
3. Workbook-derived reviewed Workshop overlay
4. Advisor-confirmed Workshop value
5. Client-confirmed statement
6. Validated Scoper context
7. DocConverter extraction with provenance
8. Generic inferred candidate

Lower-precedence values are flagged and require explicit replacement selection.

## Apply behavior
- Status candidates undergo status-specific validation.
- The chosen field set applies as one undoable history action.
- Backup-first is available before application.
- Applied source metadata is retained in `l2gIntegration` in the SSP backup.
