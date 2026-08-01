# Browser, Accessibility, Offline, and Security Report — Workshop v79.1

## Corrected candidate identity

- Runtime SHA-256: `2845b634fb4302a7637f4e47ead49adaf20f7f71b3ca32f937c9b64f549622a4`
- Runtime size: `1883583` bytes
- Reconciled protected main: `69785ecd38f4d00345f27ca13e934dd0f688a1bf`
- Draft PR: #112

## Local validation completed before branch update

- exact nested governance reconciliation;
- deterministic mismatch, missing-record, duplicate-ID, count, record-fingerprint, preservation-fingerprint, source-linkage, malformed-extension, duplicate-key, and top-level-extension blocking;
- valid package without the optional extension;
- preview and rejection non-mutation;
- explicit apply, deterministic duplicate re-import, and undo;
- exact operational-record byte preservation during reconciliation;
- script/path-like strings remain inert;
- extracted-package materialization reproduces exact runtime bytes without repository sibling files.

## Exact-head CI

The corrected branch must rerun:

- repository validation and portable materialization;
- runtime and axe-core;
- Workshop↔SSP Handoff/Return 1.0;
- light and dark visual regression;
- constrained viewport, print, keyboard and focus;
- native Windows Chromium `file://`;
- zero external requests, page errors, and unexpected console errors.

The authoritative final run and job IDs are recorded in PR #112 checks and description after execution.

## Boundary

The corrected Workshop-owned gates do not claim joint Builder/Merger v3.10.1 compatibility. That remains dependent on the exact corrected PR #113 candidate.
