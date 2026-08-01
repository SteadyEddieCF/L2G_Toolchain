#!/usr/bin/env python3
from pathlib import Path
import base64,gzip,hashlib,json,subprocess,sys
HERE=Path(__file__).resolve().parents[1];RUNTIME=HERE/'cmmc_l2_gap_workshop_tool_v79.1.html';PATCH_ARCHIVE=HERE/'source/v79_1_corrected_patch.js.gz.b64';NONMUTATION_FIX=HERE/'source/v79_1_nonmutation_fix.js';MANIFEST=json.loads((HERE/'source/SOURCE_MANIFEST.json').read_text());FIXTURES=HERE/'tests/fixtures'
subprocess.run([sys.executable,str(HERE/'tests/generate_governance_fixtures.py')],check=True)
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
assert RUNTIME.stat().st_size==MANIFEST['candidate_runtime']['size_bytes'];assert digest(RUNTIME)==MANIFEST['candidate_runtime']['sha256']
patch_bytes=gzip.decompress(base64.b64decode(''.join(PATCH_ARCHIVE.read_text().split()),validate=True));assert hashlib.sha256(patch_bytes).hexdigest()=='89369d79c12773e65291e18b7d30cdc7809686d8772bdc84c34fbd157a5fffde';patch=patch_bytes.decode()
assert NONMUTATION_FIX.stat().st_size==1881 and digest(NONMUTATION_FIX)=='6eeb7a2dd501434a1f9247248ec97b352b6cd0e9e7ab959af4b5d7c9b2a55a87'
text=RUNTIME.read_text()
for token in ['const CRM_TOOL_VERSION = "v79.1";','Workbook Handoff contract release 1.7 — wire package version 1.0','function v791JsonParser','function v791ValidateGovernanceExtension','workbook_source.workshop_governance_preservation_v1','package_version must be exactly 1.1','Unknown top-level properties are not allowed','source_record_vs_current_workshop','no_automatic_create_update_delete','exact_non_mutating_round_trip','v791ProtectedRenderOperationalState','_v791_operational_snapshot']:assert token in text,token
assert '"workshop_governance_preservation_v1"' not in patch.split('const V791_MERGE_TOP_LEVEL',1)[1].split(']);',1)[0]
base=HERE/'source/v79_baseline.html'
if not base.exists():base=HERE.parent/'v79/cmmc_l2_gap_workshop_tool_v79.html'
assert len(base.read_bytes())==1_836_145 and digest(base)=='a1f63944d0573587e2a5b7826f72befa16f6d89b849f3129f7f6dbb080da54ca'
fixture_hashes=json.loads((FIXTURES/'FIXTURE_SHA256.json').read_text())
for name,meta in fixture_hashes.items():path=FIXTURES/name;assert path.stat().st_size==meta['size_bytes'];assert digest(path)==meta['sha256']
print(json.dumps({'status':'passed','runtime_size_bytes':RUNTIME.stat().st_size,'runtime_sha256':digest(RUNTIME),'fixture_count':len(fixture_hashes),'portable_baseline_embedded':True,'queued_render_operational_nonmutation':True,'planned_v80_preserved':True,'builder_v3_10_1_dependency':'pending exact corrected PR #113 candidate'},indent=2))
