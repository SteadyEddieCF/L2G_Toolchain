#!/usr/bin/env python3
from __future__ import annotations
import argparse,base64,hashlib,json
from pathlib import Path
KIND='cmmc_l2_ssp_delivery_package_v1';VERSION='1.10'
def canonical(value):return json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False)
def sha(data):return hashlib.sha256(data).hexdigest()
def safe(path):
 p=str(path).replace('\\','/')
 if not p or p.startswith('/') or '../' in p or '/..' in p or '//' in p or (len(p)>1 and p[1]==':'):raise ValueError(f'unsafe path: {path}')
 return p
def verify(pkg):
 errors=[]
 if pkg.get('package_kind')!=KIND:errors.append('unsupported package kind')
 if str(pkg.get('package_version'))!=VERSION:errors.append('unsupported package version')
 files=pkg.get('files');manifest=pkg.get('manifest')
 if not isinstance(files,list) or not isinstance(manifest,dict):errors.append('files or manifest missing');return errors,{}
 inventory=manifest.get('files',[]);inv={x.get('path'):x for x in inventory if isinstance(x,dict)};seen=set();decoded={}
 for item in files:
  try:
   path=safe(item.get('path'))
   if path in seen:raise ValueError(f'duplicate path: {path}')
   seen.add(path);data=base64.b64decode(item.get('content_base64',''),validate=True);decoded[path]=data
   if item.get('bytes')!=len(data):raise ValueError(f'byte count mismatch: {path}')
   if item.get('sha256')!=sha(data):raise ValueError(f'SHA-256 mismatch: {path}')
   meta=inv.get(path)
   if not meta or any(meta.get(k)!=item.get(k) for k in ('media_type','bytes','sha256')):raise ValueError(f'manifest mismatch: {path}')
  except Exception as exc:errors.append(str(exc))
 if len(inv)!=len(files):errors.append('manifest/file count mismatch')
 body={k:v for k,v in manifest.items() if k!='manifest_fingerprint'}
 if manifest.get('manifest_fingerprint')!=sha(canonical(body).encode()):errors.append('manifest fingerprint mismatch')
 env={k:pkg.get(k) for k in ('package_kind','package_version','generated_by','generated_at','scope','recipient','purpose','handling_instructions','manifest')}
 if pkg.get('package_fingerprint')!=sha(canonical(env).encode()):errors.append('package fingerprint mismatch')
 return errors,decoded
def main():
 ap=argparse.ArgumentParser(description='Verify and optionally extract an SSP delivery package.')
 ap.add_argument('package');ap.add_argument('--extract');ap.add_argument('--manifest-out');args=ap.parse_args();pkg=json.loads(Path(args.package).read_text(encoding='utf-8'));errors,files=verify(pkg)
 if errors:
  print('INVALID');[print('-',e) for e in errors];return 2
 print(f'VALID: {len(files)} files; package fingerprint {pkg.get("package_fingerprint")}')
 if args.manifest_out:Path(args.manifest_out).write_text(json.dumps(pkg['manifest'],indent=2)+'\n',encoding='utf-8')
 if args.extract:
  root=Path(args.extract).resolve();root.mkdir(parents=True,exist_ok=True)
  for name,data in files.items():
   target=(root/name).resolve()
   if root not in target.parents and target!=root:raise SystemExit('unsafe extraction target')
   target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
  print(f'Extracted to {root}')
 return 0
if __name__=='__main__':raise SystemExit(main())
