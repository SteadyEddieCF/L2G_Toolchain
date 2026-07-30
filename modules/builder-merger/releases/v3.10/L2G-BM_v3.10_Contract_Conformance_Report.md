# L2G Builder/Merger v3.10 Contract-Conformance Report

## Candidate identity

- Runtime: `L2G-BM_v3.10.html`
- Runtime SHA-256: `96ecb1caee5f7ba278c3b46c666d703423e2db40cac22f8431e70485e5d76a17`
- Frozen contract head: `cb5c41abf015d7eee095b10fabe2fc0059473e89`
- Package kind/version: `l2g_ssp_word_qa_sidecar_v1` / `1.0`
- Schema SHA-256: `3af01051c670ae088f4d6bbcbe1513808415bb5198002d62131a2095515f3c34`
- QA-profile SHA-256: `9aec3fd144e9f8ccfefdd3dd1ba5605ec0364127459f8cbded71904cf02b789c`
- Frozen single-system lineage key: `c444c55ee315723ad301455775f2aafb8824895331a8714007c987db2eba5354`
- Route status: proposal; not validated

## Fixture-bundle reconciliation

The supplied SSP fixture ZIP was independently checked before implementation use:

- Expected size: 265,094 bytes
- Actual size: 265,094 bytes
- Expected SHA-256: `9456f0b04c53d53cb229db566d15dab9ce0105359dba2eaf5a55529b92f16a47`
- Actual SHA-256: `9456f0b04c53d53cb229db566d15dab9ce0105359dba2eaf5a55529b92f16a47`
- Internal fixture validation: pass
- Current and changed-source DOCX bytes, embedded manifests, companion manifests, source snapshots, and registered identities reconciled.

## Frozen producer behavior

| Contract rule | v3.10 result |
|---|---|
| Exact package kind/version/schema URI | Pass |
| Canonical JSON with sorted object keys and array order retained | Pass |
| Duplicate JSON key rejection | Pass |
| Frozen QA-profile hash | Pass |
| Exactly five checks in frozen order | Pass |
| Matching check classifications and blocking severity | Pass |
| No `not-applicable` result | Pass |
| Aggregate counters reconcile to checks | Pass |
| `qa_blocked`, `qa_incomplete`, and `qa_complete` semantics | Pass |
| Human assertion exactly linked to `WQA-LAYOUT-HUMAN` | Pass |
| Local assertion flags fixed to true/false/false | Pass |
| Single-system scope semantics | Pass |
| Source snapshot equals source SSP fingerprint | Pass |
| Artifact exact size and SHA-256 | Pass |
| Embedded manifest exact-byte SHA-256 | Pass |
| Manifest/source/scope reconciliation | Pass |
| Frozen lineage derivation | Pass |
| Sidecar-ID derivation | Pass |
| Package-fingerprint derivation | Pass |
| UTC RFC 3339 second timestamps | Pass |
| Retry attempt and immediate supersedes linkage | Pass |
| Original source DOCX preserved | Pass |

## Registered valid outputs

### Current fixture — attempt 1

- Artifact: `ssp_current.docx`
- Artifact SHA-256: `3a124539c41057f88591c06076b21590d30ccf5eea55b078bf4531cedf005642`
- Manifest SHA-256: `3d44ac9f6fca71f07e34a50f4cd4be838b3e897b43b565afbd5fe3f13359181e`
- Aggregate: `qa_complete`
- Sidecar ID: `sha256:d20ed8de7c04f13e31dbf6e752b8119d761edbccf11f1df9f875d9bb6e320648`
- Package fingerprint: `3106ff057745dbefb48c9fc68527008efab884f9d66195b4ab6aaff38ca02971`
- Sidecar file SHA-256: `31ad14f35cd2c242a1e0589b33245b34770cd262059772ec59510224ada699cf`

### Changed-source fixture — attempt 2

- Artifact: `ssp_changed_source.docx`
- Artifact SHA-256: `36d86ce025183757050f9157b9bbed59e752d0a24fa7480884962e3d37090c7a`
- Manifest SHA-256: `fd2c553716ed1a99cf39f8ac1fee7b0417a6fb0f7519097544b411b8c842b6eb`
- Aggregate: `qa_complete`
- Attempt: 2
- Supersedes: `sha256:d20ed8de7c04f13e31dbf6e752b8119d761edbccf11f1df9f875d9bb6e320648`
- Sidecar ID: `sha256:a6a682842d6c8add2ed6f9a9734bedef7b0b683db83955bac41bc8be53afda22`
- Package fingerprint: `3a9d2fb8c3546b5234613f89fc6fb40a836a278fc812666d95b794824220aa7f`
- Sidecar file SHA-256: `2bb7c44c45fcc8dfee0a06097d5baeacbb8dad08e8561d4e9cacead80fb9ca95`

Both outputs retain lineage `c444c55ee315723ad301455775f2aafb8824895331a8714007c987db2eba5354`. Builder/Merger declares only the producer retry relationship; it does not assert SSP acceptance or supersession.

## Required non-complete outputs

- Real `qa_incomplete` sidecar: pass; four automated checks pass and the human check remains unresolved.
- Real `qa_blocked` sidecar: pass; a separate test DOCX containing an explicit unresolved token fails `WQA-UNRESOLVED-TOKENS`. The registered source fixture remains unchanged.

## Invalid-input handling

| Scenario | Result |
|---|---|
| Mismatched DOCX hash | Detected/rejected |
| Mismatched manifest hash | Detected/rejected |
| Malformed Open XML package | Rejected |
| Duplicate JSON keys | Rejected before canonicalization |
| Aggregate mismatch | Rejected |
| Profile-order mismatch | Rejected |
| Lineage mismatch | Rejected |
| Invalid single-system scope | Rejected |
| Source-snapshot mismatch | Rejected |
| Timestamp ordering error | Rejected |
| Path traversal | Rejected |
| Inert untrusted text | Rendered as text, not executed |

## Authority boundary

The sidecar asserts final Word-QA evidence only. It does not assert current/stale source state, acceptance, governed supersession, CMMC readiness, compliance, assessment, certification, scoring, client-release approval, authenticated identity, digital signature, evidence sufficiency, technical accuracy, or final conclusions.
