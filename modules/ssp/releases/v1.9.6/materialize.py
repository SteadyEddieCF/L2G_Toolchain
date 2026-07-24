#!/usr/bin/env python3
from pathlib import Path
import base64, hashlib, lzma, re

ROOT = Path(__file__).resolve().parent
BASELINE = ROOT.parent / "v1.9.5.1" / "CMMC_L2_SSP_Modern_Editable_v1.9.5.1.html"
PATCH_PARTS = [ROOT / "source" / name for name in ['runtime-v1.9.5.1-to-v1.9.6.patch.xz.b64.part00', 'runtime-v1.9.5.1-to-v1.9.6.patch.xz.b64.part01', 'runtime-v1.9.5.1-to-v1.9.6.patch.xz.b64.part02', 'runtime-v1.9.5.1-to-v1.9.6.patch.xz.b64.part03']]
OUTPUT = ROOT / "CMMC_L2_SSP_Modern_Editable_v1.9.6.html"
EXPECTED_BASELINE = "a291b6b1c13b6232ca73e7ed00c9fed40eccdd216ee8bda8ceb4f3dfb59599e8"
EXPECTED_ENCODED_PATCH = "c7e85df301387d68ad31a53e6957a30a53e49ce1dedcaa72b137713f0c5f7609"
EXPECTED_XZ_PATCH = "119a110912150708064333e8cd84e7bfe8800f09cc3c4295b3ab425b94a71369"
EXPECTED_PATCH = "61f850bbb016cc204a0980899ef8e3ae7f1691d2815b1056e58b6dafd35a9494"
EXPECTED_OUTPUT = "d86ae890920f7935c40e9d237766e5ac482af70907e0758bd7e7f1b8f0bed0ea"

def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def require(label: str, actual: str, expected: str) -> None:
    if actual != expected:
        raise SystemExit(f"{label} SHA-256 mismatch: {actual} != {expected}")

def apply_unified_diff(source_text: str, patch_text: str) -> str:
    source = source_text.splitlines(keepends=True)
    patch = patch_text.splitlines(keepends=True)
    output = []
    source_index = 0
    index = 0
    while index < len(patch) and not patch[index].startswith('@@ '):
        index += 1
    while index < len(patch):
        header = patch[index]
        match = re.match(r'^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@', header)
        if not match:
            raise SystemExit(f"invalid patch hunk header: {header.rstrip()}")
        old_start = int(match.group(1)) - 1
        if old_start < source_index:
            raise SystemExit('overlapping patch hunks')
        output.extend(source[source_index:old_start])
        source_index = old_start
        index += 1
        while index < len(patch) and not patch[index].startswith('@@ '):
            line = patch[index]
            if line.startswith(r'\ No newline at end of file'):
                index += 1
                continue
            marker = line[:1]
            content = line[1:]
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
                raise SystemExit(f"invalid patch marker: {marker!r}")
            index += 1
    output.extend(source[source_index:])
    return ''.join(output)

baseline_bytes = BASELINE.read_bytes()
require('runtime-source baseline', digest(baseline_bytes), EXPECTED_BASELINE)
encoded = b"".join(part.read_bytes() for part in PATCH_PARTS)
require('encoded patch', digest(encoded), EXPECTED_ENCODED_PATCH)
xz_bytes = base64.b64decode(encoded, validate=False)
require('xz patch', digest(xz_bytes), EXPECTED_XZ_PATCH)
patch_bytes = lzma.decompress(xz_bytes)
require('uncompressed patch', digest(patch_bytes), EXPECTED_PATCH)
runtime = apply_unified_diff(baseline_bytes.decode('utf-8'), patch_bytes.decode('utf-8')).encode('utf-8')
require('materialized runtime', digest(runtime), EXPECTED_OUTPUT)
OUTPUT.write_bytes(runtime)
print(f"materialized {OUTPUT.name} {EXPECTED_OUTPUT}")
