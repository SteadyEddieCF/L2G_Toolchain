from __future__ import annotations

import base64
import hashlib
import json
import lzma
import shutil
import subprocess
from pathlib import Path

REPO = Path.cwd()
PART_ZERO = REPO / '.ssp-upload-test-2000'
PART_DIR = REPO / '.ssp-v1.9.0-2k'
SCHEMA_OVERRIDE = REPO / '.ssp-v1.9.0-schema-override.json'
BOOTSTRAP = REPO / '.ssp-v1.9.0-bootstrap.py'
EXPECTED_PARTS = [f'part-{index:02d}' for index in range(1, 26)]
EXPECTED_PAYLOAD_SHA256 = '8fe861159a160e7bc3472b297442dc37e96c7dc26252db11978429f10102a2af'
EXPECTED_RUNTIME_SHA256 = 'e22f7fd7d0abf1d3c1d2186d133255ee092b6dbc51f1ec5d1d6b919e62a9bb27'
ORIGINAL_V185 = """from __future__ import annotations
import base64,lzma
from pathlib import Path
HERE=Path(__file__).resolve().parent
PATTERN='materializer-v1.8.5.py.xz.b64.part-*'
paths=sorted((HERE/'source').glob(PATTERN))
if not paths:
    raise SystemExit('Governed v1.8.5 materializer payload parts are missing.')
chunks=[path.read_text().strip() for path in paths]
source=lzma.decompress(base64.b64decode(''.join(chunks)))
try:
    exec(compile(source,__file__,'exec'))
finally:
    target=HERE/'source';target.mkdir(parents=True,exist_ok=True)
    for index,chunk in enumerate(chunks):
        (target/f'materializer-v1.8.5.py.xz.b64.part-{index:02d}').write_text(chunk+'\\n')
"""


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    parts = sorted(PART_DIR.glob('part-*'))
    if not PART_ZERO.is_file():
        raise SystemExit('Missing governed v1.9.0 cumulative payload part 00.')
    if not SCHEMA_OVERRIDE.is_file():
        raise SystemExit('Missing exact v1.9.0 schema regression override.')
    if [path.name for path in parts] != EXPECTED_PARTS:
        raise SystemExit(
            f'Expected governed v1.9.0 parts {EXPECTED_PARTS}, '
            f'found {[path.name for path in parts]}.'
        )

    encoded = PART_ZERO.read_text().strip() + ''.join(path.read_text().strip() for path in parts)
    payload = base64.b64decode(encoded, validate=True)
    actual_payload_sha = hashlib.sha256(payload).hexdigest()
    if actual_payload_sha != EXPECTED_PAYLOAD_SHA256:
        raise SystemExit(f'Governed v1.9.0 payload hash mismatch: {actual_payload_sha}')

    data = json.loads(lzma.decompress(payload))
    if data.get('format') != 'ssp-v1.9.0-cumulative-delta-v1':
        raise SystemExit('Unsupported governed v1.9.0 cumulative delta format.')

    baseline = REPO / data['baseline_release']
    target = REPO / data['target_release']
    if not baseline.is_dir():
        raise SystemExit(f'Missing governed v1.8.8 baseline release: {baseline}')

    shutil.rmtree(target, ignore_errors=True)
    target.mkdir(parents=True)

    for row in data['files']:
        destination = target / row['path']
        destination.parent.mkdir(parents=True, exist_ok=True)
        if row['path'] == 'CMMC_L2_SSP_v1.9.0_Schema_Regression.json':
            shutil.copy2(SCHEMA_OVERRIDE, destination)
        else:
            mode = row['mode']
            if mode == 'copy':
                shutil.copy2(baseline / row['base'], destination)
            elif mode == 'delta':
                source = (baseline / row['base']).read_text(encoding='utf-8').splitlines(keepends=True)
                output: list[str] = []
                for operation in row['ops']:
                    if operation[0] == 'c':
                        output.extend(source[operation[1]:operation[2]])
                    elif operation[0] == 'i':
                        output.append(operation[1])
                    else:
                        raise SystemExit(f'Unsupported delta opcode: {operation[0]}')
                destination.write_text(''.join(output), encoding='utf-8')
            elif mode == 'full_text':
                destination.write_text(row['text'], encoding='utf-8')
            elif mode == 'full_b64':
                destination.write_bytes(base64.b64decode(row['b64']))
            else:
                raise SystemExit(f'Unsupported file mode: {mode}')
        if digest(destination) != row['sha256']:
            raise SystemExit(f'Materialized file hash mismatch: {row["path"]}')

    for row in data['root_files']:
        destination = REPO / row['path']
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(row['text'], encoding='utf-8')
        if digest(destination) != row['sha256']:
            raise SystemExit(f'Materialized repository file hash mismatch: {row["path"]}')

    runtime = target / 'CMMC_L2_SSP_Modern_Editable_v1.9.0.html'
    actual_runtime_sha = digest(runtime)
    if actual_runtime_sha != EXPECTED_RUNTIME_SHA256:
        raise SystemExit(f'Materialized v1.9.0 runtime hash mismatch: {actual_runtime_sha}')

    v185_dir = REPO / 'modules/ssp/releases/v1.8.5'
    (v185_dir / 'materialize.py').write_text(ORIGINAL_V185)
    for diagnostic in (
        'v1.8.9-materialization-error.txt',
        'v1.8.9-repair-error.txt',
        'v1.8.9-materialization-status.txt',
        'v1.9.0-materialization-error.txt',
    ):
        (v185_dir / diagnostic).unlink(missing_ok=True)
    marker = v185_dir / 'v1.9.0-materialization-status.txt'
    marker.write_text(
        'status=passed\n'
        f'runtime_sha256={EXPECTED_RUNTIME_SHA256}\n'
        'release=modules/ssp/releases/v1.9.0\n'
        'baseline=modules/ssp/releases/v1.8.8\n'
        'v1.8.9_behavior_included=true\n'
        'workflow_files_changed=false\n'
    )

    for directory in (
        '.ssp-v1.8.9-delta',
        '.ssp-v1.8.9-delta2',
        '.ssp-v1.8.9-payload',
        '.ssp-v1.8.9-repair',
        '.ssp-v1.9.0-cumulative',
        '.ssp-v1.9.0-small',
        '.ssp-v1.9.0-2k',
    ):
        shutil.rmtree(REPO / directory, ignore_errors=True)
    for filename in (
        '.ssp-v1.8.9-bootstrap.py',
        '.ssp-upload-test-100',
        '.ssp-upload-test-1000',
        '.ssp-upload-test-2000',
        '.ssp-v1.9.0-schema-override.json',
        '.ssp-v1.9.0-bootstrap.py',
    ):
        (REPO / filename).unlink(missing_ok=True)

    stage_paths = [
        'README.md',
        'modules/ssp/README.md',
        'modules/ssp/current/release.json',
        'modules/ssp/releases/v1.8.5',
        'modules/ssp/releases/v1.9.0',
        'tests/playwright/module-catalog.mjs',
        '.ssp-v1.8.9-bootstrap.py',
        '.ssp-v1.8.9-delta',
        '.ssp-v1.8.9-delta2',
        '.ssp-v1.8.9-payload',
        '.ssp-v1.8.9-repair',
        '.ssp-v1.9.0-cumulative',
        '.ssp-v1.9.0-small',
        '.ssp-v1.9.0-2k',
        '.ssp-upload-test-100',
        '.ssp-upload-test-1000',
        '.ssp-upload-test-2000',
        '.ssp-v1.9.0-schema-override.json',
        '.ssp-v1.9.0-bootstrap.py',
    ]
    subprocess.run(['git', 'add', '-A', '--', *stage_paths], cwd=REPO, check=True)
    print(f'Staged governed cumulative SSP v1.9.0 release. SHA-256: {EXPECTED_RUNTIME_SHA256}')


if __name__ == '__main__':
    main()
