import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO = path.resolve(ROOT, "../..");
const FIXTURES = path.join(ROOT, "build", "fixtures");
export const LEGACY_MIGRATION_PASSPHRASE = "Synthetic-V05-Legacy-Migration-Passphrase";

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

const legacyInnerPath = path.join(FIXTURES, "synthetic-v03-project.l2g");
if (!fs.existsSync(legacyInnerPath)) throw new Error("The deterministic synthetic v0.3 inner-project fixture was not generated.");
const legacyInner = new Uint8Array(fs.readFileSync(legacyInnerPath));
const salt = Uint8Array.from({ length: 16 }, (_, index) => index + 1);
const iv = Uint8Array.from({ length: 12 }, (_, index) => index + 33);
const baseKey = await L.importPassphrase(LEGACY_MIGRATION_PASSPHRASE);
const key = await L.deriveAesKey(baseKey, salt);
const metadata = {
  kind: "l2g_encrypted_project_v1",
  version: "1.0",
  purpose: "portable-project",
  cipher: { name: "AES-GCM", key_bits: 256, tag_bits: 128, iv_b64: L.bytesToB64(iv) },
  kdf: { name: "PBKDF2", hash: "SHA-256", iterations: 600000, salt_b64: L.bytesToB64(salt) },
  inner: {
    media_type: "application/vnd.l2g.project+zip",
    project_kind: "l2g_project_v1",
    schema_version: "1.0",
    plaintext_bytes: legacyInner.length,
    plaintext_sha256: await L.sha256Hex(legacyInner)
  },
  application: { name: "L2G Integrated Suite", version: "0.3.0" }
};
const additionalData = L.utf8(L.stableStringify(metadata, 0));
const ciphertext = new Uint8Array(await crypto.subtle.encrypt(
  { name: "AES-GCM", iv: iv.slice().buffer, additionalData: additionalData.slice().buffer, tagLength: 128 },
  key,
  legacyInner.slice().buffer
));
const outer = L.createStoredZip([
  { path: "ciphertext.bin", data: ciphertext },
  { path: "envelope.json", data: L.utf8(L.stableStringify(metadata)) }
]);
const outerPath = path.join(FIXTURES, "synthetic-v03-encrypted-project.l2g");
fs.writeFileSync(outerPath, outer);

const protection = await L.deriveProjectKeys(LEGACY_MIGRATION_PASSPHRASE);
const result = await L.decryptProjectBytes(outer, protection, "portable-project", true);
assert.equal(result.legacy, true);
assert.equal(result.document.manifest.application.version, "0.5.0");
assert.equal(result.document.state.evidence.sources.length, 0);
assert.equal(result.document.state.pre_engagement.requests.length, 0);
assert.equal(result.document.state.interviews.questions.length, 0);
assert.equal(result.document.state.interviews.sessions.length, 0);
assert.equal(result.document.history.at(-1).action, "project.migrated-v05");
assert.equal(result.document.checkpoints.at(-1).name, "Migration to v0.5 Pre-Engagement and Interview Sessions");
L.clearSessionProtection(protection);

console.log(JSON.stringify({
  fixture: path.basename(outerPath),
  sha256: crypto.createHash("sha256").update(outer).digest("hex"),
  bytes: outer.length,
  migrated_to: result.document.manifest.application.version,
  legacy: result.legacy
}));
