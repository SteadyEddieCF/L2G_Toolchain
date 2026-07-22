from __future__ import annotations
import base64,gzip,hashlib,json,subprocess,tempfile
from pathlib import Path
HERE=Path(__file__).resolve().parent
BASE=HERE/'source'/'CMMC_L2_SSP_Modern_Editable_v1.8.5.html'
PATCH=HERE/'source'/'runtime-v1.8.5-to-v1.8.6.patch.gz.b64'
OUTPUT=HERE/'CMMC_L2_SSP_Modern_Editable_v1.8.6.html'
EXPECTED_BASE_SHA='4fb6eea6a95cbc311a6f6b008a7733590d88e275c61b74aa8b0b73be1802131a'
EXPECTED_RUNTIME_SHA='a9f872d7e3f0e9dd8515ac34a784086d536306cd00d0768066f657025c82f630'
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def main():
 if not BASE.exists() or not PATCH.exists():raise SystemExit('The governed v1.8.5 fallback baseline or v1.8.6 patch is missing.')
 if digest(BASE)!=EXPECTED_BASE_SHA:raise SystemExit('The v1.8.5 fallback baseline hash does not match the governed baseline.')
 patch=gzip.decompress(base64.b64decode(PATCH.read_text().strip()));OUTPUT.write_bytes(BASE.read_bytes())
 with tempfile.NamedTemporaryFile(suffix='.patch') as handle:
  handle.write(patch);handle.flush();subprocess.run(['patch','--batch','--forward',str(OUTPUT),handle.name],check=True,capture_output=True,text=True)
 actual=digest(OUTPUT)
 if actual!=EXPECTED_RUNTIME_SHA:raise SystemExit(f'Materialized runtime hash mismatch: {actual}')
 result={'release':'v1.8.6','baseline':'v1.8.5','baseline_sha256':EXPECTED_BASE_SHA,'runtime_sha256':actual,'runtime':OUTPUT.name,'status':'passed'}
 (HERE/'materialization-result.json').write_text(json.dumps(result,indent=2)+'\n')
 print(f'Materialized {OUTPUT.name}\nSHA-256: {actual}')
if __name__=='__main__':main()
