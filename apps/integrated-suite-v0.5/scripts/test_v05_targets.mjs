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

const timestamp = "2026-08-04T20:00:00.000Z";
const engagement = L.createSyntheticEngagement(timestamp);
const acceptedQuestionCount = engagement.open_questions.length;

const pre = L.createSyntheticPreEngagement(timestamp);
const preCandidate = L.createPreEngagementCandidate(pre, {
  source_refs: [pre.responses[0].response_id],
  target_domain: "engagement",
  target_type: "open-question",
  proposed_operation: "create",
  proposed_fields: { title: "Confirm synthetic intake response", detail: pre.responses[0].display_text },
  rationale: "Pre-Engagement source proposal; Engagement must decide."
}, "advisor");
const preTarget = L.publishPreEngagementCandidateToEngagement(engagement, pre, preCandidate.candidate_id, "advisor");
assert.equal(preTarget.source_kind, "pre-engagement-candidate");
assert.equal(preTarget.source_ref, preCandidate.candidate_id);
assert.equal(preTarget.state, "candidate");
assert.equal(preCandidate.state, "published-to-target");
assert.equal(preCandidate.target_candidate_ref, preTarget.candidate_id);
assert.equal(engagement.open_questions.length, acceptedQuestionCount);
assert.throws(() => L.publishPreEngagementCandidateToEngagement(engagement, pre, preCandidate.candidate_id, "advisor"), /awaiting-review/i);
L.decideCandidate(engagement, preTarget.candidate_id, "reject", "The target authority rejected this synthetic proposal.", "advisor");
L.mirrorV05EngagementCandidateDecision(preCandidate, preTarget);
assert.equal(preCandidate.state, "returned");
assert.equal(preCandidate.target_decision_ref, preTarget.candidate_id);
assert.equal(engagement.open_questions.length, acceptedQuestionCount);

const interviews = L.createSyntheticInterviewSessions(timestamp);
const interviewCandidate = L.createInterviewCandidate(interviews, {
  source_refs: [interviews.sessions[0].session_id],
  target_domain: "engagement",
  target_type: "open-question",
  proposed_operation: "create",
  proposed_fields: { title: "Confirm synthetic interview context", detail: "Review the session-derived proposal." },
  rationale: "Interview source proposal; Engagement must decide."
}, "advisor");
const interviewTarget = L.publishInterviewCandidateToEngagement(engagement, interviews, interviewCandidate.candidate_id, "advisor");
assert.equal(interviewTarget.source_kind, "interview-candidate");
assert.equal(interviewTarget.source_ref, interviewCandidate.candidate_id);
assert.equal(interviewTarget.state, "candidate");
assert.equal(interviewCandidate.state, "published-to-target");
assert.equal(interviewCandidate.target_candidate_ref, interviewTarget.candidate_id);
assert.equal(engagement.open_questions.length, acceptedQuestionCount);
assert.throws(() => L.publishInterviewCandidateToEngagement(engagement, interviews, interviewCandidate.candidate_id, "client"), /Only Advisor View/);
L.decideCandidate(engagement, interviewTarget.candidate_id, "reject", "The target authority rejected this synthetic proposal.", "advisor");
L.mirrorV05EngagementCandidateDecision(interviewCandidate, interviewTarget);
assert.equal(interviewCandidate.state, "returned");
assert.equal(interviewCandidate.target_decision_ref, interviewTarget.candidate_id);
assert.equal(engagement.open_questions.length, acceptedQuestionCount);

console.log("Integrated Suite v0.5 target-owned publication tests passed.");
