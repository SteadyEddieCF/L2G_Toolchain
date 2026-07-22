# Immutable Named Baseline Specification — v1.8.7

## Purpose

Create immutable, named local authoring snapshots only after a fresh formal approval. Baselines support deterministic comparison, supersession history, export, and restoration through a new working version.

## Creation gates

- Scope must have a fresh active formal approval whose source fingerprint equals current governed content.
- The acting person must hold an active Approver or Administrator assignment for the selected scope.
- Baseline names are unique.
- Open blocking conflicts prevent creation unless each conflict has an active exception naming the conflict and an authorizing person.
- Baseline records and snapshot payloads are append-only and cannot be edited or deleted in the UI.

## Snapshot contract

`cmmc_l2_ssp_named_baseline_v1` package version `1.7` records portfolio/module scope, approval linkage, source fingerprint, snapshot fingerprint, description, release notes, author, timestamp, parent/supersession linkage, and the governed scope payload. FNV-1a fingerprints provide deterministic local integrity comparison; they are not cryptographic signatures.

## Supersession and restoration

A later baseline appends a `superseded` event for the previously active scope baseline. Restoration leaves every baseline and approval record unchanged, reapplies the snapshot into a newly incremented working portfolio/module version, resets restored authoring review metadata, and appends a `restored` event and change-history entry. The restored scope requires a new review and approval cycle.

## Deliberate boundary

Baselines are authoring-governance records. They are not authenticated signatures, assessment findings, compliance conclusions, readiness scores, certification decisions, legal records, or external custody receipts.
