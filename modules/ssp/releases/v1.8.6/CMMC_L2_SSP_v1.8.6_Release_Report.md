# CMMC L2 SSP Modern Editable v1.8.6 Release Report

## Release focus

Formal review and approval workflow for optional portfolio mode, with local role assignments, portfolio/module submission rounds, reviewer dispositions, segregation of duties, fingerprint-bound approval records, staleness detection, and revocation.

## Implemented

- Scoped Author, Reviewer, Approver, and Administrator assignments.
- First-administrator bootstrap and administrator-controlled role management.
- Portfolio-wide or selected-module review submissions.
- Changes requested, Ready for approval, and Abstain reviewer dispositions.
- Submitter/reviewer/approver segregation of duties.
- Approval records tied to exact governed-content fingerprints.
- Derived stale status when content changes after approval.
- Revocation that preserves the original record, actor, time, and reason.
- Exportable review and approval register JSON.

## Preserved

Single-System remains the default. The 110-requirement model, offline operation, portfolio/module exchange, module Word Review, CRM, deterministic inheritance, parent-change impact review, conflict escalation, Workshop handoff, SSP return package, and read-only audit contracts remain intact.

## Deliberate boundary

Names and roles are locally asserted, not authenticated identities or digital signatures. Formal authoring approval is not an assessment finding, compliance conclusion, readiness determination, certification decision, or immutable baseline. Immutable named baselines are the next bounded v1.8.7 release.

## Validation

Local validation passed. Runtime SHA-256: `a9f872d7e3f0e9dd8515ac34a784086d536306cd00d0768066f657025c82f630`.
