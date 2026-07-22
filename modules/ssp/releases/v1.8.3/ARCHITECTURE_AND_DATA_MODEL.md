# Architecture and Data Model — v1.8.3

Portfolio schema 1.3.0 adds decision identity/state, rationale, reviewer/time, current and previous source fingerprints, changed fields, and conflict fields to each module-requirement record. Stale records are grouped at runtime by source module. Escalation creates an open conflict record linked to the target requirement, source module, source fingerprint, and collision fields. The existing change history is the durable audit trail for each decision.
