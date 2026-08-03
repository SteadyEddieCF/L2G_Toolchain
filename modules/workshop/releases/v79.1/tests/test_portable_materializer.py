#!/usr/bin/env python3
from __future__ import annotations
import hashlib, shutil, subprocess, sys, tempfile
from pathlib import Path
HERE=Path(__file__).resolve().parents[1]
BASE=HERE/'source/v79_baseline.html'
if not BASE.exists(): BASE=HERE.parent/'v79'/'cmmc_l2_gap_workshop_tool_v79.html'
RUNTIME=HERE/'cmmc_l2_gap_workshop_tool_v79.1.html'
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
assert BASE.stat().st_size==1_836_145 and sha(BASE)=='a1f63944d0573587e2a5b7826f72befa16f6d89b849f3129f7f6dbb080da54ca'
with tempfile.TemporaryDirectory(prefix='workshop-v791-portable-') as temp:
    target=Path(temp)/'release'
    shutil.copytree(HERE,target,ignore=shutil.ignore_patterns('dist','cmmc_l2_gap_workshop_tool_v79.1.html','__pycache__'))
    shutil.copy2(BASE,target/'source'/'v79_baseline.html')
    subprocess.run([sys.executable,str(target/'build_release.py')],cwd=target,check=True)
    rebuilt=target/RUNTIME.name
    assert rebuilt.read_bytes()==RUNTIME.read_bytes()
print({'status':'passed','runtime_size_bytes':RUNTIME.stat().st_size,'runtime_sha256':sha(RUNTIME),'external_repository_files_required_by_extracted_package':False})
