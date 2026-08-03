# L2G Integrated Suite v0.2.0 — Encrypted Project Safety Foundation Acceptance

## Purpose

This document is the exact promotion gate for v0.2.0. Every required criterion must pass on the unchanged final implementation head before the release pointer can become `current` and the implementation PR can merge.

Passing this matrix does not authorize production, client, FCI, or CUI data.

## Baselines

- prior Integrated Suite release: `0.1.0`;
- prior merge: `711b84ebbf675a8e005dbfba80a8dfbd42213bc9`;
- prior portable HTML SHA-256: `67a69e026d789901dcfe0bf8aecb574d1ae5a9647b225db18099f5cb43e89e15`;
- product/runtime compatibility baseline: `85d6e783a250b373cd4b9ea356e4c341336f9259`;
- governing issue: #123;
- governing cryptographic design: ADR-0007;
- threat model: `L2G_Integrated_Suite_v0.2.0_Threat_Model_v1.md`.

## A. Scope and release governance

- [ ] Release version is exactly `0.2.0`.
- [ ] The implementation is additive to the existing repository and preserves standalone releases.
- [ ] No existing standalone runtime, current pointer, stable contract, or historical suite snapshot changes.
- [ ] Included and excluded scope match issue #123 and ADR-0007.
- [ ] Current pointer remains `release-candidate` until candidate validation is complete.
- [ ] Promotion metadata does not change validated runtime bytes.
- [ ] Release notes explicitly state synthetic-only and no production/client/FCI/CUI authorization.
- [ ] Exact portable HTML SHA-256, SBOM, release manifest, validation report, and downloadable ZIP are produced.

## B. Encrypted envelope and algorithms

- [ ] Outer `.l2g` ZIP contains exactly `envelope.json` and `ciphertext.bin`.
- [ ] Outer entries are ZIP_STORED and path-safe.
- [ ] Envelope kind is `l2g_encrypted_project_v1` and format version is `1.0`.
- [ ] Portable purpose is `portable-project`; recovery purpose is `browser-recovery`.
- [ ] Cipher is AES-256-GCM through `crypto.subtle`.
- [ ] Authentication tag is 128 bits.
- [ ] IV is exactly 96 random bits.
- [ ] KDF is PBKDF2-HMAC-SHA-256 with exactly 600,000 iterations.
- [ ] Salt is exactly 128 random bits.
- [ ] Derived keys are non-extractable.
- [ ] Canonical envelope metadata is used as AES-GCM additional authenticated data.
- [ ] Unsupported or attacker-controlled algorithms and parameters are rejected before derivation or active-state mutation.
- [ ] Inner plaintext is the complete canonical `l2g_project_v1` ZIP.
- [ ] Inner project validation and SHA-256 integrity checks still run after successful decryption.

## C. Passphrase and session behavior

- [ ] First encrypted save requires passphrase entry and confirmation.
- [ ] Passphrase minimum is 12 characters and maximum encoded size is 256 UTF-8 bytes.
- [ ] Passphrases are not silently trimmed or normalized.
- [ ] Confirmation mismatch is rejected without creating a file or recovery record.
- [ ] The creation flow states that forgotten passphrases cannot be recovered.
- [ ] Opening encrypted portable projects and encrypted recovery requires a passphrase.
- [ ] Wrong passphrase and authenticated-content modification use one generic error.
- [ ] No passphrase, raw key, or decrypted content is placed in localStorage, URLs, logs, filenames, or release evidence.
- [ ] Lock persists encrypted recovery when possible, releases key references, and reloads the application.
- [ ] Unlock after lock requires the passphrase again.
- [ ] UI and release notes state JavaScript/endpoint memory limitations.

## D. Portable project behavior

- [ ] New v0.2 saves create only encrypted `.l2g` projects.
- [ ] Default filename is generic and does not contain client, engagement, or system names.
- [ ] File System Access API success is distinguished from download initiation.
- [ ] Valid encrypted save/open/save round trip preserves project content and history.
- [ ] Saving identical plaintext twice produces different encrypted bytes.
- [ ] Both encrypted saves decrypt to equivalent inner project bytes or equivalent validated project documents.
- [ ] Known plaintext markers do not appear in outer project bytes.
- [ ] A valid v0.1.0 unencrypted synthetic project imports successfully.
- [ ] Legacy import is visibly unprotected and has no encrypted recovery until encrypted save.
- [ ] Saving an imported legacy project produces a valid encrypted v0.2 project.

## E. Encrypted recovery

- [ ] IndexedDB stores only an encrypted recovery envelope and non-sensitive bookkeeping.
- [ ] No governed plaintext marker is present in the serialized IndexedDB record.
- [ ] Before a session key exists, recovery is disabled and UI language is truthful.
- [ ] Encrypted recovery autosave uses a fresh IV for every revision.
- [ ] Recovery unlock successfully restores a valid project only after complete validation.
- [ ] Wrong passphrase, cancellation, or tamper leaves active state unchanged and leaves the encrypted recovery record available.
- [ ] Recovery purpose cannot be replayed as a portable project.
- [ ] Portable purpose cannot be replayed as recovery.
- [ ] Recovery clear/discard removes the encrypted record.
- [ ] localStorage contains no governed records, keys, ciphertext, or passphrases.

## F. Adversarial and malformed-input tests

Each case must be rejected before active-state mutation:

- [ ] wrong passphrase;
- [ ] modified authenticated metadata;
- [ ] modified salt;
- [ ] modified IV;
- [ ] modified ciphertext;
- [ ] modified authentication tag;
- [ ] truncated outer ZIP;
- [ ] truncated ciphertext;
- [ ] duplicate outer path;
- [ ] duplicate `envelope.json` key;
- [ ] outer path traversal;
- [ ] compressed outer entry;
- [ ] nested archive entry;
- [ ] unsupported envelope kind or version;
- [ ] unsupported purpose;
- [ ] unsupported cipher, key size, or tag size;
- [ ] unsupported KDF or hash;
- [ ] weak, zero, negative, non-integer, or excessive iteration count;
- [ ] invalid salt or IV length;
- [ ] invalid base64;
- [ ] plaintext-size mismatch;
- [ ] plaintext-hash mismatch;
- [ ] oversized outer payload;
- [ ] oversized inner archive;
- [ ] invalid inner paths, duplicate paths, compressed entries, duplicate JSON keys, registry, history, checkpoints, IDs, enums, or integrity.

## G. Fixed vectors and deterministic build

- [ ] Repository contains a fixed synthetic encrypted-project vector with documented passphrase, salt, IV, AAD, plaintext hash, and ciphertext hash.
- [ ] Fixed vector is generated or verified independently of the browser runtime path.
- [ ] Runtime encryption tests use random salts and IVs and assert nondeterminism.
- [ ] Source/build inputs are deterministic and two clean builds produce byte-identical HTML, manifest, SBOM, and unencrypted test-support artifacts.
- [ ] Deterministic-build checks do not require runtime ciphertext bytes to be deterministic.
- [ ] Release package checksums match exact artifact bytes.

## H. UI, accessibility, and local operation

- [ ] Protection state is visible and does not claim protection before a key exists.
- [ ] Passphrase creation, unlock, wrong-passphrase, recovery, and lock flows are keyboard operable.
- [ ] Tested primary surfaces have zero serious or critical axe-core findings.
- [ ] Light and dark visual contracts pass.
- [ ] Native Windows Chromium `file://` encrypted save/open/recovery smoke passes.
- [ ] Application opens and operates without a server, install, admin rights, or native helper.
- [ ] CSP remains restrictive with `connect-src 'none'`.
- [ ] Runtime performs zero unexpected network requests and loads no external assets, fonts, scripts, styles, telemetry, analytics, frames, or forms.

## I. Public-repository hygiene and documentation

- [ ] Fixtures, screenshots, reports, and logs are synthetic and contain no client data, FCI, CUI, credentials, secrets, tokens, private keys, private paths, or client-identifying content.
- [ ] Test passphrase is explicitly synthetic and not represented as a real secret.
- [ ] Threat model and ADR accurately describe residual risks and non-goals.
- [ ] Help/About/release notes state that presentation profiles are not security roles.
- [ ] Help/About/release notes state that encryption does not create compliance, readiness, certification, scoring, evidence-sufficiency, or production authorization.
- [ ] SBOM includes build dependencies and confirms zero runtime dependencies.

## J. Existing-suite non-regression

- [ ] Repository validation passes.
- [ ] All inherited SSP materializers pass.
- [ ] Workshop v79.1 candidate validation passes.
- [ ] RG-4 merged-main six-tool validation passes.
- [ ] SSP RG-4 History Harness passes.
- [ ] Shared Playwright current six-tool runtime/axe tests pass.
- [ ] Shared visual regression passes.
- [ ] Shared Windows `file://` smoke passes.
- [ ] Existing current module identities and suite snapshots remain unchanged.

## K. Promotion sequence

1. Implement on a branch from current `main`.
2. Keep the v0.2 pointer at `release-candidate`.
3. Run complete candidate validation on an unchanged candidate head.
4. Inspect exact Actions artifacts, fixed vectors, browser report, and checksums.
5. Add only durable validation evidence and change the pointer to `current` without changing runtime bytes.
6. Run the complete required matrix again on the unchanged final promotion head.
7. Confirm zero unresolved review threads and mergeability.
8. Mark the PR ready and merge with expected-head protection.
9. Verify `main`, issue closure, current pointer, and release package.
10. Reconcile the rolling ten-release roadmap and add the next release so ten planned releases remain visible.

## Explicit non-acceptance

This matrix does not accept or authorize:

- production, client, FCI, or CUI data;
- endpoint security or resistance to malware/keyloggers;
- password recovery or escrow;
- cloud synchronization or collaboration;
- original evidence embedding;
- substantive DocConverter, Scoper, Workshop, SSP, Builder/Merger, or Control Center migration;
- readiness, compliance, assessment, certification, scoring, Met/Not Met, or evidence-sufficiency conclusions;
- retirement of any standalone release.
