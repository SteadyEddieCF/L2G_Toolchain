from __future__ import annotations
import base64,json,re,tempfile,zipfile
from pathlib import Path
from playwright.sync_api import Error as PlaywrightError, sync_playwright
ROOT=Path(__file__).resolve().parents[1]; RUNTIME=ROOT/'CMMC_L2_SSP_Modern_Editable_v1.8.5.html'; FIX=ROOT/'fixtures'
fixture=json.loads((FIX/'Portfolio_CRM_McFirecoal_v1.8.5.json').read_text())
errors=[]
with sync_playwright() as pw:
 executable='/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else None
 browser=pw.chromium.launch(headless=True,executable_path=executable,args=['--no-sandbox'])
 context=browser.new_context(accept_downloads=True,viewport={'width':1600,'height':1100})
 page=context.new_page(); page.on('pageerror',lambda e:errors.append(str(e)))
 file_url_smoke=True
 try: page.goto(RUNTIME.as_uri(),wait_until='load')
 except PlaywrightError as error:
  if 'ERR_BLOCKED_BY_ADMINISTRATOR' not in str(error): raise
  file_url_smoke='blocked-by-local-browser-policy'; page.close(); page=context.new_page(); page.on('pageerror',lambda e:errors.append(str(e))); page.set_content(RUNTIME.read_text(),wait_until='load')
 data=page.evaluate('()=>window.__sspTestHooks.collectData(true)'); data['portfolioFoundation']=fixture; page.evaluate('(d)=>window.__sspTestHooks.applyData(d)',data)
 hooks=page.evaluate('()=>Object.keys(window.__sspTestHooks)')
 for name in ['portfolioBuildPortfolioExchange','portfolioBuildModuleExchange','portfolioExchangeValidatePackage','portfolioAnalyzeExchangePackage','portfolioApplyExchangeReport','buildModuleWordReview','portfolioModuleWordParseTag']: assert name in hooks
 portfolio_pkg=page.evaluate('()=>window.__sspTestHooks.portfolioBuildPortfolioExchange()')
 assert portfolio_pkg['package_kind']=='cmmc_l2_ssp_portfolio_exchange_v1' and portfolio_pkg['package_version']=='1.5'
 assert portfolio_pkg['record_counts']['modules']==4 and portfolio_pkg['record_counts']['moduleRequirements']==440
 assert page.evaluate('(p)=>window.__sspTestHooks.portfolioExchangeValidatePackage(p).package_kind',portfolio_pkg)=='cmmc_l2_ssp_portfolio_exchange_v1'
 module_pkg=page.evaluate("()=>window.__sspTestHooks.portfolioBuildModuleExchange('module-product-alpha')")
 assert module_pkg['package_kind']=='cmmc_l2_ssp_module_exchange_v1' and len(module_pkg['payload']['moduleRequirements'])==110
 assert len({r['requirementId'] for r in module_pkg['payload']['moduleRequirements']})==110
 self_report=page.evaluate('(p)=>window.__sspTestHooks.portfolioAnalyzeExchangePackage(p,"self.json")',module_pkg)
 assert self_report['invalidCount']==0 and self_report['conflictCount']==0
 mixed=page.evaluate("""(p)=>{const q=structuredClone(p); const safe=q.payload.moduleRequirements.find(r=>r.requirementId==='3.1.4'); safe.scope='Imported v1.8.5 module exchange scope.'; const conflict=q.payload.moduleRequirements.find(r=>r.requirementId==='3.1.1'); conflict.implementationNarrative='Conflicting imported narrative must not overwrite.'; q.source.fingerprint=window.__sspTestHooks.portfolioFingerprint(q.payload); return q;}""",module_pkg)
 report=page.evaluate('(p)=>window.__sspTestHooks.portfolioAnalyzeExchangePackage(p,"mixed.json")',mixed)
 assert report['safeCount']>=1 and report['conflictCount']>=1 and report['invalidCount']==0,report
 before=next(r for r in fixture['moduleRequirements'] if r['moduleId']=='module-product-alpha' and r['requirementId']=='3.1.1')['implementationNarrative']
 applied=page.evaluate('(r)=>window.__sspTestHooks.portfolioApplyExchangeReport(r)',report)
 assert applied['applied']>=1
 records={(r['moduleId'],r['requirementId']):r for r in applied['state']['moduleRequirements']}
 assert records[('module-product-alpha','3.1.4')]['scope']=='Imported v1.8.5 module exchange scope.'
 assert records[('module-product-alpha','3.1.1')]['implementationNarrative']==before
 tampered=json.loads(json.dumps(module_pkg)); tampered['payload']['module']['description']='tampered without fingerprint'
 fingerprint_rejected=page.evaluate("p=>{try{window.__sspTestHooks.portfolioExchangeValidatePackage(p);return false}catch(e){return /fingerprint/i.test(e.message)}}",tampered); assert fingerprint_rejected
 foreign=page.evaluate("""(p)=>{const q=structuredClone(p);q.payload.portfolio.portfolioId='portfolio-foreign';q.payload.module.portfolioId='portfolio-foreign';q.source.portfolio_id='portfolio-foreign';q.source.fingerprint=window.__sspTestHooks.portfolioFingerprint(q.payload);return q;}""",module_pkg)
 foreign_report=page.evaluate('(p)=>window.__sspTestHooks.portfolioAnalyzeExchangePackage(p,"foreign.json")',foreign)
 assert foreign_report['invalidCount']>=1
 # Reset to the governed fixture before the independent Word Review round trip.
 reset=page.evaluate('()=>window.__sspTestHooks.collectData(true)'); reset['portfolioFoundation']=fixture; page.evaluate('(d)=>window.__sspTestHooks.applyData(d)',reset)
 with page.expect_download() as event:
  word_result=page.evaluate("()=>window.__sspTestHooks.buildModuleWordReview('module-product-alpha').then(r=>({filename:r.filename,manifest:r.manifest}))")
 word_path=Path(event.value.path()); assert word_path.exists()
 with zipfile.ZipFile(word_path) as z:
  names=set(z.namelist()); assert {'word/document.xml','customXml/item1.xml','[Content_Types].xml'} <= names
  manifest_xml=z.read('customXml/item1.xml').decode('utf-8')
 payload=re.search(r'<payload encoding="base64">([^<]+)</payload>',manifest_xml).group(1); decoded=json.loads(base64.b64decode(payload)); assert decoded['reviewScope']=='module' and decoded['moduleId']=='module-product-alpha' and decoded['sourceFingerprint']
 assert word_result['manifest']['reviewScope']=='module' and word_result['manifest']['moduleId']=='module-product-alpha'
 reviewed_path=Path(tempfile.mkstemp(suffix='.docx')[1])
 with zipfile.ZipFile(word_path) as source, zipfile.ZipFile(reviewed_path,'w',zipfile.ZIP_DEFLATED) as target:
  for info in source.infolist():
   content=source.read(info.filename)
   if info.filename=='word/document.xml':
    xml=content.decode('utf-8'); pattern=r'(<w:tag w:val="module:module-product-alpha:requirement:3\.1\.4:scope".*?<w:sdtContent>).*?(</w:sdtContent>)'; replacement=r'\1<w:r><w:t xml:space="preserve">Reviewed module scope from Word.</w:t></w:r>\2'; xml,count=re.subn(pattern,replacement,xml,count=1,flags=re.S); assert count==1; content=xml.encode('utf-8')
   target.writestr(info,content)
 page.set_input_files('#portfolioImportModuleWordFile',str(reviewed_path)); page.wait_for_selector('#wordReviewModal:not([hidden])',timeout=10000)
 assert page.locator('#wordReviewPackageMeta').inner_text()
 assert page.locator('#wordReviewList [data-word-item]').count()>=1
 assert '0\nconflicts' in page.locator('#wordReviewSummary').inner_text()
 queue_text=page.locator('#portfolioModuleWordQueueBtn').inner_text(); assert '(1)' in queue_text,queue_text
 page.click('#wordReviewApplyAllBtn')
 final_state=page.evaluate('()=>window.__sspTestHooks.collectData(true).portfolioFoundation')
 final_record=next(r for r in final_state['moduleRequirements'] if r['moduleId']=='module-product-alpha' and r['requirementId']=='3.1.4')
 assert final_record['scope']=='Reviewed module scope from Word.'
 page.click('#wordReviewCloseBtn')
 page.eval_on_selector('#portfolioSetupBtn','el=>el.click()'); page.locator('#portfolioExchangeReport').evaluate('(el)=>{el.hidden=false}'); page.locator('#portfolioExchangeReport').scroll_into_view_if_needed()
 screenshot=ROOT/'CMMC_L2_SSP_v1.8.5_Exchange_Workbench.png'; page.screenshot(path=str(screenshot),full_page=False)
 word_bytes=word_path.stat().st_size; reviewed_path.unlink(missing_ok=True); title=page.title(); controls=page.locator('.control-card').count(); context.close(); browser.close()
assert not errors,errors
result={'release':'v1.8.5','suite':'browser-exchange-word-regression','status':'passed','fileUrlSmoke':file_url_smoke,'title':title,'controls':controls,'portfolioExchange':{'modules':portfolio_pkg['record_counts']['modules'],'moduleRequirements':portfolio_pkg['record_counts']['moduleRequirements'],'fingerprint':portfolio_pkg['source']['fingerprint']},'moduleExchange':{'requirements':len(module_pkg['payload']['moduleRequirements']),'fingerprint':module_pkg['source']['fingerprint']},'reconciliation':{'safe':report['safeCount'],'added':report['addedCount'],'unchanged':report['unchangedCount'],'conflict':report['conflictCount'],'invalid':report['invalidCount'],'applied':applied['applied']},'negative':{'tamperedFingerprintRejected':fingerprint_rejected,'foreignPortfolioInvalid':foreign_report['invalidCount']},'moduleWord':{'exportedBytes':word_bytes,'manifestEntries':len(word_result['manifest']['entries']),'reviewAppliedScope':final_record['scope']},'pageErrors':errors,'screenshot':screenshot.name}
(ROOT/'CMMC_L2_SSP_v1.8.5_Runtime_Regression.json').write_text(json.dumps(result,indent=2)+'\n'); print(json.dumps(result))
