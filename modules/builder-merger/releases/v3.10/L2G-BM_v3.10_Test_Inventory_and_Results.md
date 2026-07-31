# L2G Builder/Merger v3.10 Test Inventory and Results

## Summary

The candidate passed local contract, identity, package, browser-harness, and existing-route regression tests. The RG-4 route remains unvalidated because the frozen contract PR is still draft and native Windows `file://` execution was unavailable in the managed environment.

## Contract and deterministic identity

| Test | Result |
|---|---|
| Exact schema conformance for current, changed, incomplete, and blocked sidecars | Pass |
| Duplicate-key rejection | Pass |
| Canonical JSON | Pass |
| Frozen QA-profile hash | Pass |
| Frozen lineage derivation | Pass |
| Sidecar-ID derivation | Pass |
| Package-fingerprint derivation | Pass |
| Fixed-clock repeated output | Pass; identical bytes/ID/fingerprint |
| Real-clock behavior | Pass; different seconds produced different IDs |
| UTC second timestamp form and assertion ordering | Pass |

## Exact fixture and Open XML inspection

| Test | Result |
|---|---|
| Fixture ZIP exact size/hash | Pass |
| Current DOCX exact size/hash | Pass |
| Changed-source DOCX exact size/hash | Pass |
| Embedded-manifest extraction | Pass |
| Embedded/companion manifest reconciliation | Pass |
| Current fixture output | Pass, `qa_complete` |
| Changed-source attempt 2 | Pass, `qa_complete`, proper immediate retry reference |
| Missing human assertion | Pass, `qa_incomplete` |
| Unresolved-token artifact | Pass, `qa_blocked` |
| Artifact mismatch | Detected |
| Manifest mismatch | Detected |
| Malformed Open XML | Rejected |
| Path traversal | Rejected |
| Comments/revisions clean-fixture scan | Pass |
| Unresolved token clean-fixture scan | Pass |
| Inert untrusted rendering | Pass |

## Browser-harness testing

| Test | Result |
|---|---|
| Current DOCX route | Pass |
| Changed DOCX route/attempt 2 | Pass |
| Incomplete state | Pass |
| Blocked state | Pass |
| Zero page errors | Pass |
| Keyboard navigation/focus sequence | Pass |
| Focus visibility | Pass |
| Added input accessible names | Pass |
| Light theme | Pass |
| Dark theme | Pass |
| Constrained viewport | Pass; no horizontal overflow |
| Print summary | Pass |
| axe-core | Scheduled in repository Playwright CI; not run locally |
| Native Windows Chromium `file://` | Not executed; managed policy blocked navigation |

## Existing Builder/Merger routes

| Route | Result |
|---|---|
| Build Workbook | Pass; workbook downloaded |
| Merge Workbook | Pass; `l2g_workbook_merge_v1` version 1.1 downloaded |
| Create from External CSV | Pass; workbook downloaded |
| Existing-route page errors | 0 |

## Static runtime checks

- JavaScript syntax: pass for all embedded scripts.
- Forbidden legacy term: 0 occurrences.
- Network APIs: 0 prohibited occurrences.
- Remote scripts: 0.
- CSP local-only restriction: present.

## Required follow-up before promotion

1. Run the repository GitHub Actions suite on the stacked draft PR.
2. Run axe-core through the shared Playwright workflow.
3. Run native Windows Chromium from the standalone `file://` path.
4. Keep the route proposal/unvalidated until contract PR #94 is approved and promoted.
