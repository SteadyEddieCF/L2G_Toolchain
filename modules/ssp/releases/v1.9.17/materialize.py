#!/usr/bin/env python3
from pathlib import Path
import base64, hashlib, lzma, re, subprocess, sys
ROOT=Path(__file__).resolve().parent
SOURCE=ROOT/'source'
BASELINE_ROOT=ROOT.parent/'v1.9.16'
BASELINE=BASELINE_ROOT/'CMMC_L2_SSP_Modern_Editable_v1.9.16.html'
BASELINE_MATERIALIZER=BASELINE_ROOT/'materialize.py'
OUTPUT=ROOT/'CMMC_L2_SSP_Modern_Editable_v1.9.17.html'
SCHEMA=ROOT.parent/'v1.9.11'/'CMMC_L2_SSP_Data_Schema_v1.9.11.json'
REGISTRY=ROOT.parent/'v1.9.9'/'CMMC_L2_SSP_Built_In_Review_Profile_Registry_v1.9.9.json'
REGISTRY_SCHEMA=ROOT.parent/'v1.9.9'/'CMMC_L2_SSP_Built_In_Review_Profile_Registry_Schema_v1.1.json'
EXPECTED_BASELINE='f463f01d8b24ec3865467261659f8e90222b23bb9875282e665f04bec778a765'
EXPECTED_PATCH='5242041dbb1aa7211ae3ad4e803a6981262378e4a9c0c2b0c28461c8ee91a370'
EXPECTED_RUNTIME='bfd9d10a780809ba259406f0770641da6a40ac2d8a6d1e372b070d6f5273351b'
EXPECTED_RUNTIME_SIZE=2266611
EXPECTED_SCHEMA='7d1ed6c95415360ad5f805cf103e3c777fd9ef52dc1e4bedecbb2cf30c223251'
EXPECTED_REGISTRY='8deb8917615046f9b85ed34f7c5fac061f6756e44cbd6a8677e935487bfedfc2'
EXPECTED_REGISTRY_SCHEMA='a0ca7d06d5811c73015f79ac2f763efe6534c791bd02e48d77a71dfe075ae67f'
EXPECTED_ENCODED='ba0c9f945e48d02a2e4866deb6cf1ef5479c805367778f5bdf11d7a4dfaf89fb'
EXPECTED_XZ='6b6772c30b05b6aa92070fd42fbfb46df4c6760806bb3eadf8b6e68373554072'
def sha(data): return hashlib.sha256(data).hexdigest()
def require(label,actual,expected):
    if actual!=expected: raise SystemExit(f'{label} mismatch: {actual} != {expected}')
def ensure_baseline():
    if not BASELINE.exists(): subprocess.run([sys.executable,str(BASELINE_MATERIALIZER)],check=True)
    require('baseline SHA-256',sha(BASELINE.read_bytes()),EXPECTED_BASELINE)
    require('schema SHA-256',sha(SCHEMA.read_bytes()),EXPECTED_SCHEMA)
    require('registry SHA-256',sha(REGISTRY.read_bytes()),EXPECTED_REGISTRY)
    require('registry schema SHA-256',sha(REGISTRY_SCHEMA.read_bytes()),EXPECTED_REGISTRY_SCHEMA)
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
encoded=b''.join(b''.join(p.read_bytes().split()) for p in sorted(SOURCE.glob('runtime-v1.9.16-to-v1.9.17.patch.xz.b64.part*')))
require('encoded patch SHA-256',sha(encoded),EXPECTED_ENCODED)
compressed=base64.b64decode(encoded,validate=True);require('compressed patch SHA-256',sha(compressed),EXPECTED_XZ)
patch=lzma.decompress(compressed);require('patch SHA-256',sha(patch),EXPECTED_PATCH)
runtime=apply_unified_diff(BASELINE.read_text(encoding='utf-8'),patch.decode('utf-8')).encode('utf-8')
require('materialized runtime SHA-256',sha(runtime),EXPECTED_RUNTIME)
if len(runtime)!=EXPECTED_RUNTIME_SIZE: raise SystemExit('materialized runtime size mismatch')
OUTPUT.write_bytes(runtime)
print(f'materialized {OUTPUT.name} {EXPECTED_RUNTIME} ({EXPECTED_RUNTIME_SIZE} bytes)')
print(f'verified unchanged schema {EXPECTED_SCHEMA}')
print(f'verified unchanged registry {EXPECTED_REGISTRY}')
