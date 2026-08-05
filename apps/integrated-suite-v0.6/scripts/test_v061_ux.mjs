import assert from "node:assert/strict";
import { loadL2G } from "./test-harness.mjs";

const L = loadL2G();

{
  const document = L.createNewProject();
  const scope = document.state.scope;
  const secret = L.createScopeAsset(scope, {
    label: "Advisor-only projection sentinel",
    asset_kind: "server",
    visibility: "advisor-only",
    description: "Must never appear in Client projection."
  }, "advisor");
  const diagram = scope.diagrams[0];
  diagram.visibility = "client-safe";
  diagram.diagram_review_state = "reviewed";
  diagram.review_state = "reviewed";
  diagram.included_record_refs.push({ id: secret.id, version: secret.version });
  diagram.node_records.push({ node_id: "secret-node", record_ref: { id: secret.id, version: secret.version }, proposal_label: "", x: 900, y: 500, width: 180, height: 72 });
  diagram.edge_records.push({ edge_id: "secret-edge", from_node_id: diagram.node_records[0].node_id, to_node_id: "secret-node", relationship_ref: null, proposal_label: "Secret edge" });
  diagram.text_alternative += " Advisor-only projection sentinel. Secret edge.";
  const projection = L.buildScopeProjection(scope, "client");
  const serialized = L.stableStringify(projection, 0);
  assert.equal(serialized.includes("Advisor-only projection sentinel"), false);
  assert.equal(serialized.includes("Secret edge"), false);
  assert.equal(projection.diagrams[0].node_records.some(node => node.record_ref?.id === secret.id), false);
  assert.equal(projection.diagrams[0].edge_records.some(edge => edge.edge_id === "secret-edge"), false);
}

{
  const document = L.createNewProject();
  const scope = document.state.scope;
  const packageBytes = new TextEncoder().encode(JSON.stringify({
    kind: "l2g_scope_return_package_v1",
    version: "1.0",
    producer: "Synthetic Scoper v3.12 fixture",
    assets: [
      { id: "same-name-1", name: "Application service", type: "server" },
      { id: "same-name-2", name: "Application service", type: "cloud-resource" }
    ]
  }));
  const raw = await L.previewScopePackage(packageBytes, "same-name.json");
  const preview = L.analyzeScopeImportPreview(scope, raw);
  assert.equal(preview.records.length, 2);
  assert.equal(preview.records.every(item => item.ambiguity.length === 1), true);
  assert.throws(() => L.applyScopeImport(scope, preview, "advisor"), /Resolve ambiguous import record/i);
  for (const item of preview.records) item.treatment = "keep-separate";
  const receipt = L.applyScopeImport(scope, preview, "advisor");
  assert.equal(receipt.diagnostics.filter(item => item.includes("keep-separate")).length, 2);
  assert.equal(scope.candidates.filter(item => item.proposed_values.identity_treatment === "keep-separate").length, 2);
  assert.equal(new Set(scope.candidates.filter(item => item.proposed_values.identity_treatment === "keep-separate").map(item => item.proposed_values.source_import_record_id)).size, 2);
}

{
  const document = L.createNewProject();
  const scope = document.state.scope;
  const prior = scope.diagrams[0];
  prior.diagram_review_state = "reviewed";
  prior.review_state = "reviewed";
  scope.assets[0].version++;
  L.refreshScopeCurrency(scope);
  assert.equal(prior.currency_state, "stale");
  const next = L.createSupersedingScopeDiagram(scope, prior.id, "advisor");
  assert.equal(scope.diagrams.length, 2);
  assert.equal(prior.superseded_by_id, next.id);
  assert.equal(next.supersedes_id, prior.id);
  assert.equal(prior.diagram_review_state, "superseded");
  assert.equal(next.diagram_review_state, "draft");
  assert.equal(next.included_record_refs.find(ref => ref.id === scope.assets[0].id).version, scope.assets[0].version);
  L.validateScopeDomain(scope);
}

{
  const document = L.createNewProject();
  const scope = document.state.scope;
  const interviews = document.state.interviews;
  const beforeQuestions = interviews.questions.length;
  const beforePlanItems = interviews.plans.flatMap(plan => plan.items).length;
  const unknown = scope.unknowns[0];
  const question = L.publishScopeUnknownToSessionPlanner(scope, unknown.id, interviews, "advisor");
  assert.equal(interviews.questions.length, beforeQuestions + 1);
  assert.equal(interviews.plans.flatMap(plan => plan.items).length, beforePlanItems);
  assert.equal(question.lifecycle, "draft");
  assert.equal(question.origin, "source-derived");
  assert.equal(unknown.session_question_candidate_ref, question.question_id);
  assert.equal(L.publishScopeUnknownToSessionPlanner(scope, unknown.id, interviews, "advisor").question_id, question.question_id);
  assert.equal(interviews.questions.length, beforeQuestions + 1);
}

{
  const document = L.createNewProject();
  const scope = document.state.scope;
  const decision = scope.decisions[0];
  const asset = scope.assets[0];
  const before = asset.scope_disposition;
  const changes = decision.field_changes.map(change => change.field === "scope_disposition" ? { ...change, new_value: "accepted-out-of-scope" } : change);
  L.recordScopeReviewerDisposition(scope, decision.id, "concur-with-changes", "Concur with the modified disposition for Advisor acceptance.", "reviewer", changes);
  assert.equal(decision.reviewer_disposition, "concur-with-changes");
  assert.equal(decision.field_changes.find(change => change.field === "scope_disposition").new_value, "accepted-out-of-scope");
  assert.equal(asset.scope_disposition, before);
}

{
  const scope = L.emptyScopeDomain();
  const boundary = L.createScopeBoundaryProposal(scope, "Draft boundary", "Describe the proposed boundary without inference.", "advisor");
  assert.equal(boundary.scope_disposition, "unknown");
  assert.equal(boundary.visibility, "advisor-only");
  assert.equal(scope.boundaries.length, 1);
  L.validateScopeDomain(scope);
}

console.log(JSON.stringify({
  client_projection_non_disclosure: true,
  import_identity_review: true,
  diagram_supersession: true,
  session_planner_candidate_only: true,
  reviewer_concur_with_changes: true,
  no_inference_boundary_proposal: true
}));
