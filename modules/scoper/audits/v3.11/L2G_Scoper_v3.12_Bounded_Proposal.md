# L2G Scoper v3.12 Bounded Proposal
## Scoping Decision and Pre-Workshop Handoff Consolidation

**Status:** Proposal only  
**Authorized by:** L2G Scoper v3.11 post-release audit decision gate  
**Implementation performed in audit branch:** No  
**Authoritative baseline for any future implementation:** L2G Scoper v3.11

## Why a bounded v3.12 is justified

The v3.11 audit confirmed that the Technology, Service, and Provider Profile already captures substantial scoping detail, source traceability, profile gaps, validation questions, and draft boundary relationships. The release should not be replaced or broadly redesigned.

The audit also confirmed four material inadequacies:

1. v3.11 does not provide a coherent Scoping Decision Ledger.
2. v3.11 does not produce one clean, structured Pre-Workshop question package.
3. unresolved unknowns are preserved but are not presented as a prioritized, owned review queue;
4. repeated Return JSON generation duplicates technology profile records.

These problems are cohesive: they all affect the ability to move from rich draft scoping data to a reviewable, source-traceable Workshop handoff.

## Proposed release focus

**Scoping Decision and Pre-Workshop Handoff Consolidation**

The release should promote and connect existing v3.11 data rather than add another broad scoping questionnaire or unrelated feature area.

## Exact problems to solve

### 1. Scoping decisions are scattered

Current decision ingredients live in:

- asset categories and notes;
- provider access questions;
- flow assumptions;
- unknown boundary items;
- imported validation questions;
- technology profile boundary-impact fields;
- profile gaps;
- Interview / Workshop answers.

A reviewer cannot inspect those items as one coherent set of material scoping decisions.

### 2. Questions are not one handoff package

Current question content is split across:

- `validation_questions`;
- `scope_questions_for_workshop`;
- `technology_profile_validation_questions`;
- profile `open_questions`;
- Interview / Workshop prompts.

The arrays have different schemas, output truncation rules, and quality levels. Seven imported questions in the fresh audit run were raw JSON fragments.

### 3. Unknowns are not operationally prioritized

v3.11 provides useful counts, but unknown records do not consistently identify:

- materiality;
- expected respondent;
- next action;
- blocking versus warning status;
- before-Workshop versus during-Workshop phase; or
- related decision.

### 4. Return generation is not idempotent

Every `makeReturn()` call appends another set of technology profile records to the cached package. The same unchanged workspace produced 10 through 70 technology profile records over seven calls while retaining ten unique IDs.

### 5. Report and presentation summaries are incomplete

The fresh PowerPoint contained clipped phrases on slides 4 and 8. Advisor/client outputs also do not present a concise decision ledger or a clean question subset.

## Existing features to promote or reorganize

The following v3.11 features should be reused rather than reimplemented:

- stable asset/provider/flow/service IDs;
- candidate asset categories;
- boundary-impact fields;
- source document IDs and filenames;
- source strength and confidence;
- advisor-review flags;
- validation state and profile gaps;
- imported unknown boundary items;
- imported scope questions;
- generated technology-profile questions;
- profile completion metrics;
- Interview owner and evidence-reference fields;
- existing Advisor Report, Client Executive Summary, and PowerPoint generators;
- current draft-only and zero-practice guardrails.

## Proposed additive contract sections

The established output remains:

- `package_kind`: `l2g_scope_return_package_v1`
- `package_version`: `1.0`

The following sections should be optional, additive, and safely ignorable by older importers.

### `scoping_decision_ledger_v1`

Suggested shape:

```json
{
  "contract_version": "1.0-foundation",
  "status": "draft_advisor_review_required",
  "records": [
    {
      "decision_id": "SCD-...",
      "topic": "ServiceNow boundary relationship",
      "decision_type": "service_scope_relationship",
      "proposed_disposition": "included|excluded|inherited|shared|unknown|blocked",
      "rationale": "Concise explanation of the current proposal",
      "affected_asset_ids": [],
      "affected_provider_ids": [],
      "affected_flow_ids": [],
      "affected_service_ids": [],
      "source_document_ids": [],
      "source_files": [],
      "source_basis": "",
      "confidence": "Low|Medium|High",
      "value_origin": "imported|inferred|user_entered|advisor_confirmed",
      "validating_stakeholder": "",
      "validation_status": "open|needs_client|needs_provider|advisor_validated|client_validated|superseded",
      "unresolved_dependency": "",
      "next_action": "",
      "workshop_impact": "",
      "decision_sequence": 1,
      "advisor_review_required": true
    }
  ]
}
```

Requirements:

- Stable IDs must not change merely because records are reordered.
- No final scope conclusion is created.
- “Included” remains a proposed draft disposition until validated.
- Source references and confidence must be preserved.
- Decisions should link to existing stable record IDs rather than duplicate complete records.
- The ledger should support current-state review; a full event-sourced audit history is not required.

### `pre_workshop_question_package_v1`

Suggested shape:

```json
{
  "contract_version": "1.0-foundation",
  "status": "draft_advisor_review_required",
  "records": [
    {
      "question_id": "PWQ-...",
      "question": "Clean client-readable wording",
      "topic": "provider_admin_access",
      "priority": "High|Medium|Low",
      "materiality": "boundary_blocker|important_validation|workshop_follow_up",
      "phase": "before_workshop|during_workshop",
      "expected_respondent": "",
      "related_decision_ids": [],
      "related_asset_ids": [],
      "related_provider_ids": [],
      "related_flow_ids": [],
      "related_service_ids": [],
      "source_document_ids": [],
      "source_files": [],
      "source_basis": "",
      "confidence": "Low|Medium|High",
      "status": "open|answered|deferred|superseded",
      "advisor_review_required": true
    }
  ]
}
```

Requirements:

- Consolidate imported scope questions, technology-profile questions, profile open questions, and appropriate unknown-derived questions.
- Deduplicate semantically equivalent questions.
- Reject or quarantine raw JSON fragments, table headers, package metadata, and non-question strings.
- Preserve original source/question IDs where available.
- Do not include practice-readiness or evidence-sufficiency determinations.
- Existing arrays remain for backward compatibility.

## Proposed UI changes

### Review page: Decision Ledger & Unknowns

Add one connected review section, not a new disconnected utility page.

It should show:

- total open material decisions;
- unresolved boundary blockers;
- high-priority pre-Workshop questions;
- decisions awaiting client response;
- decisions awaiting provider response;
- decisions awaiting advisor validation.

Each row should display:

- proposed disposition;
- concise rationale;
- affected records;
- source/confidence;
- validating stakeholder;
- current status;
- next action; and
- associated question count.

Filtering should include:

- disposition;
- status;
- affected record type;
- priority/materiality; and
- before/during Workshop.

### Technology & Providers

Preserve the detailed profile editor. Add links or badges to related decision and question records. Do not replicate the full ledger inside each profile.

### Dashboard and Finish / Handoff

Add compact counts for:

- open material decisions;
- boundary blockers;
- before-Workshop questions;
- during-Workshop questions.

Do not prevent export merely because draft questions remain. Only genuine structural/pre-flight errors should block export.

## Proposed output changes

### Advisor Report

Add:

- Material Scoping Decisions table;
- Unresolved Boundary Unknowns table;
- Pre-Workshop Questions, grouped into:
  - answer before Workshop;
  - address during Workshop.

Include source basis, expected respondent, and related record identifiers in advisor-facing form.

### Client Executive Summary

Include an appropriate, concise subset:

- top proposed boundary decisions requiring validation;
- top questions the client should answer before Workshop;
- provider/client clarification needs.

Do not expose internal confidence mechanics or unnecessarily technical traceability detail where it harms readability.

### PowerPoint

Use the existing template and placeholders. Populate:

- top material decisions/assumptions;
- top five clean questions;
- aggregate blockers by owner/phase.

Correct complete-sentence fitting. The presentation must not end phrases with dangling conjunctions or truncated nouns.

## Defensive input quality handling

Scoper should defensively recognize and exclude likely malformed question candidates, including:

- JSON key/value fragments;
- lone object/array syntax;
- package metadata;
- headings or table headers without an interrogative/validation instruction;
- duplicate questions differing only by punctuation/case.

Excluded candidates should remain traceable in import diagnostics rather than silently disappearing.

This does not replace the separate DocConverter precision fix.

## Return-generation correction

`makeReturn()` must produce a new or safely cloned package on every invocation.

Acceptance requirements:

- repeated generation without state changes returns the same semantic record counts;
- exactly one `technology_service_profile` record per unique profile ID;
- no growth of `records` across preview, pre-flight, report, and download calls;
- deterministic IDs and stable source references.

## Explicit non-goals

v3.12 must not:

- change package kind or package version;
- change the browser storage key;
- emit practice records;
- determine Met/Not Met;
- determine evidence sufficiency;
- score readiness;
- determine final scope;
- activate a final provider-responsibility overlay;
- copy the Workshop Capability Questionnaire;
- create a suite-wide or cross-session task manager;
- redesign all pages;
- modify DocConverter, Workshop, Builder/Merger, SSP, or Control Center code;
- require network access, telemetry, cloud storage, or remote scripts.

## Acceptance criteria

### Decision Ledger

- Every material asset/provider/flow/service inclusion, exclusion, shared, inherited, unknown, or blocked proposal can be represented by a stable decision record.
- Each decision links to at least one affected record.
- Each decision has a concise rationale.
- Each imported or inferred decision retains source basis and confidence.
- Open material decisions expose validating stakeholder, status, and next action.
- Ledger records remain draft/advisor-review-required.

### Question package

- One additive question package combines scope and technology questions.
- The fresh McFeddy Fed run contains no raw JSON fragments as displayed questions.
- Questions are deduplicated.
- Every High-priority question has a phase and expected respondent or an explicit “owner to determine” state.
- Every question links to at least one decision or affected scope record.
- Source traceability is preserved when available.
- Advisor output contains the full prioritized set.
- Client output contains an appropriate subset.
- PowerPoint contains no more than five material questions and no clipped text.

### Unknowns

- Dashboard/Review exposes total unresolved items and material blockers.
- Unknowns identify cause category, owner/respondent, next action, and blocker/warning state.
- Unknowns can link to decisions and questions without duplicating source content.

### Contract and regression

- Input and output package identities remain unchanged.
- Existing v3.11 optional sections remain.
- Older downstream importers can ignore new sections.
- Return generation is idempotent across at least ten repeated calls.
- Exactly ten unique McFeddy Fed profiles produce exactly ten profile records after every call.
- Zero practice records are emitted.
- No local paths, network calls, remote scripts, or telemetry are introduced.
- Existing built-in/custom PowerPoint behavior remains functional.
- Existing v3.11 workspace loads under the unchanged storage key.

## Required regression artifacts

A future implementation should produce:

1. `L2G_Scoper_v3.12_Release_Report.md`
2. `L2G_Scoper_v3.12_Regression.json`
3. `L2G_Scoper_v3.12_Compatibility_Manifest.json`
4. fresh McFeddy Fed `l2g_scope_return_package_v1.json`
5. decision-ledger extraction report
6. pre-Workshop question-package extraction report
7. repeated-return idempotency regression
8. fresh Questionnaire
9. fresh Advisor Report
10. fresh Client Executive Summary
11. fresh populated PowerPoint
12. Workshop smoke-import report using the unchanged package identity

## Adjacent-tool sequencing

1. Correct upstream DocConverter validation-question candidate precision independently.
2. Implement the bounded Scoper release only after approval.
3. Produce a fresh Scoper return package.
4. Smoke-test the additive sections in the current Workshop.
5. Request a Workshop release only when the smoke test demonstrates a presentation/import gap.

## Proposal decision

This proposal is bounded and justified by the v3.11 audit. It is not an authorization to begin implementation.
