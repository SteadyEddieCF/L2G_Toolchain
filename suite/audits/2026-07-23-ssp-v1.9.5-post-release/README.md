# SSP v1.9.5 Post-Release Toolchain Integration Audit

## Status

Audit in progress. This record documents the exact protected-`main` starting point and confirmed early findings. It does not authorize SSP v1.9.6 feature development or claim a completed six-module end-to-end regression.

## Baseline

Protected `main` starting commit:

`f5aaeab72271b2a25cc27d42eeebde95bf0c7df2`

Active governed runtime catalog:

- L2G Control Center v0.3.3
- DocConverter-L2G v7.9.5.1
- L2G Scoper v3.12
- CMMC L2 Gap Workshop Tool v76
- L2G Builder/Merger v3.8
- CMMC L2 SSP Modern Editable v1.9.5

## Governing decisions

- SSP v1.9.6 feature development is frozen pending this audit.
- Builder/Merger Option B is the working direction: SSP will propose a curated governed review/delivery profile, while Builder/Merger remains responsible for agendas, formatting, assembly, merging, and final client-delivery packages.
- SSP contracts 1.11 through 1.15 remain derived, read-only administrative artifacts.
- Workshop remains authoritative for practice conclusions, evidence review, provider/responsibility discussion, provider follow-up, gaps, and engagement actions.
- Control Center remains a read-only compatibility and observability plane.
- The authoritative route matrix remains toolchain-orchestrator owned.

## Confirmed findings

### Scoper current-pointer drift

The governed runtime catalog and Scoper module README identify v3.12, while the previous `modules/scoper/current/release.json` still identified v3.11. This audit branch corrects that repository pointer without modifying the Scoper runtime.

### SSP v1.9.5 backup schema mismatch

An actual Chromium-generated SSP v1.9.5 working-data backup reports:

- `schema`: `cmmc-l2-ssp-modern-v1.9.5`
- `schemaVersion`: `1.9.5`
- `appVersion`: `1.9.5`

The packaged v1.9.5 JSON Schema instead constrains `schemaVersion` and `appVersion` to `1.9.2`, causing the runtime-generated backup to fail validation. The runtime also suggests the stale download filename `CMMC_L2_SSP_v1.8.4_Data_Backup.json`.

Recommended ownership: bounded SSP v1.9.5.1 schema/export-filename correction after separate SSP review. No SSP feature development is authorized by this audit branch.

## Fresh large-bundle results

The supplied synthetic McFirecoal package contains 104 files. A fresh real-browser DocConverter v7.9.5.1 main pass completed under the governed 90-entry ZIP safeguard, creating 91 source records including the outer archive. Stable intake, scope-context, and meeting-context packages remained version 1.0. Twelve clean validation questions were produced, with no malformed JSON-like questions, page errors, or external network requests.

The fresh scope context was then imported into Scoper v3.12. The Return package remained version 1.0 and contained zero practice records. Repeated Return generation produced the same semantic hash.

The separate 14-file overflow pass and the exact Workshop, Builder/Merger, SSP round-trip, and Control Center recognition routes remain part of the continuing audit.

## Fixture publication posture

Do not publish the supplied McFirecoal ZIP as a canonical GitHub Release asset yet. Its Pack A and Pack B manifests validate, but the master manifest contains one stale README size/hash entry and the README contains obsolete tool-version guidance. Prepare a corrected, versioned synthetic fixture release before GitHub publication; commit only the small fixture manifest/specification to normal Git history and attach the large ZIP as a private GitHub Release asset.
