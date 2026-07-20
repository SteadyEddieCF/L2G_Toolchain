# DocConverter-L2G Validation-Question Candidate Precision Prompt
## Adjacent-tool action identified by the L2G Scoper v3.11 audit

This is a narrowly scoped DocConverter-L2G development prompt.

Do not modify L2G Scoper, the CMMC L2 Gap Workshop Tool, Builder/Merger, SSP, or Control Center in this task.

## Problem

A fresh DocConverter v7.9 McFeddy Fed `l2g_scope_context_v1` package supplied 21 validation-question records. Seven were raw JSON field/value fragments rather than clean questions, including examples such as:

```text
"review_required_reason": "Synthetic setup data requires advisor review.",
"Notes": "Provider admin access requires validation."
"why_review_required": "Client-proposed categorization must be validated by advisor.",
```

L2G Scoper v3.11 preserved and displayed these strings on its Review page. Scoper should add defensive filtering in a future bounded release, but DocConverter owns the upstream extraction and candidate-precision behavior.

## Objective

Improve validation-question candidate precision so DocConverter exports clean, source-traceable, advisor-review-required questions rather than JSON syntax, package metadata, headers, or field/value fragments.

## Required behavior

Question-candidate extraction must:

- retain explicit questions and clear validation instructions;
- retain source document ID, filename, source basis, source reference, and confidence;
- reject JSON key/value fragments that are not natural-language questions;
- reject object/array delimiters and package metadata;
- reject table headers and schema field names;
- reject downstream package content that is being re-ingested as ordinary source evidence unless deliberately supported as a reference input;
- normalize trailing quotation marks, commas, and unmatched punctuation;
- deduplicate case/punctuation variants;
- preserve conflicting genuine questions as separate records when their source or meaning differs;
- label inferred questions as draft/advisor-review-required;
- avoid practice-readiness, evidence-sufficiency, final-scope, scoring, or compliance conclusions.

## Guardrails

Preserve:

- `l2g_scope_context_v1`, package version 1.0;
- existing package kinds and versions;
- stable source IDs and fingerprints;
- local/offline operation;
- no network calls or telemetry;
- current OCR, diagram, security-evidence, meeting-context, and evidence-bundle safeguards;
- unknown optional field compatibility.

Do not remove source records solely because one extracted candidate is malformed. Filter the candidate, not the source document.

## Suggested candidate rules

Treat a string as low-quality/non-question when it primarily matches patterns such as:

- `"field_name": "value"`
- `{`, `}`, `[`, `]`, or comma-delimited package syntax;
- known package keys such as `review_required_reason`, `why_review_required`, `Notes`, `package_kind`, `records`, or `source_summary` without a natural-language instruction;
- short column/header labels;
- serialized downstream package rows.

A natural-language validation instruction may remain even when it does not end with a question mark, for example:

> Confirm whether provider administrators can access security logs.

## Required regression

Use the same fresh McFeddy Fed package and show:

- original 21 candidate strings;
- accepted clean candidates;
- rejected/quarantined candidates with reason;
- zero raw JSON field/value fragments in exported validation questions;
- source traceability retained for accepted questions;
- package identities unchanged;
- no prohibited conclusions;
- no local path leakage;
- no regression to ordinary questionnaire or evidence-tracker question extraction.

## Files the DocConverter developer needs

1. Current authoritative DocConverter-L2G HTML baseline.
2. Fresh McFeddy Fed evidence/test package used to generate the v7.9 scope context.
3. The fresh v7.9 `l2g_scope_context_v1.json` that contains the malformed candidates.
4. `L2G_Scoper_v3.11_Post_Release_Audit_Report.md`.
5. `L2G_Scoper_v3.11_Post_Release_Audit.json`.

## Why Scoper cannot fully solve this

Scoper controls what it displays and returns, so it should defensively filter malformed inputs. It does not control DocConverter’s source parsing and candidate-generation pipeline. Without an upstream correction, the same malformed candidates may reach other downstream consumers or future exports.

Produce a bounded DocConverter release only if the current authoritative baseline still reproduces the issue.
