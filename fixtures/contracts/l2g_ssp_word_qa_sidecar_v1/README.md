# RG-4 Proposal Fixtures

| Fixture | Schema expectation | Paired artifact/source expectation | Consumer outcome |
|---|---|---|---|
| `clean_current.json` | pass | exact and current | eligible for explicit current acceptance |
| `stale_valid.json` | pass | internally valid; source differs from current SSP | explicit stale-evidence path only |
| `malformed_missing_version.json` | fail | not evaluated | reject |
| `mismatched_artifact_hash.json` | pass | paired DOCX bytes do not match declared hash | reject |
| `mismatched_manifest_fingerprint.json` | pass | embedded/export manifest differs | reject |
| `adversarial_reject.json` | fail | path traversal and extra authority property | reject without rendering/execution |
| `adversarial_inert_text_valid.json` | pass | exact otherwise; HTML-like text is untrusted | inert rendering only |
| `retry_superseding_current.json` | pass | same lineage, higher attempt, exact current source | eligible to supersede only after explicit acceptance |

The declared DOCX and manifest hashes are synthetic planning values. Before Builder/Merger issue #92 begins, SSP v1.9.16 must produce de-identified deterministic DOCX/manifest fixtures whose exact bytes match their declared SHA-256 and size. Required identities include review-package, document, runtime, schema, profile, output, scope/module, source SSP fingerprint, governed-source snapshot hash, and embedded/export manifest hash. Include a clean/current export, a controlled source-revision export, generation instructions, reproducibility notes, and SHA256SUMS.
