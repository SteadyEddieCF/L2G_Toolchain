from __future__ import annotations
import base64,gzip,hashlib,json,subprocess,tempfile
from pathlib import Path
HERE=Path(__file__).resolve().parent
BASE=HERE/'source'/'CMMC_L2_SSP_Modern_Editable_v1.8.7.html'
PATCH=HERE/'source'/'runtime-v1.8.7-to-v1.8.8.patch.gz.b64'
OUTPUT=HERE/'CMMC_L2_SSP_Modern_Editable_v1.8.8.html'
EXPECTED_BASE_SHA='96736cd935d5d77fe32ec467e52aca6ea681545ce1eda8ea753a5fac543f6e4b'
EXPECTED_PATCH_SHA='77e2fcff2f527d80cec1e8e62c554d42d94b476ee70727b564cde84dbb84c828'
EXPECTED_RUNTIME_SHA='c919bf7728fdca903c852a0cbc674f07b023d1bed2e59f32e030f32b56e43efe'
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def main():
 if not BASE.exists() or not PATCH.exists():raise SystemExit('The governed v1.8.7 baseline or v1.8.8 patch is missing.')
 if digest(BASE)!=EXPECTED_BASE_SHA:raise SystemExit('The v1.8.7 baseline hash does not match the governed baseline.')
 patch=gzip.decompress(base64.b64decode(PATCH.read_text().strip()))
 if hashlib.sha256(patch).hexdigest()!=EXPECTED_PATCH_SHA:raise SystemExit('The governed v1.8.8 patch hash does not match.')
 OUTPUT.write_bytes(BASE.read_bytes())
 with tempfile.NamedTemporaryFile(suffix='.patch') as handle:
  handle.write(patch);handle.flush();subprocess.run(['patch','--batch','--forward',str(OUTPUT),handle.name],check=True,capture_output=True,text=True)
 actual=digest(OUTPUT)
 if actual!=EXPECTED_RUNTIME_SHA:raise SystemExit(f'Materialized runtime hash mismatch: {actual}')
 result={'release':'v1.8.8','baseline':'v1.8.7','baseline_sha256':EXPECTED_BASE_SHA,'patch_source_sha256':EXPECTED_PATCH_SHA,'runtime_sha256':actual,'runtime':OUTPUT.name,'status':'passed'}
 (HERE/'materialization-result.json').write_text(json.dumps(result,indent=2)+'\n')
 print(f'Materialized {OUTPUT.name}\nSHA-256: {actual}')
if __name__=='__main__':main()
