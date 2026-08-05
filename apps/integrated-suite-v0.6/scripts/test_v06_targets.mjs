import assert from "node:assert/strict";
import crypto from "node:crypto";
import { loadL2G } from "./test-harness.mjs";

const L = loadL2G();
const document = L.createNewProject();
const sourceHashes = {
  engagement: crypto.createHash("sha256").update(L.stableStringify(document.state.engagement, 0)).digest("hex"),
  evidence: crypto.createHash("sha256").update(L.stableStringify(document.state.evidence, 0)).digest("hex"),
  pre: crypto.createHash("sha256").update(L.stableStringify(document.state.pre_engagement, 0)).digest("hex"),
  interviews: crypto.createHash("sha256").update(L.stableStringify(document.state.interviews, 0)).digest("hex")
};
const scope = document.state.scope;
const common = {
  candidate_kind: "asset",
  proposed_values: { label: "Synthetic source-published asset", object_kind: "server" },
  visibility: "advisor-only"
};
const candidates = [
  L.publishEngagementContextToScope(scope, { ...common, source_ref: { id: "engagement-source-synthetic", version: 1 }, label: "Engagement source proposal" }, "advisor"),
  L.publishEvidenceContextToScope(scope, { ...common, source_ref: { id: "evidence-source-synthetic", version: 2 }, label: "Evidence source proposal" }, "advisor"),
  L.publishPreEngagementContextToScope(scope, { ...common, source_ref: { id: "pre-engagement-source-synthetic", version: 3 }, label: "Pre-Engagement source proposal" }, "advisor"),
  L.publishInterviewContextToScope(scope, { ...common, source_ref: { id: "interview-source-synthetic", version: 4 }, label: "Interview source proposal" }, "advisor")
];
assert.deepEqual(candidates.map(item => item.source_domain), ["engagement", "evidence", "pre-engagement", "interview-sessions"]);
assert.equal(candidates.every(item => item.candidate_state === "received"), true);
assert.equal(candidates.every(item => item.target_record_refs.length === 0), true);
const duplicate = L.publishEvidenceContextToScope(scope, { ...common, source_ref: { id: "evidence-source-synthetic", version: 2 }, label: "Duplicate label does not create a second active candidate" }, "advisor");
assert.equal(duplicate.id, candidates[1].id);
assert.equal(scope.candidates.filter(item => item.source_domain === "evidence" && item.source_candidate_ref.id === "evidence-source-synthetic").length, 1);

L.decideScopeCandidate(scope, candidates[1].id, "accept", "advisor", "Accepted into Scope as a target-owned draft record.");
assert.equal(candidates[1].candidate_state, "accepted");
assert.equal(candidates[1].target_record_refs.length, 1);
assert.equal(crypto.createHash("sha256").update(L.stableStringify(document.state.engagement, 0)).digest("hex"), sourceHashes.engagement);
assert.equal(crypto.createHash("sha256").update(L.stableStringify(document.state.evidence, 0)).digest("hex"), sourceHashes.evidence);
assert.equal(crypto.createHash("sha256").update(L.stableStringify(document.state.pre_engagement, 0)).digest("hex"), sourceHashes.pre);
assert.equal(crypto.createHash("sha256").update(L.stableStringify(document.state.interviews, 0)).digest("hex"), sourceHashes.interviews);
L.validateProjectDocument(document, true);
console.log(JSON.stringify({ engagement_publication: true, evidence_publication: true, pre_engagement_publication: true, interview_publication: true, active_duplicate_suppression: true, source_non_mutation: true }));
