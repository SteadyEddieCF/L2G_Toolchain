# Architecture and Data Model — v1.8.7

Portfolio schema 1.7.0 retains `approvedBaselines` as immutable snapshot records and adds append-only `baselineEvents`. Snapshot payloads reuse the exact governed scope payload used by formal approval. Baseline state is derived from events rather than mutable status fields. Comparison flattens records by stable identifiers, and restoration merges snapshot content into a newly versioned working state while preserving review, approval, baseline, and change history.
