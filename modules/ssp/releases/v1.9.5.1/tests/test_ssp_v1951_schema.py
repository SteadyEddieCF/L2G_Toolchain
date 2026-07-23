from pathlib import Path
import hashlib,json
p=Path(__file__).resolve().parents[1]/'CMMC_L2_SSP_Data_Schema_v1.9.5.1.json'
s=json.loads(p.read_text())
assert hashlib.sha256(p.read_bytes()).hexdigest()=='be2659f848c74e41cfbe47db642efcc3835f5d5b32dc7d3e9054991ad84a8a36'
assert s['$id']=='urn:l2g:cmmc-l2-ssp:data-schema:1.9.5.1'
assert s['properties']['schema']['const']=='cmmc-l2-ssp-modern-v1.9.5.1'
assert s['properties']['schemaVersion']['const']==s['properties']['appVersion']['const']=='1.9.5.1'
print('PASS')
