# Release Notes — CMMC L2 SSP v1.8.0

## Added

- Optional Modular Portfolio mode; Single-System remains the default.
- Versioned `cmmc-l2-ssp-portfolio-foundation-v1` schema.
- Portfolio and module records with stable identifiers.
- Anchor, shared-service, tenant, product, application, and enclave hierarchy types.
- Guided conversion preview, complete local backup, and rollback.
- Parent-child integrity, orphan prevention, duplicate-ID prevention, and circular-reference prevention.
- Complete portfolio-foundation and selected-module JSON exports.
- McFirecoal hierarchy fixtures and automated foundation tests.

## Preserved

- All 110 requirements and assessment objectives.
- Single-System authoring, autosave, recovery, JSON, CRM CSV, Word Review, preflight, print/PDF, image security, and offline operation.
- `l2g_ssp_handoff_v1` 1.0, `l2g_ssp_return_package_v1` 1.0, and read-only round-trip audit 0.1.

## Upgrade behavior

v1.7.1 JSON, browser autosave, embedded-image storage, and Word Review queue namespaces are migrated. Upgrade does not enable portfolio mode automatically.
