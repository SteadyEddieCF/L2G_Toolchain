import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import cryptoModule from 'node:crypto';
const root = path.resolve(import.meta.dirname, '..');
const release = JSON.parse(fs.readFileSync(path.join(root,'release','release.json'),'utf8'));
const registry = JSON.parse(fs.readFileSync(path.join(root,'contracts','registry.json'),'utf8'));
globalThis.window = { __L2G_RELEASE__: release, __L2G_CONTRACT_REGISTRY__: registry };
globalThis.crypto ??= cryptoModule.webcrypto;
vm.runInThisContext(fs.readFileSync(path.join(root,'build','test-runtime.js'),'utf8'), { filename:'test-runtime.js' });
let sequence = 0;
L2G.nowIso = () => '2026-08-03T00:00:00.000Z';
L2G.newId = prefix => `${prefix}_fixed_${String(++sequence).padStart(4,'0')}`;
const document = L2G.createNewProject();
document.state.engagement.identity.engagement_name = 'Fixed Synthetic Engagement Spine';
document.state.engagement.identity.client_name = 'Fixed Synthetic Client';
document.state.engagement.identity.system_name = 'Fixed Synthetic System';
const passphrase = 'Synthetic-v0.3-Passphrase!';
const baseKey = await L2G.importPassphrase(passphrase);
const salt = Uint8Array.from({length:16},(_,i)=>i);
const iv = Uint8Array.from({length:12},(_,i)=>16+i);
const encrypted = await L2G.encryptProject(document, baseKey, 'portable-project', {salt,iv});
const inner = await L2G.serializeInnerProject(document);
const fixtureDir = path.join(root,'build','fixtures'); fs.mkdirSync(fixtureDir,{recursive:true});
fs.writeFileSync(path.join(fixtureDir,'synthetic-engagement-v0.3.l2g'), encrypted.bytes);
const vector = { kind:'l2g_v03_fixed_vector_v1', passphrase, salt_hex:Buffer.from(salt).toString('hex'), iv_hex:Buffer.from(iv).toString('hex'), inner_sha256:await L2G.sha256Hex(inner), encrypted_sha256:await L2G.sha256Hex(encrypted.bytes), encrypted_bytes:encrypted.bytes.length, engagement_schema:'l2g_engagement_v1' };
fs.writeFileSync(path.join(fixtureDir,'fixed-vector.json'), JSON.stringify(vector,null,2)+'\n');

async function createLegacyInner(encryptionMode) {
  const now='2026-08-03T00:00:00.000Z';
  const manifest={kind:'l2g_project_v1',schema_version:'1.0',project_id:'project_legacy_migration_001',created_at:now,updated_at:now,application:{name:'L2G Integrated Suite',version:encryptionMode==='none-synthetic-foundation-only'?'0.1.0':'0.2.0',product_runtime_compatibility_baseline:release.product_runtime_compatibility_baseline},evidence_policy:'reference-only',encryption_mode:encryptionMode,domain_index:[{path:'domains/engagement.json',schema:'engagement_v1',authority:'Engagement'},{path:'domains/reviews-actions.json',schema:'reviews_actions_v1',authority:'Reviews & Actions'}]};
  const engagement={schema_version:'engagement_v1',engagement_id:'engagement_legacy_migration_001',engagement_name:'Legacy Migration Synthetic Engagement',client_name:'Legacy Migration Client',system_name:'Legacy Migration System',phase:'Project Protection',objectives:'Validate deterministic Engagement Spine migration.',participants:[{id:'participant_legacy_migration_001',name:'Legacy Synthetic Lead',role:'Program Lead',organization:'Legacy Synthetic Organization',visibility:'client-safe'}]};
  const reviews={schema_version:'reviews_actions_v1',examples:[{id:'review_legacy_migration_001',title:'Legacy migration review',source_domain:'Overview',target_domain:'Reviews & Actions',lifecycle:'Proposed',review_state:'Assigned',operational_state:'Open',visibility:'Advisor-only',rationale:'Synthetic migration fixture.'}]};
  const history=[{event_id:'event_legacy_migration_001',timestamp:now,profile:'advisor',action:'project.created',object_type:'project',object_id:manifest.project_id,summary:'Created legacy synthetic migration fixture.',transaction_id:'txn_legacy_migration_001'}];
  const payloads=new Map([['manifest.json',L2G.utf8(L2G.stableStringify(manifest))],['domains/engagement.json',L2G.utf8(L2G.stableStringify(engagement))],['domains/reviews-actions.json',L2G.utf8(L2G.stableStringify(reviews))],['history/events.ndjson',L2G.utf8(history.map(x=>JSON.stringify(x)).join('\n')+'\n')],['history/checkpoints.json',L2G.utf8('[]')],['compatibility/current-registry.json',L2G.utf8(L2G.stableStringify(registry))]]);
  const entries=[]; for(const [p,d] of [...payloads].sort(([a],[b])=>a.localeCompare(b))) entries.push({path:p,sha256:await L2G.sha256Hex(d),size:d.length});
  payloads.set('integrity/sha256-manifest.json',L2G.utf8(L2G.stableStringify({algorithm:'SHA-256',entries})));
  return L2G.createStoredZip([...payloads].map(([path,data])=>({path,data})));
}
async function wrapLegacy(inner, passphrase, salt, iv) {
  const baseKey=await L2G.importPassphrase(passphrase); const key=await L2G.deriveAesKey(baseKey,salt);
  const metadata={kind:'l2g_encrypted_project_v1',version:'1.0',purpose:'portable-project',cipher:{name:'AES-GCM',key_bits:256,tag_bits:128,iv_b64:L2G.bytesToB64(iv)},kdf:{name:'PBKDF2',hash:'SHA-256',iterations:600000,salt_b64:L2G.bytesToB64(salt)},inner:{media_type:'application/vnd.l2g.project+zip',project_kind:'l2g_project_v1',schema_version:'1.0',plaintext_bytes:inner.length,plaintext_sha256:await L2G.sha256Hex(inner)},application:{name:'L2G Integrated Suite',version:'0.2.0'}};
  const aad=L2G.utf8(L2G.stableStringify(metadata,0)); const ciphertext=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv:iv.slice().buffer,additionalData:aad.slice().buffer,tagLength:128},key,inner.slice().buffer));
  return L2G.createStoredZip([{path:'ciphertext.bin',data:ciphertext},{path:'envelope.json',data:L2G.utf8(L2G.stableStringify(metadata))}]);
}
const legacyV02Inner=await createLegacyInner('aes-256-gcm-pbkdf2-sha256-v1');
const legacyPassphrase='Synthetic-v0.2-Migration!';
const legacyEncrypted=await wrapLegacy(legacyV02Inner,legacyPassphrase,Uint8Array.from({length:16},(_,i)=>32+i),Uint8Array.from({length:12},(_,i)=>64+i));
fs.writeFileSync(path.join(fixtureDir,'legacy-v0.2-encrypted.l2g'),legacyEncrypted);
const legacyV01=await createLegacyInner('none-synthetic-foundation-only'); fs.writeFileSync(path.join(fixtureDir,'legacy-v0.1-unencrypted.l2g'),legacyV01);
fs.writeFileSync(path.join(fixtureDir,'migration-fixtures.json'),JSON.stringify({kind:'l2g_v03_migration_fixtures_v1',v02_passphrase:legacyPassphrase,v02_sha256:await L2G.sha256Hex(legacyEncrypted),v01_sha256:await L2G.sha256Hex(legacyV01)},null,2)+'\n');
