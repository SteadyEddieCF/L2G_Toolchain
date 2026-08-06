# L2G Automated Quality and Security Baseline v1

## Purpose

Provide one repository-controlled, agent-maintainable baseline for functional reliability, regression prevention, file-processing safety, data integrity, privacy, offline behavior, application security, dependency and secret security, workflow security, import/export compatibility, and release reproducibility.

This baseline wraps and classifies existing validation. It does not replace validated release-specific tests or introduce a new runtime architecture.

## Current governed scope

- current Integrated Suite release: v0.6.0;
- current runtime: one generated local HTML file;
- current canonical Integrated authorities: Engagement, Evidence, Pre-Engagement, Interview Sessions, and Scope;
- current stable standalone products: Control Center v0.3.4, DocConverter-L2G v7.9.5.1, Scoper v3.12, Workshop v79.1, Builder/Merger v3.10.1, and SSP v1.9.17;
- current data boundary: synthetic-only; production/client/FCI/CUI use is not authorized;
- future integrated Practice Review runtime, SSP authority, and Deliverables authority are not simulated by this baseline.

## Automated checks

### Build, unit, domain, migration, and deterministic validation

The current release uses locked TypeScript dependencies and its existing typecheck, build, schema/manifest validation, domain tests, migration/encryption/recovery/Undo/Redo tests, bounded scale tests, public hygiene, and deterministic-build checks. The baseline adds common archive/JSON/CSV/filename/signature unit and property tests.

### Browser workflows, accessibility, and visuals

Playwright continues to test representative current workflows, profile filtering, import preview/apply, save/open/recovery behavior supplied by current release tests, responsive desktop/tablet targets, native Windows `file://` operation, and zero unexpected network requests. Axe-core blocks serious and critical findings on governed representative flows. Focused screenshot baselines remain reviewed rather than expanding to every state.

The quality-browser workflow validates the actual current Integrated Suite artifact on Linux and native Windows. The repository's existing Playwright QA workflow remains authoritative for materializing and validating registered standalone module routes and reviewed screenshot comparisons, including expected/actual/diff artifacts. This avoids duplicated materialization logic and does not auto-accept visual changes.

Automation does not replace manual keyboard, screen-reader, contrast, responsive-layout, or facilitated-workflow review.

### HTML and semantic validation

A deterministic standard-library parser checks generated packaged HTML for duplicate IDs, broken label targets, broken ARIA ID references, static dialog naming, control naming, and landmark structure. Broken identifiers/references block; dynamic-name and landmark observations are advisory pending rendered-browser confirmation.

### Offline and no-network guarantees

The packaged current release must retain restrictive `default-src 'none'` and `connect-src 'none'`, no active remote script/style/font/image/frame/media dependency, no recognized telemetry endpoint, and zero unexpected browser requests. Static network API tokens are advisory because unreachable code may remain for user-initiated local operations; any observed runtime request is blocking.

No generated deliverable may include hidden tracking resources. External links must be explicit user actions and may not include engagement content.

### File and archive safety

The common test oracles cover malformed, empty, truncated, invalid-encoding, misleading-extension, Unicode-name, duplicate-key, prototype-key, formula, path, symlink, macro, external-link, size, count, depth, ratio, and signature cases. Existing release-specific application parsers remain responsible for enforcing their stricter production limits and atomic non-mutation behavior.

Supported standalone DocConverter types remain PDF, DOCX, XLSX, CSV, TXT, Markdown, JSON, images, and evidence bundles as documented by that module. The current Integrated Suite does not silently gain direct Office/PDF parsing through this baseline.

### CSV and spreadsheet safety

User-controlled values beginning with `=`, `+`, `-`, or `@` are neutralized as text before CSV/spreadsheet export. Tests verify deterministic export and reviewed round trips. Existing workbook generation and formula preservation tests remain authoritative for intended formulas.

### Contracts and data integrity

The current pointer, schema identities, projection identity continuity, contract registry, unique kind/version routes, release schemas, current and prior migration fixtures, and existing route round trips remain validated. Unknown future versions, invalid enums/identifiers, duplicate identities, broken refs, unsupported fields requiring authority, and silent discard must fail closed or require explicit reviewed migration.

Save/reload and export/import tests remain responsible for stable IDs, referential integrity, provenance, timestamps, source relationships, accepted decisions, evidence links, candidate receipts, and non-mutation of source domains.

### Property and fuzz testing

Hypothesis runs deterministic bounded examples on pull requests for parsers and boundary primitives. A weekly scheduled profile increases examples, rebuilds the current Integrated Suite, reruns its browser regression, and retains report/failure artifacts. A failure seed becomes a committed fixture only after it is rewritten as synthetic and documented.

### Static security, dependencies, secrets, and workflows

- CodeQL scans JavaScript/TypeScript and Python on PRs, pushes to `main`, and weekly.
- Dependabot monitors root/current npm, quality Python, and GitHub Actions dependencies; updates are grouped, never auto-merged.
- GitHub Dependency Review evaluates only dependencies introduced or changed by a pull request, blocks high/critical vulnerabilities in runtime, development, and unknown scopes, and displays patched-version and OpenSSF Scorecard context.
- Dependency Review license blocking is intentionally disabled until the repository approves an explicit license policy; license changes remain a human review item.
- `npm audit` blocks high/critical findings and reports moderate findings across the current checked dependency sets.
- `pip-audit` scans the exact quality dependency file.
- Actionlint is downloaded from its release, verified by SHA-256, and blocks invalid workflow YAML, contexts, expressions, runner configuration, and shell constructs before those defects reach GitHub execution.
- Gitleaks scans repository content and history available to the event; allowlists and historical fingerprint exceptions are exact and documented.
- Zizmor reports workflow-security findings; `pull_request_target`, `write-all`, and direct event-to-shell interpolation block independently.
- New workflows use immutable action commit pins, disabled persisted checkout credentials, and least-privilege permissions.

Actionlint and Dependency Review provide distinct coverage. Additional broad scanners such as Trivy, Semgrep, or a second secret scanner are not part of the baseline because they would largely duplicate CodeQL, dependency audits, Gitleaks, Zizmor, and the repository's deterministic file-boundary checks while adding substantial triage noise.

### Release artifacts and supply chain

The actual current release artifact is built from a fresh checkout, tested, packaged, and checked for required files, manifest SHA identity, SPDX 2.3 SBOM shape, checksum targets, version metadata, package size, offline CSP, and launch behavior. The existing deterministic SPDX generator is the approved ecosystem-native SBOM mechanism. No signing keys are introduced.

## GitHub Actions organization

- `quality-build.yml`: current locked build, unit/property/file/contract/privacy/offline/HTML/package validation and reports;
- `quality-browser.yml`: current Integrated Suite browser workflows, axe-core, and native Windows file-origin smoke with reports;
- existing `Playwright QA`: governed standalone materialization, file-origin checks, accessibility, and reviewed screenshot comparison/diff artifacts;
- `security-validation.yml`: npm/pip audits, checksum-pinned Actionlint, Gitleaks, Zizmor, deterministic workflow rules, and privacy scan;
- `dependency-review.yml`: pull-request-only review of newly introduced vulnerable dependencies;
- `codeql.yml`: supported-language CodeQL analysis;
- `quality-scheduled-deep.yml`: weekly larger property/fuzz profile plus a self-contained current Integrated Suite build and browser regression;
- existing release-specific workflows remain intact and authoritative.

## Blocking versus advisory

The exact machine-readable classification is `quality/baseline.json`. Blocking failures stop promotion. Advisory findings require explicit review in the PR and cannot be silently ignored. Accepted exceptions are recorded separately and narrowly.

## Reports and artifacts

- static JSON reports: `quality-reports/`;
- Actionlint text report and Zizmor JSON report: workflow-security artifact;
- Dependency Review findings: workflow log and job summary;
- Playwright HTML/JSON, traces, screenshots, videos, and diffs: `test-results/`;
- release candidate: `apps/integrated-suite-v0.6/dist/`;
- CI uploads reports, deterministic package outputs, SBOM, checksum list, and failure seeds as workflow artifacts;
- artifacts must remain synthetic and must not include decrypted projects, imported documents, local private paths, or engagement content.

## Local commands

Root `package.json` retains stable existing commands and adds:

- `test`, `test:unit`, `test:e2e`, `test:a11y`, `test:files`, `test:contracts`, `test:offline`, `test:fuzz`;
- existing `test:visual` and `test:file` remain unchanged;
- `check:html`, `check:security`, `check:privacy`, `check:package`, `check:all`.

The current release must be built before artifact-specific static checks. Commands that target generated standalone runtimes require their documented materialization sequence; the existing Playwright QA workflow owns that CI setup. CI performs current Integrated Suite build steps automatically.

Agents with Actionlint already installed may run `actionlint` from the repository root. CI downloads version 1.7.12 and verifies the Linux AMD64 archive against the recorded SHA-256, so Eddie does not need to install or maintain it locally. Dependency Review is inherently pull-request based and runs automatically.

## False positives and exceptions

Do not add broad path exclusions for fixtures, generated evidence, or test data. Confirm whether the value is synthetic, reduce the pattern or allowlist to the exact value/path or fingerprint, document impact and review conditions, and retain scanner evidence. Dependency exceptions require package, advisory, impact, reason, scope, review condition, and expiration where practical.

## Residual manual tests

Automation does not replace:

- facilitated-workflow review;
- subject-matter and CMMC interpretation;
- client-specific data review;
- manual keyboard and screen-reader testing;
- visual inspection of representative light/dark/responsive/import/review/editing states;
- review of license compatibility for newly introduced dependencies until an approved automated license policy exists;
- final deliverable review;
- human approval of scope, evidence, findings, recommendations, actions, SSP content, or conclusions;
- an explicit production/client/FCI/CUI authorization decision.
