#!/usr/bin/env python3
from pathlib import Path
import base64, hashlib, json, lzma, re, subprocess, sys

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'source'
BASELINE = ROOT.parent / 'v1.9.8' / 'CMMC_L2_SSP_Modern_Editable_v1.9.8.html'
OUT = ROOT / 'materialization_diagnostics.json'

ASSETS = {
    'runtime': {
        'prefix': 'runtime-v1.9.8-to-v1.9.9.patch.xz.b64',
        'expected_encoded': 'aec597bb8e2ef524889ff13e5c17d412fb1a775eb650a51320cd715da054e7cf',
        'expected_xz': '5095caefb59c0c9335a694cc98c458ee1c82bbbae2516e219cd724ca04a93e98',
        'expected_payload': 'a41b4fe181a605cff13db925665763e632d21e17f3d691189e6d57f38bd93c53',
        'expected_output': '4df58dd45c369fd2c3ec6e49e81fa8887f80859dddd4fbd9b00f410679144927',
    },
    'schema': {
        'prefix': 'schema-v1.9.9.json.xz.b64',
        'expected_encoded': '602b6f8f789b4f3dd9c9c047d20b88c9869fe2e3c99d97bad6c7b2127713cb6b',
        'expected_xz': '69ebc37b72e4958f19659096514866283705d5a186498bc055969379686381a5',
        'expected_payload': '2d093d34b6260822d8be2547a50c3dc5c6c3e73100c9f0fc6fcb2794a84903b1',
    },
    'registry': {
        'prefix': 'registry-v1.9.9.json.xz.b64',
        'expected_encoded': '6a41e2e4f74981d0baf5cd108bf88316beeec35583ddbd413bbe5cb50124d826',
        'expected_xz': '1fa628a5f6de78b9f7ea64b9a1ede0090527f6e2ee702da929183a4c1bb5f324',
        'expected_payload': '8deb8917615046f9b85ed34f7c5fac061f6756e44cbd6a8677e935487bfedfc2',
    },
    'registry_schema': {
        'prefix': 'registry-schema-v1.1.json.xz.b64',
        'expected_encoded': '272eeda41aecb64a8b2394c7cf5041073626a563ce7ef729671e8edb9ba682d1',
        'expected_xz': 'b7ff61c775c507d4e53d28554efb9aabbe669945e3821f01005e50f956dec1c0',
        'expected_payload': 'a0ca7d06d5811c73015f79ac2f763efe6534c791bd02e48d77a71dfe075ae67f',
    },
}


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def apply_unified_diff(source_text: str, patch_text: str) -> str:
    source = source_text.splitlines(keepends=True)
    patch = patch_text.splitlines(keepends=True)
    output, source_index, index = [], 0, 0
    while index < len(patch) and not patch[index].startswith('@@ '):
        index += 1
    while index < len(patch):
        match = re.match(r'^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@', patch[index])
        if not match:
            raise ValueError('invalid patch hunk')
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
                    raise ValueError('patch context mismatch')
                output.append(content); source_index += 1
            elif marker == '-':
                if source_index >= len(source) or source[source_index] != content:
                    raise ValueError('patch removal mismatch')
                source_index += 1
            elif marker == '+':
                output.append(content)
            else:
                raise ValueError('invalid patch marker')
            index += 1
    output.extend(source[source_index:])
    return ''.join(output)


report = {
    'baseline': {
        'exists': BASELINE.exists(),
        'sha256': sha(BASELINE.read_bytes()) if BASELINE.exists() else None,
        'expected': '04cb0c327e746a7f1db0c652b18638a795f388317be67413ac5706296e299c82',
    },
    'assets': {},
}

runtime_patch = None
for name, spec in ASSETS.items():
    entry = {'expected': {k: v for k, v in spec.items() if k.startswith('expected_')}}
    parts = sorted(SOURCE.glob(spec['prefix'] + '.part*'))
    entry['parts'] = [p.name for p in parts]
    entry['part_count'] = len(parts)
    entry['part_bytes'] = {p.name: p.stat().st_size for p in parts}
    try:
        raw = b''.join(p.read_bytes() for p in parts)
        normalized = b''.join(raw.split())
        entry['raw_encoded_sha256'] = sha(raw)
        entry['normalized_encoded_sha256'] = sha(normalized)
        entry['raw_bytes'] = len(raw)
        entry['normalized_bytes'] = len(normalized)
        compressed = base64.b64decode(normalized, validate=True)
        entry['xz_sha256'] = sha(compressed)
        entry['xz_bytes'] = len(compressed)
        payload = lzma.decompress(compressed)
        entry['payload_sha256'] = sha(payload)
        entry['payload_bytes'] = len(payload)
        if name == 'runtime':
            runtime_patch = payload
    except Exception as exc:
        entry['error'] = f'{type(exc).__name__}: {exc}'
    report['assets'][name] = entry

if BASELINE.exists() and runtime_patch is not None:
    try:
        runtime = apply_unified_diff(BASELINE.read_text(encoding='utf-8'), runtime_patch.decode('utf-8')).encode('utf-8')
        report['runtime_output'] = {
            'sha256': sha(runtime),
            'bytes': len(runtime),
            'expected': ASSETS['runtime']['expected_output'],
        }
    except Exception as exc:
        report['runtime_output'] = {'error': f'{type(exc).__name__}: {exc}'}

materializer = subprocess.run(
    [sys.executable, str(ROOT / 'materialize.py')],
    cwd=ROOT,
    text=True,
    capture_output=True,
    check=False,
)
report['materializer'] = {
    'returncode': materializer.returncode,
    'stdout': materializer.stdout,
    'stderr': materializer.stderr,
}

OUT.write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
print(json.dumps({
    'baseline': report['baseline'],
    'assets': {name: {
        'part_count': item.get('part_count'),
        'normalized_encoded_sha256': item.get('normalized_encoded_sha256'),
        'xz_sha256': item.get('xz_sha256'),
        'payload_sha256': item.get('payload_sha256'),
        'error': item.get('error'),
    } for name, item in report['assets'].items()},
    'runtime_output': report.get('runtime_output'),
    'materializer': report['materializer'],
}, separators=(',', ':')))
