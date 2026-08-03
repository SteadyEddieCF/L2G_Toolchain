namespace L2G {
  const OUTER_PATHS = ["ciphertext.bin", "envelope.json"];

  export async function importPassphrase(passphrase: string): Promise<CryptoKey> {
    validatePassphrase(passphrase);
    return crypto.subtle.importKey("raw", utf8(passphrase), "PBKDF2", false, ["deriveKey"]);
  }

  export async function deriveAesKey(baseKey: CryptoKey, salt: Uint8Array): Promise<CryptoKey> {
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", hash: "SHA-256", salt: salt.slice().buffer, iterations: 600000 },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  export async function encryptProject(
    document: ProjectDocument,
    baseKey: CryptoKey,
    purpose: EnvelopePurpose,
    options?: { salt?: Uint8Array; iv?: Uint8Array }
  ): Promise<{ bytes: Uint8Array; metadata: EnvelopeMetadata; key: CryptoKey; salt: Uint8Array }> {
    const inner = await serializeInnerProject(document);
    const salt = options?.salt?.slice() ?? randomBytes(16);
    const iv = options?.iv?.slice() ?? randomBytes(12);
    if (salt.length !== 16 || iv.length !== 12) throw new Error("Encryption salt or IV has an invalid length.");
    const key = await deriveAesKey(baseKey, salt);
    const metadata: EnvelopeMetadata = {
      kind: "l2g_encrypted_project_v1",
      version: "1.0",
      purpose,
      cipher: { name: "AES-GCM", key_bits: 256, tag_bits: 128, iv_b64: bytesToB64(iv) },
      kdf: { name: "PBKDF2", hash: "SHA-256", iterations: 600000, salt_b64: bytesToB64(salt) },
      inner: {
        media_type: "application/vnd.l2g.project+zip",
        project_kind: "l2g_project_v1",
        schema_version: "1.0",
        plaintext_bytes: inner.length,
        plaintext_sha256: await sha256Hex(inner)
      },
      application: { name: "L2G Integrated Suite", version: window.__L2G_RELEASE__.version }
    };
    const additionalData = utf8(stableStringify(metadata, 0));
    const ciphertext = new Uint8Array(await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv.slice().buffer, additionalData: additionalData.slice().buffer, tagLength: 128 },
      key,
      inner.slice().buffer
    ));
    const bytes = createStoredZip([
      { path: "ciphertext.bin", data: ciphertext },
      { path: "envelope.json", data: utf8(stableStringify(metadata)) }
    ]);
    if (bytes.length > ENCRYPTED_LIMITS.maxOuterBytes) throw new Error("Encrypted project exceeds the v0.2 size limit.");
    return { bytes, metadata, key, salt };
  }

  export function isEncryptedPackage(bytes: Uint8Array): boolean {
    try {
      const names = readStoredZip(bytes).map(entry => entry.path).sort();
      return names.length === 2 && names.every((path, index) => path === OUTER_PATHS[index]);
    } catch {
      return false;
    }
  }

  export async function decryptProject(
    bytes: Uint8Array,
    passphrase: string,
    expectedPurpose: EnvelopePurpose
  ): Promise<{ document: ProjectDocument; baseKey: CryptoKey; key: CryptoKey; salt: Uint8Array; metadata: EnvelopeMetadata }> {
    if (bytes.length > ENCRYPTED_LIMITS.maxOuterBytes) throw new Error("Encrypted project exceeds the v0.2 size limit.");
    const entries = readStoredZip(bytes);
    const entryMap = new Map(entries.map(entry => [entry.path, entry.data] as const));
    const paths = [...entryMap.keys()].sort();
    if (paths.length !== 2 || paths.some((path, index) => path !== OUTER_PATHS[index])) throw new Error("Encrypted container paths are invalid.");
    const metadata = parseStrictJson(decodeUtf8(entryMap.get("envelope.json")!)) as EnvelopeMetadata;
    validateEnvelopeMetadata(metadata, expectedPurpose);
    const ciphertext = entryMap.get("ciphertext.bin")!;
    if (ciphertext.length < 16) throw new Error("Encrypted content is truncated.");
    const baseKey = await importPassphrase(passphrase);
    const salt = b64ToBytes(metadata.kdf.salt_b64, 16);
    const iv = b64ToBytes(metadata.cipher.iv_b64, 12);
    const key = await deriveAesKey(baseKey, salt);
    const additionalData = utf8(stableStringify(metadata, 0));
    let plaintext: Uint8Array;
    try {
      plaintext = new Uint8Array(await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv.slice().buffer, additionalData: additionalData.slice().buffer, tagLength: 128 },
        key,
        ciphertext.slice().buffer
      ));
    } catch {
      throw new Error("The passphrase is incorrect or the encrypted content was modified.");
    }
    if (plaintext.length !== metadata.inner.plaintext_bytes || await sha256Hex(plaintext) !== metadata.inner.plaintext_sha256) {
      throw new Error("The passphrase is incorrect or the encrypted content was modified.");
    }
    const { document } = await deserializeInnerProject(plaintext, false);
    return { document, baseKey, key, salt, metadata };
  }

  export function validateEnvelopeMetadata(value: unknown, expectedPurpose: EnvelopePurpose): asserts value is EnvelopeMetadata {
    if (!isRecord(value) || value.kind !== "l2g_encrypted_project_v1" || value.version !== "1.0" || value.purpose !== expectedPurpose) throw new Error("Encrypted envelope kind, version, or purpose is unsupported.");
    const cipher = value.cipher;
    const kdf = value.kdf;
    const inner = value.inner;
    const application = value.application;
    if (!isRecord(cipher) || cipher.name !== "AES-GCM" || cipher.key_bits !== 256 || cipher.tag_bits !== 128 || typeof cipher.iv_b64 !== "string") throw new Error("Encrypted cipher profile is unsupported.");
    if (!isRecord(kdf) || kdf.name !== "PBKDF2" || kdf.hash !== "SHA-256" || kdf.iterations !== 600000 || typeof kdf.salt_b64 !== "string") throw new Error("Encrypted KDF profile is unsupported.");
    if (!isRecord(inner) || inner.media_type !== "application/vnd.l2g.project+zip" || inner.project_kind !== "l2g_project_v1" || inner.schema_version !== "1.0" || typeof inner.plaintext_bytes !== "number" || inner.plaintext_bytes < 1 || inner.plaintext_bytes > ARCHIVE_LIMITS.maxExpandedBytes || typeof inner.plaintext_sha256 !== "string" || !/^[0-9a-f]{64}$/.test(inner.plaintext_sha256)) throw new Error("Encrypted inner-project metadata is invalid.");
    if (!isRecord(application) || application.name !== "L2G Integrated Suite" || typeof application.version !== "string") throw new Error("Encrypted producer metadata is invalid.");
    b64ToBytes(cipher.iv_b64, 12);
    b64ToBytes(kdf.salt_b64, 16);
  }
}
