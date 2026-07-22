# Architecture and Data Model — v1.8.1

The local-only single-file application retains the v1.8.0 portfolio hierarchy and advances the optional portfolio schema to 1.1.0. In Modular Portfolio mode, runtime validation enforces exactly one record for every module/requirement pair: 110 records per module and up to 5,500 records for 50 modules.

Each record contains every field named in the enhancement charter: stable IDs, applicability and rationale, implementation fields, declared inheritance source/version/type, responsibility allocations, owners, evidence references, scope, remediation, POA&M, override placeholders, review/approval tracking, validation date, and version. Override fields remain fixed to `none` and empty rationale until v1.8.2.

The existing SSP remains the authoritative anchor document. Module records are separate decision metadata and never change protected requirement text or silently copy anchor narratives.
