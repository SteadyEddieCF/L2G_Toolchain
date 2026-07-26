# CMMC L2 Gap Workshop Tool v79

Draft release candidate for **Full McFirecoal Toolchain Regression**, developed from the exact promoted Workshop v78 runtime under GitHub issue #49.

- Primary runtime: `cmmc_l2_gap_workshop_tool_v79.html` (deterministically materialized; not duplicated in git history)
- Runtime size: `1,836,145` bytes
- Runtime SHA-256: `a1f63944d0573587e2a5b7826f72befa16f6d89b849f3129f7f6dbb080da54ca`
- Baseline v78 SHA-256: `e34723924a81208d986e734e46833c7cfef064a568007dec1ac281fc1e0a0191`
- Bounded issue: #49

## Delivered capability

- read-only Full McFirecoal Toolchain Regression workspace;
- exact six-tool version and hash inventory;
- registered McFirecoal v1.2.0 Parts 1–3 integrity evidence;
- route-by-route active replay and governed-evidence revalidation results;
- corrected canonical mapping of `CM.L2-3.4.4[a]` to the catalog form `CM.L2-3.4.4 [a]`;
- complete 320/320 workbook objective round trip;
- deterministic JSON, Markdown, HTML, and print-friendly technical regression summaries;
- eligible exact-version suite snapshot after all required routes passed.

## Boundaries

Stable package identities remain Workshop State 1.0, Workbook Handoff 1.7, Workbook Merge 1.1, SSP Handoff 1.0, and SSP Return 1.0. Technical route success does not establish evidence sufficiency, effectiveness, Met/Not Met, readiness, risk, compliance, certification, scoring, or an assessment conclusion. No adjacent-module application code or future SSP review/delivery-profile contract is included.

## Build and package

```text
python modules/workshop/releases/v79/build_release.py
python modules/workshop/releases/v79/package_release.py
```

All required repository and browser validation gates passed on the exact candidate.

**Status:** draft release candidate pending independent orchestrator review only.
