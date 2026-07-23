# Portfolio Health and Maintenance Dashboard Specification — v1.9.4

## Purpose

The dashboard derives an administrative and operational authoring queue from locally recorded portfolio data. It supports portfolio-wide and module-specific views, deterministic JSON snapshots, and CSV queue exports.

## Contract

- Package kind: `cmmc_l2_ssp_maintenance_snapshot_v1`
- Package version: `1.11`
- Persisted portfolio foundation schema: unchanged at `1.10.0`

Each queue record identifies its source collection and stable source identifier, applicable module or requirement, one or more deterministic indicator codes, maintenance groups, reasons, and a neutral maintenance level of `action`, `follow-up`, or `information`. The snapshot is protected by a SHA-256 fingerprint over canonical JSON.

## Indicators

Indicators cover unresolved applicability and responsibility decisions, missing local owner/evidence/validation references, unrecorded reviews, approval follow-up, inheritance and impact follow-up, module metadata, open conflicts, formal review/baseline administration, default policy use, CRM reconciliation exceptions, Word Review queues, and open consolidated-register records.

## Boundary

The dashboard does not measure control effectiveness, assess CMMC requirements, calculate readiness or compliance scores, certify a system, or replace professional judgment. Counts reflect locally recorded authoring metadata and locally asserted actor labels.
