import fs from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';

const registry = JSON.parse(fs.readFileSync(new URL('../../integrated-suite-v0.2/contracts/registry.json', import.meta.url), 'utf8'));
globalThis.window = {
  __L2G_RELEASE__: {
    application: 'L2G Integrated Suite',
    version: '0.3.0',
    product_runtime_compatibility_baseline: '85d6e783a250b373cd4b9ea356e4c341336f9259',
    synthetic_only: true,
    artifact_name: 'L2G_Integrated_Suite_Engagement_Spine_v0.3.0.html',
    envelope_kind: 'l2g_encrypted_project_v1',
    project_kind: 'l2g_project_v1',
    engagement_schema_kind: 'l2g_engagement_v1',
    engagement_schema_version: '1.0'
  },
  __L2G_CONTRACT_REGISTRY__: registry
};

let uuidCounter = 1;
const deterministicCrypto = {
  subtle: webcrypto.subtle,
  getRandomValues: webcrypto.getRandomValues.bind(webcrypto),
  randomUUID: () => `00000000-0000-4000-8000-${String(uuidCounter++).padStart(12, '0')}`
};
Object.defineProperty(globalThis, 'crypto', { value: deterministicCrypto, configurable: true });
const OriginalDate = globalThis.Date;
const fixedTime = Date.parse('2026-08-04T12:00:00.000Z');
class FixedDate extends OriginalDate {
  constructor(...args) { super(...(args.length ? args : [fixedTime])); }
  static now() { return fixedTime; }
}
globalThis.Date = FixedDate;

const code = fs.readFileSync(new URL('../build/domain-test.js', import.meta.url), 'utf8') + '\nglobalThis.L2G=L2G;';
vm.runInThisContext(code);
const L = globalThis.L2G;
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const rejects = (fn, label) => {
  let rejected = false;
  try { fn(); } catch { rejected = true; }
  if (!rejected) throw new Error(`${label} was accepted.`);
};

const project = L.createNewProject();
L.validateProjectDocument(project, true);
assert(project.state.engagement.schema_kind === 'l2g_engagement_v1', 'Current project lacks engagement schema.');
const originalDelivery = project.state.engagement.identity.delivery_context;
const fixtureCandidate = project.state.engagement.candidates[0];
assert(fixtureCandidate.state === 'candidate', 'Fixture candidate is not pending.');
assert(project.state.engagement.identity.delivery_context === originalDelivery, 'Candidate creation mutated accepted identity.');
L.decideCandidate(project.state.engagement, fixtureCandidate.candidate_id, 'accept', 'Synthetic acceptance test.', 'advisor');
assert(project.state.engagement.identity.delivery_context.includes('Facilitated CMMC'), 'Candidate acceptance did not update accepted identity.');

const timestamp = new Date().toISOString();
const makeCandidate = (fields) => ({
  candidate_id: L.newId('candidate'),
  source_kind: 'synthetic-test',
  source_ref: L.newId('source'),
  target_type: 'identity',
  proposed_fields: fields,
  state: 'candidate',
  rationale: 'Synthetic candidate.',
  provenance: { source_kind: 'synthetic-test', source_id: L.newId('source'), asserted_at: timestamp, asserted_by: 'advisor', confidence: 'not-evaluated' },
  visibility: 'advisor-only'
});
const modifyCandidate = makeCandidate({ phase: 'discovery' });
project.state.engagement.candidates.push(modifyCandidate);
L.decideCandidate(project.state.engagement, modifyCandidate.candidate_id, 'modify', 'Use reviewed phase.', 'advisor', { phase: 'scoping' });
assert(project.state.engagement.identity.phase === 'scoping' && modifyCandidate.state === 'modified', 'Modify semantics failed.');
const rejectCandidate = makeCandidate({ client_name: 'Rejected Synthetic Name' });
project.state.engagement.candidates.push(rejectCandidate);
const clientBeforeReject = project.state.engagement.identity.client_name;
L.decideCandidate(project.state.engagement, rejectCandidate.candidate_id, 'reject', 'Rejected during synthetic review.', 'advisor');
assert(project.state.engagement.identity.client_name === clientBeforeReject && rejectCandidate.state === 'rejected', 'Reject mutated accepted identity.');
const supersededCandidate = makeCandidate({ objectives: 'Old proposal' });
project.state.engagement.candidates.push(supersededCandidate);
const replacement = L.supersedeCandidate(project.state.engagement, supersededCandidate.candidate_id, { objectives: 'Replacement proposal' }, 'Superseded with clearer synthetic wording.', 'advisor');
assert(supersededCandidate.state === 'superseded' && replacement.state === 'candidate' && replacement.supersedes_candidate_id === supersededCandidate.candidate_id, 'Supersede semantics failed.');
rejects(() => L.decideCandidate(project.state.engagement, rejectCandidate.candidate_id, 'accept', 'Second decision.', 'advisor'), 'Second candidate decision');
rejects(() => L.decideCandidate(project.state.engagement, replacement.candidate_id, 'accept', 'Client cannot decide.', 'client'), 'Client candidate decision');
L.validateProjectDocument(project, true);

const advisorProjection = L.buildEngagementProjection(project.state.engagement, 'overview', 'advisor', '2026-08-04T12:00:00.000Z');
const clientProjection = L.buildEngagementProjection(project.state.engagement, 'overview', 'client', '2026-08-04T12:00:00.000Z');
const reviewerProjection = L.buildEngagementProjection(project.state.engagement, 'overview', 'reviewer', '2026-08-04T12:00:00.000Z');
assert(Object.isFrozen(advisorProjection) && Object.isFrozen(advisorProjection.identity) && Object.isFrozen(advisorProjection.participants), 'Projection is not deeply frozen.');
assert(clientProjection.candidates.length === 0, 'Client projection leaked candidates.');
assert(clientProjection.participants.every(item => item.visibility !== 'advisor-only'), 'Client projection leaked advisor-only participant.');
assert(clientProjection.organizations.every(item => item.visibility !== 'advisor-only'), 'Client projection leaked advisor-only organization.');
assert(clientProjection.participants.every(item => !('provenance' in item)), 'Client projection leaked provenance.');
assert(reviewerProjection.participants.some(item => 'provenance' in item), 'Reviewer projection omitted provenance.');
const nextOne = L.calculateNextWork(project.state.engagement, '2026-08-04T12:00:00.000Z');
const nextTwo = L.calculateNextWork(project.state.engagement, '2026-08-04T12:00:00.000Z');
assert(JSON.stringify(nextOne) === JSON.stringify(nextTwo), 'Next-work calculation is not deterministic.');
assert(!JSON.stringify(nextOne).match(/readiness|compliance score|met\/not met/i), 'Next work contains prohibited conclusions.');

const duplicate = structuredClone(project);
duplicate.state.engagement.participants.push(structuredClone(duplicate.state.engagement.participants[0]));
rejects(() => L.validateProjectDocument(duplicate, true), 'Duplicate engagement identifier');
const dangling = structuredClone(project);
dangling.state.engagement.milestones[0].related_refs.push('question_missing_reference');
rejects(() => L.validateProjectDocument(dangling, true), 'Dangling engagement reference');
const unknown = structuredClone(project);
unknown.state.engagement.identity.unexpected = 'not allowed';
rejects(() => L.validateProjectDocument(unknown, true), 'Unknown engagement identity field');
const unsupported = structuredClone(project);
unsupported.state.engagement.identity.phase = 'certified';
rejects(() => L.validateProjectDocument(unsupported, true), 'Unsupported engagement phase');

async function createLegacyInner() {
  const legacyManifest = {
    kind: 'l2g_project_v1', schema_version: '1.0', project_id: 'project_legacy_0001',
    created_at: '2026-08-03T00:00:00.000Z', updated_at: '2026-08-03T00:00:00.000Z',
    application: { name: 'L2G Integrated Suite', version: '0.2.0', product_runtime_compatibility_baseline: '85d6e783a250b373cd4b9ea356e4c341336f9259' },
    evidence_policy: 'reference-only', encryption_mode: 'aes-256-gcm-pbkdf2-sha256-v1',
    domain_index: [
      { path: 'domains/engagement.json', schema: 'engagement_v1', authority: 'Engagement' },
      { path: 'domains/reviews-actions.json', schema: 'reviews_actions_v1', authority: 'Reviews & Actions' }
    ]
  };
  const legacyEngagement = {
    schema_version: 'engagement_v1', engagement_id: 'engagement_legacy_0001',
    engagement_name: 'Legacy Synthetic Engagement', client_name: 'Legacy Synthetic Client',
    system_name: 'Legacy Synthetic System', phase: 'Project Protection', objectives: 'Migrate synthetic legacy context.',
    participants: [{ id: 'participant_legacy_0001', name: 'Legacy Participant', role: 'Owner', organization: 'Legacy Synthetic Client', visibility: 'client-safe' }]
  };
  const reviews = { schema_version: 'reviews_actions_v1', examples: [] };
  const history = [{ event_id: 'event_legacy_0001', timestamp: '2026-08-03T00:00:00.000Z', profile: 'advisor', action: 'project.created', object_type: 'project', object_id: legacyManifest.project_id, summary: 'Created legacy synthetic project.', transaction_id: 'txn_legacy_0001' }];
  const payloads = new Map([
    ['manifest.json', L.utf8(L.stableStringify(legacyManifest))],
    ['domains/engagement.json', L.utf8(L.stableStringify(legacyEngagement))],
    ['domains/reviews-actions.json', L.utf8(L.stableStringify(reviews))],
    ['history/events.ndjson', L.utf8(history.map(item => JSON.stringify(item)).join('\n') + '\n')],
    ['history/checkpoints.json', L.utf8(L.stableStringify([]))],
    ['compatibility/current-registry.json', L.utf8(L.stableStringify(registry))]
  ]);
  const integrityEntries = [];
  for (const [path, data] of [...payloads.entries()].sort(([a], [b]) => a.localeCompare(b))) integrityEntries.push({ path, sha256: await L.sha256Hex(data), size: data.length });
  payloads.set('integrity/sha256-manifest.json', L.utf8(L.stableStringify({ algorithm: 'SHA-256', entries: integrityEntries })));
  return L.createStoredZip([...payloads.entries()].map(([path, data]) => ({ path, data })));
}

async function encryptLegacy(inner, passphrase) {
  const salt = Uint8Array.from({ length: 16 }, (_, index) => index + 1);
  const iv = Uint8Array.from({ length: 12 }, (_, index) => 0xb0 + index);
  const baseKey = await L.importPassphrase(passphrase);
  const key = await L.deriveAesKey(baseKey, salt);
  const metadata = {
    kind: 'l2g_encrypted_project_v1', version: '1.0', purpose: 'portable-project',
    cipher: { name: 'AES-GCM', key_bits: 256, tag_bits: 128, iv_b64: L.bytesToB64(iv) },
    kdf: { name: 'PBKDF2', hash: 'SHA-256', iterations: 600000, salt_b64: L.bytesToB64(salt) },
    inner: { media_type: 'application/vnd.l2g.project+zip', project_kind: 'l2g_project_v1', schema_version: '1.0', plaintext_bytes: inner.length, plaintext_sha256: await L.sha256Hex(inner) },
    application: { name: 'L2G Integrated Suite', version: '0.2.0' }
  };
  const aad = L.utf8(L.stableStringify(metadata, 0));
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv.slice().buffer, additionalData: aad.slice().buffer, tagLength: 128 }, key, inner.slice().buffer));
  return L.createStoredZip([{ path: 'ciphertext.bin', data: ciphertext }, { path: 'envelope.json', data: L.utf8(L.stableStringify(metadata)) }]);
}

const passphrase = 'Synthetic-Test-Passphrase-Only!';
const legacyInner = await createLegacyInner();
const legacyEncrypted = await encryptLegacy(legacyInner, passphrase);
const migrated = await L.decryptProject(legacyEncrypted, passphrase, 'portable-project');
assert(migrated.migrated === true, 'Encrypted v0.2 project did not report migration.');
assert(migrated.document.state.engagement.schema_kind === 'l2g_engagement_v1', 'Legacy engagement did not migrate.');
assert(migrated.document.checkpoints.some(item => item.name.includes('Migration')), 'Migration checkpoint missing.');
assert(migrated.document.history.some(item => item.action === 'engagement.migrated'), 'Migration history event missing.');
assert(migrated.document.manifest.application.version === '0.3.0', 'Migrated application identity is not v0.3.');

const fixedProject = L.createNewProject();
const fixedBase = await L.importPassphrase(passphrase);
const fixedSalt = Uint8Array.from({ length: 16 }, (_, index) => index);
const fixedIv = Uint8Array.from({ length: 12 }, (_, index) => 0xa0 + index);
const fixedPackage = await L.encryptProject(fixedProject, fixedBase, 'portable-project', { salt: fixedSalt, iv: fixedIv });
const roundTrip = await L.decryptProject(fixedPackage.bytes, passphrase, 'portable-project');
assert(roundTrip.document.state.engagement.identity.engagement_name === fixedProject.state.engagement.identity.engagement_name, 'Current encrypted round trip failed.');
const randomOne = await L.encryptProject(fixedProject, fixedBase, 'portable-project');
const randomTwo = await L.encryptProject(fixedProject, fixedBase, 'portable-project');
assert(!Buffer.from(randomOne.bytes).equals(Buffer.from(randomTwo.bytes)), 'Runtime encryption was deterministic.');
for (const [label, bytes, secret, purpose] of [
  ['wrong passphrase', fixedPackage.bytes, 'Wrong-Passphrase-Value!', 'portable-project'],
  ['purpose replay', fixedPackage.bytes, passphrase, 'browser-recovery']
]) {
  let rejected = false;
  try { await L.decryptProject(bytes, secret, purpose); } catch { rejected = true; }
  assert(rejected, `${label} was accepted.`);
}
const tampered = fixedPackage.bytes.slice();
tampered[Math.floor(tampered.length / 2)] ^= 1;
let tamperRejected = false;
try { await L.decryptProject(tampered, passphrase, 'portable-project'); } catch { tamperRejected = true; }
assert(tamperRejected, 'Tampered encrypted package was accepted.');
assert(!Buffer.from(fixedPackage.bytes).toString('utf8').includes(fixedProject.state.engagement.identity.engagement_name), 'Known plaintext leaked into encrypted package.');

const result = {
  fixed_vector_sha256: await L.sha256Hex(fixedPackage.bytes),
  fixed_vector_bytes: fixedPackage.bytes.length,
  legacy_encrypted_sha256: await L.sha256Hex(legacyEncrypted),
  candidate_accept_modify_reject_supersede: true,
  target_unchanged_before_acceptance: true,
  client_filtering_before_render: true,
  immutable_projection: true,
  deterministic_next_work: true,
  malformed_duplicate_and_dangling_rejected: true,
  encrypted_v02_migration: true,
  nondeterministic_runtime_encryption: true,
  wrong_passphrase_purpose_replay_and_tamper_rejected: true
};
const fixtureDir = new URL('../build/fixtures/', import.meta.url);
fs.mkdirSync(fixtureDir, { recursive: true });
fs.writeFileSync(new URL('fixed-v03-project.l2g', fixtureDir), Buffer.from(fixedPackage.bytes));
fs.writeFileSync(new URL('legacy-v02-encrypted-project.l2g', fixtureDir), Buffer.from(legacyEncrypted));
fs.writeFileSync(new URL('legacy-v02-inner-project.l2g', fixtureDir), Buffer.from(legacyInner));
fs.writeFileSync(new URL('domain-test-results.json', fixtureDir), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
