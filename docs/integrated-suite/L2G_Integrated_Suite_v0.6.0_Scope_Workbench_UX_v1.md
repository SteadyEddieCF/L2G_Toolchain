# L2G Integrated Suite v0.6.0 — Scope Workbench UX and Usability Record

## Status

Design record for issue #139. It reconciles the temporary specialist UX/IA handoff with ADR-0011 and the Scope field-level contract. It becomes implementation authority only after reviewed merge.

## UX objective

Enable an advisor to move from reviewed engagement context and source candidates to an explicit, auditable Scope boundary without recreating L2G Scoper’s tab-heavy shell or turning imports, diagrams, or interview statements into silent decisions.

The Scope workspace must answer six questions quickly:

1. What boundary are we describing?
2. Which systems, assets, providers, services, locations, and enclaves are involved?
3. How does asserted CUI or other relevant data move?
4. What has been accepted, proposed, disputed, deferred, or superseded?
5. What remains unknown or blocks a decision?
6. What source and decision history supports each visible statement?

## Reconciled specialist recommendations

The v0.6 design preserves the specialist handoff’s strongest recommendations:

- one engagement, eight workspaces, one review system, and one consistent object-inspection model;
- persistent left rail, compact workspace header/subnavigation, central work canvas, right inspector, and global top bar;
- preserve Scoper draft scope records, assets, providers, flows, unknowns, decision ledger, staged preview, and diagrams;
- relocate the Scoper decision ledger to `Scope > Decisions`;
- publish pre-workshop questions to the Interview/Practice Review Session Planner rather than keeping a second question authority in Scope;
- consolidate technology profiles into systems, providers, and services;
- redesign large diagram surfaces as `Scope > Diagrams` with fit/zoom controls and an object-linked inspector;
- preserve preview-before-apply, provenance, explicit draft/proposal/confirmation/approval/supersession, and visible stale/conflicted/rejected/blocked states;
- do not reproduce the standalone Scoper’s horizontal tab structure or routine export handoff mechanics.

## Workspace information architecture

Primary Scope subnavigation:

1. **Boundary**
2. **Systems & Assets**
3. **Providers & Services**
4. **Data Flows**
5. **Decisions**
6. **Diagrams**

Unknowns, assumptions, dependencies, import receipts, and history are contextual layers rather than equal-weight primary destinations:

- unresolved unknowns appear in Boundary, relevant object views, the inspector, and Reviews & Actions;
- assumptions appear with affected records and in the Decision composer;
- dependencies appear in object detail, Data Flows, Decisions, and Diagrams;
- imports open the shared preview/apply flow from the workspace toolbar;
- complete object history appears in the right inspector and engagement history remains in Reviews & Actions.

## Persistent shell

The existing suite shell remains authoritative:

- **top bar:** engagement identity, save state, Undo/Redo, lock, command/search entry, and active presentation profile;
- **left rail:** eight workspaces with Scope selected;
- **workspace header:** title, factual state summary, next-work prompt, compact subnavigation, and context actions;
- **central canvas:** primary list/detail or diagram task;
- **right inspector:** identity, authority owner, exact version, provenance, decisions, related records, differences, history, and permitted actions;
- **global review badge:** unresolved candidates, returned decisions, stale diagrams, blocking unknowns, and assigned review work.

No oversized hero panel appears during routine work. Summary metrics are compact, actionable, and computed after profile filtering.

## Shared interaction pattern

All object views use one consistent pattern:

- filter/search strip;
- compact list or grouped list on the left/center;
- selected object detail in the central canvas;
- object inspector on the right;
- command bar containing only actions valid for the selected profile and object state;
- visible authority/state chips with text labels, not color alone;
- source/decision links that open in the inspector without changing authority;
- explicit Compare when a source, dependency, decision, or diagram version is stale.

Selection, inspector content, differences, cached counts, search results, and focus targets are cleared before a new profile projection renders.

## Boundary view

### Purpose

Provide the engagement’s scoping orientation and decision readiness without implying an automatic boundary conclusion.

### Layout

The default Boundary view uses three regions:

1. **Boundary list and switcher** — named boundaries/proposals with accepted/proposed/unknown/disputed state.
2. **Boundary canvas** — plain-language purpose, included/excluded groups, entry/exit points, locations/enclaves, unresolved unknowns, and related diagrams.
3. **Inspector** — exact record identity/version, source basis, governing decisions, conflicts, dependencies, and history.

### Summary strip

The compact summary may show:

- accepted in-scope object count;
- accepted out-of-scope object count;
- proposed/unknown/disputed object count;
- blocking unknown count;
- stale decision/diagram count;
- candidates awaiting Scope review.

These are factual workflow counts, not readiness, risk, compliance, or evidence-sufficiency metrics.

### Next-work panel

Shows a ranked factual list such as:

- review 12 imported object candidates;
- resolve 3 decision conflicts;
- confirm provider support access for one service;
- refresh one stale data-flow diagram;
- publish 4 unresolved questions to Session Planner.

Ranking uses deterministic state/priority rules, not hidden AI scoring.

## Systems & Assets view

### Primary tasks

- create or review systems and assets;
- distinguish system from asset rather than flattening both into one table;
- assign proposed category/disposition/relationship/location/responsibility dimensions;
- compare source candidates with current governed records;
- create or open the governing Scope decision;
- link providers, services, locations, enclaves, flows, assumptions, unknowns, and diagrams.

### Layout modes

- **Grouped list:** systems as expandable groups with related assets;
- **Asset list:** filterable object inventory for bulk review;
- **Detail focus:** one selected object with related-record map;
- **Comparison:** candidate/source version versus current governed version.

Large tables are not the default. A table-like density mode may exist under View options for expert review, but the inspector remains the authoritative action surface.

### Filters

Object type, asset category, disposition, boundary relationship, implementation location, responsibility, lifecycle, review state, visibility, currency, source, provider, system, and blocking unknown.

Filters expose separate dimensions; the UI never labels one combined status as “scope state.”

## Providers & Services view

### Primary tasks

- understand which provider supplies which service to which system/asset;
- separate provider identity from service identity;
- record proposed responsibility and implementation-location context;
- show contract/evidence references without embedding originals;
- surface support access, inheritance claims, unresolved ownership, and stale source context;
- create explicit decision proposals rather than treating provider metadata as accepted responsibility.

### Provider detail

Sections:

- identity and engagement organization link;
- supplied services;
- supported systems/assets;
- implementation and responsibility context;
- source references;
- support-access summary;
- inheritance/context claims;
- unresolved unknowns;
- governing decisions;
- related flows and diagrams.

Client View hides internal contract/source diagnostics, private support details, confidence, and rejected candidates.

## Data Flows view

### Primary tasks

- review asserted source, destination, intermediaries, data description, direction, frequency, transfer method, boundary crossings, and protection notes;
- distinguish one flow record from a drawn edge;
- identify unknown endpoints/intermediaries and blocking questions;
- compare imported flow candidates with existing records;
- create governing flow-treatment decisions;
- open linked diagrams without leaving the object context.

### Layout

- flow list grouped by boundary crossing or system;
- compact source → intermediaries → destination path summary;
- detail canvas with exact linked objects and plain-language crossing explanation;
- inspector with provenance, source versions, decisions, unknowns, and history.

A “Show on diagram” command opens or creates a diagram proposal but does not alter the flow or diagram approval state.

## Decisions view

### Purpose

Make the Scope decision ledger the primary authority surface rather than burying rationale in object notes.

### Queues

- Draft
- Proposed
- Awaiting confirmation
- Awaiting review
- Accepted
- Returned / changes requested
- Conflicted or stale
- Superseded / archived

### Decision list item

Shows:

- decision type;
- affected object label(s);
- proposed/accepted value summary;
- decision state;
- review/confirmation state;
- stale/conflict indicator;
- blocking unknown count;
- last meaningful update.

### Decision composer

Structured regions:

1. **Question being decided**
2. **Affected exact record versions**
3. **Proposed field changes**
4. **Source basis and provenance**
5. **Advisor analysis**
6. **Assumptions and unknowns considered**
7. **Client-safe rationale**
8. **Confirmation/review requests**
9. **Supersession/conflict treatment**
10. **Preview of atomic effects**

Accept remains disabled until semantic validation passes. The preview names exactly which Scope-owned fields will change and explicitly states that source domains will not be mutated.

### Decision actions

Advisor:

- Save draft
- Propose
- Request confirmation
- Request review
- Accept
- Modify and accept
- Return to draft
- Withdraw
- Supersede

Reviewer:

- Concur
- Concur with changes
- Return
- Reject

Client presentation:

- discuss selected Client-visible proposed/accepted decisions;
- record an exact-version locally asserted confirmation where permitted;
- no access to Advisor-only analysis, internal conflicts, rejected candidates, or hidden source metadata.

A confirmation is always labeled as a locally recorded facilitation event, not an electronic signature or broad engagement approval.

## Diagrams view

### Purpose

Provide bounded, object-linked visual representations without turning pictures into a second authority source.

### Layout

- left diagram list with kind, review state, visibility, and stale indicator;
- central pan/zoom canvas;
- top canvas controls: Fit, 100%, zoom in/out, center selection, show/hide labels, show proposed objects, show unknown placeholders;
- right inspector linked to the selected diagram, node, edge, or annotation;
- bottom or collapsible text alternative for keyboard/screen-reader access.

### Object-linked behavior

- selecting a node opens the referenced object in the inspector;
- selecting an edge opens the referenced flow/dependency;
- free-standing imported labels are proposal placeholders until linked or rejected;
- “Create object candidate” creates a Scope candidate only after explicit Advisor action;
- editing layout changes presentation only;
- editing object properties occurs through the governed object command, not directly on the drawing surface.

### Diagram states

- Draft
- Proposed
- Reviewed
- Approved representation
- Changes requested
- Stale
- Superseded
- Archived

Stale diagrams remain viewable with a visible qualification and exact changed-reference list. Refresh creates a new diagram version or explicit superseding version; it never overwrites an approved representation silently.

### Deterministic generation

Generate Diagram opens a review panel where the Advisor selects:

- accepted only;
- accepted plus selected proposals;
- boundary/system/provider/flow focus;
- included object types;
- labeling density;
- Client-visible output intent.

Generation creates a draft representation. It does not create objects, accept decisions, or approve the result.

## Unknowns and assumptions

Unknowns are not hidden in notes.

### Unknown presentation

Each unknown shows:

- statement;
- kind;
- priority as workflow priority, not risk score;
- blocking effect;
- owner;
- due date;
- affected records;
- source basis;
- resolution state;
- related session-question candidate;
- resolving decision.

Unknowns appear contextually in Boundary and object views and as a cross-engagement queue in Reviews & Actions.

### Publish to Session Planner

The command creates an Interview/Practice Review question candidate containing:

- exact unknown and affected-record refs;
- proposed prompt;
- client-safe explanation;
- rationale;
- expected participants;
- source basis;
- visibility.

It does not create a live agenda item automatically. The Session Planner remains the question/plan authority.

## Shared import preview

Scope uses the same preview-before-apply pattern as Evidence and v0.5 adapters.

### Preview stages

1. File/package identity and supported kind/version
2. Integrity, duplicate-key, path-leak, and source-traceability checks
3. Proposed objects grouped by family
4. Duplicate/ambiguous matching
5. Decision-ledger and question-package candidates
6. Validation diagnostics
7. Reviewed selection and intended actions
8. Atomic effect preview

### Per-record treatment

- Create new
- Link to exact existing
- Keep separate
- Modify and create/link
- Reject

No approximate-name match is auto-applied. The interface explains why a candidate was suggested as a possible match.

### Apply result

A receipt lists created/linked/rejected/returned records, decisions/candidates created, diagnostics, package SHA-256, and history/checkpoint identity. Package bytes are not retained.

## Inspector design

The Scope inspector uses consistent tabs/sections:

- **Overview** — type, label, authority owner, exact version, state dimensions;
- **Relationships** — systems/assets/providers/services/flows/boundaries/dependencies;
- **Source & provenance** — sanitized source labels, hashes/refs, asserted origin;
- **Decisions** — current governing decision and prior/superseded decisions;
- **Differences** — current versus candidate/source/diagram version;
- **Unknowns** — unresolved and blocking items;
- **History** — meaningful command history;
- **Actions** — only commands valid for profile/state.

The inspector never shows writable controls backed by another domain’s projection.

## Client presentation profile

Client View is a coherent Scope presentation, not Advisor View with a few hidden tabs.

### Permitted surfaces

- selected Client-visible boundary summary;
- Client-safe systems/assets/providers/services selected for discussion;
- plain-language data-flow summaries;
- accepted or clearly proposed decisions selected for discussion;
- Client-visible unresolved questions;
- reviewed/approved diagrams generated from the Client-safe projection;
- exact-version confirmation control where permitted.

### Removed before projection construction

- Advisor-only analysis and notes;
- internal source excerpts and diagnostic provenance;
- private participant metadata;
- rejected/returned/withdrawn candidates;
- internal conflicts not selected for discussion;
- confidence and automated matching diagnostics;
- hidden objects and hidden counts;
- stale-difference internals unless represented as an approved plain-language qualification;
- review comments and assignment metadata;
- import receipts and parser diagnostics.

### Persistent qualification

Client Scope presentation displays:

> This is a locally facilitated Scope view. It is not access control, an authenticated approval, an assessment conclusion, or authorization to distribute the complete project.

## Reviewer profile

Reviewer View supports:

- read-only object context;
- assigned decision queue;
- exact source/affected versions needed for review;
- Concur, Concur with changes, Return, and Reject;
- reviewer comments and preserved history;
- no direct editing of object records outside an explicit disposition command.

## Keyboard and accessibility behavior

### Global

- all subnavigation, filters, list items, commands, inspector sections, dialog controls, and diagram controls are keyboard reachable;
- visible focus indicator meets contrast/size requirements;
- no action relies on hover, color, drag, or pointer precision alone;
- status chips include text and accessible names;
- dialogs trap focus and restore it only to a valid element in the new projection;
- live-region announcements contain no hidden counts or Advisor-only content.

### List/detail

- `Arrow Up/Down` moves list selection;
- `Enter` opens detail/inspector;
- `Escape` closes inspector/dialog and restores valid focus;
- `/` focuses the current profile-safe search;
- `Ctrl/Cmd+K` opens the command palette;
- standard Undo/Redo shortcuts use the shared project commands.

### Diagrams

- node/edge list provides a non-canvas navigation equivalent;
- arrow keys move among ordered accessible diagram objects rather than requiring spatial navigation;
- Enter opens the referenced object;
- text alternative is always reachable;
- zoom/layout changes are announced without exposing hidden object names.

## Responsive targets

### Desktop baseline

- primary: 1440×900 and larger;
- minimum supported workflow viewport: 1280×720;
- central canvas remains usable with inspector open;
- compact summary and subnavigation do not wrap into an oversized header.

### Tablet landscape

- target: approximately 1024×768 landscape;
- inspector becomes an overlay/drawer;
- list/detail switches to one-pane navigation;
- diagram controls collapse into a compact toolbar;
- no horizontal page scrolling for primary tasks.

### Narrow/mobile

Not a primary release target. The application may provide read-only summaries and basic selection, but complex decision composition and diagram editing may require the supported desktop/tablet landscape viewport. This limitation must be truthful rather than simulated by unusable compressed controls.

## Factual next-work rules

Next-work items are deterministic and explainable. Examples:

- candidate awaiting review;
- accepted decision stale because exact source version changed;
- object has accepted disposition without current decision reference — validation error;
- blocking unknown overdue;
- diagram stale because referenced object version changed;
- provider/service missing responsibility context;
- Client-visible record missing Client label/summary;
- unresolved duplicate/ambiguous import candidate;
- returned decision awaiting Advisor changes.

The UI does not use hidden readiness or risk scores.

## Required usability scenarios

1. **Boundary orientation:** advisor opens a migrated v0.5 project, sees an empty Scope workspace, creates a draft boundary, and understands that no imported content is authoritative yet.
2. **Reviewed import:** advisor previews a synthetic Scoper v3.12 return, links known provider records, keeps two same-name assets separate, rejects malformed questions, and applies a reviewed subset atomically.
3. **Decision creation:** advisor converts an asset candidate into a governed asset, proposes category and in-scope disposition, reviews exact source basis, records rationale, and accepts through one atomic decision.
4. **Conflict:** a second candidate proposes out-of-scope treatment for the same exact asset version; the UI blocks conflicting acceptance until return/rejection/supersession is explicit.
5. **Unknown to session:** advisor publishes a blocking provider-access unknown to Session Planner; it appears as a question candidate, not a live agenda item.
6. **Provider/service context:** advisor distinguishes provider, service, implementation location, and responsibility without creating a practice conclusion.
7. **Flow review:** advisor traces an asserted CUI flow, links intermediaries, identifies an unknown crossing, and opens the governing decision.
8. **Diagram generation:** advisor creates a draft boundary diagram from selected accepted records, edits layout, reviews the text alternative, and explicitly approves it as a representation.
9. **Stale diagram:** a referenced object changes; the diagram visibly becomes stale and remains historically available until refreshed/superseded.
10. **Client presentation:** switching to Client View removes Advisor analysis, rejected candidates, hidden counts, import diagnostics, and private metadata before render/search/inspector/a11y construction.
11. **Reviewer return:** reviewer returns a decision with comments without directly editing the governed object.
12. **Recovery:** encrypted save/reopen and browser recovery preserve exact Scope objects, decisions, diagrams, profile-safe visibility, history, and Undo/Redo.

## Explicit non-goals

- automatic CUI-boundary determination;
- automatic asset classification or applicability;
- automatic candidate acceptance;
- direct diagram-to-object mutation;
- practice findings, responsibility conclusions, SSP narratives, gaps, recommendations, readiness, compliance, risk, scoring, certification, evidence sufficiency, implementation, or Met/Not Met;
- authenticated identity, signatures, cloud collaboration, external Client distribution, or standalone Scoper retirement.