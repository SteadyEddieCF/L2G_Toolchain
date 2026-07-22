# Migration Design — v1.8.8

v1.8.7 portfolio foundations migrate to schema 1.8.0 by adding an empty `changeDecisionRegister` array. Existing history, review, approval, baseline, exchange, CRM, Word Review, impact, conflict, and exception records remain unchanged. Existing explicit register entries are normalized, scope-validated, and fingerprint-verified on import.
