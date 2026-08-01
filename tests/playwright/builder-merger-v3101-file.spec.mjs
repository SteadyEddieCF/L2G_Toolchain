import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { seedWorkshopV79, stableJson } from './builder-merger-v3101-fixture.mjs';

test('builder-merger-v3.10.1: native Windows file-origin strict Handoff and offline smoke',async({browser})=>{
  test.setTimeout(240000);const temp=fs.mkdtempSync(path.join(os.tmpdir(),'bm-v3101-file-'));const handoffPath=path.join(temp,'handoff.json');
  const observe=(page)=>{const out={page:[],console:[],external:[]};page.on('pageerror',e=>out.page.push(String(e)));page.on('console',m=>{if(m.type()==='error')out.console.push(m.text());});page.on('request',r=>{if(/^https?:/i.test(r.url()))out.external.push(r.url());});return out;};
  const workshop=await browser.newPage();const wobs=observe(workshop);await workshop.goto(pathToFileURL(path.resolve('modules/workshop/releases/v79/cmmc_l2_gap_workshop_tool_v79.html')).href,{waitUntil:'domcontentloaded'});const handoff=await seedWorkshopV79(workshop);fs.writeFileSync(handoffPath,stableJson(handoff));
  const page=await browser.newPage();const obs=observe(page);await page.goto(pathToFileURL(path.resolve('modules/builder-merger/releases/v3.10.1/L2G-BM_v3.10.1.html')).href,{waitUntil:'domcontentloaded'});await page.locator('#handoffFile').setInputFiles(handoffPath);await expect.poll(()=>page.evaluate(()=>state.v3101HandoffValidation?.status)).toBe('trusted-current');expect(await page.evaluate(()=>state.v3101HandoffValidation?.governedBuildAllowed)).toBe(true);expect(await page.evaluate(()=>state.handoff.governance.actions[0].action_id)).toBe('action-rg4-001');expect(await page.evaluate(()=>state.handoff.governance.ownership_records[0].ownership_record_id)).toBe('candidate-rg4-001');
  expect(obs.external).toEqual([]);expect(obs.page).toEqual([]);expect(obs.console).toEqual([]);expect(wobs.external).toEqual([]);expect(wobs.page).toEqual([]);expect(wobs.console).toEqual([]);await Promise.all([workshop.close(),page.close()]);fs.rmSync(temp,{recursive:true,force:true});
});
