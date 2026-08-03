# Workbook Handoff Export Identity Report — Workshop v79.1

Canonical producer identity remains:

```json
{
  "package_kind": "l2g_workbook_handoff_v1",
  "package_version": "1.0",
  "handoff_schema_enhancements_version": "1.7"
}
```

Before export, Workshop verifies:

- top-level package kind, wire version, enhancement release, and trusted-schema flag;
- `contract_manifest.contract_name`;
- `contract_manifest.contract_release`;
- embedded required package kind, wire version, and trusted-schema flag;
- `package_integrity.contract_release`;
- canonical fingerprint recomputed from final package content.

Human-facing wording is:

> Workbook Handoff contract release 1.7 — wire package version 1.0

The top-level wire version is not relabeled to 1.7. Historical packages are not migrated or rewritten. Repeated equivalent package generation produces the same canonical fingerprint.
