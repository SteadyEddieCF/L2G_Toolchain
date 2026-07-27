# Migration design v1.9.9

- Accepts compatible v1.9.5, v1.9.5.1, and v1.9.8 working-data backups.
- Advances runtime and working-data identity to `1.9.9` / `cmmc-l2-ssp-modern-v1.9.9`.
- Adds empty `reviewStageRuns` and `reviewCorrectiveActions` when absent.
- Preserves `generic-cmmc-ssp-review-v1` v0.1 configuration and source-preflight runs without reinterpretation. Historical source identity fields are retained.
- Profile v0.2 is adopted only through an explicit preview-and-confirm action. Preview does not mutate governed data.
- Existing contracts and portfolio foundation schema remain unchanged.
