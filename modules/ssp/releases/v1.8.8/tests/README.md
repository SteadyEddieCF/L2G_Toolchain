# v1.8.8 Test Suite

Run from the extracted release directory:

```bash
python tests/test_ssp_v188_schema.py
python tests/test_ssp_v188_browser.py
python tests/test_ssp_v188_static.py
```

The browser suite uses local Chromium through Playwright and exercises explicit append-only notes, role/scope enforcement, decision rationale, deterministic aggregation across all required sources, filters, JSON/CSV export, and the `file://` path when browser policy permits it.
