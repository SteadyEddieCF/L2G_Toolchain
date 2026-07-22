# Formal Review and Approval Specification — v1.8.6

## Roles
Author submits a portfolio or module scope. Reviewer records a disposition. Approver records approval after a Ready for approval disposition. Administrator manages role assignments and may revoke approvals. The first active assignment must bootstrap a portfolio administrator.

## Segregation of duties
A submitter cannot review the same submission. A submitter or reviewer cannot approve the same submission. Author, Reviewer, and Approver assignments cannot overlap for the same person in an overlapping scope.

## Fingerprints and staleness
Each submission and approval stores a deterministic fingerprint of the governed authoring content. Workflow records and history are excluded from the fingerprint. An approval remains in the register but is displayed as stale when current content no longer matches.

## Revocation
Revocation never deletes an approval. It adds the revoking actor, timestamp, and reason, updates the linked submission, and records a change-history event.

## Boundary
Local identities are asserted, not authenticated. Formal authoring approval is not a CMMC assessment, compliance conclusion, certification decision, readiness determination, or immutable baseline.
