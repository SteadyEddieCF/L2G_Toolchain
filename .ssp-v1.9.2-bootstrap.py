from __future__ import annotations
import base64,hashlib,json,lzma,os,re,shutil,subprocess
from pathlib import Path
REPO=Path.cwd();BOOTSTRAP=REPO/'.ssp-v1.9.2-bootstrap.py'
EXPECTED_PAYLOAD_SHA256='6cbc4fad6fc46d46771a2a1bb1365c2c4808722331dfd376447f8ca0bc84c5c1';EXPECTED_RUNTIME_SHA256='6b5028ce7de06d0d9dd37ea2f3f1709e1784da90f5d64be1adc760fd7e22af5d'
ORIGINAL_V185="from __future__ import annotations\nimport base64,lzma\nfrom pathlib import Path\nHERE=Path(__file__).resolve().parent\nPATTERN='materializer-v1.8.5.py.xz.b64.part-*'\npaths=sorted((HERE/'source').glob(PATTERN))\nif not paths:\n    raise SystemExit('Governed v1.8.5 materializer payload parts are missing.')\nchunks=[path.read_text().strip() for path in paths]\nsource=lzma.decompress(base64.b64decode(''.join(chunks)))\ntry:\n    exec(compile(source,__file__,'exec'))\nfinally:\n    target=HERE/'source';target.mkdir(parents=True,exist_ok=True)\n    for index,chunk in enumerate(chunks):\n        (target/f'materializer-v1.8.5.py.xz.b64.part-{index:02d}').write_text(chunk+'\\n')\n"
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def governed_payload():
 event_path=os.environ.get('GITHUB_EVENT_PATH','')
 if not event_path or not Path(event_path).is_file():raise SystemExit('GitHub pull-request event payload is unavailable.')
 event=json.loads(Path(event_path).read_text());body=((event.get('pull_request') or {}).get('body') or '')
 match=re.search(r'<!-- SSP_V192_PAYLOAD_BEGIN -->\s*([A-Za-z0-9+/=\s]+?)\s*<!-- SSP_V192_PAYLOAD_END -->',body,re.S)
 if not match:raise SystemExit('Governed v1.9.2 payload marker is missing from the pull-request body.')
 encoded=''.join(match.group(1).split())
 return base64.b64decode(encoded,validate=True)
def main():
 payload=governed_payload();actual=hashlib.sha256(payload).hexdigest()
 if actual!=EXPECTED_PAYLOAD_SHA256:raise SystemExit(f'Governed v1.9.2 payload hash mismatch: {actual}')
 data=json.loads(lzma.decompress(payload))
 if data.get('format')!='ssp-v1.9.2-repo-delta-v1':raise SystemExit('Unsupported v1.9.2 governed payload format.')
 base=REPO/data['baseline_release'];target=REPO/data['target_release']
 if not base.is_dir():raise SystemExit(f'Missing governed v1.9.1 baseline: {base}')
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
  else:raise SystemExit(f'Unsupported mode: {mode}')
  if digest(dest)!=row['sha256']:raise SystemExit(f'Materialized file hash mismatch: {row["path"]}')
 for row in data['root_files']:
  dest=REPO/row['path'];dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(row['text'],encoding='utf-8')
  if digest(dest)!=row['sha256']:raise SystemExit(f'Materialized repository file hash mismatch: {row["path"]}')
 runtime=target/'CMMC_L2_SSP_Modern_Editable_v1.9.2.html'
 if digest(runtime)!=EXPECTED_RUNTIME_SHA256:raise SystemExit('Materialized v1.9.2 runtime hash mismatch.')
 v185=REPO/'modules/ssp/releases/v1.8.5';(v185/'materialize.py').write_text(ORIGINAL_V185)
 marker=v185/'v1.9.2-materialization-status.txt';marker.write_text('status=passed\nruntime_sha256='+EXPECTED_RUNTIME_SHA256+'\nrelease=modules/ssp/releases/v1.9.2\nbaseline=modules/ssp/releases/v1.9.1\nworkflow_files_changed=false\n')
 BOOTSTRAP.unlink(missing_ok=True)
 stage=['README.md','modules/ssp/README.md','modules/ssp/current/release.json','modules/ssp/releases/v1.8.5','modules/ssp/releases/v1.9.2','tests/playwright/module-catalog.mjs','.ssp-v1.9.2-bootstrap.py']
 subprocess.run(['git','add','-A','--',*stage],cwd=REPO,check=True)
 print(f'Staged governed SSP v1.9.2 release. SHA-256: {EXPECTED_RUNTIME_SHA256}')
if __name__=='__main__':main()
