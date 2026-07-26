import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const runtimePath = '/modules/ssp/releases/v1.9.7/CMMC_L2_SSP_Modern_Editable_v1.9.7.html';

test('ssp-v1.9.7 UX-2 portfolio workspace remains local, presentation-only, and accessible', async ({ page }) => {
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
  await page.waitForFunction(() => window.__sspTestHooks && window.__sspUx2TestHooks);
  expect(await page.evaluate(() => __sspTestHooks.RELEASE_VERSION)).toBe('1.9.7');
  expect(await page.evaluate(() => __sspTestHooks.APP_VERSION)).toBe('1.9.5.1');
  expect(await page.locator('.control-card').count()).toBe(110);

  const portfolio = await page.evaluate(() => {
    const data = __sspTestHooks.collectData(true);
    const state = __sspTestHooks.portfolioCreateModularState('Synthetic UX-2 Portfolio');
    const top = state.portfolio.topLevelModuleId;
    const add = (moduleId, name, shortName, moduleType) => ({
      moduleId, name, shortName, moduleType, parentModuleId: top, status: 'draft', version: '1.0',
      description: 'Synthetic module for bounded UX-2 regression.', boundaryStatement: 'Synthetic bounded module.',
      subscriptionIdentifiers: [], services: [], applications: [], dataTypes: [], identitySources: [],
      interconnections: [], responsibleOrganizations: [], owners: ['Synthetic Owner'],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    });
    state.modules.push(add('module-product-alpha', 'Product Alpha', 'ALPHA', 'product'));
    state.modules.push(add('module-product-bravo', 'Product Bravo', 'BRAVO', 'product'));
    state.modules.push(add('module-shared-security', 'Shared Security', 'SHARED', 'shared-service'));
    state.moduleRequirements = __sspTestHooks.portfolioEnsureRequirementRecords(state.moduleRequirements, state.modules);
    const pending = state.moduleRequirements.find(r => r.moduleId === 'module-product-bravo' && r.requirementId === '3.1.2');
    pending.applicability = 'pending-decision';
    pending.responsibilityModel = 'undecided';
    data.portfolioFoundation = state;
    __sspTestHooks.applyData(data);
    return { modules: state.modules.length, records: state.moduleRequirements.length, pendingId: pending.requirementRecordId };
  });
  expect(portfolio).toMatchObject({ modules: 4, records: 440 });

  await page.locator('#moreMenu summary').click();
  await page.locator('#portfolioSetupBtn').click();
  await expect(page.locator('#portfolioModal')).toBeVisible();
  await expect(page.locator('#portfolioTitle')).toHaveText('SSP Portfolio Workspace');
  expect(await page.locator('#ux2PrimaryNav [data-ux2-view]:not([disabled])').count()).toBe(5);
  await expect(page.locator('#ux2OverviewCards')).toContainText('440');

  await page.selectOption('#ux2WorkspaceScope', 'module');
  await page.selectOption('#ux2WorkspaceModule', 'module-product-bravo');
  await page.locator('#ux2PrimaryNav [data-ux2-view="modules"]').click();
  await page.locator('#ux2SubviewNav [data-ux2-subview="requirements"]').click();
  await expect(page.locator('#portfolioRequirementList .portfolio-requirement-row')).toHaveCount(110);

  await page.evaluate(id => __sspUx2TestHooks.ux2InternalNavigate({
    targetView: 'modules', scope: 'module', moduleId: 'module-product-bravo',
    filters: { portfolioRequirementApplicability: 'pending-decision' },
    selectedRecordKind: 'moduleRequirement', selectedRecordId: id,
    focusTarget: 'portfolioRequirementEditorTitle'
  }), portfolio.pendingId);
  await expect(page.locator('#ux2DetailsPanel')).toBeVisible();
  await expect(page.locator('#portfolioRequirementEditorTitle')).toContainText('3.1.2');
  await page.locator('#ux2DetailsClose').click();
  await expect(page.locator('#ux2DetailsPanel')).toBeHidden();

  for (const [view, subview] of [['operations', 'maintenance'], ['governance', 'baselines'], ['delivery', 'exchange']]) {
    await page.locator(`#ux2PrimaryNav [data-ux2-view="${view}"]`).click();
    await page.locator(`#ux2SubviewNav [data-ux2-subview="${subview}"]`).click();
    await expect(page.locator(`#ux2Subview-${subview}`)).toBeVisible();
  }
  await expect(page.locator('#ux2View-delivery')).toContainText('Builder/Merger remains the downstream owner');
  await page.locator('#ux2PrimaryNav [data-ux2-view="governance"]').click();
  await expect(page.locator('#ux2View-governance .ux2-local-governance-note')).toContainText('without authenticated identity');

  await page.locator('#ux2SubviewNav [data-ux2-subview="register"]').click();
  await page.locator('#ux2WorkspaceSearch').fill('synthetic');
  await page.selectOption('#ux2WorkspaceSort', 'label-asc');
  const prefs = await page.evaluate(() => __sspUx2TestHooks.ux2ReadPrefs());
  expect(prefs.view).toBe('governance');
  expect(prefs.scope).toBe('module');
  const rawBytes = await page.evaluate(() => new TextEncoder().encode(localStorage.getItem(__sspUx2TestHooks.UX2_PREF_KEY) || '').length);
  expect(rawBytes).toBeLessThan(24576);
  const governed = await page.evaluate(() => __sspTestHooks.collectData(true));
  expect(JSON.stringify(governed)).not.toContain('cmmc-l2-ssp-workspace-ui-v1.9.7');

  await page.locator('#portfolioModal .portfolio-close').click();
  await expect(page.locator('#portfolioModal')).toBeHidden();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('#moreMenu summary').click();
  await page.locator('#portfolioSetupBtn').click();
  await expect(page.locator('#ux2Subview-register')).toBeVisible();
  const currentUrl = page.url();
  await page.evaluate(() => history.back());
  await expect(page.locator('#portfolioModal')).toBeHidden();
  expect(page.url()).toBe(currentUrl);

  await page.locator('#exportMenu summary').click();
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#exportBtn').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('CMMC_L2_SSP_v1.9.5.1_Data_Backup.json');
  const backup = JSON.parse(await fs.readFile(await download.path(), 'utf8'));
  expect(backup.appVersion).toBe('1.9.5.1');
  expect(backup.workspaceUi).toBeUndefined();

  expect(externalRequests).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
