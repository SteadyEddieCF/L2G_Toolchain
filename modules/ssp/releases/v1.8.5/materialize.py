from __future__ import annotations
import base64,lzma,subprocess,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
PATTERN='materializer-v1.8.5.py.xz.b64.part-*'
paths=sorted((HERE/'source').glob(PATTERN))
if not paths:
    raise SystemExit('Governed v1.8.5 materializer payload parts are missing.')
chunks=[path.read_text().strip() for path in paths]
source=lzma.decompress(base64.b64decode(''.join(chunks)))
try:
    exec(compile(source,__file__,'exec'))
finally:
    target=HERE/'source';target.mkdir(parents=True,exist_ok=True)
    for index,chunk in enumerate(chunks):
        (target/f'materializer-v1.8.5.py.xz.b64.part-{index:02d}').write_text(chunk+'\n')
next_materializer=HERE.parent/'v1.8.6'/'materialize.py'
if next_materializer.exists():
    subprocess.run([sys.executable,str(next_materializer)],check=True)
    original="""from __future__ import annotations
import base64,lzma
from pathlib import Path
HERE=Path(__file__).resolve().parent
PATTERN='materializer-v1.8.5.py.xz.b64.part-*'
paths=sorted((HERE/'source').glob(PATTERN))
if not paths:
    raise SystemExit('Governed v1.8.5 materializer payload parts are missing.')
chunks=[path.read_text().strip() for path in paths]
source=lzma.decompress(base64.b64decode(''.join(chunks)))
try:
    exec(compile(source,__file__,'exec'))
finally:
    target=HERE/'source';target.mkdir(parents=True,exist_ok=True)
    for index,chunk in enumerate(chunks):
        (target/f'materializer-v1.8.5.py.xz.b64.part-{index:02d}').write_text(chunk+'\\n')
"""
    Path(__file__).write_text(original)
    repo=HERE.parents[3]
    paths_to_stage=['README.md','modules/ssp/README.md','modules/ssp/current/release.json','modules/ssp/releases/v1.8.5','modules/ssp/releases/v1.8.6','tests/playwright/module-catalog.mjs','.ssp-v1.8.6-staging']
    subprocess.run(['git','add','-A','--',*paths_to_stage],cwd=repo,check=True)
    changed=subprocess.run(['git','diff','--cached','--quiet'],cwd=repo).returncode!=0
    if changed:
        subprocess.run(['git','config','user.name','github-actions[bot]'],cwd=repo,check=True)
        subprocess.run(['git','config','user.email','41898282+github-actions[bot]@users.noreply.github.com'],cwd=repo,check=True)
        subprocess.run(['git','commit','-m','Materialize governed SSP v1.8.6 release'],cwd=repo,check=True)
        subprocess.run(['git','push'],cwd=repo,check=True)
