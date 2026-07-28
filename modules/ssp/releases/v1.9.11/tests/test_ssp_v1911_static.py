#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, re

ROOT=Path(__file__).resolve().parents[1]
RUNTIME=ROOT/'CMMC_L2_SSP_Modern_Editable_v1.9.11.html'
BASE=ROOT.parent/'v1.9.10'/'CMMC_L2_SSP_Modern_Editable_v1.9.10.html'
SCHEMA=ROOT/'CMMC_L2_SSP_Data_Schema_v1.9.11.json'
REGISTRY=ROOT.parent/'v1.9.9'/'CMMC_L2_SSP_Built_In_Review_Profile_Registry_v1.9.9.json'
REGISTRY_SCHEMA=ROOT.parent/'v1.9.9'/'CMMC_L2_SSP_Built_In_Review_Profile_Registry_Schema_v1.1.json'
EXPECTED={'runtime':'4e2db5ccf4a520519a0f6845d36ec7f543febf3b45b9a9934cf48ce4d61bc3f6','baseline':'a282173c4a8ea23e59d6091a5f68c09757393df2c2d18b92b72569f69310f91c','schema':'7d1ed6c95415360ad5f805cf103e3c777fd9ef52dc1e4bedecbb2cf30c223251','registry':'8deb8917615046f9b85ed34f7c5fac061f6756e44cbd6a8677e935487bfedfc2','registry_schema':'a0ca7d06d5811c73015f79ac2f763efe6534c791bd02e48d77a71dfe075ae67f'}
def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()
assert sha(RUNTIME)==EXPECTED['runtime']
assert sha(BASE)==EXPECTED['baseline']
assert sha(SCHEMA)==EXPECTED['schema']
assert sha(REGISTRY)==EXPECTED['registry']
assert sha(REGISTRY_SCHEMA)==EXPECTED['registry_schema']
text=RUNTIME.read_text(encoding='utf-8'); base=BASE.read_text(encoding='utf-8')
assert "const RELEASE_VERSION='1.9.11';" in text
assert "const APP_VERSION='1.9.11';" in text
assert "const SCHEMA='cmmc-l2-ssp-modern-v1.9.11';" in text
assert text.count('class="control-card"')==110
for required in ['__sspRg3TestHooks','wordReviewInspections','RG3-PACKAGE-VALIDITY','RG3-ARTIFACT-HASH','RG3-EXPECTED-SECTIONS','RG3-PLACEHOLDER-DETECTION','RG3-MANIFEST-RECONCILIATION','RG3-SOURCE-FINGERPRINT','RG3-COMMENT-COUNT','RG3-REVISION-COUNT','Preliminary Word-review-copy inspection','not final Word QA','needs-human-review','inspection-superseded','RG3-INSPECTION-STALE']:
    assert required in text, required
for forbidden in ['cmmc_l2_builder_merger_word_qa','final_word_qa_sidecar',"package_kind:'cmmc_l2_ssp_word_inspection'"]:
    assert forbidden not in text, forbidden
schema=json.loads(SCHEMA.read_text(encoding='utf-8'))
assert schema['$schema']=='https://json-schema.org/draft/2020-12/schema'
assert schema['type']=='object'
assert schema['additionalProperties'] is False
assert schema['properties']['schema']['const']=='cmmc-l2-ssp-modern-v1.9.11'
assert schema['properties']['schemaVersion']['const']=='1.9.11'
assert 'wordReviewInspections' in schema['required']
item=schema['properties']['wordReviewInspections']['items']
assert item['type']=='object' and item['additionalProperties'] is False
assert item['properties']['inspectionKind']['const']=='preliminary-ssp-word-review-copy'
assert set(item['properties']['checks']['items']['properties']['status']['enum'])=={'pass','fail','needs-human-review','not-applicable'}
registry=json.loads(REGISTRY.read_text(encoding='utf-8'))
assert [p['profileVersion'] for p in registry['profiles']]==['0.1','0.2']
assert len(registry['profiles'][0]['items'])==12
assert len(registry['profiles'][1]['items'])==35
assert registry['profiles'][1]['items'][:12]==registry['profiles'][0]['items']
urls=lambda value:set(re.findall(r'https?://[^\s"\'<>`]+',value))
assert urls(text)==urls(base)
manifest=json.loads((ROOT/'source'/'RUNTIME_TRANSFORM_MANIFEST_v1.9.11.json').read_text())
assert manifest['baselineRuntimeSha256']==EXPECTED['baseline']
assert manifest['runtimeOutputSha256']==EXPECTED['runtime']
assert manifest['governedArtifacts']['packageContractsChanged'] is False
assert manifest['governedArtifacts']['crossToolHandshakeRequired'] is False
print('SSP v1.9.11 bounded RG-3 static gate passed')
