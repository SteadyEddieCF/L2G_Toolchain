# CMMC L2 SSP Modern Editable v1.8.7 Release Report

## Release focus

Immutable named authoring baselines for optional portfolio mode, including approval-linked snapshots, conflict-aware creation gates, deterministic comparison, append-only supersession events, export, and governed restoration through a new working version.

## Implemented

- Portfolio-wide and module-specific named baseline creation after fresh formal approval.
- Approver/Administrator role gate and unique baseline names.
- Blocking-conflict gate with explicit active authorized-exception recognition.
- Immutable snapshot records linked to approval and exact governed-content fingerprints.
- Append-only baseline creation, supersession, and restoration events.
- Deterministic field-level comparison and exportable comparison report.
- Baseline package export with deterministic local integrity fingerprint.
- Restoration through incremented portfolio/module versions without rewriting baseline, approval, or review history.
- Automatic reset of restored working review metadata so a new review cycle is required.

## Preserved

Single-System remains the default. The 110-requirement model, offline operation, portfolio/module exchange, module Word Review, CRM, deterministic inheritance, impact review, conflict escalation, formal review/approval, Workshop handoff, SSP return package, and read-only audit contracts remain intact.

## Deliberate boundary

FNV-1a fingerprints are deterministic local integrity markers, not cryptographic signatures. Named baselines do not create assessment findings, compliance conclusions, readiness scores, certification decisions, or legal custody records. Consolidated change and decision register work remains v1.8.8.
