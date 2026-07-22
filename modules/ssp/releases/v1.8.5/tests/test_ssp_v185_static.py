from __future__ import annotations
import hashlib,json,re,shutil,subprocess,tempfile
from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
RUNTIME=ROOT/'CMMC_L2_SSP_Modern_Editable_v1.8.5.html'
RESULT=ROOT/'CMMC_L2_SSP_v1.8.5_Static_Regression.json'
EXPECTED_RUNTIME_SHA='4fb6eea6a95cbc311a6f6b008a7733590d88e275c61b74aa8b0b73be1802131a'
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
text=RUNTIME.read_text(encoding='utf-8'); ins=Inspector(); ins.feed(text)
ck('Identity is v1.8.5',all(x in text for x in ['Modern Editable v1.8.5</title>',"const APP_VERSION='1.8.5'","const SCHEMA='cmmc-l2-ssp-modern-v1.8.5'"]))
ck('v1.8.4 migration namespaces retained',all(x in text for x in ['cmmc-l2-ssp-modern-v1.8.4','cmmc-l2-ssp-modern-v1.8.4-images','cmmc-l2-ssp-modern-v1.8.4-word-review-queue','cmmc-l2-ssp-modern-v1.8.4-portfolio-rollback']))
ck('110 requirements retained',text.count('<article class="control-card"')==110,text.count('<article class="control-card"'))
ck('No duplicate IDs',len(ins.ids)==len(set(ins.ids)),len(ins.ids)-len(set(ins.ids)))
ck('Offline single-file runtime',not ins.external,ins.external)
ck('No telemetry',not re.search(r'google-analytics|mixpanel|segment\.io|telemetry',text,re.I))
ck('Single-System remains default','Single-System remains the default' in text)
ck('Portfolio schema 1.5.0',"PORTFOLIO_SCHEMA_VERSION='1.5.0'" in text)
ck('Portfolio and module exchange contracts exist',all(x in text for x in ["PORTFOLIO_EXCHANGE_KIND='cmmc_l2_ssp_portfolio_exchange_v1'","MODULE_EXCHANGE_KIND='cmmc_l2_ssp_module_exchange_v1'","SSP_EXCHANGE_VERSION='1.5'"]))
ck('Exchange workbench controls exist',all(x in text for x in ['portfolioExchangeImportFile','portfolioExchangeReport','portfolioExchangeApplyBtn','portfolioExportModuleWordBtn','portfolioImportModuleWordFile','portfolioModuleWordQueueBtn']))
ck('Exchange build, validation, preview, and application exist',all(x in text for x in ['function portfolioBuildPortfolioExchange','function portfolioBuildModuleExchange','function portfolioExchangeValidatePackage','function portfolioAnalyzeExchangePackage','function portfolioApplyExchangeReport']))
ck('Safe-only merge protections exist',all(x in text for x in ['Only empty or default editable values can be applied automatically.','Existing governed target values are preserved during reconciliation.','Cross-portfolio identities fail closed']))
ck('Protected identity enforcement exists',all(x in text for x in ['Module hierarchy and type are protected.','Stable requirement record identity is protected.','Inheritance source identity is protected.','PORTFOLIO_EXCHANGE_EDITABLE_MODULE_FIELDS','PORTFOLIO_EXCHANGE_EDITABLE_REQUIREMENT_FIELDS']))
ck('Exchange history is schema-backed','exchangeHistory' in text)
ck('Module Word queues are schema-backed','moduleWordReviewQueues' in text)
ck('Requirement reviewer notes are schema-backed','reviewerNotes' in text)
ck('Module Word package has protected manifest identity',all(x in text for x in ["MODULE_WORD_REVIEW_SCOPE='module'",'reviewScope:MODULE_WORD_REVIEW_SCOPE','portfolioId:portfolioState.portfolio.portfolioId','moduleId,moduleName:module.name','sourceFingerprint']))
ck('Module Word tags are module-scoped',all(x in text for x in ['function portfolioModuleWordParseTag','`module:${moduleId}:meta:${field}`','`module:${moduleId}:requirement:${id}:${field}`']))
ck('Reviewed module Word changes are queued',all(x in text for x in ['function importModuleWordReview','Nothing was applied automatically','portfolioState.moduleWordReviewQueues[queue.moduleId]']))
ck('No automated assessment conclusion','assessmentConclusion' not in text)
ck('Stable handoff/return/Word Review contracts',all(x in text for x in ["L2G_HANDOFF_KIND='l2g_ssp_handoff_v1'","L2G_RETURN_KIND='l2g_ssp_return_package_v1'","WORD_REVIEW_FORMAT='cmmc-l2-ssp-word-review-v1'"]))
model=json.loads(re.search(r'<script id="sspModel" type="application/json">(.*?)</script>',text,re.S).group(1)); model_digest=hashlib.sha256(json.dumps(model,sort_keys=True,separators=(',',':')).encode()).hexdigest()
ck('Authoritative model unchanged',model_digest=='4df2ab56d81cacf313a1b7baefb968de43eb50701c258d503e9a0e841bfb72f3',model_digest)
app=text[text.rfind('<script>')+8:text.rfind('</script>')]
with tempfile.NamedTemporaryFile('w',suffix='.js') as f:
 f.write(app); f.flush(); p=subprocess.run(['node','--check',f.name],capture_output=True,text=True)
ck('JavaScript syntax passes',p.returncode==0,p.stderr[:300])
runtime_digest=hashlib.sha256(RUNTIME.read_bytes()).hexdigest()
ck('Runtime hash matches governed manifest',runtime_digest==EXPECTED_RUNTIME_SHA,runtime_digest)
with tempfile.TemporaryDirectory() as td:
 release=Path(td)/'releases'/'v1.8.5'; shutil.copytree(ROOT,release)
 repository_release=ROOT.parent/'v1.8.4'
 if repository_release.exists():
  shutil.copytree(repository_release,release.parent/'v1.8.4')
 output=release/'CMMC_L2_SSP_Modern_Editable_v1.8.5.html'; output.unlink()
 p=subprocess.run(['python',str(release/'materialize.py')],capture_output=True,text=True)
 ck('Extracted-package materialization passes',p.returncode==0 and output.exists() and hashlib.sha256(output.read_bytes()).hexdigest()==EXPECTED_RUNTIME_SHA,p.stderr or p.stdout)
ck('No local workspace path','/workspace/' not in text and 'C:\\Users\\' not in text and '/mnt/data/' not in text)
result={'release':'v1.8.5','suite':'static-exchange-regression','status':'passed','passed':len(checks),'total':len(checks),'runtime_sha256':runtime_digest,'requirement_model_sha256':model_digest,'checks':checks}
RESULT.write_text(json.dumps(result,indent=2)+'\n'); print(json.dumps({'passed':len(checks),'total':len(checks),'runtime_sha256':runtime_digest}))
