# Migration Design — v1.8.4

v1.8.3 state is normalized into schema 1.4.0. Each requirement gains empty `crmSourceIdentifiers` and `crmLegacyIdentifiers` arrays; the portfolio gains an empty `crmReconciliations` array. Existing values and decisions are preserved. No CRM rows, classifications, approvals, or reconciliation decisions are inferred during migration.
