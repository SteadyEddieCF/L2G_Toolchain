import { test, expect } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

test('Workshop v79.1 native file origin remains local and strict', async ({ page }) => {
  const pageErrors=[];const consoleErrors=[];const externalRequests=[];
  page.on('pageerror',error=>pageErrors.push(String(error)));
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
  page.on('request',request=>{if(/^https?:/i.test(request.url()))externalRequests.push(request.url());});
  const runtime=path.resolve('modules/workshop/releases/v79.1/cmmc_l2_gap_workshop_tool_v79.1.html');
  await page.goto(pathToFileURL(runtime).href,{waitUntil:'domcontentloaded'});
  expect(await page.title()).toBe('CMMC L2 Gap Workshop Tool v79.1');
  expect(await page.evaluate(()=>CRM_TOOL_VERSION)).toBe('v79.1');
  expect(await page.evaluate(()=>typeof v791JsonParser)).toBe('function');
  expect((await page.evaluate(()=>v791ValidateHandoffIdentity(l2gWorkbookHandoffPackage()))).valid).toBe(true);
  await page.evaluate(()=>{document.documentElement.classList.add('dark-mode');document.body.classList.add('dark-mode');});
  expect(await page.locator('#v791IdentityNotice').count()).toBe(1);
  expect(externalRequests).toEqual([]);expect(pageErrors).toEqual([]);expect(consoleErrors).toEqual([]);
});
