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

const pre = L.createSyntheticPreEngagement(timestamp);
L.validatePreEngagementDomain(pre);
assert.equal(pre.schema_kind, "l2g_pre_engagement_v1");
assert.equal(pre.assignments.length, 1);
assert.equal(pre.responses[0].origin, "advisor-entered-on-behalf");
const preAdvisor = L.buildPreEngagementProjection(pre, "pre-engagement", "advisor", timestamp);
const preClient = L.buildPreEngagementProjection(pre, "pre-engagement", "client", timestamp);
assert.ok(Object.isFrozen(preAdvisor));
assert.ok(Object.isFrozen(preAdvisor.requests));
assert.equal(preClient.exceptions.length, 0);
assert.equal(preClient.candidates.length, 0);
assert.equal(preClient.import_receipts.length, 0);
assert.equal("provenance" in preClient.responses[0], false);
assert.equal(preClient.responses[0].origin, "advisor-entered-on-behalf");
const originalResponseText = pre.responses[0].display_text;
try { preClient.responses[0].display_text = "mutated"; } catch {}
assert.equal(pre.responses[0].display_text, originalResponseText);

const badOrigin = structuredClone(pre);
badOrigin.responses[0].origin = "client-provided";
assert.throws(() => L.validatePreEngagementDomain(badOrigin), /client-provided response requires client-attributed provenance/i);
const badSnapshot = structuredClone(pre);
badSnapshot.assignments[0].snapshot.items[0].value_type = "boolean";
assert.throws(() => L.validatePreEngagementDomain(badSnapshot), /type does not match its immutable assignment snapshot/i);
const stalePre = structuredClone(pre);
stalePre.assignments[0].currency_state = "stale";
assert.equal(L.buildPreEngagementNextWork(stalePre, "advisor", timestamp).some(item => item.kind === "stale-assignment"), true);
const candidateCount = pre.candidates.length;
const candidate = L.createPreEngagementCandidate(pre, {
  source_refs: [pre.responses[0].response_id],
  target_domain: "engagement",
  target_type: "open-question",
  proposed_operation: "create",
  proposed_fields: { title: "Confirm synthetic boundary coordinator", detail: "Target authority must decide." },
  rationale: "Source-domain proposal only."
}, "advisor");
assert.equal(pre.candidates.length, candidateCount + 1);
assert.equal(candidate.state, "awaiting-review");
assert.equal(candidate.target_candidate_ref, null);
assert.throws(() => L.createPreEngagementCandidate(pre, {
  source_refs: [pre.responses[0].response_id], target_domain: "engagement", target_type: "open-question", proposed_operation: "create", proposed_fields: { title: "x" }, rationale: "x"
}, "client"), /Only Advisor View/);

const interviews = L.createSyntheticInterviewSessions(timestamp);
L.validateInterviewSessionsDomain(interviews);
assert.equal(interviews.schema_kind, "l2g_interview_sessions_v1");
const readySession = interviews.sessions[0];
assert.equal(readySession.lifecycle, "ready");
const started = L.startInterviewSession(interviews, readySession.session_id, "advisor");
assert.equal(started.lifecycle, "in-progress");
assert.ok(started.start_snapshot);
assert.ok(started.active_session_question_ref);
assert.equal(interviews.session_questions.length, 1);
assert.equal(interviews.session_questions[0].state, "current");

const statement = L.recordParticipantStatement(interviews, {
  session_ref: started.session_id,
  session_question_ref: started.active_session_question_ref,
  asserted_participant_ref: null,
  asserted_speaker_label: "Synthetic system owner",
  recording_method: "facilitator-entered",
  text: "The synthetic team reviews privileged access changes each month.",
  visibility: "client-safe"
}, "advisor");
const note = L.recordAdvisorNote(interviews, {
  session_ref: started.session_id,
  session_question_ref: started.active_session_question_ref,
  kind: "observation",
  title: "Synthetic Advisor observation",
  text: "ADVISOR_SECRET_MARKER should never appear in Client projection."
}, "advisor");
assert.equal(note.visibility, "advisor-only");
const confirmation = L.recordInterviewConfirmation(interviews, {
  session_ref: started.session_id,
  confirmed_record_kind: "participant-statement",
  confirmed_record_ref: statement.statement_id,
  asserted_confirmer_participant_ref: null,
  asserted_confirmer_label: "Synthetic system owner",
  method: "displayed-and-verbally-confirmed",
  visibility: "client-safe"
}, "advisor");
assert.equal(confirmation.state, "confirmed");
assert.match(confirmation.detail, /not authenticated identity/i);

const advisorProjection = L.buildInterviewProjection(interviews, "practice-review", "advisor", timestamp);
const clientProjection = L.buildInterviewProjection(interviews, "practice-review", "client", timestamp);
assert.ok(Object.isFrozen(advisorProjection));
assert.equal(advisorProjection.advisor_notes.length, 1);
assert.equal(clientProjection.advisor_notes.length, 0);
assert.equal(clientProjection.candidates.length, 0);
assert.equal(clientProjection.import_receipts.length, 0);
assert.equal(JSON.stringify(clientProjection).includes("ADVISOR_SECRET_MARKER"), false);
assert.equal(clientProjection.progress.label, "1 of 1 planned questions");

const second = structuredClone(readySession);
second.session_id = "interview_session_second_synthetic";
second.lifecycle = "ready";
second.actual_start = null;
second.actual_end = null;
second.active_session_question_ref = null;
second.elapsed_seconds_hint = 0;
second.start_snapshot = null;
second.pause_state = null;
second.created_at = timestamp;
second.updated_at = timestamp;
interviews.sessions.push(second);
assert.throws(() => L.startInterviewSession(interviews, second.session_id, "advisor"), /already active or paused/i);
interviews.sessions.pop();

const paused = L.pauseInterviewSession(interviews, started.session_id, 120, "advisor");
assert.equal(paused.lifecycle, "paused");
assert.equal(paused.pause_state.active_session_question_ref, started.active_session_question_ref);
const resumed = L.resumeInterviewSession(interviews, started.session_id, "advisor");
assert.equal(resumed.lifecycle, "in-progress");
assert.equal(resumed.active_session_question_ref, started.active_session_question_ref);
assert.equal(resumed.pause_state, null);
const completed = L.completeInterviewSession(interviews, started.session_id, "advisor");
assert.equal(completed.lifecycle, "completed");
assert.equal(completed.post_session_review_state, "pending");
assert.equal(completed.active_session_question_ref, null);
assert.equal(interviews.follow_ups.length, 0);
assert.equal(interviews.candidates.length, 0);

const noteLeak = structuredClone(interviews);
noteLeak.advisor_notes[0].visibility = "client-safe";
assert.throws(() => L.validateInterviewSessionsDomain(noteLeak), /visibility must remain advisor-only/i);
const staleConfirmation = structuredClone(interviews);
staleConfirmation.participant_statements[0].version_number = 2;
assert.throws(() => L.validateInterviewSessionsDomain(staleConfirmation), /does not match the exact participant statement version/i);
const importedLive = structuredClone(interviews);
importedLive.participant_statements[0].recording_method = "imported-context";
assert.throws(() => L.validateInterviewSessionsDomain(importedLive), /require import provenance/i);

const secondDomain = L.createSyntheticInterviewSessions(timestamp);
const secondReady = structuredClone(secondDomain.sessions[0]);
secondReady.session_id = "interview_session_duplicate_active_test";
secondReady.lifecycle = "in-progress";
secondReady.actual_start = timestamp;
secondReady.active_session_question_ref = null;
secondReady.start_snapshot = {
  plan_ref: secondReady.plan_ref,
  plan_snapshot_hash: secondReady.plan_snapshot_hash,
  plan_title: secondReady.title,
  ordered_session_question_refs: [],
  attendee_participant_refs: [],
  attendee_display_labels: [],
  facilitator_label: secondReady.facilitator_label,
  started_at: timestamp,
  started_profile: "advisor",
  initial_session_question_ref: null
};
secondDomain.sessions.push(secondReady);
assert.throws(() => L.validateInterviewSessionsDomain(secondDomain), /Only one Interview session/i);

console.log("Integrated Suite v0.5 Pre-Engagement and Interview domain tests passed.");
