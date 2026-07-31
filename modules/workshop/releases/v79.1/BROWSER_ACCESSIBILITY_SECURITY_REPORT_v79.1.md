# Browser, Accessibility, Offline, and Security Report — Workshop v79.1

## Exact candidate identity

- Runtime SHA-256: `361a29613d85a42eb404aabbaec061fb815dbd347d90dc41c089e8024cc95dc1`
- Runtime size: `1852954` bytes
- Implementation/test head: `615fa0516debea4af39c3273f00924e2e8b94a51`

## Candidate-specific CI

Workflow **Workshop v79.1 Candidate Validation**, run `30671641092`, passed all five jobs:

- `static-and-materialization` / job `91290422909`;
- `runtime-axe-and-routes` / job `91290422865`;
- `visual-regression` / job `91290422882`;
- `windows-file-origin` / job `91290422942`;
- `deterministic-package` / job `91290422860`.

The focused gates verified:

- strict valid and adversarial Workbook Merge behavior;
- non-mutating preview and rejected imports;
- explicit apply, deterministic duplicate handling, and undo;
- Handoff 1.7 producer self-reconciliation with wire version 1.0;
- Workshop↔SSP Handoff/Return 1.0;
- axe-core in the default theme;
- light and dark visual equivalence to v79 apart from release identity;
- constrained viewport, print, keyboard focus, and visible candidate controls;
- native Windows Chromium `file://` operation;
- zero external requests, page errors, and unexpected console errors.

Dark mode is validated separately from the default-theme axe run, matching the repository convention and avoiding attribution of the inherited v79 focused skip-link contrast state to this validation-only corrective scope.

## Shared repository gates

- **Validate L2G Toolchain**, run `30671641118`: passed.
- **Playwright QA**, run `30671641100`: runtime/axe-core, visual regression, and Windows file-origin smoke all passed.

## Boundary

This evidence validates the Workshop-owned v79.1 candidate. Final issue #105 closure and promotion review remain blocked on the exact Builder/Merger v3.10.1 lossless action/ownership round trip from issue #106.
