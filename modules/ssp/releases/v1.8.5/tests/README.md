# v1.8.5 Self-Contained Validation

Run from the extracted release directory:

```bash
python tests/test_ssp_v185_static.py
python tests/test_ssp_v185_schema.py
python tests/test_ssp_v185_browser.py
```

The browser test uses Chromium and Playwright. If local `file://` navigation is blocked by browser policy, it falls back to an in-memory document while recording that limitation.
