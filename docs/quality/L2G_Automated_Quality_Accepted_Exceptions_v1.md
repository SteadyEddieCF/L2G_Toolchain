# L2G Automated Quality Accepted Exceptions v1

## Status

Initial exception register for the repository-wide quality/security baseline. An exception documents debt; it does not establish safety, suppress application defects, or authorize sensitive data.

## EX-001 — Legacy GitHub Actions use major-version tags

- **Affected surface:** existing workflows predating ADR-0013.
- **Scanner/advisory:** Zizmor unpinned-uses findings and the repository `unpinned-action` advisory.
- **Impact:** a compromised or moved upstream major tag could alter workflow code.
- **Reason:** pinning all historical release/materialization workflows in the same change would create a broad, conflict-prone diff while active v0.6.1 work modifies one of those workflows.
- **Scope:** only pre-existing action references. All workflows added by this baseline use immutable 40-character commit pins.
- **Compensating controls:** least-privilege permissions; no `pull_request_target`; custom high-risk workflow checks remain blocking; Dependabot monitors GitHub Actions; Zizmor output is retained.
- **Review condition:** reconcile incrementally after the active v0.6.1 PR closes or when each legacy workflow is next modified.
- **Expiration target:** before the first Integrated Suite release candidate authorized for production/client data.

## EX-002 — Static semantic HTML advisories

- **Affected surface:** generated single-file runtimes with controls created or labelled dynamically.
- **Scanner/advisory:** static accessible-name, dialog-name, and landmark findings.
- **Impact:** static parsing may report false positives or miss runtime behavior.
- **Reason:** browser DOM, axe-core, keyboard/focus tests, and manual accessibility review are more authoritative for dynamic state.
- **Scope:** static naming/landmark advisories only. Duplicate IDs, broken label targets, and broken ARIA references remain blocking.
- **Compensating controls:** existing Playwright/axe tests, visual checks, profile non-disclosure tests, and required manual keyboard/screen-reader review.
- **Review condition:** promote a repeated static finding to blocking when it is confirmed in the rendered DOM or accessibility tree.
- **Expiration:** none; review with each accessibility architecture change.

## EX-003 — Performance budgets initially advisory

- **Affected surface:** startup, large synthetic engagement, rendering, save/export, and memory observations on shared GitHub runners.
- **Scanner/advisory:** budget variance until stable baselines and tolerances are recorded per release.
- **Impact:** regressions may require reviewer interpretation before a stable threshold exists.
- **Reason:** fragile microbenchmarks would create noise and encourage broad suppression.
- **Scope:** timing and memory variance only. crashes, timeouts, unbounded growth, corrupted output, or documented hard-limit failures remain blocking.
- **Compensating controls:** existing deterministic bounded scale tests; scheduled deep runs; artifacts record measurements; release acceptance retains manual responsiveness checks.
- **Review condition:** establish blocking budgets after at least three comparable successful runs for a promoted release and document runner tolerances.
- **Expiration target:** before v1.0.0-rc.1.

## No dependency vulnerability exceptions at baseline creation

No package/advisory exception is accepted in this change. High and critical relevant npm findings block; `pip-audit` findings block; moderate npm findings are reported and require review. Any future exception must name the package, advisory, impact, reason, affected scope, review condition, and practical expiration.
