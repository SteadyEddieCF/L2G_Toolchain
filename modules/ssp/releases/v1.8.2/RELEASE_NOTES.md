# Release Notes — v1.8.2

- Resolves inherited content from the same CMMC requirement in an eligible ancestor or active shared-service module.
- Copies a fixed field allowlist and stores a canonical FNV-1a 64-bit source fingerprint.
- Detects current, stale, missing-source, and unresolved-source states.
- Never applies parent changes automatically after the child snapshot is created.
- Stores local supplements separately from inherited base content.
- Supports governed local overrides with mandatory rationale and explicit overridden-field metadata.
- Rejects cross-product inheritance and circular per-requirement inheritance.
- Preserves all 110 authoritative requirements and existing integration contracts.
