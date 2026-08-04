import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO = path.resolve(ROOT, "../..");
globalThis.crypto = crypto.webcrypto;
globalThis.window = globalThis;
globalThis.window.__L2G_RELEASE__ = {
  application: "L2G Integrated Suite", version: "0.4.0", product_runtime_compatibility_baseline: "85d6e783a250b373cd4b9ea356e4c341336f9259",
  synthetic_only: true, artifact_name: "L2G_Integrated_Suite_Evidence_Catalog_v0.4.0.html", envelope_kind: "l2g_encrypted_project_v1", project_kind: "l2g_project_v1",
  engagement_schema_kind: "l2g_engagement_v1", engagement_schema_version: "1.0", evidence_schema_kind: "l2g_evidence_index_v1", evidence_schema_version: "1.0"
};
globalThis.window.__L2G_CONTRACT_REGISTRY__ = JSON.parse(fs.readFileSync(path.join(REPO, "apps/integrated-suite-v0.2/contracts/registry.json"), "utf8"));
vm.runInThisContext(fs.readFileSync(path.join(ROOT, "build/domain-test.js"), "utf8"), { filename: "domain-test.js" });
const L = globalThis.L2G;
assert.ok(L);

const empty = new Uint8Array();
const abc = new TextEncoder().encode("abc");
assert.equal(L.hashBytesInChunksForTest(empty, 1), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
assert.equal(L.hashBytesInChunksForTest(abc, 1), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
assert.equal(L.hashBytesInChunksForTest(abc, 2), L.hashBytesInChunksForTest(abc, 64));
const multi = crypto.randomBytes(1024 * 1024 + 17);
const expectedMulti = crypto.createHash("sha256").update(multi).digest("hex");
for (const chunk of [1, 7, 64, 65536, 1048576]) assert.equal(L.hashBytesInChunksForTest(multi, chunk), expectedMulti);

const document = L.createNewProject();
L.validateProjectDocument(document, true);
assert.equal(document.state.evidence.schema_kind, "l2g_evidence_index_v1");
assert.equal(document.state.evidence.sources.length, 3);
const advisorProjection = L.buildEvidenceProjection(document.state.evidence, "evidence", "advisor", "2026-08-04T00:00:00.000Z");
const clientProjection = L.buildEvidenceProjection(document.state.evidence, "evidence", "client", "2026-08-04T00:00:00.000Z");
assert.ok(Object.isFrozen(advisorProjection));
assert.ok(Object.isFrozen(advisorProjection.sources));
assert.equal(clientProjection.sources.length, 1);
assert.equal("original_name" in clientProjection.sources[0], false);
assert.equal("fingerprint" in clientProjection.sources[0], false);
assert.equal(clientProjection.candidate_mappings.length, 0);
assert.equal(clientProjection.duplicate_groups.length, 0);
assert.equal(clientProjection.verification_receipts.length, 0);
assert.equal(L.searchEvidenceProjection(clientProjection, "McFirecoal").length, 0);
assert.equal(L.searchEvidenceProjection(clientProjection, "Current network").length, 1);
const beforeTitle = document.state.evidence.sources[0].display_label;
try { advisorProjection.sources[0].display_label = "mutated"; } catch {}
assert.equal(document.state.evidence.sources[0].display_label, beforeTitle);

const bytes1 = new TextEncoder().encode("synthetic evidence bytes one");
const bytes2 = new TextEncoder().encode("synthetic evidence bytes two");
const hash1 = crypto.createHash("sha256").update(bytes1).digest("hex");
const hash2 = crypto.createHash("sha256").update(bytes2).digest("hex");
const fakeFile1 = { name: "C:\\Users\\Synthetic\\Evidence_One.txt", type: "text/plain", size: bytes1.length, lastModified: 1785811200000 };
const fakeFile2 = { name: "Evidence_Two.txt", type: "text/plain", size: bytes2.length, lastModified: 1785811300000 };
const staged1 = L.createStagedSource(fakeFile1, hash1, document.state.evidence);
staged1.display_label = "Synthetic Evidence One";
staged1.tags = ["synthetic", "test"];
const created = L.registerStagedSources(document.state.evidence, [staged1], "advisor");
assert.equal(created.length, 1);
assert.equal(created[0].original_name, "Evidence_One.txt");
assert.equal(created[0].fingerprint.sha256, hash1);
assert.equal(document.state.evidence.verification_receipts.at(-1).result, "exact-match");
const duplicate = L.createStagedSource(fakeFile1, hash1, document.state.evidence);
duplicate.display_label = "Synthetic Evidence One Copy";
const duplicateCreated = L.registerStagedSources(document.state.evidence, [duplicate], "advisor")[0];
assert.ok(duplicateCreated.duplicate_group_ref);
const duplicateGroup = document.state.evidence.duplicate_groups.find(group => group.duplicate_group_id === duplicateCreated.duplicate_group_ref);
assert.ok(duplicateGroup);
const dispositions = Object.fromEntries(duplicateGroup.members.map((member, index) => [member.source_ref, index === 0 ? "primary" : "duplicate"]));
L.setDuplicateGroupDisposition(document.state.evidence, duplicateGroup.duplicate_group_id, dispositions, "Explicit synthetic duplicate disposition.", "advisor");
assert.equal(duplicateGroup.state, "resolved");
const revisionStaged = L.createStagedSource(fakeFile2, hash2, document.state.evidence);
revisionStaged.display_label = "Synthetic Evidence One Revision";
const revision = L.createEvidenceRevision(document.state.evidence, created[0].evidence_id, revisionStaged, true, "Changed synthetic bytes retained as a new revision.", "advisor");
assert.equal(created[0].lifecycle, "superseded");
assert.equal(revision.supersedes_source_ref, created[0].evidence_id);
assert.equal(document.state.evidence.relationships.some(item => item.relationship_type === "revision-of" && item.from_ref === revision.evidence_id), true);

const acceptedIdentityBefore = document.state.engagement.identity.delivery_context;
const mapping = L.createEvidenceCandidate(document.state.evidence, { source_refs: [revision.evidence_id], target_domain: "engagement", target_type: "open-question", proposed_operation: "create", proposed_fields: [{ name: "title", value: "Confirm synthetic revision" }, { name: "detail", value: "Review source-derived revision context." }], rationale: "Target authority must decide." }, "advisor");
const targetCandidate = L.createEngagementCandidateFromEvidence(document.state.engagement, mapping, "advisor");
L.markEvidenceCandidatePublished(mapping, targetCandidate.candidate_id);
assert.equal(document.state.engagement.identity.delivery_context, acceptedIdentityBefore);
assert.equal(targetCandidate.state, "candidate");
assert.equal(mapping.state, "published-to-target");

const packagePayload = {
  package_kind: "l2g_intake_package_v1", version: "1.0", producer_version: "7.9.5.1",
  source_documents: [{ source_document_id: "sd_synthetic_001", name: "Synthetic_Architecture.pdf", sha256: hash1, size_bytes: bytes1.length }],
  evidence_records: [{ record_id: "record_synthetic_001", source_document_id: "sd_synthetic_001", title: "Synthetic imported summary", summary: "Bounded synthetic source-derived summary.", source_location: { page: 3, label: "Page 3" }, target_domain: "engagement", target_type: "open-question", fields: { environment: "Synthetic" } }]
};
const packageBytes = new TextEncoder().encode(JSON.stringify(packagePayload));
const preview = await L.previewLegacyEvidencePackage(packageBytes, "Synthetic_Intake.json");
assert.equal(preview.sources.length, 1);
assert.equal(preview.derived_records.length, 1);
assert.equal(preview.candidates.length, 1);
const receipt = L.applyImportPreview(document.state.evidence, preview, undefined, "advisor");
assert.equal(receipt.state, "applied");
assert.equal(receipt.package_kind, "l2g_intake_package_v1");
await assert.rejects(() => L.previewLegacyEvidencePackage(new TextEncoder().encode('{"package_kind":"l2g_intake_package_v1","package_kind":"x","version":"1.0"}'), "bad.json"), /Duplicate JSON key/);
await assert.rejects(() => L.previewLegacyEvidencePackage(new TextEncoder().encode(JSON.stringify({ package_kind: "unknown", version: "1.0" })), "bad.json"), /not supported/);

L.validateProjectDocument(document, true);
const inner = await L.serializeInnerProject(document);
assert.equal(new TextDecoder().decode(inner).includes("synthetic evidence bytes one"), false);
const reopened = await L.deserializeInnerProject(inner, false);
assert.equal(reopened.legacy, false);
assert.equal(reopened.document.state.evidence.sources.length, document.state.evidence.sources.length);

async function legacyV03Package(current) {
  const legacy = structuredClone(current);
  delete legacy.state.evidence;
  legacy.manifest.application.version = "0.3.0";
  legacy.manifest.domain_index = legacy.manifest.domain_index.filter(item => item.path !== "domains/evidence-index.json");
  legacy.checkpoints = [];
  const payloads = new Map();
  payloads.set("manifest.json", L.utf8(L.stableStringify(legacy.manifest)));
  payloads.set("domains/engagement.json", L.utf8(L.stableStringify(legacy.state.engagement)));
  payloads.set("domains/reviews-actions.json", L.utf8(L.stableStringify(legacy.state.reviews_actions)));
  payloads.set("history/events.ndjson", L.utf8(`${legacy.history.map(event => JSON.stringify(event)).join("\n")}\n`));
  payloads.set("history/checkpoints.json", L.utf8("[]"));
  payloads.set("compatibility/current-registry.json", L.utf8(L.stableStringify(globalThis.window.__L2G_CONTRACT_REGISTRY__)));
  const records = [];
  for (const [entryPath,data] of [...payloads.entries()].sort(([a],[b]) => a.localeCompare(b))) records.push({ path: entryPath, sha256: await L.sha256Hex(data), size: data.length });
  payloads.set("integrity/sha256-manifest.json", L.utf8(L.stableStringify({ algorithm: "SHA-256", entries: records })));
  return L.createStoredZip([...payloads.entries()].map(([entryPath,data]) => ({ path: entryPath, data })));
}
const legacyBytes = await legacyV03Package(L.createNewProject());
const migrated = await L.deserializeInnerProject(legacyBytes, true);
assert.equal(migrated.legacy, true);
assert.equal(migrated.document.state.evidence.sources.length, 0);
assert.equal(migrated.document.history.at(-1).action, "evidence.migrated-v03");
assert.equal(migrated.document.checkpoints.at(-1).name, "Migration to v0.4 Evidence Catalog Core");

const passphrase = "Synthetic-V04-Strong-Passphrase";
const keys = await L.deriveProjectKeys(passphrase);
const encryptedA = await L.encryptProjectDocument(document, keys, "portable-project");
const encryptedB = await L.encryptProjectDocument(document, keys, "portable-project");
assert.notDeepEqual(encryptedA, encryptedB);
assert.equal(new TextDecoder().decode(encryptedA).includes("Synthetic Evidence One"), false);
const decrypted = await L.decryptProjectBytes(encryptedA, await L.deriveProjectKeys(passphrase), "portable-project", true);
assert.equal(decrypted.document.state.evidence.sources.length, document.state.evidence.sources.length);
await assert.rejects(() => L.decryptProjectBytes(encryptedA, await L.deriveProjectKeys("wrong-passphrase"), "portable-project", true), /Unable to unlock/);
const tampered = encryptedA.slice(); tampered[tampered.length - 1] ^= 1;
await assert.rejects(() => L.decryptProjectBytes(tampered, await L.deriveProjectKeys(passphrase), "portable-project", true), /Unable to unlock|unsupported|invalid|mismatch/i);
await assert.rejects(() => L.decryptProjectBytes(encryptedA, await L.deriveProjectKeys(passphrase), "browser-recovery", false), /Unable to unlock|purpose/i);
L.clearSessionProtection(keys);

const malformed = structuredClone(document);
malformed.state.evidence.sources[0].original_name = "C:\\Users\\Real\\secret.pdf";
assert.throws(() => L.validateProjectDocument(malformed, true), /source state|original name|invalid/i);
const malformedNull = structuredClone(document);
malformedNull.state.evidence.sources[0].fingerprint = null;
assert.throws(() => L.validateProjectDocument(malformedNull, true), /Null fingerprint/);
const dangling = structuredClone(document);
dangling.state.evidence.locations[0].source_ref = "evidence_missing";
assert.throws(() => L.validateProjectDocument(dangling, true), /dangling/);
const activeContent = structuredClone(document);
activeContent.state.evidence.derived_records[0].summary = "<script>alert(1)</script>";
assert.throws(() => L.validateProjectDocument(activeContent, true), /active-content/);

const fixtures = path.join(ROOT, "build", "fixtures");
fs.mkdirSync(fixtures, { recursive: true });
fs.writeFileSync(path.join(fixtures, "synthetic-v04-project.l2g"), encryptedA);
fs.writeFileSync(path.join(fixtures, "synthetic-v03-project.l2g"), legacyBytes);
fs.writeFileSync(path.join(fixtures, "synthetic-intake-package.json"), JSON.stringify(packagePayload, null, 2));
const fixedProjectVector = crypto.createHash("sha256").update(encryptedA).digest("hex");
const legacyVector = crypto.createHash("sha256").update(legacyBytes).digest("hex");
console.log(JSON.stringify({
  fixed_hash_vectors: true,
  incremental_chunk_independence: true,
  project_and_evidence_validation: true,
  original_bytes_absent: true,
  exact_duplicates_and_revisions: true,
  client_filtering_before_search_and_render: true,
  immutable_projection: true,
  target_authority_non_mutation: true,
  stable_package_preview_and_apply: true,
  deterministic_empty_v03_migration: true,
  encrypted_save_open_and_tamper_regression: true,
  malformed_path_null_fingerprint_dangling_and_active_content_rejected: true,
  encrypted_fixture_sha256: fixedProjectVector,
  legacy_v03_fixture_sha256: legacyVector,
  inner_bytes: inner.length,
  source_count: document.state.evidence.sources.length
}));
