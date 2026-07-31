# Contract Conformance Report — SSP v1.9.17

## Frozen inputs

- Contract head: `cb5c41abf015d7eee095b10fabe2fc0059473e89`
- Kind/version: `l2g_ssp_word_qa_sidecar_v1` / `1.0`
- Schema SHA-256: `3af01051c670ae088f4d6bbcbe1513808415bb5198002d62131a2095515f3c34`
- Ordered QA-profile SHA-256: `9aec3fd144e9f8ccfefdd3dd1ba5605ec0364127459f8cbded71904cf02b789c`
- Builder/Merger candidate head: `bdb03e47cb92656a2965f5fd867ff3ef770650d6`

## Consumer conformance

The runtime implements the frozen canonical JSON algorithm and independently recomputes the QA-profile hash, lineage key, sidecar ID, and package fingerprint. It rejects duplicate keys before normal JSON materialization and enforces strict allowed/required properties and semantic invariants.

The exact paired DOCX is bounded by size and expanded-package limits, exact filename/size/SHA-256, safe ZIP paths, required Open XML parts, unsupported active content, external relationships, one embedded SSP manifest, manifest-byte SHA-256, runtime/schema/document/review-package/scope/source identities, and exactly 110 requirement-status entries.

SSP recomputes its current governed source fingerprint for the declared scope. For v1.9.16 source artifacts, runtime-only release metadata is normalized back to the declared source release before hashing; authored values and governed structures are not normalized. This reproduces the frozen v1.9.16 export identity while allowing v1.9.17 to classify currency without changing the working-data schema.

Producer QA (`qa_complete`, `qa_incomplete`, `qa_blocked`), structural validity (`valid`, `rejected`), and SSP-local currency (`current`, `stale`, derived `superseded`) remain separate. Only explicit acceptance of a structurally valid, current, higher-attempt `qa_complete` package in the same verified lineage can derive supersession of an earlier locally accepted current record.

## Proposal status

This implementation does not change `contracts/registry.json` from `proposal` to `validated`. Joint exact-head testing and Orchestrator promotion remain required.
