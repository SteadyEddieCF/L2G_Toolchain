# Architecture and Data Model — v1.8.6

Portfolio schema 1.6.0 adds bounded `reviewRoleAssignments`, `reviewSubmissions`, `reviewDispositions`, and `approvalRecords`. Review fingerprints cover governed SSP/portfolio authoring content but exclude workflow records and change history. Approval freshness is derived by comparing the active approval fingerprint to current content. Records are append-oriented; revocation and supersession preserve prior approvals.
