# Known Limitations — v1.8.2

- Stale records require explicit author review; parent changes never auto-propagate.
- Conflict grouping, impact preview, accept/defer adjudication, and cascading change workflow begin in v1.8.3.
- Approval fields remain tracking metadata rather than signatures or immutable baselines.
- Consolidated/module CRM, module Word Review, configurable rules, and multi-user synchronization remain deferred.
- FNV-1a is a deterministic change fingerprint, not a cryptographic integrity or approval mechanism.
