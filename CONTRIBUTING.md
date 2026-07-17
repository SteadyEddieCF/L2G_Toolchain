# Contributing to L2G Toolchain

## Module boundaries

A module development chat may read the entire repository but may change only:

- its assigned `modules/<module>/` path;
- directly related contract examples or schemas;
- directly related synthetic tests/fixtures; and
- a suite snapshot entry when explicitly requested.

It must not modify adjacent module application code.

## Branch names

- `release/<module>-<version>`
- `fix/<module>-<version>-<topic>`
- `audit/<module>-<version>`
- `test/<module>-<topic>`
- `docs/<topic>`
- `chore/<topic>`

Do not push releases directly to `main`.

## Pull requests

Every release PR should state the bounded scope, changed files, package-contract impact, static/runtime tests and limitations, adjacent-tool impact, binary assets not stored in git, and rollback instructions.

## Runtime guardrails

Preserve local/offline operation, blocked application network access, no telemetry, no cloud upload, no remote runtime dependencies, source lineage, and human-controlled compliance conclusions unless a separately approved architecture or contract proposal changes them.
