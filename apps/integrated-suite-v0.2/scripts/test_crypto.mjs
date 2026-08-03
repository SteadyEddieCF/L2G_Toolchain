import fs from 'node:fs';
import vm from 'node:vm';

globalThis.window = {
  __L2G_RELEASE__: {
    application: 'L2G Integrated Suite',
    version: '0.2.0',
    product_runtime_compatibility_baseline: '85d6e783a250b373cd4b9ea356e4c341336f9259',
    synthetic_only: true,
    artifact_name: 'L2G_Integrated_Suite_Encrypted_Project_v0.2.0.html'
  },
  __L2G_CONTRACT_REGISTRY__: JSON.parse(fs.readFileSync(new URL('../contracts/registry.json', import.meta.url)))
};
const code = fs.readFileSync(new URL('../build/crypto-test.js', import.meta.url), 'utf8') + '\nglobalThis.L2G=L2G;';
vm.runInThisContext(code);
const L = globalThis.L2G;
const fixed = {
  manifest: {
    kind: 'l2g_project_v1', schema_version: '1.0',
    project_id: 'project_00000000-0000-4000-8000-000000000001',
    created_at: '2026-08-03T00:00:00.000Z', updated_at: '2026-08-03T00:00:00.000Z',
    application: { name: 'L2G Integrated Suite', version: '0.2.0', product_runtime_compatibility_baseline: '85d6e783a250b373cd4b9ea356e4c341336f9259' },
    evidence_policy: 'reference-only', encryption_mode: 'aes-256-gcm-pbkdf2-sha256-v1',
    domain_index: [
      { path: 'domains/engagement.json', schema: 'engagement_v1', authority: 'Engagement' },
      { path: 'domains/reviews-actions.json', schema: 'reviews_actions_v1', authority: 'Reviews & Actions' }
    ]
  },
  state: {
    engagement: {
      schema_version: 'engagement_v1', engagement_id: 'engagement_00000000-0000-4000-8000-000000000001',
      engagement_name: 'McFirecoal Synthetic Encrypted Engagement', client_name: 'McFirecoal Synthetic Client',
      system_name: 'Integrated Suite Encrypted Project', phase: 'Project Protection', objectives: 'Fixed synthetic cryptographic vector.', participants: []
    },
    reviews_actions: {
      schema_version: 'reviews_actions_v1',
      examples: [{ id: 'review_00000000-0000-4000-8000-000000000001', title: 'Confirm encrypted-project safety boundary', source_domain: 'Overview', target_domain: 'Reviews & Actions', lifecycle: 'Proposed', review_state: 'Assigned', operational_state: 'Open', visibility: 'Advisor-only', rationale: 'Fixed synthetic vector.' }]
    },
    profile: 'advisor', active_workspace: 'overview', inspector_open: false, inspector_pinned: false, rail_collapsed: false
  },
  history: [{ event_id: 'event_00000000-0000-4000-8000-000000000001', timestamp: '2026-08-03T00:00:00.000Z', profile: 'advisor', action: 'project.created', object_type: 'project', object_id: 'project_00000000-0000-4000-8000-000000000001', summary: 'Created fixed synthetic encrypted project.', transaction_id: 'txn_00000000-0000-4000-8000-000000000001' }],
  checkpoints: []
};
const passphrase = 'Synthetic-Test-Passphrase-Only!';
const base = await L.importPassphrase(passphrase);
const salt = Uint8Array.from({ length: 16 }, (_, index) => index);
const iv = Uint8Array.from({ length: 12 }, (_, index) => 0xa0 + index);
const fixedPackage = await L.encryptProject(fixed, base, 'portable-project', { salt, iv });
const decoded = await L.decryptProject(fixedPackage.bytes, passphrase, 'portable-project');
if (decoded.document.state.engagement.engagement_name !== fixed.state.engagement.engagement_name) throw new Error('Round trip mismatch.');
const randomOne = await L.encryptProject(fixed, base, 'portable-project');
const randomTwo = await L.encryptProject(fixed, base, 'portable-project');
if (Buffer.from(randomOne.bytes).equals(Buffer.from(randomTwo.bytes))) throw new Error('Runtime encryption was deterministic.');
for (const [label, bytes, secret, purpose] of [
  ['wrong passphrase', fixedPackage.bytes, 'Wrong-Passphrase-Value!', 'portable-project'],
  ['purpose replay', fixedPackage.bytes, passphrase, 'browser-recovery']
]) {
  let rejected = false;
  try { await L.decryptProject(bytes, secret, purpose); } catch { rejected = true; }
  if (!rejected) throw new Error(`${label} was accepted.`);
}
const tampered = fixedPackage.bytes.slice();
tampered[Math.floor(tampered.length / 2)] ^= 1;
let tamperRejected = false;
try { await L.decryptProject(tampered, passphrase, 'portable-project'); } catch { tamperRejected = true; }
if (!tamperRejected) throw new Error('Tampered encrypted package was accepted.');
if (Buffer.from(fixedPackage.bytes).toString('utf8').includes(fixed.state.engagement.engagement_name)) throw new Error('Known plaintext leaked into encrypted package.');
const result = {
  fixed_vector_sha256: await L.sha256Hex(fixedPackage.bytes),
  fixed_vector_bytes: fixedPackage.bytes.length,
  inner_name: decoded.document.state.engagement.engagement_name,
  nondeterministic_runtime: true,
  wrong_passphrase_rejected: true,
  purpose_replay_rejected: true,
  tamper_rejected: true
};
fs.mkdirSync(new URL('../build/fixtures/', import.meta.url), { recursive: true });
fs.writeFileSync(new URL('../build/fixtures/fixed-encrypted-project.l2g', import.meta.url), Buffer.from(fixedPackage.bytes));
fs.writeFileSync(new URL('../build/fixtures/fixed-vector.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
