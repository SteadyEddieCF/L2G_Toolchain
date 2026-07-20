# DocConverter-L2G — Next 10 Release Roadmap

Current baseline: **v7.9.5.1**  
Updated: **2026-07-20**

This roadmap applies only to DocConverter-L2G. It is refreshed after every release. The completed validation-question precision hotfix does not displace the previously planned OCR milestone.

## v7.9.5.1 milestone completed

The upstream validation-question candidate defect was reproduced and corrected. Raw JSON field/value fragments, package metadata, schema headers, and ordinary re-ingested downstream-package text are filtered before scope export. Natural-language validation instructions and source lineage remain intact. Package kinds and version `1.0` contracts are unchanged.

# Next release — detailed plan

## 1. v7.9.6 — OCR Review Workbench and Batch Navigation

### Objective

Turn the existing selective OCR controls into a coherent exception-resolution workbench without putting OCR into the clean happy path. Native extraction remains preferred, and OCR must never silently replace cleaner native text.

### Operator workflow

1. Open an OCR/readability exception from the Exception & Trust Queue.
2. See the active filename, source ID, file type, page count, native extraction status, readability score, selected analysis source, and why OCR was recommended.
3. Choose selected-page, page-range, remaining-pages, or whole-document OCR when the format supports it.
4. Monitor page-level progress, cancellation, failure, retry, and completed-page status.
5. Compare native and OCR text side by side with character count, readability, method, confidence, page reference, and limitations.
6. Explicitly retain native, OCR, or combined/manual-review text for analysis while preserving both representations.
7. Move to the previous or next unresolved OCR exception without returning to the complete inventory.
8. Resolve, acknowledge, or defer the queue item and return to export readiness.

### Planned implementation

- Consolidate selected-page, page-range, all-page, raster, PDF, and SVG OCR controls into one workbench.
- Add previous/next navigation across unresolved OCR/readability exceptions.
- Add per-page states: queued, processing, completed, no text, cancelled, and failed.
- Add bounded retry and cancellation behavior without discarding completed page results.
- Show native-versus-OCR quality comparisons and the retained analysis-source decision.
- Make post-OCR analysis refresh explicit and prevent accidental duplicate processing.
- Retain PDF page-count detection, embedded worker behavior, file-origin fallbacks, and resource cleanup.
- Surface unavailable-source-byte and unsupported-format explanations instead of presenting disabled controls without context.
- Integrate page-level OCR lineage into the Provenance Explorer and Exception & Trust Queue.

### Technical guardrails

- OCR remains embedded, local, and selective.
- Structured CSV, JSON, XML, YAML, log, SARIF, Nessus, SBOM, and draw.io source files continue through native parsers.
- Native and OCR text stay separately traceable.
- Weaker OCR never silently replaces stronger native extraction.
- No remote OCR model, script, font, worker, telemetry, or network call is introduced.
- No package kind or base package version changes are planned.
- OCR-derived values remain draft and advisor-review-required.
- The v7.9.5.1 validation-question precision policy must remain active after any analysis refresh.

### Acceptance criteria

- A scanned multi-page PDF supports selected-page, range, remaining-page, and whole-document OCR.
- Cancellation preserves prior completed pages and makes unfinished pages visible.
- Failed and no-text pages are not reported as successful.
- Retry targets only selected failed/unprocessed pages unless the operator deliberately restarts all pages.
- Native-better-than-OCR and OCR-better-than-native fixtures retain both texts and correctly record the selected source.
- Queue previous/next controls always show the correct filename and source ID.
- Provenance shows page-level OCR method, page reference, confidence, selected source, and limitations.
- Validation-question candidate precision does not regress after OCR-triggered reanalysis.
- Intake, scope, and meeting exports stay version `1.0`.
- Focused Chromium and Windows file-origin smoke testing show zero application-owned network calls, no page errors, and no identity flicker.

### Explicit exclusions

- Cloud OCR or AI transcription
- OCR for structured machine-readable source formats
- Automatic validation of recognized identifiers, dates, IP addresses, hostnames, or CMMC practices
- Automatic evidence sufficiency, final scope, readiness, scoring, or compliance conclusions
- Changes to Scoper, Workshop, Builder/Merger, SSP, or Control Center

# Remaining roadmap

## 2. v7.9.7 — Duplicate and Version Governance

Separate exact duplicates, near-duplicates, and version-family candidates. Add preferred/current, superseded, retained-intentionally, and unresolved dispositions while preserving all source IDs, fingerprints, and document relationships.

## 3. v7.9.8 — Ambiguity and Conflict Resolution

Provide consistent confirm, reject, correct, and defer workflows for classification, practice/objective mapping, provider, asset, flow, scope, and meeting conflicts. Never select an automatic conflict winner.

## 4. v7.9.9 — Large-Bundle Scale, Performance, and Resumability

Add bounded concurrency, staged progress, memory-pressure safeguards, per-file recovery, nested-archive limits, long-run diagnostics, and honest resumability for large evidence packages.

## 5. v8.0.0 — Workflow Consolidation and Accessibility Baseline

Complete the Upload → Exceptions → Export path; improve focus order, keyboard operation, screen-reader labels, scaling, contrast, narrow-window behavior, and reduced-motion handling.

## 6. v8.0.1 — Contract Conformance and Consumer Preview

Add human-readable previews for intake, scope, and meeting packages, including required fields, enum evolution, unknown optional fields, prohibited outputs, and consumer-target compatibility checks.

## 7. v8.0.2 — Regression Fixture Harness and Release QA

Create repeatable synthetic fixtures and automated identity, extraction, OCR, candidate-precision, queue, provenance, package, offline-security, accessibility, and performance checks.

## 8. v8.0.3 — Production Hardening and Long-Lived Baseline Candidate

Audit cumulative wrappers, dormant mutation layers, event handlers, resource cleanup, embedded-worker lifecycle, CSP, package integrity, lineage, and known limitations.

## 9. v8.0.4 — Security-Evidence Review Workbench

Unify parsed security-evidence observations, inventory-only binaries, severity, source references, parser limitations, and Exception & Trust Queue dispositions without making compliance conclusions.

## 10. v8.0.5 — Operator Guidance and Field-Validation Baseline

Consolidate in-tool guidance, persona-specific workflow hints, release/contract status, troubleshooting, archive guidance, and a stable package for broader advisor field validation.

## Continuing principles

Every release remains local/offline, single-file, source-traceable, draft-only, and compatible with the three package version `1.0` contracts unless a separately authorized contract project is approved. Each release should simplify the clean path while preserving advanced review and recovery capabilities.
