#!/usr/bin/env python3
"""Materialize the exact L2G Builder/Merger v3.10 candidate from v3.8 plus the governed patch."""
from __future__ import annotations
import argparse, hashlib, json, re, shutil
from pathlib import Path

BASE_SHA256 = "e63fb2225b27bce5c7f8ce1f48d68d16ab0e21f92543f2741795e3f21f5f2a6c"
OUTPUT_SHA256 = "96ecb1caee5f7ba278c3b46c666d703423e2db40cac22f8431e70485e5d76a17"
OUTPUT_SIZE = 775189
OUTPUT_NAME = "L2G-BM_v3.10.html"


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def apply_unified_patch(original: str, patch_text: str) -> str:
    source = original.splitlines(keepends=True)
    patch_lines = patch_text.splitlines(keepends=True)
    output: list[str] = []
    source_index = 0
    index = 0
    while index < len(patch_lines) and not patch_lines[index].startswith('@@ '):
        index += 1
    while index < len(patch_lines):
        header = patch_lines[index].rstrip('\r\n')
        match = re.match(r'@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@', header)
        if not match:
            raise ValueError(f'invalid patch hunk header: {header}')
        old_start = int(match.group(1)) - 1
        if old_start < source_index:
            raise ValueError('overlapping patch hunks')
        output.extend(source[source_index:old_start])
        source_index = old_start
        index += 1
        while index < len(patch_lines) and not patch_lines[index].startswith('@@ '):
            line = patch_lines[index]
            if line.startswith(' '):
                expected = line[1:]
                if source_index >= len(source) or source[source_index] != expected:
                    raise ValueError(f'patch context mismatch at source line {source_index + 1}')
                output.append(expected)
                source_index += 1
            elif line.startswith('-'):
                expected = line[1:]
                if source_index >= len(source) or source[source_index] != expected:
                    raise ValueError(f'patch removal mismatch at source line {source_index + 1}')
                source_index += 1
            elif line.startswith('+'):
                output.append(line[1:])
            elif line.startswith('\\ No newline at end of file'):
                pass
            elif line.startswith(('--- ', '+++ ')):
                pass
            else:
                raise ValueError(f'unsupported patch line: {line[:80]!r}')
            index += 1
    output.extend(source[source_index:])
    return ''.join(output)


def default_base(script_dir: Path) -> Path:
    return script_dir.parent / 'v3.8' / 'L2G-BM_v3.8.html'


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--base', type=Path, help='Exact v3.8 runtime; defaults to the repository release path.')
    parser.add_argument('--output', type=Path, help='Output path; defaults beside this script.')
    parser.add_argument('--verify-only', action='store_true', help='Verify an existing v3.10 runtime instead of rebuilding it.')
    parser.add_argument('--json', action='store_true')
    args = parser.parse_args()
    script_dir = Path(__file__).resolve().parent
    output = (args.output or (script_dir / OUTPUT_NAME)).resolve()
    if args.verify_only:
        if not output.is_file():
            raise SystemExit(f'candidate runtime not found: {output}')
        data = output.read_bytes()
    else:
        base = (args.base or default_base(script_dir)).resolve()
        if not base.is_file():
            raise SystemExit(f'v3.8 baseline not found: {base}')
        base_bytes = base.read_bytes()
        if sha256_bytes(base_bytes) != BASE_SHA256:
            normalized = base_bytes.replace(b'\r\n', b'\n')
            if sha256_bytes(normalized) != BASE_SHA256:
                raise SystemExit('v3.8 baseline hash mismatch')
            base_bytes = normalized
        patch_parts = sorted((script_dir / 'source').glob('patch.*'))
        if not patch_parts:
            raise SystemExit('materializer patch parts are missing')
        patch_text = ''.join(p.read_text('utf-8') for p in patch_parts)
        rendered = apply_unified_patch(base_bytes.decode('utf-8'), patch_text)
        data = rendered.encode('utf-8')
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_bytes(data)
    actual_sha = sha256_bytes(data)
    if len(data) != OUTPUT_SIZE or actual_sha != OUTPUT_SHA256:
        raise SystemExit(f'materialized runtime identity mismatch: size={len(data)} sha256={actual_sha}')
    result = {'runtime': str(output), 'size_bytes': len(data), 'sha256': actual_sha, 'status': 'verified'}
    print(json.dumps(result, indent=2) if args.json else f'verified {OUTPUT_NAME} {actual_sha}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
