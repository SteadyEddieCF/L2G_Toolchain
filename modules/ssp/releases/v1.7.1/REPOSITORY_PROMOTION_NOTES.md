# Repository Promotion Notes — SSP v1.7.1

## Bounded change

This promotion adds the governed v1.7.1 HTML runtime and its release evidence to the L2G Toolchain repository. Workshop v76 was used only for exact-version interoperability testing and was not modified.

## Preserved contracts

- `l2g_ssp_handoff_v1` — version `1.0`
- `l2g_ssp_return_package_v1` — version `1.0`
- `l2g_ssp_round_trip_audit_v1` — version `0.1`, read-only

## Required repository checks

The draft pull request must remain unmerged while the repository runs:

- repository validation;
- Playwright runtime and axe-core QA;
- visual regression;
- Windows Chromium `file://` smoke.

## Open gates

- SME/QMS controlled pilot;
- production-governance decisions;
- published-template confirmation;
- cross-browser compatibility beyond the repository's current Chromium gates.
