#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, re
ROOT=Path(__file__).resolve().parents[1]
RUNTIME=ROOT/'CMMC_L2_SSP_Modern_Editable_v1.9.16.html'
BASE=ROOT.parent/'v1.9.15'/'CMMC_L2_SSP_Modern_Editable_v1.9.15.html'
SCHEMA=ROOT.parent/'v1.9.11'/'CMMC_L2_SSP_Data_Schema_v1.9.11.json'
REGISTRY=ROOT.parent/'v1.9.9'/'CMMC_L2_SSP_Built_In_Review_Profile_Registry_v1.9.9.json'
REGISTRY_SCHEMA=ROOT.parent/'v1.9.9'/'CMMC_L2_SSP_Built_In_Review_Profile_Registry_Schema_v1.1.json'
EXPECTED={'runtime':'f463f01d8b24ec3865467261659f8e90222b23bb9875282e665f04bec778a765','baseline':'5e3a628556fc63db777fbef813eee8df9e2d8a1405a81bd87c058012503f2361','schema':'7d1ed6c95415360ad5f805cf103e3c777fd9ef52dc1e4bedecbb2cf30c223251','registry':'8deb8917615046f9b85ed34f7c5fac061f6756e44cbd6a8677e935487bfedfc2','registry_schema':'a0ca7d06d5811c73015f79ac2f763efe6534c791bd02e48d77a71dfe075ae67f'}
def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()
for label,path in [('runtime',RUNTIME),('baseline',BASE),('schema',SCHEMA),('registry',REGISTRY),('registry_schema',REGISTRY_SCHEMA)]: assert sha(path)==EXPECTED[label],(label,sha(path),EXPECTED[label])
text=RUNTIME.read_text(encoding='utf-8');base=BASE.read_text(encoding='utf-8')
assert '<title>CMMC Level 2 System Security Plan - Modern Editable v1.9.16</title>' in text
assert "const RELEASE_VERSION='1.9.16';" in text and "const APP_VERSION='1.9.16';" in text
assert "const SCHEMA='cmmc-l2-ssp-modern-v1.9.11';" in text
assert text.count('class="control-card"')==110
for required in ['ssp-v1916-review-workspace-compact-header','id="rg2SetupToggle"','aria-controls="rg2SetupPanel"','id="rg2SetupPanel"','id="rg2SummaryStrip"','RG2_SETUP_SESSION_KEY','rg2ApplySetupDefault','rg2ToggleSetup','window.innerHeight>=1000','Review setup &amp; summary','Profile adoption preview — no data mutation','Authority and persistence boundary','data-close-rg2 type="button" class="modal-close-icon"']:
    assert required in text,required
for forbidden in ["const SCHEMA='cmmc-l2-ssp-modern-v1.9.16';",'cmmc_l2_builder_merger_word_qa']:
    assert forbidden not in text,forbidden
urls=lambda value:set(re.findall(r'https?://[^\s"\'<>`]+',value))
assert urls(text)==urls(base)
manifest=json.loads((ROOT/'source'/'RUNTIME_TRANSFORM_MANIFEST_v1.9.16.json').read_text())
assert manifest['baselineRuntimeSha256']==EXPECTED['baseline'] and manifest['runtimeOutputSha256']==EXPECTED['runtime']
assert manifest['governedArtifacts']['workingDataSchema']['changed'] is False
assert manifest['governedArtifacts']['builtInProfileRegistry']['changed'] is False
assert manifest['governedArtifacts']['registrySchema']['changed'] is False
assert manifest['governedArtifacts']['packageContractsChanged'] is False
assert manifest['governedArtifacts']['crossToolHandshakeRequired'] is False
print('SSP v1.9.16 Review Workspace compact-header static gate passed')
