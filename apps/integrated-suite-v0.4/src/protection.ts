namespace L2G {
  const PROTECTED_OUTER_PATHS = ["ciphertext.bin", "envelope.json"];

  export async function deriveProjectKeys(passphrase: string): Promise<SessionProtection> {
    return { baseKey: await importPassphrase(passphrase) };
  }

  export function clearSessionProtection(protection: SessionProtection): void {
    delete protection.baseKey;
    delete protection.portableKey;
    delete protection.recoveryKey;
    delete protection.portableSalt;
    delete protection.recoverySalt;
  }

  export async function encryptProjectDocument(document: ProjectDocument, protection: SessionProtection, purpose: EnvelopePurpose): Promise<Uint8Array> {
    if (!protection.baseKey) throw new Error("The encrypted session is not unlocked.");
    const result = await encryptProject(document, protection.baseKey, purpose);
    rememberPurposeKey(protection, purpose, result.key, result.salt);
    return result.bytes;
  }

  export async function decryptProjectBytes(
    bytes: Uint8Array,
    protection: SessionProtection,
    expectedPurpose: EnvelopePurpose,
    allowLegacy: boolean
  ): Promise<{ document: ProjectDocument; legacy: boolean; metadata: EnvelopeMetadata }> {
    if (!protection.baseKey) throw new Error("The encrypted session is not unlocked.");
    if (bytes.length > ENCRYPTED_LIMITS.maxOuterBytes) throw new Error("Encrypted project exceeds the supported size limit.");
    const entries = readStoredZip(bytes);
    const entryMap = new Map(entries.map(entry => [entry.path, entry.data] as const));
    const paths = [...entryMap.keys()].sort();
    if (paths.length !== PROTECTED_OUTER_PATHS.length || paths.some((path, index) => path !== PROTECTED_OUTER_PATHS[index])) {
      throw new Error("Encrypted container paths are invalid.");
    }
    const envelopeBytes = entryMap.get("envelope.json");
    const ciphertext = entryMap.get("ciphertext.bin");
    if (!envelopeBytes || !ciphertext || ciphertext.length < 16) throw new Error("Encrypted content is truncated.");
    const metadata = parseStrictJson(decodeUtf8(envelopeBytes)) as EnvelopeMetadata;
    validateEnvelopeMetadata(metadata, expectedPurpose);
    const salt = b64ToBytes(metadata.kdf.salt_b64, 16);
    const iv = b64ToBytes(metadata.cipher.iv_b64, 12);
    const key = await deriveAesKey(protection.baseKey, salt);
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
    const result = await deserializeInnerProject(plaintext, allowLegacy);
    rememberPurposeKey(protection, expectedPurpose, key, salt);
    return { document: result.document, legacy: result.legacy, metadata };
  }

  function rememberPurposeKey(protection: SessionProtection, purpose: EnvelopePurpose, key: CryptoKey, salt: Uint8Array): void {
    if (purpose === "portable-project") {
      protection.portableKey = key;
      protection.portableSalt = salt.slice();
    } else {
      protection.recoveryKey = key;
      protection.recoverySalt = salt.slice();
    }
  }
}
