#!/usr/bin/env python3
from __future__ import annotations
import argparse,hashlib,json
from pathlib import Path
KIND='cmmc_l2_ssp_responsibility_matrix_snapshot_v1';VERSION='1.15'
TYPES={'portfolio-owner','module-owner','requirement-owner','supplement-owner','evidence-owner','action-owner','review-role','review-cycle'}
STATUSES={'assigned','unassigned','multiple-assignees','inherited','unresolved','not-applicable'}
FORBIDDEN={'readiness_score','readinessScore','compliance_score','complianceScore','risk_score','riskScore','assessment_score','assessmentScore','assessment_findings','certification_decision','certification_status'}
def canonical(value):return json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False)
def walk(value,path='$'):
 errors=[]
 if isinstance(value,dict):
  for key,item in value.items():
   if key in FORBIDDEN:errors.append(f'prohibited conclusion field at {path}.{key}')
   errors.extend(walk(item,f'{path}.{key}'))
 elif isinstance(value,list):
  for index,item in enumerate(value):errors.extend(walk(item,f'{path}[{index}]'))
 return errors
def verify(doc):
 if not isinstance(doc,dict):return ['snapshot must be a JSON object']
 errors=walk(doc)
 if doc.get('package_kind')!=KIND:errors.append('unsupported package kind')
 if str(doc.get('package_version'))!=VERSION:errors.append('unsupported package version')
 entries=doc.get('entries');history=doc.get('assignment_history')
 if not isinstance(entries,list):return errors+['entries missing']
 if not isinstance(history,list):return errors+['assignment history missing']
 ids=[item.get('responsibility_id') for item in entries]
 if len(ids)!=len(set(ids)):errors.append('duplicate responsibility id')
 for item in entries:
  if item.get('responsibility_type') not in TYPES:errors.append(f'unsupported responsibility type: {item.get("responsibility_type")}')
  if item.get('coverage_status') not in STATUSES:errors.append(f'unsupported coverage status: {item.get("coverage_status")}')
  assignees=item.get('assignees')
  if not isinstance(assignees,list) or assignees!=sorted(set(assignees)):errors.append(f'assignees are not sorted/unique: {item.get("responsibility_id")}')
 summary=doc.get('summary') or {};counts={status:sum(item.get('coverage_status')==status for item in entries) for status in STATUSES}
 if summary.get('responsibility_rows')!=len(entries):errors.append('responsibility row total does not match')
 mapping={'assigned':'assigned','unassigned':'unassigned','multiple_assignees':'multiple-assignees','inherited':'inherited','unresolved':'unresolved','not_applicable':'not-applicable'}
 for field,status in mapping.items():
  if summary.get(field)!=counts[status]:errors.append(f'{field} total does not match')
 if summary.get('active_role_assignments')!=sum(item.get('status')=='active' for item in history):errors.append('active role assignment total does not match')
 if summary.get('revoked_role_assignments')!=sum(item.get('status')=='revoked' for item in history):errors.append('revoked role assignment total does not match')
 body=dict(doc);fingerprint=body.pop('snapshot_fingerprint',None);expected=hashlib.sha256(canonical(body).encode()).hexdigest()
 if fingerprint!=expected:errors.append('snapshot fingerprint does not match')
 return errors
def main():
 parser=argparse.ArgumentParser();parser.add_argument('snapshot');args=parser.parse_args();doc=json.loads(Path(args.snapshot).read_text(encoding='utf-8'));errors=verify(doc)
 if errors:
  print('INVALID');[print('-',error) for error in errors];return 2
 print(f'VALID: {len(doc["entries"])} responsibility rows; fingerprint {doc["snapshot_fingerprint"]}');return 0
if __name__=='__main__':raise SystemExit(main())
