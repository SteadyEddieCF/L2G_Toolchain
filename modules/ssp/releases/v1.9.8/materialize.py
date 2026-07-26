#!/usr/bin/env python3
from pathlib import Path
import base64, hashlib, lzma, re

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'source'
BASELINE = ROOT.parent / 'v1.9.7' / 'CMMC_L2_SSP_Modern_Editable_v1.9.7.html'
if not BASELINE.exists():
    BASELINE = SOURCE / 'CMMC_L2_SSP_Modern_Editable_v1.9.7.html'

RUNTIME_PARTS = [SOURCE / f'runtime-v1.9.7-to-v1.9.8.patch.xz.b64.part{i:02d}' for i in range(4)]
RUNTIME_OUTPUT = ROOT / 'CMMC_L2_SSP_Modern_Editable_v1.9.8.html'
SCHEMA_PARTS = [SOURCE / f'CMMC_L2_SSP_Data_Schema_v1.9.8.json.xz.b64.part{i:02d}' for i in range(2)]
SCHEMA_OUTPUT = ROOT / 'CMMC_L2_SSP_Data_Schema_v1.9.8.json'
REGISTRY_PARTS = [SOURCE / 'CMMC_L2_SSP_Built_In_Review_Profile_Registry_v1.9.8.json.xz.b64.part00']
REGISTRY_OUTPUT = ROOT / 'CMMC_L2_SSP_Built_In_Review_Profile_Registry_v1.9.8.json'

EXPECTED_BASELINE = '359a6a04fceadbb64afbf3733c6984e9b4e1171b48aef067859eddc8d1708051'
EXPECTED_RUNTIME_ENCODED = '9bce98ea83a38ecf15137a711a92f3b6ee229ab245f671a7c4e27e39607dbed3'
EXPECTED_RUNTIME_XZ = '912e3ec9ae4e857b9f92ad890e9624fbae274bedec30e753fb1f595dbe424539'
EXPECTED_PATCH = '398e73994e4c5fb10b9ac3468ce821602f18d3e6bddd412362ec0b3c5b0ad230'
EXPECTED_RUNTIME = '04cb0c327e746a7f1db0c652b18638a795f388317be67413ac5706296e299c82'
EXPECTED_SCHEMA_ENCODED = '204e73af9e9a6a7fbf1c348867ef8c8c8e2ec847fc0cbd4a2ebdc336088c423f'
EXPECTED_SCHEMA_XZ = '3f52db3533a3a45687c177a942d81a5b5789cf32bf725258f01a7da8248487ec'
EXPECTED_SCHEMA = '775284cd37f16e20e251cf77e96528347166b93fe9d815e83e61ce4786945f6c'
EXPECTED_REGISTRY_ENCODED = 'a50254922f3f855e272151b2d9b913efe6114f450eb6a4b8a38bcd709055bca5'
EXPECTED_REGISTRY_XZ = '52afad155d35ff1031963f11f5e11bbd2848677779413f9e7cff84e43967741f'
EXPECTED_REGISTRY = 'b12a07ef838aa5777a2b68c51fb6586bf7eaee8f4d035b43765f46cf0ac5f673'


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def require(label: str, actual: str, expected: str) -> None:
    if actual != expected:
        raise SystemExit(f'{label} SHA-256 mismatch: {actual} != {expected}')


def read_encoded(parts, label, expected_encoded, expected_xz):
    encoded = b''.join(part.read_bytes() for part in parts)
    require(f'{label} encoded payload', digest(encoded), expected_encoded)
    xz_bytes = base64.b64decode(encoded, validate=True)
    require(f'{label} xz payload', digest(xz_bytes), expected_xz)
    return lzma.decompress(xz_bytes)


def apply_unified_diff(source_text: str, patch_text: str) -> str:
    source = source_text.splitlines(keepends=True)
    patch = patch_text.splitlines(keepends=True)
    output = []
    source_index = 0
    index = 0
    while index < len(patch) and not patch[index].startswith('@@ '):
        index += 1
    while index < len(patch):
        match = re.match(r'^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@', patch[index])
        if not match:
            raise SystemExit('invalid patch hunk')
        old_start = int(match.group(1)) - 1
        output.extend(source[source_index:old_start])
        source_index = old_start
        index += 1
        while index < len(patch) and not patch[index].startswith('@@ '):
            line = patch[index]
            if line.startswith(r'\ No newline at end of file'):
                index += 1
                continue
            marker, content = line[:1], line[1:]
            if marker == ' ':
                if source_index >= len(source) or source[source_index] != content:
                    raise SystemExit('patch context mismatch')
                output.append(content)
                source_index += 1
            elif marker == '-':
                if source_index >= len(source) or source[source_index] != content:
                    raise SystemExit('patch removal mismatch')
                source_index += 1
            elif marker == '+':
                output.append(content)
            else:
                raise SystemExit('invalid patch marker')
            index += 1
    output.extend(source[source_index:])
    return ''.join(output)


baseline = BASELINE.read_bytes()
require('runtime-source baseline', digest(baseline), EXPECTED_BASELINE)
patch = read_encoded(RUNTIME_PARTS, 'runtime patch', EXPECTED_RUNTIME_ENCODED, EXPECTED_RUNTIME_XZ)
require('unified runtime patch', digest(patch), EXPECTED_PATCH)
runtime = apply_unified_diff(baseline.decode('utf-8'), patch.decode('utf-8')).encode('utf-8')
require('materialized runtime', digest(runtime), EXPECTED_RUNTIME)
RUNTIME_OUTPUT.write_bytes(runtime)

schema = read_encoded(SCHEMA_PARTS, 'working-data schema', EXPECTED_SCHEMA_ENCODED, EXPECTED_SCHEMA_XZ)
require('materialized working-data schema', digest(schema), EXPECTED_SCHEMA)
SCHEMA_OUTPUT.write_bytes(schema)

registry = read_encoded(REGISTRY_PARTS, 'built-in profile registry', EXPECTED_REGISTRY_ENCODED, EXPECTED_REGISTRY_XZ)
require('materialized built-in profile registry', digest(registry), EXPECTED_REGISTRY)
REGISTRY_OUTPUT.write_bytes(registry)

print(f'materialized {RUNTIME_OUTPUT.name} {EXPECTED_RUNTIME}')
print(f'materialized {SCHEMA_OUTPUT.name} {EXPECTED_SCHEMA}')
print(f'materialized {REGISTRY_OUTPUT.name} {EXPECTED_REGISTRY}')
