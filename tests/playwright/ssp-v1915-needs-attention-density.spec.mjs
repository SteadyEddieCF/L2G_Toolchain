import { test, expect } from '@playwright/test';

const path = '/modules/ssp/releases/v1.9.15/CMMC_L2_SSP_Modern_Editable_v1.9.15.html';

const captureErrors = (page) => {
  const pageErrors = [], consoleErrors = [], externalRequests = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('request', request => {
    const url = request.url();
    if (/^https?:/i.test(url) && !url.startsWith('http://127.0.0.1:4173/')) externalRequests.push(url);
  });
  return { pageErrors, consoleErrors, externalRequests };
};

async function openNeedsAttention(page) {
  await page.locator('#needsAttentionBtn').click();
  await expect(page.locator('#ux3NeedsAttentionModal')).toBeVisible();
  await expect(page.locator('#ux3ToolsToggle')).toBeVisible();
}

test('SSP v1.9.15 gives laptop-height Needs Attention work area priority', async ({ page }, testInfo) => {
  const errors = captureErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/v1\.9\.15/i);
  await expect(page.locator('.control-card')).toHaveCount(110);
  await page.evaluate(() => document.body.classList.add('dark'));
  await openNeedsAttention(page);

  await expect(page.locator('#ux3ToolsToggle')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#ux3ToolsPanel')).toBeHidden();
  await expect(page.locator('#ux3ToolsToggle')).toContainText(/2 visible/i);
  await expect(page.locator('#ux3ToolsToggle')).toContainText(/1 high/i);

  const collapsed = await page.evaluate(() => ({
    headerHeight: document.querySelector('.ux3-header').getBoundingClientRect().height,
    bodyHeight: document.querySelector('.ux3-body').getBoundingClientRect().height,
    cardHeight: document.querySelector('.ux3-card').getBoundingClientRect().height,
    paragraphWhiteSpace: getComputedStyle(document.querySelector('.ux3-header p')).whiteSpace,
    contentScrollbarWidth: getComputedStyle(document.querySelector('.ux3-content')).scrollbarWidth,
    release: window.__sspRg1TestHooks?.RELEASE_VERSION,
    app: window.__sspRg1TestHooks?.APP_VERSION,
    schema: window.__sspRg1TestHooks?.SCHEMA
  }));
  expect(collapsed.headerHeight).toBeLessThanOrEqual(60);
  expect(collapsed.bodyHeight).toBeGreaterThanOrEqual(780);
  expect(collapsed.paragraphWhiteSpace).toBe('nowrap');
  expect(collapsed.contentScrollbarWidth).toBe('none');
  expect(collapsed).toMatchObject({ release: '1.9.15', app: '1.9.15', schema: 'cmmc-l2-ssp-modern-v1.9.11' });
  await page.screenshot({ path: testInfo.outputPath('ssp-v1915-needs-attention-collapsed-dark.png'), fullPage: false });

  await page.locator('#ux3ToolsToggle').click();
  await expect(page.locator('#ux3ToolsToggle')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#ux3ToolsPanel')).toBeVisible();
  const expanded = await page.evaluate(() => ({
    panelHeight: document.querySelector('#ux3ToolsPanel').getBoundingClientRect().height,
    filterTops: [...document.querySelectorAll('.ux3-controls label')].map(el => Math.round(el.getBoundingClientRect().top)),
    statHeights: [...document.querySelectorAll('.ux3-stat')].map(el => el.getBoundingClientRect().height),
    controlsOverflow: document.querySelector('.ux3-controls').scrollWidth - document.querySelector('.ux3-controls').clientWidth
  }));
  expect(expanded.panelHeight).toBeLessThanOrEqual(145);
  expect(new Set(expanded.filterTops).size).toBe(1);
  expect(Math.max(...expanded.statHeights)).toBeLessThanOrEqual(36);
  expect(expanded.controlsOverflow).toBeLessThanOrEqual(1);

  await page.locator('#ux3SearchFilter').fill('profile v0.2');
  await expect(page.locator('#ux3List .ux3-item')).toHaveCount(1);
  await page.locator('#ux3SearchFilter').fill('');
  await expect(page.locator('#ux3List .ux3-item')).toHaveCount(2);

  await page.locator('.ux3-header [data-close-ux3]').click();
  await openNeedsAttention(page);
  await expect(page.locator('#ux3ToolsToggle')).toHaveAttribute('aria-expanded', 'true');
  await testInfo.attach('ssp-v1915-laptop-evidence.json', { body: Buffer.from(JSON.stringify({ collapsed, expanded }, null, 2)), contentType: 'application/json' });
  expect(errors.externalRequests).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
  expect(errors.consoleErrors).toEqual([]);
});

test('SSP v1.9.15 expands on tall desktops and retains a manual session collapse', async ({ page }, testInfo) => {
  const errors = captureErrors(page);
  await page.setViewportSize({ width: 1668, height: 1030 });
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.body.classList.add('dark'));
  await openNeedsAttention(page);
  await expect(page.locator('#ux3ToolsToggle')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#ux3ToolsPanel')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('ssp-v1915-needs-attention-expanded-dark.png'), fullPage: false });
  await page.locator('#ux3ToolsToggle').click();
  await expect(page.locator('#ux3ToolsToggle')).toHaveAttribute('aria-expanded', 'false');
  await page.locator('.ux3-header [data-close-ux3]').click();
  await openNeedsAttention(page);
  await expect(page.locator('#ux3ToolsToggle')).toHaveAttribute('aria-expanded', 'false');
  const stored = await page.evaluate(() => sessionStorage.getItem(window.__sspUx3TestHooks.UX3_TOOLS_SESSION_KEY));
  expect(stored).toBe('collapsed');
  expect(errors.externalRequests).toEqual([]);
  expect(errors.pageErrors).toEqual([]);
  expect(errors.consoleErrors).toEqual([]);
});
