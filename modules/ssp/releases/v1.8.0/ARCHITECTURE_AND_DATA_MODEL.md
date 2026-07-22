# Architecture and Data Model — v1.8.0

The tool remains one local-only HTML application. The existing SSP workspace is the authoritative anchor content. A separate `portfolioFoundation` object is included in every v1.8.0 backup.

## Operating modes

- `single-system`: default; `portfolio` is null and `modules` is empty.
- `modular-portfolio`: one portfolio record and exactly one root `top-level` module; additional modules form a directed acyclic parent-child hierarchy.

## Records established

Portfolio and module records implement the Phase 1 fields from the enhancement charter. Empty first-class arrays reserve versioned locations for module requirements, evidence, decisions, actions, risks, conflicts, exceptions, interconnections, assets/services, change history, and approved baselines.

Stable IDs use a restricted identifier grammar and survive backup, export, import, module editing, and reassignment. Runtime cross-record validation supplements JSON Schema by detecting duplicates, missing parents, invalid roots, and cycles.

No module requirement implementation, applicability, inheritance, responsibility, review, approval, evidence, or assessment state is inferred in v1.8.0.
