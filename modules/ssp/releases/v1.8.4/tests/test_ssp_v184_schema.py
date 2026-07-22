from __future__ import annotations
import json
from pathlib import Path
from jsonschema import Draft202012Validator
ROOT=Path(__file__).resolve().parents[1]; FIX=ROOT/'fixtures'
schema=json.loads((ROOT/'CMMC_L2_SSP_Portfolio_Foundation_Schema_v1.json').read_text()); v=Draft202012Validator(schema)
valid=json.loads((FIX/'Portfolio_CRM_McFirecoal_v1.8.4.json').read_text()); errs=list(v.iter_errors(valid)); assert not errs,errs[0].message if errs else ''
assert valid['schemaVersion']=='1.4.0' and len(valid['modules'])==4 and len(valid['moduleRequirements'])==440
assert all('crmSourceIdentifiers' in r and 'crmLegacyIdentifiers' in r for r in valid['moduleRequirements'])
invalid=[]
for p in sorted(FIX.glob('Invalid_*.json')):
 e=list(v.iter_errors(json.loads(p.read_text()))); assert e,f'{p.name} unexpectedly valid'; invalid.append({'fixture':p.name,'errors':len(e),'first':e[0].message})
result={'release':'v1.8.4','suite':'schema-crm-regression','status':'passed','valid_fixture':'Portfolio_CRM_McFirecoal_v1.8.4.json','modules':4,'records':440,'invalid_fixtures':invalid}
(ROOT/'CMMC_L2_SSP_v1.8.4_Schema_Regression.json').write_text(json.dumps(result,indent=2)+'\n'); print(json.dumps(result))
