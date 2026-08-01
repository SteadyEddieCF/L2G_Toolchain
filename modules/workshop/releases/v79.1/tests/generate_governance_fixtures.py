#!/usr/bin/env python3
from __future__ import annotations

import copy
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
FIXTURES = HERE / "fixtures"
FIXTURES.mkdir(parents=True, exist_ok=True)
EXT = "workshop_governance_preservation_v1"
SOURCE_FP = "sha256:" + "a" * 64

EXACT_BUILDER_MERGE = FIXTURES / "builder_v3_10_1_pr113_exact_merge.json"
EXACT_BUILDER_MERGE_SIZE = 683_940
EXACT_BUILDER_MERGE_SHA256 = "efde24c5a0c401c8e1ef9075eb751675359e0dd09419de7a9dae0a34c69c02af"


def canonical(value) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def digest(value) -> str:
    return hashlib.sha256(canonical(value)).hexdigest()


def envelope(record_id: str, record: dict) -> dict:
    return {"record_id":record_id,"source_record":copy.deepcopy(record),"workbook_record":copy.deepcopy(record),"source_record_fingerprint":digest(record),"workbook_record_fingerprint":digest(record)}


def finish(extension: dict) -> dict:
    extension["record_counts"]={"actions":len(extension["actions"]),"evidence_ownership_records":len(extension["evidence_ownership_records"]),"requests":len(extension["requests"]),"provider_followups":len(extension["provider_followups"])}
    extension["preservation_fingerprint"]=digest({k:v for k,v in extension.items() if k!="preservation_fingerprint"})
    return extension


def write_text_lf(path: Path, text: str) -> None:
    path.write_text(text.replace("\r\n", "\n").replace("\r", "\n"), encoding="utf-8", newline="\n")


action={"action_id":"action-rg4-001","title":"Collect synthetic provider evidence","description":"Request deterministic synthetic evidence for regression.","action_type":"Other","priority":"Medium","status":"Open","owner":"Synthetic Evidence Owner","supporting_owner":"","provider":"","due_date":"2026-09-30","blocker_id":"Awaiting provider response","related_practices":["AC.L2-3.1.1"],"related_objectives":[],"dependencies":[],"related_references":[],"evidence_request_id":"","source_type":"","source_id":"","source_key":"","source_label":"RG-4 synthetic fixture"}
ownership={"ownership_record_id":"ownership-rg4-001","candidate_id":"candidate-rg4-001","practice_id":"AC.L2-3.1.1","objective_id":"AC.L2-3.1.1[a]","evidence_category":"provider-produced","evidence_category_label":"","audience":"","production_owner":"Synthetic Cloud Provider","retention_owner":"","access_owner":"","access_path":"","submission_owner":"","review_followup_owner":"","contract_validation_required":True,"access_limitation":"Client tenant export required.","responsibility_record_id":"source-rg4-001","request_id":"request-rg4-001","request_status":"requested","provider_followup_id":"followup-rg4-001","provider_followup_state":"open","action_id":"","due_date":"2026-09-30","report_state":"requested","service_ids":[],"service_names":["Synthetic Cloud Provider"],"source_package_kind":"","source_package_version":"","source_fingerprint":SOURCE_FP,"practice_name":"Access Control","state":"accepted","advisor_note":"","validation_questions":[],"accepted_at":"2026-08-01T00:30:00.000Z","accepted_by":"Synthetic Advisor","followup_id":"followup-rg4-001"}
request={"request_id":"request-rg4-001","ownership_record_id":"ownership-rg4-001","practice_id":"AC.L2-3.1.1","objective_id":"","audience":"provider","evidence_category":"","request_title":"","request_text":"Provide synthetic tenant configuration export.","owner":"Synthetic Cloud Provider","status":"requested","due_date":"2026-09-30","contract_validation_required":False,"access_limitation":"","access_path":"","source_candidate_id":"","source_responsibility_record_id":"","source_fingerprint":"","action_id":"","practice_name":"Access Control","evidence_category_label":"Provider-produced evidence"}
followup={"followup_id":"followup-rg4-001","ownership_record_id":"","request_id":"request-rg4-001","practice_id":"AC.L2-3.1.1","objective_id":"","provider":"Synthetic Cloud Provider","topic":"Synthetic provider follow-up.","state":"open","owner":"Synthetic Advisor","due_date":"2026-10-07","contract_validation_required":False,"access_limitation":"","source_fingerprint":"","action_id":""}
extension=finish({"schema_version":"1.0","source_package_identity":{"package_kind":"l2g_workbook_handoff_v1","package_version":"1.0","contract_release":"1.7","enhancement_version":"1.7","canonical_fingerprint":SOURCE_FP},"record_counts":{},"actions":[envelope(action["action_id"],action)],"evidence_ownership_records":[envelope(ownership["ownership_record_id"],ownership)],"requests":[envelope(request["request_id"],request)],"provider_followups":[envelope(followup["followup_id"],followup)],"guardrails":{"reconciliation_assertion_only":True,"no_automatic_create_update_delete":True,"missing_or_mismatch_blocks_trusted_apply":True},"preservation_fingerprint":""})
base={"package_kind":"l2g_workbook_merge_v1","package_version":"1.1","schema_trusted":True,"generated_by":"L2G Builder/Merger v3.10.1","generated_at":"2026-08-01T00:30:00.000Z","tool_family":"L2G_Builder_Merger","content_trust_level":"reviewed_workbook_output","practice_results":[{"Practice_ID":"AC.L2-3.1.1","Implementation_Status":"Partially Implemented"}],"objective_results":[{"Practice_ID":"AC.L2-3.1.1","Objective_ID":"AC.L2-3.1.1[a]","Assessment_Result":"Met"}],"evidence_results":[],"gap_results":[],"advisor_review_results":[],"warnings":[],"workbook_source":{"workbook_file_name":"RG4_Synthetic_Workbook.xlsx",EXT:extension}}
def write(name,value): write_text_lf(FIXTURES/name,json.dumps(value,indent=2,ensure_ascii=False)+"\n")
write("canonical_nested_extension.json",base)
no_extension=copy.deepcopy(base);no_extension["workbook_source"].pop(EXT);write("package_without_extension.json",no_extension)
top_level=copy.deepcopy(base);top_level[EXT]=top_level["workbook_source"].pop(EXT);write("top_level_extension_invalid.json",top_level)
mismatch=copy.deepcopy(base);env=mismatch["workbook_source"][EXT]["actions"][0];env["workbook_record"]["owner"]="Different Owner";env["workbook_record_fingerprint"]=digest(env["workbook_record"]);finish(mismatch["workbook_source"][EXT]);write("governed_field_mismatch.json",mismatch)
missing=copy.deepcopy(base);env=missing["workbook_source"][EXT]["actions"][0];env["record_id"]="action-missing-001";env["source_record"]["action_id"]="action-missing-001";env["workbook_record"]["action_id"]="action-missing-001";env["source_record_fingerprint"]=digest(env["source_record"]);env["workbook_record_fingerprint"]=digest(env["workbook_record"]);finish(missing["workbook_source"][EXT]);write("missing_current_record.json",missing)
duplicate=copy.deepcopy(base);duplicate["workbook_source"][EXT]["actions"].append(copy.deepcopy(duplicate["workbook_source"][EXT]["actions"][0]));finish(duplicate["workbook_source"][EXT]);write("duplicate_stable_id.json",duplicate)
count=copy.deepcopy(base);count["workbook_source"][EXT]["record_counts"]["actions"]=2;count["workbook_source"][EXT]["preservation_fingerprint"]=digest({k:v for k,v in count["workbook_source"][EXT].items() if k!="preservation_fingerprint"});write("incorrect_count.json",count)
record_fp=copy.deepcopy(base);record_fp["workbook_source"][EXT]["actions"][0]["source_record_fingerprint"]="0"*64;finish(record_fp["workbook_source"][EXT]);write("incorrect_record_fingerprint.json",record_fp)
preservation_fp=copy.deepcopy(base);preservation_fp["workbook_source"][EXT]["preservation_fingerprint"]="0"*64;write("incorrect_preservation_fingerprint.json",preservation_fp)
linkage=copy.deepcopy(base);linkage["workbook_source"][EXT]["source_package_identity"]["canonical_fingerprint"]="sha256:"+"b"*64;finish(linkage["workbook_source"][EXT]);write("incorrect_source_handoff_linkage.json",linkage)
malformed=copy.deepcopy(base);malformed["workbook_source"][EXT]["actions"][0]["unexpected"]=True;finish(malformed["workbook_source"][EXT]);write("malformed_extension.json",malformed)
adversarial=copy.deepcopy(base);adv=adversarial["workbook_source"][EXT]["actions"][0];adv["source_record"]["description"]='<script>window.__V791_INJECTED__=true</script> ../../etc/passwd C:\\Windows\\System32';adv["workbook_record"]["description"]=adv["source_record"]["description"];adv["source_record_fingerprint"]=digest(adv["source_record"]);adv["workbook_record_fingerprint"]=digest(adv["workbook_record"]);finish(adversarial["workbook_source"][EXT]);write("adversarial_inert_strings.json",adversarial)
raw=json.dumps(base,separators=(",",":"),ensure_ascii=False).replace('"schema_version":"1.0"','"schema_version":"1.0","schema_version":"1.0"',1);write_text_lf(FIXTURES/"duplicate_key_extension.json.txt",raw+"\n")
if not EXACT_BUILDER_MERGE.is_file():
    raise SystemExit(
        "Exact Builder/Merger PR #113 Merge fixture missing. "
        "Run tests/materialize_exact_builder_pr113_fixture.py first."
    )
exact_builder_bytes = EXACT_BUILDER_MERGE.read_bytes()
if len(exact_builder_bytes) != EXACT_BUILDER_MERGE_SIZE:
    raise SystemExit(f"Exact Builder/Merger PR #113 fixture size mismatch: {len(exact_builder_bytes)}")
if hashlib.sha256(exact_builder_bytes).hexdigest() != EXACT_BUILDER_MERGE_SHA256:
    raise SystemExit("Exact Builder/Merger PR #113 fixture SHA-256 mismatch")

for path in sorted(FIXTURES.glob("*")):
    if path.name=="FIXTURE_SHA256.json" or not path.is_file(): continue
    write_text_lf(path,path.read_text(encoding="utf-8"))
manifest={}
for path in sorted(FIXTURES.glob("*")):
    if path.name=="FIXTURE_SHA256.json":continue
    manifest[path.name]={"size_bytes":path.stat().st_size,"sha256":hashlib.sha256(path.read_bytes()).hexdigest()}
write_text_lf(FIXTURES/"FIXTURE_SHA256.json",json.dumps(manifest,indent=2)+"\n")
print(json.dumps(manifest,indent=2))
