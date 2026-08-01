#!/usr/bin/env python3
"""Materialize the exact L2G Builder/Merger v3.10.1 runtime from v3.10, the reviewed v3.10.1 patch, and the issue #114 correction."""
from __future__ import annotations
import argparse, hashlib, json, re, subprocess, sys
from pathlib import Path
BASE_SHA256='96ecb1caee5f7ba278c3b46c666d703423e2db40cac22f8431e70485e5d76a17'
PREVIOUS_SHA256='689f88cf4cc4e5acbd2d31850f99ffeec76c01d7f296c273e9b9a24fcd9b1f34'
OUTPUT_SHA256='2879ee0a933b74c9f27b3c94c0034eafd06f13bc0a8e2d52ba064467b19bfd93'
OUTPUT_SIZE=832972
OUTPUT_NAME='L2G-BM_v3.10.1.html'
def sha(data:bytes)->str:return hashlib.sha256(data).hexdigest()
def apply_patch(original:str,patch:str)->str:
 source=original.splitlines(keepends=True);lines=patch.splitlines(keepends=True);out=[];si=0;i=0
 while i<len(lines) and not lines[i].startswith('@@ '):i+=1
 while i<len(lines):
  h=lines[i].rstrip('\r\n');m=re.match(r'@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@',h)
  if not m:raise ValueError(f'invalid hunk header: {h}')
  start=int(m.group(1))-1
  if start<si:raise ValueError('overlapping hunks')
  out.extend(source[si:start]);si=start;i+=1
  while i<len(lines) and not lines[i].startswith('@@ '):
   line=lines[i]
   if line.startswith(' '):
    expected=line[1:]
    if si>=len(source) or source[si]!=expected:raise ValueError(f'context mismatch at source line {si+1}')
    out.append(expected);si+=1
   elif line.startswith('-'):
    expected=line[1:]
    if si>=len(source) or source[si]!=expected:raise ValueError(f'removal mismatch at source line {si+1}')
    si+=1
   elif line.startswith('+'):out.append(line[1:])
   elif line.startswith('\\ No newline at end of file'):pass
   elif line.startswith(('--- ','+++ ')):pass
   else:raise ValueError(f'unsupported patch line: {line[:80]!r}')
   i+=1
 out.extend(source[si:]);return ''.join(out)
def main()->int:
 ap=argparse.ArgumentParser();ap.add_argument('--base',type=Path);ap.add_argument('--output',type=Path);ap.add_argument('--verify-only',action='store_true');ap.add_argument('--json',action='store_true');a=ap.parse_args()
 here=Path(__file__).resolve().parent;out=(a.output or here/OUTPUT_NAME).resolve()
 if a.verify_only:data=out.read_bytes()
 else:
  base=(a.base or here.parent/'v3.10'/'L2G-BM_v3.10.html').resolve()
  if not base.is_file() and a.base is None:
   parent_materializer=here.parent/'v3.10'/'materialize.py'
   if parent_materializer.is_file():subprocess.run([sys.executable,str(parent_materializer)],check=True)
  if not base.is_file():raise SystemExit(f'v3.10 baseline not found: {base}')
  base_bytes=base.read_bytes();actual_base=sha(base_bytes)
  if actual_base!=BASE_SHA256:raise SystemExit(f'v3.10 baseline hash mismatch: {actual_base}')
  source=here/'source';reviewed=sorted(source.glob('patch.[0-9][0-9][0-9]'))
  if not reviewed:raise SystemExit('reviewed v3.10.1 patch parts missing')
  previous=apply_patch(base_bytes.decode('utf-8'),''.join(p.read_text('utf-8') for p in reviewed)).encode('utf-8')
  if sha(previous)!=PREVIOUS_SHA256:raise SystemExit(f'previous candidate identity mismatch: {sha(previous)}')
  corrections=sorted(source.glob('workbook_merge_governance_correction.patch.*'))
  if not corrections:raise SystemExit('issue #114 correction patch parts missing')
  correction_text=''.join(p.read_text('utf-8') for p in corrections)
  data=apply_patch(previous.decode('utf-8'),correction_text).encode('utf-8');out.parent.mkdir(parents=True,exist_ok=True);out.write_bytes(data)
 actual=sha(data)
 if len(data)!=OUTPUT_SIZE or actual!=OUTPUT_SHA256:raise SystemExit(f'materialized runtime identity mismatch: size={len(data)} sha256={actual}')
 r={'runtime':str(out),'size_bytes':len(data),'sha256':actual,'status':'verified'};print(json.dumps(r,indent=2) if a.json else f'verified {OUTPUT_NAME} {actual}');return 0
if __name__=='__main__':raise SystemExit(main())
