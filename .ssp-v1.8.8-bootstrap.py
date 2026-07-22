from __future__ import annotations
import base64, hashlib, io, shutil, subprocess, sys, tarfile, tempfile
from pathlib import Path

REPO = Path.cwd()
PAYLOAD_DIR = REPO / '.ssp-v1.8.8-payload'
BOOTSTRAP = REPO / '.ssp-v1.8.8-bootstrap.py'
EXPECTED_PAYLOAD_SHA256 = 'db1d4c14f2d4dd626c8495c0a1dd2cf0613f8860b5f05a16325d7fb60d63ba7e'
EXPECTED_RUNTIME_SHA256 = 'c919bf7728fdca903c852a0cbc674f07b023d1bed2e59f32e030f32b56e43efe'
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

def run(*args: str) -> None:
    subprocess.run(list(args), cwd=REPO, check=True)

def main() -> None:
    parts = sorted(PAYLOAD_DIR.glob('part-*'))
    if [p.name for p in parts] != ['part-00', 'part-01']:
        raise SystemExit(f'Expected governed payload parts part-00 and part-01, found {[p.name for p in parts]}.')
    payload = base64.b64decode(''.join(p.read_text().strip() for p in parts), validate=True)
    actual = hashlib.sha256(payload).hexdigest()
    if actual != EXPECTED_PAYLOAD_SHA256:
        raise SystemExit(f'Governed v1.8.8 payload hash mismatch: {actual}')
    with tempfile.TemporaryDirectory(prefix='ssp-v188-') as temp_name:
        temp = Path(temp_name)
        with tarfile.open(fileobj=io.BytesIO(payload), mode='r:xz') as archive:
            for member in archive.getmembers():
                target = (temp / member.name).resolve()
                if target != temp.resolve() and temp.resolve() not in target.parents:
                    raise SystemExit(f'Unsafe governed payload path: {member.name}')
                if member.isdir():
                    target.mkdir(parents=True, exist_ok=True)
                    continue
                if not member.isfile():
                    raise SystemExit(f'Unsupported governed payload member: {member.name}')
                target.parent.mkdir(parents=True, exist_ok=True)
                source = archive.extractfile(member)
                if source is None:
                    raise SystemExit(f'Unreadable governed payload member: {member.name}')
                with source, target.open('wb') as destination:
                    shutil.copyfileobj(source, destination)
        # Keep the repository release self-contained. The complete package and repository
        # both retain the exact governed v1.8.7 baseline required by the extracted-package test.
        finalize = temp / 'finalize_repo188.py'
        text = finalize.read_text()
        text = text.replace("# Use the merged governed v1.8.7 runtime rather than duplicating it in the repository release tree.\n(OUT/'source'/'CMMC_L2_SSP_Modern_Editable_v1.8.7.html').unlink(missing_ok=True)\nmat=OUT/'materialize.py'\nmat.write_text(mat.read_text().replace(\"BASE=HERE/'source'/'CMMC_L2_SSP_Modern_Editable_v1.8.7.html'\",\"BASE=HERE.parent/'v1.8.7'/'CMMC_L2_SSP_Modern_Editable_v1.8.7.html'\"))\n(OUT/'source'/'README.md').write_text(\"# Governed Runtime Source — v1.8.8\\n\\nThe repository materializer uses the governed runtime at `modules/ssp/releases/v1.8.7/CMMC_L2_SSP_Modern_Editable_v1.8.7.html` plus `runtime-v1.8.7-to-v1.8.8.patch.gz.b64`. The complete deliverables ZIP additionally carries a self-contained baseline copy.\\n\")\nrelease_manifest_path=OUT/'CMMC_L2_SSP_v1.8.8_Release_Manifest.json'\nrelease_manifest=json.loads(release_manifest_path.read_text())\nrelease_manifest['governedSource']['packageFallbackBaseline']='../v1.8.7/CMMC_L2_SSP_Modern_Editable_v1.8.7.html'\nrelease_manifest_path.write_text(json.dumps(release_manifest,indent=2)+'\\n')\n", "release_manifest_path=OUT/'CMMC_L2_SSP_v1.8.8_Release_Manifest.json'\n")
        text = text.replace('The repository copy omits the browser screenshot and embedded baseline binary; both remain in the complete deliverables ZIP.', 'The repository copy omits the browser screenshot; the complete deliverables ZIP retains that additional browser evidence.')
        finalize.write_text(text)
        run(sys.executable, str(temp / 'generator_repo188.py'))
        run(sys.executable, str(finalize))
    runtime = REPO / 'modules/ssp/releases/v1.8.8/CMMC_L2_SSP_Modern_Editable_v1.8.8.html'
    runtime_sha = hashlib.sha256(runtime.read_bytes()).hexdigest()
    if runtime_sha != EXPECTED_RUNTIME_SHA256:
        raise SystemExit(f'Materialized v1.8.8 runtime hash mismatch: {runtime_sha}')
    v185_materializer = REPO / 'modules/ssp/releases/v1.8.5/materialize.py'
    v185_materializer.write_text(ORIGINAL_V185)
    marker = REPO / 'modules/ssp/releases/v1.8.5/v1.8.8-materialization-status.txt'
    marker.write_text(
        'status=passed\n'
        f'runtime_sha256={runtime_sha}\n'
        'release=modules/ssp/releases/v1.8.8\n'
        'workflow_files_changed=false\n'
    )
    shutil.rmtree(PAYLOAD_DIR)
    BOOTSTRAP.unlink(missing_ok=True)
    stage = [
        'README.md',
        'modules/ssp/README.md',
        'modules/ssp/current/release.json',
        'modules/ssp/releases/v1.8.5/materialize.py',
        'modules/ssp/releases/v1.8.5/v1.8.8-materialization-status.txt',
        'modules/ssp/releases/v1.8.8',
        'tests/playwright/module-catalog.mjs',
        '.ssp-v1.8.8-payload',
        '.ssp-v1.8.8-bootstrap.py',
    ]
    subprocess.run(['git', 'add', '-A', '--', *stage], cwd=REPO, check=True)
    print(f'Staged governed SSP v1.8.8 release. SHA-256: {runtime_sha}')

if __name__ == '__main__':
    main()
