from __future__ import annotations
import base64,hashlib,json,lzma,shutil,subprocess
from pathlib import Path
REPO=Path.cwd()
PAYLOAD_DIR=REPO/'.ssp-v1.8.9-delta2'
BOOTSTRAP=REPO/'.ssp-v1.8.9-bootstrap.py'
EXPECTED_PARTS=[f'part-{i:02d}' for i in range(3)]
EXPECTED_RUNTIME='1710cc9af8d167f6d5a6283ac9db2a20e8a838a2c4750a09f66edb0dcfbda3d8'
ORIGINAL_V185="""from __future__ import annotations
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
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def main():
 parts=sorted(PAYLOAD_DIR.glob('part-*'))
 if [p.name for p in parts]!=EXPECTED_PARTS:raise SystemExit(f'Expected exact v1.8.9 delta parts {EXPECTED_PARTS}, found {[p.name for p in parts]}.')
 payload=base64.b64decode(''.join(p.read_text().strip() for p in parts),validate=True)
 data=json.loads(lzma.decompress(payload))
 if data.get('format')!='ssp-v1.8.9-delta-v1':raise SystemExit('Unsupported exact v1.8.9 governed delta format.')
 base=REPO/data['baseline_release'];target=REPO/data['target_release']
 if not base.is_dir():raise SystemExit(f'Missing governed baseline release: {base}')
 shutil.rmtree(target,ignore_errors=True);target.mkdir(parents=True)
 for row in data['files']:
  dest=target/row['path'];dest.parent.mkdir(parents=True,exist_ok=True);mode=row['mode']
  if mode=='copy':shutil.copy2(base/row['base'],dest)
  elif mode=='delta':
   source=(base/row['base']).read_text(encoding='utf-8').splitlines(keepends=True);out=[]
   for op in row['ops']:
    if op[0]=='c':out.extend(source[op[1]:op[2]])
    elif op[0]=='i':out.append(op[1])
    else:raise SystemExit(f'Unsupported delta opcode: {op[0]}')
   dest.write_text(''.join(out),encoding='utf-8')
  elif mode=='full_text':dest.write_text(row['text'],encoding='utf-8')
  elif mode=='full_b64':dest.write_bytes(base64.b64decode(row['b64']))
  else:raise SystemExit(f'Unsupported file mode: {mode}')
  if digest(dest)!=row['sha256']:raise SystemExit(f'Materialized file hash mismatch: {row["path"]}')
 for row in data['root_files']:
  dest=REPO/row['path'];dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(row['text'],encoding='utf-8')
  if digest(dest)!=row['sha256']:raise SystemExit(f'Materialized repository file hash mismatch: {row["path"]}')
 runtime=target/'CMMC_L2_SSP_Modern_Editable_v1.8.9.html'
 if digest(runtime)!=EXPECTED_RUNTIME:raise SystemExit(f'Materialized v1.8.9 runtime hash mismatch: {digest(runtime)}')
 v185=REPO/'modules/ssp/releases/v1.8.5/materialize.py';v185.write_text(ORIGINAL_V185)
 for name in ['.ssp-v1.8.9-delta','.ssp-v1.8.9-delta2','.ssp-v1.8.9-payload']:
  shutil.rmtree(REPO/name,ignore_errors=True)
 (REPO/'modules/ssp/releases/v1.8.5/v1.8.9-materialization-error.txt').unlink(missing_ok=True)
 BOOTSTRAP.unlink(missing_ok=True)
 stage=['README.md','modules/ssp/README.md','modules/ssp/current/release.json','modules/ssp/releases/v1.8.5','modules/ssp/releases/v1.8.9','tests/playwright/module-catalog.mjs','.ssp-v1.8.9-delta','.ssp-v1.8.9-delta2','.ssp-v1.8.9-payload','.ssp-v1.8.9-bootstrap.py']
 subprocess.run(['git','add','-A','--',*stage],cwd=REPO,check=True)
 print(f'Staged repaired governed SSP v1.8.9 release. SHA-256: {EXPECTED_RUNTIME}')
if __name__=='__main__':main()
