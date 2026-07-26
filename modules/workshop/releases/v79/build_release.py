#!/usr/bin/env python3
from pathlib import Path
import hashlib, subprocess, sys
HERE=Path(__file__).resolve().parent
BASE_DIR=HERE.parent/'v78'
BASE=BASE_DIR/'cmmc_l2_gap_workshop_tool_v78.html'
BASE_BUILD=BASE_DIR/'build_release.py'
OUT=HERE/'cmmc_l2_gap_workshop_tool_v79.html'
SOURCE=HERE/'source'
BASE_SHA='e34723924a81208d986e734e46833c7cfef064a568007dec1ac281fc1e0a0191'
OUT_SHA='258a0cbf27f76dbf7e4a5367b5fa7d3b2f15f29554018bc1d2fd67894a119518'
OUT_SIZE=1841157
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def canonical_text(p):return p.read_text(encoding='utf-8').replace('\r\n','\n').replace('\r','\n')
def canonical_digest(p):return hashlib.sha256(canonical_text(p).encode()).hexdigest()
if not BASE.exists() or canonical_digest(BASE)!=BASE_SHA:
 subprocess.run([sys.executable,str(BASE_BUILD)],check=True)
if canonical_digest(BASE)!=BASE_SHA:raise SystemExit('Workshop v78 baseline mismatch')
text=canonical_text(BASE)
for old,new in [('<title>CMMC L2 Gap Workshop Tool v78</title>','<title>CMMC L2 Gap Workshop Tool v79</title>'),('<h1>CMMC L2 Gap Workshop Tool <span class="small">v78</span></h1>','<h1>CMMC L2 Gap Workshop Tool <span class="small">v79</span></h1>'),('const CRM_TOOL_VERSION = "v78";','const CRM_TOOL_VERSION = "v79";')]:
 if text.count(old)!=1:raise SystemExit(f'expected one replacement: {old}')
 text=text.replace(old,new,1)
styles=canonical_text(SOURCE/'v79_styles.html');text=text.replace('</head>',styles+'\n</head>',1)
patch=''.join(canonical_text(p) for p in sorted(SOURCE.glob('v79_patch.part*.js')))
idx=text.rfind('</script>');text=text[:idx]+patch+'\n'+text[idx:]
OUT.write_bytes(text.encode())
actual=digest(OUT);size=OUT.stat().st_size
print(f'Workshop v79 candidate: size={size} sha256={actual}')
if OUT_SHA!='PENDING' and (size!=OUT_SIZE or actual!=OUT_SHA):raise SystemExit(f'Workshop v79 verification failed: size={size} sha256={actual}')
