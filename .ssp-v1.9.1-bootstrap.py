from __future__ import annotations
import base64,hashlib,json,lzma,shutil,subprocess
from pathlib import Path
REPO=Path.cwd();BOOTSTRAP=REPO/'.ssp-v1.9.1-bootstrap.py';STAGE=REPO/'.ssp-v1.9.1-payload-stage.txt';PARTS=REPO/'.ssp-v1.9.1-payload'
EXPECTED_PAYLOAD_SHA256='51f8ac6b14c674f71b66b205e53c65268db1e9f5aaa912104a893fe99303522e'
EXPECTED_RUNTIME_SHA256='a1db97b7b2ad1824d51145356fe3b829dc08cb20d6580f6f6a6404b0ba41b0ca'
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
def governed_payload():
 names=('part-00a','part-00b','part-01','part-02')
 parts=[(PARTS/name).read_text().strip() if (PARTS/name).is_file() else '' for name in names]
 lengths=tuple(map(len,parts))
 if lengths!=(7500,7500,15000,14380):raise SystemExit(f'Governed v1.9.1 payload part lengths are invalid: {lengths}')
 return base64.b64decode(''.join(parts),validate=True)
def main():
 payload=governed_payload()
 actual=hashlib.sha256(payload).hexdigest()
 if actual!=EXPECTED_PAYLOAD_SHA256:raise SystemExit(f'Governed v1.9.1 payload hash mismatch: {actual}')
 data=json.loads(lzma.decompress(payload))
 if data.get('format')!='ssp-v1.9.1-repo-delta-v1':raise SystemExit('Unsupported v1.9.1 governed payload format.')
 base=REPO/data['baseline_release'];target=REPO/data['target_release']
 if not base.is_dir():raise SystemExit(f'Missing governed v1.9.0 baseline: {base}')
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
 runtime=target/'CMMC_L2_SSP_Modern_Editable_v1.9.1.html'
 if digest(runtime)!=EXPECTED_RUNTIME_SHA256:raise SystemExit('Materialized v1.9.1 runtime hash mismatch.')
 v185=REPO/'modules/ssp/releases/v1.8.5';(v185/'materialize.py').write_text(ORIGINAL_V185)
 (v185/'v1.9.1-materialization-error.txt').unlink(missing_ok=True)
 marker=v185/'v1.9.1-materialization-status.txt';marker.write_text('status=passed\nruntime_sha256='+EXPECTED_RUNTIME_SHA256+'\nrelease=modules/ssp/releases/v1.9.1\nbaseline=modules/ssp/releases/v1.9.0\nworkflow_files_changed=false\n')
 BOOTSTRAP.unlink(missing_ok=True);STAGE.unlink(missing_ok=True);shutil.rmtree(PARTS,ignore_errors=True)
 stage=['README.md','modules/ssp/README.md','modules/ssp/current/release.json','modules/ssp/releases/v1.8.5','modules/ssp/releases/v1.9.1','tests/playwright/module-catalog.mjs','.ssp-v1.9.1-bootstrap.py','.ssp-v1.9.1-payload-stage.txt','.ssp-v1.9.1-payload']
 subprocess.run(['git','add','-A','--',*stage],cwd=REPO,check=True)
 print(f'Staged governed SSP v1.9.1 release. SHA-256: {EXPECTED_RUNTIME_SHA256}')
if __name__=='__main__':main()
