#!/usr/bin/env python3
"""Materialize exact Workshop v78 from exact Workshop v77 and bounded issue #46 patch source."""
from pathlib import Path
import hashlib
import subprocess
import sys

HERE=Path(__file__).resolve().parent
BASE_DIR=HERE.parent/'v77'
BASE=BASE_DIR/'cmmc_l2_gap_workshop_tool_v77.html'
BASE_BUILD=BASE_DIR/'build_release.py'
OUT=HERE/'cmmc_l2_gap_workshop_tool_v78.html'
SOURCE=HERE/'source'
BASE_SHA='eaed7cc745a9c963b5977b4ecca2ddd8183714afc91fefd8e3d7788dbda4f5a1'
OUT_SHA='PENDING'
OUT_SIZE=1814727

def digest(path): return hashlib.sha256(path.read_bytes()).hexdigest()
def canonical_text(path): return path.read_text(encoding='utf-8').replace('\r\n','\n').replace('\r','\n')
def canonical_digest(path): return hashlib.sha256(canonical_text(path).encode('utf-8')).hexdigest()

if not BASE.exists() or canonical_digest(BASE)!=BASE_SHA:
    subprocess.run([sys.executable,str(BASE_BUILD)],check=True)
base_actual=canonical_digest(BASE)
if base_actual!=BASE_SHA: raise SystemExit(f'Workshop v77 canonical baseline hash mismatch: {base_actual}')
text=canonical_text(BASE)
replacements=[
 ('<title>CMMC L2 Gap Workshop Tool v77</title>','<title>CMMC L2 Gap Workshop Tool v78</title>'),
 ('<h1>CMMC L2 Gap Workshop Tool <span class="small">v77</span></h1>','<h1>CMMC L2 Gap Workshop Tool <span class="small">v78</span></h1>'),
 ('const CRM_TOOL_VERSION = "v77";','const CRM_TOOL_VERSION = "v78";')
]
for old,new in replacements:
    if text.count(old)!=1: raise SystemExit(f'expected exactly one replacement target: {old}')
    text=text.replace(old,new,1)
styles=canonical_text(SOURCE/'v78_styles.html')
if '</head>' not in text: raise SystemExit('closing head not found')
text=text.replace('</head>',styles+'\n</head>',1)
patch=''.join(canonical_text(p) for p in sorted(SOURCE.glob('v78_patch.part*.js')))
idx=text.rfind('</script>')
if idx<0: raise SystemExit('closing script not found')
text=text[:idx]+patch+'\n'+text[idx:]
OUT.write_bytes(text.encode('utf-8'))
actual=digest(OUT)
print(f'Workshop v78 candidate: size={OUT.stat().st_size} sha256={actual}')
if OUT.stat().st_size!=OUT_SIZE or actual!=OUT_SHA:
    raise SystemExit(f'Workshop v78 verification pending/failure: size={OUT.stat().st_size} sha256={actual}')
print(f'materialized {OUT} ({OUT_SIZE} bytes, {OUT_SHA})')
