# L2G Integrated Suite v0.2.0 — Encrypted Project Safety Foundation

This additive source tree implements the accepted ADR-0007 project-protection design without modifying the promoted v0.1.0 source or any standalone module runtime.

## Build and test

```bash
npm ci
npm test
```

The deterministic build produces one portable HTML file under `dist/` and a release package under `releases/v0.2.0/`. Runtime encrypted saves are intentionally nondeterministic because every save uses a fresh salt and IV. The test suite therefore uses a fixed synthetic cryptographic vector in addition to runtime randomness checks.

## Security profile

- whole canonical inner `l2g_project_v1` ZIP encrypted with AES-256-GCM;
- PBKDF2-HMAC-SHA-256 with exactly 600,000 iterations;
- 128-bit random salt and 96-bit random IV;
- authenticated canonical envelope metadata;
- encrypted browser recovery or no recovery;
- no password reset, escrow, sync, telemetry, or runtime network access;
- valid v0.1 synthetic project import for encrypted migration only.

## Qualification

Synthetic data only. This release does not authorize production, client, FCI, or CUI use and does not establish readiness, compliance, scoring, certification, evidence sufficiency, or Met/Not Met conclusions.
