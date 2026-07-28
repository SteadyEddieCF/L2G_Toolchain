#!/usr/bin/env python3
from pathlib import Path
import base64, hashlib, lzma, re, subprocess, sys

ROOT=Path(__file__).resolve().parent
SOURCE=ROOT/'source'
BASELINE_ROOT=ROOT.parent/'v1.9.11'
BASELINE=BASELINE_ROOT/'CMMC_L2_SSP_Modern_Editable_v1.9.11.html'
BASELINE_MATERIALIZER=BASELINE_ROOT/'materialize.py'
OUTPUT=ROOT/'CMMC_L2_SSP_Modern_Editable_v1.9.12.html'
SCHEMA=BASELINE_ROOT/'CMMC_L2_SSP_Data_Schema_v1.9.11.json'
REGISTRY=ROOT.parent/'v1.9.9'/'CMMC_L2_SSP_Built_In_Review_Profile_Registry_v1.9.9.json'
REGISTRY_SCHEMA=ROOT.parent/'v1.9.9'/'CMMC_L2_SSP_Built_In_Review_Profile_Registry_Schema_v1.1.json'
EXPECTED_BASELINE='4e2db5ccf4a520519a0f6845d36ec7f543febf3b45b9a9934cf48ce4d61bc3f6'
EXPECTED_PATCH='2102bd8c13fa684259c9f3f8a1d95289e46b2c2acf32be35667028482e768005'
EXPECTED_RUNTIME='1980bcff89633b13d20e17ba8862bda660afdaf06c0afd2f1e968a9b26eb0a6c'
EXPECTED_SCHEMA='7d1ed6c95415360ad5f805cf103e3c777fd9ef52dc1e4bedecbb2cf30c223251'
EXPECTED_REGISTRY='8deb8917615046f9b85ed34f7c5fac061f6756e44cbd6a8677e935487bfedfc2'
EXPECTED_REGISTRY_SCHEMA='a0ca7d06d5811c73015f79ac2f763efe6534c791bd02e48d77a71dfe075ae67f'
EXPECTED_ENCODED='7c4dfacbc7f8ce2a4d249a805848b9caf2eec2fe93dc0b5941844724e6375f2e'
EXPECTED_XZ='358fd21c4fce49b1b337ae88fcebda2e39b2fcb2f5852d4fd5253e5a4b2aaae1'

def sha(data): return hashlib.sha256(data).hexdigest()
def require(label,actual,expected):
    if actual!=expected: raise SystemExit(f'{label} SHA-256 mismatch: {actual} != {expected}')
def ensure_baseline():
    if not BASELINE.exists(): subprocess.run([sys.executable,str(BASELINE_MATERIALIZER)],check=True)
    require('baseline',sha(BASELINE.read_bytes()),EXPECTED_BASELINE)
    require('schema',sha(SCHEMA.read_bytes()),EXPECTED_SCHEMA)
    require('registry',sha(REGISTRY.read_bytes()),EXPECTED_REGISTRY)
    require('registry schema',sha(REGISTRY_SCHEMA.read_bytes()),EXPECTED_REGISTRY_SCHEMA)
def apply_unified_diff(source_text,patch_text):
    source=source_text.splitlines(keepends=True);patch=patch_text.splitlines(keepends=True);out=[];source_i=0;i=0
    while i<len(patch) and not patch[i].startswith('@@ '): i+=1
    while i<len(patch):
        m=re.match(r'^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@',patch[i])
        if not m: raise SystemExit('invalid patch hunk')
        old_start=int(m.group(1))-1;out.extend(source[source_i:old_start]);source_i=old_start;i+=1
        while i<len(patch) and not patch[i].startswith('@@ '):
            line=patch[i]
            if line.startswith('\\ No newline at end of file'): i+=1;continue
            marker,content=line[:1],line[1:]
            if marker==' ':
                if source_i>=len(source) or source[source_i]!=content: raise SystemExit('patch context mismatch')
                out.append(content);source_i+=1
            elif marker=='-':
                if source_i>=len(source) or source[source_i]!=content: raise SystemExit('patch removal mismatch')
                source_i+=1
            elif marker=='+': out.append(content)
            else: raise SystemExit('invalid patch marker')
            i+=1
    out.extend(source[source_i:]);return ''.join(out)
ensure_baseline()
encoded=b''.join(b''.join(p.read_bytes().split()) for p in sorted(SOURCE.glob('runtime-v1.9.11-to-v1.9.12.patch.xz.b64.part*')))
require('encoded patch',sha(encoded),EXPECTED_ENCODED)
compressed=base64.b64decode(encoded,validate=True);require('compressed patch',sha(compressed),EXPECTED_XZ)
patch=lzma.decompress(compressed);require('patch',sha(patch),EXPECTED_PATCH)
runtime=apply_unified_diff(BASELINE.read_text(encoding='utf-8'),patch.decode('utf-8')).encode('utf-8')
require('materialized runtime',sha(runtime),EXPECTED_RUNTIME)
OUTPUT.write_bytes(runtime)
print(f'materialized {OUTPUT.name} {EXPECTED_RUNTIME}')
print(f'verified unchanged schema {EXPECTED_SCHEMA}')
print(f'verified unchanged registry {EXPECTED_REGISTRY}')
