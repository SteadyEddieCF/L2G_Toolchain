from __future__ import annotations
import argparse,hashlib,json
from pathlib import Path
KIND='cmmc_l2_ssp_module_dependency_snapshot_v1';VERSION='1.13';FORBIDDEN={'readiness_score','readinessScore','compliance_score','complianceScore','risk_score','riskScore','assessment_score','assessmentScore'}
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
 nodes=doc.get('nodes');edges=doc.get('edges')
 if not isinstance(nodes,list) or not isinstance(edges,list):return errors+['nodes or edges missing']
 ids=[n.get('module_id') for n in nodes]
 if len(ids)!=len(set(ids)):errors.append('duplicate module node')
 edge_ids=[e.get('edge_id') for e in edges]
 if len(edge_ids)!=len(set(edge_ids)):errors.append('duplicate edge id')
 known=set(ids)
 for e in edges:
  if e.get('source_module_id') not in known or e.get('target_module_id') not in known:errors.append(f'missing edge endpoint: {e.get("edge_id")}')
  if e.get('requirement_count')!=len(e.get('requirement_ids') or []):errors.append(f'requirement count mismatch: {e.get("edge_id")}')
 summary=doc.get('summary') or {}
 if summary.get('modules')!=len(nodes) or summary.get('relationships')!=len(edges):errors.append('summary counts do not match')
 body=dict(doc);fingerprint=body.pop('snapshot_fingerprint',None);expected=hashlib.sha256(canonical(body).encode()).hexdigest()
 if fingerprint!=expected:errors.append('snapshot fingerprint does not match')
 return errors
def main():
 ap=argparse.ArgumentParser();ap.add_argument('snapshot');args=ap.parse_args();doc=json.loads(Path(args.snapshot).read_text());errors=verify(doc)
 if errors:
  print('INVALID');[print('-',e) for e in errors];return 2
 print(f'VALID: {len(doc["nodes"])} nodes; {len(doc["edges"])} edges; fingerprint {doc["snapshot_fingerprint"]}');return 0
if __name__=='__main__':raise SystemExit(main())
