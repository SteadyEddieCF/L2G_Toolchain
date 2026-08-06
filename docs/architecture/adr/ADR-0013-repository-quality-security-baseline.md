# ADR-0013 — Repository-Controlled Quality and Security Baseline

## Status

Proposed for repository-wide adoption on 2026-08-06. This decision is additive and does not promote a product release, change a current pointer, authorize production/client/FCI/CUI data, or implement a future Integrated Suite domain.

## Context

The repository already contains extensive release-specific deterministic builds, domain tests, Playwright workflows, axe-core checks, visual baselines, native Windows `file://` checks, archive and encrypted-project adversarial tests, public-hygiene validation, SBOMs, checksums, and exact contract-route regression. Those controls are strong but distributed across versioned release trees and workflows.

The missing layer is a stable repository policy that:

- classifies checks as blocking or advisory;
- orchestrates current release, standalone-route, security, privacy, and package validation consistently;
- adds explicit dependency, secret, workflow-security, CodeQL, and repository-wide boundary gates;
- provides deterministic local commands and reports;
- preserves release/domain authority rather than replacing existing tests;
- keeps the normal runtime offline, local, no-install, no-telemetry, and free of cloud dependencies.

## Decision

Add `quality/` as a test and policy layer, not a runtime package.

1. `quality/baseline.json` is the machine-readable classification of blocking/advisory checks, current scope, file-boundary oracle limits, and residual manual review.
2. Standard-library Python gates validate current contract/schema identity, projection identity continuity, offline packaged HTML, semantic HTML invariants, privacy patterns, workflow risk, dependency-audit coverage, and release package/SBOM/checksum integrity.
3. Hypothesis provides bounded deterministic property tests for JSON, CSV/formula handling, archive paths and limits, filename normalization, and file signatures. Scheduled runs use larger profiles.
4. Existing Playwright, axe-core, visual, Windows file-origin, module-route, migration, encryption, deterministic-build, and release tests remain authoritative and are invoked rather than replaced.
5. GitHub Actions are organized into build/unit/file/contract, browser/accessibility, security, CodeQL, scheduled deep, and release-artifact validation responsibilities with useful artifacts.
6. Dependabot covers root JavaScript QA dependencies, Integrated Suite foundation dependencies, current Integrated Suite dependencies, Python quality dependencies, and GitHub Actions. Historical immutable release trees are not mass-updated.
7. `npm audit` blocks high/critical findings across the root, foundation, and current Integrated Suite dependency sets; moderate findings are reported. `pip-audit` covers quality dependencies.
8. `quality/dependency-audit-coverage.json` and `quality/scripts/dependency_change_gate.py` require every changed dependency manifest or lockfile to map to an audit job and require npm dependency changes to update their lockfile.
9. GitHub's official Dependency Review action is not retained because the repository Dependency Graph is disabled. Retaining it would create a permanently failing check or require Eddie to change repository settings. The repository-controlled change gate plus existing audits provide deterministic no-setup coverage.
10. Gitleaks scans pull-request changes and repository history where the event supports it. Allowlists and historical suppressions remain exact and documented.
11. Actionlint is checksum-pinned and blocks invalid workflow YAML, contexts, expressions, runner configuration, and shell constructs. Zizmor reports workflow-security findings, while high-risk triggers, permissions, and direct event-to-shell interpolation are independently blocked.
12. CodeQL scans JavaScript/TypeScript and Python on pull requests, pushes to `main`, and a weekly schedule.
13. Existing release-generated SPDX SBOM and SHA-256 outputs remain the approved ecosystem-native supply-chain artifacts. No signing key infrastructure is introduced.
14. No check uploads source documents, project content, or engagement data. Only synthetic reports, failure diagnostics, generated test artifacts, and current deterministic release candidates are uploaded.

## Consequences

### Positive

- one stable local command surface and policy record;
- clearer blocking/advisory expectations for agents and reviewers;
- better secret, dependency, workflow, file-boundary, and package coverage;
- dependency changes cannot silently introduce an unaudited package manager or omit required lockfile updates;
- workflow syntax/context defects fail before runtime execution;
- reuse of proven release tests instead of duplicated or contradictory harnesses;
- no paid service, external dashboard, new account, repository setting, cloud backend, telemetry, or runtime dependency;
- future releases can adopt the baseline without weakening stricter release-specific gates.

### Costs

- additional CI time, especially browser and scheduled deep jobs;
- legacy workflow pinning debt remains visible until separately reconciled;
- static semantic and privacy patterns require periodic false-positive review;
- property and fuzz oracles must evolve when production parser limits or supported schemas change;
- dependency license compatibility remains a manual review until a deliberate repository license policy is approved;
- full future workflow coverage cannot exist before Practice Review, integrated SSP, and Deliverables authorities are implemented.

## Rejected alternatives

### Replace release-specific tests with one generic suite

Rejected because versioned modules encode validated behavior, contract authority, exact release identities, and platform-specific checks that a generic suite would lose.

### Add a hosted security or test dashboard

Rejected because it would require accounts, introduce cost/privacy dependencies, and conflict with the repository's GitHub-native/no-new-account constraint.

### Retain GitHub Dependency Review while Dependency Graph is disabled

Rejected because the action fails before evaluating dependencies. Enabling a repository setting would violate the no-manual-setup objective. The repository-controlled change gate and blocking audits provide enforceable coverage without that dependency.

### Add another broad scanner such as Trivy or Semgrep

Rejected for this baseline because CodeQL, npm/pip audits, Gitleaks, Zizmor, Actionlint, archive/file-boundary tests, and offline checks already cover the material risk classes. Another broad scanner would primarily add duplicate findings and triage burden rather than a distinct security property.

### Make every new scanner finding blocking immediately

Rejected because legacy action-tag and runner-sensitive performance debt would create unreviewed blanket exceptions or disable useful reporting. Only clearly defined high-risk classes block initially.

### Add signing keys

Rejected because the repository has no approved signing process and Eddie should not need to manage keys. SBOMs and checksums are retained without unsupported signing claims.

## Review and retirement

Review this ADR whenever the current Integrated Suite release changes authority, supported import types, archive limits, dependency ecosystems, packaging format, runtime host, production-data authorization, or CI platform. Retire an exception only through a reviewed repository change with passing exact-head validation.
