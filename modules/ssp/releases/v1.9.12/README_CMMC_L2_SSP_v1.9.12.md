# CMMC L2 SSP Modern Editable v1.9.12

Release focus: **Compact Responsive Workspace Chrome** under issue #70.

Materialize with:

```bash
python modules/ssp/releases/v1.9.12/materialize.py
python modules/ssp/releases/v1.9.12/tests/test_ssp_v1912_static.py
```

Expected runtime SHA-256: `34252e7a02e6122700cd2cc845ce53fafdfe42b6bad55ae4b28035914e802d31`.

The working-data schema remains v1.9.11 SHA-256 `7d1ed6c95415360ad5f805cf103e3c777fd9ef52dc1e4bedecbb2cf30c223251`. The built-in profile registry, registry schema, package routes, and all cross-tool contracts are unchanged.

At the target laptop viewports, the application chrome is limited to a compact primary toolbar plus a one-line state strip. Full browser-local persistence detail remains available through **State details**. RG-4 remains the next mandatory SSP/Builder-Merger handshake release.
