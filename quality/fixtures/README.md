# Synthetic Quality Fixtures

All fixtures created by the repository quality baseline are synthetic, deterministic, and generated in memory by tests. They must not contain client names, client documents, assessment evidence, CUI, FCI, PHI, credentials, private local paths, or Coalfire-restricted material.

The current property and adversarial suite generates:

- malformed, empty, truncated, invalid-encoding, duplicate-key, prototype-key, and non-finite JSON inputs;
- CSV cells beginning with `=`, `+`, `-`, and `@`, plus row/column/NUL boundary cases;
- ZIP/Office-style entries containing traversal, absolute paths, drive paths, duplicate normalized paths, case collisions, symlink metadata, macros, external links, high ratios, deep paths, excessive counts, and excessive expanded sizes;
- misleading file extensions and mismatched PDF, image, Office, text, Markdown, and JSON signatures;
- Unicode and reserved-character filenames.

Failure seeds from Hypothesis are retained only as GitHub Actions artifacts. A minimal reproducer may be committed only after it is rewritten to remain clearly synthetic and non-sensitive.
