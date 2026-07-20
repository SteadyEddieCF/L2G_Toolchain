# DocConverter-L2G v7.9.5.1 Release Report

Released: 2026-07-20  
Release type: **Bounded validation-question candidate precision hotfix**  
Authoritative baseline: **DocConverter-L2G v7.9.5**

## Reason for release

The L2G Scoper v3.11 post-release audit identified malformed validation-question candidates in a fresh DocConverter-generated `l2g_scope_context_v1` package. The v7.9.5 baseline still reproduced the problem: raw JSON field/value fragments passed through broad “requires validation/advisor review” text matching and were exported as questions.

Because the defect reproduced, this release applies a DocConverter-only correction. Scoper, Workshop, Builder/Merger, SSP, and Control Center were not modified.

## Bounded correction

v7.9.5.1 adds a final candidate-precision sanitation layer to the existing scope-package build:

- retains explicit questions and clear natural-language validation instructions;
- rejects raw JSON field/value fragments, delimiters, package metadata, schema labels, and short headers;
- rejects ordinary text-scan question candidates from known downstream L2G package JSON files;
- normalizes serialization punctuation;
- merges case/punctuation-equivalent duplicates while retaining combined source lineage;
- preserves genuine questions and validation instructions from questionnaires, evidence trackers, reports, and provider artifacts;
- keeps accepted inferred questions draft and advisor-review-required;
- reports accepted, rejected, and merged counts in an Advanced precision panel.

The source document remains available even when an individual candidate is rejected.

## Regression summary

All focused release gates passed:

- Baseline defect reproduction: **PASS — defect confirmed**
- Controlled mixed replay: **PASS**
- Exact affected 21-candidate fixture: **PASS**
- McFirecoal representative real-file replay: **PASS**
- Package identity and guardrails: **PASS**
- Runtime safety and stable identity: **PASS**
- Static JavaScript/CSP/ID scan: **PASS**

The affected fixture produced **11 accepted unique questions**, **8 rejected candidates**, and **2 merged duplicates**, with **zero** raw JSON field/value fragments exported.

## Preserved behavior

- Local/offline single-file operation
- CSP network blocking and no telemetry/cloud upload
- Native extraction and selective embedded OCR
- Native/OCR separation and source selection
- Diagram, visual artifact, security-evidence, meeting-context, and evidence-bundle safeguards
- Exception & Trust Queue and Provenance Explorer
- Stable source IDs, fingerprints, filenames, source references, confidence, and limitations
- Unknown optional field compatibility
- Human-controlled scope, evidence, readiness, scoring, and compliance conclusions

## Contracts

No contract redesign occurred:

- `l2g_intake_package_v1` — version `1.0`
- `l2g_scope_context_v1` — version `1.0`
- `l2g_meeting_context_v1` — version `1.0`

## Versioning decision

The release is numbered **v7.9.5.1** because it is a demonstrated precision hotfix to v7.9.5. It does not consume or replace the planned **v7.9.6 OCR Review Workbench and Batch Navigation** milestone.

## Validation limitation

A full 104-file McFirecoal browser ZIP extraction timed out in the managed environment and is not claimed as a pass. The local checklist includes a complete Windows Chrome/Edge ZIP run.

## Primary artifact

- `DocConverter-L2G_v7.9.5.1.html`
- Size: `7,952,581` bytes
- SHA-256: `df64d0912b43d69d5eda256188458c3d32f9aa679c49ed43f6ddf4cb64b9c17d`
