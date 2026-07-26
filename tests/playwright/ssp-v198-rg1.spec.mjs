import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const runtimePath = '/modules/ssp/releases/v1.9.8/CMMC_L2_SSP_Modern_Editable_v1.9.8.html';

test('ssp-v1.9.8 RG-1 source preflight is deterministic, additive, and bounded', async ({ page }) => {
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
  await page.waitForFunction(() => window.__sspTestHooks && window.__sspRg1TestHooks);
  expect(await page.evaluate(() => __sspTestHooks.RELEASE_VERSION)).toBe('1.9.8');
  expect(await page.evaluate(() => __sspTestHooks.APP_VERSION)).toBe('1.9.8');
  expect(await page.evaluate(() => __sspTestHooks.SCHEMA)).toBe('cmmc-l2-ssp-modern-v1.9.8');
  expect(await page.locator('.control-card').count()).toBe(110);
  expect(await page.evaluate(() => __sspRg1TestHooks.REVIEW_PROFILE_REGISTRY.profiles[0].items.length)).toBe(12);

  const migration = await page.evaluate(() => {
    const old = __sspTestHooks.collectData(false);
    old.schema = 'cmmc-l2-ssp-modern-v1.9.5.1';
    old.schemaVersion = '1.9.5.1';
    old.appVersion = '1.9.5.1';
    delete old.reviewGateConfiguration;
    delete old.reviewGateRuns;
    return __sspTestHooks.migrateData(old);
  });
  expect(migration.data.schema).toBe('cmmc-l2-ssp-modern-v1.9.8');
  expect(migration.data.schemaVersion).toBe('1.9.8');
  expect(migration.data.appVersion).toBe('1.9.8');
  expect(migration.data.reviewGateConfiguration.profileId).toBe('generic-cmmc-ssp-review-v1');
  expect(migration.data.reviewGateRuns).toEqual([]);
  expect(migration.data.reviewGateConfiguration.profiles).toBeUndefined();
  await page.evaluate(data => __sspTestHooks.applyData(data), migration.data);

  await page.evaluate(() => __sspRg1TestHooks.rg1OpenModal());
  await expect(page.locator('#rg1Modal')).toBeVisible();
  await expect(page.locator('#rg1Title')).toContainText('Source Preflight');
  await page.locator('#rg1RunBtn').click();
  await page.waitForFunction(() => document.querySelector('#rg1RunBtn')?.textContent !== 'Running…');
  await expect(page.locator('#rg1Results tr')).toHaveCount(12);

  let governed = await page.evaluate(() => __sspTestHooks.collectData(false));
  expect(governed.reviewGateRuns).toHaveLength(1);
  expect(governed.reviewGateRuns[0].runKind).toBe('source-preflight');
  expect(governed.reviewGateRuns[0].itemResults).toHaveLength(12);
  expect(new Set(governed.reviewGateRuns[0].itemResults.map(item => item.itemId)).size).toBe(12);
  expect(governed.reviewGateRuns[0].sourceIdentity.fingerprint).toMatch(/^[0-9a-f]{64}$/);
  expect(governed.reviewGateConfiguration.items).toBeUndefined();
  expect(governed.reviewGateConfiguration.profiles).toBeUndefined();

  await page.selectOption('#rg1OutputProfile', 'governed-ssp-delivery');
  await page.locator('#rg1RunBtn').click();
  await page.waitForFunction(() => document.querySelector('#rg1RunBtn')?.textContent !== 'Running…');
  await expect(page.locator('tr[data-rg1-item="SSP-RG-META-004"]')).toContainText(/fail/i);
  await page.locator('#rg1TargetDate').fill('2026-08-15');
  await page.locator('#rg1RunBtn').click();
  await page.waitForFunction(() => document.querySelector('#rg1RunBtn')?.textContent !== 'Running…');
  await expect(page.locator('tr[data-rg1-item="SSP-RG-META-004"]')).toContainText(/pass/i);

  const priorFingerprint = await page.locator('#rg1Fingerprint').innerText();
  await page.locator('[data-close-rg1]').last().click();
  await page.evaluate(() => {
    const field = document.querySelector('[data-token="SYSTEM_NAME"]');
    field.textContent = 'Synthetic Changed System';
    field.dispatchEvent(new InputEvent('input', { bubbles: true }));
  });
  await page.evaluate(() => __sspRg1TestHooks.rg1OpenModal());
  await page.waitForFunction(() => document.querySelector('#rg1StaleState')?.textContent.includes('Stale'));
  expect(await page.locator('#rg1Fingerprint').innerText()).not.toBe(priorFingerprint);

  const link = page.locator('#rg1Results .rg1-record-link').first();
  if (await link.count()) {
    await link.click();
    await expect(page.locator('#rg1Modal')).toBeHidden();
    await expect(page.locator('#uxReturnBar')).toBeVisible();
    await page.locator('#uxReturnBtn').click();
    await expect(page.locator('#rg1Modal')).toBeVisible();
  }

  await page.locator('[data-close-rg1]').last().click();
  const portfolio = await page.evaluate(() => {
    const data = __sspTestHooks.collectData(true);
    const state = __sspTestHooks.portfolioCreateModularState('Synthetic RG-1 Portfolio');
    const top = state.portfolio.topLevelModuleId;
    const add = (moduleId, name, shortName, moduleType) => ({
      moduleId, name, shortName, moduleType, parentModuleId: top, status: 'draft', version: '1.0',
      description: 'Synthetic module.', boundaryStatement: 'Synthetic boundary.',
      subscriptionIdentifiers: [], services: [], applications: [], dataTypes: [], identitySources: [],
      interconnections: [], responsibleOrganizations: [], owners: ['Synthetic Owner'],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    });
    state.modules.push(add('module-alpha', 'Alpha', 'ALPHA', 'product'));
    state.modules.push(add('module-bravo', 'Bravo', 'BRAVO', 'product'));
    state.modules.push(add('module-shared', 'Shared', 'SHARED', 'shared-service'));
    state.moduleRequirements = __sspTestHooks.portfolioEnsureRequirementRecords(state.moduleRequirements, state.modules);
    data.portfolioFoundation = state;
    __sspTestHooks.applyData(data);
    return { modules: state.modules.length, records: state.moduleRequirements.length, moduleId: state.modules[1].moduleId };
  });
  expect(portfolio).toMatchObject({ modules: 4, records: 440 });

  await page.evaluate(() => __sspRg1TestHooks.rg1OpenModal());
  await page.selectOption('#rg1Scope', 'portfolio');
  const portfolioRun = await page.evaluate(() => __sspRg1TestHooks.rg1BuildRun());
  expect(portfolioRun.scope.kind).toBe('portfolio');
  expect(portfolioRun.itemResults).toHaveLength(12);
  await page.selectOption('#rg1Scope', 'module');
  await page.selectOption('#rg1Module', portfolio.moduleId);
  const moduleRun = await page.evaluate(() => __sspRg1TestHooks.rg1BuildRun());
  expect(moduleRun.scope).toMatchObject({ kind: 'module', moduleId: portfolio.moduleId });

  await page.locator('[data-close-rg1]').last().click();
  await page.locator('#exportMenu summary').click();
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#exportBtn').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('CMMC_L2_SSP_v1.9.8_Data_Backup.json');
  const backup = JSON.parse(await fs.readFile(await download.path(), 'utf8'));
  expect(backup.schemaVersion).toBe('1.9.8');
  expect(backup.appVersion).toBe('1.9.8');
  expect(backup.reviewGateConfiguration.profileId).toBe('generic-cmmc-ssp-review-v1');
  expect(backup.reviewGateConfiguration.items).toBeUndefined();
  expect(backup.reviewGateConfiguration.profiles).toBeUndefined();

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
  expect(externalRequests).toEqual([]);
});
