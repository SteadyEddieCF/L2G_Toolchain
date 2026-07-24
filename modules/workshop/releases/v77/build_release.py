#!/usr/bin/env python3
"""Materialize Workshop v77 and emit bounded CI diagnostics for deterministic reconciliation."""
from pathlib import Path
import hashlib
import json

HERE=Path(__file__).resolve().parent
BASE=HERE.parent/'76'/'cmmc_l2_gap_workshop_tool_v76.html'
OUT=HERE/'cmmc_l2_gap_workshop_tool_v77.html'
SOURCE=HERE/'source'
DIAGNOSTIC=HERE/'materialization-diagnostic.json'
BASE_SHA='d9f4a3b3fff7ba18498544e3c424d2f4493e555ddc4a688ef0359069b66ac06a'
OUT_SHA='eaed7cc745a9c963b5977b4ecca2ddd8183714afc91fefd8e3d7788dbda4f5a1'
OUT_SIZE=1779417

def digest(path): return hashlib.sha256(path.read_bytes()).hexdigest()
base_actual=digest(BASE)
if base_actual!=BASE_SHA: raise SystemExit(f'Workshop v76 baseline hash mismatch: {base_actual}')
text=BASE.read_text(encoding='utf-8')
replacements=[
 ('<title>CMMC L2 Gap Workshop Tool v76</title>','<title>CMMC L2 Gap Workshop Tool v77</title>'),
 ('<h1>CMMC L2 Gap Workshop Tool <span class="small">v76</span></h1>','<h1>CMMC L2 Gap Workshop Tool <span class="small">v77</span></h1>'),
 ('const CRM_TOOL_VERSION = "v76";','const CRM_TOOL_VERSION = "v77";')
]
for old,new in replacements:
    if text.count(old)!=1: raise SystemExit(f'expected exactly one replacement target: {old}')
    text=text.replace(old,new,1)
styles=(SOURCE/'v77_styles.html').read_text(encoding='utf-8')
if '</head>' not in text: raise SystemExit('closing head not found')
text=text.replace('</head>',styles+'\n</head>',1)
parts=sorted(SOURCE.glob('v77_patch.part*.js'))
patch=''.join(p.read_text(encoding='utf-8') for p in parts)
idx=text.rfind('</script>')
if idx<0: raise SystemExit('closing script not found')
text=text[:idx]+patch+'\n'+text[idx:]
OUT.write_text(text,encoding='utf-8')
actual=digest(OUT)
size=OUT.stat().st_size
DIAGNOSTIC.write_text(json.dumps({
    'base_sha256': base_actual,
    'expected_size': OUT_SIZE,
    'actual_size': size,
    'expected_sha256': OUT_SHA,
    'actual_sha256': actual,
    'styles_bytes': len(styles.encode('utf-8')),
    'patch_bytes': len(patch.encode('utf-8')),
    'patch_parts': [p.name for p in parts],
}, indent=2)+'\n', encoding='utf-8')
print(f'materialized {OUT} size={size} sha256={actual}')
print(f'diagnostic written to {DIAGNOSTIC}')
