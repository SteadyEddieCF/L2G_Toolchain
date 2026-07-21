# L2G Scoper Rolling Ten-Release Roadmap

Updated for L2G Scoper v3.12 — 2026-07-20

This roadmap preserves independent versioning and the Scoper boundary: draft CUI scoping, asset/provider/service/flow relationships, decision rationale, unresolved unknowns, and Workshop handoff context. It does not authorize final scope, assessment conclusions, practice readiness, evidence sufficiency, or scoring.

## v3.13 — Downstream Adoption and Decision-Workflow Validation

**Next planned gate.** Begin with validation and release only for a demonstrated Scoper defect or a bounded operator-review need.

Detailed scope:

1. Smoke-import a fresh v3.12 Return package into the current Workshop release and verify safe handling of `scoping_decision_ledger_v1` and `pre_workshop_question_package_v1`.
2. Re-run Scoper using a fresh DocConverter scope package after the upstream malformed-question precision correction, when available.
3. Validate that decision/question IDs remain stable after ordinary advisor edits, save/reload, export, and re-import.
4. Assess Review-page usability with a real advisor workflow: filters, owner queues, blocker/warning distinction, and navigation back to affected records.
5. Confirm client/advisor/PPT output prioritization remains readable at small, medium, and large engagement sizes.
6. Produce an adoption report before approving any new data model or contract section.

Acceptance emphasis:

- unchanged package kinds/versions unless deliberately authorized;
- no duplicate records across repeated output actions;
- no regression to v3.11 workspace loading;
- zero practice records;
- no automatic final scope conclusions.

## v3.14 — Suggested — not committed: Decision Lifecycle Editing

Consider bounded in-tool editing for validating stakeholder, validation status, next action, and supersession while preserving imported source truth and draft-only state.

## v3.15 — Suggested — not committed: Question Response Intake

Consider structured capture of client/provider answers to pre-Workshop questions with source/date attribution and explicit advisor-validation state. Do not turn answers into final scope automatically.

## v3.16 — Suggested — not committed: Scope Change Comparison

Consider a read-only comparison between two Scoper Return packages showing added, removed, or changed assets, providers, flows, services, decisions, and questions.

## v3.17 — Suggested — not committed: Large-Engagement Review Performance

Evaluate pagination/virtualization, compact summaries, and export performance for engagements materially larger than the McFeddy Fed fixture without removing detailed traceability.

## v3.18 — Suggested — not committed: Diagram-to-Ledger Reconciliation

Consider stronger read-only reconciliation between diagram nodes/edges and decision-ledger records, with explicit/inferred relationship labels and advisor confirmation.

## v3.19 — Suggested — not committed: Provider Responsibility Readiness

Expand collection and validation cues needed for a future responsibility overlay, but do not activate final provider responsibility assignments or control conclusions.

## v3.20 — Suggested — not committed: Report Delivery Profiles

Consider selectable advisor/client report detail profiles and redaction controls while preserving the established report purposes and source-traceability guardrails.

## v3.21 — Suggested — not committed: Scoping Evidence Request Export

Consider a concise evidence/request list derived from unresolved decisions and pre-Workshop questions, with owner and phase. It must remain a scoping follow-up aid, not evidence-sufficiency determination.

## v3.22 — Suggested — not committed: Contract and Accessibility Hardening

Perform a cumulative package-contract, accessibility, keyboard, visual-regression, and local-file portability audit. Release only for validated defects or clearly bounded improvements.
