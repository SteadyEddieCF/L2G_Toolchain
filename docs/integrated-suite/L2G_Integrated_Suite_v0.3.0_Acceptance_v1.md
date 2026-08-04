# L2G Integrated Suite v0.3.0 — Engagement Spine Acceptance

## Purpose

This document is the exact promotion gate for v0.3.0. Every required criterion must pass on the unchanged final implementation head before the current release pointer changes and the implementation PR merges.

Passing this matrix does not authorize production, client, FCI, or CUI data.

## Baselines

- prior Integrated Suite release: `0.2.0`;
- prior merge: `72584f3a9fd8f82ea580cc29903e06678907d2f8`;
- prior portable HTML SHA-256: `84526756161fa44bc2dcaebe791a2ea1b73c06341c7563e34693aa6b7231af86`;
- encrypted envelope: `l2g_encrypted_project_v1` version `1.0`;
- project kind: `l2g_project_v1`;
- product/runtime compatibility baseline: `85d6e783a250b373cd4b9ea356e4c341336f9259`;
- governing issue: #126.

## Release identity

- application version: `0.3.0`;
- engagement schema: `l2g_engagement_v1` version `1.0`;
- portable artifact: `L2G_Integrated_Suite_Engagement_Spine_v0.3.0.html`;
- source remains additive; v0.1 and v0.2 source and release artifacts remain reproducible and immutable.

## Required functional criteria

### Canonical engagement authority

- create and edit accepted engagement identity;
- support the exact phase, lifecycle, operational, question, decision, and visibility vocabularies in ADR-0008;
- manage participants and organizations with immutable IDs and status rather than destructive deletion;
- manage assumptions, decisions, open questions, constraints, milestones, and blockers;
- validate local relationships and reject duplicate IDs or dangling references;
- preserve all meaningful mutations in command history;
- Undo and Redo restore data state without deleting audit events;
- named checkpoints and restore remain functional.

### Candidate governance

- create low-authority candidates without changing accepted target state;
- Accept applies exact proposed fields through an Engagement command;
- Modify preserves original and accepted values;
- Reject preserves candidate and rationale;
- Supersede creates and validates candidate relationships;
- decided candidates cannot be decided twice;
- candidate decisions are visible in history and Reviewer View;
- Client View receives no candidate content, candidate counts, source labels, confidence, or rationale.

### Presentation profiles and projections

- Advisor View supports editing and provenance inspection;
- Reviewer View is direct-edit read-only and emphasizes changes/history;
- Client View is filtered before rendering;
- hidden records do not affect counts, search, next-work, inspector, DOM text, or empty states;
- every non-Engagement workspace receives a deep-cloned, recursively frozen read-only Engagement projection;
- attempted downstream mutation cannot alter Engagement authority;
- external client distribution remains explicitly qualified as requiring a curated export.

### Factual next work

- deterministic ordering follows the domain contract;
- missing required identity, candidate review, high/critical blockers, blocked/overdue milestones, open questions, and upcoming milestones are supported;
- Client View calculations use only client-visible records;
- output never contains unsupported readiness, compliance, certification, scoring, evidence-sufficiency, or Met/Not Met conclusions.

### Compatibility and migration

- open a valid v0.2 encrypted project and deterministically migrate `engagement_v1` to `l2g_engagement_v1`;
- preserve valid project and engagement identifiers;
- map legacy labels and participants without inference;
- create a migration checkpoint and history event;
- initialize new collections empty;
- open a valid v0.1 unencrypted synthetic project through the existing migration path and produce a v0.3 encrypted save;
- open, save, reopen, recover, lock, and unlock a native v0.3 project;
- wrong passphrase or failed migration leaves active governed state unchanged;
- v0.1 and v0.2 deterministic runtime identities remain unchanged.

## Required security and robustness criteria

- strict duplicate-key and prototype-pollution rejection;
- exact archive path, CRC, integrity, size, and schema validation before mutation;
- unknown-key rejection for governed Engagement records;
- collection, string, relationship, and total-entry limits;
- malformed states, duplicate IDs, dangling references, invalid dates, unsupported enums, oversized fields, and broken supersession rejected;
- encrypted outer package and IndexedDB recovery contain no known plaintext marker;
- every encryption uses fresh salt and IV;
- wrong passphrase, ciphertext tamper, AAD tamper, purpose replay, truncation, and unsupported profile rejected;
- localStorage contains no governed records, keys, passphrases, ciphertexts, or recovery envelopes;
- zero unexpected runtime network requests;
- restrictive CSP with `connect-src 'none'`;
- no client, FCI, CUI, secret, or client-identifying repository/CI content.

## Required UX and accessibility criteria

- eight-workspace shell remains accessible and responsive;
- Pre-Engagement internal tabs are keyboard operable;
- primary forms, dialogs, lists, and candidate actions have accessible names and visible focus;
- no serious or critical axe-core violations in Advisor, Client, and Reviewer profile routes;
- no color-only state communication;
- Client presentation layout remains readable at 1280×720;
- standard advisor layout remains usable at 1366×768;
- inspector focus returns correctly after close;
- native Windows Chromium `file://` and Linux Chromium `file://` pass.

## Required release engineering criteria

- strict TypeScript check;
- deterministic portable application build on Linux and Windows;
- release manifest, SHA-256 sums, SBOM, release notes, schema, synthetic fixtures, and validation report;
- generated release and dist artifacts byte-identical;
- dedicated v0.3 Linux and Windows workflows;
- v0.1 and v0.2 integrated-suite regressions;
- current six-tool runtime, axe-core, visual, Windows file-origin, RG-4, SSP history, and all inherited materializers;
- no unresolved review threads;
- exact-head workflow and artifact identities recorded before promotion;
- promotion commit changes only release-state/evidence metadata and any validator reconciliation required for later-current-release semantics;
- final exact head reruns the complete matrix before merge.

## Explicit exclusions

- Evidence parsing, OCR, original evidence embedding, Scope authority, CMMC practice conclusions, evidence sufficiency, gaps, SSP narratives, workbook/DOCX/PPTX generation, standalone retirement, cloud services, sharing, sync, multi-user identity, access control, telemetry, production authorization, readiness, compliance, scoring, certification, or Met/Not Met.
