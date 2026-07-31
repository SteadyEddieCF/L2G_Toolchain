#!/usr/bin/env python3
from __future__ import annotations
import copy,hashlib,json,re
from datetime import datetime
from pathlib import Path
from typing import Any
ROOT=Path(__file__).resolve().parents[2];FIX=ROOT/'fixtures/contracts/l2g_ssp_word_qa_sidecar_v1';CON=ROOT/'contracts/proposals/l2g_ssp_word_qa_sidecar_v1'
def dup(pairs:list[tuple[str,Any]]):
 d={}
 for k,v in pairs:
  if k in d:raise ValueError(f'duplicate JSON key: {k}')
  d[k]=v
 return d
def canon(x):return json.dumps(x,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
def dig(x):return hashlib.sha256(canon(x)).hexdigest()
def lineage(o):return dig({'package_kind':o['package_kind'],'package_version':o['package_version'],'scope':o['scope'],'document_version':o['source']['document_version'],'qa_profile':{'id':o['qa_profile']['id'],'version':o['qa_profile']['version']}})
def sid(o):
 x=copy.deepcopy(o);x.pop('sidecar_id',None);x.pop('package_fingerprint',None);return 'sha256:'+dig(x)
def pkg(o):
 x=copy.deepcopy(o);x.pop('package_fingerprint',None);return dig(x)
def utc(s):return bool(re.fullmatch(r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z',s))
profile=json.loads((CON/'l2g-builder-merger-final-word-qa-v1.profile.json').read_text(),object_pairs_hook=dup);q=dict(profile);q.pop('sha256');ph=dig(q);ids=[c['check_id'] for c in profile['checks']];defs={c['check_id']:c for c in profile['checks']}
def errors(o):
 e=[]
 required={'package_kind','package_version','schema_uri','sidecar_id','created_at','producer','consumer','scope','source','artifact','qa_profile','checks','aggregate','operator_assertions','lineage','authority','package_fingerprint'}
 if set(o)!=required:e+=['top-level-keys']
 if '/' in o.get('artifact',{}).get('file_name','') or '\\' in o.get('artifact',{}).get('file_name',''):e+=['artifact-file-name']
 try:
  if o['lineage']['lineage_key']!=lineage(o):e+=['lineage']
  if o['sidecar_id']!=sid(o):e+=['sidecar-id']
  if o['package_fingerprint']!=pkg(o):e+=['package-fingerprint']
 except Exception:e+=['identity-derivation']
 if o.get('qa_profile')!={'id':profile['id'],'version':profile['version'],'sha256':ph}:e+=['profile-hash']
 cs=o.get('checks',[]);cids=[c.get('check_id') for c in cs]
 if cids!=ids:e+=['profile-order']
 for c in cs:
  d=defs.get(c.get('check_id'))
  if d and (c.get('classification'),c.get('severity'))!=(d['classification'],d['severity']):e+=['profile-definition']
 counts={'pass':sum(c.get('result')=='pass' for c in cs),'fail':sum(c.get('result')=='fail' for c in cs),'needs_human_review':sum(c.get('result')=='needs-human-review' for c in cs),'not_applicable':sum(c.get('result')=='not-applicable' for c in cs)}
 if any(o.get('aggregate',{}).get(k)!=v for k,v in counts.items()):e+=['aggregate-counts']
 aa=o.get('operator_assertions',[]);by={}
 for a in aa:by.setdefault(a.get('check_id'),[]).append(a)
 for c in cs:
  if c.get('classification')=='automated' and by.get(c.get('check_id')):e+=['automated-assertion']
  if c.get('classification')=='human' and c.get('result')=='pass' and len(by.get(c.get('check_id'),[]))!=1:e+=['human-assertion']
 if not utc(o.get('created_at','')):e+=['created-at']
 for a in aa:
  if not utc(a.get('asserted_at','')) or (utc(o.get('created_at','')) and datetime.strptime(a['asserted_at'],'%Y-%m-%dT%H:%M:%SZ')>datetime.strptime(o['created_at'],'%Y-%m-%dT%H:%M:%SZ')):e+=['assertion-time']
 s=o.get('scope',{})
 if s.get('mode')=='single-system' and (s.get('portfolio_id') is not None or s.get('module_id')!='single-system'):e+=['scope']
 src=o.get('source',{})
 if src.get('source_snapshot_sha256')!=src.get('source_ssp_fingerprint'):e+=['source-snapshot']
 return e
def main():
 m=json.loads((FIX/'scenario_matrix.json').read_text());r=json.loads((FIX/m['bundle_zip']['registration_path']).read_text(),object_pairs_hook=dup);bad=[]
 if profile['sha256']!=ph:bad+=['profile sha']
 if (r['attachment_sha256'],r['attachment_size_bytes'])!=(m['bundle_zip']['sha256'],m['bundle_zip']['size_bytes']):bad+=['bundle registration']
 loaded={}
 for s in m['scenarios']:
  try:o=json.loads((FIX/s['sidecar']).read_text(),object_pairs_hook=dup)
  except Exception:
   if s['expected_structure']!='reject-duplicate-key':bad+=[s['sidecar']+': parse']
   continue
  loaded[s['sidecar']]=o;e=errors(o)
  if s['expected_structure']=='valid' and e:bad+=[s['sidecar']+': '+','.join(e)]
  if s['expected_structure'].startswith('reject') and not e:bad+=[s['sidecar']+': expected reject']
  if s.get('paired_fixture'):
   f=r[s['paired_fixture']];pe=[]
   if (o['artifact']['sha256'],o['artifact']['size_bytes'])!=(f['docx_sha256'],f['docx_size_bytes']):pe+=['artifact']
   if o['source']['word_export_manifest_sha256']!=f['word_export_manifest_sha256']:pe+=['manifest']
   exp=s['expected_pairing']
   if exp=='valid' and pe:bad+=[s['sidecar']+': pairing '+','.join(pe)]
   if exp=='reject-artifact-hash' and 'artifact' not in pe:bad+=[s['sidecar']+': missing artifact reject']
   if exp=='reject-manifest-hash' and 'manifest' not in pe:bad+=[s['sidecar']+': missing manifest reject']
 c=loaded['clean_current.json'];x=loaded['retry_superseding_current.json']
 if not(c['lineage']['lineage_key']==x['lineage']['lineage_key'] and x['lineage']['attempt_number']==2 and x['lineage']['supersedes_sidecar_id']==c['sidecar_id']):bad+=['retry chain']
 if bad:print('RG-4 frozen contract validation failed\n- '+'\n- '.join(bad));return 1
 print('RG-4 frozen contract validation passed');print('profile_sha256='+ph);print('bundle_sha256='+r['attachment_sha256']);return 0
if __name__=='__main__':raise SystemExit(main())
