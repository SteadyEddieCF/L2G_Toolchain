# v1.8.7 Test Suite

Run from the extracted release directory:

```bash
python tests/test_ssp_v187_schema.py
python tests/test_ssp_v187_browser.py
python tests/test_ssp_v187_static.py
```

The browser suite uses local Chromium through Playwright and exercises formal approval, named baseline creation, conflict blocking, authorized exceptions, supersession, comparison, export, restoration, history preservation, and the `file://` path when browser policy permits it.
