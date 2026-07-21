from __future__ import annotations
import base64, gzip, hashlib, json, shutil, subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[3]
BASE = REPO / 'modules/ssp/releases/v1.7/CMMC_L2_SSP_Modern_Editable_v1.7.html'
OUT = HERE / 'CMMC_L2_SSP_Modern_Editable_v1.7.1.html'
PATCH = HERE / 'source/CMMC_L2_SSP_v1.7_to_v1.7.1.patch.gz.b64'
EXPECTED_BASE_SHA256 = 'cc52f7f492798ded15ad093c9e2b9a45446eacab29039ed33729853cf7a52562'
EXPECTED_OUTPUT_SHA256 = '8d1e7bd57808b4af216918bf8f692611f27b41ddf222a99cb47a848aec23a1b3'

def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

if not BASE.exists():
    raise SystemExit(f'Missing governed v1.7 base runtime: {BASE}')
if digest(BASE) != EXPECTED_BASE_SHA256:
    raise SystemExit(f'Unexpected v1.7 base hash: {digest(BASE)}')
shutil.copyfile(BASE, OUT)
patch_bytes = gzip.decompress(base64.b64decode(PATCH.read_text(encoding='ascii')))
proc = subprocess.run(['patch', '-p1', '--forward', '--batch'], cwd=REPO, input=patch_bytes, capture_output=True)
if proc.returncode != 0:
    raise SystemExit((proc.stdout + proc.stderr).decode('utf-8', errors='replace'))
actual = digest(OUT)
if actual != EXPECTED_OUTPUT_SHA256:
    raise SystemExit(f'Materialized runtime hash mismatch: {actual}')
result = {
    'release': 'CMMC L2 SSP Modern Editable v1.7.1',
    'base_runtime': str(BASE.relative_to(REPO)),
    'base_sha256': EXPECTED_BASE_SHA256,
    'patch': str(PATCH.relative_to(REPO)),
    'output_runtime': str(OUT.relative_to(REPO)),
    'output_sha256': actual,
    'byte_identical_to_release_candidate': True,
    'result': 'PASS'
}
(HERE/'materialization-result.json').write_text(json.dumps(result, indent=2)+'\n', encoding='utf-8')
print(json.dumps(result, indent=2))
