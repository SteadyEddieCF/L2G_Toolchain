from __future__ import annotations
import base64,hashlib,json,lzma,os,re,shutil,subprocess,time,urllib.request
from pathlib import Path
REPO=Path.cwd();BOOTSTRAP=REPO/'.ssp-v1.9.1-bootstrap.py'
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
def payload_from_event():
 event_path=os.environ.get('GITHUB_EVENT_PATH','')
 if not event_path or not Path(event_path).is_file():raise SystemExit('GitHub pull-request event payload is unavailable.')
 event=json.loads(Path(event_path).read_text());pr=event.get('pull_request') or {};repo=(event.get('repository') or {}).get('full_name','');number=pr.get('number')
 if not repo or not number:raise SystemExit('Pull-request repository metadata is unavailable.')
 extra=subprocess.check_output(['git','config','--local','--get','http.https://github.com/.extraheader'],text=True).strip()
 if ':' not in extra:raise SystemExit('GitHub checkout authorization header is unavailable.')
 header_name,header_value=extra.split(':',1);url=f'https://api.github.com/repos/{repo}/issues/{number}/comments?per_page=100'
 expected=[f'{i:02d}' for i in range(3)]
 for _ in range(60):
  request=urllib.request.Request(url,headers={header_name.strip():header_value.strip(),'Accept':'application/vnd.github+json','User-Agent':'ssp-v1.9.1-materializer'})
  with urllib.request.urlopen(request,timeout=30) as response:comments=json.loads(response.read())
  parts={}
  for comment in comments:
   body=comment.get('body') or ''
   match=re.search(r'<!-- SSP_V191_PAYLOAD_PART_(\d{2})_BEGIN -->\s*([A-Za-z0-9+/=\s]+?)\s*<!-- SSP_V191_PAYLOAD_PART_\1_END -->',body,re.S)
   if match:parts[match.group(1)]=''.join(match.group(2).split())
  if all(index in parts for index in expected):return base64.b64decode(''.join(parts[index] for index in expected),validate=True)
  time.sleep(3)
 raise SystemExit(f'Governed v1.9.1 payload comments were not available: found {sorted(parts)}')
def main():
 payload=payload_from_event()
 if hashlib.sha256(payload).hexdigest()!=EXPECTED_PAYLOAD_SHA256:raise SystemExit('Governed v1.9.1 payload hash mismatch.')
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
 marker=v185/'v1.9.1-materialization-status.txt';marker.write_text('status=passed\nruntime_sha256='+EXPECTED_RUNTIME_SHA256+'\nrelease=modules/ssp/releases/v1.9.1\nbaseline=modules/ssp/releases/v1.9.0\nworkflow_files_changed=false\n')
 BOOTSTRAP.unlink(missing_ok=True)
 stage=['README.md','modules/ssp/README.md','modules/ssp/current/release.json','modules/ssp/releases/v1.8.5','modules/ssp/releases/v1.9.1','tests/playwright/module-catalog.mjs','.ssp-v1.9.1-bootstrap.py']
 subprocess.run(['git','add','-A','--',*stage],cwd=REPO,check=True)
 print(f'Staged governed SSP v1.9.1 release. SHA-256: {EXPECTED_RUNTIME_SHA256}')
if __name__=='__main__':main()
