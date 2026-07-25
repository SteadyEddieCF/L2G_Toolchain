# CMMC L2 Gap Workshop Tool v78 Release Report

**Release:** CMMC L2 Gap Workshop Tool v78 — Contract-safe Reporting and SSP/Workbook Alignment  
**Bounded instruction:** GitHub issue #46  
**Baseline:** exact promoted Workshop v77 runtime  
**Protected-main baseline:** `224dd1b7aa0de1e211bb6c838f41a3aaad683ffe`  
**Runtime SHA-256:** `e34723924a81208d986e734e46833c7cfef064a568007dec1ac281fc1e0a0191`  
**Runtime size:** `1,814,727` bytes  
**Baseline SHA-256:** `eaed7cc745a9c963b5977b4ecca2ddd8183714afc91fefd8e3d7788dbda4f5a1`

## Scope delivered

v78 adds Workshop-authoritative reporting and optional downstream helper references without moving authority to adjacent modules.

- Reports only explicitly accepted v77 evidence-ownership records by default.
- Produces advisor reports with ownership and responsibility identifiers, source linkage, request/provider-follow-up status, due dates, and linked action/blocker identifiers.
- Produces narrower client-safe reports that omit advisor notes, validation questions, source fingerprints, package-body detail, sensitive values, and local paths.
- Supports deterministic HTML, Markdown, JSON, CSV, and print-friendly outputs.
- Uses stable snapshot identifiers derived from audience, filters, and accepted report content.
- Reuses the original generated-at value when the same deterministic snapshot is generated repeatedly.
- Adds optional additive helper snapshots to Workbook Handoff 1.7 and SSP Handoff 1.0.
- Marks helper snapshots accepted-only, advisory-only, ignorable, non-overwriting, and not evidence of current downstream consumption.
- Preserves v77 ownership, request, provider-follow-up, action, and blocker identifiers without regeneration.

## Authority and safety boundaries

Workshop remains authoritative for facilitated practice conclusions, evidence review and requests, provider/responsibility discussion, provider follow-up, engagement gaps, actions, blockers, and accepted evidence-ownership records. Workbook results remain reviewer-controlled. SSP content and review history remain SSP-controlled. Builder/Merger retains document/workbook assembly and final-delivery authority. Control Center remains read-only.

Reporting inclusion does not establish downstream acceptance, evidence sufficiency, authenticity, effectiveness, Met/Not Met, readiness, risk, compliance, certification, assessment conclusions, or scoring. The runtime creates no remote messages, notifications, calendar events, email, telemetry, or background workflow.

## Contract posture

No stable package version changed.

- `l2g_workshop_state_v1`: 1.0, additive backward-compatible `reportingV78` state.
- `l2g_workbook_handoff_v1`: enhancement 1.7 preserved; optional ignorable helper added.
- `l2g_workbook_merge_v1`: 1.1 preserved.
- `l2g_ssp_handoff_v1`: 1.0 preserved; optional ignorable helper added when the existing handoff factory is present.
- `l2g_ssp_return_package_v1`: 1.0 preserved.
- No review/delivery-profile contract was introduced.
- No claim is made that Builder/Merger or SSP consumes the optional helper.

## Regression design

The focused browser regression verifies:

- accepted-only reporting and exclusion of candidate-only records;
- stable snapshot ID and generated-at reuse;
- advisor provenance retention;
- client-safe field and path redaction;
- workbook helper presence with unchanged 1.7 identity;
- helper accepted-only/ignorable/no-consumption posture;
- no mutation of governed v77 candidate, accepted, request, or provider-follow-up record collections;
- append-only reporting audit history;
- active v78 runtime checks;
- zero page and console errors in the focused scenario.

The shared repository suite additionally verifies module loading, offline posture, local storage, axe-core accessibility, visual baselines, and native Windows Chromium `file://` operation.

## McFirecoal v1.2.0 posture

The release retains the registered three-part fixture identity established by v77:

- Part 1: 43 entries; SHA-256 `d4b0f05a5ab27f683ab351ef5162901703fca6320c397052f7b3530aed67ad6a`
- Part 2: 67 entries; SHA-256 `154132abf67681857ba4aaf356910ef78f0d3e6bc497b9315c2b4d0814dcf8a2`
- Part 3: 53 entries; SHA-256 `52ed2172705b840e86fc9ee592dfaf1d9d9fc7b8e457c95674eb9b747cab5226`

v78-specific adversarial browser coverage uses accepted and unaccepted records, internal advisor content, source fingerprints, a local Windows path, a `file://` path, a Linux home path, and a token-like value to verify reporting selection and redaction. The full six-tool fixture replay remains the separately bounded v79 release and is not claimed here.

## Repository and CI status

- Deterministic v78 materialization: passing on Linux and Windows.
- Repository validation: passing on the byte-locked runtime.
- Native Windows Chromium `file://` smoke: passing.
- Focused runtime/axe and reviewed visual-baseline gates: pending final exact-head completion.
- Draft PR: #47, unmerged for independent orchestrator review.

This report will be updated to final exact-head status before promotion.