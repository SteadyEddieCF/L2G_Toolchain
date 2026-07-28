import { test, expect } from '@playwright/test';

const path = '/modules/ssp/releases/v1.9.13/CMMC_L2_SSP_Modern_Editable_v1.9.13.html';
const viewports = [
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1536, height: 864 },
  { width: 1668, height: 1030 },
  { width: 1920, height: 1080 }
];

const color = (value) => {
  const normalized = (value || '').trim().toLowerCase();
  const hex = normalized.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const raw = hex[1];
    return `rgb(${parseInt(raw.slice(0, 2), 16)},${parseInt(raw.slice(2, 4), 16)},${parseInt(raw.slice(4, 6), 16)})`;
  }
  const shortHex = normalized.match(/^#([0-9a-f]{3})$/i);
  if (shortHex) {
    const raw = shortHex[1].split('').map((digit) => digit + digit).join('');
    return `rgb(${parseInt(raw.slice(0, 2), 16)},${parseInt(raw.slice(2, 4), 16)},${parseInt(raw.slice(4, 6), 16)})`;
  }
  return normalized.replace(/\s+/g, '');
};

test('SSP v1.9.13 fixes dark workspaces and aligns compact chrome without governed changes', async ({ page }, testInfo) => {
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
  await expect(page).toHaveTitle(/v1\.9\.13/i);
  await expect(page.locator('.control-card')).toHaveCount(110);
  await expect(page.locator('#reviewWorkspaceBtn')).toBeVisible();
  await expect(page.locator('#needsAttentionBtn')).toBeVisible();

  await page.evaluate(() => {
    document.body.classList.add('dark');
    const save = document.getElementById('stateBrowserSave');
    save.textContent = 'Autosave storage full · create backup';
    save.className = 'is-error';
  });

  const viewportEvidence = [];
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(100);
    const metrics = await page.evaluate(() => {
      const heights = (selectors) => selectors.flatMap((selector) => [...document.querySelectorAll(selector)])
        .filter((element) => !element.hidden && getComputedStyle(element).display !== 'none')
        .map((element) => ({ id: element.id || element.textContent.trim().slice(0, 30), height: element.getBoundingClientRect().height }));
      const primary = heights(['#sidebarToggle', '#deliverBtn', '.toolbar-menu > summary', '.view-switch']);
      const state = heights(['#reviewWorkspaceBtn', '#needsAttentionBtn', '#documentStateBtn', '.toolbar-objective-nav']);
      const save = document.getElementById('stateBrowserSave');
      const documentTop = document.querySelector('.document')?.getBoundingClientRect().top ?? document.querySelector('.document-wrap')?.getBoundingClientRect().top;
      return {
        primary,
        state,
        saveText: save.textContent,
        saveClientWidth: save.clientWidth,
        saveScrollWidth: save.scrollWidth,
        documentTop
      };
    });
    const spread = (items) => Math.max(...items.map(({ height }) => height)) - Math.min(...items.map(({ height }) => height));
    expect(metrics.primary.length).toBeGreaterThan(2);
    expect(metrics.state.length).toBe(4);
    expect(spread(metrics.primary)).toBeLessThanOrEqual(1);
    expect(spread(metrics.state)).toBeLessThanOrEqual(1);
    expect(metrics.saveText).toBe('Autosave storage full · create backup');
    expect(metrics.saveScrollWidth).toBeLessThanOrEqual(metrics.saveClientWidth + 1);
    expect(metrics.documentTop).toBeLessThanOrEqual(viewport.height <= 768 ? 225 : 230);
    viewportEvidence.push({ viewport, ...metrics });
  }

  await page.setViewportSize({ width: 1668, height: 1030 });
  await page.locator('#reviewWorkspaceBtn').click();
  await expect(page.locator('#rg2Modal')).toBeVisible();
  const reviewTheme = await page.evaluate(() => {
    const card = document.querySelector('.rg2-card');
    const header = document.querySelector('.rg2-header');
    const control = document.querySelector('.rg2-card input, .rg2-card select, .rg2-card textarea');
    const button = document.querySelector('.rg2-card button:not(.rg2-backdrop)');
    const body = getComputedStyle(document.body);
    return {
      cardBackground: getComputedStyle(card).backgroundColor,
      cardColor: getComputedStyle(card).color,
      headerBackground: getComputedStyle(header).backgroundColor,
      controlBackground: control ? getComputedStyle(control).backgroundColor : '',
      controlColor: control ? getComputedStyle(control).color : '',
      buttonBackground: button ? getComputedStyle(button).backgroundColor : '',
      paper: body.getPropertyValue('--paper').trim(),
      panel: body.getPropertyValue('--panel').trim(),
      ink: body.getPropertyValue('--ink').trim()
    };
  });
  expect(color(reviewTheme.cardBackground)).not.toBe('rgb(255,255,255)');
  expect(color(reviewTheme.cardBackground)).toBe(color(reviewTheme.paper));
  expect(color(reviewTheme.headerBackground)).toBe(color(reviewTheme.panel));
  expect(color(reviewTheme.cardColor)).toBe(color(reviewTheme.ink));
  expect(color(reviewTheme.controlBackground)).not.toBe('rgb(255,255,255)');
  await page.screenshot({ path: testInfo.outputPath('ssp-v1913-review-dark.png'), fullPage: false });
  await page.locator('[data-close-rg2]').last().click();
  await expect(page.locator('#rg2Modal')).toBeHidden();

  await page.locator('#needsAttentionBtn').click();
  await expect(page.locator('#ux3NeedsAttentionModal')).toBeVisible();
  const attentionTheme = await page.evaluate(() => {
    const card = document.querySelector('.ux3-card');
    const header = document.querySelector('.ux3-header');
    const control = document.querySelector('.ux3-card input, .ux3-card select, .ux3-card textarea');
    const button = document.querySelector('.ux3-card button:not(.ux3-backdrop)');
    const body = getComputedStyle(document.body);
    return {
      cardBackground: getComputedStyle(card).backgroundColor,
      cardColor: getComputedStyle(card).color,
      headerBackground: getComputedStyle(header).backgroundColor,
      controlBackground: control ? getComputedStyle(control).backgroundColor : '',
      controlColor: control ? getComputedStyle(control).color : '',
      buttonBackground: button ? getComputedStyle(button).backgroundColor : '',
      paper: body.getPropertyValue('--paper').trim(),
      panel: body.getPropertyValue('--panel').trim(),
      ink: body.getPropertyValue('--ink').trim()
    };
  });
  expect(color(attentionTheme.cardBackground)).not.toBe('rgb(255,255,255)');
  expect(color(attentionTheme.cardBackground)).toBe(color(attentionTheme.paper));
  expect(color(attentionTheme.headerBackground)).toBe(color(attentionTheme.panel));
  expect(color(attentionTheme.cardColor)).toBe(color(attentionTheme.ink));
  expect(color(attentionTheme.controlBackground)).not.toBe('rgb(255,255,255)');
  await page.screenshot({ path: testInfo.outputPath('ssp-v1913-needs-attention-dark.png'), fullPage: false });
  await page.locator('[data-close-ux3]').last().click();
  await expect(page.locator('#ux3NeedsAttentionModal')).toBeHidden();

  const identity = await page.evaluate(() => ({
    release: window.__sspRg1TestHooks?.RELEASE_VERSION,
    app: window.__sspRg1TestHooks?.APP_VERSION,
    schema: window.__sspRg1TestHooks?.SCHEMA,
    controls: document.querySelectorAll('.control-card').length,
    profileVersion: window.__sspRg1TestHooks?.RG1_PROFILE_VERSION
  }));
  expect(identity).toMatchObject({ release: '1.9.13', app: '1.9.13', schema: 'cmmc-l2-ssp-modern-v1.9.11', controls: 110 });
  expect(identity.profileVersion).toBe('0.1');

  await testInfo.attach('ssp-v1913-dark-toolbar-evidence.json', {
    body: Buffer.from(JSON.stringify({ viewportEvidence, reviewTheme, attentionTheme, identity }, null, 2)),
    contentType: 'application/json'
  });

  expect(externalRequests, `Unexpected network requests: ${externalRequests.join(', ')}`).toEqual([]);
  expect(pageErrors, `Unhandled page errors: ${pageErrors.join('\n')}`).toEqual([]);
  expect(consoleErrors, `Console errors: ${consoleErrors.join('\n')}`).toEqual([]);
});
