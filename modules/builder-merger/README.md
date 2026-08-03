# L2G Builder/Merger

Local bridge between Workshop Handoff and the designated workbook, plus governed Workbook Merge return and bounded local output-governance routes.

- Current promoted release: **v3.10.1 — Workshop Action and Ownership Preservation**
- Runtime: `releases/v3.10.1/L2G-BM_v3.10.1.html`
- Runtime SHA-256: `2879ee0a933b74c9f27b3c94c0034eafd06f13bc0a8e2d52ba064467b19bfd93`
- Runtime size: `832972` bytes
- Promotion: issue #106, PR #113, reviewed head `bbc8d3bea308a1655567780bea002bc8ef834d8a`, merge commit `d3cd223befb3aa1b53b2feea291b9f38b8d2645e`
- v3.9 remains reserved for Advisor and Client Delivery Profiles.

v3.10.1 preserves Workshop action, evidence-ownership, request, and provider-follow-up records through visible deterministic workbook helper sheets and the optional Workbook Merge extension at `workbook_source.workshop_governance_preservation_v1`. The helper metadata includes the canonical SHA-256 source-Handoff fingerprint so the workbook can be validated before and after the comparison Handoff is loaded. Workbook Merge remains `l2g_workbook_merge_v1` version `1.1`; its frozen top-level shape remains unchanged.

The exact Workshop v79.1 → Builder/Merger v3.10.1 → Workshop v79.1 merged-main round trip passed issue #101 Phase 1 validation on head `3b74f16526f70de7d5972ee461189ff4fb9bb302`. The Builder/Merger v3.10.1 → SSP v1.9.17 Final Word-QA sidecar route also passed current, stale, blocked, incomplete, duplicate, retry, supersession, history-persistence, authority-isolation, accessibility, visual, and Windows `file://` gates.

Draft PR #118 carries the `l2g_ssp_word_qa_sidecar_v1` version 1.0 validated registry candidate and the additive current-suite snapshot. Those records become current only after the final PR head passes every gate and merges.

Preserve Workshop Handoff 1.7, Workbook Merge 1.1, Builder Decision Plan 1.0, reviewer-authored workbook content, formulas, validation, formatting, source lineage, and local/offline guarantees. Builder/Merger rendering and reconciliation do not alter source-domain conclusions or establish assessment, evidence-sufficiency, readiness, risk, compliance, certification, scoring, approval, or client-release authority.
