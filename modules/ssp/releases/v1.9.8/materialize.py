#!/usr/bin/env python3
from pathlib import Path
import base64,hashlib,lzma,re
ROOT=Path(__file__).resolve().parent
BASELINE=ROOT.parent/'v1.9.7'/'CMMC_L2_SSP_Modern_Editable_v1.9.7.html'
if not BASELINE.exists():BASELINE=ROOT/'source'/'CMMC_L2_SSP_Modern_Editable_v1.9.7.html'
PARTS=[ROOT/'source'/f'runtime-v1.9.7-to-v1.9.8.patch.xz.b64.part{i:02d}' for i in range(4)]
OUTPUT=ROOT/'CMMC_L2_SSP_Modern_Editable_v1.9.8.html'
EXPECTED_BASELINE='359a6a04fceadbb64afbf3733c6984e9b4e1171b48aef067859eddc8d1708051'
EXPECTED_ENCODED='9bce98ea83a38ecf15137a711a92f3b6ee229ab245f671a7c4e27e39607dbed3'
EXPECTED_XZ='912e3ec9ae4e857b9f92ad890e9624fbae274bedec30e753fb1f595dbe424539'
EXPECTED_PATCH='398e73994e4c5fb10b9ac3468ce821602f18d3e6bddd412362ec0b3c5b0ad230'
EXPECTED_OUTPUT='04cb0c327e746a7f1db0c652b18638a795f388317be67413ac5706296e299c82'
def digest(data):return hashlib.sha256(data).hexdigest()
def require(label,actual,expected):
    if actual!=expected:raise SystemExit(f'{label} SHA-256 mismatch: {actual} != {expected}')
def apply(source_text,patch_text):
    source=source_text.splitlines(keepends=True);patch=patch_text.splitlines(keepends=True);out=[];si=0;i=0
    while i<len(patch) and not patch[i].startswith('@@ '):i+=1
    while i<len(patch):
        m=re.match(r'^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@',patch[i])
        if not m:raise SystemExit('invalid patch hunk')
        old=int(m.group(1))-1;out.extend(source[si:old]);si=old;i+=1
        while i<len(patch) and not patch[i].startswith('@@ '):
            line=patch[i]
            if line.startswith(r'\ No newline at end of file'):i+=1;continue
            marker=line[:1];content=line[1:]
            if marker==' ':
                if si>=len(source) or source[si]!=content:raise SystemExit('patch context mismatch')
                out.append(content);si+=1
            elif marker=='-':
                if si>=len(source) or source[si]!=content:raise SystemExit('patch removal mismatch')
                si+=1
            elif marker=='+':out.append(content)
            else:raise SystemExit('invalid patch marker')
            i+=1
    out.extend(source[si:]);return ''.join(out)
b=BASELINE.read_bytes();require('baseline',digest(b),EXPECTED_BASELINE)
encoded=b''.join(p.read_bytes() for p in PARTS);require('encoded patch',digest(encoded),EXPECTED_ENCODED)
xz=base64.b64decode(encoded,validate=True);require('xz patch',digest(xz),EXPECTED_XZ)
patch=lzma.decompress(xz);require('unified patch',digest(patch),EXPECTED_PATCH)
runtime=apply(b.decode(),patch.decode()).encode();require('runtime',digest(runtime),EXPECTED_OUTPUT);OUTPUT.write_bytes(runtime);print(f'materialized {OUTPUT.name} {EXPECTED_OUTPUT}')
