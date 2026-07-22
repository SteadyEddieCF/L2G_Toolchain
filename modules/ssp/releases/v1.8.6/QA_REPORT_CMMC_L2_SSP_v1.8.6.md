# QA Report — CMMC L2 SSP Modern Editable v1.8.6

## Local validation result: PASS

- Static/offline/identity/contract/materialization checks: **22/22**
- Authoritative requirements retained: **110**
- Portfolio fixture: **4 modules / 440 explicit module-requirement records**
- Invalid JSON Schema fixtures rejected: **10/10**
- Active roles exercised: **4**
- Submission rounds: **2**
- Reviewer dispositions: **2**
- Fresh approval state: **approved**
- Post-change approval state: **stale**
- Revocation state: **revoked**
- Incompatible role assignment: **rejected**
- Reviewer self-approval path: **rejected**
- Review register fingerprint: `fnv1a64-2da440172c537d01`
- Browser page errors: **0**
- Deterministic extracted-package materialization: **PASS**

Runtime SHA-256: `a9f872d7e3f0e9dd8515ac34a784086d536306cd00d0768066f657025c82f630`

The local Chromium policy blocks direct `file://` navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`; the browser regression records that condition and falls back to the identical standalone HTML through `set_content`. Existing repository Playwright/axe, visual regression, and Windows `file://` smoke checks remain the required independent PR gates.
