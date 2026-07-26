# CMMC L2 Gap Workshop Tool v79 Release Report

**Release:** CMMC L2 Gap Workshop Tool v79 — Full McFirecoal Toolchain Regression  
**Bounded instruction:** GitHub issue #49  
**Protected-main baseline:** `a55a7199d34de6d8eef66712ee13db0572f4d6e8`  
**Runtime SHA-256:** `a1f63944d0573587e2a5b7826f72befa16f6d89b849f3129f7f6dbb080da54ca`  
**Runtime size:** `1,836,145` bytes  
**Regression evidence fingerprint:** `sha256-c6e013d78e72c1db0b3861bf250bb4d503f709f2733cb6fb75e69329f5943fb4`

## Result

All 10 required route groups passed. The registered McFirecoal v1.2.0 fixture ZIPs matched their governed sizes, SHA-256 values, entry counts, and CRC expectations. The exact suite used Control Center v0.3.4, DocConverter v7.9.5.1, Scoper v3.12, Workshop v79, Builder/Merger v3.8, and SSP v1.9.5.1.

## Corrective action discovered and closed

The replay reproduced a Workshop v78 mapping defect: `CM.L2-3.4.4[a]` from the governed workbook merge package did not match the catalog identifier `CM.L2-3.4.4 [a]`, so v78 mapped 319 of 320 objectives. v79 canonicalizes whitespace before bracketed objective suffixes while preserving catalog validation. The corrected runtime maps 320 of 320 objective rows, applies the workbook overlay, and completes undo without changing package input.

## Execution posture

- Active replay: fixture integrity, Scoper-to-Workshop, Workshop/SSP round trip, Workshop workbook merge/undo, Control Center read-only inspection, and Part 3 adversarial cases.
- Governed evidence revalidated against unchanged exact runtime hashes: McFirecoal-to-DocConverter, DocConverter-to-Scoper, and Builder/Merger workbook/package generation.
- Current SSP v1.9.5.1 backup identity was actively checked as schemaVersion/appVersion `1.9.5.1`.
- Optional Workshop v78 helper fields remained ignorable and did not establish downstream consumption.

## Safety and authority

This release reports technical route success or failure only. It does not infer evidence sufficiency, authenticity, effectiveness, Met/Not Met, readiness, risk, compliance, certification, scoring, or an assessment conclusion. Adjacent-module application code was not changed. No new stable contract or future SSP review/delivery-profile contract was introduced.

## Candidate suite snapshot

`suite-2026.07.26-workshop-v79-mcfirecoal-v1.2.0` is eligible because every required route passed. It remains a candidate until v79 is promoted and repository metadata is reconciled.
