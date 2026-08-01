#!/usr/bin/env python3
from __future__ import annotations
import base64,gzip,hashlib,json
from pathlib import Path
HERE=Path(__file__).resolve().parent; SOURCE=HERE/'source'; LOCAL_BASE=SOURCE/'v79_baseline.html'; REPOSITORY_BASE=HERE.parent/'v79'/'cmmc_l2_gap_workshop_tool_v79.html'; PATCH_ARCHIVE=SOURCE/'v79_1_corrected_patch.js.gz.b64'; OUT=HERE/'cmmc_l2_gap_workshop_tool_v79.1.html'; MANIFEST=SOURCE/'SOURCE_MANIFEST.json'
BASE_SHA='a1f63944d0573587e2a5b7826f72befa16f6d89b849f3129f7f6dbb080da54ca'; BASE_SIZE=1_836_145; PATCH_SHA='89369d79c12773e65291e18b7d30cdc7809686d8772bdc84c34fbd157a5fffde'
def sha(data): return hashlib.sha256(data).hexdigest()
def load_baseline():
 p=LOCAL_BASE if LOCAL_BASE.exists() else REPOSITORY_BASE
 if not p.exists(): raise SystemExit('Workshop v79 baseline missing. Use source/v79_baseline.html from the extracted package or run beside releases/v79.')
 data=p.read_bytes()
 if len(data)!=BASE_SIZE or sha(data)!=BASE_SHA: raise SystemExit(f'Workshop v79 baseline mismatch: {p} size={len(data)} sha256={sha(data)}')
 return data
def load_patch():
 try: data=gzip.decompress(base64.b64decode(''.join(PATCH_ARCHIVE.read_text(encoding='ascii').split()),validate=True))
 except Exception as exc: raise SystemExit(f'Corrected patch appliance decode failed: {exc}') from exc
 if sha(data)!=PATCH_SHA: raise SystemExit(f'Corrected patch SHA mismatch: {sha(data)}')
 return data.decode('utf-8').replace('\r\n','\n').replace('\r','\n')
text=load_baseline().decode('utf-8').replace('\r\n','\n').replace('\r','\n')
for old,new in [("<title>CMMC L2 Gap Workshop Tool v79</title>","<title>CMMC L2 Gap Workshop Tool v79.1</title>"),('<h1>CMMC L2 Gap Workshop Tool <span class="small">v79</span></h1>','<h1>CMMC L2 Gap Workshop Tool <span class="small">v79.1</span></h1>'),('const CRM_TOOL_VERSION = "v79";','const CRM_TOOL_VERSION = "v79.1";')]:
 if text.count(old)!=1: raise SystemExit(f'Expected exactly one replacement: {old}')
 text=text.replace(old,new,1)
index=text.rfind('</script>')
if index<0: raise SystemExit('Workshop v79 closing script was not found')
output=(text[:index]+load_patch()+'\n'+text[index:]).encode('utf-8'); OUT.write_bytes(output); actual,size=sha(output),len(output)
expected=json.loads(MANIFEST.read_text())['candidate_runtime']
if expected.get('sha256') and (actual!=expected['sha256'] or size!=expected['size_bytes']): raise SystemExit(f'Workshop v79.1 verification failed: size={size} sha256={actual}; expected size={expected["size_bytes"]} sha256={expected["sha256"]}')
print(f'Workshop v79.1 candidate: size={size} sha256={actual}')
