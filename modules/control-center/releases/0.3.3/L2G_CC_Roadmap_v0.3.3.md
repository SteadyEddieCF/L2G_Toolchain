# L2G Control Center Roadmap v0.3.3

**Roadmap owner:** L2G Control Center  
**Roadmap artifact:** `L2G_CC_Roadmap_v0.3.3.md`  
**Current release:** v0.3.3  
**Status date:** July 20, 2026

## Roadmap governance

This roadmap preserves the committed v0.2–v0.5 sequence from the original Control Center development handoff and maintains a rolling 10-release forward view. It must remain included, versioned, and updated in every future L2G Control Center release package.

Status labels are strict:

- **Complete:** delivered in a released package.
- **Committed:** approved scope inherited from the original handoff.
- **Suggested — not committed:** product ideas proposed to fill the unplanned roadmap; they may be changed, reordered, combined, or rejected.
- **Longer-term concept:** exploratory work outside the rolling 10-release window.

## Completed releases

### v0.2 — Release and manifest governance — COMPLETE

Release lifecycle, compatibility rules, manifest comparison, drift warnings, suite evidence, and persistent roadmap governance.

### v0.3 — Local observability — COMPLETE

Opt-in metadata-only history, canonical fingerprints, duplicate warnings, explicit successful-handoff confirmation, and advisory expected-output checks.

### v0.3.1 — Stage 5 SSP synchronization — COMPLETE

SSP v1.7 Stage 5 registration, Workshop v71 baseline, stable Workshop → SSP and SSP → Workshop contracts, optional read-only SSP audit observability, and preservation of all prior routes.

### v0.3.2 — Independent-review closure and evidence hardening — COMPLETE

- Closed CC-F04 by replacing raw persisted filenames with fingerprint-based package labels while retaining the selected filename only in the active in-memory inspector.
- Closed CC-F06 by attaching and hashing the authoritative Workshop v71 compatibility manifest, release manifest, regression evidence, release report, contract reference, and genuine Stage 5 round-trip artifacts.
- Closed CC-F07 with live-browser captures of all six primary pages in both themes plus `review_required` and `unsupported_version` inspector states.
- Added bounded free-text metadata handling and an advisory warning for unparseable generation timestamps.
- Confirmed that `l2g_ssp_round_trip_audit_v1` remains intentionally limited to authoritative version 0.1.
- Preserved all package routes, Stage 5 authority boundaries, opt-in metadata-only observability, and the v0.4/v0.5 commitments.

### v0.3.3 — Current-suite baseline synchronization — COMPLETE

- Updated expected module evidence to DocConverter-L2G v7.9.5, Scoper v3.11, Workshop v76, Builder/Merger v3.8, and SSP v1.7.
- Preserved SSP as Stage 5, the Workshop ↔ Builder/Merger loop, and all existing stable package routes.
- Added optional read-only recognition for Workshop v76 observability and responsibility overlay, pack, and reconciliation artifacts.
- Kept generator-version drift separate from package-contract compatibility.
- Preserved filename redaction, metadata-only persistence, offline operation, no telemetry, no write-back, and all authority safeguards.
- Validated Control Center against current supplied artifacts without claiming a full six-module end-to-end suite validation.
- Kept v0.4 as the next committed feature release.

## Next release — detailed committed scope

### v0.4 — Read-only action and blocker overview — COMMITTED

Purpose: consume the Workshop’s read-only action-summary export and give an operator a concise suite-level view of follow-up pressure without creating a second action system.

Planned capabilities:

- Recognize and locally inspect `l2g_workshop_action_summary_v1`.
- Validate package identity, version, generator, trust labels, and snapshot age before displaying summary data.
- Show overdue evidence, provider holds, unresolved scope questions, workbook blockers, owner/status distribution, and top-level action counts.
- Route all edits, closures, assignments, and narrative changes back to Workshop.
- Support stale-snapshot, unsupported-version, duplicate-fingerprint, and malformed-summary warnings.
- Keep actively viewed summary content in memory only; persist metadata and approved safe counters only when observability is enabled.
- Preserve the Stage 5 Workshop → SSP → Workshop route and optional read-only SSP audit observability.
- Retain the v0.3.3 baseline-sync, filename-redaction, attached-evidence, and full-page browser-QA standards.

Acceptance boundaries:

- Workshop remains authoritative.
- Control Center cannot edit, close, assign, or write back actions.
- No automatic final scope, Met/Not Met, evidence-sufficiency, readiness, score, certification, or provider-responsibility conclusions.
- Offline operation, no telemetry, no remote dependencies.
- Light/dark, keyboard, static-security, live-browser, privacy, and regression coverage.
- Persistent roadmap updated with a fresh rolling 10-release forward window.

## Rolling 10-release forward roadmap

### v0.4 — Read-only action and blocker overview — COMMITTED

See the detailed scope above.

### v0.5 — Packaged local suite prototype — COMMITTED

- PowerShell-based installer/launcher or another lightweight Windows desktop shell;
- governed install folder and shortcuts;
- module hash and manifest validation;
- stable browser origins/workspace behavior;
- approved local updates and rollback; and
- fully offline operation.

### v0.6 — Engagement package-set completeness — SUGGESTED, NOT COMMITTED

Metadata-only expected-package grouping with missing, duplicate, stale, and out-of-sequence indicators.

### v0.7 — Release bundle verification hardening — SUGGESTED, NOT COMMITTED

Approved-bundle index, checksum/signature status, provenance report, and safer update eligibility checks.

### v0.8 — Recovery and diagnostics center — SUGGESTED, NOT COMMITTED

Local backup health, workspace recovery guidance, configuration repair, browser-origin diagnostics, and redacted support bundles.

### v0.9 — Cross-tool contract test harness — SUGGESTED, NOT COMMITTED

Offline fixture runner for stable contracts, additive-field tolerance, and round-trip identity checks.

### v1.0 — Stable suite-management milestone — SUGGESTED, NOT COMMITTED

Consolidate proven governance, observability, packaging, recovery, and contract-test capabilities into a supported baseline.

### v1.1 — Role-focused operator views — SUGGESTED, NOT COMMITTED

Local view presets for analyst, scoping advisor, facilitator, workbook reviewer, and SSP reviewer without authentication claims.

### v1.2 — Read-only deliverable index — SUGGESTED, NOT COMMITTED

Metadata-only register of generated reports, workbooks, SSP artifacts, packages, and release evidence.

### v1.3 — Governed organization profiles — SUGGESTED, NOT COMMITTED

Optional local policy/configuration overlays without modifying assessment logic or package meaning.

## Longer-term concepts outside the 10-release window — NOT COMMITTED

- Optional organization-level cloud dashboard with explicit governance and data minimization.
- Alternative desktop shell beyond PowerShell only if offline operation, stable origins, independent releases, and rollback remain intact.
- Fleet-level approved release reporting limited to module/release metadata, never engagement content or assessment conclusions.

## Boundaries that continue across the roadmap

- The Control Center remains a thin local/offline coordination layer, not a sixth assessment engine.
- No telemetry, cloud upload, API keys, or remote runtime dependencies.
- No automatic final scope, Met/Not Met, evidence sufficiency, readiness, scoring, certification, or provider-responsibility conclusions.
- No duplicated module domain logic, SSP authoring surface, or second authoritative action database.
- Package contracts remain governed by kind/version and bounded routing metadata, not filenames alone.
- Observability persists metadata only, uses redacted package labels, remains opt-in, and retains at most 100 events.
