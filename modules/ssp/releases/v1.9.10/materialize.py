#!/usr/bin/env python3
from pathlib import Path
import base64, hashlib, json, lzma, re, subprocess, sys

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'source'
BASELINE_ROOT = ROOT.parent / 'v1.9.9'
BASELINE = BASELINE_ROOT / 'CMMC_L2_SSP_Modern_Editable_v1.9.9.html'
BASELINE_MATERIALIZER = BASELINE_ROOT / 'materialize.py'
RUNTIME_OUTPUT = ROOT / 'CMMC_L2_SSP_Modern_Editable_v1.9.10.html'
MANIFEST = json.loads((SOURCE / 'RUNTIME_TRANSFORM_MANIFEST_v1.9.10.json').read_text(encoding='utf-8'))


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def require(label: str, actual: str, expected: str) -> None:
    if actual != expected:
        raise SystemExit(f'{label} SHA-256 mismatch: {actual} != {expected}')


def ensure_baseline() -> None:
    if not BASELINE.exists():
        if not BASELINE_MATERIALIZER.exists():
            raise SystemExit('v1.9.9 materializer is required to reconstruct the promoted baseline')
        subprocess.run([sys.executable, str(BASELINE_MATERIALIZER)], check=True)
    if not BASELINE.exists():
        raise SystemExit('v1.9.9 materializer did not create the promoted runtime baseline')


def read_patch() -> bytes:
    spec = MANIFEST['runtimePatch']
    parts = [SOURCE / name for name in spec['parts']]
    if any(not path.exists() for path in parts):
        raise SystemExit('one or more v1.9.10 runtime patch fragments are missing')
    encoded = b''.join(b''.join(path.read_bytes().split()) for path in parts)
    require('runtime patch encoded', digest(encoded), spec['encodedSha256'])
    compressed = base64.b64decode(encoded, validate=True)
    require('runtime patch xz', digest(compressed), spec['xzSha256'])
    payload = lzma.decompress(compressed)
    require('runtime patch payload', digest(payload), spec['payloadSha256'])
    return payload


def apply_unified_diff(source_text: str, patch_text: str) -> str:
    source = source_text.splitlines(keepends=True)
    patch = patch_text.splitlines(keepends=True)
    output, source_index, index = [], 0, 0
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


ensure_baseline()
baseline = BASELINE.read_bytes()
require('runtime-source baseline', digest(baseline), MANIFEST['baselineRuntimeSha256'])
patch = read_patch()
runtime = apply_unified_diff(baseline.decode('utf-8'), patch.decode('utf-8')).encode('utf-8')
require('materialized runtime', digest(runtime), MANIFEST['runtimeOutputSha256'])
RUNTIME_OUTPUT.write_bytes(runtime)
print(f'materialized {RUNTIME_OUTPUT.name} {MANIFEST["runtimeOutputSha256"]}')
print('working-data schema, built-in profile registry, registry schema, and cross-tool package contracts remain unchanged from promoted v1.9.9')
