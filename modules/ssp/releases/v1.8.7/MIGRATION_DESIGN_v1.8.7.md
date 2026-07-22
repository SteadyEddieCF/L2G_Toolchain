# Migration Design — v1.8.7

A v1.8.6 portfolio is upgraded in memory from schema 1.6.0 to 1.7.0 by adding `baselineEvents: []`; existing `approvedBaselines`, formal-review collections, identifiers, content, and history remain intact. Single-System workspaces remain Single-System. The prior v1.8.6 storage, image, Word Review queue, and portfolio rollback namespaces are searched before older versions.
