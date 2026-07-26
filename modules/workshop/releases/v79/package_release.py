#!/usr/bin/env python3
from pathlib import Path
import hashlib,json,shutil,zipfile
HERE=Path(__file__).resolve().parent
DIST=HERE/'dist';DIST.mkdir(exist_ok=True)
import subprocess,sys
subprocess.run([sys.executable,str(HERE/'build_release.py')],check=True)
runtime=HERE/'cmmc_l2_gap_workshop_tool_v79.html'
files=[p for p in HERE.iterdir() if p.is_file() and p.name not in {'package_release.py','cmmc_l2_gap_workshop_tool_v79.html'} and p.suffix in {'.md','.json'}]
manifest={'release':'v79','generated_at':'2026-07-26','module':'CMMC L2 Gap Workshop Tool','focus':'Full McFirecoal Toolchain Regression','baseline':{'version':'v78','sha256':'e34723924a81208d986e734e46833c7cfef064a568007dec1ac281fc1e0a0191'},'files':[],'manifest_note':'Manifest inventories the deterministic standalone runtime and complete release documents; generated ZIP checksum is written separately.'}
for p in [runtime,*sorted(files)]:manifest['files'].append({'name':p.name,'size_bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
manifest_path=DIST/'CMMC_L2_Gap_Workshop_v79_Release_Manifest.json';manifest_path.write_text(json.dumps(manifest,indent=2)+'\n')
standalone=DIST/runtime.name;shutil.copy2(runtime,standalone)
zip_path=DIST/'CMMC_L2_Gap_Workshop_v79_Complete_Deliverables.zip'
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in [runtime,*sorted(files),manifest_path]:
  info=zipfile.ZipInfo(p.name,date_time=(2026,7,26,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o644<<16;z.writestr(info,p.read_bytes())
checksum={'release':'v79','standalone_html':{'name':standalone.name,'size_bytes':standalone.stat().st_size,'sha256':hashlib.sha256(standalone.read_bytes()).hexdigest()},'complete_deliverables_zip':{'name':zip_path.name,'size_bytes':zip_path.stat().st_size,'sha256':hashlib.sha256(zip_path.read_bytes()).hexdigest()}}
(DIST/'CMMC_L2_Gap_Workshop_v79_SHA256.json').write_text(json.dumps(checksum,indent=2)+'\n')
print(json.dumps(checksum,indent=2))
