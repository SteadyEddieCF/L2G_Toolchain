# Portfolio Role Coverage and Responsibility Matrix Specification — v1.9.5

## Purpose

Provide a deterministic, local, read-only administrative view of documented responsibility coverage across portfolio and module records.

## Derived sources

- portfolio and module owner labels;
- requirement and local-supplement owner identifiers;
- evidence owner identifiers and linked requirement ownership;
- action owner identifiers and module ownership fallback;
- active and revoked formal-review role assignments;
- module review-cycle ownership and review anchors.

## Coverage states

`assigned`, `unassigned`, `multiple-assignees`, `inherited`, `unresolved`, and `not-applicable`. These states are follow-up indicators only and are not compliance gaps or assessment findings.

## Contract

Snapshot kind `cmmc_l2_ssp_responsibility_matrix_snapshot_v1`, additive version `1.15`. Rows have deterministic identifiers and source fingerprints; the full snapshot has a SHA-256 fingerprint. JSON and CSV exports are included in portfolio/module delivery packages.

## Deliberate exclusions

No login, authentication, directory synchronization, access enforcement, personnel validation, identity proofing, findings, readiness/risk/compliance scoring, certification conclusions, digital signatures, or legal custody claims.
