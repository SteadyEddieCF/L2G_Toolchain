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
status=HERE/'v1.8.7-materialization-status.txt'
if bootstrap.exists():
    text=bootstrap.read_text()
    internal="""if subprocess.run(['git','diff','--cached','--quiet'],cwd=REPO).returncode:
    subprocess.run(['git','config','user.name','github-actions[bot]'],cwd=REPO,check=True)
    subprocess.run(['git','config','user.email','41898282+github-actions[bot]@users.noreply.github.com'],cwd=REPO,check=True)
    subprocess.run(['git','commit','-m','Materialize governed SSP v1.8.7 release'],cwd=REPO,check=True)
    subprocess.run(['git','push'],cwd=REPO,check=True)
"""
    text=text.replace(internal,"print('Staged governed SSP v1.8.7 release for the approved workflow commit step.')\n")
    bootstrap.write_text(text)
    result=subprocess.run([sys.executable,str(bootstrap)],text=True,capture_output=True)
    status.write_text(f'returncode={result.returncode}\n--- stdout ---\n{result.stdout}\n--- stderr ---\n{result.stderr}\n')
    print(status.read_text())
else:
    status.write_text('returncode=0\nBootstrap was already consumed; no additional materialization was required.\n')
