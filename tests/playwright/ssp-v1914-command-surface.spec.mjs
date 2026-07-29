import { test, expect } from '@playwright/test';

const path = '/modules/ssp/releases/v1.9.14/CMMC_L2_SSP_Modern_Editable_v1.9.14.html';
const viewports = [
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1536, height: 864 },
  { width: 1668, height: 1030 },
  { width: 1920, height: 1080 }
];

test('SSP v1.9.14 consolidates command surfaces and modal chrome without governed changes', async ({ page }, testInfo) => {
  const pageErrors = [];
  const consoleErrors = [];
  const externalRequests = [];
  page.on('pageerror', (error) => pageErrors.push(String(error)));
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('request', (request) => {
    const url = request.url();
    if (/^https?:/i.test(url) && !url.startsWith('http://127.0.0.1:4173/')) externalRequests.push(url);
  });

  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/v1\.9\.14/i);
  await expect(page.locator('.control-card')).toHaveCount(110);
  await expect(page.locator('#deliverBtn')).toBeHidden();
  await expect(page.locator('#undoBtn')).toBeVisible();
  await expect(page.locator('#redoBtn')).toBeVisible();
  await expect(page.locator('#importMenu summary')).toBeVisible();
  await expect(page.locator('#exportMenu summary')).toBeVisible();
  await expect(page.locator('#importMenu summary')).toHaveAccessibleName('Open import options');
  await expect(page.locator('#exportMenu summary')).toHaveAccessibleName('Open export options');
  await expect(page.locator('#moreMenu #importHubPanel')).toHaveCount(0);
  await expect(page.locator('#moreMenu #undoMenuBtn, #moreMenu #redoMenuBtn')).toHaveCount(0);
  await expect(page.locator('button', { hasText: /^Close(?: preview| detail)?$/ })).toHaveCount(0);
  await expect(page.locator('.modal-close-icon')).toHaveCount(14);

  const viewportEvidence = [];
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(80);
    const metrics = await page.evaluate(() => {
      const summary = document.querySelector('#documentStateSummary');
      const commandIds = ['undoBtn', 'redoBtn', 'importMenu', 'moreMenu', 'exportMenu', 'printBtn'];
      const commands = commandIds.map((id) => {
        const element = document.getElementById(id);
        const rect = element?.getBoundingClientRect();
        const style = element ? getComputedStyle(element) : null;
        return { id, display: style?.display, visibility: style?.visibility, rect: rect?.toJSON() };
      });
      const visibleCommands = commands.filter(({ display, visibility, rect }) => display !== 'none' && visibility !== 'hidden' && rect?.width > 0);
      return {
        summary: summary.getBoundingClientRect().toJSON(),
        commands,
        visibleCommands,
        documentScrollWidth: document.documentElement.scrollWidth,
        documentClientWidth: document.documentElement.clientWidth,
        importSummary: document.querySelector('#importMenu summary').getBoundingClientRect().toJSON(),
        exportSummary: document.querySelector('#exportMenu summary').getBoundingClientRect().toJSON()
      };
    });
    const byId = Object.fromEntries(metrics.commands.map((entry) => [entry.id, entry]));
    expect(byId.undoBtn.display).not.toBe('none');
    expect(byId.redoBtn.display).not.toBe('none');
    expect(byId.importMenu.display).not.toBe('none');
    expect(byId.exportMenu.display).not.toBe('none');
    expect(metrics.importSummary.width).toBeCloseTo(42, 0);
    expect(metrics.exportSummary.width).toBeCloseTo(42, 0);
    const rightmost = Math.max(...metrics.visibleCommands.map(({ rect }) => rect.right));
    expect(viewport.width - rightmost).toBeLessThanOrEqual(12);
    expect(metrics.documentScrollWidth).toBe(metrics.documentClientWidth);
    expect(metrics.summary.top).toBeLessThanOrEqual(64);
    viewportEvidence.push({ viewport, ...metrics });
  }

  await page.setViewportSize({ width: 1668, height: 1030 });
  await page.locator('#moreMenu summary').click();
  await page.locator('#importMenu summary').click();
  await expect(page.locator('#importMenu')).toHaveJSProperty('open', true);
  await expect(page.locator('#moreMenu')).toHaveJSProperty('open', false);
  await expect(page.locator('#importHubPanel')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#importMenu')).toHaveJSProperty('open', false);

  await page.locator('#exportMenu summary').click();
  await expect(page.locator('#deliverMenuBtn')).toBeVisible();
  await expect(page.locator('#exportMenu .menu-section button').first()).toHaveAttribute('id', 'deliverMenuBtn');
  await page.locator('#deliverMenuBtn').click();
  await expect(page.locator('#deliverModal')).toBeVisible();
  const deliverMetrics = await page.evaluate(() => {
    const header = document.querySelector('.deliver-card>header');
    const body = document.querySelector('.deliver-body');
    const close = document.querySelector('.deliver-card>header .modal-close-icon');
    return {
      header: header.getBoundingClientRect().toJSON(),
      bodyClientHeight: body.clientHeight,
      bodyScrollHeight: body.scrollHeight,
      bodyScrollbarWidth: getComputedStyle(body).scrollbarWidth,
      close: close.getBoundingClientRect().toJSON(),
      closeText: close.textContent.trim(),
      closeLabel: close.getAttribute('aria-label')
    };
  });
  expect(deliverMetrics.header.height).toBeLessThanOrEqual(100);
  expect(deliverMetrics.bodyScrollHeight).toBeLessThanOrEqual(deliverMetrics.bodyClientHeight + 1);
  expect(deliverMetrics.bodyScrollbarWidth).toBe('none');
  expect(deliverMetrics.close.width).toBeCloseTo(36, 0);
  expect(deliverMetrics.close.height).toBeCloseTo(36, 0);
  expect(deliverMetrics.closeText).toBe('×');
  expect(deliverMetrics.closeLabel).toMatch(/Close Deliver/i);
  await page.screenshot({ path: testInfo.outputPath('ssp-v1914-deliver-dark.png'), fullPage: false });
  await page.keyboard.press('Escape');

  await page.locator('#documentStateBtn').click();
  await expect(page.locator('#documentStateDialog')).toBeVisible();
  const stateMetrics = await page.evaluate(() => {
    const header = document.querySelector('.state-dialog-card>header');
    const body = document.querySelector('.state-dialog-body');
    return {
      header: header.getBoundingClientRect().toJSON(),
      bodyClientHeight: body.clientHeight,
      bodyScrollHeight: body.scrollHeight,
      bodyScrollbarWidth: getComputedStyle(body).scrollbarWidth,
      details: document.querySelector('#documentStateDetailGrid').textContent
    };
  });
  expect(stateMetrics.header.height).toBeLessThanOrEqual(100);
  expect(stateMetrics.bodyScrollHeight).toBeLessThanOrEqual(stateMetrics.bodyClientHeight + 1);
  expect(stateMetrics.bodyScrollbarWidth).toBe('none');
  expect(stateMetrics.details).toContain('Runtime v1.9.14');
  expect(stateMetrics.details).toContain('Working-data schema 1.9.11');
  await page.screenshot({ path: testInfo.outputPath('ssp-v1914-state-details-dark.png'), fullPage: false });
  await page.keyboard.press('Escape');

  await page.locator('#reviewWorkspaceBtn').click();
  await expect(page.locator('#rg2Modal')).toBeVisible();
  const reviewMetrics = await page.evaluate(() => ({
    headerHeight: document.querySelector('.rg2-header').getBoundingClientRect().height,
    railScrollbarWidth: getComputedStyle(document.querySelector('.rg2-rail')).scrollbarWidth,
    mainScrollbarWidth: getComputedStyle(document.querySelector('.rg2-main')).scrollbarWidth
  }));
  expect(reviewMetrics.headerHeight).toBeLessThanOrEqual(100);
  expect(reviewMetrics.railScrollbarWidth).toBe('none');
  expect(reviewMetrics.mainScrollbarWidth).toBe('none');
  await page.screenshot({ path: testInfo.outputPath('ssp-v1914-review-dark.png'), fullPage: false });
  await page.keyboard.press('Escape');

  await page.locator('#needsAttentionBtn').click();
  await expect(page.locator('#ux3NeedsAttentionModal')).toBeVisible();
  const attentionMetrics = await page.evaluate(() => ({
    headerHeight: document.querySelector('.ux3-header').getBoundingClientRect().height,
    summaryScrollbarWidth: getComputedStyle(document.querySelector('.ux3-summary')).scrollbarWidth,
    contentScrollbarWidth: getComputedStyle(document.querySelector('.ux3-content')).scrollbarWidth
  }));
  expect(attentionMetrics.headerHeight).toBeLessThanOrEqual(115);
  expect(attentionMetrics.summaryScrollbarWidth).toBe('none');
  expect(attentionMetrics.contentScrollbarWidth).toBe('none');
  await page.screenshot({ path: testInfo.outputPath('ssp-v1914-needs-attention-dark.png'), fullPage: false });
  await page.keyboard.press('Escape');

  const identity = await page.evaluate(() => ({
    release: window.__sspRg1TestHooks?.RELEASE_VERSION,
    app: window.__sspRg1TestHooks?.APP_VERSION,
    schema: window.__sspRg1TestHooks?.SCHEMA,
    controls: document.querySelectorAll('.control-card').length,
    profileVersion: window.__sspRg1TestHooks?.RG1_PROFILE_VERSION
  }));
  expect(identity).toMatchObject({ release: '1.9.14', app: '1.9.14', schema: 'cmmc-l2-ssp-modern-v1.9.11', controls: 110 });
  expect(identity.profileVersion).toBe('0.1');

  await testInfo.attach('ssp-v1914-command-surface-evidence.json', {
    body: Buffer.from(JSON.stringify({ viewportEvidence, deliverMetrics, stateMetrics, reviewMetrics, attentionMetrics, identity }, null, 2)),
    contentType: 'application/json'
  });

  expect(externalRequests, `Unexpected network requests: ${externalRequests.join(', ')}`).toEqual([]);
  expect(pageErrors, `Unhandled page errors: ${pageErrors.join('\n')}`).toEqual([]);
  expect(consoleErrors, `Console errors: ${consoleErrors.join('\n')}`).toEqual([]);
});
