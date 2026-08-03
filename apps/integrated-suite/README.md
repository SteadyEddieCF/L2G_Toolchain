# L2G Integrated Suite Foundation

Milestone 0 creates the additive, synthetic-only foundation for the next-generation L2G Integrated Suite.

## Release

- Version: `0.1.0`
- Portable artifact: `dist/L2G_Integrated_Suite_Foundation_v0.1.0.html`
- Project kind: `l2g_project_v1`
- Product/runtime compatibility baseline: `85d6e783a250b373cd4b9ea356e4c341336f9259`
- Production/client/CUI use: **not authorized**

## Included

- zero-runtime-dependency TypeScript application;
- deterministic single-file HTML build;
- eight-workspace shell;
- Advisor, Client, and Reviewer presentation profiles;
- low-authority engagement and participant records;
- synthetic review-transition examples;
- local browser recovery through IndexedDB;
- open, validate, save, Save As, backup, checkpoint, restoration, Undo, Redo, and history;
- deterministic ZIP_STORED `.l2g` project container;
- SHA-256 project integrity manifest;
- strict duplicate-key JSON parser;
- archive path, duplicate entry, CRC, size, compression, and nested-archive rejection;
- read-only current contract-registry catalog;
- restrictive hashed Content Security Policy with `connect-src 'none'`;
- release SHA-256 manifest and SPDX 2.3 SBOM.

## Excluded

No production parsing, OCR, scope migration, practice conclusions, SSP migration, Office generation, scoring, readiness, compliance, certification, Met/Not Met, or evidence-sufficiency behavior is included.

## Build

```bash
cd apps/integrated-suite
npm ci
npm run test
```

The normal user runtime requires only the generated HTML file and a supported current Windows Chromium browser. Node.js, Python, TypeScript, and Playwright are build/test dependencies only.

## Project format boundary

Foundation projects use uncompressed ZIP entries with deterministic ordering and fixed archive timestamps. Compressed or nested archives are rejected in this release. That conservative restriction may be revisited only through a reviewed archive-safety change.

The canonical portable artifact is the `.l2g` file. IndexedDB is browser-local recovery and never claims to have written the portable file.
