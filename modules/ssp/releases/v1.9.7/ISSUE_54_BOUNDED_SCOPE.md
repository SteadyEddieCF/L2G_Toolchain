# Issue #54 Bounded Scope — SSP v1.9.7

## Release

`CMMC L2 SSP Modern Editable v1.9.7 — Portfolio Workspace and Navigation Foundation`

## Exact baseline

- Protected main: `5f7df0ebaea89dec470acd8032027309eef6d02f`
- SSP v1.9.6 promotion merge: `12a0c855b6d90ff4fd40418a34fc0e8431bd5df8`
- v1.9.6 runtime SHA-256: `d86ae890920f7935c40e9d237766e5ac482af70907e0758bd7e7f1b8f0bed0ea`
- Working-data schema SHA-256: `be2659f848c74e41cfbe47db642efcc3835f5d5b32dc7d3e9054991ad84a8a36`

## Implemented

- Persistent full-screen portfolio task workspace.
- Overview, Modules & Requirements, Operations, Governance, and Delivery views.
- Portfolio/module scope, active module, search, sort, breadcrumbs, Preflight, Deliver, and Advanced routes.
- Browser-local workspace state, capped and sanitized, excluded from governed exports.
- Existing modules, requirements, responsibility, evidence-reminder, dependency, calendar, maintenance, local-governance, delivery, and verification surfaces reorganized without changing governed records.
- Deterministic internal navigation, details panel, focus restoration, browser-Back protection, and print-specific chrome suppression.

## Excluded

- Unified Needs Attention derivation.
- RG-1 or any review-gate schema.
- Staged SME/Quality/Director review.
- Word inspection or Builder/Merger sidecars.
- Guided bulk workflows, migration wizard, new contracts, or adjacent-tool changes.
