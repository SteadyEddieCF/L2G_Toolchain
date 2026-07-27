#!/usr/bin/env python3
from pathlib import Path
import base64, hashlib, lzma, re, subprocess, sys

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'source'
BASELINE_ROOT = ROOT.parent / 'v1.9.8'
BASELINE = BASELINE_ROOT / 'CMMC_L2_SSP_Modern_Editable_v1.9.8.html'
BASELINE_MATERIALIZER = BASELINE_ROOT / 'materialize.py'
RUNTIME_OUTPUT = ROOT / 'CMMC_L2_SSP_Modern_Editable_v1.9.9.html'
SCHEMA_OUTPUT = ROOT / 'CMMC_L2_SSP_Data_Schema_v1.9.9.json'
REGISTRY_OUTPUT = ROOT / 'CMMC_L2_SSP_Built_In_Review_Profile_Registry_v1.9.9.json'
REGISTRY_SCHEMA_OUTPUT = ROOT / 'CMMC_L2_SSP_Built_In_Review_Profile_Registry_Schema_v1.1.json'

EXPECTED_BASELINE = '04cb0c327e746a7f1db0c652b18638a795f388317be67413ac5706296e299c82'
EXPECTED_PATCH = 'a41b4fe181a605cff13db925665763e632d21e17f3d691189e6d57f38bd93c53'
EXPECTED_RUNTIME = '4df58dd45c369fd2c3ec6e49e81fa8887f80859dddd4fbd9b00f410679144927'
EXPECTED_SCHEMA = '2d093d34b6260822d8be2547a50c3dc5c6c3e73100c9f0fc6fcb2794a84903b1'
EXPECTED_REGISTRY = '8deb8917615046f9b85ed34f7c5fac061f6756e44cbd6a8677e935487bfedfc2'
EXPECTED_REGISTRY_SCHEMA = 'a0ca7d06d5811c73015f79ac2f763efe6534c791bd02e48d77a71dfe075ae67f'
REGISTRY_PREFIX = 'registry-v1.9.9.json.xz.b64'
REGISTRY_DAMAGED_ENCODED_SHA = '7efccd7022949bf82d76d038e92ff0c4e47cf1bae290248251333b7c268652f4'
REGISTRY_RECOVERY_POSITION = 6959
REGISTRY_RECOVERY_CHARACTER = b'C'


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def require(label: str, actual: str, expected: str) -> None:
    if actual != expected:
        raise SystemExit(f'{label} SHA-256 mismatch: {actual} != {expected}')


def ensure_baseline() -> None:
    if BASELINE.exists():
        return
    if not BASELINE_MATERIALIZER.exists():
        raise SystemExit('v1.9.8 materializer is required to reconstruct the promoted baseline')
    subprocess.run([sys.executable, str(BASELINE_MATERIALIZER)], check=True)
    if not BASELINE.exists():
        raise SystemExit('v1.9.8 materializer did not create the promoted runtime baseline')


def read_payload(prefix: str, expected_encoded: str, expected_xz: str, expected_payload: str) -> bytes:
    parts = sorted(SOURCE.glob(prefix + '.part*'))
    if not parts:
        raise SystemExit(f'no payload parts for {prefix}')
    raw_encoded = b''.join(part.read_bytes() for part in parts)
    encoded = b''.join(raw_encoded.split())

    # The registry's second source fragment lost one character during the
    # repository transfer that created the candidate branch. Repair only that
    # exact known damaged stream, at the recovered position, then enforce the
    # originally published canonical encoded/compressed/payload hashes below.
    if prefix == REGISTRY_PREFIX and digest(encoded) == REGISTRY_DAMAGED_ENCODED_SHA:
        encoded = (
            encoded[:REGISTRY_RECOVERY_POSITION]
            + REGISTRY_RECOVERY_CHARACTER
            + encoded[REGISTRY_RECOVERY_POSITION:]
        )

    require(prefix + ' encoded', digest(encoded), expected_encoded)
    compressed = base64.b64decode(encoded, validate=True)
    require(prefix + ' xz', digest(compressed), expected_xz)
    payload = lzma.decompress(compressed)
    require(prefix + ' payload', digest(payload), expected_payload)
    return payload


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


ensure_baseline()
baseline = BASELINE.read_bytes()
require('runtime-source baseline', digest(baseline), EXPECTED_BASELINE)

patch = read_payload(
    'runtime-v1.9.8-to-v1.9.9.patch.xz.b64',
    'aec597bb8e2ef524889ff13e5c17d412fb1a775eb650a51320cd715da054e7cf',
    '5095caefb59c0c9335a694cc98c458ee1c82bbbae2516e219cd724ca04a93e98',
    EXPECTED_PATCH,
)
runtime = apply_unified_diff(baseline.decode('utf-8'), patch.decode('utf-8')).encode('utf-8')
require('materialized runtime', digest(runtime), EXPECTED_RUNTIME)
RUNTIME_OUTPUT.write_bytes(runtime)

schema = read_payload(
    'schema-v1.9.9.json.xz.b64',
    '602b6f8f789b4f3dd9c9c047d20b88c9869fe2e3c99d97bad6c7b2127713cb6b',
    '69ebc37b72e4958f19659096514866283705d5a186498bc055969379686381a5',
    EXPECTED_SCHEMA,
)
SCHEMA_OUTPUT.write_bytes(schema)

registry_schema = read_payload(
    'registry-schema-v1.1.json.xz.b64',
    '272eeda41aecb64a8b2394c7cf5041073626a563ce7ef729671e8edb9ba682d1',
    'b7ff61c775c507d4e53d28554efb9aabbe669945e3821f01005e50f956dec1c0',
    EXPECTED_REGISTRY_SCHEMA,
)
REGISTRY_SCHEMA_OUTPUT.write_bytes(registry_schema)

registry = read_payload(
    REGISTRY_PREFIX,
    '6a41e2e4f74981d0baf5cd108bf88316beeec35583ddbd413bbe5cb50124d826',
    '1fa628a5f6de78b9f7ea64b9a1ede0090527f6e2ee702da929183a4c1bb5f324',
    EXPECTED_REGISTRY,
)
REGISTRY_OUTPUT.write_bytes(registry)

print(f'materialized {RUNTIME_OUTPUT.name} {EXPECTED_RUNTIME}')
print(f'materialized {SCHEMA_OUTPUT.name} {EXPECTED_SCHEMA}')
print(f'materialized {REGISTRY_OUTPUT.name} {EXPECTED_REGISTRY}')
print(f'materialized {REGISTRY_SCHEMA_OUTPUT.name} {EXPECTED_REGISTRY_SCHEMA}')
