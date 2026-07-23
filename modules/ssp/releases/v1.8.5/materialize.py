from __future__ import annotations
import base64,lzma,shutil,subprocess,sys
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
    for name,override in contract_overrides.items():
        if not override.is_file():
            raise SystemExit(f'Missing exact SSP contract override: {override.name}')
        shutil.copy2(override,baseline/name)
    error.unlink(missing_ok=True)
    result=subprocess.run([sys.executable,str(bootstrap)],capture_output=True,text=True)
    if result.returncode:
        error.write_text('returncode='+str(result.returncode)+'\n--- stdout ---\n'+result.stdout+'\n--- stderr ---\n'+result.stderr)
        print('Persisted v1.9.0 materialization diagnostic.')
    else:
        for name,override in contract_overrides.items():
            (baseline/name).unlink(missing_ok=True)
            override.unlink(missing_ok=True)
        subprocess.run([
            'git','add','-A','--',
            'modules/ssp/releases/v1.8.8/L2G_SSP_HANDOFF_SCHEMA_v1.json',
            'modules/ssp/releases/v1.8.8/L2G_SSP_RETURN_SCHEMA_v1.json',
            '.ssp-v1.9.0-handoff-override.json',
            '.ssp-v1.9.0-return-override.json',
        ],cwd=repo,check=True)
        print(result.stdout,end='')
