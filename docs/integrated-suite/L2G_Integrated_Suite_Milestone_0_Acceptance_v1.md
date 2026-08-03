# L2G Integrated Suite Milestone 0 — Foundation Acceptance v1

## Status

Proposed smallest safe implementation milestone.

Milestone 0 creates the integrated foundation only. It does not migrate production Evidence, Scope, Workshop, SSP, or Deliverables behavior.

## Objective

Demonstrate that the monorepo can produce one secure, accessible, local, offline, no-install TypeScript application with a valid `.l2g` project lifecycle, domain boundaries, review-transition foundation, and deterministic single-file build while leaving every existing standalone module and contract unchanged.

## Preconditions

- PRs #112 and #113 are merged, rejected, or explicitly deferred.
- Issue #101 has a recorded disposition.
- The exact implementation baseline commit is recorded.
- Repository visibility has been reviewed.
- The planning decisions required for framework, browser support, and encryption posture are recorded at least as explicit provisional ADRs.

## Included scope

### Repository and build foundation

- TypeScript workspace.
- Package boundaries for shell, project format, store, history, recovery, compatibility, security, validation, and initial domains.
- Deterministic generated single-file HTML.
- Dependency lock.
- Release SHA-256 manifest.
- SBOM generation.

### Application shell

- Compact top bar.
- Collapsible left navigation.
- Central workspace.
- Collapsible right inspector.
- Overview, Pre-Engagement, Evidence, Scope, Practice Review, SSP, Deliverables, and Reviews & Actions shell routes.
- Advisor, Client, and Reviewer presentation profiles.
- Profile qualification stating that offline profiles are not security roles.

### Project lifecycle

- New project.
- Open `.l2g` project.
- Validate before mutation.
- Save.
- Save As.
- Browser-local recovery.
- Verified project backup.
- Integrity manifest.
- Deterministic project round trip where applicable.

### Initial domain records

Only low-authority foundation records:

- engagement identity;
- engagement objectives;
- participants;
- phase;
- safe preferences;
- review-transition examples;
- audit and history records.

### Commands and history

- project command interface;
- Undo;
- Redo;
- disabled-state behavior;
- history panel;
- named checkpoints;
- restoration event.

### Compatibility foundation

- read-only loading of current contract-registry metadata;
- multi-part contract identity;
- immutable compatibility snapshot structure;
- no legacy contract import or export behavior beyond synthetic foundation fixtures.

### Security foundation

- Content Security Policy with `connect-src 'none'`;
- no remote scripts, styles, fonts, images, frames, objects, forms, telemetry, analytics, or APIs;
- imported text sanitization;
- duplicate-path rejection;
- path-traversal rejection;
- duplicate JSON-key rejection for governed JSON;
- entry-count, expanded-size, recursion, and decompression-ratio limits;
- inert rendering of script-like strings.

## Explicit exclusions

- production document parsing;
- OCR;
- original-evidence embedding;
- DocConverter migration;
- Scoper migration;
- Workshop migration;
- SSP migration;
- Builder/Merger migration;
- workbook generation;
- DOCX or PPTX generation;
- production legacy-package conversion;
- client/CUI production-use approval;
- repository visibility change unless separately approved;
- existing module pointer changes;
- registry promotion;
- historical snapshot modification;
- standalone module retirement;
- compliance, readiness, scoring, certification, Met/Not Met, or evidence-sufficiency calculations.

## Functional acceptance criteria

### Portable runtime

- [ ] Exactly one generated HTML application is produced.
- [ ] It opens from an extracted local folder using `file://` in supported Windows Chromium.
- [ ] No installer, local server, administrator rights, executable, extension, Python, Node.js, or PowerShell is required for normal use.
- [ ] It makes zero unexpected network requests.
- [ ] Startup errors and unexpected console errors are zero.

### Project round trip

- [ ] A synthetic project can be created.
- [ ] Engagement identity and participants can be edited.
- [ ] The project can be saved as `.l2g`.
- [ ] The saved project can be closed and reopened.
- [ ] All governed test values, stable IDs, history, and integrity records survive.
- [ ] A second save does not introduce duplicate records.
- [ ] Invalid or tampered projects fail before governed-state mutation.

### Save and recovery truthfulness

- [ ] UI distinguishes browser recovery, project-file save, backup generation, and download initiation.
- [ ] Browser-local autosave never claims that a portable project file was written.
- [ ] A recovery checkpoint can restore a simulated interrupted session.
- [ ] Restoration appends history rather than erasing prior history.

### Undo and Redo

- [ ] Meaningful engagement edits are undoable and redoable.
- [ ] Disabled states appear when no action is available.
- [ ] Undo and Redo do not perform browser navigation.
- [ ] Invalid cross-domain state cannot be produced.
- [ ] Import or migration boundaries use checkpoints instead of unsafe granular undo.

### Profiles and shell

- [ ] All eight primary workspaces are reachable.
- [ ] Left rail collapses with accessible labels.
- [ ] Inspector collapses, opens from context, and can be pinned.
- [ ] Advisor, Client, and Reviewer presentations hide and emphasize the intended shell content.
- [ ] The application clearly states that profiles are not security roles.
- [ ] Client-safe export is represented as a future governed output, not the complete project.

### Accessibility

- [ ] Automated axe-core gate passes at the agreed severity threshold.
- [ ] All icon controls have accessible names.
- [ ] Keyboard navigation covers shell, menus, inspector, project dialogs, and history.
- [ ] Focus is restored after dialogs and inspector actions.
- [ ] State is not communicated by color alone.
- [ ] Light and dark modes remain readable.

### Security and archive handling

- [ ] CSP is present and verified.
- [ ] `connect-src 'none'` is verified.
- [ ] External runtime dependencies are zero.
- [ ] Traversal paths are rejected.
- [ ] Duplicate archive paths are rejected.
- [ ] Duplicate governed JSON keys are rejected.
- [ ] Oversized entry, total expanded size, and decompression-ratio fixtures are blocked.
- [ ] Recursive-container limits are enforced.
- [ ] Imported HTML, SVG, XML, filenames, and script-like strings render inertly.

### Determinism and release engineering

- [ ] Clean repeated builds produce the expected deterministic identity or document every intentionally variable field.
- [ ] A SHA-256 release manifest is generated.
- [ ] An SBOM is generated.
- [ ] Dependency locks are committed.
- [ ] Synthetic fixtures only are present.
- [ ] No client data, CUI, local paths, secrets, or environment-specific values appear in source, logs, screenshots, or CI artifacts.

### Legacy non-regression

- [ ] Existing current module pointers are byte-for-byte unchanged.
- [ ] Existing contract registry is unchanged except for a separately approved read-only integrated compatibility registration, if any.
- [ ] Historical suite snapshots are unchanged.
- [ ] Existing standalone validation and Playwright jobs continue to pass.
- [ ] The integrated build is additive and does not replace current standalone distribution.

## Required automated tests

- unit tests for foundation schemas;
- `.l2g` open/save round trip;
- malformed ZIP and JSON cases;
- integrity-manifest tampering;
- duplicate-path and traversal cases;
- Undo, Redo, and checkpoint restoration;
- presentation-profile tests;
- shell keyboard and focus tests;
- axe-core accessibility;
- light and dark visual regression;
- native Windows Chromium `file://` smoke;
- zero-network test;
- deterministic build test;
- current standalone module regression.

## Deliverables

- architecture ADRs;
- TypeScript workspace and package graph;
- generated foundation HTML;
- foundation `.l2g` schema set;
- synthetic project fixtures;
- test and CI additions;
- security and CSP report;
- deterministic build and SHA manifest report;
- SBOM;
- Milestone 0 validation report;
- draft pull request, unmerged until independent review.

## Exit decision

Milestone 0 may be promoted only when every required criterion is green on the exact final head and the change remains additive.

Passing Milestone 0 authorizes planning of the first bounded workflow migration. It does not automatically authorize Evidence, Scope, Workshop, SSP, or Deliverables migration.
