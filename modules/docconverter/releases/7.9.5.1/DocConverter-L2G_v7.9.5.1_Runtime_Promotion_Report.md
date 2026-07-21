# DocConverter-L2G v7.9.5.1 Runtime Promotion Report

## Result

**PASS — eligible for current-runtime promotion, subject to repository CI completing successfully.**

This follow-up does not change the v7.9.5.1 candidate-precision implementation merged in PR #7. It materializes and validates the reviewed release-candidate runtime, updates only the DocConverter active-release metadata and shared Playwright catalog, and leaves all adjacent module application code unchanged.

## Governed runtime

- Runtime: `DocConverter-L2G_v7.9.5.1.html`
- Governed repository path: `modules/docconverter/releases/7.9.5.1/DocConverter-L2G_v7.9.5.1.html`
- Size: **7,952,581 bytes**
- SHA-256: `df64d0912b43d69d5eda256188458c3d32f9aa679c49ed43f6ddf4cb64b9c17d`
- Deterministic rebuild from v7.9.5: **byte-identical PASS**
- Static verification: **PASS**
  - 25 inline JavaScript blocks passed syntax checks
  - zero duplicate static HTML IDs
  - zero external runtime scripts
  - CSP retains `connect-src 'none'`

## Full McFirecoal test-package regression

The supplied ZIP contained **104 files** and had SHA-256:

`aec6ff6bdc4826931d439e39f29bbe309203093393e62407d6a25be8861b2099`

The real Chromium run used the actual HTML runtime and browser File API. Direct URL navigation is blocked by the managed environment, so the runtime was loaded into real system Chromium 144 with Playwright `set_content`. Repository CI separately performs native Windows Chromium `file://` startup and persistence testing.

### Archive processing

- The outer ZIP completed normally with processing state returning to idle.
- The existing evidence-bundle safeguard processed the first **90 inner entries**, plus the outer ZIP source record.
- The remaining **14 cap-overflow files** were extracted from the supplied archive and processed in a second real-browser batch.
- Combined coverage: **104 of 104 supplied files**.
- Main run source-register records: **91**.
- Records with extracted text in the main browser state: **84**.
- Records with stable source IDs: **91 of 91**.
- Browser page errors: **0**.
- Console warning/error events: **0**.
- HTTP/HTTPS requests: **0**.

This two-batch validation honors the existing 90-entry untrusted-ZIP safeguard rather than bypassing or redesigning it.

## Validation-question precision

From the generated v7.9.5.1 scope context:

- Original candidates: **14**
- Accepted clean candidates: **12**
- Rejected candidates: **2**
- Duplicates merged: **0**
- Raw JSON field/value fragments exported: **0**
- Accepted candidates with source document ID, source filename, and source basis: **12 of 12**

Representative retained instructions include:

- “Confirm all transient storage in AKS, logging pipelines, support exports, and provider diagnostic bundles.”
- “Validate provider responsibility at practice and objective level before relying on inherited controls.”
- “Validate emergency support exports, emailed diagnostic bundles, and customer download-link expiration.”

All remain draft and advisor-review-required. No final scope, readiness, evidence-sufficiency, scoring, or compliance conclusion was introduced.

## Preserved capability checks

### Embedded OCR

A real-browser OCR run completed against `Conditional_Access_MFA_Policy.png`:

- OCR status: **success**
- Engine: embedded Tesseract.js/Tesseract core 7
- Confidence reported by engine: **93%**
- OCR text captured: **328 characters**
- Source/page result retained in OCR context
- Local-only provenance: **true**
- Network requests: **0**

### Diagram intelligence

- Diagram artifacts analyzed: **4**
- Nodes: **10**
- Edges: **4**
- Primary flow source: `McFirecoal_CFMS_CUI_Data_Flow.drawio`
- Inferred relationships remain advisor-review-required.

### Security-evidence intelligence

- Security artifacts: **42**
- Parsed artifacts: **39**
- Inventory-only artifacts: **3**
- Source records parsed: **1,110**
- Finding candidates: **137**
- Findings remain source observations, not assessment conclusions.

### Meeting-context precision

The strict meeting-source scan:

- Automatically retained the WebVTT transcript
- Produced **7** meeting records
- Preserved speaker/timestamp/source fingerprint context
- Produced **0** conflicts
- Did not falsely auto-classify the looser recap and facilitator-note sources; those remain available through the explicit meeting lane
- Retained `l2g_meeting_context_v1` version `1.0`

### Evidence-bundle and binary safeguards

- Nested ZIP retained and locally unpacked within existing limits
- Nested child records retained
- PCAP retained as inventory-only security evidence
- Scanned PDF and TIFF retained for OCR/manual review
- No source was executed or uploaded

`Evidence_Index.sqlite` was not retained by the normal picker in either v7.9.5.1 or the authoritative v7.9.5 baseline. The comparison confirms this is inherited behavior, not a regression introduced by the candidate-precision hotfix. It is documented but does not broaden this promotion follow-up into a new implementation change.

## Package-contract verification

Unchanged stable identities:

- `l2g_intake_package_v1` — version `1.0`
- `l2g_scope_context_v1` — version `1.0`
- `l2g_meeting_context_v1` — version `1.0`

No workbook handoff, workbook merge, scope-return, final assessment, or adjacent-tool output was added.

## Repository changes authorized by this promotion

- Materialize the exact generated HTML at the governed v7.9.5.1 release path.
- Update `modules/docconverter/README.md` to v7.9.5.1.
- Update `modules/docconverter/current/release.json` to v7.9.5.1.
- Mark the v7.9.5.1 module release metadata as promoted/current.
- Update the shared Playwright module catalog path/version for DocConverter.
- Add this promotion report and consolidated regression evidence.

No Scoper, Workshop, Builder/Merger, SSP, or Control Center application code is modified.

## Promotion gate

The current-release pointer may advance because the complete supplied file set was covered without a demonstrated v7.9.5.1 regression. The draft PR must remain unmerged until repository validation, Playwright QA, visual regression, and Windows `file://` smoke have completed and been reviewed.
