# Architecture and Data Model — v1.8.5

Portfolio schema 1.5.0 adds bounded `exchangeHistory`, per-module `moduleWordReviewQueues`, and requirement `reviewerNotes`. JSON exchanges are portable envelopes around the existing portfolio/module records rather than new authoritative stores. Reconciliation applies descriptors only after a deterministic preview; identity and substantive-value conflicts remain unchanged. Module Word Review uses the existing secure DOCX parser with module-scoped content-control tags.
