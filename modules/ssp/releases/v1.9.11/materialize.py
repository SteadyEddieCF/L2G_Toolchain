#!/usr/bin/env python3
from pathlib import Path
import base64, hashlib, lzma, re, shutil, subprocess, sys

ROOT=Path(__file__).resolve().parent
SOURCE=ROOT/'source'
BASELINE_ROOT=ROOT.parent/'v1.9.10'
BASELINE=BASELINE_ROOT/'CMMC_L2_SSP_Modern_Editable_v1.9.10.html'
BASELINE_MATERIALIZER=BASELINE_ROOT/'materialize.py'
RUNTIME_OUTPUT=ROOT/'CMMC_L2_SSP_Modern_Editable_v1.9.11.html'
SCHEMA_OUTPUT=ROOT/'CMMC_L2_SSP_Data_Schema_v1.9.11.json'
REGISTRY_ROOT=ROOT.parent/'v1.9.9'
REGISTRY=REGISTRY_ROOT/'CMMC_L2_SSP_Built_In_Review_Profile_Registry_v1.9.9.json'
REGISTRY_SCHEMA=REGISTRY_ROOT/'CMMC_L2_SSP_Built_In_Review_Profile_Registry_Schema_v1.1.json'

EXPECTED_BASELINE='a282173c4a8ea23e59d6091a5f68c09757393df2c2d18b92b72569f69310f91c'
EXPECTED_PATCH='8476230dfab171917c48071a754d136cd8fecb49527fc27eea6628a7c501770f'
EXPECTED_RUNTIME='4e2db5ccf4a520519a0f6845d36ec7f543febf3b45b9a9934cf48ce4d61bc3f6'
EXPECTED_SCHEMA='7d1ed6c95415360ad5f805cf103e3c777fd9ef52dc1e4bedecbb2cf30c223251'
EXPECTED_REGISTRY='8deb8917615046f9b85ed34f7c5fac061f6756e44cbd6a8677e935487bfedfc2'
EXPECTED_REGISTRY_SCHEMA='a0ca7d06d5811c73015f79ac2f763efe6534c791bd02e48d77a71dfe075ae67f'


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def require(label: str, actual: str, expected: str) -> None:
    if actual != expected:
        raise SystemExit(f'{label} SHA-256 mismatch: {actual} != {expected}')


def ensure_baseline() -> None:
    if not BASELINE.exists():
        if not BASELINE_MATERIALIZER.exists():
            raise SystemExit('v1.9.10 materializer is required')
        subprocess.run([sys.executable, str(BASELINE_MATERIALIZER)], check=True)
    require('runtime-source baseline', digest(BASELINE.read_bytes()), EXPECTED_BASELINE)
    require('built-in registry', digest(REGISTRY.read_bytes()), EXPECTED_REGISTRY)
    require('registry schema', digest(REGISTRY_SCHEMA.read_bytes()), EXPECTED_REGISTRY_SCHEMA)


def read_payload(prefix: str, encoded_sha: str, xz_sha: str, payload_sha: str) -> bytes:
    parts=sorted(SOURCE.glob(prefix+'.part*'))
    if not parts:
        raise SystemExit(f'no payload parts for {prefix}')
    encoded=b''.join(b''.join(part.read_bytes().split()) for part in parts)
    require(prefix+' encoded', digest(encoded), encoded_sha)
    compressed=base64.b64decode(encoded, validate=True)
    require(prefix+' xz', digest(compressed), xz_sha)
    payload=lzma.decompress(compressed)
    require(prefix+' payload', digest(payload), payload_sha)
    return payload


def apply_unified_diff(source_text: str, patch_text: str) -> str:
    source=source_text.splitlines(keepends=True)
    patch=patch_text.splitlines(keepends=True)
    output=[]; source_index=0; index=0
    while index < len(patch) and not patch[index].startswith('@@ '): index += 1
    while index < len(patch):
        match=re.match(r'^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@', patch[index])
        if not match: raise SystemExit('invalid patch hunk')
        old_start=int(match.group(1))-1
        output.extend(source[source_index:old_start]); source_index=old_start; index += 1
        while index < len(patch) and not patch[index].startswith('@@ '):
            line=patch[index]
            if line.startswith(r'\ No newline at end of file'):
                index += 1; continue
            marker,content=line[:1],line[1:]
            if marker==' ':
                if source_index>=len(source) or source[source_index]!=content: raise SystemExit('patch context mismatch')
                output.append(content); source_index += 1
            elif marker=='-':
                if source_index>=len(source) or source[source_index]!=content: raise SystemExit('patch removal mismatch')
                source_index += 1
            elif marker=='+': output.append(content)
            else: raise SystemExit('invalid patch marker')
            index += 1
    output.extend(source[source_index:])
    return ''.join(output)


ensure_baseline()
patch=read_payload('runtime-v1.9.10-to-v1.9.11.patch.xz.b64','ddd1afe2a6d44bf2b6409578a13673cf33bc738367f40675ecea1355083f52fa','2d18e7bb691f4160ff3d43639d90aef08ab49539755fcf79fe6f0539a15d5121',EXPECTED_PATCH)
runtime=apply_unified_diff(BASELINE.read_text(encoding='utf-8'),patch.decode('utf-8')).encode('utf-8')
require('materialized runtime',digest(runtime),EXPECTED_RUNTIME)
RUNTIME_OUTPUT.write_bytes(runtime)
schema=read_payload('schema-v1.9.11.json.xz.b64','9a896a303cae36b8c0328ea1ff8723505e863d4a45de545128b37805bb39c1d1','e2fa3e08921bd8a1b6ac849fe36fb59c6861cff815ca69748e2e7edcddcdc6ee',EXPECTED_SCHEMA)
SCHEMA_OUTPUT.write_bytes(schema)
print(f'materialized {RUNTIME_OUTPUT.name} {EXPECTED_RUNTIME}')
print(f'materialized {SCHEMA_OUTPUT.name} {EXPECTED_SCHEMA}')
print(f'verified {REGISTRY.name} {EXPECTED_REGISTRY}')
print(f'verified {REGISTRY_SCHEMA.name} {EXPECTED_REGISTRY_SCHEMA}')
