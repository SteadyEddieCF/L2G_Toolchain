# Validation Rule Catalog — v1.8.7

- `BASELINE-NAME-UNIQUE`: reject duplicate case-insensitive names.
- `BASELINE-FRESH-APPROVAL`: require current scope fingerprint to equal an active formal approval.
- `BASELINE-ROLE-SCOPE`: require Approver or Administrator assignment for creation.
- `BASELINE-BLOCKING-CONFLICT`: reject open conflicts without active authorized exceptions.
- `BASELINE-SNAPSHOT-FINGERPRINT`: retain exact source and snapshot fingerprints.
- `BASELINE-APPEND-ONLY`: expose no edit/delete operation for baseline records.
- `BASELINE-SUPERSESSION-EVENT`: supersede through append-only event records.
- `BASELINE-COMPARE-PORTFOLIO`: block cross-portfolio comparison.
- `BASELINE-RESTORE-ADMIN`: require Administrator assignment and rationale.
- `BASELINE-RESTORE-NEW-VERSION`: increment working version and preserve history.
- `BASELINE-NO-CONCLUSION`: never generate assessment, readiness, compliance, or certification conclusions.
