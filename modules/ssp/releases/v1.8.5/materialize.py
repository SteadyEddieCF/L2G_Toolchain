from __future__ import annotations
import base64,hashlib,lzma,shutil,subprocess,sys
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
        (target/f'materializer-v1.8.5.py.xz.b64.part-{index:02d}').write_text(chunk+'\n')
repo=Path(__file__).resolve().parents[4]
bootstrap=repo/'.ssp-v1.9.0-bootstrap.py'
error=HERE/'v1.9.0-materialization-error.txt'
if bootstrap.exists():
    baseline=repo/'modules/ssp/releases/v1.8.8'
    contract_overrides={
        'L2G_SSP_HANDOFF_SCHEMA_v1.json':repo/'.ssp-v1.9.0-handoff-override.json',
        'L2G_SSP_RETURN_SCHEMA_v1.json':repo/'.ssp-v1.9.0-return-override.json',
    }
    base_override_dir=repo/'.ssp-v1.9.0-base-overrides'
    base_overrides={
        'PACKAGE_MANIFEST_CMMC_L2_SSP_v1.8.8.md':(
            sorted(base_override_dir.glob('manifest-part-*')),
            'bc4d5bf57dd8b69c2e522cb59d87b0fdaa0b3c08a1b121c417c3294f68605855',
        ),
        'CMMC_L2_SSP_v1.8.8_Static_Regression.json':(
            sorted(base_override_dir.glob('static-part-*')),
            '02f7fe3669510bc503df7a47b2d9e1e39a8ca259827e64e7d7df55f4553129aa',
        ),
    }
    original_base={name:(baseline/name).read_bytes() for name in base_overrides}
    try:
        for name,override in contract_overrides.items():
            if not override.is_file():
                raise SystemExit(f'Missing exact SSP contract override: {override.name}')
            shutil.copy2(override,baseline/name)
        for name,(parts,expected) in base_overrides.items():
            if not parts:
                raise SystemExit(f'Missing exact v1.8.8 base override parts for {name}')
            raw=lzma.decompress(base64.b64decode(''.join(part.read_text().strip() for part in parts),validate=True))
            actual=hashlib.sha256(raw).hexdigest()
            if actual!=expected:
                raise SystemExit(f'Exact v1.8.8 base override hash mismatch for {name}: {actual}')
            (baseline/name).write_bytes(raw)
        error.unlink(missing_ok=True)
        result=subprocess.run([sys.executable,str(bootstrap)],capture_output=True,text=True)
    finally:
        for name,raw in original_base.items():
            (baseline/name).write_bytes(raw)
        for name in contract_overrides:
            (baseline/name).unlink(missing_ok=True)
    if result.returncode:
        error.write_text('returncode='+str(result.returncode)+'\n--- stdout ---\n'+result.stdout+'\n--- stderr ---\n'+result.stderr)
        print('Persisted v1.9.0 materialization diagnostic.')
    else:
        for override in contract_overrides.values():
            override.unlink(missing_ok=True)
        shutil.rmtree(base_override_dir,ignore_errors=True)
        subprocess.run([
            'git','add','-A','--',
            '.ssp-v1.9.0-handoff-override.json',
            '.ssp-v1.9.0-return-override.json',
            '.ssp-v1.9.0-base-overrides',
        ],cwd=repo,check=True)
        print(result.stdout,end='')
