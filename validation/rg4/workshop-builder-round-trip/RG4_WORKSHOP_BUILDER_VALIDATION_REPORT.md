# RG-4 Workshop v79 / Builder-Merger v3.10 Regression Validation

**Governing issue:** #101  
**Exact protected-main baseline:** `8804efcfd7b190117aea76ef48929b2c171dbc70`  
**Validation scope:** Workshop-owned regression and evidence only  
**Runtime changes:** None  
**Registry changes:** None  
**Historical snapshot changes:** None  
**RG-4 sidecar stability:** `proposal`  
**Promotion result:** **Blocked pending separately bounded corrective work**

## Reconciliation

The supplied baseline is the current protected `main`. Issue #101 still references SSP merge commit `95aae59cf4543994721f895a0faacef87e90edf0`; protected `main` subsequently advanced through metadata reconciliation to `8804efcfd7b190117aea76ef48929b2c171dbc70`. The promoted Builder/Merger and SSP runtime bytes remain identical to the issue identities.

The uploaded deliverables were independently checked:

| Package | ZIP SHA-256 | CRC | Promoted runtime |
|---|---|---:|---|
| Builder/Merger v3.10 | `0c92f1a4d79d67f1a96c09ed89fe40fb0b11baa4f24bcacb5dc3e244dd725cd2` | clean | exact `96ecb1caee5f7ba278c3b46c666d703423e2db40cac22f8431e70485e5d76a17` |
| SSP v1.9.17 | `747d2705a5de5d5599fe9b8f473c500a346a1d8462106cfcac9caa4021807377` | clean | exact `bfd9d10a780809ba259406f0770641da6a40ac2d8a6d1e372b070d6f5273351b` |

Both uploaded manifests retain pre-promotion candidate wording, but their runtime bytes reconcile with the promoted repository releases.

## Exact generated evidence

| Artifact | Size | SHA-256 |
|---|---:|---|
| Workshop Handoff expected 1.7 / actual package 1.0 | 1,902,424 | `99c63ca4b617a479e5634bb7ad64f74e10d4d4b43ca747e698c134c545012ec2` |
| Builder/Merger generated workbook | 260,769 | `53836fd615dfdde88ac5510516b97e13c351fe88d29a2ca94a1a8c4b3012c43a` |
| Workbook Merge 1.1 | 677,449 | `e17a5c6a971f9f8c7ae388c3205ff4888b7cee4decd7026d4544447793dec899` |
| Workshop SSP Handoff 1.0 | 160,234 | `81ca3171e14e3f2ff8caed17b70a031f50e0bcd3c75a69cb5367e221bb073947` |
| SSP Return 1.0 | 70,180 | `e372018fb3e77c225065b574f93ef28e212fa78b9b3f73842a44ad1ed960ae9c` |

## Passing results

- Builder/Merger accepted the exact Workshop package locally and without network access.
- All 110 practice IDs were preserved.
- All 320 objective IDs were preserved after the established v79 whitespace-before-bracket canonicalization. The one raw representation delta is `CM.L2-3.4.4 [a]` ↔ `CM.L2-3.4.4[a]`.
- The generated workbook is byte-identical across two deterministic runs.
- The embedded template's 222 formula cells remained 222 with zero formula-text mismatches.
- The original `styles.xml` SHA-256 remained unchanged.
- Existing merges and conditional formats were preserved.
- Seven data-validation rules were present after generation; no original validation rule was removed.
- The workbook contains 12 sheets, including `L2G Workshop Import`, `L2G Change Log`, and `L2G Instructions`.
- ZIP CRC and path-traversal checks passed.
- Builder/Merger emitted `l2g_workbook_merge_v1` version `1.1`.
- Workshop preview was non-mutating for substantive records.
- Explicit local apply created one merge-history record.
- Exact re-import was detected and blocked as a duplicate.
- Decisions, actions, ownership records, requests, provider follow-up, and SSP-return governance were not overwritten by merge application.
- Malformed JSON and wrong package kinds were rejected or blocked.
- Imported HTML-like strings rendered inert.
- Workshop SSP Handoff 1.0 was accepted by SSP v1.9.17 with exactly 110 controls.
- SSP RG-4 evidence history remained unchanged while the Workshop handoff was validated and converted into 1,330 candidate rows.
- SSP Return 1.0 was accepted for Workshop preview without changing unrelated Workshop records.
- RG-4 Word-QA evidence history was not included in the SSP return package.

## Promotion blockers and unresolved compatibility conditions

### WKS-RG4-001 — Handoff contract identity mismatch

The frozen registry declares `l2g_workbook_handoff_v1` version `1.7`. Exact Workshop v79 output declares:

```json
{
  "package_kind": "l2g_workbook_handoff_v1",
  "package_version": "1.0",
  "handoff_schema_enhancements_version": "1.7"
}
```

Builder/Merger accepts the package, but this does not satisfy issue #101's exact package-version gate. No runtime or registry change was made in this evidence PR.

### WKS-RG4-002 — Unknown merge version accepted

Changing the exact Merge package to `package_version: "2.0"` remained trusted and nonblocking. Workshop v79 does not enforce frozen Merge 1.1 at preview.

### WKS-RG4-003 — Extra properties accepted

An unknown top-level property remained trusted and nonblocking.

### WKS-RG4-004 — Duplicate JSON keys not explicitly rejected

Duplicate keys are processed by normal `JSON.parse`; a duplicate `package_version` with final value `1.1` is accepted.

### WKS-RG4-005 — Mismatched or duplicate practice identity accepted

A merge package with a duplicated/mismatched practice identity remained trusted and nonblocking instead of failing closed. This can conceal a missing source practice and a duplicate incoming practice record.

### RG4-ROUNDTRIP-006 — Required action/ownership details not preserved into workbook

The workbook preserved provider/responsibility text and the accepted decision statement, but it did not retain the exact synthetic action/ownership IDs or the action owner, due date, blocker, and ownership access-limitation values required by issue #101. This aligns with the current optional v78 helper posture (`consumer_may_ignore: true`, downstream consumption unconfirmed), but it does not satisfy the stronger RG-4 final round-trip gate.

## Authority boundary

This evidence does not modify or promote the RG-4 Word-QA proposal. It does not establish evidence sufficiency, readiness, compliance, risk, assessment, scoring, certification, or client release approval. Corrective changes must be separately bounded to the owning module or joint contract-governance work and followed by a complete rerun.
