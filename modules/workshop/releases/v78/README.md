# CMMC L2 Gap Workshop Tool v78

Release candidate for **Contract-safe Reporting and SSP/Workbook Alignment**, developed from the exact promoted v77 runtime under GitHub issue #46.

- Primary runtime: `cmmc_l2_gap_workshop_tool_v78.html` (deterministically materialized; not duplicated in git history)
- Runtime size: `1,814,727` bytes
- Runtime SHA-256: `e34723924a81208d986e734e46833c7cfef064a568007dec1ac281fc1e0a0191`
- Baseline v77 SHA-256: `eaed7cc745a9c963b5977b4ecca2ddd8183714afc91fefd8e3d7788dbda4f5a1`
- Bounded issue: #46
- Draft PR: #47

## Delivered capability

- accepted-only advisor and client evidence-ownership reporting;
- deterministic snapshot identities and repeatable generated-at metadata;
- client-safe removal of advisor notes, validation questions, source fingerprints, sensitive values, and local paths;
- local/offline HTML, Markdown, JSON, CSV, and print-friendly outputs;
- optional additive helper snapshots in Workbook Handoff 1.7 and SSP Handoff 1.0;
- preserved v77 ownership, request, provider-follow-up, action, and blocker identifiers;
- no downstream acceptance, evidence-sufficiency, readiness, risk, compliance, certification, scoring, or assessment inference.

## Stable contracts

- Workshop State 1.0, additive only;
- Workbook Handoff 1.7;
- Workbook Merge 1.1;
- SSP Handoff 1.0;
- SSP Return 1.0.

Older consumers may ignore the optional v78 helper fields. Builder/Merger and SSP consumption is not claimed, and no review/delivery-profile contract is introduced.

## Validation

- deterministic materialization: passed on Linux and Windows;
- repository validation: passed;
- focused Playwright runtime and axe-core QA: passed;
- reviewed light/dark visual regression: passed using the unchanged v77 landing baselines with only the independently asserted version badge normalized for comparison;
- native Windows Chromium `file://` smoke: passed;
- deterministic standalone and complete ZIP packaging: passed.

## Build and package

```text
python modules/workshop/releases/v78/build_release.py
python modules/workshop/releases/v78/package_release.py
```

The packaging step creates the standalone HTML, complete deliverables ZIP, release manifest, and SHA-256 checksum under `modules/workshop/releases/v78/dist/`.

**Status:** validated draft release candidate pending independent orchestrator review and promotion only.
