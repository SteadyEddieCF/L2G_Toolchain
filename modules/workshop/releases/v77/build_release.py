#!/usr/bin/env python3
"""Materialize Workshop v77 and emit bounded CI diagnostics for deterministic reconciliation."""
from pathlib import Path
import hashlib
import json
import traceback

HERE=Path(__file__).resolve().parent
BASE=HERE.parent/'76'/'cmmc_l2_gap_workshop_tool_v76.html'
OUT=HERE/'cmmc_l2_gap_workshop_tool_v77.html'
SOURCE=HERE/'source'
DIAGNOSTIC=HERE/'materialization-diagnostic.json'
BASE_SHA='d9f4a3b3fff7ba18498544e3c424d2f4493e555ddc4a688ef0359069b66ac06a'
OUT_SHA='eaed7cc745a9c963b5977b4ecca2ddd8183714afc91fefd8e3d7788dbda4f5a1'
OUT_SIZE=1779417

def digest(path): return hashlib.sha256(path.read_bytes()).hexdigest()

diag={
    'expected_base_sha256': BASE_SHA,
    'expected_size': OUT_SIZE,
    'expected_sha256': OUT_SHA,
    'base_path': str(BASE),
    'source_path': str(SOURCE),
    'output_path': str(OUT),
}
try:
    diag['stage']='baseline'
    diag['base_exists']=BASE.exists()
    if not BASE.exists():
        raise FileNotFoundError(BASE)
    base_actual=digest(BASE)
    diag['actual_base_sha256']=base_actual
    if base_actual!=BASE_SHA:
        raise RuntimeError(f'Workshop v76 baseline hash mismatch: {base_actual}')

    diag['stage']='replacements'
    text=BASE.read_text(encoding='utf-8')
    replacements=[
     ('<title>CMMC L2 Gap Workshop Tool v76</title>','<title>CMMC L2 Gap Workshop Tool v77</title>'),
     ('<h1>CMMC L2 Gap Workshop Tool <span class="small">v76</span></h1>','<h1>CMMC L2 Gap Workshop Tool <span class="small">v77</span></h1>'),
     ('const CRM_TOOL_VERSION = "v76";','const CRM_TOOL_VERSION = "v77";')
    ]
    diag['replacement_counts']={old:text.count(old) for old,_ in replacements}
    for old,new in replacements:
        if text.count(old)!=1:
            raise RuntimeError(f'expected exactly one replacement target: {old}')
        text=text.replace(old,new,1)

    diag['stage']='source'
    styles_file=SOURCE/'v77_styles.html'
    diag['styles_exists']=styles_file.exists()
    styles=styles_file.read_text(encoding='utf-8')
    if '</head>' not in text:
        raise RuntimeError('closing head not found')
    text=text.replace('</head>',styles+'\n</head>',1)
    parts=sorted(SOURCE.glob('v77_patch.part*.js'))
    diag['patch_parts']=[p.name for p in parts]
    patch=''.join(p.read_text(encoding='utf-8') for p in parts)
    diag['styles_bytes']=len(styles.encode('utf-8'))
    diag['patch_bytes']=len(patch.encode('utf-8'))

    diag['stage']='write'
    idx=text.rfind('</script>')
    diag['last_script_index']=idx
    if idx<0:
        raise RuntimeError('closing script not found')
    text=text[:idx]+patch+'\n'+text[idx:]
    OUT.write_text(text,encoding='utf-8')
    actual=digest(OUT)
    size=OUT.stat().st_size
    diag.update({'stage':'complete','actual_size':size,'actual_sha256':actual,'matches_expected':size==OUT_SIZE and actual==OUT_SHA})
    print(f'materialized {OUT} size={size} sha256={actual}')
except Exception as exc:
    diag.update({'stage':diag.get('stage','unknown'),'error_type':type(exc).__name__,'error':str(exc),'traceback':traceback.format_exc()})
    print(f'Workshop v77 diagnostic captured: {type(exc).__name__}: {exc}')
finally:
    DIAGNOSTIC.write_text(json.dumps(diag,indent=2)+'\n',encoding='utf-8')
    print(f'diagnostic written to {DIAGNOSTIC}')
