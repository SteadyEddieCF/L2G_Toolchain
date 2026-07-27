# Unified Needs Attention specification — v1.9.10

## Purpose

Provide one reproducible SSP-owned work queue without creating a second governance system. The queue is presentation state derived from existing v1.9.9 records and is never serialized into governed SSP backups.

## Item shape

Each derived item includes a deterministic item ID, category, urgency text/icon, status, scope, source collection and record ID, derivation rule, governing owner, reason, available action, and last-evaluated time.

## Sources

The workspace may derive bounded items from current source-preflight runs, RG-2 stage runs, corrective actions, source/artifact fingerprints, local reviewer and attestation metadata, Word Review queues, SSP conflicts/exceptions, and the existing portfolio maintenance snapshot. Existing external-tool references are displayed only when a locally stored record identifies the source and remains unresolved; they are labeled `External read-only`.

## Navigation

SSP-owned rows open their existing source surface: Source Preflight, the RG-2 stage/item/action, Word Review, a module/requirement editor, or an existing governance/operations section. A browser-local return bar restores focus to the originating Needs Attention row.

## Filtering and counts

Category, urgency, governing owner, scope, status, and search filters operate over the same derived item set used by the visible count cards. Filter preferences use a separate browser-local key and are excluded from governed exports.

## Authority

The workspace does not alter Workshop conclusions, create provider follow-up, adjudicate Builder/Merger findings, convert advisory results into automated blockers, or calculate any readiness/compliance/assessment result.
