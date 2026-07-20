# L2G Scoper v3.11 Post-Release Audit Report

**Audit date:** 2026-07-20  
**Repository:** `SteadyEddieCF/L2G_Toolchain`  
**Audit branch:** `audit/scoper-v3.11`  
**Authoritative application baseline:** `L2Scoper-v3.11.html`  
**Audit type:** Post-release usability and contract audit only  
**Application modified:** No  
**v3.12 implementation begun:** No

## Executive conclusion

L2G Scoper v3.11 is a materially stronger scoping tool than v3.10. Its Technology, Service, and Provider Profile captures substantial information about exact environments, enabled modules, provider/admin access, security-data exposure, evidence expectations, responsibility sources, source documents, confidence, and advisor-review state. The release also preserves the established package identities and emits zero CMMC practice records.

The audit nevertheless found that the information needed to explain and hand off material scoping decisions is not yet assembled into a coherent operator workflow:

- Inclusion and exclusion rationale is **partially sufficient**. The supporting data often exists, but it is scattered across profile detail fields, asset/provider records, source metadata, and raw JSON. It is not consistently visible in the normal summary surfaces or client deliverables.
- The Scoping Decision Ledger is **insufficient**. v3.11 has decision ingredients, but no coherent ledger with stable decision identity, disposition, affected records, owner, status, next action, and Workshop impact.
- Unresolved unknowns are **partially sufficient**. Aggregate gap counts and per-profile gaps are useful, but there is no unified, prioritized unknowns queue with owner, materiality, next action, and blocking state.
- Pre-Workshop question packaging is **insufficient**. v3.11 retains 21 imported validation questions and generates 41 technology-profile questions, but the two sets are not consolidated into one clean, prioritized, source-traceable handoff. Seven imported questions are raw JSON fragments.

The audit also found a reproducible return-package defect: every call to `makeReturn()` appends another copy of the ten `technology_service_profile` records to the same cached package object. A clean sequence produced 10, 20, 30, 40, 50, 60, and 70 profile records across seven calls while retaining only ten unique profile IDs. This can create duplicate downstream records during normal preview/pre-flight/download activity.

A **bounded v3.12 is justified**, but it should remain narrowly focused on:

1. a coherent Scoping Decision Ledger;
2. a clean, prioritized Pre-Workshop question package;
3. a unified unresolved-unknowns review surface;
4. clearer inclusion/exclusion rationale in normal review and generated outputs;
5. idempotent return-package generation; and
6. correction of clipped PowerPoint text discovered in the fresh audit run.

The current package kinds and package versions can remain unchanged because the proposed contract additions are additive and optional.

## Audit scope and files reviewed

### Authoritative and reference artifacts

| Artifact | Role in audit | SHA-256 |
|---|---|---|
| `L2Scoper-v3.11.html` | Authoritative released application | `4cef94f43ceb71dac43167b0b1e41b3ec5ba398d2b6032089b2a720062572d20` |
| Fresh DocConverter v7.9 `l2g_scope_context_v1.json` | McFeddy Fed input package | `a2c06c696551f2e2eb1efb02463e467db77e6b8b18fff99b0b73341fa56cf017` |
| Fresh audit `l2g_scope_return_package_v1.json` | Contract/output review | `4ab1b844b7a6b8ba6d8b714c7624032b38d98900eef4e628e869a39ca4afd3a4` |
| Fresh Advisor Report HTML | Advisor-facing output review | `0d44f4a2d978040c814aa381a589ccd420f6049bf53e97a722054479b2b73e5b` |
| Fresh Client Executive Summary HTML | Client-facing output review | `f5288493a6c4c0f8145620783e9086aa7bebd83409f1de90785b67121e312c25` |
| Fresh Questionnaire HTML | Pre-engagement/prework review | `969fdcbd66474e75a7c6ca2045761bfe916f4c966916289fac9c0ca665191357` |
| Fresh populated PowerPoint | Presentation-output review | `c9db3102cdaf7fa491e2c7f7d356ca9a4dc27546632410f205d9a40cb4c56f0a` |

### Test method

The audit used the released v3.11 HTML without modification.

1. Started a clean browser state with the released single-file HTML.
2. Imported the fresh DocConverter v7.9 McFeddy Fed `l2g_scope_context_v1` package through the normal staged importer and **Replace Workspace** path.
3. Reviewed Dashboard, Technology & Providers, Assets, Providers, CUI Flows, Review, Interview / Workshop, Finish / Handoff, and generated output surfaces.
4. Generated a fresh Return JSON, Questionnaire, Asset & Provider Worksheet, Initial Evidence Request, Advisor Report, Client Executive Summary, and populated PowerPoint.
5. Reviewed visible operator text and machine-readable package content.
6. Repeated `makeReturn()` seven times in a clean imported workspace to test output idempotency.
7. Confirmed the output contains zero practice records.

### Fresh run counts

| Item | Count |
|---|---:|
| Source documents | 71 |
| Candidate assets | 10 |
| Providers | 2 |
| CUI flows | 4 |
| Imported validation questions | 21 |
| Boundary-review/unknown items | 28 |
| Technology/service/provider profiles | 10 |
| Generated technology-profile questions | 41 |
| Profiles at or above 70% completion | 2 |
| Enabled-module gaps | 3 |
| Admin/support-access unknowns | 8 |
| Responsibility-source gaps | 10 |
| Practice records | 0 |

### Runtime limitation

Chromium was exercised with `page.set_content()` because native `file://` and localhost navigation are restricted in the container. The normal importer, state updates, rendering functions, report generators, Return JSON generator, and PowerPoint generator were executed. Native Windows file-open and persistence behavior was not re-tested by this audit.

## Required audit verdicts

| Audit area | Current v3.11 surfaces | Verdict | Evidence | Gap | Gap type | Severity | Smallest appropriate response |
|---|---|---|---|---|---|---|---|
| Inclusion/exclusion rationale | Technology & Providers detail form; Assets; Providers; CUI Flows; Advisor Report; Client Summary; slide 6; `candidate_assets`, `service_scope_relationships`, and profile records | **Partially sufficient** | Technology profile exposes `candidate_asset_category`, `boundary_impact`, `boundary_impact_explanation`, source files, confidence, validation state, and open questions. Fresh return records preserve source basis and review state. Assets/Providers/Flows tables show only compact review fields. Fresh service profiles had 0/10 `boundary_impact_explanation` values populated and 0/10 linked asset or flow IDs. | Rationale exists as ingredients but is not consistently summarized, linked, or understandable without opening detail records/raw JSON. Validator and consequence-if-wrong are not visible. | Presentation/discoverability; data-model linkage; report/output | High | Promote existing rationale/source fields into one decision-oriented review surface and generated summaries; add narrowly scoped links/validator/consequence fields where absent. |
| Scoping Decision Ledger | Questions, unknowns, profile fields, asset/provider/flow records, Interview notes, return package arrays | **Insufficient** | No top-level decision-ledger section exists. No normal page presents stable decision ID, disposition, affected records, owner, validation status, dependency, next action, sequence, and Workshop impact as one record. `renderReview()` shows only pre-flight and first 15 imported questions. | Material decisions are scattered; users cannot review current disposition and decision history as a coherent set. | Genuinely missing data model and workflow | Critical | Add an additive, optional decision-ledger section and one connected review surface. |
| Unresolved unknowns | Dashboard; Technology profile completion/gaps; Review pre-flight; `unknown_boundary_items`; `boundary_review_items`; generated questions | **Partially sufficient** | Pre-flight prominently reports 3 enabled-module, 8 admin/access, and 10 responsibility-source gaps. The return package preserves 28 unknown items. Dashboard shows only assets/providers/flows. Unknown records have no priority, owner/respondent, next action, or blocking classification. | Unknowns are preserved but not unified, prioritized, assigned, deduplicated, or clearly separated into blockers versus warnings. | Presentation/discoverability; workflow; limited data-model fields | High | Consolidate existing unknowns and gap signals into a prioritized review queue linked to decisions and questions. |
| Pre-Workshop questions | Technology page targeted questions; Review page; Interview / Workshop; Advisor Report; Client Summary; PowerPoint slide 8; `validation_questions`, `scope_questions_for_workshop`, `technology_profile_validation_questions` | **Insufficient** | 21 imported questions and 41 generated technology questions exist. Seven of the 21 imported questions are raw JSON fragments. Technology questions have only area, question, service ID, priority, confidence, and review flag; they have no source references, expected respondent, before/during phase, affected asset IDs, or affected flow IDs. Review shows first 15 imported questions; Technology shows first 18 technology questions; Advisor Report shows first 25 technology questions; Client Summary has no specific question subset; slide 8 shows one question. | Handoff is split across arrays and output truncation rules rather than a coherent, clean, prioritized question package. | Contract/export; workflow; report/output; adjacent-tool candidate precision | Critical | Create one additive question-package section, defensive filtering/deduplication, phase/respondent/affected-record/source fields, and clear advisor/client output subsets. |

## Detailed findings

### 1. Inclusion/exclusion rationale — Partially sufficient

#### What v3.11 already does well

The Technology & Providers page is the strongest rationale surface. The released source and runtime expose:

- exact service identity and deployment fields;
- enabled and explicitly not-enabled modules;
- CUI/security-data relationship fields;
- candidate asset category;
- proposed boundary impact and explanation;
- related CUI-flow stages;
- provider/client administration and support paths;
- expected evidence and responsibility sources;
- source document IDs/files;
- confidence, validation state, limitations, and open questions.

The Return JSON similarly preserves rich profile records and separate additive arrays such as `service_scope_relationships`, `service_access_context`, `service_evidence_expectations`, and `responsibility_source_context`.

Candidate asset records also preserve source basis, confidence, validation question, and why-review-required context. These are valuable ingredients for transparent scoping.

#### Why the verdict is not “Sufficient”

The normal review workflow does not assemble those ingredients into a concise rationale statement for each material decision:

- Dashboard reports only 10 assets, 2 providers, and 4 flows.
- Assets shows Name, Type, Category, Owner/Provider, and Review Notes.
- Providers shows Name, Type, Role/Service, Admin/CUI Access, and Validation Need.
- CUI Flows shows Stage, Flow, Channel, CUI, and Controls/Notes.
- Review shows aggregate pre-flight text and only the first 15 imported questions.
- Finish shows only blocking errors, warning count, and practice count.

In the fresh imported run:

- all ten service profiles had a proposed `boundary_impact` string;
- none had `boundary_impact_explanation` populated;
- none linked to specific asset IDs;
- none linked to specific flow IDs.

The Advisor Report lists candidate roles and profile gaps but does not provide a stable, per-decision rationale record with validating stakeholder and consequence if wrong. The Client Summary lists platform, vendor, candidate role, provider category, and validation focus, but not source basis or explicit inclusion/exclusion rationale.

PowerPoint slide 6 provides category counts and generic validation language rather than record-level rationale.

The information is therefore stored, but not consistently discoverable and understandable without opening detailed profiles or inspecting JSON.

### 2. Scoping Decision Ledger — Insufficient

A complete decision ledger is genuinely absent.

The current state contains useful decision fragments:

- asset categories and review notes;
- provider access questions;
- CUI-flow assumptions;
- `unknown_boundary_items`;
- imported validation questions;
- technology profile gaps;
- profile boundary impact fields;
- Interview/Workshop answers and advisor notes.

However, those fragments do not form one coherent record with:

- stable decision ID;
- proposed disposition such as included, excluded, inherited, shared, unknown, or blocked;
- rationale;
- affected asset/provider/flow/service IDs;
- source references and confidence;
- validating stakeholder;
- validation status;
- unresolved dependency;
- next action;
- Workshop impact; and
- imported/inferred/user-entered/advisor-confirmed origin.

There is no top-level decision-ledger key in the Return JSON and no normal UI page that lets the advisor review the current decisions as a set. The Interview / Workshop page provides eight generic prompts with status, owner, evidence references, and notes, but it is a facilitation script—not a decision history or current-state ledger.

This is not a documentation problem. It is a bounded data-model and workflow gap.

### 3. Unresolved unknowns — Partially sufficient

#### Existing capability

v3.11 does promote several important gap counts:

- 3 service profiles need enabled-module validation;
- 8 need administrator/support-access validation;
- 10 need a responsibility-source reference.

Each technology profile has a completion percentage and profile gaps. The Return JSON preserves 28 `unknown_boundary_items` and 41 technology-profile questions.

#### Missing operational prominence

The unknowns are not presented as a unified action surface.

The 28 unknown records do not contain:

- priority/materiality;
- expected respondent/owner;
- next action;
- blocking versus warning state; or
- Workshop timing.

Dashboard does not show unresolved count. Review does not list the 28 unknowns and does not combine them with profile gaps. Reports do not provide a prioritized unknowns table with owner and next action. PowerPoint discusses unresolved questions generically but does not show an actionable top set.

The result is a useful inventory of uncertainty without a sufficiently prominent operator queue.

### 4. Pre-Workshop questions — Insufficient

#### Existing capability

The Return JSON contains:

- 21 imported `validation_questions`;
- 21 `scope_questions_for_workshop` records derived from that imported set; and
- 41 `technology_profile_validation_questions`.

The 41 technology questions are generally clean, material, and prioritized High or Medium. They cover exact environment/edition, enabled modules, provider/admin access, support location, and responsibility sources.

#### Quality and packaging failures

Seven imported questions are not client-readable questions. Examples include:

- `"review_required_reason": "Synthetic setup data requires advisor review.",`
- `"Notes": "Provider admin access requires validation."`
- `"why_review_required": "Client-proposed categorization must be validated by advisor.",`

The Review page displays those fragments directly because it renders the first 15 imported question strings. This is visible operator noise, not only a raw-package issue.

The 41 generated technology questions have no:

- question ID;
- source document references;
- source basis;
- expected respondent;
- before-Workshop versus during-Workshop phase;
- related asset IDs;
- related flow IDs;
- blocker/warning classification; or
- link to a material scoping decision.

Questions are also split across separate arrays and truncation rules:

- Review: first 15 imported questions;
- Technology & Providers: first 18 generated technology questions;
- Advisor Report: first 25 generated technology questions;
- Client Summary: no specific question list;
- PowerPoint slide 8: one specific question plus generic themes.

The existing `scope_questions_for_workshop` is only the imported 21-question set; it does not incorporate the 41 technology questions. Workshop therefore receives multiple partially overlapping inputs and would have to reinterpret them to produce one useful queue.

### 5. Return-package generation is not idempotent

This defect was found while reviewing the fresh Return JSON.

A clean imported workspace was tested by calling `makeReturn()` seven times without changing any data:

| Call | Total records | Technology profile records | Unique technology profile IDs |
|---:|---:|---:|---:|
| 1 | 147 | 10 | 10 |
| 2 | 157 | 20 | 10 |
| 3 | 167 | 30 | 10 |
| 4 | 177 | 40 | 10 |
| 5 | 187 | 50 | 10 |
| 6 | 197 | 60 | 10 |
| 7 | 207 | 70 | 10 |

The top-level profile section still contains ten profiles, but the shared `records` array accumulates duplicates. The cause is consistent with v3.11 appending profile records to a cached/base package object on every `makeReturn()` call.

This is a contract/export defect because normal preview, pre-flight, report, and download actions can invoke package generation more than once. It should be corrected in the bounded release and covered by an idempotency regression.

### 6. Fresh PowerPoint contains clipped sentence fragments

The fresh populated PowerPoint opened as an 11-slide PPTX, but text extraction found incomplete phrases:

- Slide 4: `Confirm provider and administrator access, support locations, service dependencies, and.`
- Slide 8: `Confirm each provider, service module, administrator path, support location, data exposure, evidence owner, and.`
- Slide 8: `Confirm actual CUI behavior, including uploads, downloads, synchronization, printing, backups, remote access, provider.`
- Slide 8: `Confirm the SSP, diagrams, inventories, and responsibility records match the current boundary and provider/service.`

These contradict the release-report statement that no known clipped sentence fragments were found. The audit does not modify the application, but the bounded proposal should include presentation mapping regression tests that assert complete phrases after length fitting.

## Gap register

| ID | Gap | Type | Existing or missing | Severity | Owner | Downstream impact | Recommended response |
|---|---|---|---|---|---|---|---|
| SC-AUD-001 | Inclusion/exclusion rationale is scattered and not consistently visible in summary/report surfaces | Presentation/discoverability; report/output | Existing capability needing promotion | High | Scoper | Workshop and client reviewers may see category without concise reasoning | Consolidated rationale/decision view and report fields |
| SC-AUD-002 | No coherent Scoping Decision Ledger | Data-model; workflow; contract/export | Genuinely missing | Critical | Scoper | Material scope decisions cannot be reviewed or traced as a set | Add optional additive ledger and connected review surface |
| SC-AUD-003 | Unknowns lack unified priority, owner, next action, and blocking state | Workflow; limited data model | Existing unknown data plus missing operational fields | High | Scoper | Workshop follow-up must reconstruct priority and ownership | Unified unknowns queue linked to ledger/questions |
| SC-AUD-004 | Pre-Workshop questions are split, truncated, and incompletely structured | Contract/export; workflow; report/output | Genuinely incomplete | Critical | Scoper | Workshop must reinterpret question arrays | Add coherent optional question package |
| SC-AUD-005 | Seven imported validation questions are raw JSON fragments | Adjacent-tool candidate precision plus Scoper defensive-filter gap | Existing upstream defect; defensive handling missing | High | DocConverter primary; Scoper defensive handling | Client/advisor-facing review page displays malformed questions | Narrow DocConverter prompt plus Scoper filtering |
| SC-AUD-006 | Repeated `makeReturn()` calls duplicate technology profile records | Contract/export defect | Genuinely missing idempotency safeguard | Critical | Scoper | Downstream importer may receive repeated profile records | Make generation idempotent and add repeat-call regression |
| SC-AUD-007 | PowerPoint contains clipped sentence fragments | Report/output | Existing mapping/fitting capability needs correction | Medium | Scoper | Client presentation quality and meaning are reduced | Complete-phrase fitting regression |
| SC-AUD-008 | Technology questions lack source references, respondent, phase, and affected asset/flow links | Data-model; contract/export | Genuinely incomplete | High | Scoper | Workshop cannot present questions without enrichment | Add optional question metadata |
| SC-AUD-009 | `technology_service_profile` records are rich but have empty rationale-link fields in the fresh run | Data quality/presentation | Existing fields not populated or linked | Medium | Scoper | Users cannot connect profile conclusions to concrete records | Promote linking during import/review; do not infer final scope |

## Existing-but-hidden versus genuinely missing

### Existing capabilities that need better presentation or consolidation

- Candidate asset categories.
- Proposed boundary impact.
- Source IDs/files and confidence.
- Advisor-review flags.
- Per-profile completion and gap counts.
- Imported unknown boundary items.
- Imported validation questions.
- Technology-profile questions.
- Provider/admin access and evidence expectations.
- Responsibility-source readiness fields.
- Interview owner/evidence-reference fields.

### Genuinely missing or materially incomplete capabilities

- Coherent Scoping Decision Ledger.
- Stable decision records with disposition, owner, status, affected records, dependency, next action, and Workshop impact.
- One clean Pre-Workshop question package combining scope and technology questions.
- Before-Workshop versus during-Workshop classification.
- Expected respondent for questions.
- Question-to-decision and question-to-asset/provider/flow/service links.
- Unified blocker/warning unknowns queue.
- Idempotent `makeReturn()` behavior.
- Defensive validation-question sanitation in Scoper.

## Contract impact assessment

### Stable identities to preserve

- Input: `l2g_scope_context_v1`, version `1.0`
- Output: `l2g_scope_return_package_v1`, version `1.0`
- Browser storage key: unchanged
- Practice records: zero
- Draft/advisor-review trust model: unchanged

### Proposed future contract approach

The current return-package identity can remain stable. A bounded v3.12 can add optional, safely ignorable sections:

- `scoping_decision_ledger_v1`
- `pre_workshop_question_package_v1`

Existing arrays should remain for backward compatibility. New sections should reference stable asset, provider, flow, service, source-document, and question IDs. Older Workshop importers may ignore them without failing.

The return-generation duplication defect requires a correction but does not require a package-kind or version change.

## Downstream handoff impact

### CMMC L2 Gap Workshop Tool

No immediate Workshop code change is authorized by this audit. The current Workshop can continue importing the established package.

After a future bounded Scoper release implements the additive ledger/question sections, Workshop should receive a smoke-test package and decide whether to surface those optional sections directly. Until those fields exist, Workshop should not be asked to invent decision metadata that Scoper does not provide.

### DocConverter-L2G

DocConverter owns upstream candidate extraction precision. The fresh v7.9 scope package supplied seven raw JSON field/value fragments as validation questions. A narrow adjacent-tool prompt is included with this audit.

Scoper should still add defensive filtering because it is responsible for what it displays and returns, but Scoper cannot prevent malformed candidates from being produced in other downstream consumers of DocConverter.

### Builder/Merger

No Builder/Merger action is required. Scoper does not emit workbook or assessment-conclusion packages, and the confirmed gaps concern scope review and Workshop preparation.

### L2G Control Center

Persistent cross-tool task/action management remains deferred. The bounded Scoper response should only capture decision/question owner and next action needed for the immediate scoping-to-Workshop handoff, not become a suite-wide task manager.

## Recommendation

Authorize a **bounded v3.12 proposal**, not implementation during this audit.

The release should be limited to decision transparency and clean Workshop preparation. It should not become a broad UI redesign, readiness tool, responsibility engine, or cross-session action manager.

The attached proposal defines the smallest cohesive scope. The adjacent DocConverter prompt is separate because upstream candidate precision is not solely a Scoper responsibility.

## Items explicitly deferred

- Practice readiness, evidence sufficiency, scoring, and final-scope conclusions.
- Final provider responsibility overlay.
- Full Workshop Capability Questionnaire duplication.
- Cross-session task aging and closure management.
- Builder/Merger diff governance.
- Control Center suite-wide blocker/action overview.
- Adjacent-tool application modifications in this branch.
- Any v3.12 code.

## Decision gate

**Decision 3 — Bounded v3.12 justified.**
