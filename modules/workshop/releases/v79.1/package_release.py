#!/usr/bin/env python3
from __future__ import annotations
import hashlib,json,shutil,subprocess,sys,tempfile,zipfile
from pathlib import Path
HERE=Path(__file__).resolve().parent; DIST=HERE/'dist'; RUNTIME=HERE/'cmmc_l2_gap_workshop_tool_v79.1.html'; BASE=HERE/'source/v79_baseline.html'
if not BASE.exists(): BASE=HERE.parent/'v79'/'cmmc_l2_gap_workshop_tool_v79.html'
ZIP=DIST/'CMMC_L2_Gap_Workshop_v79.1_Complete_Deliverables.zip'
ROOT='CMMC_L2_Gap_Workshop_v79.1_Complete_Deliverables'
FIXED=(2026,8,1,0,30,0)
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def normalize_lf(path): path.write_text(path.read_text(encoding='utf-8').replace('\r\n','\n').replace('\r','\n'),encoding='utf-8',newline='\n')
subprocess.run([sys.executable,str(HERE/'tests/generate_governance_fixtures.py')],check=True)
subprocess.run([sys.executable,str(HERE/'build_release.py')],check=True)
subprocess.run([sys.executable,str(HERE/'tests/test_workshop_v791_static.py')],check=True)
subprocess.run([sys.executable,str(HERE/'tests/test_portable_materializer.py')],check=True)
if DIST.exists(): shutil.rmtree(DIST)
DIST.mkdir()
with tempfile.TemporaryDirectory(prefix='workshop-v791-stage-') as temp:
    stage=Path(temp)/ROOT
    shutil.copytree(HERE,stage,ignore=shutil.ignore_patterns('dist','__pycache__'))
    shutil.copy2(BASE,stage/'source'/'v79_baseline.html')
    normalize_lf(stage/'source/v79_1_nonmutation_fix.js')
    import base64,gzip
    archive_text=''.join((stage/'source/v79_1_corrected_patch.js.gz.b64').read_text(encoding='ascii').split())
    (stage/'source/v79_1_patch.js').write_bytes(gzip.decompress(base64.b64decode(archive_text,validate=True)))
    (stage/RUNTIME.name).unlink(missing_ok=True)
    subprocess.run([sys.executable,str(stage/'build_release.py')],cwd=stage,check=True)
    if (stage/RUNTIME.name).read_bytes()!=RUNTIME.read_bytes(): raise SystemExit('Staged package materializer did not reproduce exact runtime')
    files=[p for p in sorted(stage.rglob('*')) if p.is_file() and 'dist' not in p.parts]
    checks=[{'path':p.relative_to(stage).as_posix(),'size_bytes':p.stat().st_size,'sha256':sha(p)} for p in files]
    inventory=DIST/'FILE_INVENTORY.json'; inventory.write_text(json.dumps({'release':'v79.1','files':checks},indent=2)+'\n',encoding='utf-8',newline='\n')
    sums=DIST/'SHA256SUMS.txt'; sums.write_text('\n'.join(f"{x['sha256']}  {x['path']}" for x in checks)+'\n',encoding='utf-8',newline='\n')
    (stage/'dist').mkdir(); shutil.copy2(inventory,stage/'dist/FILE_INVENTORY.json'); shutil.copy2(sums,stage/'dist/SHA256SUMS.txt')
    with zipfile.ZipFile(ZIP,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        for p in sorted(stage.rglob('*')):
            if not p.is_file(): continue
            info=zipfile.ZipInfo(p.relative_to(stage.parent).as_posix(),date_time=FIXED); info.compress_type=zipfile.ZIP_DEFLATED; info.external_attr=0o100644<<16; z.writestr(info,p.read_bytes())
with tempfile.TemporaryDirectory(prefix='workshop-v791-extract-') as temp:
    with zipfile.ZipFile(ZIP) as z:
        bad=z.testzip()
        if bad: raise SystemExit(f'ZIP CRC failure: {bad}')
        z.extractall(temp)
    root=Path(temp)/ROOT; rebuilt=root/RUNTIME.name; rebuilt.unlink(); subprocess.run([sys.executable,str(root/'build_release.py')],cwd=root,check=True)
    if rebuilt.read_bytes()!=RUNTIME.read_bytes(): raise SystemExit('Clean extracted package did not reproduce exact runtime')
print(json.dumps({'standalone':{'path':str(RUNTIME),'size_bytes':RUNTIME.stat().st_size,'sha256':sha(RUNTIME)},'zip':{'path':str(ZIP),'size_bytes':ZIP.stat().st_size,'sha256':sha(ZIP)},'file_count':len(checks)+2,'portable_materializer':'passed from clean extracted package'},indent=2))
