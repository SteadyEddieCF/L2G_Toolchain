import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const REPO = path.resolve(ROOT, "../..");

export function loadL2G() {
  if (!globalThis.crypto) Object.defineProperty(globalThis, "crypto", { value: crypto.webcrypto, configurable: true });
  globalThis.window = globalThis;
  globalThis.window.__L2G_RELEASE__ = {
    application: "L2G Integrated Suite",
    version: "0.6.0",
    product_runtime_compatibility_baseline: "85d6e783a250b373cd4b9ea356e4c341336f9259",
    synthetic_only: true,
    production_data_authorized: false,
    artifact_name: "L2G_Integrated_Suite_Scope_v0.6.0.html",
    envelope_kind: "l2g_encrypted_project_v1",
    project_kind: "l2g_project_v1",
    engagement_schema_kind: "l2g_engagement_v1",
    engagement_schema_version: "1.0",
    evidence_schema_kind: "l2g_evidence_index_v1",
    evidence_schema_version: "1.0",
    pre_engagement_schema_kind: "l2g_pre_engagement_v1",
    pre_engagement_schema_version: "1.0",
    interview_schema_kind: "l2g_interview_sessions_v1",
    interview_schema_version: "1.0",
    scope_schema_kind: "l2g_scope_v1",
    scope_schema_version: "1.0",
    scope_projection_kind: "l2g_scope_projection_v1",
    scope_projection_version: "1.0"
  };
  globalThis.window.__L2G_CONTRACT_REGISTRY__ = JSON.parse(fs.readFileSync(path.join(REPO, "apps/integrated-suite-v0.2/contracts/registry.json"), "utf8"));
  vm.runInThisContext(fs.readFileSync(path.join(ROOT, "build/domain-test.js"), "utf8"), { filename: "domain-test.js" });
  if (!globalThis.L2G) throw new Error("L2G namespace did not initialize.");
  return globalThis.L2G;
}

export async function makeLegacyV05Bytes(L, current) {
  const legacy = structuredClone(current);
  delete legacy.state.scope;
  legacy.manifest.application.version = "0.5.0";
  legacy.manifest.domain_index = legacy.manifest.domain_index.filter(item => item.path !== "domains/scope.json");
  legacy.checkpoints = legacy.checkpoints.map(item => { const clone = structuredClone(item); delete clone.state.scope; return clone; });
  const payloads = new Map();
  payloads.set("manifest.json", L.utf8(L.stableStringify(legacy.manifest)));
  payloads.set("domains/engagement.json", L.utf8(L.stableStringify(legacy.state.engagement)));
  payloads.set("domains/evidence-index.json", L.utf8(L.stableStringify(legacy.state.evidence)));
  payloads.set("domains/pre-engagement.json", L.utf8(L.stableStringify(legacy.state.pre_engagement)));
  payloads.set("domains/interview-sessions.json", L.utf8(L.stableStringify(legacy.state.interviews)));
  payloads.set("domains/reviews-actions.json", L.utf8(L.stableStringify(legacy.state.reviews_actions)));
  payloads.set("history/events.ndjson", L.utf8(`${legacy.history.map(event => JSON.stringify(event)).join("\n")}\n`));
  payloads.set("history/checkpoints.json", L.utf8(L.stableStringify(legacy.checkpoints)));
  payloads.set("compatibility/current-registry.json", L.utf8(L.stableStringify(globalThis.window.__L2G_CONTRACT_REGISTRY__)));
  const records = [];
  for (const [entryPath, data] of [...payloads.entries()].sort(([a], [b]) => a.localeCompare(b))) records.push({ path: entryPath, sha256: await L.sha256Hex(data), size: data.length });
  payloads.set("integrity/sha256-manifest.json", L.utf8(L.stableStringify({ algorithm: "SHA-256", entries: records })));
  return L.createStoredZip([...payloads.entries()].map(([entryPath, data]) => ({ path: entryPath, data })));
}
