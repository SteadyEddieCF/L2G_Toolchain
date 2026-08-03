# ADR-0003 — UI Framework and SPFx Host Boundary

## Status

Proposed.

## Date

2026-08-03.

## Context

The Integrated Suite must produce one generated offline portable HTML application while preserving a future SharePoint Framework host that uses the same domain and application services.

Microsoft documents SPFx as framework-agnostic, but its compatibility matrix requires exact framework and toolchain versions. As of this ADR, the current SPFx 1.23.2 compatibility line uses Node.js 22, TypeScript through 5.8, and React 17.0.1. Microsoft also identifies React 18 support as future roadmap work rather than a current assumption.

Binding domain logic, project persistence, validation, contract compatibility, or command history directly to one React runtime would make the portable and SPFx editions unnecessarily difficult to share.

## Proposed decision

1. Keep all domain packages, schemas, commands, validation, compatibility, persistence, history, security, and worker protocols framework-neutral TypeScript.
2. Define a small application-host interface for:
   - project open/save and browser capabilities;
   - navigation and presentation profile;
   - notifications and confirmation;
   - file selection and download;
   - worker creation;
   - host-specific diagnostics.
3. Keep UI state at the component/application boundary and prohibit React objects, hooks, component types, or browser DOM nodes from domain records and service contracts.
4. Use a React-compatible component architecture for Milestone 0, but do not freeze the exact React/SPFx package versions until a bounded compatibility spike passes.
5. The compatibility spike must build:
   - the portable shell;
   - an SPFx shell using the current Microsoft-supported exact versions;
   - one shared representative workspace component;
   - one shared domain command and project round trip.
6. If the spike targets SPFx 1.23.2, pin the Microsoft-documented compatible React and toolchain versions exactly. Do not assume React 18 compatibility until Microsoft lists it as supported for the selected SPFx release.
7. Do not use SPFx APIs inside shared packages. The SPFx edition supplies an adapter at the host boundary.
8. Do not add runtime network dependencies to the portable edition merely because the SPFx host can access Microsoft 365 services.

## Consequences

### Positive

- Portable and SPFx editions can share domain behavior and most UI composition.
- SPFx version changes are isolated to a host package.
- Domain tests do not require React or SharePoint.
- The portable build can remain single-file and offline.

### Negative

- Host adapters and capability interfaces add initial structure.
- Some UI components may require thin host wrappers.
- The exact component-library version remains unresolved until the spike.

## Acceptance evidence

Before ADR acceptance:

- record the selected SPFx release and exact compatibility matrix;
- build both host prototypes from the same shared packages;
- prove no SPFx dependency enters framework-neutral packages;
- prove the portable build performs zero runtime network requests;
- prove the SPFx host does not change domain authority behavior.

## Non-decisions

This ADR does not select a production SPFx tenant, authorize Microsoft 365 data access, create an online synchronization contract, or make a final React-major-version decision.
