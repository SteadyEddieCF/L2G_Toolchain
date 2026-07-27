# Backward compatibility report — SSP v1.9.10

v1.9.10 is a runtime-only UX release over promoted v1.9.9.

- `APP_VERSION` remains `1.9.9`.
- Working-data schema remains `cmmc-l2-ssp-modern-v1.9.9` with the promoted SHA-256.
- Built-in profile registry and registry schema are unchanged.
- No package kind, package version, route, or cross-tool contract changes.
- v1.9.5, v1.9.5.1, v1.9.8, and v1.9.9 migration/restore paths remain those of promoted v1.9.9.
- The queue and UI preferences are excluded from `collectData` and governed exports.
