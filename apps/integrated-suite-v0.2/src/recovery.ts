namespace L2G {
  export class RecoveryStore {
    private readonly dbName = "l2g-integrated-suite-v0-2";
    private readonly storeName = "recovery";
    private readonly key = "latest";

    async save(bytes: Uint8Array): Promise<void> {
      const database = await this.open();
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction(this.storeName, "readwrite");
        transaction.objectStore(this.storeName).put({
          kind: "l2g_encrypted_recovery_v1",
          saved_at: nowIso(),
          bytes: bytes.slice().buffer
        } satisfies RecoveryRecord, this.key);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error ?? new Error("Recovery save failed."));
        transaction.onabort = () => reject(transaction.error ?? new Error("Recovery save aborted."));
      });
      database.close();
    }

    async load(): Promise<RecoveryRecord | undefined> {
      const database = await this.open();
      const value = await new Promise<RecoveryRecord | undefined>((resolve, reject) => {
        const transaction = database.transaction(this.storeName, "readonly");
        const request = transaction.objectStore(this.storeName).get(this.key);
        request.onsuccess = () => resolve(request.result as RecoveryRecord | undefined);
        request.onerror = () => reject(request.error ?? new Error("Recovery read failed."));
      });
      database.close();
      if (!value) return undefined;
      if (value.kind !== "l2g_encrypted_recovery_v1" || typeof value.saved_at !== "string" || !(value.bytes instanceof ArrayBuffer)) throw new Error("Recovery record is invalid.");
      const bytes = new Uint8Array(value.bytes);
      if (!isEncryptedPackage(bytes)) throw new Error("Recovery record is not an encrypted L2G package.");
      return value;
    }

    async clear(): Promise<void> {
      const database = await this.open();
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction(this.storeName, "readwrite");
        transaction.objectStore(this.storeName).delete(this.key);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error ?? new Error("Recovery clear failed."));
      });
      database.close();
    }

    private open(): Promise<IDBDatabase> {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, 1);
        request.onupgradeneeded = () => {
          if (!request.result.objectStoreNames.contains(this.storeName)) request.result.createObjectStore(this.storeName);
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error("Recovery database could not be opened."));
        request.onblocked = () => reject(new Error("Recovery database is blocked by another tab."));
      });
    }
  }

  export class ProjectStore {
    private documentValue: ProjectDocument;
    private undoStack: Array<{ description: string; before: ProjectState; after: ProjectState; event_id: string }> = [];
    private redoStack: Array<{ description: string; before: ProjectState; after: ProjectState; event_id: string }> = [];
    private listeners = new Set<() => void>();

    constructor(document: ProjectDocument) { this.documentValue = document; }
    get document(): ProjectDocument { return this.documentValue; }
    get canUndo(): boolean { return this.undoStack.length > 0; }
    get canRedo(): boolean { return this.redoStack.length > 0; }
    get undoDescription(): string | undefined { return this.undoStack.at(-1)?.description; }
    get redoDescription(): string | undefined { return this.redoStack.at(-1)?.description; }

    subscribe(listener: () => void): () => void {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }

    replaceDocument(document: ProjectDocument): void {
      validateProjectDocument(document, true);
      this.documentValue = deepClone(document);
      this.undoStack = [];
      this.redoStack = [];
      this.notify();
    }

    execute(description: string, objectType: string, objectId: string, mutator: (state: ProjectState) => void): void {
      const before = deepClone(this.documentValue.state);
      mutator(this.documentValue.state);
      const after = deepClone(this.documentValue.state);
      if (stableStringify(before, 0) === stableStringify(after, 0)) return;
      touchProject(this.documentValue);
      const event = appendHistory(this.documentValue, "command.applied", objectType, objectId, description);
      this.undoStack.push({ description, before, after, event_id: event.event_id });
      if (this.undoStack.length > 100) this.undoStack.shift();
      this.redoStack = [];
      this.notify();
    }

    undo(): void {
      const snapshot = this.undoStack.pop();
      if (!snapshot) return;
      this.applyDataState(snapshot.before);
      touchProject(this.documentValue);
      appendHistory(this.documentValue, "command.undone", "command", snapshot.event_id, `Undid “${snapshot.description}”.`, snapshot.event_id);
      this.redoStack.push(snapshot);
      this.notify();
    }

    redo(): void {
      const snapshot = this.redoStack.pop();
      if (!snapshot) return;
      this.applyDataState(snapshot.after);
      touchProject(this.documentValue);
      appendHistory(this.documentValue, "command.redone", "command", snapshot.event_id, `Redid “${snapshot.description}”.`);
      this.undoStack.push(snapshot);
      this.notify();
    }

    createCheckpoint(name: string): Checkpoint {
      const checkpoint: Checkpoint = {
        checkpoint_id: newId("checkpoint"),
        name: sanitizePlainText(name || "Manual checkpoint", 120),
        created_at: nowIso(),
        state: deepClone(this.documentValue.state)
      };
      this.documentValue.checkpoints.push(checkpoint);
      if (this.documentValue.checkpoints.length > 20) this.documentValue.checkpoints.shift();
      touchProject(this.documentValue);
      appendHistory(this.documentValue, "checkpoint.created", "checkpoint", checkpoint.checkpoint_id, `Created checkpoint “${checkpoint.name}”.`);
      this.notify();
      return checkpoint;
    }

    restoreCheckpoint(checkpointId: string): void {
      const checkpoint = this.documentValue.checkpoints.find(item => item.checkpoint_id === checkpointId);
      if (!checkpoint) throw new Error("Checkpoint not found.");
      const before = deepClone(this.documentValue.state);
      const after = deepClone(checkpoint.state);
      this.applyDataState(after);
      touchProject(this.documentValue);
      const event = appendHistory(this.documentValue, "checkpoint.restored", "checkpoint", checkpointId, `Restored checkpoint “${checkpoint.name}”.`);
      this.undoStack.push({ description: `Restore checkpoint “${checkpoint.name}”`, before, after, event_id: event.event_id });
      this.redoStack = [];
      this.notify();
    }

    private applyDataState(source: ProjectState): void {
      const shell = this.documentValue.state;
      this.documentValue.state = {
        engagement: deepClone(source.engagement),
        reviews_actions: deepClone(source.reviews_actions),
        profile: shell.profile,
        active_workspace: shell.active_workspace,
        inspector_open: shell.inspector_open,
        inspector_pinned: shell.inspector_pinned,
        rail_collapsed: shell.rail_collapsed
      };
    }

    private notify(): void { for (const listener of this.listeners) listener(); }
  }
}
