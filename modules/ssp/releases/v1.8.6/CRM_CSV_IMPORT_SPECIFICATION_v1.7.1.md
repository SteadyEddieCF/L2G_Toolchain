# CRM CSV Import Specification — v1.7.1

## Required headers
The importer requires the 15 headers used by the CRM export. Header comparison is case insensitive.

## Mapping
- Requirement ID → control mapping key
- Implementation Status → implementation status radio
- CSP/ESP columns → structured provider fields
- Responsibility narrative → inheritance/shared-responsibility narrative
- Organization implementation/current condition → implementation statement
- Responsible role/owner → owner
- Evidence/artifact references → evidence
- Assumptions/scope/remediation → scope notes
- POA&M/remediation reference → POA&M field

## Protected columns
Family, Requirement Title, and Requirement Statement are validation context. They never overwrite the embedded catalog.

## Validation and safety
- Duplicate Requirement IDs stop import.
- Unknown Requirement IDs are skipped and reported.
- Unrecognized statuses are reported and left unchanged.
- Import requires explicit confirmation and offers a backup-first action.
- Imported changes are captured as one session history action.
