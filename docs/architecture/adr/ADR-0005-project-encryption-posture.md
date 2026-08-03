# ADR-0005 — Project Encryption Posture

## Status

Proposed safety boundary. Cryptographic design remains unresolved.

## Date

2026-08-03.

## Context

The proposed `.l2g` project normally excludes original evidence files but can contain extracted text, structured records, source locations, interview notes, scope decisions, SSP narratives, findings, and deliverable content. Those records may contain CUI or other sensitive client information.

A ZIP container with integrity hashes is not encryption. Browser-local recovery can also retain sensitive content outside the exported project file.

The repository is currently reported as public and all current validation fixtures are synthetic. The product must not create an implied production-CUI authorization before encryption, key handling, recovery, browser storage, and failure behavior are designed and independently reviewed.

## Proposed decision

1. Milestone 0 is synthetic-data-only and must carry no claim of production-CUI suitability.
2. The conceptual project manifest reserves an explicit encryption descriptor and format capability, but Milestone 0 does not invent or silently deploy an unreviewed encryption scheme.
3. Before any real client or CUI project use, a dedicated cryptographic ADR and implementation must define:
   - encrypted envelope and authenticated metadata boundaries;
   - approved algorithms and parameter profiles;
   - passphrase or key-source handling;
   - key derivation and memory-hardness requirements;
   - nonce generation and uniqueness;
   - recovery limitations and forgotten-key behavior;
   - browser-local recovery encryption;
   - backup and copy semantics;
   - versioning and migration;
   - corruption and tamper behavior;
   - independent security testing.
4. Integrity hashes remain required whether or not a project is encrypted.
5. The application must never log, commit, upload, or include project secrets or decrypted client content in CI evidence.
6. The application must make the project protection state visible and must not label an unencrypted project as protected.
7. If an encrypted project is open, decrypted content remains memory-only except for an explicitly designed encrypted recovery store.
8. No password recovery promise may be made unless a governed recovery mechanism actually exists.

## Recommended production posture for later review

The security ADR should evaluate encrypted projects as the default whenever extracted client content is stored, with an explicit synthetic/demo mode for unencrypted projects. This recommendation is not a frozen algorithm or key-management decision.

## Consequences

### Positive

- Prevents accidental production claims based only on ZIP packaging and hashes.
- Creates a clear security gate before client data enters the integrated format.
- Keeps Milestone 0 focused on format, integrity, recovery behavior, and architecture.

### Negative

- Milestone 0 cannot be used for real client data.
- Encryption implementation and independent review become a later release dependency.
- Recovery and usability tradeoffs remain unresolved.

## Acceptance evidence

Before production-data authorization:

- accepted cryptographic ADR;
- threat model and misuse cases;
- deterministic format tests excluding secret material;
- wrong-key, tamper, truncation, replay, migration, and corruption tests;
- encrypted IndexedDB recovery tests;
- memory and error-message review;
- independent security review;
- explicit product qualification language.

## Non-decisions

This ADR does not select AES, ChaCha20, Argon2, PBKDF2, WebAuthn, a cloud key service, a password manager integration, or a recovery escrow design.
