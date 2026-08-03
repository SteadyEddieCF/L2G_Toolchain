# L2G Integrated Suite v0.2.0 — Encrypted Project Threat Model

## Scope

This threat model covers the v0.2.0 encrypted `.l2g` portable project, browser-local encrypted recovery, passphrase/session behavior, local file open/save flows, and the single-file Chromium `file://` runtime.

It does not cover future production document parsing, OCR, original evidence embedding, cloud synchronization, multi-user collaboration, enterprise identity, endpoint management, or standalone module internals.

## Protected assets

- inner `l2g_project_v1` project bytes;
- engagement identity and participant records;
- review/action records, history, and checkpoints;
- future domain records that will use the same project envelope;
- passphrase-derived key material during the active session;
- encrypted browser recovery;
- project integrity, format version, and authenticated metadata;
- truthful user understanding of save, recovery, protection, and lock state.

## Trust boundaries

1. **User and browser UI** — passphrase entry, file selection, save destination, recovery choice.
2. **Single-file application runtime** — trusted code generated from reviewed repository source.
3. **Web Crypto implementation** — browser-provided random generation, PBKDF2, AES-GCM, and SHA-256.
4. **Portable file boundary** — attacker-controlled `.l2g` bytes selected by the user.
5. **IndexedDB recovery boundary** — attacker-readable or attacker-modifiable local browser storage in the assumed threat model.
6. **Endpoint/OS boundary** — outside the application’s direct control.
7. **Repository and CI boundary** — public and synthetic-only; no production secrets or decrypted content.

## Security objectives

- Confidentiality of governed project contents at rest in portable files and IndexedDB.
- Integrity and authenticity of encrypted project bytes and envelope metadata.
- Rejection of malformed or unsupported content before active-state mutation.
- No plaintext governed project persistence outside active memory.
- No secret or plaintext leakage through filenames, URLs, localStorage, logs, screenshots, errors, or CI evidence.
- Explicit user understanding that presentation profiles are not security roles and encryption is not production authorization.
- Availability protections against oversized archives, excessive KDF parameters, recursive archives, duplicate paths/keys, and repeated prompt loops.

## Assumed attacker capabilities

The design assumes an attacker may:

- copy, inspect, modify, truncate, replay, or replace a `.l2g` file;
- read or modify IndexedDB content;
- submit arbitrary filenames and archive paths;
- change unauthenticated bytes and attempt chosen corruptions;
- know the format, algorithms, source code, test vectors, and repository contents;
- perform offline passphrase guessing against a stolen encrypted file;
- trick a user into opening a malicious project;
- observe default filenames and user-facing errors;
- interrupt save or recovery operations.

## Explicitly out-of-scope attacker capabilities

The v0.2.0 envelope does not claim to protect decrypted data against:

- malware, browser extensions, keyloggers, screen capture, or a compromised browser/OS;
- physical-memory inspection, swap/hibernation capture, or forensic recovery from a running endpoint;
- malicious code that has already replaced the trusted HTML runtime;
- weak or reused user passphrases;
- coerced disclosure;
- denial of service by deleting all copies of the project and recovery record;
- cryptographic breaks in browser implementations or standards.

These limitations are reasons v0.2.0 remains synthetic-only.

## Threats and mitigations

### T1 — Stolen portable project reveals project content

**Threat:** An attacker copies the `.l2g` file and reads ZIP entries.

**Mitigations:** Whole-inner-project AES-256-GCM encryption; only `envelope.json` and `ciphertext.bin` are visible; generic default filename; no client-identifying outer metadata.

**Residual risk:** Offline passphrase guessing remains possible. Strength depends on passphrase entropy and PBKDF2 cost.

### T2 — IndexedDB exposes plaintext recovery

**Threat:** Local browser storage is inspected or copied.

**Mitigations:** Recovery is stored only as an encrypted envelope. Before a session key exists, recovery is disabled and prior recovery is not replaced with plaintext.

**Residual risk:** A compromised active browser can access decrypted state and session keys.

### T3 — Wrong passphrase or tampered file produces an oracle

**Threat:** Distinct failure messages reveal whether a passphrase was correct or which authenticated field failed.

**Mitigations:** AES-GCM authentication; one generic wrong-passphrase-or-modified-content message; no partial plaintext parsing before authentication.

### T4 — Metadata modification changes how ciphertext is interpreted

**Threat:** An attacker lowers KDF cost, changes purpose, swaps algorithms, changes lengths, or replays recovery as a portable project.

**Mitigations:** Canonical envelope metadata is AES-GCM AAD; exact supported v1 profiles; purpose is authenticated; unsupported fields rejected before derivation.

### T5 — IV reuse under the same AES-GCM key

**Threat:** Reusing an IV under the same key can catastrophically undermine AES-GCM.

**Mitigations:** 96-bit IV generated with `crypto.getRandomValues` for every encryption; runtime tests confirm repeated saves differ; no caller-supplied IV in production flows.

**Residual risk:** Extremely low random-collision probability and browser RNG dependence.

### T6 — Weak or attacker-controlled KDF parameters

**Threat:** A malicious envelope uses a weak iteration count or an excessive count for denial of service.

**Mitigations:** v1 accepts exactly PBKDF2-HMAC-SHA-256 at 600,000 iterations, 128-bit salt, and 256-bit output; limits are checked before derivation.

**Residual risk:** PBKDF2 is not memory-hard and parameter suitability changes over time. Versioned migration is required.

### T7 — Malformed archive mutates project state

**Threat:** Traversal, duplicate paths, compressed/nested entries, duplicate JSON keys, unsupported domain paths, tampered inner hashes, or malformed history bypass validation.

**Mitigations:** Validate outer archive, envelope, AES-GCM authentication, inner archive, exact paths, strict JSON, schemas, IDs, history, checkpoints, registry, and SHA-256 integrity before replacing active state.

### T8 — Excessive file/KDF work causes denial of service

**Threat:** Large ciphertext, oversized inner ZIP, excessive entries, long paths, huge passphrases, or attacker-selected work factors consume memory/CPU.

**Mitigations:** Pre-derivation outer size and profile limits; passphrase byte limit; bounded ZIP entries and expanded bytes; no compression; no nested archives; bounded JSON collections.

### T9 — Plaintext leaks in filenames, logs, screenshots, or errors

**Threat:** Engagement/client names or decrypted content appear outside the encrypted file.

**Mitigations:** Generic filenames with short project IDs; sanitized bounded errors; no telemetry/network; no project content in URLs; public-hygiene scans; synthetic-only screenshots and fixtures.

### T10 — Save language overstates durability

**Threat:** A browser download initiation is presented as a verified file write.

**Mitigations:** Distinguish File System Access API completed writes from download initiation; encrypted recovery status reported separately; backup language remains explicit.

### T11 — Forgotten passphrase causes irreversible loss

**Threat:** User expects a reset mechanism that does not exist.

**Mitigations:** Confirmation flow states that the passphrase cannot be recovered; no false reset or escrow claim; backup guidance; lock/unlock behavior tested.

**Residual risk:** Permanent loss remains by design.

### T12 — Lock leaves decrypted data intentionally active

**Threat:** Clearing only a key while leaving the project rendered creates a false lock.

**Mitigations:** Lock persists encrypted recovery, releases key references, and reloads the page so the active document and DOM are discarded. Product language states that JavaScript cannot guarantee heap or OS memory erasure.

### T13 — Legacy v0.1 project remains unprotected

**Threat:** A user opens an unencrypted synthetic project and assumes it is protected.

**Mitigations:** Legacy import is visibly unprotected; encrypted recovery remains disabled; every v0.2 save requires a new passphrase and emits only the encrypted envelope.

### T14 — Build or dependency compromise changes crypto behavior

**Threat:** Unreviewed dependencies or runtime-loaded code alter encryption.

**Mitigations:** Zero runtime dependencies; locked TypeScript build dependency; inline hashed CSP; deterministic HTML build; SBOM; exact-head CI; no runtime network; source-controlled fixed vectors.

## Misuse cases

- User chooses a low-entropy 12-character passphrase.
- User stores the passphrase beside the project file.
- User assumes Client View prevents access to advisor-only data.
- User sends the unlocked HTML/browser session to another person.
- User treats encryption as CUI authorization.
- User saves over the only good copy and forgets the passphrase.
- User exports a screenshot containing sensitive data.
- User opens the project on a compromised endpoint.

The UI and release notes must directly warn against these interpretations.

## Security test inventory

- fixed valid encrypted portable vector;
- valid encrypted recovery vector;
- wrong passphrase;
- modified AAD field;
- modified salt, IV, ciphertext, and tag;
- truncated envelope and ciphertext;
- duplicate outer path and duplicate JSON key;
- path traversal and compressed outer entry;
- unsupported kind/version/purpose/cipher/KDF/hash/iterations/key/tag/IV;
- oversized outer and inner payload;
- recovery/portable purpose replay;
- repeated encryption nondeterminism;
- known plaintext absence;
- legacy import and encrypted resave;
- recovery cancel/wrong-pass state preservation;
- lock/reload/unlock;
- localStorage and IndexedDB plaintext inspection;
- zero-network and CSP enforcement;
- Windows `file://`, axe-core, visual, and existing-suite regression.

## Release qualification

Passing this threat model’s tests demonstrates the bounded v0.2.0 security design operates as specified against synthetic fixtures. It does not demonstrate endpoint security, operational suitability, CUI authorization, compliance, certification, or resistance to all cryptanalysis.
