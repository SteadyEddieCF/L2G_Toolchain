#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, re

ROOT=Path(__file__).resolve().parents[1]
RUNTIME=ROOT/'CMMC_L2_SSP_Modern_Editable_v1.9.10.html'
BASE=ROOT.parent/'v1.9.9'/'CMMC_L2_SSP_Modern_Editable_v1.9.9.html'
SCHEMA=ROOT.parent/'v1.9.9'/'CMMC_L2_SSP_Data_Schema_v1.9.9.json'
REGISTRY=ROOT.parent/'v1.9.9'/'CMMC_L2_SSP_Built_In_Review_Profile_Registry_v1.9.9.json'
REGISTRY_SCHEMA=ROOT.parent/'v1.9.9'/'CMMC_L2_SSP_Built_In_Review_Profile_Registry_Schema_v1.1.json'
EXPECTED={
 'runtime':'a282173c4a8ea23e59d6091a5f68c09757393df2c2d18b92b72569f69310f91c',
 'baseline':'4df58dd45c369fd2c3ec6e49e81fa8887f80859dddd4fbd9b00f410679144927',
 'schema':'2d093d34b6260822d8be2547a50c3dc5c6c3e73100c9f0fc6fcb2794a84903b1',
 'registry':'8deb8917615046f9b85ed34f7c5fac061f6756e44cbd6a8677e935487bfedfc2',
 'registry_schema':'a0ca7d06d5811c73015f79ac2f763efe6534c791bd02e48d77a71dfe075ae67f',
}
def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()
assert sha(RUNTIME)==EXPECTED['runtime']
assert sha(BASE)==EXPECTED['baseline']
assert sha(SCHEMA)==EXPECTED['schema']
assert sha(REGISTRY)==EXPECTED['registry']
assert sha(REGISTRY_SCHEMA)==EXPECTED['registry_schema']
text=RUNTIME.read_text(encoding='utf-8')
base=BASE.read_text(encoding='utf-8')
assert "const RELEASE_VERSION='1.9.10';" in text
assert "const APP_VERSION='1.9.9';" in text
assert "const SCHEMA='cmmc-l2-ssp-modern-v1.9.9';" in text
assert text.count('class="control-card"')==110
for required in ['__sspUx3TestHooks','ux3NeedsAttentionModal','Needs Attention','Derived presentation state only','External read-only','never stored in governed SSP backups','not a readiness, risk, compliance, assessment, certification, or client-release conclusion']:
    assert required in text, required
for forbidden in ['needsAttentionQueue:', 'ux3Items:', 'package_kind:\'cmmc_l2_ssp_needs_attention']:
    assert forbidden not in text, forbidden
urls=lambda value:set(re.findall(r'https?://[^\s"\'<>`]+',value))
assert urls(text)==urls(base)
manifest=json.loads((ROOT/'source'/'RUNTIME_TRANSFORM_MANIFEST_v1.9.10.json').read_text())
assert manifest['baselineRuntimeSha256']==EXPECTED['baseline']
assert manifest['runtimeOutputSha256']==EXPECTED['runtime']
assert manifest['governedArtifacts']['packageContractsChanged'] is False
assert not (ROOT/'CMMC_L2_SSP_Data_Schema_v1.9.10.json').exists()
assert not (ROOT/'CMMC_L2_SSP_Built_In_Review_Profile_Registry_v1.9.10.json').exists()
print('SSP v1.9.10 bounded UX-3 static gate passed')
