# L2G Toolchain Monorepo Operating Model v1

## Purpose

The repository coordinates independently versioned local/offline modules without turning them into one assessment engine.

## Structure

```text
modules/
  control-center/
  docconverter/
  scoper/
  workshop/
  builder-merger/
  ssp/
contracts/
fixtures/
suite/
  snapshots/
  portable/
scripts/
docs/
.github/workflows/
```

## Module release layout

```text
modules/<module>/
  README.md
  current/
  releases/<version>/
  docs/
  tests/
```

`current/` identifies the latest validated module release. `releases/<version>/` retains release governance and source artifacts. Large generated bundles and binary fixtures are attached to GitHub Releases or CI artifacts rather than duplicated through git history.

## Toolchain stages

1. DocConverter-L2G — intake and normalization
2. L2G Scoper — draft boundary and service/provider profile
3. CMMC L2 Gap Workshop — facilitation, advisory review, actions, responsibility, and handoffs
4. L2G Builder/Merger — official workbook bridge and reviewed-workbook return
5. CMMC L2 SSP Modern Editable — SSP authoring and Word Review round trip

L2G Control Center is the thin control plane above the stages. It launches modules, inspects packages, reports versions/contracts, and provides read-only observability. It does not make assessment conclusions.

## Portable-suite direction

HTML remains the canonical runtime and reliable fallback. A portable suite may include a Control Center HTML launcher, module HTML files, manifests, contracts, documentation, and optional command/PowerShell helpers. No administrator rights or installation should be required for the basic HTML path.

## Contract governance

Stable package changes require producer/consumer compatibility analysis, examples, regression, and explicit approval. Additive optional fields should remain safely ignorable and do not automatically justify a package-version change.
