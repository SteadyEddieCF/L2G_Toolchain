# ADR-0007 — Encrypted Project Envelope and Recovery

## Status

Accepted for L2G Integrated Suite v0.2.0 implementation. Production/client/FCI/CUI use remains unauthorized.

## Date

2026-08-03.

## Context

L2G Integrated Suite v0.1.0 provides a deterministic ZIP-based `l2g_project_v1` project with SHA-256 integrity records and browser-local recovery. Integrity alone does not provide confidentiality. Project records can eventually contain extracted text, interview notes, scope decisions, SSP narratives, findings, actions, and deliverable content.

The next release must establish a versioned confidentiality boundary before substantive module migration. The application must remain one local HTML file, operate from Chromium `file://`, make no runtime network requests, use no native helper, and preserve standalone module authority.

Current technical references include:

- W3C Web Cryptography API and Web Cryptography Level 2;
- NIST SP 800-38D for AES-GCM;
- NIST SP 800-132 for password-based key derivation for storage applications;
- OWASP Password Storage Cheat Sheet guidance for PBKDF2-HMAC-SHA-256 work factors.

NIST has announced that SP 800-132 will be revised to consider memory-hard derivation and further PBKDF2 guidance. The envelope therefore records an explicit KDF profile and requires a versioned migration path rather than treating parameters as timeless.

## Decision

### Envelope structure

1. An encrypted portable project remains a `.l2g` ZIP_STORED container.
2. The encrypted outer container contains exactly:
   - `envelope.json`;
   - `ciphertext.bin`.
3. `ciphertext.bin` is the AES-GCM encryption of the complete canonical inner `l2g_project_v1` ZIP bytes.
4. Whole-container encryption is selected for v1 so domain paths, record sizes, history, registry metadata, and project identity are not exposed independently.
5. The inner project retains its existing SHA-256 integrity manifest. Successful AES-GCM authentication does not remove the inner structural, schema, duplicate-key, archive-safety, and integrity validations.

### Cryptographic profile

6. Envelope kind: `l2g_encrypted_project_v1`.
7. Envelope format version: `1.0`.
8. Content encryption: AES-256-GCM through browser-native `crypto.subtle`.
9. Authentication tag length: 128 bits.
10. IV/nonce: 96 random bits from `crypto.getRandomValues`; a fresh IV is mandatory for every encryption under a key.
11. Password-based key derivation: PBKDF2-HMAC-SHA-256.
12. v1 work factor: exactly 600,000 iterations.
13. Salt: 128 random bits.
14. Derived AES key length: 256 bits; derived and imported keys are non-extractable.
15. Passphrases must contain at least 12 Unicode code units and encode to no more than 256 UTF-8 bytes. The application does not silently trim or normalize passphrases.
16. Unsupported KDF profiles, iteration counts, algorithms, key lengths, tag lengths, IV lengths, purposes, or envelope versions are rejected before expensive cryptographic work or governed-state mutation.
17. v1 does not implement Argon2, scrypt, a pepper, hardware-backed keys, WebAuthn/passkeys, enterprise KMS, escrow, or password recovery. A future envelope version may add a memory-hard KDF after a separately reviewed compatibility design.

### Authenticated metadata

18. AES-GCM additional authenticated data is the canonical UTF-8 JSON representation of all `envelope.json` fields except ciphertext.
19. Authenticated metadata includes:
   - envelope kind and version;
   - purpose (`portable-project` or `browser-recovery`);
   - cipher and tag profile;
   - KDF profile, salt, and iteration count;
   - IV;
   - inner media type, project kind, schema version, plaintext byte length, and plaintext SHA-256;
   - producing application and version.
20. Metadata is parsed with duplicate-key and prototype-pollution rejection before use.
21. Purpose is authenticated so a browser-recovery ciphertext cannot be replayed as a portable project and vice versa.

### Passphrase and session behavior

22. Creating the first encrypted save requires passphrase entry and confirmation.
23. Opening an encrypted project or encrypted browser recovery requires a passphrase.
24. Wrong passphrase, modified ciphertext, modified authenticated metadata, or tag failure returns one generic error: the passphrase is incorrect or the encrypted content was modified.
25. The app retains only a non-extractable PBKDF2 base `CryptoKey` and derived non-extractable AES keys for the active browser session. Plaintext passphrase variables are released after import on a best-effort basis.
26. JavaScript cannot guarantee immediate heap erasure, prevent browser/OS memory snapshots, or provide hardware-backed isolation. Product language must state these limitations.
27. `Lock project` first attempts encrypted recovery persistence, clears the in-memory key references, and reloads the page so the active document is discarded. Unlocking the encrypted recovery requires the passphrase again.
28. Forgotten passphrases cannot be reset or recovered in v1. The UI must state this before passphrase confirmation.

### Browser recovery

29. IndexedDB recovery is encrypted or absent; plaintext governed project documents are prohibited.
30. Recovery stores an encrypted envelope plus non-sensitive recovery bookkeeping only.
31. Recovery uses purpose `browser-recovery`, a random salt, and a fresh IV for every persisted revision.
32. The active session may cache the recovery AES key to avoid running 600,000 PBKDF2 iterations on every debounced autosave. The recovery salt remains authenticated in the stored envelope.
33. Before a session key exists, recovery is disabled and the UI must say so. The app must not claim that browser recovery is current.
34. Cancelling or failing recovery unlock leaves the encrypted recovery record unchanged and does not mutate the active project.
35. localStorage remains prohibited for governed records, passphrases, keys, ciphertexts, or recovery envelopes.

### Compatibility and filenames

36. v0.2.0 may open a valid v0.1.0 unencrypted synthetic project for migration testing.
37. An imported unencrypted project has no encrypted recovery until it is saved with a new passphrase.
38. Every v0.2.0 portable save is encrypted. The application does not create new unencrypted `.l2g` projects.
39. Default encrypted filenames use a generic product label and a short non-sensitive project identifier. Client, engagement, and system names are not placed in default filenames.
40. File-save messaging distinguishes verified File System Access API writes from download initiation.

### Safety and release qualification

41. v0.2.0 remains synthetic-only and does not authorize client data, FCI, or CUI.
42. Encryption is necessary but not sufficient for production authorization. A later governance decision must consider implementation review, browser threat posture, endpoint controls, operational procedures, distribution, support, incident response, and pilot evidence.
43. No secrets, decrypted project content, production data, or client-identifying artifacts may enter repository history, issues, pull requests, Actions logs, screenshots, or release evidence.

## Consequences

### Positive

- Project contents and recovery records are confidential and authenticated at rest against ordinary file or browser-storage inspection.
- The existing canonical project and domain validation remain reusable after decryption.
- Explicit algorithm and KDF profiles support future migration.
- Whole-container encryption minimizes metadata disclosure.
- Recovery can remain useful without creating an unencrypted second authority.

### Negative

- Forgotten passphrases permanently prevent access.
- PBKDF2 is CPU-hard rather than memory-hard and requires later review as standards evolve.
- Browser JavaScript cannot guarantee memory zeroization or defend a compromised endpoint.
- Encrypted saves are intentionally nondeterministic because salts and IVs are random; deterministic release builds must validate format through fixed synthetic vectors instead of fixed runtime ciphertext bytes.
- Large projects require full in-memory inner ZIP serialization before encryption.

## Required acceptance evidence

- exact envelope schema and canonicalization tests;
- fixed published synthetic cryptographic vector;
- successful encrypted save/open and recovery round trips;
- identical plaintext saved twice produces different ciphertext;
- ciphertext and recovery do not contain known plaintext markers;
- wrong-passphrase, AAD tamper, ciphertext tamper, tag tamper, truncation, unsupported profile, oversized payload, duplicate path/key, compressed entry, and purpose-replay rejection;
- failed unlock/import leaves active governed state unchanged;
- v0.1.0 unencrypted import followed by encrypted v0.2.0 save;
- lock/reload/re-unlock behavior;
- no governed plaintext in IndexedDB or localStorage;
- native Windows Chromium `file://`, zero-network, axe-core, visual, deterministic build, public-hygiene, SBOM, and existing-suite non-regression evidence;
- independent security review before any production-data authorization.

## Supersedes and non-decisions

This ADR resolves the cryptographic design items reserved by ADR-0005 for v0.2.0. ADR-0005 remains the historical safety-boundary record.

This ADR does not authorize production/client/FCI/CUI use, select a future memory-hard KDF, create multi-user access control, enable cloud sync, provide key escrow, embed original evidence, migrate a standalone module, or create compliance/readiness/assessment conclusions.
