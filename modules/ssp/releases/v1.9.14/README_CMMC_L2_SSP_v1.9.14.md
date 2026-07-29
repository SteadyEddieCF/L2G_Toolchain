# CMMC L2 SSP Modern Editable v1.9.14

Release focus: **Command Surface and Modal Chrome Consolidation** under issue #76.

Materialize and verify from a repository checkout:

```bash
python modules/ssp/releases/v1.9.14/materialize.py
python modules/ssp/releases/v1.9.14/tests/test_ssp_v1914_static.py
```

Expected runtime SHA-256: `8edd518e9b34b36c2d4795890e54412a12724ee54d758f97574f64764578d45e`.

The working-data schema remains v1.9.11. The built-in review-profile registry, registry schema, package routes, review semantics, migrations, and all cross-tool contracts are unchanged.
