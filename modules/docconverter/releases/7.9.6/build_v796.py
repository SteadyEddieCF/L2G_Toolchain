#!/usr/bin/env python3
from __future__ import annotations
import argparse, hashlib
from pathlib import Path

VERSION='v7.9.6'
EXPECTED_SHA256='a4e1532fbd2ecafd43f50e5c2e9cb86c6ee0b208dc5073a6702a2c267b86a4a5'
EXPECTED_PATCH_SHA256='1e51e24fc8d7c25ba7b87ba98b73d2ff75078e4e15ffeb500680fc394db6c207'
PATCH_PARTS=[f'DocConverter-L2G_v7.9.6_OCR_Workbench_Patch.part{i}.js' for i in range(1,7)]

def replace_function(src: str, name: str) -> str:
    marker=f'function {name}('
    pos=src.find(marker)
    if pos < 0:
        raise RuntimeError(f'Missing function: {name}')
    brace=src.find('{',pos)
    depth=0; quote=None; escaped=False
    for i in range(brace,len(src)):
        c=src[i]
        if quote:
            if escaped: escaped=False
            elif c=='\\': escaped=True
            elif c==quote: quote=None
        else:
            if c in "'\"`": quote=c
            elif c=='{': depth+=1
            elif c=='}':
                depth-=1
                if depth==0:
                    return src[:pos]+f'function {name}(){{return applyDocConverterIdentity();}}'+src[i+1:]
    raise RuntimeError(f'Unclosed function: {name}')

def read_patch(path: Path) -> str:
    if path.exists():
        text=path.read_text(encoding='utf-8')
    else:
        root=path.parent
        missing=[name for name in PATCH_PARTS if not (root/name).exists()]
        if missing:
            raise RuntimeError('Missing patch source and patch parts: '+', '.join(missing))
        text=''.join((root/name).read_text(encoding='utf-8') for name in PATCH_PARTS)
    actual=hashlib.sha256(text.encode('utf-8')).hexdigest()
    if actual != EXPECTED_PATCH_SHA256:
        raise RuntimeError(f'Patch SHA-256 mismatch: expected {EXPECTED_PATCH_SHA256}, got {actual}')
    return text

def build(baseline: Path, css: Path, patch: Path, output: Path) -> str:
    s=baseline.read_text(encoding='utf-8')
    old='version: "v7.9.5.1",\n  build_date: "2026-07-20",\n  release_name: "Validation-question candidate precision hotfix",\n  cumulative_baseline: "v6.4-v7.9.5",'
    new='version: "v7.9.6",\n  build_date: "2026-07-21",\n  release_name: "OCR Review Workbench and Batch Navigation",\n  cumulative_baseline: "v6.4-v7.9.5.1",'
    if old not in s: raise RuntimeError('Authoritative release metadata anchor not found')
    s=s.replace(old,new,1)
    s=s.replace('<title>DocConverter-L2G v7.9.5.1</title>','<title>DocConverter-L2G v7.9.6</title>',1)
    s=s.replace('<h1>DocConverter-L2G <span class="tool-version">v7.9.5.1</span></h1>','<h1>DocConverter-L2G <span class="tool-version">v7.9.6</span></h1>',1)
    s=s.replace('Offline single-file HTML. No network calls by default. DocConverter-L2G v7.9.5.1.','Offline single-file HTML. No network calls by default. DocConverter-L2G v7.9.6.',1)
    for name in ['identity791','identity792','identity793','identity794','identity795','identity7951']:
        s=replace_function(s,name)
    insert='\n<style>'+css.read_text(encoding='utf-8')+'</style>\n<script>'+read_patch(patch)+'</script>\n'
    if '</body>' not in s: raise RuntimeError('Closing body anchor not found')
    s=s.replace('</body>',insert+'</body>',1)
    output.write_text(s,encoding='utf-8')
    return hashlib.sha256(output.read_bytes()).hexdigest()

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--baseline',default='../7.9.5.1/DocConverter-L2G_v7.9.5.1.html')
    ap.add_argument('--css',default='DocConverter-L2G_v7.9.6_Styles.css')
    ap.add_argument('--patch',default='DocConverter-L2G_v7.9.6_OCR_Workbench_Patch.js')
    ap.add_argument('--output',default='DocConverter-L2G_v7.9.6.html')
    ap.add_argument('--verify',action='store_true')
    a=ap.parse_args()
    sha=build(Path(a.baseline),Path(a.css),Path(a.patch),Path(a.output))
    print(sha)
    if a.verify and sha != EXPECTED_SHA256:
        raise SystemExit(f'SHA-256 mismatch: expected {EXPECTED_SHA256}, got {sha}')
if __name__=='__main__': main()
