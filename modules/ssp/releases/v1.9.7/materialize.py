#!/usr/bin/env python3
from pathlib import Path
import base64, hashlib, lzma, re

ROOT = Path(__file__).resolve().parent
BASELINE = ROOT.parent / 'v1.9.6' / 'CMMC_L2_SSP_Modern_Editable_v1.9.6.html'
PAYLOAD_PARTS = [ROOT / 'source' / f'runtime-v1.9.6-to-v1.9.7.patch.xz.b64.part{i:02d}' for i in range(4)]
OUTPUT = ROOT / 'CMMC_L2_SSP_Modern_Editable_v1.9.7.html'
EXPECTED_BASELINE = 'd86ae890920f7935c40e9d237766e5ac482af70907e0758bd7e7f1b8f0bed0ea'
EXPECTED_PAYLOAD = '7c85a8f0f4e9ac685f8decdd84b525182544a1fd2d3590b89d24c1c511aee4dd'
EXPECTED_XZ = 'a74218dffb310be0fb309e4de3e4936c94cb6daf9ab5ed40132afddd8565cba4'
EXPECTED_PATCH = '0e275488e1eca424b3e08abc687633deb6379cac7a4cbf2201c625eff7f97339'
EXPECTED_OUTPUT = '359a6a04fceadbb64afbf3733c6984e9b4e1171b48aef067859eddc8d1708051'

def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def require(label: str, actual: str, expected: str) -> None:
    if actual != expected:
        raise SystemExit(f'{label} SHA-256 mismatch: {actual} != {expected}')

def apply_unified_diff(source_text: str, patch_text: str) -> str:
    source=source_text.splitlines(keepends=True); patch=patch_text.splitlines(keepends=True)
    output=[]; source_index=0; index=0
    while index < len(patch) and not patch[index].startswith('@@ '): index += 1
    while index < len(patch):
        header=patch[index]; match=re.match(r'^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@',header)
        if not match: raise SystemExit(f'invalid patch hunk header: {header.rstrip()}')
        old_start=int(match.group(1))-1
        if old_start < source_index: raise SystemExit('overlapping patch hunks')
        output.extend(source[source_index:old_start]); source_index=old_start; index += 1
        while index < len(patch) and not patch[index].startswith('@@ '):
            line=patch[index]
            if line.startswith(r'\ No newline at end of file'): index += 1; continue
            marker=line[:1]; content=line[1:]
            if marker==' ':
                if source_index>=len(source) or source[source_index]!=content: raise SystemExit('patch context mismatch')
                output.append(content); source_index += 1
            elif marker=='-':
                if source_index>=len(source) or source[source_index]!=content: raise SystemExit('patch removal mismatch')
                source_index += 1
            elif marker=='+': output.append(content)
            else: raise SystemExit(f'invalid patch marker: {marker!r}')
            index += 1
    output.extend(source[source_index:]); return ''.join(output)

baseline=BASELINE.read_bytes(); require('runtime-source baseline',digest(baseline),EXPECTED_BASELINE)
encoded=b''.join(part.read_bytes() for part in PAYLOAD_PARTS); require('encoded patch',digest(encoded),EXPECTED_PAYLOAD)
xz_bytes=base64.b64decode(encoded,validate=True); require('xz patch',digest(xz_bytes),EXPECTED_XZ)
patch=lzma.decompress(xz_bytes); require('unified patch',digest(patch),EXPECTED_PATCH)
runtime=apply_unified_diff(baseline.decode('utf-8'),patch.decode('utf-8')).encode('utf-8')
require('materialized runtime',digest(runtime),EXPECTED_OUTPUT)
OUTPUT.write_bytes(runtime)
print(f'materialized {OUTPUT.name} {EXPECTED_OUTPUT}')
