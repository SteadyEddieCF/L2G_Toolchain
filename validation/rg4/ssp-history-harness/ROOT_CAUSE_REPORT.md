# SSP v1.9.17 RG-4 Evidence-History Harness Root Cause

## Governing scope

This report reconciles issue #107 from protected-main baseline `3be4153c45cb6534954592a6e4ff1cfda87c8bb4`. It changes no SSP runtime, working-data schema, current pointer, contract registry entry, Workshop or Builder/Merger runtime, or historical suite snapshot.

## Reproduced failure

The prior validation harness directly passed a six-field synthetic object to `__sspRg4TestHooks.setHistory()` and expected a persisted history count of one. The object contained `evidence_id`, `sidecar_id`, `source_docx_sha256`, `review_status`, `recorded_at`, and `local_display_name`, but it did not contain the canonical `packageFingerprint` field or a nested `sidecar.package_fingerprint`.

SSP v1.9.17 correctly normalized that unsupported object to an empty history.

## Exact normalization rule

The runtime's `rg4NormalizeRecord()` derives the record fingerprint only from:

1. a lowercase 64-hex `value.packageFingerprint`; or
2. `value.sidecar.package_fingerprint`.

`rg4NormalizeHistory()` then:

1. maps every input through `rg4NormalizeRecord()`;
2. filters any record whose normalized `packageFingerprint` is empty;
3. de-duplicates records by `packageFingerprint`; and
4. retains only the bounded history tail.

Because the synthetic seed supplied neither supported fingerprint location, its normalized `packageFingerprint` was empty and the filter removed it. The same normalization is applied by the direct test hook, backup/restore through `applyData()`, and browser-local storage migration/restore.

## Supported creation and persistence paths

A legitimate RG-4 evidence-history record is created by the SSP runtime only after all of the following:

1. the user selects one JSON `l2g_ssp_word_qa_sidecar_v1` sidecar and its exact paired DOCX;
2. SSP performs duplicate-key-safe JSON parsing, schema validation, semantic validation, exact DOCX byte checks, Open XML safety checks, manifest reconciliation, and current-source fingerprint comparison;
3. SSP presents a non-mutating preview that separately reports structural validity, producer QA aggregate, and SSP-local currency;
4. the user enters a local identifier and display name;
5. the user explicitly checks the local acceptance/acknowledgement control; and
6. the user activates the acceptance action.

The runtime then uses `rg4BuildRecord()` and `rg4AcceptPreview()` to append a canonical record, normalizes the bounded history, and queues browser-local persistence. Valid history is included in normal SSP backup data as `wordQaSidecarEvidence`, restored through `applyData()`, and persisted under the SSP working-data storage key. Direct state or local-storage injection is not a supported creation path and remains subject to normalization.

## Comparison to legitimate records

Legitimate current, stale-acknowledged, blocked, incomplete, retry, superseded, and duplicate cases share the canonical package identity and nested sidecar structure. Their distinctions are represented by supported fields such as `producerQaState`, `currencyAtAcceptance`, `acceptanceKind`, lineage, attempt number, and `supersedesSidecarId`. Exact duplicate packages are idempotent because the canonical `packageFingerprint` already exists. Supersession is derived only from an explicitly accepted current higher attempt in the same valid lineage.

The rejected seed did not represent any of these supported record forms. It had no package fingerprint, no canonical sidecar, no validated artifact/manifest identity, no source fingerprint, no lineage, and no explicit local-acceptance structure.

## Reconciliation decision

The harness now creates a valid current record through the exact sidecar-plus-DOCX preview and explicit acceptance workflow. It separately proves:

- legitimate populated history remains byte-for-byte equivalent through Workshop Handoff preview;
- legitimately empty history remains empty;
- SSP Return 1.0 contains no RG-4 sidecar or history data;
- invalid direct, backup, and local-storage seeds normalize away;
- reload and backup/restore preserve valid records;
- existing current, blocked, incomplete, duplicate, retry, and supersession tests remain registered; and
- a dedicated supported stale-acknowledgement test is added.

## Product-defect determination

**No supported-workflow SSP product defect was reproduced.** The prior failure was caused by an invalid test seed and an unsupported injection method. The SSP runtime is intentionally unchanged.
