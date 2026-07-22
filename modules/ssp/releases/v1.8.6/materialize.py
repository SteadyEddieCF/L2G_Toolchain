from __future__ import annotations
import base64,lzma
from pathlib import Path
HERE=Path(__file__).resolve().parent
parts=sorted((HERE/'source').glob('materializer-v1.8.6.py.xz.b64.part-*'))
if not parts:raise SystemExit('Governed v1.8.6 materializer payload parts are missing.')
source=lzma.decompress(base64.b64decode(''.join(path.read_text().strip() for path in parts)))
exec(compile(source,__file__,'exec'))
