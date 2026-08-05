import assert from "node:assert/strict";
import crypto from "node:crypto";
import { loadL2G } from "./test-harness.mjs";

const L = loadL2G();
const document = L.createNewProject();
const scope = document.state.scope;
const timestamp = "2026-08-05T00:00:00.000Z";
const baseAsset = structuredClone(scope.assets[0]);
for (let index = 2; index <= 10000; index++) {
  const asset = structuredClone(baseAsset);
  asset.id = `scope-asset_scale-${String(index).padStart(5, "0")}`;
  asset.label = `Synthetic scale asset ${index}`;
  asset.client_label = "";
  asset.visibility = "advisor-only";
  asset.related_refs = [];
  asset.created_at = timestamp;
  asset.updated_at = timestamp;
  scope.assets.push(asset);
}
assert.equal(scope.assets.length, 10000);

const baseFlow = structuredClone(scope.data_flows[0]);
for (let index = 2; index <= 20000; index++) {
  const flow = structuredClone(baseFlow);
  flow.id = `scope-flow_scale-${String(index).padStart(5, "0")}`;
  flow.label = `Synthetic scale flow ${index}`;
  flow.source_ref = scope.systems[0].id;
  flow.destination_ref = scope.assets[(index - 1) % scope.assets.length].id;
  flow.intermediary_refs = [];
  flow.boundary_crossing_refs = [scope.boundaries[0].id];
  flow.unknown_refs = [];
  flow.created_at = timestamp;
  flow.updated_at = timestamp;
  scope.data_flows.push(flow);
}
assert.equal(scope.data_flows.length, 20000);

for (let index = 1; index <= 50000; index++) {
  scope.dependencies.push({
    id: `scope-dependency_scale-${String(index).padStart(5, "0")}`,
    version: 1,
    label: `Synthetic scale dependency ${index}`,
    description: "",
    lifecycle: "active",
    operational_state: "complete",
    review_state: "reviewed",
    visibility: "advisor-only",
    currency_state: "current",
    provenance: { origin_kind: "scope-local", source_refs: [], source_label: "Synthetic scale fixture", asserted_at: timestamp, asserted_by: "system" },
    created_at: timestamp,
    updated_at: timestamp,
    created_by_profile: "system-migration",
    updated_by_profile: "system-migration",
    supersedes_id: null,
    superseded_by_id: null,
    tags: [],
    from_ref: scope.systems[0].id,
    to_ref: scope.assets[index % scope.assets.length].id,
    relationship_kind: "depends-on",
    precedence_bearing: true,
    rationale: "Synthetic acyclic scale relationship.",
    decision_ref: null
  });
}
assert.equal(scope.dependencies.length, 50000);
scope.revision += 1;
L.validateScopeDomain(scope);
const firstHash = crypto.createHash("sha256").update(L.stableStringify(scope, 0)).digest("hex");
L.validateScopeDomain(structuredClone(scope));
const secondHash = crypto.createHash("sha256").update(L.stableStringify(scope, 0)).digest("hex");
assert.equal(firstHash, secondHash);

const overLimit = structuredClone(scope.assets[0]);
overLimit.id = "scope-asset_scale-over-limit";
scope.assets.push(overLimit);
assert.throws(() => L.validateScopeDomain(scope), /assets exceeds its semantic limit/i);
scope.assets.pop();

const displaced = scope.dependencies.pop();
assert.ok(displaced);
const first = scope.dependencies[0];
first.from_ref = scope.systems[0].id;
first.to_ref = scope.assets[0].id;
const cyclic = structuredClone(displaced);
cyclic.id = "scope-dependency_scale-cycle";
cyclic.from_ref = scope.assets[0].id;
cyclic.to_ref = scope.systems[0].id;
scope.dependencies.push(cyclic);
assert.equal(scope.dependencies.length, 50000);
assert.throws(() => L.validateScopeDomain(scope), /cycle/i);
console.log(JSON.stringify({ assets: 10000, flows: 20000, dependencies: 50000, deterministic_semantics: true, over_limit_rejected: true, cycle_rejected: true }));
