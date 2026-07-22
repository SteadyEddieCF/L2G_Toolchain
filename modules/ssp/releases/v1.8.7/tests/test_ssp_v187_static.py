from __future__ import annotations
import hashlib,json,re,shutil,subprocess,tempfile
from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];RUNTIME=ROOT/'CMMC_L2_SSP_Modern_Editable_v1.8.7.html';RESULT=ROOT/'CMMC_L2_SSP_v1.8.7_Static_Regression.json';EXPECTED_RUNTIME_SHA='96736cd935d5d77fe32ec467e52aca6ea681545ce1eda8ea753a5fac543f6e4b'
class Inspector(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.external=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.append(a['id'])
  if tag=='script' and a.get('src'):self.external.append(a['src'])
  if tag=='link' and a.get('href'):self.external.append(a['href'])
checks=[]
def ck(name,ok,detail=''):
 checks.append({'name':name,'passed':bool(ok),'detail':str(detail)})
 if not ok:raise AssertionError(f'{name}: {detail}')
text=RUNTIME.read_text();ins=Inspector();ins.feed(text)
ck('Identity is v1.8.7',all(x in text for x in ['Modern Editable v1.8.7</title>',"const APP_VERSION='1.8.7'","const SCHEMA='cmmc-l2-ssp-modern-v1.8.7'",'<span class="brand-version">v1.8.7</span>','<meta content="1.8.7" name="application-version"/>']))
ck('v1.8.6 migration namespaces retained',all(x in text for x in ['cmmc-l2-ssp-modern-v1.8.6','cmmc-l2-ssp-modern-v1.8.6-images','cmmc-l2-ssp-modern-v1.8.6-word-review-queue','cmmc-l2-ssp-modern-v1.8.6-portfolio-rollback']))
ck('110 requirements retained',text.count('<article class="control-card"')==110,text.count('<article class="control-card"'))
ck('No duplicate IDs',len(ins.ids)==len(set(ins.ids)),len(ins.ids)-len(set(ins.ids)))
ck('Offline single-file runtime',not ins.external,ins.external)
ck('No telemetry',not re.search(r'google-analytics|mixpanel|segment\.io|telemetry',text,re.I))
ck('Single-System remains default','Single-System remains the default' in text)
ck('Portfolio schema 1.7.0',"PORTFOLIO_SCHEMA_VERSION='1.7.0'" in text)
ck('Baseline collections exist',all(x in text for x in ['approvedBaselines','baselineEvents']))
ck('Immutable baseline UI exists',all(x in text for x in ['portfolioBaselineCenter','portfolioBaselineCreateBtn','portfolioBaselineCompareBtn','portfolioBaselineRestoreBtn','portfolioBaselineList']))
ck('Baseline functions exist',all(x in text for x in ['function portfolioBaselineCreate','function portfolioBaselineCompare','function portfolioBaselineRestore','function portfolioBaselineBlockingConflicts','function portfolioBaselineStatus']))
ck('Append-only events represented',all(x in text for x in ["eventType:'created'","eventType:'superseded'","eventType:'restored'"]))
ck('No baseline edit or delete operation','portfolioBaselineDelete' not in text and 'portfolioBaselineEdit' not in text)
ck('Conflict gate and authorized exception exist',all(x in text for x in ['blocking conflict','portfolioBaselineHasAuthorizedException','authorizedBy']))
ck('Fresh approval gate exists','A fresh formal approval is required before baseline creation.' in text)
ck('Restoration requires administrator','An active administrator assignment is required for restoration.' in text)
ck('Restoration is a new version',all(x in text for x in ['portfolioBaselineNextVersion','baseline-restored-as-new-version','Restore as new working version']))
ck('Baseline package contracts exist',all(x in text for x in ["PORTFOLIO_BASELINE_KIND='cmmc_l2_ssp_named_baseline_v1'","PORTFOLIO_BASELINE_VERSION='1.7'","PORTFOLIO_BASELINE_COMPARISON_KIND='cmmc_l2_ssp_baseline_comparison_v1'"]))
ck('Deterministic fingerprint boundary explicit',all(x in text for x in ['deterministic integrity fingerprint','not a digital signature']))
ck('No automated assessment conclusion','assessmentConclusion' not in text)
ck('Stable prior contracts remain',all(x in text for x in ["L2G_HANDOFF_KIND='l2g_ssp_handoff_v1'","L2G_RETURN_KIND='l2g_ssp_return_package_v1'","WORD_REVIEW_FORMAT='cmmc-l2-ssp-word-review-v1'","PORTFOLIO_EXCHANGE_KIND='cmmc_l2_ssp_portfolio_exchange_v1'","PORTFOLIO_REVIEW_REGISTER_KIND='cmmc_l2_ssp_review_approval_register_v1'"]))
model=json.loads(re.search(r'<script id="sspModel" type="application/json">(.*?)</script>',text,re.S).group(1));model_digest=hashlib.sha256(json.dumps(model,sort_keys=True,separators=(',',':')).encode()).hexdigest();ck('Authoritative model unchanged',model_digest=='4df2ab56d81cacf313a1b7baefb968de43eb50701c258d503e9a0e841bfb72f3',model_digest)
app=text[text.rfind('<script>')+8:text.rfind('</script>')]
with tempfile.NamedTemporaryFile('w',suffix='.js') as f:
 f.write(app);f.flush();p=subprocess.run(['node','--check',f.name],capture_output=True,text=True)
ck('JavaScript syntax passes',p.returncode==0,p.stderr[:300])
ck('No local workspace path','/workspace/' not in text and 'C:\\Users\\' not in text and '/mnt/data/' not in text)
runtime_digest=hashlib.sha256(RUNTIME.read_bytes()).hexdigest();ck('Runtime hash matches governed release',runtime_digest==EXPECTED_RUNTIME_SHA,runtime_digest)
with tempfile.TemporaryDirectory() as td:
 release=Path(td)/'CMMC_L2_SSP_v1.8.7';shutil.copytree(ROOT,release);output=release/RUNTIME.name;output.unlink();p=subprocess.run(['python',str(release/'materialize.py')],capture_output=True,text=True);ck('Extracted-package materialization passes',p.returncode==0 and output.exists() and hashlib.sha256(output.read_bytes()).hexdigest()==EXPECTED_RUNTIME_SHA,p.stderr or p.stdout)
result={'release':'v1.8.7','suite':'static-immutable-baseline-regression','status':'passed','passed':len(checks),'total':len(checks),'runtime_sha256':runtime_digest,'requirement_model_sha256':model_digest,'checks':checks}
RESULT.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({'passed':len(checks),'total':len(checks),'runtime_sha256':runtime_digest}))
