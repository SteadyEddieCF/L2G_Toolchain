# L2G Repository Quality and Security Baseline

This directory adds a repository-controlled orchestration and policy layer around the existing release-specific tests. It does not replace validated module tests, change runtime authority, add a cloud service, or authorize production/client/FCI/CUI use.

## Local commands

Run from the repository root after the current release is built:

```bash
python -m pip install -r quality/requirements.txt
npm ci --no-audit --no-fund
npm run test:unit
npm run test:contracts
npm run test:files
npm run test:offline
npm run check:html
npm run check:privacy
npm run check:security
npm run check:package
npm run check:all
```

Browser commands require Chromium installed through Playwright. `npm run test:e2e`, `test:visual`, and `test:a11y` use the existing repository harness and current release tests.

## Classification

`quality/baseline.json` is the machine-readable source for blocking and advisory checks. Blocking gates fail CI. Advisory results are uploaded and require review but do not initially block, primarily to avoid silently converting known legacy workflow pinning and runner-sensitive performance debt into exceptions.

## Reports

Static gates write JSON to `quality-reports/`. Browser reports, screenshot diffs, traces, videos, and accessibility evidence remain under `test-results/` and are uploaded by Actions. Release validation uploads the deterministic package, SPDX SBOM, checksum list, release manifest, and reports.

## Scope boundary

The current Integrated Suite v0.6.0 owns Engagement, Evidence, Pre-Engagement, Interview Sessions, and Scope. The repository baseline must not simulate unimplemented integrated Practice Review, SSP, or Deliverables authority. Existing standalone Workshop, SSP, Builder/Merger, Scoper, DocConverter, and Control Center routes remain covered by their current non-regression tests.

## Manual review remains required

Automation does not replace facilitated-workflow review, CMMC interpretation, client-specific data review, manual keyboard or screen-reader testing, final deliverable review, or human approval of scope, evidence, findings, recommendations, actions, SSP content, and outputs.
