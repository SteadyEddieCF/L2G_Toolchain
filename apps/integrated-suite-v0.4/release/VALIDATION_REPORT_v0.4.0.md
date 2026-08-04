# L2G Integrated Suite v0.4.0 — Validation Report

## Candidate identity

- Release: **L2G Integrated Suite v0.4.0 — Evidence Catalog Core**
- Governing issue: **#130**
- Promotion pull request: **#132**
- Accepted design baseline: `5011e83e855c29dc5a40ea97c81ae1892bff463b`
- Validated candidate head: `0a8c3613d32389038dcbb9bdd901228befc02bea`
- Product/runtime compatibility baseline: `85d6e783a250b373cd4b9ea356e4c341336f9259`
- Engagement schema: `l2g_engagement_v1` version `1.0`
- Evidence schema: `l2g_evidence_index_v1` version `1.0`
- Evidence projection: `l2g_evidence_projection_v1` version `1.0`
- Encrypted envelope: `l2g_encrypted_project_v1` version `1.0`

## Deterministic release artifact

- Artifact: `L2G_Integrated_Suite_Evidence_Catalog_v0.4.0.html`
- SHA-256: `60c1fe78ecf1ce19fcca696f93f043aa26be3515a7bb1f3d07c3708fae8e4f09`
- Size: `240716` bytes

The application artifact rebuilt deterministically to the same SHA-256 on the validated candidate head. Runtime project encryption remained intentionally nondeterministic through fresh salt and IV generation. Synthetic encrypted fixtures generated during validation are therefore run evidence rather than frozen cryptographic vectors.

## Exact candidate-head validation runs

| Gate | Run | Result |
|---|---:|---|
| Integrated Suite Evidence Catalog v0.4 | `30941387036` | Passed dedicated Linux and native Windows `file://` validation |
| Playwright QA | `30941386990` | Passed inherited runtime, axe-core, governed-route, Windows file-origin, and visual-regression checks |
| RG-4 Merged-Main Six-Tool Validation | `30941386804` | Passed static identities, joint runtime, and Windows current-file-origin validation |
| Validate L2G Toolchain | `30941386794` | Passed |

All inherited SSP materializers triggered for the candidate head also passed.

## Dedicated evidence artifacts

### Linux

- Artifact ID: `8905278529`
- Workflow artifact digest: `sha256:69da88ade22feeb971378511329f8613e08705305d35f76332f0abd945bc0597`

### Windows native file origin

- Artifact ID: `8905293478`
- Workflow artifact digest: `sha256:c45416aff5eff6b9460945d148a4b685f1f3a26c18e28e8a2627af634187521a`

## Validated behaviors

- strict TypeScript compilation with indexed-access checks enabled;
- deterministic portable-HTML packaging, JSON Schema, release manifest, SHA set, and SPDX SBOM;
- restrictive hash-pinned CSP including `default-src 'none'`, `connect-src 'none'`, and `worker-src blob:`;
- zero runtime network requests, no remote assets, and no telemetry SDKs;
- eight-workspace shell under HTTP test serving and native Windows `file://` origin;
- canonical reference-only Evidence authority with opaque IDs, bounded metadata, SHA-256 byte identity, lifecycle, processing, review, trust, visibility, tags, and provenance;
- local incremental SHA-256 hashing in bounded 1 MiB worker slices with visible staging before governed mutation;
- original source bytes absent from project state, encrypted recovery, inner archives, history, and release artifacts;
- exact-first relinking, session-only file associations, blocking hash mismatches, and changed-byte revisions that preserve prior fingerprints;
- successful relink and revision receipts without absolute paths, keys, passphrases, file handles, or original bytes;
- exact duplicate groups with explicit Advisor disposition and no automatic deletion, merge, archive, or primary selection;
- prevention of superseding a reviewed duplicate primary until a replacement primary is explicitly reviewed;
- typed source locations, bounded plain-text and flat-scalar derived records, relationship validation, cycle rejection, and dangling-reference rejection;
- deep-cloned, recursively frozen Evidence projections supplied to workspaces;
- profile filtering before rendering, search indexing, counts, snippets, inspector construction, and accessibility-tree exposure;
- Client View omission of original filenames, fingerprints, provenance, exceptions, duplicate details, candidates, verification receipts, import receipts, hidden counts, and hidden search results;
- Evidence-origin candidate mappings publishing only to target-owned Engagement candidates while accepted Engagement state remains unchanged;
- strict preview and atomic apply for recognized stable DocConverter package kinds without changing stable contracts or standalone runtimes;
- unhashed imported references represented explicitly as external references rather than false local-byte identities;
- encrypted portable save/open, encrypted browser recovery, project locking, checkpoints, Undo, Redo, and append-oriented history;
- wrong passphrase, ciphertext tampering, corrupt outer archives, and envelope-purpose replay rejected without mutating governed state;
- deterministic migration of valid v0.3 projects into an empty Evidence domain without inferring sources, fingerprints, relationships, candidates, trust states, or conclusions;
- active-content strings, raw path leakage, invalid null fingerprints, malformed packages, duplicate JSON keys, unknown package kinds, and unsupported archive structures rejected;
- current standalone tools, registered routes, visual baselines, and RG-4 matrix unchanged.

## Promotion procedure

This report records the exact green **candidate head**. The current-release pointer is updated only after this evidence exists. Because the validation-report and metadata-only pointer update create a new final head, the complete required matrix must pass again on that exact final head before PR #132 may leave draft or merge. Final-head run IDs and review evidence are recorded in PR #132 and issue #130 without altering the validated application artifact.

## Release boundary

This release remains **synthetic-only**. It does not authorize production, client, FCI, or CUI data. Original evidence remains outside the project. A SHA-256 match establishes byte equality only; it does not establish authenticity, relevance, currency, evidence sufficiency, implementation, readiness, compliance, risk, scoring, certification, or Met/Not Met. Presentation profiles are not security roles, and Client View is not a safe distribution artifact. PDF, Office, OCR, image, diagram, transcript, and full-document parsing remain in DocConverter-L2G and are not replaced by v0.4.
