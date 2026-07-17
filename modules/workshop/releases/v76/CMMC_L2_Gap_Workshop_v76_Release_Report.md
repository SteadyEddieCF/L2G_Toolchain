# CMMC L2 Gap Workshop Tool v76 Release Report

## Release focus

**Responsibility Review UX**

v76 makes the v75 responsibility reconciliation usable during a live advisory session by presenting one practice at a time. The full matrix remains available under Advanced / Bulk Review for cleanup, filtering, comparison, and broad updates.

## Delivered behavior

- Focused responsibility-review card with previous/next and queue navigation.
- Review completion indicator across all generated responsibility suggestions.
- Requirement and assessor expectation shown with current Workshop implementation owner, evidence owner, readiness, and evidence status.
- Matched services, enabled modules, provider/platform duties, continuing client duties, source-pack differences, validation questions, and open related actions shown together.
- Explicit responsibility dimensions: provider claim, client responsibility, shared duty, inherited/service function, operational dependency, evidence responsibility, and unresolved assumptions.
- Advisor controls for accept, modify, needs validation, defer, save, and continue.
- Alt+Left/Right keyboard navigation outside form controls.
- Direct jump from responsibility review to the related one-practice Practice Review.
- Bulk reconciliation matrix moved under an Advanced drawer and closed by default.

## Contract and guardrail status

Unchanged stable contracts:

- `l2g_workshop_state_v1` 1.0
- `l2g_workbook_handoff_v1` enhancement 1.7
- `l2g_workbook_merge_v1` 1.1
- `l2g_ssp_handoff_v1` 1.0
- `l2g_ssp_return_package_v1` 1.0
- `l2g_responsibility_reconciliation_v1` 0.1 advisory working

Responsibility decisions remain in a separate overlay. No Workshop owner, evidence sufficiency conclusion, workbook result, SSP status, scope decision, Met/Not Met result, score, readiness conclusion, or certification conclusion is changed automatically.

## Regression summary

- Static HTML SHA-256: `d9f4a3b3fff7ba18498544e3c424d2f4493e555ddc4a688ef0359069b66ac06a`
- Size: 1,731,651 bytes
- Reconciliation records exercised: 68
- Focused queue options: 68
- Focused information panels: 8
- Bulk matrix rows: 68
- Previous/next navigation: passed
- Alt+Left/Right navigation: passed
- Explicit acceptance: passed
- Primary Workshop practice records unchanged: true
- Browser page errors: 0
- Runtime self-checks: 74 passed / 2 environment-limited

The two inherited runtime self-check limitations are the synthetic-origin CSP check and unavailable localStorage. The unmodified file passed static CSP validation with `connect-src 'none'`.

## Adjacent-tool impact

No adjacent tool must release solely for v76. The Control Center can continue consuming the existing reconciliation and Workshop observability packages as optional read-only information.

## GitHub target

- Repository: `SteadyEddieCF/L2G_Toolchain`
- Module path: `modules/workshop/`
- Release branch: `release/workshop-v76`
- Binary ZIP and screenshots should be attached to a GitHub Release or retained in the downloadable release bundle; source HTML, Markdown, JSON, workflow, and test files belong in the repository.
