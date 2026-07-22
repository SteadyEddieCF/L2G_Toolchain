# v1.8.4 self-contained validation

Run from this extracted release directory:

```bash
python tests/test_ssp_v184_static.py
python tests/test_ssp_v184_schema.py
python tests/test_ssp_v184_browser.py
```

The browser test requires Python Playwright and a Chromium installation. Static and schema tests do not require network access.
