import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const runtimePath = '/modules/ssp/releases/v1.9.6/CMMC_L2_SSP_Modern_Editable_v1.9.6.html';

test('ssp-v1.9.6 UX-1 remains presentation-only, local, and accessible', async ({ page }) => {
  const pageErrors = [];
  const consoleErrors = [];
  const externalRequests = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('request', request => {
    const url = request.url();
    if (/^https?:/i.test(url) && !url.startsWith('http://127.0.0.1:4173/')) externalRequests.push(url);
  });

  await page.goto(runtimePath, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__sspTestHooks);

  expect(await page.evaluate(() => __sspTestHooks.RELEASE_VERSION)).toBe('1.9.6');
  expect(await page.evaluate(() => __sspTestHooks.APP_VERSION)).toBe('1.9.5.1');
  await expect(page.locator('#documentStateSummary')).toBeVisible();
  await expect(page.locator('#stateLocalWarning')).toContainText('saved only in this browser');
  await expect(page.locator('[data-view]')).toHaveText(['Author', 'Review Document', 'Focused Control']);
  await expect(page.locator('#viewModeHelp')).toContainText('presentation only');
  await expect(page.locator('#preflightPrimaryBtn')).toBeVisible();
  await expect(page.locator('#deliverBtn')).toBeVisible();

  await page.locator('#documentStateBtn').focus();
  await page.locator('#documentStateBtn').click();
  await expect(page.locator('#documentStateDialog')).toBeVisible();
  expect(await page.locator('#documentStateDialog').getAttribute('aria-modal')).toBe('true');
  await page.keyboard.press('Escape');
  expect(await page.evaluate(() => document.activeElement?.id)).toBe('documentStateBtn');

  await page.locator('#deliverBtn').focus();
  await page.locator('#deliverBtn').click();
  await expect(page.locator('#deliverModal')).toBeVisible();
  expect(await page.locator('.deliver-outcome').count()).toBe(4);
  await page.keyboard.press('Escape');
  expect(await page.evaluate(() => document.activeElement?.id)).toBe('deliverBtn');

  const before = await page.evaluate(() => __sspTestHooks.collectData(false));
  for (const mode of ['document', 'focus', 'working']) await page.locator(`[data-view="${mode}"]`).click();
  const after = await page.evaluate(() => __sspTestHooks.collectData(false));
  for (const key of ['fields','statuses','reviewerStatuses','tables','portfolioFoundation','images','l2gIntegration']) {
    expect(after[key]).toEqual(before[key]);
  }

  await page.locator('#exportMenu summary').click();
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#exportBtn').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('CMMC_L2_SSP_v1.9.5.1_Data_Backup.json');
  const downloadPath = await download.path();
  expect(downloadPath).toBeTruthy();
  const backup = JSON.parse(await fs.readFile(downloadPath, 'utf8'));
  expect(backup.appVersion).toBe('1.9.5.1');
  expect(backup.lastExportAttempts).toBeUndefined();
  const preferences = await page.evaluate(() => __sspTestHooks.ux1ReadPrefs());
  expect(preferences.lastExportAttempts).toHaveLength(1);
  expect(preferences.lastExportAttempts[0].status).toBe('download-initiated');
  const rawPreferenceBytes = await page.evaluate(() => new TextEncoder().encode(localStorage.getItem(__sspTestHooks.UX_PREF_KEY) || '').length);
  expect(rawPreferenceBytes).toBeLessThan(16384);

  await page.evaluate(() => {
    const data = __sspTestHooks.collectData(true);
    data.portfolioFoundation = __sspTestHooks.portfolioCreateModularState('Synthetic UX-1 Portfolio');
    __sspTestHooks.applyData(data);
  });
  await expect(page.locator('#uxPortfolioScopeWrap')).toBeVisible();
  await page.selectOption('#uxPortfolioScope', 'module');
  const moduleId = await page.locator('#uxPortfolioModule').inputValue();
  expect(moduleId).not.toBe('');
  const persisted = await page.evaluate(() => __sspTestHooks.ux1ReadPrefs());
  expect(persisted.portfolioScope).toBe('module');
  expect(persisted.portfolioModuleId).toBe(moduleId);

  await page.evaluate(id => {
    const button = document.createElement('button');
    button.dataset.uxModuleId = id;
    button.dataset.uxSourceCollection = 'modules';
    button.dataset.uxSourceId = id;
    button.dataset.uxList = 'portfolioMaintenanceList';
    __sspTestHooks.ux1NavigateToAffectedRecord(button);
  }, moduleId);
  await expect(page.locator('#portfolioModal')).toBeVisible();
  await expect(page.locator('#uxReturnBar')).toBeVisible();
  await page.locator('#uxReturnBtn').click();
  await expect(page.locator('#uxReturnBar')).toBeHidden();

  expect(externalRequests).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
