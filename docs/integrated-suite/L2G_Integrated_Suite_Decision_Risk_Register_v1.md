# L2G Integrated Suite Decision and Risk Register v1

## Status

Initial planning register with post-assessment reconciliation through 2026-08-03. Decisions marked `Proposed` require explicit review before implementation. Risks remain open until evidence of closure is recorded.

## Decision register

| ID | Decision | Status | Required before | Notes |
|---|---|---|---|---|
| D-001 | Evolve the existing `SteadyEddieCF/L2G_Toolchain` monorepo rather than create a replacement repository | Proposed | Milestone 0 | No demonstrated technical constraint requires replacement |
| D-002 | Use a TypeScript modular monolith with one generated portable HTML runtime | Proposed | TypeScript workspace creation | One deployment artifact must retain strict internal domain boundaries |
| D-003 | Use one ZIP-based `.l2g` engagement project with modular domain documents | Proposed | Project-format implementation | Field-level schemas remain unfrozen |
| D-004 | Use read-only cross-domain projections and explicit reviewed transition proposals | Proposed | Reviews & Actions implementation | Automatic visibility must not transfer authority |
| D-005 | Use a command journal plus named checkpoints for initial Undo, Redo, history, and restoration | Proposed | Project-store implementation | Avoid unrestricted event sourcing in the first milestone |
| D-006 | Keep standalone module builds and legacy package contracts throughout migration | Proposed | First migration adapter | Every retirement requires a separate decision |
| D-007 | Preserve reference-only evidence by default | Proposed | Evidence domain implementation | Extracted data and provenance remain in project; originals are reselected and matched by hash |
| D-008 | Keep Single-System as the default SSP experience and portfolio mode Advanced | Proposed | SSP migration | Existing SSP posture is preserved |
| D-009 | Treat Advisor, Client, and Reviewer as presentation and workflow profiles in the offline edition, not security roles | Proposed | Shell implementation | External distribution uses curated exports |
| D-010 | Separate package wire version, schema identity, contract release, stability, producer, and consumer | Proposed | Compatibility package | Required to represent Workbook Handoff correctly |
| D-011 | Freeze the first implementation baseline only after the promoted Workshop v79.1 and Builder/Merger v3.10.1 releases pass the complete issue #101 merged-main validation and receive an explicit registry/snapshot disposition | Partially satisfied | Baseline freeze | PRs #112 and #113 are merged; issue #101 is active in draft PR #118 |
| D-012 | Determine project encryption through a dedicated security ADR before production-CUI suitability is claimed | Proposed | Production project use | Extracted text may contain CUI even without original files |

## Unresolved architecture questions

### A-001 — Component framework and SPFx compatibility

Select the UI framework only after confirming the supported SharePoint Framework target and dependency compatibility. React-compatible architecture is the current preference, not a frozen decision.

### A-002 — Supported browsers

Decide whether the portable edition is Chromium-only or must support Firefox and Safari. File System Access, download verification, worker behavior, memory limits, and local-file restrictions differ.

### A-003 — Project encryption

Decide:

- mandatory or optional encryption;
- AES-GCM envelope design;
- passphrase derivation;
- recovery limitations;
- metadata exposure;
- compatibility with the standalone and SPFx hosts.

### A-004 — Project save implementation

Determine the supported save paths for:

- browsers with File System Access APIs;
- fallback download-based browsers;
- fingerprint verification after save;
- safe Save versus Save As behavior.

### A-005 — Stable identifiers

Define ID generation and preservation for integrated records, legacy imports, copied projects, merges, and migrations.

### A-006 — Search persistence

Decide whether the search index is rebuilt on project open, persisted inside `.l2g`, or cached only in IndexedDB.

### A-007 — Extracted preview representation

Decide when previews are stored as plain text, structured JSON, sanitized HTML, or generated thumbnails.

### A-008 — Deterministic ZIP behavior

Define path ordering, timestamps, compression settings, normalization, and hash semantics for deterministic builds and project integrity.

## Risk register

| ID | Risk | Status | Impact | Initial treatment | Closure evidence |
|---|---|---|---|---|---|
| R-001 | GitHub currently reports the repository visibility as `public`, while prior planning described a private monorepo | Open — verified | Potential disclosure of source, fixtures, generated artifacts, or future client/CUI material | Confirm intent; review history, Actions artifacts, Releases, screenshots, and branch content; change visibility if appropriate | Repository-setting decision and completed exposure review |
| R-002 | The correction stack was moving while the integrated baseline was being planned | Mitigated — final validation pending | Integrated adapters could be built against an unqualified contract boundary | Workshop v79.1 and Builder/Merger v3.10.1 are merged; complete issue #101 on current merged main before freezing Milestone 0 | PR #118 final exact-head evidence, issue #101 disposition, and recorded baseline commit |
| R-003 | Numerous temporary and accidental release branches remain | Open — verified | Baseline confusion and review mistakes | Preserve evidence, identify PR-backed branches, then remove obsolete branches | Reviewed branch inventory and cleanup record |
| R-004 | Contract identity terminology overloads `version` | Open — verified | Incorrect compatibility or migration decisions | Implement multi-part contract identity | Contract-identity schema and tests |
| R-005 | `.l2g` may store extracted CUI without encryption | Open | Data exposure at rest | Complete security ADR before production-CUI use | Approved encryption decision and adversarial tests |
| R-006 | One project file creates a concentrated corruption risk | Open | Loss of engagement work | Integrity manifest, IndexedDB recovery, checkpoints, verified backups, restoration tests | Round-trip, corruption, and recovery test evidence |
| R-007 | Large evidence sets may exceed browser memory or storage limits | Open | Processing failure or unusable project | Chunked records, lazy loading, workers, bounded caches, stress tests | Large synthetic engagement performance report |
| R-008 | Cross-domain Undo can create invalid states | Open | Authority or integrity corruption | Domain-aware commands, inverse operations, checkpoint boundaries, invariant tests | Cross-domain Undo and restoration test matrix |
| R-009 | Single-file CSP may be weakened to support workers or embedded libraries | Open | Runtime attack surface and policy failure | Blob workers only where safe, no external dependencies, explicit CSP tests | `connect-src 'none'` and zero-network test evidence |
| R-010 | Users may mistake Client View for access control | Open | Internal information disclosed inappropriately | Persistent qualification; curated client-safe export; profile tests | UX review and export-content tests |
| R-011 | Premature duplicate-code consolidation may discard validated rules | Open | Regression in parsing, review, or authority behavior | Complete feature inventory and golden tests before consolidation | Approved inventory rows and equivalence tests |
| R-012 | Portable and SPFx editions may diverge | Open | Two incompatible products | Framework-neutral domains and host adapters | Shared package tests in both hosts |
| R-013 | GitHub Release and Actions artifact inventory is incomplete | Open | Missing historical binaries or unverified release state | Perform exact live asset inventory and hash reconciliation | Asset inventory report |
| R-014 | Browser download APIs cannot always prove the destination file was written | Open | Misleading save status | Use truthful state labels and verify selected files when APIs permit | Save-state UX and file verification tests |
| R-015 | Existing large standalone HTML applications contain hidden coupling | Open | Migration overruns or behavior loss | Inventory functions, contracts, storage, and tests before extraction | Module migration matrices |
| R-016 | Synthetic fixtures may not represent production-scale document diversity | Open | False confidence in performance or parser safety | Expand synthetic fixtures without client data | Approved large and adversarial fixture set |

## Immediate governance actions

1. Review repository visibility and exposure posture.
2. Complete issue #101 and draft PR #118 on the exact current merged-main suite.
3. Freeze the exact Milestone 0 implementation baseline commit only after issue #101 disposition.
4. Perform Releases and Actions asset inventory.
5. Review and clean obsolete branches after preserving required evidence.
6. Approve or revise decisions D-001 through D-012.
7. Create dedicated ADRs for architecture, project container, persistence/history, contract identity, security, and SPFx sharing.
