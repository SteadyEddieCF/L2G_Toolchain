# CMMC L2 Gap Workshop Tool

Central facilitation and advisor-review module for practices, evidence, evidence requests, provider/responsibility discussion, provider follow-up, actions, blockers, workbook and SSP round trips.

- Current promoted release: **v79.1 — Strict Workbook Merge Validation**
- Runtime: `releases/v79.1/cmmc_l2_gap_workshop_tool_v79.1.html`
- Runtime SHA-256: `b6bd63c104faeb031f9561f24aaf6a8fb7b928df2f11c821391ca57131d6e52b`
- Promotion: issue #105, PR #112, reviewed head `2c5bedd63a1a82cbb82becb470d74458824e5537`, merge commit `e14ed000e490040182b529d7e2b3bc7155c03287`
- Previous promoted release: **v79 — Full McFirecoal Toolchain Regression**
- Next separately bounded action: **Proposed v80 Regression Delta and Release Comparison**

Stable routes remain Workshop State 1.0, Workbook Handoff contract release 1.7 with wire package version 1.0, Workbook Merge 1.1, SSP Handoff 1.0, and SSP Return 1.0.

v79.1 preserves the frozen Workbook Merge top-level shape and adds no new operational authority. It validates the optional governance-preservation assertion only at `workbook_source.workshop_governance_preservation_v1`. Exact source, workbook-preserved, and current Workshop records must agree; missing, duplicate, mismatched, malformed, or incorrectly fingerprinted assertions block apply. Missing governed values remain missing: `candidate_id` is not inferred from `ownership_record_id`. The assertion never creates, restores, overwrites, closes, reopens, or deletes actions, evidence-ownership records, requests, or provider follow-up.

The exact Workshop v79.1 → Builder/Merger v3.10.1 → Workshop v79.1 merged-main round trip passed issue #101 Phase 1 validation on head `3b74f16526f70de7d5972ee461189ff4fb9bb302`, including strict current, duplicate, mismatch, missing-record, malformed, adversarial, non-mutation, accessibility, visual, and Windows `file://` gates. Draft PR #118 carries the final additive suite snapshot and registry reconciliation; its final head must pass again before issue #101 closes.

Workshop remains authoritative for facilitated practice conclusions, evidence review and evidence requests, provider/responsibility discussion, provider follow-up, engagement gaps, actions, blockers, and accepted evidence-ownership records. Technical route results must not be interpreted as evidence sufficiency, readiness, risk, compliance, certification, scoring, or final assessment conclusions.
