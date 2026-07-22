# Architecture and Data Model — v1.8.8

Portfolio schema 1.8.0 adds `changeDecisionRegister`, an append-only collection for explicit manual governance notes. The consolidated register itself is derived deterministically at render/export time from that collection and existing authoritative source collections. Derived entries are not persisted and do not alter approval or baseline fingerprints. Each entry retains source provenance and a local FNV-1a record fingerprint.
