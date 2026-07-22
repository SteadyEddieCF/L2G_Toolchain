# Developer Prompt: Optional Multi-Module SSP Portfolio Support

Enhance `CMMC_L2_SSP_Modern_Editable_v1.7.1.html` so it can support both conventional single-system SSP development and optional multi-module SSP portfolios.

Do not replace or degrade the existing single-system workflow. Modular operation must be an explicit user-selected mode intended for customers with shared-service, anchor, system-of-systems, multi-tenant, or product-line architectures.

## 1. Current-State Assumptions

The current tool provides:

* One SSP workspace
* All 110 CMMC Level 2 requirements
* Requirement implementation narratives and statuses
* CSP inheritance fields
* ESP shared-responsibility fields
* Owner, evidence, scope, and remediation fields
* Browser local storage and recovery
* JSON import and export
* CRM CSV import and export
* Word review exchange
* Preflight and completion checks

The current tool does not natively provide:

* A portfolio containing multiple related SSPs
* Parent-child module relationships
* Module-specific applicability
* Controlled inheritance between modules
* Parent-change propagation
* Local overrides
* Consolidated cross-module CRM reporting
* Conflict detection between parent and child narratives
* Portfolio baselines or module version coordination

Preserve existing functionality and data compatibility.

## 2. Product Objective

Add an optional portfolio mode that can represent:

* One top-level or anchor SSP
* Zero or more shared-service SSP modules
* Zero or more tenant, product, application, or enclave SSP modules
* Requirement-level inheritance and shared responsibility
* Local module implementation and overrides
* Consolidated CRM and readiness views

The tool must remain practical for customers that need only one SSP.

## 3. Operating Modes

### 3.1 Single-System mode

Single-System mode must:

* Remain the default for new workspaces.
* Preserve the current interface and workflow.
* Open existing local-storage, JSON, CRM CSV, and Word-review data.
* Hide portfolio controls unless the user enables them.
* Permit later conversion through a guided migration.
* Require no duplicate module records.

### 3.2 Modular Portfolio mode

Modular Portfolio mode must support:

* One portfolio record.
* One top-level SSP module.
* Shared-service modules.
* Tenant, product, application, or enclave modules.
* Configurable parent-child relationships.
* Stable module identifiers.
* Module owners and approval authorities.
* Module boundaries, services, applications, data types, identities, and interconnections.
* Requirement applicability and implementation by module.
* Portfolio and module exports.

Mode conversion must create a backup, show a migration preview, and provide rollback. It must not delete existing content.

## 4. Required Data Model

Create and document a versioned JSON schema.

### 4.1 Portfolio record

Include:

* `portfolioId`
* `name`
* `description`
* `operatingMode`
* `cmmcLevel`
* `environment`
* `topLevelModuleId`
* `schemaVersion`
* `portfolioVersion`
* `status`
* `owners`
* `createdAt`
* `updatedAt`
* `approvedAt`
* `approvedBy`

### 4.2 Module record

Include:

* `moduleId`
* `portfolioId`
* `parentModuleId`
* `moduleType`
* `name`
* `shortName`
* `description`
* `boundaryStatement`
* `subscriptionIdentifiers`
* `services`
* `applications`
* `dataTypes`
* `identitySources`
* `interconnections`
* `responsibleOrganizations`
* `owners`
* `status`
* `version`
* `createdAt`
* `updatedAt`

Prevent circular parent-child relationships.

### 4.3 Module requirement record

For each of the 110 requirements, include:

* `requirementRecordId`
* `requirementId`
* `moduleId`
* `applicability`
* `applicabilityRationale`
* `implementationStatus`
* `implementationNarrative`
* `inheritedFromModuleId`
* `inheritedSourceVersion`
* `inheritanceType`
* `responsibilityModel`
* `cspResponsibility`
* `espResponsibility`
* `organizationResponsibility`
* `moduleResponsibility`
* `ownerIds`
* `evidenceIds`
* `scope`
* `remediationPlan`
* `poamReference`
* `overrideState`
* `overrideRationale`
* `reviewStatus`
* `approvalStatus`
* `lastValidatedAt`
* `version`

### 4.4 Supporting records

Create first-class records for:

* Evidence
* Decisions
* Actions
* Risks
* Conflicts
* Exceptions
* Interconnections
* Assets and services
* Change history
* Approved baselines

Use stable identifiers that survive import, export, synchronization, and module reassignment.

## 5. Applicability Model

Support these module-level values:

* Applicable, inherited
* Applicable, shared responsibility
* Applicable, locally implemented
* Applicable, inherited with local supplement
* Not applicable
* Pending decision

Requirements:

* Not-applicable selections require rationale and approval.
* Pending decisions remain visible as readiness gaps.
* Inherited records identify the source module and version.
* The tool must not count inherited implementation more than once in portfolio metrics.
* Module owners must be able to supplement inherited implementation without modifying the parent.

## 6. Inheritance and Override Rules

Implement deterministic inheritance.

### 6.1 Inheritance

A child may inherit approved fields from a parent or authorized shared-service module.

Inherited content must display:

* Source module
* Source version
* Source approval state
* Last synchronization date
* Fields inherited
* Residual child responsibilities

### 6.2 Overrides

A child override must capture:

* Changed fields
* Original inherited values
* Replacement values
* Rationale
* Owner
* Reviewer
* Approver
* Effective version
* Affected requirements and evidence

Never silently overwrite an approved child override.

### 6.3 Parent changes

When a parent changes, provide an impact preview that identifies:

* Affected modules
* Affected requirements
* Changed inherited fields
* Existing child supplements or overrides
* Potential responsibility conflicts
* Required revalidation

Each child owner must be able to:

* Accept the update
* Defer the update
* Retain an approved override
* Reject the update with rationale
* Escalate a conflict

## 7. Conflict Detection

Detect and report:

* Conflicting parent and child implementation narratives
* Multiple inheritance sources with inconsistent values
* Duplicate requirement records
* Orphaned modules or evidence
* Unsupported schema versions
* Inconsistent responsibility assignments
* Missing module applicability
* Stale inherited content
* Missing override approvals
* Conflicting implementation status and remediation fields
* External systems without boundary or interconnection treatment
* Shared services assigned without residual customer responsibility
* Portfolio facts that differ across modules

Classify findings as:

* Approval blocker
* Error
* Warning
* Informational
* Accepted exception

Do not reconcile conflicts automatically.

## 8. Consolidated CRM

Add a portfolio-level CRM covering all 110 requirements and every module.

The CRM must:

* Preserve module-level detail.
* Show the authoritative implementation source.
* Distinguish inherited, shared, supplemented, overridden, local, and pending records.
* Identify CSP, ESP, organization, and module obligations.
* Include ownership, evidence, scope, remediation, and POA&M references.
* Avoid double-counting inherited implementation.
* Retain source and legacy identifiers.
* Support filtering by module, family, owner, status, inheritance, evidence, conflict, and approval.
* Export a consolidated CSV.
* Export module-specific CSV files.
* Produce a reconciliation report when imported CRM records conflict with the portfolio.

## 9. Import and Export

### 9.1 Import requirements

Support:

* Existing single-system JSON
* Versioned modular JSON
* Existing CRM CSV
* Consolidated modular CRM CSV
* Module-specific CRM CSV
* Structured evidence-register data
* Structured decision and action records

Before committing an import, provide:

* File validation
* Schema and version checks
* Field mapping
* Duplicate detection
* Conflict analysis
* Impact preview
* Backup
* Rollback

Do not interpret free-form legacy content as approved implementation, inheritance, or responsibility.

### 9.2 Export requirements

Support:

* Complete portfolio JSON
* Individual module JSON
* Consolidated CRM CSV
* Module CRM CSV
* Top-level Word review package
* Module-specific Word review packages
* Decision, action, conflict, evidence, and validation reports
* Export manifest

The manifest should include:

* Schema version
* Portfolio version
* Module versions
* Export timestamp
* Record counts
* Integrity hash

Round-trip import and export must preserve identifiers, relationships, inheritance, overrides, approvals, history, and evidence references.

## 10. Versioning and Baselines

Implement:

* Schema versioning
* Portfolio versioning
* Module versioning
* Requirement-record versioning
* Immutable approval snapshots
* Field-level change history
* Comparison between versions
* Restoration through a new version
* Release notes
* Stale-child notifications

Approved history must not be deleted or rewritten.

## 11. User Experience

### 11.1 Single-system safeguards

* Keep the existing streamlined interface.
* Do not force users to understand modules.
* Do not require portfolio configuration.
* Preserve existing keyboard and export workflows.

### 11.2 Modular interface

Provide:

* Portfolio and module selector
* Module hierarchy view
* Current module context on each requirement
* Inheritance-source indicator
* Override and stale-content indicators
* Portfolio and module dashboards
* Saved filters
* Bulk applicability review
* Unresolved-decision queue
* Conflict-resolution queue
* Parent-change impact preview
* Clear distinction among saved, validated, reviewed, approved, and exported states

Use text and icons in addition to color. Meet accessible contrast, labeling, and keyboard-navigation expectations.

## 12. Security and Privacy

The tool may contain sensitive system-security information.

Requirements:

* Preserve local-only operation unless a separate backend architecture receives approval.
* Do not transmit SSP data externally by default.
* Keep each portfolio’s browser storage isolated.
* Store evidence references rather than evidence files by default.
* Sanitize imports and editable HTML content.
* Prevent script injection and CSV formula injection.
* Validate file type, encoding, schema, and size.
* Provide secure backup, restore, and reset functions.
* Add clear classification warnings to exports.
* Do not add telemetry, analytics, external libraries, or network dependencies without approval.
* If multi-user or server-side features are proposed later, require separate architecture, privacy, authorization, and threat-model reviews.

## 13. Validation Rules with High Customer Value

Design validation as configurable rules rather than hard-coded Quanta-specific behavior.

Include rules that can detect:

* Stated component or subscription counts that differ from inventories
* Multiple identity sources described as authoritative
* Overlapping directory-service functions
* External systems of record without documented boundary treatment
* Missing diagrams or data flows
* Undecided tooling
* Undefined non-employee identity and eligibility processes
* Missing responsibility owners
* Missing evidence owners
* Inheritance without a source
* Shared responsibility without residual customer duties
* Inconsistent implementation states across modules
* Parent changes not reviewed by affected child modules

Allow organizations to enable, disable, or configure rules.

## 14. Testing Requirements

Create automated tests for:

* Existing single-system workflows
* Migration from current JSON and CRM CSV formats
* Schema validation
* Parent-child integrity
* Circular-reference prevention
* Applicability
* Inheritance
* Overrides
* Change propagation
* Conflict detection
* Stale-state detection
* Consolidated CRM calculations
* Duplicate prevention
* JSON and CSV round trips
* Word review exchange
* Version comparison and restoration
* Interrupted-save recovery
* Malformed and malicious imports
* CSV formula injection
* Script injection
* Browser compatibility
* Accessibility
* Performance with all 110 requirements across multiple modules

Use fixtures containing:

* One top-level SSP
* One shared-services module
* At least two tenant or product modules
* All 110 requirements
* Inherited and local implementations
* Approved overrides
* Conflicting sources
* External SaaS services
* Pending architecture decisions
* Legacy CRM records

## 15. Acceptance Criteria

The enhancement is acceptable when:

1. Existing single-system SSP data opens without material loss.
2. Users can continue in Single-System mode without interacting with portfolio features.
3. An authorized user can create a portfolio with a top-level SSP, shared-services module, and multiple child modules.
4. Each requirement supports module applicability, responsibility, implementation, evidence, remediation, inheritance, review, and approval.
5. Parent changes generate an impact preview.
6. Parent changes never silently overwrite child overrides.
7. Portfolio metrics avoid double-counting inherited implementation.
8. Consolidated CRM output preserves module-level detail and provenance.
9. Imports provide validation, reconciliation, backup, and rollback.
10. JSON round trips preserve identifiers, relationships, history, and approvals.
11. Blocking conflicts prevent baseline approval unless an authorized exception exists.
12. Single-system regression tests pass.
13. Security and accessibility tests pass.
14. User documentation explains both operating modes and migration.
15. Known limitations are documented.

## 16. Out of Scope for the Initial Enhancement

Do not include these items without separate approval:

* Cloud hosting or a multi-user backend
* Automated Azure discovery
* Direct integrations with Jira, SharePoint, GRC, CRM, HCM, or evidence repositories
* Storage of evidence binaries
* Automated compliance determinations
* Automated approval of inheritance or applicability
* Replacement of the RADD, IRP, asset repository, ticketing system, or formal GRC workflow
* Automated resolution of contradictory architecture
* Contract or legal determinations
* Assessment certification claims

## 17. Developer Deliverables

Provide:

* Architecture and data-model specification
* Versioned schemas
* Migration design
* Updated HTML tool
* Automated tests and fixtures
* Validation-rule catalog
* Import and export specifications
* User and administrator guidance
* Security and privacy design notes
* Backward-compatibility report
* Known-limitations register
* Acceptance-criteria traceability matrix
* Release-readiness report

## 18. Recommended Delivery Phases

### Phase 1: Foundation

* Versioned schema
* Backward-compatible migration
* Optional operating modes
* Module hierarchy

### Phase 2: Modular control model

* Applicability
* Inheritance
* Supplements
* Overrides
* Change-impact analysis

### Phase 3: Portfolio management

* Consolidated CRM
* Conflict detection
* Decisions and actions
* Version comparison
* Baselines

### Phase 4: Hardening

* Security testing
* Accessibility
* Performance
* Documentation
* User acceptance testing

The initial release should prioritize accurate relationships, traceability, and backward compatibility over broad integrations.
