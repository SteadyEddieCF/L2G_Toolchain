# SSP v1.9.10 repository materialization source

The promoted v1.9.9 runtime is the exact hash-verified baseline. `materialize.py` reconstructs v1.9.10 from the compressed unified patch and verifies the encoded payload, compressed payload, patch, baseline, and final runtime SHA-256 values.

The working-data schema, built-in profile registry, registry schema, and cross-tool contracts are intentionally not copied or changed in this release. They remain the promoted v1.9.9 artifacts.
