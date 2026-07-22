from __future__ import annotations
import json
from pathlib import Path
from jsonschema import Draft202012Validator, FormatChecker
ROOT=Path(__file__).resolve().parents[1]; FIX=ROOT/'fixtures'
schema=json.loads((ROOT/'CMMC_L2_SSP_Portfolio_Foundation_Schema_v1.json').read_text())
validator=Draft202012Validator(schema,format_checker=FormatChecker())
valid=json.loads((FIX/'Portfolio_CRM_McFirecoal_v1.8.5.json').read_text())
errors=list(validator.iter_errors(valid)); assert not errors,[e.message for e in errors[:10]]
assert valid['schemaVersion']=='1.5.0'
assert len(valid['modules'])==4 and len(valid['moduleRequirements'])==440
assert len({(r['moduleId'],r['requirementId']) for r in valid['moduleRequirements']})==440
assert 'exchangeHistory' in valid and 'moduleWordReviewQueues' in valid
assert all('reviewerNotes' in r for r in valid['moduleRequirements'])
invalid_results=[]
for path in sorted(FIX.glob('Invalid_*.json')):
 document=json.loads(path.read_text()); invalid=list(validator.iter_errors(document))
 invalid_results.append({'file':path.name,'rejected':bool(invalid),'firstError':invalid[0].message if invalid else ''})
 assert invalid, f'{path.name} unexpectedly passed schema validation'
module=json.loads((FIX/'Module_Exchange_Product_Alpha_v1.8.5.json').read_text())
assert module['package_kind']=='cmmc_l2_ssp_module_exchange_v1' and module['package_version']=='1.5'
assert len(module['payload']['moduleRequirements'])==110
result={'release':'v1.8.5','suite':'schema-exchange-regression','status':'passed','validFixture':{'modules':len(valid['modules']),'moduleRequirements':len(valid['moduleRequirements'])},'invalidFixtures':invalid_results,'moduleExchangeRequirements':len(module['payload']['moduleRequirements'])}
(ROOT/'CMMC_L2_SSP_v1.8.5_Schema_Regression.json').write_text(json.dumps(result,indent=2)+'\n'); print(json.dumps(result))
