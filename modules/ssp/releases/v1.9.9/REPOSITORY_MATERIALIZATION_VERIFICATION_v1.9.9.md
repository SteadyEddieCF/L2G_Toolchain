# Repository Materialization Verification — v1.9.9

The repository representation uses hash-checked XZ/Base64 payload parts for the standalone runtime, working-data schema, and built-in registry. `materialize.py` reconstructs all three and validates their SHA-256 identities against the release manifest. Documentation, fixtures, regression evidence, and tests remain directly readable.
