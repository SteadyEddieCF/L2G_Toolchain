# Issue #93 Bounded Scope — SSP v1.9.17

Implement only the SSP consumer and browser-local append-only evidence history for the frozen proposal route `l2g_ssp_word_qa_sidecar_v1` version 1.0.

The release accepts one JSON sidecar and its exact paired SSP DOCX through a preview-first workflow. It independently verifies strict structure, duplicate-key rejection, canonical identities, the exact artifact, the embedded export manifest, the current governed SSP source, retry lineage, and local currency. Explicit local acceptance or stale acknowledgement is required before a record is appended.

Out of scope: Builder/Merger production logic, contract promotion to `validated`, the working-data schema, profile registry, authored SSP content, RG-2/RG-3 semantics, Workshop records, adjacent tools, compliance/readiness/assessment/certification/scoring conclusions, authenticated identity, digital signature, and client-release approval.
