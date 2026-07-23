from __future__ import annotations
import base64,hashlib,json,lzma,shutil,subprocess
from pathlib import Path
REPO=Path.cwd()
PAYLOAD_DIR=REPO/'.ssp-v1.8.9-delta'
OLD_PAYLOAD_DIR=REPO/'.ssp-v1.8.9-payload'
BOOTSTRAP=REPO/'.ssp-v1.8.9-bootstrap.py'
EXPECTED_PAYLOAD_SHA256='24e1eee1979691d9c7a8429deef600838f61cd5abb477164e69f72338f78c799'
EXPECTED_PARTS=[f'part-{i:02d}' for i in range(10)]
ORIGINAL_V185="from __future__ import annotations\nimport base64,lzma\nfrom pathlib import Path\nHERE=Path(__file__).resolve().parent\nPATTERN='materializer-v1.8.5.py.xz.b64.part-*'\npaths=sorted((HERE/'source').glob(PATTERN))\nif not paths:\n    raise SystemExit('Governed v1.8.5 materializer payload parts are missing.')\nchunks=[path.read_text().strip() for path in paths]\nsource=lzma.decompress(base64.b64decode(''.join(chunks)))\ntry:\n    exec(compile(source,__file__,'exec'))\nfinally:\n    target=HERE/'source';target.mkdir(parents=True,exist_ok=True)\n    for index,chunk in enumerate(chunks):\n        (target/f'materializer-v1.8.5.py.xz.b64.part-{index:02d}').write_text(chunk+'\\n')\n"
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def main():
 parts=sorted(PAYLOAD_DIR.glob('part-*'))
 if [p.name for p in parts]!=EXPECTED_PARTS:raise SystemExit(f'Expected governed delta parts {EXPECTED_PARTS}, found {[p.name for p in parts]}.')
 payload=base64.b64decode(''.join(p.read_text().strip() for p in parts),validate=True)
 actual=hashlib.sha256(payload).hexdigest()
 if actual!=EXPECTED_PAYLOAD_SHA256:raise SystemExit(f'Governed v1.8.9 delta hash mismatch: {actual}')
 data=json.loads(lzma.decompress(payload))
 if data.get('format')!='ssp-v1.8.9-delta-v1':raise SystemExit('Unsupported v1.8.9 governed delta format.')
 base=REPO/data['baseline_release']; target=REPO/data['target_release']
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
 if digest(runtime)!=data['runtime_sha256']:raise SystemExit('Materialized v1.8.9 runtime hash mismatch.')
 v185=REPO/'modules/ssp/releases/v1.8.5/materialize.py';v185.write_text(ORIGINAL_V185)
 marker=REPO/'modules/ssp/releases/v1.8.5/v1.8.9-materialization-status.txt'
 marker.write_text('status=passed\n'+f'runtime_sha256={data["runtime_sha256"]}\n'+'release=modules/ssp/releases/v1.8.9\nworkflow_files_changed=false\n')
 shutil.rmtree(PAYLOAD_DIR,ignore_errors=True);shutil.rmtree(OLD_PAYLOAD_DIR,ignore_errors=True);BOOTSTRAP.unlink(missing_ok=True)
 stage=['README.md','modules/ssp/README.md','modules/ssp/current/release.json','modules/ssp/releases/v1.8.5/materialize.py','modules/ssp/releases/v1.8.5/v1.8.9-materialization-status.txt','modules/ssp/releases/v1.8.9','tests/playwright/module-catalog.mjs','.ssp-v1.8.9-delta','.ssp-v1.8.9-payload','.ssp-v1.8.9-bootstrap.py']
 subprocess.run(['git','add','-A','--',*stage],cwd=REPO,check=True)
 print(f'Staged governed SSP v1.8.9 release. SHA-256: {data["runtime_sha256"]}')
if __name__=='__main__':main()
