# DocConverter-L2G v7.9.6 Release Report

## Result

**PASS with one disclosed large-bundle test limitation.**

The release implements the planned **OCR Review Workbench and Batch Navigation** from the promoted v7.9.5.1 baseline. No adjacent application code or stable package contract was changed.

## Runtime identity

- Standalone HTML: `DocConverter-L2G_v7.9.6.html`
- Size: 7,987,979 bytes
- SHA-256: `a4e1532fbd2ecafd43f50e5c2e9cb86c6ee0b208dc5073a6702a2c267b86a4a5`
- Deterministic rebuild: byte-identical PASS
- Canonical identity: v7.9.6

Historical identity layers now delegate to the canonical current release. This prevents the tab, heading, and footer from reverting during later render/extraction activity.

## Delivered OCR workflow

- Previous/next navigation across OCR and readability exceptions.
- Selected page/source, page range, remaining unfinished pages, and whole-document scopes.
- Page-level queued, processing, completed, no-text, cancelled, failed, and unprocessed states.
- Retry of failed/unfinished pages only.
- Cancellation that retains completed results.
- Side-by-side native and OCR representations.
- Explicit native, OCR, combined, or manual-review analysis-source decisions.
- Page-level OCR provenance and additive package review context.
- No automatic replacement by the new workbench.

## Performance stabilization completed during development

An early package adapter caused the main thread to become unresponsive after real ingestion because it performed state normalization and heavy integration during queue/preflight package builds. That design was discarded. The final adapter is guarded, restores temporary package-build state, avoids render-loop coupling, and completed the six-file package build in approximately 41.0 ms.

## Regression evidence

### Real embedded OCR

- Source: `Conditional_Access_MFA_Policy.png`
- OCR status: success
- OCR characters: 328
- Reported confidence: 93%
- Native/current text automatically replaced before decision: no
- Explicit decision tested: `ocr`
- Package-selected source: `ocr`
- Network requests: 0

### Core real-browser fixture

Six selected source files produced 8 session records and exercised structured security evidence, low-readability text, draw.io diagram extraction, strict WebVTT meeting context, a nested provider evidence ZIP, and PCAP inventory-only handling.

- Page errors: 0
- Console warnings/errors: 0
- HTTP/HTTPS requests: 0
- Intake package: `l2g_intake_package_v1` version `1.0`
- Meeting package: `l2g_meeting_context_v1` version `1.0`
- Meeting records: 7

### Validation-question precision

The exact affected 21-candidate fixture remained clean:

- Original: 21
- Accepted unique: 11
- Rejected/quarantined: 8
- Duplicates merged: 2
- Raw JSON field/value fragments exported: 0
- Accepted records with source traceability: 11

### Static and browser checks

- Inline scripts: 26
- JavaScript syntax failures: 0
- Duplicate static IDs: 0
- External runtime scripts/resources: 0
- CSP `connect-src 'none'`: present
- Basic identity/workbench test: PASS
- Synthetic navigation/page-state/decision test: PASS

## Package and tool boundaries

The following remain version `1.0`:

- `l2g_intake_package_v1`
- `l2g_scope_context_v1`
- `l2g_meeting_context_v1`

No workbook handoff, workbook merge, scope return, final scope, scoring, readiness, evidence-sufficiency, or compliance conclusion was added.

## Large-bundle limitation

The full supplied 104-file McFirecoal outer-ZIP attempt did not complete within the 720-second managed-environment timeout and is **not claimed as a v7.9.6 pass**. The release package includes the attempt record and a Windows Chrome/Edge checklist. The previously promoted v7.9.5.1 runtime had already covered all 104 files using the normal 90-entry safeguard plus a 14-file overflow batch, but that prior result is not substituted for a new v7.9.6 full-ZIP pass.

## Next release

**v7.9.7 — Duplicate and Version Governance.** See the updated ten-release roadmap for detailed scope and acceptance scenarios.
