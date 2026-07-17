# Contributing to L2G Toolchain

## Module ownership

Each development chat owns one module. It may read the whole repository but may write only its assigned module, directly related contract examples, tests, and an explicitly requested suite-snapshot entry.

## Branches

- `release/<module>-<version>`
- `fix/<module>-<version>-<topic>`
- `audit/<module>-<version>`
- `test/<module>-<topic>`
- `docs/<topic>`
- `chore/<topic>`

Do not push module releases directly to `main`.

## Required pull-request content

- Module and release version
- Bounded objective
- Changed files
- Stable-contract impact
- Static and runtime results
- Disclosed environment limitations
- Adjacent-tool impact
- Binary assets stored outside git
- Rollback path

## Runtime and compliance guardrails

Preserve local/offline operation, CSP network blocking, no telemetry, no cloud upload, no remote runtime dependency, source lineage, and human-controlled compliance conclusions unless an approved architecture or contract proposal explicitly changes them.

## Large assets

Source, Markdown, JSON, YAML, scripts, and tests belong in git. Complete ZIP bundles, screenshots, workbooks, documents, and other large generated binaries should normally be attached to GitHub Releases or retained as GitHub Actions artifacts.
