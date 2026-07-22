from __future__ import annotations
import csv, hashlib, io, json, tempfile
from pathlib import Path
from playwright.sync_api import Error as PlaywrightError, sync_playwright
ROOT=Path(__file__).resolve().parents[1]
RUNTIME=ROOT/'CMMC_L2_SSP_Modern_Editable_v1.8.4.html'
FIX=ROOT/'fixtures'
fixture=json.loads((FIX/'Portfolio_CRM_McFirecoal_v1.8.4.json').read_text())
mixed=(FIX/'Portfolio_CRM_Reconciliation_Mixed_v1.8.4.csv').read_text(encoding='utf-8-sig')
errors=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else None,args=['--no-sandbox'])
 context=browser.new_context(accept_downloads=True,viewport={'width':1600,'height':1100})
 page=context.new_page(); page.on('pageerror',lambda e:errors.append(str(e)))
 file_url_smoke=True
 try:
  page.goto(RUNTIME.as_uri(),wait_until='load')
 except PlaywrightError as error:
  if 'ERR_BLOCKED_BY_ADMINISTRATOR' not in str(error): raise
  file_url_smoke='blocked-by-local-browser-policy'
  page.close()
  page=context.new_page(); page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(RUNTIME.read_text(),wait_until='load')
 data=page.evaluate('()=>window.__sspTestHooks.collectData(true)')
 data['portfolioFoundation']=fixture
 page.evaluate('(d)=>window.__sspTestHooks.applyData(d)',data)
 page.eval_on_selector('#portfolioSetupBtn','el=>el.click()')
 page.eval_on_selector('#portfolioCrmCenter','el=>el.open=true')
 page.locator('#portfolioCrmCenter').scroll_into_view_if_needed()
 metrics=page.evaluate('()=>window.__sspTestHooks.portfolioCrmMetrics(window.__sspTestHooks.portfolioBuildCrmRows())')
 rows=page.evaluate('()=>window.__sspTestHooks.portfolioBuildCrmRows()')
 assert len(rows)==440 and metrics=={'rows':440,'authoritative':35,'inherited':36,'pending':398,'conflicts':1},metrics
 assert page.locator('#portfolioCrmList .portfolio-crm-row').count()==300
 with page.expect_download() as event:
  page.click('#portfolioCrmExportConsolidatedBtn')
 consolidated_path=Path(event.value.path()); consolidated_text=consolidated_path.read_text(encoding='utf-8-sig')
 consolidated=list(csv.DictReader(io.StringIO(consolidated_text)))
 assert len(consolidated)==440 and len({r['Requirement Record ID'] for r in consolidated})==440
 with page.expect_download() as event:
  page.click('#portfolioCrmExportModuleBtn')
 module_path=Path(event.value.path()); module_text=module_path.read_text(encoding='utf-8-sig')
 module_rows=list(csv.DictReader(io.StringIO(module_text)))
 assert len(module_rows)==110 and len({r['Requirement ID'] for r in module_rows})==110
 report=page.evaluate('(args)=>window.__sspTestHooks.portfolioAnalyzeCrmImport(args.text,args.name)',{'text':mixed,'name':'Portfolio_CRM_Reconciliation_Mixed_v1.8.4.csv'})
 assert (report['safeRows'],report['conflictRows'],report['invalidRows'])==(1,1,1),report
 before=next(r for r in fixture['moduleRequirements'] if r['requirementRecordId']=='requirement-mcfirecoal-anchor-3_1_1')['implementationNarrative']
 applied=page.evaluate('(r)=>window.__sspTestHooks.portfolioApplyCrmReconciliation(r)',report)
 assert applied['applied']==1
 records={r['requirementRecordId']:r for r in applied['state']['moduleRequirements']}
 assert records['requirement-product-alpha-3_1_4']['scope']=='Imported CRM scoping note for reconciliation testing.'
 assert records['requirement-mcfirecoal-anchor-3_1_1']['implementationNarrative']==before
 assert 'requirement-does-not-exist' not in records
 screenshot=ROOT/'CMMC_L2_SSP_v1.8.4_CRM_Workbench.png'
 page.locator('#portfolioCrmCenter').screenshot(path=str(screenshot))
 title=page.title(); controls=page.locator('.control-card').count()
 context.close(); browser.close()
assert not errors,errors
result={'release':'v1.8.4','suite':'browser-crm-regression','status':'passed','fileUrlSmoke':file_url_smoke,'title':title,'controls':controls,'metrics':metrics,'consolidatedRows':len(consolidated),'selectedModuleRows':len(module_rows),'consolidatedCsvSha256':hashlib.sha256(consolidated_text.encode('utf-8-sig')).hexdigest(),'moduleCsvSha256':hashlib.sha256(module_text.encode('utf-8-sig')).hexdigest(),'reconciliation':{'safe':report['safeRows'],'unchanged':report['unchangedRows'],'conflict':report['conflictRows'],'invalid':report['invalidRows'],'applied':applied['applied']},'pageErrors':errors,'screenshot':screenshot.name}
(ROOT/'CMMC_L2_SSP_v1.8.4_Runtime_Regression.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result))
