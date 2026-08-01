# CMMC L2 Gap Workshop Tool

Central facilitation and advisor-review module for practices, evidence, evidence requests, provider/responsibility discussion, provider follow-up, actions, blockers, workbook and SSP round trips.

- Current promoted release: **v79 — Full McFirecoal Toolchain Regression**
- Current draft corrective candidate: **v79.1 — Strict Workbook Merge Validation**, issue #105 / PR #112
- Candidate runtime source: `releases/v79.1/`
- Previous promoted release: **v78 — Contract-safe Reporting and SSP/Workbook Alignment**
- Next separately bounded action: **Proposed v80 Regression Delta and Release Comparison**

Stable routes remain Workshop State 1.0, Workbook Handoff contract release 1.7 with wire package version 1.0, Workbook Merge 1.1, SSP Handoff 1.0, and SSP Return 1.0.

The v79.1 candidate preserves the frozen Workbook Merge top-level shape and adds no new operational authority. It validates the optional governance-preservation assertion only at `workbook_source.workshop_governance_preservation_v1`. Exact source, workbook-preserved, and current Workshop records must agree; missing, duplicate, mismatched, malformed, or incorrectly fingerprinted assertions block apply. The assertion never creates, restores, overwrites, closes, reopens, or deletes actions, evidence-ownership records, requests, or provider follow-up.

Workshop remains authoritative for facilitated practice conclusions, evidence review and evidence requests, provider/responsibility discussion, provider follow-up, engagement gaps, actions, blockers, and accepted evidence-ownership records. Candidate and technical route results must not be interpreted as evidence sufficiency, readiness, risk, compliance, certification, scoring, or final assessment conclusions.
