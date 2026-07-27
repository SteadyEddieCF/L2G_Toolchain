# SSP v1.9.9 repository materialization source

The promoted v1.9.8 runtime is the exact hash-verified baseline. `materialize.py` verifies that baseline, reconstructs v1.9.9 from the compressed unified patch, and separately reconstructs the v1.9.9 working-data schema and built-in profile registry. The registry schema is stored directly because it is a small reviewable text artifact.

Generated runtime and binary deliverables are intentionally not committed. The complete ZIP, standalone HTML, and visual screenshots are release/Actions artifacts.

The actual runtime-generated v1.9.9 backup fixture and visual screenshots are retained in the complete deliverables ZIP rather than repeated in git history.
