# Consolidated Change and Decision Register Specification — v1.8.8

The register is a deterministic local view across authoritative source records. It consolidates explicit append-only notes, change history, decision records, portfolio/module exchange imports, CRM reconciliation, module Word Review, parent-change impact decisions, conflicts and exceptions, review role assignments, submissions, reviewer dispositions, approvals, immutable baseline events, and restoration events.

## Explicit entries

An actively assigned Author, Reviewer, Approver, or Administrator may append a scoped change or decision note while acting in that role. Decisions require rationale. Entries receive stable IDs and deterministic local record fingerprints. Existing entries are never edited or deleted.

## Derived entries

Derived entries retain source collection, source ID, related IDs, timestamps, scope, actor, state, fingerprints, and a deterministic sequence. The register does not replace or mutate source records.

## Export

JSON package kind: `cmmc_l2_ssp_change_decision_register_v1`, version `1.8`. CSV contains the same filtered entry set. Exports include counts and a deterministic local register fingerprint.

## Boundary

The register is not an authenticated audit service, digital signature, legal custody record, assessment finding, certification decision, readiness score, or compliance conclusion.
