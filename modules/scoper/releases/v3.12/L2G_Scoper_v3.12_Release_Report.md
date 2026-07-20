# L2G Scoper v3.12 Release Report

Generated: 2026-07-20

## Release decision

L2G Scoper v3.12 is the bounded release authorized by the merged v3.11 post-release audit. It corrects the release-blocking Return JSON idempotency defect and consolidates existing v3.11 scoping context into two optional, additive review contracts.

This release modifies L2G Scoper only. Adjacent tools were reference and regression inputs only.

## Preserved boundaries

- Baseline: L2G Scoper v3.11
- Input: `l2g_scope_context_v1`, version `1.0`
- Output: `l2g_scope_return_package_v1`, version `1.0`
- Storage key: `l2scoper_v30_state` — unchanged
- Built-in template: latest `CMMC_Scoper_Built-In_v2.pptx`
- Local/offline single-file operation: preserved
- Practice records: **0**
- Final-scope, Met/Not Met, readiness, scoring, and evidence-sufficiency determinations: **0**

## P0 — Return-generation idempotency

### Prior defect

The v3.11 audit reproduced mutation of a cached Return package. Each `makeReturn()` call appended another copy of every technology profile.

### Correction

- Every invocation now obtains a fresh v3.11 base package and produces a new cloned package.
- Technology profiles are normalized and deduplicated by stable profile ID before they are added to `records`.
- Preview, render, pre-flight, report, questionnaire, PowerPoint, and download actions do not mutate an earlier package.
- Stable source IDs, profile IDs, fingerprints, and lineage fields are preserved.

### Result

Fourteen unchanged generation/output checkpoints produced the same semantic package hash and exactly:

- 10 technology profiles;
- 10 `technology_service_profile` records;
- 10 unique profile IDs;
- 54 decision-ledger records;
- 73 clean pre-Workshop questions;
- 0 practice records.

Status: **PASS — release-blocking gate closed**.

## P1 — Scoping Decision Ledger

v3.12 adds optional `scoping_decision_ledger_v1` under the unchanged Return identity.

The McFeddy Fed regression produces 54 draft records with stable IDs, proposed disposition, concise rationale, links to existing affected records, source basis/reference, confidence, value origin, validating stakeholder, validation status, unresolved dependency, next action, Workshop impact, materiality, blocker/warning state, and advisor-review labeling.

Every material decision links to an affected record and has rationale and source basis/reference. No ledger record is a final scope determination.

## P1 — Unified Pre-Workshop Question Package

v3.12 adds optional `pre_workshop_question_package_v1` while retaining established v3.11 question arrays for backward compatibility.

The McFeddy Fed regression produces 73 clean questions consolidated from imported scope questions, technology-profile questions, profile open questions, and material unknown-derived questions.

Results:

- 56 before-Workshop questions;
- 17 during-Workshop questions;
- 56 High-priority questions;
- 56/56 High-priority questions have phase and expected respondent;
- 73/73 questions link to a decision or affected scope record;
- 0 semantic duplicates;
- 0 raw JSON fragments in clean question output.

## Defensive malformed-question handling

v3.12 quarantines malformed candidates instead of displaying or exporting them as clean questions. Original source records remain intact.

The regression retains 14 diagnostic records covering JSON key/value fragments, a non-question risk statement, a short heading, and semantic/case/punctuation duplicates. Diagnostics preserve origin, original text/ID, source document IDs/files, rejection reason, and duplicate target where applicable.

This Scoper defense does not replace the separate upstream DocConverter precision correction.

## Connected Review workflow

The existing Review page now includes a connected Decision Ledger & Unknowns section with compact metrics and filters for open material decisions, boundary blockers, before/during-Workshop questions, dispositions, validation status, blocker/warning state, and response ownership.

Rows expose disposition, rationale, affected IDs, source/confidence, validating stakeholder, status, next action, and related-question count. The detailed Technology & Providers editor remains intact.

Draft unanswered questions do not block export. Only structural/pre-flight errors remain blocking.

## Output consolidation

### Advisor Report

Adds Material Scoping Decisions, Unresolved Boundary Unknowns, prioritized before/during-Workshop question groups, source/respondent/related-ID context, and the current draft diagram. LibreOffice validation produced a 30-page PDF.

### Client Executive Summary

Adds top proposed boundary decisions, questions to answer before Workshop, provider/client clarification needs, concise technology/provider context, and the current draft diagram. Internal confidence mechanics and excessive trace detail are omitted. LibreOffice validation produced five pages.

### Questionnaire

Retains CUI boundary questions and the structured Technology, Service, and Provider Profile. LibreOffice validation produced seven landscape pages.

### PowerPoint

Both built-in and custom-template paths generated valid 11-slide decks.

- Embedded template SHA-256: `6a5bb9bb166619933b78eb4845541f996cfe346f0cf266b9c9292441f11af32c`
- Unresolved placeholders: 0
- Material questions on decision-focus slide: 4
- Dangling conjunctions/truncated noun endings: 0
- LibreOffice conversion: passed for both paths

The clipped v3.11 text identified by the audit was corrected.

## Contract and compatibility

The release is additive and nonbreaking:

- package kinds and versions are unchanged;
- v3.11 optional sections are preserved;
- unknown optional fields remain preservable/safely ignorable;
- existing question arrays remain available;
- older downstream importers can ignore the new sections;
- the storage key is unchanged and a v3.11 state shape loads with assets and technology profiles intact;
- built-in and custom PowerPoint behavior remains available.

An unchanged Workshop v49 backward-compatibility target recognized the v3.12 Return package, created its normal draft import plan, safely ignored the additive sections, and created zero practice targets. The repository's current Workshop target is v76; exact downstream presentation should be confirmed during adoption review without modifying Workshop in this release.

## Security, privacy, and accessibility

Passed:

- inline JavaScript syntax;
- title, visible version, internal version, schema filename, and identity checks;
- CSP `connect-src 'none'`;
- no external scripts, Fetch, XMLHttpRequest, WebSocket, or sendBeacon;
- no raw HTTP/HTTPS URLs;
- no duplicate HTML IDs;
- no local-path leakage in path-bearing Return fields;
- no runtime page errors or network requests in the exercised container test;
- light and dark browser color-scheme contexts;
- all tabs visible;
- decision/question filters operational;
- no unnamed visible controls in the tested review surface;
- no low-contrast findings in the tested application surface.

Container testing used `page.set_content()` because local HTTP and `file://` navigation are administrator-restricted. Repository CI supplies HTTP-origin and Windows `file://` coverage.

## McFeddy Fed counts

- Source documents: 71
- Assets: 10
- Providers: 2
- CUI flows: 4
- Unknown/review items: 28
- Technology profiles: 10
- Material decisions: 54
- Clean pre-Workshop questions: 73
- Quarantined candidates: 14
- Practice records: 0

## Repository and release artifacts

The repository stores the deterministic v3.12 source patch, materializer, runtime, release governance, and text regression evidence. Generated Office files, screenshots, and the complete release ZIP are supplied as release/independent-review artifacts rather than repeated repository binary history.

Standalone HTML SHA-256:

`2adf329557fb2df4699e13bb572bcde762667292700200f8edeae0dd6ade7ef3`

## Next action

The next Scoper gate is v3.13 downstream-adoption and usability validation. It should first validate the additive sections against the then-current Workshop and fresh corrected DocConverter output. New code should be authorized only for a demonstrated Scoper defect or bounded operator-review gap.
