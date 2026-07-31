import { test, expect } from '@playwright/test';
import { stabilizePage } from './module-catalog.mjs';
import AxeBuilder from '@axe-core/playwright';

const RUNTIME='/modules/workshop/releases/v79.1/cmmc_l2_gap_workshop_tool_v79.1.html';

function capture(page){
  const result={pageErrors:[],consoleErrors:[],externalRequests:[]};
  page.on('pageerror',error=>result.pageErrors.push(String(error)));
  page.on('console',message=>{if(message.type()==='error')result.consoleErrors.push(message.text());});
  page.on('request',request=>{const url=request.url();if(/^https?:/i.test(url)&&!url.startsWith('http://127.0.0.1:4173/'))result.externalRequests.push(url);});
  return result;
}
async function open(page){
  await page.goto(RUNTIME,{waitUntil:'domcontentloaded'});
  await stabilizePage(page);
  await page.evaluate(()=>{
    window.governedSnapshot=()=>JSON.stringify({
      practices:state.practices,objectives:state.objectiveReviews,decisions:state.decisions,
      actions:state.actionRegister,ownership:state.evidenceOwnershipV77,merge:state.workbookMergeV57,
      sspHandoff:state.sspHandoffGovernanceV70,sspReturn:state.sspReturnGovernanceV71,
      filters:state.filters,selectedPractice:state.selectedPractice
    });
  });
}
async function buildValidPackage(page){return page.evaluate(()=>({
  package_kind:'l2g_workbook_merge_v1',package_version:'1.1',schema_trusted:true,
  generated_by:'L2G Builder/Merger v3.10',generated_at:'2026-07-31T22:00:00.000Z',tool_family:'L2G_Builder_Merger',content_trust_level:'reviewed_workbook_output',
  practice_results:PRACTICES.map((practice,index)=>({Practice_ID:practice.id,Implementation_Status:index%3===0?'Implemented':'Partially Implemented',Gap_Notes:`Synthetic finding ${practice.id}`,Remediation_POAM_Notes:`Synthetic recommendation ${practice.id}`,Reviewer_Notes:index===0?'<script>window.__V791_INJECTED__=true</script> ../../etc/passwd C:\\Windows\\System32':`Synthetic note ${practice.id}`,Source_Sheet:'CMMC Assessment',Source_Row:index+2})),
  objective_results:V54_OBJECTIVES.map((objective,index)=>({Practice_ID:v57PracticeId(objective.practice_id),Objective_ID:String(objective.objective_id).replace(/\s+\[/g,'['),Assessment_Result:index%4===0?'Not Met':'Met',Evidence_Reviewed:`RG4-EVID-${String(index+1).padStart(3,'0')}`,Gap_Notes:index%4===0?`Synthetic objective gap ${objective.objective_id}`:'',Remediation_POAM_Notes:index%4===0?`Synthetic objective recommendation ${objective.objective_id}`:'',Reviewer_Notes:`Synthetic objective note ${objective.objective_id}`,Source_Sheet:'CMMC Assessment',Source_Row:index+2})),
  evidence_results:[],gap_results:[],advisor_review_results:[],warnings:[],
  workbook_source:{workbook_file_name:'RG4_Synthetic_Workbook.xlsx',practice_rows_detected:110,practices_matched_to_handoff:110,objective_rows_detected:320,sheets:12,formulas:222}
}));}

test.describe.configure({mode:'serial'});

test('Workshop v79.1 accepts Merge 1.1, preserves preview, applies locally, blocks duplicate, and undoes',async({page},testInfo)=>{
  const observed=capture(page);page.on('dialog',dialog=>dialog.accept());await open(page);const pkg=await buildValidPackage(page);
  const previewResult=await page.evaluate(value=>{const before=governedSnapshot();const preview=v57PreviewMergeText(JSON.stringify(value),'valid-merge-1.1.json');return{before,after:governedSnapshot(),preview:{blocking:preview.blocking,trusted:preview.trusted,practiceCount:preview.practice_results.length,objectiveCount:preview.objective_results.length,validationErrors:preview.validation_errors}};},pkg);
  expect(previewResult.preview).toEqual({blocking:false,trusted:true,practiceCount:110,objectiveCount:320,validationErrors:[]});
  expect(previewResult.after).toBe(previewResult.before);
  await page.evaluate(()=>v57ApplyPendingMerge());
  await expect.poll(()=>page.evaluate(()=>state.workbookMergeV57.history.length)).toBe(1);
  expect(await page.evaluate(()=>Object.keys(state.workbookMergeV57.practice_results).length)).toBe(110);
  expect(await page.evaluate(()=>Object.keys(state.workbookMergeV57.objective_results).length)).toBe(320);
  const appliedSnapshot=await page.evaluate(()=>governedSnapshot());
  const duplicate=await page.evaluate(value=>{const p=v57PreviewMergeText(JSON.stringify(value),'repeat.json');return{duplicate:p.duplicate,blocking:p.blocking};},pkg);
  expect(duplicate).toEqual({duplicate:true,blocking:false});
  await page.evaluate(()=>v57UndoLastMerge());
  await expect.poll(()=>page.evaluate(()=>state.workbookMergeV57.history.length)).toBe(0);
  expect(await page.evaluate(()=>state.workbookMergeV57.undo_snapshot)).toBeNull();
  expect(await page.evaluate(()=>window.__V791_INJECTED__||false)).toBe(false);
  await testInfo.attach('workshop-v791-before-after.json',{body:Buffer.from(JSON.stringify({before:previewResult.before,afterPreview:previewResult.after,afterApply:appliedSnapshot},null,2)),contentType:'application/json'});
  expect(observed.externalRequests).toEqual([]);expect(observed.pageErrors).toEqual([]);expect(observed.consoleErrors).toEqual([]);
});

test('Workshop v79.1 fails closed for version, shape, duplicate-key, and identity defects without mutation',async({page},testInfo)=>{
  const observed=capture(page);await open(page);const pkg=await buildValidPackage(page);
  const results=await page.evaluate(value=>{
    const runObject=(name,mutate)=>{const candidate=structuredClone(value);mutate(candidate);const before=governedSnapshot();const preview=v57PreviewMergeText(JSON.stringify(candidate),`${name}.json`);return{name,blocking:preview.blocking,trusted:preview.trusted,errors:preview.validation_errors||[],unchanged:before===governedSnapshot()};};
    const runText=(name,text)=>{const before=governedSnapshot();const preview=v57PreviewMergeText(text,`${name}.json`);return{name,blocking:preview.blocking,trusted:preview.trusted,errors:preview.validation_errors||[],unchanged:before===governedSnapshot()};};
    const cases=[
      runObject('unknown-version',x=>x.package_version='2.0'),runObject('downgraded-version',x=>x.package_version='1.0'),runObject('missing-version',x=>delete x.package_version),runObject('wrong-kind',x=>x.package_kind='wrong_kind'),runObject('unknown-top-level',x=>x.undeclared=true),
      runObject('duplicate-practice-id',x=>x.practice_results[x.practice_results.length-1]=structuredClone(x.practice_results[0])),runObject('conflicting-practice-row',x=>x.practice_results.push({...x.practice_results[0],Reviewer_Notes:'conflict'})),runObject('duplicate-objective-id',x=>x.objective_results[x.objective_results.length-1]=structuredClone(x.objective_results[0])),runObject('mismatched-practice-objective',x=>x.objective_results[0].Practice_ID=x.practice_results[1].Practice_ID),runText('malformed-json','{"package_kind":')
    ];
    const raw=JSON.stringify(value);
    cases.push(runText('duplicate-key-top-level',raw.replace('"package_version":"1.1"','"package_version":"2.0","package_version":"1.1"')));
    cases.push(runText('duplicate-key-nested',raw.replace('"Practice_ID":','"Practice_ID":"BAD","Practice_ID":')));
    return cases;
  },pkg);
  for(const result of results){expect(result.blocking,result.name).toBe(true);expect(result.trusted,result.name).toBe(false);expect(result.unchanged,result.name).toBe(true);}
  expect(results.find(x=>x.name==='duplicate-key-top-level').errors.join(' ')).toMatch(/duplicate object key/i);
  expect(results.find(x=>x.name==='duplicate-key-nested').errors.join(' ')).toMatch(/duplicate object key/i);
  expect(results.find(x=>x.name==='unknown-top-level').errors.join(' ')).toMatch(/unknown top-level/i);
  await testInfo.attach('workshop-v791-negative-results.json',{body:Buffer.from(JSON.stringify(results,null,2)),contentType:'application/json'});
  expect(observed.externalRequests).toEqual([]);expect(observed.pageErrors).toEqual([]);expect(observed.consoleErrors).toEqual([]);
});

test('Workshop v79.1 self-reconciles Handoff 1.7 and preserves SSP Handoff 1.0',async({page},testInfo)=>{
  const observed=capture(page);await open(page);
  const result=await page.evaluate(()=>{
    state.setup={...state.setup,orgName:'RG4 Synthetic Organization',systemName:'RG4 Synthetic System',envName:'RG4 Validation Enclave'};
    const a=l2gWorkbookHandoffPackage(),b=l2gWorkbookHandoffPackage(),identity=v791ValidateHandoffIdentity(a),sspHandoff=v70SspHandoffPackage();
    return{identity,handoff:{kind:a.package_kind,version:a.package_version,enhancements:a.handoff_schema_enhancements_version,contract:a.contract_manifest.contract_release,required:a.contract_manifest.required_package_identity,integrity:a.package_integrity.contract_release,fp:a.package_integrity.canonical_fingerprint,repeat:b.package_integrity.canonical_fingerprint,label:a.contract_manifest.identity_label},sspHandoff:{kind:sspHandoff.package_kind,version:sspHandoff.package_version,controls:sspHandoff.controls.length},checks:v60RuntimeChecks().checks.filter(c=>c.id==='version'||c.id.startsWith('v791-'))};
  });
  expect(result.identity.valid).toBe(true);
  expect(result.handoff).toMatchObject({kind:'l2g_workbook_handoff_v1',version:'1.0',enhancements:'1.7',contract:'1.7',required:{package_kind:'l2g_workbook_handoff_v1',package_version:'1.0',schema_trusted:true},integrity:'1.7',label:'Workbook Handoff contract release 1.7 — wire package version 1.0'});
  expect(result.handoff.repeat).toBe(result.handoff.fp);
  expect(result.sspHandoff).toEqual({kind:'l2g_ssp_handoff_v1',version:'1.0',controls:110});
  expect(result.checks.filter(c=>!c.pass)).toEqual([]);
  await expect(page.locator('#v791IdentityNotice')).toContainText('Workbook Handoff contract release 1.7');
  await testInfo.attach('workshop-v791-handoff-identity.json',{body:Buffer.from(JSON.stringify(result,null,2)),contentType:'application/json'});
  expect(observed.externalRequests).toEqual([]);expect(observed.pageErrors).toEqual([]);expect(observed.consoleErrors).toEqual([]);
});

test('Workshop v79.1 retains v79 workspace, themes, print, constrained viewport, keyboard focus, and axe',async({page})=>{
  const observed=capture(page);await page.setViewportSize({width:980,height:720});await open(page);
  await page.emulateMedia({media:'print'});expect(await page.evaluate(()=>matchMedia('print').matches)).toBe(true);
  await page.emulateMedia({media:'screen'});await page.evaluate(()=>{document.documentElement.classList.add('dark-mode');document.body.classList.add('dark-mode');});
  expect(await page.evaluate(()=>document.documentElement.classList.contains('dark-mode'))).toBe(true);
  await page.keyboard.press('Tab');expect(await page.evaluate(()=>document.activeElement?.tagName||'BODY')).not.toBe('BODY');
  expect(await page.locator('#v79RegressionWorkspace').count()).toBe(1);expect(await page.locator('#v791IdentityNotice').count()).toBe(1);
  const accessibility=await new AxeBuilder({page}).analyze();expect(accessibility.violations.filter(v=>['critical','serious'].includes(v.impact))).toEqual([]);
  expect(observed.externalRequests).toEqual([]);expect(observed.pageErrors).toEqual([]);expect(observed.consoleErrors).toEqual([]);
});
