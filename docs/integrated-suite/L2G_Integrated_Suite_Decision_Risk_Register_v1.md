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
| D-011 | Freeze the first implementation baseline only after Workshop v79.1, Builder/Merger v3.10.1, and SSP v1.9.17 pass the complete merged-main six-tool validation with an explicit registry and snapshot disposition | Satisfied — baseline candidate recorded | Planning PR promotion | Issue #101 closed through PR #118; candidate baseline is `85d6e783a250b373cd4b9ea356e4c341336f9259` |
| D-012 | Determine project encryption through a dedicated security ADR before production-CUI suitability is claimed | Proposed | Production project use | Extracted text may contain CUI even without original files |

## Unresolved architecture questions

### A-001 — Component framework and SPFx compatibility

The domain and application-service layers remain framework-neutral. ADR-0003 proposes a bounded portable/SPFx compatibility spike before pinning exact host and React versions.

### A-002 — Supported browsers

ADR-0004 proposes current desktop Chromium on Windows as the Milestone 0 release baseline, with capability-based fallbacks and later Firefox/Safari compatibility work.

### A-003 — Project encryption

ADR-0005 prohibits production/client/CUI use during Milestone 0 and requires a separate accepted cryptographic design before that posture changes. Algorithm and key-management choices remain unresolved.

### A-004 — Project save implementation

ADR-0006 proposes the `.l2g` file as the canonical portable artifact, IndexedDB as bounded browser recovery, truthful download/save state, and explicit re-open verification where browser APIs cannot prove destination writes.

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
| R-002 | The correction stack was moving while the integrated baseline was being planned | Closed | Integrated adapters could have been built against an unqualified contract boundary | Workshop v79.1 and Builder/Merger v3.10.1 were promoted, issue #101 completed the exact merged-main six-tool regression, and RG-4 was registered validated | PR #118 final head `e976c072315a101b974e1af0b996e3d4c2c056d7`; merge `85d6e783a250b373cd4b9ea356e4c341336f9259`; issue #101 closed |
| R-003 | Numerous temporary and accidental release branches remain | Open — verified | Baseline confusion and review mistakes | Preserve evidence and use issue #119 for reachability-based cleanup planning | Reviewed deletion plan and cleanup report under issue #119 |
| R-004 | Contract identity terminology overloads `version` | Open — verified | Incorrect compatibility or migration decisions | Implement multi-part contract identity | Contract-identity schema and tests |
| R-005 | `.l2g` may store extracted CUI without encryption | Open | Data exposure at rest | ADR-0005 prohibits production data; complete cryptographic design before changing that boundary | Approved encryption ADR, threat model, and adversarial tests |
| R-006 | One project file creates a concentrated corruption risk | Open | Loss of engagement work | Integrity manifest, IndexedDB recovery, checkpoints, verified backups, restoration tests | Round-trip, corruption, and recovery test evidence |
| R-007 | Large evidence sets may exceed browser memory or storage limits | Open | Processing failure or unusable project | Chunked records, lazy loading, workers, bounded caches, stress tests | Large synthetic engagement performance report |
| R-008 | Cross-domain Undo can create invalid states | Open | Authority or integrity corruption | Domain-aware commands, inverse operations, checkpoint boundaries, invariant tests | Cross-domain Undo and restoration test matrix |
| R-009 | Single-file CSP may be weakened to support workers or embedded libraries | Open | Runtime attack surface and policy failure | Blob workers only where safe, no external dependencies, explicit CSP tests | `connect-src 'none'` and zero-network test evidence |
| R-010 | Users may mistake Client View for access control | Open | Internal information disclosed inappropriately | Persistent qualification; curated client-safe export; profile tests | UX review and export-content tests |
| R-011 | Premature duplicate-code consolidation may discard validated rules | Open | Regression in parsing, review, or authority behavior | Complete feature inventory and golden tests before consolidation | Approved inventory rows and equivalence tests |
| R-012 | Portable and SPFx editions may diverge | Open | Two incompatible products | Framework-neutral domains and host adapters under ADR-0003 | Shared package tests in both hosts |
| R-013 | GitHub Release inventory is incomplete; Actions artifacts for the current validation are fully enumerated | Open | Missing historical binaries or unverified release state | Perform exact live Releases asset inventory through a supported repository/API path | Asset inventory report |
| R-014 | Browser download APIs cannot always prove the destination file was written | Open | Misleading save status | Use truthful state labels and verify selected files when APIs permit | Save-state UX and file verification tests |
| R-015 | Existing large standalone HTML applications contain hidden coupling | Open | Migration overruns or behavior loss | Inventory functions, contracts, storage, and tests before extraction | Module migration matrices |
| R-016 | Synthetic fixtures may not represent production-scale document diversity | Open | False confidence in performance or parser safety | Expand synthetic fixtures without client data | Approved large and adversarial fixture set |

## Immediate governance actions

1. Review repository visibility and exposure posture.
2. Promote this architecture-planning PR and record `85d6e783a250b373cd4b9ea356e4c341336f9259` as the Milestone 0 implementation baseline.
3. Review and accept, revise, or explicitly defer ADR-0001 through ADR-0006.
4. Perform the remaining GitHub Releases asset inventory.
5. Execute issue #119 branch cleanup only after its preservation gates pass.
6. Complete the detailed six-module feature inventory before any substantive module migration.
7. Keep Milestone 0 synthetic-only until the security posture changes through an approved cryptographic design.
