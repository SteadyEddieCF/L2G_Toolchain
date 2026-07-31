# CMMC L2 SSP Modern Editable v1.9.17

**Release focus:** Final Word-QA Sidecar Consumer and Evidence History under issue #93.

Materialize and verify:

```bash
python modules/ssp/releases/v1.9.17/materialize.py
python modules/ssp/releases/v1.9.17/tests/test_ssp_v1917_static.py
```

Expected standalone runtime:

- file: `CMMC_L2_SSP_Modern_Editable_v1.9.17.html`
- size: `2,266,611` bytes
- SHA-256: `bfd9d10a780809ba259406f0770641da6a40ac2d8a6d1e372b070d6f5273351b`

The release is stacked on frozen contract proposal head `cb5c41abf015d7eee095b10fabe2fc0059473e89`. The route remains `proposal`; it is not validated by this candidate. The SSP working-data schema remains v1.9.11 and the catalog remains exactly 110 authoritative requirements.

The four sidecar JSON files packaged with the SSP deliverables are canonical-equivalent consumer test fixtures. Their canonical contract identities, sidecar IDs, package fingerprints, lineage, checks, and source/artifact identities match the Builder/Merger v3.10 outputs, but their presentation-level JSON byte ordering and trailing-newline form are not asserted to be byte-for-byte copies of the Builder/Merger files. Exact upstream Builder/Merger bytes remain the authoritative joint-handshake test inputs.
