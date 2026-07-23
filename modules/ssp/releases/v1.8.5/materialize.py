from __future__ import annotations
import base64,hashlib,json,lzma,shutil,subprocess
from pathlib import Path
HERE=Path(__file__).resolve().parent
PATTERN='materializer-v1.8.5.py.xz.b64.part-*'
paths=sorted((HERE/'source').glob(PATTERN))
if not paths: raise SystemExit('Governed v1.8.5 materializer payload parts are missing.')
chunks=[path.read_text().strip() for path in paths]
source=lzma.decompress(base64.b64decode(''.join(chunks)))
try: exec(compile(source,__file__,'exec'))
finally:
 target=HERE/'source';target.mkdir(parents=True,exist_ok=True)
 for index,chunk in enumerate(chunks):(target/f'materializer-v1.8.5.py.xz.b64.part-{index:02d}').write_text(chunk+'\n')
REPO=Path.cwd();PART_DIR=REPO/'.ssp-v1.9.4-payload';EXPECTED_NAMES=['part-000a0', 'part-000a1', 'part-000a2', 'part-000a30', 'part-000a31', 'part-000a32', 'part-000a33', 'part-000a34', 'part-000b', 'part-001', 'part-002', 'part-0030', 'part-0031', 'part-0032', 'part-0033', 'part-0034', 'part-0035', 'part-0036', 'part-0037', 'part-004'];EXPECTED_LENGTHS=[875, 875, 875, 175, 175, 175, 175, 175, 3500, 7000, 7000, 875, 875, 875, 875, 875, 875, 875, 875, 2448];EXPECTED_PAYLOAD_SHA256='b4e70ff1ebd88628f7712877ec23c39da890e9c99a636aa590fcf2465f0f9fcf';EXPECTED_RUNTIME_SHA256='51588c4776b82e5c1ef907cfc38b64b54098e2f21fb060563711e12857096fbc'
ORIGINAL_V185="from __future__ import annotations\nimport base64,lzma\nfrom pathlib import Path\nHERE=Path(__file__).resolve().parent\nPATTERN='materializer-v1.8.5.py.xz.b64.part-*'\npaths=sorted((HERE/'source').glob(PATTERN))\nif not paths:\n    raise SystemExit('Governed v1.8.5 materializer payload parts are missing.')\nchunks=[path.read_text().strip() for path in paths]\nsource=lzma.decompress(base64.b64decode(''.join(chunks)))\ntry:\n    exec(compile(source,__file__,'exec'))\nfinally:\n    target=HERE/'source';target.mkdir(parents=True,exist_ok=True)\n    for index,chunk in enumerate(chunks):\n        (target/f'materializer-v1.8.5.py.xz.b64.part-{index:02d}').write_text(chunk+'\\n')\n"
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def governed_payload():
 parts=sorted(PART_DIR.glob('part-*'))
 if [p.name for p in parts]!=EXPECTED_NAMES:raise SystemExit(f'Governed v1.9.4 payload part set mismatch: {[p.name for p in parts]}')
 chunks=[p.read_text().strip() for p in parts]
 if [len(x) for x in chunks]!=EXPECTED_LENGTHS:raise SystemExit(f'Governed v1.9.4 payload part lengths mismatch: {[len(x) for x in chunks]}')
 return base64.b64decode(''.join(chunks),validate=True)
def main():
 payload=governed_payload();actual=hashlib.sha256(payload).hexdigest()
 if actual!=EXPECTED_PAYLOAD_SHA256:raise SystemExit(f'Governed v1.9.4 payload hash mismatch: {actual}')
 data=json.loads(lzma.decompress(payload))
 if data.get('format')!='ssp-v1.9.4-repo-delta-v1':raise SystemExit('Unsupported v1.9.4 governed payload format.')
 base=REPO/data['baseline_release'];target=REPO/data['target_release']
 if not base.is_dir():raise SystemExit(f'Missing governed v1.9.3 baseline: {base}')
 shutil.rmtree(target,ignore_errors=True);target.mkdir(parents=True)
 for row in data['files']:
  dest=target/row['path'];dest.parent.mkdir(parents=True,exist_ok=True);mode=row['mode']
  if mode=='copy':shutil.copy2(base/row['base'],dest)
  elif mode=='delta':
   old=(base/row['base']).read_text(encoding='utf-8').splitlines(keepends=True);out=[]
   for op in row['ops']:
    if op[0]=='c':out.extend(old[op[1]:op[2]])
    elif op[0]=='i':out.append(op[1])
    else:raise SystemExit(f'Unsupported delta opcode: {op[0]}')
   dest.write_text(''.join(out),encoding='utf-8')
  elif mode=='full_text':dest.write_text(row['text'],encoding='utf-8')
  elif mode=='full_b64':dest.write_bytes(base64.b64decode(row['b64']))
  else:raise SystemExit(f'Unsupported mode: {mode}')
  if digest(dest)!=row['sha256']:raise SystemExit(f'Materialized file hash mismatch: {row["path"]}')
 for row in data['root_files']:
  dest=REPO/row['path'];dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(row['text'],encoding='utf-8')
  if digest(dest)!=row['sha256']:raise SystemExit(f'Materialized repository file hash mismatch: {row["path"]}')
 runtime=target/'CMMC_L2_SSP_Modern_Editable_v1.9.4.html'
 if digest(runtime)!=EXPECTED_RUNTIME_SHA256:raise SystemExit('Materialized v1.9.4 runtime hash mismatch.')
 (HERE/'materialize.py').write_text(ORIGINAL_V185)
 marker=HERE/'v1.9.4-materialization-status.txt';marker.write_text('status=passed\nruntime_sha256='+EXPECTED_RUNTIME_SHA256+'\nrelease=modules/ssp/releases/v1.9.4\nbaseline=modules/ssp/releases/v1.9.3\nworkflow_files_changed=false\n')
 shutil.rmtree(PART_DIR,ignore_errors=True)
 stage=['README.md','modules/ssp/README.md','modules/ssp/current/release.json','modules/ssp/releases/v1.8.5','modules/ssp/releases/v1.9.4','tests/playwright/module-catalog.mjs','.ssp-v1.9.4-payload']
 subprocess.run(['git','add','-A','--',*stage],cwd=REPO,check=True)
 print(f'Staged governed SSP v1.9.4 release. SHA-256: {EXPECTED_RUNTIME_SHA256}')
if __name__=='__main__':main()
