# L2G Integrated Suite v0.4.0 — Evidence Catalog Core

## Included

- canonical `l2g_evidence_index_v1` authority for reference-only Evidence source records;
- complete local SHA-256 hashing in a cancellable bounded-slice Web Worker;
- stable opaque Evidence IDs, exact fingerprints, sanitized base filenames, review/trust/processing/lifecycle states, and provenance;
- browser-session-only source links that clear on lock, reload, project replacement, and failed unlock;
- exact-first Relink Evidence, blocking mismatches, changed-byte revisions, immutable prior fingerprints, and verification receipts;
- exact duplicate groups with explicit Advisor disposition and no automatic merge, deletion, or primary selection;
- typed source locations, bounded plain-text/flat-scalar derived records, evidence relationships, and strict semantic validation;
- transient profile-filtered Evidence search with Client filename, fingerprint, provenance, exception, candidate, receipt, import, and hidden-count non-disclosure;
- Evidence-origin candidate mappings that can publish only into a target-owned Engagement candidate without changing accepted Engagement state;
- reviewed compatibility previews for stable DocConverter package kinds with atomic apply and immutable import receipts;
- deterministic v0.3 migration that adds an empty Evidence domain and infers no source, fingerprint, relationship, candidate, trust state, or conclusion;
- encrypted portable save/open, encrypted browser recovery, lock/unlock, checkpoints, Undo, Redo, restrictive CSP, zero runtime network dependencies, deterministic packaging, SHA manifests, and SPDX SBOM.

## Important limitations

This release remains synthetic-only and is not authorized for production, client, FCI, or CUI data. Original evidence remains outside the project. A SHA-256 match establishes byte equality only; it does not establish authenticity, relevance, currency, evidence sufficiency, implementation, readiness, compliance, risk, scoring, certification, or Met/Not Met. Presentation profiles are not security roles, and Client View is not a safe distribution artifact. v0.4 does not perform PDF, Office, OCR, image, diagram, transcript, or full-document parsing and does not replace DocConverter-L2G.
