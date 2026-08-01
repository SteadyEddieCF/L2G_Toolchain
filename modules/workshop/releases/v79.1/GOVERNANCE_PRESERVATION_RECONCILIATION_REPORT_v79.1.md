# Governance Preservation Reconciliation Report — Workshop v79.1

- Governance baseline: `69785ecd38f4d00345f27ca13e934dd0f688a1bf` / `contracts/reconciliations/workbook_merge_v1_1_governance_preservation/`
- Canonical nested path: `workbook_source.workshop_governance_preservation_v1`
- Invalid top-level property: `workshop_governance_preservation_v1`
- Extension role: reconciliation assertion only; no operational authority transfer

## Validation result

- Canonical exact-current fixture: trusted and nonblocking.
- Package without extension: trusted through the existing Merge 1.1 route.
- Governed mismatch, missing current record, duplicate stable ID, incorrect count, invalid record/preservation fingerprint, invalid source-Handoff linkage, malformed shape, duplicate key, and old top-level location: blocked before apply.
- Discrepancies include record type, record ID, field, expected value, observed value, and comparison source.
- Explicit apply records only `exact_non_mutating_round_trip` evidence; action, ownership, request, provider-follow-up, SSP governance, filters, and selected records remain byte-identical.

## Fixture SHA-256

- `adversarial_inert_strings.json` — 11130 bytes — `521d732844ca4d1cb1f42e38aab649c681b2ae8f1073d5f4d7aa5b4b435dc03e`
- `canonical_nested_extension.json` — 11072 bytes — `9476f2107e045c385d77d76982f77a032ef998ad7022875de562b575ba34e831`
- `duplicate_key_extension.json.txt` — 7707 bytes — `ce423244e7dc7a8dd3abe572a649e3f2fbc29f9a4472067ea238fcb034ab827c`
- `duplicate_key_nested.json.txt` — 859 bytes — `cc357df76e84f0024985928f4cbc6167c299dff2e9c0c875a920d8a30caaae30`
- `duplicate_key_top_level.json.txt` — 863 bytes — `2ce955e51553d4cb299988efdc9b82abf990075dcf9481efbfcbb456c11bcc1f`
- `duplicate_stable_id.json` — 13165 bytes — `23001a9bead4339d8d79f19dc987b64b57c5c6c9b3f00b79ac5d17d689a08a73`
- `governed_field_mismatch.json` — 11063 bytes — `0854c0fdbd034c87414566217d9d82f689cf1bdd3784c079dcd3218ac7476f1d`
- `handoff_identity_scenario_matrix.json` — 2019 bytes — `203b8f86b910780731f444496c7d3ad0157f7c9a042fa967fe4222019eb57022`
- `incorrect_count.json` — 11072 bytes — `91f60e83955f37b2638e4999381d9b54a3d1dba82bd498b1da8b0195c34101ad`
- `incorrect_preservation_fingerprint.json` — 11072 bytes — `e8a2760580820b73dce3bd9f98a8d3872b742c4f8025f84ba3c32867f660dc74`
- `incorrect_record_fingerprint.json` — 11072 bytes — `aa5f73cd3da1851dffd2b19a7f34effaa7c680b988efba3c7427cf038db44082`
- `incorrect_source_handoff_linkage.json` — 11072 bytes — `fcacc43a854a6ce66c011a0f11ed559fe557ba6f01dad19d94f11fa3abef9cd7`
- `malformed.json.txt` — 41 bytes — `31c220a603c103cefac8d27cc0149654d1c457571ed0bf353bc97d25422e43d7`
- `malformed_extension.json` — 11102 bytes — `c60fd7fccc87a0b9e51f68b564627863091e61b83f207d90173a13e08264ad9f`
- `missing_current_record.json` — 11084 bytes — `bbb75708d426b2154b37a10739dbdbaa07bd5f9a282b6cc5535e75fddac1934a`
- `package_without_extension.json` — 750 bytes — `80093c0de07d273da5f9c742b622ee234815a801fbb9e063bf389d6a22828222`
- `top_level_extension_invalid.json` — 10568 bytes — `409aecc49da5b10983bb0deff3990ba940faf852a4429e08df1ad84d99e78ae3`
- `workbook_merge_scenario_matrix.json` — 4856 bytes — `ec854d9f8b85d0282097c4c21ec4b6e417a2a85efee1584d86eb847ab0ca2fce`

## Joint-candidate boundary

These fixtures are Workshop-owned contract tests. The exact corrected Builder/Merger v3.10.1 PR #113 package remains required for final Orchestrator candidate-to-candidate evidence.
