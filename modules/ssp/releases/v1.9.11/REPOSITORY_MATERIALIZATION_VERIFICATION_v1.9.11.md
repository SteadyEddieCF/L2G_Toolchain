# Repository Materialization Verification — v1.9.11

`materialize.py` starts from promoted v1.9.10 SHA-256 `a282173c4a8ea23e59d6091a5f68c09757393df2c2d18b92b72569f69310f91c`, verifies the runtime patch's encoded/XZ/payload hashes, reconstructs runtime SHA-256 `4e2db5ccf4a520519a0f6845d36ec7f543febf3b45b9a9934cf48ce4d61bc3f6`, materializes schema SHA-256 `7d1ed6c95415360ad5f805cf103e3c777fd9ef52dc1e4bedecbb2cf30c223251`, and verifies the unchanged profile registry and registry schema identities.

A clean local reconstruction and bounded static gate passed before publication. GitHub repository validation and browser gates remain required on the exact final PR head.
