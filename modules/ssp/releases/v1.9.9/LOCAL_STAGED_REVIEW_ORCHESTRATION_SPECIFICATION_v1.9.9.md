# Local staged-review orchestration v1.9.9

## Ordered workflow
1. Current automated SSP source-data preflight under built-in profile v0.2.
2. Local SME Technical Review.
3. Conditional SME corrective-action loop.
4. Independent Local Quality Review.
5. Conditional Quality corrective-action loop.
6. Local Project Director sign-off.

## Governance qualification
Records are browser-local, locally asserted, and unauthenticated. They are not digital signatures, enterprise approvals, access-control decisions, assessment results, certification decisions, readiness/risk/compliance conclusions, or client-release approval.

## Progression
A stage completes only when applicable required items have acceptable terminal dispositions; N/A and exceptions contain required rationale; required notes and evidence references are present; corrective actions are closed; local attestation and reviewer metadata are present; Project Director and Engagement Lead local identifiers do not conflict; and source plus referenced-artifact fingerprints remain current. Advisory items are not unconditional blockers.

## Persistence
`reviewStageRuns` and `reviewCorrectiveActions` are additive working-data collections. Stage transitions and corrective-action events are also appended to existing `portfolioFoundation.changeHistory`. Existing review submissions, dispositions, approval records, baseline events, Word queues, author responses, and decision-history records may be linked by stable identifier and are not overwritten.
