from __future__ import annotations
import json
from pathlib import Path
from playwright.sync_api import Error as PlaywrightError, sync_playwright
ROOT=Path(__file__).resolve().parents[1];RUNTIME=ROOT/'CMMC_L2_SSP_Modern_Editable_v1.8.7.html';FIX=ROOT/'fixtures'
fixture=json.loads((FIX/'Portfolio_CRM_McFirecoal_v1.8.7.json').read_text());errors=[]
with sync_playwright() as pw:
 executable='/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else None
 browser=pw.chromium.launch(headless=True,executable_path=executable,args=['--no-sandbox'])
 context=browser.new_context(accept_downloads=True,viewport={'width':1700,'height':1150});page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
 file_url_smoke=True
 try:page.goto(RUNTIME.as_uri(),wait_until='load')
 except PlaywrightError as error:
  if 'ERR_BLOCKED_BY_ADMINISTRATOR' not in str(error):raise
  file_url_smoke='blocked-by-local-browser-policy';page.close();page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(RUNTIME.read_text(),wait_until='load')
 data=page.evaluate('()=>window.__sspTestHooks.collectData(true)');data['portfolioFoundation']=fixture;page.evaluate('(d)=>window.__sspTestHooks.applyData(d)',data)
 hooks=page.evaluate('()=>Object.keys(window.__sspTestHooks)')
 required=['portfolioReviewAssignRole','portfolioReviewCreateSubmission','portfolioReviewRecordDisposition','portfolioReviewApproveSubmission','portfolioReviewStatus','portfolioBaselineBlockingConflicts','portfolioBaselineCreate','portfolioBaselineCompare','portfolioBaselineRestore','portfolioBaselineStatus']
 assert all(x in hooks for x in required)
 anchor=page.evaluate('()=>{const d=window.__sspTestHooks.collectData(false);return {fields:d.fields,statuses:d.statuses,reviewerStatuses:d.reviewerStatuses,tables:d.tables}}')
 state=fixture;admin={'person':'Alice Admin','role':'administrator'}
 r=page.evaluate('([s,t,a])=>window.__sspTestHooks.portfolioReviewAssignRole(s,t,a)',[state,{'person':'Alice Admin','role':'administrator','scope':'portfolio','moduleId':''},admin]);state=r['state'];assert r['created']
 # Product Alpha review roles and fresh approval.
 for person,role in [('Bob Author','author'),('Carol Reviewer','reviewer'),('Dave Approver','approver')]:
  r=page.evaluate('([s,t,a])=>window.__sspTestHooks.portfolioReviewAssignRole(s,t,a)',[state,{'person':person,'role':role,'scope':'module','moduleId':'module-product-alpha'},admin]);state=r['state']
 r=page.evaluate('([s,q,a])=>window.__sspTestHooks.portfolioReviewCreateSubmission(s,q,a)',[state,{'person':'Bob Author','scope':'module','moduleId':'module-product-alpha','message':'Baseline review round one'},anchor]);state=r['state'];submission=r['submission']
 r=page.evaluate('([s,id,a])=>window.__sspTestHooks.portfolioReviewRecordDisposition(s,id,{person:"Carol Reviewer",role:"reviewer"},"ready-for-approval","Ready for immutable baseline.",a)',[state,submission['submissionId'],anchor]);state=r['state']
 r=page.evaluate('([s,id,a])=>window.__sspTestHooks.portfolioReviewApproveSubmission(s,id,{person:"Dave Approver",role:"approver"},"Approved authoring scope.",a)',[state,submission['submissionId'],anchor]);state=r['state'];approval1=r['approval']
 first=page.evaluate('([s,a])=>window.__sspTestHooks.portfolioBaselineCreate(s,{scope:"module",moduleId:"module-product-alpha",name:"Product Alpha Baseline",baselineVersion:"1.0",description:"Initial immutable snapshot",releaseNotes:"Initial baseline"},{person:"Dave Approver",role:"approver"},a)',[state,anchor]);state=first['state'];baseline1=first['baseline'];assert baseline1['approvalId']==approval1['approvalId'] and baseline1['snapshotFingerprint'].startswith('fnv1a64-')
 assert page.evaluate('([s,id])=>window.__sspTestHooks.portfolioBaselineStatus(s,id)',[state,baseline1['baselineId']])=='active'
 duplicate_rejected=page.evaluate('([s,a])=>{try{window.__sspTestHooks.portfolioBaselineCreate(s,{scope:"module",moduleId:"module-product-alpha",name:"product alpha baseline",baselineVersion:"1.1"},{person:"Dave Approver"},a);return false}catch(e){return /unique/i.test(e.message)}}',[state,anchor]);assert duplicate_rejected
 # Change governed content, establish a second approval round, and supersede through an event.
 changed=json.loads(json.dumps(state));rec=next(x for x in changed['moduleRequirements'] if x['moduleId']=='module-product-alpha' and x['requirementId']=='3.1.1');rec['scope']='Scope changed for second baseline.'
 stale=page.evaluate('([s,a])=>window.__sspTestHooks.portfolioReviewStatus(s,"module","module-product-alpha",a)',[changed,anchor]);assert stale['state']=='stale'
 r=page.evaluate('([s,q,a])=>window.__sspTestHooks.portfolioReviewCreateSubmission(s,q,a)',[changed,{'person':'Bob Author','scope':'module','moduleId':'module-product-alpha','message':'Baseline review round two'},anchor]);changed=r['state'];submission2=r['submission']
 r=page.evaluate('([s,id,a])=>window.__sspTestHooks.portfolioReviewRecordDisposition(s,id,{person:"Carol Reviewer"},"ready-for-approval","Second baseline ready.",a)',[changed,submission2['submissionId'],anchor]);changed=r['state']
 r=page.evaluate('([s,id,a])=>window.__sspTestHooks.portfolioReviewApproveSubmission(s,id,{person:"Dave Approver"},"Second approved scope.",a)',[changed,submission2['submissionId'],anchor]);changed=r['state']
 second=page.evaluate('([s,a])=>window.__sspTestHooks.portfolioBaselineCreate(s,{scope:"module",moduleId:"module-product-alpha",name:"Product Alpha Baseline 2",baselineVersion:"1.1",description:"Updated snapshot",releaseNotes:"Scope update"},{person:"Dave Approver"},a)',[changed,anchor]);state=second['state'];baseline2=second['baseline'];assert second['supersededBaselineId']==baseline1['baselineId']
 assert page.evaluate('([s,id])=>window.__sspTestHooks.portfolioBaselineStatus(s,id)',[state,baseline1['baselineId']])=='superseded'
 comparison=page.evaluate('([s,a,b])=>window.__sspTestHooks.portfolioBaselineCompare(s,a,b)',[state,baseline1['baselineId'],baseline2['baselineId']]);assert comparison['summary']['total']>0 and comparison['comparison_fingerprint'].startswith('fnv1a64-')
 assert any('scope' in item['path'] for item in comparison['changes'])
 # Blocking conflict prevents a Product Bravo baseline even with fresh approval.
 for person,role in [('Eve Author','author'),('Frank Reviewer','reviewer'),('Grace Approver','approver')]:
  r=page.evaluate('([s,t,a])=>window.__sspTestHooks.portfolioReviewAssignRole(s,t,a)',[state,{'person':person,'role':role,'scope':'module','moduleId':'module-product-bravo'},admin]);state=r['state']
 r=page.evaluate('([s,q,a])=>window.__sspTestHooks.portfolioReviewCreateSubmission(s,q,a)',[state,{'person':'Eve Author','scope':'module','moduleId':'module-product-bravo','message':'Conflict gate test'},anchor]);state=r['state'];bravo_submission=r['submission']
 r=page.evaluate('([s,id,a])=>window.__sspTestHooks.portfolioReviewRecordDisposition(s,id,{person:"Frank Reviewer"},"ready-for-approval","Ready except conflict gate.",a)',[state,bravo_submission['submissionId'],anchor]);state=r['state']
 r=page.evaluate('([s,id,a])=>window.__sspTestHooks.portfolioReviewApproveSubmission(s,id,{person:"Grace Approver"},"Approved authoring content.",a)',[state,bravo_submission['submissionId'],anchor]);state=r['state']
 blockers=page.evaluate('s=>window.__sspTestHooks.portfolioBaselineBlockingConflicts(s,"module","module-product-bravo")',state);assert len(blockers)==1
 conflict_rejected=page.evaluate('([s,a])=>{try{window.__sspTestHooks.portfolioBaselineCreate(s,{scope:"module",moduleId:"module-product-bravo",name:"Blocked Baseline",baselineVersion:"1.0"},{person:"Grace Approver"},a);return false}catch(e){return /blocking conflict/i.test(e.message)}}',[state,anchor]);assert conflict_rejected
 exception={'exceptionId':'exception-approved-conflict-1','status':'active','conflictId':blockers[0]['conflictId'],'authorizedBy':'Alice Admin','authorizedAt':'2026-07-22T21:00:00Z','rationale':'Approved temporary authoring exception for baseline capture.'}
 excepted=json.loads(json.dumps(state));excepted['exceptions'].append(exception)
 allowed=page.evaluate('([s,a])=>window.__sspTestHooks.portfolioBaselineCreate(s,{scope:"module",moduleId:"module-product-bravo",name:"Excepted Bravo Baseline",baselineVersion:"1.0"},{person:"Grace Approver"},a)',[excepted,anchor]);state=allowed['state'];assert allowed['baseline']
 # Restore the first Alpha baseline into a new working version without rewriting history.
 before_count=len(state['approvedBaselines']);before_events=len(state['baselineEvents']);before_version=state['portfolio']['portfolioVersion']
 restored=page.evaluate('s=>window.__sspTestHooks.portfolioBaselineRestore(s,s.approvedBaselines[0].baselineId,{person:"Alice Admin",role:"administrator"},"Restore initial approved scope for controlled rework.")',state)
 restored_state=restored['state'];assert len(restored_state['approvedBaselines'])==before_count and len(restored_state['baselineEvents'])==before_events+1
 assert restored['restoration']['eventType']=='restored' and restored_state['portfolio']['portfolioVersion']!=before_version
 restored_scope=next(x for x in restored_state['moduleRequirements'] if x['moduleId']=='module-product-alpha' and x['requirementId']=='3.1.1')['scope'];assert restored_scope!= 'Scope changed for second baseline.'
 assert all(x['approvalStatus']=='not-submitted' for x in restored_state['moduleRequirements'] if x['moduleId']=='module-product-alpha')
 # Render final baseline center and export an immutable package.
 current=page.evaluate('()=>window.__sspTestHooks.collectData(true)');current['portfolioFoundation']=state;page.evaluate('(d)=>window.__sspTestHooks.applyData(d)',current);page.eval_on_selector('#portfolioSetupBtn','e=>e.click()');page.wait_for_selector('#portfolioModal:not([hidden])')
 page.fill('#portfolioReviewActorName','Alice Admin');page.select_option('#portfolioReviewActorRole','administrator');page.eval_on_selector('#portfolioReviewScope',"(e)=>{e.value='module:module-product-alpha';e.dispatchEvent(new Event('change',{bubbles:true}))}");page.locator('#portfolioBaselineCenter').scroll_into_view_if_needed()
 assert page.locator('#portfolioBaselineList .portfolio-baseline-row').count()==3
 page.select_option('#portfolioBaselineCompareLeft',baseline1['baselineId']);page.select_option('#portfolioBaselineCompareRight',baseline2['baselineId']);page.click('#portfolioBaselineCompareBtn');assert 'difference' in page.locator('#portfolioBaselineCompareSummary').inner_text()
 with page.expect_download() as event:page.click('#portfolioBaselineExportBtn')
 exported=json.loads(Path(event.value.path()).read_text());assert exported['package_kind']=='cmmc_l2_ssp_named_baseline_v1' and exported['package_version']=='1.7' and exported['package_fingerprint']
 screenshot=ROOT/'CMMC_L2_SSP_v1.8.7_Immutable_Baseline_Workbench.png';page.screenshot(path=str(screenshot),full_page=False)
 title=page.title();controls=page.locator('.control-card').count();context.close();browser.close()
assert not errors,errors
result={'release':'v1.8.7','suite':'browser-immutable-baseline-regression','status':'passed','fileUrlSmoke':file_url_smoke,'title':title,'controls':controls,'baselines':{'created':3,'firstStatus':'superseded','secondStatus':'active','comparisonDifferences':comparison['summary']['total']},'negative':{'duplicateNameRejected':duplicate_rejected,'blockingConflictRejected':conflict_rejected},'exceptionGate':{'blockingConflicts':len(blockers),'authorizedExceptionAllowed':True},'restoration':{'priorVersion':before_version,'newVersion':restored['restoration']['restoredAsPortfolioVersion'],'historyPreserved':len(restored_state['approvedBaselines'])==before_count},'pageErrors':errors,'screenshot':screenshot.name}
(ROOT/'CMMC_L2_SSP_v1.8.7_Runtime_Regression.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
