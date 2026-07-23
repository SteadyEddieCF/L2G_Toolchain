"""Executed release regression.

Open the v1.9.5 runtime in Playwright, populate the deterministic four-module fixture,
export an actual backup, then open v1.9.5.1 with the v1.9.5 autosave/recovery/image/
rollback namespaces preloaded. Validate migration, import, restore, undo/redo, corrected
filenames, fixed-clock repeated-export byte identity, schema validation, zero page errors,
and zero external requests. The generated fixtures and results are supplied in the complete
v1.9.5.1 deliverables ZIP; their hashes are in ACTUAL_RUNTIME_BACKUP_FIXTURE_REFERENCE.
"""
