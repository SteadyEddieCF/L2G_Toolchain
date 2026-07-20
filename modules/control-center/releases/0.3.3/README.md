# L2G Control Center v0.3.3

Bounded baseline-synchronization patch built from the validated v0.3.2 Control Center baseline.

- Expected module baselines: DocConverter v7.9.5, Scoper v3.11, Workshop v76, Builder/Merger v3.8, SSP v1.7
- SSP remains Stage 5
- Governed package rules: 16 total (9 stable, 7 optional/read-only)
- New optional read-only recognition: Workshop observability, responsibility overlay, overlay pack, and reconciliation v0.1
- Built-in self-tests: 58/58 passed
- Browser QA: 0 console errors, 0 page errors, 14 release-evidence screenshots
- Accessibility: 0 axe-core violations after correcting the inherited unlabeled package pickers and light-theme KPI contrast
- Next committed release: v0.4 read-only action and blocker overview

## Runtime

The canonical runtime is deterministically materialized by `build_release.py` at:

`../v0.3.3/L2G_CC_v0.3.3.html`

Primary HTML SHA-256: `29242ec69e3c44e52e33c2941b647eb9566ac721957d3965e67306fbeae2ccfc`

This source-parts arrangement preserves the repository policy that generated runtime/distribution binaries are verified and materialized rather than repeatedly duplicated in ordinary git history.

## Distribution assets

The normal user deliverables are published outside ordinary git history:

- `L2G_CC_v0.3.3.html` — SHA-256 `29242ec69e3c44e52e33c2941b647eb9566ac721957d3965e67306fbeae2ccfc`
- `L2G_CC_v0.3.3_Deliverables.zip` — SHA-256 `034276fce79c8a6873cc53948661e53bb31e7f466d73a781dffd79ff7b5f6ff5`
- 14 browser-QA screenshots are included in the ZIP and not duplicated under this release directory.

## Qualification

Control Center regression passed against the current supplied evidence and bounded fixtures. This is not a claim that the exact six-module version set completed a full end-to-end cross-tool regression.
