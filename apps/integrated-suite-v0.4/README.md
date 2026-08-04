# L2G Integrated Suite v0.4.0 — Evidence Catalog Core

This additive source tree implements ADR-0009 and the reviewed `l2g_evidence_index_v1` contract while preserving the v0.3 Engagement authority and v0.2 encrypted-project safety foundation.

## Build and test

```bash
npm ci
npm test
```

The deterministic build produces one portable HTML under `dist/` and a release package under `releases/v0.4.0/`.

## Included

- canonical reference-only Evidence source records and exact SHA-256 byte identity;
- cancellable bounded-slice local hashing;
- staged atomic registration, exact relink, revisions, duplicate disposition, locations, bounded derived records, relationships, and receipts;
- transient profile-filtered search and Client non-disclosure;
- target-owned Engagement candidate publication;
- strict stable-package preview/apply adapters;
- encrypted save/open/recovery, lock, history, checkpoints, Undo, Redo, and v0.3 migration;
- restrictive CSP, zero runtime network dependencies, deterministic build, and synthetic validation.

## Qualification

Synthetic data only. Original evidence stays outside the project. Hash equality is not authenticity or evidence sufficiency. Presentation profiles are not security roles. This release does not authorize production, client, FCI, or CUI data and does not establish readiness, compliance, implementation, risk, scoring, certification, or Met/Not Met.
