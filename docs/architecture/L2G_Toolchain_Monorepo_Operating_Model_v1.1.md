# L2G Toolchain Monorepo Operating Model v1.1

## Purpose

Coordinate independently versioned local/offline modules without turning them into one assessment engine.

## Modules

1. DocConverter-L2G — intake, extraction, normalization, trust/provenance
2. L2G Scoper — draft CUI boundary, service/provider profile, scoping rationale
3. CMMC L2 Gap Workshop — facilitation, advisory review, actions, responsibility, handoffs
4. L2G Builder/Merger — designated workbook build and reviewed-workbook return
5. CMMC L2 SSP Modern Editable — SSP authoring and Word Review round trip

L2G Control Center is the thin control plane above those stages. It launches modules, inspects packages, reports versions/contracts, and provides read-only observability. It does not make assessment conclusions.

## Module layout

```text
modules/<module>/
  README.md
  current/release.json
  releases/<version>/
  docs/
  tests/
```

The `current/release.json` pointer records the current supplied/validated module release. A named suite snapshot records the exact combination tested together.

## Large assets

Commit source and governance text: HTML source when practical, Markdown, JSON, YAML, scripts, schemas, and tests. Publish complete ZIPs, screenshots, workbooks, Word/PowerPoint documents, and other large generated binaries as GitHub Release assets or Actions artifacts.

## Portable suite

The target distribution keeps local HTML as the canonical no-install runtime:

```text
L2G_Portable/
  L2G_Control_Center.html
  Start_L2G.cmd
  modules/
  manifests/
  contracts/
  docs/
```

No administrator rights should be required for the basic HTML path.
