#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, re
ROOT=Path(__file__).resolve().parents[1]
RUNTIME=ROOT/'CMMC_L2_SSP_Modern_Editable_v1.9.12.html'
BASE=ROOT.parent/'v1.9.11'/'CMMC_L2_SSP_Modern_Editable_v1.9.11.html'
SCHEMA=ROOT.parent/'v1.9.11'/'CMMC_L2_SSP_Data_Schema_v1.9.11.json'
REGISTRY=ROOT.parent/'v1.9.9'/'CMMC_L2_SSP_Built_In_Review_Profile_Registry_v1.9.9.json'
REGISTRY_SCHEMA=ROOT.parent/'v1.9.9'/'CMMC_L2_SSP_Built_In_Review_Profile_Registry_Schema_v1.1.json'
EXPECTED={'runtime':'1980bcff89633b13d20e17ba8862bda660afdaf06c0afd2f1e968a9b26eb0a6c','baseline':'4e2db5ccf4a520519a0f6845d36ec7f543febf3b45b9a9934cf48ce4d61bc3f6','schema':'7d1ed6c95415360ad5f805cf103e3c777fd9ef52dc1e4bedecbb2cf30c223251','registry':'8deb8917615046f9b85ed34f7c5fac061f6756e44cbd6a8677e935487bfedfc2','registry_schema':'a0ca7d06d5811c73015f79ac2f763efe6534c791bd02e48d77a71dfe075ae67f'}
def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()
for label,path in [('runtime',RUNTIME),('baseline',BASE),('schema',SCHEMA),('registry',REGISTRY),('registry_schema',REGISTRY_SCHEMA)]:
    assert sha(path)==EXPECTED[label],(label,sha(path),EXPECTED[label])
text=RUNTIME.read_text(encoding='utf-8');base=BASE.read_text(encoding='utf-8')
assert "const RELEASE_VERSION='1.9.12';" in text
assert "const APP_VERSION='1.9.12';" in text
assert "const SCHEMA='cmmc-l2-ssp-modern-v1.9.11';" in text
assert text.count('class="control-card"')==110
for required in ['ssp-v1912-compact-responsive-chrome','__sspUx4ChromeTestHooks','Quick workspace actions','undoMenuBtn','redoMenuBtn','printMenuBtn','#stateLocalWarning{display:none!important}','#uxPortfolioScopeWrap[hidden]{display:none!important}','CMMC L2 SSP <span class="brand-version">v1.9.12</span>']:
    assert required in text,required
for forbidden in ['cmmc_l2_builder_merger_word_qa','final_word_qa_sidecar',"const SCHEMA='cmmc-l2-ssp-modern-v1.9.12';"]:
    assert forbidden not in text,forbidden
urls=lambda value:set(re.findall(r'https?://[^\s"\'<>`]+',value))
assert urls(text)==urls(base)
manifest=json.loads((ROOT/'source'/'RUNTIME_TRANSFORM_MANIFEST_v1.9.12.json').read_text())
assert manifest['baselineRuntimeSha256']==EXPECTED['baseline']
assert manifest['runtimeOutputSha256']==EXPECTED['runtime']
assert manifest['governedArtifacts']['workingDataSchema']['changed'] is False
assert manifest['governedArtifacts']['packageContractsChanged'] is False
assert manifest['governedArtifacts']['crossToolHandshakeRequired'] is False
print('SSP v1.9.12 compact responsive chrome static gate passed')
