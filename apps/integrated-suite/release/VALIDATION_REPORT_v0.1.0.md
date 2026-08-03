# L2G Integrated Suite Foundation v0.1.0 Validation Report

## Status

Promotion evidence for Milestone 0 under issue #117 and pull request #122.

## Exact candidate

- candidate head: `d1d20dbdf27095b29e3c5595259fe3f2a538663c`
- application version: `0.1.0`
- deterministic HTML SHA-256: `67a69e026d789901dcfe0bf8aecb574d1ae5a9647b225db18099f5cb43e89e15`
- product/runtime compatibility baseline: `85d6e783a250b373cd4b9ea356e4c341336f9259`
- project kind: `l2g_project_v1`
- repository visibility: intentionally public, synthetic-only publication boundary enforced

## Passing candidate workflows

| Gate | Run | Result |
|---|---:|---|
| Integrated Suite Foundation | `30848680626` | Linux and native Windows jobs passed |
| Playwright QA | `30848679456` | runtime/axe, visual, and Windows jobs passed |
| RG-4 Merged-Main Six-Tool Validation | `30848680574` | static identities, joint routes, and Windows file-origin passed |
| SSP RG-4 History Harness | `30848680461` | passed |
| Validate L2G Toolchain | `30848680629` | passed |
| SSP v1.7.1 and v1.8.0 through v1.8.5 materializers | exact candidate head | passed |

## Exact foundation artifacts

### Linux foundation package

- artifact ID: `8869750960`
- artifact name: `integrated-suite-foundation-linux`
- artifact digest: `sha256:cbeb2c915139b76ab9413cb37fc92aabf1674e6a4b72cf9b5b71af148849613b`

The package contains:

- one generated portable HTML runtime;
- exact release manifest;
- SPDX 2.3 SBOM;
- release notes and SHA256SUMS;
- valid synthetic `.l2g` project;
- compressed-entry, duplicate-path, path-traversal, duplicate-key, and integrity-tamper adversarial fixtures;
- Playwright evidence and light/dark screenshots.

Direct artifact inspection confirmed:

- HTML size: `110831` bytes;
- HTML SHA-256: `67a69e026d789901dcfe0bf8aecb574d1ae5a9647b225db18099f5cb43e89e15`;
- release-manifest SHA-256: `96895b8c457a675d8fdb285152d5520fdb75e42164506be7dd8f53db5e544110`;
- SBOM SHA-256: `05b5d3a5cc21bc1b2bb8ed3d2016b431da86d457c499100b29ff3f5a7beaaf86`;
- foundation Playwright results: `10/10` passed.

### Windows foundation package

- artifact ID: `8869750970`
- artifact name: `integrated-suite-foundation-windows-file-origin`
- artifact digest: `sha256:fdd944c3f5ace0785d9976a3fd2bde509685a60837e79c52d2744c8191566361`

### Existing-suite regression artifacts

- broad Playwright/axe artifact `8870102396`: `sha256:bccce9a77eb0ca3452edd31e83ec391396c7003d08f16e5ca47474a1e4282a6f`;
- visual-regression artifact `8869763774`: `sha256:9926b69e5baa30717f9a846b9bab3859c80b3ec9c3f896d139cc77a87a8a29ff`;
- Windows file-smoke artifact `8869761958`: `sha256:c9e4fb23a75c40cfb06bcb527f13eae7cdd25808dc8b10685b1357a2e9951360`.

## Proven foundation behavior

- strict TypeScript build and locked dependency;
- deterministic single-file HTML generation;
- eight-workspace shell;
- Advisor, Client, and Reviewer presentation profiles with non-security qualification;
- client-profile non-disclosure for advisor-only participant records;
- low-authority engagement and participant editing;
- human-readable Undo and Redo;
- append-oriented history;
- checkpoints and restoration without erasing prior history;
- browser-local IndexedDB recovery requiring explicit restore/read-only/discard choice;
- deterministic `.l2g` ZIP_STORED project round trip;
- SHA-256 integrity verification before mutation;
- rejection of malformed, compressed, duplicate-path, traversal, duplicate-key, and tampered projects without changing the open project;
- fail-closed validation of application identity, domain index, checkpoint snapshots, review enums, history profiles, reversal links, identifiers, and bounded collections;
- hashed inline CSP with `connect-src 'none'`;
- zero unexpected runtime network requests;
- axe-core serious/critical violations: zero on tested Advisor and Client surfaces;
- light and dark visual contracts;
- native Windows Chromium `file://` operation;
- current standalone module and governed-route non-regression.

## Preserved boundaries

This validation does not authorize production, client, FCI, or CUI data. It does not migrate or modify existing module behavior, contract registry state, historical suite snapshots, standalone current pointers, scope conclusions, practice conclusions, SSP content, deliverable generation, evidence sufficiency, readiness, compliance, certification, scoring, or Met/Not Met determinations.

## Promotion rule

The current-release pointer may move from `release-candidate` to `current` based on this candidate evidence. The unchanged resulting promotion head must still pass the complete required CI matrix before merge.
