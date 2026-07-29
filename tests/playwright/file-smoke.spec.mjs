import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
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
