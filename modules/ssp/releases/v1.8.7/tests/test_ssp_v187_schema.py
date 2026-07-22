from __future__ import annotations
import json
from pathlib import Path
from jsonschema import Draft202012Validator, FormatChecker
ROOT=Path(__file__).resolve().parents[1]; FIX=ROOT/'fixtures'
schema=json.loads((ROOT/'CMMC_L2_SSP_Portfolio_Foundation_Schema_v1.json').read_text())
validator=Draft202012Validator(schema,format_checker=FormatChecker())
valid=json.loads((FIX/'Portfolio_CRM_McFirecoal_v1.8.7.json').read_text())
errors=list(validator.iter_errors(valid)); assert not errors,[e.message for e in errors[:10]]
assert valid['schemaVersion']=='1.7.0'
assert len(valid['modules'])==4 and len(valid['moduleRequirements'])==440
for key in ['reviewRoleAssignments','reviewSubmissions','reviewDispositions','approvalRecords','approvedBaselines','baselineEvents']:
 assert key in valid and isinstance(valid[key],list)
baseline_schema={'$schema':schema['$schema'],'$defs':schema['$defs'],**schema['$defs']['baselineRecord']}
event_schema={'$schema':schema['$schema'],'$defs':schema['$defs'],**schema['$defs']['baselineEvent']}
baseline_validator=Draft202012Validator(baseline_schema,format_checker=FormatChecker())
event_validator=Draft202012Validator(event_schema,format_checker=FormatChecker())
valid_baseline=json.loads((FIX/'Named_Baseline_Record_v1.8.7.json').read_text());assert not list(baseline_validator.iter_errors(valid_baseline))
invalid_baseline=json.loads((FIX/'Invalid_Named_Baseline_Record.json').read_text());baseline_errors=list(baseline_validator.iter_errors(invalid_baseline));assert baseline_errors
invalid_event=json.loads((FIX/'Invalid_Baseline_Event.json').read_text());event_errors=list(event_validator.iter_errors(invalid_event));assert event_errors
invalid_results=[]
for path in sorted(FIX.glob('Invalid_*.json')):
 if path.name in {'Invalid_Named_Baseline_Record.json','Invalid_Baseline_Event.json'}:continue
 document=json.loads(path.read_text()); invalid=list(validator.iter_errors(document))
 invalid_results.append({'file':path.name,'rejected':bool(invalid),'firstError':invalid[0].message if invalid else ''})
 assert invalid, f'{path.name} unexpectedly passed schema validation'
module=json.loads((FIX/'Module_Exchange_Product_Alpha_v1.8.7.json').read_text())
assert module['package_kind']=='cmmc_l2_ssp_module_exchange_v1' and module['package_version']=='1.5'
assert len(module['payload']['moduleRequirements'])==110
result={'release':'v1.8.7','suite':'schema-immutable-baseline-regression','status':'passed','validFixture':{'modules':len(valid['modules']),'moduleRequirements':len(valid['moduleRequirements'])},'baselineRecordValid':True,'invalidBaselineRejected':bool(baseline_errors),'invalidEventRejected':bool(event_errors),'invalidFixtures':invalid_results}
(ROOT/'CMMC_L2_SSP_v1.8.7_Schema_Regression.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
