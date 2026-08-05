import assert from "node:assert/strict";
import { loadL2G } from "./test-harness.mjs";

const L = loadL2G();

{
  const document = L.createNewProject();
  const scope = document.state.scope;
  const priorId = scope.decisions[0].id;
  const assetId = scope.assets[0].id;
  L.acceptScopeDecision(scope, priorId, "advisor");
  let prior = scope.decisions.find(item => item.id === priorId);
  let asset = scope.assets.find(item => item.id === assetId);
  const acceptedDisposition = asset.scope_disposition;
  const acceptedCategory = asset.asset_category;
  asset.description = "Governed descriptive change after decision acceptance.";
  asset.version++;
  asset.updated_at = new Date().toISOString();
  scope.revision++;
  L.refreshScopeCurrency(scope);
  prior = scope.decisions.find(item => item.id === priorId);
  assert.equal(prior.decision_state, "accepted");
  assert.equal(prior.currency_state, "stale");

  const comparison = L.compareScopeDecisionVersions(scope, priorId);
  assert.equal(comparison.records.length, 1);
  assert.equal(comparison.records[0].expected_version < comparison.records[0].current_version, true);

  const created = L.createSupersedingScopeDecisionDraft(scope, priorId, "advisor");
  const nextId = created.id;
  prior = scope.decisions.find(item => item.id === priorId);
  const next = scope.decisions.find(item => item.id === nextId);
  asset = scope.assets.find(item => item.id === assetId);
  assert.equal(prior.decision_state, "accepted");
  assert.equal(prior.currency_state, "stale");
  assert.equal(prior.superseded_by_decision_ref, next.id);
  assert.equal(next.supersedes_decision_ref, prior.id);
  assert.equal(next.decision_state, "proposed");
  assert.equal(next.affected_record_refs[0].version, asset.version);
  assert.equal(asset.scope_disposition, acceptedDisposition);
  assert.equal(asset.asset_category, acceptedCategory);

  L.acceptScopeDecision(scope, nextId, "advisor");
  prior = scope.decisions.find(item => item.id === priorId);
  const acceptedNext = scope.decisions.find(item => item.id === nextId);
  assert.equal(prior.decision_state, "superseded");
  assert.equal(prior.currency_state, "superseded");
  assert.equal(acceptedNext.decision_state, "accepted");
  assert.equal(acceptedNext.currency_state, "current");
  assert.equal(acceptedNext.supersedes_decision_ref, prior.id);
  assert.equal(prior.superseded_by_decision_ref, acceptedNext.id);
  L.validateScopeDomain(scope);
}

{
  const reviewable = ["proposed", "awaiting-review", "awaiting-confirmation"];
  for (const state of reviewable) {
    const document = L.createNewProject();
    const decision = document.state.scope.decisions[0];
    decision.decision_state = state;
    L.recordScopeReviewerDisposition(document.state.scope, decision.id, "concur", "", "reviewer");
    assert.equal(decision.reviewer_disposition, "concur");
  }
  const terminal = ["draft", "accepted", "rejected", "returned", "withdrawn", "superseded", "archived"];
  for (const state of terminal) {
    const document = L.createNewProject();
    const decision = document.state.scope.decisions[0];
    decision.decision_state = state;
    if (state === "superseded") decision.currency_state = "superseded";
    assert.throws(
      () => L.recordScopeReviewerDisposition(document.state.scope, decision.id, "concur", "", "reviewer"),
      /terminal or non-reviewable decision state/i
    );
  }
}

{
  const document = L.createNewProject();
  const scope = document.state.scope;
  const assetId = scope.assets[0].id;
  const asset = scope.assets[0];
  const packageBytes = new TextEncoder().encode(JSON.stringify({
    kind: "l2g_scope_return_package_v1",
    version: "1.0",
    producer: "Synthetic Scoper v3.12 mixed identity fixture",
    assets: [
      { id: asset.identifier_summary, name: "Exact application asset", type: "cloud-resource" },
      { id: "same-name-distinct", name: asset.client_label, type: "server" },
      { id: "genuinely-new", name: "New synthetic endpoint", type: "endpoint" }
    ]
  }));
  const raw = await L.previewScopePackage(packageBytes, "mixed-identity.json");
  const preview = L.analyzeScopeImportPreview(scope, raw);
  const exact = preview.records.find(item => item.import_record_id.endsWith(asset.identifier_summary));
  const same = preview.records.find(item => item.import_record_id.endsWith("same-name-distinct"));
  const fresh = preview.records.find(item => item.import_record_id.endsWith("genuinely-new"));
  assert.equal(exact.exact_target_ref, asset.id);
  assert.equal(exact.treatment, "link");
  assert.equal(same.ambiguity.includes(asset.id), true);
  assert.equal(same.exact_target_ref, null);
  assert.equal(fresh.ambiguity.length, 0);
  same.treatment = "keep-separate";
  fresh.treatment = "create";
  const beforeDisposition = asset.scope_disposition;
  const receipt = L.applyScopeImport(scope, preview, "advisor");
  assert.equal(receipt.selected_record_ids.length, 3);
  assert.equal(scope.assets.find(item => item.id === assetId).scope_disposition, beforeDisposition);
  const imported = scope.candidates.filter(item => item.provenance.source_label === "mixed-identity.json");
  assert.equal(imported.length, 2);
  assert.equal(imported.some(item => item.proposed_values.identity_treatment === "keep-separate"), true);
  assert.equal(imported.some(item => item.proposed_values.identity_treatment === "create"), true);
}

console.log(JSON.stringify({
  stale_decision_compare_and_supersession: true,
  reviewer_terminal_state_gate: true,
  mixed_import_identity_treatments: true
}));
