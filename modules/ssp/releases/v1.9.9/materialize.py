#!/usr/bin/env python3
from pathlib import Path
import base64, hashlib, lzma, re, subprocess, sys

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'source'
BASELINE = ROOT.parent / 'v1.9.8'
BASELINE_MATERIALIZER = BASELINE / 'materialize.py'

ASSETS = {
    'runtime': {
        'baseline': BASELINE / 'CMMC_L2_SSP_Modern_Editable_v1.9.8.html',
        'baseline_sha': '04cb0c327e746a7f1db0c652b18638a795f388317be67413ac5706296e299c82',
        'parts': 12,
        'prefix': 'runtime-v1.9.8-to-v1.9.9.patch.xz.b64.part',
        'encoded_sha': '9ee6b9b577451b540100ba88c499ee85056744579fa1c82ae8bf6ae8fc810e4a',
        'xz_sha': 'cccf42c2101ccc7a7cbad5affc1dab26bce8a9eb66620abd916677fa9d1e693f',
        'patch_sha': '084bd56f5e2a67ae4b59124f29ecdece5fe6e5a4f94d6a9ddc7fc1683a314d07',
        'output': ROOT / 'CMMC_L2_SSP_Modern_Editable_v1.9.9.html',
        'output_sha': '71767526da4bdee5944364e66ddb9c4f41a1aaf6974d28162453171c6385eb66',
    },
    'schema': {
        'baseline': BASELINE / 'CMMC_L2_SSP_Data_Schema_v1.9.8.json',
        'baseline_sha': '775284cd37f16e20e251cf77e96528347166b93fe9d815e83e61ce4786945f6c',
        'parts': 2,
        'prefix': 'schema-v1.9.8-to-v1.9.9.patch.xz.b64.part',
        'encoded_sha': 'e04aa8c249d734bc420b6a9800426467eecf2ab2268773db77812e57d98e3b48',
        'xz_sha': 'e76587710654870302fbcf3262ddf79640cecc8f7bdbf151c891755154782e44',
        'patch_sha': '96879940d507066babda766885564fa52dae436d43c5b691714b6b11afc3c464',
        'output': ROOT / 'CMMC_L2_SSP_Data_Schema_v1.9.9.json',
        'output_sha': '3468f1f3f839a63ca4b897b25c13e449fbc33f80e85c670fea6829238c60d839',
    },
    'registry': {
        'baseline': BASELINE / 'CMMC_L2_SSP_Built_In_Review_Profile_Registry_v1.9.8.json',
        'baseline_sha': 'b12a07ef838aa5777a2b68c51fb6586bf7eaee8f4d035b43765f46cf0ac5f673',
        'parts': 4,
        'prefix': 'registry-v1.9.8-to-v1.9.9.patch.xz.b64.part',
        'encoded_sha': '393077b3cc663514dccb754c09418e8e316a31b7abfc63a1093d0d7588407633',
        'xz_sha': 'bc20e05a11b1e833a62ff985254ddaffdd0cbb755a74e32c6f9813f6c83e4b87',
        'patch_sha': 'd52ae66f8e291f77eecf6f1f5fe06ad49dc77b186807f1ab14b386d89c9a73c9',
        'output': ROOT / 'CMMC_L2_SSP_Built_In_Review_Profile_Registry_v1.9.9.json',
        'output_sha': 'd5f5277e78b052a4102e4c475706481322162b64df14c2acd08cc2d965053784',
    },
}

def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def require(label: str, actual: str, expected: str) -> None:
    if actual != expected:
        raise SystemExit(f'{label} SHA-256 mismatch: {actual} != {expected}')

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
                output.append(content); source_index += 1
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

if any(not item['baseline'].exists() for item in ASSETS.values()):
    if not BASELINE_MATERIALIZER.exists():
        raise SystemExit('v1.9.8 materializer is required')
    subprocess.run([sys.executable, str(BASELINE_MATERIALIZER)], check=True)

for name, item in ASSETS.items():
    baseline = item['baseline'].read_bytes()
    require(f'{name} baseline', digest(baseline), item['baseline_sha'])
    encoded = b''.join((SOURCE / f"{item['prefix']}{i:02d}").read_bytes() for i in range(item['parts']))
    require(f'{name} encoded patch', digest(encoded), item['encoded_sha'])
    compressed = base64.b64decode(encoded, validate=True)
    require(f'{name} xz patch', digest(compressed), item['xz_sha'])
    patch = lzma.decompress(compressed)
    require(f'{name} unified patch', digest(patch), item['patch_sha'])
    output = apply_unified_diff(baseline.decode('utf-8'), patch.decode('utf-8')).encode('utf-8')
    require(f'{name} materialized output', digest(output), item['output_sha'])
    item['output'].write_bytes(output)
    print(f"materialized {item['output'].name} {item['output_sha']}")
