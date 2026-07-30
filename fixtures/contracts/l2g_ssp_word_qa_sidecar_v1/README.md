# RG-4 contract fixtures

This directory contains sidecar vectors and the verified real SSP v1.9.16 Word-export bundle used to freeze issue #91.

- Mandatory binary attachment: `rg4_ssp_word_export_fixtures_v1(1).zip`
- Repository registration: `real_artifacts/verified_binary_registration.json`
- Bundle SHA-256: `9456f0b04c53d53cb229db566d15dab9ce0105359dba2eaf5a55529b92f16a47`
- Current DOCX SHA-256: `3a124539c41057f88591c06076b21590d30ccf5eea55b078bf4531cedf005642`
- Changed-source DOCX SHA-256: `36d86ce025183757050f9157b9bbed59e752d0a24fa7480884962e3d37090c7a`
- Scenario definitions: `scenario_matrix.json`
- Contract validator: `scripts/rg4/validate_rg4_contract_proposal.py`

`clean_current.json` and `stale_valid.json` intentionally contain the same structurally valid sidecar. Currency is an SSP-local comparison: the former is evaluated against the current source snapshot and the latter against the changed-source snapshot. `retry_superseding_current.json` uses the changed-source DOCX as attempt 2 in the same frozen lineage.

Mismatch vectors maintain internally consistent sidecar IDs and package fingerprints but fail exact artifact or manifest pairing. Semantic-reject vectors exercise rules that JSON Schema cannot express. `duplicate_key_reject.json` must be rejected during parsing.

The bundle and sidecars contain de-identified fixture data only. They do not claim compliance, readiness, assessment, certification, scoring, authenticated identity, digital signature, or final client approval.
