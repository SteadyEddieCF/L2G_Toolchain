# Playwright QA Bootstrap v1

## Scope

This QA foundation covers the current supplied runtime HTML applications:

- Control Center v0.3.2
- DocConverter-L2G v7.9.5
- Scoper v3.11
- Workshop v76
- Builder/Merger v3.8
- SSP v1.7

## Blocking checks

- `validate` — repository, JSON, HTML, manifest, and contract validation
- `playwright-qa` — HTTP-origin runtime smoke, offline request detection, localStorage, and critical axe-core findings
- `windows-file-smoke` — native Windows Chromium `file://` startup and localStorage

## Visual baseline bootstrap

The first `visual-regression` run creates missing Playwright screenshots and publishes them in the `visual-baseline-candidates` artifact. Those images require review before being committed as expected baselines. After committed baselines exist, the same job compares screenshots and fails on unexpected differences.

## Initial accessibility policy

Critical axe-core violations block the pull request. All serious, moderate, and minor findings remain in the full report and must be triaged before increasing the blocking threshold. Rules are not broadly disabled.

## Limitations

The initial functional tests cover startup, page errors, offline behavior, storage, titles, and interactive surfaces. Module-specific import/export and contract workflows remain the responsibility of each module release and will be added incrementally to this shared suite.
