#!/usr/bin/env python3
from __future__ import annotations
import argparse,hashlib,json,sys
from pathlib import Path
KIND='cmmc_l2_ssp_maintenance_snapshot_v1';VERSION='1.11'
INDICATORS={'applicability-pending','responsibility-undecided','implementation-narrative-missing','owner-reference-missing','evidence-reference-missing','validation-date-missing','review-not-recorded','approval-follow-up','inheritance-follow-up','impact-review-follow-up','module-owner-missing','module-description-missing','module-boundary-missing','open-conflict','review-scope-not-approved','review-scope-stale','active-baseline-missing','default-policy-in-use','crm-reconciliation-follow-up','word-review-queue-open','open-register-items'}
FORBIDDEN_KEYS={'readinessScore','readiness_score','complianceScore','compliance_score','assessmentConclusion','assessment_conclusion'}
def canonical(value):return json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False)
def sha(value):return hashlib.sha256(value.encode('utf-8')).hexdigest()
def verify(snapshot):
 errors=[]
 if not isinstance(snapshot,dict):return ['snapshot must be a JSON object']
 if snapshot.get('package_kind')!=KIND:errors.append('unsupported maintenance snapshot kind')
 if str(snapshot.get('package_version'))!=VERSION:errors.append('unsupported maintenance snapshot version')
 if snapshot.get('scope') not in {'portfolio','module'}:errors.append('unsupported maintenance scope')
 items=snapshot.get('items');summary=snapshot.get('summary')
 if not isinstance(items,list) or not isinstance(summary,dict):errors.append('summary or items missing');return errors
 ids=set();indicator_instances=0
 for item in items:
  if not isinstance(item,dict):errors.append('maintenance item is not an object');continue
  item_id=item.get('item_id')
  if item_id in ids:errors.append(f'duplicate maintenance item: {item_id}')
  ids.add(item_id)
  indicators=item.get('indicators')
  if not isinstance(indicators,list) or not indicators:errors.append(f'maintenance item {item_id or "(missing)"} has no indicators');continue
  indicator_instances+=len(indicators)
  for code in indicators:
   if code not in INDICATORS:errors.append(f'unsupported maintenance indicator: {code}')
 def walk(value):
  if isinstance(value,dict):
   for key,child in value.items():
    if key in FORBIDDEN_KEYS:errors.append(f'forbidden score or conclusion field: {key}')
    walk(child)
  elif isinstance(value,list):
   for child in value:walk(child)
 walk(snapshot)
 if summary.get('queue_records')!=len(items):errors.append('maintenance queue-record count does not match')
 if summary.get('indicator_instances')!=indicator_instances:errors.append('maintenance indicator count does not match')
 body=dict(snapshot);fingerprint=body.pop('snapshot_fingerprint',None)
 if fingerprint!=sha(canonical(body)):errors.append('maintenance snapshot fingerprint does not match')
 return errors
def main():
 ap=argparse.ArgumentParser(description='Verify a CMMC L2 SSP maintenance snapshot.')
 ap.add_argument('snapshot');args=ap.parse_args();snapshot=json.loads(Path(args.snapshot).read_text(encoding='utf-8'));errors=verify(snapshot)
 if errors:
  print('INVALID');[print('-',item) for item in errors];return 2
 print(f'VALID: {len(snapshot["items"])} queue records; snapshot fingerprint {snapshot["snapshot_fingerprint"]}')
 return 0
if __name__=='__main__':raise SystemExit(main())
