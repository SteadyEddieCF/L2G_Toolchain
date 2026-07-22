# Validation Rule Catalog — v1.8.5

- Exchange kind/version/payload/fingerprint are required.
- Complete portfolio exchange requires a portfolio foundation and anchor workspace.
- Module exchange requires one module and exactly 110 unique authoritative requirement IDs.
- Cross-portfolio module import, duplicate requirements, missing parents, and protected identity changes fail closed.
- Only empty/default editable target fields and new stable-ID records are safe.
- Existing substantive target values are conflicts and remain unchanged.
- Module Word packages must be DOCX, module-scoped, same-portfolio, same-module, macro-free, object-free, path-safe, and parseable.
- Cross-module Word content-control tags are rejected into warning items.
