import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { artifactUrl } from './integrated-suite-foundation-helpers.mjs';

test.beforeEach(async ({ page }) => {
  await page.goto(artifactUrl);
  await expect(page.getByTestId('app-shell')).toBeVisible();
});

test('passes axe-core on the primary Advisor and Client surfaces', async ({ page }) => {
  let results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(item => ['critical', 'serious'].includes(item.impact ?? ''))).toEqual([]);
  await page.locator('[data-workspace="pre-engagement"]').click();
  await page.locator('#profile-select').selectOption('client');
  results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(item => ['critical', 'serious'].includes(item.impact ?? ''))).toEqual([]);
});

test('maintains light and dark visual contracts', async ({ browser }, testInfo) => {
  for (const colorScheme of ['light', 'dark']) {
    const context = await browser.newContext({ colorScheme, viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();
    await page.goto(artifactUrl);
    await expect(page.getByTestId('app-shell')).toBeVisible();
    const visual = await page.evaluate(() => {
      const shell = document.querySelector('.app-shell');
      const top = document.querySelector('.top-bar');
      const rail = document.querySelector('.nav-rail');
      if (!(shell instanceof HTMLElement) || !(top instanceof HTMLElement) || !(rail instanceof HTMLElement)) throw new Error('Visual regions missing');
      return {
        background: getComputedStyle(shell).backgroundColor,
        color: getComputedStyle(shell).color,
        topHeight: Math.round(top.getBoundingClientRect().height),
        railWidth: Math.round(rail.getBoundingClientRect().width)
      };
    });
    expect(visual.background).not.toBe('rgba(0, 0, 0, 0)');
    expect(visual.color).not.toBe(visual.background);
    expect(visual.topHeight).toBeGreaterThanOrEqual(50);
    expect(visual.railWidth).toBeGreaterThanOrEqual(230);
    await page.screenshot({ path: testInfo.outputPath(`integrated-foundation-${colorScheme}.png`), fullPage: true });
    await context.close();
  }
});
