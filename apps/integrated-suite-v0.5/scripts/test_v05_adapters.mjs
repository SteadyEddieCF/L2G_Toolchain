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

const sourceBytes = new TextEncoder().encode("synthetic compatibility source bytes");
const sourceHash = crypto.createHash("sha256").update(sourceBytes).digest("hex");

function packagePayload(kind, recordKey, recordType, title, summary) {
  return {
    package_kind: kind,
    version: "1.0",
    producer_version: "synthetic-v05-test",
    source_documents: [{
      source_document_id: `source_${kind}`,
      name: `${kind}_Synthetic_Source.txt`,
      sha256: sourceHash,
      size_bytes: sourceBytes.length,
      media_type: "text/plain"
    }],
    [recordKey]: [{
      record_id: `record_${kind}`,
      source_document_id: `source_${kind}`,
      type: recordType,
      title,
      summary,
      source_location: { record_path: `${recordKey}[0]`, label: "Synthetic package record" }
    }]
  };
}

async function preview(payload, name) {
  return L.previewV05CompatibilityPackage(new TextEncoder().encode(JSON.stringify(payload)), name);
}

const intakePreview = await preview(
  packagePayload("l2g_intake_package_v1", "questions", "question", "Confirm imported synthetic inventory owner", "Imported package context must be reviewed before assignment."),
  "synthetic-intake-v1.json"
);
assert.equal(intakePreview.package_kind, "l2g_intake_package_v1");
assert.equal(intakePreview.intake_proposals.length, 1);
assert.equal(intakePreview.interview_question_proposals.length, 1);
assert.match(intakePreview.warnings.join(" "), /No submission or response is created/i);
assert.equal(intakePreview.intake_proposals[0].request.operational_state, "not-requested");
assert.equal(intakePreview.intake_proposals[0].assignment.visibility, "advisor-only");

const intakeDocument = L.createNewProject();
const preCountsBefore = {
  evidence: intakeDocument.state.evidence.sources.length,
  requests: intakeDocument.state.pre_engagement.requests.length,
  instruments: intakeDocument.state.pre_engagement.instruments.length,
  assignments: intakeDocument.state.pre_engagement.assignments.length,
  responses: intakeDocument.state.pre_engagement.responses.length,
  questions: intakeDocument.state.interviews.questions.length
};
const intakeResult = L.applyV05CompatibilityPreview(intakeDocument, intakePreview, undefined, "advisor");
L.validateProjectDocument(intakeDocument, true);
assert.equal(intakeResult.disposition, "applied");
assert.equal(intakeDocument.state.evidence.sources.length, preCountsBefore.evidence + 1);
assert.equal(intakeDocument.state.pre_engagement.requests.length, preCountsBefore.requests + 1);
assert.equal(intakeDocument.state.pre_engagement.instruments.length, preCountsBefore.instruments + 1);
assert.equal(intakeDocument.state.pre_engagement.assignments.length, preCountsBefore.assignments + 1);
assert.equal(intakeDocument.state.pre_engagement.responses.length, preCountsBefore.responses);
assert.equal(intakeDocument.state.interviews.questions.length, preCountsBefore.questions + 1);
assert.equal(intakeDocument.state.interviews.questions.at(-1).origin, "imported-context");
assert.equal(intakeDocument.state.pre_engagement.import_receipts.at(-1).package_sha256, intakePreview.package_sha256);

const meetingPreview = await preview(
  packagePayload("l2g_meeting_context_v1", "meeting_segments", "meeting-segment", "Ask about synthetic privileged access review", "A prior synthetic meeting mentioned weekly review; imported context is not direct testimony."),
  "synthetic-meeting-context-v1.json"
);
assert.equal(meetingPreview.intake_proposals.length, 0);
assert.equal(meetingPreview.interview_question_proposals.length, 1);
assert.match(meetingPreview.warnings.join(" "), /No participant statement/i);
const meetingDocument = L.createNewProject();
const statementsBefore = meetingDocument.state.interviews.participant_statements.length;
const questionsBefore = meetingDocument.state.interviews.questions.length;
L.applyV05CompatibilityPreview(meetingDocument, meetingPreview, undefined, "advisor");
L.validateProjectDocument(meetingDocument, true);
assert.equal(meetingDocument.state.interviews.questions.length, questionsBefore + 1);
assert.equal(meetingDocument.state.interviews.questions.at(-1).origin, "imported-context");
assert.equal(meetingDocument.state.interviews.participant_statements.length, statementsBefore);
assert.equal(meetingDocument.state.interviews.confirmations.length, 0);

const scopePreview = await preview(
  packagePayload("l2g_scope_context_v1", "questions", "question", "Clarify synthetic data-flow boundary", "Draft Scope context may inform a question but cannot establish the boundary."),
  "synthetic-scope-context-v1.json"
);
assert.equal(scopePreview.intake_proposals.length, 0);
assert.equal(scopePreview.interview_question_proposals.length, 1);
assert.match(scopePreview.interview_question_proposals[0].question.applicability_note, /cannot establish the authoritative boundary/i);
const scopeDocument = L.createNewProject();
const scopeResult = L.applyV05CompatibilityPreview(scopeDocument, scopePreview, { interview_question_proposal_ids: [scopePreview.interview_question_proposals[0].proposal_id] }, "advisor");
assert.equal(scopeResult.disposition, "applied");
L.validateProjectDocument(scopeDocument, true);

const subsetDocument = L.createNewProject();
const subsetResult = L.applyV05CompatibilityPreview(subsetDocument, intakePreview, {
  intake_proposal_ids: [],
  interview_question_proposal_ids: [intakePreview.interview_question_proposals[0].proposal_id]
}, "advisor");
assert.equal(subsetResult.disposition, "applied-reviewed-subset");
assert.equal(subsetDocument.state.pre_engagement.import_receipts.length, 0);
assert.equal(subsetDocument.state.interviews.import_receipts.length, 1);
L.validateProjectDocument(subsetDocument, true);

await assert.rejects(
  () => L.previewV05CompatibilityPackage(new TextEncoder().encode(JSON.stringify({ package_kind: "unknown", version: "1.0" })), "unknown.json"),
  /not supported/i
);
await assert.rejects(
  () => L.previewV05CompatibilityPackage(new TextEncoder().encode('{"package_kind":"l2g_intake_package_v1","package_kind":"x","version":"1.0"}'), "duplicate.json"),
  /Duplicate JSON key/i
);
await assert.rejects(
  () => preview({
    package_kind: "l2g_meeting_context_v1",
    version: "1.0",
    source_documents: [{ source_document_id: "source_missing_trace", name: "Synthetic.txt", sha256: sourceHash, size_bytes: 1 }],
    meeting_segments: [{ record_id: "orphan", title: "No source link", summary: "Must be rejected." }]
  }, "missing-trace.json"),
  /no reviewable .*context/i
);

const activePreview = await preview(
  packagePayload("l2g_meeting_context_v1", "meeting_segments", "meeting-segment", "Synthetic active content", "<script>alert(1)</script>"),
  "active-content.json"
);
const activeDocument = L.createNewProject();
const activeBefore = JSON.stringify(activeDocument.state);
assert.throws(() => {
  const draft = structuredClone(activeDocument);
  L.applyV05CompatibilityPreview(draft, activePreview, undefined, "advisor");
}, /active-content/i);
assert.equal(JSON.stringify(activeDocument.state), activeBefore);
assert.throws(() => L.applyV05CompatibilityPreview(L.createNewProject(), meetingPreview, undefined, "client"), /Only Advisor View/i);

const serialized = await L.serializeInnerProject(intakeDocument);
const serializedText = new TextDecoder().decode(serialized);
assert.equal(serializedText.includes("synthetic compatibility source bytes"), false);
assert.equal(serializedText.includes(JSON.stringify(packagePayload("l2g_intake_package_v1", "questions", "question", "x", "y"))), false);

console.log("Integrated Suite v0.5 compatibility adapter tests passed.");
