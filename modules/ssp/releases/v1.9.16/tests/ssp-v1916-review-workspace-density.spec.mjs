import { test, expect } from '@playwright/test';

const path = '/modules/ssp/releases/v1.9.16/CMMC_L2_SSP_Modern_Editable_v1.9.16.html';
const captureErrors = (page) => {
  const pageErrors = [], consoleErrors = [], externalRequests = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('request', request => { const url=request.url(); if (/^https?:/i.test(url) && !url.startsWith('http://127.0.0.1:4173/')) externalRequests.push(url); });
  return { pageErrors, consoleErrors, externalRequests };
};
async function openReview(page) {
  await page.locator('#reviewWorkspaceBtn').click();
  await expect(page.locator('#rg2Modal')).toBeVisible();
  await expect(page.getByRole('button', { name: /Review setup & summary|Hide Review setup & summary/i })).toBeVisible();
  await expect(page.locator('#rg2SummaryStrip')).toBeVisible();
}
const stripSavedAt = value => { const copy=structuredClone(value); delete copy.savedAt; return copy; };

for (const viewport of [{width:1366,height:768},{width:1440,height:900},{width:1536,height:864}]) {
  test(`SSP v1.9.16 defaults Review setup collapsed at ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
    const errors=captureErrors(page); await page.setViewportSize(viewport); await page.goto(path,{waitUntil:'domcontentloaded'});
    await expect(page.locator('.control-card')).toHaveCount(110); await openReview(page);
    const toggle=page.locator('#rg2SetupToggle'); await expect(toggle).toHaveAttribute('aria-expanded','false'); await expect(page.locator('#rg2SetupPanel')).toBeHidden();
    const summary=await page.locator('#rg2SummaryStrip').innerText(); expect(summary).toMatch(/Profile/i); expect(summary).toMatch(/0\.1/); expect(summary).toMatch(/Single-System/i); expect(summary).toMatch(/Source only/i); expect(summary).toMatch(/v0\.2 available/i); expect(summary).toMatch(/complete/i);
    const governedBefore=stripSavedAt(await page.evaluate(()=>window.__sspTestHooks.collectData(false)));
    await toggle.click(); await expect(toggle).toHaveAttribute('aria-expanded','true'); await expect(page.locator('#rg2SetupPanel')).toBeVisible();
    await toggle.click(); const governedAfter=stripSavedAt(await page.evaluate(()=>window.__sspTestHooks.collectData(false))); expect(governedAfter).toEqual(governedBefore);
    const metrics=await page.evaluate(()=>({header:document.querySelector('.rg2-header').getBoundingClientRect().height,summary:document.querySelector('#rg2SummaryStrip').getBoundingClientRect().height,body:document.querySelector('.rg2-body').getBoundingClientRect().height,railScrollbar:getComputedStyle(document.querySelector('.rg2-rail')).scrollbarWidth,mainScrollbar:getComputedStyle(document.querySelector('.rg2-main')).scrollbarWidth,release:window.__sspRg1TestHooks.RELEASE_VERSION,app:window.__sspRg1TestHooks.APP_VERSION,schema:window.__sspRg1TestHooks.SCHEMA}));
    expect(metrics.header).toBeLessThanOrEqual(80); expect(metrics.summary).toBeLessThanOrEqual(80); expect(metrics.body).toBeGreaterThanOrEqual(viewport.height-220); expect(metrics.railScrollbar).toBe('none'); expect(metrics.mainScrollbar).toBe('none'); expect(metrics).toMatchObject({release:'1.9.16',app:'1.9.16',schema:'cmmc-l2-ssp-modern-v1.9.11'});
    const stageButtons=page.locator('[data-rg2-stage]'); await expect(stageButtons).toHaveCount(6); await stageButtons.nth(1).click(); await expect(stageButtons.nth(1)).toHaveAttribute('aria-current','step'); await expect(page.locator('#rg2Main')).toContainText(/Local SME Technical Review/i);
    await expect(page.locator('#rg2ExportBtn')).toBeVisible();
    await page.screenshot({path:testInfo.outputPath(`ssp-v1916-review-collapsed-${viewport.width}x${viewport.height}.png`),fullPage:false});
    expect(errors.externalRequests).toEqual([]); expect(errors.pageErrors).toEqual([]); expect(errors.consoleErrors).toEqual([]);
  });
}

for (const viewport of [{width:1668,height:1030},{width:1920,height:1080}]) {
  test(`SSP v1.9.16 defaults Review setup expanded at ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
    const errors=captureErrors(page); await page.setViewportSize(viewport); await page.goto(path,{waitUntil:'domcontentloaded'}); await openReview(page);
    await expect(page.locator('#rg2SetupToggle')).toHaveAttribute('aria-expanded','true'); await expect(page.locator('#rg2SetupPanel')).toBeVisible();
    await expect(page.locator('#rg2AdoptBtn')).toBeVisible(); await expect(page.locator('#rg2Config')).toBeVisible();
    const expanded=await page.evaluate(()=>({panelHeight:document.querySelector('#rg2SetupPanel').getBoundingClientRect().height,bodyHeight:document.querySelector('.rg2-body').getBoundingClientRect().height,scrollbar:getComputedStyle(document.querySelector('#rg2SetupPanel')).scrollbarWidth}));
    expect(expanded.panelHeight).toBeLessThanOrEqual(430); expect(expanded.bodyHeight).toBeGreaterThan(400); expect(expanded.scrollbar).toBe('none');
    await page.screenshot({path:testInfo.outputPath(`ssp-v1916-review-expanded-${viewport.width}x${viewport.height}.png`),fullPage:false});
    await page.locator('#rg2SetupToggle').click(); await expect(page.locator('#rg2SetupToggle')).toHaveAttribute('aria-expanded','false');
    await page.locator('.rg2-header [data-close-rg2]').click(); await expect(page.locator('#reviewWorkspaceBtn')).toBeFocused(); await openReview(page); await expect(page.locator('#rg2SetupToggle')).toHaveAttribute('aria-expanded','false');
    const stored=await page.evaluate(()=>sessionStorage.getItem(window.__sspRg1TestHooks.RG2_SETUP_SESSION_KEY)); expect(stored).toBe('collapsed');
    await page.setViewportSize({width:1920,height:1200}); await expect(page.locator('#rg2SetupToggle')).toHaveAttribute('aria-expanded','false');
    expect(errors.externalRequests).toEqual([]); expect(errors.pageErrors).toEqual([]); expect(errors.consoleErrors).toEqual([]);
  });
}

test('SSP v1.9.16 preserves explicit adoption, keyboard focus, themes, print suppression, and scrolling', async ({ page }) => {
  const errors=captureErrors(page); await page.setViewportSize({width:1440,height:900}); await page.goto(path,{waitUntil:'domcontentloaded'}); await page.evaluate(()=>document.body.classList.add('dark')); await openReview(page);
  await expect(page.locator('#rg2SetupPanel')).toBeHidden(); await page.locator('#rg2SetupToggle').click(); await expect(page.locator('#rg2AdoptBtn')).toBeVisible();
  const before=await page.evaluate(()=>window.__sspTestHooks.collectData(false).reviewGateConfiguration.profileVersion); expect(before).toBe('0.1');
  await page.locator('#rg2AdoptBtn').click(); await expect(page.locator('#actionModal')).toBeVisible(); await expect(page.locator('#actionModal')).toContainText(/Adopt review profile v0\.2/i); await page.locator('#actionCancelBtn').click();
  expect(await page.evaluate(()=>window.__sspTestHooks.collectData(false).reviewGateConfiguration.profileVersion)).toBe('0.1');
  await page.locator('#rg2AdoptBtn').click(); await page.locator('#actionConfirmBtn').click(); await expect(page.locator('#rg2SummaryStrip')).toContainText(/v0\.2 active/i); expect(await page.evaluate(()=>window.__sspTestHooks.collectData(false).reviewGateConfiguration.profileVersion)).toBe('0.2');
  const railScroll=await page.evaluate(()=>{const rail=document.querySelector('.rg2-rail');rail.scrollTop=rail.scrollHeight;return {top:rail.scrollTop,max:rail.scrollHeight-rail.clientHeight};}); if(railScroll.max>0) expect(railScroll.top).toBeGreaterThan(0);
  await page.emulateMedia({media:'print'}); await expect(page.locator('#rg2Modal')).toBeHidden(); await page.emulateMedia({media:'screen'}); await expect(page.locator('#rg2Modal')).toBeVisible();
  await page.keyboard.press('Escape'); await expect(page.locator('#rg2Modal')).toBeHidden(); await expect(page.locator('#reviewWorkspaceBtn')).toBeFocused();
  await page.evaluate(()=>document.body.classList.remove('dark')); await openReview(page); await expect(page.locator('#rg2Modal')).toBeVisible();
  expect(errors.externalRequests).toEqual([]); expect(errors.pageErrors).toEqual([]); expect(errors.consoleErrors).toEqual([]);
});
