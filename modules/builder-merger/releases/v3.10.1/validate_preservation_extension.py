#!/usr/bin/env python3
"""Portable validator for the Workbook Merge 1.1 Workshop preservation extension."""
from __future__ import annotations
import argparse, copy, hashlib, json, sys
from pathlib import Path

EXT_KEY='workshop_governance_preservation_v1'
TOP_ALLOWED={
'advisor_review_results','content_trust_level','evidence_results','gap_results','generated_at','generated_by','objective_results','package_kind','package_version','practice_results','schema_trusted','tool_family','warnings','workbook_source'}
EXT_ALLOWED={'schema_version','source_package_identity','record_counts','actions','evidence_ownership_records','requests','provider_followups','guardrails','preservation_fingerprint'}
COLLECTIONS=('actions','evidence_ownership_records','requests','provider_followups')
ID_FIELDS={'actions':'action_id','evidence_ownership_records':'ownership_record_id','requests':'request_id','provider_followups':'followup_id'}
PROJECTIONS={
'actions':{'action_id','title','description','action_type','priority','status','owner','supporting_owner','provider','due_date','blocker_id','related_practices','related_objectives','dependencies','related_references','evidence_request_id','source_type','source_id','source_key','source_label'},
'evidence_ownership_records':{'ownership_record_id','candidate_id','practice_id','objective_id','evidence_category','evidence_category_label','audience','production_owner','retention_owner','access_owner','access_path','submission_owner','review_followup_owner','contract_validation_required','access_limitation','responsibility_record_id','request_id','request_status','provider_followup_id','provider_followup_state','action_id','due_date','report_state','service_ids','service_names','source_package_kind','source_package_version','source_fingerprint'},
'requests':{'request_id','ownership_record_id','practice_id','objective_id','audience','evidence_category','request_title','request_text','owner','status','due_date','contract_validation_required','access_limitation','access_path','source_candidate_id','source_responsibility_record_id','source_fingerprint','action_id'},
'provider_followups':{'followup_id','ownership_record_id','request_id','practice_id','objective_id','provider','topic','state','owner','due_date','contract_validation_required','access_limitation','source_fingerprint','action_id'},
}
GUARDRAILS={'reconciliation_assertion_only':True,'no_automatic_create_update_delete':True,'missing_or_mismatch_blocks_trusted_apply':True}

def reject_duplicates(pairs):
    out={}
    for key,value in pairs:
        if key in out: raise ValueError(f'duplicate key: {key}')
        out[key]=value
    return out

def load_json(path:Path):
    return json.loads(path.read_text('utf-8'),object_pairs_hook=reject_duplicates)

def canonical(value)->bytes:
    return json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode('utf-8')

def digest(value)->str:return hashlib.sha256(canonical(value)).hexdigest()
def need(cond,msg,errors):
    if not cond: errors.append(msg)

def validate(package,source_handoff=None):
    errors=[]; blockers=[]
    need(package.get('package_kind')=='l2g_workbook_merge_v1','package kind',errors)
    need(package.get('package_version')=='1.1','package version',errors)
    need(not(set(package)-TOP_ALLOWED),'unknown top-level property',errors)
    need(EXT_KEY not in package,'extension must not be top-level',errors)
    source=package.get('workbook_source'); need(isinstance(source,dict),'workbook_source',errors)
    ext=source.get(EXT_KEY) if isinstance(source,dict) else None; need(isinstance(ext,dict),'nested extension',errors)
    if not isinstance(ext,dict): return {'status':'rejected','trusted':False,'errors':errors,'blockers':blockers}
    need(set(ext)==EXT_ALLOWED,'extension shape',errors)
    need(ext.get('schema_version')=='1.0','schema version',errors)
    ident=ext.get('source_package_identity'); need(isinstance(ident,dict),'source identity',errors)
    expected_ident={'package_kind','package_version','contract_release','enhancement_version','canonical_fingerprint'}
    if isinstance(ident,dict):
        need(set(ident)==expected_ident,'source identity shape',errors)
        need(ident.get('package_kind')=='l2g_workbook_handoff_v1','source kind',errors)
        need(ident.get('package_version')=='1.0','source wire version',errors)
        need(ident.get('contract_release')=='1.7','source contract release',errors)
        need(ident.get('enhancement_version')=='1.7','source enhancement',errors)
        fp=ident.get('canonical_fingerprint','')
        need(isinstance(fp,str) and fp.startswith('sha256:') and len(fp)==71 and all(c in '0123456789abcdef' for c in fp[7:]),'source fingerprint',errors)
        if source_handoff is not None:
            need(fp=='sha256:'+digest(source_handoff),'source Handoff fingerprint linkage',errors)
            need(source_handoff.get('package_kind')=='l2g_workbook_handoff_v1','source Handoff package kind',errors)
            need(source_handoff.get('package_version')=='1.0','source Handoff wire version',errors)
            need(source_handoff.get('handoff_schema_enhancements_version')=='1.7','source Handoff enhancement',errors)
            need(source_handoff.get('contract_manifest',{}).get('contract_release')=='1.7','source Handoff contract release',errors)
    need(ext.get('guardrails')==GUARDRAILS,'guardrails',errors)
    counts=ext.get('record_counts'); need(isinstance(counts,dict) and set(counts)==set(COLLECTIONS),'record counts',errors)
    observed={}
    for collection in COLLECTIONS:
        rows=ext.get(collection); need(isinstance(rows,list),f'{collection} array',errors); rows=rows if isinstance(rows,list) else []
        observed[collection]=len(rows); seen=set(); id_field=ID_FIELDS[collection]
        for idx,row in enumerate(rows):
            if not isinstance(row,dict): errors.append(f'{collection}[{idx}] entry'); continue
            need(set(row)=={'record_id','source_record','workbook_record','source_record_fingerprint','workbook_record_fingerprint'},f'{collection}[{idx}] entry shape',errors)
            rid=row.get('record_id'); need(isinstance(rid,str) and bool(rid),f'{collection}[{idx}] record ID',errors)
            need(rid not in seen,f'{collection} duplicate ID',errors); seen.add(rid)
            src=row.get('source_record'); wb=row.get('workbook_record')
            need(isinstance(src,dict) and set(src)==PROJECTIONS[collection],f'{collection}[{idx}] source projection',errors)
            need(isinstance(wb,dict) and set(wb)==PROJECTIONS[collection],f'{collection}[{idx}] workbook projection',errors)
            if isinstance(src,dict): need(src.get(id_field)==rid,f'{collection}[{idx}] source ID',errors)
            if isinstance(wb,dict): need(wb.get(id_field)==rid,f'{collection}[{idx}] workbook ID',errors)
            sf=row.get('source_record_fingerprint',''); wf=row.get('workbook_record_fingerprint','')
            need(isinstance(sf,str) and len(sf)==64 and all(c in '0123456789abcdef' for c in sf),f'{collection}[{idx}] source fingerprint shape',errors)
            need(isinstance(wf,str) and len(wf)==64 and all(c in '0123456789abcdef' for c in wf),f'{collection}[{idx}] workbook fingerprint shape',errors)
            if isinstance(src,dict): need(sf==digest(src),f'{collection}[{idx}] source fingerprint',errors)
            if isinstance(wb,dict): need(wf==digest(wb),f'{collection}[{idx}] workbook fingerprint',errors)
            if src!=wb: blockers.append(f'{collection}[{idx}] governed mismatch')
    need(counts==observed,'record count mismatch',errors)
    supplied=ext.get('preservation_fingerprint','')
    need(isinstance(supplied,str) and len(supplied)==64 and all(c in '0123456789abcdef' for c in supplied),'preservation fingerprint shape',errors)
    fp_input={k:v for k,v in ext.items() if k!='preservation_fingerprint'}
    need(supplied==digest(fp_input),'preservation fingerprint',errors)
    return {'status':'rejected' if errors else 'blocked' if blockers else 'trusted-current','trusted':not errors and not blockers,'errors':errors,'blockers':blockers,'record_counts':observed,'preservation_fingerprint':supplied,'source_handoff_fingerprint':ident.get('canonical_fingerprint') if isinstance(ident,dict) else ''}

def main():
    here=Path(__file__).resolve().parent; package_root=here.parent
    ap=argparse.ArgumentParser()
    ap.add_argument('package',nargs='?',type=Path,default=package_root/'artifacts'/'L2G-BM_v3.10.1_Workbook_Merge_1.1.json')
    ap.add_argument('--source-handoff',type=Path,default=package_root/'artifacts'/'RG4_Workshop_v79_Workbook_Handoff_1.7.json')
    ap.add_argument('--json',action='store_true')
    a=ap.parse_args(); package=load_json(a.package); source=load_json(a.source_handoff) if a.source_handoff and a.source_handoff.is_file() else None
    result=validate(package,source)
    print(json.dumps(result,indent=2,ensure_ascii=False) if a.json else f"{result['status']}: {a.package}")
    return 0 if result['trusted'] else 1
if __name__=='__main__':raise SystemExit(main())
