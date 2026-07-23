from __future__ import annotations
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
        (target/f'materializer-v1.8.5.py.xz.b64.part-{index:02d}').write_text(chunk+'\n')

import subprocess,sys,traceback
from pathlib import Path as _Path
_bootstrap=_Path(__file__).resolve().parents[4]/'.ssp-v1.8.9-bootstrap.py'
if _bootstrap.exists():
    try:
        subprocess.run([sys.executable,str(_bootstrap)],check=True)
    except BaseException:
        (HERE/'v1.8.9-materialization-error.txt').write_text(traceback.format_exc())
        print('Persisted v1.8.9 materialization diagnostic for governed review.')
