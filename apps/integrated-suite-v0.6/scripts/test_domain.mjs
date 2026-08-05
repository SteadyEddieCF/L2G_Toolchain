import assert from "node:assert/strict";
import crypto from "node:crypto";
import { loadL2G } from "./test-harness.mjs";

const L = loadL2G();
const document = L.createNewProject();
L.validateProjectDocument(document, true);
assert.equal(document.manifest.application.version, "0.6.1");
assert.equal(document.state.engagement.schema_kind, "l2g_engagement_v1");
assert.equal(document.state.evidence.schema_kind, "l2g_evidence_index_v1");
assert.equal(document.state.pre_engagement.schema_kind, "l2g_pre_engagement_v1");
assert.equal(document.state.interviews.schema_kind, "l2g_interview_sessions_v1");
assert.equal(document.state.scope.schema_kind, "l2g_scope_v1");
assert.equal(document.state.scope.assets.length, 1);
assert.equal(document.state.scope.decisions.length, 1);
assert.equal(document.state.scope.diagrams.length, 1);

const evidenceBefore = crypto.createHash("sha256").update(L.stableStringify(document.state.evidence, 0)).digest("hex");
const engagementBefore = crypto.createHash("sha256").update(L.stableStringify(document.state.engagement, 0)).digest("hex");
const scopeAsset = L.createScopeAsset(document.state.scope, { label: "Synthetic test asset", asset_kind: "server", visibility: "advisor-only" }, "advisor");
assert.ok(scopeAsset.id.startsWith("scope-asset_"));
assert.equal(crypto.createHash("sha256").update(L.stableStringify(document.state.evidence, 0)).digest("hex"), evidenceBefore);
assert.equal(crypto.createHash("sha256").update(L.stableStringify(document.state.engagement, 0)).digest("hex"), engagementBefore);
L.validateProjectDocument(document, true);

const inner = await L.serializeInnerProject(document);
assert.equal(new TextDecoder().decode(inner).includes("domains/scope.json"), true);
const reopened = await L.deserializeInnerProject(inner, false);
assert.equal(reopened.legacy, false);
assert.equal(reopened.document.state.scope.assets.length, document.state.scope.assets.length);
assert.equal(reopened.document.manifest.application.version, "0.6.1");

const abc = new TextEncoder().encode("abc");
assert.equal(L.hashBytesInChunksForTest(abc, 1), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
console.log(JSON.stringify({ release_version: "0.6.1", inherited_domains: true, canonical_scope: true, target_non_mutation: true, deterministic_inner_round_trip: true }));
