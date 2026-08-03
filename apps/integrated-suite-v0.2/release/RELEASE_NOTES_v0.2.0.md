# L2G Integrated Suite v0.2.0 — Encrypted Project Safety Foundation

## Included

- whole-project AES-256-GCM encrypted `.l2g` envelope;
- PBKDF2-HMAC-SHA-256 with 600,000 iterations, 128-bit random salt, and 96-bit random IV;
- authenticated canonical envelope metadata and inner-project SHA-256 validation;
- encrypted browser recovery, passphrase creation/unlock, and explicit lock/reload;
- generic non-client filenames;
- valid v0.1 synthetic-project migration into encrypted v0.2 saves;
- eight-workspace shell, profiles, Undo/Redo, checkpoints, history, and current compatibility catalog;
- restrictive CSP, zero runtime network dependencies, deterministic application build, and synthetic fixtures.

## Important limitations

This release remains synthetic-only. It does not authorize client data, FCI, CUI, production use, assessment conclusions, readiness, compliance, certification, scoring, evidence sufficiency, or Met/Not Met decisions. Forgotten passphrases cannot be reset or recovered. Browser JavaScript cannot guarantee memory zeroization or protect an unlocked project on a compromised endpoint.
