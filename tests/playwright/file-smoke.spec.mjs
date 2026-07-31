import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { generateWordFixture, readSidecar, adaptSidecarArtifact } from './ssp-rg4-fixture-helper.mjs';
import { modules, stabilizePage } from './module-catalog.mjs';

for (const module of modules) {
  test(`${module.slug}: Windows file-origin smoke`, async ({ page }) => {
    const absolutePath = path.resolve(process.cwd(), module.path.replace(/^\//, ''));
    const fileUrl = pathToFileURL(absolutePath).href;
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(String(error)));
    await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
    await stabilizePage(page);
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveTitle(new RegExp(module.version.replaceAll('.', '\\.'), 'i'));
    const storage = await page.evaluate(() => {
      const key = '__l2g_file_origin_probe__';
      try {
        localStorage.setItem(key, 'ok');
        const value = localStorage.getItem(key);
        localStorage.removeItem(key);
        return value;
      } catch (error) {
        return String(error);
      }
    });
    expect(storage).toBe('ok');
    expect(pageErrors).toEqual([]);
  });
}

test('ssp-v1.9.16: Windows file-origin Review setup compaction smoke', async ({ page }) => {
  const absolutePath=path.resolve(process.cwd(),'modules/ssp/releases/v1.9.16/CMMC_L2_SSP_Modern_Editable_v1.9.16.html');
  const fileUrl=pathToFileURL(absolutePath).href;
  const pageErrors=[],consoleErrors=[],externalRequests=[];
  page.on('pageerror',error=>pageErrors.push(String(error)));
  page.on('console',message=>{if(message.type()==='error') consoleErrors.push(message.text());});
  page.on('request',request=>{if(/^https?:/i.test(request.url())) externalRequests.push(request.url());});
  await page.setViewportSize({width:1440,height:900});
  await page.goto(fileUrl,{waitUntil:'domcontentloaded'});
  await page.locator('#reviewWorkspaceBtn').click();
  await expect(page.locator('#rg2Modal')).toBeVisible();
  const toggle=page.getByRole('button',{name:/Review setup & summary/i});
  await expect(toggle).toHaveAttribute('aria-expanded','false');
  await expect(page.locator('#rg2SetupPanel')).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('#rg2SetupPanel')).toBeVisible();
  await page.locator('.rg2-header [data-close-rg2]').click();
  await expect(page.locator('#reviewWorkspaceBtn')).toBeFocused();
  await page.locator('#reviewWorkspaceBtn').click();
  await expect(page.locator('#rg2SetupToggle')).toHaveAttribute('aria-expanded','true');
  expect(await page.evaluate(()=>sessionStorage.getItem(window.__sspRg1TestHooks.RG2_SETUP_SESSION_KEY))).toBe('expanded');
  expect(externalRequests).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test('ssp-v1.9.17: Windows file-origin RG-4 generated-pair preview smoke', async ({ page, browser }) => {
  test.setTimeout(180000);
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'ssp-v1917-file-'));
  const docx=path.join(temp,'ssp_current.docx');
  const sidecarPath=path.join(temp,'sidecar.json');
  const generated=await generateWordFixture(browser,'current',docx);
  const sidecar=adaptSidecarArtifact(readSidecar('l2g_ssp_word_qa_sidecar_v1_current_attempt1.json'),docx);
  fs.writeFileSync(sidecarPath,JSON.stringify(sidecar,null,2));
  const root=path.resolve(process.cwd(),'modules/ssp/releases/v1.9.17');
  const fileUrl=pathToFileURL(path.join(root,'CMMC_L2_SSP_Modern_Editable_v1.9.17.html')).href;
  const pageErrors=[],consoleErrors=[],externalRequests=[];
  page.on('pageerror',error=>pageErrors.push(String(error)));
  page.on('console',message=>{if(message.type()==='error') consoleErrors.push(message.text());});
  page.on('request',request=>{if(/^https?:/i.test(request.url())) externalRequests.push(request.url());});
  await page.setViewportSize({width:1440,height:900});
  await page.goto(fileUrl,{waitUntil:'domcontentloaded'});
  await page.evaluate((data)=>window.__sspTestHooks.applyData(data),generated.snapshot);
  await page.evaluate(()=>window.__sspRg4TestHooks.open('import'));
  await expect(page.locator('#rg4Modal')).toBeVisible();
  await expect(page.locator('#rg4Title')).toBeFocused();
  await page.locator('#rg4SidecarFile').setInputFiles(sidecarPath);
  await page.locator('#rg4DocxFile').setInputFiles(docx);
  await page.locator('#rg4ValidateBtn').click();
  await expect(page.locator('#rg4Live')).toContainText('Structurally valid');
  await expect(page.locator('#rg4Preview')).toContainText('qa_complete');
  await expect(page.locator('#rg4Preview')).toContainText('current');
  await page.keyboard.press('Escape');
  await expect(page.locator('#rg4Modal')).toBeHidden();
  expect(await page.evaluate(()=>window.__sspRg4TestHooks.getHistory().length)).toBe(0);
  expect(externalRequests).toEqual([]); expect(pageErrors).toEqual([]); expect(consoleErrors).toEqual([]);
  fs.rmSync(temp,{recursive:true,force:true});
});
