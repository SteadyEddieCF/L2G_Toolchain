# CMMC L2 Gap Workshop Tool v77 Release Report

**Release:** CMMC L2 Gap Workshop Tool v77 — Evidence Ownership and Provider Follow-up  
**Bounded instruction:** GitHub issue #38  
**Baseline:** exact merged Workshop v76 runtime  
**Release date:** July 23, 2026  
**Runtime SHA-256:** `eaed7cc745a9c963b5977b4ecca2ddd8183714afc91fefd8e3d7788dbda4f5a1`  
**Baseline SHA-256:** `d9f4a3b3fff7ba18498544e3c424d2f4493e555ddc4a688ef0359069b66ac06a`

## Scope delivered

v77 adds a Workshop-authoritative evidence-ownership and provider-follow-up workflow without moving authority to adjacent modules.

- Derives evidence-production, retention, access/access-path, submission, and review/follow-up owner candidates only from accepted or modified responsibility records.
- Separates provider-produced platform evidence, client configuration evidence, client operational evidence, and shared/combined evidence.
- Shows practice, requirement, service/module/provider context, responsibility provenance, contract/SOW/RACI validation needs, access limitations, and validation questions.
- Requires explicit advisor acceptance before a request can be created and explicit confirmation before creating a request or provider follow-up.
- Creates deterministic, deduplicated ownership (`EOC-*`), request (`REQ-*`), provider follow-up (`PFU-*`), and linked action (`ACT-V77-*`) identifiers.
- Links accepted requests and provider follow-up to the existing Action & Blocker Register.
- Adds queues for client requests, provider requests, shared evidence, contractual validation, access limitations, overdue follow-up, and unresolved ownership.
- Preserves undo/redo, autosave, deterministic working export/reload, dark/light mode, print behavior, and offline operation.

## Authority and safety boundaries

Workshop remains authoritative for facilitated practice conclusions, evidence review and requests, provider/responsibility discussion, provider follow-up, engagement gaps, actions, and blockers. The release does not infer evidence sufficiency, authenticity, effectiveness, acceptance, assessment conclusions, Met/Not Met, readiness, risk, compliance, certification, or scoring. It does not infer final responsibility from provider names or types, overwrite reviewer-authored evidence/workbook content, or create remote messages, notifications, calendar events, or background workflow.

## Contract posture

No stable package version changed.

- `l2g_workshop_state_v1`: 1.0, additive backward-compatible `evidenceOwnershipV77` fields.
- `l2g_workbook_handoff_v1`: enhancement 1.7 preserved; v77 working record bodies are not injected.
- `l2g_workbook_merge_v1`: 1.1 preserved.
- `l2g_ssp_handoff_v1`: 1.0 preserved.
- `l2g_ssp_return_package_v1`: 1.0 preserved.
- No SSP review/delivery profile contract was introduced.
- No claim is made that Builder/Merger, SSP, or Control Center consumes the new v77 working records.

## Validation results

- Focused browser regression: **29/29 passed**.
- McFirecoal v1.2.0 three-part regression: **29/29 passed**.
- Fixture archive counts: Part 1 = 43, Part 2 = 67, Part 3 = 53; CRC checks passed.
- Accepted reviewed McFirecoal responsibility records: 55; candidate derivation exercised all four evidence categories.
- Repeated candidate generation, saves, requests, and follow-up used stable identifiers and prevented duplicates.
- Generation and acceptance created no request/action until the explicit request/follow-up action.
- Valid workbook and SSP previews did not mutate source packages or practice conclusions.
- Unknown/tampered/invalid integration cases remained blocked or review-required.
- Page errors: 0; console errors: 0; external network requests: 0.
- Inline JavaScript syntax: pass for 9 blocks; duplicate static IDs: 0.

## Remaining repository gates

The draft PR must remain unmerged while GitHub runs repository validation, Playwright/axe-core, visual regression, and native Windows Chromium `file://` smoke. Direct `file://` navigation is blocked by the managed local browser environment, so the native Windows gate is not claimed locally.

## Non-goals preserved

No v78 reporting or SSP/workbook alignment, no future SSP review/delivery profile, no Builder/Merger profile implementation, no Control Center v0.4 work, no Scoper v3.13, no DocConverter promotion, and no adjacent-module application changes.
