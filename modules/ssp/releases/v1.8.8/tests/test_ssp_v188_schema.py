from __future__ import annotations
import json
from pathlib import Path
from jsonschema import Draft202012Validator, FormatChecker
ROOT=Path(__file__).resolve().parents[1];FIX=ROOT/'fixtures'
schema=json.loads((ROOT/'CMMC_L2_SSP_Portfolio_Foundation_Schema_v1.json').read_text());validator=Draft202012Validator(schema,format_checker=FormatChecker())
valid=json.loads((FIX/'Portfolio_CRM_McFirecoal_v1.8.8.json').read_text());errors=list(validator.iter_errors(valid));assert not errors,[e.message for e in errors[:10]]
assert valid['schemaVersion']=='1.8.0' and len(valid['modules'])==4 and len(valid['moduleRequirements'])==440 and isinstance(valid['changeDecisionRegister'],list)
entry_schema={'$schema':schema['$schema'],'$defs':schema['$defs'],**schema['$defs']['changeDecisionRegisterEntry']};entry_validator=Draft202012Validator(entry_schema,format_checker=FormatChecker())
entry=json.loads((FIX/'Change_Decision_Register_Entry_v1.8.8.json').read_text());assert not list(entry_validator.iter_errors(entry))
invalid_entry=json.loads((FIX/'Invalid_Change_Decision_Register_Entry.json').read_text());invalid_entry_errors=list(entry_validator.iter_errors(invalid_entry));assert invalid_entry_errors
invalid_results=[]
for path in sorted(FIX.glob('Invalid_*.json')):
 if path.name=='Invalid_Change_Decision_Register_Entry.json':continue
 document=json.loads(path.read_text());invalid=list(validator.iter_errors(document));invalid_results.append({'file':path.name,'rejected':bool(invalid),'firstError':invalid[0].message if invalid else ''});assert invalid,f'{path.name} unexpectedly passed schema validation'
module=json.loads((FIX/'Module_Exchange_Product_Alpha_v1.8.8.json').read_text());assert module['package_kind']=='cmmc_l2_ssp_module_exchange_v1' and len(module['payload']['moduleRequirements'])==110
result={'release':'v1.8.8','suite':'schema-change-decision-register-regression','status':'passed','validFixture':{'modules':4,'moduleRequirements':440},'validRegisterEntry':True,'invalidRegisterEntryRejected':bool(invalid_entry_errors),'invalidFixtures':invalid_results}
(ROOT/'CMMC_L2_SSP_v1.8.8_Schema_Regression.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
