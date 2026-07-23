#!/usr/bin/env python3
from __future__ import annotations
import argparse,hashlib,json
from pathlib import Path
KIND='cmmc_l2_ssp_evidence_reminder_snapshot_v1';VERSION='1.12'
STATUSES={'unresolved','invalid-date','future-date','expired','stale','date-missing','due-soon','current'}
LEVELS={'action','follow-up','information'};OWNER_SOURCES={'evidence-record','linked-requirement','none'}
INDICATORS={'unresolved-reference','duplicate-evidence-id','owner-missing','owner-derived','validation-date-missing','invalid-date','future-validation-date','expired','stale','due-soon','current','unlinked-evidence'}
FORBIDDEN={'readinessScore','readiness_score','complianceScore','compliance_score','assessmentConclusion','assessment_conclusion','evidenceSufficiencyScore'}
def canonical(value):return json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False)
def sha(value):return hashlib.sha256(value.encode('utf-8')).hexdigest()
def verify(snapshot):
 errors=[]
 if not isinstance(snapshot,dict):return ['snapshot must be a JSON object']
 if snapshot.get('package_kind')!=KIND:errors.append('unsupported evidence reminder snapshot kind')
 if str(snapshot.get('package_version'))!=VERSION:errors.append('unsupported evidence reminder snapshot version')
 if snapshot.get('scope') not in {'portfolio','module'}:errors.append('unsupported evidence reminder scope')
 policy=snapshot.get('policy');summary=snapshot.get('summary');items=snapshot.get('items')
 if not isinstance(policy,dict) or not isinstance(summary,dict) or not isinstance(items,list):errors.append('policy, summary, or items missing');return errors
 if not isinstance(policy.get('default_max_age_days'),int) or not 1<=policy['default_max_age_days']<=3650:errors.append('invalid default age limit')
 if not isinstance(policy.get('due_soon_days'),int) or not 0<=policy['due_soon_days']<=365:errors.append('invalid due-soon window')
 if policy.get('due_soon_days',0)>policy.get('default_max_age_days',0):errors.append('due-soon window exceeds age limit')
 ids=set()
 for item in items:
  if not isinstance(item,dict):errors.append('reminder item is not an object');continue
  rid=item.get('reminder_id')
  if rid in ids:errors.append(f'duplicate reminder item: {rid}')
  ids.add(rid)
  if item.get('freshness_status') not in STATUSES:errors.append(f'unsupported freshness status: {item.get("freshness_status")}')
  if item.get('reminder_level') not in LEVELS:errors.append(f'unsupported reminder level: {item.get("reminder_level")}')
  if item.get('owner_source') not in OWNER_SOURCES:errors.append(f'unsupported owner source: {item.get("owner_source")}')
  indicators=item.get('indicators')
  if not isinstance(indicators,list) or not indicators:errors.append(f'reminder item {rid or "(missing)"} has no indicators')
  else:
   for code in indicators:
    if code not in INDICATORS:errors.append(f'unsupported reminder indicator: {code}')
 def walk(value):
  if isinstance(value,dict):
   for key,child in value.items():
    if key in FORBIDDEN:errors.append(f'forbidden score or conclusion field: {key}')
    walk(child)
  elif isinstance(value,list):
   for child in value:walk(child)
 walk(snapshot)
 if summary.get('evidence_records')!=len(items):errors.append('evidence record count does not match')
 reminders=sum(item.get('reminder_level')!='information' for item in items)
 if summary.get('reminder_records')!=reminders:errors.append('reminder record count does not match')
 if summary.get('current')!=sum(item.get('freshness_status')=='current' for item in items):errors.append('current count does not match')
 if summary.get('due_soon')!=sum(item.get('freshness_status')=='due-soon' for item in items):errors.append('due-soon count does not match')
 if summary.get('unresolved_references')!=sum(item.get('freshness_status')=='unresolved' for item in items):errors.append('unresolved count does not match')
 body=dict(snapshot);fingerprint=body.pop('snapshot_fingerprint',None)
 if fingerprint!=sha(canonical(body)):errors.append('evidence reminder snapshot fingerprint does not match')
 return errors
def main():
 ap=argparse.ArgumentParser(description='Verify a CMMC L2 SSP evidence reminder snapshot.');ap.add_argument('snapshot');args=ap.parse_args();snapshot=json.loads(Path(args.snapshot).read_text(encoding='utf-8'));errors=verify(snapshot)
 if errors:
  print('INVALID');[print('-',e) for e in errors];return 2
 print(f'VALID: {len(snapshot["items"])} evidence records; snapshot fingerprint {snapshot["snapshot_fingerprint"]}');return 0
if __name__=='__main__':raise SystemExit(main())
