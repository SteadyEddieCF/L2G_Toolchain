# Release Report — CMMC L2 SSP Modern Editable v1.9.5.1

**PASS — bounded schema and export-identity correction for issue #31.**

- Exact authorized baseline: `f5aaeab72271b2a25cc27d42eeebde95bf0c7df2`
- Baseline runtime SHA-256: `779a62a1957077d4945627d697344bb7485185a4b079b3318e374ef4610e25fa`
- Corrected runtime SHA-256: `a291b6b1c13b6232ca73e7ed00c9fed40eccdd216ee8bda8ceb4f3dfb59599e8`
- Corrected schema SHA-256: `be2659f848c74e41cfbe47db642efcc3835f5d5b32dc7d3e9054991ad84a8a36`
- Actual v1.9.5 backup reproduced the packaged-schema failure.
- Actual v1.9.5.1 backup validates against the corrected packaged schema.
- Fixed-clock repeated export and import/restore/re-export are byte-identical.
- Fields, statuses, reviewer statuses, tables, images, portfolio records, histories, queues, recovery, rollback, and undo/redo were preserved.
- Four modules retain 440 requirement records, exactly 110 per module.
- SSP handoff 1.0, return 1.0, audit 0.1, Word Review, exchanges, and contracts 1.11–1.15 remain unchanged.
- Browser page errors: zero. External network requests: zero.

No v1.9.6 feature or adjacent-tool change is included.
