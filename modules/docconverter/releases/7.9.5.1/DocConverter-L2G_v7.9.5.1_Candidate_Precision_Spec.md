# DocConverter-L2G v7.9.5.1 — Validation-Question Candidate Precision Specification

## Purpose

This bounded hotfix corrects malformed validation-question candidates exported in `l2g_scope_context_v1`. It does not redesign extraction, change package identities, or add a downstream contract.

## Reproduced defect

The authoritative v7.9.5 baseline was replayed with the seven malformed field/value fragments from the affected v7.9 scope package. All seven were exported as validation questions. The defect therefore remained present in the current baseline and justified a bounded release.

## Acceptance policy

A candidate is retained when it is a natural-language question or a clear validation instruction, including instructions beginning with verbs such as **confirm**, **validate**, **verify**, **determine**, **clarify**, **identify**, **document**, **explain**, **describe**, **review**, **assess**, **provide**, **show**, or **demonstrate**.

A candidate may also be retained when it clearly states that a specific condition requires validation, confirmation, clarification, or advisor review. Risk labels such as `RISK-002:` are permitted when the text following the label is a natural-language validation instruction.

## Rejection and quarantine policy

The export sanitation layer rejects or quarantines:

- raw JSON field/value fragments;
- object or array delimiters;
- known non-question fields such as `review_required_reason`, `why_review_required`, `Notes`, `package_kind`, `records`, and `source_summary`;
- schema labels and short headers such as `Open items`;
- ordinary text-scan candidates produced by re-ingesting known downstream L2G package JSON files;
- strings that are neither explicit questions nor clear validation instructions.

A rejected candidate does **not** delete or suppress its source document.

## Normalization and deduplication

- Leading bullets and wrapping quotation marks are removed.
- Trailing serialization commas and unmatched quotation marks are removed.
- Whitespace and punctuation spacing are normalized.
- Case/punctuation-equivalent candidates are merged.
- Merged candidates retain the combined source document IDs, filenames, and references.
- Genuine conflicting questions remain separate when their meaning differs.

## Trust and provenance

Accepted inferred candidates are marked draft and advisor-review-required. Existing source document ID, filename, source basis, source reference, confidence, and source arrays are retained or merged. Source support does not imply evidence sufficiency, final scope, readiness, scoring, or compliance.

## Export behavior

Sanitation occurs before the existing package is returned or downloaded. The release preserves:

- `l2g_intake_package_v1` version `1.0`;
- `l2g_scope_context_v1` version `1.0`;
- `l2g_meeting_context_v1` version `1.0`;
- unknown optional fields and existing package consumers.

A compact Advanced panel reports accepted, rejected, and duplicate-merged counts from the most recent package build.

## Deliberate exclusions

This release does not:

- modify Scoper or other L2G tools;
- make final scoping or assessment conclusions;
- introduce remote AI, OCR, telemetry, or network calls;
- remove source records because one candidate was malformed;
- replace the planned v7.9.6 OCR Review Workbench milestone.
