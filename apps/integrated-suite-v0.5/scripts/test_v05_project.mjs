import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO = path.resolve(ROOT, "../..");
if (!globalThis.crypto) Object.defineProperty(globalThis, "crypto", { value: crypto.webcrypto, configurable: true });
globalThis.window = globalThis;
globalThis.window.__L2G_RELEASE__ = {
  application: "L2G Integrated Suite",
  version: "0.5.0",
  product_runtime_compatibility_baseline: "85d6e783a250b373cd4b9ea356e4c341336f9259",
  synthetic_only: true,
  artifact_name: "L2G_Integrated_Suite_Pre_Engagement_Interview_v0.5.0.html",
  envelope_kind: "l2g_encrypted_project_v1",
  project_kind: "l2g_project_v1",
  engagement_schema_kind: "l2g_engagement_v1",
  engagement_schema_version: "1.0",
  evidence_schema_kind: "l2g_evidence_index_v1",
  evidence_schema_version: "1.0",
  pre_engagement_schema_kind: "l2g_pre_engagement_v1",
  pre_engagement_schema_version: "1.0",
  interview_schema_kind: "l2g_interview_sessions_v1",
  interview_schema_version: "1.0"
};
globalThis.window.__L2G_CONTRACT_REGISTRY__ = JSON.parse(fs.readFileSync(path.join(REPO, "apps/integrated-suite-v0.2/contracts/registry.json"), "utf8"));
vm.runInThisContext(fs.readFileSync(path.join(ROOT, "build/domain-test.js"), "utf8"), { filename: "domain-test.js" });
const L = globalThis.L2G;
assert.ok(L);

const V05_PATHS = [
  "compatibility/current-registry.json",
  "domains/engagement.json",
  "domains/evidence-index.json",
  "domains/interview-sessions.json",
  "domains/pre-engagement.json",
  "domains/reviews-actions.json",
  "history/checkpoints.json",
  "history/events.ndjson",
  "integrity/sha256-manifest.json",
  "manifest.json"
].sort();
const V04_PATHS = V05_PATHS.filter(item => !["domains/interview-sessions.json", "domains/pre-engagement.json"].includes(item));
const V04_DOMAINS = [
  { path: "domains/engagement.json", schema: "l2g_engagement_v1", authority: "Engagement" },
  { path: "domains/evidence-index.json", schema: "l2g_evidence_index_v1", authority: "Evidence" },
  { path: "domains/reviews-actions.json", schema: "reviews_actions_v1", authority: "Reviews & Actions" }
];

async function buildLegacyV04Archive() {
  const current = L.createNewProject();
  const manifest = structuredClone(current.manifest);
  manifest.application.version = "0.4.0";
  manifest.domain_index = structuredClone(V04_DOMAINS);
  const payloads = new Map();
  payloads.set("manifest.json", L.utf8(L.stableStringify(manifest)));
  payloads.set("domains/engagement.json", L.utf8(L.stableStringify(current.state.engagement)));
  payloads.set("domains/evidence-index.json", L.utf8(L.stableStringify(current.state.evidence)));
  payloads.set("domains/reviews-actions.json", L.utf8(L.stableStringify(current.state.reviews_actions)));
  payloads.set("history/events.ndjson", L.utf8(`${current.history.map(event => JSON.stringify(event)).join("\n")}\n`));
  payloads.set("history/checkpoints.json", L.utf8("[]\n"));
  payloads.set("compatibility/current-registry.json", L.utf8(L.stableStringify(globalThis.window.__L2G_CONTRACT_REGISTRY__)));
  const integrityEntries = [];
  for (const [entryPath, data] of [...payloads.entries()].sort(([left], [right]) => left.localeCompare(right))) {
    integrityEntries.push({ path: entryPath, sha256: await L.sha256Hex(data), size: data.length });
  }
  payloads.set("integrity/sha256-manifest.json", L.utf8(L.stableStringify({ algorithm: "SHA-256", entries: integrityEntries })));
  return L.createStoredZip([...payloads.entries()].map(([entryPath, data]) => ({ path: entryPath, data })));
}

const native = L.createNewProject();
assert.equal(native.state.pre_engagement.schema_kind, "l2g_pre_engagement_v1");
assert.equal(native.state.interviews.schema_kind, "l2g_interview_sessions_v1");
L.validateProjectDocument(native, true);
const nativeBytes = await L.serializeInnerProject(native);
const nativeEntries = L.readStoredZip(nativeBytes);
assert.deepEqual(nativeEntries.map(entry => entry.path).sort(), V05_PATHS);
const reopened = await L.deserializeInnerProject(nativeBytes, true);
assert.equal(reopened.legacy, false);
assert.equal(reopened.document.state.pre_engagement.requests.length, native.state.pre_engagement.requests.length);
assert.equal(reopened.document.state.interviews.sessions.length, native.state.interviews.sessions.length);
assert.equal(reopened.document.history.some(event => event.action === "project.migrated-v05"), false);
const nativeBytesAgain = await L.serializeInnerProject(reopened.document);
assert.deepEqual(Buffer.from(nativeBytesAgain), Buffer.from(nativeBytes));

const legacyBytes = await buildLegacyV04Archive();
assert.deepEqual(L.readStoredZip(legacyBytes).map(entry => entry.path).sort(), V04_PATHS);
const migrated = await L.deserializeInnerProject(legacyBytes, true);
assert.equal(migrated.legacy, true);
assert.equal(migrated.document.manifest.application.version, "0.5.0");
assert.equal(migrated.document.state.pre_engagement.requests.length, 0);
assert.equal(migrated.document.state.pre_engagement.responses.length, 0);
assert.equal(migrated.document.state.interviews.questions.length, 0);
assert.equal(migrated.document.state.interviews.sessions.length, 0);
assert.equal(migrated.document.state.interviews.advisor_notes.length, 0);
assert.equal(migrated.document.state.interviews.confirmations.length, 0);
assert.equal(migrated.document.state.interviews.candidates.length, 0);
assert.equal(migrated.document.checkpoints.at(-1).name, "Migration to v0.5 Pre-Engagement and Interview Sessions");
const migrationEvent = migrated.document.history.at(-1);
assert.equal(migrationEvent.action, "project.migrated-v05");
assert.match(migrationEvent.summary, /no request, response, question, session, statement, Advisor note, confirmation, summary, candidate, or conclusion was inferred/i);
assert.deepEqual(migrated.document.manifest.domain_index, [
  { path: "domains/engagement.json", schema: "l2g_engagement_v1", authority: "Engagement" },
  { path: "domains/evidence-index.json", schema: "l2g_evidence_index_v1", authority: "Evidence" },
  { path: "domains/pre-engagement.json", schema: "l2g_pre_engagement_v1", authority: "Pre-Engagement" },
  { path: "domains/interview-sessions.json", schema: "l2g_interview_sessions_v1", authority: "Interview Sessions" },
  { path: "domains/reviews-actions.json", schema: "reviews_actions_v1", authority: "Reviews & Actions" }
]);
L.validateProjectDocument(migrated.document, true);
const migratedBytes = await L.serializeInnerProject(migrated.document);
assert.deepEqual(L.readStoredZip(migratedBytes).map(entry => entry.path).sort(), V05_PATHS);
const migratedReopen = await L.deserializeInnerProject(migratedBytes, true);
assert.equal(migratedReopen.legacy, false);
assert.equal(migratedReopen.document.history.filter(event => event.action === "project.migrated-v05").length, 1);
assert.equal(migratedReopen.document.checkpoints.filter(item => item.name === "Migration to v0.5 Pre-Engagement and Interview Sessions").length, 1);

const tamperedEntries = L.readStoredZip(nativeBytes).map(entry => ({ path: entry.path, data: new Uint8Array(entry.data) }));
const preEntry = tamperedEntries.find(entry => entry.path === "domains/pre-engagement.json");
preEntry.data[0] ^= 1;
const tampered = L.createStoredZip(tamperedEntries);
await assert.rejects(() => L.deserializeInnerProject(tampered, true), /Integrity validation failed|JSON|invalid/i);
await assert.rejects(() => L.deserializeInnerProject(legacyBytes, false), /Earlier project shape is not accepted/i);

const store = new L.ProjectStore(native);
const sessionId = store.document.state.interviews.sessions[0].session_id;
store.execute(
  "interview.session-started",
  "interview-session",
  sessionId,
  "Started the governed synthetic Interview session.",
  document => L.startInterviewSession(document.state.interviews, sessionId, document.state.profile),
  "Interview session started"
);
assert.equal(store.document.state.interviews.sessions[0].lifecycle, "in-progress");
assert.equal(store.document.checkpoints.at(-1).name, "Interview session started");
store.execute(
  "interview.session-paused",
  "interview-session",
  sessionId,
  "Paused the governed synthetic Interview session with its exact active question.",
  document => L.pauseInterviewSession(document.state.interviews, sessionId, 90, document.state.profile),
  "Interview session paused"
);
assert.equal(store.document.state.interviews.sessions[0].lifecycle, "paused");
assert.equal(store.document.checkpoints.at(-1).name, "Interview session paused");
store.undo();
assert.equal(store.document.state.interviews.sessions[0].lifecycle, "in-progress");
store.redo();
assert.equal(store.document.state.interviews.sessions[0].lifecycle, "paused");

console.log("Integrated Suite v0.5 project persistence and migration tests passed.");
