# Workbook Merge Semantic Validation Report — Workshop v79.1

Trusted preview requires:

- `package_kind` exactly `l2g_workbook_merge_v1`;
- `package_version` exactly `1.1`;
- `schema_trusted` exactly `true`;
- `generated_by` identifies L2G Builder/Merger;
- only the frozen top-level properties;
- array types for governed row collections;
- unique, known practice IDs;
- unique, known objective IDs;
- exact objective-to-parent-practice relationships;
- workbook-source row counts reconcile with unique governed rows.

The exact v3.10 issue #101 Merge fixture passes with 110 practices and 320 objectives. Duplicate/conflicting practice rows, duplicate objectives, mismatched parent identity, unknown versions, and unknown top-level properties fail closed before apply.

Nested reviewer-authored text is retained as inert text. The release does not silently deduplicate conflicting records or use last-record-wins behavior.
