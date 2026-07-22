# Architecture and Data Model — v1.8.2

Portfolio schema 1.2.0 extends each module-requirement record with source record identity/version, canonical fingerprint metadata, current/stale state, supplement fields, override state/rationale/field list, and snapshot timestamps. Source eligibility is deterministic: an ancestor or an active shared-service module, always for the same requirement ID.

The fixed inherited field set covers implementation, responsibility narratives, owners, evidence references, scope, remediation, POA&M reference, and validation date. Applicability rationale, child review/approval tracking, child version, supplements, and override governance remain local.
