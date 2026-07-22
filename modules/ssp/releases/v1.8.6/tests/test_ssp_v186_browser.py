from __future__ import annotations
import json
from pathlib import Path
from playwright.sync_api import Error as PlaywrightError, sync_playwright
ROOT=Path(__file__).resolve().parents[1];RUNTIME=ROOT/'CMMC_L2_SSP_Modern_Editable_v1.8.6.html';FIX=ROOT/'fixtures'
fixture=json.loads((FIX/'Portfolio_CRM_McFirecoal_v1.8.6.json').read_text());errors=[]
with sync_playwright() as pw:
 executable='/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else None
 browser=pw.chromium.launch(headless=True,executable_path=executable,args=['--no-sandbox'])
 context=browser.new_context(accept_downloads=True,viewport={'width':1600,'height':1100});page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
 file_url_smoke=True
 try:page.goto(RUNTIME.as_uri(),wait_until='load')
 except PlaywrightError as error:
  if 'ERR_BLOCKED_BY_ADMINISTRATOR' not in str(error):raise
  file_url_smoke='blocked-by-local-browser-policy';page.close();page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(RUNTIME.read_text(),wait_until='load')
 data=page.evaluate('()=>window.__sspTestHooks.collectData(true)');data['portfolioFoundation']=fixture;page.evaluate('(d)=>window.__sspTestHooks.applyData(d)',data)
 hooks=page.evaluate('()=>Object.keys(window.__sspTestHooks)')
 required=['portfolioReviewAssignRole','portfolioReviewCreateSubmission','portfolioReviewRecordDisposition','portfolioReviewApproveSubmission','portfolioReviewRevokeApproval','portfolioReviewStatus']
 assert all(x in hooks for x in required)
 anchor=page.evaluate('()=>{const d=window.__sspTestHooks.collectData(false);return {fields:d.fields,statuses:d.statuses,reviewerStatuses:d.reviewerStatuses,tables:d.tables}}')
 state=fixture;admin={'person':'Alice Admin','role':'administrator'}
 r=page.evaluate('([s,t,a])=>window.__sspTestHooks.portfolioReviewAssignRole(s,t,a)',[state,{'person':'Alice Admin','role':'administrator','scope':'portfolio','moduleId':''},admin]);state=r['state'];assert r['created']
 assignments=[]
 for person,role in [('Bob Author','author'),('Carol Reviewer','reviewer'),('Dave Approver','approver')]:
  r=page.evaluate('([s,t,a])=>window.__sspTestHooks.portfolioReviewAssignRole(s,t,a)',[state,{'person':person,'role':role,'scope':'module','moduleId':'module-product-alpha'},admin]);state=r['state'];assignments.append(r['assignment'])
 incompatible_rejected=page.evaluate('([s,t,a])=>{try{window.__sspTestHooks.portfolioReviewAssignRole(s,t,a);return false}catch(e){return /incompatible/i.test(e.message)}}',[state,{'person':'Bob Author','role':'reviewer','scope':'module','moduleId':'module-product-alpha'},admin]);assert incompatible_rejected
 r=page.evaluate('([s,q,a])=>window.__sspTestHooks.portfolioReviewCreateSubmission(s,q,a)',[state,{'person':'Bob Author','scope':'module','moduleId':'module-product-alpha','message':'Initial module review'},anchor]);state=r['state'];first=r['submission'];assert first['state']=='submitted'
 changes=page.evaluate('([s,id,a])=>window.__sspTestHooks.portfolioReviewRecordDisposition(s,id,{person:"Carol Reviewer",role:"reviewer"},"changes-requested","Clarify inherited responsibilities.",a)',[state,first['submissionId'],anchor]);state=changes['state'];assert changes['submission']['state']=='changes-requested'
 r=page.evaluate('([s,q,a])=>window.__sspTestHooks.portfolioReviewCreateSubmission(s,q,a)',[state,{'person':'Bob Author','scope':'module','moduleId':'module-product-alpha','message':'Updated review round'},anchor]);state=r['state'];second=r['submission'];assert second['round']==2
 ready=page.evaluate('([s,id,a])=>window.__sspTestHooks.portfolioReviewRecordDisposition(s,id,{person:"Carol Reviewer",role:"reviewer"},"ready-for-approval","Review complete.",a)',[state,second['submissionId'],anchor]);state=ready['state'];assert ready['submission']['state']=='ready-for-approval'
 reviewer_approval_rejected=page.evaluate('([s,id,a])=>{try{window.__sspTestHooks.portfolioReviewApproveSubmission(s,id,{person:"Carol Reviewer",role:"approver"},"",a);return false}catch(e){return /approver assignment|Segregation/i.test(e.message)}}',[state,second['submissionId'],anchor]);assert reviewer_approval_rejected
 approved=page.evaluate('([s,id,a])=>window.__sspTestHooks.portfolioReviewApproveSubmission(s,id,{person:"Dave Approver",role:"approver"},"Approved for controlled authoring use.",a)',[state,second['submissionId'],anchor]);state=approved['state'];approval=approved['approval']
 status=page.evaluate('([s,a])=>window.__sspTestHooks.portfolioReviewStatus(s,"module","module-product-alpha",a)',[state,anchor]);assert status['state']=='approved'
 changed=json.loads(json.dumps(state));next(r for r in changed['moduleRequirements'] if r['moduleId']=='module-product-alpha' and r['requirementId']=='3.1.1')['scope']='Controlled scope changed after approval.'
 stale=page.evaluate('([s,a])=>window.__sspTestHooks.portfolioReviewStatus(s,"module","module-product-alpha",a)',[changed,anchor]);assert stale['state']=='stale'
 revoked=page.evaluate('([s,id])=>window.__sspTestHooks.portfolioReviewRevokeApproval(s,id,{person:"Alice Admin",role:"administrator"},"Content changed and requires a new review round.")',[state,approval['approvalId']]);assert revoked['approval']['status']=='revoked' and revoked['approval']['revocationReason']
 # Apply approved state to render and export register.
 current=page.evaluate('()=>window.__sspTestHooks.collectData(true)');current['portfolioFoundation']=state;page.evaluate('(d)=>window.__sspTestHooks.applyData(d)',current);page.eval_on_selector('#portfolioSetupBtn','e=>e.click()');page.wait_for_selector('#portfolioModal:not([hidden])');page.locator('#portfolioReviewCenter').scroll_into_view_if_needed()
 assert page.locator('#portfolioReviewAssignments .portfolio-review-row').count()==4
 assert 'review round 2' in page.locator('#portfolioReviewHistory').inner_text()
 with page.expect_download() as event:page.click('#portfolioReviewExportBtn')
 register_path=Path(event.value.path());register=json.loads(register_path.read_text());assert register['package_kind']=='cmmc_l2_ssp_review_approval_register_v1' and register['package_version']=='1.6' and register['register_fingerprint']
 screenshot=ROOT/'CMMC_L2_SSP_v1.8.6_Formal_Review_Workbench.png';page.screenshot(path=str(screenshot),full_page=False)
 title=page.title();controls=page.locator('.control-card').count();context.close();browser.close()
assert not errors,errors
result={'release':'v1.8.6','suite':'browser-formal-review-regression','status':'passed','fileUrlSmoke':file_url_smoke,'title':title,'controls':controls,'roles':len(assignments)+1,'submissions':2,'dispositions':2,'approval':{'id':approval['approvalId'],'freshState':status['state'],'changedState':stale['state'],'revokedState':revoked['approval']['status']},'negative':{'incompatibleAssignmentRejected':incompatible_rejected,'reviewerApprovalRejected':reviewer_approval_rejected},'registerFingerprint':register['register_fingerprint'],'pageErrors':errors,'screenshot':screenshot.name}
(ROOT/'CMMC_L2_SSP_v1.8.6_Runtime_Regression.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
