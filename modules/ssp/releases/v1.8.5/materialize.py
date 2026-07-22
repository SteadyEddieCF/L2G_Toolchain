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
bootstrap=HERE.parents[3]/'.ssp-v1.8.7-materialize.py'
if bootstrap.exists():
    text=bootstrap.read_text()
    text=text.replace("subprocess.run(['git','push'],cwd=REPO,check=True)","subprocess.run(['git','push','origin','HEAD:agent/ssp-v1.8.7-immutable-baselines'],cwd=REPO,check=True)")
    bootstrap.write_text(text)
    subprocess.run([sys.executable,str(bootstrap)],check=True)
