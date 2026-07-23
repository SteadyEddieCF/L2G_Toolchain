# Evidence Freshness and Ownership Reminder Specification — v1.9.3

## Purpose

The reminder center derives local administrative follow-up from evidence identifiers referenced by module requirements and optional evidence records already stored in the portfolio. It supports portfolio and module scope, a deterministic as-of date, a default age limit, and a due-soon window.

## Contract

- Package kind: `cmmc_l2_ssp_evidence_reminder_snapshot_v1`
- Package version: `1.12`
- Persisted portfolio foundation schema: unchanged at `1.10.0`

Each record identifies evidence linkage, owners, validation and due dates, calculated age, days until due, freshness status, deterministic indicator codes, reminder level, reasons, and a stable reminder identifier. The snapshot is protected by SHA-256 over canonical JSON.

## Freshness policy

An explicit due or expiration date takes precedence. Otherwise, the due date is calculated from the recorded validation/review/collection date plus an evidence-record review interval or the selected default age limit. The due-soon window controls only reminder classification. No policy value is persisted into authoritative SSP data.

## Boundary

The center does not send email, create calendar events, run background jobs, evaluate evidence sufficiency, determine control effectiveness, produce assessment findings, or calculate readiness/compliance scores. Owners and dates remain locally asserted metadata.
