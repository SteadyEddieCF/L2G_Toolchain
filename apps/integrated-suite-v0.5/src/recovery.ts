namespace L2G {
  const DB_NAME = "l2g-integrated-suite-v04";
  const STORE_NAME = "encrypted-recovery";
  const RECORD_KEY = "current";

  export async function saveRecovery(document: ProjectDocument, protection: SessionProtection): Promise<void> {
    const bytes = await encryptProjectDocument(document, protection, "browser-recovery");
    const record: RecoveryRecord = { kind: "l2g_encrypted_recovery_v1", saved_at: nowIso(), bytes: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer };
    await withStore("readwrite", store => requestPromise(store.put(record, RECORD_KEY)));
  }

  export async function readRecoveryRecord(): Promise<RecoveryRecord | null> {
    try {
      const value = await withStore("readonly", store => requestPromise(store.get(RECORD_KEY)));
      if (!isRecord(value) || value.kind !== "l2g_encrypted_recovery_v1" || typeof value.saved_at !== "string" || !(value.bytes instanceof ArrayBuffer)) return null;
      return value as unknown as RecoveryRecord;
    } catch { return null; }
  }

  export async function restoreRecovery(protection: SessionProtection): Promise<ProjectDocument | null> {
    const record = await readRecoveryRecord(); if (!record) return null;
    const result = await decryptProjectBytes(new Uint8Array(record.bytes), protection, "browser-recovery", false);
    return result.document;
  }

  export async function clearRecovery(): Promise<void> {
    try { await withStore("readwrite", store => requestPromise(store.delete(RECORD_KEY))); } catch { /* best effort */ }
  }

  async function withStore<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => Promise<T>): Promise<T> {
    const db = await openDb();
    try {
      const transaction = db.transaction(STORE_NAME, mode); const store = transaction.objectStore(STORE_NAME);
      const result = await operation(store); await transactionPromise(transaction); return result;
    } finally { db.close(); }
  }

  function openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => { const db = request.result; if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME); };
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error ?? new Error("IndexedDB open failed."));
    });
  }
  function requestPromise<T>(request: IDBRequest<T>): Promise<T> { return new Promise((resolve,reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed.")); }); }
  function transactionPromise(transaction: IDBTransaction): Promise<void> { return new Promise((resolve,reject) => { transaction.oncomplete = () => resolve(); transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed.")); transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction was aborted.")); }); }
}
