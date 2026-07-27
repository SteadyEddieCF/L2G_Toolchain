# v1.9.9 materialization source

These XZ/Base64 unified-delta segments are applied only to the exact promoted v1.9.8 runtime, working-data schema, and built-in profile registry. `materialize.py` verifies the v1.9.8 baseline hashes, encoded-delta hashes, compressed and decompressed patch hashes, and final v1.9.9 artifact hashes before writing any output.
