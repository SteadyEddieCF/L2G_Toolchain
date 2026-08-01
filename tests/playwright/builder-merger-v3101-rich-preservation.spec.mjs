import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { seedWorkshopV79, setFixedClock, stableJson } from './builder-merger-v3101-fixture.mjs';

const WORKSHOP='/modules/workshop/releases/v79/cmmc_l2_gap_workshop_tool_v79.html';
const BUILDER='/modules/builder-merger/releases/v3.10.1/L2G-BM_v3.10.1.html';

async function buildWorkbook(page,handoffText,output){
  await page.goto(BUILDER,{waitUntil:'domcontentloaded'});
  await setFixedClock(page);
  await page.evaluate(async text=>handleHandoffFile(new File([text],'handoff.json',{type:'application/json'})),handoffText);
  await expect.poll(()=>page.evaluate(()=>state.v3101HandoffValidation?.status)).toBe('trusted-current');
  const wait=page.waitForEvent('download');
  await page.evaluate(()=>downloadPopulatedWorkbook());
  const download=await wait;
  await download.saveAs(output);
  return fs.readFileSync(output);
}

test('v3.10.1 rich governed records preserve blocker, dependency, service, responsibility, request, follow-up, and lineage fields',async({page})=>{
  await page.goto(BUILDER,{waitUntil:'domcontentloaded'});
  const result=await page.evaluate(()=>{
    const identity={package_kind:'l2g_workbook_handoff_v1',package_version:'1.0',contract_release:'1.7',enhancement_version:'1.7',canonical_fingerprint:'fnv1a-rich',canonical_sha256_fingerprint:'sha256:'+'a'.repeat(64),source_lineage_contract:{mode:'synthetic-rich'}};
    const action={action_id:'action-rich-001',title:'Collect rich provider evidence',description:'Preserve rich governed action fields.',action_type:'evidence-request',priority:'High',status:'Open',owner:'Synthetic Evidence Owner',supporting_owner:'Synthetic Advisor',provider:'Synthetic Cloud Provider',due_date:'2026-10-01',blocker_id:'blocker-rich-001',blocker_meaning:'Provider export pending',related_practices:['AC.L2-3.1.1'],related_objectives:['AC.L2-3.1.1[a]'],dependencies:['request-rich-001'],related_references:['followup-rich-001'],evidence_request_id:'request-rich-001',source_type:'workshop_action',source_id:'action-rich-001',source_key:'action-rich-001',source_label:'Rich action'};
    const ownership={ownership_record_id:'ownership-rich-001',candidate_id:'candidate-rich-001',practice_id:'AC.L2-3.1.1',objective_id:'AC.L2-3.1.1[a]',evidence_category:'provider-produced',evidence_category_label:'Provider produced',audience:'Client',production_owner:'Synthetic Platform Team',retention_owner:'Synthetic Records Owner',access_owner:'Synthetic Tenant Administrator',access_path:'Tenant > Export',submission_owner:'Synthetic Evidence Owner',review_followup_owner:'Synthetic Advisor',contract_validation_required:true,access_limitation:'Client tenant export required.',responsibility_record_id:'responsibility-rich-001',request_id:'request-rich-001',request_status:'Open',provider_followup_id:'followup-rich-001',provider_followup_state:'Pending',action_id:'action-rich-001',due_date:'2026-10-01',report_state:'accepted',service_ids:['service-rich-001'],service_names:['Synthetic Cloud Service'],source_package_kind:'l2g_workbook_handoff_v1',source_package_version:'1.0',source_fingerprint:'sha256:'+'b'.repeat(64)};
    const request={request_id:'request-rich-001',ownership_record_id:'ownership-rich-001',practice_id:'AC.L2-3.1.1',objective_id:'AC.L2-3.1.1[a]',audience:'provider',evidence_category:'provider-produced',request_title:'Provide tenant export',request_text:'Provide the synthetic tenant export.',owner:'Synthetic Cloud Provider',status:'Open',due_date:'2026-10-01',contract_validation_required:true,access_limitation:'Client tenant export required.',access_path:'Tenant > Export',source_candidate_id:'candidate-rich-001',source_responsibility_record_id:'responsibility-rich-001',source_fingerprint:'sha256:'+'c'.repeat(64),action_id:'action-rich-001'};
    const followup={followup_id:'followup-rich-001',ownership_record_id:'ownership-rich-001',request_id:'request-rich-001',practice_id:'AC.L2-3.1.1',objective_id:'AC.L2-3.1.1[a]',provider:'Synthetic Cloud Provider',topic:'Confirm export delivery',state:'Pending',owner:'Synthetic Advisor',due_date:'2026-10-08',contract_validation_required:true,access_limitation:'Client tenant export required.',source_fingerprint:'sha256:'+'d'.repeat(64),action_id:'action-rich-001'};
    const round=(record,rowFn,rehydrate)=>rehydrate(rowFn(record,identity));
    const a=round(action,v3101ActionRow,v3101RehydrateAction);
    const o=round(ownership,v3101OwnershipRow,v3101RehydrateOwnership);
    const r=round(request,v3101RequestRow,v3101RehydrateRequest);
    const f=round(followup,v3101FollowupRow,v3101RehydrateFollowup);
    return {a,o,r,f};
  });
  expect(result.a.source_record).toEqual(result.a.workbook_record);
  expect(result.a.source_record).toMatchObject({action_id:'action-rich-001',blocker_id:'blocker-rich-001',dependencies:['request-rich-001'],related_references:['followup-rich-001'],provider:'Synthetic Cloud Provider'});
  expect(result.o.source_record).toEqual(result.o.workbook_record);
  expect(result.o.source_record).toMatchObject({ownership_record_id:'ownership-rich-001',responsibility_record_id:'responsibility-rich-001',request_id:'request-rich-001',provider_followup_id:'followup-rich-001',service_ids:['service-rich-001'],service_names:['Synthetic Cloud Service'],source_package_kind:'l2g_workbook_handoff_v1',source_package_version:'1.0'});
  expect(result.r.source_record).toEqual(result.r.workbook_record);
  expect(result.r.source_record).toMatchObject({request_id:'request-rich-001',source_responsibility_record_id:'responsibility-rich-001',action_id:'action-rich-001',access_path:'Tenant > Export'});
  expect(result.f.source_record).toEqual(result.f.workbook_record);
  expect(result.f.source_record).toMatchObject({followup_id:'followup-rich-001',request_id:'request-rich-001',provider:'Synthetic Cloud Provider',action_id:'action-rich-001'});
  for(const envelope of Object.values(result)){
    expect(envelope.record_id).toBeTruthy();
    expect(envelope.source_record_fingerprint).toMatch(/^[0-9a-f]{64}$/);
    expect(envelope.workbook_record_fingerprint).toMatch(/^[0-9a-f]{64}$/);
  }
});

test('v3.10.1 blocks a comparison Handoff whose canonical SHA-256 linkage differs from the workbook helper metadata',async({browser})=>{
  test.setTimeout(240000);
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'v3101-linkage-'));
  const workshop=await browser.newPage();
  await workshop.goto(WORKSHOP,{waitUntil:'domcontentloaded'});
  const original=await seedWorkshopV79(workshop);
  const originalText=stableJson(original);
  const builder=await browser.newPage({acceptDownloads:true});
  const workbook=await buildWorkbook(builder,originalText,path.join(temp,'source.xlsx'));
  const extract=await browser.newPage();
  await extract.goto(BUILDER,{waitUntil:'domcontentloaded'});
  await setFixedClock(extract);
  const mismatched=structuredClone(original);
  mismatched.generated_at='2026-08-02T00:00:00.000Z';
  const observed=await extract.evaluate(async({b64,text})=>{
    const bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
    await handleReviewWorkbookFile(new File([bytes],'source.xlsx',{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
    try{
      await handleCompareHandoffFile(new File([text],'mismatched.json',{type:'application/json'}));
      await buildExtractPreviewIfReady();
      return 'not blocked';
    }catch(error){return String(error?.message||error);}
  },{b64:workbook.toString('base64'),text:stableJson(mismatched)});
  expect(observed).toContain('source Handoff fingerprint mismatch');
  await Promise.all([workshop.close(),builder.close(),extract.close()]);
  fs.rmSync(temp,{recursive:true,force:true});
});
