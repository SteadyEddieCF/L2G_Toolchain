# Security Policy

## System and Scope

This policy covers the public `L2G_Toolchain` monorepo, the current L2G Integrated Suite, independently versioned standalone L2G modules, package contracts, deterministic build and release tooling, synthetic fixtures, and GitHub Actions.

The normal product runtime is local, offline, no-install, no-telemetry, and has no runtime network dependency. It processes potentially sensitive assessment material in intended future use, but the repository and current Integrated Suite release remain synthetic-only and are not authorized for production, client, FCI, or CUI data.

Security-sensitive paths include:

- `apps/integrated-suite*/` for project encryption, persistence, migration, import/export, schemas, and portable builds;
- `modules/` for independently distributed local applications;
- `contracts/` and `suite/` for package identities and compatibility authority;
- `fixtures/`, `tests/`, and `validation/` for synthetic regression inputs and evidence;
- `quality/` for repository-wide security and quality policy oracles;
- `.github/workflows/` for CI permissions, supply chain, artifacts, and secret exposure;
- release manifests, SBOMs, checksums, generated portable artifacts, and validation reports.

## Threat Model and Trust Boundaries

Treat all imported files, package bytes, archive entries, filenames, JSON values, workbook cells, document content, source-derived candidates, and compatibility packages as attacker-controlled until bounded validation succeeds.

Important trust boundaries are:

1. locked versus unlocked encrypted project content;
2. local runtime source versus imported package or client file;
3. source-domain context versus target-domain authority;
4. Advisor/Reviewer content versus Client projection;
5. browser recovery versus portable project state;
6. original evidence bytes versus reference metadata and bounded derived records;
7. repository/CI/log/artifact surfaces versus engagement data;
8. trusted workflow code versus pull-request-controlled input and dependencies;
9. source checkout versus deterministic release artifact;
10. current supported contract versions versus unknown future or malformed versions.

Presentation profiles are not access control. Local actor labels and confirmations are not authenticated identity or digital signatures. Encryption at rest does not by itself authorize production-sensitive use.

## Security Invariants

The following properties must hold:

- normal workflows perform no external request, telemetry, analytics, CDN load, model call, OCR SaaS call, or hidden upload;
- imported client or engagement content is never transmitted;
- required scripts, styles, fonts, icons, and schemas are packaged locally;
- restrictive CSP includes `default-src 'none'` and `connect-src 'none'` for the portable Integrated Suite;
- imported content is rendered inert and cannot execute HTML, script, SVG event handlers, formulas, macros, or external relationships;
- archives reject traversal, absolute/drive paths, symlinks, duplicate normalized paths, case collisions, excessive counts/sizes/ratios/depth, nested recursion beyond release limits, and unsupported compression before extraction or mutation;
- governed JSON rejects duplicate keys, prototype-pollution keys, invalid encodings, non-finite numbers, malformed structure, unknown unsupported versions, broken references, and invalid identifiers;
- spreadsheet exports neutralize user-controlled values beginning with `=`, `+`, `-`, or `@` and preserve reviewed round-trip semantics;
- imports, migrations, reconciliations, and authority transitions are preview-first, validated, atomic, and non-mutating on failure;
- one domain cannot silently mutate another domain's accepted records;
- source traceability, stable identifiers, provenance, versions, references, and history survive save/reopen/export/reimport;
- Client projections are built before counts, search, render, inspector, differences, history, focus, live regions, export, and accessibility-tree construction;
- no real client, FCI, CUI, PHI, credentials, private paths, assessment evidence, or restricted material enters repository history, Issues, PRs, Actions logs, screenshots, artifacts, or Releases;
- release builds use locked dependencies, deterministic scripts, manifests, SPDX SBOMs, checksums, and actual-artifact browser validation;
- GitHub Actions use least privilege, avoid unsafe pull-request triggers and shell interpolation, and pin newly added third-party actions to immutable commits;
- stable standalone contracts and current release pointers do not change without migration, exact-head validation, and review.

## Reportable Findings and Severity Context

Report security issues that realistically violate an invariant or expose a governed boundary. Examples include:

- any path that sends imported or engagement data off-device;
- CSP bypass, active imported content, XSS, macro/formula execution, or unsafe external relationship handling;
- archive traversal, zip bomb, decompression-limit bypass, symlink escape, or partial extraction outside the processing boundary;
- project decryption, authentication-tag, passphrase, recovery, integrity, migration, or non-mutation failures;
- cross-domain authority escalation, Client-projection disclosure, or loss of source traceability;
- arbitrary file read/write, code execution, credential exposure, workflow injection, or unsafe fork checkout;
- secrets or real sensitive client material committed or exposed through CI;
- deterministic release identity, SBOM, checksum, or package-manifest tampering;
- unsupported package versions accepted with silent data loss or mutation.

Severity depends on reachability, whether imported or unlocked sensitive data is exposed or corrupted, whether authority changes silently, persistence across saved projects/releases, and whether the issue affects the current promoted artifact or only development tooling.

## Out of Scope, Exclusions, and Accepted Risk

The following are not security findings by themselves:

- unsupported claims that the current synthetic-only release is suitable for real client, FCI, or CUI use;
- absence of authenticated multi-user identity, cloud collaboration, digital signatures, escrow, or password recovery, which are explicitly outside the current architecture;
- CMMC interpretation, evidence sufficiency, readiness, compliance, certification, risk, scoring, and formal assessment conclusions, which require human subject-matter authority and are not automated product claims;
- presentation-profile access control, because profiles are explicitly non-security views;
- advisory static accessibility or performance findings that do not expose hidden data or break a documented blocking budget;
- historical immutable release sources that retain legacy workflow action tags, provided newly added workflows are pinned and Zizmor/custom workflow reports remain reviewed under the documented exception.

Exceptions must be narrow, documented in `docs/quality/L2G_Automated_Quality_Accepted_Exceptions_v1.md`, include impact and review conditions, and must not broadly suppress fixture, secret, or client-data scanning.

## Known Limitations and Compensating Controls

- The current release is synthetic-only and not authorized for production/client/FCI/CUI use. Encryption and automated tests are necessary but not sufficient to change that decision.
- Browser security and file-origin behavior vary. Linux HTTP and native Windows Chromium `file://` validation are both retained.
- Static HTML checks cannot prove runtime focus, keyboard, contrast, or screen-reader quality. Playwright/axe and residual manual accessibility review compensate.
- Property-based tests use bounded deterministic profiles in pull requests; scheduled runs increase examples and retain failure seeds.
- Zizmor may report legacy action-tag findings. New workflows are commit-pinned; the remaining repository debt is reported, not silently allowlisted.
- Gitleaks and pattern scans can miss novel secrets or misclassify synthetic adversarial strings. Exact synthetic values are documented, review remains required, and broad fixture exclusions are prohibited.
- The repository baseline does not replace each module's release-specific limits and tests. Stricter production limits always prevail.

## Reporting

Do not post suspected secrets, client data, decrypted project content, or exploit payloads in a public Issue or pull request. Use GitHub's private vulnerability reporting or the repository owner's approved private channel. Include the affected release/commit, boundary violated, a minimal synthetic reproducer, and observed impact without including real engagement material.
