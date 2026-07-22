# Migration Design — v1.8.3

Portfolio schema 1.2.0 migrates to 1.3.0 without invented decisions. Existing stale records derive `pending`; current records derive `none`. Existing fingerprints, supplements, overrides, autosave, images, Word Review queues, and rollback snapshots remain intact. Single-System data remains Single-System.
