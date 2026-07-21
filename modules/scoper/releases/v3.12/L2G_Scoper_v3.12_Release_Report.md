# L2G Scoper v3.12 Release Report

Generated: 2026-07-20

## Release decision

L2G Scoper v3.12 is a bounded release authorized by the merged v3.11 post-release audit. It corrects the release-blocking Return JSON idempotency defect and consolidates existing v3.11 scoping context into two optional, additive review contracts.

This release modifies L2G Scoper only. DocConverter-L2G and the CMMC L2 Gap Workshop Tool were used only as reference and regression inputs.

## Authoritative baseline and preserved boundaries

- Application baseline: L2G Scoper v3.11
- New application version: L2G Scoper v3.12
- Input contract: `l2g_scope_context_v1`, version `1.0`
- Output contract: `l2g_scope_return_package_v1`, version `1.0`
- Browser storage key: `l2scoper_v30_state` — unchanged
- Built-in PowerPoint template: latest `CMMC_Scoper_Built-In_v2.pptx`
- Local/offline single-file architecture: preserved
- Practice records emitted: **0**
- Final scope, Met/Not Met, readiness, scoring, and evidence-sufficiency determinations: **0**

## P0 — Return-generation idempotency correction

### Prior defect

The v3.11 audit reproduced mutation of a cached Return package. Each `makeReturn()` call appended another copy of every technology profile, increasing ten profile records to 20, 30, 40, and so on.

### v3.12 correction

- `makeReturn()` now obtains a fresh v3.11 base package and produces a new cloned package for each invocation.
- Technology profiles are normalized and deduplicated by stable profile ID before they are added to `records`.
- A previously cached package is never reused as a mutable accumulator.
- Preview, rendering, pre-flight, reports, questionnaire, PowerPoint preparation, Return download, and report-download actions no longer alter package counts.
- Stable source IDs, profile IDs, fingerprints, and lineage fields are preserved.

### Acceptance result

Fourteen unchanged actions, including ten consecutive semantic generation checkpoints and every major output action, produced the same package-content hash and exactly:

- 10 technology profiles
- 10 `technology_service_profile` records
- 10 unique profile IDs
- 54 decision-ledger records
- 73 clean pre-Workshop questions
- 0 practice records

Status: **PASS — release-blocking gate closed**.

## P1 — Scoping Decision Ledger

v3.12 adds optional `scoping_decision_ledger_v1` under the unchanged Return package identity.

The McFeddy Fed regression produces 54 draft records with:

- stable `SCD-*` decision IDs;
- proposed dispositions including included, excluded, inherited, shared, unknown, and blocked where supported;
- concise rationale;
- links to existing asset, provider, flow, service, and unknown IDs;
- source document IDs/files and source basis;
- confidence and value origin;
- validating stakeholder and validation status;
- unresolved dependency and next action;
- Workshop impact, materiality, and blocker/warning state;
- mandatory advisor-review labeling and an explicit non-final-scope flag.

Every material decision in the regression links to an affected record and has rationale and source basis/reference.

## P1 — Unified Pre-Workshop Question Package

v3.12 adds optional `pre_workshop_question_package_v1` while retaining the established v3.11 question arrays for older downstream importers.

The McFeddy Fed regression produces 73 clean questions consolidated from:

- imported scope questions;
- technology-profile validation questions;
- profile open questions; and
- material unknown-derived questions.

Each record includes a stable `PWQ-*` ID, clean wording, topic, priority, materiality, phase, expected respondent, status, source traceability, confidence, value origin, original IDs where available, and links to decisions or affected scope records.

Regression results:

- 56 before-Workshop questions
- 17 during-Workshop questions
- 56 High-priority questions
- 56/56 High-priority questions have phase and expected respondent
- 73/73 questions link to a decision or affected scope record
- 0 semantic duplicates
- 0 raw JSON fragments in clean question output

## P1 — Defensive malformed-question handling

v3.12 quarantines malformed candidates instead of displaying or exporting them as clean questions. The original source records remain intact.

The regression retains 14 diagnostic records covering:

- JSON key/value fragments;
- a non-question risk statement;
- a short heading;
- semantic/case/punctuation duplicates.

Diagnostics preserve origin, original text/ID, source document IDs/files, reason, and duplicate target where applicable. This Scoper defense does not replace the separately identified upstream DocConverter precision correction.

## P1 — Connected Review workflow

The existing Review page now contains a connected Decision Ledger & Unknowns review section with compact metrics and filters for:

- open material decisions;
- boundary blockers;
- before-Workshop questions;
- during-Workshop questions;
- disposition and validation status;
- blocker versus warning;
- client, provider, and advisor response ownership.

Rows expose disposition, concise rationale, affected IDs, source/confidence, validating stakeholder, status, next action, and related-question count. The detailed Technology & Providers editor remains intact.

Draft unanswered questions do not block export. Only structural/pre-flight errors remain blocking.

## Output consolidation

### Advisor Report

The updated advisor-facing report includes:

- Material Scoping Decisions;
- Unresolved Boundary Unknowns;
- prioritized questions grouped into before-Workshop and during-Workshop sections;
- source basis, respondent, related IDs, and next-action context;
- the current draft diagram.

The generated McFeddy Fed advisor report converted successfully in LibreOffice to a 30-page PDF for validation.

### Client Executive Summary

The client-facing summary now includes:

- top proposed boundary decisions requiring validation;
- questions to answer before Workshop;
- provider/client clarification needs;
- concise technology/provider context; and
- the current draft diagram.

Internal confidence mechanics and excessive trace detail are omitted from the client-facing subset. LibreOffice validation produced a five-page document.

### Questionnaire

The questionnaire retains the CUI boundary questions and structured Technology, Service, and Provider Profile. LibreOffice validation produced a seven-page landscape document.

### PowerPoint

Both built-in and custom-template paths generated valid 11-slide presentations.

- Latest embedded template SHA-256: `6a5bb9bb166619933b78eb4845541f996cfe346f0cf266b9c9292441f11af32c`
- Unresolved placeholders: 0
- Material questions on the decision-focus slide: 4
- Dangling conjunctions or truncated noun endings detected: 0
- LibreOffice conversion: passed for both paths

The clipped v3.11 slide text identified by the audit was corrected.

## Contract and compatibility

The release is additive and nonbreaking:

- package kinds and package versions are unchanged;
- existing optional v3.11 sections are preserved;
- unknown optional fields remain preservable/safely ignorable;
- existing question arrays remain available;
- older downstream importers can ignore the two new sections;
- the browser storage key is unchanged, and a v3.11 state shape loads with assets and technology profiles intact;
- built-in and custom PowerPoint behavior remains available.

An unchanged Workshop v49 backward-compatibility target recognized the v3.12 Return package, built its normal draft import plan, safely ignored the additive sections, and created zero practice targets.

### Final Workshop v76 smoke-import gate

A final bounded smoke-import was completed against the authoritative `cmmc_l2_gap_workshop_tool_v76.html` and the fresh v3.12 `l2g_scope_return_package_v1.json`. No Workshop code or Scoper functionality was changed.

Results:

- Workshop identified itself as **v76** and recognized `l2g_scope_return_package_v1`, version `1.0`.
- The normal Scope Context preview and Import & Review plan were created.
- Preview counts remained coherent: 71 source documents, 10 candidate assets, 2 providers, 4 CUI flows, and 10 legacy validation questions.
- The import plan contained 151 source records and 534 draft field changes, with **0 practice targets**, **0 practice changes**, and **0 practice records**.
- `scoping_decision_ledger_v1` contained 54 records and `pre_workshop_question_package_v1` contained 73 records in the source package. Workshop v76 did not consume either optional key into its legacy normalizer or import plan, and both were safely ignored without corruption.
- No assessment/content state changed before Apply. Practice, scoring, readiness, evidence-sufficiency, responsibility, workbook, SSP, setup, document, decision, scope-context cache, and import-log state remained unchanged.
- The sole state delta was the expected UI navigation preference `v59Workspace.last_active_tab`, changed from `setup` to `ai-prefill` because the normal preview workflow routes the user to Import & Review.
- Page errors: 0; console errors: 0; external network requests: 0.
- The source package object and file SHA-256 were unchanged after two previews: `2709cced75bbc12b61bacab3500909f6e920118a7bb4c017d290c1f340e88070`.
- Repeated preview preserved package identity and all tested counts.

Status: **PASS — current Workshop v76 compatibility gate closed without consuming v3.13 scope.**

Evidence: `evidence/L2G_Scoper_v3.12_Workshop_v76_Smoke_Import_Evidence.json`.

## Security, privacy, and accessibility validation

Passed:

- all inline JavaScript syntax checks;
- title, visible version, internal version, schema filename, and release identity checks;
- CSP retains `connect-src 'none'`;
- no external script tags;
- no Fetch, XMLHttpRequest, WebSocket, or sendBeacon calls;
- no raw HTTP/HTTPS URLs;
- no duplicate HTML IDs;
- no local-path leakage in path-bearing Return fields;
- no browser page errors or network requests in the exercised runtime;
- light and dark browser color-scheme contexts;
- all application tabs visible;
- decision and question filters operational;
- no unnamed visible controls in the tested review surface;
- no low-contrast findings in the tested application surface.

Container browser testing used `page.set_content()` because local HTTP and `file://` navigation are administrator-restricted. Repository CI supplies HTTP-origin and Windows `file://` coverage.

## McFeddy Fed release counts

- Source documents: 71
- Candidate assets: 10
- Providers: 2
- CUI flows: 4
- Boundary unknown/review items: 28
- Technology/service/provider profiles: 10
- Material decision-ledger records: 54
- Clean pre-Workshop questions: 73
- Quarantined question candidates: 14
- Practice records: 0

## Files produced

Primary release:

- `L2Scoper-v3.12.html`
- `L2G_Scoper_v3.12_Deliverables.zip`

Core governance/evidence:

- `L2G_Scoper_v3.12_Release_Report.md`
- `L2G_Scoper_v3.12_Regression.json`
- `L2G_Scoper_v3.12_Compatibility_Manifest.json`
- `L2G_Scoper_v3.12_Roadmap.md`
- `L2G_Scoper_v3.12_Release_Manifest.json`
- decision-ledger and question-package extraction reports
- idempotency, static/security, browser/accessibility, document, PowerPoint, Workshop v49 smoke, and final Workshop v76 smoke-import reports

Fresh McFeddy Fed outputs:

- `l2g_scope_return_package_v1_mcfeddyfed_v312.json`
- Questionnaire
- Advisor Report
- Client Executive Summary
- populated built-in-template PowerPoint
- populated custom-template PowerPoint regression output

## Known boundary and next action

No adjacent tool was changed. The separate DocConverter precision prompt remains the correct upstream action for malformed candidate extraction.

The final Workshop v76 backward-compatibility smoke is complete. Workshop v76 safely ignores the two additive v3.12 sections and requires no modification for this release. Any future v3.13 work remains a separately authorized downstream-adoption/usability gate and was not consumed by this evidence-only closeout. New code should be authorized only for a demonstrated Scoper defect or a bounded operator-review gap.
