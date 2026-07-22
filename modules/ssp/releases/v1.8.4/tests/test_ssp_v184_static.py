from __future__ import annotations
import hashlib,json,re,shutil,subprocess,tempfile
from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
RUNTIME=ROOT/'CMMC_L2_SSP_Modern_Editable_v1.8.4.html'
RESULT=ROOT/'CMMC_L2_SSP_v1.8.4_Static_Regression.json'
EXPECTED_RUNTIME_SHA='976251ec10d227844a7b1b4f8131f9dbcb17e2ebb1aa31c5296d711274aeeb6b'
class Inspector(HTMLParser):
 def __init__(self): super().__init__(); self.ids=[]; self.external=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'): self.ids.append(a['id'])
  if tag=='script' and a.get('src'): self.external.append(a['src'])
  if tag=='link' and a.get('href'): self.external.append(a['href'])
checks=[]
def ck(name,ok,detail=''):
 checks.append({'name':name,'passed':bool(ok),'detail':str(detail)})
 if not ok: raise AssertionError(f'{name}: {detail}')
text=RUNTIME.read_text(); ins=Inspector(); ins.feed(text)
ck('Identity is v1.8.4',all(x in text for x in ['Modern Editable v1.8.4</title>',"const APP_VERSION='1.8.4'","const SCHEMA='cmmc-l2-ssp-modern-v1.8.4'"]))
ck('v1.8.3 migration namespaces retained',all(x in text for x in ['cmmc-l2-ssp-modern-v1.8.3','cmmc-l2-ssp-modern-v1.8.3-images','cmmc-l2-ssp-modern-v1.8.3-word-review-queue','cmmc-l2-ssp-modern-v1.8.3-portfolio-rollback']))
ck('110 requirements retained',text.count('<article class="control-card"')==110,text.count('<article class="control-card"'))
ck('No duplicate IDs',len(ins.ids)==len(set(ins.ids)),len(ins.ids)-len(set(ins.ids)))
ck('Offline single-file runtime',not ins.external,ins.external)
ck('No telemetry',not re.search(r'google-analytics|mixpanel|segment\.io|telemetry',text,re.I))
ck('Single-System remains default','Single-System remains the default' in text)
ck('Portfolio schema 1.4.0',"PORTFOLIO_SCHEMA_VERSION='1.4.0'" in text)
ck('CRM workbench and filters exist',all(x in text for x in ['id="portfolioCrmCenter"','id="portfolioCrmFilterModule"','id="portfolioCrmFilterFamily"','id="portfolioCrmFilterOwner"','id="portfolioCrmFilterConflict"']))
ck('Consolidated and selected-module exports exist',all(x in text for x in ['portfolioCrmExportConsolidatedBtn','portfolioCrmExportModuleBtn','function portfolioExportCrm']))
ck('Derived provenance and counting exist',all(x in text for x in ['function portfolioCrmResolveSource','function portfolioCrmClassification','function portfolioCrmCountingDisposition','function portfolioCrmEvidenceDisposition']))
ck('Safe-only reconciliation exists',all(x in text for x in ['function portfolioAnalyzeCrmImport','function portfolioApplyCrmReconciliation','Only non-conflicting rows can be applied automatically']))
ck('CRM reconciliation history is schema-backed',all(x in text for x in ['crmReconciliations','crmSourceIdentifiers','crmLegacyIdentifiers']))
ck('Delivered CRM is not described as future work','consolidated CRM, and portfolio reporting remain later releases' not in text)
ck('No automated assessment conclusion','assessmentConclusion' not in text)
ck('Stable handoff/return/Word Review contracts',all(x in text for x in ["L2G_HANDOFF_KIND='l2g_ssp_handoff_v1'","L2G_RETURN_KIND='l2g_ssp_return_package_v1'","WORD_REVIEW_FORMAT='cmmc-l2-ssp-word-review-v1'"]))
model=json.loads(re.search(r'<script id="sspModel" type="application/json">(.*?)</script>',text,re.S).group(1)); digest=hashlib.sha256(json.dumps(model,sort_keys=True,separators=(',',':')).encode()).hexdigest()
ck('Authoritative model unchanged',digest=='4df2ab56d81cacf313a1b7baefb968de43eb50701c258d503e9a0e841bfb72f3',digest)
app=text[text.rfind('<script>')+8:text.rfind('</script>')]
with tempfile.NamedTemporaryFile('w',suffix='.js') as f:
 f.write(app); f.flush(); p=subprocess.run(['node','--check',f.name],capture_output=True,text=True)
ck('JavaScript syntax passes',p.returncode==0,p.stderr[:300])
ck('Runtime hash matches governed manifest',hashlib.sha256(RUNTIME.read_bytes()).hexdigest()==EXPECTED_RUNTIME_SHA)
with tempfile.TemporaryDirectory() as td:
 release=Path(td)/'releases'/'v1.8.4'; (release/'source').mkdir(parents=True)
 for rel in ['materialize.py','source/runtime-v1.8.3-to-v1.8.4.patch.gz.b64']:
  source=ROOT/rel; target=release/rel; target.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(source,target)
 bundle_parts=sorted((ROOT/'source').glob('release-source-v1.8.4.tar.gz.b64.part-*'))
 for source in bundle_parts:
  shutil.copy2(source,release/'source'/source.name)
 package_base=ROOT/'source'/'CMMC_L2_SSP_Modern_Editable_v1.8.3.html'
 repository_release=ROOT.parent/'v1.8.3'
 repository_base=repository_release/'CMMC_L2_SSP_Modern_Editable_v1.8.3.html'
 baseline=package_base if package_base.exists() else repository_base
 if bundle_parts:
  temp_base=release.parent/'v1.8.3'; (temp_base/'fixtures').mkdir(parents=True)
  shutil.copy2(baseline,temp_base/'CMMC_L2_SSP_Modern_Editable_v1.8.3.html')
  for source in (repository_release/'fixtures').glob('*.json'): shutil.copy2(source,temp_base/'fixtures'/source.name)
 else:
  target_base=release/'source'/'CMMC_L2_SSP_Modern_Editable_v1.8.3.html'; shutil.copy2(baseline,target_base)
 p=subprocess.run(['python',str(release/'materialize.py')],capture_output=True,text=True)
 out=release/'CMMC_L2_SSP_Modern_Editable_v1.8.4.html'
 ck('Extracted-package materialization passes',p.returncode==0 and out.exists() and hashlib.sha256(out.read_bytes()).hexdigest()==EXPECTED_RUNTIME_SHA,p.stderr or p.stdout)
ck('No local workspace path','/workspace/' not in text and 'C:\\Users\\' not in text)
result={'release':'v1.8.4','suite':'static-crm-regression','status':'passed','passed':len(checks),'total':len(checks),'runtime_sha256':hashlib.sha256(RUNTIME.read_bytes()).hexdigest(),'requirement_model_sha256':digest,'checks':checks}
RESULT.write_text(json.dumps(result,indent=2)+'\n'); print(json.dumps({'passed':len(checks),'total':len(checks)}))
