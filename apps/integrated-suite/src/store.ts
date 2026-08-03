namespace L2G {
  type StoreListener = () => void;

  export class ProjectStore {
    private documentValue: ProjectDocument;
    private readonly undoStack: CommandSnapshot[] = [];
    private readonly redoStack: CommandSnapshot[] = [];
    private readonly listeners = new Set<StoreListener>();
    private recoveryTimer: number | undefined;

    constructor(document: ProjectDocument, private readonly recovery: RecoveryStore) {
      this.documentValue = document;
    }

    get document(): ProjectDocument {
      return this.documentValue;
    }

    get canUndo(): boolean {
      return this.undoStack.length > 0;
    }

    get canRedo(): boolean {
      return this.redoStack.length > 0;
    }

    get undoDescription(): string | undefined {
      return this.undoStack.at(-1)?.description;
    }

    get redoDescription(): string | undefined {
      return this.redoStack.at(-1)?.description;
    }

    subscribe(listener: StoreListener): () => void {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }

    replaceDocument(document: ProjectDocument): void {
      validateProjectDocument(document);
      this.documentValue = deepClone(document);
      this.undoStack.length = 0;
      this.redoStack.length = 0;
      this.notify();
      this.scheduleRecovery();
    }

    execute(description: string, objectType: string, objectId: string, mutator: (state: ProjectState) => void): void {
      const before = deepClone(this.documentValue.state);
      mutator(this.documentValue.state);
      const after = deepClone(this.documentValue.state);
      if (stableStringify(before, 0) === stableStringify(after, 0)) return;
      touchProject(this.documentValue);
      const event = this.appendEvent("command.applied", objectType, objectId, description);
      this.undoStack.push({ description, before, after, event_id: event.event_id });
      if (this.undoStack.length > 100) this.undoStack.shift();
      this.redoStack.length = 0;
      this.notify();
      this.scheduleRecovery();
    }

    undo(): void {
      const snapshot = this.undoStack.pop();
      if (!snapshot) return;
      this.applyDataState(snapshot.before);
      touchProject(this.documentValue);
      this.appendEvent("command.undone", "command", snapshot.event_id, `Undid “${snapshot.description}”.`, snapshot.event_id);
      this.redoStack.push(snapshot);
      this.notify();
      this.scheduleRecovery();
    }

    redo(): void {
      const snapshot = this.redoStack.pop();
      if (!snapshot) return;
      this.applyDataState(snapshot.after);
      touchProject(this.documentValue);
      this.appendEvent("command.redone", "command", snapshot.event_id, `Redid “${snapshot.description}”.`);
      this.undoStack.push(snapshot);
      this.notify();
      this.scheduleRecovery();
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
      this.appendEvent("checkpoint.created", "checkpoint", checkpoint.checkpoint_id, `Created checkpoint “${checkpoint.name}”.`);
      this.notify();
      this.scheduleRecovery(true);
      return checkpoint;
    }

    restoreCheckpoint(checkpointId: string): void {
      const checkpoint = this.documentValue.checkpoints.find(item => item.checkpoint_id === checkpointId);
      if (!checkpoint) throw new Error("Checkpoint was not found.");
      const before = deepClone(this.documentValue.state);
      const after = deepClone(checkpoint.state);
      this.applyDataState(after);
      touchProject(this.documentValue);
      const event = this.appendEvent("checkpoint.restored", "checkpoint", checkpointId, `Restored checkpoint “${checkpoint.name}”.`);
      this.undoStack.push({ description: `Restore checkpoint “${checkpoint.name}”`, before, after, event_id: event.event_id });
      this.redoStack.length = 0;
      this.notify();
      this.scheduleRecovery(true);
    }

    async persistRecoveryNow(): Promise<void> {
      if (this.recoveryTimer !== undefined) window.clearTimeout(this.recoveryTimer);
      this.recoveryTimer = undefined;
      await this.recovery.save({ kind: "l2g_recovery_v1", saved_at: nowIso(), document: deepClone(this.documentValue) });
    }

    async clearRecovery(): Promise<void> {
      if (this.recoveryTimer !== undefined) window.clearTimeout(this.recoveryTimer);
      this.recoveryTimer = undefined;
      await this.recovery.clear();
    }

    private applyDataState(source: ProjectState): void {
      const current = this.documentValue.state;
      this.documentValue.state = {
        engagement: deepClone(source.engagement),
        reviews_actions: deepClone(source.reviews_actions),
        profile: current.profile,
        active_workspace: current.active_workspace,
        inspector_open: current.inspector_open,
        inspector_pinned: current.inspector_pinned,
        rail_collapsed: current.rail_collapsed
      };
    }

    private appendEvent(action: string, objectType: string, objectId: string, summary: string, reversesEventId?: string): HistoryEvent {
      const event: HistoryEvent = {
        event_id: newId("event"),
        timestamp: nowIso(),
        profile: this.documentValue.state.profile,
        action,
        object_type: objectType,
        object_id: objectId,
        summary: sanitizePlainText(summary, 500),
        transaction_id: newId("txn")
      };
      if (reversesEventId) event.reverses_event_id = reversesEventId;
      this.documentValue.history.push(event);
      return event;
    }

    private scheduleRecovery(immediate = false): void {
      if (this.recoveryTimer !== undefined) window.clearTimeout(this.recoveryTimer);
      this.recoveryTimer = window.setTimeout(() => {
        this.recoveryTimer = undefined;
        void this.persistRecoveryNow().catch(() => undefined);
      }, immediate ? 0 : 750);
    }

    private notify(): void {
      for (const listener of this.listeners) listener();
    }
  }

  export class RecoveryStore {
    private readonly databaseName = "l2g-integrated-suite-foundation";
    private readonly storeName = "recovery";
    private readonly key = "latest";

    async save(envelope: RecoveryEnvelope): Promise<void> {
      const db = await this.open();
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readwrite");
        transaction.objectStore(this.storeName).put(envelope, this.key);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error ?? new Error("Recovery save failed."));
        transaction.onabort = () => reject(transaction.error ?? new Error("Recovery save was aborted."));
      });
      db.close();
    }

    async load(): Promise<RecoveryEnvelope | undefined> {
      const db = await this.open();
      const value = await new Promise<RecoveryEnvelope | undefined>((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readonly");
        const request = transaction.objectStore(this.storeName).get(this.key);
        request.onsuccess = () => resolve(request.result as RecoveryEnvelope | undefined);
        request.onerror = () => reject(request.error ?? new Error("Recovery read failed."));
      });
      db.close();
      if (!value) return undefined;
      if (value.kind !== "l2g_recovery_v1" || typeof value.saved_at !== "string") throw new Error("Recovery record is invalid.");
      validateProjectDocument(value.document);
      return value;
    }

    async clear(): Promise<void> {
      const db = await this.open();
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readwrite");
        transaction.objectStore(this.storeName).delete(this.key);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error ?? new Error("Recovery clear failed."));
      });
      db.close();
    }

    private open(): Promise<IDBDatabase> {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.databaseName, 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(this.storeName)) db.createObjectStore(this.storeName);
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error("Recovery database could not be opened."));
        request.onblocked = () => reject(new Error("Recovery database is blocked by another tab."));
      });
    }
  }
}
