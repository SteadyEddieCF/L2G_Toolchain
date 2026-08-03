# ADR-0001 — Integrated Suite Modular Monolith

## Status

Proposed

## Context

The L2G Toolchain currently consists of independently launched local/offline HTML applications with stable contracts, independently versioned releases, module-specific authority boundaries, and shared regression infrastructure.

The target product requires one portable application, one engagement project, one shared shell, automatic information availability, and a future SharePoint Framework build. One deployment artifact must not create one tangled codebase or one unrestricted shared mutable state object.

## Decision

Implement the L2G Integrated Suite as a TypeScript modular monolith inside the existing monorepo.

The architecture will have:

- one generated portable HTML application;
- host-neutral domain packages;
- domain-owned state and policies;
- explicit application commands;
- typed read-only projections;
- explicit reviewed cross-domain transitions;
- shared infrastructure packages;
- worker packages for heavy processing;
- host adapters for portable and future SPFx editions;
- standalone compatibility builds during migration.

## Dependency rules

1. Domain packages may depend on shared foundation packages.
2. Domain packages may not directly mutate another domain's authoritative records.
3. Presentation packages may call application services but may not own substantive business rules.
4. Cross-domain data visibility uses projections.
5. Cross-domain authority changes use transition proposals and review decisions.
6. Legacy adapters translate contracts and preserve immutable snapshots.
7. Deliverables consume approved content without modifying source-domain conclusions.
8. Overview consumes safe summaries and does not become a substantive authority owner.

## Consequences

### Positive

- one normal portable runtime;
- strong domain boundaries;
- incremental migration;
- shared UI and infrastructure;
- compatible future SPFx host;
- standalone fallback during migration;
- improved automated testing and maintainability.

### Negative

- requires explicit package-boundary governance;
- creates additional build tooling;
- requires adapters while legacy and integrated products run in parallel;
- cross-domain Undo and history require careful command design;
- a large single-file output requires lazy initialization and memory controls.

## Rejected alternatives

### Replace the monorepo

Rejected because no technical constraint currently prevents the existing monorepo from hosting the integrated product.

### Put six existing applications into tabs or frames

Rejected because it preserves duplicated shells, manual handoffs, inconsistent UX, and fragmented state.

### Wholesale rewrite

Rejected because it risks loss of validated behavior and stable contracts.

### One unrestricted global store

Rejected because it would erase authority boundaries and make cross-domain mutation difficult to govern and test.

## Validation required before acceptance

- package dependency graph;
- no prohibited domain-to-domain write dependencies;
- generated single-file foundation runtime;
- native Windows `file://` operation;
- zero-network tests;
- project round trip;
- history and recovery tests;
- presentation-profile tests;
- unchanged standalone module pointers and historical snapshots.
