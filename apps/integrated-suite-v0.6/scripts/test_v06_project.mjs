import assert from "node:assert/strict";
import { loadL2G, makeLegacyV05Bytes } from "./test-harness.mjs";

const L = loadL2G();
const current = L.createNewProject();
const legacyBytes = await makeLegacyV05Bytes(L, current);
const migrated = await L.deserializeInnerProject(legacyBytes, true);
assert.equal(migrated.legacy, true);
assert.equal(migrated.document.state.scope.schema_kind, "l2g_scope_v1");
assert.equal(migrated.document.state.scope.assets.length, 0);
assert.equal(migrated.document.state.scope.decisions.length, 0);
assert.equal(migrated.document.state.scope.diagrams.length, 0);
assert.equal(migrated.document.checkpoints.at(-1).name, "Migration to v0.6 canonical Scope authority");
assert.equal(migrated.document.history.at(-1).action, "project.migrated-v06");
assert.match(migrated.document.history.at(-1).summary, /no boundary, object, candidate, decision, diagram, category, disposition, responsibility, flow treatment, or conclusion was inferred/i);
L.validateProjectDocument(migrated.document, true);

const protection = await L.deriveProjectKeys("synthetic-v06-passphrase");
const encrypted = await L.encryptProjectDocument(migrated.document, protection, "portable-project");
assert.ok(encrypted.length > legacyBytes.length / 4);
const reopenedProtection = await L.deriveProjectKeys("synthetic-v06-passphrase");
const reopened = await L.decryptProjectBytes(encrypted, reopenedProtection, "portable-project", true);
assert.equal(reopened.document.state.scope.assets.length, 0);
assert.equal(reopened.document.manifest.application.version, "0.6.0");
const wrong = await L.deriveProjectKeys("wrong-passphrase");
await assert.rejects(() => L.decryptProjectBytes(encrypted, wrong, "portable-project", true), /incorrect|modified/i);
const tampered = encrypted.slice();
tampered[tampered.length - 20] ^= 1;
const tamperProtection = await L.deriveProjectKeys("synthetic-v06-passphrase");
await assert.rejects(() => L.decryptProjectBytes(tampered, tamperProtection, "portable-project", true));

const store = new L.ProjectStore();
const initialCount = store.document.state.scope.assets.length;
store.execute("scope.asset.created", "scope_asset", "scope-action_test", "Created synthetic Undo asset.", document => {
  L.createScopeAsset(document.state.scope, { label: "Undo synthetic asset", asset_kind: "server", visibility: "advisor-only" }, document.state.profile);
}, "Added synthetic Scope asset");
assert.equal(store.document.state.scope.assets.length, initialCount + 1);
assert.equal(store.canUndo, true);
store.undo();
assert.equal(store.document.state.scope.assets.length, initialCount);
assert.equal(store.document.history.at(-1).action, "history.undo");
assert.equal(store.canRedo, true);
store.redo();
assert.equal(store.document.state.scope.assets.length, initialCount + 1);
assert.equal(store.document.history.at(-1).action, "history.redo");
L.validateProjectDocument(store.document, true);
console.log(JSON.stringify({ empty_scope_migration: true, named_checkpoint: true, encryption_round_trip: true, tamper_rejection: true, undo_redo: true }));
