import assert from "node:assert/strict";
import crypto from "node:crypto";
import { loadL2G } from "./test-harness.mjs";

const L = loadL2G();
const document = L.createNewProject();
const scope = document.state.scope;
const initialAsset = scope.assets[0];
const initialDecision = scope.decisions[0];
assert.equal(initialAsset.asset_category, "unclassified");
assert.equal(initialAsset.scope_disposition, "proposed-in-scope");

L.acceptScopeDecision(scope, initialDecision.id, "advisor");
const acceptedAsset = scope.assets.find(item => item.id === initialAsset.id);
const acceptedDecision = scope.decisions.find(item => item.id === initialDecision.id);
assert.ok(acceptedAsset);
assert.ok(acceptedDecision);
assert.equal(acceptedAsset.asset_category, "cui-asset");
assert.equal(acceptedAsset.scope_disposition, "accepted-in-scope");
assert.equal(acceptedDecision.decision_state, "accepted");
assert.equal(acceptedDecision.affected_record_refs[0].version, acceptedAsset.version);
L.validateScopeDomain(scope);

const conflicting = L.createScopeDecision(scope, {
  label: "Conflicting exclusion proposal",
  type: "scope-disposition",
  affected: [{ id: acceptedAsset.id, version: acceptedAsset.version }],
  changes: [{ field: "scope_disposition", old_value: "accepted-in-scope", new_value: "accepted-out-of-scope" }],
  rationale: "Synthetic conflict test.",
  client_rationale: "A conflicting treatment was proposed for discussion."
}, "advisor");
assert.throws(() => L.acceptScopeDecision(scope, conflicting.id, "advisor"), /conflicting accepted decision/i);
assert.equal(scope.assets.find(item => item.id === acceptedAsset.id)?.scope_disposition, "accepted-in-scope");

const advisorProjection = L.buildScopeProjection(scope, "advisor");
const clientProjection = L.buildScopeProjection(scope, "client");
assert.equal(advisorProjection.decisions.some(item => item.advisor_analysis.includes("Advisor-only")), true);
assert.equal(clientProjection.decisions.some(item => item.advisor_analysis.length > 0), false);
assert.equal(clientProjection.candidates.length, 0);
assert.equal(clientProjection.counts.candidates, 0);

const diagram = scope.diagrams[0];
assert.equal(diagram.currency_state, "stale");
assert.equal(diagram.stale_ref_diagnostics.some(item => item.includes(acceptedAsset.id)), true);

const evidenceHash = crypto.createHash("sha256").update(L.stableStringify(document.state.evidence, 0)).digest("hex");
const candidate = L.createScopeCandidate(scope, { source_domain: "evidence", source_ref: { id: "evidence-candidate-synthetic", version: 1 }, kind: "asset", label: "Imported synthetic asset", values: { label: "Imported synthetic asset", object_kind: "server" }, visibility: "advisor-only" }, "advisor");
L.decideScopeCandidate(scope, candidate.id, "accept", "advisor", "Accepted as a target-owned draft Scope record.");
assert.equal(candidate.candidate_state, "accepted");
assert.equal(candidate.target_record_refs.length, 1);
assert.equal(crypto.createHash("sha256").update(L.stableStringify(document.state.evidence, 0)).digest("hex"), evidenceHash);

const packageBytes = new TextEncoder().encode(JSON.stringify({
  kind: "l2g_scope_return_package_v1",
  version: "1.0",
  producer: "Synthetic Scoper v3.12 fixture",
  assets: [{ id: "asset-import-1", name: "Same name synthetic asset", type: "server" }, { id: "asset-import-2", name: "Same name synthetic asset", type: "server" }],
  providers: [{ id: "provider-import-1", name: "Synthetic Cloud Provider", type: "csp" }],
  pre_workshop_question_package_v1: { records: [{ question_id: "question-1", question: "Who can access the synthetic cloud service?" }] }
}));
const preview = await L.previewScopePackage(packageBytes, "synthetic-scope-return.json");
assert.equal(preview.records.length, 4);
const beforeApply = L.stableStringify(scope, 0);
const rejectedPreview = structuredClone(preview);
rejectedPreview.records[0].ambiguity = ["scope-asset_existing"];
assert.throws(() => L.applyScopeImport(scope, rejectedPreview, "advisor"), /Resolve ambiguous import record/);
assert.equal(L.stableStringify(scope, 0), beforeApply);
const receipt = L.applyScopeImport(scope, preview, "advisor");
assert.equal(receipt.status, "applied");
assert.equal(scope.candidates.filter(item => item.source_domain === "compatibility-import").length, 4);
assert.equal(L.stableStringify(preview, 0), L.stableStringify(preview, 0));

const prototypePackage = new TextEncoder().encode('{"kind":"l2g_scope_return_package_v1","version":"1.0","assets":[{"__proto__":{"polluted":true}}]}');
await assert.rejects(() => L.previewScopePackage(prototypePackage, "prototype.json"), /forbidden|prototype/i);
console.log(JSON.stringify({ decision_authority: true, conflict_prevention: true, client_non_disclosure: true, diagram_stale: true, import_atomicity: true, source_non_mutation: true }));
