#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, subprocess, sys, tempfile
ROOT=Path(__file__).resolve().parents[1]
RUNTIME=ROOT/'CMMC_L2_SSP_Modern_Editable_v1.9.17.html'
BASE=ROOT.parent/'v1.9.16'/'CMMC_L2_SSP_Modern_Editable_v1.9.16.html'
SCHEMA=ROOT.parent/'v1.9.11'/'CMMC_L2_SSP_Data_Schema_v1.9.11.json'
REGISTRY=ROOT.parent/'v1.9.9'/'CMMC_L2_SSP_Built_In_Review_Profile_Registry_v1.9.9.json'
REGISTRY_SCHEMA=ROOT.parent/'v1.9.9'/'CMMC_L2_SSP_Built_In_Review_Profile_Registry_Schema_v1.1.json'
FIX=ROOT/'tests'/'fixtures'
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def req(label,actual,expected):
    if actual!=expected: raise SystemExit(f'{label}: {actual} != {expected}')
subprocess.run([sys.executable,str(ROOT/'materialize.py')],check=True)
req('baseline',sha(BASE),'f463f01d8b24ec3865467261659f8e90222b23bb9875282e665f04bec778a765')
req('runtime',sha(RUNTIME),'bfd9d10a780809ba259406f0770641da6a40ac2d8a6d1e372b070d6f5273351b')
if RUNTIME.stat().st_size!=2266611: raise SystemExit('runtime size mismatch')
req('schema',sha(SCHEMA),'7d1ed6c95415360ad5f805cf103e3c777fd9ef52dc1e4bedecbb2cf30c223251')
req('registry',sha(REGISTRY),'8deb8917615046f9b85ed34f7c5fac061f6756e44cbd6a8677e935487bfedfc2')
req('registry schema',sha(REGISTRY_SCHEMA),'a0ca7d06d5811c73015f79ac2f763efe6534c791bd02e48d77a71dfe075ae67f')
sidecars={
'l2g_ssp_word_qa_sidecar_v1_current_attempt1.json':'31ad14f35cd2c242a1e0589b33245b34770cd262059772ec59510224ada699cf',
'l2g_ssp_word_qa_sidecar_v1_changed_source_attempt2.json':'2bb7c44c45fcc8dfee0a06097d5baeacbb8dad08e8561d4e9cacead80fb9ca95',
'l2g_ssp_word_qa_sidecar_v1_qa_incomplete.json':'ce0bbe0d52eea412ec8820f00ea859f65dd4c78ea963e8b762dd8ec8a6a79490',
'l2g_ssp_word_qa_sidecar_v1_qa_blocked.json':'4c4e9eb02cbc203d98d9412c7e4641f78a2396a18a1f8c12bd5438608799d5f8'}
for name,expected in sidecars.items(): req(name,sha(FIX/name),expected); json.loads((FIX/name).read_text())
text=RUNTIME.read_text(encoding='utf-8')
for marker in ['1.9.17','l2g_ssp_word_qa_sidecar_v1','wordQaSidecarEvidence','__sspRg4TestHooks','RG-4 evidence has been recorded','qa_complete','qa_incomplete','qa_blocked']:
    if marker not in text: raise SystemExit(f'missing runtime marker {marker}')
if text.count('class="control-card"')!=110: raise SystemExit('authoritative control count changed')
if 'cmmc-l2-ssp-modern-v1.9.11' not in text: raise SystemExit('working-data schema changed')
for claim in ['CMMC readiness confirmed','certified compliant','final client release approved']:
    if claim in text: raise SystemExit(f'prohibited claim: {claim}')
scripts=[]
for chunk in text.split('<script>')[1:]:
    if '</script>' in chunk: scripts.append(chunk.split('</script>',1)[0])
with tempfile.TemporaryDirectory() as td:
    for i,script in enumerate(scripts):
        p=Path(td)/f's{i}.js';p.write_text(script,encoding='utf-8');subprocess.run(['node','--check',str(p)],check=True)
print('SSP v1.9.17 static gate passed')
