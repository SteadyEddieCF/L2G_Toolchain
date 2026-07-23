from __future__ import annotations
import argparse,hashlib,json,re
from pathlib import Path
KIND='cmmc_l2_ssp_change_calendar_snapshot_v1';VERSION='1.14';STATUSES={'overdue','due-soon','upcoming','later','historical','unscheduled'};FORBIDDEN={'readiness_score','readinessScore','compliance_score','complianceScore','risk_score','riskScore','assessment_score','assessmentScore'}
def canonical(value):return json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False)
def walk(value,path='$'):
 errors=[]
 if isinstance(value,dict):
  for k,v in value.items():
   if k in FORBIDDEN:errors.append(f'prohibited score field at {path}.{k}')
   errors.extend(walk(v,f'{path}.{k}'))
 elif isinstance(value,list):
  for i,v in enumerate(value):errors.extend(walk(v,f'{path}[{i}]'))
 return errors
def verify(doc):
 errors=walk(doc)
 if not isinstance(doc,dict):return ['snapshot must be a JSON object']
 if doc.get('package_kind')!=KIND:errors.append('unsupported package kind')
 if str(doc.get('package_version'))!=VERSION:errors.append('unsupported package version')
 events=doc.get('events')
 if not isinstance(events,list):return errors+['events missing']
 ids=[e.get('event_id') for e in events]
 if len(ids)!=len(set(ids)):errors.append('duplicate event id')
 for e in events:
  if e.get('status') not in STATUSES:errors.append(f'unsupported status: {e.get("status")}')
  if e.get('event_date') and not re.fullmatch(r'\d{4}-\d{2}-\d{2}',e.get('event_date')):errors.append(f'invalid event date: {e.get("event_id")}')
 summary=doc.get('summary') or {};counts={status:sum(e.get('status')==status for e in events) for status in STATUSES}
 if summary.get('events')!=len(events):errors.append('event total does not match')
 if summary.get('overdue')!=counts['overdue'] or summary.get('due_soon')!=counts['due-soon'] or summary.get('upcoming')!=counts['upcoming'] or summary.get('later')!=counts['later'] or summary.get('historical')!=counts['historical'] or summary.get('unscheduled')!=counts['unscheduled']:errors.append('status totals do not match')
 body=dict(doc);fingerprint=body.pop('snapshot_fingerprint',None);expected=hashlib.sha256(canonical(body).encode()).hexdigest()
 if fingerprint!=expected:errors.append('snapshot fingerprint does not match')
 return errors
def main():
 ap=argparse.ArgumentParser();ap.add_argument('snapshot');args=ap.parse_args();doc=json.loads(Path(args.snapshot).read_text());errors=verify(doc)
 if errors:
  print('INVALID');[print('-',e) for e in errors];return 2
 print(f'VALID: {len(doc["events"])} events; fingerprint {doc["snapshot_fingerprint"]}');return 0
if __name__=='__main__':raise SystemExit(main())
