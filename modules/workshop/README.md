# CMMC L2 Gap Workshop Tool

Central facilitation and advisor-review module for practices, evidence, evidence requests, provider/responsibility discussion, provider follow-up, actions, blockers, workbook and SSP round trips.

- Draft corrective candidate: **v79.1 — Strict Workbook Merge Validation**
- Candidate runtime: `releases/v79.1/cmmc_l2_gap_workshop_tool_v79.1.html`
- Current promoted baseline: **v79 — Full McFirecoal Toolchain Regression**
- Next planned feature workstream: **v80 Regression Delta and Release Comparison** (preserved)

v79.1 is narrowly bounded to issue #105. It rejects unsupported Workbook Merge versions, unknown top-level fields, duplicate JSON keys, duplicate/conflicting practice and objective identities, and mismatched parent relationships before trusted preview or apply. Rejected packages do not mutate governed Workshop state.

Workbook Handoff remains **contract release 1.7 — wire package version 1.0**. v79.1 self-reconciles its top-level identity, embedded contract manifest, package-integrity release, and final canonical fingerprint before export.

Stable routes remain Workshop State 1.0, Workbook Handoff 1.7/wire 1.0, Workbook Merge 1.1, SSP Handoff 1.0, and SSP Return 1.0. No adjacent module runtime, registry, historical suite snapshot, or RG-4 sidecar status changes are included.

Final issue #105 closure remains dependent on the exact Builder/Merger v3.10.1 candidate round trip from issue #106.
