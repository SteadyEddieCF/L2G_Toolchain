# ADR-0005 — Project Encryption Posture

## Status

Accepted historical safety boundary. The v0.2.0 cryptographic design is resolved by ADR-0007. Production/client/FCI/CUI use remains unauthorized.

## Date

2026-08-03.

## Context

The proposed `.l2g` project normally excludes original evidence files but can contain extracted text, structured records, source locations, interview notes, scope decisions, SSP narratives, findings, and deliverable content. Those records may contain CUI or other sensitive client information.

A ZIP container with integrity hashes is not encryption. Browser-local recovery can also retain sensitive content outside the exported project file.

The repository is public and all current validation fixtures are synthetic. The product must not create an implied production-CUI authorization before encryption, key handling, recovery, browser storage, failure behavior, and operational use are independently reviewed.

## Decision

1. Milestone 0 and v0.1.0 are synthetic-data-only and carry no claim of production-CUI suitability.
2. The project manifest reserves an explicit encryption descriptor and format capability.
3. ADR-0007 defines the v0.2.0 encrypted envelope, authenticated metadata, approved algorithm profile, passphrase handling, key derivation, nonce generation, browser-local encrypted recovery, lock behavior, versioning, corruption behavior, and security tests.
4. Integrity hashes remain required inside the canonical project whether or not the outer project is encrypted.
5. The application must never log, commit, upload, or include project secrets or decrypted client content in CI evidence.
6. The application must make the project protection state visible and must not label an unencrypted or not-yet-keyed project as protected.
7. Decrypted content remains memory-only except for the explicitly encrypted recovery design in ADR-0007.
8. No password recovery promise may be made; v0.2.0 has no reset, escrow, or recovery mechanism.
9. Passing v0.2.0 cryptographic tests does not itself authorize production, client, FCI, or CUI data.

## Consequences

### Positive

- Prevented accidental production claims based only on ZIP packaging and hashes.
- Created a clear security gate before substantive domain migration.
- Allowed Milestone 0 to focus on format, integrity, recovery behavior, and architecture.
- Provides an auditable progression from unresolved posture to the concrete ADR-0007 design.

### Negative

- v0.1.0 cannot be used for real client data.
- v0.2.0 remains synthetic-only pending implementation review and later authorization.
- Browser and endpoint limitations remain material even with encryption.

## Acceptance evidence

Before any production-data authorization:

- accepted ADR-0007;
- v0.2.0 threat model and misuse cases;
- fixed cryptographic vectors and runtime nondeterminism tests;
- wrong-key, tamper, truncation, replay, migration, corruption, and denial-of-service tests;
- encrypted IndexedDB recovery tests;
- memory and error-message review;
- exact-head Linux and Windows `file://` evidence;
- independent security review;
- explicit product qualification language and operational approval.

## Non-decisions

This ADR and ADR-0007 do not authorize production/client/FCI/CUI use, cloud synchronization, multi-user access control, hardware-backed keys, key escrow, original evidence embedding, or standalone module retirement.
