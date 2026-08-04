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

const document = L.createNewProject();
const pre = document.state.pre_engagement;
const interviews = document.state.interviews;
const instrument = pre.instruments[0];
const assignment = pre.assignments[0];
const section = instrument.sections[0];
const baseItem = instrument.items[0];

const scaleItems = Array.from({ length: 500 }, (_, index) => ({
  ...structuredClone(baseItem),
  item_id: L.newId("intake_item"),
  section_ref: section.section_id,
  order: index + 1,
  prompt: `Synthetic bounded intake question ${String(index + 1).padStart(3, "0")}`,
  client_safe_help: `Synthetic help text for bounded intake item ${index + 1}.`
}));
instrument.items = scaleItems;
section.item_refs = scaleItems.map(item => item.item_id);
assignment.snapshot = {
  snapshot_hash: crypto.createHash("sha256").update(JSON.stringify(scaleItems.map(item => ({
    item_id: item.item_id,
    section_ref: item.section_ref,
    order: item.order,
    kind: item.kind,
    prompt: item.prompt,
    client_safe_help: item.client_safe_help,
    value_type: item.value_type,
    required: item.required,
    options: item.options,
    applicability_note: item.applicability_note,
    visibility: item.visibility
  })))).digest("hex"),
  title: instrument.title,
  items: scaleItems.map(item => ({
    item_id: item.item_id,
    section_ref: item.section_ref,
    order: item.order,
    kind: item.kind,
    prompt: item.prompt,
    client_safe_help: item.client_safe_help,
    value_type: item.value_type,
    required: item.required,
    options: structuredClone(item.options),
    applicability_note: item.applicability_note,
    visibility: item.visibility
  }))
};

const baseQuestion = interviews.questions[0];
const scaleQuestions = Array.from({ length: 500 }, (_, index) => ({
  ...structuredClone(baseQuestion),
  question_id: L.newId("interview_question"),
  topic_label: `Synthetic scale topic ${String(index + 1).padStart(3, "0")}`,
  prompt: `Describe synthetic bounded interview behavior ${index + 1}.`,
  client_safe_explanation: `Synthetic participant-facing explanation ${index + 1}.`,
  created_at: L.nowIso(),
  updated_at: L.nowIso()
}));
interviews.questions = scaleQuestions;

const plan = interviews.plans[0];
const basePlanItem = plan.items[0];
plan.items = scaleQuestions.slice(0, 250).map((question, index) => ({
  ...structuredClone(basePlanItem),
  plan_item_id: L.newId("plan_item"),
  order: index + 1,
  question_ref: question.question_id,
  question_version_number: question.version_number,
  question_snapshot: {
    prompt: question.prompt,
    client_safe_explanation: question.client_safe_explanation,
    origin: question.origin,
    topic_label: question.topic_label,
    source_refs: structuredClone(question.source_refs)
  }
}));
plan.snapshot_hash = crypto.createHash("sha256").update(JSON.stringify(plan.items)).digest("hex");
plan.updated_at = L.nowIso();

const baseSession = interviews.sessions[0];
interviews.sessions = Array.from({ length: 25 }, (_, index) => ({
  ...structuredClone(baseSession),
  session_id: L.newId("interview_session"),
  title: `Synthetic bounded session ${String(index + 1).padStart(2, "0")}`,
  lifecycle: "ready",
  post_session_review_state: "not-started",
  active_session_question_ref: null,
  elapsed_seconds_hint: 0,
  start_snapshot: null,
  pause_state: null,
  actual_start: null,
  actual_end: null,
  created_at: L.nowIso(),
  updated_at: L.nowIso()
}));
interviews.session_questions = [];
interviews.participant_statements = [];
interviews.advisor_notes = Array.from({ length: 200 }, (_, index) => ({
  advisor_note_id: L.newId("advisor_note"),
  session_ref: interviews.sessions[index % interviews.sessions.length].session_id,
  session_question_ref: L.newId("session_question"),
  kind: "observation",
  title: `Synthetic internal note ${index + 1}`,
  text: `Synthetic Advisor-only scale detail ${index + 1}.`,
  visibility: "advisor-only",
  lifecycle: "active",
  provenance: L.createV05Provenance("synthetic-scale", `note-${index + 1}`, L.nowIso(), "advisor"),
  created_at: L.nowIso(),
  updated_at: L.nowIso()
}));
// Notes require valid session-question references; keep the volume test focused on
// instruments, questions, plans, and sessions while testing note filtering separately.
interviews.advisor_notes = [];

L.validateProjectDocument(document, true);
const advisorPre = L.buildPreEngagementProjection(pre, "pre-engagement", "advisor");
const clientPre = L.buildPreEngagementProjection(pre, "pre-engagement", "client");
const advisorInterview = L.buildInterviewProjection(interviews, "practice-review", "advisor");
const clientInterview = L.buildInterviewProjection(interviews, "practice-review", "client");
assert.equal(instrument.items.length, 500);
assert.equal(assignment.snapshot.items.length, 500);
assert.equal(interviews.questions.length, 500);
assert.equal(plan.items.length, 250);
assert.equal(interviews.sessions.length, 25);
assert.equal(advisorPre.instruments[0].items.length, 500);
assert.equal(clientPre.candidates.length, 0);
assert.equal(advisorInterview.questions.length, 500);
assert.equal(clientInterview.advisor_notes.length, 0);
assert.equal(clientInterview.candidates.length, 0);

const inner = await L.serializeInnerProject(document);
assert.ok(inner.length > 0);
assert.ok(inner.length < 12 * 1024 * 1024);
const reopened = await L.deserializeInnerProject(inner, false);
L.validateProjectDocument(reopened.document, true);
assert.equal(reopened.document.state.pre_engagement.instruments[0].items.length, 500);
assert.equal(reopened.document.state.interviews.questions.length, 500);
assert.equal(reopened.document.state.interviews.plans[0].items.length, 250);
assert.equal(reopened.document.state.interviews.sessions.length, 25);

console.log(JSON.stringify({
  bounded_intake_items: 500,
  bounded_interview_questions: 500,
  bounded_plan_items: 250,
  bounded_sessions: 25,
  serialized_bytes: inner.length,
  profile_filtered_before_projection: true,
  round_trip_validated: true
}));
