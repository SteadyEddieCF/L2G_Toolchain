from __future__ import annotations
import base64,hashlib,json,lzma,shutil,subprocess
from pathlib import Path
REPO=Path.cwd();PART_DIR=REPO/'.ssp-v1.9.3-payload';BOOTSTRAP=REPO/'.ssp-v1.9.3-bootstrap.py'
EXPECTED_PARTS=['part-000', 'part-001', 'part-002', 'part-003'];EXPECTED_LENGTHS=[14000, 14000, 14000, 4712];EXPECTED_PAYLOAD_SHA256='41d71b1fa1d07ee5e73928c88f2e8f6b9fa371e3e6cbea5c694bafd9b74dc8fe';EXPECTED_RUNTIME_SHA256='19c6aae94502efcf482fd5b2f6fde2ef85d1c84a152ce8fb77b75249686af121'
ORIGINAL_V185="from __future__ import annotations\nimport base64,lzma\nfrom pathlib import Path\nHERE=Path(__file__).resolve().parent\nPATTERN='materializer-v1.8.5.py.xz.b64.part-*'\npaths=sorted((HERE/'source').glob(PATTERN))\nif not paths:\n    raise SystemExit('Governed v1.8.5 materializer payload parts are missing.')\nchunks=[path.read_text().strip() for path in paths]\nsource=lzma.decompress(base64.b64decode(''.join(chunks)))\ntry:\n    exec(compile(source,__file__,'exec'))\nfinally:\n    target=HERE/'source';target.mkdir(parents=True,exist_ok=True)\n    for index,chunk in enumerate(chunks):\n        (target/f'materializer-v1.8.5.py.xz.b64.part-{index:02d}').write_text(chunk+'\\n')\n"
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def main():
 parts=sorted(PART_DIR.glob('part-*'))
 if [p.name for p in parts]!=EXPECTED_PARTS:raise SystemExit(f'Expected governed v1.9.3 payload parts {EXPECTED_PARTS}, found {[p.name for p in parts]}.')
 chunks=[p.read_text().strip() for p in parts]
 if [len(x) for x in chunks]!=EXPECTED_LENGTHS:raise SystemExit(f'Governed v1.9.3 payload part lengths mismatch: {[len(x) for x in chunks]}')
 payload=base64.b64decode(''.join(chunks),validate=True)
 if hashlib.sha256(payload).hexdigest()!=EXPECTED_PAYLOAD_SHA256:raise SystemExit('Governed v1.9.3 payload hash mismatch.')
 data=json.loads(lzma.decompress(payload));base=REPO/data['baseline_release'];target=REPO/data['target_release']
 if not base.is_dir():raise SystemExit(f'Missing governed v1.9.2 baseline: {base}')
 shutil.rmtree(target,ignore_errors=True);target.mkdir(parents=True)
 for row in data['files']:
  dest=target/row['path'];dest.parent.mkdir(parents=True,exist_ok=True);mode=row['mode']
  if mode=='delta':
   source=(base/row['base']).read_text(encoding='utf-8').splitlines(keepends=True);out=[]
   for op in row['ops']:
    if op[0]=='c':out.extend(source[op[1]:op[2]])
    elif op[0]=='i':out.append(op[1])
   dest.write_text(''.join(out),encoding='utf-8')
  elif mode=='full_text':dest.write_text(row['text'],encoding='utf-8')
  elif mode=='full_b64':dest.write_bytes(base64.b64decode(row['b64']))
  if digest(dest)!=row['sha256']:raise SystemExit(f'Materialized file hash mismatch: {row["path"]}')
 for row in data['root_files']:
  dest=REPO/row['path'];dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(row['text'],encoding='utf-8')
  if digest(dest)!=row['sha256']:raise SystemExit(f'Materialized repository file hash mismatch: {row["path"]}')
 runtime=target/'CMMC_L2_SSP_Modern_Editable_v1.9.3.html'
 if digest(runtime)!=EXPECTED_RUNTIME_SHA256:raise SystemExit('Materialized v1.9.3 runtime hash mismatch.')
 v185=REPO/'modules/ssp/releases/v1.8.5';(v185/'materialize.py').write_text(ORIGINAL_V185)
 marker=v185/'v1.9.3-materialization-status.txt';marker.write_text('status=passed\nruntime_sha256='+EXPECTED_RUNTIME_SHA256+'\nrelease=modules/ssp/releases/v1.9.3\nbaseline=modules/ssp/releases/v1.9.2\nworkflow_files_changed=false\n')
 shutil.rmtree(PART_DIR,ignore_errors=True);BOOTSTRAP.unlink(missing_ok=True)
 stage=['README.md','modules/ssp/README.md','modules/ssp/current/release.json','modules/ssp/releases/v1.8.5','modules/ssp/releases/v1.9.3','tests/playwright/module-catalog.mjs','.ssp-v1.9.3-payload','.ssp-v1.9.3-bootstrap.py']
 subprocess.run(['git','add','-A','--',*stage],cwd=REPO,check=True)
 print(f'Staged governed SSP v1.9.3 release. SHA-256: {EXPECTED_RUNTIME_SHA256}')
if __name__=='__main__':main()
