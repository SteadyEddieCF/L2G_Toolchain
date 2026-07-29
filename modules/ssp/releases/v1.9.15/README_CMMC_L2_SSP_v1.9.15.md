# CMMC L2 SSP Modern Editable v1.9.15

Release focus: **Needs Attention Work-Area Compaction** under issue #79.

Materialize and verify with:

```bash
python modules/ssp/releases/v1.9.15/materialize.py
python modules/ssp/releases/v1.9.15/tests/test_ssp_v1915_static.py
```

Expected runtime SHA-256: `5e3a628556fc63db777fbef813eee8df9e2d8a1405a81bd87c058012503f2361`.

The working-data schema remains v1.9.11. Review profiles, derived-item rules, package routes, review semantics, and all cross-tool contracts are unchanged.
