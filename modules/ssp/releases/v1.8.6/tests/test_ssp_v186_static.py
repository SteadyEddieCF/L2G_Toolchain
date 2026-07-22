from __future__ import annotations
import hashlib,json,re,shutil,subprocess,tempfile
from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];RUNTIME=ROOT/'CMMC_L2_SSP_Modern_Editable_v1.8.6.html';RESULT=ROOT/'CMMC_L2_SSP_v1.8.6_Static_Regression.json';EXPECTED_RUNTIME_SHA='a9f872d7e3f0e9dd8515ac34a784086d536306cd00d0768066f657025c82f630'
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
ck('Identity is v1.8.6',all(x in text for x in ['Modern Editable v1.8.6</title>',"const APP_VERSION='1.8.6'","const SCHEMA='cmmc-l2-ssp-modern-v1.8.6'",'<span class="brand-version">v1.8.6</span>']))
ck('v1.8.5 migration namespaces retained',all(x in text for x in ['cmmc-l2-ssp-modern-v1.8.5','cmmc-l2-ssp-modern-v1.8.5-images','cmmc-l2-ssp-modern-v1.8.5-word-review-queue','cmmc-l2-ssp-modern-v1.8.5-portfolio-rollback']))
ck('110 requirements retained',text.count('<article class="control-card"')==110,text.count('<article class="control-card"'))
ck('No duplicate IDs',len(ins.ids)==len(set(ins.ids)),len(ins.ids)-len(set(ins.ids)))
ck('Offline single-file runtime',not ins.external,ins.external)
ck('No telemetry',not re.search(r'google-analytics|mixpanel|segment\.io|telemetry',text,re.I))
ck('Single-System remains default','Single-System remains the default' in text)
ck('Portfolio schema 1.6.0',"PORTFOLIO_SCHEMA_VERSION='1.6.0'" in text)
ck('Formal review collections exist',all(x in text for x in ['reviewRoleAssignments','reviewSubmissions','reviewDispositions','approvalRecords']))
ck('Formal review UI exists',all(x in text for x in ['portfolioReviewCenter','portfolioReviewActorName','portfolioReviewSubmitBtn','portfolioReviewDispositionBtn','portfolioReviewApproveBtn','portfolioReviewRevokeBtn']))
ck('Role-aware functions exist',all(x in text for x in ['function portfolioReviewAssignRole','function portfolioReviewCreateSubmission','function portfolioReviewRecordDisposition','function portfolioReviewApproveSubmission','function portfolioReviewRevokeApproval']))
ck('Segregation of duties enforced',text.count('Segregation of duties')>=2)
ck('Fingerprint-bound approval exists',all(x in text for x in ['portfolioReviewFingerprint','sourceFingerprint','Approval stale']))
ck('Review register contract exists',all(x in text for x in ["PORTFOLIO_REVIEW_REGISTER_KIND='cmmc_l2_ssp_review_approval_register_v1'","PORTFOLIO_REVIEW_VERSION='1.6'",'register_fingerprint']))
ck('Approval boundary is explicit',all(x in text for x in ['not authentication or assessment','does not contain assessment findings','not an assessment conclusion']))
ck('No automated assessment conclusion','assessmentConclusion' not in text)
ck('Stable prior contracts remain',all(x in text for x in ["L2G_HANDOFF_KIND='l2g_ssp_handoff_v1'","L2G_RETURN_KIND='l2g_ssp_return_package_v1'","WORD_REVIEW_FORMAT='cmmc-l2-ssp-word-review-v1'","PORTFOLIO_EXCHANGE_KIND='cmmc_l2_ssp_portfolio_exchange_v1'"]))
model=json.loads(re.search(r'<script id="sspModel" type="application/json">(.*?)</script>',text,re.S).group(1));model_digest=hashlib.sha256(json.dumps(model,sort_keys=True,separators=(',',':')).encode()).hexdigest();ck('Authoritative model unchanged',model_digest=='4df2ab56d81cacf313a1b7baefb968de43eb50701c258d503e9a0e841bfb72f3',model_digest)
app=text[text.rfind('<script>')+8:text.rfind('</script>')]
with tempfile.NamedTemporaryFile('w',suffix='.js') as f:
 f.write(app);f.flush();p=subprocess.run(['node','--check',f.name],capture_output=True,text=True)
ck('JavaScript syntax passes',p.returncode==0,p.stderr[:300])
ck('No local workspace path','/workspace/' not in text and 'C:\\Users\\' not in text and '/mnt/data/' not in text)
runtime_digest=hashlib.sha256(RUNTIME.read_bytes()).hexdigest();ck('Runtime hash matches governed release',runtime_digest==EXPECTED_RUNTIME_SHA,runtime_digest)
with tempfile.TemporaryDirectory() as td:
 release=Path(td)/'CMMC_L2_SSP_v1.8.6';shutil.copytree(ROOT,release);output=release/RUNTIME.name;output.unlink();p=subprocess.run(['python',str(release/'materialize.py')],capture_output=True,text=True);ck('Extracted-package materialization passes',p.returncode==0 and output.exists() and hashlib.sha256(output.read_bytes()).hexdigest()==EXPECTED_RUNTIME_SHA,p.stderr or p.stdout)
result={'release':'v1.8.6','suite':'static-formal-review-regression','status':'passed','passed':len(checks),'total':len(checks),'runtime_sha256':runtime_digest,'requirement_model_sha256':model_digest,'checks':checks}
RESULT.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({'passed':len(checks),'total':len(checks),'runtime_sha256':runtime_digest}))
